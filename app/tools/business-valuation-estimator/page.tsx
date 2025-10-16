"use client";
import { CalculatorShell } from '@/components/calculator/CalculatorShell';
import { ArticleContent } from '@/components/markdown/ArticleContent';
import { CalculatorInput, CalculatorResult, Example } from '@/types/calculator';

// Define inputs for the valuation calculator (business name & industry optional text fields)
const inputs: CalculatorInput[] = [
  { id: 'name', label: 'Business Name', type: 'text', placeholder: 'Acme Corp' },
  { id: 'industry', label: 'Industry', type: 'text', placeholder: 'SaaS / Retail / Services' },
  { id: 'revenue', label: 'Annual Revenue ($)', type: 'number', min: 0, step: 1000, required: true },
  { id: 'profit', label: 'Annual Profit / EBITDA ($)', type: 'number', min: 0, step: 500, required: true },
  { id: 'ebitdaMultiple', label: 'EBITDA Multiple', type: 'number', min: 0, step: 0.1, required: true },
  { id: 'revenueMultiple', label: 'Revenue Multiple', type: 'number', min: 0, step: 0.1, required: true },
];

// Calculation logic mapped to CalculatorResult
function calculateValuation(values: Record<string, any>): CalculatorResult {
  const revenue = Number(values.revenue) || 0;
  const profit = Number(values.profit) || 0;
  const eMult = Number(values.ebitdaMultiple) || 0;
  const rMult = Number(values.revenueMultiple) || 0;
  const ebitdaValuation = profit * eMult;
  const revenueValuation = revenue * rMult;
  const averageValuation = (ebitdaValuation + revenueValuation) / 2;
  const name = values.name as string | undefined;
  const summary = `${name ? name + ': ' : ''}Estimated valuation ≈ $${averageValuation.toLocaleString()}`;
  return {
    summary,
    breakdown: {
      'Revenue ($)': revenue.toLocaleString(),
      'Profit / EBITDA ($)': profit.toLocaleString(),
      'EBITDA Valuation ($)': ebitdaValuation.toLocaleString(),
      'Revenue Valuation ($)': revenueValuation.toLocaleString(),
      'Average ($)': averageValuation.toLocaleString(),
    },
    chartData: [
      { x: 1, y: ebitdaValuation },
      { x: 2, y: revenueValuation },
      { x: 3, y: averageValuation },
    ],
  };
}

const examples: Example[] = [
  { label: 'SaaS Growth Co', values: { name: 'Growthify', industry: 'SaaS', revenue: 750000, profit: 150000, ebitdaMultiple: 7, revenueMultiple: 3 } },
  { label: 'Retail Stable Co', values: { name: 'RetailHub', industry: 'Retail', revenue: 1200000, profit: 180000, ebitdaMultiple: 5.5, revenueMultiple: 2 } },
];

export default function BusinessValuationEstimatorPage() {
  return (
    <CalculatorShell
      title="Business Valuation Estimator"
      description="Estimate a private company value using EBITDA and revenue multiples; compare methods and view a quick midpoint."
      inputs={inputs}
      calculate={calculateValuation}
      examples={examples}
      initialValues={{ revenue: 750000, profit: 150000, ebitdaMultiple: 7, revenueMultiple: 3 }}
  articlePlaceholder={<ArticleContent slug="business-valuation-estimator" />}
    />
  );
}
