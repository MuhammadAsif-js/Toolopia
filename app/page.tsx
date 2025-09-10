"use client"
import { Hero } from '../components/hero'
import { BannerSlider } from '../components/banner-slider'
import { ToolCard } from '../components/tool-card'
import { motion } from 'framer-motion'
import { TOOLS } from '../lib/tools'

const featured = TOOLS.filter(t=>t.featured)

export default function HomePage() {
  return (
    <main>
      <section className="min-h-screen flex items-center justify-center">
        <Hero />
      </section>
      <div className="container space-y-10 pb-20">
        <BannerSlider />
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold tracking-tight">Popular Tools</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((t,i)=>(
              <motion.div key={t.href} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}>
                <ToolCard {...t} />
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
