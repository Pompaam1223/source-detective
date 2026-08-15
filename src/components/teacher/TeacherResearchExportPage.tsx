import React, { useState } from 'react';
import { StorageService } from '../../engine/StorageService';
import { GoogleSheetsSyncCard } from '../GoogleSheetsSyncCard';
import {
  DownloadCloud,
  FileSpreadsheet,
  FileCode,
  ShieldCheck,
  CheckCircle2,
  Database,
  Lock,
  Share2,
  Info
} from 'lucide-react';
import { PushPin } from '../decorations/DetectiveDecorations';

export const TeacherResearchExportPage: React.FC = () => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const students = StorageService.getAllStudents();
  const progresses = StorageService.getAllStudentProgresses();
  const assessments = StorageService.getAllStudentAssessments();
  const evidences = StorageService.getAllStudentEvidences();
  const aiLogs = StorageService.getAllStudentAILogs();
  const missionResults = StorageService.getAllStudentMissionResults();
  const attempts = StorageService.getAllStudentAttempts();

  // Generate Anonymized Research Dataset (Privacy by Design - ZERO PII)
  const generateAnonymizedDataset = () => {
    return students.map(std => {
      const p = progresses[std.studentId] || StorageService.getProgress(std.studentId);
      const stdAssessments = assessments.filter(a => a.studentId === std.studentId);
      const stdMissions = missionResults.filter(m => m.studentId === std.studentId);
      const stdEvidences = evidences.filter(e => e.studentId === std.studentId);
      const stdAILogs = aiLogs.filter(a => a.studentId === std.studentId);
      const stdAttempts = attempts.filter(at => at.studentId === std.studentId);

      const baseline = stdAssessments.find(a => a.type === 'BASELINE');
      const postTest = stdAssessments.find(a => a.type === 'POST_TEST');

      return {
        // Anonymized Unique Identifier (No Real Name, Surname, or Personal Contacts)
        anonymizedStudentId: std.studentId,
        avatarAlias: std.nickname || 'Detective',
        registrationDate: std.registeredAt,
        
        // Learning Progress & Gamification
        totalGamePoints: p?.totalPoints || 0,
        completedMissionsCount: p?.completedMissionIds?.length || 0,
        completedMissionsList: p?.completedMissionIds || [],
        
        // Standardized Assessment Scores (Pre / Post)
        baselineScore: baseline?.score ?? null,
        baselineMaxScore: baseline?.maxScore ?? 40,
        postTestScore: postTest?.score ?? null,
        postTestMaxScore: postTest?.maxScore ?? 40,
        learningGain: (postTest && baseline) ? (postTest.score - baseline.score) : null,
        
        // Mission Performance Breakdown
        missionScores: stdMissions.map(m => ({
          missionId: m.missionId,
          score: m.score,
          maxScore: m.maxScore
        })),

        // Evidence Collection Analytics
        evidencesCollectedCount: stdEvidences.length,
        evidenceTypesDistribution: stdEvidences.reduce((acc: Record<string, number>, ev) => {
          acc[ev.type] = (acc[ev.type] || 0) + 1;
          return acc;
        }, {}),

        // AI Helper Usage Metrics
        aiAssistanceQueriesCount: stdAILogs.length,

        // Attempts Analytics
        totalQuestionAttemptsCount: stdAttempts.length
      };
    });
  };

  // Export JSON
  const handleExportJSON = () => {
    const dataset = generateAnonymizedDataset();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(dataset, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `source_detective_research_dataset_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setDownloadSuccess('ส่งออกชุดข้อมูลวิจัยนิรนาม (JSON) สำเร็จเรียบร้อย');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  // Export CSV
  const handleExportCSV = () => {
    const dataset = generateAnonymizedDataset();
    if (dataset.length === 0) {
      alert('ยังไม่มีข้อมูลนักเรียนสำหรับการส่งออก');
      return;
    }

    const headers = [
      'Student_ID',
      'Alias',
      'Registered_At',
      'Total_Points',
      'Missions_Completed',
      'PreTest_Score',
      'PostTest_Score',
      'Learning_Gain',
      'Evidences_Count',
      'AI_Queries_Count',
      'Attempts_Count'
    ];

    const rows = dataset.map(d => [
      d.anonymizedStudentId,
      `"${d.avatarAlias}"`,
      d.registrationDate,
      d.totalGamePoints,
      d.completedMissionsCount,
      d.baselineScore ?? '',
      d.postTestScore ?? '',
      d.learningGain ?? '',
      d.evidencesCollectedCount,
      d.aiAssistanceQueriesCount,
      d.totalQuestionAttemptsCount
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [
      headers.join(','),
      ...rows.map(e => e.join(','))
    ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `source_detective_research_summary_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    setDownloadSuccess('ส่งออกชุดข้อมูลสรุปสถิติ (CSV) สำเร็จเรียบร้อย');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-2 relative overflow-hidden">
        <PushPin color="yellow" className="absolute -top-3 left-8" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full border border-amber-500/30">
                PAGE 07 — RESEARCH EXPORT & DATA PIPELINE
              </span>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Zero-PII Export Guarantee</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 uppercase tracking-tight font-mono mt-1">
              การส่งออกข้อมูลเพื่องานวิจัย (RESEARCH DATA EXPORT)
            </h2>
            <p className="text-xs text-slate-400">
              ดาวน์โหลดชุดข้อมูลนิรนามตามหลักการ Privacy by Design เพื่อนำไปวิเคราะห์ทางสถิติและพัฒนาการเรียนรู้
            </p>
          </div>
        </div>

        {/* Privacy by Design Info */}
        <div className="mt-3 p-3 bg-slate-950/60 border border-slate-800 rounded-2xl flex items-start gap-2.5 text-xs text-slate-300">
          <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-slate-200">นโยบายความเป็นส่วนตัวของข้อมูลวิจัย:</span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              ไฟล์ที่ส่งออกจะไม่มีชื่อจริง นามสกุล Username หรือรหัสผ่านของนักเรียน ข้อมูลจะเชื่อมโยงด้วย Student ID (SD-XXXXX) เพื่อความปลอดภัยตามมาตรฐานจริยธรรมการวิจัย
            </p>
          </div>
        </div>
      </div>

      {/* Export Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Option 1: JSON Export */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 flex flex-col justify-between hover:border-amber-500/40 transition-colors shadow-lg">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <FileCode className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-slate-100 font-mono">
              ANONYMIZED DATASET (JSON)
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              ชุดข้อมูลวิจัยแบบละเอียด มีโครงสร้างลำดับชั้นสมบูรณ์ (Nested Objects) ประกอบด้วยประวัติคะแนนแยกรายข้อ, หมวดหมู่หลักฐาน, และบันทึก AI Logs ครบถ้วน
            </p>
          </div>

          <button
            onClick={handleExportJSON}
            className="w-full btn-game-orange text-slate-950 font-black py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-transform hover:scale-[1.02] cursor-pointer"
          >
            <DownloadCloud className="w-4 h-4" />
            <span>ดาวน์โหลดไฟล์ JSON ({students.length} รายการ)</span>
          </button>
        </div>

        {/* Option 2: CSV Export */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 flex flex-col justify-between hover:border-emerald-500/40 transition-colors shadow-lg">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-slate-100 font-mono">
              STATISTICAL SUMMARY (CSV)
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              ตารางสรุปสถิติคะแนนรูปแบบ Tabular เหมาะสำหรับนำเข้าโปรแกรมวิเคราะห์ข้อมูล เช่น Excel, SPSS, R, หรือ Google Sheets เพื่อคำนวณค่าเฉลี่ยและ Gain Score
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-transform hover:scale-[1.02] cursor-pointer"
          >
            <DownloadCloud className="w-4 h-4" />
            <span>ดาวน์โหลดตาราง CSV ({students.length} แถว)</span>
          </button>
        </div>

      </div>

      {downloadSuccess && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Google Sheets Sync Card Integration */}
      <div className="pt-2">
        <GoogleSheetsSyncCard />
      </div>

    </div>
  );
};
