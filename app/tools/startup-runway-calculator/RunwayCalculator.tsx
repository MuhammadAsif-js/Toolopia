"use client";
import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceDot } from 'recharts';

// --------------------------------------------------
// Startup Runway Calculator (Typed)
// --------------------------------------------------
// Net Monthly Burn = Burn Rate - Revenue
// Runway (months) = Current Cash / Net Monthly Burn (only if Net Burn > 0) else Infinity (sustainable)
// Monthly revenue compounds: revenue *= (1 + growth%) each new month
// Funding injected at start of specified month (1-based) before net change
// Cash[m] = Cash[m-1] + (Revenue[m] - Burn) + Funding(if month matches)
// Zero Cash Month: first month where cash <= 0 after applying net change
// --------------------------------------------------

const numberInputClasses = "w-full rounded-md border bg-background/70 backdrop-blur px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 border-border";

interface ProjectionRow {
  month: number;
  cash: number;
  revenue: number;
  burn: number;
  netChange: number;
  funding: number;
}

interface CalcResult {
  runwayMonths: number; // Infinity if sustainable
  zeroCashIndex: number | null; // 1-based month number where cash first <= 0
  zeroCashDateLabel: string; // Human friendly label
  chartData: ProjectionRow[];
  sustainable: boolean;
  warning: boolean; // runway < 6 months (finite)
}

type CurrencySymbol = '$' | '€' | '£';

