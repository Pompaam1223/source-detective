import React from 'react';
import { AssessmentResult, Student, AppScreen, StudentProgress } from '../types';
import { ScoreCard } from '../components/ScoreCard';
import { DetectiveBadge } from '../components/DetectiveBadge';
import { StorageService } from '../engine/StorageService';
import { Award, ArrowLeft, Search, CheckCircle2, RotateCcw, Printer, TrendingUp, Sparkles, FolderKanban } from 'lucide-react';

interface ResultScreenProps {
  assessmentResult: AssessmentResult | null;
  currentStudent: Student | null;
  onNavigate: (screen: AppScreen) => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  assessmentResult,
  currentStudent,
  onNavigate
}) => {
  const attempts = currentStudent
    ? StorageService.getAttempts(currentStudent.studentId)
    : [];

  const evidences = currentStudent
    ? StorageService.getEvidences(currentStudent.studentId)
    : [];

  const progress: StudentProgress | null = currentStudent
    ? StorageService.getProgress(currentStudent.studentId)
    : null;

  const isPostTest = assessmentResult?.type === 'POST_TEST';
  const baselineScore = progress?.baselineScore || 0;
  const postTestScore = assessmentResult?.score ?? (progress?.postTestScore || 0);

  // Learning Gain calculation
  const scoreDiff = postTestScore - baselineScore;
  const maxPossibleGain = 40 - baselineScore;
  const relativeGainPercent = maxPossibleGain > 0 
    ? Math.round((scoreDiff / maxPossibleGain) * 100) 
    : 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('MISSION_MAP')}
          className="text-xs font-bold text-slate-400 hover:text-amber-400 flex items-center space-x-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>เข้าสู่แผนที่ภารกิจ (Mission Hub)</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrint}
            className="text-xs font-mono font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1 rounded-full border border-slate-700 flex items-center space-x-1 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span>พิมพ์รายงาน (Print Summary)</span>
          </button>
          <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${
            isPostTest 
              ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
              : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
          }`}>
            {isPostTest ? 'POST-TEST FINAL REPORT' : 'BASELINE REPORT'}
          </span>
        </div>
      </div>

      {/* Learning Gain Banner for Post-test */}
      {isPostTest && progress?.baselineStatus === 'COMPLETED' && (
        <div className="bg-gradient-to-br from-indigo-950/80 to-slate-900 border border-indigo-500/40 rounded-2xl p-5 text-slate-100 shadow-xl space-y-3">
          <div className="flex items-center space-x-2 text-indigo-400">
            <TrendingUp className="w-5 h-5" />
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider">
              ผลการพัฒนาสมรรถนะการคิดวิเคราะห์ (LEARNING GAIN ANALYSIS)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">คะแนนก่อนเรียน (Baseline)</span>
              <div className="text-2xl font-black text-amber-400 font-mono mt-0.5">
                {baselineScore} <span className="text-xs text-slate-400">/ 40</span>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">คะแนนหลังเรียน (Post-test)</span>
              <div className="text-2xl font-black text-emerald-400 font-mono mt-0.5">
                {postTestScore} <span className="text-xs text-slate-400">/ 40</span>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-indigo-500/30 rounded-xl p-3 text-center">
              <span className="text-[10px] text-indigo-300 uppercase font-mono block">อัตราการพัฒนา (Learning Gain)</span>
              <div className={`text-2xl font-black font-mono mt-0.5 ${scoreDiff >= 0 ? 'text-indigo-300' : 'text-rose-400'}`}>
                {scoreDiff >= 0 ? `+${scoreDiff}` : scoreDiff} คะแนน
                <span className="text-xs text-slate-400 block font-sans font-normal">
                  ({relativeGainPercent}% Normalized Gain)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Badge */}
      <DetectiveBadge
        scorePoints={assessmentResult?.score || 0}
        maxPoints={40}
      />

      {/* ScoreCard Breakdown */}
      <ScoreCard
        attempts={attempts}
        totalScore={assessmentResult?.score}
        maxScore={40}
      />

      {/* Bottom Actions */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <button
          onClick={() => onNavigate('SCORE_REPORT')}
          className="btn-game-orange text-slate-950 font-black text-sm px-6 py-3 rounded-xl shadow-xl flex items-center space-x-2 cursor-pointer"
        >
          <Award className="w-4 h-4" />
          <span>ดูผลคะแนนทั้ง 6 ส่วน & พิมพ์ใบรับรอง (PDF)</span>
        </button>

        <button
          onClick={() => onNavigate('MISSION_MAP')}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm px-6 py-3 rounded-xl border border-slate-700 flex items-center space-x-2 cursor-pointer"
        >
          <FolderKanban className="w-4 h-4 text-amber-400" />
          <span>{isPostTest ? 'กลับสู่แผนที่ภารกิจ' : 'เข้าสู่แผนที่ภารกิจ (Mission Hub)'}</span>
        </button>

        <button
          onClick={() => onNavigate('EVIDENCE_PREVIEW')}
          className="bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-sm px-6 py-3 rounded-xl border border-slate-700 flex items-center space-x-1.5 cursor-pointer"
        >
          <Search className="w-4 h-4 text-amber-400" />
          <span>ดูบอร์ดรวบรวมหลักฐาน ({evidences.length})</span>
        </button>
      </div>

    </div>
  );
};
