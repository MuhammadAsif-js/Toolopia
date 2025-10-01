"use client"
import Link from 'next/link'
import { motion } from 'framer-motion'

export function Hero() {
  return (
  <section className="relative overflow-hidden py-20 md:py-28 lg:py-32">
      {/* Layered gradient & noise background */}
      <DecorBackground />
      <div className="container relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-start md:items-center gap-12 md:gap-16 lg:gap-20 md:grid-cols-2">
          {/* Left Content */}
          <div className="relative z-10 text-center md:text-left">
            <BadgeCluster />
            {/* Text Contrast Panel (experimental) */}
            <motion.div
              initial={{opacity:0,y:32}}
              animate={{opacity:1,y:0}}
              transition={{duration:.65,ease:'easeOut'}}
              className="mt-6 relative max-w-xl md:max-w-2xl mx-auto md:mx-0"
            >
              <div className="relative isolate rounded-3xl border border-white/50 dark:border-white/10 bg-white/70 dark:bg-slate-950/55 shadow-[0_8px_40px_-4px_rgba(0,0,0,0.25)] backdrop-blur-xl px-5 sm:px-7 md:px-8 py-7 sm:py-9 md:py-10 overflow-hidden ring-1 ring-black/5 dark:ring-white/5">
                {/* subtle gradient accents */}
                <div className="pointer-events-none absolute inset-0 opacity-[0.55] [background:radial-gradient(circle_at_15%_15%,rgba(99,102,241,0.35),transparent_55%),radial-gradient(circle_at_85%_80%,rgba(14,165,233,0.35),transparent_60%)]" />
                <div className="pointer-events-none absolute -inset-px rounded-3xl [mask-image:linear-gradient(to_bottom,black,transparent_85%)] bg-[linear-gradient(to_bottom,rgba(255,255,255,0.65),rgba(255,255,255,0))] dark:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.08),rgba(255,255,255,0))]" />
                <motion.h1
                  initial={{opacity:0,y:20}}
                  animate={{opacity:1,y:0}}
                  transition={{delay:.05,duration:.6}}
                  className="relative font-extrabold tracking-tight text-[clamp(2.15rem,6.2vw,3.75rem)] leading-[1.07] bg-clip-text text-transparent bg-[linear-gradient(95deg,#6d28d9_0%,#6366f1_35%,#0ea5e9_70%,#22d3ee_100%)] drop-shadow-[0_4px_18px_rgba(56,189,248,0.22)]"
                >
                  Build, Convert & Optimize — Instantly.
                </motion.h1>
                <motion.p
                  initial={{opacity:0,y:22}}
                  animate={{opacity:1,y:0}}
                  transition={{delay:.12,duration:.55}}
                  className="relative mt-5 sm:mt-6 text-[0.95rem] sm:text-base md:text-lg max-w-none leading-relaxed text-slate-800/90 dark:text-slate-100/90 tracking-[0.012em] drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]"
                >
                  <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent dark:from-slate-100 dark:via-slate-200 dark:to-white">A focused ecosystem of privacy‑first utilities</span>—image optimization, document conversion, color, finance & productivity tooling—<span className="font-semibold text-slate-900 dark:text-white">refined for speed</span> and <span className="font-semibold text-slate-900 dark:text-white">zero friction</span>.
                </motion.p>
                <motion.div
                  initial={{opacity:0,y:18}}
                  animate={{opacity:1,y:0}}
                  transition={{delay:.2,duration:.5}}
                  className="relative mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
                >
                  <Link href="/tools" className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:-translate-y-0.5 active:translate-y-0 transition-all">
                    Explore Tools
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                  </Link>
                  <Link href="/about" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-900/10 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 backdrop-blur px-7 py-3 text-sm font-medium text-slate-800 dark:text-slate-100 hover:bg-white/95 dark:hover:bg-slate-900/70 hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-sm">
                    About Platform
                  </Link>
                </motion.div>
                {/* subtle inner highlight line */}
                <div className="pointer-events-none absolute inset-x-5 sm:inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-violet-400/60 to-transparent dark:via-sky-300/40" />
              </div>
            </motion.div>
            {/* Stats remain outside panel for layout balance */}
            <motion.div
              initial={{opacity:0,y:24}}
              animate={{opacity:1,y:0}}
              transition={{delay:.55,duration:.55}}
              className="mt-12 md:mt-14 grid grid-cols-3 gap-5 md:gap-6 max-w-md mx-auto md:mx-0"
            >
              <Stat value="15+" label="Unified Tools" />
              <Stat value="0" label="Tracking Scripts" />
              <Stat value="100%" label="Client-Side Logic" />
            </motion.div>
          </div>
          {/* Right Visual */}
          <motion.div
            initial={{opacity:0,scale:.9,y:40}}
            animate={{opacity:1,scale:1,y:0}}
            transition={{delay:.12,duration:.7,ease:'easeOut'}}
            className="relative max-w-lg w-full mx-auto md:mx-0"
          >
            <div className="absolute -inset-6 bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.25),transparent_70%)] blur-2xl opacity-70" />
            <div className="relative rounded-2xl border border-white/10 dark:border-white/5 bg-gradient-to-br from-slate-50/70 to-white/5 dark:from-slate-900/60 dark:to-slate-800/40 backdrop-blur-xl shadow-2xl ring-1 ring-black/5 p-5 sm:p-6 overflow-hidden">
              <div className="absolute right-0 top-0 w-64 h-64 bg-[radial-gradient(circle_at_75%_25%,#6366f1_0%,transparent_70%)] opacity-40" />
              <header className="flex items-center gap-2 text-[10px] sm:text-[11px] font-semibold text-foreground/80 dark:text-slate-100 mb-4 tracking-wide">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_0_4px_rgba(16,185,129,0.15)]" /> Live Preview
              </header>
              <PreviewTabs />
              <div className="mt-5 sm:mt-6 grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4 text-[11px] sm:text-xs">
                <FeatureBadge icon="⚡" label="Fast by design" />
                <FeatureBadge icon="🛡️" label="Privacy-first" />
                <FeatureBadge icon="🧩" label="Modular architecture" />
                <FeatureBadge icon="🌗" label="Adaptive theming" />
              </div>
              <div className="mt-5 sm:mt-6 text-[10px] sm:text-[11px] text-foreground/70 dark:text-slate-300 leading-relaxed"><span className="font-medium text-foreground/90 dark:text-white">All operations run locally</span> in your browser. No upload — no waiting.</div>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-[-140px] h-[300px] bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}

