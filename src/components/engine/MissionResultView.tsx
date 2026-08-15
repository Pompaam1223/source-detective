import React from 'react';
import {
  MissionConfig,
  QuestionAttempt,
  Evidence,
  CompetencyDomain
} from '../../types';
import { ScoringEngine } from '../../engine/ScoringEngine';
import { COMPETENCY_DOMAINS } from '../../data/indicators';
import {
  Award,
  Shield,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  RotateCcw,
  Printer,
  ChevronRight,
  Sparkles,
  TrendingUp,
  BookOpen
} from 'lucide-react';
import { DetectiveTrophyCelebration, DetectiveCat } from '../characters/DetectiveCharacters';
import { PushPin, DetectiveStamp, TapeSticker } from '../decorations/DetectiveDecorations';

interface MissionResultViewProps {
  mission: MissionConfig;
  attempts: QuestionAttempt[];
  evidences: Evidence[];
  totalScore: number;
  maxScore: number;
  onRetry: () => void;
  onContinue: () => void;
}

export const MissionResultView: React.FC<MissionResultViewProps> = ({
  mission,
  attempts,
  evidences,
  totalScore,
  maxScore,
  onRetry,
  onContinue
}) => {
  const percentage = Math.round((totalScore / maxScore) * 100);
  const rank = ScoringEngine.getDetectiveRankTitle(percentage);
  const domainScores = ScoringEngine.calculateDomainScores(attempts);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn py-4 print:p-0">
      {/* Top Banner with Trophy Celebration & Rank */}
      <div className="relative bg-gradient-to-br from-amber-950 via-slate-950 to-slate-900 border-4 border-amber-500/50 rounded-3xl p-6 sm:p-8 text-slate-100 shadow-2xl text-center overflow-hidden">
        <PushPin color="yellow" className="absolute -top-3 left-8" />
        <PushPin color="red" className="absolute -top-3 right-8" />

        <div className="relative z-10 space-y-4 flex flex-col items-center">
          {/* Trophy Artwork */}
          <DetectiveTrophyCelebration size={220} className="my-1" />

          <span className="bg-amber-500 text-slate-950 font-mono text-xs font-black px-4 py-1.5 rounded-full shadow-md">
            ภารกิจสืบสวนสำเร็จ • CASE #{mission.missionNumber} ({mission.caseCode})
          </span>

          <h1 className="text-2xl sm:text-3xl font-black text-amber-300 font-mono">
            {rank.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-200 max-w-xl mx-auto">
            คุณได้ผ่านการสืบสวนคดี <strong className="text-amber-400 font-bold">{mission.missionTitle}</strong> รวบรวมเบาะแสครบทุกด่านแล้ว!
          </p>

          <div className="flex items-center justify-center space-x-6 sm:space-x-10 pt-4 border-t border-slate-800 w-full max-w-md">
            <div>
              <span className="text-3xl sm:text-4xl font-mono font-black text-amber-400">
                {totalScore}
              </span>
              <span className="text-slate-400 font-mono text-sm">/{maxScore}</span>
              <p className="text-xs text-slate-300 font-bold mt-0.5">คะแนนภารกิจ</p>
            </div>

            <div className="h-10 w-px bg-slate-800"></div>

            <div>
              <span className="text-3xl sm:text-4xl font-mono font-black text-sky-400">
                {percentage}%
              </span>
              <p className="text-xs text-slate-300 font-bold mt-0.5">ระดับความแม่นยำ</p>
            </div>
          </div>
        </div>
      </div>


      {/* Competency Domains Breakdown (5 Domains in Thai) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-md space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-amber-500" />
            <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base sm:text-lg">
              สมรรถนะการสืบสวน 5 มิติ (Competency Profile)
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">มาตราส่วน 0.0 - 2.0</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {(Object.keys(COMPETENCY_DOMAINS) as CompetencyDomain[]).map(domainKey => {
            const domainMeta = COMPETENCY_DOMAINS[domainKey];
            const score = domainScores[domainKey] || 0;
            const domainPercent = Math.min(100, Math.round((score / 2.0) * 100));

            return (
              <div
                key={domainKey}
                className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                    {domainMeta.titleTh.split(' - ')[1] || domainMeta.titleTh}
                  </span>
                  <span className="text-xs font-mono font-black text-amber-600 dark:text-amber-400">
                    {score.toFixed(1)}/2.0
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all"
                    style={{ width: `${domainPercent}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                  {domainMeta.subtitleTh}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stage Breakdown */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-md space-y-4">
        <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base sm:text-lg flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-sky-500" />
          <span>ผลการสืบสวนรายด่าน ({mission.stages.length} ด่าน)</span>
        </h3>

        <div className="space-y-3">
          {mission.stages.map((stage) => {
            const stageAttempts = attempts.filter(a => stage.questionIds.includes(a.questionId));
            const stageEarned = stageAttempts.reduce((sum, a) => sum + a.score, 0);
            const stageMax = stageAttempts.reduce((sum, a) => sum + a.maxScore, 0);
            const stagePercent = stageMax > 0 ? Math.round((stageEarned / stageMax) * 100) : 0;

            return (
              <div
                key={stage.stageId}
                className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/50 px-2 py-0.5 rounded-md">
                      ด่าน {stage.stageNumber}
                    </span>
                    <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      {stage.title}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {stageAttempts.length} ข้อสอบถาม • {stageEarned}/{stageMax} คะแนน ({stagePercent}%)
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-xl ${
                    stagePercent >= 75
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {stagePercent >= 75 ? 'ยอดเยี่ยม' : 'ผ่านเกณฑ์'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Evidences Log Summary */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-md space-y-4">
        <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base sm:text-lg flex items-center space-x-2">
          <FileCheck className="w-5 h-5 text-emerald-500" />
          <span>แฟ้มหลักฐานที่รวบรวมได้ ({evidences.length} รายการ)</span>
        </h3>

        <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
          {evidences.map((ev, idx) => (
            <div
              key={ev.id || idx}
              className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="bg-sky-500/20 text-sky-700 dark:text-sky-300 font-mono font-bold px-1.5 py-0.5 rounded text-[10px]">
                    {ev.indicatorId}
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                    {ev.title}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400">
                  {ev.content}
                </p>
              </div>

              <span className="font-mono font-bold text-amber-600 dark:text-amber-400 shrink-0">
                +{ev.score}/{ev.maxScore}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800 print:hidden">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button
            onClick={onRetry}
            className="flex-1 sm:flex-none px-5 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>สืบสวนคดีนี้ซ้ำ</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-none px-5 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center space-x-2"
          >
            <Printer className="w-4 h-4" />
            <span>พิมพ์รายงานสรุป</span>
          </button>
        </div>

        <button
          onClick={onContinue}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-xl hover:shadow-amber-500/20 transition-all flex items-center justify-center space-x-2"
        >
          <span>กลับสู่เมนูหลัก</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
