import React, { useEffect, useState } from 'react';
import { Brain, Layers, Database, Sparkles, Filter } from 'lucide-react';
import { api } from '../services/api';
import { SharedMemoryFact } from '../types';
import { SharedMemoryPanel } from '../components/SharedMemoryPanel';

export const SharedMemoryViewPage: React.FC = () => {
  const [facts, setFacts] = useState<SharedMemoryFact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    const fetchMemory = async () => {
      try {
        const data = await api.getMemory();
        setFacts(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchMemory();
  }, []);

  const filteredFacts = facts.filter(f =>
    f.entity_name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    f.fact_key.toLowerCase().includes(searchFilter.toLowerCase()) ||
    f.agent_creator.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="border-b border-[#E2E8F0] dark:border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#CCFBF1] dark:bg-[#134E4A] text-[#0F766E] dark:text-[#5EEAD4] text-xs font-bold mb-2">
          <Brain className="w-3.5 h-3.5" />
          <span>Inter-Agent State Layer</span>
        </div>
        <h1 className="text-2xl font-extrabold text-[#0F172A] dark:text-slate-100 tracking-tight">Shared Agent Memory</h1>
        <p className="text-sm text-[#64748B] dark:text-slate-400 mt-1">
          Complete transparency into intermediate facts, entity attributes, provenance tracking, and inter-agent data reuse.
        </p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <input
          type="text"
          placeholder="Filter facts by entity, key, or agent..."
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          className="w-full md:w-1/2 p-3 rounded-lg bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 text-[#0F172A] dark:text-slate-100 text-xs outline-none focus:border-[#0F766E]"
        />
      </div>

      <SharedMemoryPanel facts={filteredFacts} />
    </div>
  );
};
