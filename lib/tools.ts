export interface ArticleMetadata {
  title: string
  description: string
  slug: string
  category: string
  featured?: boolean
  publishedDate?: string
  lastUpdated?: string
  readingTime?: number
  keywords?: string[]
  coverImage?: string
  sections?: {
    title: string
    description: string
    content?: string
  }[]
  faqs?: {
    question: string
    answer: string
  }[]
}

export interface ToolMeta extends ArticleMetadata {
  href: string
  toolComponent: string
  relatedTools?: string[]
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  useCases?: string[]
  prerequisites?: string[]
  icon?: string // emoji or simple identifier
}

export const TOOLS: ToolMeta[] = [
  { 
    title: 'Image Compressor', 
    description: 'Learn how to compress images intelligently in your browser with our comprehensive guide and tool.', 
    slug: 'image-compressor',
    href: '/tools/image-compressor', 
    category: 'Image', 
    featured: true,
    toolComponent: 'ImageCompressor',
    publishedDate: '2023-01-15',
    keywords: ['image compression', 'reduce image size', 'web optimization', 'photo resizer'],
    difficulty: 'beginner',
    useCases: ['Website optimization', 'Email attachments', 'Social media posts'],
    icon: '🖼️',
    sections: [
      {
        title: 'Why Compress Images?',
        description: 'Understanding the importance of image optimization for web performance and user experience.'
      },
      {
        title: 'How to Use This Tool',
        description: 'Step-by-step guide on using our image compression tool effectively.'
      }
    ]
  },
  { 
    title: 'PDF to Excel Converter', 
    description: 'Extract and convert tables from PDF files to Excel format with our easy-to-use tool and guide.', 
    slug: 'pdf-to-excel',
    href: '/tools/pdf-to-excel', 
    category: 'PDF', 
    featured: true,
    toolComponent: 'PdfToExcel',
    publishedDate: '2023-02-20',
    keywords: ['PDF to Excel', 'table extraction', 'data conversion', 'PDF converter'],
    difficulty: 'intermediate',
    useCases: ['Data analysis', 'Report generation', 'Financial records'],
    icon: '📊'
  },
  { 
    title: 'Time Zone Converter', 
    description: 'Easily convert times between different time zones with our interactive tool and comprehensive guide.', 
    slug: 'time-zone-converter',
    href: '/tools/time-zone-converter', 
    category: 'Utility',
    toolComponent: 'TimeZoneConverter',
    publishedDate: '2023-03-10',
    keywords: ['time zone', 'time converter', 'world clock', 'meeting planner'],
    icon: '⏰'
  },
  { 
    title: 'Color Picker & Converter', 
    description: 'Explore, pick, and convert between color formats with our comprehensive color tool and guide.', 
    slug: 'color-tool',
    href: '/tools/color-tool', 
    category: 'Design', 
    featured: true,
    toolComponent: 'ColorTool',
    publishedDate: '2023-04-05',
    keywords: ['color picker', 'color converter', 'hex to rgb', 'color palette'],
    icon: '🎨'
  },
  { 
    title: 'Currency Converter', 
    description: 'Convert between world currencies with live exchange rates using our reliable currency conversion tool.', 
    slug: 'currency-converter',
    href: '/tools/currency-converter', 
    category: 'Finance', 
    featured: true,
    toolComponent: 'CurrencyConverter',
    publishedDate: '2023-04-18',
    keywords: ['currency exchange', 'forex', 'money converter', 'exchange rates'],
    icon: '💱'
  },
  { 
    title: 'Fake Content Detector', 
    description: 'Learn how to identify fake or AI-generated content with our detection tool and expert guide.', 
    slug: 'fake-detector',
    href: '/tools/fake-detector', 
    category: 'Security',
    toolComponent: 'FakeDetector',
    publishedDate: '2023-05-22',
    keywords: ['AI detection', 'fake news', 'content verification', 'deepfake detection'],
    icon: '🔍'
  },
  { 
    title: 'PDF Merger', 
    description: 'Combine multiple PDF files into a single document with our easy-to-use merging tool and tutorial.', 
    slug: 'pdf-merger',
    href: '/tools/pdf-merger', 
    category: 'PDF',
    toolComponent: 'PdfMerger',
    publishedDate: '2023-06-15',
    keywords: ['merge PDF', 'combine PDF', 'PDF tools', 'document management'],
    icon: '🧩'
  },
  { 
    title: 'Typing Speed Test', 
    description: 'Test and improve your typing speed and accuracy with our interactive typing test and practice guide.', 
    slug: 'typing-test',
    href: '/tools/typing-test', 
    category: 'Productivity',
    toolComponent: 'TypingTest',
    publishedDate: '2023-07-10',
    keywords: ['typing speed', 'WPM test', 'keyboard practice', 'typing tutor'],
    icon: '⌨️'
  },
    {
      title: 'Productivity Tool (Pomodoro)',
      description: 'Boost your productivity with a Pomodoro timer, task manager, and session tracker—all in one tool.',
      slug: 'productivitytool',
      href: '/tools/productivitytool',
      category: 'Productivity',
      featured: false,
      toolComponent: 'ProductivityTool',
      publishedDate: '2023-08-01',
      keywords: ['pomodoro', 'productivity', 'task manager', 'focus timer'],
      difficulty: 'beginner',
      useCases: ['Time management', 'Task tracking', 'Focus sessions'],
      icon: '🍅'
    },
    {
      title: 'Screen Checker',
      description: 'Check your screen resolution and size instantly with this simple tool.',
      slug: 'screen-checker',
      href: '/tools/screen-checker',
      category: 'Utility',
      featured: false,
      toolComponent: 'ScreenChecker',
      publishedDate: '2023-08-01',
      keywords: ['screen size', 'resolution', 'display info'],
      difficulty: 'beginner',
      useCases: ['Web design', 'Device testing', 'UI debugging'],
      icon: '🖥️'
    }
    ,{
      title: 'Business Valuation Estimator',
      description: 'Estimate a private business valuation using EBITDA & Revenue multiples with a clean visual summary.',
      slug: 'business-valuation-estimator',
      href: '/tools/business-valuation-estimator',
      category: 'Finance',
      featured: true,
      toolComponent: 'BusinessValuationEstimator',
      publishedDate: '2025-10-01',
      keywords: ['valuation', 'EBITDA', 'revenue multiple', 'finance'],
      difficulty: 'beginner',
      useCases: ['Startup valuation', 'Preliminary appraisal', 'Investor pitch prep'],
      icon: '💼'
    }
    ,{
      title: 'Profit Margin & Break-Even Analyzer',
      description: 'Compute profit margin, break-even units and revenue with a visual cost & revenue chart.',
      slug: 'profit-analyzer',
      href: '/tools/profit-analyzer',
      category: 'Finance',
      featured: true,
      toolComponent: 'ProfitAnalyzerPage',
      publishedDate: '2025-10-02',
      keywords: ['profit margin', 'break-even', 'finance analysis', 'cost structure'],
      difficulty: 'beginner',
      useCases: ['Pricing validation', 'Startup financials', 'Unit economics'],
      icon: '📈'
    }
    ,{
      title: 'Startup Runway Calculator',
      description: 'Model cash runway with revenue growth and future funding injection to anticipate depletion risk.',
      slug: 'startup-runway-calculator',
      href: '/tools/startup-runway-calculator',
      category: 'Finance',
      featured: true,
      toolComponent: 'StartupRunwayCalculatorPage',
      publishedDate: '2025-10-02',
      keywords: ['runway', 'startup', 'cash flow', 'finance'],
      difficulty: 'beginner',
      useCases: ['Fundraising planning', 'Burn analysis', 'Scenario modeling'],
      icon: '🚀'
    }
]
