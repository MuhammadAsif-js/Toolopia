"use client";
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { useToast } from '@/components/toast';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

type MonthPoint = { month: string; revenue: number; cost: number; extra: number };

const defaultData: MonthPoint[] = [
  { month: 'Jan', revenue: 20000, cost: 12000, extra: 1000 },
  { month: 'Feb', revenue: 22000, cost: 12500, extra: 1200 },
  { month: 'Mar', revenue: 24000, cost: 13000, extra: 1500 },
  { month: 'Apr', revenue: 26000, cost: 13800, extra: 1300 },
  { month: 'May', revenue: 25000, cost: 13600, extra: 1400 },
  { month: 'Jun', revenue: 27000, cost: 14000, extra: 1600 },
  { month: 'Jul', revenue: 30000, cost: 15000, extra: 1700 },
  { month: 'Aug', revenue: 32000, cost: 15500, extra: 1800 },
  { month: 'Sep', revenue: 34000, cost: 16200, extra: 1900 },
  { month: 'Oct', revenue: 36000, cost: 17000, extra: 2100 },
  { month: 'Nov', revenue: 38000, cost: 17600, extra: 2200 },
  { month: 'Dec', revenue: 40000, cost: 18200, extra: 2300 },
];

function useCountUp(value: number, duration = 600) {
  const [display, setDisplay] = useState(0);
  const startRef = useRef<number | null>(null);
  const fromRef = useRef(0);
  useEffect(() => {
    const from = fromRef.current;
    const diff = value - from;
    let raf = 0;
    const step = (t: number) => {
      if (startRef.current === null) startRef.current = t;
      const p = Math.min(1, (t - startRef.current) / duration);
      const eased = 1 - Math.pow(1 - p, 4);
      setDisplay(from + diff * eased);
      if (p < 1) raf = requestAnimationFrame(step);
      else {
        fromRef.current = value;
        startRef.current = null;
      }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return display;
}

function classNames(...xs: Array<string | false | undefined>) {
  return xs.filter(Boolean).join(' ');
}

export default function SmartProfitabilityDashboard() {
  const [data, setData] = useState<MonthPoint[]>(defaultData);
  const last = data[data.length - 1];
  const [rev, setRev] = useState<number>(last.revenue);
  const [cost, setCost] = useState<number>(last.cost);
  const [extra, setExtra] = useState<number>(last.extra);
  const [showPaste, setShowPaste] = useState(false);
  const [pasteText, setPasteText] = useState('month,revenue,cost,extra\nJan,20000,12000,1000');
  const { push, node: toastNode } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const reportRef = useRef<HTMLDivElement | null>(null);

  const totals = useMemo(() => {
    const totalRevenue = data.reduce((s, d) => s + d.revenue, 0);
    const totalExpenses = data.reduce((s, d) => s + d.cost + d.extra, 0);
    const totalProfit = totalRevenue - totalExpenses;
    const margin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
    return { totalRevenue, totalExpenses, totalProfit, margin };
  }, [data]);

  const lastTwo = data.slice(-2);
  const insights = useMemo(() => {
    const msgs: string[] = [];
    if (lastTwo.length === 2) {
      const [prev, curr] = lastTwo;
      const prevProfit = prev.revenue - prev.cost - prev.extra;
      const currProfit = curr.revenue - curr.cost - curr.extra;
      const prevMargin = prev.revenue > 0 ? (prevProfit / prev.revenue) * 100 : 0;
      const currMargin = curr.revenue > 0 ? (currProfit / curr.revenue) * 100 : 0;
      const marginDiff = currMargin - prevMargin;
      if (Math.abs(marginDiff) > 0.25) {
        msgs.push(`Your profit margin ${marginDiff >= 0 ? 'improved' : 'declined'} by ${Math.abs(marginDiff).toFixed(1)}% this month.`);
      }
      const expenseDiff = (curr.cost + curr.extra) - (prev.cost + prev.extra);
      if (expenseDiff > 0) msgs.push('Expenses increased this month. Consider optimizing your variable costs.');
      else if (expenseDiff < 0) msgs.push('Great job reducing expenses compared to last month.');
      if (curr.revenue > prev.revenue) msgs.push('Revenue grew month-over-month — keep the momentum!');
    }
    if (msgs.length === 0) msgs.push('Keep tracking your numbers — consistency drives clarity.');
    return msgs;
  }, [lastTwo]);

  const dispRevenue = useCountUp(totals.totalRevenue);
  const dispProfit = useCountUp(totals.totalProfit);
  const dispMargin = useCountUp(totals.margin);

  const marginColor = totals.margin < 20 ? 'bg-red-500' : totals.margin < 50 ? 'bg-yellow-500' : 'bg-emerald-500';

  function analyze() {
    // Update the latest month with user inputs
    setData(prev => prev.map((d, i) => i === prev.length - 1 ? { ...d, revenue: Math.max(0, rev), cost: Math.max(0, cost), extra: Math.max(0, extra) } : d));
    push('Analysis updated', 'Latest month values applied');
  }

  function parseCSV(text: string): MonthPoint[] {
    // Very lightweight CSV parser skeleton; expects headers: month,revenue,cost,extra
    const lines = text.split(/\r?\n/).map(l=>l.trim()).filter(Boolean);
    if (lines.length < 2) throw new Error('CSV requires a header and at least one row');
    const header = lines[0].toLowerCase().split(',').map(h=>h.trim());
    const mi = header.indexOf('month');
    const ri = header.indexOf('revenue');
    const ci = header.indexOf('cost');
    const ei = header.indexOf('extra');
    if (mi === -1 || ri === -1 || ci === -1 || ei === -1) throw new Error('Headers must include: month,revenue,cost,extra');
    const rows: MonthPoint[] = [];
    for (let i=1;i<lines.length;i++){
      const cols = lines[i].split(',');
      const month = (cols[mi] ?? '').trim();
      const revenue = parseFloat((cols[ri] ?? '0').replace(/[^0-9.\-]/g,'')) || 0;
      const cost = parseFloat((cols[ci] ?? '0').replace(/[^0-9.\-]/g,'')) || 0;
      const extra = parseFloat((cols[ei] ?? '0').replace(/[^0-9.\-]/g,'')) || 0;
      if (!month) continue;
      rows.push({ month, revenue: Math.max(0,revenue), cost: Math.max(0,cost), extra: Math.max(0,extra) });
    }
    if (rows.length === 0) throw new Error('No valid data rows found');
    return rows;
  }

  async function onCSVFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    try{
      const file = e.target.files?.[0];
      if(!file) return;
      const text = await file.text();
      const rows = parseCSV(text);
      setData(rows);
      setRev(rows[rows.length-1].revenue);
      setCost(rows[rows.length-1].cost);
      setExtra(rows[rows.length-1].extra);
      push('CSV imported', `${rows.length} rows loaded`);
    }catch(err:any){
      push('CSV import failed', err?.message ?? 'Invalid CSV');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  function onParsePastedCSV(){
    try{
      const rows = parseCSV(pasteText);
      setData(rows);
      setRev(rows[rows.length-1].revenue);
      setCost(rows[rows.length-1].cost);
      setExtra(rows[rows.length-1].extra);
      push('CSV parsed', `${rows.length} rows loaded`);
    }catch(err:any){
      push('CSV parse failed', err?.message ?? 'Invalid CSV');
    }
  }

  async function downloadPDF(){
    if(!reportRef.current) return;
    try{
      const node = reportRef.current;
      const canvas = await html2canvas(node, { scale: 2, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth - 64; // margins
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.setFontSize(16);
      pdf.text('Smart Profitability Dashboard — Report', pageWidth/2, 40, { align: 'center' });
      pdf.addImage(imgData, 'PNG', 32, 60, imgWidth, Math.min(imgHeight, pageHeight - 100));
      const filename = `profitability-report-${new Date().toISOString().slice(0,10)}.pdf`;
      pdf.save(filename);
      push('PDF generated', `Saved as ${filename}`);
    }catch(err){
      push('PDF failed', 'Could not generate report');
    }
  }

  return (
    <div className="min-h-[70vh] space-y-8 px-2 sm:px-4 lg:px-6" ref={reportRef}>
      {/* Subtle gradient background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(37,99,235,0.08),transparent),radial-gradient(40%_40%_at_100%_20%,rgba(16,185,129,0.08),transparent)]" />

      {/* Header */}
      <header className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 dark:bg-slate-900/60 backdrop-blur border text-sm shadow-sm">
          <span className="font-semibold text-blue-600">Toolopia</span>
          <span className="text-slate-500">Smart Tools for Smarter Workflows</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Smart Profitability Dashboard</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">Premium, modern insights to understand revenue, expenses, and profit — at a glance.</p>
      </header>

  <div className="grid lg:grid-cols-2 gap-8 min-w-0">
        {/* Input Card */}
        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-lg rounded-2xl border shadow-lg hover:shadow-xl transition p-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Input Data</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Revenue (current month)">
              <input type="number" min={0} value={rev} onChange={e=>setRev(parseFloat(e.target.value)||0)} className="w-full rounded-md border bg-white/70 dark:bg-slate-900/60 backdrop-blur px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 border-slate-200 dark:border-slate-700" />
            </Field>
            <Field label="Cost (current month)">
              <input type="number" min={0} value={cost} onChange={e=>setCost(parseFloat(e.target.value)||0)} className="w-full rounded-md border bg-white/70 dark:bg-slate-900/60 backdrop-blur px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 border-slate-200 dark:border-slate-700" />
            </Field>
            <Field label="Extra Expenses (current month)">
              <input type="number" min={0} value={extra} onChange={e=>setExtra(parseFloat(e.target.value)||0)} className="w-full rounded-md border bg-white/70 dark:bg-slate-900/60 backdrop-blur px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 border-slate-200 dark:border-slate-700" />
            </Field>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <button onClick={analyze} className="inline-flex items-center gap-2 rounded-md bg-blue-600 text-white px-4 py-2 text-sm font-medium shadow hover:bg-blue-700 transition">Analyze</button>
            <input ref={fileInputRef} type="file" accept=".csv,text/csv" onChange={onCSVFileSelected} className="hidden" />
            <button onClick={()=>fileInputRef.current?.click()} className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition">Upload CSV</button>
            <button onClick={()=>setShowPaste(v=>!v)} className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition">{showPaste ? 'Hide Paste' : 'Paste CSV'}</button>
            <button onClick={downloadPDF} className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition">Download Report</button>
          </div>
          {showPaste && (
            <div className="mt-4 grid gap-2">
              <textarea value={pasteText} onChange={e=>setPasteText(e.target.value)} rows={4} className="w-full rounded-md border bg-white/70 dark:bg-slate-900/60 backdrop-blur px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 border-slate-200 dark:border-slate-700" placeholder="month,revenue,cost,extra\nJan,20000,12000,1000" />
              <div className="flex items-center gap-2">
                <button onClick={onParsePastedCSV} className="inline-flex items-center gap-2 rounded-md bg-emerald-600 text-white px-3 py-1.5 text-xs font-medium shadow hover:bg-emerald-700 transition">Parse CSV</button>
                <span className="text-[11px] text-slate-500">Headers required: month,revenue,cost,extra</span>
              </div>
            </div>
          )}
        </div>

        {/* Metrics Card */}
        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-lg rounded-2xl border shadow-lg hover:shadow-xl transition p-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Key Metrics</h2>
          <div className="grid sm:grid-cols-3 gap-4 text-sm min-w-0">
            <Metric label="Total Revenue" value={dispRevenue} prefix="$" />
            <Metric label="Total Profit" value={dispProfit} prefix="$" />
            <Metric label="Profit Margin" value={dispMargin} suffix="%" />
          </div>
          {/* Profit Progress */}
          <div className="mt-5">
            <div className="flex items-center justify-between mb-2 text-xs text-slate-600 dark:text-slate-300">
              <span>Profit Health</span>
              <span>{totals.margin.toFixed(1)}%</span>
            </div>
            <div className="h-3 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div className={classNames('h-full transition-all duration-700', marginColor)} style={{ width: `${Math.max(0, Math.min(100, totals.margin))}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Chart Card */}
      <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-lg rounded-2xl border shadow-lg hover:shadow-xl transition p-6">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Revenue vs Expenses (with Profit)</h2>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.map(d=>({ ...d, expenses: d.cost + d.extra, profit: d.revenue - (d.cost + d.extra) }))} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(v:number)=>'$'+(v/1000)+'k'} width={60} />
              <Tooltip formatter={(v:number)=>'$'+v.toLocaleString()} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
              <Legend />
              <Bar dataKey="revenue" fill="#2563EB" radius={[6,6,0,0]} name="Revenue" />
              <Bar dataKey="expenses" fill="#10B981" radius={[6,6,0,0]} name="Expenses" />
              {/* Overlay profit as line for quick scan */}
              <Line type="monotone" dataKey="profit" stroke="#1E293B" strokeWidth={2} dot={false} name="Profit" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insight Box */}
      <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-lg rounded-2xl border shadow-lg hover:shadow-xl transition p-6">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3">Insights</h2>
        <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-200 text-sm">
          {insights.map((msg, i)=> (
            <li key={i}>{msg}</li>
          ))}
        </ul>
      </div>

      <footer className="text-center text-xs text-slate-500 dark:text-slate-400">
        Made with ❤️ by Toolopia • v1.0.0
      </footer>

      {toastNode}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="text-sm font-medium space-y-1 block">
      <span className="text-slate-800 dark:text-slate-100">{label}</span>
      {children}
    </label>
  );
}

function Metric({ label, value, prefix, suffix }: { label: string; value: number; prefix?: string; suffix?: string }) {
  const formatted = Number.isFinite(value) ? (prefix ?? '') + Math.round(value).toLocaleString() + (suffix ?? '') : '—';
  return (
    <div className="rounded-xl border bg-white/70 dark:bg-slate-900/40 backdrop-blur p-4 flex flex-col gap-1 min-w-0 overflow-hidden">
      <span className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400 font-semibold">{label}</span>
      <span className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white tabular-nums truncate">{formatted}</span>
    </div>
  );
}
