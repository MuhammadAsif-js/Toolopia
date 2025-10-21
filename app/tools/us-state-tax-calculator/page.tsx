"use client"

import AllStatesTaxCalculator from './AllStatesTaxCalculator'
import { ToolHeader } from '@/components/tool-header'

export default function USStateTaxCalculatorPage() {
  return (
    <div className="container py-8 sm:py-12 space-y-8">
      <ToolHeader slug="us-state-tax-calculator" />
      <AllStatesTaxCalculator />
    </div>
  )
}
