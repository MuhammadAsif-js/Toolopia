"use client"
import Link from 'next/link'
import { motion } from 'framer-motion'

export function Hero() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,.15),transparent_60%)]" />
      <div className="container mx-auto max-w-4xl text-center space-y-6">
  <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.6}} className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-lg">
          Supercharge Your Productivity
        </motion.h1>
        <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.1,duration:.6}} className="text-lg md:text-xl text-gray-500 dark:text-gray-300">
          Free, fast, privacy-first tools for everyday tasks. Compress images, convert files, and more—no account required.
        </motion.p>
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.2,duration:.6}}>
          <Link href="/tools" className="inline-flex items-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:scale-[1.03] active:scale-[0.99] transition-transform">
            Explore Tools
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
