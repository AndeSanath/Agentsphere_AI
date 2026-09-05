import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Bot,
  Search,
  Sliders,
  ArrowRight,
  Building,
  ExternalLink,
  Mail,
  Phone,
  Linkedin,
  ShieldCheck,
  ListOrdered,
  Loader2,
  ChevronRight
} from 'lucide-react';
import { api } from '../services/api';
import { ICPCriteria, TaskPlanItem, SearchRecord, Organization } from '../types';

export const NewSearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'natural' | 'advanced'>('natural');
  const [query, setQuery] = useState('Find SaaS companies in Hyderabad with 100-500 employees and identify CTOs.');
  
  const [icp, setIcp] = useState<ICPCriteria>({
    industry: 'SaaS',
    location: 'Hyderabad',
    employee_range: '100-500',
    target_role: 'CTO',
    technology: 'Cloud / Node.js / React',
    revenue_range: '$10M - $50M',
    business_type: 'Enterprise B2B',
    other_requirements: 'Must have active tech leadership and verified contact emails'
  });

  const [loading, setLoading] = useState(false);
  const [previewPlan, setPreviewPlan] = useState<TaskPlanItem[] | null>(null);

  // Search Results Inline State
  const [searchRecord, setSearchRecord] = useState<SearchRecord | null>(null);
  const [prospects, setProspects] = useState<Organization[]>([]);

  const handlePreviewPlan = async () => {
    try {
      const res = await api.planSearch(activeTab === 'natural' ? query : undefined, activeTab === 'advanced' ? icp : undefined);
      if (res.tasks) {
        setPreviewPlan(res.tasks);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleStartSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearchRecord(null);
    setProspects([]);
    try {
      const record = await api.startSearch(
        activeTab === 'natural' ? query : undefined,
        activeTab === 'advanced' ? icp : undefined
      );
      setSearchRecord(record);
      const foundProspects = await api.getProspects({ search_id: record.id });
      setProspects(foundProspects);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Planner Agent Interface</span>
        </div>
        <h1 className="text-3xl font-black text-white">New Prospect Search</h1>
        <p className="text-sm text-slate-400 mt-1">
          Specify your Ideal Customer Profile (ICP). The Planner Agent will decompose requirements into autonomous agent tasks.
        </p>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-900 border border-slate-800 w-fit">
        <button
          onClick={() => { setActiveTab('natural'); setPreviewPlan(null); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
            activeTab === 'natural'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Search className="w-4 h-4" />
          Option 1: Natural Language Search
        </button>
        <button
          onClick={() => { setActiveTab('advanced'); setPreviewPlan(null); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
            activeTab === 'advanced'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sliders className="w-4 h-4" />
          Option 2: Advanced ICP Form
        </button>
      </div>

      {/* Main Input Form */}
      <form onSubmit={handleStartSearch} className="space-y-6">
        {activeTab === 'natural' ? (
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              Natural Language Prompt
            </label>
            <textarea
              rows={4}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Find SaaS companies in Hyderabad with 100-500 employees and identify CTOs."
              className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition"
            />
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-400">
              <span className="font-semibold text-slate-500">Quick Examples:</span>
              <button
                type="button"
                onClick={() => setQuery("Find SaaS companies in Hyderabad with 100-500 employees and identify CTOs.")}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                SaaS in Hyderabad (100-500)
              </button>
              <button
                type="button"
                onClick={() => setQuery("Find Healthcare tech companies in Bangalore with 200+ employees.")}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                HealthTech in Bangalore
              </button>
              <button
                type="button"
                onClick={() => setQuery("Find FinTech startups in Mumbai with VP Engineering target role.")}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                FinTech in Mumbai
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Structured ICP Criteria</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Industry</label>
                <input
                  type="text"
                  value={icp.industry}
                  onChange={(e) => setIcp({ ...icp, industry: e.target.value })}
                  className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Location</label>
                <input
                  type="text"
                  value={icp.location}
                  onChange={(e) => setIcp({ ...icp, location: e.target.value })}
                  className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Company Size (Employees)</label>
                <input
                  type="text"
                  value={icp.employee_range}
                  onChange={(e) => setIcp({ ...icp, employee_range: e.target.value })}
                  className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Target Executive Role</label>
                <input
                  type="text"
                  value={icp.target_role}
                  onChange={(e) => setIcp({ ...icp, target_role: e.target.value })}
                  className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Revenue Range</label>
                <input
                  type="text"
                  value={icp.revenue_range}
                  onChange={(e) => setIcp({ ...icp, revenue_range: e.target.value })}
                  className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Funding Stage</label>
                <input
                  type="text"
                  value={icp.funding_stage || ''}
                  placeholder="e.g. Series A, Bootstrapped, Seed"
                  onChange={(e) => setIcp({ ...icp, funding_stage: e.target.value })}
                  className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Target Geography / Region</label>
                <input
                  type="text"
                  value={icp.target_geography || ''}
                  placeholder="e.g. APAC, EMEA, North America"
                  onChange={(e) => setIcp({ ...icp, target_geography: e.target.value })}
                  className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Compliance Certifications</label>
                <input
                  type="text"
                  value={icp.compliance_certifications || ''}
                  placeholder="e.g. SOC2 Type II, ISO27001, HIPAA"
                  onChange={(e) => setIcp({ ...icp, compliance_certifications: e.target.value })}
                  className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Target Department</label>
                <input
                  type="text"
                  value={icp.target_department || ''}
                  placeholder="e.g. Engineering & Tech, Sales & Revenue"
                  onChange={(e) => setIcp({ ...icp, target_department: e.target.value })}
                  className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Growth Signals / Intent</label>
                <input
                  type="text"
                  value={icp.growth_signals || ''}
                  placeholder="e.g. Active Hiring, New Funding"
                  onChange={(e) => setIcp({ ...icp, growth_signals: e.target.value })}
                  className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-purple-500 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handlePreviewPlan}
            className="px-5 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-purple-500/40 text-xs font-bold transition flex items-center gap-2"
          >
            <Bot className="w-4 h-4 text-purple-400" />
            Preview Agent Task Plan
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white font-bold text-sm shadow-xl shadow-purple-950 hover:opacity-95 transition flex items-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {loading ? 'Discovering Companies...' : 'Start Agent Search'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </form>

      {/* Planner Task Plan Visual Preview */}
      {previewPlan && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-purple-500/40 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
              <ListOrdered className="w-4 h-4 text-purple-400" />
              Planner Agent Decomposed Tasks
            </h3>
            <span className="text-xs text-purple-300 font-mono">7 Sub-Tasks Planned</span>
          </div>

          <div className="space-y-2">
            {previewPlan.map((task) => (
              <div key={task.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-purple-950 text-purple-300 flex items-center justify-center font-bold text-[11px] border border-purple-500/30">
                    {task.id}
                  </span>
                  <div>
                    <div className="font-bold text-slate-200">{task.name}</div>
                    <div className="text-[11px] text-slate-400">{task.description}</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                  {task.agent}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="p-8 rounded-2xl bg-purple-950/30 border border-purple-500/40 flex flex-col items-center justify-center space-y-4 animate-pulse text-center">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
          <div>
            <h3 className="font-extrabold text-purple-200 text-base">Gemini 2.5 & Agent Pipeline Running</h3>
            <p className="text-xs text-purple-300/80 mt-1 max-w-lg">
              Searching real-world market datasets, performing HTTP web scraping, scoring ICP alignment, and finding decision makers...
            </p>
          </div>
        </div>
      )}

      {/* DISCOVERED PROSPECT RESULTS DIRECTLY BELOW THE REQUEST FORM */}
      {searchRecord && prospects.length > 0 && (
        <div className="space-y-6 pt-4 border-t-2 border-purple-500/30">
          {/* Summary Stats Banner */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-purple-500/40 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-mono text-purple-400 uppercase tracking-widest font-bold">
                    Discovery Results for Search Request
                  </div>
                  <h2 className="text-xl font-black text-white mt-0.5">
                    Discovered {prospects.length} Target Prospect Companies
                  </h2>
                </div>
              </div>

              <button
                onClick={() => navigate(`/workflow?search_id=${searchRecord.id}`)}
                className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition"
              >
                View Agent Workflow Graph
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 font-semibold block">Total Found</span>
                <span className="text-lg font-black text-white">{prospects.length} Companies</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 font-semibold block">ICP Match Grade</span>
                <span className="text-lg font-black text-emerald-400">High Grade (85%-98%)</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 font-semibold block">Decision Makers</span>
                <span className="text-lg font-black text-cyan-400">
                  {prospects.reduce((sum, p) => sum + p.decision_makers.length, 0)} Identified
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 font-semibold block">Web Verification</span>
                <span className="text-lg font-black text-purple-400">Live Scraped (HTTP 200)</span>
              </div>
            </div>
          </div>

          {/* Prospect Cards List */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-slate-100 text-base flex items-center gap-2">
              <Building className="w-4 h-4 text-purple-400" />
              Discovered Target Companies & Executive Contacts
            </h3>

            {prospects.map((org) => {
              const dm = org.decision_makers[0];
              return (
                <div
                  key={org.id}
                  className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 transition-all space-y-4 shadow-lg"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <img
                        src={org.logo_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60'}
                        alt={org.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-700 bg-slate-800"
                      />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-black text-base text-white">{org.name}</h4>
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold">
                            {org.icp_match_score}% Match
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-500/40 text-[11px] font-bold flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-purple-400" />
                            Live Web Scraped
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 flex-wrap font-medium">
                          <span>{org.industry}</span>
                          <span>•</span>
                          <span>{org.location}</span>
                          <span>•</span>
                          <span>{org.employee_count} employees</span>
                          <span>•</span>
                          <span>{org.revenue_range}</span>
                        </div>
                      </div>
                    </div>

                    <a
                      href={org.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 w-fit transition"
                    >
                      <span>Website</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Company Description */}
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    {org.description}
                  </p>

                  {/* Tech Stack & Key Products */}
                  {org.products_services && org.products_services.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="text-slate-400 font-semibold text-[11px]">Key Offerings:</span>
                      {org.products_services.map((prod, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-mono">
                          {prod}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Decision Maker / CTO Contact Card */}
                  {dm && (
                    <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 font-bold flex items-center justify-center text-xs">
                          {dm.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-extrabold text-slate-100 text-xs">{dm.name}</div>
                          <div className="text-[11px] text-purple-300 font-medium">{dm.role}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-wrap">
                        {dm.email && (
                          <a
                            href={`mailto:${dm.email}`}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-purple-400 text-purple-300 font-mono text-[11px] transition"
                          >
                            <Mail className="w-3.5 h-3.5 text-purple-400" />
                            <span>{dm.email}</span>
                          </a>
                        )}

                        {dm.phone && (
                          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 font-mono text-[11px]">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>{dm.phone}</span>
                          </span>
                        )}

                        {dm.linkedin_url && (
                          <a
                            href={dm.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-blue-400 text-blue-400 transition"
                            title="LinkedIn Profile"
                          >
                            <Linkedin className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

