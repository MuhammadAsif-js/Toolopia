// components/calculator/InputField.tsx
"use client";
import React from 'react';
import { cn } from '@/lib/utils';

interface InputFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string | number | undefined;
  onChange: (v: string) => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  required?: boolean;
  helperText?: string;
  error?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  type = 'number',
  value,
  onChange,
  min,
  max,
  step,
  placeholder,
  required,
  helperText,
  error,
}) => {
  const describedBy = error ? `${id}-error` : helperText ? `${id}-help` : undefined;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-200">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value as any}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        aria-describedby={describedBy}
        aria-invalid={!!error}
        className={cn(
          'w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition',
          error && 'border-red-500 focus:ring-red-500 focus:border-red-500'
        )}
      />
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
