"use client"

import { ToolHeader } from '@/components/tool-header'
import FinSmartUSA from './FinSmartUSA'

export default function FinSmartUSAPage() {
  return (
    <div className="container py-8 sm:py-12 space-y-8">
      <ToolHeader slug="fin-smart-usa" />
      <FinSmartUSA />
    </div>
  )
}
