import React from 'react';
import { Search, FolderKanban } from 'lucide-react';

interface GameHeaderProps {
  title: string;
  subtitle?: string;
  caseCode?: string;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  title,
  subtitle,
  caseCode
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-slate-100 shadow-xl space-y-3 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
        <Search className="w-48 h-48 text-amber-500" />
      </div>

      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
          <FolderKanban className="w-5 h-5" />
        </div>
        <div>
          {caseCode && (
            <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block">
              รหัสคดี: {caseCode}
            </span>
          )}
          <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
        </div>
      </div>

      {subtitle && (
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          {subtitle}
        </p>
      )}
    </div>
  );
};