function BadgeCluster() {
  return (
    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
      <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-medium tracking-wide">Open Ecosystem</span>
      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[11px] font-medium">No Signup</span>
      <span className="px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-500 text-[11px] font-medium">Lightweight</span>
    </div>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center lg:text-left">
      <div className="text-2xl font-semibold tracking-tight bg-clip-text text-transparent bg-[linear-gradient(90deg,#38bdf8,#6366f1)]">{value}</div>
      <div className="mt-1 text-[11px] uppercase tracking-wide text-muted-foreground font-medium">{label}</div>
    </div>
  )
}

function FeatureBadge({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-white/20 dark:border-white/10 bg-white/55 dark:bg-slate-900/60 backdrop-blur px-2.5 py-2 shadow-sm">
      <span className="text-base leading-none drop-shadow">{icon}</span>
      <span className="text-[11px] font-semibold text-foreground/85 dark:text-slate-100 tracking-wide">{label}</span>
    </div>
  )
}

function PreviewTabs() {
  const tabs = [
    { title: 'Valuation.tsx', code: 'const value = (ebitda + revenue) / 2\nreturn formatUSD(value)' },
    { title: 'Color.tsx', code: 'export function hexToRgb(hex){ /* parse */ }' },
    { title: 'Convert.ts', code: 'async function pdfToExcel(file){ /* worker */ }' }
  ]
  return (
    <div className="rounded-xl border border-white/10 dark:border-white/5 bg-slate-950/50 dark:bg-slate-950/40 backdrop-blur-md overflow-hidden shadow-inner">
      <div className="flex gap-1 px-3 pt-3">
        {tabs.map((t,i)=>(
          <div key={t.title} className={`text-[11px] px-2.5 py-1.5 rounded-t-md font-mono tracking-wide transition-colors ${i===0 ? 'bg-gradient-to-r from-primary/30 to-primary/20 text-primary-foreground/95 dark:text-primary-foreground' : 'text-slate-400 hover:text-slate-200 dark:text-slate-500 dark:hover:text-slate-200'}`}>{t.title}</div>
        ))}
      </div>
      <div className="px-4 pb-4 pt-2 relative">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.15),transparent_70%)] opacity-70" />
        <pre className="relative text-[11px] leading-relaxed font-mono text-sky-100/95 dark:text-sky-200 whitespace-pre wrap drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]">{tabs[0].code}</pre>
      </div>
    </div>
  )
}

