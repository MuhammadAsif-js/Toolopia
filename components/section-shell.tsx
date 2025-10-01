import React from 'react'
import { cn } from '@/lib/utils'

interface SectionShellProps extends React.HTMLAttributes<HTMLDivElement> {
  bleed?: boolean
  subdued?: boolean
}

export const SectionShell: React.FC<SectionShellProps> = ({ className, children, bleed = false, subdued = false, ...rest }) => {
  return (
    <section
      className={cn(
        'relative',
        bleed ? 'w-full' : 'container',
        subdued && 'before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-b before:from-background/40 before:to-background/80',
        className
      )}
      {...rest}
    >
      {children}
    </section>
  )
}

interface SectionHeaderProps {
  eyebrow?: string
  title: string
  description?: React.ReactNode
  align?: 'left' | 'center'
  className?: string
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ eyebrow, title, description, align='center', className }) => {
  return (
    <div className={cn('max-w-3xl mx-auto mb-10 sm:mb-14', align === 'left' && 'text-left md:mx-0', className)}>
      {eyebrow && (
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium tracking-wide ring-1 ring-primary/20 mb-4">
          <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_0_3px_rgba(99,102,241,0.25)]" />
          {eyebrow}
        </div>
      )}
      <h2 className={cn('font-bold tracking-tight text-3xl sm:text-4xl bg-clip-text text-transparent bg-[linear-gradient(95deg,#6366f1,#0ea5e9_55%,#22d3ee)]', align === 'center' && 'text-center')}>
        {title}
      </h2>
      {description && (
        <p className={cn('mt-5 text-muted-foreground leading-relaxed text-sm sm:text-base', align === 'center' && 'text-center')}>{description}</p>
      )}
    </div>
  )}

export const ValueGrid: React.FC<{ items: { title: string; description: string; icon?: string }[] }> = ({ items }) => {
  return (
    <div className="grid gap-5 sm:gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(item => (
        <div key={item.title} className="relative group rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md p-6 sm:p-7 shadow-sm hover:shadow-md transition-all overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/10 group-hover:via-primary/5 group-hover:to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex flex-col h-full">
            {item.icon && <div className="mb-4 text-2xl drop-shadow-sm">{item.icon}</div>}
            <h3 className="font-semibold text-lg tracking-tight mb-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed flex-1">{item.description}</p>
            <div className="mt-4 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-40" />
          </div>
        </div>
      ))}
    </div>
  )
}

export const Timeline: React.FC<{ events: { year: string; title: string; description: string }[] }> = ({ events }) => {
  return (
    <ol className="relative border-l border-border/60 ml-2 pl-6 space-y-10">
      {events.map(e => (
        <li key={e.year} className="relative">
          <div className="absolute -left-[34px] top-1.5 h-3 w-3 rounded-full bg-primary shadow-[0_0_0_4px_rgba(99,102,241,0.25)]" />
          <div className="absolute -left-[112px] hidden md:flex items-center justify-center w-24 text-xs font-semibold tracking-wide text-primary/80">{e.year}</div>
          <h4 className="font-semibold text-base mb-1 tracking-tight">{e.title}</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{e.description}</p>
        </li>
      ))}
    </ol>
  )
}

export default { SectionShell, SectionHeader, ValueGrid, Timeline }
