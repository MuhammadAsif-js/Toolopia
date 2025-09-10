"use client"

import * as React from 'react'
import { useEffect, useState } from 'react'
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
  const [theme, setTheme] = useState<Theme>(defaultTheme)

  useEffect(() => {
    if (theme === 'system' && enableSystem) {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      const system = mq.matches ? 'dark' : 'light'
      applyTheme(system as Theme)
    } else {
      applyTheme(theme)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme])

  function applyTheme(t: Theme) {
    const root = document.documentElement
    const value = t === 'system' ? '' : t
    if (attribute === 'class') {
      root.classList.remove('light', 'dark')
      if (value) root.classList.add(value)
    } else {
      root.setAttribute(attribute, value)
    }
  }

  const value = {
    theme,
    setTheme
  }

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
