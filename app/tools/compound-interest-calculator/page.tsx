"use client";
// app/tools/compound-interest-calculator/page.tsx
import React from 'react';
import { CalculatorShell } from '@/components/calculator/CalculatorShell';
import { calculateCompoundInterest } from '@/lib/calculators/compoundInterest';
import { CalculatorInput, Example } from '@/types/calculator';
import { ArticleContent } from '@/components/markdown/ArticleContent';

const inputs: CalculatorInput[] = [
  { id: 'principal', label: 'Principal ($)', type: 'number', min: 0, step: 100, required: true, helperText: 'Initial amount invested.' },
  { id: 'rate', label: 'Annual Rate (%)', type: 'number', min: 0, step: 0.1, required: true },
  { id: 'years', label: 'Years', type: 'number', min: 1, step: 1, required: true },
  { id: 'frequency', label: 'Compounding', type: 'select', required: true, options: [
    { label: 'Annual', value: 1 },
    { label: 'Quarterly', value: 4 },
    { label: 'Monthly', value: 12 },
    { label: 'Daily', value: 365 },
  ] },
];

const examples: Example[] = [
  { label: 'Starter: 10k @ 5% for 10y (Annual)', values: { principal: 10000, rate: 5, years: 10, frequency: 1 } },
  { label: 'Aggressive: 5k @ 12% for 15y (Monthly)', values: { principal: 5000, rate: 12, years: 15, frequency: 12 } },
];

export default function CompoundInterestCalculatorPage() {
  return (
    <CalculatorShell
      title="Compound Interest Calculator"
      description="Model future value growth under different rates, time horizons and compounding frequencies."
      inputs={inputs}
      calculate={calculateCompoundInterest}
      examples={examples}
      initialValues={{ principal: 10000, rate: 5, years: 10, frequency: 1 }}
  articlePlaceholder={<ArticleContent slug="compound-interest-calculator" />}
    />
  );
}
