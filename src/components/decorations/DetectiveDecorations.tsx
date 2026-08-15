import React from 'react';

// Pin Icon (หมุดปักบอร์ดไม้ก๊อก สีแดง/เหลือง/เขียว)
export const PushPin: React.FC<{ color?: 'red' | 'yellow' | 'blue' | 'green'; className?: string }> = ({
  color = 'red',
  className = ''
}) => {
  const colorMap = {
    red: { top: '#EF4444', shade: '#B91C1C', tip: '#991B1B' },
    yellow: { top: '#FACC15', shade: '#CA8A04', tip: '#854D0E' },
    blue: { top: '#38BDF8', shade: '#0284C7', tip: '#0369A1' },
    green: { top: '#4ADE80', shade: '#16A34A', tip: '#15803D' }
  };
  const c = colorMap[color];

  return (
    <div className={`inline-block select-none drop-shadow-md pointer-events-none ${className}`}>
      <svg width="24" height="28" viewBox="0 0 24 28" fill="none">
        <ellipse cx="12" cy="8" rx="8" ry="4" fill={c.top} stroke={c.shade} strokeWidth="1.5" />
        <path d="M6 8 L10 16 L14 16 L18 8 Z" fill={c.shade} />
        <ellipse cx="12" cy="16" rx="4" ry="2" fill={c.top} />
        <line x1="12" y1="16" x2="12" y2="26" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
};

// Tape Sticker (สก็อตเทปใส/กระดาษกาวปักมุม)
export const TapeSticker: React.FC<{ className?: string; angle?: number }> = ({
  className = '',
  angle = -5
}) => {
  return (
    <div
      className={`absolute z-20 pointer-events-none ${className}`}
      style={{ transform: `rotate(${angle}deg)` }}
    >
      <div className="w-16 h-5 bg-amber-100/75 dark:bg-amber-200/50 backdrop-blur-xs border border-amber-300/40 shadow-xs transform -translate-x-1/2 -translate-y-1/2 rounded-[2px]" />
    </div>
  );
};

// Paw Print (รอยเท้าแมว/หมานักสืบ)
export const PawPrint: React.FC<{ className?: string; size?: number; opacity?: number; color?: string }> = ({
  className = '',
  size = 28,
  opacity = 0.25,
  color = '#F59E0B'
}) => {
  return (
    <div className={`inline-block pointer-events-none select-none ${className}`} style={{ width: size, height: size, opacity }}>
      <svg viewBox="0 0 40 40" fill={color}>
        {/* Main pad */}
        <path d="M20 22 C14 22 10 26 12 33 C14 37 26 37 28 33 C30 26 26 22 20 22 Z" />
        {/* 4 Toe pads */}
        <ellipse cx="10" cy="17" rx="3.5" ry="4.5" transform="rotate(-20 10 17)" />
        <ellipse cx="17" cy="12" rx="3.5" ry="5" />
        <ellipse cx="23" cy="12" rx="3.5" ry="5" />
        <ellipse cx="30" cy="17" rx="3.5" ry="4.5" transform="rotate(20 30 17)" />
      </svg>
    </div>
  );
};

// Magnifying Glass Badge Icon (แว่นขยายทองคำสัญลักษณ์นักสืบ)
export const GoldenMagnifierBadge: React.FC<{ size?: number; className?: string }> = ({
  size = 48,
  className = ''
}) => {
  return (
    <div className={`inline-block select-none ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-md">
        {/* Golden Laurel / Ribbons */}
        <circle cx="50" cy="50" r="44" fill="url(#goldGrad)" stroke="#B45309" strokeWidth="4" />
        <circle cx="50" cy="50" r="38" fill="#1E293B" stroke="#FDE047" strokeWidth="2" strokeDasharray="3 3" />
        
        {/* Magnifying Glass */}
        <circle cx="44" cy="42" r="20" fill="#38BDF8" fillOpacity="0.4" stroke="#FACC15" strokeWidth="5" />
        <path d="M32 32 Q40 24 48 26" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
        {/* Handle */}
        <rect x="56" y="54" width="8" height="24" rx="3" transform="rotate(-45 56 54)" fill="#B45309" stroke="#78350F" strokeWidth="2" />
        <circle cx="68" cy="68" r="4" fill="#FACC15" />

        <defs>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

// Detective Stamp (ตราประทับ "สืบสวนผ่านแล้ว / TOP SECRET")
export const DetectiveStamp: React.FC<{ text: string; color?: 'green' | 'red' | 'amber'; className?: string }> = ({
  text,
  color = 'green',
  className = ''
}) => {
  const styles = {
    green: 'border-emerald-600/80 text-emerald-600 bg-emerald-50/90 dark:bg-emerald-950/70',
    red: 'border-rose-600/80 text-rose-600 bg-rose-50/90 dark:bg-rose-950/70',
    amber: 'border-amber-600/80 text-amber-600 bg-amber-50/90 dark:bg-amber-950/70'
  };

  return (
    <div className={`inline-block border-2 border-dashed font-black font-mono text-[10px] sm:text-xs px-2.5 py-1 rounded-md transform -rotate-6 uppercase tracking-wider shadow-sm select-none ${styles[color]} ${className}`}>
      ★ {text} ★
    </div>
  );
};

// Sticky Note Component (กระดาษโน้ตสีเหลืองแปะเบาะแส)
export const StickyNote: React.FC<{
  title: string;
  children: React.ReactNode;
  pinColor?: 'red' | 'yellow' | 'blue' | 'green';
  className?: string;
}> = ({
  title,
  children,
  pinColor = 'red',
  className = ''
}) => {
  return (
    <div className={`relative bg-amber-100 dark:bg-amber-200/95 text-slate-800 p-4 rounded-lg shadow-lg border-b-4 border-amber-300 transform -rotate-1 hover:rotate-0 transition-transform ${className}`}>
      {/* Top Push Pin */}
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
        <PushPin color={pinColor} />
      </div>
      
      <div className="pt-1">
        <h4 className="font-bold text-xs font-mono uppercase tracking-wide text-amber-900 flex items-center gap-1.5 border-b border-amber-300/60 pb-1 mb-2">
          <span>📌</span> {title}
        </h4>
        <div className="text-xs text-slate-700 leading-relaxed font-sans">
          {children}
        </div>
      </div>
    </div>
  );
};
