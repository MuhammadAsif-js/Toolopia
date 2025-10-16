// types/calculator.ts

export type CalculatorInput = {
  id: string;
  label: string;
  type: 'number' | 'select' | 'text';
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string | number }[]; // for select
  helperText?: string;
};

export type CalculatorResult = {
  summary: string;
  breakdown?: Record<string, string | number>;
  chartData?: Array<{ x: number; y: number }>;
};

export type Example = {
  label: string;
  values: Record<string, number | string>;
};
