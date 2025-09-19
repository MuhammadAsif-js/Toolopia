"use client"
import Link from 'next/link'
import { motion } from 'framer-motion'

export function Hero() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="hero-glow -z-10 opacity-30" />
      <div className="absolute inset-0 -z-20 opacity-[0.15] dark:opacity-[0.25] bg-[radial-gradient(circle_at_20%_20%,#38bdf8,transparent_60%),radial-gradient(circle_at_80%_70%,#6366f1,transparent_60%)]" />
      <div className="container px-4 mx-auto max-w-5xl text-center relative">
        <motion.h1
          initial={{opacity:0,y:24}}
          animate={{opacity:1,y:0}}
          transition={{duration:.65,ease:'easeOut'}}
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight drop-shadow-[0_4px_16px_rgba(56,189,248,0.18)]"
        >
          <span className="animate-gradient-text">Supercharge Your Productivity</span>
        </motion.h1>
        <motion.p
          initial={{opacity:0,y:24}}
          animate={{opacity:1,y:0}}
          transition={{delay:.08,duration:.6,ease:'easeOut'}}
          className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          Free, fast, privacy-first tools for everyday tasks. Compress images, convert files, and more—no account required.
        </motion.p>
        <motion.div
          initial={{opacity:0,y:24}}
          animate={{opacity:1,y:0}}
          transition={{delay:.16,duration:.55,ease:'easeOut'}}
          className="mt-10 flex items-center justify-center"
        >
          <Link
            href="/tools"
            className="inline-flex items-center rounded-xl bg-primary/90 hover:bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.035] active:scale-[0.97] transition-all"
          >
            Explore Tools
          </Link>
        </motion.div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-[-120px] h-[240px] bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
