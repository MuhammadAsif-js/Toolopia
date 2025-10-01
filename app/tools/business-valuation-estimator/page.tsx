"use client";
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ToolHeader } from '@/components/tool-header';
import { AdSlot } from '@/components/ad-slot';
import { Badge } from '@/components/ui/badge';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList } from 'recharts';
import { useToast } from '@/components/toast';

interface FormState {
  name: string;
  industry: string;
  revenue: string; // stored as string for easy controlled input
  profit: string;
  growth: string;
  ebitdaMultiple: string;
  revenueMultiple: string;
}

const initialState: FormState = {
  name: '',
  industry: '',
  revenue: '750000',
  profit: '150000',
  growth: '8',
  ebitdaMultiple: '7',
  revenueMultiple: '3',
};

function useValuation(state: FormState) {
  const revenue = parseFloat(state.revenue) || 0;
  const profit = parseFloat(state.profit) || 0;
  const eMult = parseFloat(state.ebitdaMultiple) || 0;
  const rMult = parseFloat(state.revenueMultiple) || 0;

  const ebitdaValuation = profit * eMult;
  const revenueValuation = revenue * rMult;
  const averageValuation = (ebitdaValuation + revenueValuation) / 2;
  return { revenue, profit, eMult, rMult, ebitdaValuation, revenueValuation, averageValuation };
}

