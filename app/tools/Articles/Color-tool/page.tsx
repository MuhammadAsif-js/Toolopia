"use client";

"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Head from "next/head";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Copy, Link as LinkIcon, Share2, Timer, Sparkles, ArrowRight } from "lucide-react";

/**
 * Drop this file into: /app/insights/seo-embedded-tools/page.tsx (App Router)
 * or pages/insights/seo-embedded-tools.tsx (Pages Router)
 * Tailwind + shadcn/ui + framer-motion required.
 */

function useReadingTime(text: string) {
  return useMemo(() => {
    const WORDS_PER_MIN = 220;
    const words = text.trim().split(/\s+/).length || 0;
    const minutes = Math.max(1, Math.round(words / WORDS_PER_MIN));
    return { minutes, words };
  }, [text]);
}

const content = {
  title: "SEO-Friendly Articles with Embedded Tools (Next.js + UX Animations)",
  description:
    "Learn how to rank your tools by embedding technical functionality inside beautiful, SEO-optimized articles—complete with Table of Contents, reading progress, and subtle animations.",
  hero: {
    eyebrow: "Playbook",
    headline: "Turn Tools into Top-Ranking Content",
    sub:
      "Google loves articles. Users love tools. Combine both: embed your tools inside rich, crawlable articles—delivering rankings, engagement, and conversions.",
  },
  sections: [
    {
      id: "why-this-works",
      heading: "Why This Strategy Works",
      bullets: [
        "Articles get indexed and ranked; tool-only pages often don’t.",
        "Tutorials, comparisons, and case studies capture long-tail search.",
        "Inline, interactive tool widgets supercharge on-page engagement.",
      ],
    },
    {
      id: "how-to-structure",
      heading: "How to Structure the Article",
      body:
        "Open with a clear promise, show the tool’s value, then guide readers through examples, edge cases, and FAQs. Anchor every functional component to a concrete use case.",
      bullets: [
        "Hero with benefit-oriented headline & CTA",
        "Sticky Table of Contents + reading progress",
        "Inline demos: calculators, converters, or preview widgets",
        "Code/technical breakdowns for developer audiences",
        "Schema markup + Open Graph for rich sharing",
      ],
    },
    {
      id: "embed-the-tool",
      heading: "Embed the Tool Inside the Article",
      body:
        "Import your tool’s component and mount it right next to the explanation. Keep it fast, accessible, and keyboard-friendly.",
    },
    {
      id: "seo-checklist",
      heading: "SEO Checklist",
      bullets: [
        "Compelling title tag (50–60 chars) & meta description (120–155)",
        "Semantic headings (H1→H2→H3) with target keywords",
        "Descriptive alt text for images & diagrams",
        "Internal links to related tutorials and categories",
        "Article schema (JSON-LD), OG & Twitter cards",
        "Fast LCP/CLS: optimize images, avoid layout shifts",
      ],
    },
    {
      id: "faqs",
      heading: "FAQs",
      body:
        "Answer intent-matched questions users actually search for. Mirror their phrasing. Keep answers concise, then link deeper.",
    },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: content.title,
  description: content.description,
  author: {
    "@type": "Person",
    name: "Editorial Team",
  },
  datePublished: "2025-09-03",
  dateModified: "2025-09-03",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://example.com/insights/seo-embedded-tools",
  },
  image: [
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
  ],
};

function ProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, mass: 0.2 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed left-0 top-0 z-50 h-1 w-full origin-left bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500"
    />
  );
}

function TOC({ sections }: { sections: { id: string; heading: string }[] }) {
  return (
    <nav className="sticky top-24 hidden h-max w-72 shrink-0 lg:block">
      <Card className="border-muted-foreground/10">
        <CardContent className="p-4">
          <p className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground">On this page</p>
          <ul className="space-y-2">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <LinkIcon className="h-4 w-4 opacity-60 group-hover:opacity-100" />
                  <span>{s.heading}</span>
                </a>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </nav>
  );
}

