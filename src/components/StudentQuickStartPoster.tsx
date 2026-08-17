import React, { useRef } from 'react';
import { 
  Search, 
  Shield, 
  UserCheck, 
  Bot, 
  Award, 
  Printer, 
  X, 
  CheckCircle2, 
  Sparkles, 
  Compass, 
  Lightbulb, 
  KeyRound, 
  Target, 
  FileText, 
  Layers,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { 
  DetectiveCat, 
  DetectiveBoySearch, 
  DetectiveGirlFlashlight, 
  DetectiveDog 
} from './characters/DetectiveCharacters';

interface StudentQuickStartPosterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudentQuickStartPoster: React.FC<StudentQuickStartPosterProps> = ({ isOpen, onClose }) => {
  const posterRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      {/* Container / Modal Wrapper */}
      <div className="relative w-full max-w-4xl bg-slate-900 border-2 border-amber-500/50 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col">
        
        {/* Floating Top Control Bar (Hidden in Print) */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950 border-b border-amber-500/30 text-slate-200 shrink-0 print:hidden">
          <div className="flex items-center space-x-2">
            <span className="text-xl">📜</span>
            <h2 className="font-bold text-amber-400 text-sm sm:text-base font-mono">
              โปสเตอร์คู่มือนักเรียน (Student Quick Start Poster)
            </h2>
            <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 font-sans">
              Printable Infographic
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer"
              title="พิมพ์โปสเตอร์ขนาด A4/A3 หรือบันทึกเป็น PDF"
            >
              <Printer className="w-4 h-4" />
              <span>พิมพ์ / บันทึก PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-xl transition cursor-pointer"
              title="ปิดหน้าต่าง"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Poster Content Area (Scrollable on screen, Full size in print) */}
        <div className="overflow-y-auto p-4 sm:p-8 bg-gradient-to-b from-amber-50/20 via-slate-950 to-slate-950 text-slate-100 print:p-0 print:bg-white print:text-slate-900 print:overflow-visible">
          
          <div 
            ref={posterRef}
            className="w-full max-w-3xl mx-auto bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-4 border-amber-400/80 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden print:border-2 print:border-amber-600 print:rounded-none print:shadow-none print:p-6 print:bg-white print:text-slate-900"
          >
            
            {/* Corner Decorative Pins */}
            <div className="absolute top-4 left-4 w-4 h-4 rounded-full bg-amber-400 border-2 border-amber-600 shadow print:hidden"></div>
            <div className="absolute top-4 right-4 w-4 h-4 rounded-full bg-amber-400 border-2 border-amber-600 shadow print:hidden"></div>
            <div className="absolute bottom-4 left-4 w-4 h-4 rounded-full bg-amber-400 border-2 border-amber-600 shadow print:hidden"></div>
            <div className="absolute bottom-4 right-4 w-4 h-4 rounded-full bg-amber-400 border-2 border-amber-600 shadow print:hidden"></div>

            {/* Poster Header */}
            <div className="text-center space-y-3 pb-6 border-b-2 border-amber-500/40 print:border-amber-600 print:pb-4">
              
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider print:bg-amber-100 print:text-amber-900 print:border-amber-400">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>STUDENT QUICK START GUIDE • คู่มือนักสืบไซเบอร์รุ่นเยาว์</span>
              </div>

              <div className="flex items-center justify-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 p-1 flex items-center justify-center shadow-lg text-slate-950">
                  <Search className="w-7 h-7 stroke-[2.5]" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-4xl font-black font-mono tracking-tight text-amber-400 print:text-amber-800">
                    SOURCE DETECTIVE
                  </h1>
                  <p className="text-sm sm:text-base font-bold text-slate-200 print:text-slate-800">
                    4 ขั้นตอนพิชิตภารกิจสืบสวน ปราบข่าวลวงในโลกดิจิทัล! 🔍
                  </p>
                </div>
              </div>

              {/* Slogan Banner */}
              <div className="bg-gradient-to-r from-amber-950/80 via-amber-900/60 to-amber-950/80 border border-amber-500/40 rounded-xl py-2 px-4 inline-block print:bg-amber-50 print:border-amber-300">
                <p className="text-xs sm:text-sm font-extrabold text-amber-200 print:text-amber-900 font-mono">
                  💡 คำขวัญประจำหน่วย: <span className="text-amber-400 print:text-amber-700">"สืบให้ลึก • คิดให้รอบ • ตรวจสอบก่อนเชื่อ!"</span>
                </p>
              </div>
            </div>

            {/* 4 Step Journey (The Core Infographic) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 my-6 print:my-4">
              
              {/* STEP 1 */}
              <div className="bg-slate-900/90 border-2 border-sky-500/40 rounded-2xl p-4 sm:p-5 relative space-y-3 shadow-lg print:border-sky-600 print:bg-sky-50/50 print:p-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-lg bg-sky-500 text-slate-950 font-black text-xs font-mono shadow">
                    STEP 01
                  </span>
                  <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400 print:text-sky-700">
                    <KeyRound className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-black text-sky-400 print:text-sky-900 flex items-center gap-1.5">
                    <span>1. เข้าสู่ฐาน & สร้างตัวตน</span>
                  </h3>
                  <p className="text-xs text-slate-300 print:text-slate-700 mt-1 leading-relaxed">
                    กรอก <strong className="text-sky-300 print:text-sky-800">Username / Password</strong> ที่ได้รับจากคุณครู หรือเข้าสู่ระบบด้วย Google Account จากนั้นเลือก <strong className="text-amber-300 print:text-amber-800">ฉายานักสืบ (Alias)</strong> และ Avatar ประจำตัว
                  </p>
                </div>

                <div className="bg-sky-950/60 border border-sky-500/30 rounded-xl p-2.5 text-[11px] text-sky-200 print:bg-white print:text-sky-900 print:border-sky-200 flex items-start gap-2">
                  <span className="text-xs">🔑</span>
                  <span><strong>เคล็ดลับ:</strong> จดจำ Student ID เช่น <code className="bg-sky-900/60 px-1 py-0.5 rounded text-sky-300 print:bg-sky-100 print:text-sky-800">SD-XXXXX</code> ไว้ดูผลการสืบสวน!</span>
                </div>
              </div>

              {/* STEP 2 */}
              <div className="bg-slate-900/90 border-2 border-emerald-500/40 rounded-2xl p-4 sm:p-5 relative space-y-3 shadow-lg print:border-emerald-600 print:bg-emerald-50/50 print:p-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-lg bg-emerald-500 text-slate-950 font-black text-xs font-mono shadow">
                    STEP 02
                  </span>
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 print:text-emerald-700">
                    <Target className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-black text-emerald-400 print:text-emerald-900 flex items-center gap-1.5">
                    <span>2. วัดพลังสายตานักสืบ (Pre-Test)</span>
                  </h3>
                  <p className="text-xs text-slate-300 print:text-slate-700 mt-1 leading-relaxed">
                    ทำแบบทดสอบวินิจฉัยก่อนเรียน <strong className="text-emerald-300 print:text-emerald-800">10 ข้อ (เต็ม 40 คะแนน)</strong> โดยวิเคราะห์สถานการณ์ข่าวลวงจริง เพื่อปลดล็อกเข็มกลัดนักสืบฝึกหัด
                  </p>
                </div>

                <div className="bg-emerald-950/60 border border-emerald-500/30 rounded-xl p-2.5 text-[11px] text-emerald-200 print:bg-white print:text-emerald-900 print:border-emerald-200 flex items-start gap-2">
                  <span className="text-xs">🎯</span>
                  <span><strong>ไม่ต้องกังวล:</strong> ทำตามความเข้าใจจริง เพื่อวัดพลังการคิดก่อนเริ่มฝึกฝน</span>
                </div>
              </div>

              {/* STEP 3 */}
              <div className="bg-slate-900/90 border-2 border-amber-500/40 rounded-2xl p-4 sm:p-5 relative space-y-3 shadow-lg print:border-amber-600 print:bg-amber-50/50 print:p-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-lg bg-amber-500 text-slate-950 font-black text-xs font-mono shadow">
                    STEP 03
                  </span>
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 print:text-amber-700">
                    <Layers className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-black text-amber-400 print:text-amber-900 flex items-center gap-1.5">
                    <span>3. ตะลุย 4 ภารกิจ & ผู้ช่วย AI</span>
                  </h3>
                  <p className="text-xs text-slate-300 print:text-slate-700 mt-1 leading-relaxed">
                    ฝึกฝน 4 ด่านสืบสวนเข้มข้น (ด่านละ 16 ข้อ):
                  </p>
                  <ul className="text-[11px] text-slate-300 print:text-slate-800 space-y-1 mt-1.5 pl-2 border-l-2 border-amber-500/40">
                    <li>🔍 <strong>M1:</strong> ตรวจแหล่งข่าว & สัญญาณน่าสงสัย</li>
                    <li>⚖️ <strong>M2:</strong> แยกข้อเท็จจริง vs ความเห็น & จัดลำดับสืบ</li>
                    <li>📂 <strong>M3:</strong> เก็บหลักฐานลง Evidence Locker</li>
                    <li>🛡️ <strong>M4:</strong> เช็กอคติ & ตัดสินใจก่อนแชร์</li>
                  </ul>
                </div>

                <div className="bg-amber-950/60 border border-amber-500/30 rounded-xl p-2.5 text-[11px] text-amber-200 print:bg-white print:text-amber-900 print:border-amber-200 flex items-start gap-2">
                  <span className="text-xs">🤖</span>
                  <span><strong>AI Socratic Helper:</strong> หากติดขัด กดปุ่ม AI เพื่อขอคำถามชวนคิด (AI จะไม่บอกคำตอบตรงๆ แต่จะช่วยใบ้ให้คิดออก!)</span>
                </div>
              </div>

              {/* STEP 4 */}
              <div className="bg-slate-900/90 border-2 border-purple-500/40 rounded-2xl p-4 sm:p-5 relative space-y-3 shadow-lg print:border-purple-600 print:bg-purple-50/50 print:p-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-lg bg-purple-500 text-slate-950 font-black text-xs font-mono shadow">
                    STEP 04
                  </span>
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 print:text-purple-700">
                    <Award className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-black text-purple-400 print:text-purple-900 flex items-center gap-1.5">
                    <span>4. บททดสอบหลังเรียน & รับเหรียญ</span>
                  </h3>
                  <p className="text-xs text-slate-300 print:text-slate-700 mt-1 leading-relaxed">
                    ทำแบบทดสอบ <strong className="text-purple-300 print:text-purple-800">Post-Test 10 ข้อ (เต็ม 40 คะแนน)</strong> เพื่อดูพัฒนาการการเรียนรู้ (Normalized Gain) และคะแนนรวมสะสมทั้งระบบ <strong className="text-amber-300 print:text-amber-800">เต็ม 240 คะแนน</strong>
                  </p>
                </div>

                <div className="bg-purple-950/60 border border-purple-500/30 rounded-xl p-2.5 text-[11px] text-purple-200 print:bg-white print:text-purple-900 print:border-purple-200 flex items-start gap-2">
                  <span className="text-xs">🏆</span>
                  <span><strong>Master Detective:</strong> รับเกียรติบัตรยอดนักสืบและตรวจสอบสถิติ 20 ตัวชี้วัดของคุณ!</span>
                </div>
              </div>

            </div>

            {/* 5 MIDL Competency Superpowers */}
            <div className="bg-slate-900/95 border-2 border-amber-500/30 rounded-2xl p-4 sm:p-5 space-y-3 print:border-amber-600 print:bg-white print:p-4">
              <div className="flex items-center space-x-2 text-amber-400 print:text-amber-800">
                <Sparkles className="w-4 h-4" />
                <h4 className="font-extrabold text-xs sm:text-sm uppercase tracking-wider font-mono">
                  5 พลังสมรรถนะการรู้เท่าทันสื่อ (MIDL Superpowers)
                </h4>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-2.5 print:bg-slate-50 print:border-slate-300">
                  <span className="text-base sm:text-lg block">🧠</span>
                  <strong className="text-amber-300 print:text-amber-800 block mt-1 font-mono">THINK</strong>
                  <span className="text-[10px] text-slate-300 print:text-slate-600">คิดแยกแยะ Fact vs Opinion</span>
                </div>

                <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-2.5 print:bg-slate-50 print:border-slate-300">
                  <span className="text-base sm:text-lg block">🔍</span>
                  <strong className="text-sky-300 print:text-sky-800 block mt-1 font-mono">CHECK</strong>
                  <span className="text-[10px] text-slate-300 print:text-slate-600">ตรวจที่มา & เช็กข้ามแหล่ง</span>
                </div>

                <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-2.5 print:bg-slate-50 print:border-slate-300">
                  <span className="text-base sm:text-lg block">🧩</span>
                  <strong className="text-emerald-300 print:text-emerald-800 block mt-1 font-mono">SOLVE</strong>
                  <span className="text-[10px] text-slate-300 print:text-slate-600">วางขั้นตอนสืบสวนเป็นระบบ</span>
                </div>

                <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-2.5 print:bg-slate-50 print:border-slate-300">
                  <span className="text-base sm:text-lg block">💬</span>
                  <strong className="text-rose-300 print:text-rose-800 block mt-1 font-mono">EXPLAIN</strong>
                  <span className="text-[10px] text-slate-300 print:text-slate-600">อธิบายด้วยหลักฐานเชิงประจักษ์</span>
                </div>

                <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-2.5 col-span-2 sm:col-span-1 print:bg-slate-50 print:border-slate-300">
                  <span className="text-base sm:text-lg block">🌱</span>
                  <strong className="text-purple-300 print:text-purple-800 block mt-1 font-mono">GROW</strong>
                  <span className="text-[10px] text-slate-300 print:text-slate-600">ทบทวนตนเอง & ปรับมุมมอง</span>
                </div>
              </div>
            </div>

            {/* Poster Footer Info */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 print:text-slate-600 print:border-slate-300 gap-2">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-amber-500" />
                <span>SOURCE DETECTIVE • แพลตฟอร์มวิจัยและการประเมินสมรรถนะการรู้เท่าทันสื่อ ชั้น ม.1</span>
              </div>
              <div className="font-mono text-amber-400/90 print:text-amber-800 font-bold">
                100% Cloud Verified • Anonymized Research Data
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
