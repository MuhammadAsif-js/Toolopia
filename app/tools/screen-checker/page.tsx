"use client"
import React, { useState, useEffect } from "react";
import { TOOLS } from '@/lib/tools';
import { Badge } from '@/components/ui/badge';

export default function ScreenChecker() {
  const meta = TOOLS.find(t => t.slug === 'screen-checker');
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  // Update dimensions on resize
  useEffect(() => {
    // Ensure we're in the browser before setting up the event listener
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    // Initial call to set dimensions
    handleResize();
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <header className="mb-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Badge variant="outline" className="text-xs">{meta?.category || 'Utility'}</Badge>
          {meta?.keywords?.slice(0,2).map(k => (
            <Badge key={k} variant="secondary" className="text-[10px]">{k}</Badge>
          ))}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{meta?.title || 'Screen Checker'}</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">{meta?.description || 'Check your screen resolution and size instantly.'}</p>
        {meta?.slug && (
          <div className="mt-3">
            <a href={`/articles/${meta.slug}`} className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
              Read full guide
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5"><path d="M13.2 6.3a1 1 0 1 0-1.4 1.4L15.1 11H6a1 1 0 1 0 0 2h9.1l-3.3 3.3a1 1 0 1 0 1.4 1.4l5-5a1 1 0 0 0 0-1.4l-5-5Z"/></svg>
            </a>
          </div>
        )}
      </header>
      <div className="bg-card rounded-lg p-6 shadow border text-center">
        <p className="text-lg">Width: <span className="font-mono">{dimensions.width}px</span></p>
        <p className="text-lg">Height: <span className="font-mono">{dimensions.height}px</span></p>
      </div>
    </div>
  );
}
