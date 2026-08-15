import React, { useState } from 'react';
import { StorageService } from '../../engine/StorageService';
import { Student, StudentAccount, TeacherStudentMapping } from '../../types';
import { hashPassword } from '../../utils/security';
import {
  Users,
  Search,
  KeyRound,
  Eye,
  CheckCircle2,
  AlertCircle,
  Shield,
  Clock,
  UserCheck,
  Calendar,
  Lock,
  RefreshCw,
  FolderArchive,
  Bot,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { PushPin } from '../decorations/DetectiveDecorations';

interface TeacherStudentManagementPageProps {
  onRefresh?: () => void;
}

export const TeacherStudentManagementPage: React.FC<TeacherStudentManagementPageProps> = ({ onRefresh }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // Password reset state
  const [resettingStudentId, setResettingStudentId] = useState<string | null>(null);
  const [newTempPassword, setNewTempPassword] = useState('123456');
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);
  const [resetErrorMessage, setResetErrorMessage] = useState<string | null>(null);

  // Student deletion state
  const [deletingStudentId, setDeletingStudentId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccessMessage, setDeleteSuccessMessage] = useState<string | null>(null);

  const students = StorageService.getAllStudents();
  const accounts = StorageService.getAllAccounts();
  const teacherMappings = StorageService.getTeacherMappings();

  // Filter students by ID, Nickname, Username, or Mapping Name
  const filteredStudents = students.filter(std => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    const mapping = teacherMappings[std.studentId];
    const matchId = std.studentId.toLowerCase().includes(q);
    const matchNick = (std.nickname || '').toLowerCase().includes(q);
    const matchUser = (std.username || '').toLowerCase().includes(q);
    const matchReal = mapping ? `${mapping.realFirstName || ''} ${mapping.realLastName || ''}`.toLowerCase().includes(q) : false;
    return matchId || matchNick || matchUser || matchReal;
  });

  const selectedStudent = selectedStudentId
    ? students.find(s => s.studentId === selectedStudentId) || null
    : null;
  const selectedAccount = selectedStudentId
    ? accounts.find(a => a.studentId === selectedStudentId) || null
    : null;
  const selectedMapping = selectedStudentId
    ? teacherMappings[selectedStudentId] || null
    : null;
  const selectedProgress = selectedStudentId
    ? StorageService.getProgress(selectedStudentId)
    : null;
  const selectedEvidences = selectedStudentId
    ? StorageService.getEvidences(selectedStudentId)
    : [];
  const selectedAILogs = selectedStudentId
    ? StorageService.getAILogs(selectedStudentId)
    : [];

  const handleResetPassword = async (studentId: string) => {
    if (!newTempPassword || newTempPassword.trim().length === 0) {
      setResetErrorMessage('กรุณาระบุรหัสผ่านใหม่');
      return;
    }
    if (newTempPassword.length > 8) {
      setResetErrorMessage('รหัสผ่านต้องมีความยาวไม่เกิน 8 ตัวอักษรตามมาตรฐานระบบ');
      return;
    }

    setIsResetting(true);
    setResetErrorMessage(null);

    try {
      const hashed = await hashPassword(newTempPassword.trim());
      const success = StorageService.teacherResetPassword(studentId, hashed);
      if (success) {
        setResetSuccessMessage(`รีเซ็ตรหัสผ่านของนักเรียน ID: ${studentId} เป็น "${newTempPassword.trim()}" สำเร็จ (ข้อมูลการเรียนรู้ทั้งหมดยังคงเดิมครบถ้วน)`);
        if (onRefresh) onRefresh();
        setTimeout(() => {
          setResettingStudentId(null);
          setResetSuccessMessage(null);
        }, 4000);
      } else {
        setResetErrorMessage('ไม่พบบัญชีผู้ใช้ในการรีเซ็ตรหัสผ่าน');
      }
    } catch {
      setResetErrorMessage('เกิดข้อผิดพลาดในการแฮชรหัสผ่าน');
    } finally {
      setIsResetting(false);
    }
  };

  const handleDeleteStudent = (studentId: string) => {
    setIsDeleting(true);
    const success = StorageService.deleteStudentAccount(studentId);
    if (success) {
      setDeleteSuccessMessage(`ลบข้อมูลบัญชีและประวัติการเรียนรู้ของนักเรียน ID: ${studentId} สำเร็จ`);
      if (selectedStudentId === studentId) {
        setSelectedStudentId(null);
      }
      if (onRefresh) onRefresh();
      setTimeout(() => {
        setDeletingStudentId(null);
        setDeleteSuccessMessage(null);
        setIsDeleting(false);
      }, 1500);
    } else {
      setIsDeleting(false);
    }
  };

  const deletingStudent = deletingStudentId
    ? students.find(s => s.studentId === deletingStudentId) || null
    : null;
  const deletingMapping = deletingStudentId
    ? teacherMappings[deletingStudentId] || null
    : null;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-2 relative overflow-hidden">
        <PushPin color="yellow" className="absolute -top-3 left-8" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full border border-amber-500/30">
                PAGE 02 — STUDENT ACCOUNT MANAGEMENT
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                นักเรียนทั้งหมด: {students.length} บัญชี
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 uppercase tracking-tight font-mono mt-1">
              การจัดการบัญชีนักเรียน & รีเซ็ตรหัสผ่าน
            </h2>
            <p className="text-xs text-slate-400">
              ครูสามารถตรวจสอบบัญชีผู้เรียน ค้นหารายบุคคล รีเซ็ตรหัสผ่าน หรือลบบัญชีนักเรียนรายบุคคลพร้อมข้อมูลประวัติการเรียนรู้
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative min-w-[260px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาด้วย ID, ชื่อเล่น, Username..."
              className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2 pl-9 text-xs text-slate-100 focus:outline-none transition-colors"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* Main Table / List */}
      {filteredStudents.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 p-12 rounded-3xl text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-500 mx-auto flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-300">ยังไม่มีข้อมูลบัญชีนักเรียน</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery ? 'ไม่พบนักเรียนที่ตรงกับคำค้นหา' : 'เมื่อนักเรียนลงทะเบียนใน Student Mode รายชื่อบัญชีจะปรากฏขึ้นที่นี่โดยอัตโนมัติ'}
          </p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Student ID (Unique)</th>
                  <th className="py-3.5 px-4">ฉายานักสืบ / Nickname</th>
                  <th className="py-3.5 px-4">Username</th>
                  <th className="py-3.5 px-4">ชื่อ-นามสกุล (ข้อมูลฝั่งครู)</th>
                  <th className="py-3.5 px-4">สถานะบัญชี</th>
                  <th className="py-3.5 px-4">ลงทะเบียนเมื่อ</th>
                  <th className="py-3.5 px-4 text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredStudents.map((std) => {
                  const account = accounts.find(a => a.studentId === std.studentId);
                  const mapping = teacherMappings[std.studentId];
                  const isSelected = selectedStudentId === std.studentId;

                  return (
                    <tr
                      key={std.studentId}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        isSelected ? 'bg-amber-500/10' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                        <span className="bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          {std.studentId}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-100">
                        {std.nickname || std.firstName || 'นักสืบเยาวชน'}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        {std.username || account?.username || '-'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {mapping && (mapping.realFirstName || mapping.realLastName) ? (
                          <div className="space-y-0.5">
                            <span className="font-medium text-emerald-300">
                              {mapping.realFirstName} {mapping.realLastName}
                            </span>
                            {(mapping.classroom || mapping.studentNumber) && (
                              <div className="text-[10px] text-slate-400 font-mono">
                                {mapping.classroom && `ห้อง ${mapping.classroom}`} {mapping.studentNumber && `เลขที่ ${mapping.studentNumber}`}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-500 text-[11px] italic">ยังไม่ได้ระบุ (ตั้งค่าใน Page 09)</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{account?.accountStatus || 'ACTIVE'}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                        {std.registeredAt ? new Date(std.registeredAt).toLocaleDateString('th-TH') : '-'}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedStudentId(isSelected ? null : std.studentId)}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{isSelected ? 'ปิดดู' : 'ดูข้อมูล'}</span>
                        </button>

                        <button
                          onClick={() => {
                            setResettingStudentId(std.studentId);
                            setNewTempPassword('123456');
                            setResetSuccessMessage(null);
                            setResetErrorMessage(null);
                          }}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 transition-colors inline-flex items-center gap-1 cursor-pointer"
                          title="รีเซ็ตรหัสผ่าน"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                          <span>รีเซ็ตรหัส</span>
                        </button>

                        <button
                          onClick={() => {
                            setDeletingStudentId(std.studentId);
                            setDeleteSuccessMessage(null);
                          }}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition-colors inline-flex items-center gap-1 cursor-pointer"
                          title="ลบบัญชีนักเรียนรายบุคคล"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>ลบบัญชี</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal / Dialog */}
      {deletingStudentId && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-rose-500/70 rounded-3xl p-6 shadow-2xl space-y-4 max-w-lg w-full">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-100 font-mono">
                  ยืนยันการลบบัญชีนักเรียน (DELETE STUDENT)
                </h3>
                <p className="text-xs text-rose-400 font-mono">
                  Student ID: {deletingStudentId}
                </p>
              </div>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">ฉายานักสืบ:</span>
                <span className="text-slate-200 font-bold">{deletingStudent?.nickname || deletingStudent?.firstName || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Username:</span>
                <span className="text-slate-200 font-mono">{deletingStudent?.username || '-'}</span>
              </div>
              {deletingMapping && (deletingMapping.realFirstName || deletingMapping.realLastName) && (
                <div className="flex justify-between">
                  <span className="text-slate-400">ชื่อ-นามสกุลจริง:</span>
                  <span className="text-emerald-300 font-medium">{deletingMapping.realFirstName} {deletingMapping.realLastName}</span>
                </div>
              )}
            </div>

            <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-2xl text-xs text-rose-200/90 space-y-1 leading-relaxed">
              <p className="font-bold text-rose-300 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                <span>คำเตือน: การลบนี้ไม่สามารถย้อนกลับได้</span>
              </p>
              <p className="text-[11px] text-slate-300">
                ข้อมูลต่อไปนี้ของนักเรียนรายนี้จะถูกลบออกจากระบบอย่างถาวร:
              </p>
              <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-0.5 pl-1">
                <li>บัญชีและรหัสผ่านเข้าสู่ระบบ</li>
                <li>ความก้าวหน้าการเรียนรู้และการทำภารกิจ M1-M4 ทั้งหมด</li>
                <li>คะแนนแบบทดสอบก่อนเรียนและหลังเรียน</li>
                <li>หลักฐานในคลังหลักฐาน (Evidences)</li>
                <li>ประวัติการสนทนากับ AI Helper</li>
              </ul>
            </div>

            {deleteSuccessMessage && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{deleteSuccessMessage}</span>
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => {
                  setDeletingStudentId(null);
                  setDeleteSuccessMessage(null);
                }}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
              >
                ยกเลิก
              </button>

              <button
                onClick={() => handleDeleteStudent(deletingStudentId)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-black bg-rose-600 hover:bg-rose-500 text-white shadow-lg transition-transform hover:scale-105 cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isDeleting ? 'กำลังลบข้อมูล...' : 'ยืนยันการลบบัญชีนี้'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Reset Modal / Dialog */}
      {resettingStudentId && (
        <div className="bg-slate-900 border-2 border-amber-500/60 rounded-3xl p-6 shadow-2xl space-y-4 max-w-md mx-auto">
          <div className="flex items-center space-x-2">
            <KeyRound className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-black text-slate-100 font-mono">
              รีเซ็ตรหัสผ่านนักเรียน (ID: {resettingStudentId})
            </h3>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            ตั้งรหัสผ่านชั่วคราวใหม่ให้นักเรียน (ความยาวไม่เกิน 8 ตัวอักษร) การรีเซ็ตนี้จะเข้ารหัส SHA-256 และไม่กระทบต่อประวัติการเรียนรู้ใดๆ
          </p>

          <div>
            <label className="block text-xs font-mono font-bold text-slate-300 mb-1">
              รหัสผ่านใหม่ (Temporary Password)
            </label>
            <input
              type="text"
              value={newTempPassword}
              onChange={(e) => setNewTempPassword(e.target.value)}
              maxLength={8}
              placeholder="ความยาวไม่เกิน 8 ตัวอักษร"
              className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2 text-sm text-slate-100 font-mono focus:outline-none"
            />
          </div>

          {resetErrorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{resetErrorMessage}</span>
            </div>
          )}

          {resetSuccessMessage && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{resetSuccessMessage}</span>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-2">
            <button
              onClick={() => {
                setResettingStudentId(null);
                setResetErrorMessage(null);
                setResetSuccessMessage(null);
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800 transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>

            <button
              onClick={() => handleResetPassword(resettingStudentId)}
              disabled={isResetting}
              className="btn-game-orange text-slate-950 font-black px-4 py-2 rounded-xl text-xs shadow-md transition-transform hover:scale-105 cursor-pointer disabled:opacity-50"
            >
              {isResetting ? 'กำลังบันทึก...' : 'ยืนยันรีเซ็ตรหัสผ่าน'}
            </button>
          </div>
        </div>
      )}

      {/* Selected Student Detail Inspector Panel */}
      {selectedStudent && (
        <div className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-base">
                🕵️
              </div>
              <div>
                <h3 className="text-base font-black text-slate-100 font-mono">
                  รายละเอียดบัญชี: {selectedStudent.nickname || selectedStudent.firstName} (ID: {selectedStudent.studentId})
                </h3>
                <p className="text-xs text-slate-400">
                  Username: {selectedStudent.username || selectedAccount?.username || '-'} • สร้างเมื่อ: {new Date(selectedStudent.registeredAt).toLocaleString('th-TH')}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  setDeletingStudentId(selectedStudent.studentId);
                  setDeleteSuccessMessage(null);
                }}
                className="text-xs text-rose-300 hover:text-rose-200 bg-rose-500/20 border border-rose-500/30 px-3 py-1.5 rounded-xl cursor-pointer flex items-center gap-1 font-bold"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>ลบบัญชีนี้</span>
              </button>

              <button
                onClick={() => setSelectedStudentId(null)}
                className="text-xs text-slate-400 hover:text-white bg-slate-800 px-3 py-1.5 rounded-xl cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[11px] font-mono text-slate-400">ความก้าวหน้าการเรียนรู้</span>
              <div className="text-lg font-black text-sky-400 font-mono">
                {selectedProgress?.completedMissionIds?.length || 0} / 4 ภารกิจ
              </div>
              <p className="text-[10px] text-slate-500">
                Baseline: {selectedProgress?.baselineStatus || 'NOT_STARTED'} • Post-test: {selectedProgress?.postTestStatus || 'NOT_STARTED'}
              </p>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[11px] font-mono text-slate-400">หลักฐานที่บันทึก (Evidences)</span>
              <div className="text-lg font-black text-emerald-400 font-mono">
                {selectedEvidences.length} ชิ้น
              </div>
              <p className="text-[10px] text-slate-500">
                พร้อมตรวจสอบในคลังหลักฐาน Page 05
              </p>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[11px] font-mono text-slate-400">การขอคำปรึกษา AI Helper</span>
              <div className="text-lg font-black text-purple-400 font-mono">
                {selectedAILogs.length} ครั้ง
              </div>
              <p className="text-[10px] text-slate-500">
                บันทึกคำถาม-คำตอบเพื่อตรวจสอบกระบวนการคิด
              </p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
