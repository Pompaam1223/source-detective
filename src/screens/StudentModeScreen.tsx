import React, { useState, useEffect } from 'react';
import { StorageService } from '../engine/StorageService';
import { Student, StudentAccount, AppScreen } from '../types';
import {
  Shield,
  ArrowRight,
  Lock,
  User,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  LogOut,
  Compass,
  Copy,
  Check,
  HelpCircle,
  Fingerprint
} from 'lucide-react';
import { DetectiveCat, DetectiveDog } from '../components/characters/DetectiveCharacters';
import { PushPin, TapeSticker } from '../components/decorations/DetectiveDecorations';
import {
  validateNickname,
  validateUsername,
  validatePassword,
  hashPassword
} from '../utils/security';

interface StudentModeScreenProps {
  currentStudent: Student | null;
  onStudentSaved: (student: Student) => void;
  onNavigate: (screen: AppScreen) => void;
}

type AuthMode = 'REGISTER' | 'LOGIN' | 'LOGGED_IN';

export const StudentModeScreen: React.FC<StudentModeScreenProps> = ({
  currentStudent,
  onStudentSaved,
  onNavigate
}) => {
  // If student is already active, default to LOGGED_IN view, else LOGIN if accounts exist, else REGISTER
  const [authMode, setAuthMode] = useState<AuthMode>(() => {
    if (currentStudent) return 'LOGGED_IN';
    const accounts = StorageService.getAllAccounts();
    return accounts.length > 0 ? 'LOGIN' : 'REGISTER';
  });

  // Registration Fields
  const [regNickname, setRegNickname] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Login Fields
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // UI States
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successAccount, setSuccessAccount] = useState<StudentAccount | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Switch to LOGGED_IN if student exists
  useEffect(() => {
    if (currentStudent && authMode !== 'REGISTER' && authMode !== 'LOGIN') {
      setAuthMode('LOGGED_IN');
    }
  }, [currentStudent]);

  // Handle Registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // 1. Validate Nickname
    const nickVal = validateNickname(regNickname);
    if (!nickVal.isValid) {
      setErrorMessage(nickVal.error || 'กรุณากรอกฉายานักสืบ');
      return;
    }

    // 2. Validate Username
    const userVal = validateUsername(regUsername);
    if (!userVal.isValid) {
      setErrorMessage(userVal.error || 'Username ไม่ถูกต้อง');
      return;
    }

    // 3. Validate Password
    const passVal = validatePassword(regPassword);
    if (!passVal.isValid) {
      setErrorMessage(passVal.error || 'รหัสผ่านไม่ถูกต้อง');
      return;
    }

    // 4. Check Confirm Password
    if (regPassword !== regConfirmPassword) {
      setErrorMessage('รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง');
      return;
    }

    setIsSubmitting(true);

    try {
      // Hash password (SHA-256)
      const passwordHash = await hashPassword(regPassword);

      // Register into StorageService
      const result = StorageService.registerAccount(
        regNickname,
        regUsername,
        passwordHash
      );

      if (!result.success || !result.account || !result.student) {
        setErrorMessage(result.error || 'เกิดข้อผิดพลาดในการลงทะเบียน');
        setIsSubmitting(false);
        return;
      }

      // Success! Show Detective ID Card confirmation
      setSuccessAccount(result.account);
      onStudentSaved(result.student);
      setIsSubmitting(false);
    } catch (err) {
      console.error('Registration failed:', err);
      setErrorMessage('เกิดข้อผิดพลาดไม่ทราบสาเหตุ กรุณาลองใหม่อีกครั้ง');
      setIsSubmitting(false);
    }
  };

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!loginUsername.trim()) {
      setErrorMessage('กรุณากรอก Username');
      return;
    }

    if (!loginPassword) {
      setErrorMessage('กรุณากรอกรหัสผ่าน (Password)');
      return;
    }

    setIsSubmitting(true);

    try {
      const passwordHash = await hashPassword(loginPassword);
      const result = StorageService.login(loginUsername, passwordHash);

      if (!result.success || !result.account || !result.student) {
        setErrorMessage(result.error || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
        setIsSubmitting(false);
        return;
      }

      onStudentSaved(result.student);
      setIsSubmitting(false);
      onNavigate('MISSION_MAP');
    } catch (err) {
      console.error('Login error:', err);
      setErrorMessage('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
      setIsSubmitting(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    StorageService.clearStudent();
    window.location.reload();
  };

  // Copy Detective ID
  const handleCopyId = (id: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  // Get current student progress summary
  const studentProgress = currentStudent ? StorageService.getProgress(currentStudent.studentId) : null;
  const completedMissionsCount = studentProgress?.completedMissionIds.length || 0;
  const totalPoints = studentProgress?.totalPoints || 0;

  // --- 1. REGISTRATION SUCCESS OVERLAY ---
  if (successAccount) {
    return (
      <div className="max-w-xl mx-auto py-8 px-4 animate-fadeIn">
        <div className="relative bg-gradient-to-b from-amber-50 to-amber-100 dark:from-slate-900 dark:to-slate-950 border-4 border-amber-500 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center">
          <PushPin color="green" className="absolute -top-3.5 left-1/2 -translate-x-1/2" />
          <TapeSticker className="top-3 right-6 hidden sm:block" angle={-8} />

          <div className="flex justify-center -mb-2">
            <DetectiveCat size={120} variant="excited" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center space-x-1.5 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-3.5 py-1 rounded-full text-xs font-mono font-black border border-emerald-500/40">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DETECTIVE ACCOUNT CREATED!</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 font-mono">
              ยินดีต้อนรับสู่สำนักงานนักสืบ!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
              สร้างตัวตนนักสืบของคุณสำเร็จ พร้อมออกปฏิบัติภารกิจสืบสวนแล้ว
            </p>
          </div>

          {/* Detective ID Card */}
          <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border-3 border-amber-500/60 rounded-2xl p-5 text-left text-amber-100 space-y-4 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-mono font-bold tracking-widest text-amber-300">
                  OFFICIAL DETECTIVE ID
                </span>
              </div>
              <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/40">
                ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <span className="text-[10px] text-amber-400 block">ฉายานักสืบ (Nickname):</span>
                <strong className="text-sm sm:text-base text-amber-100">{successAccount.nickname}</strong>
              </div>

              <div>
                <span className="text-[10px] text-amber-400 block">ชื่อผู้ใช้ (Username):</span>
                <strong className="text-sm sm:text-base text-amber-100">@{successAccount.username}</strong>
              </div>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-xl border border-amber-500/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-400 block">รหัสนักสืบประจำตัว (Student ID):</span>
                <span className="text-lg font-mono font-black text-amber-400 tracking-wider">
                  {successAccount.studentId}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopyId(successAccount.studentId)}
                className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 p-2 rounded-lg border border-amber-500/40 text-xs flex items-center space-x-1 cursor-pointer transition-colors"
                title="คัดลอกรหัสนักสืบ"
              >
                {copiedId ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedId ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
              </button>
            </div>

            <p className="text-[11px] text-amber-300/80 leading-relaxed">
              💡 <strong>ข้อแนะนำ:</strong> จำ <strong>Username</strong> และ <strong>Password</strong> ของคุณไว้เพื่อใช้เข้าสู่ระบบในครั้งถัดไป
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setSuccessAccount(null);
              onNavigate('MISSION_MAP');
            }}
            className="w-full btn-game-orange text-slate-950 font-black text-base py-3.5 px-6 rounded-2xl shadow-xl flex items-center justify-center space-x-2 cursor-pointer hover:scale-102 transition-transform"
          >
            <span>[ เข้าสู่ศูนย์ภารกิจ & เริ่มสืบคดี ]</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // --- 2. ACTIVE SESSION / LOGGED IN SCREEN ---
  if (authMode === 'LOGGED_IN' && currentStudent) {
    return (
      <div className="max-w-xl mx-auto py-8 px-4 animate-fadeIn">
        <div className="relative bg-gradient-to-b from-amber-50 to-amber-100 dark:from-slate-900 dark:to-slate-950 border-4 border-amber-500/60 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <PushPin color="yellow" className="absolute -top-3.5 left-1/2 -translate-x-1/2" />
          <TapeSticker className="top-3 right-6 hidden sm:block" angle={6} />

          {/* Header */}
          <div className="text-center space-y-2 pt-2">
            <div className="flex justify-center -mb-2">
              <DetectiveDog size={110} variant="happy" />
            </div>

            <span className="text-xs font-mono font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest block">
              ★ DETECTIVE PROFILE ACTIVE ★
            </span>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 font-mono">
              สำนักงานนักสืบ: {currentStudent.nickname || currentStudent.firstName || 'นักสืบเยาวชน'}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
              บัญชีนักสืบกำลังออนไลน์และพร้อมปฏิบัติหน้าที่สืบสวน
            </p>
          </div>

          {/* Detective ID Badge */}
          <div className="bg-slate-900 border-2 border-amber-500/40 rounded-2xl p-5 text-amber-100 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-mono font-bold text-amber-300">
                  DETECTIVE BADGE
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/20 px-2.5 py-1 rounded-full border border-amber-500/30">
                {totalPoints} แต้มสะสม
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">ฉายานักสืบ:</span>
                <strong className="text-sm text-slate-100">{currentStudent.nickname || currentStudent.firstName}</strong>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">ชื่อผู้ใช้ (Username):</span>
                <strong className="text-sm text-slate-100">@{currentStudent.username || 'detective'}</strong>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-amber-500/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-400 block">รหัสนักสืบ (Student ID):</span>
                <span className="text-base font-mono font-black text-amber-400">
                  {currentStudent.studentId}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopyId(currentStudent.studentId)}
                className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-2.5 py-1 rounded text-xs font-mono flex items-center space-x-1 cursor-pointer transition-colors"
              >
                {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId ? 'คัดลอกแล้ว' : 'คัดลอก ID'}</span>
              </button>
            </div>

            {/* Mission status chips */}
            <div className="pt-2 border-t border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 block mb-2">
                ความคืบหน้าภารกิจ: สำเร็จ {completedMissionsCount} จาก 4 ภารกิจ
              </span>
              <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-mono">
                {['m1', 'm2', 'm3', 'm4'].map((mId, idx) => {
                  const isDone = studentProgress?.completedMissionIds.includes(mId);
                  return (
                    <div
                      key={mId}
                      className={`p-1.5 rounded-lg border font-bold ${
                        isDone
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                          : 'bg-slate-950 border-slate-800 text-slate-500'
                      }`}
                    >
                      <span>M{idx + 1}</span> {isDone ? '✓' : '○'}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => onNavigate('MISSION_MAP')}
              className="w-full btn-game-orange text-slate-950 font-black text-base py-3.5 px-6 rounded-2xl shadow-xl flex items-center justify-center space-x-2 cursor-pointer hover:scale-102 transition-transform"
            >
              <Compass className="w-5 h-5" />
              <span>[ ดำเนินการสืบคดีต่อ (ไปที่ศูนย์ภารกิจ) ]</span>
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onNavigate('SCORE_REPORT')}
                className="flex-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-900 dark:text-amber-300 font-bold py-2.5 px-4 rounded-xl border border-amber-500/40 text-xs flex items-center justify-center space-x-1.5 cursor-pointer transition-colors"
              >
                <span>ดูผลคะแนน & ใบรับรอง</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-700 dark:text-rose-300 font-bold py-2.5 px-4 rounded-xl border border-rose-500/40 text-xs flex items-center justify-center space-x-1.5 cursor-pointer transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>ออกจากระบบ / สลับบัญชี</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- 3. REGISTER / LOGIN TABS VIEW ---
  return (
    <div className="max-w-xl mx-auto py-8 px-4 animate-fadeIn">
      <div className="relative bg-gradient-to-b from-amber-50 to-amber-100/90 dark:from-slate-900 dark:to-slate-950 border-4 border-amber-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <PushPin color="red" className="absolute -top-3.5 left-1/2 -translate-x-1/2" />
        <TapeSticker className="top-3 right-6 hidden sm:block" angle={-6} />

        {/* Mascot & Switch Mode Header */}
        <div className="text-center space-y-3 pt-2">
          <div className="flex justify-center -mb-2">
            <DetectiveCat size={110} variant={authMode === 'REGISTER' ? 'happy' : 'curious'} />
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-slate-900/80 p-1.5 rounded-2xl border-2 border-amber-500/40 max-w-sm mx-auto">
            <button
              type="button"
              onClick={() => {
                setAuthMode('REGISTER');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-mono font-black transition-all cursor-pointer ${
                authMode === 'REGISTER'
                  ? 'bg-amber-500 text-slate-950 shadow-md scale-102'
                  : 'text-slate-300 hover:text-amber-300'
              }`}
            >
              [ + สมัครบัญชีนักสืบใหม่ ]
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('LOGIN');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-mono font-black transition-all cursor-pointer ${
                authMode === 'LOGIN'
                  ? 'bg-amber-500 text-slate-950 shadow-md scale-102'
                  : 'text-slate-300 hover:text-amber-300'
              }`}
            >
              [ 🔍 เข้าสู่ระบบนักสืบ ]
            </button>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 font-mono">
            {authMode === 'REGISTER' ? 'สร้างตัวตนนักสืบของคุณ' : 'ยินดีต้อนรับกลับสู่สำนักงานนักสืบ'}
          </h2>

          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
            {authMode === 'REGISTER'
              ? 'CREATE YOUR DETECTIVE ACCOUNT: กำหนดฉายาและรหัสผ่านเพื่อเริ่มภารกิจ'
              : 'WELCOME BACK, DETECTIVE: ลงชื่อเข้าใช้ด้วย Username และ Password'}
          </p>
        </div>

        {/* Privacy by Design Banner (Prominent & Clear) */}
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 text-xs space-y-1 text-slate-800 dark:text-slate-200 shadow-xs">
          <div className="flex items-center space-x-2 text-amber-700 dark:text-amber-400 font-bold">
            <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>🔒 มาตรการความเป็นส่วนตัว (Privacy by Design)</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed pl-6">
            ไม่ต้องกรอกชื่อจริง นามสกุลจริง เลขบัตร หรือเบอร์โทรศัพท์ ระบบจะสร้าง <strong>Student ID</strong> อัตโนมัติสำหรับผูกคะแนนสะสมและผลการสืบคดี
          </p>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="p-3 rounded-2xl bg-rose-500/20 border-2 border-rose-500/40 text-rose-800 dark:text-rose-200 text-xs flex items-center space-x-2.5 font-bold animate-shake">
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* === A. REGISTRATION FORM === */}
        {authMode === 'REGISTER' && (
          <form onSubmit={handleRegister} className="space-y-4">
            
            {/* 1. Nickname */}
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1">
                🕵️ ฉายานักสืบ / ชื่อเล่น (Nickname) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={20}
                value={regNickname}
                onChange={(e) => setRegNickname(e.target.value)}
                placeholder="เช่น ยอดนักสืบมิว, DARKFOX, ไดมอนด์"
                className="w-full bg-white dark:bg-slate-850 border-2 border-amber-300 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500 font-bold shadow-xs"
              />
              <span className="text-[10px] text-slate-500 block mt-1">
                ชื่อหรือฉายานี้จะปรากฏในเกม กระดานหลักฐาน และตารางคะแนน
              </span>
            </div>

            {/* 2. Username */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-300">
                  👤 ชื่อผู้ใช้สำหรับเข้าสู่ระบบ (Username) <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] font-mono text-slate-500">
                  {regUsername.length}/10 ตัวอักษร
                </span>
              </div>
              <input
                type="text"
                required
                maxLength={10}
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                placeholder="เช่น sherlock1, detective_m"
                className="w-full bg-white dark:bg-slate-850 border-2 border-amber-300 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm font-mono font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500 shadow-xs"
              />
              <span className="text-[10px] text-slate-500 block mt-1">
                ภาษาอังกฤษหรือตัวเลข ไม่เกิน 10 ตัวอักษร (ห้ามมีเว้นวรรค)
              </span>
            </div>

            {/* 3. Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-300">
                    🔑 รหัสผ่าน (Password) <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] font-mono text-slate-500">
                    {regPassword.length}/8 ตัว
                  </span>
                </div>
                <div className="relative">
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    maxLength={8}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="สูงสุด 8 ตัวอักษร"
                    className="w-full bg-white dark:bg-slate-850 border-2 border-amber-300 dark:border-slate-700 rounded-2xl px-4 py-2.5 pr-10 text-sm font-mono font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500 shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-500 cursor-pointer"
                  >
                    {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1">
                  🔑 ยืนยันรหัสผ่าน <span className="text-rose-500">*</span>
                </label>
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  required
                  maxLength={8}
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  placeholder="กรอกรหัสผ่านอีกครั้ง"
                  className="w-full bg-white dark:bg-slate-850 border-2 border-amber-300 dark:border-slate-700 rounded-2xl px-4 py-2.5 text-sm font-mono font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500 shadow-xs"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-game-orange text-slate-950 font-black text-base py-3.5 px-6 rounded-2xl shadow-xl flex items-center justify-center space-x-2 mt-4 cursor-pointer hover:scale-102 transition-transform disabled:opacity-50"
            >
              <Sparkles className="w-5 h-5" />
              <span>{isSubmitting ? 'กำลังสร้างตัวตนนักสืบ...' : '[ 🕵️ สร้างตัวตนนักสืบ & เริ่มภารกิจ ]'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Switch to Login Link */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('LOGIN');
                  setErrorMessage(null);
                }}
                className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline cursor-pointer"
              >
                มีบัญชีนักสืบอยู่แล้ว? เข้าสู่ระบบที่นี่
              </button>
            </div>

          </form>
        )}

        {/* === B. LOGIN FORM === */}
        {authMode === 'LOGIN' && (
          <form onSubmit={handleLogin} className="space-y-4">
            
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1">
                👤 ชื่อผู้ใช้ (Username)
              </label>
              <input
                type="text"
                required
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="กรอก Username ของคุณ"
                className="w-full bg-white dark:bg-slate-850 border-2 border-amber-300 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm font-mono font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500 shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1">
                🔑 รหัสผ่าน (Password)
              </label>
              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="กรอกรหัสผ่าน"
                  className="w-full bg-white dark:bg-slate-850 border-2 border-amber-300 dark:border-slate-700 rounded-2xl px-4 py-3 pr-10 text-sm font-mono font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500 shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-500 cursor-pointer"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Teacher Help Box */}
            <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-700 text-[11px] text-slate-400 flex items-start space-x-2">
              <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>ลืมรหัสผ่าน?</strong> สามารถแจ้งคุณครูผู้สอนให้ช่วยตรวจสอบหรือรีเซ็ตรหัสผ่านได้ใน <strong>"โหมดคุณครู"</strong>
              </span>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-game-orange text-slate-950 font-black text-base py-3.5 px-6 rounded-2xl shadow-xl flex items-center justify-center space-x-2 mt-4 cursor-pointer hover:scale-102 transition-transform disabled:opacity-50"
            >
              <Fingerprint className="w-5 h-5" />
              <span>{isSubmitting ? 'กำลังเข้าสู่ระบบ...' : '[ 🔍 เข้าสู่ระบบนักสืบ (LOGIN) ]'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Switch to Register Button */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('REGISTER');
                  setErrorMessage(null);
                }}
                className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline cursor-pointer"
              >
                ยังไม่มีบัญชีนักสืบ? สมัครบัญชีใหม่ที่นี่
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
