"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import CountUp from "react-countup";

type Bracket = { upTo: number | null; rate: number };

/**
 * All-States Tax Calculator (MVP)
 * - JSON-based tax data (federal + states)
 * - Single state selector
 * - Animated results panel (CountUp + Framer Motion)
 * - Bar chart for tax breakdown (federal vs state vs net)
 */

/* -------------------------
   Sample TAX DATA (editable)
   ------------------------- */
const TAX_DATA: {
  federal: { single: Bracket[]; married: Bracket[] };
  states: Record<string, { brackets?: Bracket[]; single?: Bracket[]; married?: Bracket[] }>;
} = {
  federal: {
    single: [
      { upTo: 11000, rate: 0.1 },
      { upTo: 44725, rate: 0.12 },
      { upTo: 95375, rate: 0.22 },
      { upTo: 182100, rate: 0.24 },
      { upTo: 231250, rate: 0.32 },
      { upTo: 578125, rate: 0.35 },
      { upTo: null, rate: 0.37 },
    ],
    married: [
      { upTo: 22000, rate: 0.1 },
      { upTo: 89450, rate: 0.12 },
      { upTo: 190750, rate: 0.22 },
      { upTo: 364200, rate: 0.24 },
      { upTo: 462500, rate: 0.32 },
      { upTo: 693750, rate: 0.35 },
      { upTo: null, rate: 0.37 },
    ],
  },
  states: {
  Alabama: { single: [{ upTo: 500, rate: 0.02 }, { upTo: 3000, rate: 0.04 }, { upTo: null, rate: 0.05 }], married: [{ upTo: 1000, rate: 0.02 }, { upTo: 6000, rate: 0.04 }, { upTo: null, rate: 0.05 }] },
  Alaska: { brackets: [{ upTo: null, rate: 0 }] },
    Arizona: { brackets: [{ upTo: null, rate: 0.025 }] },
    Arkansas: { brackets: [{ upTo: 4400, rate: 0.02 }, { upTo: 8800, rate: 0.04 }, { upTo: null, rate: 0.049 }] },
    California: {
      single: [
        { upTo: 10000, rate: 0.01 },
        { upTo: 25000, rate: 0.02 },
        { upTo: 50000, rate: 0.04 },
        { upTo: 100000, rate: 0.06 },
        { upTo: 200000, rate: 0.08 },
        { upTo: 1000000, rate: 0.093 },
        { upTo: null, rate: 0.123 },
      ],
      married: [
        { upTo: 20000, rate: 0.01 },
        { upTo: 50000, rate: 0.02 },
        { upTo: 100000, rate: 0.04 },
        { upTo: 200000, rate: 0.06 },
        { upTo: 400000, rate: 0.08 },
        { upTo: 1000000, rate: 0.093 },
        { upTo: null, rate: 0.123 },
      ],
    },
    Colorado: { brackets: [{ upTo: null, rate: 0.045 }] },
    Connecticut: { brackets: [{ upTo: 10000, rate: 0.03 }, { upTo: 50000, rate: 0.05 }, { upTo: 100000, rate: 0.055 }, { upTo: 200000, rate: 0.06 }, { upTo: null, rate: 0.069 }] },
    Delaware: { brackets: [{ upTo: 2000, rate: 0.022 }, { upTo: 5000, rate: 0.039 }, { upTo: 10000, rate: 0.048 }, { upTo: 20000, rate: 0.052 }, { upTo: 60000, rate: 0.0555 }, { upTo: null, rate: 0.066 }] },
    Florida: { brackets: [{ upTo: null, rate: 0 }] },
    Georgia: { brackets: [{ upTo: 750, rate: 0.01 }, { upTo: 2250, rate: 0.02 }, { upTo: 3750, rate: 0.03 }, { upTo: 5250, rate: 0.04 }, { upTo: 7000, rate: 0.05 }, { upTo: null, rate: 0.0575 }] },
    Hawaii: { brackets: [{ upTo: 2400, rate: 0.014 }, { upTo: 4800, rate: 0.032 }, { upTo: 9600, rate: 0.055 }, { upTo: 14400, rate: 0.064 }, { upTo: 19200, rate: 0.068 }, { upTo: 24000, rate: 0.072 }, { upTo: 36000, rate: 0.08 }, { upTo: 48000, rate: 0.085 }, { upTo: 150000, rate: 0.09 }, { upTo: 175000, rate: 0.1 }, { upTo: 200000, rate: 0.11 }, { upTo: null, rate: 0.11 }] },
    Idaho: { brackets: [{ upTo: null, rate: 0.058 }] },
    Illinois: { brackets: [{ upTo: null, rate: 0.0495 }] },
    Indiana: { brackets: [{ upTo: null, rate: 0.0323 }] },
    Iowa: { brackets: [{ upTo: 1638, rate: 0.044 }, { upTo: 3276, rate: 0.045 }, { upTo: 6552, rate: 0.048 }, { upTo: 14784, rate: 0.055 }, { upTo: 24640, rate: 0.06 }, { upTo: null, rate: 0.062 }] },
    Kansas: { brackets: [{ upTo: 15000, rate: 0.031 }, { upTo: 30000, rate: 0.0525 }, { upTo: null, rate: 0.057 }] },
    Kentucky: { brackets: [{ upTo: null, rate: 0.05 }] },
    Louisiana: { brackets: [{ upTo: 12500, rate: 0.0185 }, { upTo: 50000, rate: 0.035 }, { upTo: null, rate: 0.0475 }] },
    Maine: { brackets: [{ upTo: 24000, rate: 0.058 }, { upTo: 57050, rate: 0.0675 }, { upTo: null, rate: 0.0715 }] },
    Maryland: { brackets: [{ upTo: 1000, rate: 0.02 }, { upTo: 2000, rate: 0.03 }, { upTo: 3000, rate: 0.04 }, { upTo: 100000, rate: 0.0475 }, { upTo: 125000, rate: 0.05 }, { upTo: 150000, rate: 0.0525 }, { upTo: 250000, rate: 0.055 }, { upTo: null, rate: 0.0575 }] },
    Massachusetts: { brackets: [{ upTo: null, rate: 0.05 }] },
    Michigan: { brackets: [{ upTo: null, rate: 0.0425 }] },
    Minnesota: { brackets: [{ upTo: 30090, rate: 0.0535 }, { upTo: 98910, rate: 0.0705 }, { upTo: 183340, rate: 0.0785 }, { upTo: null, rate: 0.0985 }] },
    Mississippi: { brackets: [{ upTo: 5000, rate: 0 }, { upTo: 10000, rate: 0.04 }, { upTo: null, rate: 0.05 }] },
    Missouri: { brackets: [{ upTo: 1121, rate: 0 }, { upTo: 2242, rate: 0.015 }, { upTo: 3363, rate: 0.02 }, { upTo: 4484, rate: 0.025 }, { upTo: 5605, rate: 0.03 }, { upTo: 6726, rate: 0.035 }, { upTo: 7847, rate: 0.04 }, { upTo: 8968, rate: 0.045 }, { upTo: null, rate: 0.0495 }] },
    Montana: { brackets: [{ upTo: 3200, rate: 0.01 }, { upTo: 5700, rate: 0.02 }, { upTo: 8700, rate: 0.03 }, { upTo: 12000, rate: 0.04 }, { upTo: 16000, rate: 0.05 }, { upTo: null, rate: 0.065 }] },
    Nebraska: { brackets: [{ upTo: 3700, rate: 0.0246 }, { upTo: 22230, rate: 0.0351 }, { upTo: 35870, rate: 0.0501 }, { upTo: null, rate: 0.0684 }] },
    Nevada: { brackets: [{ upTo: null, rate: 0 }] },
    "New Hampshire": { brackets: [{ upTo: null, rate: 0 }] },
    "New Jersey": {
      brackets: [
        { upTo: 20000, rate: 0.014 },
        { upTo: 35000, rate: 0.0175 },
        { upTo: 40000, rate: 0.035 },
        { upTo: 75000, rate: 0.05525 },
        { upTo: 500000, rate: 0.0637 },
        { upTo: null, rate: 0.0897 },
      ],
    },
    "New Mexico": { brackets: [{ upTo: 5500, rate: 0.017 }, { upTo: 11000, rate: 0.032 }, { upTo: 16000, rate: 0.047 }, { upTo: 21000, rate: 0.049 }, { upTo: null, rate: 0.059 }] },
    "New York": {
      brackets: [
        { upTo: 8500, rate: 0.04 },
        { upTo: 11700, rate: 0.045 },
        { upTo: 13900, rate: 0.0525 },
        { upTo: 21400, rate: 0.059 },
        { upTo: 80650, rate: 0.0621 },
        { upTo: 215400, rate: 0.0649 },
        { upTo: 1077550, rate: 0.0685 },
        { upTo: null, rate: 0.0882 },
      ],
    },
    "North Carolina": { brackets: [{ upTo: null, rate: 0.0525 }] },
    "North Dakota": { brackets: [{ upTo: 40600, rate: 0.011 }, { upTo: 98250, rate: 0.02 }, { upTo: 210825, rate: 0.0225 }, { upTo: null, rate: 0.029 }] },
    Ohio: {
      brackets: [
        { upTo: 25000, rate: 0.0 },
        { upTo: 44000, rate: 0.028 },
        { upTo: 88000, rate: 0.035 },
        { upTo: 110650, rate: 0.045 },
        { upTo: null, rate: 0.05 },
      ],
    },
    Oklahoma: { brackets: [{ upTo: 1000, rate: 0.005 }, { upTo: 2500, rate: 0.01 }, { upTo: 3750, rate: 0.02 }, { upTo: 4900, rate: 0.03 }, { upTo: 7200, rate: 0.04 }, { upTo: null, rate: 0.05 }] },
    Oregon: { brackets: [{ upTo: 4150, rate: 0.0475 }, { upTo: 10400, rate: 0.0675 }, { upTo: 125000, rate: 0.0875 }, { upTo: null, rate: 0.099 }] },
    Pennsylvania: { brackets: [{ upTo: null, rate: 0.0307 }] },
    "Rhode Island": { brackets: [{ upTo: 7300, rate: 0.0375 }, { upTo: 17500, rate: 0.0475 }, { upTo: null, rate: 0.0599 }] },
    "South Carolina": { brackets: [{ upTo: 3200, rate: 0 }, { upTo: 6400, rate: 0.03 }, { upTo: 9600, rate: 0.04 }, { upTo: 12800, rate: 0.05 }, { upTo: 16000, rate: 0.06 }, { upTo: null, rate: 0.07 }] },
    "South Dakota": { brackets: [{ upTo: null, rate: 0 }] },
    Tennessee: { brackets: [{ upTo: null, rate: 0 }] },
    Texas: { brackets: [{ upTo: null, rate: 0 }] },
    Utah: { brackets: [{ upTo: null, rate: 0.0495 }] },
    Vermont: { brackets: [{ upTo: 4450, rate: 0.0355 }, { upTo: 8900, rate: 0.066 }, { upTo: 19800, rate: 0.078 }, { upTo: null, rate: 0.0895 }] },
    Virginia: {
      brackets: [
        { upTo: 3000, rate: 0.02 },
        { upTo: 5000, rate: 0.03 },
        { upTo: 17000, rate: 0.05 },
        { upTo: null, rate: 0.0575 },
      ],
    },
    Washington: { brackets: [{ upTo: null, rate: 0 }] },
    "West Virginia": { brackets: [{ upTo: 10000, rate: 0.0276 }, { upTo: 25000, rate: 0.0376 }, { upTo: 40000, rate: 0.0476 }, { upTo: 60000, rate: 0.0576 }, { upTo: null, rate: 0.065 }] },
    Wisconsin: { brackets: [{ upTo: 13000, rate: 0.0354 }, { upTo: 25000, rate: 0.045 }, { upTo: 28000, rate: 0.053 }, { upTo: null, rate: 0.0598 }] },
    Wyoming: { brackets: [{ upTo: null, rate: 0 }] },
  },
};

