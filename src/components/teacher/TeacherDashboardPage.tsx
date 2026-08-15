import React from 'react';
import { StorageService } from '../../engine/StorageService';
import { TeacherPageId } from './TeacherNavigation';
import {
  Users,
  TrendingUp,
  FileCheck2,
  FolderArchive,
  Bot,
  Award,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Clock,
  Sparkles,
  Layers
} from 'lucide-react';
import { DetectiveTeacherInspector } from '../characters/DetectiveCharacters';
import { PushPin } from '../decorations/DetectiveDecorations';

interface TeacherDashboardPageProps {
  onNavigatePage: (page: TeacherPageId) => void;
}

export const TeacherDashboardPage: React.FC<TeacherDashboardPageProps> = ({ onNavigatePage }) => {
  const students = StorageService.getAllStudents();
  const accounts = StorageService.getAllAccounts();
  const progresses = StorageService.getAllStudentProgresses();
  const evidences = StorageService.getAllStudentEvidences();
  const aiLogs = StorageService.getAllStudentAILogs();
  const assessments = StorageService.getAllStudentAssessments();
  const missionResults = StorageService.getAllStudentMissionResults();

  const totalStudents = students.length;
  const activeAccounts = accounts.filter(a => a.accountStatus === 'ACTIVE').length;

  // Learning Progress Stats
  const baselineCompletedCount = Object.values(progresses).filter(p => p.baselineStatus === 'COMPLETED').length;
  const postTestCompletedCount = Object.values(progresses).filter(p => p.postTestStatus === 'COMPLETED').length;
  const mission1CompletedCount = missionResults.filter(m => m.missionId === 'm1').length;
  const mission2CompletedCount = missionResults.filter(m => m.missionId === 'm2').length;
  const mission3CompletedCount = missionResults.filter(m => m.missionId === 'm3').length;
  const mission4CompletedCount = missionResults.filter(m => m.missionId === 'm4').length;

  // Assessment Stats (Distinct from Progress!)
  const baselineAssessments = assessments.filter(a => a.type === 'BASELINE');
  const postTestAssessments = assessments.filter(a => a.type === 'POST_TEST');
  const avgBaselineScore = baselineAssessments.length > 0
    ? (baselineAssessments.reduce((acc, a) => acc + (a.score || 0), 0) / baselineAssessments.length).toFixed(1)
    : null;
  const avgPostTestScore = postTestAssessments.length > 0
    ? (postTestAssessments.reduce((acc, a) => acc + (a.score || 0), 0) / postTestAssessments.length).toFixed(1)
    : null;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="relative bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border-2 border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-xl overflow-hidden">
        <PushPin color="yellow" className="absolute -top-3 left-8" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full border border-amber-500/30">
                PAGE 01 — CLASSROOM OVERVIEW
              </span>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Verified Source of Truth</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-100 uppercase tracking-tight font-mono">
              TEACHER DASHBOARD
            </h2>
            <p className="text-sm text-amber-200/90 leading-relaxed font-sans">
              ศูนย์สรุปภาพรวมการเรียนรู้ของนักสืบเยาวชน ประมวลผลจากข้อมูลจริงในระบบ (Real-Time Existing Records)
              แยกสถิติความก้าวหน้า (Progress) ออกจากคะแนนแบบประเมิน (Assessment) อย่างชัดเจน
            </p>
          </div>

          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <DetectiveTeacherInspector size={130} />
          </div>
        </div>
      </div>

      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Students */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-3 relative overflow-hidden group hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">จำนวนนักเรียนที่ลงทะเบียน</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-slate-100 font-mono">
              {totalStudents > 0 ? totalStudents : '0'}
            </span>
            <span className="text-xs text-slate-400 font-medium">บัญชี ({activeAccounts} ใช้งานปกติ)</span>
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">ระบบ Student ID (SD-XXXXX)</span>
            <button
              onClick={() => onNavigatePage('PAGE_02_STUDENTS')}
              className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>จัดการ</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Metric 2: Learning Progress */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-3 relative overflow-hidden group hover:border-sky-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">สถานะความก้าวหน้า (Progress)</span>
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-slate-100 font-mono">
              {totalStudents > 0 ? `${postTestCompletedCount}/${totalStudents}` : '0'}
            </span>
            <span className="text-xs text-slate-400 font-medium">จบครบกระบวนการ</span>
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Baseline เสร็จแล้ว: {baselineCompletedCount} คน</span>
            <button
              onClick={() => onNavigatePage('PAGE_03_PROGRESS')}
              className="text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>ดูลำดับ</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Metric 3: Evidences */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-3 relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">หลักฐานที่บันทึก (Evidence)</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <FolderArchive className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-slate-100 font-mono">
              {evidences.length > 0 ? evidences.length : '0'}
            </span>
            <span className="text-xs text-slate-400 font-medium">ชิ้นหลักฐานเชิงประจักษ์</span>
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">10 หมวดหมู่หลักฐาน</span>
            <button
              onClick={() => onNavigatePage('PAGE_05_EVIDENCE')}
              className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>คลังหลักฐาน</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Metric 4: AI Usage */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-3 relative overflow-hidden group hover:border-purple-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">การใช้งาน AI Helper</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-slate-100 font-mono">
              {aiLogs.length > 0 ? aiLogs.length : '0'}
            </span>
            <span className="text-xs text-slate-400 font-medium">ครั้งที่ขอคำปรึกษา</span>
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">ตรวจสอบกระบวนการคิด</span>
            <button
              onClick={() => onNavigatePage('PAGE_06_AI_USAGE')}
              className="text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>ดูประวัติ</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>

      {/* Two Column Layout: Learning Progress Sequence & Assessment Score Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Card: 6-Step Learning Sequence Progress */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-sky-400" />
              <h3 className="text-base font-bold text-slate-100 font-mono">
                ลำดับความก้าวหน้าในชั้นเรียน (LEARNING PROGRESS)
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              {totalStudents > 0 ? `ผู้เรียนทั้งหมด ${totalStudents} คน` : 'ยังไม่มีผู้เรียน'}
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {[
              { label: 'Baseline (Pre-test)', count: baselineCompletedCount, color: 'bg-amber-500' },
              { label: 'Mission 1: คดีข่าวลือปิดโรงเรียน', count: mission1CompletedCount, color: 'bg-orange-500' },
              { label: 'Mission 2: คดีน้ำวิเศษปราบมะเร็ง', count: mission2CompletedCount, color: 'bg-emerald-500' },
              { label: 'Mission 3: คดีคลิปตัดต่อแฉอาจารย์', count: mission3CompletedCount, color: 'bg-sky-500' },
              { label: 'Mission 4: ภารกิจตัดสินความจริง', count: mission4CompletedCount, color: 'bg-indigo-500' },
              { label: 'Post-test (แบบประเมินหลังเรียน)', count: postTestCompletedCount, color: 'bg-purple-500' },
            ].map((step, idx) => {
              const pct = totalStudents > 0 ? Math.round((step.count / totalStudents) * 100) : 0;
              return (
                <div key={idx} className="space-y-1 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-200">{step.label}</span>
                    <span className="font-mono text-slate-400">
                      {totalStudents > 0 ? `${step.count}/${totalStudents} คน (${pct}%)` : 'ยังไม่มีข้อมูล'}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${step.color} transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 text-right">
            <button
              onClick={() => onNavigatePage('PAGE_03_PROGRESS')}
              className="text-xs text-sky-400 hover:text-sky-300 font-bold inline-flex items-center gap-1 cursor-pointer"
            >
              <span>เปิดดูความก้าวหน้ารายบุคคล (PAGE 03)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Card: Assessment & Learning Gain Summary */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <FileCheck2 className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-slate-100 font-mono">
                คะแนนการประเมิน & LEARNING GAIN (ASSESSMENT)
              </h3>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              คะแนนเต็ม 40
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-amber-400">คะแนนเฉลี่ย Pre-test (Baseline)</span>
              <div className="text-2xl font-black text-slate-100 font-mono">
                {avgBaselineScore !== null ? `${avgBaselineScore} / 40` : 'ยังไม่มีข้อมูล'}
              </div>
              <p className="text-[11px] text-slate-400">
                {baselineAssessments.length > 0 ? `จากนักเรียน ${baselineAssessments.length} คน` : 'รอการทำแบบทดสอบ'}
              </p>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-purple-400">คะแนนเฉลี่ย Post-test</span>
              <div className="text-2xl font-black text-slate-100 font-mono">
                {avgPostTestScore !== null ? `${avgPostTestScore} / 40` : 'ยังไม่มีข้อมูล'}
              </div>
              <p className="text-[11px] text-slate-400">
                {postTestAssessments.length > 0 ? `จากนักเรียน ${postTestAssessments.length} คน` : 'รอการทำแบบทดสอบ'}
              </p>
            </div>
          </div>

          <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">ความก้าวหน้าเฉลี่ย (Average Learning Gain)</span>
              {avgBaselineScore !== null && avgPostTestScore !== null ? (
                <span className="text-xs font-mono font-bold text-emerald-400">
                  +{(Number(avgPostTestScore) - Number(avgBaselineScore)).toFixed(1)} แต้ม
                </span>
              ) : (
                <span className="text-xs text-slate-500 font-mono">ยังไม่มีข้อมูลเปรียบเทียบ</span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              *การประเมินยึดตามสมรรถนะ 5 ด้าน (THINK, CHECK, SOLVE, EXPLAIN, GROW) รวม 20 ตัวชี้วัดมาตรฐาน
            </p>
          </div>

          <div className="pt-2 text-right">
            <button
              onClick={() => onNavigatePage('PAGE_04_ASSESSMENT')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-bold inline-flex items-center gap-1 cursor-pointer"
            >
              <span>เปิดดูผลการประเมิน 20 ตัวชี้วัด (PAGE 04)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
