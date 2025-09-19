"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import { cn } from '../lib/utils'
import { ThemeToggle } from './theme-toggle'
import { Home, Layers, Info, Mail } from 'lucide-react'

import { TOOLS } from '@/lib/tools';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { 
    href: '/tools', 
    label: 'Tools',
    icon: Layers,
    dropdown: [
      {
        title: 'Color Picker & Converter',
        description: 'Pick, convert and extract colors with our comprehensive color tool',
        href: '/articles/color-tool',
        category: 'Design',
        icon: 'Palette'
      },
      ...TOOLS.filter(tool => tool.featured).map(tool => ({
        title: tool.title,
        description: tool.description,
        href: tool.href,
        category: tool.category
      }))
    ]
  },
  { href: '/about', label: 'About', icon: Info },
  { href: '/contact', label: 'Contact', icon: Mail }
]

export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null)
  const sidebarRef = useRef<HTMLDivElement | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [desktopDropdown, setDesktopDropdown] = useState<string | null>(null)
  const dropdownItemRefs = useRef<Record<string, Array<HTMLAnchorElement | null>>>({})

  // Close on ESC
  useEffect(()=>{
    if(!open) return
    const onKey = (e: KeyboardEvent) => { if(e.key==='Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return ()=> window.removeEventListener('keydown', onKey)
  },[open])

  // Prevent body scroll when open
  useEffect(()=>{
    if(open){
      const prev = document.body.style.overflow
      document.body.style.overflow='hidden'
      return ()=>{ document.body.style.overflow=prev }
    }
  },[open])

  // Simple initial focus inside sidebar
  useEffect(()=>{
    if(open && sidebarRef.current){
      const btn = sidebarRef.current.querySelector('a,button') as HTMLElement | null
      btn?.focus()
    }
  },[open])

  // Header shadow on scroll
  useEffect(()=>{
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  },[])
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="font-bold text-lg gradient-text">Toolopia</Link>
        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map(link => {
            const isActive = pathname === link.href
            const Icon = (link as any).icon as any
            return (
              <div key={link.href} className="relative group px-1">
                <Link 
                  href={link.href} 
                  className={cn(
                    'relative inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    'hover:bg-accent/60 hover:text-accent-foreground',
                    isActive && 'text-primary'
                  )}
                  onKeyDown={(e)=>{
                    if (!('dropdown' in link) || !(link as any).dropdown) return
                    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setDesktopDropdown(link.href)
                      const first = dropdownItemRefs.current[link.href]?.[0]
                      first?.focus()
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault()
                      const list = dropdownItemRefs.current[link.href]
                      const last = list?.[list.length-1]
                      setDesktopDropdown(link.href)
                      last?.focus()
                    }
                  }}
                  onFocus={()=>{ if((link as any).dropdown) setDesktopDropdown(link.href) }}
                  onBlur={(e)=>{
                    // Close when focus leaves both trigger and panel
                    if(!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)){
                      setDesktopDropdown(null)
                    }
                  }}
                >
                  {Icon && <Icon className={cn('h-4 w-4', isActive ? 'text-primary' : 'text-muted-foreground')} />}
                  <span>{link.label}</span>
                  {link.href === '/tools' && (
                    <span className="ml-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-[10px] leading-none px-1.5 py-0.5">New</span>
                  )}
                  {link.dropdown && (
                    <svg className="w-4 h-4 text-muted-foreground group-hover:text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                  {/* Active underline */}
                  <span className={cn('pointer-events-none absolute -bottom-0.5 left-3 right-3 h-0.5 rounded-full bg-primary/70 scale-x-0 origin-left transition-transform', isActive && 'scale-x-100')} />
                </Link>

                {link.dropdown && (
                  <div
                    className={cn(
                      "absolute left-0 mt-2 w-[22rem] rounded-xl border bg-popover/98 backdrop-blur-lg shadow-xl z-50 opacity-0 translate-y-1 pointer-events-none",
                      "group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200",
                      desktopDropdown===link.href && "opacity-100 translate-y-0 pointer-events-auto"
                    )}
                    onKeyDown={(e)=>{ if(e.key==='Escape'){ setDesktopDropdown(null) } }}
                  >
                    <div className="p-3">
                      <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-2 pb-2">Featured Tools</h3>
                      <div className="grid grid-cols-1 gap-1">
                        {link.dropdown.map((item, idx) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-start gap-3 rounded-lg px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                            ref={(el)=>{
                              const arr = dropdownItemRefs.current[link.href] || []
                              arr[idx] = el
                              dropdownItemRefs.current[link.href] = arr
                            }}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">{item.title}</div>
                              <div className="text-xs text-muted-foreground line-clamp-1">{item.description}</div>
                            </div>
                            {item.category && (
                              <span className="shrink-0 text-[10px] text-muted-foreground">{item.category}</span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button onClick={() => setOpen(o=>!o)} className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-md border hover:bg-accent">
            <span className="sr-only">Menu</span>
            <div className="space-y-1.5">
              <span className="block w-6 h-0.5 bg-current" />
              <span className="block w-6 h-0.5 bg-current" />
              <span className="block w-6 h-0.5 bg-current" />
            </div>
          </button>
        </div>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xl supports-[backdrop-filter]:bg-black/50 animate-in fade-in" onClick={()=>setOpen(false)} />
          <div
            ref={sidebarRef}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            className="absolute right-0 top-0 h-full w-[86%] max-w-96 rounded-l-2xl border bg-background/98 backdrop-blur-lg shadow-xl animate-in slide-in-from-right"
          >
            <div className="h-16 px-5 flex items-center justify-between border-b">
              <Link href="/" onClick={()=>setOpen(false)} className="font-bold text-xl gradient-text">Toolopia</Link>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <button onClick={()=>setOpen(false)} className="inline-flex items-center justify-center w-10 h-10 rounded-md border hover:bg-accent" aria-label="Close menu">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
            <nav className="flex-1 overflow-y-auto px-4 py-5">
              <ul className="space-y-4">
                {navLinks.map(link => {
                  const isActive = pathname === link.href
                  const isOpen = mobileDropdown === link.href
                  const hasDropdown = !!link.dropdown
                  const IconM = (link as any).icon as any
                  return (
                    <li key={link.href} className="group">
                      <div className="flex items-center gap-3">
                        <Link
                          href={link.href}
                          onClick={() => { if(hasDropdown){ setMobileDropdown(isOpen?null:link.href); } else { setOpen(false);} }}
                          className={cn('flex-1 inline-flex items-center gap-3 rounded-xl px-3 py-2 text-lg font-medium transition-colors hover:bg-accent hover:text-accent-foreground', isActive && 'text-primary')}
                        >
                          {IconM && <IconM className="h-5 w-5" />}
                          <span>{link.label}</span>
                          {link.href === '/tools' && (
                            <span className="ml-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-[10px] leading-none px-1.5 py-0.5">New</span>
                          )}
                        </Link>
                        {hasDropdown && (
                          <button
                            type="button"
                            aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${link.label} menu`}
                            aria-expanded={isOpen}
                            onClick={() => setMobileDropdown(isOpen?null:link.href)}
                            className="inline-flex items-center justify-center w-9 h-9 rounded-md border hover:bg-accent"
                          >
                            <svg className={cn('w-5 h-5 transition-transform', isOpen && 'rotate-180')} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                          </button>
                        )}
                      </div>
                      {hasDropdown && (
                        <div className={cn('transition-all overflow-hidden', isOpen ? 'mt-3 space-y-3' : 'max-h-0 opacity-0 pointer-events-none')}>
                          <div className="grid sm:grid-cols-2 gap-3">
                            {link.dropdown!.map(item => (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => { setOpen(false); setMobileDropdown(null) }}
                                className="block p-3 rounded-xl border bg-card/60 hover:bg-card shadow-sm hover:shadow transition-colors"
                              >
                                <div className="font-medium text-sm mb-1 flex items-center justify-between">
                                  <span>{item.title}</span>
                                  <span className="text-xs text-muted-foreground">{item.category || ''}</span>
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{item.description}</p>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>
            </nav>
            <div className="px-6 py-4 border-t text-xs text-muted-foreground flex items-center justify-between">
              <span>© {new Date().getFullYear()} Toolopia</span>
              <button onClick={()=>setOpen(false)} className="underline hover:text-foreground">Close</button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
