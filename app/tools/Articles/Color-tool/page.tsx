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
function ProgressBar() {
              <li key={s.id}>
              </li>

        variant="secondary"
          setTimeout(() => setCopied(false), 1500);
      </Button>
        <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(content.title)}&url=${encodeURIComponent(url)}`} target="_blank" rel="noreferrer">
        <Badge className="mb-4 inline-flex items-center gap-1 rounded-2xl px-3 py-1 text-xs"><Sparkles className="h-3 w-3"/> {content.hero.eyebrow}</Badge>
            <a href="#embed-the-tool">
        aria-hidden

        transition={{ duration: 0.4 }}

      const amount = Number(match[1]);
  return (
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
  // This file has been cleared of content as per the patch request.
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