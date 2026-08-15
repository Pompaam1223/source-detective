import React from 'react';
import { Mission } from '../types';
import { INDICATOR_DEFINITIONS } from '../data/indicators';
import {
  Lock,
  ArrowRight,
  CheckCircle,
  Clock,
  Award,
  Sparkles
} from 'lucide-react';
import {
  DetectiveBoySearch,
  DetectiveGirlFlashlight,
  DetectiveBoyPonder,
  DetectiveGirlBoard,
  DetectiveCat
} from './characters/DetectiveCharacters';
import { PushPin, DetectiveStamp } from './decorations/DetectiveDecorations';

interface MissionCardProps {
  mission: Mission;
  onSelectMission: (missionId: string) => void;
  isCompleted?: boolean;
  score?: number;
}

export const MissionCard: React.FC<MissionCardProps> = ({
  mission,
  onSelectMission,
  isCompleted = false,
  score
}) => {
  // Render character per mission
  const renderCharacter = () => {
    switch (mission.number) {
      case 1:
        return <DetectiveBoySearch size={90} />;
      case 2:
        return <DetectiveGirlFlashlight size={90} />;
      case 3:
        return <DetectiveBoyPonder size={90} />;
      case 4:
        return <DetectiveGirlBoard size={90} />;
      default:
        return <DetectiveCat size={80} />;
    }
  };

  const pinColors: ('red' | 'yellow' | 'blue' | 'green')[] = ['red', 'blue', 'green', 'yellow'];
  const pinColor = pinColors[(mission.number - 1) % 4];

  return (
    <div className={`relative bg-gradient-to-b from-amber-50/95 to-amber-100/90 dark:from-slate-900 dark:to-slate-950 border-3 rounded-3xl p-5 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden group ${
      isCompleted
        ? 'border-emerald-500/80 shadow-emerald-500/10'
        : mission.unlocked
        ? 'border-amber-400/80 hover:border-amber-500 shadow-amber-500/10'
        : 'border-slate-300 dark:border-slate-800 opacity-80'
    }`}>
      
      {/* Push Pin on Top Header */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
        <PushPin color={pinColor} />
      </div>

      {/* Top Banner & Status */}
      <div className="pt-2">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center space-x-2">
            <span className="bg-slate-950 text-amber-400 text-[10px] font-mono font-black px-2.5 py-1 rounded-lg border border-amber-500/40 shadow-xs">
              {mission.caseCode}
            </span>
            <span className="text-xs font-mono font-black text-amber-900 dark:text-amber-300">
              MISSION #{mission.number}
            </span>
          </div>

          {isCompleted ? (
            <span className="bg-emerald-500 text-white font-black text-[10px] px-3 py-1 rounded-full flex items-center space-x-1 shadow-sm">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>สำเร็จ ({score ?? 40}/40)</span>
            </span>
          ) : !mission.unlocked ? (
            <span className="bg-slate-300 dark:bg-slate-800 text-slate-700 dark:text-slate-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
              <Lock className="w-3 h-3" />
              <span>ล็อกอยู่</span>
            </span>
          ) : (
            <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full animate-pulse shadow-sm">
              ★ พร้อมสืบ!
            </span>
          )}
        </div>

        {/* Character Illustration & Title Header */}
        <div className="flex items-center space-x-3 mt-2 bg-white/70 dark:bg-slate-800/70 p-3 rounded-2xl border border-amber-200/80 dark:border-slate-700/60 shadow-xs">
          <div className="shrink-0 group-hover:scale-105 transition-transform">
            {renderCharacter()}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-amber-500 transition-colors leading-snug">
              {mission.title}
            </h3>
            <p className="text-[11px] text-amber-900/80 dark:text-slate-300 mt-1 font-medium leading-tight">
              {mission.subtitle}
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 leading-relaxed font-normal">
          {mission.description}
        </p>

        {/* Completed Stamp Overlay if finished */}
        {isCompleted && (
          <div className="mt-2 flex justify-end">
            <DetectiveStamp text="CASE SOLVED" color="green" />
          </div>
        )}

        {/* Indicators Covered */}
        <div className="mt-3 pt-2.5 border-t border-amber-200/60 dark:border-slate-800">
          <span className="text-[10px] font-mono font-bold text-amber-900 dark:text-slate-400 uppercase tracking-wider block mb-1">
            สมรรถนะที่ฝึกฝน:
          </span>
          <div className="flex flex-wrap gap-1">
            {mission.indicatorIds.map(id => {
              const def = INDICATOR_DEFINITIONS[id];
              return (
                <span
                  key={id}
                  title={def?.nameTh}
                  className="bg-amber-200/80 dark:bg-slate-800 text-amber-950 dark:text-amber-300 border border-amber-300 dark:border-slate-700 text-[10px] font-mono font-black px-1.5 py-0.5 rounded-md"
                >
                  {id}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Card Footer & Action Button */}
      <div className="mt-4 pt-3 border-t border-amber-200/60 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono font-bold">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>~{mission.estimatedMinutes} นาที • 40 แต้ม</span>
        </div>

        <button
          onClick={() => onSelectMission(mission.missionId)}
          disabled={!mission.unlocked}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 cursor-pointer ${
            isCompleted
              ? 'btn-game-green text-white'
              : mission.unlocked
              ? 'btn-game-orange text-slate-950'
              : 'bg-slate-300 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
          }`}
        >
          <span>{isCompleted ? 'ทำภารกิจซ้ำ' : 'เริ่มภารกิจ'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};

