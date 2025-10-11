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
  },
  {
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
  },
  {
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
  },
  {
    title: 'Smart Profitability Dashboard',
    description: 'Premium dashboard to analyze revenue, expenses, profit, and margins with visual insights.',
    slug: 'smart-profitability-dashboard',
    href: '/tools/smart-profitability-dashboard',
    category: 'Finance',
    featured: true,
    toolComponent: 'SmartProfitabilityDashboardPage',
    publishedDate: '2025-10-04',
    keywords: ['profit', 'margin', 'dashboard', 'analytics'],
    difficulty: 'beginner',
    useCases: ['Monthly review', 'Financial snapshot', 'Stakeholder updates'],
    icon: '💹'
  }
]
