import React, { useEffect, useState } from 'react';
import { Bot, Cpu, Zap, CheckCircle2, ShieldCheck, Settings, Power } from 'lucide-react';
import { api } from '../services/api';
import { AgentInfo } from '../types';

export const AgentManagementPage: React.FC = () => {
  const [agents, setAgents] = useState<AgentInfo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAgents = async () => {
    try {
      const data = await api.getAgents();
      setAgents(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleToggleAgent = async (agentId: string, currentEnabled: boolean) => {
    try {
      await api.updateAgent(agentId, !currentEnabled);
      fetchAgents();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="border-b border-[#E2E8F0] dark:border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#CCFBF1] dark:bg-[#134E4A] text-[#0F766E] dark:text-[#5EEAD4] text-xs font-bold mb-2">
          <Bot className="w-3.5 h-3.5" />
          <span>Agent Topology & Configuration</span>
        </div>
        <h1 className="text-2xl font-extrabold text-[#0F172A] dark:text-slate-100 tracking-tight">
          Specialized AI Agent Cluster ({agents.length})
        </h1>
        <p className="text-sm text-[#64748B] dark:text-slate-400 mt-1">
          Configure model parameters, inspect execution metrics, and manage agent activation states across the platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {agents.map((ag) => (
          <div
            key={ag.id}
            className={`enterprise-card p-6 space-y-4 ${
              ag.enabled ? '' : 'opacity-60'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#CCFBF1] dark:bg-[#134E4A] text-[#0F766E] flex items-center justify-center font-bold shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-extrabold text-base text-[#0F172A] dark:text-slate-100">{ag.name}</h2>
                  <span className="text-xs font-mono text-[#0F766E] dark:text-teal-400">{ag.code}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  ag.enabled ? 'bg-[#DCFCE7] text-[#16A34A]' : 'bg-slate-200 text-slate-600'
                }`}>
                  {ag.enabled ? 'Active' : 'Disabled'}
                </span>
                <button
                  onClick={() => handleToggleAgent(ag.id, ag.enabled)}
                  className="p-2 rounded-lg border border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-slate-800 text-[#64748B] hover:text-[#0F172A] transition"
                  title={ag.enabled ? "Disable Agent" : "Enable Agent"}
                >
                  <Power className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-xs text-[#64748B] dark:text-slate-300 leading-relaxed">
              {ag.purpose}
            </p>

            <div className="flex flex-wrap gap-1.5">
              {ag.tools.map((t) => (
                <span key={t} className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#F8FAFC] dark:bg-slate-800 text-[#0F766E] dark:text-teal-400 border border-[#E2E8F0] dark:border-slate-700">
                  {t}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#E2E8F0] dark:border-slate-800 text-xs">
              <div>
                <span className="text-[#64748B] text-[10px] block font-bold">Model</span>
                <span className="text-[#0F172A] dark:text-slate-200 font-bold font-mono">{ag.model}</span>
              </div>
              <div>
                <span className="text-[#64748B] text-[10px] block font-bold">Success Rate</span>
                <span className="text-[#16A34A] font-bold">{ag.success_rate}%</span>
              </div>
              <div>
                <span className="text-[#64748B] text-[10px] block font-bold">Avg Latency</span>
                <span className="text-[#0F172A] dark:text-slate-200 font-bold font-mono">{ag.avg_latency_ms}ms</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
