import React, { useState } from 'react';
import { StorageService } from '../../engine/StorageService';
import { AIUsageLog } from '../../types';
import {
  Bot,
  Search,
  Clock,
  User,
  MessageSquare,
  HelpCircle,
  Sparkles,
  Info,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';
import { PushPin } from '../decorations/DetectiveDecorations';

export const TeacherAIUsagePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const allLogs = StorageService.getAllStudentAILogs();
  const students = StorageService.getAllStudents();

  // Filter AI Logs
  const filteredLogs = allLogs.filter(log => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    const matchId = log.studentId.toLowerCase().includes(q);
    const matchMission = (log.missionId || '').toLowerCase().includes(q);
    const matchQuestion = (log.questionId || '').toLowerCase().includes(q);
    const matchQuery = log.aiQueries?.some(
      qr => qr.query.toLowerCase().includes(q) || qr.response.toLowerCase().includes(q)
    );
    return matchId || matchMission || matchQuestion || matchQuery;
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
              <span className="text-[11px] font-mono font-bold bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full border border-purple-500/30">
                PAGE 06 — AI HELPER USAGE AUDIT
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                ประวัติการขอคำปรึกษา AI ทั้งหมด: {allLogs.length} ครั้ง
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 uppercase tracking-tight font-mono mt-1">
              ประวัติการใช้งานผู้ช่วย AI (AI HELPER AUDIT)
            </h2>
            <p className="text-xs text-slate-400">
              ตรวจสอบกระบวนการคิดและเจตนาในการปรึกษา AI ของผู้เรียน เพื่อนำไปใช้วิเคราะห์การพัฒนาทักษะ มิใช่การหักคะแนนอัตโนมัติ
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative min-w-[240px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาข้อความคำถาม, ID, ภารกิจ..."
              className="w-full bg-slate-950 border border-slate-700 focus:border-purple-500 rounded-xl px-3.5 py-2 pl-9 text-xs text-slate-100 focus:outline-none transition-colors"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Pedagogical Notice Banner */}
        <div className="mt-3 p-3 bg-purple-950/40 border border-purple-800/50 rounded-2xl flex items-start gap-2.5 text-xs text-purple-200">
          <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-purple-300">หลักการประเมินการใช้ AI (Formative Assessment Insight):</span>
            <p className="text-[11px] text-purple-300/80 leading-relaxed">
              ระบบบันทึกคำถามและคำแนะนำเพื่อช่วยให้ครูเห็นว่านักเรียนติดปัญหาในจุดใด (Scaffolding Need) การปรึกษา AI อย่างถูกวิธีสะท้อนทักษะการสืบค้นและการตั้งคำถาม
            </p>
          </div>
        </div>
      </div>

      {/* AI Logs List */}
      {filteredLogs.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 p-12 rounded-3xl text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-500 mx-auto flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-300">ยังไม่มีข้อมูลการใช้งาน AI</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery
              ? 'ไม่พบประวัติการขอคำปรึกษา AI ที่ตรงกับคำค้นหา'
              : 'เมื่อนักเรียนเปิดใช้งานผู้ช่วย AI ในระหว่างการทำภารกิจ ประวัติการสนทนาจะถูกบันทึกที่นี่'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLogs.map((log, idx) => {
            const nickname = getStudentNickname(log.studentId);

            return (
              <div
                key={`${log.studentId}_${log.timestamp}_${idx}`}
                className="bg-slate-900 border border-slate-800 hover:border-purple-500/40 p-5 rounded-2xl space-y-3 transition-colors shadow-lg"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">
                      {log.studentId}
                    </span>
                    <span className="font-sans font-bold text-slate-200">
                      {nickname}
                    </span>
                    {log.missionId && (
                      <span className="font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                        {log.missionId.toUpperCase()}
                      </span>
                    )}
                    {log.questionId && (
                      <span className="font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                        ข้อ: {log.questionId}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(log.timestamp).toLocaleString('th-TH')}</span>
                  </div>
                </div>

                {/* Dialog Turns */}
                {log.aiQueries && log.aiQueries.length > 0 ? (
                  <div className="space-y-2 pt-1">
                    {log.aiQueries.map((qr, qIdx) => (
                      <div key={qIdx} className="space-y-2">
                        {/* Student Prompt */}
                        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs text-slate-200 flex items-start gap-2">
                          <User className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[10px] font-mono text-slate-400 font-bold block mb-0.5">
                              คำถามของนักเรียน:
                            </span>
                            <span className="font-serif">"{qr.query}"</span>
                          </div>
                        </div>

                        {/* AI Response */}
                        <div className="bg-purple-950/30 p-3 rounded-xl border border-purple-900/40 text-xs text-purple-200 flex items-start gap-2">
                          <Bot className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[10px] font-mono text-purple-400 font-bold block mb-0.5">
                              คำแนะนำของ AI Helper:
                            </span>
                            <p className="leading-relaxed font-sans">{qr.response}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 italic">
                    เปิดใช้งานผู้ช่วย AI Helper เพื่อดูคำใบ้บริบท
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