export default function BusinessValuationEstimatorPage() {
  const [form, setForm] = useState<FormState>(initialState);
  const resultRef = useRef<HTMLDivElement | null>(null);
  const { ebitdaValuation, revenueValuation, averageValuation } = useValuation(form);
  const { push, node: toastNode } = useToast();
  const revenueNum = parseFloat(form.revenue) || 0;
  const profitNum = parseFloat(form.profit) || 0;
  const eMultNum = parseFloat(form.ebitdaMultiple) || 0;
  const rMultNum = parseFloat(form.revenueMultiple) || 0;
  const invalid = revenueNum <= 0 || profitNum <= 0 || eMultNum <= 0 || rMultNum <= 0;

  const chartData = useMemo(() => ([
    { label: 'EBITDA', value: ebitdaValuation },
    { label: 'Revenue', value: revenueValuation },
    { label: 'Average', value: averageValuation },
  ]), [ebitdaValuation, revenueValuation, averageValuation]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const copyResults = useCallback(() => {
    const lines = [
      `Business Valuation Report`,
      `Name: ${form.name || '—'}`,
      `Industry: ${form.industry || '—'}`,
      `Annual Revenue: $${Number(form.revenue || 0).toLocaleString()}`,
      `Annual Profit: $${Number(form.profit || 0).toLocaleString()}`,
      `Growth Rate: ${form.growth || 0}%`,
      `EBITDA Multiple: ${form.ebitdaMultiple}`,
      `Revenue Multiple: ${form.revenueMultiple}`,
      `EBITDA Valuation: $${ebitdaValuation.toLocaleString()}`,
      `Revenue Valuation: $${revenueValuation.toLocaleString()}`,
      `Average Valuation: $${averageValuation.toLocaleString()}`,
    ].join('\n');
    navigator.clipboard.writeText(lines).then(() => {
      push('Copied valuation results', 'The valuation summary is now in your clipboard.');
    }).catch(()=> push('Copy failed', 'Could not copy to clipboard'));
  }, [form, ebitdaValuation, revenueValuation, averageValuation, push]);

  const downloadPDF = useCallback(async () => {
    if (!resultRef.current) return;
    try {
      const node = resultRef.current;
      const canvas = await html2canvas(node, { scale: 2, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth - 64; // margin
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.setFontSize(16);
      pdf.text('Business Valuation Report', pageWidth / 2, 40, { align: 'center' });
      pdf.addImage(imgData, 'PNG', 32, 60, imgWidth, Math.min(imgHeight, pageHeight - 100));
      const filename = `${form.name || 'valuation-report'}.pdf`;
      pdf.save(filename);
      push('PDF generated', `Saved as ${filename}`);
    } catch (err) {
      push('PDF failed', 'Could not generate report');
      console.error(err);
    }
  }, [form.name, push]);

  return (
    <div className="container py-8 sm:py-12">
      <div className="space-y-8">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <ToolHeader slug="business-valuation-estimator" />
          </div>
          <div className="w-72 hidden xl:block">
            <AdSlot enabled={false} variant="sidebar" className="w-full h-40" />
          </div>
        </div>
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="p-6 rounded-xl shadow-lg bg-gradient-to-br from-blue-50/60 via-white to-white dark:from-blue-950/30 dark:via-slate-900 dark:to-slate-900 border backdrop-blur">
            <h2 className="text-lg font-semibold mb-4">Input Assumptions</h2>
            <form className="grid gap-4" onSubmit={e=>e.preventDefault()}>
              <div className="grid gap-2">
                <label className="text-xs font-semibold text-muted-foreground">Business Name</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Acme Corp" className="rounded border px-3 py-2 bg-background" />
              </div>
              <div className="grid gap-2">
                <label className="text-xs font-semibold text-muted-foreground">Industry</label>
                <input name="industry" value={form.industry} onChange={handleChange} placeholder="SaaS / Retail / Services" className="rounded border px-3 py-2 bg-background" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-xs font-semibold text-muted-foreground">Annual Revenue ($)</label>
                  <input name="revenue" type="number" min="0" value={form.revenue} onChange={handleChange} className="rounded border px-3 py-2 bg-background" />
                </div>
                <div className="grid gap-2">
                  <label className="text-xs font-semibold text-muted-foreground">Annual Profit / EBITDA ($)</label>
                  <input name="profit" type="number" min="0" value={form.profit} onChange={handleChange} className="rounded border px-3 py-2 bg-background" />
                </div>
              </div>
              <div className="flex flex-wrap gap-3 sm:gap-4 items-end">
                <div className="grid gap-1 w-full sm:w-auto">
                  <label className="text-xs font-semibold text-muted-foreground">Growth Rate (%)</label>
                  <input name="growth" type="number" min="0" value={form.growth} onChange={handleChange} className="rounded border px-3 py-2 bg-background w-36" />
                </div>
                <div className="grid gap-1 w-full sm:w-auto">
                  <label className="text-xs font-semibold text-muted-foreground">EBITDA Multiple</label>
                  <input name="ebitdaMultiple" type="number" step="0.1" min="0" value={form.ebitdaMultiple} onChange={handleChange} className="rounded border px-3 py-2 bg-background w-36" />
                </div>
                <div className="grid gap-1 w-full sm:w-auto">
                  <label className="text-xs font-semibold text-muted-foreground">Revenue Multiple</label>
                  <input name="revenueMultiple" type="number" step="0.1" min="0" value={form.revenueMultiple} onChange={handleChange} className="rounded border px-3 py-2 bg-background w-36" />
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-2">Adjust the multiples based on comparable companies, industry benchmarks, and growth prospects.</div>
            </form>
          </div>
          <div ref={resultRef} className="p-6 rounded-xl shadow-lg bg-white dark:bg-slate-900/70 border relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none opacity-5 bg-[radial-gradient(circle_at_30%_20%,#3b82f6,transparent_60%)]" />
            <div className="relative space-y-4">
              <h2 className="text-lg font-semibold">Valuation Summary</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                <ValuationStat label="EBITDA Valuation" value={ebitdaValuation} accent="bg-blue-500" />
                <ValuationStat label="Revenue Valuation" value={revenueValuation} accent="bg-indigo-500" />
                <ValuationStat label="Average (Suggested)" value={averageValuation} accent="bg-sky-600" highlight />
              </div>
              <div className="h-56 w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="label" tickLine={false} axisLine={false} />
                    <YAxis tickFormatter={(v: number)=>'$'+(v/1000)+'k'} width={60} />
                    <Tooltip formatter={(v:number)=>'$'+v.toLocaleString()} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                    <Bar dataKey="value" radius={[6,6,0,0]} fill="#3b82f6">
                      <LabelList dataKey="value" formatter={(v:number)=>'$'+(v/1000).toFixed(0)+'k'} position="top" className="text-[10px]" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>EBITDA Valuation = Profit × EBITDA Multiple</p>
                <p>Revenue Valuation = Revenue × Revenue Multiple</p>
                <p>Average = (EBITDA Valuation + Revenue Valuation) / 2</p>
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                <button onClick={downloadPDF} disabled={invalid} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-700 text-white rounded-md text-sm font-medium shadow-sm transition">
                  Download PDF
                </button>
                <button onClick={copyResults} disabled={invalid} className="inline-flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-50 rounded-md text-sm font-medium transition">
                  Copy Results
                </button>
              </div>
              {invalid && (
                <div className="text-[11px] text-red-600 dark:text-red-400 font-medium">Enter positive numbers for revenue, profit and multiples to enable export.</div>
              )}
              <div className="text-[10px] text-muted-foreground pt-3">Disclaimer: This simplified estimator is for educational & indicative purposes only and not investment advice.</div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <Badge variant="secondary">Finance</Badge>
          <Badge variant="outline">Valuation</Badge>
          <Badge variant="outline">MVP</Badge>
        </div>
      </div>
      {toastNode}
    </div>
  );
}

function ValuationStat({ label, value, accent, highlight }: { label: string; value: number; accent: string; highlight?: boolean }) {
  return (
    <div className={`p-4 rounded-lg relative overflow-hidden border bg-gradient-to-br ${highlight ? 'from-blue-600 to-blue-500 text-white shadow-lg' : 'from-white to-blue-50 dark:from-slate-900 dark:to-slate-800'}`}>
      <div className="text-[10px] uppercase tracking-wide font-semibold opacity-70 mb-1">{label}</div>
      <div className="text-lg sm:text-xl font-bold tabular-nums">${value.toLocaleString()}</div>
      <span className={`absolute inset-x-0 bottom-0 h-1 ${accent} opacity-60`} />
    </div>
  );
}