/* -------------------------
   Helper: calculate progressive tax
   ------------------------- */
function calcTaxFromBrackets(brackets: Bracket[], income: number) {
  let remaining = income;
  let lastCap = 0;
  let tax = 0;

  for (const b of brackets) {
    const cap = b.upTo === null ? Infinity : b.upTo;
    const taxable = Math.max(0, Math.min(cap - lastCap, remaining));
    if (taxable > 0) {
      tax += taxable * b.rate;
      remaining -= taxable;
    }
    lastCap = cap;
    if (remaining <= 0) break;
  }
  return tax;
}

type Filing = "single" | "married";

export default function AllStatesTaxCalculator() {
  const [income, setIncome] = useState<number | string>(60000);
  const [filing, setFiling] = useState<Filing>("single");
  const [state, setState] = useState<string>("California");
  const [precision, setPrecision] = useState<number>(2);
  const [calculatedAt, setCalculatedAt] = useState<number | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);

  // Persist last-used inputs in localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('usStateTax:lastInputs');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.income !== undefined) setIncome(parsed.income);
        if (parsed?.filing) setFiling(parsed.filing);
        if (parsed?.state) setState(parsed.state);
        if (typeof parsed?.precision === 'number') setPrecision(parsed.precision);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      const payload = { income, filing, state, precision };
      localStorage.setItem('usStateTax:lastInputs', JSON.stringify(payload));
    } catch (e) {
      // ignore
    }
  }, [income, filing, state, precision]);

  // Theme is controlled by the site theme provider — do not force dark mode here.

  const stateOptions = useMemo(() => Object.keys(TAX_DATA.states), []);

  const computeTaxes = (incomeVal: number | string) => {
    const inc = Math.max(0, Number(incomeVal) || 0);
    const fedBrackets = TAX_DATA.federal[filing] || TAX_DATA.federal.single;
    const fedTax = calcTaxFromBrackets(fedBrackets, inc);
  const stateObj = TAX_DATA.states[state] || { brackets: [{ upTo: null, rate: 0 }] };
  const stateBrackets: Bracket[] = (stateObj as any)[filing] ?? stateObj.brackets ?? [{ upTo: null, rate: 0 }];
  const stateTax = calcTaxFromBrackets(stateBrackets, inc);
    const totalTax = fedTax + stateTax;
    const netIncome = inc - totalTax;
    const effectiveRate = inc > 0 ? (totalTax / inc) * 100 : 0;
    return { income: inc, federal: fedTax, state: stateTax, total: totalTax, net: netIncome, effectiveRate };
  };

  const preview = useMemo(() => computeTaxes(income), [income, filing, state]);
  const [result, setResult] = useState(preview);

  const handleCalculate = () => {
    const res = computeTaxes(income);
    setResult(res);
    setCalculatedAt(Date.now());
    setShowResults(true);
    const el = document.getElementById("tax-result-panel");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  useEffect(() => {
    if (!showResults) setResult(preview);
  }, [preview, showResults]);

  const fmt = (v: number) =>
    new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: precision }).format(v);

  const countUpProps = (val: number) => ({
    end: Number(val) || 0,
    duration: 1.2,
    separator: ",",
    decimals: precision,
  });

  const chartData = [
    { label: "Federal", value: Number(result.federal.toFixed(2)) },
    { label: "State", value: Number(result.state.toFixed(2)) },
    { label: "Net", value: Number(result.net.toFixed(2)) },
  ];

  return (
    <div className="bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-black text-slate-900 dark:text-slate-100 rounded-2xl border border-border/60 shadow-sm p-6">
      <div className="w-full mx-auto px-2 sm:px-4 lg:px-6 min-w-0">
        <header className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-300">US State Tax Calculator</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Enter income, choose filing status and a state — get federal + state tax instantly. Data is sample only.</p>
        </header>

  <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start min-w-0">
          {/* Inputs */}
          <div className="lg:col-span-2 bg-white/70 dark:bg-gray-900/40 border border-border/60 rounded-2xl p-5 shadow-md min-w-0 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="col-span-1">
                <div className="text-xs text-muted-foreground">Annual Income</div>
                <input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  className="mt-2 w-full bg-background border border-border rounded-lg px-3 py-2"
                />
              </label>

              <label>
                <div className="text-xs text-muted-foreground">Filing Status</div>
                <select
                  value={filing}
                  onChange={(e) => setFiling(e.target.value as Filing)}
                  className="mt-2 w-full bg-background border border-border rounded-lg px-3 py-2"
                >
                  <option value="single">Single</option>
                  <option value="married">Married (joint)</option>
                </select>
              </label>

              <label>
                <div className="text-xs text-muted-foreground">State</div>
                <select
                  value={state}
                  onChange={(e) => {
                    setState(e.target.value);
                    setShowResults(false);
                  }}
                  className="mt-2 w-full bg-background border border-border rounded-lg px-3 py-2"
                >
                  {stateOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-4 flex flex-col md:flex-row gap-3 items-start md:items-center">
              <div className="flex gap-2 items-center">
                <label className="text-xs text-muted-foreground">Precision</label>
                <input
                  type="number"
                  min={0}
                  max={4}
                  value={precision}
                  onChange={(e) => setPrecision(Number(e.target.value))}
                  className="ml-2 w-20 bg-background border border-border rounded-lg px-2 py-1"
                />
              </div>

              <div className="flex gap-3 md:ml-auto">
                <button
                  onClick={() => {
                    setIncome(60000);
                    setFiling("single");
                    setState("California");
                    setPrecision(2);
                    setShowResults(false);
                  }}
                  className="bg-muted hover:bg-muted/80 text-foreground px-4 py-2 rounded-lg text-sm"
                >
                  Reset
                </button>

                <button onClick={handleCalculate} className="bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2 rounded-lg font-semibold text-sm">
                  Calculate
                </button>
              </div>
            </div>

            <div className="mt-4 text-xs text-muted-foreground">
              Data note: Brackets are sample values. Replace TAX_DATA with official brackets for production.
            </div>

            <div className="mt-6">
              <h4 className="text-sm text-foreground/90">Quick breakdown</h4>
              <div className="mt-2 grid grid-cols-3 gap-3 min-w-0">
                <div className="bg-muted/40 p-3 rounded-lg text-center">
                  <div className="text-xs text-muted-foreground">Income</div>
                  <div className="text-lg font-semibold tabular-nums truncate">{fmt(Number(income))}</div>
                </div>
                <div className="bg-muted/40 p-3 rounded-lg text-center">
                  <div className="text-xs text-muted-foreground">Federal</div>
                  <div className="text-lg font-semibold tabular-nums truncate">{fmt(preview.federal)}</div>
                </div>
                <div className="bg-muted/40 p-3 rounded-lg text-center">
                  <div className="text-xs text-muted-foreground">State</div>
                  <div className="text-lg font-semibold tabular-nums truncate">{fmt(preview.state)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column: Inline results + chart */}
          <aside id="tax-result-panel" className="bg-white/70 dark:bg-gray-900/40 border border-border/60 rounded-2xl p-5 shadow-md min-w-0 overflow-hidden">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={showResults ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="mb-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs text-muted-foreground">Result — {state}</div>
                  <div className="mt-1 text-2xl font-extrabold text-emerald-600 dark:text-emerald-300">
                    <CountUp {...countUpProps(result.net)} key={calculatedAt || "preview"} prefix={"$"}>
                      {({ countUpRef }) => <span ref={countUpRef as any} />}
                    </CountUp>
                  </div>
                  <div className="text-xs text-muted-foreground">Take-home (after federal + state)</div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Total tax</div>
                  <div className="text-lg font-semibold">{fmt(result.total)}</div>
                  <div className="text-xs text-muted-foreground mt-1">Effective rate: {result.effectiveRate.toFixed(2)}%</div>
                </div>
              </div>
            </motion.div>

            {/* Chart */}
            <div className="h-40 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ top: 6, right: 12, left: 20, bottom: 6 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#0f172a44" />
                  <XAxis type="number" tick={{ fill: "#9ca3af" }} />
                  <YAxis dataKey="label" type="category" tick={{ fill: "#9ca3af" }} width={80} />
                  <Tooltip formatter={(v: any) => fmt(Number(v))} itemStyle={{ color: "#10b981" }} contentStyle={{ background: "#071122" }} />
                  <Bar dataKey="value" radius={[6, 6, 6, 6]} fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Mini cards */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-muted/40 p-3 rounded-lg">
                <div className="text-xs text-muted-foreground">Federal Tax</div>
                <div className="text-lg font-semibold">{fmt(result.federal)}</div>
              </div>
              <div className="bg-muted/40 p-3 rounded-lg">
                <div className="text-xs text-muted-foreground">State Tax ({state})</div>
                <div className="text-lg font-semibold">{fmt(result.state)}</div>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(JSON.stringify(result, null, 2));
                  alert("Result copied to clipboard (JSON).");
                }}
                className="flex-1 bg-muted hover:bg-muted/80 text-foreground px-3 py-2 rounded-lg text-sm"
              >
                Copy JSON
              </button>
              <button
                onClick={() => {
                  const csv = `income,federal,state,total,net\n${result.income},${result.federal},${result.state},${result.total},${result.net}`;
                  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `tax-${state}-${result.income}.csv`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black px-3 py-2 rounded-lg text-sm"
              >
                Export CSV
              </button>
            </div>
          </aside>
        </section>

        <article className="mt-8 bg-white/70 dark:bg-gray-900/40 border border-border/60 rounded-2xl p-5">
          <h3 className="text-base sm:text-lg font-semibold text-emerald-600 dark:text-emerald-300">About this tool</h3>
          <p className="text-sm text-muted-foreground mt-2">
            This MVP calculates federal + state income tax using local JSON brackets. Replace the sample data with official, up-to-date brackets for production.
          </p>
        </article>
      </div>
    </div>
  );
}
