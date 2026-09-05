import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, PieChart, ShieldCheck, Target, Award } from 'lucide-react';
import { api } from '../services/api';
import { DashboardStats } from '../types';

export const AnalyticsPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.getStats();
        setStats(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-[#E2E8F0] dark:border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-[#0F766E] dark:text-teal-400 uppercase tracking-wider mb-1">
          <BarChart3 className="w-4 h-4" />
          <span>Executive Intelligence Performance</span>
        </div>
        <h1 className="text-2xl font-extrabold text-[#0F172A] dark:text-slate-100 tracking-tight">
          Prospect Analytics & Data Quality Insights
        </h1>
        <p className="text-sm text-[#64748B] dark:text-slate-400 mt-1">
          High-level metrics on prospect distribution, multi-source confidence, and candidate qualification rates.
        </p>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="enterprise-card p-5 space-y-2">
          <span className="text-xs font-semibold text-[#64748B]">Average ICP Precision</span>
          <div className="text-3xl font-extrabold text-[#0F766E]">94.2%</div>
          <div className="text-xs text-[#16A34A] font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> High ICP Precision
          </div>
        </div>

        <div className="enterprise-card p-5 space-y-2">
          <span className="text-xs font-semibold text-[#64748B]">Multi-Source Confidence</span>
          <div className="text-3xl font-extrabold text-[#2563EB]">98.1%</div>
          <div className="text-xs text-[#2563EB] font-semibold">Cross-checked via APIs</div>
        </div>

        <div className="enterprise-card p-5 space-y-2">
          <span className="text-xs font-semibold text-[#64748B]">Research Completion Rate</span>
          <div className="text-3xl font-extrabold text-[#16A34A]">99.4%</div>
          <div className="text-xs text-[#16A34A] font-semibold">Zero Workflow Failures</div>
        </div>

        <div className="enterprise-card p-5 space-y-2">
          <span className="text-xs font-semibold text-[#64748B]">Conflict Flag Rate</span>
          <div className="text-3xl font-extrabold text-[#D97706]">1.8%</div>
          <div className="text-xs text-[#D97706] font-semibold">Sent to Human Review</div>
        </div>
      </div>

      {/* Grid of Analytics Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prospect Score Distribution */}
        <div className="enterprise-card p-6 space-y-4">
          <h3 className="font-bold text-sm text-[#0F172A] dark:text-slate-100 flex items-center gap-2">
            <Target className="w-4 h-4 text-[#0F766E]" />
            Prospect Score Distribution
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>90–100 (Excellent Match)</span>
                <span className="font-mono font-bold text-[#16A34A]">142 prospects (57%)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-[#E2E8F0] dark:bg-slate-700 overflow-hidden">
                <div className="h-full bg-[#16A34A] rounded-full" style={{ width: '57%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>75–89 (Strong Match)</span>
                <span className="font-mono font-bold text-[#0F766E]">78 prospects (31%)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-[#E2E8F0] dark:bg-slate-700 overflow-hidden">
                <div className="h-full bg-[#0F766E] rounded-full" style={{ width: '31%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>50–74 (Moderate Match)</span>
                <span className="font-mono font-bold text-[#D97706]">20 prospects (8%)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-[#E2E8F0] dark:bg-slate-700 overflow-hidden">
                <div className="h-full bg-[#D97706] rounded-full" style={{ width: '8%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Below 50 (Low Match)</span>
                <span className="font-mono font-bold text-[#DC2626]">8 prospects (4%)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-[#E2E8F0] dark:bg-slate-700 overflow-hidden">
                <div className="h-full bg-[#DC2626] rounded-full" style={{ width: '4%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Industry Distribution */}
        <div className="enterprise-card p-6 space-y-4">
          <h3 className="font-bold text-sm text-[#0F172A] dark:text-slate-100 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-[#2563EB]" />
            Industry Distribution
          </h3>

          <div className="space-y-3 text-xs">
            {[
              { label: 'FinTech / Financial Services', percentage: '42%', width: '42%', color: 'bg-[#0F766E]' },
              { label: 'B2B SaaS / Enterprise Tech', percentage: '36%', width: '36%', color: 'bg-[#2563EB]' },
              { label: 'Healthcare & HealthTech', percentage: '14%', width: '14%', color: 'bg-[#16A34A]' },
              { label: 'AI & Machine Learning', percentage: '8%', width: '8%', color: 'bg-[#D97706]' },
            ].map((ind, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span>{ind.label}</span>
                  <span className="font-mono font-bold text-[#0F172A] dark:text-slate-200">{ind.percentage}</span>
                </div>
                <div className="w-full h-3 rounded-full bg-[#E2E8F0] dark:bg-slate-700 overflow-hidden">
                  <div className={`h-full ${ind.color} rounded-full`} style={{ width: ind.width }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
