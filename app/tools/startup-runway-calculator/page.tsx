"use client";
import RunwayCalculator from './RunwayCalculator';
import { ToolHeader } from '@/components/tool-header';

export default function StartupRunwayCalculatorPage(){
  return (
    <div className="container py-8 sm:py-12 space-y-8">
      <ToolHeader slug="startup-runway-calculator" />
      <RunwayCalculator />
    </div>
  );
}
