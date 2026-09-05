import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Bot,
  Layers,
  Search,
  CheckCircle2,
  Building2,
  ShieldCheck,
  UserCheck,
  Zap,
  Target
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const workflowSteps = [
    { name: 'Planner Agent', desc: 'Parses requirement & builds DAG' },
    { name: 'Company Discovery', desc: 'Discovers candidate organizations' },
    { name: 'ICP Matching', desc: 'Scores against target criteria' },
    { name: 'Validation', desc: 'Cross-verifies facts across sources' },
    { name: 'Decision Maker', desc: 'Identifies target executive profiles' },
    { name: 'Contact Enrichment', desc: 'Enriches verified email & phone' },
    { name: 'Prospect Intelligence', desc: 'Generates summary & next action' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] text-[#0F172A] dark:text-slate-100 selection:bg-teal-600 selection:text-white relative overflow-hidden transition-colors">
      {/* Navigation Header */}
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative z-10 border-b border-[#E2E8F0] dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0F766E] text-white flex items-center justify-center font-bold shadow-sm">
            <Bot className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-[#0F172A] dark:text-white">AgentSphere AI</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 text-[#0F172A] dark:text-slate-200 hover:bg-[#F1F5F9] text-sm font-bold transition shadow-xs"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate('/icp')}
            className="px-5 py-2.5 rounded-lg bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-sm shadow-sm transition flex items-center gap-2"
          >
            Start Search
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-16 pb-24 relative z-10">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#CCFBF1] text-[#0F766E] text-xs font-bold border border-[#99F6E4]">
            <Zap className="w-3.5 h-3.5" />
            <span>Autonomous Multi-Agent B2B Prospect Discovery</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-[#0F172A] dark:text-slate-100">
            Turn Business Requirements Into Grounded B2B Prospects.
          </h1>

          <p className="text-base md:text-lg text-[#64748B] dark:text-slate-400 font-normal max-w-2xl mx-auto leading-relaxed">
            AgentSphere AI uses coordinated autonomous agents to discover, validate, enrich, and prioritize candidate organizations for enterprise sales teams.
          </p>

          <div className="flex items-center justify-center gap-4 pt-4">
            <button
              onClick={() => navigate('/icp')}
              className="px-7 py-3.5 rounded-lg bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-base shadow-sm transition flex items-center gap-3"
            >
              Start Prospect Search
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-7 py-3.5 rounded-lg bg-white dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 text-[#0F172A] dark:text-slate-200 font-bold text-base hover:bg-[#F1F5F9] transition shadow-xs"
            >
              Explore Dashboard
            </button>
          </div>
        </div>

        {/* Visual Agent Workflow Representation */}
        <div className="mt-16 p-8 rounded-xl bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] dark:border-slate-800">
            <div>
              <h2 className="text-base font-extrabold text-[#0F172A] dark:text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-[#0F766E]" />
                Coordinated Multi-Agent Execution Graph
              </h2>
              <p className="text-xs text-[#64748B] dark:text-slate-400">Autonomous workflow orchestration powered by LangGraph architecture</p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#DBEAFE] text-[#2563EB] border border-[#BFDBFE]">
              8 Specialized Agents Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
            {workflowSteps.map((step, idx) => (
              <div key={step.name} className="p-3.5 rounded-lg bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 text-center space-y-1">
                <div className="w-8 h-8 rounded-md bg-[#CCFBF1] text-[#0F766E] font-bold text-xs flex items-center justify-center mx-auto">
                  {idx + 1}
                </div>
                <h3 className="text-xs font-bold text-[#0F172A] dark:text-slate-200 pt-1">{step.name}</h3>
                <p className="text-[10px] text-[#64748B] dark:text-slate-400 leading-tight">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 space-y-3 shadow-xs">
            <Target className="w-7 h-7 text-[#0F766E]" />
            <h3 className="font-bold text-[#0F172A] dark:text-slate-100 text-sm">Ideal Customer Profile Builder</h3>
            <p className="text-xs text-[#64748B] dark:text-slate-400 leading-relaxed">
              Define industry, headcount, revenue ranges, tech stack, and growth trigger signals to guide autonomous discovery.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 space-y-3 shadow-xs">
            <ShieldCheck className="w-7 h-7 text-[#2563EB]" />
            <h3 className="font-bold text-[#0F172A] dark:text-slate-100 text-sm">Multi-Source Verification</h3>
            <p className="text-xs text-[#64748B] dark:text-slate-400 leading-relaxed">
              The Validation Agent cross-checks company website data against authorized APIs to prevent hallucinated data and flag discrepancies.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 space-y-3 shadow-xs">
            <UserCheck className="w-7 h-7 text-[#16A34A]" />
            <h3 className="font-bold text-[#0F172A] dark:text-slate-100 text-sm">Human-in-the-Loop Review</h3>
            <p className="text-xs text-[#64748B] dark:text-slate-400 leading-relaxed">
              Conflicting executive titles or low-confidence records trigger a dedicated Human Review queue for manual sales decision overrides.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
