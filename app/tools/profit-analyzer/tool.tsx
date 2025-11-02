"use client"
import { useState, useMemo, useRef } from 'react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine, Legend
} from 'recharts'

interface DefaultsProps {
  revenue?: number
  netProfit?: number
  fixedCosts?: number
  sellingPrice?: number
  variableCost?: number
}

// Reusable analyzer component
export default function Analyzer({
  revenue: revenueDefault = 10000,
  netProfit: netProfitDefault = 2000,
  fixedCosts: fixedCostsDefault = 5000,
  sellingPrice: sellingPriceDefault = 50,
  variableCost: variableCostDefault = 20
}: DefaultsProps) {
  const [revenue, setRevenue] = useState(revenueDefault)
  const [netProfit, setNetProfit] = useState(netProfitDefault)
  const [fixedCosts, setFixedCosts] = useState(fixedCostsDefault)
  const [sellingPrice, setSellingPrice] = useState(sellingPriceDefault)
  const [variableCost, setVariableCost] = useState(variableCostDefault)
  const [currency, setCurrency] = useState<'$' | '€' | '£'>('$')
  const defaultsRef = useRef({ revenueDefault, netProfitDefault, fixedCostsDefault, sellingPriceDefault, variableCostDefault })

  const { push, node: toastNode } = require('@/components/toast').useToast?.() ?? { push: ()=>{}, node: null }

  const priceGap = sellingPrice - variableCost
  const invalid = priceGap <= 0

  const profitMargin = useMemo(()=> {
    // Profit Margin (%) = (Net Profit / Revenue) * 100
    if (revenue === 0) return 0
    return (netProfit / revenue) * 100
  }, [revenue, netProfit])

  const breakEvenUnits = useMemo(()=> {
    // Break-Even Units = Fixed Costs / (Selling Price - Variable Cost)
    if (invalid) return 0
    return fixedCosts / priceGap
  }, [fixedCosts, priceGap, invalid])

  const breakEvenRevenue = breakEvenUnits * sellingPrice // Break-Even Revenue = Break-Even Units * Selling Price

  // Build chart dataset (simulate units up to 140% of break-even or 12 points)
  const chartData = useMemo(()=> {
    const maxUnits = invalid ? 10 : Math.ceil(breakEvenUnits * 1.4)
    const step = Math.max(1, Math.ceil(maxUnits / 12))
    const rows: { u: number; revenue: number; totalCost: number }[] = []
    for(let u=0; u<=maxUnits; u+=step){
      const rev = u * sellingPrice
      const cost = fixedCosts + (variableCost * u)
      rows.push({ u, revenue: rev, totalCost: cost })
    }
    return rows
  }, [breakEvenUnits, sellingPrice, fixedCosts, variableCost, invalid])

  function num(v: number){
    return Number.isFinite(v) ? v.toFixed(2) : '—'
  }

  function fmtMoney(v: number){
    if(!Number.isFinite(v)) return '—'
    return currency + num(v)
  }

  function resetAll(){
    setRevenue(defaultsRef.current.revenueDefault)
    setNetProfit(defaultsRef.current.netProfitDefault)
    setFixedCosts(defaultsRef.current.fixedCostsDefault)
    setSellingPrice(defaultsRef.current.sellingPriceDefault)
    setVariableCost(defaultsRef.current.variableCostDefault)
    push('Inputs reset')
  }

  function copySummary(){
    try {
      const lines = [
        'Profit Margin & Break-Even Summary',
        `Revenue: ${fmtMoney(revenue)}`,
        `Net Profit: ${fmtMoney(netProfit)}`,
        `Fixed Costs: ${fmtMoney(fixedCosts)}`,
        `Selling Price / Unit: ${fmtMoney(sellingPrice)}`,
        `Variable Cost / Unit: ${fmtMoney(variableCost)}`,
        invalid ? 'Break-Even: INVALID (price must exceed variable cost)' : `Break-Even Units: ${num(breakEvenUnits)}`,
        invalid ? '' : `Break-Even Revenue: ${fmtMoney(breakEvenRevenue)}`,
        !invalid ? `Profit Margin: ${num(profitMargin)}%` : ''
      ].filter(Boolean).join('\n')
      navigator.clipboard.writeText(lines)
      push('Summary copied')
    } catch(e){
      push('Copy failed', 'Clipboard not available')
    }
  }

  const inputBase = "w-full rounded-md border bg-background/70 backdrop-blur px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 border-border"

  return (
    <div className="grid lg:grid-cols-2 gap-10 min-w-0">
      {/* Form */}
      <div className="space-y-6 min-w-0">
        <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur p-6 shadow-sm min-w-0 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
            <h2 className="font-semibold tracking-tight text-lg">Inputs</h2>
            <div className="flex flex-wrap items-center gap-2">
              <select value={currency} onChange={e=>setCurrency(e.target.value as any)} className="text-xs rounded-md border bg-background/70 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/40">
                <option value="$">USD ($)</option>
                <option value="€">EUR (€)</option>
                <option value="£">GBP (£)</option>
              </select>
              <button onClick={resetAll} className="text-xs px-3 py-1.5 rounded-md border bg-background/70 hover:bg-accent/60 transition-colors">Reset</button>
              <button onClick={copySummary} className="text-xs px-3 py-1.5 rounded-md border bg-background/70 hover:bg-accent/60 transition-colors">Copy Summary</button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Revenue">
              <input type="number" min={0} value={revenue} onChange={e=>setRevenue(Number(e.target.value)||0)} className={inputBase} />
            </Field>
            <Field label="Net Profit">
              <input type="number" value={netProfit} onChange={e=>setNetProfit(Number(e.target.value)||0)} className={inputBase} />
            </Field>
            <Field label="Fixed Costs">
              <input type="number" min={0} value={fixedCosts} onChange={e=>setFixedCosts(Number(e.target.value)||0)} className={inputBase} />
            </Field>
            <Field label="Selling Price / Unit">
              <input type="number" min={0} value={sellingPrice} onChange={e=>setSellingPrice(Number(e.target.value)||0)} className={inputBase} />
            </Field>
            <Field label="Variable Cost / Unit">
              <input type="number" min={0} value={variableCost} onChange={e=>setVariableCost(Number(e.target.value)||0)} className={inputBase} />
            </Field>
          </div>
          {invalid && (
            <p className="mt-4 text-sm font-medium text-destructive">Selling price must be greater than variable cost to compute break-even.</p>
          )}
        </div>
  <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur p-6 shadow-sm min-w-0 overflow-hidden">
          <h2 className="font-semibold tracking-tight text-lg mb-4">Results</h2>
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            <Result label="Profit Margin" value={invalid? '—' : `${num(profitMargin)}%`} />
            <Result label="Break-Even Units" value={invalid? '—' : num(breakEvenUnits)} />
            <Result label="Break-Even Revenue" value={invalid? '—' : fmtMoney(breakEvenRevenue)} />
          </div>
        </div>
      </div>
      {/* Chart */}
  <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur p-6 shadow-sm flex flex-col min-w-0 overflow-hidden">
        <h2 className="font-semibold tracking-tight text-lg mb-4">Revenue vs Costs</h2>
  <div className="h-72 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, left: 0, right: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
              <XAxis dataKey="u" tick={{fontSize:12}} stroke="hsl(var(--muted-foreground))" label={{value:'Units', position:'insideBottom', offset:-2, style:{fontSize:12}}} />
              <YAxis tick={{fontSize:12}} stroke="hsl(var(--muted-foreground))" label={{value:`Amount (${currency})`, angle:-90, position:'insideLeft', style:{fontSize:12}}} />
              <Tooltip formatter={(v:number)=>`${currency}${v.toFixed(2)}`} contentStyle={{background:'hsl(var(--card))', border:'1px solid hsl(var(--border))', borderRadius:8}} />
              <Legend />
              {!invalid && (
                <ReferenceLine x={Number(breakEvenUnits.toFixed(2))} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: 'Break-Even', position: 'top', fill:'#f59e0b', fontSize:12 }} />
              )}
              <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} dot={false} name="Revenue" />
              <Line type="monotone" dataKey="totalCost" stroke="#0ea5e9" strokeWidth={2} dot={false} name="Total Cost" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {invalid && <p className="mt-4 text-xs text-muted-foreground">Enter a selling price greater than variable cost to view break-even analysis.</p>}
        {toastNode}
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="text-sm font-medium space-y-1 block">
      <span className="text-foreground/90">{label}</span>
      {children}
    </label>
  )
}

function Result({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/60 bg-background/60 px-3 py-3 flex flex-col gap-1 min-w-0 overflow-hidden">
      <span className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">{label}</span>
      <span className="text-base sm:text-lg font-semibold text-foreground tabular-nums truncate">{value}</span>
    </div>
  )
}
