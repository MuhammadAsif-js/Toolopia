"use client";
import { ToolHeader } from '@/components/tool-header';
import SmartProfitabilityDashboard from './SmartProfitabilityDashboard';

export default function SmartProfitabilityDashboardPage(){
  return (
    <div className="container py-8 sm:py-12 space-y-8">
      <ToolHeader slug="smart-profitability-dashboard" />
      <SmartProfitabilityDashboard />
    </div>
  );
}
