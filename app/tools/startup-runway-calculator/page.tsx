import ToolComponent from './ToolComponent'
import { ToolHeader } from '@/components/tool-header'
import { ArticleLayout } from '@/components/article-layout'
import data from './article.json'
import React from 'react'

export const metadata = {
  title: data?.title ? `${data.title} - Toolopia` : 'Startup Runway Calculator - Toolopia',
  description: data?.subtitle || 'Estimate runway months based on burn rate and runway.'
}

const article = {
  title: data.title,
  description: data.subtitle,
  publishedDate: '2025-10-02',
  category: 'Finance',
  slug: 'startup-runway-calculator',
  href: '/tools/startup-runway-calculator',
  toolComponent: 'StartupRunwayCalculatorPage',
  paragraphs: data.paragraphs,
  faqs: data.faqs.map((faq) => ({ question: faq.q, answer: faq.a })),
}

export default function StartupRunwayCalculatorPage() {
  return (
    <ArticleLayout article={article}>
      <div id="tool-demo">
        <ToolComponent />
      </div>
      {article.paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}

      <h2 className="text-2xl font-bold mt-8 mb-4">FAQs</h2>
      <div className="space-y-4">
        {article.faqs.map((faq, i) => (
          <div key={i}>
            <h3 className="font-semibold">{faq.question}</h3>
            <p className="text-muted-foreground">{faq.answer}</p>
          </div>
        ))}
      </div>
    </ArticleLayout>
  )
}
