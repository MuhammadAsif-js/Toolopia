"use client"
import Analyzer from './tool'
import { ToolHeader } from '@/components/tool-header'

export default function ProfitAnalyzerPage(){
  return (
    <div className="container py-8 sm:py-12 space-y-8">
      <ToolHeader slug="profit-analyzer" />
      <Analyzer />
    </div>
  )
}
