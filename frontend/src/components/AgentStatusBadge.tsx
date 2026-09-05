import React from 'react';
import { CheckCircle2, Loader2, AlertCircle, Clock, ShieldAlert } from 'lucide-react';

interface AgentStatusBadgeProps {
  status: string;
}

export const AgentStatusBadge: React.FC<AgentStatusBadgeProps> = ({ status }) => {
  const s = status.toLowerCase();

  if (s === 'completed' || s === 'verified' || s === 'active') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span className="capitalize">{status}</span>
      </span>
    );
  }

  if (s === 'running') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/30 text-xs font-medium animate-pulse">
        <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
        <span className="capitalize">{status}</span>
      </span>
    );
  }

  if (s === 'needs_review' || s === 'conflicting' || s === 'needs review') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-medium">
        <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
        <span>Needs Review</span>
      </span>
    );
  }

  if (s === 'failed') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-medium">
        <AlertCircle className="w-3.5 h-3.5" />
        <span>Failed</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/80 text-slate-400 border border-slate-700/60 text-xs font-medium">
      <Clock className="w-3.5 h-3.5" />
      <span className="capitalize">{status}</span>
    </span>
  );
};
