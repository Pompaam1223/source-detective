import React from 'react';
import { Mission, Student, StudentProgress, AppScreen } from '../types';
import { MISSIONS_DATA } from '../data/missions';
import { MissionCard } from '../components/MissionCard';
import { DetectiveBadge } from '../components/DetectiveBadge';
import { StudentHeader } from '../components/StudentHeader';
import { StorageService } from '../engine/StorageService';
import {
  FileCheck,
  Award,
  MapPin,
  Sparkles,
  Search,
  CheckCircle,
  ArrowRight,
  Lock,
  AlertCircle,
  Unlock,
  Lightbulb,
  Compass,
  FileText
} from 'lucide-react';
import {
  DetectiveCat,
  DetectiveDog,
  DetectiveBoySearch
} from '../components/characters/DetectiveCharacters';
import {
  PushPin,
  TapeSticker,
  PawPrint,
  StickyNote,
  DetectiveStamp,
  GoldenMagnifierBadge
} from '../components/decorations/DetectiveDecorations';

interface MissionMapScreenProps {
  currentStudent: Student | null;
  onSelectMission: (missionId: string) => void;
  onStartAssessment: (type: 'BASELINE' | 'POST_TEST') => void;
  onNavigate: (screen: AppScreen) => void;
}

export const MissionMapScreen: React.FC<MissionMapScreenProps> = ({
  currentStudent,
  onSelectMission,
  onStartAssessment,
  onNavigate
}) => {
  const progress: StudentProgress | null = currentStudent
    ? StorageService.getProgress(currentStudent.studentId)
    : null;

  const missionResults = currentStudent
    ? StorageService.getMissionResults(currentStudent.studentId)
    : [];

  // 1. BASELINE GATE: Check if baseline test is complete (Q01–Q10 answered)
  const isBaselineCompleted = progress?.baselineStatus === 'COMPLETED';

  // 2. MISSION COMPLETION STATUS
  const completedMissionIds = progress?.completedMissionIds || [];
  const isMissionCompleted = (id: string) => 
    completedMissionIds.includes(id) || missionResults.some(r => r.missionId === id && r.completed);

  const completedCount = ['m1', 'm2', 'm3', 'm4'].filter(id => isMissionCompleted(id)).length;
  const all4MissionsCompleted = ['m1', 'm2', 'm3', 'm4'].every(id => isMissionCompleted(id));

  // 3. POST-TEST GATE: BASELINE_COMPLETE === true AND M1, M2, M3, M4 all COMPLETE
  const isPostTestUnlocked = isBaselineCompleted && all4MissionsCompleted;

  // Calculate percentage of 4 missions
  const missionProgressPercent = Math.round((completedCount / 4) * 100);

  return (
    <div className="space-y-8 py-4">
      
      {/* Student Badge & Header */}
      {currentStudent && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <StudentHeader
              student={currentStudent}
              onEditProfile={() => onNavigate('STUDENT_MODE')}
            />
          </div>
          <div className="lg:col-span-1">
            <DetectiveBadge
              scorePoints={progress?.totalPoints || 0}
              maxPoints={progress?.maxPossiblePoints || 160}
            />
          </div>
        </div>
      )}

      {/* Step 1 & Step 3 Assessment Files Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Baseline Test Card (Step 1 Gateway) */}
        <div className={`relative bg-gradient-to-b from-amber-950/80 to-slate-950 border-3 rounded-3xl p-6 text-slate-100 flex flex-col justify-between shadow-xl overflow-hidden transition-all ${
          !isBaselineCompleted 
            ? 'border-amber-400 ring-4 ring-amber-500/20' 
            : 'border-emerald-500/50'
        }`}>
          <PushPin color="yellow" className="absolute -top-3 left-6" />

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-[10px] font-mono font-black uppercase px-3 py-1 rounded-lg border ${
                !isBaselineCompleted
                  ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              }`}>
                ★ STEP 1: PRE-TEST (แบบทดสอบก่อนเรียน)
              </span>
              {isBaselineCompleted ? (
                <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>เสร็จสิ้น ({progress?.baselineScore || 0}/40)</span>
                </span>
              ) : (
                <span className="text-xs font-bold text-amber-400 flex items-center space-x-1 animate-bounce">
                  <AlertCircle className="w-4 h-4" />
                  <span>ต้องทำก่อนเริ่มภารกิจ!</span>
                </span>
              )}
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0">
                <FileCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-100">แบบประเมินก่อนเรียน (Baseline Test)</h3>
                <p className="text-xs text-slate-300 mt-1">
                  ทดสอบทักษะการสืบสวนและตรวจสอบข่าวสารเบื้องต้น 10 ข้อ เพื่อปลดล็อกศูนย์ภารกิจ
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => onStartAssessment('BASELINE')}
            className={`mt-5 font-black text-xs py-3 px-5 rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer ${
              !isBaselineCompleted
                ? 'btn-game-orange text-slate-950 text-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>{isBaselineCompleted ? 'ทำแบบประเมินก่อนเรียนซ้ำ' : 'เริ่มแบบประเมินก่อนเรียน (10 ข้อ)'}</span>
          </button>
        </div>

        {/* Post Test Card (Step 3 Gateway - Locked until Baseline + All 4 Missions Complete) */}
        <div className={`relative bg-gradient-to-b from-slate-900 to-slate-950 border-3 rounded-3xl p-6 text-slate-100 flex flex-col justify-between shadow-xl overflow-hidden transition-all ${
          isPostTestUnlocked
            ? 'border-indigo-400 ring-4 ring-indigo-500/20'
            : 'border-slate-800 opacity-85'
        }`}>
          <PushPin color="blue" className="absolute -top-3 right-6" />

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-[10px] font-mono font-black uppercase px-3 py-1 rounded-lg border ${
                isPostTestUnlocked
                  ? 'bg-indigo-500 text-white border-indigo-400'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                ★ STEP 3: POST-TEST (แบบทดสอบหลังเรียน)
              </span>
              {progress?.postTestStatus === 'COMPLETED' ? (
                <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>เสร็จสิ้น ({progress.postTestScore || 0}/40)</span>
                </span>
              ) : isPostTestUnlocked ? (
                <span className="text-xs font-bold text-indigo-400 flex items-center space-x-1 font-mono">
                  <Unlock className="w-4 h-4" />
                  <span>ปลดล็อกแล้ว (พร้อมสอบ)</span>
                </span>
              ) : (
                <span className="text-xs font-bold text-slate-400 flex items-center space-x-1 font-mono">
                  <Lock className="w-4 h-4" />
                  <span>ล็อกอยู่ ({completedCount}/4 ภารกิจ)</span>
                </span>
              )}
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-100">แบบประเมินหลังเรียน (Post-Test)</h3>
                <p className="text-xs text-slate-300 mt-1">
                  วัดระดับการพัฒนาทักษะ (Learning Gain) หลังจากสะสมประสบการณ์ครบทั้ง 4 ภารกิจ
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              if (isPostTestUnlocked) {
                onStartAssessment('POST_TEST');
              }
            }}
            disabled={!isPostTestUnlocked}
            className={`mt-5 font-black text-xs py-3 px-5 rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2 ${
              isPostTestUnlocked
                ? 'btn-game-blue text-white text-sm cursor-pointer'
                : 'bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed'
            }`}
          >
            {isPostTestUnlocked ? <Award className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            <span>
              {progress?.postTestStatus === 'COMPLETED'
                ? 'ทำแบบประเมินหลังเรียนซ้ำ'
                : isPostTestUnlocked
                ? 'เริ่มแบบประเมินหลังเรียน (10 ข้อ)'
                : `ล็อกอยู่ (ต้องทำครบ 4 ภารกิจก่อน: เสร็จแล้ว ${completedCount}/4)`}
            </span>
          </button>
        </div>

      </div>

      {/* Main Corkboard Mission Bulletin Section */}
      <div className="relative bg-amber-950/20 border-8 border-amber-900/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <PushPin color="red" className="absolute -top-4 left-10" />
        <PushPin color="red" className="absolute -top-4 right-10" />

        {/* Baseline Gate Banner if Baseline not completed */}
        {!isBaselineCompleted && (
          <div className="bg-amber-950/80 border-3 border-amber-400 rounded-3xl p-5 text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border-2 border-amber-400">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-black text-amber-300">
                  🔒 ศูนย์ภารกิจถูกล็อก (กรุณาทำแบบประเมินก่อนเรียน)
                </h4>
                <p className="text-xs text-amber-200/90 mt-0.5">
                  ทำแบบประเมินก่อนเรียน (Baseline Test) ให้ครบ 10 ข้อ เพื่อเปิดแฟ้มคดีทั้ง 4 ภารกิจ
                </p>
              </div>
            </div>
            <button
              onClick={() => onStartAssessment('BASELINE')}
              className="btn-game-orange text-slate-950 font-black text-xs px-6 py-3 rounded-2xl shrink-0 shadow flex items-center space-x-2 cursor-pointer"
            >
              <span>เริ่มทำแบบประเมินก่อนเรียน</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Section Header with Mascot Message */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/90 border-2 border-amber-500/40 p-5 rounded-3xl shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="shrink-0 animate-bounce">
              <DetectiveCat size={56} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg sm:text-xl font-black text-amber-400 font-mono">
                  MISSION HUB • กระดานคดีสืบสวน (4 ภารกิจ)
                </h2>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {isBaselineCompleted 
                  ? 'เลือกทำภารกิจใดก่อนก็ได้ตามความสนใจ สะสมแต้มและหลักฐานให้ครบทุกข้อ!'
                  : 'ภารกิจจะปลดล็อกหลังจากทำแบบประเมินก่อนเรียนเสร็จสิ้น'}
              </p>
            </div>
          </div>

          {/* Quick Evidence Link */}
          <button
            onClick={() => onNavigate('EVIDENCE_PREVIEW')}
            className="btn-game-orange text-slate-950 text-xs font-black px-4 py-2.5 rounded-xl shadow flex items-center space-x-1.5 self-start lg:self-auto cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>เปิดคลังหลักฐาน</span>
          </button>
        </div>

        {/* Main Grid: 4 Missions + Detective Sidebar Notebook */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          
          {/* Left / Center 4 Mission Cards (8 Cols) */}
          <div className="xl:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {MISSIONS_DATA.map(mission => {
              const mResult = missionResults.find(r => r.missionId === mission.missionId);
              const isCompleted = isMissionCompleted(mission.missionId);
              const missionUnlocked = isBaselineCompleted;

              return (
                <MissionCard
                  key={mission.missionId}
                  mission={{
                    ...mission,
                    unlocked: missionUnlocked,
                    status: !missionUnlocked 
                      ? 'LOCKED' 
                      : isCompleted 
                      ? 'COMPLETED' 
                      : 'AVAILABLE'
                  }}
                  onSelectMission={(mId) => {
                    if (missionUnlocked) {
                      onSelectMission(mId);
                    } else {
                      onStartAssessment('BASELINE');
                    }
                  }}
                  isCompleted={isCompleted}
                  score={mResult?.score}
                />
              );
            })}
          </div>

          {/* Right Detective Notebook & Badges Board (4 Cols) */}
          <div className="xl:col-span-4 space-y-6">
            
            {/* Progress Gauge Card */}
            <div className="bg-white dark:bg-slate-900 border-3 border-amber-400/80 rounded-3xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-amber-500" />
                  <span>ความคืบหน้าของคุณ</span>
                </h3>
                <span className="bg-amber-500/20 text-amber-600 dark:text-amber-300 font-mono font-black text-xs px-2.5 py-0.5 rounded-full">
                  {completedCount}/4 ภารกิจ
                </span>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 font-mono">
                  <span>ทำภารกิจสำเร็จ</span>
                  <span className="text-amber-500 font-black">{missionProgressPercent}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-3.5 p-0.5 overflow-hidden shadow-inner">
                  <div
                    className="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${missionProgressPercent}%` }}
                  />
                </div>
              </div>

              {/* Badges Preview Collection */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2 font-mono">
                  เหรียญตราประจำภารกิจ (BADGES):
                </span>
                <div className="grid grid-cols-4 gap-2 text-center">
                  {[
                    { id: 'm1', label: 'M1 นักสืบ', icon: '🔍', color: 'border-amber-400' },
                    { id: 'm2', label: 'M2 ส่องไฟ', icon: '🔦', color: 'border-sky-400' },
                    { id: 'm3', label: 'M3 วิเคราะห์', icon: '⚖️', color: 'border-emerald-400' },
                    { id: 'm4', label: 'M4 สรุปคดี', icon: '🏆', color: 'border-purple-400' }
                  ].map(b => {
                    const done = isMissionCompleted(b.id);
                    return (
                      <div
                        key={b.id}
                        className={`p-2 rounded-2xl border-2 transition-all ${
                          done
                            ? `bg-amber-50 dark:bg-slate-800 ${b.color} shadow-sm`
                            : 'bg-slate-100 dark:bg-slate-800/40 border-slate-300 dark:border-slate-700 opacity-40'
                        }`}
                      >
                        <div className="text-xl mb-1">{b.icon}</div>
                        <p className="text-[10px] font-bold text-slate-700 dark:text-slate-300 leading-tight">
                          {b.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Detective Sticky Note */}
            <StickyNote title="สมุดบันทึกนักสืบ (CLUE NOTES)" pinColor="red">
              <p className="font-semibold text-amber-950 mb-1.5">
                💡 เคล็ดลับยอดนักสืบ:
              </p>
              <ul className="space-y-1 text-[11px] list-disc list-inside text-amber-900">
                <li>อย่าเพิ่งเชื่อหัวข้อข่าวที่ตื่นเต้นเกินจริง</li>
                <li>มองหาว่าใครเป็นคนพูด และมีผลประโยชน์อะไร</li>
                <li>ตรวจสอบหลักฐานจากแหล่งข้อมูลอื่นประกอบ</li>
              </ul>
            </StickyNote>

            {/* Watson Detective Dog Encouragement */}
            <div className="bg-gradient-to-r from-amber-100 to-amber-200 dark:from-slate-900 dark:to-slate-800 border-2 border-amber-400/60 rounded-3xl p-4 flex items-center space-x-3 shadow-md">
              <div className="shrink-0">
                <DetectiveDog size={52} />
              </div>
              <div className="text-xs">
                <p className="font-bold text-amber-950 dark:text-amber-300">
                  🐶 วัตสัน (Watson the Hound)
                </p>
                <p className="text-slate-700 dark:text-slate-300 text-[11px] mt-0.5">
                  "โฮ่ง! สู้ๆ นะยอดนักสืบ ทำภารกิจให้ครบ 4 ด่านแล้วไปสอบหลังเรียนกัน!"
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

