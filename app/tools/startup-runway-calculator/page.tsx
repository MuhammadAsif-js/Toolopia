"use client";
import React from 'react';
import { CalculatorShell } from '@/components/calculator/CalculatorShell';
import { ArticleContent } from '@/components/markdown/ArticleContent';
import { CalculatorInput, CalculatorResult, Example } from '@/types/calculator';

const inputs: CalculatorInput[] = [
  { id: 'currentCash', label: 'Current Cash ($)', type: 'number', min: 0, step: 1000, required: true },
  { id: 'monthlyBurn', label: 'Monthly Burn ($)', type: 'number', min: 0, step: 500, required: true },
  { id: 'monthlyRevenue', label: 'Monthly Revenue ($)', type: 'number', min: 0, step: 500, required: true },
  { id: 'revenueGrowthPct', label: 'Monthly Revenue Growth (%)', type: 'number', min: 0, step: 0.5 },
  { id: 'futureFunding', label: 'Future Funding ($)', type: 'number', min: 0, step: 1000 },
  { id: 'fundingMonth', label: 'Funding Month (1=next)', type: 'number', min: 1, step: 1 },
  { id: 'horizon', label: 'Projection Horizon (Months)', type: 'number', min: 1, max: 240, step: 1, required: true },
];

function calculateRunway(values: Record<string, any>): CalculatorResult {
  let cash = Number(values.currentCash) || 0;
  const burn = Number(values.monthlyBurn) || 0;
  let rev = Number(values.monthlyRevenue) || 0;
  const growth = (Number(values.revenueGrowthPct) || 0) / 100;
  const funding = Number(values.futureFunding) || 0;
  const fundingMonth = Number(values.fundingMonth) || 0; // 1-based
  const horizon = Math.min(Math.max(1, Number(values.horizon) || 1), 240);
  const simpleNetBurn = burn - rev;
  let simpleRunway = Infinity;
  if (simpleNetBurn > 0) simpleRunway = cash / simpleNetBurn;
  const chart: { x: number; y: number }[] = [];
  let zeroMonth: number | null = null;
  for (let m = 1; m <= horizon; m++) {
    if (growth > 0 && m > 1) rev = rev * (1 + growth);
    if (funding > 0 && m === fundingMonth) cash += funding;
    cash += rev - burn;
    chart.push({ x: m, y: cash });
    if (cash <= 0 && zeroMonth === null) zeroMonth = m;
  }
  let zeroLabel: string;
  if (zeroMonth) {
    const date = new Date();
    date.setMonth(date.getMonth() + zeroMonth);
    zeroLabel = date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
  } else if (simpleNetBurn <= 0) {
    zeroLabel = 'Sustainable';
  } else {
    zeroLabel = 'Not in horizon';
  }
  const summary = simpleRunway === Infinity ? 'Runway: Sustainable (revenue covers burn)' : `Approx. Runway: ${simpleRunway.toFixed(1)} months`;
  return {
    summary,
    breakdown: {
      'Current Cash ($)': (Number(values.currentCash) || 0).toLocaleString(),
      'Monthly Burn ($)': burn.toLocaleString(),
      'Monthly Revenue ($)': (Number(values.monthlyRevenue) || 0).toLocaleString(),
      'Revenue Growth (%)': (Number(values.revenueGrowthPct) || 0).toFixed(2),
      'Future Funding ($)': funding.toLocaleString(),
      'Funding Month': fundingMonth || '—',
      'Zero Cash': zeroLabel,
    },
    chartData: chart,
  };
}

const examples: Example[] = [
  { label: 'Default Scenario', values: { currentCash: 100000, monthlyBurn: 20000, monthlyRevenue: 0, revenueGrowthPct: 0, futureFunding: 0, fundingMonth: 6, horizon: 36 } },
  { label: 'Growing Revenue + Funding', values: { currentCash: 75000, monthlyBurn: 25000, monthlyRevenue: 5000, revenueGrowthPct: 10, futureFunding: 50000, fundingMonth: 4, horizon: 24 } },
];

export default function StartupRunwayCalculatorPage(){
  return (
    <CalculatorShell
      title="Startup Runway Calculator"
      description="Project cash runway under growth and funding scenarios to anticipate depletion and plan raises."
      inputs={inputs}
      calculate={calculateRunway}
      examples={examples}
      initialValues={{ currentCash: 100000, monthlyBurn: 20000, monthlyRevenue: 0, revenueGrowthPct: 0, futureFunding: 0, fundingMonth: 6, horizon: 36 }}
  articlePlaceholder={<ArticleContent slug="startup-runway-calculator" />}
    />
  );
}
