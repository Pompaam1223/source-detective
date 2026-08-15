import React, { useState } from 'react';
import { SourceCard } from '../../types';
import {
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Info,
  Calendar,
  User,
  FileText,
  Sparkles,
  Maximize2,
  Minimize2,
  Layers
} from 'lucide-react';

interface SourceCardViewerProps {
  sourceCards: SourceCard[];
  activeCardId?: string;
  onCardSelect?: (cardId: string) => void;
  compact?: boolean;
}

export const SourceCardViewer: React.FC<SourceCardViewerProps> = ({
  sourceCards,
  activeCardId,
  onCardSelect,
  compact = false
}) => {
  const [selectedId, setSelectedId] = useState<string>(
    activeCardId || (sourceCards.length > 0 ? sourceCards[0].sourceCardId : '')
  );
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Sync activeCardId if changed externally
  React.useEffect(() => {
    if (activeCardId) {
      setSelectedId(activeCardId);
    } else if (sourceCards.length > 0 && !sourceCards.find(c => c.sourceCardId === selectedId)) {
      setSelectedId(sourceCards[0].sourceCardId);
    }
  }, [activeCardId, sourceCards]);

  const activeCard = sourceCards.find(c => c.sourceCardId === selectedId) || sourceCards[0];

  if (!activeCard) {
    return null;
  }

  const handleSelect = (id: string) => {
    setSelectedId(id);
    if (onCardSelect) onCardSelect(id);
  };

  return (
    <div className="space-y-3">
      {/* Multiple Cards Tab Selector (if > 1 card) */}
      {sourceCards.length > 1 && (
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-thin">
          <span className="text-xs font-mono font-bold text-slate-500 shrink-0 flex items-center space-x-1">
            <Layers className="w-3.5 h-3.5" />
            <span>แผ่นเบาะแส:</span>
          </span>
          {sourceCards.map(c => {
            const isCurrent = c.sourceCardId === selectedId;
            return (
              <button
                key={c.sourceCardId}
                onClick={() => handleSelect(c.sourceCardId)}
                className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all shrink-0 flex items-center space-x-1.5 ${
                  isCurrent
                    ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-400'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                <span>{c.sourceCardId}</span>
                {c.isSimulated && <span className="text-[10px]">⚠️</span>}
              </button>
            );
          })}
        </div>
      )}

      {/* Active Card Body */}
      <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl overflow-hidden shadow-lg text-slate-100 transition-all">
        {/* Card Header */}
        <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="bg-amber-500 text-slate-950 font-mono font-black text-xs px-2.5 py-0.5 rounded-lg shadow-sm">
              {activeCard.sourceCardId}
            </span>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-100 truncate max-w-xs sm:max-w-md">
              {activeCard.title}
            </h3>
          </div>

          {/* Verification Badge */}
          <div className="flex items-center space-x-2">
            {activeCard.isSimulated ? (
              <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1 animate-pulse">
                <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0" />
                <span>⚠️ สถานการณ์จำลองสำหรับเกม</span>
              </span>
            ) : activeCard.isVerified ? (
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>{activeCard.sourceType}</span>
              </span>
            ) : (
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                <Info className="w-3 h-3 text-amber-400 shrink-0" />
                <span>{activeCard.sourceType}</span>
              </span>
            )}

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition-colors"
              title={isExpanded ? 'ย่อมุมมอง' : 'ขยายมุมมอง'}
            >
              {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Card Metadata Row */}
        <div className="px-4 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 font-mono">
          <div className="flex items-center space-x-1.5">
            <User className="w-3.5 h-3.5 text-amber-400" />
            <span>ผู้เผยแพร่: <strong className="text-slate-200">{activeCard.publisher}</strong></span>
          </div>

          {activeCard.publicationDate && (
            <div className="flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-sky-400" />
              <span>วันที่: <span className="text-slate-300">{activeCard.publicationDate}</span></span>
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-4 sm:p-5 space-y-3">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider font-mono flex items-center space-x-1">
              <FileText className="w-3.5 h-3.5" />
              <span>ข้อความจากแหล่งข้อมูล:</span>
            </span>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-slate-200 text-sm leading-relaxed whitespace-pre-line font-serif italic">
              "{activeCard.content}"
            </div>
          </div>

          {/* Expanded extra metadata */}
          {isExpanded && (
            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs animate-fadeIn">
              {activeCard.claim && (
                <div className="text-slate-300">
                  <strong className="text-amber-400 font-mono">สาระสำคัญ / ข้ออ้าง:</strong> {activeCard.claim}
                </div>
              )}

              {activeCard.learningPurpose && (
                <div className="text-sky-300 bg-sky-950/40 p-2.5 rounded-xl border border-sky-800/50 flex items-start space-x-2">
                  <Sparkles className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <span><strong>จุดสังเกตสำหรับนักสืบ:</strong> {activeCard.learningPurpose}</span>
                </div>
              )}

              {activeCard.sourceUrl && (
                <div className="pt-1">
                  <a
                    href={activeCard.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 hover:text-amber-300 flex items-center space-x-1 font-mono underline"
                  >
                    <span>เปิดดูแหล่งอ้างอิงต้นฉบับภายนอก</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
