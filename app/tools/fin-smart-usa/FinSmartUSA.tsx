"use client";

import React, { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { motion } from "framer-motion";
import CountUp from "react-countup";

// Bank dataset (sample) — update periodically for accuracy
const BANKS = [
  { name: "Ally Bank", savingsRate: 0.025, cdRate: 0.035, monthlyFee: 0, atmFee: 0 },
  { name: "Chase Bank", savingsRate: 0.001, cdRate: 0.02, monthlyFee: 12, atmFee: 2.5 },
  { name: "Capital One", savingsRate: 0.015, cdRate: 0.03, monthlyFee: 0, atmFee: 0 },
  { name: "Wells Fargo", savingsRate: 0.001, cdRate: 0.015, monthlyFee: 10, atmFee: 2.5 },
  { name: "Marcus (Goldman)", savingsRate: 0.022, cdRate: 0.036, monthlyFee: 0, atmFee: 0 },
  { name: "Discover", savingsRate: 0.02, cdRate: 0.033, monthlyFee: 0, atmFee: 0 },
  { name: "SoFi", savingsRate: 0.018, cdRate: 0.032, monthlyFee: 0, atmFee: 0 },
];

function currency(v: number, p = 2) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: p,
  }).format(v);
}

// Loan EMI calculator
function calcLoanSchedule({
  amount,
  years,
  rateAnnual,
  freq = 12,
  extra = 0,
}: {
  amount: number;
  years: number;
  rateAnnual: number;
  freq?: number;
  extra?: number;
}) {
  const n = years * freq;
  const r = rateAnnual / 100 / freq;
  const payment = r === 0 ? amount / n : (amount * r) / (1 - Math.pow(1 + r, -n));
  let balance = amount;
  const schedule: { period: number; payment: number; principal: number; interest: number; balance: number }[] = [];
  for (let i = 1; i <= n; i++) {
    const interest = balance * r;
    const principal = payment - interest + extra;
    balance = Math.max(0, balance - principal);
    schedule.push({ period: i, payment: payment + extra, principal: Math.max(0, principal), interest, balance });
    if (balance <= 0) break;
  }
  const totalPaid = schedule.reduce((s, x) => s + x.payment, 0);
  const totalInterest = schedule.reduce((s, x) => s + x.interest, 0);
  return { schedule, payment: payment + extra, totalPaid, totalInterest };
}

// Savings growth
function calcSavings({
  initial = 0,
  monthly = 0,
  years = 10,
  rateAnnual = 0.05,
  freq = 12,
}: {
  initial?: number;
  monthly?: number;
  years?: number;
  rateAnnual?: number;
  freq?: number;
}) {
  const n = years * freq;
  const r = rateAnnual / 100 / freq;
  let balance = initial;
  const data: { year: number; value: number }[] = [];
  for (let i = 1; i <= n; i++) {
    balance = balance * (1 + r) + monthly;
    if (i % freq === 0) {
      data.push({ year: i / freq, value: Number(balance.toFixed(2)) });
    }
  }
  return { data, final: Number(balance.toFixed(2)) };
}

