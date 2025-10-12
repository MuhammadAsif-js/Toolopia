import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ReactNode } from 'react'
import { ThemeProvider } from '../components/theme-provider'
import { Navbar } from '../components/navbar'
import { Footer } from '../components/footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://toolopia.tech'),
  title: {
    default: 'Toolopia - Financial Tools & Calculators',
    template: '%s | Toolopia'
  },
  description: 'Premium financial calculators and tools for valuation, profit analysis, currency conversion, and cash flow planning.',
  keywords: [
    'financial tools', 'business valuation', 'profit margin', 'runway calculator', 'currency converter'
  ],
  openGraph: {
    title: 'Toolopia',
    description: 'Premium financial calculators and tools for smarter business decisions.',
    url: 'https://example.com',
    siteName: 'Toolopia',
    images: [
      {
        url: '/og.jpg',
        width: 1200,
        height: 630,
        alt: 'Toolopia'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Toolopia',
    description: 'All-in-one free online tools.',
    images: ['/og.jpg']
  },
  // Favicon is handled by app/icon.png (Next App Router)
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.className}>
      <head>
        <meta name="apple-mobile-web-app-title" content="Toolopia" />
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
            <link rel="manifest" href="/site.webmanifest" />
            <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
            <meta name="msapplication-TileColor" content="#da532c" />
            <meta name="theme-color" content="#ffffff" />
        {/* Set initial theme before React hydration to avoid flash and ensure dark mode works immediately */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(()=>{try{const s=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';const t=localStorage.getItem('theme');const e=t==='system'?s:(t||s);const c=document.documentElement.classList;c.remove('light','dark');if(e==='dark'){c.add('dark')}else{c.add('light')}}catch(e){}})();`
          }}
        />
      </head>
  <body className="bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Navbar />
          <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 min-h-[calc(100vh-160px)]">
            {children}
          </main>
          <Footer />
          <div id="toast-root" />
        </ThemeProvider>
      </body>
    </html>
  )
}
