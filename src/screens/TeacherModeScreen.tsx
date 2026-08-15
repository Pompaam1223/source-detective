import React, { useState, useEffect } from 'react';
import { TeacherPanel } from '../components/TeacherPanel';
import { TeacherAccessGate } from '../components/TeacherAccessGate';
import { TeacherAuthService } from '../services/TeacherAuthService';
import { AppScreen } from '../types';
import { GraduationCap, ArrowLeft, LogOut, ShieldCheck, Clock } from 'lucide-react';

interface TeacherModeScreenProps {
  onNavigate: (screen: AppScreen) => void;
}

export const TeacherModeScreen: React.FC<TeacherModeScreenProps> = ({ onNavigate }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => TeacherAuthService.isAuthenticated());
  const [refreshKey, setRefreshKey] = useState(0);
  const [sessionExpiry, setSessionExpiry] = useState<string | null>(() => {
    const session = TeacherAuthService.getSession();
    return session ? new Date(session.expiresAt).toLocaleTimeString('th-TH') : null;
  });

  useEffect(() => {
    const authed = TeacherAuthService.isAuthenticated();
    setIsAuthenticated(authed);
    if (authed) {
      const session = TeacherAuthService.getSession();
      if (session) {
        setSessionExpiry(new Date(session.expiresAt).toLocaleTimeString('th-TH'));
      }
    }
  }, [refreshKey]);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    const session = TeacherAuthService.getSession();
    if (session) {
      setSessionExpiry(new Date(session.expiresAt).toLocaleTimeString('th-TH'));
    }
  };

  const handleLogout = () => {
    TeacherAuthService.logout();
    setIsAuthenticated(false);
    onNavigate('STUDENT_MODE');
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (!isAuthenticated) {
    return (
      <TeacherAccessGate
        onSuccess={handleAuthSuccess}
        onBackToStudentMode={() => onNavigate('STUDENT_MODE')}
      />
    );
  }

  return (
    <div className="space-y-6 py-4">
      
      {/* Top Header & Session Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
        <button
          onClick={() => onNavigate('HOME')}
          className="text-xs font-bold text-slate-400 hover:text-amber-400 flex items-center space-x-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับสู่หน้าหลัก</span>
        </button>

        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-xs font-mono font-bold bg-teal-500/20 text-teal-300 px-3 py-1 rounded-full border border-teal-500/30 flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>TEACHER SESSION ACTIVE</span>
          </span>

          {sessionExpiry && (
            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>หมดอายุ: {sessionExpiry}</span>
            </span>
          )}

          <button
            onClick={handleLogout}
            className="text-xs font-bold text-rose-300 hover:text-white bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 px-3 py-1 rounded-xl flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer"
            title="ออกจากระบบครู"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>LOGOUT TEACHER</span>
          </button>
        </div>
      </div>

      {/* Main Teacher Panel */}
      <TeacherPanel />

    </div>
  );
};
