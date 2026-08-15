import React from 'react';
import { MissionConfig } from '../../types';
import { Shield, Clock, Award, Target, ArrowRight, Play, BookOpen, Layers, Sparkles, Lightbulb } from 'lucide-react';
import {
  DetectiveCat,
  DetectiveBoySearch,
  DetectiveGirlFlashlight,
  DetectiveBoyPonder,
  DetectiveGirlBoard,
  DetectiveDog
} from '../characters/DetectiveCharacters';
import { PushPin, TapeSticker, PawPrint } from '../decorations/DetectiveDecorations';

interface MissionIntroProps {
  mission: MissionConfig;
  onStart: () => void;
  onBack: () => void;
}

export const MissionIntro: React.FC<MissionIntroProps> = ({
  mission,
  onStart,
  onBack
}) => {
  // Select appropriate character for mission number
  const renderMissionCharacter = () => {
    switch (mission.missionNumber) {
      case 1:
        return <DetectiveBoySearch size={130} />;
      case 2:
        return <DetectiveGirlFlashlight size={130} />;
      case 3:
        return <DetectiveBoyPonder size={130} />;
      case 4:
        return <DetectiveGirlBoard size={130} />;
      default:
        return <DetectiveCat size={130} variant="happy" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn py-4">
      {/* Case Header Banner with Detective Theme & Cartoon Character */}
      <div className="relative bg-gradient-to-br from-amber-950 via-slate-950 to-slate-900 border-4 border-amber-500/50 rounded-3xl p-6 sm:p-8 text-slate-100 shadow-2xl overflow-hidden">
        <PushPin color="yellow" className="absolute -top-3 left-8 z-20" />
        <PushPin color="red" className="absolute -top-3 right-8 z-20" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
          
          {/* Left Text and Details */}
          <div className="md:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="bg-amber-500 text-slate-950 font-mono font-black text-xs px-3.5 py-1 rounded-full shadow-md">
                CASE #{mission.missionNumber}: {mission.caseCode}
              </span>
              <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/20 border border-amber-500/40 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>CONFIDENTIAL DOSSIER</span>
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight font-mono">
                <span className="text-amber-400">{mission.missionTitle}</span>
              </h1>
              {mission.missionSubtitle && (
                <p className="text-sm sm:text-base text-amber-200/90 font-semibold mt-1">
                  🔍 {mission.missionSubtitle}
                </p>
              )}
            </div>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {mission.missionDescription}
            </p>

            {/* Stats chips */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="bg-slate-900/90 border border-amber-500/30 px-3 py-1.5 rounded-xl flex items-center space-x-1.5 text-xs font-mono text-amber-300">
                <Clock className="w-4 h-4 text-sky-400" />
                <span>เวลาประมาณ: ~{mission.estimatedMinutes || 20} นาที</span>
              </div>
              <div className="bg-slate-900/90 border border-amber-500/30 px-3 py-1.5 rounded-xl flex items-center space-x-1.5 text-xs font-mono text-amber-300">
                <Award className="w-4 h-4 text-amber-400" />
                <span>คะแนนเต็ม: {mission.totalScore} คะแนน</span>
              </div>
            </div>
          </div>

          {/* Right Mascot Illustration & Cheering speech */}
          <div className="md:col-span-4 flex flex-col items-center justify-center text-center">
            <div className="bg-slate-900/80 border-2 border-amber-500/40 rounded-2xl p-4 shadow-xl flex flex-col items-center w-full max-w-[220px]">
              <div className="animate-float-slow">
                {renderMissionCharacter()}
              </div>
              <div className="mt-2 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-lg text-[11px] font-bold">
                "พร้อมสืบหาเบาะแสกันรึยัง?"
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 4 Stages Mission Map Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono flex items-center space-x-2">
          <Layers className="w-4 h-4 text-amber-500" />
          <span>ด่านการสืบสวน ({mission.stages.length} ด่าน)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mission.stages.map((stage, idx) => (
            <div
              key={stage.stageId}
              className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-2 hover:border-amber-400 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-black text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-3 py-0.5 rounded-full border border-amber-300 dark:border-amber-700">
                  ★ ด่านที่ {stage.stageNumber}
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">
                  {stage.questionIds.length} ข้อ
                </span>
              </div>
              <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm group-hover:text-amber-500 transition-colors">
                {stage.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {stage.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={onBack}
          className="w-full sm:w-auto px-6 py-3 rounded-2xl border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
        >
          ← กลับสู่ศูนย์ภารกิจ
        </button>

        <button
          id="btn_start_mission_engine"
          onClick={onStart}
          className="btn-game-orange w-full sm:w-auto px-8 py-3.5 rounded-2xl text-slate-950 font-black text-base shadow-xl flex items-center justify-center space-x-2 group cursor-pointer"
        >
          <span>เริ่มปฏิบัติการสืบสวน</span>
          <Play className="w-4 h-4 fill-current group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};

