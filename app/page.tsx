"use client"
import { Hero } from '../components/hero'
import { ToolCard } from '../components/tool-card'
import { motion } from 'framer-motion'
import { TOOLS } from '../lib/tools'
import Link from 'next/link'
import { SectionShell, SectionHeader } from '@/components/section-shell'

const featured = TOOLS.filter(t=>t.featured)

export default function HomePage() {
  return (
    <main className="relative">
      {/* Hero occupies top */}
      <section className="min-h-screen flex items-center justify-center">
        <Hero />
      </section>
      {/* Featured / slider section */}
      <div className="relative">
        <div className="absolute inset-0 pointer-events-none [mask-image:linear-gradient(to_bottom,black,transparent_95%)] bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.15),transparent_65%)]" />
        <div className="container px-4 space-y-20 pb-24">
          {/* Banners section removed intentionally */}
          <SectionShell className="space-y-8" data-section="featured">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <h2 className="font-semibold tracking-tight text-2xl sm:text-3xl bg-clip-text text-transparent bg-[linear-gradient(92deg,#6366f1,#0ea5e9_60%,#22d3ee)]">Featured Tools</h2>
                <p className="mt-2 text-sm text-muted-foreground max-w-xl">Recently enhanced & high-impact utilities picked for versatility and speed.</p>
              </div>
              <Link href="/tools" className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-card/50 backdrop-blur px-4 py-2 text-xs font-medium hover:bg-card/70 transition-colors">Browse all <span aria-hidden>→</span></Link>
            </div>
            <div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((t,i)=>(
                <motion.div key={t.href} initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}>
                  <ToolCard {...t} />
                </motion.div>
              ))}
            </div>
          </SectionShell>
          <SectionShell className="space-y-8" data-section="cta">
            <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/10 via-primary/5 to-cyan-500/10 p-10 backdrop-blur-md ring-1 ring-primary/20">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">Have an idea for the next tool?</h3>
              <p className="text-muted-foreground leading-relaxed max-w-2xl mb-6">We prioritize tools that remove repetitive friction. If something slows you down repeatedly, tell us—there’s probably a tool hiding in that pain point.</p>
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold shadow hover:shadow-md transition-shadow">Suggest a Tool <span aria-hidden>→</span></Link>
            </div>
          </SectionShell>
        </div>
      </div>
    </main>
  )
}
