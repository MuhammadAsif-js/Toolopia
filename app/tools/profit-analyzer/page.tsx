"use client";
import React from 'react';
import { CalculatorShell } from '@/components/calculator/CalculatorShell';
import { ArticleContent } from '@/components/markdown/ArticleContent';
import { CalculatorInput, CalculatorResult, Example } from '@/types/calculator';

// Inputs mapping for Profit Analyzer
const inputs: CalculatorInput[] = [
  { id: 'revenue', label: 'Revenue ($)', type: 'number', min: 0, step: 100, required: true },
  { id: 'netProfit', label: 'Net Profit ($)', type: 'number', min: 0, step: 100, required: true },
  { id: 'fixedCosts', label: 'Fixed Costs ($)', type: 'number', min: 0, step: 100, required: true },
  { id: 'sellingPrice', label: 'Selling Price / Unit ($)', type: 'number', min: 0, step: 1, required: true },
  { id: 'variableCost', label: 'Variable Cost / Unit ($)', type: 'number', min: 0, step: 1, required: true },
];

function calculateProfit(values: Record<string, any>): CalculatorResult {
  const revenue = Number(values.revenue) || 0;
  const netProfit = Number(values.netProfit) || 0;
  const fixedCosts = Number(values.fixedCosts) || 0;
  const sellingPrice = Number(values.sellingPrice) || 0;
  const variableCost = Number(values.variableCost) || 0;
  const priceGap = sellingPrice - variableCost;
  const invalid = priceGap <= 0;
  const profitMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0;
  const breakEvenUnits = invalid ? 0 : fixedCosts / priceGap;
  const breakEvenRevenue = breakEvenUnits * sellingPrice;
  // Build minimal chart dataset (units vs revenue & cost collapsed – represent break-even point)
  const chartData = invalid ? undefined : Array.from({ length: 12 }).map((_, i) => {
    const u = Math.round((i / 11) * breakEvenUnits * 1.4);
    const rev = u * sellingPrice;
    const cost = fixedCosts + variableCost * u;
    // We only plot revenue line: using y = profit difference for projection (simplified)
    return { x: u, y: rev - cost };
  });
  return {
    summary: invalid ? 'Enter a selling price greater than variable cost to compute break-even.' : `Break-even at ~${breakEvenUnits.toFixed(2)} units | Profit Margin ${profitMargin.toFixed(2)}%`,
    breakdown: {
      'Revenue ($)': revenue.toLocaleString(),
      'Net Profit ($)': netProfit.toLocaleString(),
      'Profit Margin (%)': profitMargin.toFixed(2),
      'Fixed Costs ($)': fixedCosts.toLocaleString(),
      ...(invalid ? {} : {
        'Break-Even Units': breakEvenUnits.toFixed(2),
        'Break-Even Revenue ($)': breakEvenRevenue.toFixed(2),
      })
    },
    chartData,
  };
}

const examples: Example[] = [
  { label: 'Retail Example', values: { revenue: 10000, netProfit: 2000, fixedCosts: 5000, sellingPrice: 50, variableCost: 20 } },
  { label: 'Low Margin Scenario', values: { revenue: 15000, netProfit: 1200, fixedCosts: 7000, sellingPrice: 40, variableCost: 30 } },
];

export default function ProfitAnalyzerPage() {
  return (
    <CalculatorShell
      title="Profit Margin & Break-Even Analyzer"
      description="Analyze unit economics: compute profit margin, break-even units and revenue, then iterate with scenario examples."
      inputs={inputs}
      calculate={calculateProfit}
      examples={examples}
      initialValues={{ revenue: 10000, netProfit: 2000, fixedCosts: 5000, sellingPrice: 50, variableCost: 20 }}
  articlePlaceholder={<ArticleContent slug="profit-analyzer" />}
    />
  );
}
