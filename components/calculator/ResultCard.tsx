// components/calculator/ResultCard.tsx
"use client";
import React from 'react';
import { CalculatorResult } from '@/types/calculator';

interface ResultCardProps {
  loading: boolean;
  result: CalculatorResult | null;
  onCopy?: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ loading, result, onCopy }) => {
  return (
    <div className="rounded-2xl bg-gray-800 border border-gray-700 p-6 shadow-md flex flex-col gap-4 min-h-[240px]">
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-lg font-semibold text-gray-100">Result</h2>
        {onCopy && (
          <button
            onClick={onCopy}
            className="px-3 py-1.5 rounded-md bg-accent text-gray-900 text-xs font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent"
          >
            Copy
          </button>
        )}
      </div>
      {loading && (
        <p className="text-sm text-gray-400 animate-pulse">Calculating...</p>
      )}
      {!loading && !result && <p className="text-sm text-gray-500">Enter values and click Calculate to see results.</p>}
      {!loading && result && (
        <div className="space-y-3">
          <p className="text-sm text-gray-100 font-medium">{result.summary}</p>
          {result.breakdown && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-300">
              {Object.entries(result.breakdown).map(([k, v]) => (
                <React.Fragment key={k}>
                  <span className="font-medium text-gray-400">{k}</span>
                  <span className="text-right tabular-nums">{v as any}</span>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