export default function RunwayCalculator(): JSX.Element {
  // Defaults
  const [currentCash, setCurrentCash] = useState<number>(100000);
  const [monthlyBurn, setMonthlyBurn] = useState<number>(20000);
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(0);
  const [revenueGrowthPct, setRevenueGrowthPct] = useState<number>(0); // monthly % growth
  const [futureFunding, setFutureFunding] = useState<number>(0);
  const [fundingMonth, setFundingMonth] = useState<number>(6); // 1-based month number
  const [horizon, setHorizon] = useState<number>(36);
  const [currency, setCurrency] = useState<CurrencySymbol>('$');

  const nz = (v: number): number => (isNaN(v) || v < 0 ? 0 : v);

  const {
    runwayMonths,
    zeroCashIndex,
    zeroCashDateLabel,
    chartData,
    sustainable,
    warning
  }: CalcResult = useMemo(() => {
    const burn = nz(monthlyBurn);
    let rev = nz(monthlyRevenue);
    const growth = nz(revenueGrowthPct) / 100; // decimal
    const cashStart = nz(currentCash);
    const horizonMonths = Math.min(Math.max(1, nz(horizon)), 240); // clamp horizon
    const inject = nz(futureFunding);
    const injectMonth = nz(fundingMonth); // 1-based index

    const netBurnSimple = burn - rev; // For simple runway calc
    let runway = Infinity;
    if (netBurnSimple > 0) runway = cashStart / netBurnSimple;

    const rows: ProjectionRow[] = [];
    let cash = cashStart;
    let zeroIndex: number | null = null;
    for (let m = 1; m <= horizonMonths; m++) {
      if (m > 1 && growth > 0) {
        rev = rev * (1 + growth); // compound growth
      }
      if (inject > 0 && m === injectMonth) {
        cash += inject; // funding at start
      }
      const netChange = rev - burn;
      cash += netChange;
      rows.push({ month: m, cash, revenue: rev, burn, netChange, funding: (inject > 0 && m === injectMonth) ? inject : 0 });
      if (cash <= 0 && zeroIndex === null) zeroIndex = m;
    }

    const sustainable = netBurnSimple <= 0 && zeroIndex === null;
    let zeroCashDateLabel: string;
    if (zeroIndex !== null) {
      const date = new Date();
      date.setMonth(date.getMonth() + zeroIndex);
      zeroCashDateLabel = date.toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
    } else if (sustainable) {
      zeroCashDateLabel = 'No depletion';
    } else {
      zeroCashDateLabel = 'Not in horizon';
    }

    const warning = runway !== Infinity && runway < 6;

    return { runwayMonths: runway, zeroCashIndex: zeroIndex, zeroCashDateLabel, chartData: rows, sustainable, warning };
  }, [currentCash, monthlyBurn, monthlyRevenue, revenueGrowthPct, futureFunding, fundingMonth, horizon]);

  function fmtMoney(v: number): string {
    if (!isFinite(v)) return '—';
    return currency + v.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  return (
    <div className="space-y-8 min-w-0">
      <header className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Startup Runway Calculator</h1>
        <p className="text-sm text-muted-foreground max-w-2xl">Model your cash runway, revenue growth and funding injection to understand when you may run out of capital.</p>
      </header>
  <div className="grid lg:grid-cols-2 gap-10 min-w-0">
        {/* Inputs */}
  <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur p-6 shadow-sm space-y-6 min-w-0 overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="font-semibold tracking-tight text-lg">Inputs</h2>
              <div className="flex items-center gap-2">
                <select value={currency} onChange={e=>setCurrency(e.target.value as CurrencySymbol)} className="text-xs rounded-md border bg-background/70 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/40">
                  <option value="$">USD ($)</option>
                  <option value="€">EUR (€)</option>
                  <option value="£">GBP (£)</option>
                </select>
                <button
                  onClick={()=>{setCurrentCash(100000);setMonthlyBurn(20000);setMonthlyRevenue(0);setRevenueGrowthPct(0);setFutureFunding(0);setFundingMonth(6);setHorizon(36);}}
                  className="text-xs px-3 py-1.5 rounded-md border bg-background/70 hover:bg-accent/60 transition-colors">Reset</button>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Current Cash Balance">
                <input type="number" min={0} value={currentCash} onChange={e=>setCurrentCash(parseFloat(e.target.value)||0)} className={numberInputClasses} />
              </Field>
              <Field label="Monthly Burn Rate">
                <input type="number" min={0} value={monthlyBurn} onChange={e=>setMonthlyBurn(parseFloat(e.target.value)||0)} className={numberInputClasses} />
              </Field>
              <Field label="Monthly Revenue">
                <input type="number" min={0} value={monthlyRevenue} onChange={e=>setMonthlyRevenue(parseFloat(e.target.value)||0)} className={numberInputClasses} />
              </Field>
              <Field label="Monthly Revenue Growth %">
                <input type="number" min={0} value={revenueGrowthPct} onChange={e=>setRevenueGrowthPct(parseFloat(e.target.value)||0)} className={numberInputClasses} />
              </Field>
              <Field label="Future Funding Amount">
                <input type="number" min={0} value={futureFunding} onChange={e=>setFutureFunding(parseFloat(e.target.value)||0)} className={numberInputClasses} />
              </Field>
              <Field label="Month of Future Funding">
                <input type="number" min={1} value={fundingMonth} onChange={e=>setFundingMonth(parseInt(e.target.value)||1)} className={numberInputClasses} />
              </Field>
              <Field label="Projection Horizon (Months)">
                <input type="number" min={1} max={240} value={horizon} onChange={e=>setHorizon(parseInt(e.target.value)||1)} className={numberInputClasses} />
              </Field>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">Projection compounds monthly revenue growth. Funding injection applies at the start of the target month before burn & revenue impact.</p>
        </div>
        {/* Results & Chart */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur p-6 shadow-sm min-w-0 overflow-hidden">
            <h2 className="font-semibold tracking-tight text-lg mb-4">Results</h2>
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <Result label="Runway (Months)" value={runwayMonths === Infinity ? '∞' : runwayMonths.toFixed(2)} highlight={warning} />
              <Result label="Zero Cash Date" value={zeroCashDateLabel} />
              <Result label="Status" value={runwayMonths === Infinity ? 'Sustainable' : (warning ? '⚠ Short (<6m)' : 'Healthy')} />
            </div>
            {warning && runwayMonths !== Infinity && (
              <p className="mt-4 text-xs font-medium text-destructive">Warning: Less than 6 months of runway. Consider reducing burn or accelerating funding.</p>
            )}
            {runwayMonths === Infinity && (
              <p className="mt-4 text-xs text-emerald-600 dark:text-emerald-400 font-medium">Revenue covers or exceeds burn — no depletion under current assumptions.</p>
            )}
          </div>
          <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur p-6 shadow-sm min-w-0 overflow-hidden">
            <h2 className="font-semibold tracking-tight text-lg mb-4">Cash Balance Projection</h2>
            <div className="h-72 min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v:number)=>currency + (v/1000).toFixed(0)+'k'} />
                  <Tooltip formatter={(v:number)=>fmtMoney(v)} labelFormatter={(l)=>'Month '+l} contentStyle={{background:'hsl(var(--card))', border:'1px solid hsl(var(--border))', borderRadius:8}} />
                  <Line type="monotone" dataKey="cash" stroke="#6366f1" strokeWidth={2} dot={false} name="Cash" />
                  {zeroCashIndex && (
                    <ReferenceDot x={zeroCashIndex} y={0} r={6} stroke="#ef4444" fill="#ef4444" />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid gap-2 text-[11px] text-muted-foreground leading-relaxed">
              <p><span className="font-semibold text-foreground/90">Notes:</span> Blue line shows projected cash after monthly net change (revenue growth & funding injection applied).</p>
              <p>Red dot (if visible) marks the month cash first reaches zero or below.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface FieldProps { label: string; children: React.ReactNode }
function Field({ label, children }: FieldProps) {
  return (
    <label className="text-sm font-medium space-y-1 block">
      <span className="text-foreground/90">{label}</span>
      {children}
    </label>
  );
}

interface ResultProps { label: string; value: string; highlight?: boolean }
function Result({ label, value, highlight }: ResultProps) {
  return (
    <div className={`rounded-lg border border-border/60 bg-background/60 px-3 py-3 flex flex-col gap-1 ${highlight ? 'ring-1 ring-destructive/50' : ''}`}>
      <span className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">{label}</span>
      <span className={`text-base font-semibold ${highlight ? 'text-destructive' : 'text-foreground'}`}>{value}</span>
    </div>
  );
}
