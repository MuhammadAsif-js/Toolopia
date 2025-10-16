import React from 'react';
import SmartProfitabilityDashboard from './SmartProfitabilityDashboard';
import { ArticleContent } from '@/components/markdown/ArticleContent';
import dynamic from 'next/dynamic';

const ShellCalculator = dynamic(() => import('./shellPage'), { ssr: false });

export default function SmartProfitabilityDashboardPage() {
  return (
    <main className="bg-gray-900 text-gray-100 min-h-screen py-10">
      <div className="max-w-7xl mx-auto p-4 space-y-20">
        <section aria-label="Profitability Calculator Shell">
          <ShellCalculator />
        </section>
        <section className="space-y-8" aria-label="Advanced Interactive Dashboard">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-2xl font-bold tracking-tight">Advanced Interactive Dashboard</h2>
            <a href="#article" className="text-xs font-medium text-primary hover:underline bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded px-2 py-1">Read guide ↓</a>
          </div>
          <p className="text-sm text-gray-400 max-w-3xl">Dive deeper: import monthly CSV data, explore trends, generate PDF snapshots and view dynamic insights.</p>
          <SmartProfitabilityDashboard />
        </section>
        <section id="article" className="pt-8 border-t border-gray-800">
          <ArticleContent slug="smart-profitability-dashboard" />
        </section>
      </div>
    </main>
  );
}
