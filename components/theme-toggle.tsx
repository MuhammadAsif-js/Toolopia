"use client"

import { useTheme } from './theme-provider'
import { Sun, Moon, Monitor } from 'lucide-react'

import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'
  let icon = <Monitor className="w-5 h-5" />
  if (theme === 'light') icon = <Sun className="w-5 h-5" />
  if (theme === 'dark') icon = <Moon className="w-5 h-5" />
  return (
    <button
      onClick={() => setTheme(nextTheme)}
      className="inline-flex items-center justify-center w-9 h-9 rounded-md border hover:bg-accent transition-colors"
      aria-label="Toggle Theme"
      title={`Switch to ${nextTheme} mode`}
    >
      {mounted ? icon : null}
    </button>
  )
}
