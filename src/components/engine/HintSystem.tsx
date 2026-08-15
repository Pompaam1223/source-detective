import React, { useState } from 'react';
import { Lightbulb, HelpCircle, X, Sparkles, Shield } from 'lucide-react';

interface HintSystemProps {
  hintText?: string;
  rubricHint?: string;
  onHintUsed?: () => void;
}

export const HintSystem: React.FC<HintSystemProps> = ({
  hintText,
  rubricHint,
  onHintUsed
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  if (!hintText && !rubricHint) {
    return null;
  }

  const handleOpen = () => {
    setIsOpen(true);
    if (!hasOpened) {
      setHasOpened(true);
      if (onHintUsed) onHintUsed();
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-500 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 px-3 py-1.5 rounded-xl flex items-center space-x-1.5 transition-all shadow-sm"
      >
        <Lightbulb className="w-3.5 h-3.5" />
        <span>คำใบ้นักสืบ</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 max-w-md w-full text-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-amber-400 font-extrabold">
                <Lightbulb className="w-5 h-5" />
                <span>คำแนะนำกระบวนการสืบสวน</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
              {hintText && (
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-xs font-mono font-bold text-amber-400 flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>คำใบ้ (Hint):</span>
                  </span>
                  <p className="text-slate-200">{hintText}</p>
                </div>
              )}

              {rubricHint && (
                <div className="bg-sky-950/40 p-4 rounded-2xl border border-sky-800/40 space-y-1">
                  <span className="text-xs font-mono font-bold text-sky-400 flex items-center space-x-1">
                    <Shield className="w-3.5 h-3.5" />
                    <span>เกณฑ์การพิจารณา (Rubric Focus):</span>
                  </span>
                  <p className="text-sky-200">{rubricHint}</p>
                </div>
              )}

              <p className="text-[11px] text-slate-400 italic">
                * คำใบ้เน้นให้สังเกตองค์ประกอบของหลักฐานและวิธีการคิด ไม่เปิดเผยเฉลยคำตอบ
              </p>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition-colors"
            >
              เข้าใจแล้ว
            </button>
          </div>
        </div>
      )}
    </>
  );
};
