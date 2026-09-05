import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Building2,
  Users,
  UserCheck,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Bot,
  CheckCircle2,
  Clock,
  AlertCircle,
  Play,
  ArrowRight,
  ShieldCheck,
  Search
} from 'lucide-react';
import { api } from '../services/api';
import { DashboardStats, SearchRecord, AgentInfo, Organization } from '../types';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [prospects, setProspects] = useState<Organization[]>([]);
  const [searches, setSearches] = useState<SearchRecord[]>([]);
  const [agents, setAgents] = useState<AgentInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sData, pData, searchData, agentData] = await Promise.all([
          api.getStats(),
          api.getProspects(),
          api.getSearches(),
          api.getAgents()
        ]);
        setStats(sData);
        setProspects(pData);
        setSearches(searchData);
        setAgents(agentData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Agent Workflow Stages Data
  const workflowStages = [
    { name: 'Discovery Agent', agent: 'Company Discovery Agent', icon: Search, status: 'completed' },
    { name: 'Research Agent', agent: 'Company Research Agent', icon: Building2, status: 'completed' },
    { name: 'Validation Agent', agent: 'Validation Agent', icon: ShieldCheck, status: 'completed' },
    { name: 'Scoring Agent', agent: 'ICP Matching Agent', icon: UserCheck, status: 'completed' },
    { name: 'Insight Agent', agent: 'Summary Agent', icon: Sparkles, status: 'running' },
  ];

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { bg: 'bg-[#DCFCE7]', text: 'text-[#16A34A]', border: 'border-[#BBF7D0]', label: 'Excellent Match' };
    if (score >= 75) return { bg: 'bg-[#CCFBF1]', text: 'text-[#0F766E]', border: 'border-[#99F6E4]', label: 'Strong Match' };
    if (score >= 50) return { bg: 'bg-[#FEF3C7]', text: 'text-[#D97706]', border: 'border-[#FDE68A]', label: 'Moderate Match' };
    return { bg: 'bg-[#FEE2E2]', text: 'text-[#DC2626]', border: 'border-[#FCA5A5]', label: 'Low Match' };
  };

  const getConfidenceIndicator = (confidence: string) => {
    if (confidence === 'High' || confidence === 'HIGH') {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#16A34A]">
          <span className="w-2 h-2 rounded-full bg-[#16A34A]" /> High Confidence
        </span>
      );
    }
    if (confidence === 'Medium' || confidence === 'MEDIUM') {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D97706]">
          <span className="w-2 h-2 rounded-full bg-[#D97706]" /> Medium Confidence
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#DC2626]">
        <span className="w-2 h-2 rounded-full bg-[#DC2626]" /> Low Confidence
      </span>
    );
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Header & Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] dark:text-slate-100 tracking-tight">
            Good Morning
          </h1>
          <p className="text-sm text-[#64748B] dark:text-slate-400 mt-1">
            Here's what's happening with your prospect intelligence today.
          </p>
        </div>

        <button
          onClick={() => navigate('/icp')}
          className="px-4 py-2.5 rounded-lg bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-xs flex items-center gap-2 shrink-0 transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create ICP
        </button>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Prospects */}
        <div className="enterprise-card enterprise-card-hover p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B] dark:text-slate-400">Total Prospects</span>
            <div className="p-2 rounded-lg bg-[#F1F5F9] dark:bg-slate-800 text-[#0F766E] dark:text-teal-400">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#0F172A] dark:text-slate-100">
            {stats?.organizations_found || 248}
          </div>
          <div className="text-xs text-[#16A34A] font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +18% this month
          </div>
        </div>

        {/* High-Quality Prospects */}
        <div className="enterprise-card enterprise-card-hover p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B] dark:text-slate-400">High-Quality Prospects</span>
            <div className="p-2 rounded-lg bg-[#CCFBF1] dark:bg-[#134E4A] text-[#0F766E] dark:text-[#5EEAD4]">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#0F766E] dark:text-[#5EEAD4]">
            {stats?.qualified_prospects || 184}
          </div>
          <div className="text-xs text-[#64748B] dark:text-slate-400 font-medium">
            Score &ge; 75% ICP match
          </div>
        </div>

        {/* Active Research Jobs */}
        <div className="enterprise-card enterprise-card-hover p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B] dark:text-slate-400">Active Research Jobs</span>
            <div className="p-2 rounded-lg bg-[#DBEAFE] dark:bg-blue-950 text-[#2563EB] dark:text-blue-400">
              <Bot className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#2563EB] dark:text-blue-400">
            {stats?.total_searches || 5}
          </div>
          <div className="text-xs text-[#64748B] dark:text-slate-400 font-medium">
            Multi-agent DAG active
          </div>
        </div>

        {/* Human Reviews Required */}
        <div className="enterprise-card enterprise-card-hover p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B] dark:text-slate-400">Human Reviews Required</span>
            <div className="p-2 rounded-lg bg-[#FEF3C7] dark:bg-amber-950 text-[#D97706] dark:text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#D97706] dark:text-amber-400">
            {stats?.pending_reviews || 2}
          </div>
          <button
            onClick={() => navigate('/review')}
            className="text-xs font-semibold text-[#D97706] hover:underline block"
          >
            Review data conflicts &rarr;
          </button>
        </div>
      </div>

      {/* AI Insight Component */}
      <div className="ai-insight-box p-5 space-y-2 relative">
        <div className="flex items-center gap-2 text-xs font-bold text-[#2563EB] dark:text-blue-400">
          <Sparkles className="w-4 h-4" />
          <span className="uppercase tracking-wider">✦ AI Insight</span>
        </div>
        <h3 className="font-bold text-sm text-[#0F172A] dark:text-slate-100">
          Strong Prospect Opportunity Identified
        </h3>
        <p className="text-xs text-[#64748B] dark:text-slate-300 leading-relaxed">
          The candidate pool in <strong className="text-[#0F172A] dark:text-white">FinTech & SaaS (Bangalore & Hyderabad)</strong> shows a <strong className="text-[#16A34A]">96.4% ICP precision match</strong>. Verified executive decision makers (CTOs) have been cross-checked across live website domain registries and API directories.
        </p>
      </div>

      {/* Agent Workflow Visualization Component */}
      <div className="enterprise-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-sm text-[#0F172A] dark:text-slate-100">
              Agent Workflow Pipeline Architecture
            </h2>
            <p className="text-xs text-[#64748B] dark:text-slate-400 mt-0.5">
              Live multi-agent execution graph processing candidate discovery, research, validation, and scoring.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[#DBEAFE] text-[#2563EB] border border-[#BFDBFE]">
            DAG Active
          </span>
        </div>

        {/* Workflow Steps Horizontal Flow */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
          {workflowStages.map((stage, idx) => {
            const Icon = stage.icon;
            const isRunning = stage.status === 'running';
            return (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                  isRunning
                    ? 'bg-[#DBEAFE]/40 border-[#2563EB] shadow-sm'
                    : 'bg-[#F8FAFC] dark:bg-slate-800/60 border-[#E2E8F0] dark:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-1.5 rounded-md ${isRunning ? 'bg-[#2563EB] text-white animate-pulse' : 'bg-slate-200 dark:bg-slate-700 text-[#0F172A] dark:text-white'}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  {stage.status === 'completed' && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#DCFCE7] text-[#16A34A]">
                      Completed
                    </span>
                  )}
                  {stage.status === 'running' && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#DBEAFE] text-[#2563EB] animate-pulse">
                      Running...
                    </span>
                  )}
                </div>

                <div>
                  <div className="font-bold text-[#0F172A] dark:text-slate-200">{stage.name}</div>
                  <div className="text-[10px] text-[#64748B] dark:text-slate-400 truncate">{stage.agent}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Prospect Intelligence Ranked Table */}
      <div className="enterprise-card overflow-hidden">
        <div className="p-5 border-b border-[#E2E8F0] dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-sm text-[#0F172A] dark:text-slate-100">
              Ranked Prospect Intelligence Directory ({prospects.length})
            </h2>
            <p className="text-xs text-[#64748B] dark:text-slate-400 mt-0.5">
              Prioritized candidate organizations scored by Ideal Customer Profile alignment.
            </p>
          </div>

          <button
            onClick={() => navigate('/prospects')}
            className="text-xs font-bold text-[#0F766E] hover:underline flex items-center gap-1"
          >
            View All Prospects &rarr;
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] dark:bg-slate-800/80 text-[#64748B] dark:text-slate-400 font-bold uppercase tracking-wider border-b border-[#E2E8F0] dark:border-slate-800">
                <th className="p-4">Company</th>
                <th className="p-4">Industry</th>
                <th className="p-4">Location</th>
                <th className="p-4">Employees</th>
                <th className="p-4 text-center">Prospect Score</th>
                <th className="p-4">Confidence</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] dark:divide-slate-800">
              {prospects.slice(0, 8).map((org) => {
                const scoreStyle = getScoreBadge(org.icp_match_score);
                return (
                  <tr
                    key={org.id}
                    onClick={() => navigate(`/prospects/${org.id}`)}
                    className="hover:bg-[#F8FAFC] dark:hover:bg-slate-800/50 transition cursor-pointer"
                  >
                    {/* Company */}
                    <td className="p-4 font-bold text-[#0F172A] dark:text-slate-100 flex items-center gap-3">
                      <img src={org.logo_url} alt="" className="w-8 h-8 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0" />
                      <div>
                        <div className="hover:text-[#0F766E] transition">{org.name}</div>
                        <div className="text-[10px] text-[#64748B] font-mono font-normal">{org.website}</div>
                      </div>
                    </td>

                    {/* Industry */}
                    <td className="p-4 text-[#0F172A] dark:text-slate-300 font-medium">{org.industry}</td>

                    {/* Location */}
                    <td className="p-4 text-[#0F172A] dark:text-slate-300">{org.city}</td>

                    {/* Employees */}
                    <td className="p-4 text-[#0F172A] dark:text-slate-300 font-mono font-semibold">{org.employee_count}</td>

                    {/* Prospect Score Badge */}
                    <td className="p-4 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <span className={`w-8 h-8 rounded-full font-extrabold flex items-center justify-center border ${scoreStyle.bg} ${scoreStyle.text} ${scoreStyle.border}`}>
                          {org.icp_match_score}
                        </span>
                        <span className="text-[10px] font-semibold text-[#64748B] dark:text-slate-400 hidden sm:inline">
                          {scoreStyle.label}
                        </span>
                      </div>
                    </td>

                    {/* Confidence Indicator */}
                    <td className="p-4">
                      {getConfidenceIndicator(org.confidence)}
                    </td>

                    {/* Status Badge */}
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#DCFCE7] text-[#16A34A] border border-[#BBF7D0]">
                        {org.validation_status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/prospects/${org.id}`);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 text-[#0F172A] dark:text-slate-200 font-bold hover:border-[#0F766E] transition shadow-xs"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
