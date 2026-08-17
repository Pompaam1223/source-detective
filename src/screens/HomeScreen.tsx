import React from 'react';
import { Search, ShieldAlert, Sparkles, FolderKanban, GraduationCap, CheckCircle2, ArrowRight, Lightbulb, Compass, Award, BookOpen } from 'lucide-react';
import { AppScreen } from '../types';
import { COMPETENCY_DOMAINS } from '../data/indicators';
import {
  DetectiveCat,
  DetectiveBoySearch,
  DetectiveGirlFlashlight,
  DetectiveBoyPonder,
  DetectiveGirlBoard,
  DetectiveDog
} from '../components/characters/DetectiveCharacters';
import { PushPin, TapeSticker, PawPrint, GoldenMagnifierBadge } from '../components/decorations/DetectiveDecorations';

interface HomeScreenProps {
  onNavigate: (screen: AppScreen) => void;
  onOpenPoster?: () => void;
  onOpenTeacherPoster?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate, onOpenPoster, onOpenTeacherPoster }) => {
  return (
    <div className="space-y-10 py-4">
      
      {/* Hero Section: Detective Clubhouse / Office Theme */}
      <div className="relative bg-gradient-to-br from-amber-950/90 via-slate-950 to-slate-900 border-4 border-amber-500/40 rounded-3xl p-6 sm:p-10 text-slate-100 shadow-2xl overflow-hidden">
        
        {/* Background Decorative Elements & Paw Prints */}
        <div className="absolute right-4 top-4 opacity-20 pointer-events-none select-none flex space-x-2">
          <PawPrint size={36} color="#F59E0B" opacity={0.3} />
          <PawPrint size={36} color="#F59E0B" opacity={0.5} className="mt-4" />
        </div>
        <div className="absolute left-6 bottom-4 opacity-15 pointer-events-none select-none">
          <PawPrint size={44} color="#F59E0B" opacity={0.4} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Left Text & Slogan Area */}
          <div className="lg:col-span-7 space-y-5">
            
            <div className="inline-flex items-center space-x-2 bg-amber-500/20 border-2 border-amber-500/50 px-4 py-1.5 rounded-full text-amber-300 text-xs font-bold shadow-inner">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>สำนักงานนักสืบเยาวชน • SOURCE DETECTIVE CLUB</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl font-black font-mono tracking-tight leading-tight">
                <span className="text-amber-400 drop-shadow-[0_2px_10px_rgba(245,158,11,0.3)]">SOURCE DETECTIVE</span>
                <span className="text-slate-100 text-2xl sm:text-3xl block mt-1 font-sans">
                  เกมนักสืบแหล่งข้อมูล ปราบข่าวลวง! 🔍
                </span>
              </h1>
            </div>

            {/* Speech bubble badge from mascot */}
            <div className="relative bg-gradient-to-r from-amber-100 to-amber-200 text-slate-900 p-4 sm:p-5 rounded-2xl border-2 border-amber-400 shadow-lg font-bold">
              <div className="flex items-center space-x-2 text-amber-950 font-black text-sm sm:text-base mb-1">
                <Lightbulb className="w-5 h-5 text-amber-600 fill-amber-500" />
                <span>คำขวัญประจำหน่วยสืบสวน:</span>
              </div>
              <p className="text-amber-900 text-base sm:text-lg font-extrabold font-mono">
                "สืบให้ลึก • คิดให้รอบ • ตรวจสอบก่อนเชื่อ!"
              </p>
              {/* Speech bubble pointer */}
              <div className="absolute -bottom-3 left-10 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[12px] border-t-amber-400" />
            </div>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              สวมบทบาทเป็นยอดนักสืบข่าวสารรุ่นเยาว์ ฝึกฝนการคิดเชิงวิพากษ์ แยกแยะข้อเท็จจริง ตรวจสอบความน่าเชื่อถือของแหล่งข่าว และตัดสินใจอย่างชาญฉลาดผ่าน 4 ภารกิจสุดมันส์!
            </p>

            {/* Action Buttons as requested */}
            <div className="pt-3 flex flex-wrap gap-3 sm:gap-4 items-center">
              <button
                onClick={() => onNavigate('STUDENT_MODE')}
                className="btn-game-orange text-slate-950 font-black text-base px-7 py-3.5 rounded-2xl shadow-xl flex items-center space-x-2.5 group cursor-pointer"
              >
                <span>[เริ่มภารกิจนักสืบ]</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('SCORE_REPORT')}
                className="btn-game-blue text-white font-black text-base px-6 py-3.5 rounded-2xl shadow-lg flex items-center space-x-2 cursor-pointer"
              >
                <Award className="w-5 h-5" />
                <span>[ดูผลคะแนน & ใบรับรอง]</span>
              </button>

              {onOpenPoster && (
                <button
                  onClick={onOpenPoster}
                  className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-2 border-amber-500/50 font-bold text-base px-5 py-3.5 rounded-2xl shadow-lg flex items-center space-x-2 cursor-pointer transition-all active:scale-95"
                >
                  <span className="text-lg">📜</span>
                  <span>[ โปสเตอร์คู่มือนักเรียน ]</span>
                </button>
              )}

              {onOpenTeacherPoster && (
                <button
                  onClick={onOpenTeacherPoster}
                  className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-2 border-emerald-500/50 font-bold text-base px-5 py-3.5 rounded-2xl shadow-lg flex items-center space-x-2 cursor-pointer transition-all active:scale-95"
                >
                  <span className="text-lg">📊</span>
                  <span>[ โปสเตอร์คู่มือครู ]</span>
                </button>
              )}

              <button
                onClick={() => onNavigate('TEACHER_MODE')}
                className="btn-game-green text-white font-black text-base px-6 py-3.5 rounded-2xl shadow-lg flex items-center space-x-2 cursor-pointer"
              >
                <GraduationCap className="w-5 h-5" />
                <span>[ 🔐 TEACHER MODE ]</span>
              </button>
            </div>

          </div>

          {/* Right Cartoon Mascot & Squad Artwork */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            
            {/* Mascot Showcase Frame with Wood/Gold border */}
            <div className="relative bg-gradient-to-b from-amber-900/60 to-slate-900/90 border-4 border-amber-500/50 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center w-full max-w-sm">
              <PushPin color="red" className="absolute -top-3 left-6" />
              <PushPin color="yellow" className="absolute -top-3 right-6" />
              
              {/* Detective Cat Mascot */}
              <div className="relative animate-float-slow">
                <DetectiveCat size={140} variant="happy" />
              </div>

              <div className="mt-3 bg-slate-950/80 border border-amber-500/40 px-4 py-2 rounded-xl text-center">
                <p className="text-xs font-bold text-amber-300 font-mono">
                  🐱 ผู้ช่วยแคทล็อค (Catlock)
                </p>
                <p className="text-[11px] text-slate-300">
                  "ยินดีต้อนรับสู่สำนักงานนักสืบ พร้อมลุยคดีกันรึยังเหมียว?"
                </p>
              </div>

              {/* Sub-mascots mini preview */}
              <div className="flex items-center justify-center gap-3 mt-4 pt-3 border-t border-amber-500/30 w-full">
                <div className="flex items-center space-x-1 text-[11px] font-bold text-amber-300">
                  <span>🏆 ยศสูงสุด:</span>
                  <span className="text-white">ยอดนักสืบระดับ 4</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* 4 Missions Preview Cards: Cartoon Cast */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Compass className="w-6 h-6 text-amber-500" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">
              4 ภารกิจการสืบสวน (4 DETECTIVE MISSIONS)
            </h2>
          </div>
          <button
            onClick={() => onNavigate('STUDENT_MODE')}
            className="text-xs font-bold text-amber-500 hover:text-amber-400 hover:underline flex items-center space-x-1"
          >
            <span>เข้าสู่ศูนย์ภารกิจ</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Mission 1 Card */}
          <div 
            onClick={() => onNavigate('STUDENT_MODE')}
            className="bg-white dark:bg-slate-900 border-2 border-amber-400/40 hover:border-amber-500 rounded-3xl p-5 shadow-lg hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="bg-amber-500 text-slate-950 text-[10px] font-mono font-black px-2 py-0.5 rounded-md">
                  MISSION 1
                </span>
                <span className="text-[11px] font-bold text-amber-400">40 แต้ม</span>
              </div>
              <div className="flex justify-center py-2 group-hover:scale-105 transition-transform">
                <DetectiveBoySearch size={110} />
              </div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 group-hover:text-amber-400 transition-colors text-center mt-1">
                ใครพูด? เชื่อได้แค่ไหน?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-1">
                ตรวจสอบแหล่งที่มา เจ้าของข้อความ และผลประโยชน์แอบแฝง
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-center text-xs font-bold text-amber-500">
              เริ่มสืบคดี 1 →
            </div>
          </div>

          {/* Mission 2 Card */}
          <div 
            onClick={() => onNavigate('STUDENT_MODE')}
            className="bg-white dark:bg-slate-900 border-2 border-sky-400/40 hover:border-sky-500 rounded-3xl p-5 shadow-lg hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="bg-sky-500 text-white text-[10px] font-mono font-black px-2 py-0.5 rounded-md">
                  MISSION 2
                </span>
                <span className="text-[11px] font-bold text-sky-400">40 แต้ม</span>
              </div>
              <div className="flex justify-center py-2 group-hover:scale-105 transition-transform">
                <DetectiveGirlFlashlight size={110} />
              </div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 group-hover:text-sky-400 transition-colors text-center mt-1">
                หลักฐานอยู่ที่ไหน?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-1">
                ฉายไฟส่องค้นหาหลักฐานอ้างอิง เอกสารยืนยัน และข้อมูลปฐมภูมิ
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-center text-xs font-bold text-sky-500">
              เริ่มสืบคดี 2 →
            </div>
          </div>

          {/* Mission 3 Card */}
          <div 
            onClick={() => onNavigate('STUDENT_MODE')}
            className="bg-white dark:bg-slate-900 border-2 border-emerald-400/40 hover:border-emerald-500 rounded-3xl p-5 shadow-lg hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="bg-emerald-500 text-white text-[10px] font-mono font-black px-2 py-0.5 rounded-md">
                  MISSION 3
                </span>
                <span className="text-[11px] font-bold text-emerald-400">40 แต้ม</span>
              </div>
              <div className="flex justify-center py-2 group-hover:scale-105 transition-transform">
                <DetectiveBoyPonder size={110} />
              </div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 group-hover:text-emerald-400 transition-colors text-center mt-1">
                หลักฐานนี้น่าเชื่อแค่ไหน?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-1">
                ชั่งน้ำหนักหลักฐาน วิเคราะห์ความสมเหตุสมผล และตรวจสอบข้ามแหล่ง
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-center text-xs font-bold text-emerald-500">
              เริ่มสืบคดี 3 →
            </div>
          </div>

          {/* Mission 4 Card */}
          <div 
            onClick={() => onNavigate('STUDENT_MODE')}
            className="bg-white dark:bg-slate-900 border-2 border-purple-400/40 hover:border-purple-500 rounded-3xl p-5 shadow-lg hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="bg-purple-500 text-white text-[10px] font-mono font-black px-2 py-0.5 rounded-md">
                  MISSION 4
                </span>
                <span className="text-[11px] font-bold text-purple-400">40 แต้ม</span>
              </div>
              <div className="flex justify-center py-2 group-hover:scale-105 transition-transform">
                <DetectiveGirlBoard size={110} />
              </div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 group-hover:text-purple-400 transition-colors text-center mt-1">
                สรุปแล้วเชื่อหรือไม่?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-1">
                รวบรวมหลักฐานทั้งหมด ตัดสินใจขั้นสุดท้าย และให้เหตุผลอย่างรอบด้าน
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-center text-xs font-bold text-purple-500">
              เริ่มสืบคดี 4 →
            </div>
          </div>

        </div>
      </div>

      {/* 5 Core Competencies Grid */}
      <div className="space-y-4">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest block">
            CORE SKILL MODEL (20 INDICATORS)
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
            สมรรถนะการสืบสวนข่าวสาร 5 ด้าน
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            ครอบคลุมทักษะการคิด ตรวจสอบ แก้ปัญหา อธิบาย และปรับมุมมองทางความคิด
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-2">
          {Object.values(COMPETENCY_DOMAINS).map(dom => (
            <div
              key={dom.code}
              className={`p-4 rounded-2xl border ${dom.bgClass} flex flex-col justify-between space-y-3 shadow-sm hover:shadow-md transition-shadow`}
            >
              <div>
                <span className="text-[10px] font-mono font-extrabold bg-slate-900 text-amber-400 px-2 py-0.5 rounded">
                  {dom.code} (4 Indicators)
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-2.5">
                  {dom.titleTh}
                </h3>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {dom.subtitleTh}
                </p>
              </div>

              <div className="text-[10px] font-mono font-bold text-slate-500 border-t border-slate-200 dark:border-slate-800 pt-2">
                คะแนนเต็ม: 8 แต้ม
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

