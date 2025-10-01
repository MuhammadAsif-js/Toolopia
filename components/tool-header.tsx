"use client";
import React from 'react';
import { TOOLS } from '@/lib/tools';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function ToolHeader({ slug, className }: { slug: string; className?: string }) {
  const meta = TOOLS.find(t => t.slug === slug);
  if (!meta) return null;
  // Record recent tool usage (client-only)
  React.useEffect(() => {
    if (!meta) return;
    try {
      const key = 'recentTools';
      const raw = localStorage.getItem(key);
      let arr: string[] = [];
      if (raw) arr = JSON.parse(raw);
      // Remove existing instance
      arr = arr.filter(s => s !== meta.slug);
      arr.unshift(meta.slug);
      if (arr.length > 12) arr = arr.slice(0, 12);
      localStorage.setItem(key, JSON.stringify(arr));
      // Custom event to notify navbar to refresh
      window.dispatchEvent(new CustomEvent('toolopia:recentToolsUpdated'));
    } catch (e) {
      // ignore storage errors (private mode, etc.)
    }
  }, [meta]);
  return (
    <header className={className ?? 'mb-6'}>
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <Badge variant="outline" className="text-xs">{meta.category}</Badge>
        {meta.keywords?.slice(0, 2).map(k => (
          <Badge key={k} variant="secondary" className="text-[10px]">{k}</Badge>
        ))}
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{meta.title}</h1>
      {meta.description && (
        <p className="text-sm sm:text-base text-muted-foreground mt-2">{meta.description}</p>
      )}
      <div className="mt-3">
        <Link href={`/articles/${meta.slug}`} className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
          Read full guide
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </header>
  );
}
