// components/calculator/CalculatorShell.tsx
"use client";
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CalculatorInput, CalculatorResult, Example } from '@/types/calculator';
import { InputField } from './InputField';
import { SelectField } from './Select';
import { ResultCard } from './ResultCard';
import { ArticlePanel } from './ArticlePanel';

interface CalculatorShellProps {
  title: string;
  description?: string;
  inputs: CalculatorInput[];
  calculate: (values: Record<string, any>) => CalculatorResult;
  examples?: Example[];
  initialValues?: Record<string, any>;
  articlePlaceholder?: React.ReactNode; // optional section rendered below the calculator
}

export const CalculatorShell: React.FC<CalculatorShellProps> = ({ title, description, inputs, calculate, examples, initialValues, articlePlaceholder }) => {
  const [values, setValues] = useState<Record<string, any>>(() => {
    const base: Record<string, any> = {};
    inputs.forEach(i => { base[i.id] = initialValues?.[i.id] ?? ''; });
    return base;
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CalculatorResult | null>(null);

  const [chartData, setChartData] = useState<{ x: number; y: number }[] | undefined>(undefined);

  const validate = useCallback((id: string, val: any, spec: CalculatorInput): string | undefined => {
    if (spec.required && (val === '' || val === undefined || val === null)) return 'Required';
    if (spec.type === 'number') {
      const num = Number(val);
      if (val !== '' && Number.isNaN(num)) return 'Must be a number';
      if (spec.min !== undefined && num < spec.min) return `Min ${spec.min}`;
      if (spec.max !== undefined && num > spec.max) return `Max ${spec.max}`;
    }
    return undefined;
  }, []);

  const recomputeErrors = useCallback((draftValues: Record<string, any>) => {
    const next: Record<string, string | undefined> = {};
    inputs.forEach(i => { next[i.id] = validate(i.id, draftValues[i.id], i); });
    setErrors(next);
    return next;
  }, [inputs, validate]);

  useEffect(() => {
    recomputeErrors(values);
  }, [values, recomputeErrors]);

  const allValid = useMemo(() => Object.values(errors).every(e => !e), [errors]);

  const handleChange = (id: string, v: string) => {
    setValues(prev => ({ ...prev, [id]: v }));
    setTouched(prev => ({ ...prev, [id]: true }));
  };

  const handleApplyExample = (exampleValues: Record<string, any>) => {
    setValues(prev => ({ ...prev, ...exampleValues }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mark all touched
    const t: Record<string, boolean> = {};
    inputs.forEach(i => { t[i.id] = true; });
    setTouched(t);
    const latestErrors = recomputeErrors(values);
    if (Object.values(latestErrors).some(Boolean)) return;
    setLoading(true);
    setTimeout(() => {
      const res = calculate(values);
      setResult(res);
      setChartData(res.chartData);
      setLoading(false);
    }, 300); // simulate async
  };

  const handleCopy = () => {
    if (!result) return;
    const summaryLines = [result.summary, ...(result.breakdown ? Object.entries(result.breakdown).map(([k,v]) => `${k}: ${v}`) : [])];
    navigator.clipboard.writeText(summaryLines.join('\n')).catch(()=>{});
  };

  return (
    <main className="bg-gray-900 text-gray-100 min-h-screen py-10">
      <div className="max-w-6xl mx-auto p-4 space-y-10">
        <header className="space-y-2">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-1">{title}</h1>
              {description && <p className="text-sm text-gray-400 max-w-2xl">{description}</p>}
            </div>
            {articlePlaceholder && (
              <a href="#article" className="text-xs font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded px-2 py-1 bg-gray-800 hover:bg-gray-700 border border-gray-700">Read guide ↓</a>
            )}
          </div>
        </header>
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6 items-start">
          <section className="space-y-6">
            <div className="grid gap-5">
              {inputs.map(input => (
                input.type === 'select' ? (
                  <SelectField
                    key={input.id}
                    id={input.id}
                    label={input.label}
                    value={values[input.id]}
                    onChange={(v) => handleChange(input.id, v)}
                    options={input.options || []}
                    required={input.required}
                    helperText={input.helperText}
                    error={touched[input.id] ? errors[input.id] : undefined}
                  />
                ) : (
                  <InputField
                    key={input.id}
                    id={input.id}
                    label={input.label}
                    type="number"
                    value={values[input.id]}
                    onChange={(v) => handleChange(input.id, v)}
                    min={input.min}
                    max={input.max}
                    step={input.step}
                    placeholder={input.placeholder}
                    required={input.required}
                    helperText={input.helperText}
                    error={touched[input.id] ? errors[input.id] : undefined}
                  />
                )
              ))}
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={!allValid || loading}
                className="px-4 py-2 rounded-lg font-medium bg-accent text-gray-900 disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-accent transition"
              >
                {loading ? 'Calculating...' : 'Calculate'}
              </button>
              <button
                type="button"
                onClick={() => { setValues({}); setResult(null); setChartData(undefined); }}
                className="px-4 py-2 rounded-lg font-medium bg-gray-700 text-gray-200 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
              >
                Reset
              </button>
            </div>
            <ResultCard loading={loading} result={result} onCopy={handleCopy} />
          </section>
          <ArticlePanel examples={examples} chartData={chartData} onApplyExample={handleApplyExample} />
        </form>
        {articlePlaceholder && (
          <section id="article" className="pt-8 border-t border-gray-800">
            {articlePlaceholder}
          </section>
        )}
      </div>
    </main>
  );
};
