import React from 'react';
import { Search, Shield, User, GraduationCap, FolderKanban, Award, Home, Sparkles, BarChart3 } from 'lucide-react';
import { AppScreen, Student } from '../types';
import { DetectiveCat } from './characters/DetectiveCharacters';

interface NavbarProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  currentStudent: Student | null;
  isPostTestInProgress?: boolean;
  onOpenPoster?: () => void;
  onOpenTeacherPoster?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  currentStudent,
  isPostTestInProgress = false,
  onOpenPoster,
  onOpenTeacherPoster
}) => {
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/80 text-slate-100 border-b-2 border-amber-500/40 shadow-xl backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Brand Logo & Name with Mascot Peek */}
        <div 
          onClick={() => {
            if (!isPostTestInProgress) onNavigate('HOME');
          }}
          className={`flex items-center space-x-3 group focus:outline-none ${isPostTestInProgress ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
        >
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 p-0.5 shadow-lg group-hover:scale-105 group-hover:rotate-3 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Search className="w-6 h-6 text-amber-400 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            {/* Cute mini cat ears badge */}
            <span className="absolute -top-2 -right-1 text-xs select-none animate-bounce">
              🐱
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-base sm:text-lg tracking-wider text-amber-400 font-mono drop-shadow">
                SOURCE DETECTIVE
              </span>
              <span className="hidden xl:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                ★ นักสืบแหล่งข้อมูล
              </span>
            </div>
            <p className="text-[11px] text-amber-200/80 tracking-tight hidden sm:flex items-center gap-1 font-medium">
              <span>สืบให้ลึก</span> • <span>คิดให้รอบ</span> • <span className="text-amber-400 font-bold">ตรวจสอบก่อนเชื่อ! 💡</span>
            </p>
          </div>
        </div>

        {/* Navigation Links or Post-Test Lock Notice */}
        {isPostTestInProgress ? (
          <div className="flex items-center space-x-2 bg-indigo-950/90 border-2 border-indigo-500 px-4 py-1.5 rounded-full text-indigo-200 text-xs font-mono font-bold animate-pulse shadow-lg">
            <Shield className="w-4 h-4 text-indigo-400" />
            <span>🔒 แบบประเมินหลังเรียน (POST-TEST) กำลังดำเนินการ</span>
          </div>
        ) : (
          <nav className="hidden md:flex items-center space-x-1.5 bg-slate-950/60 p-1.5 rounded-2xl border border-amber-500/20">
            <button
              onClick={() => onNavigate('HOME')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                currentScreen === 'HOME'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-amber-300'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>หน้าแรก</span>
            </button>

            <button
              onClick={() => onNavigate(currentStudent ? 'MISSION_MAP' : 'STUDENT_MODE')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                currentScreen === 'MISSION_MAP' || currentScreen === 'STUDENT_MODE' || currentScreen === 'MISSION_DETAIL'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-amber-300'
              }`}
            >
              <FolderKanban className="w-3.5 h-3.5" />
              <span>ศูนย์ภารกิจ</span>
            </button>

            <button
              onClick={() => onNavigate('EVIDENCE_PREVIEW')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                currentScreen === 'EVIDENCE_PREVIEW'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-amber-300'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>คลังหลักฐาน</span>
            </button>

            <button
              onClick={() => onNavigate('SCORE_REPORT')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                currentScreen === 'SCORE_REPORT'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-amber-400 hover:bg-slate-800 hover:text-amber-300'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>ดูผลคะแนน</span>
            </button>

            {onOpenPoster && (
              <button
                onClick={onOpenPoster}
                className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 text-amber-300 border border-amber-500/40 shadow-sm"
                title="เปิดโปสเตอร์คู่มือนักเรียน (Student Quick Start Poster)"
              >
                <span className="text-xs">📜</span>
                <span>คู่มือนักเรียน</span>
              </button>
            )}

            {onOpenTeacherPoster && (
              <button
                onClick={onOpenTeacherPoster}
                className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 hover:from-emerald-500/30 hover:to-emerald-600/30 text-emerald-300 border border-emerald-500/40 shadow-sm"
                title="เปิดโปสเตอร์คู่มือครูและนักวิจัย (Teacher Quick Start Poster)"
              >
                <span className="text-xs">📊</span>
                <span>คู่มือครู</span>
              </button>
            )}

            <button
              onClick={() => onNavigate('TEACHER_MODE')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                currentScreen === 'TEACHER_MODE'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                  : 'text-emerald-400 hover:bg-slate-800'
              }`}
              title="เข้าสู่โหมดครูผู้สอน (ต้องใช้ Teacher Access Code)"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>🔐 TEACHER MODE</span>
            </button>
          </nav>
        )}

        {/* Student Profile / Mode Switcher Badge */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Quick Score Report button on mobile */}
          <button
            onClick={() => onNavigate('SCORE_REPORT')}
            className={`md:hidden p-2 rounded-xl border transition-all ${
              currentScreen === 'SCORE_REPORT'
                ? 'bg-amber-500 text-slate-950 border-amber-400'
                : 'bg-slate-900 text-amber-400 border-amber-500/30'
            }`}
            title="ดูผลคะแนน"
          >
            <BarChart3 className="w-4 h-4" />
          </button>

          {currentStudent ? (
            <div 
              onClick={() => onNavigate('STUDENT_MODE')}
              className="flex items-center space-x-2 bg-gradient-to-r from-slate-900 to-amber-950/60 border-2 border-amber-500/40 hover:border-amber-400 px-3.5 py-1.5 rounded-2xl cursor-pointer shadow hover:shadow-amber-500/20 transition-all group"
              title="โปรไฟล์นักสืบ & สลับบัญชี"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs border border-amber-500/40 group-hover:rotate-6 transition-transform">
                🕵️
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-slate-100 group-hover:text-amber-300 transition-colors leading-tight">
                  {currentStudent.nickname || currentStudent.firstName || 'นักสืบเยาวชน'}
                </p>
                <div className="flex items-center space-x-1 text-[10px] text-amber-400 font-mono mt-0.5">
                  <span className="bg-amber-500/20 px-1.5 py-0.2 rounded font-bold">ID: {currentStudent.studentId}</span>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => onNavigate('STUDENT_MODE')}
              className="btn-game-orange text-slate-950 px-4 py-2 rounded-xl font-black text-xs shadow-lg flex items-center space-x-1.5 cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>เข้าสู่ระบบ / สมัครนักสืบ</span>
            </button>
          )}

          {/* Teacher Mode Fast Toggle Mobile */}
          <button
            onClick={() => onNavigate(currentScreen === 'TEACHER_MODE' ? 'HOME' : 'TEACHER_MODE')}
            className={`md:hidden p-2 rounded-xl border transition-all ${
              currentScreen === 'TEACHER_MODE'
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                : 'bg-slate-900 text-emerald-400 border-emerald-500/30'
            }`}
            title="🔐 TEACHER MODE (โหมดครูผู้สอน)"
          >
            <div className="flex items-center gap-0.5">
              <span className="text-[10px]">🔐</span>
              <GraduationCap className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>

      </div>
    </header>
  );
};

