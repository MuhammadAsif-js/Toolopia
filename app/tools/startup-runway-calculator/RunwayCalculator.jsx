"use client";
import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceDot } from 'recharts';

// Startup Runway Calculator
// --------------------------------------------------
// Formulas & Logic:
// Net Monthly Burn = Burn Rate - Revenue
// Runway (months) = Current Cash / Net Monthly Burn (if Net Burn > 0)
// Monthly revenue grows each month: revenue = revenue * (1 + growth%)
// Funding injected on specified funding month (1-indexed for UX). Applied at start of that month before burn.
// Cash progression: cash[m] = cash[m-1] + revenue[m] - burn + (funding if month matches)
// Zero Cash Month: first month index where cash <= 0 (post update). If not found in horizon -> none.
// If revenue >= burn and no funding gap, runway considered sustainable (no cash depletion).
// --------------------------------------------------

const numberInputClasses = "w-full rounded-md border bg-background/70 backdrop-blur px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 border-border";

export default function RunwayCalculator() {
  // Defaults
  const [currentCash, setCurrentCash] = useState(100000);
  const [monthlyBurn, setMonthlyBurn] = useState(20000);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [revenueGrowthPct, setRevenueGrowthPct] = useState(0); // monthly % growth
  const [futureFunding, setFutureFunding] = useState(0);
  const [fundingMonth, setFundingMonth] = useState(6); // 1-based month number
  const [horizon, setHorizon] = useState(36);
  const [currency, setCurrency] = useState('$');

  // Sanitization: no negatives
  function nz(v) { return isNaN(v) || v < 0 ? 0 : v; }

  // Core calculations memoized
  const {
    runwayMonths,
    zeroCashIndex,
    zeroCashDateLabel,
    chartData,
    sustainable,
    warning
  } = useMemo(() => {
    const burn = nz(monthlyBurn);
    let rev = nz(monthlyRevenue);
    const growth = nz(revenueGrowthPct) / 100; // convert to decimal
    const cashStart = nz(currentCash);
    const horizonMonths = Math.min(Math.max(1, nz(horizon)), 240); // prevent silly huge horizon
    const inject = nz(futureFunding);
    const injectMonth = nz(fundingMonth); // 1-based

    const netBurnSimple = burn - rev; // used for simple runway
    let runway = Infinity;
    if (netBurnSimple > 0) runway = cashStart / netBurnSimple;

    // Build projection
    const rows = []; // { month: number, cash: number, revenue: number }
    let cash = cashStart;
    let zeroIndex = null;
    for (let m = 1; m <= horizonMonths; m++) {
      // Revenue grows at start of each month (after month 1 baseline) -> compound growth
      if (m > 1 && growth > 0) {
        rev = rev * (1 + growth);
      }
      if (inject > 0 && m === injectMonth) {
        cash += inject; // funding hits before monthly operations
      }
      const netChange = rev - burn; // revenue minus burn
      cash += netChange;
      rows.push({
        month: m,
        cash: cash,
        revenue: rev,
        burn: burn,
        netChange,
        funding: (inject > 0 && m === injectMonth) ? inject : 0
      });
      if (cash <= 0 && zeroIndex === null) zeroIndex = m; // capture first depletion point
    }

    const sustainable = netBurnSimple <= 0 && zeroIndex === null; // not depleting under simple model or projection
    let zeroCashDateLabel = '—';
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

    return {
      runwayMonths: runway,
      zeroCashIndex: zeroIndex,
      zeroCashDateLabel,
      chartData: rows,
      sustainable,
      warning
    };
  }, [currentCash, monthlyBurn, monthlyRevenue, revenueGrowthPct, futureFunding, fundingMonth, horizon]);

  function fmtMoney(v) {
    if (!isFinite(v)) return '—';
    return currency + v.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Startup Runway Calculator</h1>
        <p className="text-sm text-muted-foreground max-w-2xl">Model your cash runway, revenue growth and funding injection to understand when you may run out of capital.</p>
      </header>
      <div className="grid lg:grid-cols-2 gap-10">
        {/* Inputs */}
        <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur p-6 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-semibold tracking-tight text-lg">Inputs</h2>
            <div className="flex items-center gap-2">
              <select value={currency} onChange={e=>setCurrency(e.target.value)} className="text-xs rounded-md border bg-background/70 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/40">
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
          <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur p-6 shadow-sm">
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
          <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur p-6 shadow-sm">
            <h2 className="font-semibold tracking-tight text-lg mb-4">Cash Balance Projection</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v)=>currency + (v/1000).toFixed(0)+'k'} />
                  <Tooltip formatter={(v)=>fmtMoney(v)} labelFormatter={(l)=>'Month '+l} contentStyle={{background:'hsl(var(--card))', border:'1px solid hsl(var(--border))', borderRadius:8}} />
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

function Field({ label, children }) {
  return (
    <label className="text-sm font-medium space-y-1 block">
      <span className="text-foreground/90">{label}</span>
      {children}
    </label>
  );
}

function Result({ label, value, highlight }) {
  return (
    <div className={`rounded-lg border border-border/60 bg-background/60 px-3 py-3 flex flex-col gap-1 ${highlight ? 'ring-1 ring-destructive/50' : ''}`}>
      <span className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">{label}</span>
      <span className={`text-base font-semibold ${highlight ? 'text-destructive' : 'text-foreground'}`}>{value}</span>
    </div>
  );
}
