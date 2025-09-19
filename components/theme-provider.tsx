"use client"

import * as React from 'react'
import { useEffect, useState, useCallback } from 'react'
import { cn } from '../lib/utils'

type Theme = 'light' | 'dark' | 'system'

interface ThemeProviderProps {
  children: React.ReactNode
  attribute?: string
  defaultTheme?: Theme
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

export function ThemeProvider({
  children,
  attribute = 'class',
  defaultTheme = 'system',
  enableSystem = true,
  disableTransitionOnChange = false
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return defaultTheme
    const stored = window.localStorage.getItem('theme') as Theme | null
    return stored || defaultTheme
  })

  // Apply theme to document
  const applyTheme = useCallback((t: Theme) => {
    const root = document.documentElement
    const value = t === 'system' ? '' : t
    if (attribute === 'class') {
      root.classList.remove('light', 'dark')
      if (value) root.classList.add(value)
    } else {
      root.setAttribute(attribute, value)
    }
  }, [attribute])

  // Set theme and persist
  const setTheme = useCallback((t: Theme) => {
    setThemeState(t)
    window.localStorage.setItem('theme', t)
    if (t === 'system' && enableSystem) {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      const system = mq.matches ? 'dark' : 'light'
      applyTheme(system as Theme)
    } else {
      applyTheme(t)
    }
  }, [applyTheme, enableSystem])

  // On mount, apply theme and listen for system changes
  useEffect(() => {
    if (theme === 'system' && enableSystem) {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      const system = mq.matches ? 'dark' : 'light'
      applyTheme(system as Theme)
      const handler = (e: MediaQueryListEvent) => {
        if (window.localStorage.getItem('theme') === 'system') {
          applyTheme(e.matches ? 'dark' : 'light')
        }
      }
      mq.addEventListener('change', handler)
      return () => mq.removeEventListener('change', handler)
    } else {
      applyTheme(theme)
    }
  }, [theme, enableSystem, applyTheme])

  const value = React.useMemo(() => ({ theme, setTheme }), [theme, setTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

interface ThemeContextValue {
  theme: Theme
  setTheme: (t: Theme) => void
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined)

export function useTheme() {
  const ctx = React.useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
