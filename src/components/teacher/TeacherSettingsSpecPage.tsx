import React, { useState } from 'react';
import { StorageService } from '../../engine/StorageService';
import { TeacherStudentMapping } from '../../types';
import { GoogleSheetsSyncCard } from '../GoogleSheetsSyncCard';
import {
  Settings,
  Shield,
  UserCheck,
  Edit2,
  Check,
  X,
  Database,
  Trash2,
  Sparkles,
  Server,
  KeyRound,
  Cpu,
  RefreshCw
} from 'lucide-react';
import { PushPin } from '../decorations/DetectiveDecorations';

interface TeacherSettingsSpecPageProps {
  onRefresh?: () => void;
}

export const TeacherSettingsSpecPage: React.FC<TeacherSettingsSpecPageProps> = ({ onRefresh }) => {
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [classroom, setClassroom] = useState('');
  const [studentNumber, setStudentNumber] = useState('');

  const students = StorageService.getAllStudents();
  const teacherMappings = StorageService.getTeacherMappings();

  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);

  const handleStartEdit = (studentId: string) => {
    const existing = teacherMappings[studentId];
    setEditingStudentId(studentId);
    setFirstName(existing?.realFirstName || '');
    setLastName(existing?.realLastName || '');
    setClassroom(existing?.classroom || '');
    setStudentNumber(existing?.studentNumber || '');
  };

  const handleSaveMapping = (studentId: string) => {
    StorageService.saveTeacherMapping({
      studentId,
      realFirstName: firstName.trim(),
      realLastName: lastName.trim(),
      classroom: classroom.trim(),
      studentNumber: studentNumber.trim(),
      updatedAt: new Date().toISOString()
    });

    setEditingStudentId(null);
    if (onRefresh) onRefresh();
  };

  const handleCancelEdit = () => {
    setEditingStudentId(null);
  };

  const handleDeleteIndividualStudent = (studentId: string) => {
    StorageService.deleteStudentAccount(studentId);
    setStudentToDelete(null);
    if (onRefresh) onRefresh();
  };

  const handleSeedData = () => {
    if (confirm('คุณต้องการนำเข้าข้อมูลตัวอย่าง (Demo Data) สำหรับการทดสอบหรือไม่?')) {
      StorageService.seedDemoData();
      if (onRefresh) onRefresh();
    }
  };

  const handleClearData = () => {
    if (confirm('คำเตือน: คุณต้องการล้างข้อมูลนักเรียนทั้งหมดในเครื่องนี้หรือไม่? (ไม่สามารถกู้คืนได้)')) {
      StorageService.resetAllData();
      if (onRefresh) onRefresh();
    }
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
                PAGE 09 — SETTINGS & IDENTITY MAPPING
              </span>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                <Shield className="w-3 h-3" />
                <span>Private Teacher Vault</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 uppercase tracking-tight font-mono mt-1">
              การจับคู่ตัวตนผู้เรียน & สเปกระบบ (IDENTITY MAPPING & SPECS)
            </h2>
            <p className="text-xs text-slate-400">
              ตารางจับคู่ Student ID กับชื่อ-นามสกุลจริงสำหรับครูผู้สอน ข้อมูลนี้จะถูกเก็บเป็นความลับเฉพาะฝั่งครู และไม่ถูกเปิดเผยใน Student Mode หรือ Research Export
            </p>
          </div>
        </div>
      </div>

      {/* Identity Mapping Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl space-y-4 p-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <UserCheck className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-black text-slate-100 font-mono">
              ตารางระบุตัวตนนักเรียน (TEACHER STUDENT MAPPING)
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {students.length} นักเรียนในระบบ
          </span>
        </div>

        {students.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs font-mono">
            ยังไม่มีนักเรียนลงทะเบียนในระบบ
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase">
                  <th className="py-3 px-3">Student ID</th>
                  <th className="py-3 px-3">ฉายานักสืบ (Nickname)</th>
                  <th className="py-3 px-3">ชื่อจริง (Real First Name)</th>
                  <th className="py-3 px-3">นามสกุล (Real Last Name)</th>
                  <th className="py-3 px-3">ห้องเรียน</th>
                  <th className="py-3 px-3">เลขที่</th>
                  <th className="py-3 px-3 text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {students.map((std) => {
                  const mapping = teacherMappings[std.studentId];
                  const isEditing = editingStudentId === std.studentId;

                  return (
                    <tr key={std.studentId} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-amber-400">
                        {std.studentId}
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-200">
                        {std.nickname || std.firstName || '-'}
                      </td>

                      {isEditing ? (
                        <>
                          <td className="py-2 px-2">
                            <input
                              type="text"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              placeholder="ชื่อจริง"
                              className="bg-slate-950 border border-amber-500/80 rounded-lg px-2 py-1 text-xs text-white w-full"
                            />
                          </td>
                          <td className="py-2 px-2">
                            <input
                              type="text"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              placeholder="นามสกุล"
                              className="bg-slate-950 border border-amber-500/80 rounded-lg px-2 py-1 text-xs text-white w-full"
                            />
                          </td>
                          <td className="py-2 px-2">
                            <input
                              type="text"
                              value={classroom}
                              onChange={(e) => setClassroom(e.target.value)}
                              placeholder="ม.1/1"
                              className="bg-slate-950 border border-amber-500/80 rounded-lg px-2 py-1 text-xs text-white w-20"
                            />
                          </td>
                          <td className="py-2 px-2">
                            <input
                              type="text"
                              value={studentNumber}
                              onChange={(e) => setStudentNumber(e.target.value)}
                              placeholder="1"
                              className="bg-slate-950 border border-amber-500/80 rounded-lg px-2 py-1 text-xs text-white w-14"
                            />
                          </td>
                          <td className="py-2 px-2 text-right space-x-1 whitespace-nowrap">
                            <button
                              onClick={() => handleSaveMapping(std.studentId)}
                              className="p-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 cursor-pointer"
                              title="บันทึก"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                              title="ยกเลิก"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="py-3 px-3 text-slate-200">
                            {mapping?.realFirstName || <span className="text-slate-600 italic">ไม่ระบุ</span>}
                          </td>
                          <td className="py-3 px-3 text-slate-200">
                            {mapping?.realLastName || <span className="text-slate-600 italic">ไม่ระบุ</span>}
                          </td>
                          <td className="py-3 px-3 font-mono text-slate-300">
                            {mapping?.classroom || '-'}
                          </td>
                          <td className="py-3 px-3 font-mono text-slate-300">
                            {mapping?.studentNumber || '-'}
                          </td>
                          <td className="py-3 px-3 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              onClick={() => handleStartEdit(std.studentId)}
                              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors inline-flex items-center gap-1 cursor-pointer"
                              title="แก้ไขข้อมูลตัวตน"
                            >
                              <Edit2 className="w-3 h-3" />
                              <span>แก้ไข</span>
                            </button>
                            <button
                              onClick={() => setStudentToDelete(std.studentId)}
                              className="px-2 py-1 rounded-lg text-xs font-bold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition-colors inline-flex items-center gap-1 cursor-pointer"
                              title="ลบบัญชีนักเรียน"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>ลบ</span>
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {studentToDelete && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border-2 border-rose-500/70 rounded-3xl p-6 shadow-2xl space-y-4 max-w-md w-full">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-100 font-mono">
                    ยืนยันลบบัญชีนักเรียน
                  </h3>
                  <p className="text-xs text-rose-400 font-mono">
                    Student ID: {studentToDelete}
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                คุณแน่ใจหรือไม่ว่าต้องการลบบัญชีนี้? ข้อมูลความก้าวหน้า หลักฐาน คะแนนสอบ และบันทึก AI ทั้งหมดของนักเรียนรหัสนี้จะถูกลบออกจากระบบอย่างถาวร
              </p>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  onClick={() => setStudentToDelete(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800 transition-colors cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={() => handleDeleteIndividualStudent(studentToDelete)}
                  className="px-4 py-2 rounded-xl text-xs font-black bg-rose-600 hover:bg-rose-500 text-white shadow-lg transition-transform hover:scale-105 cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>ยืนยันการลบ</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* System Specifications & Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Spec Card 1 */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
          <div className="flex items-center space-x-2">
            <Server className="w-5 h-5 text-sky-400" />
            <h3 className="text-sm font-bold text-slate-100 font-mono uppercase">
              SYSTEM ARCHITECTURE SPECIFICATIONS
            </h3>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-400">Application Version:</span>
              <span className="text-amber-400 font-bold">SOURCE DETECTIVE v1.1</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-400">Teacher Auth Engine:</span>
              <span className="text-emerald-400 font-bold">HMAC-SHA256 Signed Tokens</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-400">Rate Limiting:</span>
              <span className="text-sky-400 font-bold">Max 5 attempts / 15 mins</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-400">Database & State:</span>
              <span className="text-purple-400 font-bold">Isolated Storage Engine + Live Event Sync</span>
            </div>
          </div>
        </div>

        {/* Spec Card 2: Maintenance & Demo Controls */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Database className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold text-slate-100 font-mono uppercase">
                DATABASE MAINTENANCE & CONTROLS
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              เครื่องมือจำลองข้อมูลสำหรับการสาธิต (Demo Seeding) และการรีเซ็ตข้อมูลทั้งหมดในกรณีเริ่มปีการศึกษาใหม่
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              onClick={handleSeedData}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>นำเข้าข้อมูลตัวอย่าง (Seed Demo)</span>
            </button>

            <button
              onClick={handleClearData}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>รีเซ็ตข้อมูลทั้งหมด (Reset All)</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
