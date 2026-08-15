import React, { useState, useEffect } from 'react';
import { StorageService } from '../engine/StorageService';
import { CloudStorageService } from '../services/cloudStorageService';
import { TeacherAuthService } from '../services/TeacherAuthService';
import { TeacherNavigation, TeacherPageId } from './teacher/TeacherNavigation';
import { TeacherDashboardPage } from './teacher/TeacherDashboardPage';
import { TeacherStudentManagementPage } from './teacher/TeacherStudentManagementPage';
import { TeacherLearningProgressPage } from './teacher/TeacherLearningProgressPage';
import { TeacherAssessmentPage } from './teacher/TeacherAssessmentPage';
import { TeacherEvidencePage } from './teacher/TeacherEvidencePage';
import { TeacherAIUsagePage } from './teacher/TeacherAIUsagePage';
import { TeacherResearchExportPage } from './teacher/TeacherResearchExportPage';
import { TeacherQATestSuitePage } from './teacher/TeacherQATestSuitePage';
import { TeacherSettingsSpecPage } from './teacher/TeacherSettingsSpecPage';
import {
  Shield,
  Lock,
  LogOut,
  Clock,
  Cloud,
  RefreshCw,
  Sparkles
} from 'lucide-react';

interface TeacherPanelProps {
  onRefresh?: () => void;
  onExitTeacherMode?: () => void;
}

export const TeacherPanel: React.FC<TeacherPanelProps> = ({ onExitTeacherMode }) => {
  const [currentPage, setCurrentPage] = useState<TeacherPageId>('PAGE_01_DASHBOARD');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  const isAuthorized = TeacherAuthService.isAuthenticated();
  const session = TeacherAuthService.getSession();

  // Master Cloud Sync function (manual or background)
  const triggerCloudSync = async (isManual = false) => {
    if (isManual) {
      setIsSyncing(true);
    }
    try {
      const res = await StorageService.syncAllFromCloud();
      setLastSyncTime(res.timestamp);
      setRefreshTrigger(prev => prev + 1);
    } catch (e) {
      console.warn('Sync notice:', e);
    } finally {
      if (isManual) {
        setIsSyncing(false);
      }
    }
  };

  // 1. Initial Cloud Sync on mount
  useEffect(() => {
    if (isAuthorized) {
      triggerCloudSync(false);
    }
  }, [isAuthorized]);

  // 2. Realtime listener for incoming progress from student devices (throttled)
  useEffect(() => {
    if (!isAuthorized) return;
    let throttleTimeout: any = null;

    const unsubscribe = CloudStorageService.subscribeToClassroom(() => {
      // Debounce sync so we don't spam sync on every small packet
      if (throttleTimeout) return;
      throttleTimeout = setTimeout(() => {
        StorageService.syncAllFromCloud().then(res => {
          setLastSyncTime(res.timestamp);
          setRefreshTrigger(prev => prev + 1);
        });
        throttleTimeout = null;
      }, 5000);
    });

    return () => {
      if (throttleTimeout) clearTimeout(throttleTimeout);
      if (unsubscribe) unsubscribe();
    };
  }, [isAuthorized]);

  if (!isAuthorized) {
    return (
      <div className="bg-rose-950/60 border-2 border-rose-500/50 p-8 rounded-3xl text-center space-y-4 shadow-xl">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center border border-rose-500/40">
          <Lock className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-black text-rose-300 font-mono uppercase">ACCESS DENIED • ปฏิเสธการเข้าถึง</h3>
          <p className="text-sm font-semibold text-rose-200/90 font-serif">
            "พื้นที่สำหรับครูผู้สอนเท่านั้น"
          </p>
        </div>
        <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
          ท่านยังไม่ได้เข้าสู่ระบบด้วย Teacher Access Code หรือเซสชันหมดอายุแล้ว กรุณายืนยันตัวตนเพื่อเข้าถึง Teacher Dashboard
        </p>
      </div>
    );
  }

  const handleInternalRefresh = () => {
    triggerCloudSync();
  };

  const handleLogout = () => {
    TeacherAuthService.logout();
    if (onExitTeacherMode) {
      onExitTeacherMode();
    } else {
      window.location.hash = '';
      window.location.reload();
    }
  };

  // Aggregated Counts for badges
  const students = StorageService.getAllStudents();
  const evidences = StorageService.getAllStudentEvidences();
  const aiLogs = StorageService.getAllStudentAILogs();
  const assessments = StorageService.getAllStudentAssessments();

  return (
    <div className="space-y-6">
      
      {/* Top Security & Cloud Sync Status Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-300 uppercase">
                TEACHER MODE ACTIVE
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                <Cloud className="w-3 h-3 text-emerald-400" />
                <span>Cloud Firestore: Connected (Real-time)</span>
              </span>
            </div>
            {session && (
              <p className="text-[10px] text-slate-400 font-mono">
                {lastSyncTime ? `ซิงค์ล่าสุด: ${lastSyncTime} • ` : ''}เซสชันหมดอายุ: {new Date(session.expiresAt).toLocaleTimeString('th-TH')}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => triggerCloudSync(true)}
            disabled={isSyncing}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-all inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="ดึงข้อมูลล่าสุดจากนักเรียนทุกเครื่อง"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'กำลังซิงค์...' : 'ดึงข้อมูลล่าสุด'}</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            title="ออกจาก Teacher Mode"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>LOGOUT</span>
          </button>
        </div>
      </div>

      {/* 9-Page Navigation Bar */}
      <TeacherNavigation
        currentPage={currentPage}
        onSelectPage={(page) => setCurrentPage(page)}
        stats={{
          studentCount: students.length,
          evidenceCount: evidences.length,
          aiLogCount: aiLogs.length,
          assessmentCount: assessments.length
        }}
      />

      {/* Page Content View */}
      <div className="transition-all duration-300">
        {currentPage === 'PAGE_01_DASHBOARD' && (
          <TeacherDashboardPage onNavigatePage={(page) => setCurrentPage(page)} />
        )}

        {currentPage === 'PAGE_02_STUDENTS' && (
          <TeacherStudentManagementPage onRefresh={handleInternalRefresh} />
        )}

        {currentPage === 'PAGE_03_PROGRESS' && (
          <TeacherLearningProgressPage onRefresh={handleInternalRefresh} />
        )}

        {currentPage === 'PAGE_04_ASSESSMENT' && (
          <TeacherAssessmentPage />
        )}

        {currentPage === 'PAGE_05_EVIDENCE' && (
          <TeacherEvidencePage />
        )}

        {currentPage === 'PAGE_06_AI_USAGE' && (
          <TeacherAIUsagePage />
        )}

        {currentPage === 'PAGE_07_RESEARCH_EXPORT' && (
          <TeacherResearchExportPage />
        )}

        {currentPage === 'PAGE_08_QA_SUITE' && (
          <TeacherQATestSuitePage />
        )}

        {currentPage === 'PAGE_09_SETTINGS_SPEC' && (
          <TeacherSettingsSpecPage onRefresh={handleInternalRefresh} />
        )}
      </div>

    </div>
  );
};
