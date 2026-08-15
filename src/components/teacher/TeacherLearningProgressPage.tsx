import React, { useState } from 'react';
import { StorageService } from '../../engine/StorageService';
import { Student, StudentProgress } from '../../types';
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  Search,
  Check,
  Award,
  Circle,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { PushPin } from '../decorations/DetectiveDecorations';

interface TeacherLearningProgressPageProps {
  onRefresh?: () => void;
}

export const TeacherLearningProgressPage: React.FC<TeacherLearningProgressPageProps> = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const students = StorageService.getAllStudents();
  const progresses = StorageService.getAllStudentProgresses();
  const missionResults = StorageService.getAllStudentMissionResults();

  const totalStudents = students.length;

  // Filter students
  const filteredStudents = students.filter(std => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return std.studentId.toLowerCase().includes(q) || (std.nickname || '').toLowerCase().includes(q);
  });

  const getMissionScore = (studentId: string, missionId: string) => {
    const res = missionResults.find(m => m.studentId === studentId && m.missionId === missionId);
    return res ? `${res.score}/${res.maxScore}` : null;
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-2 relative overflow-hidden">
        <PushPin color="blue" className="absolute -top-3 left-8" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono font-bold bg-sky-500/20 text-sky-300 px-3 py-1 rounded-full border border-sky-500/30">
                PAGE 03 — LEARNING PROGRESS TRACKER
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                ลำดับ 6 ขั้นตอนตามหลักสูตร
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 uppercase tracking-tight font-mono mt-1">
              ความก้าวหน้าการเรียนรู้ตามลำดับภารกิจ
            </h2>
            <p className="text-xs text-slate-400">
              ติดตามเส้นทางการสืบสวนตามลำดับ: Baseline → Mission 1 → Mission 2 → Mission 3 → Mission 4 → Post-test
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative min-w-[240px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาด้วย ID, ชื่อเล่น..."
              className="w-full bg-slate-950 border border-slate-700 focus:border-sky-500 rounded-xl px-3.5 py-2 pl-9 text-xs text-slate-100 focus:outline-none transition-colors"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* Progress Milestone Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { key: 'baseline', title: '1. Baseline', subtitle: 'แบบประเมินก่อนเรียน', icon: '📝' },
          { key: 'm1', title: '2. Mission 1', subtitle: 'ข่าวลือปิดโรงเรียน', icon: '🕵️' },
          { key: 'm2', title: '3. Mission 2', subtitle: 'น้ำวิเศษปราบมะเร็ง', icon: '🧪' },
          { key: 'm3', title: '4. Mission 3', subtitle: 'คลิปตัดต่อแฉอาจารย์', icon: '🎬' },
          { key: 'm4', title: '5. Mission 4', subtitle: 'ภารกิจตัดสินความจริง', icon: '⚖️' },
          { key: 'posttest', title: '6. Post-test', subtitle: 'แบบประเมินหลังเรียน', icon: '🏆' },
        ].map((milestone) => {
          let count = 0;
          if (milestone.key === 'baseline') {
            count = Object.values(progresses).filter(p => p.baselineStatus === 'COMPLETED').length;
          } else if (milestone.key === 'posttest') {
            count = Object.values(progresses).filter(p => p.postTestStatus === 'COMPLETED').length;
          } else {
            count = missionResults.filter(m => m.missionId === milestone.key).length;
          }

          const pct = totalStudents > 0 ? Math.round((count / totalStudents) * 100) : 0;

          return (
            <div key={milestone.key} className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl space-y-1.5 text-center">
              <div className="text-xl">{milestone.icon}</div>
              <div className="text-xs font-black text-slate-200 font-mono">{milestone.title}</div>
              <div className="text-[10px] text-slate-400 truncate">{milestone.subtitle}</div>
              <div className="pt-1">
                <span className="text-sm font-black text-sky-400 font-mono">
                  {totalStudents > 0 ? `${count}/${totalStudents}` : '0'}
                </span>
                <span className="text-[10px] text-slate-500 font-mono ml-1">({pct}%)</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Matrix Table */}
      {filteredStudents.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 p-12 rounded-3xl text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-500 mx-auto flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-300">ยังไม่มีข้อมูลความก้าวหน้า</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery ? 'ไม่พบนักเรียนที่ตรงกับคำค้นหา' : 'เมื่อนักเรียนเริ่มทำภารกิจ ตารางความก้าวหน้าจะบันทึกสถานะเรียลไทม์'}
          </p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-3 text-center">1. Baseline</th>
                  <th className="py-3.5 px-3 text-center">2. Mission 1</th>
                  <th className="py-3.5 px-3 text-center">3. Mission 2</th>
                  <th className="py-3.5 px-3 text-center">4. Mission 3</th>
                  <th className="py-3.5 px-3 text-center">5. Mission 4</th>
                  <th className="py-3.5 px-3 text-center">6. Post-test</th>
                  <th className="py-3.5 px-4 text-right">แต้มรวม (Points)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs font-mono">
                {filteredStudents.map((std) => {
                  const p = progresses[std.studentId] || StorageService.getProgress(std.studentId);
                  const m1Score = getMissionScore(std.studentId, 'm1');
                  const m2Score = getMissionScore(std.studentId, 'm2');
                  const m3Score = getMissionScore(std.studentId, 'm3');
                  const m4Score = getMissionScore(std.studentId, 'm4');

                  return (
                    <tr key={std.studentId} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-100 font-sans">{std.nickname || 'นักสืบ'}</div>
                        <div className="text-[10px] text-amber-400">{std.studentId}</div>
                      </td>

                      {/* 1. Baseline */}
                      <td className="py-3.5 px-3 text-center">
                        {p?.baselineStatus === 'COMPLETED' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                            <Check className="w-3 h-3" />
                            <span>เสร็จสิ้น ({p.baselineScore ?? 0}p)</span>
                          </span>
                        ) : (
                          <span className="text-slate-600 text-[11px]">ยังไม่ทำ</span>
                        )}
                      </td>

                      {/* 2. M1 */}
                      <td className="py-3.5 px-3 text-center">
                        {p?.completedMissionIds?.includes('m1') ? (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded-full border border-orange-500/30">
                            <Check className="w-3 h-3" />
                            <span>{m1Score || 'สำเร็จ'}</span>
                          </span>
                        ) : (
                          <span className="text-slate-600 text-[11px]">ยังไม่เริ่ม</span>
                        )}
                      </td>

                      {/* 3. M2 */}
                      <td className="py-3.5 px-3 text-center">
                        {p?.completedMissionIds?.includes('m2') ? (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                            <Check className="w-3 h-3" />
                            <span>{m2Score || 'สำเร็จ'}</span>
                          </span>
                        ) : (
                          <span className="text-slate-600 text-[11px]">ยังไม่เริ่ม</span>
                        )}
                      </td>

                      {/* 4. M3 */}
                      <td className="py-3.5 px-3 text-center">
                        {p?.completedMissionIds?.includes('m3') ? (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full border border-sky-500/30">
                            <Check className="w-3 h-3" />
                            <span>{m3Score || 'สำเร็จ'}</span>
                          </span>
                        ) : (
                          <span className="text-slate-600 text-[11px]">ยังไม่เริ่ม</span>
                        )}
                      </td>

                      {/* 5. M4 */}
                      <td className="py-3.5 px-3 text-center">
                        {p?.completedMissionIds?.includes('m4') ? (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">
                            <Check className="w-3 h-3" />
                            <span>{m4Score || 'สำเร็จ'}</span>
                          </span>
                        ) : (
                          <span className="text-slate-600 text-[11px]">ยังไม่เริ่ม</span>
                        )}
                      </td>

                      {/* 6. Post-test */}
                      <td className="py-3.5 px-3 text-center">
                        {p?.postTestStatus === 'COMPLETED' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30 font-bold">
                            <Check className="w-3 h-3" />
                            <span>เสร็จสิ้น ({p.postTestScore ?? 0}p)</span>
                          </span>
                        ) : (
                          <span className="text-slate-600 text-[11px]">ยังไม่ทำ</span>
                        )}
                      </td>

                      {/* Total Points */}
                      <td className="py-3.5 px-4 text-right">
                        <span className="text-amber-400 font-bold text-sm">
                          {p?.totalPoints || 0}
                        </span>
                        <span className="text-slate-500 text-[10px]"> / {p?.maxPossiblePoints || 200}</span>
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
