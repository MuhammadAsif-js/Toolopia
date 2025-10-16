"use client";
import React, { useEffect, useState } from 'react';

interface ArticleContentProps {
  slug: string; // corresponds to markdown filename in /content/tools
}

// Enhanced markdown -> React (still intentionally limited & safe):
// Supports: headings (#..######), lists -, *, +, bold ** **, italics * * or _ _, inline code `code`, fenced code ```lang ...```,
// links [text](url), autolink raw http(s)://..., inline code inside paragraphs, h3 styling, blank lines.
// We avoid raw HTML; everything is plain text escaped by React.
export function parseMarkdownToReact(src: string): React.ReactNode[] {
  const lines = src.replace(/\r/g, '').split('\n');
  const nodes: React.ReactNode[] = [];
  let listBuffer: string[] = [];
  let inCodeBlock = false;
  let codeFenceLang = '';
  let codeBuffer: string[] = [];

  function flushList() {
    if (!listBuffer.length) return;
    nodes.push(
      <ul key={nodes.length} className="list-disc pl-5 space-y-1">
        {listBuffer.map((item, i) => <li key={i}>{inlineFormat(item, i) }</li>)}
      </ul>
    );
    listBuffer = [];
  }

  function flushCode() {
    if (!inCodeBlock) return;
    const codeContent = codeBuffer.join('\n');
    nodes.push(
      <pre key={nodes.length} className="mt-4 mb-4 rounded bg-gray-800/70 border border-gray-700 p-3 overflow-auto text-xs">
        <code className={codeFenceLang ? `language-${codeFenceLang}` : undefined}>{codeContent}</code>
      </pre>
    );
    inCodeBlock = false;
    codeFenceLang = '';
    codeBuffer = [];
  }

  function inlineFormat(text: string, keyBase: number): React.ReactNode[] {
    // Process bold, italics, inline code, links, autolinks sequentially.
    // Split by backticks first to isolate code spans.
    const segments = text.split(/(`[^`]+`)/);
    return segments.map((seg, i) => {
      const codeMatch = /^`([^`]+)`$/.exec(seg);
      if (codeMatch) return <code key={keyBase + '-code-' + i} className="px-1 py-0.5 rounded bg-gray-800 text-accent text-[0.8rem]">{codeMatch[1]}</code>;
      // Bold then italics then links.
      let parts: React.ReactNode[] = [];
      const linkPattern = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
      let lastIndex = 0;
      let m: RegExpExecArray | null;
      const pushPlain = (slice: string) => {
        if (!slice) return;
        // bold
        const boldSplit = slice.split(/(\*\*[^*]+\*\*)/);
        boldSplit.forEach((bSeg, bi) => {
          const boldMatch = /^\*\*([^*]+)\*\*$/.exec(bSeg);
          if (boldMatch) { parts.push(<strong key={keyBase + '-b-' + i + '-' + bi}>{boldMatch[1]}</strong>); return; }
          // italics
          const italSplit = bSeg.split(/(\*[^*]+\*|_[^_]+_)/);
          italSplit.forEach((itSeg, ii) => {
            const italMatch = /^(?:\*([^*]+)\*|_([^_]+)_)$/.exec(itSeg);
            if (italMatch) { parts.push(<em key={keyBase + '-i-' + i + '-' + bi + '-' + ii}>{italMatch[1] || italMatch[2]}</em>); return; }
            if (itSeg) parts.push(itSeg);
          });
        });
      };
      while ((m = linkPattern.exec(seg))) {
        const [full, textLabel, url] = m;
        pushPlain(seg.slice(lastIndex, m.index));
        parts.push(<a key={keyBase + '-lnk-' + i + '-' + m.index} href={url} target="_blank" rel="noopener noreferrer" className="text-accent underline-offset-2 underline">{textLabel}</a>);
        lastIndex = m.index + full.length;
      }
      pushPlain(seg.slice(lastIndex));
      // Auto-link raw URLs
      parts = parts.flatMap((p, pi) => {
        if (typeof p !== 'string') return [p];
        const auto: React.ReactNode[] = [];
        const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/g;
        let li = 0; let mm: RegExpExecArray | null;
        while ((mm = urlRegex.exec(p))) {
          if (mm.index > li) auto.push(p.slice(li, mm.index));
            const raw = mm[0];
            const href = raw.startsWith('http') ? raw : 'https://' + raw;
            auto.push(<a key={keyBase + '-auto-' + i + '-' + pi + '-' + mm.index} href={href} target="_blank" rel="noopener noreferrer" className="text-accent underline">{raw}</a>);
            li = mm.index + raw.length;
        }
        if (li < p.length) auto.push(p.slice(li));
        return auto;
      });
      return <React.Fragment key={keyBase + '-seg-' + i}>{parts}</React.Fragment>;
    });
  }

  lines.forEach((raw) => {
    // Fenced code start / end
    const fenceMatch = /^```([^`]*)\s*$/.exec(raw);
    if (fenceMatch) {
      if (inCodeBlock) {
        flushCode();
      } else {
        flushList();
        inCodeBlock = true;
        codeFenceLang = fenceMatch[1].trim();
      }
      return;
    }
    if (inCodeBlock) { codeBuffer.push(raw); return; }

    const line = raw.trimEnd();
    if (!line.trim()) { flushList(); nodes.push(<div key={nodes.length} className="h-2" />); return; }
    const headingMatch = /^(#{1,6})\s+(.*)$/.exec(line);
    if (headingMatch) {
      flushList();
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      const Tag = (`h${Math.min(level,6)}` as keyof JSX.IntrinsicElements);
      const cls = level <=2 ? 'font-semibold text-lg mt-6 first:mt-0' : level ===3 ? 'font-semibold mt-5 text-base' : 'font-semibold mt-4 text-sm';
      nodes.push(<Tag key={nodes.length} className={cls}>{text}</Tag>);
      return;
    }
    const listMatch = /^[-*+]\s+(.*)$/.exec(line);
    if (listMatch) { listBuffer.push(listMatch[1]); return; }
    // Paragraph
    flushList();
    nodes.push(<p key={nodes.length} className="leading-relaxed">{inlineFormat(line, nodes.length)}</p>);
  });
  flushList();
  flushCode();
  return nodes;
}

export const ArticleContent: React.FC<ArticleContentProps> = ({ slug }) => {
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    setContent(null); setError(null);
    fetch(`/content/tools/${slug}.md`).then(r => {
      if (!r.ok) throw new Error('Not found');
      return r.text();
    }).then(text => { if (active) setContent(text); }).catch(() => { if (active) setError('Article content not available.'); });
    return () => { active = false; };
  }, [slug]);

  if (error) return <p className="text-sm text-gray-500">{error}</p>;
  if (!content) return <p className="text-sm text-gray-500 animate-pulse">Loading article...</p>;
  return <div className="prose prose-invert max-w-none text-sm">{parseMarkdownToReact(content)}</div>;
};
