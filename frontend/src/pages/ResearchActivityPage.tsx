import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Search, CheckCircle2, Clock, Play, ArrowRight, Sparkles, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';
import { SearchRecord } from '../types';

export const ResearchActivityPage: React.FC = () => {
  const navigate = useNavigate();
  const [searches, setSearches] = useState<SearchRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearches = async () => {
      try {
        const data = await api.getSearches();
        setSearches(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchSearches();
  }, []);

  const dummyJobs = [
    {
      id: 'job_001',
      title: 'Find FinTech companies in Bangalore with 100-500 employees',
      progress: 100,
      status: 'Completed',
      time: '12 minutes ago',
      orgsFound: 25,
      steps: [
        { name: 'Discovery', status: 'completed' },
        { name: 'Research', status: 'completed' },
        { name: 'Validation', status: 'completed' },
        { name: 'Scoring', status: 'completed' },
        { name: 'Insights', status: 'completed' },
      ]
    },
    {
      id: 'job_002',
      title: 'Find B2B SaaS companies in Hyderabad with 100-500 employees',
      progress: 65,
      status: 'Running',
      time: 'Just now',
      orgsFound: 25,
      steps: [
        { name: 'Discovery', status: 'completed' },
        { name: 'Research', status: 'completed' },
        { name: 'Validation', status: 'running' },
        { name: 'Scoring', status: 'waiting' },
        { name: 'Insights', status: 'waiting' },
      ]
    }
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#0F766E] dark:text-teal-400 uppercase tracking-wider mb-1">
            <Activity className="w-4 h-4" />
            <span>Agent Execution Log</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] dark:text-slate-100 tracking-tight">
            Research Activity Jobs
          </h1>
          <p className="text-sm text-[#64748B] dark:text-slate-400 mt-1">
            Monitor real-time agent workflow status, progress metrics, and task timelines.
          </p>
        </div>

        <button
          onClick={() => navigate('/icp')}
          className="px-4 py-2.5 rounded-lg bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-xs flex items-center gap-2 shadow-sm transition"
        >
          + New Research Job
        </button>
      </div>

      {/* Jobs List */}
      <div className="space-y-6">
        {dummyJobs.map((job) => (
          <div key={job.id} className="enterprise-card p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] dark:border-slate-800 pb-4">
              <div>
                <h3 className="font-extrabold text-base text-[#0F172A] dark:text-slate-100">
                  "{job.title}"
                </h3>
                <p className="text-xs text-[#64748B] dark:text-slate-400 mt-0.5">
                  Job ID: {job.id} • Started {job.time} • {job.orgsFound} Candidate Organizations
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold font-mono text-[#0F766E] dark:text-teal-400">
                  Progress: {job.progress}%
                </span>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    job.status === 'Completed'
                      ? 'bg-[#DCFCE7] text-[#16A34A]'
                      : 'bg-[#DBEAFE] text-[#2563EB]'
                  }`}
                >
                  {job.status}
                </span>
              </div>
            </div>

            {/* Vertical/Horizontal Timeline Tracker */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#64748B] dark:text-slate-400 block uppercase tracking-wider">
                Multi-Agent Workflow Stages
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-1">
                {job.steps.map((step, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border text-xs space-y-1 ${
                      step.status === 'completed'
                        ? 'bg-[#DCFCE7]/50 border-[#BBF7D0] text-[#16A34A]'
                        : step.status === 'running'
                        ? 'bg-[#DBEAFE]/50 border-[#BFDBFE] text-[#2563EB]'
                        : 'bg-[#F8FAFC] dark:bg-slate-800 border-[#E2E8F0] dark:border-slate-700 text-[#94A3B8]'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span>{step.name}</span>
                      {step.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />}
                      {step.status === 'running' && <Clock className="w-3.5 h-3.5 text-[#2563EB] animate-spin" />}
                      {step.status === 'waiting' && <span className="text-[10px]">Waiting</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
