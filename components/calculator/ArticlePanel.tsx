// components/calculator/ArticlePanel.tsx
"use client";
import React from 'react';
import { Example } from '@/types/calculator';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

interface ArticlePanelProps {
  examples?: Example[];
  chartData?: { x: number; y: number }[];
  onApplyExample?: (values: Record<string, number | string>) => void;
}

export const ArticlePanel: React.FC<ArticlePanelProps> = ({ examples, chartData, onApplyExample }) => {
  return (
    <aside className="rounded-2xl bg-gray-800 border border-gray-700 p-6 shadow-md flex flex-col gap-6">
      <div>
        <h2 className="text-base font-semibold text-gray-100 mb-2">Chart</h2>
        <div className="h-48" role="figure" aria-label="Result projection chart">
          {chartData && chartData.length > 1 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <XAxis dataKey="x" hide />
                <YAxis hide />
                <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid #374151' }} />
                <Line type="monotone" dataKey="y" stroke="#38bdf8" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-gray-500">No data yet</div>
          )}
        </div>
      </div>
      {examples && examples.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-gray-100 mb-2">Examples</h2>
          <ul className="space-y-2">
            {examples.map((ex) => (
              <li key={ex.label}>
                <button
                  onClick={() => onApplyExample && onApplyExample(ex.values)}
                  className="w-full text-left px-3 py-2 rounded-lg bg-gray-700/60 hover:bg-gray-700 text-xs font-medium text-gray-100 focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {ex.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div>
        <h2 className="text-base font-semibold text-gray-100 mb-2">Tips</h2>
        <p className="text-xs text-gray-400 leading-relaxed">Adjust rate & frequency to see compounding acceleration. Daily frequency approximates continuous growth for large N.</p>
      </div>
    </aside>
  );
};