export default function FinSmartUSA() {
  // Loan state
  const [loanAmount, setLoanAmount] = useState<number | string>(300000);
  const [loanYears, setLoanYears] = useState<number | string>(30);
  const [loanRate, setLoanRate] = useState<number | string>(6.5);
  const [loanExtra, setLoanExtra] = useState<number | string>(0);

  // Savings state
  const [initial, setInitial] = useState<number | string>(5000);
  const [monthly, setMonthly] = useState<number | string>(500);
  const [saveYears, setSaveYears] = useState<number | string>(10);
  const [saveRate, setSaveRate] = useState<number | string>(4.5);

  // Bank comparison
  const [bankFilter, setBankFilter] = useState("");

  // derived
  const loanResult = useMemo(
    () =>
      calcLoanSchedule({
        amount: Number(loanAmount),
        years: Number(loanYears),
        rateAnnual: Number(loanRate),
        extra: Number(loanExtra),
      }),
    [loanAmount, loanYears, loanRate, loanExtra]
  );
  const savingsResult = useMemo(
    () =>
      calcSavings({
        initial: Number(initial),
        monthly: Number(monthly),
        years: Number(saveYears),
        rateAnnual: Number(saveRate),
      }),
    [initial, monthly, saveYears, saveRate]
  );

  const banksShown = useMemo(
    () => BANKS.filter((b) => b.name.toLowerCase().includes(bankFilter.toLowerCase())),
    [bankFilter]
  );

  // small charts data
  const loanChart = useMemo(
    () =>
      loanResult.schedule
        .slice(0, Math.min(loanResult.schedule.length, 60))
        .map((s) => ({ period: s.period, balance: Number(s.balance.toFixed(2)) })),
    [loanResult]
  );
  const saveChart = useMemo(
    () => savingsResult.data.map((d) => ({ year: d.year, value: d.value })),
    [savingsResult]
  );

  return (
    <div className="bg-white/70 dark:bg-gray-900/40 border border-border/60 rounded-2xl p-6 shadow-sm">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-300">
            FinSmart USA — Loans · Savings · Bank Compare
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
            All-in-one banking toolkit: EMI planner, savings growth simulator, and bank interest & fee comparator.
          </p>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Loan card */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-background/60 border border-border/60 rounded-2xl p-6 shadow"
          >
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="w-full lg:w-1/2">
                <h3 className="text-base sm:text-lg font-semibold text-emerald-600 dark:text-emerald-300">
                  Loan & EMI Planner
                </h3>
                <div className="mt-4 grid grid-cols-1 gap-3">
                  <label>
                    <div className="text-xs text-muted-foreground">Loan Amount</div>
                    <input
                      type="number"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)}
                      className="mt-2 w-full bg-background border border-border rounded-lg px-3 py-2"
                    />
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <label>
                      <div className="text-xs text-muted-foreground">Term (years)</div>
                      <input
                        type="number"
                        value={loanYears}
                        onChange={(e) => setLoanYears(e.target.value)}
                        className="mt-2 w-full bg-background border border-border rounded-lg px-3 py-2"
                      />
                    </label>
                    <label>
                      <div className="text-xs text-muted-foreground">Rate (APR %)</div>
                      <input
                        type="number"
                        step="0.01"
                        value={loanRate}
                        onChange={(e) => setLoanRate(e.target.value)}
                        className="mt-2 w-full bg-background border border-border rounded-lg px-3 py-2"
                      />
                    </label>
                    <label>
                      <div className="text-xs text-muted-foreground">Extra Payment (monthly)</div>
                      <input
                        type="number"
                        value={loanExtra}
                        onChange={(e) => setLoanExtra(e.target.value)}
                        className="mt-2 w-full bg-background border border-border rounded-lg px-3 py-2"
                      />
                    </label>
                  </div>

                  <div className="mt-3 flex gap-3">
                    <button
                      onClick={() => {
                        setLoanAmount(300000);
                        setLoanYears(30);
                        setLoanRate(6.5);
                        setLoanExtra(0);
                      }}
                      className="bg-muted hover:bg-muted/80 text-foreground px-4 py-2 rounded-lg text-sm"
                    >
                      Reset
                    </button>
                    <button
                      onClick={() => {}}
                      className="bg-emerald-500 hover:bg-emerald-400 px-4 py-2 rounded-lg text-black font-semibold text-sm"
                    >
                      Calculate
                    </button>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-1/2 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold">Results</h4>
                    <p className="text-xs text-muted-foreground">Monthly payment, total interest & amortization preview</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-300">
                      <CountUp end={loanResult.payment} duration={1.2} decimals={2} separator="," prefix="$" />
                    </div>
                    <div className="text-xs text-muted-foreground">Est. monthly</div>
                  </div>
                </div>

                <div className="h-40 bg-background/60 rounded-xl p-2 border border-border/60">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={loanChart} margin={{ top: 6, right: 8, left: -12, bottom: 6 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#0f172a44" />
                      <XAxis dataKey="period" tick={{ fill: '#9ca3af' }} />
                      <YAxis tick={{ fill: '#9ca3af' }} />
                      <Tooltip formatter={(v: any) => currency(Number(v))} contentStyle={{ background: '#0b1220', borderRadius: 8 }} />
                      <Line type="monotone" dataKey="balance" stroke="#10b981" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted/40 p-3 rounded-lg">
                    <div className="text-xs text-muted-foreground">Total Paid</div>
                    <div className="text-lg font-semibold">{currency(loanResult.totalPaid)}</div>
                  </div>
                  <div className="bg-muted/40 p-3 rounded-lg">
                    <div className="text-xs text-muted-foreground">Interest Paid</div>
                    <div className="text-lg font-semibold">{currency(loanResult.totalInterest)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* amortization small table */}
            <div className="mt-4 bg-background/60 border border-border/60 rounded-lg p-3 overflow-auto">
              <table className="w-full text-sm table-auto">
                <thead>
                  <tr className="text-left text-muted-foreground">
                    <th className="py-2">Pmt #</th>
                    <th className="py-2">Payment</th>
                    <th className="py-2">Interest</th>
                    <th className="py-2">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {loanResult.schedule.slice(0, 12).map((r) => (
                    <tr key={r.period} className="border-t border-border/60 hover:bg-muted/40">
                      <td className="py-2">{r.period}</td>
                      <td className="py-2">{currency(r.payment)}</td>
                      <td className="py-2">{currency(r.interest)}</td>
                      <td className="py-2">{currency(r.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Savings card */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-background/60 border border-border/60 rounded-2xl p-6 shadow"
          >
            <h3 className="text-base sm:text-lg font-semibold text-emerald-600 dark:text-emerald-300">Savings & Growth Simulator</h3>
            <div className="mt-4 grid grid-cols-1 gap-3">
              <label>
                <div className="text-xs text-muted-foreground">Initial Amount</div>
                <input
                  type="number"
                  value={initial}
                  onChange={(e) => setInitial(e.target.value)}
                  className="mt-2 w-full bg-background border border-border rounded-lg px-3 py-2"
                />
              </label>
              <label>
                <div className="text-xs text-muted-foreground">Monthly Contribution</div>
                <input
                  type="number"
                  value={monthly}
                  onChange={(e) => setMonthly(e.target.value)}
                  className="mt-2 w-full bg-background border border-border rounded-lg px-3 py-2"
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label>
                  <div className="text-xs text-muted-foreground">Years</div>
                  <input
                    type="number"
                    value={saveYears}
                    onChange={(e) => setSaveYears(e.target.value)}
                    className="mt-2 w-full bg-background border border-border rounded-lg px-3 py-2"
                  />
                </label>
                <label>
                  <div className="text-xs text-muted-foreground">Rate (APY %)</div>
                  <input
                    type="number"
                    value={saveRate}
                    onChange={(e) => setSaveRate(e.target.value)}
                    className="mt-2 w-full bg-background border border-border rounded-lg px-3 py-2"
                  />
                </label>
              </div>

              <div className="mt-3 flex gap-3">
                <button
                  onClick={() => {
                    setInitial(5000);
                    setMonthly(500);
                    setSaveYears(10);
                    setSaveRate(4.5);
                  }}
                  className="bg-muted hover:bg-muted/80 text-foreground px-4 py-2 rounded-lg text-sm"
                >
                  Reset
                </button>
                <button
                  onClick={() => {}}
                  className="bg-emerald-500 hover:bg-emerald-400 px-4 py-2 rounded-lg text-black font-semibold text-sm"
                >
                  Project
                </button>
              </div>

              <div className="mt-4 h-44 bg-background/60 rounded-xl p-2 border border-border/60">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={saveChart} margin={{ top: 6, right: 8, left: -12, bottom: 6 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#0f172a44" />
                    <XAxis dataKey="year" tick={{ fill: '#9ca3af' }} />
                    <YAxis tick={{ fill: '#9ca3af' }} />
                    <Tooltip formatter={(v: any) => currency(Number(v))} contentStyle={{ background: '#0b1220', borderRadius: 8 }} />
                    <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="bg-muted/40 p-3 rounded-lg">
                  <div className="text-xs text-muted-foreground">Final Balance</div>
                  <div className="text-lg font-semibold">{currency(savingsResult.final)}</div>
                </div>
                <div className="bg-muted/40 p-3 rounded-lg">
                  <div className="text-xs text-muted-foreground">Total Contributions</div>
                  <div className="text-lg font-semibold">{currency(Number(monthly) * Number(saveYears) * 12 + Number(initial))}</div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Bank comparator below */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-emerald-600 dark:text-emerald-300">Bank Interest & Fee Comparator</h3>
            <div className="flex items-center gap-2">
              <input
                placeholder="Search bank"
                value={bankFilter}
                onChange={(e) => setBankFilter(e.target.value)}
                className="bg-background border border-border rounded-lg px-3 py-2 text-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {banksShown.map((b) => (
              <div key={b.name} className="bg-background/60 border border-border rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground">{b.name}</div>
                    <div className="text-lg font-semibold">Savings APY: {(b.savingsRate * 100).toFixed(2)}%</div>
                    <div className="text-xs text-muted-foreground">CD APY: {(b.cdRate * 100).toFixed(2)}%</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Monthly Fee</div>
                    <div className="font-medium">{b.monthlyFee === 0 ? 'No fee' : currency(b.monthlyFee)}</div>
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => {
                      setSaveRate(b.savingsRate * 100);
                    }}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black px-3 py-2 rounded-lg text-sm"
                  >
                    Use APY
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(JSON.stringify(b));
                    }}
                    className="flex-1 bg-muted hover:bg-muted/80 px-3 py-2 rounded-lg text-sm"
                  >
                    Copy
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-xs text-muted-foreground">
            Note: Bank rates and fees change — update <code>BANKS</code> dataset periodically for accuracy.
          </div>
        </section>

        <footer className="mt-8 text-center text-[11px] text-muted-foreground">
          © {new Date().getFullYear()} FinSmart USA — Prototype. Not financial advice.
        </footer>
      </div>
    </div>
  );
}
