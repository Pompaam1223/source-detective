import React, { useRef } from 'react';
import { 
  ShieldCheck, 
  Users, 
  BarChart3, 
  FileSpreadsheet, 
  Printer, 
  X, 
  Sparkles, 
  Database, 
  Award, 
  BrainCircuit, 
  Layers, 
  TrendingUp, 
  GraduationCap, 
  FileText,
  Lock
} from 'lucide-react';

interface TeacherQuickStartPosterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TeacherQuickStartPoster: React.FC<TeacherQuickStartPosterProps> = ({ isOpen, onClose }) => {
  const posterRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      {/* Container / Modal Wrapper */}
      <div className="relative w-full max-w-4xl bg-slate-900 border-2 border-emerald-500/50 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col">
        
        {/* Floating Top Control Bar (Hidden in Print) */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950 border-b border-emerald-500/30 text-slate-200 shrink-0 print:hidden">
          <div className="flex items-center space-x-2">
            <span className="text-xl">📊</span>
            <h2 className="font-bold text-emerald-400 text-sm sm:text-base font-mono">
              โปสเตอร์คู่มือครูผู้สอนและนักวิจัย (Teacher & Researcher Guide Poster)
            </h2>
            <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-sans">
              Printable Infographic
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer"
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

        {/* Poster Content Area */}
        <div className="overflow-y-auto p-4 sm:p-8 bg-gradient-to-b from-emerald-950/20 via-slate-950 to-slate-950 text-slate-100 print:p-0 print:bg-white print:text-slate-900 print:overflow-visible">
          
          <div 
            ref={posterRef}
            className="w-full max-w-3xl mx-auto bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-4 border-emerald-400/80 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden print:border-2 print:border-emerald-700 print:rounded-none print:shadow-none print:p-6 print:bg-white print:text-slate-900"
          >
            
            {/* Corner Decorative Pins */}
            <div className="absolute top-4 left-4 w-4 h-4 rounded-full bg-emerald-400 border-2 border-emerald-600 shadow print:hidden"></div>
            <div className="absolute top-4 right-4 w-4 h-4 rounded-full bg-emerald-400 border-2 border-emerald-600 shadow print:hidden"></div>
            <div className="absolute bottom-4 left-4 w-4 h-4 rounded-full bg-emerald-400 border-2 border-emerald-600 shadow print:hidden"></div>
            <div className="absolute bottom-4 right-4 w-4 h-4 rounded-full bg-emerald-400 border-2 border-emerald-600 shadow print:hidden"></div>

            {/* Poster Header */}
            <div className="text-center space-y-3 pb-6 border-b-2 border-emerald-500/40 print:border-emerald-600 print:pb-4">
              
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider print:bg-emerald-100 print:text-emerald-900 print:border-emerald-400">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>TEACHER & RESEARCHER PORTAL • คู่มือครูและนักวิจัย</span>
              </div>

              <div className="flex items-center justify-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 p-1 flex items-center justify-center shadow-lg text-slate-950">
                  <GraduationCap className="w-7 h-7 stroke-[2.5]" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-4xl font-black font-mono tracking-tight text-emerald-400 print:text-emerald-800">
                    SOURCE DETECTIVE
                  </h1>
                  <p className="text-sm sm:text-base font-bold text-slate-200 print:text-slate-800">
                    ระบบบริหารจัดการ ประเมินสมรรถนะ และส่งออกข้อมูลวิจัยชั้นเรียน 📊
                  </p>
                </div>
              </div>

              {/* Slogan Banner */}
              <div className="bg-gradient-to-r from-emerald-950/80 via-emerald-900/60 to-emerald-950/80 border border-emerald-500/40 rounded-xl py-2 px-4 inline-block print:bg-emerald-50 print:border-emerald-300">
                <p className="text-xs sm:text-sm font-extrabold text-emerald-200 print:text-emerald-900 font-mono">
                  🔬 นวัตกรรมการประเมิน: <span className="text-emerald-400 print:text-emerald-700">"ประเมินตามสภาพจริง • ติดตามเรียลไทม์ • พร้อมส่งออก SPSS ทันที"</span>
                </p>
              </div>
            </div>

            {/* 4 Core Teacher Modules */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 my-6 print:my-4">
              
              {/* SECTION 1: Classroom Monitoring */}
              <div className="bg-slate-900/90 border-2 border-emerald-500/40 rounded-2xl p-4 sm:p-5 relative space-y-3 shadow-lg print:border-emerald-600 print:bg-emerald-50/50 print:p-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-lg bg-emerald-500 text-slate-950 font-black text-xs font-mono shadow">
                    MODULE 01
                  </span>
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 print:text-emerald-700">
                    <Users className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-black text-emerald-400 print:text-emerald-900 flex items-center gap-1.5">
                    <span>1. ติดตามผู้เรียนแบบเรียลไทม์ (Live Class)</span>
                  </h3>
                  <p className="text-xs text-slate-300 print:text-slate-700 mt-1 leading-relaxed">
                    ตรวจเช็กสถานะความก้าวหน้ารายบุคคลตั้งแต่ <strong className="text-emerald-300 print:text-emerald-800">Pre-test $\rightarrow$ Missions 1–4 $\rightarrow$ Post-test</strong> พร้อมระบบคำนวณคะแนนสะสมอัตโนมัติเต็ม 240 คะแนน
                  </p>
                </div>

                <div className="bg-emerald-950/60 border border-emerald-500/30 rounded-xl p-2.5 text-[11px] text-emerald-200 print:bg-white print:text-emerald-900 print:border-emerald-200 flex items-start gap-2">
                  <span className="text-xs">👥</span>
                  <span><strong>จัดการบัญชี:</strong> สร้างรหัสผ่านนักเรียน และดูรหัสประจำตัว เช่น <code className="bg-emerald-900/60 px-1 py-0.5 rounded text-emerald-300 print:bg-emerald-100 print:text-emerald-800">SD-2ETP3</code> ได้ทันที</span>
                </div>
              </div>

              {/* SECTION 2: 20 Indicators Analytics */}
              <div className="bg-slate-900/90 border-2 border-sky-500/40 rounded-2xl p-4 sm:p-5 relative space-y-3 shadow-lg print:border-sky-600 print:bg-sky-50/50 print:p-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-lg bg-sky-500 text-slate-950 font-black text-xs font-mono shadow">
                    MODULE 02
                  </span>
                  <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400 print:text-sky-700">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-black text-sky-400 print:text-sky-900 flex items-center gap-1.5">
                    <span>2. วิเคราะห์สมรรถนะ 20 Indicators</span>
                  </h3>
                  <p className="text-xs text-slate-300 print:text-slate-700 mt-1 leading-relaxed">
                    ระบบประเมิน 5 โดเมน <strong className="text-sky-300 print:text-sky-800">THINK, CHECK, SOLVE, EXPLAIN, GROW</strong> วิเคราะห์จุดเด่นรายบุคคล และตัวชี้วัดที่ควรจัดกิจกรรมส่งเสริมเพิ่มเติม
                  </p>
                </div>

                <div className="bg-sky-950/60 border border-sky-500/30 rounded-xl p-2.5 text-[11px] text-sky-200 print:bg-white print:text-sky-900 print:border-sky-200 flex items-start gap-2">
                  <span className="text-xs">📈</span>
                  <span><strong>Normalized Gain ($g$):</strong> ตรวจสอบอัตราพัฒนาการตามสูตร Hake (1998) จำแนกรายบุคคลและภาพรวมชั้น</span>
                </div>
              </div>

              {/* SECTION 3: Evidence & AI Telemetry */}
              <div className="bg-slate-900/90 border-2 border-amber-500/40 rounded-2xl p-4 sm:p-5 relative space-y-3 shadow-lg print:border-amber-600 print:bg-amber-50/50 print:p-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-lg bg-amber-500 text-slate-950 font-black text-xs font-mono shadow">
                    MODULE 03
                  </span>
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 print:text-amber-700">
                    <BrainCircuit className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-black text-amber-400 print:text-amber-900 flex items-center gap-1.5">
                    <span>3. คลังหลักฐาน & บันทึกการถาม AI</span>
                  </h3>
                  <p className="text-xs text-slate-300 print:text-slate-700 mt-1 leading-relaxed">
                    ตรวจสอบหลักฐานใน <strong className="text-amber-300 print:text-amber-800">Evidence Locker</strong> ที่นักเรียนรวบรวม พร้อมดูบันทึกคำถาม-คำตอบ <strong className="text-sky-300 print:text-sky-800">AI Socratic Helper</strong> เพื่อประเมินพฤติกรรมการสืบค้นเชิงลึก
                  </p>
                </div>

                <div className="bg-amber-950/60 border border-amber-500/30 rounded-xl p-2.5 text-[11px] text-amber-200 print:bg-white print:text-amber-900 print:border-amber-200 flex items-start gap-2">
                  <span className="text-xs">🔍</span>
                  <span><strong>Forensic Verification:</strong> ยืนยันความถูกต้องของชิ้นส่วนหลักฐานเทียบกับเกณฑ์ Rubric 100%</span>
                </div>
              </div>

              {/* SECTION 4: 1-Click Research Export */}
              <div className="bg-slate-900/90 border-2 border-purple-500/40 rounded-2xl p-4 sm:p-5 relative space-y-3 shadow-lg print:border-purple-600 print:bg-purple-50/50 print:p-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-lg bg-purple-500 text-slate-950 font-black text-xs font-mono shadow">
                    MODULE 04
                  </span>
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 print:text-purple-700">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-black text-purple-400 print:text-purple-900 flex items-center gap-1.5">
                    <span>4. ส่งออกชุดข้อมูลวิจัย 14 ไฟล์ (1-Click Export)</span>
                  </h3>
                  <p className="text-xs text-slate-300 print:text-slate-700 mt-1 leading-relaxed">
                    ดาวน์โหลดชุดไฟล์วิจัยสมบูรณ์ เช่น <strong className="text-purple-300 print:text-purple-800">SPSS Master Dataset (.csv)</strong>, SPSS Codebook, Item-Level 840 Records และ Research Analysis Pack (.md)
                  </p>
                </div>

                <div className="bg-purple-950/60 border border-purple-500/30 rounded-xl p-2.5 text-[11px] text-purple-200 print:bg-white print:text-purple-900 print:border-purple-200 flex items-start gap-2">
                  <span className="text-xs">📊</span>
                  <span><strong>SPSS Ready:</strong> นำไฟล์ไปวิเคราะห์ Paired t-test, ANOVA หรือ Effect Size ในโปรแกรมสถิติได้ทันที</span>
                </div>
              </div>

            </div>

            {/* Research Summary Matrix Banner */}
            <div className="bg-slate-900/95 border-2 border-emerald-500/30 rounded-2xl p-4 sm:p-5 space-y-3 print:border-emerald-600 print:bg-white print:p-4">
              <div className="flex items-center justify-between text-emerald-400 print:text-emerald-800">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <h4 className="font-extrabold text-xs sm:text-sm uppercase tracking-wider font-mono">
                    ชุดข้อมูลวิจัยระดับมาตรฐาน (Research Rigor Specifications)
                  </h4>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 print:bg-emerald-100 print:text-emerald-900">
                  Level-3 Dataset
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-2.5 print:bg-slate-50 print:border-slate-300">
                  <strong className="text-emerald-300 print:text-emerald-800 block font-mono text-base">840 Records</strong>
                  <span className="text-[10px] text-slate-300 print:text-slate-600">Item-level 10 คน $\times$ 84 ข้อ</span>
                </div>

                <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-2.5 print:bg-slate-50 print:border-slate-300">
                  <strong className="text-sky-300 print:text-sky-800 block font-mono text-base">20 Indicators</strong>
                  <span className="text-[10px] text-slate-300 print:text-slate-600">T1–T4, C1–C4, S1–S4, E1–E4, G1–G4</span>
                </div>

                <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-2.5 print:bg-slate-50 print:border-slate-300">
                  <strong className="text-amber-300 print:text-amber-800 block font-mono text-base">g = 0.9479</strong>
                  <span className="text-[10px] text-slate-300 print:text-slate-600">Mean Normalized Gain (High)</span>
                </div>

                <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-2.5 print:bg-slate-50 print:border-slate-300">
                  <strong className="text-purple-300 print:text-purple-800 block font-mono text-base">100% Anonymized</strong>
                  <span className="text-[10px] text-slate-300 print:text-slate-600">ความปลอดภัยไร้ PII ตามจริยธรรม</span>
                </div>
              </div>
            </div>

            {/* Poster Footer Info */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 print:text-slate-600 print:border-slate-300 gap-2">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>SOURCE DETECTIVE • แพลตฟอร์มบริหารจัดการและประเมินผลการเรียนรู้งานวิจัยในชั้นเรียน</span>
              </div>
              <div className="font-mono text-emerald-400/90 print:text-emerald-800 font-bold">
                Cloud Firestore Secured • ISO 8601 UTC Logs
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
