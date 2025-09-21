"use client";
import React from 'react';
import { TOOLS } from '@/lib/tools';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function ToolHeader({ slug, className }: { slug: string; className?: string }) {
  const meta = TOOLS.find(t => t.slug === slug);
  if (!meta) return null;
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
