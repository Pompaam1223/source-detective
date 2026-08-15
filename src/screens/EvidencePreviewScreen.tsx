import React from 'react';
import { Student, AppScreen } from '../types';
import { InvestigationBoard } from '../components/InvestigationBoard';
import { StorageService } from '../engine/StorageService';
import { ArrowLeft, Search } from 'lucide-react';

interface EvidencePreviewScreenProps {
  currentStudent: Student | null;
  onNavigate: (screen: AppScreen) => void;
}

export const EvidencePreviewScreen: React.FC<EvidencePreviewScreenProps> = ({
  currentStudent,
  onNavigate
}) => {
  const evidences = currentStudent
    ? StorageService.getEvidences(currentStudent.studentId)
    : [];

  return (
    <div className="space-y-6 py-4">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('MISSION_MAP')}
          className="text-xs font-bold text-slate-400 hover:text-amber-400 flex items-center space-x-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับสู่แผนที่ภารกิจ</span>
        </button>

        <span className="text-xs font-mono font-bold bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full border border-amber-500/30">
          EVIDENCE LOCKER & INVESTIGATION BOARD
        </span>
      </div>

      <InvestigationBoard
        evidences={evidences}
        studentName={currentStudent ? (currentStudent.nickname || currentStudent.firstName || 'นักสืบเยาวชน') : 'นักสืบ'}
      />

    </div>
  );
};
