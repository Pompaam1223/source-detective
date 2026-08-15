import React from 'react';
import { SourceCard } from '../types';
import { ShieldCheck, AlertTriangle, ExternalLink, Building2, Calendar, FileText, Tag, ShoppingBag } from 'lucide-react';

interface SourceCardComponentProps {
  card: SourceCard;
  isSelected?: boolean;
  onSelect?: () => void;
  compact?: boolean;
}

export const SourceCardComponent: React.FC<SourceCardComponentProps> = ({
  card,
  isSelected = false,
  onSelect,
  compact = false
}) => {
  const getRiskFlagLabel = (flag: string) => {
    switch (flag) {
      case 'advertisement': return '📢 สื่อโฆษณา';
      case 'unsupportedClaim': return '❌ ข้ออ้างเกินจริง';
      case 'commercialInterest': return '💰 หวังผลการค้า';
      case 'personalExperience': return '👤 ประสบการณ์ส่วนตัว';
      case 'generalization': return '⚠️ สรุปเหมาเข่ง';
      case 'noEvidence': return '🚫 ไร้หลักฐานอ้างอิง';
      case 'urgency': return '⚡ เร่งรัดการตัดสินใจ';
      default: return flag;
    }
  };

  return (
    <div
      onClick={onSelect}
      className={`rounded-2xl border transition-all duration-200 shadow-md ${
        onSelect ? 'cursor-pointer hover:border-amber-400 hover:shadow-lg' : ''
      } ${
        isSelected
          ? 'bg-amber-950/40 border-amber-400 ring-2 ring-amber-400/50'
          : card.isSimulated
          ? 'bg-slate-900/90 border-red-500/40'
          : 'bg-slate-900 border-slate-700/80'
      } ${compact ? 'p-4' : 'p-5 sm:p-6'}`}
    >
      {/* Simulation Warning Banner if simulated */}
      {card.isSimulated && (
        <div className="mb-3 bg-red-500/20 border border-red-500/50 rounded-xl px-3 py-1.5 flex items-center justify-between text-red-300 text-xs font-bold font-mono">
          <div className="flex items-center space-x-1.5">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>⚠️ สถานการณ์จำลองสำหรับเกม</span>
          </div>
          <span className="text-[10px] bg-red-500/30 px-2 py-0.5 rounded text-red-200">
            {card.sourceCardId}
          </span>
        </div>
      )}

      {/* Header Info */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
          <span className="bg-amber-500/20 text-amber-300 font-mono font-extrabold text-xs px-2.5 py-1 rounded-lg border border-amber-500/40">
            {card.sourceCardId}
          </span>
          <span className="text-xs font-bold text-slate-300 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
            {card.sourceType}
          </span>
          {card.isVerified && (
            <span className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ยืนยันแล้ว</span>
            </span>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-base sm:text-lg font-bold text-amber-200 leading-snug mb-2">
        {card.title}
      </h3>

      {/* Publisher & Date Meta */}
      <div className="space-y-1 text-xs text-slate-400 mb-3 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-1.5">
          <Building2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="font-semibold text-slate-300">ผู้เผยแพร่:</span>
          <span className="text-slate-200">{card.publisher}</span>
        </div>
        {card.publicationDate && (
          <div className="flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-semibold text-slate-300">วันที่:</span>
            <span>{card.publicationDate}</span>
          </div>
        )}
      </div>

      {/* Main Content Box */}
      <div className="bg-slate-950/80 rounded-xl p-3.5 border border-slate-800/80 text-xs sm:text-sm text-slate-200 leading-relaxed space-y-2 mb-3">
        <div className="flex items-start space-x-2">
          <FileText className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-mono text-[11px] text-slate-400 uppercase tracking-wider mb-1">
              ข้อความในแผ่นเบาะแส (Content)
            </p>
            <p className="text-slate-100 italic">"{card.content}"</p>
          </div>
        </div>

        {/* CTA Simulated Button if SC05 or SC10 */}
        {(card.sourceCardId === 'SC05' || card.sourceCardId === 'SC10') && (
          <div className="pt-2 border-t border-slate-800 flex justify-end">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); alert('นี่คือปุ่มโฆษณาจำลองในเกม สำหรับฝึกวิเคราะห์ความเสี่ยง'); }}
              className="bg-red-600/80 hover:bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1 animate-pulse"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>สั่งซื้อทันที (โฆษณาจำลอง)</span>
            </button>
          </div>
        )}
      </div>

      {/* Risk Flags if present */}
      {card.riskFlags && card.riskFlags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {card.riskFlags.map((flag, idx) => (
            <span
              key={idx}
              className="text-[11px] font-bold bg-red-900/40 text-red-300 border border-red-500/40 px-2 py-0.5 rounded-md"
            >
              {getRiskFlagLabel(flag)}
            </span>
          ))}
        </div>
      )}

      {/* Footer: Purpose or Source Link */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
        {card.learningPurpose && (
          <div className="flex items-center space-x-1 text-amber-400/90 font-medium">
            <Tag className="w-3 h-3 shrink-0" />
            <span>{card.learningPurpose}</span>
          </div>
        )}

        {card.sourceUrl && (
          <a
            href={card.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center space-x-1 text-slate-400 hover:text-amber-300 underline font-mono text-[10px]"
          >
            <span>ดูแหล่งข้อมูลจริง</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
};
