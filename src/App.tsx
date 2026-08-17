import React, { useState, useEffect } from 'react';
import { AppScreen, Student, AssessmentResult, Question } from './types';
import { StorageService } from './engine/StorageService';
import { Navbar } from './components/Navbar';
import { HomeScreen } from './screens/HomeScreen';
import { StudentModeScreen } from './screens/StudentModeScreen';
import { MissionMapScreen } from './screens/MissionMapScreen';
import { MissionDetailScreen } from './screens/MissionDetailScreen';
import { AssessmentScreen } from './screens/AssessmentScreen';
import { ResultScreen } from './screens/ResultScreen';
import { TeacherModeScreen } from './screens/TeacherModeScreen';
import { EvidencePreviewScreen } from './screens/EvidencePreviewScreen';
import { ScoreReportScreen } from './screens/ScoreReportScreen';
import { AIHelperFloating } from './components/AIHelperFloating';
import { StudentQuickStartPoster } from './components/StudentQuickStartPoster';
import { TeacherQuickStartPoster } from './components/TeacherQuickStartPoster';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('HOME');
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [activeMissionId, setActiveMissionId] = useState<string>('m1');
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [assessmentType, setAssessmentType] = useState<'BASELINE' | 'POST_TEST'>('BASELINE');
  const [latestAssessmentResult, setLatestAssessmentResult] = useState<AssessmentResult | null>(null);
  const [isPosterOpen, setIsPosterOpen] = useState<boolean>(false);
  const [isTeacherPosterOpen, setIsTeacherPosterOpen] = useState<boolean>(false);

  // Load student & handle URL hash routing on init
  useEffect(() => {
    const savedStudent = StorageService.getStudent();
    if (savedStudent) {
      setCurrentStudent(savedStudent);
    }

    // Direct URL hash listener
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase().replace('#', '');
      if (hash === 'teacher' || hash === 'dashboard' || hash === 'teacher-dashboard') {
        setCurrentScreen('TEACHER_MODE');
      } else if (hash === 'evidence') {
        setCurrentScreen('EVIDENCE_PREVIEW');
      } else if (hash === 'scores' || hash === 'report') {
        setCurrentScreen('SCORE_REPORT');
      } else if (hash === 'missions') {
        setCurrentScreen('MISSION_MAP');
      } else if (hash === 'student' || hash === 'login') {
        setCurrentScreen('STUDENT_MODE');
      }
    };

    // Auto seed initial evidence dataset if empty
    try {
      const existingEvs = StorageService.getAllStudentEvidences();
      if (existingEvs.length === 0) {
        StorageService.seedComprehensiveEvidences();
      }
    } catch {
      // Ignore initial seed error
    }

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (screen: AppScreen) => {
    setCurrentScreen(screen);
    if (screen !== 'MISSION_DETAIL') {
      setActiveQuestion(null);
    }
    // Update hash for deep linking
    if (screen === 'TEACHER_MODE') {
      window.location.hash = 'teacher';
    } else if (screen === 'EVIDENCE_PREVIEW') {
      window.location.hash = 'evidence';
    } else if (screen === 'SCORE_REPORT') {
      window.location.hash = 'scores';
    } else if (screen === 'MISSION_MAP') {
      window.location.hash = 'missions';
    } else if (screen === 'STUDENT_MODE') {
      window.location.hash = 'student';
    } else if (screen === 'HOME') {
      window.location.hash = '';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStudentSaved = (student: Student) => {
    setCurrentStudent(student);
  };

  const handleSelectMission = (missionId: string) => {
    setActiveMissionId(missionId);
    handleNavigate('MISSION_DETAIL');
  };

  const handleStartAssessment = (type: 'BASELINE' | 'POST_TEST') => {
    setAssessmentType(type);
    handleNavigate('ASSESSMENT');
  };

  const handleAssessmentCompleted = (result: AssessmentResult) => {
    setLatestAssessmentResult(result);
    handleNavigate('RESULT');
  };

  const handleMissionCompleted = () => {
    // Refresh student state after completing a mission
    if (currentStudent) {
      const refreshed = StorageService.getStudent();
      if (refreshed) setCurrentStudent(refreshed);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-amber-500 selection:text-slate-950 flex flex-col justify-between">
      
      {/* Top Navbar */}
      <Navbar
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        currentStudent={currentStudent}
        isPostTestInProgress={currentScreen === 'ASSESSMENT' && assessmentType === 'POST_TEST'}
        onOpenPoster={() => setIsPosterOpen(true)}
        onOpenTeacherPoster={() => setIsTeacherPosterOpen(true)}
      />

      {/* Main Screen Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1">
        
        {currentScreen === 'HOME' && (
          <HomeScreen 
            onNavigate={handleNavigate} 
            onOpenPoster={() => setIsPosterOpen(true)}
            onOpenTeacherPoster={() => setIsTeacherPosterOpen(true)} 
          />
        )}

        {currentScreen === 'STUDENT_MODE' && (
          <StudentModeScreen
            currentStudent={currentStudent}
            onStudentSaved={handleStudentSaved}
            onNavigate={handleNavigate}
          />
        )}

        {currentScreen === 'MISSION_MAP' && (
          <MissionMapScreen
            currentStudent={currentStudent}
            onSelectMission={handleSelectMission}
            onStartAssessment={handleStartAssessment}
            onNavigate={handleNavigate}
          />
        )}

        {currentScreen === 'MISSION_DETAIL' && (
          <MissionDetailScreen
            missionId={activeMissionId}
            currentStudent={currentStudent}
            onNavigate={handleNavigate}
            onMissionCompleted={handleMissionCompleted}
            onActiveQuestionChange={setActiveQuestion}
          />
        )}

        {currentScreen === 'ASSESSMENT' && (
          <AssessmentScreen
            type={assessmentType}
            currentStudent={currentStudent}
            onNavigate={handleNavigate}
            onAssessmentCompleted={handleAssessmentCompleted}
          />
        )}

        {currentScreen === 'RESULT' && (
          <ResultScreen
            assessmentResult={latestAssessmentResult}
            currentStudent={currentStudent}
            onNavigate={handleNavigate}
          />
        )}

        {currentScreen === 'TEACHER_MODE' && (
          <TeacherModeScreen onNavigate={handleNavigate} />
        )}

        {currentScreen === 'EVIDENCE_PREVIEW' && (
          <EvidencePreviewScreen
            currentStudent={currentStudent}
            onNavigate={handleNavigate}
          />
        )}

        {currentScreen === 'SCORE_REPORT' && (
          <ScoreReportScreen
            currentStudent={currentStudent}
            onNavigate={handleNavigate}
          />
        )}

      </main>

      {/* Floating AI Assistant */}
      <AIHelperFloating
        currentStudent={currentStudent}
        currentScreen={currentScreen}
        activeMissionId={activeMissionId}
        activeQuestionId={activeQuestion?.questionId}
        activeSourceCardId={activeQuestion?.sourceCardId || (activeQuestion?.sourceCardIds && activeQuestion.sourceCardIds.length > 0 ? activeQuestion.sourceCardIds[0] : undefined)}
      />

      {/* Footer */}
      <footer id="app-footer" className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] sm:text-xs text-slate-400 text-center sm:text-left font-medium">
            <span className="font-bold text-amber-400 font-mono">SOURCE DETECTIVE</span> • สืบสวน • วิเคราะห์ • แยกแยะ • ตัดสินใจอย่างมีเหตุผล
          </div>

          <div className="flex items-center space-x-2 text-center sm:text-right text-slate-300 font-medium text-xs">
            <span>ผู้สร้าง นางสาวอวยพร วิจักษณ์ภาณุสิน</span>
          </div>
        </div>
      </footer>

      {/* Student Quick Start Guide Poster Modal */}
      <StudentQuickStartPoster
        isOpen={isPosterOpen}
        onClose={() => setIsPosterOpen(false)}
      />

      {/* Teacher Quick Start Guide Poster Modal */}
      <TeacherQuickStartPoster
        isOpen={isTeacherPosterOpen}
        onClose={() => setIsTeacherPosterOpen(false)}
      />

    </div>
  );
}
