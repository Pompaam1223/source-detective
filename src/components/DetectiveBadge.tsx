import React from 'react';
import { Award, ShieldCheck, Sparkles } from 'lucide-react';
import { ScoringEngine } from '../engine/ScoringEngine';
import { PushPin, GoldenMagnifierBadge } from './decorations/DetectiveDecorations';

interface DetectiveBadgeProps {
  scorePoints: number;
  maxPoints?: number;
  className?: string;
  showAverage?: boolean;
}

export const DetectiveBadge: React.FC<DetectiveBadgeProps> = ({
  scorePoints,
  maxPoints = 160,
  className = '',
  showAverage = true
}) => {
  const safeMax = maxPoints > 0 ? maxPoints : 160;
  // Calculate percentage, strictly constrained between 0% and 100%
  const rawPercent = Math.round((scorePoints / safeMax) * 100);
  const percent = Math.min(100, Math.max(0, rawPercent));
  const rank = ScoringEngine.getDetectiveRankTitle(percent);

  // If score is aggregated across multiple units (maxPoints > 40), calculate average score per 40 points
  const numberOfUnits = safeMax > 40 ? Math.round(safeMax / 40) : 1;
  const avgScorePerUnit = numberOfUnits > 1 ? (scorePoints / numberOfUnits).toFixed(1) : scorePoints.toString();

  return (
    <div className={`relative bg-gradient-to-r from-amber-950/80 via-slate-900 to-slate-950 border-3 border-amber-500/40 rounded-3xl p-4 sm:p-5 text-slate-100 shadow-xl ${className}`}>
      <PushPin color="yellow" className="absolute -top-3 right-6" />

      <div className="flex items-center space-x-3.5">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 p-0.5 shadow-lg flex items-center justify-center text-3xl shrink-0">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            {rank.badge}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] font-mono font-black text-amber-400 uppercase tracking-wider">
              ★ ยศนักสืบข่าวสาร
            </span>
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          </div>
          
          <h4 className={`text-base font-black truncate ${rank.color}`}>
            {rank.title}
          </h4>

          <div className="text-xs text-slate-300 font-mono mt-1 space-y-0.5">
            <p className="font-bold">
              คะแนนสะสม: <span className="text-amber-400 font-black text-sm">{scorePoints}</span> / {safeMax} แต้ม ({percent}%)
            </p>
            {showAverage && numberOfUnits > 1 && (
              <p className="text-[11px] text-slate-400">
                คะแนนเฉลี่ย: <span className="text-emerald-400 font-bold">{avgScorePerUnit}</span> / 40 แต้ม/ภารกิจ
              </p>
            )}
          </div>
        </div>

        <div className="hidden sm:flex flex-col items-end shrink-0 pl-3 border-l border-amber-500/20">
          <GoldenMagnifierBadge size={38} />
          <span className="text-[9px] text-amber-300 font-mono font-bold mt-1">20 ตัวชี้วัด</span>
        </div>
      </div>
    </div>
  );
};

