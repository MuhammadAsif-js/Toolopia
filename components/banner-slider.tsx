"use client"
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useRef, useCallback } from 'react'
import Link from 'next/link'

interface Banner {
  id: number
  title: string
  desc: string
  cta?: { href: string; label: string }
  image?: string
}

const banners: Banner[] = [
  // Removed non-finance slide (Image Compressor)
  { id: 2, title: 'PDF to Excel', desc: 'Turn static tables into editable data instantly.', cta: { href: '/tools/pdf-to-excel', label: 'Convert PDF' }, image: '/images/banner-2.svg' },
  { id: 3, title: 'Currency & Valuation', desc: 'Finance utilities evolving with markets.', cta: { href: '/tools/business-valuation-estimator', label: 'Estimate Value' }, image: '/images/banner-3.svg' }
]

export function BannerSlider() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const advance = useCallback(() => {
    setIndex(i => (i + 1) % banners.length)
  }, [])

  useEffect(() => {
    if (paused) return
    timeoutRef.current && clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(advance, 5200)
    return () => { timeoutRef.current && clearTimeout(timeoutRef.current) }
  }, [index, paused, advance])

  function go(i: number) { setIndex(i) }

  return (
    <div
      className="relative group h-[380px] md:h-[430px] overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-indigo-100/70 via-sky-50 to-cyan-50 dark:from-indigo-950/40 dark:via-sky-950/30 dark:to-cyan-950/30"
      onMouseEnter={()=>setPaused(true)}
      onMouseLeave={()=>setPaused(false)}
    >
      {/* Slides */}
      <AnimatePresence mode="wait" initial={false}>
        {banners.map((b,i) => i===index && (
          <motion.div
            key={b.id}
            initial={{opacity:0, x:60}}
            animate={{opacity:1, x:0}}
            exit={{opacity:0, x:-60}}
            transition={{duration:.6, ease:'easeOut'}}
            className="absolute inset-0"
            aria-label={b.title}
            role="group"
          >
            {/* Background image */}
            {b.image && (
              <img src={b.image} alt="" className="absolute inset-0 w-full h-full object-cover object-center opacity-70 md:opacity-80" />
            )}
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(255,255,255,0.9),transparent_65%)] dark:bg-[radial-gradient(circle_at_25%_30%,rgba(15,23,42,0.8),transparent_70%)] mix-blend-normal" />
            {/* Content */}
            <div className="relative h-full flex flex-col justify-center items-start px-8 sm:px-12 md:px-16">
              <div className="max-w-xl">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-[linear-gradient(92deg,#4f46e5,#0ea5e9_60%,#22d3ee)] drop-shadow-[0_4px_24px_rgba(14,165,233,0.25)]">{b.title}</h3>
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-6 pr-4">{b.desc}</p>
                {b.cta && (
                  <Link href={b.cta.href} className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium shadow hover:shadow-md transition-shadow">
                    {b.cta.label}
                    <span aria-hidden>→</span>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      {/* Controls */}
      <div className="absolute bottom-4 left-0 right-0 flex flex-col sm:flex-row items-center gap-4 sm:justify-between px-6">
        <div className="flex items-center gap-2 text-[11px] font-medium tracking-wide bg-background/70 backdrop-blur px-3 py-1.5 rounded-full border border-border/60 shadow-sm">
          <span className="uppercase">Showing</span>
          <span className="text-primary">{index+1}</span>
          <span className="opacity-60">/ {banners.length}</span>
          <button onClick={()=>setPaused(p=>!p)} className="ml-2 px-2 py-0.5 rounded-md bg-muted text-muted-foreground hover:bg-muted/80 text-[10px]">
            {paused ? 'Play' : 'Pause'}
          </button>
        </div>
        <div className="flex gap-2">
          {banners.map((b,i)=>(
            <button
              key={b.id}
              onClick={()=>go(i)}
              aria-label={`Go to slide ${i+1}`}
              className={`h-2.5 rounded-full transition-all ${i===index? 'bg-primary w-8 shadow-inner' : 'bg-muted/70 w-4 hover:bg-muted'}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
