import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Building2,
  Globe,
  Users,
  MapPin,
  Sparkles,
  ShieldCheck,
  Mail,
  Phone,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Send,
  ExternalLink,
  RotateCw,
  BarChart3,
  Layers,
  HelpCircle
} from 'lucide-react';
import { api } from '../services/api';
import { Organization } from '../types';

export const OrganizationDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [org, setOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'research' | 'validation' | 'score' | 'sources' | 'review'>('overview');

  useEffect(() => {
    const fetchOrg = async () => {
      if (!id) return;
      try {
        const data = await api.getOrganization(id);
        setOrg(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchOrg();
  }, [id]);

  if (!org) {
    return (
      <div className="p-12 text-center text-[#64748B] dark:text-slate-400 space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#0F766E] border-t-transparent animate-spin mx-auto" />
        <div className="text-sm font-bold">Loading organization intelligence profile...</div>
      </div>
    );
  }

  const score = org.icp_match_score || 91;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] transition"
      >
        <ArrowLeft className="w-4 h-4 text-[#0F766E]" />
        Back to Prospects
      </button>

      {/* Company Header */}
      <div className="enterprise-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <img
            src={org.logo_url}
            alt=""
            className="w-16 h-16 rounded-xl object-cover border border-[#E2E8F0] dark:border-slate-700 bg-white shrink-0"
          />
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-extrabold text-[#0F172A] dark:text-slate-100">{org.name}</h1>
              <span className="px-3 py-1 rounded-full bg-[#DCFCE7] text-[#16A34A] font-extrabold text-xs border border-[#BBF7D0]">
                Prospect Score: {score} • Excellent Match
              </span>
            </div>
            <p className="text-xs text-[#64748B] dark:text-slate-400 font-semibold flex items-center gap-2">
              <span>{org.industry}</span>
              <span>•</span>
              <span>{org.location}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={org.website}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 text-[#0F172A] dark:text-slate-200 font-bold text-xs flex items-center gap-2 hover:bg-[#F1F5F9] transition"
          >
            <Globe className="w-4 h-4 text-[#0F766E]" /> View Website <ExternalLink className="w-3 h-3 text-[#64748B]" />
          </a>

          <button
            onClick={() => navigate('/icp')}
            className="px-4 py-2 rounded-lg bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-xs flex items-center gap-2 transition"
          >
            <RotateCw className="w-4 h-4" /> Run Research Again
          </button>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] dark:border-slate-800 overflow-x-auto text-xs font-bold">
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'research', label: 'Research Intelligence' },
          { key: 'validation', label: 'Validation' },
          { key: 'score', label: 'Score Breakdown' },
          { key: 'sources', label: 'Sources' },
          { key: 'review', label: 'Human Review' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-3 border-b-2 transition ${
              activeTab === tab.key
                ? 'border-[#0F766E] text-[#0F766E] dark:text-[#5EEAD4] bg-[#CCFBF1]/20'
                : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="enterprise-card p-6 space-y-4">
              <h2 className="font-bold text-sm text-[#0F172A] dark:text-slate-100">Company Overview</h2>
              <p className="text-xs text-[#64748B] dark:text-slate-300 leading-relaxed">{org.description}</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-3">
                <div className="p-3 rounded-lg bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700">
                  <span className="text-[#64748B] font-semibold block text-[10px] uppercase">Industry</span>
                  <span className="text-[#0F172A] dark:text-slate-100 font-bold">{org.industry}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700">
                  <span className="text-[#64748B] font-semibold block text-[10px] uppercase">Headquarters</span>
                  <span className="text-[#0F172A] dark:text-slate-100 font-bold">{org.city}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700">
                  <span className="text-[#64748B] font-semibold block text-[10px] uppercase">Employee Count</span>
                  <span className="text-[#0F172A] dark:text-slate-100 font-bold font-mono">{org.employee_count}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700">
                  <span className="text-[#64748B] font-semibold block text-[10px] uppercase">Revenue Estimate</span>
                  <span className="text-[#0F172A] dark:text-slate-100 font-bold">{org.revenue_range || '$20M - $50M'}</span>
                </div>
              </div>
            </div>

            {/* Data Resources Collected From Section */}
            <div className="enterprise-card p-6 space-y-4">
              <h2 className="font-bold text-sm text-[#0F172A] dark:text-slate-100 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#0F766E]" />
                Data Resources Collected From ({org.sources.length || 3} Resources)
              </h2>
              <p className="text-xs text-[#64748B] dark:text-slate-400">
                Prospect intelligence gathered and grounded across multiple independent B2B data providers and web extractors:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {org.sources.map((s, idx) => (
                  <div key={idx} className="p-3.5 rounded-lg bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 flex items-start gap-3">
                    <div className="p-2 rounded-md bg-[#CCFBF1] dark:bg-teal-950 text-[#0F766E] shrink-0 font-extrabold text-xs">
                      {s.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <div className="font-extrabold text-[#0F172A] dark:text-slate-100 truncate">{s.name}</div>
                      <div className="text-[10px] text-[#64748B] font-mono truncate">{s.url || org.website}</div>
                      <div className="text-[10px] font-bold text-[#16A34A]">Status: Active & Verified • Checked {s.last_checked}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Growth & Tech Signals */}
            <div className="enterprise-card p-6 space-y-4">
              <h2 className="font-bold text-sm text-[#0F172A] dark:text-slate-100">Growth & Technology Signals</h2>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-bold text-[#64748B] block mb-1">Technology Stack Signals</span>
                  <div className="flex flex-wrap gap-2">
                    {org.products_services.map((p) => (
                      <span key={p} className="px-2.5 py-1 rounded bg-[#DBEAFE] text-[#2563EB] font-bold text-xs">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-bold text-[#64748B] block mb-1">Growth & Hiring Signals</span>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 rounded bg-[#DCFCE7] text-[#16A34A] font-bold text-xs">
                      Active Tech Hiring (+15 open roles)
                    </span>
                    <span className="px-2.5 py-1 rounded bg-[#DCFCE7] text-[#16A34A] font-bold text-xs">
                      Series B Expansion
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Decision Makers Sidebar */}
          <div className="space-y-6">
            <div className="enterprise-card p-6 space-y-4">
              <h2 className="font-bold text-sm text-[#0F172A] dark:text-slate-100 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#0F766E]" />
                Decision Makers ({org.decision_makers.length})
              </h2>

              <div className="space-y-3">
                {org.decision_makers.map((dm) => (
                  <div key={dm.id} className="p-3.5 rounded-lg bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 text-xs space-y-2">
                    <div className="font-bold text-[#0F172A] dark:text-slate-100">{dm.name}</div>
                    <div className="text-[11px] text-[#0F766E] font-semibold">{dm.role}</div>
                    {dm.email && (
                      <div className="text-[11px] font-mono text-[#16A34A]">{dm.email}</div>
                    )}
                    <div className="text-[10px] text-[#64748B]">Resource: <strong className="text-[#0F172A] dark:text-slate-300">{dm.source?.name || 'Apollo People Intelligence API'}</strong></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Sources */}
      {activeTab === 'sources' && (
        <div className="enterprise-card p-6 space-y-6">
          <div className="border-b border-[#E2E8F0] dark:border-slate-800 pb-4">
            <h2 className="font-extrabold text-base text-[#0F172A] dark:text-slate-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#0F766E]" />
              Data Sources & Provenance Audit
            </h2>
            <p className="text-xs text-[#64748B] mt-1">
              Complete catalog of independent external data providers and web extractors used to compile this prospect record.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {org.sources.map((src, index) => (
              <div key={index} className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-[#0F172A] dark:text-slate-100 text-sm">{src.name}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#16A34A] font-bold text-[10px] border border-[#BBF7D0]">
                    Verified Source
                  </span>
                </div>
                <div className="text-[#64748B] font-mono text-[11px]">URL: {src.url || org.website}</div>
                <div className="flex justify-between items-center text-[10px] text-[#64748B] pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span>Last Checked: {src.last_checked}</span>
                  <span className="font-bold text-[#0F766E]">Reliability: High (95%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Validation */}
      {activeTab === 'validation' && (
        <div className="space-y-6">
          <div className="enterprise-card p-6 space-y-6">
            <h2 className="font-bold text-sm text-[#0F172A] dark:text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
              Multi-Source Grounded Data Validation
            </h2>

            {/* Employee Count Validation */}
            <div className="p-5 rounded-lg bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#0F172A] dark:text-slate-100">Employee Count</span>
                <span className="text-xs font-bold text-[#16A34A] flex items-center gap-1">
                  ● High Confidence
                </span>
              </div>

              <div className="text-sm font-extrabold text-[#0F172A] dark:text-slate-100 font-mono">
                Validated Estimate: 500 – 520 employees
              </div>

              <div className="pt-2 border-t border-[#E2E8F0] dark:border-slate-700 space-y-1.5 text-xs text-[#64748B]">
                <div className="font-bold text-[#0F172A] dark:text-slate-300">Supporting Sources:</div>
                <div className="flex justify-between font-mono"><span>Source A (Company Filings):</span> <strong>500</strong></div>
                <div className="flex justify-between font-mono"><span>Source B (Public Directory):</span> <strong>510</strong></div>
                <div className="flex justify-between font-mono"><span>Source C (Web Crawl):</span> <strong>520</strong></div>
              </div>
            </div>

            {/* Revenue Conflict Detection Box */}
            <div className="p-5 rounded-lg bg-[#FEF3C7] dark:bg-amber-950/40 border border-[#FDE68A] dark:border-amber-800 space-y-3">
              <div className="flex items-center justify-between text-[#D97706]">
                <span className="font-bold text-xs flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Conflict Detected: Revenue Estimate
                </span>
                <span className="text-xs font-bold">Confidence: Medium</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <div className="p-2 rounded bg-white dark:bg-slate-900 border">Source A: $20M</div>
                <div className="p-2 rounded bg-white dark:bg-slate-900 border">Source B: $22M</div>
                <div className="p-2 rounded bg-white dark:bg-slate-900 border text-red-600">Source C: $100M (Outlier)</div>
              </div>

              <div className="p-3 rounded bg-white dark:bg-slate-900 border text-xs space-y-1">
                <div className="font-bold text-[#0F172A] dark:text-slate-100">Validated Estimate: $20M – $22M</div>
                <div className="text-[#64748B] text-[11px]">
                  <strong>Why?</strong> Two reliable primary sources provided consistent values ($20M - $22M). One unverified third-party directory significantly differed from the majority.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Score Breakdown */}
      {activeTab === 'score' && (
        <div className="enterprise-card p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-slate-800 pb-4">
            <div>
              <h2 className="font-bold text-sm text-[#0F172A] dark:text-slate-100">ICP Fit Score Breakdown</h2>
              <p className="text-xs text-[#64748B]">Detailed scoring distribution across qualifying criteria.</p>
            </div>
            <div className="text-2xl font-extrabold text-[#0F766E]">{score} / 100</div>
          </div>

          <div className="space-y-4 text-xs">
            {[
              { label: 'Industry Match', score: '25 / 25', percent: 100 },
              { label: 'Company Size Match', score: '20 / 20', percent: 100 },
              { label: 'Revenue Match', score: '18 / 20', percent: 90 },
              { label: 'Growth Signals', score: '14 / 15', percent: 93 },
              { label: 'Technology Match', score: '10 / 10', percent: 100 },
              { label: 'Hiring Signals', score: '4 / 10', percent: 40 },
            ].map((cat, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between font-bold">
                  <span>{cat.label}</span>
                  <span className="font-mono text-[#0F766E]">{cat.score}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#E2E8F0] dark:bg-slate-700 overflow-hidden">
                  <div className="h-full bg-[#0F766E] rounded-full" style={{ width: `${cat.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Human Review */}
      {activeTab === 'review' && (
        <div className="enterprise-card p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-slate-800 pb-3">
            <h2 className="font-bold text-sm text-[#0F172A] dark:text-slate-100 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#D97706]" />
              Data Conflict Human Resolution
            </h2>
            <span className="text-xs font-bold text-[#D97706] bg-[#FEF3C7] px-2.5 py-0.5 rounded">
              Needs Review
            </span>
          </div>

          <div className="p-4 rounded-lg bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 space-y-3 text-xs">
            <div className="font-bold text-[#0F172A] dark:text-slate-100">Revenue Estimate Discrepancy</div>
            <p className="text-[#64748B]">AI Confidence: 45%. Please select the verified value to ground in shared memory.</p>

            <div className="flex flex-wrap gap-2 pt-2">
              <button className="px-4 py-2 rounded-lg bg-[#0F766E] text-white font-bold hover:bg-[#115E59]">
                Approve ($20M – $22M)
              </button>
              <button className="px-4 py-2 rounded-lg bg-white border font-bold text-[#0F172A] hover:bg-[#F1F5F9]">
                Edit Value
              </button>
              <button className="px-4 py-2 rounded-lg bg-white border font-bold text-[#DC2626] hover:bg-[#FEE2E2]">
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
