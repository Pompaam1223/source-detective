import React, { useState, useEffect } from 'react';
import { TeacherAuthService } from '../services/TeacherAuthService';
import { ShieldCheck, Lock, ArrowLeft, KeyRound, AlertCircle, Sparkles, UserCheck } from 'lucide-react';
import { DetectiveTeacherInspector } from './characters/DetectiveCharacters';
import { PushPin } from './decorations/DetectiveDecorations';

interface TeacherAccessGateProps {
  onSuccess: () => void;
  onBackToStudentMode: () => void;
}

export const TeacherAccessGate: React.FC<TeacherAccessGateProps> = ({
  onSuccess,
  onBackToStudentMode
}) => {
  const [accessCode, setAccessCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);

  useEffect(() => {
    let timer: any;
    if (remainingSeconds > 0) {
      timer = setInterval(() => {
        setRemainingSeconds(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setErrorMessage(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [remainingSeconds]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (remainingSeconds > 0 || isLoading) return;

    if (!accessCode.trim()) {
      setErrorMessage('กรุณากรอก Teacher Access Code');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await TeacherAuthService.authenticate(accessCode);
      if (result.success) {
        setAccessCode('');
        onSuccess();
      } else {
        setErrorMessage(result.error || 'รหัสไม่ถูกต้อง กรุณาลองใหม่');
        if (result.remainingSeconds) {
          setRemainingSeconds(result.remainingSeconds);
        }
      }
    } catch {
      setErrorMessage('รหัสไม่ถูกต้อง กรุณาลองใหม่');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      
      {/* Top Back Action */}
      <div className="mb-6">
        <button
          onClick={onBackToStudentMode}
          className="text-xs font-bold text-slate-400 hover:text-amber-400 flex items-center space-x-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO STUDENT MODE (กลับสู่โหมดนักสืบ)</span>
        </button>
      </div>

      {/* Main Access Card */}
      <div className="relative bg-slate-900 border-3 border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        <PushPin color="yellow" className="absolute -top-3 left-10" />

        {/* Decorative Watermark */}
        <div className="absolute right-4 -bottom-6 opacity-5 pointer-events-none select-none">
          <Lock className="w-56 h-56 text-amber-400" />
        </div>

        <div className="relative z-10 space-y-6 text-center">
          
          {/* Header Badge */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-xl flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center text-3xl">
                🔐
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              TEACHER MODE ACCESS PROTECTION
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-100 uppercase tracking-tight">
              TEACHER ACCESS
            </h2>
            <p className="text-sm font-semibold text-amber-300/90 font-serif">
              "พื้นที่สำหรับครูผู้สอนเท่านั้น"
            </p>
          </div>

          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            โหมดคุณครูได้รับการคุ้มครองความปลอดภัย นักเรียนไม่สามารถเข้าถึงได้โดยตรง กรุณากรอกรหัสผ่านลับของครูผู้สอนเพื่อยืนยันสิทธิ์
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-2 text-left">
            <div>
              <label className="block text-xs font-mono font-bold text-slate-300 mb-1.5">
                Teacher Access Code
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  placeholder="กรอก Teacher Access Code..."
                  disabled={isLoading || remainingSeconds > 0}
                  className="w-full bg-slate-950 border-2 border-slate-700 focus:border-amber-500 rounded-2xl px-4 py-3 text-sm text-slate-100 font-mono tracking-wider focus:outline-none transition-colors disabled:opacity-50"
                  autoFocus
                />
                <KeyRound className="w-5 h-5 text-slate-500 absolute right-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit & Back Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                type="submit"
                disabled={isLoading || remainingSeconds > 0}
                className="w-full btn-game-orange text-slate-950 font-black py-3.5 px-6 rounded-2xl text-sm shadow-xl flex items-center justify-center space-x-2 transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span>กำลังตรวจสอบสิทธิ์...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>ENTER TEACHER MODE</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onBackToStudentMode}
                className="w-full bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white font-bold py-3 px-6 rounded-2xl text-xs border border-slate-700 transition-colors cursor-pointer"
              >
                BACK TO STUDENT MODE
              </button>
            </div>

          </form>

          {/* Security Notice Footer */}
          <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono flex items-center justify-center space-x-1.5">
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Role-Based Access Control (RBAC): STUDENT • TEACHER</span>
          </div>

        </div>
      </div>

    </div>
  );
};
