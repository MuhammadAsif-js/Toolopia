"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { cn } from '../lib/utils'
import { ThemeToggle } from './theme-toggle'

import { TOOLS } from '@/lib/tools';

const navLinks = [
  { href: '/', label: 'Home' },
  { 
    href: '/tools', 
    label: 'Tools',
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
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' }
]

export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur border-b bg-background/70">
      <div className="container flex h-16 items-center justify-between">
  <Link href="/" className="font-bold text-lg gradient-text">Toolopia</Link>
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <div key={link.href} className="relative group">
              <Link 
                href={link.href} 
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary', 
                  pathname === link.href && 'text-primary',
                  'flex items-center gap-1 py-2'
                )}
              >
                {link.label}
                {link.dropdown && (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </Link>
              
              {link.dropdown && (
                <div className="absolute left-0 mt-1 w-64 rounded-md shadow-lg bg-popover border z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="p-2">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-1.5">
                      Featured Tools
                    </h3>
                    <div className="mt-1 space-y-1">
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                          <div className="font-medium">{item.title}</div>
                          <div className="text-xs text-muted-foreground line-clamp-1">
                            {item.description}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
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
        <div className="md:hidden border-t bg-background/95 backdrop-blur animate-in slide-in-from-top">
          <div className="container py-4 flex flex-col gap-4">
            {navLinks.map(link => (
            <div key={link.href}>
              <Link 
                href={link.href} 
                onClick={() => setOpen(false)} 
                className={cn('text-sm font-medium block py-2', pathname === link.href && 'text-primary')}
              >
                {link.label}
              </Link>
              {link.dropdown && (
                <div className="pl-4 mt-1 space-y-2 border-l border-border ml-2">
                  {link.dropdown.map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block text-sm text-muted-foreground hover:text-foreground py-1"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          </div>
        </div>
      )}
    </header>
  )
}
