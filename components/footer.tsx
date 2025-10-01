"use client"
import Link from 'next/link'
import { motion } from 'framer-motion'

const productLinks = [
  { href: '/tools', label: 'All Tools' },
  { href: '/tools/image-compressor', label: 'Image Compressor' },
  { href: '/tools/pdf-to-excel', label: 'PDF to Excel' },
  { href: '/tools/color-tool', label: 'Color Tool' },
]

const companyLinks = [
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' }
]

export function Footer() {
  return (
    <footer className="relative mt-24 border-t bg-gradient-to-b from-background/60 via-background/80 to-background">
      {/* decorative top glow */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 h-16 w-[600px] max-w-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.35),transparent_70%)] pointer-events-none opacity-60" />
      <div className="container px-4 pt-14 pb-10">
        <div className="grid gap-12 lg:gap-16 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-5 max-w-sm">
            <div>
              <motion.div initial={{opacity:0,y:8}} whileInView={{opacity:1,y:0}} viewport={{ once: true }} transition={{duration:.6}} className="inline-flex items-center gap-2">
                <span className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500 to-sky-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-violet-500/30">T</span>
                <span className="font-semibold text-lg tracking-tight">Toolopia</span>
              </motion.div>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">Fast, privacy-first utilities for everyday workflows. No logins, no tracking scripts—just outcomes.</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-card/40 backdrop-blur p-4 text-[11px] leading-relaxed text-muted-foreground">
              <p><span className="font-medium text-foreground/90">Local-first</span> computations keep your data on-device whenever possible.</p>
            </div>
          </div>
          {/* Navigation */}
          <div className="grid grid-cols-2 gap-10 sm:gap-14 md:col-span-2">
            <FooterColumn title="Product" links={productLinks} />
            <FooterColumn title="Company" links={companyLinks} />
          </div>
        </div>
        <div className="mt-14 pt-8 border-t border-border/60 flex flex-col sm:flex-row gap-4 sm:items-center justify-between text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Toolopia. All rights reserved.</p>
          <p className="flex items-center gap-2">Built with <span className="text-rose-500">❤</span> & client-side focus.</p>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h4 className="font-medium tracking-tight mb-4 text-sm uppercase text-muted-foreground/80">{title}</h4>
      <ul className="space-y-2">
        {links.map(l => (
          <li key={l.href}>
            <Link href={l.href} className="group inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <span>{l.label}</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-primary" aria-hidden>→</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
