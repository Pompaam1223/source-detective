import React, { useState, useRef } from 'react';
import { Student, AppScreen, StudentProgress, CompetencyDomain, IndicatorId } from '../types';
import { StorageService } from '../engine/StorageService';
import { ScoringEngine } from '../engine/ScoringEngine';
import { COMPETENCY_DOMAINS, INDICATOR_DEFINITIONS, ALL_INDICATOR_KEYS } from '../data/indicators';
import { MISSIONS_DATA } from '../data/missions';
import { PushPin, TapeSticker, DetectiveStamp } from '../components/decorations/DetectiveDecorations';
import { DetectiveCat } from '../components/characters/DetectiveCharacters';
import {
  Award,
  TrendingUp,
  FileSpreadsheet,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Shield,
  Brain,
  Search,
  Wrench,
  MessageSquareText,
  HeartHandshake,
  ArrowRight,
  BookOpen,
  Calendar,
  User,
  Star,
  Zap,
  Target,
  FileCheck2,
  ChevronRight,
  Download,
  Info
} from 'lucide-react';

interface ScoreReportScreenProps {
  currentStudent: Student | null;
  onNavigate: (screen: AppScreen) => void;
}

export const ScoreReportScreen: React.FC<ScoreReportScreenProps> = ({
  currentStudent,
  onNavigate
}) => {
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<CompetencyDomain | 'ALL'>('ALL');

  // Fallback demo student if none logged in
  const student = currentStudent || StorageService.getStudent() || {
    studentId: 'guest_student',
    firstName: 'ผู้เรียน',
    lastName: 'นักสืบฝึกหัด',
    studentNumber: '001',
    gradeLevel: 'ประถมศึกษาปีที่ 6',
    registeredAt: new Date().toISOString()
  };

  const progress: StudentProgress = StorageService.getProgress(student.studentId) || {
    studentId: student.studentId,
    totalPoints: 0,
    maxPossiblePoints: 240,
    completedMissionIds: [],
    baselineStatus: 'NOT_STARTED',
    postTestStatus: 'NOT_STARTED',
    lastUpdated: new Date().toISOString()
  };

  const missionResults = StorageService.getMissionResults(student.studentId);
  const attempts = StorageService.getAttempts(student.studentId);
  const assessments = StorageService.getAssessmentResults(student.studentId);

  // 1. Calculate Scores for 6 Parts (Each max 40, Total max 240)
  const baselineResult = assessments.find(a => a.type === 'BASELINE');
  const postTestResult = assessments.find(a => a.type === 'POST_TEST');

  const baselineScore = progress.baselineStatus === 'COMPLETED' ? (progress.baselineScore ?? baselineResult?.score ?? 0) : null;
  const postTestScore = progress.postTestStatus === 'COMPLETED' ? (progress.postTestScore ?? postTestResult?.score ?? 0) : null;

  const m1Score = missionResults.find(m => m.missionId === 'm1')?.score ?? null;
  const m2Score = missionResults.find(m => m.missionId === 'm2')?.score ?? null;
  const m3Score = missionResults.find(m => m.missionId === 'm3')?.score ?? null;
  const m4Score = missionResults.find(m => m.missionId === 'm4')?.score ?? null;

  const numericScores = [
    baselineScore ?? 0,
    m1Score ?? 0,
    m2Score ?? 0,
    m3Score ?? 0,
    m4Score ?? 0,
    postTestScore ?? 0
  ];
  const currentEarnedPoints = numericScores.reduce((a, b) => a + b, 0);
  const overallPercentage = Math.round((currentEarnedPoints / 240) * 100);

  // 2. Calculate Learning Gain
  let learningGainText = 'ยังไม่มีข้อมูลเปรียบเทียบ';
  let learningGainPercent = 0;
  let hasLearningGain = false;

  if (baselineScore !== null && postTestScore !== null) {
    hasLearningGain = true;
    const diff = postTestScore - baselineScore;
    const maxGain = 40 - baselineScore;
    learningGainPercent = maxGain > 0 ? Math.round((diff / maxGain) * 100) : 0;
    learningGainText = `${diff >= 0 ? '+' : ''}${diff} คะแนน (${learningGainPercent >= 0 ? '+' : ''}${learningGainPercent}%)`;
  }

  // 3. 20 Indicators Computation
  const indicatorScores: Record<IndicatorId, { earned: number; max: number; ratio: number; scoreOutOf2: number }> = {} as any;

  ALL_INDICATOR_KEYS.forEach(indId => {
    // Collect attempts for this indicator
    const indAttempts = attempts.filter(a => a.indicatorId === indId);
    let earned = indAttempts.reduce((sum, a) => sum + (a.score || 0), 0);
    let max = indAttempts.reduce((sum, a) => sum + (a.maxScore || 4), 0);

    // If assessment results contain indicator data
    if (baselineResult?.indicatorScores?.[indId] !== undefined) {
      earned += baselineResult.indicatorScores[indId];
      max += 2;
    }
    if (postTestResult?.indicatorScores?.[indId] !== undefined) {
      earned += postTestResult.indicatorScores[indId];
      max += 2;
    }

    const ratio = max > 0 ? earned / max : 0.75; // sensible baseline estimate
    const scoreOutOf2 = Math.round(ratio * 2 * 10) / 10;

    indicatorScores[indId] = {
      earned,
      max,
      ratio,
      scoreOutOf2
    };
  });

  // 4. Domain Scores Calculation
  const domainScores: Record<CompetencyDomain, { avgOutOf2: number; percent: number }> = {
    THINK: { avgOutOf2: 0, percent: 0 },
    CHECK: { avgOutOf2: 0, percent: 0 },
    SOLVE: { avgOutOf2: 0, percent: 0 },
    EXPLAIN: { avgOutOf2: 0, percent: 0 },
    GROW: { avgOutOf2: 0, percent: 0 }
  };

  (Object.keys(domainScores) as CompetencyDomain[]).forEach(d => {
    const domainIndicators = ALL_INDICATOR_KEYS.filter(k => INDICATOR_DEFINITIONS[k].domain === d);
    const sum = domainIndicators.reduce((acc, k) => acc + indicatorScores[k].scoreOutOf2, 0);
    const avg = sum / domainIndicators.length;
    domainScores[d] = {
      avgOutOf2: Math.round(avg * 10) / 10,
      percent: Math.round((avg / 2) * 100)
    };
  });

  // 5. Strengths & Areas for Improvement Analysis
  const sortedIndicators = [...ALL_INDICATOR_KEYS].sort((a, b) => {
    return indicatorScores[b].scoreOutOf2 - indicatorScores[a].scoreOutOf2;
  });

  const topStrengths = sortedIndicators.slice(0, 3).map(k => ({
    indicator: INDICATOR_DEFINITIONS[k],
    score: indicatorScores[k].scoreOutOf2
  }));

  const areasToImprove = sortedIndicators.slice(-3).reverse().map(k => ({
    indicator: INDICATOR_DEFINITIONS[k],
    score: indicatorScores[k].scoreOutOf2
  }));

  // 6. Rank Info
  const rankInfo = ScoringEngine.getDetectiveRankTitle(overallPercentage);

  const handlePrint = () => {
    window.print();
  };

  // Close modal with ESC key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showCertificateModal) {
        setShowCertificateModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showCertificateModal]);

  return (
    <div className="max-w-6xl mx-auto py-4 sm:py-8 space-y-8 animate-fadeIn">
      
      {/* Top Banner & Header */}
      <div className="relative bg-gradient-to-r from-slate-900 via-amber-950/70 to-slate-900 border-3 border-amber-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        <PushPin color="red" className="absolute -top-3.5 left-8" />
        <TapeSticker className="top-4 right-10 hidden sm:block" angle={12} />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-black uppercase px-3 py-1 rounded-full bg-amber-500 text-slate-950">
                ★ OFFICIAL SCORE & COMPETENCY TRANSCRIPT
              </span>
              <span className="text-xs font-mono text-amber-400 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30">
                ระบบรายงานผลการเรียนรู้แบบ Real-time
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-100 flex items-center gap-3">
              <span>รายงานผลคะแนนนักสืบ & สมรรถนะ 20 ตัวชี้วัด</span>
            </h1>

            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              แฟ้มประเมินทักษะการรู้เท่าทันสื่อ การคิดวิเคราะห์ ตรวจสอบข้อมูล การแก้ปัญหา และการตัดสินใจเชิงวิพากษ์ ครบทั้ง 6 ส่วนการประเมิน
            </p>

            {/* Student Info Bar */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono text-amber-200">
              <span className="flex items-center gap-1.5 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-amber-500/30">
                <User className="w-4 h-4 text-amber-400" />
                <span>นักสืบ: <strong>{student.nickname || student.firstName || 'นักสืบเยาวชน'}</strong></span>
                {student.username && <span className="text-amber-400/80">(@{student.username})</span>}
              </span>
              <span className="flex items-center gap-1.5 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-amber-500/30">
                <span>รหัสประจำตัว: <strong className="text-amber-400">{student.studentId}</strong></span>
              </span>
              <span className="flex items-center gap-1.5 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-amber-500/30">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>วันที่: {new Date().toLocaleDateString('th-TH')}</span>
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <button
              onClick={() => setShowCertificateModal(true)}
              className="btn-game-orange text-slate-950 px-5 py-3 rounded-2xl font-black text-sm shadow-xl flex items-center justify-center space-x-2 cursor-pointer transition-all hover:scale-105"
            >
              <Award className="w-5 h-5" />
              <span>พิมพ์ใบรับรองผลการเรียน (PDF)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. Overall Score Summary & Learning Gain Metrics (6 Parts Breakdown) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-black text-slate-100 font-mono uppercase tracking-wider">
              1. สรุปผลคะแนนทั้ง 6 ส่วนการประเมิน (เต็ม 240 แต้ม)
            </h2>
          </div>
          <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
            คะแนนสะสมรวม: {currentEarnedPoints} / 240 แต้ม ({overallPercentage}%)
          </span>
        </div>

        {/* 6 Parts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Part 1: Pre-test */}
          <div className={`p-5 rounded-2xl border-2 transition-all ${
            baselineScore !== null 
              ? 'bg-slate-900/90 border-amber-500/50 shadow-md' 
              : 'bg-slate-900/40 border-slate-800 opacity-75'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                ส่วนที่ 1 • PRE-TEST
              </span>
              {baselineScore !== null ? (
                <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" /> ทำแล้ว
                </span>
              ) : (
                <span className="text-[10px] font-bold text-slate-500 font-mono">ยังไม่ทำ</span>
              )}
            </div>
            <h3 className="text-base font-bold text-slate-200 mt-2">
              แบบประเมินก่อนเรียน (Baseline)
            </h3>
            <div className="mt-3 flex items-baseline justify-between border-t border-slate-800 pt-2">
              <span className="text-2xl font-black font-mono text-amber-400">
                {baselineScore !== null ? baselineScore : '-'}
              </span>
              <span className="text-xs font-mono text-slate-400">เต็ม 40 คะแนน</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-amber-400 h-full rounded-full transition-all duration-700"
                style={{ width: `${baselineScore !== null ? (baselineScore / 40) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Part 2: Mission 1 */}
          <div className={`p-5 rounded-2xl border-2 transition-all ${
            m1Score !== null 
              ? 'bg-slate-900/90 border-sky-500/50 shadow-md' 
              : 'bg-slate-900/40 border-slate-800 opacity-75'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded">
                ส่วนที่ 2 • ภารกิจ 1
              </span>
              {m1Score !== null ? (
                <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" /> ผ่านภารกิจ
                </span>
              ) : (
                <span className="text-[10px] font-bold text-slate-500 font-mono">ยังไม่สำเร็จ</span>
              )}
            </div>
            <h3 className="text-base font-bold text-slate-200 mt-2">
              M1: "ใครพูด? เชื่อได้แค่ไหน?"
            </h3>
            <div className="mt-3 flex items-baseline justify-between border-t border-slate-800 pt-2">
              <span className="text-2xl font-black font-mono text-sky-400">
                {m1Score !== null ? m1Score : '-'}
              </span>
              <span className="text-xs font-mono text-slate-400">เต็ม 40 คะแนน</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-sky-400 h-full rounded-full transition-all duration-700"
                style={{ width: `${m1Score !== null ? (m1Score / 40) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Part 3: Mission 2 */}
          <div className={`p-5 rounded-2xl border-2 transition-all ${
            m2Score !== null 
              ? 'bg-slate-900/90 border-indigo-500/50 shadow-md' 
              : 'bg-slate-900/40 border-slate-800 opacity-75'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                ส่วนที่ 3 • ภารกิจ 2
              </span>
              {m2Score !== null ? (
                <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" /> ผ่านภารกิจ
                </span>
              ) : (
                <span className="text-[10px] font-bold text-slate-500 font-mono">ยังไม่สำเร็จ</span>
              )}
            </div>
            <h3 className="text-base font-bold text-slate-200 mt-2">
              M2: "หลักฐานบอกอะไร?"
            </h3>
            <div className="mt-3 flex items-baseline justify-between border-t border-slate-800 pt-2">
              <span className="text-2xl font-black font-mono text-indigo-400">
                {m2Score !== null ? m2Score : '-'}
              </span>
              <span className="text-xs font-mono text-slate-400">เต็ม 40 คะแนน</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-indigo-400 h-full rounded-full transition-all duration-700"
                style={{ width: `${m2Score !== null ? (m2Score / 40) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Part 4: Mission 3 */}
          <div className={`p-5 rounded-2xl border-2 transition-all ${
            m3Score !== null 
              ? 'bg-slate-900/90 border-emerald-500/50 shadow-md' 
              : 'bg-slate-900/40 border-slate-800 opacity-75'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                ส่วนที่ 4 • ภารกิจ 3
              </span>
              {m3Score !== null ? (
                <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" /> ผ่านภารกิจ
                </span>
              ) : (
                <span className="text-[10px] font-bold text-slate-500 font-mono">ยังไม่สำเร็จ</span>
              )}
            </div>
            <h3 className="text-base font-bold text-slate-200 mt-2">
              M3: "เปรียบเทียบ & ตัดสินใจ"
            </h3>
            <div className="mt-3 flex items-baseline justify-between border-t border-slate-800 pt-2">
              <span className="text-2xl font-black font-mono text-emerald-400">
                {m3Score !== null ? m3Score : '-'}
              </span>
              <span className="text-xs font-mono text-slate-400">เต็ม 40 คะแนน</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-700"
                style={{ width: `${m3Score !== null ? (m3Score / 40) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Part 5: Mission 4 */}
          <div className={`p-5 rounded-2xl border-2 transition-all ${
            m4Score !== null 
              ? 'bg-slate-900/90 border-rose-500/50 shadow-md' 
              : 'bg-slate-900/40 border-slate-800 opacity-75'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                ส่วนที่ 5 • ภารกิจ 4
              </span>
              {m4Score !== null ? (
                <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" /> ผ่านภารกิจ
                </span>
              ) : (
                <span className="text-[10px] font-bold text-slate-500 font-mono">ยังไม่สำเร็จ</span>
              )}
            </div>
            <h3 className="text-base font-bold text-slate-200 mt-2">
              M4: "ก่อนแชร์ ต้องชัวร์!"
            </h3>
            <div className="mt-3 flex items-baseline justify-between border-t border-slate-800 pt-2">
              <span className="text-2xl font-black font-mono text-rose-400">
                {m4Score !== null ? m4Score : '-'}
              </span>
              <span className="text-xs font-mono text-slate-400">เต็ม 40 คะแนน</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-rose-400 h-full rounded-full transition-all duration-700"
                style={{ width: `${m4Score !== null ? (m4Score / 40) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Part 6: Post-test */}
          <div className={`p-5 rounded-2xl border-2 transition-all ${
            postTestScore !== null 
              ? 'bg-slate-900/90 border-amber-400 shadow-xl' 
              : 'bg-slate-900/40 border-slate-800 opacity-75'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded border border-amber-400/40">
                ส่วนที่ 6 • POST-TEST
              </span>
              {postTestScore !== null ? (
                <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" /> ทำเสร็จสิ้น
                </span>
              ) : (
                <span className="text-[10px] font-bold text-slate-500 font-mono">ยังไม่ทำ</span>
              )}
            </div>
            <h3 className="text-base font-bold text-amber-200 mt-2">
              แบบประเมินหลังเรียน (Final)
            </h3>
            <div className="mt-3 flex items-baseline justify-between border-t border-slate-800 pt-2">
              <span className="text-2xl font-black font-mono text-amber-300">
                {postTestScore !== null ? postTestScore : '-'}
              </span>
              <span className="text-xs font-mono text-slate-400">เต็ม 40 คะแนน</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-400 to-amber-300 h-full rounded-full transition-all duration-700"
                style={{ width: `${postTestScore !== null ? (postTestScore / 40) * 100 : 0}%` }}
              />
            </div>
          </div>

        </div>

        {/* Real-time Learning Gain & Progress Banner */}
        <div className="bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-950 border-2 border-indigo-500/40 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-500/30 pb-3">
            <div className="flex items-center space-x-2 text-indigo-400">
              <TrendingUp className="w-5 h-5" />
              <h3 className="text-base font-bold font-mono uppercase text-indigo-200">
                การวิเคราะห์พัฒนาการการเรียนรู้ (Real-time Learning Gain)
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">
              {rankInfo.badge} ยศปัจจุบัน: {rankInfo.title}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center font-mono">
            <div className="bg-slate-950/70 p-4 rounded-xl border border-indigo-500/20">
              <span className="text-[11px] text-slate-400 uppercase">ก่อนเรียน (Pre-test)</span>
              <p className="text-2xl font-black text-amber-400 mt-1">
                {baselineScore !== null ? `${baselineScore} / 40` : '- ยังไม่ได้ทำ -'}
              </p>
            </div>

            <div className="bg-slate-950/70 p-4 rounded-xl border border-indigo-500/20">
              <span className="text-[11px] text-slate-400 uppercase">หลังเรียน (Post-test)</span>
              <p className="text-2xl font-black text-emerald-400 mt-1">
                {postTestScore !== null ? `${postTestScore} / 40` : '- ยังไม่ได้ทำ -'}
              </p>
            </div>

            <div className="bg-slate-950/70 p-4 rounded-xl border border-indigo-500/20">
              <span className="text-[11px] text-slate-400 uppercase">อัตราการพัฒนา (Learning Gain)</span>
              <p className="text-2xl font-black text-indigo-300 mt-1">
                {learningGainText}
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            💡 <strong>คำอธิบายอัตราการพัฒนา:</strong> คำนวณจากสัดส่วนคะแนนที่เพิ่มขึ้นเทียบกับโอกาสการพัฒนาสูงสุด <code>[(Post - Pre) / (40 - Pre) × 100%]</code> สะท้อนถึงการเติบโตของทักษะการรู้เท่าทันสื่อและการตรวจสอบข้อเท็จจริงหลังผ่านการฝึกฝนภารกิจ
          </p>
        </div>
      </div>

      {/* 2. Qualitative Narrative & 20 Indicators Diagnostics */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-black text-slate-100 font-mono uppercase tracking-wider">
              2. ข้อความบรรยายสรุปผลภาพรวม 20 ตัวชี้วัด & การวินิจฉัยทักษะ
            </h2>
          </div>

          {/* Filter Domain */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
            <button
              onClick={() => setSelectedDomainFilter('ALL')}
              className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                selectedDomainFilter === 'ALL'
                  ? 'bg-amber-500 text-slate-950 font-black'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              ทั้งหมด (20 ตัวชี้วัด)
            </button>
            {(Object.keys(COMPETENCY_DOMAINS) as CompetencyDomain[]).map(d => (
              <button
                key={d}
                onClick={() => setSelectedDomainFilter(d)}
                className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                  selectedDomainFilter === d
                    ? 'bg-amber-500 text-slate-950 font-black'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Diagnostic 3-Box: Strengths, Areas for Improvement, and Encouragement */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Card 1: จุดแข็ง (Strengths) */}
          <div className="bg-gradient-to-b from-emerald-950/40 via-slate-900 to-slate-950 border-2 border-emerald-500/50 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center space-x-2.5 text-emerald-400 border-b border-emerald-500/30 pb-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Star className="w-5 h-5 text-emerald-400 fill-emerald-400/30" />
              </div>
              <div>
                <h3 className="text-base font-bold text-emerald-200">จุดแข็งที่โดดเด่น (Strengths)</h3>
                <span className="text-[10px] font-mono text-emerald-400/80">ทักษะที่ทำคะแนนได้ดีเยี่ยม</span>
              </div>
            </div>

            <div className="space-y-3">
              {topStrengths.map((item, idx) => (
                <div key={idx} className="bg-slate-950/80 border border-emerald-500/30 rounded-2xl p-3.5 space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      [{item.indicator.id}] {item.indicator.nameTh}
                    </span>
                    <span className="font-black text-emerald-300">{item.score} / 2.0</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    {item.indicator.descriptionTh}
                  </p>
                </div>
              ))}
            </div>

            <p className="text-xs text-emerald-300/90 italic bg-emerald-950/60 p-3 rounded-xl border border-emerald-500/20">
              ✨ <strong>คำชมเชย:</strong> นักสืบมีความแม่นยำสูงในการระบุตัวตนผู้ส่งสาร และสามารถจับสัญญาณความเสี่ยงของข้อความได้อย่างยอดเยี่ยม!
            </p>
          </div>

          {/* Card 2: จุดที่ควรพัฒนา (Areas for Improvement) */}
          <div className="bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-950 border-2 border-amber-500/50 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center space-x-2.5 text-amber-400 border-b border-amber-500/30 pb-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-amber-200">จุดที่ควรพัฒนา (Areas for Growth)</h3>
                <span className="text-[10px] font-mono text-amber-400/80">ทักษะที่สามารถฝึกฝนเพิ่มเติม</span>
              </div>
            </div>

            <div className="space-y-3">
              {areasToImprove.map((item, idx) => (
                <div key={idx} className="bg-slate-950/80 border border-amber-500/30 rounded-2xl p-3.5 space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                      [{item.indicator.id}] {item.indicator.nameTh}
                    </span>
                    <span className="font-black text-amber-300">{item.score} / 2.0</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    {item.indicator.descriptionTh}
                  </p>
                </div>
              ))}
            </div>

            <p className="text-xs text-amber-300/90 italic bg-amber-950/60 p-3 rounded-xl border border-amber-500/20">
              🔍 <strong>แนวทางพัฒนา:</strong> ฝึกการเปรียบเทียบเอกสารราชการ/งานวิจัยชั้นต้น และหลีกเลี่ยงการรีบแชร์ก่อนทวนสอบกับแหล่งข้อมูลทางการ
            </p>
          </div>

          {/* Card 3: ข้อเสนอแนะ & คำให้กำลังใจ (Recommendations & Encouragement) */}
          <div className="bg-gradient-to-b from-indigo-950/40 via-slate-900 to-slate-950 border-2 border-indigo-500/50 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center space-x-2.5 text-indigo-400 border-b border-indigo-500/30 pb-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                  <HeartHandshake className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-indigo-200">ข้อเสนอแนะ & กำลังใจ</h3>
                  <span className="text-[10px] font-mono text-indigo-400/80">คำแนะนำจากสารวัตรสืบสวน</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 bg-slate-950/90 p-4 rounded-2xl border border-indigo-500/30">
                <DetectiveCat mood="HAPPY" size="sm" />
                <div className="space-y-1.5 text-xs text-slate-200">
                  <p className="font-bold text-amber-300">
                    "ยอดเยี่ยมมากเจ้าเหมียวนักสืบ!"
                  </p>
                  <p className="leading-relaxed text-slate-300">
                    การสืบสวนที่ดีไม่ใช่แค่การหาคนผิด แต่คือการสร้างนิสัย <strong>'หยุดคิด ตรวจสอบ และอธิบายด้วยหลักฐาน'</strong> ขอให้นำทักษะทั้ง 5 ด้านนี้ไปใช้ปกป้องตนเองและครอบครัวในโลกออนไลน์ต่อไปนะ!
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                  <span><strong>THINK:</strong> ตั้งคำถามเสมอว่าผู้ส่งสารได้ประโยชน์อะไร</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-sky-400 shrink-0" />
                  <span><strong>CHECK:</strong> ค้นหาแหล่งต้นตออย่างน้อย 2 แหล่งที่เชื่อถือได้</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0" />
                  <span><strong>GROW:</strong> กล้าทบทวนและเปลี่ยนความคิดเมื่อพบหลักฐานใหม่</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('MISSION_MAP')}
              className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <span>กลับสู่ศูนย์ภารกิจสืบสวน</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* 20 Indicators Master Matrix Table */}
        <div className="bg-slate-950 border-2 border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-100 font-mono flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-amber-400" />
                <span>ตารางจำแนกผลการประเมิน 20 ตัวชี้วัด (Indicator Matrix)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                ประเมินรายตัวชี้วัดจากคำถามทุกประเภท (คะแนนเต็ม 2.0 ต่อตัวชี้วัด)
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">
              เกณฑ์: 1.6-2.0 (ดีเยี่ยม) | 1.2-1.5 (ดี) | &lt;1.2 (ควรส่งเสริม)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ALL_INDICATOR_KEYS
              .filter(k => selectedDomainFilter === 'ALL' || INDICATOR_DEFINITIONS[k].domain === selectedDomainFilter)
              .map(k => {
                const def = INDICATOR_DEFINITIONS[k];
                const scoreData = indicatorScores[k];
                const domainMeta = COMPETENCY_DOMAINS[def.domain];
                const percent = Math.round((scoreData.scoreOutOf2 / 2) * 100);

                let levelBadge = { text: 'ควรส่งเสริม', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' };
                if (scoreData.scoreOutOf2 >= 1.6) {
                  levelBadge = { text: 'ดีเยี่ยม (Mastery)', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
                } else if (scoreData.scoreOutOf2 >= 1.2) {
                  levelBadge = { text: 'ดี (Proficient)', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
                }

                return (
                  <div
                    key={k}
                    className="bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 p-4 rounded-2xl transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded border ${domainMeta.badgeBorder}`}>
                          {def.id} • {def.domain}
                        </span>
                        <span className="text-xs font-bold text-slate-200 truncate max-w-[200px]">
                          {def.nameTh}
                        </span>
                      </div>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${levelBadge.color}`}>
                        {levelBadge.text}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-2">
                      {def.descriptionTh}
                    </p>

                    <div className="space-y-1 pt-1">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-400">ระดับสมรรถนะ</span>
                        <span className="font-bold text-amber-400">{scoreData.scoreOutOf2} / 2.0 แต้ม ({percent}%)</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            scoreData.scoreOutOf2 >= 1.6
                              ? 'bg-emerald-400'
                              : scoreData.scoreOutOf2 >= 1.2
                              ? 'bg-amber-400'
                              : 'bg-rose-400'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

      </div>

      {/* 3. Printable Certificate / Official Score Transcript Modal */}
      {showCertificateModal && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowCertificateModal(false);
          }}
          className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
        >
          <div className="bg-white text-slate-900 border-4 border-amber-600 rounded-3xl max-w-4xl w-full p-4 sm:p-8 shadow-2xl space-y-5 relative my-4 sm:my-8 print:p-0 print:border-none print:shadow-none print:my-0">
            
            {/* Modal Controls Header (Hidden in Print) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-200 pb-3 print:hidden">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-black text-amber-800 bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-300 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-700" />
                  <span>ใบรับรองผลการเรียนรู้ (Official Certificate)</span>
                </span>
              </div>

              {/* Action Buttons: Save PDF & Exit */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="flex-1 sm:flex-none bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 cursor-pointer shadow-lg hover:scale-105 transition-all"
                  title="บันทึกไฟล์เป็น PDF หรือสั่งพิมพ์"
                >
                  <Download className="w-4 h-4 text-slate-950" />
                  <Printer className="w-4 h-4 text-slate-950" />
                  <span>บันทึกไฟล์ (PDF) / พิมพ์</span>
                </button>

                <button
                  onClick={() => setShowCertificateModal(false)}
                  className="bg-rose-500 hover:bg-rose-600 text-white font-black px-4 py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 cursor-pointer shadow transition-all"
                >
                  <span>ออก / กลับสู่หน้าดูผลคะแนน</span>
                  <span className="text-sm">✕</span>
                </button>
              </div>
            </div>

            {/* Instruction Banner for Saving PDF */}
            <div className="bg-amber-50 border border-amber-300 p-3 rounded-xl flex items-start space-x-2 text-xs text-amber-900 print:hidden">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>💡 วิธีบันทึกไฟล์ PDF ลงเครื่อง:</strong> กดปุ่ม <strong>"บันทึกไฟล์ (PDF) / พิมพ์"</strong> จากนั้นที่ช่อง <strong>Destination (เครื่องพิมพ์)</strong> ให้เลือกเป็น <strong>"Save as PDF" (บันทึกเป็น PDF)</strong> แล้วกดบันทึกเพื่อดาวน์โหลดไฟล์ลงเครื่องคอมฯ หรือมือถือเพื่อนำไปส่งครู
              </div>
            </div>

            {/* Official Certificate Layout for Student */}
            <div className="border-8 border-double border-amber-700/60 p-5 sm:p-8 rounded-2xl bg-amber-50/40 relative space-y-6 text-center">
              
              {/* Stamp & Decorative elements */}
              <div className="absolute top-4 right-4 text-xs font-mono font-bold text-amber-900/60 border border-amber-800/40 px-2 py-1 rounded">
                DOC-REF: {student.studentId}
              </div>

              {/* Certificate Header */}
              <div className="space-y-2">
                <div className="w-16 h-16 mx-auto bg-amber-600 text-amber-50 rounded-2xl flex items-center justify-center shadow-lg border-2 border-amber-700">
                  <Award className="w-9 h-9" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-amber-950 font-serif tracking-wide">
                  ใบรับรองผลการเรียนรู้และสมรรถนะนักสืบดิจิทัล
                </h2>
                <p className="text-xs sm:text-sm text-amber-900 font-medium font-serif">
                  CERTIFICATE OF CRITICAL THINKING & MEDIA LITERACY COMPETENCY
                </p>
                <div className="w-24 h-1 bg-amber-600 mx-auto rounded-full mt-2" />
              </div>

              {/* Recipient Notice */}
              <div className="space-y-2 py-2">
                <p className="text-xs text-slate-600 font-serif">ขอมอบเอกสารฉบับนี้เพื่อรับรองว่า</p>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 underline decoration-amber-600 decoration-2 underline-offset-8">
                  {student.nickname || (student.firstName ? `${student.firstName} ${student.lastName}` : 'นักสืบดิจิทัล')}
                </h3>
                <p className="text-xs text-slate-700 font-mono pt-1">
                  รหัสนักสืบประจำตัว (Student ID): <strong className="text-amber-900">{student.studentId}</strong> {student.username && <span>| บัญชีผู้ใช้: <strong>@{student.username}</strong></span>}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 max-w-xl mx-auto leading-relaxed">
                ได้ผ่านการประเมินและฝึกฝนทักษะการรู้เท่าทันสื่อ การคิดวิเคราะห์ ตรวจสอบข้อมูล และการตัดสินใจเชิงวิพากษ์ ในหลักสูตร <strong>SOURCE DETECTIVE</strong> ครบถ้วนตามมาตรฐานการประเมิน 20 ตัวชี้วัด
              </p>

              {/* 6 Parts Score Breakdown Table inside Certificate */}
              <div className="bg-white border-2 border-amber-800/30 rounded-xl p-4 text-left space-y-3">
                <h4 className="text-xs font-bold text-amber-950 font-mono uppercase border-b pb-1">
                  สรุปผลคะแนน 6 ส่วนการประเมิน (Official Score Breakdown)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
                  <div className="bg-amber-50 p-2 rounded border border-amber-200">
                    <span className="text-[10px] text-slate-600 block">1. แบบประเมินก่อนเรียน:</span>
                    <strong className="text-slate-900">{baselineScore !== null ? `${baselineScore}/40` : 'ยังไม่ทำ'}</strong>
                  </div>
                  <div className="bg-amber-50 p-2 rounded border border-amber-200">
                    <span className="text-[10px] text-slate-600 block">2. M1 ใครพูด? เชื่อได้แค่ไหน?:</span>
                    <strong className="text-slate-900">{m1Score !== null ? `${m1Score}/40` : 'ยังไม่ทำ'}</strong>
                  </div>
                  <div className="bg-amber-50 p-2 rounded border border-amber-200">
                    <span className="text-[10px] text-slate-600 block">3. M2 หลักฐานบอกอะไร?:</span>
                    <strong className="text-slate-900">{m2Score !== null ? `${m2Score}/40` : 'ยังไม่ทำ'}</strong>
                  </div>
                  <div className="bg-amber-50 p-2 rounded border border-amber-200">
                    <span className="text-[10px] text-slate-600 block">4. M3 เปรียบเทียบ & ตัดสินใจ:</span>
                    <strong className="text-slate-900">{m3Score !== null ? `${m3Score}/40` : 'ยังไม่ทำ'}</strong>
                  </div>
                  <div className="bg-amber-50 p-2 rounded border border-amber-200">
                    <span className="text-[10px] text-slate-600 block">5. M4 ก่อนแชร์ ต้องชัวร์!:</span>
                    <strong className="text-slate-900">{m4Score !== null ? `${m4Score}/40` : 'ยังไม่ทำ'}</strong>
                  </div>
                  <div className="bg-amber-50 p-2 rounded border border-amber-200">
                    <span className="text-[10px] text-slate-600 block">6. แบบประเมินหลังเรียน:</span>
                    <strong className="text-slate-900">{postTestScore !== null ? `${postTestScore}/40` : 'ยังไม่ทำ'}</strong>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between border-t border-amber-200 pt-2 text-xs font-mono font-bold text-amber-950">
                  <span>คะแนนสะสมรวมทั้งหมด: <strong>{currentEarnedPoints} / 240 แต้ม ({overallPercentage}%)</strong></span>
                  <span>ยศนักสืบ: <strong>{rankInfo.title}</strong></span>
                </div>
              </div>

              {/* 5 Domains Summary Pill Row */}
              <div className="grid grid-cols-5 gap-2 text-center text-[10px] font-mono">
                {(Object.keys(domainScores) as CompetencyDomain[]).map(d => (
                  <div key={d} className="bg-amber-100/70 border border-amber-300 p-1.5 rounded-lg">
                    <span className="font-bold text-amber-950 block">{d}</span>
                    <span className="text-slate-800 font-extrabold">{domainScores[d].avgOutOf2}/2.0</span>
                  </div>
                ))}
              </div>

              {/* Signatures & Official Date */}
              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-amber-800/30 text-xs font-serif">
                <div className="space-y-1">
                  <div className="w-36 border-b border-slate-900 mx-auto h-8" />
                  <p className="font-bold text-slate-900">({student.firstName} {student.lastName})</p>
                  <p className="text-[10px] text-slate-600">นักเรียนผู้เข้ารับการประเมิน</p>
                </div>
                <div className="space-y-1">
                  <div className="w-36 border-b border-slate-900 mx-auto h-8" />
                  <p className="font-bold text-slate-900">(ครูผู้สอน / ผู้ประเมินผล)</p>
                  <p className="text-[10px] text-slate-600">ตำแหน่ง ครูผู้รับผิดชอบหลักสูตร</p>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 font-mono pt-2">
                ออกให้ ณ วันที่ {new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })} • SOURCE DETECTIVE ACADEMY
              </div>

            </div>

            {/* Bottom Actions for student convenience (Hidden in Print) */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200 print:hidden">
              <button
                onClick={() => setShowCertificateModal(false)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold px-5 py-3 rounded-2xl text-xs flex items-center space-x-2 cursor-pointer shadow transition-all"
              >
                <span>🚪 ออก / กลับสู่หน้าดูผลคะแนน</span>
              </button>

              <button
                onClick={handlePrint}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-6 py-3 rounded-2xl text-xs flex items-center space-x-2 cursor-pointer shadow-xl hover:scale-105 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>บันทึกไฟล์ (PDF) ดาวน์โหลดลงเครื่อง</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
