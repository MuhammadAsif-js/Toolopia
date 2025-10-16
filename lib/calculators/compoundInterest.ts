// lib/calculators/compoundInterest.ts
import { CalculatorResult } from '../../types/calculator';

export function calculateCompoundInterest({ principal, rate, years, frequency }: any): CalculatorResult {
  // TODO: Add real formula
  // Dummy implementation for demo
  const freq = Number(frequency) || 1;
  const n = freq * Number(years);
  const r = Number(rate) / 100 / freq;
  const p = Number(principal);
  let amount = p * Math.pow(1 + r, n);
  const chartData = Array.from({ length: n + 1 }, (_, i) => ({ x: i, y: Math.round(p * Math.pow(1 + r, i)) }));
  return {
    summary: `Final amount: $${amount.toFixed(2)}`,
    breakdown: {
      Principal: p,
      Rate: rate,
      Years: years,
      Frequency: frequency,
      'Final Amount': amount.toFixed(2)
    },
    chartData
  };
}
