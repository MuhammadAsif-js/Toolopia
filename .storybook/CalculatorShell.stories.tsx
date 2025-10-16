// .storybook/CalculatorShell.stories.tsx
// Outline only; requires Storybook configuration (not included here)
import type { Meta, StoryObj } from '@storybook/react';
import { CalculatorShell } from '../components/calculator/CalculatorShell';
import { calculateCompoundInterest } from '../lib/calculators/compoundInterest';
import { CalculatorInput } from '../types/calculator';

const inputs: CalculatorInput[] = [
  { id: 'principal', label: 'Principal ($)', type: 'number', required: true },
  { id: 'rate', label: 'Rate (%)', type: 'number', required: true },
  { id: 'years', label: 'Years', type: 'number', required: true },
  { id: 'frequency', label: 'Compounding', type: 'select', required: true, options: [
    { label: 'Annual', value: 1 },
    { label: 'Monthly', value: 12 },
  ] },
];

const meta: Meta<typeof CalculatorShell> = {
  title: 'Calculator/CalculatorShell',
  component: CalculatorShell,
};
export default meta;

type Story = StoryObj<typeof CalculatorShell>;

export const Basic: Story = {
  args: {
    title: 'Compound Interest Calculator',
    inputs,
    calculate: calculateCompoundInterest,
  },
};
