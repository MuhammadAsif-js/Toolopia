"use client"
import { useState } from 'react'
import { useToast } from '@/components/toast'
import { SectionShell, SectionHeader } from '@/components/section-shell'

export default function ContactPage(){
  const { push, node } = useToast()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name:'', email:'', subject:'', message:'' })
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm(f => ({ ...f, [key]: value }))
  }

  const errors = {
    name: form.name.trim().length < 2 ? 'Name is too short' : undefined,
    email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? 'Valid email required' : undefined,
    subject: form.subject.trim().length < 3 ? 'Subject too short' : undefined,
    message: form.message.trim().length < 10 ? 'Message too short' : undefined
  }
  const hasErrors = Object.values(errors).some(Boolean)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setTouched({ name:true, email:true, subject:true, message:true })
    if (hasErrors) return
    setLoading(true)
    // Simulate async (no backend yet)
    await new Promise(r => setTimeout(r, 900))
    setLoading(false)
    push('Message sent', 'We received your note—thank you!')
    setForm({ name:'', email:'', subject:'', message:'' })
  }

  return (
    <div className="relative py-20 md:py-28">
      {node}
      <SectionShell className="max-w-5xl">
        <SectionHeader
          eyebrow="Contact"
          title="We’d love to hear from you"
          description="Questions, feature ideas or collaboration opportunities—drop them below. We respond personally to meaningful messages."
          align='left'
        />
        <div className="grid gap-10 md:grid-cols-5 items-start">
          <div className="md:col-span-3 order-2 md:order-1">
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <Field label="Name" error={touched.name ? errors.name : undefined}>
                  <input
                    value={form.name}
                    onChange={e=>update('name', e.target.value)}
                    onBlur={()=>setTouched(t=>({...t,name:true}))}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    placeholder="Jane Doe"
                  />
                </Field>
                <Field label="Email" error={touched.email ? errors.email : undefined}>
                  <input
                    value={form.email}
                    onChange={e=>update('email', e.target.value)}
                    onBlur={()=>setTouched(t=>({...t,email:true}))}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    placeholder="you@email.com"
                    type="email"
                  />
                </Field>
              </div>
              <Field label="Subject" error={touched.subject ? errors.subject : undefined}>
                <input
                  value={form.subject}
                  onChange={e=>update('subject', e.target.value)}
                  onBlur={()=>setTouched(t=>({...t,subject:true}))}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="Feedback, feature request..."
                />
              </Field>
              <Field label="Message" error={touched.message ? errors.message : undefined}>
                <textarea
                  value={form.message}
                  onChange={e=>update('message', e.target.value)}
                  onBlur={()=>setTouched(t=>({...t,message:true}))}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm h-40 resize-y focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="Tell us more..."
                />
              </Field>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <button
                  disabled={loading || hasErrors}
                  className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-6 py-2.5 text-sm font-medium shadow hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Sending…' : 'Send Message'}
                </button>
                <p className="text-xs text-muted-foreground">We won’t share your email. No marketing spam.</p>
              </div>
            </form>
          </div>
          <aside className="md:col-span-2 order-1 md:order-2 space-y-8">
            <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur p-6">
              <h3 className="font-semibold mb-3 tracking-tight">Direct Email</h3>
              <a href="mailto:toolopiahelp@gmail.com" className="text-sm font-medium text-primary break-all hover:underline">toolopiahelp@gmail.com</a>
              <p className="mt-3 text-xs text-muted-foreground leading-relaxed">We read everything that isn’t obviously automated. Typical response within 1–2 business days.</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur p-6">
              <h3 className="font-semibold mb-3 tracking-tight">What helps most?</h3>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-4">
                <li>Clear description of goal/problem</li>
                <li>Screenshots (if UI issue)</li>
                <li>Browser + device (for bugs)</li>
              </ul>
            </div>
          </aside>
        </div>
      </SectionShell>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5 text-sm">
      <span className="font-medium text-foreground/90">{label}</span>
      {children}
      {error && <span className="text-[11px] text-destructive font-medium">{error}</span>}
    </label>
  )
}
