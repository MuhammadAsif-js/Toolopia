"use client";
import React, { useMemo } from 'react';
import { CalculatorShell } from '@/components/calculator/CalculatorShell';
import { ArticleContent } from '@/components/markdown/ArticleContent';
import { CalculatorInput, CalculatorResult } from '@/types/calculator';

// A simplified shell-based profitability calculator using aggregated values.

const inputs: CalculatorInput[] = [
  { id: 'monthlyRevenue', label: 'Monthly Revenue ($)', type: 'number', required: true, min: 0, helperText: 'Total revenue for the current month.' },
  { id: 'cogs', label: 'Cost of Goods Sold ($)', type: 'number', required: true, min: 0, helperText: 'Direct production costs.' },
  { id: 'operatingExpenses', label: 'Operating Expenses ($)', type: 'number', required: true, min: 0, helperText: 'Overheads & indirect expenses.' },
  { id: 'otherExpenses', label: 'Other / Extra Expenses ($)', type: 'number', required: false, min: 0, helperText: 'Miscellaneous or one-off costs.' },
  { id: 'growthRate', label: 'Expected Monthly Revenue Growth (%)', type: 'number', required: false, min: -100, helperText: 'Optional projection for next months.' },
  { id: 'months', label: 'Projection Months', type: 'number', required: false, min: 1, max: 36, helperText: 'Forecast horizon (default 12).', placeholder: '12' },
];

function calculate(values: Record<string, any>): CalculatorResult {
  const rev = toNumber(values.monthlyRevenue);
  const cogs = toNumber(values.cogs);
  const op = toNumber(values.operatingExpenses);
  const other = toNumber(values.otherExpenses);
  const growth = toNumber(values.growthRate) / 100;
  const months = toNumber(values.months) || 12;

  const grossProfit = rev - cogs;
  const grossMargin = rev > 0 ? (grossProfit / rev) * 100 : 0;
  const operatingProfit = grossProfit - op - other;
  const netMargin = rev > 0 ? (operatingProfit / rev) * 100 : 0;

  // Projection chart
  const chartData = [] as { x: number; y: number }[];
  let projectedRevenue = rev;
  for (let i = 1; i <= months; i++) {
    chartData.push({ x: i, y: projectedRevenue - (cogs + op + other) });
    projectedRevenue *= 1 + growth;
  }

  const breakdown: Record<string, string> = {
    'Gross Profit': formatCurrency(grossProfit),
    'Gross Margin': grossMargin.toFixed(1) + '%',
    'Operating Profit': formatCurrency(operatingProfit),
    'Net Margin': netMargin.toFixed(1) + '%',
  };

  const summary = `Operating profit is ${formatCurrency(operatingProfit)} (${netMargin.toFixed(1)}% net margin) on revenue ${formatCurrency(rev)}.`;
  return { summary, breakdown, chartData };
}

function toNumber(v: any): number { const n = parseFloat(v); return Number.isFinite(n) ? n : 0; }
function formatCurrency(n: number) { return '$' + n.toLocaleString(undefined, { maximumFractionDigits: 0 }); }

export default function SmartProfitabilityDashboardShellPage() {
  return (
    <CalculatorShell
      title="Smart Profitability Dashboard"
      description="Analyze profitability fundamentals — margins & operating profit — with quick projections before exploring the full interactive dashboard below."
      inputs={inputs}
      calculate={calculate}
      articlePlaceholder={<ArticleContent slug="smart-profitability-dashboard" />}
      examples={[{
        label: 'SaaS Scenario',
        values: { monthlyRevenue: 40000, cogs: 12000, operatingExpenses: 9000, otherExpenses: 1500, growthRate: 4, months: 12 }
      }, {
        label: 'E‑commerce Store',
        values: { monthlyRevenue: 85000, cogs: 51000, operatingExpenses: 14000, otherExpenses: 3000, growthRate: 3, months: 12 }
      }]}
      initialValues={{ monthlyRevenue: 40000, cogs: 12000, operatingExpenses: 9000, otherExpenses: 1500, growthRate: 5, months: 12 }}
    />
  );
}