function DecorBackground() {
  return (
    <>
      {/* Base soft gradient field (rolled back version) */}
      <div className="absolute inset-0 -z-40 bg-[radial-gradient(circle_at_20%_25%,rgba(59,130,246,0.28),transparent_60%),radial-gradient(circle_at_80%_70%,rgba(147,51,234,0.23),transparent_65%)] dark:bg-[radial-gradient(circle_at_20%_25%,rgba(59,130,246,0.18),transparent_60%),radial-gradient(circle_at_80%_70%,rgba(147,51,234,0.16),transparent_65%)] transition-colors" />

      {/* Soft vertical blend */}
      <div className="absolute inset-0 -z-30 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.65)_0%,rgba(255,255,255,0.35)_28%,rgba(255,255,255,0.20)_55%,rgba(255,255,255,0)_75%)] dark:bg-[linear-gradient(115deg,rgba(15,23,42,0.85)_0%,rgba(15,23,42,0.65)_30%,rgba(15,23,42,0.45)_60%,rgba(15,23,42,0)_80%)] mix-blend-overlay dark:mix-blend-normal pointer-events-none" />

      {/* Conic accent */}
      <div className="absolute -z-20 inset-x-0 top-1/2 -translate-y-1/2 h-[900px] [mask-image:radial-gradient(circle_at_center,black,transparent_70%)] bg-[conic-gradient(from_0deg,rgba(56,189,248,0.18),rgba(255,255,255,0)_22%,rgba(99,102,241,0.18),rgba(255,255,255,0)_52%,rgba(14,165,233,0.18),rgba(255,255,255,0)_82%)] animate-spin-slower" />

      {/* Noise overlay */}
      <div className="absolute inset-0 -z-10 opacity-[0.18] dark:opacity-[0.10] pointer-events-none [background-image:radial-gradient(rgba(255,255,255,0.35)_1px,transparent_1px)] [background-size:3px_3px] mix-blend-soft-light" />

      {/* Previous implementation (kept for quick rollback)
        <div className="absolute inset-0 -z-40 bg-[radial-gradient(circle_at_20%_25%,rgba(59,130,246,0.28),transparent_60%),radial-gradient(circle_at_80%_70%,rgba(147,51,234,0.23),transparent_65%)] dark:bg-[radial-gradient(circle_at_20%_25%,rgba(59,130,246,0.18),transparent_60%),radial-gradient(circle_at_80%_70%,rgba(147,51,234,0.16),transparent_65%)] transition-colors" />
        <div className="absolute inset-0 -z-30 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.65),rgba(255,255,255,0.35)_25%,rgba(255,255,255,0.1)_55%,rgba(255,255,255,0)_70%)] dark:bg-[linear-gradient(to_bottom,rgba(15,23,42,0.9),rgba(15,23,42,0.7)_35%,rgba(15,23,42,0.4)_60%,rgba(15,23,42,0)_80%)] pointer-events-none mix-blend-overlay dark:mix-blend-normal" />
        <div className="absolute -z-20 inset-x-0 top-1/2 -translate-y-1/2 h-[900px] [mask-image:radial-gradient(circle_at_center,black,transparent_70%)] bg-[conic-gradient(from_0deg,rgba(56,189,248,0.18),rgba(255,255,255,0)_22%,rgba(99,102,241,0.18),rgba(255,255,255,0)_52%,rgba(14,165,233,0.18),rgba(255,255,255,0)_82%)] animate-spin-slower" />
        <div className="absolute inset-0 -z-10 opacity-[0.18] dark:opacity-[0.10] pointer-events-none [background-image:radial-gradient(rgba(255,255,255,0.35)_1px,transparent_1px)] [background-size:3px_3px] mix-blend-soft-light" />
      */}
    </>
  )
}
