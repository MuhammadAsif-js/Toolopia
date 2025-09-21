"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TOOLS } from "@/lib/tools";
import { Badge } from "@/components/ui/badge";

const unitConversions = {
  length: {
    m: 1,
    meter: 1,
    meters: 1,
    km: 1000,
    kilometer: 1000,
    kilometers: 1000,
    cm: 0.01,
    centimeter: 0.01,
    millimeter: 0.001,
    mm: 0.001,
    mile: 1609.34,
    miles: 1609.34,
    yard: 0.9144,
    yardS: 0.9144,
    ft: 0.3048,
    foot: 0.3048,
    feet: 0.3048,
    inch: 0.0254,
    inches: 0.0254,
  },
  weight: {
    kg: 1,
    kilogram: 1,
    kilograms: 1,
    g: 0.001,
    gram: 0.001,
    grams: 0.001,
    mg: 0.000001,
    pound: 0.453592,
    lb: 0.453592,
    lbs: 0.453592,
    oz: 0.0283495,
    ounce: 0.0283495,
    ounces: 0.0283495,
  },
  temperature: {
    c: "celsius",
    f: "fahrenheit",
    k: "kelvin",
  },
};

async function fetchRates() {
  try {
    const res = await fetch("https://api.exchangerate.host/latest?base=USD");
    if (!res.ok) throw new Error("Network response not ok");
    return await res.json();
  } catch (e) {
    console.error("Currency API error:", e);
    return null;
  }
}

// helper: normalize unit tokens (strip punctuation, plural -> singular if needed)
function normalizeToken(token = "") {
  return token.replace(/[^\w]/g, "").toLowerCase();
}

// helper: detect 3-letter currency codes (or common symbols)
function isCurrencyCode(t: string) {
  return /^[a-z]{3}$/i.test(t);
}

