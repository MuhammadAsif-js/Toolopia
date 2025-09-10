"use client"
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

const banners = [
  { id: 1, title: 'Image Compressor', desc: 'Shrink images without losing quality.' },
  { id: 2, title: 'PDF to Excel', desc: 'Fast and accurate table extraction.' },
  { id: 3, title: 'More Tools Coming', desc: 'Stay tuned for updates.' }
]

export function BannerSlider() {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const id = setInterval(()=>setIndex(i => (i+1)%banners.length), 4000)
    return ()=>clearInterval(id)
  }, [])
  return (
  <div className="relative h-72 md:h-96 overflow-hidden rounded-xl border bg-gradient-to-br from-indigo-50/60 via-sky-50 to-cyan-50 dark:from-indigo-950/40 dark:via-sky-950/30 dark:to-cyan-950/30">
      <AnimatePresence mode="wait">
        {banners.map((b,i) => i===index && (
          <motion.div key={b.id} initial={{opacity:0,x:40}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-40}} transition={{duration:.5}} className="absolute inset-0 flex items-center justify-center w-full h-full">
            <img src={`/images/banner-${b.id}.svg`} alt={`Banner ${b.id}`} className="object-cover w-full h-full" />
          </motion.div>
        ))}
      </AnimatePresence>
      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
        {banners.map((_,i)=>(
          <button key={i} onClick={()=>setIndex(i)} className={`h-2 w-6 rounded-full transition-all ${i===index?'bg-primary':'bg-muted'}`} aria-label={`Go to slide ${i+1}`} />
        ))}
      </div>
    </div>
  )
}
