import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

interface AnswerOptionProps {
  id: string;
  label: string;
  selected: boolean;
  multiSelect?: boolean;
  onSelect: (id: string) => void;
  disabled?: boolean;
  feedback?: string;
  showFeedback?: boolean;
}

export const AnswerOption: React.FC<AnswerOptionProps> = ({
  id,
  label,
  selected,
  multiSelect = false,
  onSelect,
  disabled = false,
  feedback,
  showFeedback = false
}) => {
  return (
    <div
      onClick={() => !disabled && onSelect(id)}
      className={`p-3.5 sm:p-4 rounded-xl border text-sm transition-all duration-200 cursor-pointer flex items-start space-x-3 select-none ${
        selected
          ? 'bg-amber-500/10 border-amber-500 text-slate-900 dark:text-amber-200 font-semibold shadow-sm'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-400/60 hover:bg-slate-50 dark:hover:bg-slate-850'
      } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
    >
      <div className="mt-0.5 shrink-0">
        {selected ? (
          <CheckCircle2 className="w-5 h-5 text-amber-500" />
        ) : (
          <Circle className="w-5 h-5 text-slate-400 dark:text-slate-600" />
        )}
      </div>

      <div className="flex-1">
        <p className="leading-relaxed">{label}</p>
        {showFeedback && feedback && (
          <p className="mt-2 text-xs p-2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300">
            💡 {feedback}
          </p>
        )}
      </div>
    </div>
  );
};