function Share() {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "https://example.com/insights/seo-embedded-tools";
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="secondary"
        className="rounded-2xl"
        onClick={() => {
          navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
      >
        {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}Copy link
      </Button>
      <Button asChild className="rounded-2xl">
        <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(content.title)}&url=${encodeURIComponent(url)}`} target="_blank" rel="noreferrer">
          <Share2 className="mr-2 h-4 w-4" />Share
        </a>
      </Button>
    </div>
  );
}

function Hero() {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollY } = useScroll({ target: targetRef });
  const y = useTransform(scrollY, [0, 200], [0, -40]);

  return (
    <section ref={targetRef} className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-b from-background to-muted p-8 pt-16 md:p-12">
      <motion.div style={{ y }} className="mx-auto max-w-3xl text-center">
        <Badge className="mb-4 inline-flex items-center gap-1 rounded-2xl px-3 py-1 text-xs"><Sparkles className="h-3 w-3"/> {content.hero.eyebrow}</Badge>
        <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-5xl">{content.hero.headline}</h1>
        <p className="mx-auto mb-6 max-w-2xl text-base text-muted-foreground md:text-lg">{content.hero.sub}</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button className="rounded-2xl" asChild>
            <a href="#embed-the-tool">
              Start Embedding <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
          <Button variant="outline" className="rounded-2xl" asChild>
            <a href="#seo-checklist">See SEO Checklist</a>
          </Button>
        </div>
      </motion.div>

      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gradient-to-tr from-indigo-500/20 to-sky-400/20 blur-3xl"
      />
    </section>
  );
}

function Section({ id, heading, children }: { id: string; heading: string; children?: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.4 }}
        className="mb-3 text-2xl font-semibold md:text-3xl"
      >
        {heading}
      </motion.h2>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="prose prose-neutral max-w-none dark:prose-invert"
      >
        {children}
      </motion.div>
    </section>
  );
}

function InlineDemo() {
  // Placeholder for your real tool component; swap with your import
  const [input, setInput] = useState("10 USD to PKR");
  const [output, setOutput] = useState<string | null>(null);
  const convert = () => {
    // Fake conversion for demo purposes
    const match = input.match(/(\d+(?:\.\d+)?)\s*USD\s*to\s*PKR/i);
    if (match) {
      const amount = Number(match[1]);
      const rate = 278; // replace with real rate
      setOutput(`${amount} USD ≈ ${Math.round(amount * rate)} PKR`);
    } else {
      setOutput("Try: 10 USD to PKR");
    }
  };
  useEffect(() => {
    setOutput(null);
  }, [input]);

  return (
    <Card className="border-muted-foreground/10">
      <CardContent className="p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a query like: 10 USD to PKR"
            className="w-full rounded-2xl border bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
          />
          <Button onClick={convert} className="rounded-2xl">Convert</Button>
        </div>
        {output && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-sm">
            <Badge variant="secondary" className="mr-2 rounded-2xl"><Timer className="mr-1 h-3 w-3"/>Result</Badge>
            {output}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

export default function SEOEmbeddedToolsArticle() {
  const articleText = [
    content.hero.headline,
    content.hero.sub,
    ...content.sections.map((s) => `${s.heading} ${(s as any).body || ""} ${(s as any).bullets?.join(" ") || ""}`),
  ].join(" ");
  const { minutes, words } = useReadingTime(articleText);

  return (
    <main className="relative">
      <Head>
        <title>{content.title}</title>
        <meta name="description" content={content.description} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://example.com/insights/seo-embedded-tools" />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={content.title} />
        <meta property="og:description" content={content.description} />
        <meta property="og:url" content="https://example.com/insights/seo-embedded-tools" />
        <meta property="og:image" content="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={content.title} />
        <meta name="twitter:description" content={content.description} />

        {/* JSON-LD */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>

      <ProgressBar />

      {/* Header Bar */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/40">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-500" />
            <span className="text-sm font-semibold tracking-tight">Insights</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{words.toLocaleString()} words</span>
            <span>•</span>
            <span>{minutes} min read</span>
            <Share />
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <Hero />
      </div>

      {/* Body */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 pb-20 lg:grid-cols-[1fr_280px]">
        <div className="space-y-12">
          <Section id="why-this-works" heading="Why This Strategy Works">
            <ul>
              {content.sections[0].bullets!.map((b, i) => (
                <li key={i}>• {b}</li>
              ))}
            </ul>
          </Section>

          <Section id="how-to-structure" heading="How to Structure the Article">
            <p>{content.sections[1].body}</p>
            <ul>
              {content.sections[1].bullets!.map((b, i) => (
                <li key={i}>• {b}</li>
              ))}
            </ul>
          </Section>

          <Section id="embed-the-tool" heading="Embed the Tool Inside the Article">
            <p className="mb-3">Here’s a live demo panel. Replace it with your real component:</p>
            <InlineDemo />
            <p className="mt-4 text-sm text-muted-foreground">
              Tip: keep your widget SSR-friendly, lazy-load heavy parts, and ensure full keyboard navigation.
            </p>
          </Section>

          <Section id="seo-checklist" heading="SEO Checklist">
            <ul>
              {content.sections[3].bullets!.map((b, i) => (
                <li key={i}>• {b}</li>
              ))}
            </ul>
            <Card className="mt-4 border-emerald-500/20 bg-emerald-500/5">
              <CardContent className="flex items-center justify-between gap-4 p-4">
                <div>
                  <p className="font-medium">Ready to ship a high-ranking article?</p>
                  <p className="text-sm text-muted-foreground">Use this checklist before publishing to catch 90% of issues.</p>
                </div>
                <Button className="rounded-2xl">Download Checklist</Button>
              </CardContent>
            </Card>
          </Section>

          <Section id="faqs" heading="FAQs">
            <h3 className="mt-4 text-lg font-semibold">How do I pick keywords?</h3>
            <p>Focus on problem phrases your tool solves, plus modifiers like “free,” “calculator,” “examples,” “learn,” and “tutorial.”</p>
            <h3 className="mt-6 text-lg font-semibold">Should I gate the tool?</h3>
            <p>Keep the core free and ungated for indexation and linkability. Gate advanced exports or batch features.</p>
            <h3 className="mt-6 text-lg font-semibold">How do I measure success?</h3>
            <p>Track rankings, CTR, scroll depth, time on page, and conversions from inline CTAs.</p>
          </Section>

          <div className="mt-6 flex items-center justify-between rounded-2xl border bg-muted/30 p-4">
            <div>
              <p className="font-medium">Want this page as a template?</p>
              <p className="text-sm text-muted-foreground">Clone it, swap content, and embed your own components.</p>
            </div>
            <Button className="rounded-2xl" asChild>
              <a href="#top">Use Template</a>
            </Button>
          </div>
        </div>

        <TOC sections={content.sections.map(({ id, heading }) => ({ id, heading }))} />
      </div>

      <footer className="border-t bg-background/60 py-10">
        <div className="mx-auto max-w-6xl px-4 text-sm text-muted-foreground">
          © {new Date().getFullYear()} Your Company. All rights reserved.
        </div>
      </footer>
    </main>
  );
}