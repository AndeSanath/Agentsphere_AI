import React from 'react';
import { Brain, Layers, Database, UserCheck, CheckCircle2 } from 'lucide-react';
import { SharedMemoryFact } from '../types';

interface SharedMemoryPanelProps {
  facts: SharedMemoryFact[];
}

export const SharedMemoryPanel: React.FC<SharedMemoryPanelProps> = ({ facts }) => {
  return (
    <div className="enterprise-card p-5 space-y-4">
      <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#CCFBF1] dark:bg-[#134E4A] text-[#0F766E] flex items-center justify-center font-bold">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#0F172A] dark:text-slate-100">Shared Agent Memory</h3>
            <p className="text-xs text-[#64748B] dark:text-slate-400">
              Inter-agent state storage & cross-agent fact reuse layer
            </p>
          </div>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#CCFBF1] text-[#0F766E] border border-[#99F6E4]">
          {facts.length} Active Memory Entries
        </span>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
        {facts.length === 0 ? (
          <div className="text-center py-6 text-[#64748B] text-xs">
            Shared agent memory is empty for this session.
          </div>
        ) : (
          facts.map((fact) => (
            <div
              key={fact.id}
              className="p-3.5 rounded-lg bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 text-xs flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#0F766E] dark:text-teal-400">{fact.entity_name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-[#0F172A] dark:text-slate-300 font-mono font-bold">
                    {fact.entity_type}
                  </span>
                </div>
                <span className="text-[10px] text-[#64748B] dark:text-slate-400 font-mono">{fact.timestamp}</span>
              </div>

              <div className="flex items-center gap-2 text-[#0F172A] dark:text-slate-200">
                <span className="text-[#64748B] font-medium">{fact.fact_key}:</span>
                <span className="font-bold">{fact.fact_value}</span>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1.5 text-[#64748B] border-t border-[#E2E8F0] dark:border-slate-700">
                <div className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Agent: <strong className="text-[#0F172A] dark:text-slate-200">{fact.agent_creator}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-[#0F766E]" />
                  <span>Source: <strong className="text-[#0F172A] dark:text-slate-200">{fact.source_name}</strong></span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
