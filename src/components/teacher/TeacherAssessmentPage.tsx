import React, { useState } from 'react';
import { StorageService } from '../../engine/StorageService';
import { AssessmentResult, CompetencyDomain, IndicatorId } from '../../types';
import { COMPETENCY_DOMAINS, INDICATOR_DEFINITIONS } from '../../data/indicators';
import {
  FileCheck2,
  TrendingUp,
  Brain,
  SearchCheck,
  Wrench,
  MessageSquareText,
  Search,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { PushPin } from '../decorations/DetectiveDecorations';

export const TeacherAssessmentPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<CompetencyDomain | 'ALL'>('ALL');

  const students = StorageService.getAllStudents();
  const assessments = StorageService.getAllStudentAssessments();

  const baselineAssessments = assessments.filter(a => a.type === 'BASELINE');
  const postTestAssessments = assessments.filter(a => a.type === 'POST_TEST');

  const filteredStudents = students.filter(std => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return std.studentId.toLowerCase().includes(q) || (std.nickname || '').toLowerCase().includes(q);
  });

  const domainList: CompetencyDomain[] = ['THINK', 'CHECK', 'SOLVE', 'EXPLAIN', 'GROW'];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-2 relative overflow-hidden">
        <PushPin color="green" className="absolute -top-3 left-8" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">
                PAGE 04 — STANDARDIZED ASSESSMENT ENGINE
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                5 สมรรถนะ • 20 ตัวชี้วัดมาตรฐาน (คะแนนเต็ม 40)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 uppercase tracking-tight font-mono mt-1">
              ผลการประเมิน & วิเคราะห์ LEARNING GAIN
            </h2>
            <p className="text-xs text-slate-400">
              วิเคราะห์เปรียบเทียบคะแนนก่อนเรียน (Baseline / Pre-test) และหลังเรียน (Post-test) ตามสมรรถนะการรู้เท่าทันสื่อและสารสนเทศ
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative min-w-[240px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาด้วย ID, ชื่อเล่น..."
              className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2 pl-9 text-xs text-slate-100 focus:outline-none transition-colors"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* 5 Competency Domains Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {domainList.map((domainKey) => {
          const meta = COMPETENCY_DOMAINS[domainKey];
          return (
            <button
              key={domainKey}
              onClick={() => setSelectedDomain(selectedDomain === domainKey ? 'ALL' : domainKey)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                selectedDomain === domainKey
                  ? 'bg-slate-800 border-amber-400 ring-2 ring-amber-400/30'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-mono font-bold text-amber-400">{domainKey}</span>
                <span className="text-[10px] text-slate-500 font-mono">4 ตัวชี้วัด</span>
              </div>
              <div className="text-xs font-bold text-slate-200 truncate">{meta.titleTh.split(' - ')[1] || meta.titleTh}</div>
              <p className="text-[10px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                {meta.subtitleTh}
              </p>
            </button>
          );
        })}
      </div>

      {/* Assessment Table & Learning Gain Matrix */}
      {filteredStudents.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 p-12 rounded-3xl text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-500 mx-auto flex items-center justify-center">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-300">ยังไม่มีข้อมูลผลการประเมิน</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery ? 'ไม่พบนักเรียนที่ตรงกับคำค้นหา' : 'เมื่อนักเรียนทำแบบประเมิน Baseline หรือ Post-test ระบบจะประมวลผลคะแนน 20 ตัวชี้วัดที่นี่'}
          </p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-3 text-center">Pre-test (Baseline)</th>
                  <th className="py-3.5 px-3 text-center">Post-test</th>
                  <th className="py-3.5 px-3 text-center">Learning Gain (Δ)</th>
                  <th className="py-3.5 px-3 text-center">Normalized Gain (g)</th>
                  <th className="py-3.5 px-4 text-center">สถานะการประเมิน</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs font-mono">
                {filteredStudents.map((std) => {
                  const pre = baselineAssessments.find(a => a.studentId === std.studentId);
                  const post = postTestAssessments.find(a => a.studentId === std.studentId);

                  const preScore = pre ? pre.score : null;
                  const postScore = post ? post.score : null;

                  let gain: number | null = null;
                  let normalizedGain: string | null = null;

                  if (preScore !== null && postScore !== null) {
                    gain = postScore - preScore;
                    const maxScore = pre?.maxScore || 40;
                    if (maxScore - preScore > 0) {
                      normalizedGain = ((postScore - preScore) / (maxScore - preScore)).toFixed(2);
                    }
                  }

                  return (
                    <tr key={std.studentId} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-100 font-sans">{std.nickname || 'นักสืบ'}</div>
                        <div className="text-[10px] text-amber-400">{std.studentId}</div>
                      </td>

                      {/* Pre-test */}
                      <td className="py-3.5 px-3 text-center">
                        {preScore !== null ? (
                          <span className="font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                            {preScore} / {pre?.maxScore || 40}
                          </span>
                        ) : (
                          <span className="text-slate-600 text-[11px]">ยังไม่ทำ</span>
                        )}
                      </td>

                      {/* Post-test */}
                      <td className="py-3.5 px-3 text-center">
                        {postScore !== null ? (
                          <span className="font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                            {postScore} / {post?.maxScore || 40}
                          </span>
                        ) : (
                          <span className="text-slate-600 text-[11px]">ยังไม่ทำ</span>
                        )}
                      </td>

                      {/* Learning Gain */}
                      <td className="py-3.5 px-3 text-center">
                        {gain !== null ? (
                          <span className={`font-bold ${gain >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {gain >= 0 ? `+${gain}` : gain} แต้ม
                          </span>
                        ) : (
                          <span className="text-slate-600 text-[11px]">-</span>
                        )}
                      </td>

                      {/* Normalized Gain */}
                      <td className="py-3.5 px-3 text-center">
                        {normalizedGain !== null ? (
                          <span className="font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                            g = {normalizedGain}
                          </span>
                        ) : (
                          <span className="text-slate-600 text-[11px]">-</span>
                        )}
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4 text-center">
                        {preScore !== null && postScore !== null ? (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                            สมบูรณ์ทั้ง Pre & Post
                          </span>
                        ) : preScore !== null ? (
                          <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                            เสร็จเฉพาะ Pre-test
                          </span>
                        ) : (
                          <span className="text-[10px] bg-slate-800 text-slate-400 px-2.5 py-0.5 rounded-full">
                            ยังไม่เริ่มประเมิน
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
