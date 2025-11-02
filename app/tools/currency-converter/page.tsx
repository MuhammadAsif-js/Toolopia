import React from 'react'
import ToolComponent from './ToolComponent'
import { ArticleLayout } from '@/components/article-layout'
import data from './article.json'

export const metadata = {
  title: data?.title ? `${data.title} - Toolopia` : 'Currency Converter - Toolopia',
  description: data?.subtitle || 'Convert between major currencies with live exchange rates.'
}

const article = {
  title: data.title,
  description: data.subtitle,
  publishedDate: '2023-04-18',
  category: 'Finance',
  slug: 'currency-converter',
  href: '/tools/currency-converter',
  toolComponent: 'CurrencyConverter',
  paragraphs: data.paragraphs,
  faqs: (data.faqs || []).map((faq: any) => ({ question: faq.q, answer: faq.a })),
}

export default function CurrencyConverterPage() {
  return (
    <ArticleLayout article={article as any}>
      <div id="tool-demo">
        <ToolComponent />
      </div>

      {article.paragraphs?.map((p: string, i: number) => (
        <p key={i}>{p}</p>
      ))}

      {article.faqs && article.faqs.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mt-8 mb-4">FAQs</h2>
          <div className="space-y-4">
            {article.faqs.map((faq: any, i: number) => (
              <div key={i}>
                <h3 className="font-semibold">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </ArticleLayout>
  )
}
