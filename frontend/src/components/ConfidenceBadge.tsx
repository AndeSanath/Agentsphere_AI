import React from 'react';
import { ShieldCheck, ShieldAlert, Shield } from 'lucide-react';
import { ConfidenceLevel } from '../types';

interface ConfidenceBadgeProps {
  confidence: ConfidenceLevel | string;
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({ confidence }) => {
  const conf = confidence.toString();

  if (conf === 'High') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[11px] font-semibold">
        <ShieldCheck className="w-3 h-3 text-emerald-400" />
        High Confidence
      </span>
    );
  }

  if (conf === 'Medium') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[11px] font-semibold">
        <ShieldAlert className="w-3 h-3 text-amber-400" />
        Medium Confidence
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 text-[11px] font-semibold">
      <Shield className="w-3 h-3 text-rose-400" />
      Low Confidence
    </span>
  );
};
