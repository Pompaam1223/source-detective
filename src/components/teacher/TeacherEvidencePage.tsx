import React, { useState, useEffect } from 'react';
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
  ShieldCheck,
  RefreshCw,
  PlusCircle,
  Eye,
  X,
  Database,
  Award,
  Hash
} from 'lucide-react';
import { PushPin } from '../decorations/DetectiveDecorations';

const EVIDENCE_TYPES: { type: EvidenceType; label: string; color: string }[] = [
  { type: 'SOURCE', label: 'แหล่งที่มา (Source)', color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' },
  { type: 'AUTHOR', label: 'ผู้ส่งสาร / ผู้เขียน (Author)', color: 'border-sky-500/40 bg-sky-500/10 text-sky-300' },
  { type: 'DATE', label: 'วันเวลา / ความสดใหม่ (Date)', color: 'border-amber-500/40 bg-amber-500/10 text-amber-300' },
  { type: 'CLAIM', label: 'ข้ออ้าง / ประเด็นหลัก (Claim)', color: 'border-rose-500/40 bg-rose-500/10 text-rose-300' },
  { type: 'COMPARISON', label: 'การเปรียบเทียบแหล่งข่าว (Comparison)', color: 'border-purple-500/40 bg-purple-500/10 text-purple-300' },
  { type: 'REASON', label: 'เหตุผลสนับสนุน (Reason)', color: 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300' },
  { type: 'DECISION', label: 'การตัดสินใจ / ข้อสรุป (Decision)', color: 'border-orange-500/40 bg-orange-500/10 text-orange-300' },
  { type: 'REVISION', label: 'การปรับเปลี่ยนมุมมอง (Revision)', color: 'border-pink-500/40 bg-pink-500/10 text-pink-300' },
  { type: 'PROCESS', label: 'กระบวนการคิด (Process)', color: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300' },
  { type: 'STUDENT_VOICE', label: 'เสียงสะท้อนนักเรียน (Student Voice)', color: 'border-teal-500/40 bg-teal-500/10 text-teal-300' },
];

export const TeacherEvidencePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMission, setSelectedMission] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [refreshKey, setRefreshKey] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);

  // Load all student evidences and profiles
  const [allEvidences, setAllEvidences] = useState<Evidence[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    const evs = StorageService.getAllStudentEvidences();
    const stds = StorageService.getAllStudents();
    setAllEvidences(evs);
    setStudents(stds);
  }, [refreshKey]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Seed sample evidences
  const handleSeedEvidences = () => {
    const generated = StorageService.seedComprehensiveEvidences();
    setRefreshKey(prev => prev + 1);
    showToast(`✨ เพิ่มชุดข้อมูลหลักฐานนักสืบตัวอย่างเรียบร้อย (${generated.length} รายการ)`);
  };

  // Cloud sync
  const handleSyncCloud = async () => {
    setIsSyncing(true);
    try {
      const res = await StorageService.syncAllFromCloud();
      setRefreshKey(prev => prev + 1);
      showToast(`🔄 ซิงค์ข้อมูลล่าสุดจาก Cloud สำเร็จ (${res.studentCount} นักเรียน)`);
    } catch (e) {
      showToast('⚠️ ไม่สามารถเชื่อมต่อ Cloud ได้');
    } finally {
      setIsSyncing(false);
    }
  };

  // Filter Evidences
  const filteredEvidences = allEvidences.filter(ev => {
    const q = searchQuery.trim().toLowerCase();
    const matchSearch =
      !q ||
      ev.studentId.toLowerCase().includes(q) ||
      ev.title.toLowerCase().includes(q) ||
      ev.content.toLowerCase().includes(q) ||
      (ev.indicatorId && ev.indicatorId.toLowerCase().includes(q)) ||
      (ev.sourceTag && ev.sourceTag.toLowerCase().includes(q));

    const matchMission = selectedMission === 'ALL' || ev.missionId === selectedMission;
    const matchType = selectedType === 'ALL' || ev.type === selectedType;

    return matchSearch && matchMission && matchType;
  });

  const getStudentNickname = (studentId: string) => {
    const std = students.find(s => s.studentId === studentId);
    if (!std) return studentId;
    return std.nickname || std.firstName || studentId;
  };

  const getStudentFullName = (studentId: string) => {
    const std = students.find(s => s.studentId === studentId);
    if (!std) return studentId;
    return `${std.firstName || ''} ${std.lastName || ''}`.trim() || studentId;
  };

  const verifiedCount = allEvidences.filter(e => e.isVerified).length;
  const uniqueStudentsCount = new Set(allEvidences.map(e => e.studentId)).size;
  const uniqueIndicatorsCount = new Set(allEvidences.map(e => e.indicatorId).filter(Boolean)).size;

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border-2 border-amber-500/80 text-amber-300 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-slideUp font-medium text-xs sm:text-sm">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 relative overflow-hidden shadow-xl">
        <PushPin color="yellow" className="absolute -top-3 left-8" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
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
            <p className="text-xs text-slate-400 max-w-2xl">
              ตรวจสอบหลักฐานที่นักเรียนรวบรวมได้จริงจากการสืบค้น เชื่อมโยงกับ Student ID, ภารกิจ (M1-M4), แหล่งข้อมูล และเกณฑ์ 20 ตัวชี้วัด
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleSeedEvidences}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md transition-all inline-flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>เพิ่มหลักฐานตัวอย่าง (15 รายการ)</span>
            </button>

            <button
              onClick={handleSyncCloud}
              disabled={isSyncing}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-amber-500/40 transition-all inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-amber-400' : ''}`} />
              <span>{isSyncing ? 'กำลังซิงค์...' : 'ดึงข้อมูลจาก Cloud'}</span>
            </button>
          </div>
        </div>

        {/* Stats Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80">
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3 flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              <FolderArchive className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">หลักฐานทั้งหมด</div>
              <div className="text-base font-black text-slate-100 font-mono">{allEvidences.length} รายการ</div>
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3 flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">ตรวจยืนยันแล้ว</div>
              <div className="text-base font-black text-emerald-400 font-mono">{verifiedCount} รายการ</div>
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3 flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">นักเรียนที่ส่งหลักฐาน</div>
              <div className="text-base font-black text-sky-300 font-mono">{uniqueStudentsCount} คน</div>
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3 flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">ตัวชี้วัดที่ครอบคลุม</div>
              <div className="text-base font-black text-purple-300 font-mono">{uniqueIndicatorsCount}/20 ตัวชี้วัด</div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400 mr-1">
              <Filter className="w-3.5 h-3.5" />
              <span>กรอง:</span>
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

          {/* Search Bar */}
          <div className="relative min-w-[240px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาชื่อหลักฐาน, ข้อความ, ID, ตัวชี้วัด..."
              className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2 pl-9 text-xs text-slate-100 focus:outline-none transition-colors"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* Evidences List / Cards */}
      {filteredEvidences.length === 0 ? (
        <div className="bg-slate-900/70 border-2 border-dashed border-slate-800 p-12 rounded-3xl text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
            <FolderArchive className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-slate-200">ยังไม่มีข้อมูลหลักฐานในระบบ</h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              เมื่อนักเรียนเก็บหลักฐานระหว่างทำภารกิจ ข้อมูลหลักฐานจะถูกบันทึกที่นี่โดยอัตโนมัติ หรือคุณครูสามารถกดเพิ่มชุดข้อมูลตัวอย่างเพื่อเริ่มทดสอบระบบได้ทันที
            </p>
          </div>

          <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleSeedEvidences}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg transition-all inline-flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>เพิ่มชุดข้อมูลหลักฐานตัวอย่าง (15 รายการ)</span>
            </button>

            <button
              onClick={handleSyncCloud}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>ดึงข้อมูลจาก Cloud Firestore</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEvidences.map((ev) => {
            const nickname = getStudentNickname(ev.studentId);
            const fullName = getStudentFullName(ev.studentId);
            const typeConfig = EVIDENCE_TYPES.find(t => t.type === ev.type) || {
              type: ev.type,
              label: ev.type,
              color: 'border-slate-700 bg-slate-800 text-slate-300'
            };

            return (
              <div
                key={ev.id}
                onClick={() => setSelectedEvidence(ev)}
                className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 p-5 rounded-2xl space-y-3.5 transition-all shadow-lg relative cursor-pointer group hover:bg-slate-900/90"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${typeConfig.color}`}>
                        {ev.type}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                        {ev.missionId.toUpperCase()}
                      </span>
                      {ev.indicatorId && (
                        <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                          <Hash className="w-2.5 h-2.5" />
                          <span>{ev.indicatorId}</span>
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-slate-100 font-sans mt-1 group-hover:text-amber-300 transition-colors">
                      {ev.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {ev.isVerified && (
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Verified</span>
                      </span>
                    )}
                    <div className="p-1 rounded-lg bg-slate-800/60 group-hover:bg-amber-500/20 text-slate-400 group-hover:text-amber-300 transition-colors">
                      <Eye className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80 leading-relaxed font-serif italic line-clamp-3">
                  "{ev.content}"
                </p>

                {ev.sourceTag && (
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5 bg-slate-950/40 px-2.5 py-1 rounded-lg border border-slate-800/60">
                    <span className="text-slate-500 text-[10px]">แหล่งอ้างอิง:</span>
                    <span className="font-medium text-slate-300 truncate">{ev.sourceTag}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-slate-200 font-sans font-medium">{nickname}</span>
                    <span className="text-slate-500 text-[10px]">({ev.studentId})</span>
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

      {/* Detailed Evidence Modal / Inspector */}
      {selectedEvidence && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold bg-amber-500/20 text-amber-300 px-3 py-0.5 rounded-full border border-amber-500/30">
                    {selectedEvidence.type}
                  </span>
                  <span className="text-xs font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                    {selectedEvidence.missionId.toUpperCase()}
                  </span>
                  {selectedEvidence.indicatorId && (
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      ตัวชี้วัด {selectedEvidence.indicatorId}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-100 mt-1">
                  {selectedEvidence.title}
                </h3>
              </div>

              <button
                onClick={() => setSelectedEvidence(null)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Details */}
            <div className="space-y-4">
              <div>
                <div className="text-[11px] font-mono text-slate-400 uppercase mb-1">
                  บันทึกข้อความ / หลักฐานเชิงประจักษ์:
                </div>
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl text-sm text-slate-200 leading-relaxed font-serif italic">
                  "{selectedEvidence.content}"
                </div>
              </div>

              {selectedEvidence.sourceTag && (
                <div>
                  <div className="text-[11px] font-mono text-slate-400 uppercase mb-1">
                    แหล่งที่มา / การอ้างอิง:
                  </div>
                  <div className="bg-slate-950/70 border border-slate-800 px-3.5 py-2 rounded-xl text-xs text-slate-300 font-mono">
                    {selectedEvidence.sourceTag}
                  </div>
                </div>
              )}

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
                  <div className="text-[10px] font-mono text-slate-500 uppercase">นักสืบผู้บันทึก</div>
                  <div className="text-xs font-bold text-slate-200 mt-0.5">
                    {getStudentFullName(selectedEvidence.studentId)}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">ID: {selectedEvidence.studentId}</div>
                </div>

                <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
                  <div className="text-[10px] font-mono text-slate-500 uppercase">สถานะการตรวจสอบ</div>
                  <div className="text-xs font-bold text-emerald-400 mt-0.5 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{selectedEvidence.isVerified ? 'ยืนยันถูกต้อง (Verified)' : 'รอดำเนินการ'}</span>
                  </div>
                </div>

                <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
                  <div className="text-[10px] font-mono text-slate-500 uppercase">เวลาบันทึก</div>
                  <div className="text-xs font-bold text-slate-300 mt-0.5">
                    {new Date(selectedEvidence.timestamp).toLocaleString('th-TH')}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedEvidence(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
