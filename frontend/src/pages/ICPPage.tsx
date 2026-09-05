import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Target, Building, Users, DollarSign, Cpu, TrendingUp, Sparkles, Save, Play, Check,
  ExternalLink, Mail, Phone, Linkedin, ShieldCheck, Search, Filter, Loader2, Award, ChevronRight,
  Sliders, Zap, Globe, Shield, Briefcase, Rocket, Layers
} from 'lucide-react';
import { api } from '../services/api';
import { Organization, SearchRecord } from '../types';

export const ICPPage: React.FC = () => {
  const navigate = useNavigate();

  // Dynamic Natural Language Query State
  const [query, setQuery] = useState('Find Series A SaaS companies in Hyderabad with 100-500 employees, SOC2 compliance, looking for CTOs in Engineering.');
  const [showAdvancedFields, setShowAdvancedFields] = useState(false);

  // Advanced Form Fields State
  const [industry, setIndustry] = useState('SaaS');
  const [location, setLocation] = useState('Hyderabad');
  const [minEmployees, setMinEmployees] = useState(100);
  const [maxEmployees, setMaxEmployees] = useState(500);
  const [targetRole, setTargetRole] = useState('CTO');
  const [targetDepartment, setTargetDepartment] = useState('Engineering & Technology');
  const [fundingStage, setFundingStage] = useState('Series A');
  const [targetGeography, setTargetGeography] = useState('APAC');
  const [complianceCertifications, setComplianceCertifications] = useState('SOC2 Type II, ISO 27001');
  const [growthSignals, setGrowthSignals] = useState('Active Hiring, Funding Expansion');
  const [minRevenue, setMinRevenue] = useState('$10M');
  const [maxRevenue, setMaxRevenue] = useState('$50M');
  const [techTags, setTechTags] = useState(['AWS', 'Kubernetes', 'Python', 'React', 'AI/ML']);
  const [newTag, setNewTag] = useState('');

  // Search execution & results state
  const [loading, setLoading] = useState(false);
  const [searchRecord, setSearchRecord] = useState<SearchRecord | null>(null);
  const [prospects, setProspects] = useState<Organization[]>([]);

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      if (!techTags.includes(newTag.trim())) {
        setTechTags([...techTags, newTag.trim()]);
      }
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTechTags(techTags.filter((t) => t !== tagToRemove));
  };

  // Dynamic Search Handler
  const handleDynamicSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim() && !showAdvancedFields) return;

    setLoading(true);
    setSearchRecord(null);
    setProspects([]);

    try {
      let record: SearchRecord;
      if (showAdvancedFields) {
        record = await api.startSearch(undefined, {
          industry,
          location,
          employee_range: `${minEmployees}-${maxEmployees}`,
          target_role: targetRole,
          target_department: targetDepartment,
          funding_stage: fundingStage,
          target_geography: targetGeography,
          compliance_certifications: complianceCertifications,
          growth_signals: growthSignals,
          revenue_range: `${minRevenue} - ${maxRevenue}`,
          business_type: `Enterprise ${industry}`,
          technology: techTags.join(', ')
        });
      } else {
        record = await api.startSearch(query);
      }
      setSearchRecord(record);
      const foundProspects = await api.getProspects({ search_id: record.id });
      setProspects(foundProspects);
    } catch (err) {
      console.error('Error in dynamic ICP search:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#0F766E] dark:text-teal-400 uppercase tracking-wider mb-1">
            <Zap className="w-4 h-4 text-teal-400" />
            <span>Dynamic AI Prospect Intelligence</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] dark:text-slate-100 tracking-tight">
            Ideal Customer Profile (ICP) Search Engine
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Specify ICP firmographics, target leadership, funding stage, compliance standards, and growth signals in natural language or structured forms.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAdvancedFields(!showAdvancedFields)}
          className="px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-2 transition"
        >
          <Sliders className="w-4 h-4 text-teal-400" />
          {showAdvancedFields ? 'Switch to Dynamic Prompt' : 'Expanded Form Fields'}
        </button>
      </div>

      {/* DYNAMIC NATURAL LANGUAGE SEARCH BOX */}
      {!showAdvancedFields ? (
        <form onSubmit={handleDynamicSearch} className="enterprise-card p-6 space-y-5 bg-slate-900/90 border border-teal-500/40 shadow-xl">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold uppercase tracking-wider text-teal-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-400" />
                Dynamic Natural Language ICP Prompt
              </label>
              <span className="text-[11px] text-slate-400 font-mono">Multi-Agent Live AI Mode</span>
            </div>

            <textarea
              rows={3}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Find Series A SaaS companies in Hyderabad with 100-500 employees, SOC2 compliance, looking for CTOs in Engineering."
              className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition font-medium"
            />
          </div>

          {/* Quick 1-Click Smart Presets */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 block">Quick 1-Click Multi-Criteria Presets:</span>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => setQuery("Find Series A SaaS companies in Hyderabad with 100-500 employees, SOC2 compliance, and CTO decision makers.")}
                className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-teal-500 text-slate-300 hover:text-white transition flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                Series A SaaS in Hyderabad (SOC2 + CTO)
              </button>

              <button
                type="button"
                onClick={() => setQuery("Find FinTech startups in Bangalore with 200+ employees, Series B funding, and VP Engineering in APAC.")}
                className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-teal-500 text-slate-300 hover:text-white transition flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                Series B FinTech (Bangalore + VP Eng)
              </button>

              <button
                type="button"
                onClick={() => setQuery("Find Healthcare Tech companies in Mumbai with HIPAA compliance, 50-200 employees, and active hiring intent.")}
                className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-teal-500 text-slate-300 hover:text-white transition flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                HealthTech (HIPAA + Hiring Intent)
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-teal-600 via-indigo-600 to-purple-600 text-white font-bold text-sm shadow-xl hover:opacity-95 transition flex items-center gap-3 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
              {loading ? 'Running Multi-Agent Engine...' : 'Run Dynamic ICP Search'}
            </button>
          </div>
        </form>
      ) : (
        /* STRUCTURED EXPANDED FORM FIELDS */
        <div className="space-y-6">
          <div className="enterprise-card p-6 space-y-6">
            <h2 className="font-bold text-sm text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
              <Building className="w-4 h-4 text-teal-400" />
              1. Firmographics & Market Positioning
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-400 block">Target Industry</label>
                <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 font-medium outline-none focus:border-teal-500">
                  <option value="SaaS">B2B SaaS / Cloud Software</option>
                  <option value="FinTech">FinTech / Financial Services</option>
                  <option value="Healthcare">Healthcare & HealthTech</option>
                  <option value="Cybersecurity">Cybersecurity & SecOps</option>
                  <option value="E-Commerce">E-Commerce & Retail Tech</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-400 block">Target Location / City</label>
                <select value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 font-medium outline-none focus:border-teal-500">
                  <option value="Hyderabad">Hyderabad, India</option>
                  <option value="Bangalore">Bangalore, India</option>
                  <option value="Mumbai">Mumbai, India</option>
                  <option value="Delhi NCR">Delhi NCR, India</option>
                  <option value="Global">Global / Remote</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-400 block flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-teal-400" /> Target Geography / Region
                </label>
                <select value={targetGeography} onChange={(e) => setTargetGeography(e.target.value)} className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 font-medium outline-none focus:border-teal-500">
                  <option value="APAC">APAC (Asia-Pacific)</option>
                  <option value="North America">North America (US & Canada)</option>
                  <option value="EMEA">EMEA (Europe & Middle East)</option>
                  <option value="Global">Global Market</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs pt-2">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-400 block">Employee Headcount Range</label>
                <div className="flex items-center gap-3">
                  <input type="number" value={minEmployees} onChange={(e) => setMinEmployees(Number(e.target.value))} className="w-full p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 outline-none" />
                  <span className="text-slate-400 font-bold">to</span>
                  <input type="number" value={maxEmployees} onChange={(e) => setMaxEmployees(Number(e.target.value))} className="w-full p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 outline-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-400 block">Revenue Range</label>
                <div className="flex items-center gap-3">
                  <input type="text" value={minRevenue} onChange={(e) => setMinRevenue(e.target.value)} className="w-full p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 outline-none" />
                  <span className="text-slate-400 font-bold">to</span>
                  <input type="text" value={maxRevenue} onChange={(e) => setMaxRevenue(e.target.value)} className="w-full p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 outline-none" />
                </div>
              </div>
            </div>
          </div>

          <div className="enterprise-card p-6 space-y-6">
            <h2 className="font-bold text-sm text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
              <Users className="w-4 h-4 text-teal-400" />
              2. Target Executive Persona & Department
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-400 block">Target Executive Title</label>
                <input type="text" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} placeholder="e.g. CTO, VP Engineering, CEO" className="w-full p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 outline-none focus:border-teal-500 font-medium" />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-400 block flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-teal-400" /> Target Department
                </label>
                <select value={targetDepartment} onChange={(e) => setTargetDepartment(e.target.value)} className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 font-medium outline-none focus:border-teal-500">
                  <option value="Engineering & Technology">Engineering & Technology</option>
                  <option value="Sales & Revenue">Sales & Revenue Operations</option>
                  <option value="Product & Design">Product Management</option>
                  <option value="Cybersecurity">Cybersecurity & Information Security</option>
                  <option value="Executive Management">C-Suite / Founders</option>
                </select>
              </div>
            </div>
          </div>

          <div className="enterprise-card p-6 space-y-6">
            <h2 className="font-bold text-sm text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
              <Rocket className="w-4 h-4 text-teal-400" />
              3. Funding, Compliance & Growth Intent
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-400 block flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-teal-400" /> Funding Stage
                </label>
                <select value={fundingStage} onChange={(e) => setFundingStage(e.target.value)} className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 font-medium outline-none focus:border-teal-500">
                  <option value="Seed">Seed / Pre-Seed</option>
                  <option value="Series A">Series A</option>
                  <option value="Series B">Series B / Growth</option>
                  <option value="Series C+">Series C+ / Pre-IPO</option>
                  <option value="Bootstrapped">Bootstrapped & Profitable</option>
                  <option value="Public">Public Enterprise</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-400 block flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-teal-400" /> Compliance & Security Standards
                </label>
                <input type="text" value={complianceCertifications} onChange={(e) => setComplianceCertifications(e.target.value)} placeholder="e.g. SOC2, ISO27001, HIPAA, GDPR" className="w-full p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 outline-none focus:border-teal-500 font-medium" />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-400 block flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-teal-400" /> Growth Signals / Hiring Intent
                </label>
                <input type="text" value={growthSignals} onChange={(e) => setGrowthSignals(e.target.value)} placeholder="e.g. Hiring Tech Leaders, New Funding" className="w-full p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 outline-none focus:border-teal-500 font-medium" />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button type="button" onClick={() => handleDynamicSearch()} disabled={loading} className="px-8 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition disabled:opacity-50">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
              {loading ? 'Running Multi-Agent Engine...' : 'Run Structured ICP Search'}
            </button>
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="p-8 rounded-2xl bg-teal-950/40 border border-teal-500/40 flex flex-col items-center justify-center space-y-4 animate-pulse text-center">
          <Loader2 className="w-8 h-8 text-teal-400 animate-spin" />
          <h3 className="font-extrabold text-teal-200 text-base">Multi-Agent ICP Prospect Discovery Engine Active</h3>
          <p className="text-xs text-teal-300/80 max-w-md">
            Scanning business databases, verifying compliance requirements, matching target leadership personas & enrichment...
          </p>
        </div>
      )}

      {/* DISCOVERED PROSPECT RESULTS */}
      {searchRecord && prospects.length > 0 && (
        <div className="space-y-6 pt-4 border-t-2 border-teal-500/30">
          <div className="p-6 rounded-2xl bg-slate-900 border border-teal-500/40 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-teal-400 font-bold uppercase">Search ID: {searchRecord.id}</span>
                <h2 className="text-xl font-black text-white mt-1">Discovered {prospects.length} Target Prospects</h2>
              </div>
              <button onClick={() => navigate(`/workflow?search_id=${searchRecord.id}`)} className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition">
                View Workflow Graph <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {prospects.map((org) => (
              <div key={org.id} className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 transition-all space-y-4 shadow-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-base text-white">{org.name}</h4>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold">
                        {org.icp_match_score}% ICP Match
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{org.industry} • {org.location} • {org.employee_count} employees</p>
                  </div>
                  <a href={org.website} target="_blank" rel="noopener noreferrer" className="text-xs text-teal-400 hover:underline flex items-center gap-1">
                    Website <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <p className="text-xs text-slate-3-[#CBD5E1] bg-slate-950 p-3 rounded-xl border border-slate-800">{org.description}</p>

                {org.decision_makers[0] && (
                  <div className="p-4 rounded-xl bg-teal-950/20 border border-teal-500/30 text-xs text-teal-300 font-bold flex items-center justify-between">
                    <span>{org.decision_makers[0].name} ({org.decision_makers[0].role})</span>
                    <span className="font-mono text-[11px] text-teal-400">{org.decision_makers[0].email}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
