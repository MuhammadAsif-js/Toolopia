"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CurrencyTool() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loadingRates, setLoadingRates] = useState(true);

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

  useEffect(() => {
    let mounted = true;
    setLoadingRates(true);
    fetchRates()
      .then((data) => {
        if (mounted && data && data.rates) setRates(data.rates);
        setLoadingRates(false);
      })
      .catch(() => setLoadingRates(false));
    return () => {
      mounted = false;
    };
  }, []);

  function isCurrencyCode(t: string) {
    return /^[a-z]{3}$/i.test(t);
  }

  function handleConvert(input: string) {
    try {
      setQuery(input);
      const rawParts = input.trim().toLowerCase().split(/\s+/).filter(Boolean);
      if (rawParts.length < 3) {
        setResult("");
        return;
      }
      const amount = parseFloat(rawParts[0]);
      if (Number.isNaN(amount)) {
        setResult("⚠️ Could not parse amount");
        return;
      }
      let from = rawParts[1], to = rawParts[2];
      if (rawParts.length > 3) {
        if (["to", "in"].includes(rawParts[2])) to = rawParts[3];
      }
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
      setResult("⚠️ Could not convert. Check your input.");
    } catch (e) {
      setResult("⚠️ Error parsing input");
    }
  }

  return (
    <div className="w-full mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
      <Card className="min-w-0 overflow-hidden">
        <CardHeader>
          <CardTitle>Currency Converter</CardTitle>
          <CardDescription>Convert between world currencies using live exchange rates.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="convertInput">
              Enter conversion (e.g. <span className="font-mono">10 usd to eur</span>)
            </Label>
            <Input
              id="convertInput"
              type="text"
              value={query}
              onChange={(e) => {
                const v = e.target.value;
                setQuery(v);
                handleConvert(v);
              }}
              placeholder="e.g. 100 usd to inr"
            />
          </div>

          <div className="pt-1 min-h-[28px]">
            {loadingRates ? (
              <span className="text-sm text-muted-foreground">Loading rates...</span>
            ) : result ? (
              <div className="text-base sm:text-lg font-semibold text-primary">{result}</div>
            ) : (
              <span className="text-sm text-muted-foreground">Enter a query above to convert.</span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
