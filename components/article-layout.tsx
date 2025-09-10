"use client";
import { ReactNode, useRef, useEffect, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ToolMeta } from '@/lib/tools';
import { format, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Share2, Clock, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { getRelatedTools } from '@/lib/utils';

interface ArticleLayoutProps {
  article: ToolMeta;
  children: ReactNode;
}

function ProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-primary/20 z-50 origin-left"
      style={{ scaleX }}
    />
  );
}

function TableOfContents({ sections }: { sections: { title: string; id: string }[] }) {
  if (!sections?.length) return null;

  return (
    <div className="sticky top-24 self-start hidden lg:block w-64 space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground mb-2">In this article</h3>
      <nav className="space-y-1">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {section.title}
          </a>
        ))}
      </nav>
    </div>
  );
}

export function ArticleLayout({ article, children }: ArticleLayoutProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: contentRef,
    offset: ['start start', 'end end'],
  });
  const readingTime = Math.ceil((article.description?.split(' ').length || 0) / 200) || 1;
  
  // Extract sections that have an ID for TOC
  const sections = article.sections
    ?.filter(s => s.title)
    .map(section => ({
      title: section.title,
      id: section.title.toLowerCase().replace(/[^\w]+/g, '-').replace(/^-+|-+$/g, '')
    })) || [];

  // Add the main tool section to TOC
  if (article.toolComponent) {
    sections.unshift({
      title: 'Try the Tool',
      id: 'tool-demo'
    });
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <ProgressBar />
      
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1">
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline" className="text-sm">
                {article.category}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {format(new Date(article.publishedDate || new Date()), 'MMMM d, yyyy')}
              </span>
              <span className="flex items-center text-sm text-muted-foreground">
                <Clock className="w-3.5 h-3.5 mr-1" />
                {readingTime} min read
              </span>
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              {article.title}
            </h1>
            
            <p className="text-xl text-muted-foreground mb-6">
              {article.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-8">
              {article.keywords?.slice(0, 4).map((keyword) => (
                <Badge key={keyword} variant="secondary" className="text-xs">
                  {keyword}
                </Badge>
              ))}
            </div>
          </header>
          
          <div ref={contentRef} className="prose prose-slate dark:prose-invert max-w-none">
            {children}
            
            {article.lastUpdated && (
              <div className="mt-12 pt-6 border-t text-sm text-muted-foreground">
                Last updated on {format(new Date(article.lastUpdated), 'MMMM d, yyyy')}
              </div>
            )}
            
            <div className="mt-12 pt-6 border-t">
              <h2 className="text-xl font-semibold mb-4">Related Tools</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {getRelatedTools(article).map((tool) => (
                  <Link 
                    key={tool.slug} 
                    href={tool.href}
                    className="block p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <h3 className="font-medium flex items-center">
                      {tool.title} <ArrowUpRight className="w-3.5 h-3.5 ml-1 opacity-70" />
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {tool.description.split('.').shift()}.
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <TableOfContents sections={sections} />
      </div>
    </article>
  );
}
