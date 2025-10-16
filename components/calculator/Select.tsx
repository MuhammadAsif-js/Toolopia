// components/calculator/Select.tsx
"use client";
import React from 'react';
import { cn } from '@/lib/utils';

interface SelectProps {
  id: string;
  label: string;
  value: string | number | undefined;
  onChange: (v: string) => void;
  options: { label: string; value: string | number }[];
  required?: boolean;
  helperText?: string;
  error?: string;
}

export const SelectField: React.FC<SelectProps> = ({ id, label, value, onChange, options, required, helperText, error }) => {
  const describedBy = error ? `${id}-error` : helperText ? `${id}-help` : undefined;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-200">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      <select
        id={id}
        name={id}
        value={value as any}
        onChange={(e) => onChange(e.target.value)}
        aria-describedby={describedBy}
        aria-invalid={!!error}
        className={cn(
          'w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition',
          error && 'border-red-500 focus:ring-red-500 focus:border-red-500'
        )}
      >
        <option value="" disabled>
          Select...
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value} className="text-gray-900">
            {o.label}
          </option>
        ))}
      </select>
      {helperText && !error && (
        <p id={`${id}-help`} className="text-xs text-gray-400">
          {helperText}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};
