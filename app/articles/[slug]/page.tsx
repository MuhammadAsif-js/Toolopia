import { notFound } from 'next/navigation';
import { TOOLS } from '@/lib/tools';
import { ArticleLayout } from '@/components/article-layout';
import { Metadata } from 'next';
import React from 'react';
import dynamic from 'next/dynamic';

interface ArticlePageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = TOOLS.find((tool) => tool.slug === params.slug);
  
  if (!article) {
    return {};
  }

  return {
  title: `${article.title} - Toolopia`,
    description: article.description,
    keywords: article.keywords?.join(', '),
    openGraph: {
  title: `${article.title} - Toolopia`,
      description: article.description,
      type: 'article',
      publishedTime: article.publishedDate,
      modifiedTime: article.lastUpdated,
      section: article.category,
  authors: ['Toolopia'],
    },
    twitter: {
      card: 'summary_large_image',
  title: `${article.title} - Toolopia`,
      description: article.description,
    },
  };
}

export function generateStaticParams() {
  return TOOLS.map((tool) => ({
    slug: tool.slug,
  }));
}

/*
 Replace direct server imports of tools with a static mapping of client-only dynamic imports.
 Add any additional tool names here if your app uses more.
*/
const ToolComponents = {
	PdfMerger: dynamic(() => import('../../tools/PdfMerger.js'), { ssr: false }),
	TypingTest: dynamic(() => import('../../tools/TypingTest.js'), { ssr: false }),
	FakeDetector: dynamic(() => import('../../tools/FakeDetector.js'), { ssr: false }),
	CurrencyConverter: dynamic(() => import('../../tools/CurrencyConverter.js'), { ssr: false }),
	PdfToExcel: dynamic(() => import('../../tools/PdfToExcel.js'), { ssr: false }),
	TimeZoneConverter: dynamic(() => import('../../tools/TimeZoneConverter.js'), { ssr: false }),
	ProductivityTool: dynamic(() => import('../../tools/ProductivityTool.js'), { ssr: false }),
	ScreenChecker: dynamic(() => import('../../tools/ScreenChecker.js'), { ssr: false }),
	ImageCompressor: dynamic(() => import('../../tools/ImageCompressor.js'), { ssr: false }),
	ColorTool: dynamic(() => import('../../tools/ColorTool.js'), { ssr: false }),
};

export default function ArticlePage({ params }: ArticlePageProps) {
  const article = TOOLS.find((tool) => tool.slug === params.slug);

  if (!article) {
    notFound();
  }

  // Determine tool name from article data / slug as before
  // e.g. const toolName = article.toolComponentName;
  const toolName = article.toolComponent;

  // Select dynamic component (falls back to null if unknown)
  const DynamicTool = (toolName && (ToolComponents as any)[toolName]) || null;

  return (
    <ArticleLayout article={article}>
      {/* Introduction Section */}
      <section className="mb-12">
        <p className="text-lg text-muted-foreground">
          {article.description}
        </p>
      </section>

      {/* Tool Demo Section */}
      {DynamicTool && (
        <section id="tool-demo" className="mb-16 p-6 bg-card rounded-lg border">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            Try the {article.title}
          </h2>
          <div className="bg-background/50 p-4 rounded-md">
            <DynamicTool />
          </div>
        </section>
      )}

      {/* Article Sections */}
      {article.sections?.map((section, index) => (
        <section 
          key={index} 
          id={section.title.toLowerCase().replace(/[^\w]+/g, '-').replace(/^-+|-+$/g, '')}
          className="mb-12"
        >
          <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
          <div className="prose prose-slate dark:prose-invert max-w-none">
            {section.content ? (
              <p className="text-muted-foreground">{section.content}</p>
            ) : (
              <p className="text-muted-foreground">
                {section.description || 'Content coming soon...'}
              </p>
            )}
          </div>
        </section>
      ))}

      {/* FAQs Section */}
      {article.faqs?.length ? (
        <section className="mt-16">
          <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {article.faqs.map((faq, index) => (
              <div key={index} className="border-b pb-4">
                <h3 className="font-medium text-lg mb-1">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </ArticleLayout>
  );
}
