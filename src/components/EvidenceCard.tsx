import React from 'react';
import { Evidence } from '../types';
import { INDICATOR_DEFINITIONS } from '../data/indicators';
import { FileSearch, ShieldCheck, Tag, Calendar, UserCheck } from 'lucide-react';

interface EvidenceCardProps {
  evidence: Evidence;
  onClick?: () => void;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({
  evidence,
  onClick
}) => {
  const indicator = INDICATOR_DEFINITIONS[evidence.indicatorId];

  return (
    <div
      onClick={onClick}
      className="bg-amber-50/50 dark:bg-slate-900 border-2 border-dashed border-amber-400/60 dark:border-amber-500/40 rounded-xl p-4 shadow-md hover:shadow-lg transition-all relative overflow-hidden group cursor-pointer"
    >
      {/* Decorative Stamp */}
      <div className="absolute -right-3 -bottom-3 opacity-10 pointer-events-none group-hover:scale-110 transition-transform">
        <FileSearch className="w-20 h-20 text-amber-500" />
      </div>

      <div className="flex items-center justify-between gap-2 border-b border-amber-200 dark:border-slate-800 pb-2.5">
        <div className="flex items-center space-x-1.5">
          <span className="bg-amber-500/20 text-amber-900 dark:text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase">
            EVIDENCE: {evidence.type}
          </span>
          {evidence.isVerified && (
            <span className="bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center space-x-0.5">
              <ShieldCheck className="w-3 h-3" />
              <span>VERIFIED</span>
            </span>
          )}
        </div>

        {indicator && (
          <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">
            [{indicator.code}]
          </span>
        )}
      </div>

      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-2.5 line-clamp-1">
        {evidence.title}
      </h4>

      <p className="text-xs text-slate-700 dark:text-slate-300 mt-1.5 line-clamp-2 leading-relaxed font-sans">
        "{evidence.content}"
      </p>

      <div className="mt-3 pt-2 border-t border-amber-200/60 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono">
        <div className="flex items-center space-x-1">
          <Tag className="w-3 h-3 text-amber-500" />
          <span>{evidence.sourceTag || 'ภารกิจนักสืบ'}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Calendar className="w-3 h-3" />
          <span>{new Date(evidence.timestamp).toLocaleDateString('th-TH')}</span>
        </div>
      </div>
    </div>
  );
};
