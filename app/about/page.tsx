import { SectionShell, SectionHeader, ValueGrid, Timeline } from '@/components/section-shell'

export default function AboutPage(){
  return (
    <div className="relative py-20 md:py-28 space-y-24">
      {/* Intro */}
      <SectionShell className="max-w-5xl">
        <SectionHeader
          eyebrow="Our Story"
          title="Building a trustworthy ecosystem of everyday tools"
          description={<>
            <span className="font-semibold text-foreground">Toolopia</span> started with a shared belief: software should feel <span className="font-medium text-primary">fast, honest, and empowering</span>. No ads traps. No friction. Just focused utilities that respect your time.
          </>}
          align='left'
        />
        <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none leading-relaxed text-muted-foreground">
          <p><strong className="text-foreground">Founded by Israr Ijaz &amp; Asif Arshad</strong>, the platform began as a weekend experiment and evolved into a mission: craft a unified place where creators, students, operators &amp; analysts can quickly get things done.</p>
          <p>Instead of bloated SaaS dashboards or intrusive cloud uploads, Toolopia focuses on <strong>client‑side workflows</strong>, privacy by default, and clear UX patterns. Every enhancement is filtered through a single question: <em>“Does this reduce friction or increase clarity?”</em></p>
          <p>We iterate intentionally—small, composable improvements over loud overhauls. This keeps the experience stable while still feeling alive and cared for.</p>
        </div>
      </SectionShell>

      {/* Values */}
      <SectionShell className="max-w-6xl">
        <SectionHeader eyebrow="Values" title="Principles that guide every release" description="Shaping how tools are imagined, implemented and maintained." align='center' />
        <ValueGrid items={[
          { title: 'Privacy First', description: 'Local-first design keeps your data on your device. We avoid unnecessary network transmission.', icon: '🛡️' },
          { title: 'Speed as a Feature', description: 'Architecture decisions prioritize perceived & real performance across devices.', icon: '⚡' },
          { title: 'Clarity Over Clutter', description: 'Interfaces emphasize hierarchy, intent and minimal cognitive overhead.', icon: '🧭' },
          { title: 'Composable Design', description: 'Shared primitives make new tools faster to ship and easier to maintain.', icon: '🧩' },
          { title: 'Transparent Iteration', description: 'Progress is continuous—small refinements compound into quality.', icon: '🔁' },
          { title: 'Respect for Time', description: 'Zero dark patterns. Zero noise. Just outcomes delivered quickly.', icon: '⏱️' }
        ]} />
      </SectionShell>

      {/* Timeline */}
      <SectionShell className="max-w-5xl">
        <SectionHeader eyebrow="Milestones" title="From idea to expanding toolkit" description="A brief snapshot of how we grew and where we’re heading." align='left' />
        <Timeline events={[
          { year: '2023', title: 'Initial Experiments', description: 'Early utilities launched: image compression & color tool prototypes.' },
          { year: '2024', title: 'Foundation Layer', description: 'Shared component system and theming introduced; accessibility baseline improved.' },
          { year: '2025', title: 'Expansion & Polish', description: 'Finance, productivity & conversion tools matured. UX refinements and professional landing experience.' },
          { year: 'Future', title: 'Edge & AI Enhancements', description: 'Local inference helpers, offline caching & collaborative utilities.' }
        ]} />
      </SectionShell>

      {/* Community CTA */}
      <SectionShell className="max-w-4xl">
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/10 via-primary/5 to-cyan-500/10 p-10 backdrop-blur-md ring-1 ring-primary/20">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">You are part of this journey</h3>
          <p className="text-muted-foreground leading-relaxed max-w-2xl mb-6">Every suggestion helps sharpen the platform. If a workflow feels slower than it should—tell us. If something delights you—tell us. The best tools come from tight feedback loops.</p>
          <a href="/contact" className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold shadow hover:shadow-md transition-shadow">
            Share Feedback
            <span aria-hidden>→</span>
          </a>
        </div>
      </SectionShell>
    </div>
  )
}
