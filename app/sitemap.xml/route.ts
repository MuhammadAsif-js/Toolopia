import { NextResponse } from 'next/server';

export async function GET() {
  // List your URLs here or generate dynamically
  const baseUrl = 'https://yourdomain.com';
  const urls = [
    '',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/tools/currency-converter',
    '/tools/business-valuation-estimator',
    '/tools/profit-analyzer',
    '/tools/startup-runway-calculator',
    '/tools/smart-profitability-dashboard',
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
    .map(
      (url) => `  <url>\n    <loc>${baseUrl}${url}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`
    )
    .join('\n')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
