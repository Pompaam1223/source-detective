import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  showPercentage?: boolean;
  colorClass?: string;
  heightClass?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  label,
  showPercentage = true,
  colorClass = 'bg-amber-500',
  heightClass = 'h-2.5'
}) => {
  const safeMax = max > 0 ? max : 1;
  const percentage = Math.min(100, Math.max(0, Math.round((value / safeMax) * 100)));

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-xs text-slate-600 dark:text-slate-300 font-medium mb-1.5">
          {label && <span>{label}</span>}
          {showPercentage && <span className="font-mono">{value}/{max} ({percentage}%)</span>}
        </div>
      )}
      <div className={`w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden ${heightClass} p-0.5 border border-slate-300 dark:border-slate-700/60`}>
        <div
          className={`${colorClass} ${heightClass} rounded-full transition-all duration-500 shadow-sm`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
