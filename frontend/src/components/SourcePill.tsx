import React from 'react';
import { Globe, Database, Search, ShieldCheck } from 'lucide-react';
import { DataSource } from '../types';

interface SourcePillProps {
  source: DataSource | string;
  isDemo?: boolean;
}

export const SourcePill: React.FC<SourcePillProps> = ({ source, isDemo = true }) => {
  const name = typeof source === 'string' ? source : source.name;
  const demoFlag = typeof source === 'string' ? isDemo : source.is_demo;

  const getIcon = () => {
    if (name.toLowerCase().includes('website')) return Globe;
    if (name.toLowerCase().includes('api')) return Database;
    if (name.toLowerCase().includes('search')) return Search;
    return ShieldCheck;
  };

  const Icon = getIcon();

  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-800/90 text-slate-300 border border-slate-700 text-[11px] font-medium">
      <Icon className="w-3 h-3 text-purple-400" />
      <span>{name}</span>
      {demoFlag && (
        <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-1 rounded ml-0.5 border border-amber-500/20">
          DEMO
        </span>
      )}
    </span>
  );
};
