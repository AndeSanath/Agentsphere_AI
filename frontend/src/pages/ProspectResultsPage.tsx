import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Building2,
  Filter,
  ArrowUpDown,
  Search,
  CheckCircle2,
  ShieldAlert,
  Mail,
  Phone,
  ChevronRight,
  Download,
  ExternalLink,
  Copy,
  Check,
  Eye,
  X,
  User,
  ShieldCheck,
  Globe,
  History,
  Trash2,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';
import { Organization, SearchRecord } from '../types';

export const ProspectResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchId = searchParams.get('search_id');

  const [prospects, setProspects] = useState<Organization[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filters & Sorting
  const [industryFilter, setIndustryFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('icp_score');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Fetch Search History & Prospects
  const loadData = async () => {
    setLoading(true);
    try {
      const [historyData, prospectData] = await Promise.all([
        api.getSearches(),
        api.getProspects({
          search_id: searchId || undefined,
          industry: industryFilter,
          location: locationFilter,
          validation_status: statusFilter,
          sort_by: sortBy
        })
      ]);
      setSearchHistory(historyData);
      setProspects(prospectData);
    } catch (e) {
      console.error('Error fetching data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchId, industryFilter, locationFilter, statusFilter, sortBy]);

  // Handle Deleting Individual Search History Item
  const handleDeleteSearch = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.deleteSearch(id);
      if (searchId === id) {
        navigate('/prospects');
      } else {
        loadData();
      }
    } catch (err) {
      console.error('Error deleting search:', err);
    }
  };

  // Handle Clearing All Search History
  const handleClearAllHistory = async () => {
    if (!window.confirm('Are you sure you want to clear all ICP search history and associated prospects?')) return;
    try {
      await api.clearAllSearches();
      navigate('/prospects');
      loadData();
    } catch (err) {
      console.error('Error clearing history:', err);
    }
  };

  // Find currently selected search record if searchId is set
  const currentSearchRecord = useMemo(() => {
    if (!searchId) return null;
    return searchHistory.find(s => s.id === searchId);
  }, [searchId, searchHistory]);

  // Client-side text search filtering
  const filteredProspects = useMemo(() => {
    return prospects.filter((org) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const matchName = org.name.toLowerCase().includes(q);
      const matchDesc = org.description?.toLowerCase().includes(q) || false;
      const matchCity = org.city?.toLowerCase().includes(q) || false;
      const matchDM = org.decision_makers?.some(dm => dm.name.toLowerCase().includes(q) || dm.email?.toLowerCase().includes(q)) || false;
      return matchName || matchDesc || matchCity || matchDM;
    });
  }, [prospects, searchQuery]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const exportToCSV = () => {
    if (!filteredProspects.length) return;
    const headers = ["Company Name", "Industry", "City", "Country", "Employee Count", "Revenue", "ICP Match Score", "Validation Status", "CTO Name", "CTO Role", "CTO Email", "Website"];
    const rows = filteredProspects.map(org => {
      const dm = org.decision_makers[0];
      return [
        `"${org.name}"`,
        `"${org.industry}"`,
        `"${org.city}"`,
        `"${org.country}"`,
        org.employee_count,
        `"${org.revenue_range}"`,
        `${org.icp_match_score}%`,
        `"${org.validation_status}"`,
        `"${dm?.name || ''}"`,
        `"${dm?.role || ''}"`,
        `"${dm?.email || ''}"`,
        `"${org.website}"`
      ].join(',');
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `prospects_${searchId || 'all'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { bg: 'bg-[#DCFCE7]', text: 'text-[#16A34A]', border: 'border-[#BBF7D0]', label: '90–100 Green' };
    if (score >= 75) return { bg: 'bg-[#CCFBF1]', text: 'text-[#0F766E]', border: 'border-[#99F6E4]', label: '75–89 Teal' };
    if (score >= 50) return { bg: 'bg-[#FEF3C7]', text: 'text-[#D97706]', border: 'border-[#FDE68A]', label: '50–74 Amber' };
    return { bg: 'bg-[#FEE2E2]', text: 'text-[#DC2626]', border: 'border-[#FCA5A5]', label: 'Below 50 Red' };
  };

  const listUniqueSources = (org: Organization): string[] => {
    const list: string[] = [];
    if (org.sources && org.sources.length > 0) {
      org.sources.forEach(s => {
        if (s.name && !list.includes(s.name)) list.push(s.name);
      });
    }
    if (org.decision_makers) {
      org.decision_makers.forEach(dm => {
        if (dm.source && dm.source.name && !list.includes(dm.source.name)) list.push(dm.source.name);
      });
    }
    if (list.length === 0) {
      return ['Apollo B2B API', 'Live Web Scraper', 'Gemini LLM'];
    }
    return list;
  };

  const getSourceBadgeStyle = (sourceName: string) => {
    const s = sourceName.toLowerCase();
    if (s.includes('apollo')) return 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800';
    if (s.includes('scraper') || s.includes('website') || s.includes('http')) return 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
    if (s.includes('llm') || s.includes('gemini')) return 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';
    if (s.includes('registry') || s.includes('b2b') || s.includes('directory')) return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
    return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
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
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E2E8F0] dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] dark:text-slate-100 tracking-tight flex items-center gap-3">
            <span>Prospect Intelligence Directory</span>
            <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-[#CCFBF1] text-[#0F766E] border border-[#99F6E4]">
              {filteredProspects.length} Qualified Prospects
            </span>
          </h1>
          <p className="text-xs text-[#64748B] dark:text-slate-400 mt-1">
            Prioritized candidate organizations grounded and cross-validated across multi-agent pipelines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportToCSV}
            className="px-4 py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 text-[#0F172A] dark:text-slate-200 font-bold text-xs flex items-center gap-2 hover:bg-[#F1F5F9] transition shadow-xs"
          >
            <Download className="w-4 h-4 text-[#0F766E]" />
            Export CSV
          </button>

          <div className="flex items-center p-1 rounded-lg bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${
                viewMode === 'table' ? 'bg-[#0F766E] text-white shadow-xs' : 'text-[#64748B]'
              }`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${
                viewMode === 'cards' ? 'bg-[#0F766E] text-white shadow-xs' : 'text-[#64748B]'
              }`}
            >
              Cards
            </button>
          </div>
        </div>
      </div>

      {/* ICP SEARCH HISTORY PANEL & SELECTOR */}
      <div className="enterprise-card p-6 space-y-4 bg-slate-900/90 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-black text-sm text-white flex items-center gap-2">
                ICP Search History
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-mono">
                  {searchHistory.length} Sessions
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Click any ICP search request below to display its discovered prospects, or delete history items.
              </p>
            </div>
          </div>

          {searchHistory.length > 0 && (
            <button
              onClick={handleClearAllHistory}
              className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-500/40 text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All Search History
            </button>
          )}
        </div>

        {/* History Pills & List */}
        {searchHistory.length === 0 ? (
          <div className="text-xs text-slate-400 italic py-2">
            No search history recorded yet. Run a search from the ICP Builder or New Search page to see history here.
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Show All Option */}
            <button
              onClick={() => navigate('/prospects')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-2 ${
                !searchId
                  ? 'bg-teal-600 text-white border-teal-500 shadow-md'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              All Prospects ({prospects.length})
            </button>

            {/* Past Search Runs */}
            {searchHistory.map((rec) => {
              const isSelected = searchId === rec.id;
              return (
                <div
                  key={rec.id}
                  onClick={() => navigate(`/prospects?search_id=${rec.id}`)}
                  className={`group px-3.5 py-2 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center gap-3.5 ${
                    isSelected
                      ? 'bg-teal-950/80 border-teal-500 text-teal-200 shadow-lg'
                      : 'bg-slate-950/80 border-slate-800/80 text-slate-300 hover:border-teal-500/50'
                  }`}
                >
                  <div className="max-w-[260px] truncate">
                    <span className="block font-extrabold text-white text-[12px] truncate">"{rec.query}"</span>
                    <span className="text-[10px] text-slate-400 font-mono font-normal">
                      {rec.total_organizations_found} Orgs Found • {rec.created_at}
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleDeleteSearch(rec.id, e)}
                    className="p-1 rounded bg-slate-900 hover:bg-red-900 text-slate-400 hover:text-red-200 transition opacity-80 group-hover:opacity-100"
                    title="Delete Search History Item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Currently Selected Active Search Banner */}
        {currentSearchRecord && (
          <div className="p-3.5 rounded-xl bg-teal-950/40 border border-teal-500/40 flex items-center justify-between text-xs text-teal-200 mt-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              <span>
                Displaying prospects for ICP Request: <strong>"{currentSearchRecord.query}"</strong>
              </span>
            </div>
            <button
              onClick={() => navigate('/prospects')}
              className="px-2.5 py-1 rounded bg-slate-900 text-teal-300 border border-teal-500/30 text-[11px] font-bold hover:bg-slate-800 transition"
            >
              Clear Filter (Show All)
            </button>
          </div>
        )}
      </div>

      {/* Filter, Search & Sorting Controls */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs shadow-xs">
        {/* Quick Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by company, domain, description or executive..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 text-[#0F172A] dark:text-slate-100 placeholder-slate-400 text-xs outline-none focus:border-[#0F766E] transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-[#64748B]">
            <Filter className="w-3.5 h-3.5 text-[#0F766E]" />
            <span>Filters:</span>
          </div>

          <select
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 text-[#0F172A] dark:text-slate-200 outline-none focus:border-[#0F766E] font-medium"
          >
            <option value="All">All Industries</option>
            <option value="SaaS">SaaS</option>
            <option value="FinTech">FinTech</option>
            <option value="Healthcare">Healthcare Tech</option>
          </select>

          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 text-[#0F172A] dark:text-slate-200 outline-none focus:border-[#0F766E] font-medium"
          >
            <option value="All">All Locations</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Mumbai">Mumbai</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 text-[#0F172A] dark:text-slate-200 outline-none focus:border-[#0F766E] font-medium"
          >
            <option value="All">All Statuses</option>
            <option value="Verified">Verified</option>
            <option value="Conflicting">Conflicting</option>
          </select>

          <div className="flex items-center gap-2 pl-2 border-l border-[#E2E8F0] dark:border-slate-800">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#0F766E]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-lg bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 text-[#0F172A] dark:text-slate-200 outline-none focus:border-[#0F766E] font-medium"
            >
              <option value="icp_score">Highest ICP Match</option>
              <option value="employees">Company Headcount</option>
              <option value="name">Company Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' ? (
        <div className="enterprise-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] dark:bg-slate-800/80 text-[#64748B] dark:text-slate-400 font-bold uppercase tracking-wider border-b border-[#E2E8F0] dark:border-slate-800">
                  <th className="p-4">Company</th>
                  <th className="p-4">Industry</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Employees</th>
                  <th className="p-4">Collected From Resources</th>
                  <th className="p-4 text-center">Prospect Score</th>
                  <th className="p-4">Confidence</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] dark:divide-slate-800">
                {filteredProspects.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-slate-400">
                      No prospects match the selected search filter. Click "All Prospects" above to view full list.
                    </td>
                  </tr>
                ) : (
                  filteredProspects.map((org) => {
                    const scoreStyle = getScoreBadge(org.icp_match_score);
                    const sourceNames = listUniqueSources(org);
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

                        {/* Data Sources Badges */}
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1 max-w-[220px]">
                            {sourceNames.map((s, idx) => (
                              <span
                                key={idx}
                                className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${getSourceBadgeStyle(s)}`}
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Score Circular Badge */}
                        <td className="p-4 text-center">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-extrabold border ${scoreStyle.bg} ${scoreStyle.text} ${scoreStyle.border}`}>
                            {org.icp_match_score}
                          </span>
                        </td>

                        {/* Confidence */}
                        <td className="p-4">
                          {getConfidenceIndicator(org.confidence)}
                        </td>

                        {/* Status */}
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
                            className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 text-[#0F172A] dark:text-slate-200 font-bold hover:border-[#0F766E] transition"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProspects.map((org) => {
            const scoreStyle = getScoreBadge(org.icp_match_score);
            return (
              <div
                key={org.id}
                onClick={() => navigate(`/prospects/${org.id}`)}
                className="enterprise-card enterprise-card-hover p-6 cursor-pointer space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img src={org.logo_url} alt="" className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0" />
                      <div>
                        <h3 className="font-extrabold text-sm text-[#0F172A] dark:text-slate-100">{org.name}</h3>
                        <p className="text-xs text-[#0F766E] font-semibold">{org.industry} • {org.city}</p>
                      </div>
                    </div>
                    <span className={`w-8 h-8 rounded-full font-extrabold text-xs flex items-center justify-center border ${scoreStyle.bg} ${scoreStyle.text} ${scoreStyle.border}`}>
                      {org.icp_match_score}
                    </span>
                  </div>

                  <p className="text-xs text-[#64748B] line-clamp-3 leading-relaxed">
                    {org.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E2E8F0] space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B]">Confidence:</span>
                    {getConfidenceIndicator(org.confidence)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B]">Validation:</span>
                    <span className="font-bold text-[#16A34A]">{org.validation_status}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

