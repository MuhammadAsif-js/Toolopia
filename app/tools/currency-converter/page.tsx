"use client";
import React, { useState, useEffect } from 'react';
import { ArticleContent } from '@/components/markdown/ArticleContent';

// Narrowed to currency only: simple 3-token pattern: <amount> <FROM> to <TO>
async function fetchRates() {
  try {
    const res = await fetch('https://api.exchangerate.host/latest?base=USD');
    if (!res.ok) throw new Error('Network response not ok');
    return await res.json();
  } catch (e) {
    console.error('Currency API error:', e);
    return null;
  }
}

function isCurrencyCode(t: string) { return /^[a-z]{3}$/i.test(t); }

export default function CurrencyConverterPage() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRates().then(data => {
      if (data?.rates) setRates(data.rates);
      setLoading(false);
    }).catch(()=> setLoading(false));
  }, []);

  function handleConvert(input: string) {
    setQuery(input);
    const parts = input.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (parts.length < 3) { setResult(''); return; }
    const amount = parseFloat(parts[0]);
    if (Number.isNaN(amount)) { setResult('Invalid amount'); return; }
    let from = parts[1];
    let to = parts[2];
    if (parts.length >= 4 && (parts[2] === 'to' || parts[2] === 'in')) to = parts[3];
    if (!isCurrencyCode(from) || !isCurrencyCode(to)) { setResult('Use 3-letter currency codes (e.g. usd, eur)'); return; }
    const rFrom = rates[from.toUpperCase()];
    const rTo = rates[to.toUpperCase()];
    if (!rFrom || !rTo) { setResult('Unknown currency code'); return; }
    const usd = amount / rFrom;
    const converted = usd * rTo;
    setResult(`${amount} ${from.toUpperCase()} = ${converted.toFixed(2)} ${to.toUpperCase()}`);
  }

  return (
    <main className="bg-gray-900 text-gray-100 min-h-screen py-10">
      <div className="max-w-3xl mx-auto p-4 space-y-10">
        <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Currency Converter</h1>
            <p className="text-sm text-gray-400 max-w-2xl">Convert between global currencies using live exchange rates (base USD source).</p>
          </div>
          <a href="#article" className="text-xs font-medium text-primary hover:underline bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded px-2 py-1 self-start">Read guide ↓</a>
        </header>
        <section className="rounded-2xl bg-gray-800 border border-gray-700 p-6 space-y-4">
          <label className="text-sm font-medium text-gray-200" htmlFor="query">Conversion Query <span className="text-accent">*</span></label>
          <input
            id="query"
            className="w-full rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="e.g. 100 usd to eur"
            value={query}
            onChange={(e)=>handleConvert(e.target.value)}
            autoComplete="off"
          />
          <p className="text-xs text-gray-400">Format: &lt;amount&gt; &lt;from currency&gt; to &lt;to currency&gt; (example: 250 gbp to cad)</p>
          <div className="mt-2 min-h-[40px] flex items-center">
            {loading ? (
              <p className="text-sm text-gray-500 animate-pulse">Loading rates...</p>
            ) : result ? (
              <p className="text-lg font-semibold text-accent-foreground text-accent px-3 py-1 bg-gray-700/60 rounded-md">{result}</p>
            ) : (
              <p className="text-sm text-gray-500">Enter a query to see conversion.</p>
            )}
          </div>
        </section>
        <section className="rounded-2xl bg-gray-800 border border-gray-700 p-6">
          <h2 className="text-base font-semibold mb-3">Examples</h2>
          <ul className="text-xs text-gray-400 space-y-1">
            {['10 usd to eur', '250 gbp to cad', '1000 jpy to usd', '75 aud to nzd'].map(ex => (
              <li key={ex}>
                <button onClick={()=>handleConvert(ex)} className="hover:text-gray-200 transition">{ex}</button>
              </li>
            ))}
          </ul>
        </section>
        <section id="article" className="pt-4 border-t border-gray-800">
          <ArticleContent slug="currency-converter" />
        </section>
      </div>
    </main>
  );
}
