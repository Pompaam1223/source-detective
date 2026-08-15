import React from 'react';
import { CompetencyDomain, QuestionAttempt } from '../types';
import { COMPETENCY_DOMAINS, INDICATOR_DEFINITIONS } from '../data/indicators';
import { ScoringEngine } from '../engine/ScoringEngine';
import { ProgressBar } from './ProgressBar';
import { Award, Brain, SearchCheck, Wrench, MessageSquareText, TrendingUp } from 'lucide-react';

interface ScoreCardProps {
  attempts: QuestionAttempt[];
  totalScore?: number;
  maxScore?: number;
}

const DOMAIN_ICONS: Record<CompetencyDomain, React.ReactNode> = {
  THINK: <Brain className="w-4 h-4 text-amber-500" />,
  CHECK: <SearchCheck className="w-4 h-4 text-sky-500" />,
  SOLVE: <Wrench className="w-4 h-4 text-indigo-500" />,
  EXPLAIN: <MessageSquareText className="w-4 h-4 text-emerald-500" />,
  GROW: <TrendingUp className="w-4 h-4 text-rose-500" />
};

export const ScoreCard: React.FC<ScoreCardProps> = ({
  attempts,
  totalScore,
  maxScore = 40
}) => {
  const domainScores = ScoringEngine.calculateDomainScores(attempts);
  const earnedScore = totalScore !== undefined ? totalScore : attempts.reduce((sum, a) => sum + a.score, 0);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
      
      {/* Top Total Score Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 text-slate-100 border border-amber-500/30">
        <div>
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest block">
            สรุปผลคะแนนสมรรถนะ
          </span>
          <h3 className="text-lg font-bold mt-0.5">ผลการทดสอบการคิดวิเคราะห์</h3>
        </div>

        <div className="text-center sm:text-right shrink-0">
          <div className="text-3xl font-extrabold text-amber-400 font-mono">
            {earnedScore} <span className="text-sm text-slate-400 font-normal">/ {maxScore}</span>
          </div>
          <p className="text-[10px] text-slate-400 font-mono">คะแนนเต็ม 40 คะแนน</p>
        </div>
      </div>

      {/* 5 Core Competency Domains Breakdown */}
      <div>
        <h4 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-3">
          สมรรถนะ 5 ด้าน (Competency Breakdown):
        </h4>

        <div className="space-y-3">
          {(Object.keys(COMPETENCY_DOMAINS) as CompetencyDomain[]).map(domainKey => {
            const domainMeta = COMPETENCY_DOMAINS[domainKey];
            const scoreVal = domainScores[domainKey] || 0; // scale 0 - 2

            return (
              <div key={domainKey} className={`p-3.5 rounded-xl border ${domainMeta.bgClass}`}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    {DOMAIN_ICONS[domainKey]}
                    <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                      {domainMeta.titleTh}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                    {scoreVal} / 2.0
                  </span>
                </div>

                <ProgressBar
                  value={scoreVal}
                  max={2}
                  showPercentage={false}
                  heightClass="h-2"
                  colorClass="bg-amber-500"
                />
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
