import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ReactNode } from 'react'
import { ThemeProvider } from '../components/theme-provider'
import { Navbar } from '../components/navbar'
import { Footer } from '../components/footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Toolopia - Free Online Tools',
    template: '%s | Toolopia'
  },
  description: 'All-in-one toolbox: image compression, PDF conversion, and more. Fast, free, and privacy-friendly.',
  keywords: [
    'online tools', 'image compressor', 'pdf to excel', 'file converter', 'free tools'
  ],
  openGraph: {
    title: 'Toolopia',
    description: 'Compress images, convert PDFs, and more with a fast, modern UI.',
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
  icons: {
    icon: '/favicon.ico'
  }
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-title" content="Toolopia" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Navbar />
          <main className="pt-16 min-h-[calc(100vh-160px)]">{children}</main>
          <Footer />
          <div id="toast-root" />
        </ThemeProvider>
      </body>
    </html>
  )
}
