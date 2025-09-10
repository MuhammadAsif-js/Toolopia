"use client"

import React, { useMemo, useState } from 'react'
import { AdSlot } from '../../../components/ad-slot'
import articleData from './article.json'
import { ALL_TIMEZONES } from '../../../lib/all-timezones'

const ZONES = [
  { city: 'New York', tz: 'America/New_York' },
  { city: 'London', tz: 'Europe/London' },
  { city: 'Karachi', tz: 'Asia/Karachi' },
  { city: 'Sydney', tz: 'Australia/Sydney' },
  { city: 'Tokyo', tz: 'Asia/Tokyo' },
  { city: 'Los Angeles', tz: 'America/Los_Angeles' }
]

function makeDateInZone(time: string, timeZone: string) {
  if (!time) return null
  const [hh, mm] = time.split(':').map(Number)
  const now = new Date()
  const localized = new Date(now.toLocaleString('en-US', { timeZone }))
  localized.setHours(hh, mm, 0, 0)
  return localized
}

type CustomDropdownProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
};

function CustomDropdown({ label, value, onChange, options }: CustomDropdownProps) {
  const [open, setOpen] = React.useState<boolean>(false);
  const [search, setSearch] = React.useState<string>('');
  const filtered = options.filter((opt: string) => opt.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="relative">
      <label className="text-xs text-gray-900 dark:text-gray-100 font-semibold">{label}</label>
      <button
        type="button"
        className="mt-1 w-full rounded border px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-left"
        onClick={() => setOpen(o => !o)}
      >
        {value || `Select ${label}`}
      </button>
      {open && (
        <div className="absolute z-10 mt-1 w-full rounded border bg-white dark:bg-gray-800 shadow-lg max-h-60 overflow-auto">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={`Search ${label}...`}
            className="w-full px-3 py-2 border-b bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            autoFocus
          />
          {filtered.length === 0 ? (
            <div className="px-3 py-2 text-sm text-muted-foreground">No results</div>
          ) : (
            filtered.map((opt: string) => (
              <div
                key={opt}
                className={`px-3 py-2 cursor-pointer hover:bg-accent text-sm ${opt === value ? 'bg-primary text-white' : ''}`}
                onClick={() => { onChange(opt); setOpen(false); setSearch(''); }}
              >
                {opt}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function TimeZoneConverterTool() {
  const [time, setTime] = useState<string>('12:00')
  const [from, setFrom] = useState<string>(ALL_TIMEZONES[0])
  const [to, setTo] = useState<string>(ALL_TIMEZONES[1])
  const [fromSearch, setFromSearch] = useState('')
  const [toSearch, setToSearch] = useState('')

  const converted = useMemo(() => {
    if (!time) return ''
    const srcDate = makeDateInZone(time, from)
    if (!srcDate) return ''
    const fmt = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: to })
    return fmt.format(srcDate)
  }, [time, from, to])

  return (
    <div className="container py-12">
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">{articleData.title}</h1>
            {articleData.subtitle && <p className="text-muted-foreground mt-2">{articleData.subtitle}</p>}
          </div>
          <div className="w-72 hidden xl:block">
            <AdSlot enabled={false} variant="sidebar" className="w-full h-40" />
          </div>
        </div>

        <div className="w-full">
          <AdSlot enabled={false} variant="top" className="w-full h-20 mb-4" />
        </div>

        <div className="max-w-2xl mx-auto p-6 rounded-xl shadow-lg bg-card/70 backdrop-blur transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">🌍 Time Zone Converter</h2>
            <div className="text-sm text-muted-foreground">Instant client-side conversion</div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="col-span-1 md:col-span-1">
              <label className="text-xs text-gray-900 dark:text-gray-100 font-semibold">Time</label>
              <input type="time" value={time} onChange={e=>setTime(e.target.value)} className="mt-1 w-full rounded border px-3 py-2 transition-shadow focus:shadow-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
            </div>

            <CustomDropdown
              label="From"
              value={from}
              onChange={setFrom}
              options={ALL_TIMEZONES}
            />

    <CustomDropdown
      label="To"
      value={to}
      onChange={setTo}
      options={ALL_TIMEZONES}
    />
    {/* Minimal custom dropdown component */}
          </div>
        </div>

        <div className="mt-6 p-4 rounded-lg bg-background border flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Converted time</p>
            <div className="text-3xl font-extrabold mt-1 animate-fadeIn">{converted || '—'}</div>
          </div>
          <div className="text-sm text-muted-foreground">{from} → {to}</div>
        </div>

        <div className="mt-4">
          <AdSlot enabled={false} variant="inline" className="w-full h-24" />
        </div>
      </div>
    </div>
  );
}
