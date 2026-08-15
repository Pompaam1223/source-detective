import React, { useState } from 'react';
import { StorageService } from '../../engine/StorageService';
import { Evidence, EvidenceType } from '../../types';
import {
  FolderArchive,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  User,
  Sparkles,
  Layers,
  ShieldCheck
} from 'lucide-react';
import { PushPin } from '../decorations/DetectiveDecorations';

const EVIDENCE_TYPES: { type: EvidenceType; label: string }[] = [
  { type: 'SOURCE', label: 'แหล่งที่มา (Source)' },
  { type: 'AUTHOR', label: 'ผู้ส่งสาร / ผู้เขียน (Author)' },
  { type: 'DATE', label: 'วันเวลา / ความสดใหม่ (Date)' },
  { type: 'CLAIM', label: 'ข้ออ้าง / ประเด็นหลัก (Claim)' },
  { type: 'COMPARISON', label: 'การเปรียบเทียบแหล่งข่าว (Comparison)' },
  { type: 'REASON', label: 'เหตุผลสนับสนุน (Reason)' },
  { type: 'DECISION', label: 'การตัดสินใจ / ข้อสรุป (Decision)' },
  { type: 'REVISION', label: 'การปรับเปลี่ยนมุมมอง (Revision)' },
  { type: 'PROCESS', label: 'กระบวนการคิด (Process)' },
  { type: 'STUDENT_VOICE', label: 'เสียงสะท้อนนักเรียน (Student Voice)' },
];

export const TeacherEvidencePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMission, setSelectedMission] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  const allEvidences = StorageService.getAllStudentEvidences();
  const students = StorageService.getAllStudents();

  // Filter Evidences
  const filteredEvidences = allEvidences.filter(ev => {
    const q = searchQuery.trim().toLowerCase();
    const matchSearch =
      !q ||
      ev.studentId.toLowerCase().includes(q) ||
      ev.title.toLowerCase().includes(q) ||
      ev.content.toLowerCase().includes(q) ||
      (ev.sourceTag && ev.sourceTag.toLowerCase().includes(q));

    const matchMission = selectedMission === 'ALL' || ev.missionId === selectedMission;
    const matchType = selectedType === 'ALL' || ev.type === selectedType;

    return matchSearch && matchMission && matchType;
  });

  const getStudentNickname = (studentId: string) => {
    const std = students.find(s => s.studentId === studentId);
    return std ? (std.nickname || std.firstName || 'นักสืบ') : studentId;
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
                PAGE 05 — EVIDENCE ARCHIVE
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                รวมหลักฐานเชิงประจักษ์: {allEvidences.length} รายการ
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 uppercase tracking-tight font-mono mt-1">
              คลังหลักฐานเชิงประจักษ์ (EVIDENCE LEDGER)
            </h2>
            <p className="text-xs text-slate-400">
              ตรวจสอบหลักฐานที่นักเรียนรวบรวมได้จากแหล่งข้อมูลจริง เชื่อมโยงกับ Student ID, ภารกิจ, หมวดหมู่หลักฐาน และตัวชี้วัด
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative min-w-[240px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาตามชื่อหลักฐาน, ข้อความ, ID..."
              className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2 pl-9 text-xs text-slate-100 focus:outline-none transition-colors"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-800/80">
          <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400 mr-2">
            <Filter className="w-3.5 h-3.5" />
            <span>กรองตาม:</span>
          </div>

          {/* Mission Filter */}
          <select
            value={selectedMission}
            onChange={(e) => setSelectedMission(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">ทุกภารกิจ (All Missions)</option>
            <option value="m1">Mission 1 (ข่าวลือปิดโรงเรียน)</option>
            <option value="m2">Mission 2 (น้ำวิเศษปราบมะเร็ง)</option>
            <option value="m3">Mission 3 (คลิปตัดต่อแฉอาจารย์)</option>
            <option value="m4">Mission 4 (ภารกิจตัดสินความจริง)</option>
          </select>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">ทุกประเภทหลักฐาน (All Types)</option>
            {EVIDENCE_TYPES.map(t => (
              <option key={t.type} value={t.type}>{t.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Evidences List / Cards */}
      {filteredEvidences.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 p-12 rounded-3xl text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-500 mx-auto flex items-center justify-center">
            <FolderArchive className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-300">ยังไม่มีข้อมูลหลักฐาน</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery || selectedMission !== 'ALL' || selectedType !== 'ALL'
              ? 'ไม่พบหลักฐานที่ตรงกับเงื่อนไขตัวกรอง'
              : 'เมื่อนักเรียนเก็บหลักฐานระหว่างทำภารกิจ ข้อมูลหลักฐานจะถูกบันทึกที่นี่โดยอัตโนมัติ'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEvidences.map((ev) => {
            const nickname = getStudentNickname(ev.studentId);

            return (
              <div
                key={ev.id}
                className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 p-5 rounded-2xl space-y-3 transition-colors shadow-lg relative"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                        {ev.type}
                      </span>
                      <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                        {ev.missionId.toUpperCase()}
                      </span>
                      {ev.indicatorId && (
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          {ev.indicatorId}
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-slate-100 font-sans mt-1">
                      {ev.title}
                    </h4>
                  </div>

                  {ev.isVerified && (
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1 shrink-0">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 leading-relaxed font-serif italic">
                  "{ev.content}"
                </p>

                {ev.sourceTag && (
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <span className="text-slate-500">แหล่งอ้างอิง:</span>
                    <span className="font-medium text-slate-300">{ev.sourceTag}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <div className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-slate-200 font-sans font-medium">{nickname}</span>
                    <span className="text-slate-500">({ev.studentId})</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(ev.timestamp).toLocaleString('th-TH')}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
