import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Bot,
  Layers,
  Brain,
  UserCheck,
  CheckCircle2,
  Loader2,
  Clock,
  ArrowRight,
  Sparkles,
  Building2,
  Play,
  FileText
} from 'lucide-react';
import { api } from '../services/api';
import { SearchRecord, SharedMemoryFact } from '../types';
import { AgentStatusBadge } from '../components/AgentStatusBadge';
import { SharedMemoryPanel } from '../components/SharedMemoryPanel';

export const AgentWorkflowPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const searchId = searchParams.get('search_id') || 'search_hyderabad_saas_100';
  const navigate = useNavigate();

  const [searchRecord, setSearchRecord] = useState<SearchRecord | null>(null);
  const [memoryFacts, setMemoryFacts] = useState<SharedMemoryFact[]>([]);
  const [selectedAgentIndex, setSelectedAgentIndex] = useState<number>(0);

  useEffect(() => {
    const fetchWorkflow = async () => {
      try {
        const [rec, mem] = await Promise.all([
          api.getSearch(searchId),
          api.getMemory(searchId)
        ]);
        setSearchRecord(rec);
        setMemoryFacts(mem);
      } catch (e) {
        console.error(e);
      }
    };
    fetchWorkflow();
    const interval = setInterval(fetchWorkflow, 3000);
    return () => clearInterval(interval);
  }, [searchId]);

  const workflowNodes = [
    { name: "Planner Agent", agent: "PLANNER", icon: Bot, desc: "Task DAG Generation" },
    { name: "Company Discovery Agent", agent: "DISCOVERY", icon: Building2, desc: "Public & API Scanner" },
    { name: "ICP Matching Agent", agent: "ICP_MATCH", icon: Sparkles, desc: "Criteria Weighting Engine" },
    { name: "Validation Agent", agent: "VALIDATION", icon: CheckCircle2, desc: "Multi-Source Cross Checker" },
    { name: "Decision-Maker Agent", agent: "DECISION_MAKER", icon: UserCheck, desc: "Executive Title Identification" },
    { name: "Contact Enrichment Agent", agent: "CONTACT_ENRICHMENT", icon: Layers, desc: "Email & Phone Verification" },
    { name: "Shared Memory Layer", agent: "SHARED_MEMORY", icon: Brain, desc: "Fact Storage & Reuse" },
    { name: "Human Review", agent: "HUMAN_REVIEW", icon: UserCheck, desc: "HITL Resolution Queue" },
    { name: "Prospect Summary", agent: "SUMMARY", icon: FileText, desc: "Executive Intelligence Briefing" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header with status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Agent Workflow Orchestrator</span>
          </div>
          <h1 className="text-2xl font-black text-white">
            "{searchRecord?.query || "Find SaaS companies in Hyderabad with 100-500 employees..."}"
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Search ID: {searchId} • Created: {searchRecord?.created_at || "Just now"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/prospects?search_id=${searchId}`)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs hover:from-purple-500 transition flex items-center gap-2 shadow-lg"
          >
            View Prospect Results
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Workflow Visualizer DAG (Requirement 8) */}
      <div className="p-8 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h2 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            Agent Execution Pipeline DAG
          </h2>
          <span className="text-xs text-slate-400">Click any agent node to inspect inputs/outputs</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {workflowNodes.map((node, index) => {
            const Icon = node.icon;
            const taskState = searchRecord?.tasks[index] || { status: 'completed', duration_ms: 850 };
            const isSelected = selectedAgentIndex === index;

            return (
              <div
                key={node.name}
                onClick={() => setSelectedAgentIndex(index)}
                className={`p-4 rounded-xl border transition cursor-pointer flex flex-col justify-between space-y-3 relative ${
                  isSelected
                    ? 'bg-purple-950/40 border-purple-500 ring-1 ring-purple-500'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-purple-400" />
                  </div>
                  <AgentStatusBadge status={taskState.status} />
                </div>

                <div>
                  <h3 className="font-bold text-xs text-slate-200">{node.name}</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">{node.desc}</p>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-2 border-t border-slate-900">
                  <span>Latency:</span>
                  <span className="text-slate-300 font-semibold">{taskState.duration_ms || 450}ms</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Inspector Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Selected Agent Node Detail Inspector */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
              <Bot className="w-4 h-4 text-purple-400" />
              Node Inspector: {workflowNodes[selectedAgentIndex]?.name}
            </h3>
            <span className="text-xs font-mono text-purple-300 px-2 py-0.5 rounded bg-purple-950 border border-purple-500/30">
              Agent #{selectedAgentIndex + 1}
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <span className="font-semibold text-slate-400 block mb-1">Agent Purpose & Task:</span>
              <p className="text-slate-200 bg-slate-950 p-3 rounded-lg border border-slate-800">
                {searchRecord?.tasks[selectedAgentIndex]?.description || "Executes autonomous evaluation for current search context."}
              </p>
            </div>

            <div>
              <span className="font-semibold text-slate-400 block mb-1">Input Data:</span>
              <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-cyan-300 overflow-x-auto">
{JSON.stringify(searchRecord?.icp || { industry: "SaaS", location: "Hyderabad" }, null, 2)}
              </pre>
            </div>

            <div>
              <span className="font-semibold text-slate-400 block mb-1">Output Result Summary:</span>
              <p className="text-emerald-300 bg-slate-950 p-3 rounded-lg border border-slate-800 font-medium">
                {searchRecord?.tasks[selectedAgentIndex]?.output_summary || "Successfully completed node execution."}
              </p>
            </div>
          </div>
        </div>

        {/* Shared Agent Memory Panel */}
        <SharedMemoryPanel facts={memoryFacts} />
      </div>
    </div>
  );
};
