import React from 'react';
import { Mission, Student, AppScreen, Question } from '../types';
import { MISSIONS_DATA } from '../data/missions';
import { MissionEngine } from '../components/engine/MissionEngine';
import { MissionRegistry } from '../engine/MissionRegistry';
import { StorageService } from '../engine/StorageService';
import { Folder, ArrowLeft, UserCheck } from 'lucide-react';

interface MissionDetailScreenProps {
  missionId: string;
  currentStudent: Student | null;
  onNavigate: (screen: AppScreen) => void;
  onMissionCompleted: () => void;
  onActiveQuestionChange?: (question: Question | null) => void;
}

export const MissionDetailScreen: React.FC<MissionDetailScreenProps> = ({
  missionId,
  currentStudent,
  onNavigate,
  onMissionCompleted,
  onActiveQuestionChange
}) => {
  const missionConfig = MissionRegistry.getMissionConfig(missionId);
  const mission = MISSIONS_DATA.find(m => m.missionId === missionId) || MISSIONS_DATA[0];

  // If student is not registered yet
  if (!currentStudent) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-6 animate-fadeIn">
        <div className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-8 text-slate-100 shadow-2xl space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <UserCheck className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100">
            กรุณาลงทะเบียนนักสืบก่อนเริ่มคดี
          </h2>
          <p className="text-sm text-slate-300">
            ระบบจำเป็นต้องทราบชื่อและรหัสนักเรียน เพื่อจัดเก็บบันทึกหลักฐานและคำนวณคะแนนสมรรถนะ
          </p>
          <div className="pt-3">
            <button
              onClick={() => onNavigate('STUDENT_MODE')}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-xl shadow-lg transition-all"
            >
              ไปหน้าลงทะเบียนนักสืบ
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If the mission has a full MissionConfig (e.g. Mission 1 and all registered missions)
  if (missionConfig) {
    return (
      <div className="space-y-4">
        {/* Back Button */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('MISSION_MAP')}
            className="text-xs font-bold text-slate-400 hover:text-amber-400 flex items-center space-x-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับไปยังแผนที่ภารกิจ</span>
          </button>

          <span className="text-xs font-mono font-bold bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full border border-amber-500/30">
            CASE CODE: {missionConfig.caseCode}
          </span>
        </div>

        {/* Mission Engine Orchestrator */}
        <MissionEngine
          missionConfig={missionConfig}
          currentStudent={currentStudent}
          onActiveContextChange={(qId, sCardId) => {
            if (onActiveQuestionChange) {
              const activeQ = missionConfig.questions.find(q => q.questionId === qId) || null;
              onActiveQuestionChange(activeQ);
            }
          }}
          onMissionCompleted={(totalScore, attempts) => {
            StorageService.saveMissionResult({
              missionId: missionConfig.missionId,
              studentId: currentStudent.studentId,
              score: totalScore,
              maxScore: missionConfig.totalScore,
              completed: true,
              completedAt: new Date().toISOString(),
              attemptsCount: attempts.length,
              indicatorScores: {} as any
            });
            onMissionCompleted();
          }}
          onNavigateHome={() => onNavigate('MISSION_MAP')}
        />
      </div>
    );
  }

  // Fallback for missions without config
  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('MISSION_MAP')}
          className="text-xs font-bold text-slate-400 hover:text-amber-400 flex items-center space-x-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับไปยังแผนที่ภารกิจ</span>
        </button>

        <span className="text-xs font-mono font-bold bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full border border-amber-500/30">
          CASE CODE: {mission.caseCode}
        </span>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-slate-100 shadow-xl space-y-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <Folder className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block">
              MISSION #{mission.number}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold">{mission.title}</h2>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {mission.description}
        </p>
      </div>
    </div>
  );
};
