import { ArticleLayout } from '@/components/article-layout'
import ToolComponent from './ToolComponent'
import data from './article.json'
import React from 'react'

export const metadata = {
  title: data?.title ? `${data.title} - Toolopia` : 'Profit Analyzer - Toolopia',
  description: data?.subtitle || 'Analyze profit margins and break-even points.',
}

const article = {
  title: data.title,
  description: data.subtitle,
  publishedDate: '2025-10-02',
  category: 'Finance',
  slug: 'profit-analyzer',
  href: '/tools/profit-analyzer',
  toolComponent: 'ProfitAnalyzerPage',
  paragraphs: data.paragraphs,
  faqs: [],
}

export default function ProfitAnalyzerPage() {
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
