"use client"
import React from 'react'
import articleData from '../app/tools/image-compressor/article.json'

export function Article({ className }: { className?: string }) {
  return (
    <article className={className ?? ''}>
      <h1 className="text-3xl font-bold tracking-tight">{articleData.title}</h1>
      {articleData.subtitle && <p className="text-muted-foreground mt-2">{articleData.subtitle}</p>}
      <div className="mt-4 space-y-3 text-sm text-foreground">
        {articleData.paragraphs.map((p: string, i: number) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </article>
  )
}
