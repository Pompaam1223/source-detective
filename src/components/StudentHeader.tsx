import React from 'react';
import { Student } from '../types';
import { Shield, KeyRound, Sparkles, User, Fingerprint } from 'lucide-react';
import { PushPin } from './decorations/DetectiveDecorations';

interface StudentHeaderProps {
  student: Student;
  onEditProfile?: () => void;
}

export const StudentHeader: React.FC<StudentHeaderProps> = ({
  student,
  onEditProfile
}) => {
  const displayName = student.nickname || student.firstName || 'นักสืบเยาวชน';

  return (
    <div className="relative bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/60 border-3 border-amber-500/40 rounded-3xl p-5 shadow-xl overflow-hidden">
      <PushPin color="red" className="absolute -top-3 left-8" />
      
      {/* Decorative Detective Stamp */}
      <div className="absolute right-4 top-2 opacity-10 pointer-events-none select-none">
        <Shield className="w-36 h-36 text-amber-400" />
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10 pt-1">
        
        {/* Left ID Badge */}
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-lg shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-2xl">
              🕵️‍♂️
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-black uppercase bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded-md shadow-xs">
                ★ บัตรประจำตัวนักสืบ
              </span>
              <span className="text-[10px] text-amber-400 font-mono font-bold">
                ID: #{student.studentId}
              </span>
            </div>

            <h3 className="text-xl font-black text-slate-100 mt-1 flex items-center gap-2">
              <span>{displayName}</span>
              {student.username && (
                <span className="text-xs font-mono font-normal text-amber-400/80">
                  (@{student.username})
                </span>
              )}
            </h3>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 font-mono mt-1 font-bold">
              <span className="bg-slate-800 border border-slate-700 px-2.5 py-0.5 rounded-lg flex items-center gap-1 text-amber-400">
                <Fingerprint className="w-3.5 h-3.5 text-amber-400" />
                <span>รหัสนักสืบ: <strong>{student.studentId}</strong></span>
              </span>
              <span className="bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-lg text-emerald-400">
                สถานะ: พร้อมสืบคดี
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {onEditProfile && (
          <button
            onClick={onEditProfile}
            className="text-xs font-bold text-amber-300 hover:text-white bg-slate-800 hover:bg-slate-750 border border-amber-500/30 px-3.5 py-2 rounded-xl flex items-center space-x-1.5 transition-all shadow self-end sm:self-center cursor-pointer"
          >
            <User className="w-3.5 h-3.5" />
            <span>โปรไฟล์ / สลับบัญชี</span>
          </button>
        )}

      </div>
    </div>
  );
};
