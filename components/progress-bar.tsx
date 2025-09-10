"use client"
import { cn } from '../lib/utils'

interface ProgressBarProps {
  value: number // 0-100
  className?: string
  height?: string
}

export function ProgressBar({ value, className, height = 'h-2' }: ProgressBarProps) {
  return (
    <div className={cn('w-full overflow-hidden rounded-full bg-muted', height, className)} aria-valuemin={0} aria-valuemax={100} aria-valuenow={value} role="progressbar">
      <div className="bg-primary h-full transition-all" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  )
}