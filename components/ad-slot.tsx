"use client"
import React from 'react'

export function AdSlot({ enabled = false, variant = 'inline', className = '' }: { enabled?: boolean; variant?: 'top'|'sidebar'|'inline'|string; className?: string }) {
  // When enabled is false, render an inert, accessible placeholder div with minimal footprint.
  const base = 'bg-transparent'
  if (!enabled) return <div aria-hidden className={`${base} ${className}`} />

  // Example visible placeholder for development; real ad code can replace this.
  return (
  <div className={`${className} border border-dashed border-border bg-muted p-3 text-center text-sm text-muted-foreground`}>
      {variant === 'sidebar' ? 'Ad Sidebar (placeholder)' : variant === 'top' ? 'Top Ad (placeholder)' : 'Inline Ad (placeholder)'}
    </div>
  )
}
