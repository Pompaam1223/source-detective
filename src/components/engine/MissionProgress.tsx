import React from 'react';
import { IndicatorId } from '../../types';
import { INDICATOR_DEFINITIONS } from '../../data/indicators';
import { Award, Shield, Target, HelpCircle } from 'lucide-react';

interface MissionProgressProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  currentStageNumber: number;
  totalStages: number;
  stageTitle: string;
  earnedScore: number;
  totalMaxScore: number;
  activeIndicatorId?: IndicatorId;
  maxUnlockedIndex?: number;
  questionStatuses?: Record<string, string>;
  questions?: { questionId: string }[];
  onJumpToQuestion?: (idx: number) => void;
}

export const MissionProgress: React.FC<MissionProgressProps> = ({
  currentQuestionIndex,
  totalQuestions,
  currentStageNumber,
  totalStages,
  stageTitle,
  earnedScore,
  totalMaxScore,
  activeIndicatorId,
  maxUnlockedIndex = totalQuestions - 1,
  questionStatuses = {},
  questions = [],
  onJumpToQuestion
}) => {
  const percent = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);
  const indicatorDef = activeIndicatorId ? INDICATOR_DEFINITIONS[activeIndicatorId] : undefined;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-slate-100 shadow-md space-y-3">
      {/* Top row: Stage Title & Live Score */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="bg-amber-500 text-slate-950 text-xs font-mono font-black px-2.5 py-0.5 rounded-full">
            ด่าน {currentStageNumber}/{totalStages}
          </span>
          <span className="text-xs sm:text-sm font-bold text-slate-200">
            {stageTitle}
          </span>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <span className="flex items-center space-x-1 text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
            <Award className="w-3.5 h-3.5" />
            <span>คะแนนสะสม: {earnedScore}/{totalMaxScore}</span>
          </span>
        </div>
      </div>

      {/* Progress Bar & Question Count */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-slate-400 font-mono">
          <span>ความคืบหน้า: ข้อ {currentQuestionIndex + 1} จาก {totalQuestions} ข้อ</span>
          <span>{percent}%</span>
        </div>
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-500 to-amber-400 h-full rounded-full transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Sequential Question Progress Pills */}
      {questions.length > 0 && onJumpToQuestion && (
        <div className="flex items-center justify-between gap-1 overflow-x-auto pt-1 pb-1">
          {questions.map((q, idx) => {
            const status = questionStatuses[q.questionId] || 'UNANSWERED';
            const isCurrent = idx === currentQuestionIndex;
            const isUnlocked = idx <= maxUnlockedIndex;

            return (
              <button
                key={q.questionId}
                type="button"
                onClick={() => onJumpToQuestion(idx)}
                disabled={!isUnlocked}
                className={`flex-1 min-w-[28px] py-1 px-1 rounded-md text-[11px] font-mono font-bold transition-all text-center border ${
                  isCurrent
                    ? 'bg-amber-500 text-slate-950 border-amber-400 ring-2 ring-amber-400/50 scale-105'
                    : status === 'REVISED'
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 hover:bg-purple-500/30'
                    : status === 'ANSWERED'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                    : isUnlocked
                    ? 'bg-slate-800 text-slate-300 border-slate-700 hover:border-amber-400'
                    : 'bg-slate-950 text-slate-600 border-slate-900 cursor-not-allowed opacity-40'
                }`}
                title={`ข้อที่ ${idx + 1}: ${status === 'ANSWERED' ? 'ตอบแล้ว' : status === 'REVISED' ? 'แก้ไขแล้ว' : 'ยังไม่ตอบ'}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      )}

      {/* Active Indicator info tag */}
      {indicatorDef && (
        <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80">
          <div className="flex items-center space-x-1.5 overflow-hidden">
            <span className="bg-sky-500/20 text-sky-300 font-mono font-bold px-1.5 py-0.2 rounded shrink-0">
              ตัวชี้วัด {indicatorDef.code}
            </span>
            <span className="truncate text-slate-300 font-medium">
              {indicatorDef.nameTh}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 shrink-0 ml-2 font-mono">
            {indicatorDef.domain}
          </span>
        </div>
      )}
    </div>
  );
};
