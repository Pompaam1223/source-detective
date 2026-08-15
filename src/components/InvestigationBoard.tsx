import React from 'react';
import { Evidence } from '../types';
import { EvidenceCard } from './EvidenceCard';
import { Search, Pin, ShieldCheck, Sparkles, Filter } from 'lucide-react';

interface InvestigationBoardProps {
  evidences: Evidence[];
  studentName?: string;
  onSelectEvidence?: (evidence: Evidence) => void;
}

export const InvestigationBoard: React.FC<InvestigationBoardProps> = ({
  evidences,
  studentName = 'ยอดนักสืบ',
  onSelectEvidence
}) => {
  return (
    <div className="bg-amber-950/20 border-2 border-amber-900/40 rounded-2xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
      
      {/* Board Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-5 border-b border-amber-800/40">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                กระดานรวบรวมหลักฐาน (CASE INVESTIGATION BOARD)
              </span>
              <Pin className="w-3.5 h-3.5 text-rose-500 rotate-45" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">
              แฟ้มหลักฐานของ {studentName}
            </h3>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-amber-500/30 text-xs font-mono text-amber-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>หลักฐานทั้งหมด: {evidences.length} ชิ้น</span>
        </div>
      </div>

      {/* Grid of Evidence Cards */}
      {evidences.length === 0 ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-900/60 border border-slate-800 flex items-center justify-center mx-auto text-amber-400/50">
            <Search className="w-8 h-8" />
          </div>
          <h4 className="text-sm font-bold text-slate-300">ยังไม่มีหลักฐานที่บันทึกไว้ในกระดาน</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            เข้าทำภารกิจใน "แผนที่ภารกิจ" และตอบคำถามสืบสวนเพื่อเก็บรวบรวมหลักฐานเข้าสู่กระดานคดี!
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {evidences.map(ev => (
            <EvidenceCard
              key={ev.id}
              evidence={ev}
              onClick={() => onSelectEvidence && onSelectEvidence(ev)}
            />
          ))}
        </div>
      )}

    </div>
  );
};