export default function Currency() {
  const meta = TOOLS.find(t => t.slug === 'currency-converter');
  // Conversion logic
  function handleConvert(input: string) {
    try {
      setQuery(input);
      const rawParts = input.trim().toLowerCase().split(/\s+/).filter(Boolean);
      if (rawParts.length < 3) {
        setResult("");
        return;
      }
      // basic tolerant parsing: amount, from, optional "to"/"in", to
      const amount = parseFloat(rawParts[0]);
      if (Number.isNaN(amount)) {
        setResult("⚠️ Could not parse amount");
        return;
      }
      // pick tokens for from/to
      let from = rawParts[1], to = rawParts[2];
      if (rawParts.length > 3) {
        if (["to", "in"].includes(rawParts[2])) to = rawParts[3];
      }
      // Currency conversion
      if (isCurrencyCode(from) && isCurrencyCode(to)) {
        if (!rates[from.toUpperCase()] || !rates[to.toUpperCase()]) {
          setResult("⚠️ Unknown currency code");
          return;
        }
        const usd = amount / rates[from.toUpperCase()];
        const converted = usd * rates[to.toUpperCase()];
        setResult(`${amount} ${from.toUpperCase()} = ${converted.toFixed(2)} ${to.toUpperCase()}`);
        return;
      }
      // Unit conversion
      if (unitConversions.length[from as keyof typeof unitConversions.length] && unitConversions.length[to as keyof typeof unitConversions.length]) {
        const meters = amount * unitConversions.length[from as keyof typeof unitConversions.length];
        const converted = meters / unitConversions.length[to as keyof typeof unitConversions.length];
        setResult(`${amount} ${from} = ${converted.toFixed(4)} ${to}`);
        return;
      }
      if (unitConversions.weight[from as keyof typeof unitConversions.weight] && unitConversions.weight[to as keyof typeof unitConversions.weight]) {
        const kg = amount * unitConversions.weight[from as keyof typeof unitConversions.weight];
        const converted = kg / unitConversions.weight[to as keyof typeof unitConversions.weight];
        setResult(`${amount} ${from} = ${converted.toFixed(4)} ${to}`);
        return;
      }
      // Temperature conversion
      if ((from === "c" || from === "celsius") && (to === "f" || to === "fahrenheit")) {
        setResult(`${amount}°C = ${(amount * 9/5 + 32).toFixed(2)}°F`);
        return;
      }
      if ((from === "f" || from === "fahrenheit") && (to === "c" || to === "celsius")) {
        setResult(`${amount}°F = ${((amount - 32) * 5/9).toFixed(2)}°C`);
        return;
      }
      if ((from === "c" || from === "celsius") && (to === "k" || to === "kelvin")) {
        setResult(`${amount}°C = ${(amount + 273.15).toFixed(2)}K`);
        return;
      }
      if ((from === "k" || from === "kelvin") && (to === "c" || to === "celsius")) {
        setResult(`${amount}K = ${(amount - 273.15).toFixed(2)}°C`);
        return;
      }
      setResult("⚠️ Could not convert. Check your input.");
    } catch (e) {
      setResult("⚠️ Error parsing input");
    }
  }
  const [query, setQuery] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loadingRates, setLoadingRates] = useState<boolean>(true);

  useEffect(() => {
    setLoadingRates(true);
    fetchRates()
      .then((data) => {
        if (data && data.rates) setRates(data.rates);
        setLoadingRates(false);
      })
      .catch(() => setLoadingRates(false));
  }, []);

  // UI and conversion logic
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100 p-6">
      <div className="max-w-xl mx-auto">
        <header className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-xs">{meta?.category || 'Utility'}</Badge>
            {meta?.keywords?.slice(0,2).map(k => (
              <Badge key={k} variant="secondary" className="text-[10px]">{k}</Badge>
            ))}
          </div>
          <h1 className="text-2xl font-bold">{meta?.title || '💱 Currency & Unit Converter'}</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{meta?.description || 'Convert between currencies and common units.'}</p>
          {meta?.slug && (
            <div className="mt-3">
              {/* Use a plain anchor to avoid adding a new import here */}
              <a href={`/articles/${meta.slug}`} className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                Read full guide
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5"><path d="M13.2 6.3a1 1 0 1 0-1.4 1.4L15.1 11H6a1 1 0 1 0 0 2h9.1l-3.3 3.3a1 1 0 1 0 1.4 1.4l5-5a1 1 0 0 0 0-1.4l-5-5Z"/></svg>
              </a>
            </div>
          )}
        </header>
        <div className="rounded-xl border p-4 bg-white/80 dark:bg-white/5 shadow mb-6">
          <label className="block text-sm font-medium mb-2">Enter conversion (e.g. <span className='font-mono'>10 usd to eur</span> or <span className='font-mono'>5 km in miles</span>)</label>
          <input
            type="text"
            className="w-full rounded-lg border p-3 text-sm mb-2 bg-transparent"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              handleConvert(e.target.value);
            }}
            placeholder="e.g. 100 usd to inr or 5 km in miles"
          />
          <div className="text-xs opacity-70 mb-2">Supports most currencies and common units (length, weight, temperature).</div>
          <div className="mt-2">
            {loadingRates ? (
              <span className="text-sm opacity-70">Loading rates...</span>
            ) : result ? (
              <div className="text-lg font-semibold text-emerald-700 dark:text-emerald-400">{result}</div>
            ) : (
              <span className="text-sm opacity-70">Enter a query above to convert.</span>
            )}
          </div>
        </div>
        <div className="rounded-xl border p-4 bg-white/80 dark:bg-white/5 shadow">
          <h2 className="text-lg font-semibold mb-2">Examples</h2>
          <ul className="list-disc pl-5 text-sm opacity-80 space-y-1">
            <li>10 usd to eur</li>
            <li>5 km in miles</li>
            <li>100 pounds to kg</li>
            <li>32 f to c</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
