import React from 'react';
import { CheckCircle2, Lock, Sparkles, Clock, AlertCircle } from 'lucide-react';

export type BadgeStatus = 'AVAILABLE' | 'LOCKED' | 'IN_PROGRESS' | 'COMPLETED' | 'DEVELOPING';

interface StatusBadgeProps {
  status: BadgeStatus;
  customText?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, customText }) => {
  switch (status) {
    case 'COMPLETED':
      return (
        <span className="inline-flex items-center space-x-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs px-2.5 py-1 rounded-full font-bold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{customText || 'สำเร็จแล้ว'}</span>
        </span>
      );
    case 'AVAILABLE':
      return (
        <span className="inline-flex items-center space-x-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs px-2.5 py-1 rounded-full font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{customText || 'เปิดให้เล่น'}</span>
        </span>
      );
    case 'IN_PROGRESS':
      return (
        <span className="inline-flex items-center space-x-1 bg-sky-500/20 text-sky-300 border border-sky-500/40 text-xs px-2.5 py-1 rounded-full font-bold">
          <Clock className="w-3.5 h-3.5 animate-pulse" />
          <span>{customText || 'กำลังทำภารกิจ'}</span>
        </span>
      );
    case 'DEVELOPING':
      return (
        <span className="inline-flex items-center space-x-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs px-2.5 py-1 rounded-full font-bold">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{customText || 'กำลังพัฒนา'}</span>
        </span>
      );
    case 'LOCKED':
    default:
      return (
        <span className="inline-flex items-center space-x-1 bg-slate-800 text-slate-400 border border-slate-700 text-xs px-2.5 py-1 rounded-full font-bold">
          <Lock className="w-3.5 h-3.5" />
          <span>{customText || 'ยังไม่เปิด'}</span>
        </span>
      );
  }
};
