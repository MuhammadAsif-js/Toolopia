import ToolComponent from './ToolComponent'
import { ToolHeader } from '@/components/tool-header'
import { ArticleLayout } from '@/components/article-layout'
import data from './article.json'
import React from 'react'

export const metadata = {
  title: data?.title ? `${data.title} - Toolopia` : 'US State Tax Calculator - Toolopia',
  description: data?.subtitle || 'Estimate state income tax across US states.'
}

const article = {
  title: data.title,
  description: data.subtitle,
  publishedDate: '2025-10-19',
  category: 'Finance',
  slug: 'us-state-tax-calculator',
  href: '/tools/us-state-tax-calculator',
  toolComponent: 'USStateTaxCalculatorPage',
  paragraphs: data.paragraphs,
  faqs: [],
}

export default function USStateTaxCalculatorPage() {
  return (
    <ArticleLayout article={article}>
      <div id="tool-demo">
        <ToolComponent />
      </div>
      {article.paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </ArticleLayout>
  )
}
