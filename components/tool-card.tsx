"use client"
import Link from 'next/link'
import { motion } from 'framer-motion'

interface ToolCardProps {
  title: string
  description: string
  icon?: React.ReactNode | string
  href: string
  category: string
}

export function ToolCard({ title, description, icon, href, category }: ToolCardProps) {
  // Fallback emoji per category if explicit icon not provided.
  const CATEGORY_ICONS: Record<string, string> = {
    finance: '💹',
    utility: '🛠️',
    image: '🖼️',
    pdf: '📄',
    design: '🎨',
    security: '🔒',
    productivity: '⚡'
  }
  const normalizedCategory = category.toLowerCase();
  const resolvedIcon = icon || CATEGORY_ICONS[normalizedCategory];
  const isEmoji = typeof resolvedIcon === 'string';

  return (
    <motion.div whileHover={{ y: -4 }} className="group rounded-xl border bg-card/60 backdrop-blur p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div
          className={
            isEmoji
              ? 'w-10 h-10 flex items-center justify-center rounded-full text-2xl bg-muted/60 dark:bg-slate-800/70 ring-1 ring-border/60 group-hover:ring-primary/50 transition-colors'
              : 'w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-cyan-500 text-primary-foreground flex items-center justify-center shadow-inner'
          }
        >
          {isEmoji ? resolvedIcon : (resolvedIcon ?? <span className="text-lg font-semibold">{title[0]}</span>)}
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold leading-none tracking-tight">{title}</h3>
          <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">{category}</p>
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Link
          href={href}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold shadow hover:scale-105 active:scale-95 transition-transform focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <span>Open</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </motion.div>
  )
}
