"use client";
import React from 'react';
import articleData from '../app/tools/image-compressor/article.json';

// Stubbed Article component: legacy JSON content removed
export function Article({ className }: { className?: string }) {
  // articleData can be any shape; we try to render common fields
  const title: string = (articleData as any)?.title ?? 'Article';
  const content: string | undefined = (articleData as any)?.content;
  const paragraphs: string[] | undefined = (articleData as any)?.paragraphs;

  return (
    <article className={className ?? ''}>
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      {content && <p className="text-muted-foreground mt-2">{content}</p>}
      {Array.isArray(paragraphs) && paragraphs.length > 0 && (
        <div className="mt-4 space-y-3 text-sm text-foreground">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}
    </article>
  );
}
