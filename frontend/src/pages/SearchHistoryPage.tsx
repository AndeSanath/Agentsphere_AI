import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { History, Search, Trash2, Play, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { SearchRecord } from '../types';

export const SearchHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<SearchRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const data = await api.getSearches();
      setHistory(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.deleteSearch(id);
      fetchHistory();
    } catch (e) {
      console.error(e);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to delete all search history and associated prospects?')) return;
    try {
      await api.clearAllSearches();
      fetchHistory();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#CCFBF1] dark:bg-[#134E4A] text-[#0F766E] dark:text-[#5EEAD4] text-xs font-bold mb-2">
            <History className="w-3.5 h-3.5" />
            <span>Historical Agent Trajectories</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] dark:text-slate-100 tracking-tight">Search History</h1>
          <p className="text-sm text-[#64748B] dark:text-slate-400 mt-1">
            Review previous prospect discovery sessions, execute rerun queries, or inspect past agent outputs.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClearAll}
            className="px-4 py-2.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-500/40 font-bold text-xs flex items-center gap-2 transition"
          >
            <Trash2 className="w-4 h-4" />
            Clear All History
          </button>
        )}
      </div>

      <div className="enterprise-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] dark:bg-slate-800/80 text-[#64748B] dark:text-slate-400 font-bold uppercase tracking-wider border-b border-[#E2E8F0] dark:border-slate-800">
                <th className="p-4">Search Prompt / Requirements</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4 text-center">Orgs Found</th>
                <th className="p-4 text-center">Qualified Prospects</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] dark:divide-slate-800">
              {history.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#64748B] dark:text-slate-400">
                    No historical searches found.
                  </td>
                </tr>
              ) : (
                history.map((rec) => (
                  <tr
                    key={rec.id}
                    onClick={() => navigate(`/prospects?search_id=${rec.id}`)}
                    className="hover:bg-[#F8FAFC] dark:hover:bg-slate-800/50 transition cursor-pointer group"
                  >
                    <td className="p-4 font-bold text-[#0F172A] dark:text-slate-100 max-w-xs truncate">
                      <span className="group-hover:text-[#0F766E] transition">"{rec.query}"</span>
                      <div className="text-[10px] text-[#64748B] font-mono font-normal">{rec.id}</div>
                    </td>
                    <td className="p-4 text-[#64748B] dark:text-slate-400 font-mono">{rec.created_at}</td>
                    <td className="p-4 text-center font-mono font-bold text-[#0F172A] dark:text-slate-200">
                      {rec.total_organizations_found}
                    </td>
                    <td className="p-4 text-center font-mono font-bold text-[#16A34A]">
                      {rec.qualified_prospects_count}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#DCFCE7] text-[#16A34A] border border-[#BBF7D0]">
                        {rec.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => navigate(`/prospects?search_id=${rec.id}`)}
                          className="px-3 py-1.5 rounded-lg bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-[11px] transition shadow-xs"
                        >
                          View Results
                        </button>
                        <button
                          onClick={(e) => handleDelete(rec.id, e)}
                          className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 text-[#64748B] hover:text-[#DC2626] transition"
                          title="Delete Search"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
