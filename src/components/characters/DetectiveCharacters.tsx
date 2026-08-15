import React from 'react';

interface CharacterProps {
  className?: string;
  size?: number | string;
  variant?: 'normal' | 'happy' | 'thinking' | 'surprised' | 'investigating';
  animated?: boolean;
}

// 1. Detective Cat Mascot (เจ้าเหมียวนักสืบ แคทล็อค)
export const DetectiveCat: React.FC<CharacterProps> = ({
  className = '',
  size = 120,
  variant = 'normal',
  animated = true
}) => {
  return (
    <div
      className={`inline-block select-none relative ${animated ? 'hover:scale-105 transition-transform duration-300' : ''} ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Shadow */}
        <ellipse cx="100" cy="188" rx="65" ry="10" fill="#000000" fillOpacity="0.18" />

        {/* Tail */}
        <path
          d="M150 145 C175 140 185 110 175 95 C168 85 158 92 162 105 C166 118 155 135 140 142 Z"
          fill="#D97706"
          stroke="#78350F"
          strokeWidth="3"
        />

        {/* Cat Body in Detective Trench Coat */}
        <path
          d="M65 140 C65 115 80 105 100 105 C120 105 135 115 135 140 L145 180 C145 185 140 188 100 188 C60 188 55 185 55 180 Z"
          fill="#92400E"
          stroke="#451A03"
          strokeWidth="3.5"
        />

        {/* Coat Lapels & Collar */}
        <path d="M78 118 L100 145 L122 118 L100 105 Z" fill="#B45309" stroke="#451A03" strokeWidth="2.5" />
        <path d="M100 145 L100 185" stroke="#451A03" strokeWidth="3" strokeDasharray="4 3" />
        {/* Yellow/Gold Buttons */}
        <circle cx="93" cy="155" r="3.5" fill="#FBBF24" stroke="#78350F" strokeWidth="1.5" />
        <circle cx="107" cy="155" r="3.5" fill="#FBBF24" stroke="#78350F" strokeWidth="1.5" />
        <circle cx="93" cy="170" r="3.5" fill="#FBBF24" stroke="#78350F" strokeWidth="1.5" />
        <circle cx="107" cy="170" r="3.5" fill="#FBBF24" stroke="#78350F" strokeWidth="1.5" />

        {/* Red detective tie / ribbon */}
        <path d="M96 115 L104 115 L106 132 L100 138 L94 132 Z" fill="#DC2626" stroke="#7F1D1D" strokeWidth="1.5" />

        {/* Cat Paws */}
        <ellipse cx="78" cy="180" rx="12" ry="7" fill="#FDE68A" stroke="#78350F" strokeWidth="2.5" />
        <ellipse cx="122" cy="180" rx="12" ry="7" fill="#FDE68A" stroke="#78350F" strokeWidth="2.5" />

        {/* Cat Head */}
        <circle cx="100" cy="78" r="46" fill="#F59E0B" stroke="#78350F" strokeWidth="3.5" />

        {/* Cat Ears */}
        <path d="M60 52 L42 16 C48 15 62 25 72 38 Z" fill="#D97706" stroke="#78350F" strokeWidth="3" />
        <path d="M52 44 L45 22 C49 22 57 28 62 36 Z" fill="#FCA5A5" />
        <path d="M140 52 L158 16 C152 15 138 25 128 38 Z" fill="#D97706" stroke="#78350F" strokeWidth="3" />
        <path d="M148 44 L155 22 C151 22 143 28 138 36 Z" fill="#FCA5A5" />

        {/* Detective Deerstalker Hat */}
        <path
          d="M48 60 C50 30 75 18 100 18 C125 18 150 30 152 60 C155 64 145 66 100 66 C55 66 45 64 48 60 Z"
          fill="#78350F"
          stroke="#451A03"
          strokeWidth="3.5"
        />
        {/* Hat Visor Front & Back */}
        <path d="M42 62 C50 56 70 54 100 54 C130 54 150 56 158 62 C162 68 140 70 100 70 C60 70 38 68 42 62 Z" fill="#92400E" stroke="#451A03" strokeWidth="2.5" />
        {/* Hat Ribbon / Bow */}
        <rect x="75" y="16" width="50" height="7" rx="3.5" fill="#DC2626" stroke="#7F1D1D" strokeWidth="1.5" />
        <circle cx="100" cy="19.5" r="4.5" fill="#EF4444" stroke="#7F1D1D" strokeWidth="1.5" />

        {/* Cheeks Blush */}
        <ellipse cx="68" cy="88" rx="8" ry="5" fill="#F87171" fillOpacity="0.5" />
        <ellipse cx="132" cy="88" rx="8" ry="5" fill="#F87171" fillOpacity="0.5" />

        {/* Whiskers */}
        <path d="M52 82 L26 78 M50 88 L24 88 M52 94 L26 98" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
        <path d="M148 82 L174 78 M150 88 L176 88 M148 94 L174 98" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />

        {/* Eyes (Cute big sparkle eyes or winking) */}
        {variant === 'happy' || variant === 'investigating' ? (
          <>
            {/* Left eye winking */}
            <path d="M68 76 Q78 68 88 76" stroke="#1E1B4B" strokeWidth="4" strokeLinecap="round" fill="none" />
            {/* Right eye big sparkle */}
            <circle cx="122" cy="74" r="10" fill="#1E1B4B" />
            <circle cx="119" cy="71" r="3.5" fill="#FFFFFF" />
            <circle cx="125" cy="76" r="1.5" fill="#FFFFFF" />
          </>
        ) : (
          <>
            {/* Left Eye */}
            <circle cx="78" cy="74" r="9" fill="#1E1B4B" />
            <circle cx="75" cy="71" r="3.5" fill="#FFFFFF" />
            <circle cx="81" cy="76" r="1.5" fill="#FFFFFF" />
            {/* Right Eye */}
            <circle cx="122" cy="74" r="9" fill="#1E1B4B" />
            <circle cx="119" cy="71" r="3.5" fill="#FFFFFF" />
            <circle cx="125" cy="76" r="1.5" fill="#FFFFFF" />
          </>
        )}

        {/* Cute Pink Nose */}
        <polygon points="100,82 94,76 106,76" fill="#EF4444" />

        {/* Smile Mouth */}
        <path d="M94 84 Q100 88 100 91 Q100 88 106 84" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M96 90 Q100 98 104 90" fill="#F87171" stroke="#78350F" strokeWidth="1.5" />

        {/* Hand holding Magnifying Glass */}
        <g transform="translate(130, 95) rotate(-15)">
          {/* Glass Handle */}
          <rect x="24" y="24" width="8" height="28" rx="3" fill="#78350F" stroke="#451A03" strokeWidth="2" />
          {/* Rim */}
          <circle cx="20" cy="18" r="22" fill="#E0F2FE" fillOpacity="0.6" stroke="#F59E0B" strokeWidth="5" />
          {/* Shine reflection */}
          <path d="M8 12 Q14 6 22 6" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* Paw holding */}
          <circle cx="28" cy="36" r="8" fill="#FDE68A" stroke="#78350F" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
};

// 2. Boy Detective with Magnifying Glass (นักสืบโคนัน/เชอร์ล็อกน้อย) - Mission 1
export const DetectiveBoySearch: React.FC<CharacterProps> = ({
  className = '',
  size = 140,
  animated = true
}) => {
  return (
    <div
      className={`inline-block select-none relative ${animated ? 'hover:scale-105 transition-transform duration-300' : ''} ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md" fill="none">
        {/* Shadow */}
        <ellipse cx="100" cy="188" rx="60" ry="8" fill="#000000" fillOpacity="0.18" />

        {/* Trench Coat Body */}
        <path
          d="M60 135 C60 115 78 110 100 110 C122 110 140 115 140 135 L148 185 C148 188 135 190 100 190 C65 190 52 188 52 185 Z"
          fill="#854D0E"
          stroke="#422006"
          strokeWidth="3.5"
        />
        {/* Coat details & Belt */}
        <path d="M78 118 L100 145 L122 118 L100 110 Z" fill="#A16207" stroke="#422006" strokeWidth="2.5" />
        <rect x="68" y="152" width="64" height="9" rx="2" fill="#713F12" stroke="#422006" strokeWidth="2" />
        <rect x="94" y="150" width="12" height="13" rx="2" fill="#FACC15" stroke="#713F12" strokeWidth="1.5" />

        {/* Neck & Tie */}
        <path d="M92 110 L108 110 L104 128 L100 134 L96 128 Z" fill="#0284C7" stroke="#0369A1" strokeWidth="1.5" />

        {/* Face */}
        <ellipse cx="100" cy="80" rx="42" ry="38" fill="#FED7AA" stroke="#7C2D12" strokeWidth="3" />

        {/* Hair - Cute Spiky anime brown hair */}
        <path
          d="M58 72 C55 50 68 35 90 32 C115 30 142 42 144 70 C146 76 142 85 138 88 C135 78 135 62 125 55 C115 48 100 52 92 56 C80 50 68 56 62 68 Z"
          fill="#451A03"
        />

        {/* Detective Deerstalker Hat */}
        <path
          d="M48 62 C50 32 75 22 100 22 C125 22 150 32 152 62 C158 66 145 68 100 68 C55 68 42 66 48 62 Z"
          fill="#A16207"
          stroke="#422006"
          strokeWidth="3.5"
        />
        <path d="M42 64 C55 58 75 56 100 56 C125 56 145 58 158 64 C162 70 142 72 100 72 C58 72 38 70 42 64 Z" fill="#713F12" stroke="#422006" strokeWidth="2.5" />
        <rect x="76" y="20" width="48" height="6" rx="3" fill="#CA8A04" />

        {/* Ears */}
        <ellipse cx="58" cy="82" rx="7" ry="10" fill="#FED7AA" stroke="#7C2D12" strokeWidth="2" />
        <ellipse cx="142" cy="82" rx="7" ry="10" fill="#FED7AA" stroke="#7C2D12" strokeWidth="2" />

        {/* Cheeks */}
        <circle cx="74" cy="90" r="7" fill="#FCA5A5" fillOpacity="0.6" />
        <circle cx="126" cy="90" r="7" fill="#FCA5A5" fillOpacity="0.6" />

        {/* Left Eye normal, Right eye magnified by glass! */}
        <circle cx="78" cy="78" r="7" fill="#1E1B4B" />
        <circle cx="76" cy="76" r="2.5" fill="#FFFFFF" />
        {/* Eyebrows */}
        <path d="M72 70 Q78 66 84 69" stroke="#451A03" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M116 66 Q126 62 134 68" stroke="#451A03" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Nose & Smile */}
        <ellipse cx="98" cy="84" rx="2" ry="2" fill="#C2410C" />
        <path d="M92 92 Q100 100 108 92" stroke="#7C2D12" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Big Magnifying Glass in front of Right Eye */}
        <g transform="translate(100, 48)">
          <circle cx="28" cy="30" r="24" fill="#BAE6FD" fillOpacity="0.45" stroke="#F59E0B" strokeWidth="6" />
          {/* Big cute magnified eye behind glass */}
          <circle cx="28" cy="30" r="12" fill="#1E1B4B" />
          <circle cx="24" cy="26" r="4.5" fill="#FFFFFF" />
          <circle cx="32" cy="33" r="2" fill="#FFFFFF" />
          {/* Glass shine */}
          <path d="M14 20 Q22 12 32 14" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" fill="none" />
          {/* Handle */}
          <rect x="42" y="46" width="10" height="30" rx="4" transform="rotate(35 42 46)" fill="#78350F" stroke="#451A03" strokeWidth="2.5" />
          {/* Cute hand */}
          <circle cx="58" cy="74" r="9" fill="#FED7AA" stroke="#7C2D12" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
};

// 3. Girl Detective with Flashlight & Clue Book (นักสืบสาวไฟฉาย/สมุดบันทึก) - Mission 2
export const DetectiveGirlFlashlight: React.FC<CharacterProps> = ({
  className = '',
  size = 140,
  animated = true
}) => {
  return (
    <div
      className={`inline-block select-none relative ${animated ? 'hover:scale-105 transition-transform duration-300' : ''} ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md" fill="none">
        {/* Shadow */}
        <ellipse cx="100" cy="188" rx="60" ry="8" fill="#000000" fillOpacity="0.18" />

        {/* Hair Back Pigtails / Twintails */}
        <path d="M45 80 C30 95 25 130 45 145 C50 148 55 135 50 115 Z" fill="#78350F" stroke="#451A03" strokeWidth="2.5" />
        <path d="M155 80 C170 95 175 130 155 145 C150 148 145 135 150 115 Z" fill="#78350F" stroke="#451A03" strokeWidth="2.5" />

        {/* Trench Coat Body */}
        <path
          d="M62 135 C62 118 78 112 100 112 C122 112 138 118 138 135 L146 185 C146 188 135 190 100 190 C65 190 54 188 54 185 Z"
          fill="#B45309"
          stroke="#451A03"
          strokeWidth="3.5"
        />
        {/* Coat details */}
        <path d="M80 120 L100 142 L120 120 L100 112 Z" fill="#D97706" stroke="#451A03" strokeWidth="2" />
        {/* Pink Scarf */}
        <path d="M88 112 Q100 122 112 112 Q105 132 95 132 Z" fill="#F43F5E" stroke="#9F1239" strokeWidth="1.5" />

        {/* Face */}
        <ellipse cx="100" cy="80" rx="40" ry="36" fill="#FFEDD5" stroke="#7C2D12" strokeWidth="3" />

        {/* Front Hair Bangs */}
        <path
          d="M60 68 C65 52 82 45 100 45 C118 45 135 52 140 68 C135 60 120 54 100 54 C80 54 65 60 60 68 Z"
          fill="#92400E"
        />
        <path d="M60 68 Q75 78 88 68 Q100 80 112 68 Q125 78 140 68" fill="#92400E" stroke="#451A03" strokeWidth="2" />

        {/* Detective Beret / Hat */}
        <ellipse cx="100" cy="46" rx="46" ry="18" fill="#78350F" stroke="#451A03" strokeWidth="3" />
        <circle cx="100" cy="32" r="5" fill="#F59E0B" stroke="#78350F" strokeWidth="2" />

        {/* Cheeks */}
        <circle cx="75" cy="90" r="7" fill="#FB7185" fillOpacity="0.6" />
        <circle cx="125" cy="90" r="7" fill="#FB7185" fillOpacity="0.6" />

        {/* Sparkly Big Anime Eyes */}
        <circle cx="80" cy="78" r="8" fill="#1E1B4B" />
        <circle cx="77" cy="75" r="3" fill="#FFFFFF" />
        <circle cx="83" cy="80" r="1.5" fill="#FFFFFF" />
        <circle cx="120" cy="78" r="8" fill="#1E1B4B" />
        <circle cx="117" cy="75" r="3" fill="#FFFFFF" />
        <circle cx="123" cy="80" r="1.5" fill="#FFFFFF" />

        {/* Cheerful Mouth */}
        <path d="M94 90 Q100 98 106 90" stroke="#9F1239" strokeWidth="2.5" strokeLinecap="round" fill="#F43F5E" />

        {/* Clue Notebook in left hand */}
        <g transform="translate(42, 125) rotate(-10)">
          <rect x="0" y="0" width="28" height="38" rx="4" fill="#3B82F6" stroke="#1E3A8A" strokeWidth="2" />
          <rect x="4" y="4" width="20" height="30" rx="2" fill="#FEF08A" />
          {/* Note lines */}
          <line x1="8" y1="10" x2="20" y2="10" stroke="#94A3B8" strokeWidth="1.5" />
          <line x1="8" y1="16" x2="20" y2="16" stroke="#94A3B8" strokeWidth="1.5" />
          <line x1="8" y1="22" x2="16" y2="22" stroke="#94A3B8" strokeWidth="1.5" />
          {/* Bookmark ribbon */}
          <path d="M14 0 L14 8 L18 4 L22 8 L22 0" fill="#EF4444" />
        </g>

        {/* Flashlight in right hand with glowing light beam */}
        <g transform="translate(125, 120) rotate(20)">
          {/* Light Cone Glow */}
          <polygon points="35,10 85,-10 85,35 35,20" fill="#FEF08A" fillOpacity="0.45" />
          {/* Flashlight Body */}
          <rect x="0" y="8" width="25" height="12" rx="3" fill="#475569" stroke="#0F172A" strokeWidth="2" />
          <path d="M25 5 L35 2 L35 25 L25 22 Z" fill="#F59E0B" stroke="#78350F" strokeWidth="2" />
          {/* Glow bulb */}
          <ellipse cx="35" cy="13.5" rx="3" ry="10" fill="#FEF08A" />
          {/* Hand holding */}
          <circle cx="12" cy="14" r="7" fill="#FFEDD5" stroke="#7C2D12" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
};

// 4. Detective Boy Pondering / Weighing Evidence (นักสืบช่างคิด ตาชั่งความจริง) - Mission 3
export const DetectiveBoyPonder: React.FC<CharacterProps> = ({
  className = '',
  size = 140,
  animated = true
}) => {
  return (
    <div
      className={`inline-block select-none relative ${animated ? 'hover:scale-105 transition-transform duration-300' : ''} ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md" fill="none">
        {/* Shadow */}
        <ellipse cx="100" cy="188" rx="60" ry="8" fill="#000000" fillOpacity="0.18" />

        {/* Lightbulb Idea floating above */}
        <g transform="translate(140, 15)" className="animate-bounce">
          <circle cx="15" cy="15" r="12" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" />
          <rect x="11" y="24" width="8" height="5" rx="1.5" fill="#94A3B8" stroke="#475569" strokeWidth="1" />
          {/* Glow rays */}
          <line x1="15" y1="0" x2="15" y2="-4" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
          <line x1="28" y1="8" x2="32" y2="5" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
          <line x1="2" y1="8" x2="-2" y2="5" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Body Coat */}
        <path
          d="M60 135 C60 115 78 110 100 110 C122 110 140 115 140 135 L148 185 C148 188 135 190 100 190 C65 190 52 188 52 185 Z"
          fill="#475569"
          stroke="#0F172A"
          strokeWidth="3.5"
        />
        {/* Lapel & Green Tie */}
        <path d="M78 118 L100 145 L122 118 L100 110 Z" fill="#64748B" stroke="#0F172A" strokeWidth="2.5" />
        <path d="M94 110 L106 110 L103 130 L100 136 L97 130 Z" fill="#10B981" stroke="#047857" strokeWidth="1.5" />

        {/* Face */}
        <ellipse cx="100" cy="80" rx="42" ry="38" fill="#FED7AA" stroke="#7C2D12" strokeWidth="3" />

        {/* Detective Hat */}
        <path
          d="M48 62 C50 32 75 22 100 22 C125 22 150 32 152 62 C158 66 145 68 100 68 C55 68 42 66 48 62 Z"
          fill="#334155"
          stroke="#0F172A"
          strokeWidth="3.5"
        />
        <path d="M42 64 C55 58 75 56 100 56 C125 56 145 58 158 64 C162 70 142 72 100 72 C58 72 38 70 42 64 Z" fill="#1E293B" stroke="#0F172A" strokeWidth="2.5" />

        {/* Eyes thinking/curious */}
        <circle cx="78" cy="78" r="8" fill="#1E1B4B" />
        <circle cx="80" cy="74" r="3" fill="#FFFFFF" />
        <circle cx="122" cy="78" r="8" fill="#1E1B4B" />
        <circle cx="124" cy="74" r="3" fill="#FFFFFF" />

        {/* Inquisitive Eyebrows */}
        <path d="M70 66 Q78 62 86 68" stroke="#451A03" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M114 70 Q122 64 130 65" stroke="#451A03" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Cheeks */}
        <circle cx="74" cy="90" r="7" fill="#FCA5A5" fillOpacity="0.6" />
        <circle cx="126" cy="90" r="7" fill="#FCA5A5" fillOpacity="0.6" />

        {/* Thinking Hand on Chin */}
        <path d="M96 90 Q102 96 108 90" stroke="#7C2D12" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <g transform="translate(90, 88)">
          <circle cx="10" cy="12" r="9" fill="#FED7AA" stroke="#7C2D12" strokeWidth="2" />
          <path d="M8 6 L12 2" stroke="#7C2D12" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Scales of Evidence in foreground */}
        <g transform="translate(18, 120)">
          <line x1="20" y1="15" x2="20" y2="48" stroke="#CA8A04" strokeWidth="3" />
          <path d="M10 48 L30 48" stroke="#CA8A04" strokeWidth="3.5" strokeLinecap="round" />
          {/* Balance beam tilted slightly */}
          <line x1="5" y1="12" x2="35" y2="18" stroke="#EAB308" strokeWidth="3" strokeLinecap="round" />
          {/* Pan Left (True/Verified) */}
          <line x1="6" y1="12" x2="6" y2="26" stroke="#78350F" strokeWidth="1.5" />
          <path d="M0 26 Q6 32 12 26 Z" fill="#10B981" stroke="#047857" strokeWidth="1.5" />
          {/* Pan Right (Fake/Unreliable) */}
          <line x1="34" y1="18" x2="34" y2="34" stroke="#78350F" strokeWidth="1.5" />
          <path d="M28 34 Q34 40 40 34 Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
};

// 5. Master Detective Girl with Evidence Board & Tablet (นักสืบสาวบอร์ดรวบรวมหลักฐาน) - Mission 4
export const DetectiveGirlBoard: React.FC<CharacterProps> = ({
  className = '',
  size = 140,
  animated = true
}) => {
  return (
    <div
      className={`inline-block select-none relative ${animated ? 'hover:scale-105 transition-transform duration-300' : ''} ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md" fill="none">
        {/* Shadow */}
        <ellipse cx="100" cy="188" rx="60" ry="8" fill="#000000" fillOpacity="0.18" />

        {/* Long Brunette Hair */}
        <path d="M50 75 C35 95 35 150 55 165 C62 140 60 100 62 80 Z" fill="#581C87" stroke="#3B0764" strokeWidth="2.5" />
        <path d="M150 75 C165 95 165 150 145 165 C138 140 140 100 138 80 Z" fill="#581C87" stroke="#3B0764" strokeWidth="2.5" />

        {/* Purple/Burgundy Trench Coat */}
        <path
          d="M62 135 C62 118 78 112 100 112 C122 112 138 118 138 135 L146 185 C146 188 135 190 100 190 C65 190 54 188 54 185 Z"
          fill="#6B21A8"
          stroke="#3B0764"
          strokeWidth="3.5"
        />
        {/* Gold Trim & Lapel */}
        <path d="M80 120 L100 142 L120 120 L100 112 Z" fill="#7E22CE" stroke="#3B0764" strokeWidth="2" />
        <rect x="68" y="154" width="64" height="8" rx="2" fill="#581C87" stroke="#3B0764" strokeWidth="1.5" />
        <rect x="95" y="152" width="10" height="12" rx="2" fill="#FACC15" />

        {/* Face */}
        <ellipse cx="100" cy="80" rx="40" ry="36" fill="#FFEDD5" stroke="#7C2D12" strokeWidth="3" />

        {/* Glasses - Smart detective glasses! */}
        <rect x="68" y="70" width="24" height="18" rx="6" fill="#E0F2FE" fillOpacity="0.4" stroke="#DC2626" strokeWidth="3" />
        <rect x="108" y="70" width="24" height="18" rx="6" fill="#E0F2FE" fillOpacity="0.4" stroke="#DC2626" strokeWidth="3" />
        <line x1="92" y1="79" x2="108" y2="79" stroke="#DC2626" strokeWidth="3" />

        {/* Hair Bangs */}
        <path
          d="M60 68 C65 50 82 44 100 44 C118 44 135 50 140 68 C135 58 120 52 100 52 C80 52 65 58 60 68 Z"
          fill="#6B21A8"
        />

        {/* Detective Cap with Star Badge */}
        <path
          d="M48 60 C50 32 75 22 100 22 C125 22 150 32 152 60 C158 64 145 66 100 66 C55 66 42 64 48 60 Z"
          fill="#581C87"
          stroke="#3B0764"
          strokeWidth="3.5"
        />
        {/* Star Badge on Hat */}
        <circle cx="100" cy="38" r="8" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
        <polygon points="100,32 102,36 106,37 103,40 104,44 100,42 96,44 97,40 94,37 98,36" fill="#B45309" />

        {/* Sparkly Eyes behind glasses */}
        <circle cx="80" cy="79" r="6" fill="#1E1B4B" />
        <circle cx="78" cy="77" r="2.5" fill="#FFFFFF" />
        <circle cx="120" cy="79" r="6" fill="#1E1B4B" />
        <circle cx="118" cy="77" r="2.5" fill="#FFFFFF" />

        {/* Smile */}
        <path d="M95 93 Q100 99 105 93" stroke="#9F1239" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <circle cx="72" cy="92" r="5" fill="#FB7185" fillOpacity="0.6" />
        <circle cx="128" cy="92" r="5" fill="#FB7185" fillOpacity="0.6" />

        {/* Digital Detective Tablet in Hands */}
        <g transform="translate(68, 130)">
          <rect x="0" y="0" width="64" height="46" rx="5" fill="#1E293B" stroke="#0F172A" strokeWidth="2.5" />
          <rect x="4" y="4" width="56" height="38" rx="3" fill="#0284C7" />
          {/* Screen Content - Evidence Graphs and Checkmark */}
          <rect x="8" y="8" width="22" height="14" rx="2" fill="#38BDF8" />
          <rect x="34" y="8" width="22" height="14" rx="2" fill="#FDE047" />
          <path d="M12 32 L20 38 L32 26" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* Hands holding tablet */}
          <circle cx="2" cy="24" r="6" fill="#FFEDD5" stroke="#7C2D12" strokeWidth="1.5" />
          <circle cx="62" cy="24" r="6" fill="#FFEDD5" stroke="#7C2D12" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
};

// 6. Puppy Detective Assistant (เจ้าตูบวัตสัน)
export const DetectiveDog: React.FC<CharacterProps> = ({
  className = '',
  size = 110,
  animated = true
}) => {
  return (
    <div
      className={`inline-block select-none relative ${animated ? 'hover:scale-105 transition-transform duration-300' : ''} ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md" fill="none">
        {/* Shadow */}
        <ellipse cx="100" cy="188" rx="55" ry="8" fill="#000000" fillOpacity="0.18" />

        {/* Dog Body (Cute Corgi/Shiba) */}
        <ellipse cx="100" cy="145" rx="42" ry="38" fill="#EA580C" stroke="#7C2D12" strokeWidth="3.5" />
        <ellipse cx="100" cy="152" rx="26" ry="22" fill="#FFEDD5" />

        {/* Little Detective Cape */}
        <path d="M72 125 Q100 135 128 125 L135 155 Q100 165 65 155 Z" fill="#1E3A8A" stroke="#172554" strokeWidth="2.5" />
        {/* Bone / Badge Collar */}
        <rect x="80" y="122" width="40" height="7" rx="3" fill="#DC2626" />
        <circle cx="100" cy="132" r="6" fill="#FACC15" stroke="#B45309" strokeWidth="1.5" />

        {/* Big Floppy Dog Ears */}
        <path d="M48 65 C32 75 22 105 38 120 C46 122 55 105 52 82 Z" fill="#9A3412" stroke="#7C2D12" strokeWidth="3" />
        <path d="M152 65 C168 75 178 105 162 120 C154 122 145 105 148 82 Z" fill="#9A3412" stroke="#7C2D12" strokeWidth="3" />

        {/* Head */}
        <circle cx="100" cy="78" r="44" fill="#EA580C" stroke="#7C2D12" strokeWidth="3.5" />
        {/* White Muzzle & Forehead blaze */}
        <path d="M92 40 L108 40 L112 75 L125 90 C125 105 75 105 75 90 L88 75 Z" fill="#FFEDD5" stroke="#7C2D12" strokeWidth="2" />

        {/* Detective Cap */}
        <path
          d="M58 55 C60 28 80 18 100 18 C120 18 140 28 142 55 C146 58 135 60 100 60 C65 60 54 58 58 55 Z"
          fill="#78350F"
          stroke="#451A03"
          strokeWidth="3"
        />
        <rect x="78" y="16" width="44" height="6" rx="3" fill="#F59E0B" />

        {/* Cute Big Sparkling Eyes */}
        <circle cx="76" cy="70" r="8" fill="#1E1B4B" />
        <circle cx="73" cy="67" r="3" fill="#FFFFFF" />
        <circle cx="124" cy="70" r="8" fill="#1E1B4B" />
        <circle cx="121" cy="67" r="3" fill="#FFFFFF" />

        {/* Shiny Black Nose */}
        <ellipse cx="100" cy="85" rx="8" ry="6" fill="#0F172A" />
        <ellipse cx="98" cy="83" rx="2.5" ry="1.5" fill="#FFFFFF" />

        {/* Happy Dog Tongue Out! */}
        <path d="M94 92 Q100 96 100 100 Q100 96 106 92" stroke="#7C2D12" strokeWidth="2" fill="none" />
        <path d="M95 96 C95 106 105 106 105 96 Z" fill="#FB7185" stroke="#E11D48" strokeWidth="1.5" />

        {/* Cheeks */}
        <circle cx="68" cy="80" r="6" fill="#F87171" fillOpacity="0.5" />
        <circle cx="132" cy="80" r="6" fill="#F87171" fillOpacity="0.5" />

        {/* Paws */}
        <ellipse cx="78" cy="180" rx="14" ry="8" fill="#FFEDD5" stroke="#7C2D12" strokeWidth="2.5" />
        <ellipse cx="122" cy="180" rx="14" ry="8" fill="#FFEDD5" stroke="#7C2D12" strokeWidth="2.5" />
      </svg>
    </div>
  );
};

// 7. Detective Pair Celebrating with Golden Trophy (หน้าผลลัพธ์ / สำเร็จภารกิจ)
export const DetectiveTrophyCelebration: React.FC<{ size?: number; className?: string }> = ({
  size = 200,
  className = ''
}) => {
  return (
    <div className={`inline-block select-none relative ${className}`} style={{ width: size, height: size * 0.85 }}>
      <svg viewBox="0 0 300 240" className="w-full h-full drop-shadow-xl" fill="none">
        {/* Glow behind trophy */}
        <circle cx="150" cy="95" r="75" fill="#FEF08A" fillOpacity="0.35" />
        <circle cx="150" cy="95" r="50" fill="#FDE047" fillOpacity="0.4" />

        {/* Confetti / Stars */}
        <polygon points="150,15 153,23 162,24 155,30 157,38 150,34 143,38 145,30 138,24 147,23" fill="#F59E0B" />
        <polygon points="80,35 82,41 89,42 84,46 85,52 80,49 75,52 76,46 71,42 78,41" fill="#38BDF8" />
        <polygon points="220,35 222,41 229,42 224,46 225,52 220,49 215,52 216,46 211,42 218,41" fill="#EC4899" />
        <circle cx="110" cy="25" r="4" fill="#22C55E" />
        <circle cx="190" cy="25" r="4" fill="#EAB308" />

        {/* Boy Detective on Left waving */}
        <g transform="translate(20, 45) scale(0.65)">
          <ellipse cx="100" cy="80" rx="38" ry="34" fill="#FED7AA" stroke="#7C2D12" strokeWidth="3" />
          <path d="M50 60 C50 30 75 20 100 20 C125 20 150 30 150 60 Z" fill="#854D0E" stroke="#422006" strokeWidth="3" />
          <circle cx="78" cy="76" r="6" fill="#1E1B4B" />
          <circle cx="76" cy="74" r="2" fill="#FFFFFF" />
          <circle cx="122" cy="76" r="6" fill="#1E1B4B" />
          <circle cx="120" cy="74" r="2" fill="#FFFFFF" />
          <path d="M92 88 Q100 98 108 88" fill="#EF4444" stroke="#7C2D12" strokeWidth="2" />
          <circle cx="70" cy="86" r="6" fill="#FCA5A5" fillOpacity="0.7" />
          <circle cx="130" cy="86" r="6" fill="#FCA5A5" fillOpacity="0.7" />
          <path d="M60 130 C60 110 80 105 100 105 C120 105 140 110 140 130 L145 190 L55 190 Z" fill="#A16207" stroke="#422006" strokeWidth="3" />
          {/* Raised Arm cheering */}
          <path d="M55 125 L25 80 L35 75 L65 115 Z" fill="#A16207" stroke="#422006" strokeWidth="2" />
          <circle cx="28" cy="75" r="10" fill="#FED7AA" stroke="#7C2D12" strokeWidth="2" />
        </g>

        {/* Girl Detective on Right waving */}
        <g transform="translate(180, 45) scale(0.65)">
          <ellipse cx="100" cy="80" rx="38" ry="34" fill="#FFEDD5" stroke="#7C2D12" strokeWidth="3" />
          <ellipse cx="100" cy="46" rx="42" ry="16" fill="#78350F" stroke="#451A03" strokeWidth="3" />
          <circle cx="78" cy="76" r="6" fill="#1E1B4B" />
          <circle cx="76" cy="74" r="2" fill="#FFFFFF" />
          <circle cx="122" cy="76" r="6" fill="#1E1B4B" />
          <circle cx="120" cy="74" r="2" fill="#FFFFFF" />
          <path d="M92 88 Q100 98 108 88" fill="#F43F5E" stroke="#9F1239" strokeWidth="2" />
          <circle cx="70" cy="86" r="6" fill="#FB7185" fillOpacity="0.7" />
          <circle cx="130" cy="86" r="6" fill="#FB7185" fillOpacity="0.7" />
          <path d="M60 130 C60 110 80 105 100 105 C120 105 140 110 140 130 L145 190 L55 190 Z" fill="#B45309" stroke="#451A03" strokeWidth="3" />
          {/* Raised Arm cheering */}
          <path d="M145 125 L175 80 L165 75 L135 115 Z" fill="#B45309" stroke="#451A03" strokeWidth="2" />
          <circle cx="172" cy="75" r="10" fill="#FFEDD5" stroke="#7C2D12" strokeWidth="2" />
        </g>

        {/* Center Grand Golden Trophy */}
        <g transform="translate(95, 45)">
          {/* Trophy Cup */}
          <path d="M25 20 L85 20 C85 70 68 85 55 90 C42 85 25 70 25 20 Z" fill="url(#cupGold)" stroke="#B45309" strokeWidth="3" />
          {/* Handles */}
          <path d="M25 30 C5 30 5 60 27 65" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M85 30 C105 30 105 60 83 65" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round" fill="none" />
          {/* Stem & Pedestal */}
          <rect x="50" y="90" width="10" height="20" fill="#CA8A04" stroke="#854D0E" strokeWidth="2" />
          <path d="M30 110 L80 110 L85 130 L25 130 Z" fill="#78350F" stroke="#451A03" strokeWidth="2.5" />
          {/* Golden Badge on Base */}
          <rect x="35" y="115" width="40" height="10" rx="2" fill="#FACC15" stroke="#B45309" strokeWidth="1" />
          <text x="55" y="123" fill="#78350F" fontSize="6" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">MASTER</text>
          {/* Magnifying Glass Emblem on Cup */}
          <circle cx="55" cy="48" r="14" fill="#38BDF8" fillOpacity="0.5" stroke="#FDE047" strokeWidth="2.5" />
          <path d="M47 43 Q52 38 57 39" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          <line x1="63" y1="56" x2="70" y2="63" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
        </g>

        <defs>
          <linearGradient id="cupGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="40%" stopColor="#FACC15" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

// 8. Detective with Investigation Clipboard (โหมดครู / สรุปสถิติ)
export const DetectiveTeacherInspector: React.FC<{ size?: number; className?: string }> = ({
  size = 140,
  className = ''
}) => {
  return (
    <div className={`inline-block select-none relative ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md" fill="none">
        <ellipse cx="100" cy="188" rx="60" ry="8" fill="#000000" fillOpacity="0.18" />
        {/* Body Suit */}
        <path d="M60 135 C60 115 80 110 100 110 C120 110 140 115 140 135 L148 185 L52 185 Z" fill="#0F766E" stroke="#134E4A" strokeWidth="3" />
        <path d="M80 118 L100 145 L120 118 L100 110 Z" fill="#14B8A6" stroke="#134E4A" strokeWidth="2" />
        <path d="M96 112 L104 112 L102 128 L100 132 L98 128 Z" fill="#FACC15" />
        {/* Face */}
        <ellipse cx="100" cy="80" rx="40" ry="36" fill="#FED7AA" stroke="#7C2D12" strokeWidth="3" />
        {/* Glasses */}
        <rect x="68" y="72" width="24" height="16" rx="4" fill="#CCFBF1" fillOpacity="0.4" stroke="#0F766E" strokeWidth="2.5" />
        <rect x="108" y="72" width="24" height="16" rx="4" fill="#CCFBF1" fillOpacity="0.4" stroke="#0F766E" strokeWidth="2.5" />
        <line x1="92" y1="78" x2="108" y2="78" stroke="#0F766E" strokeWidth="2.5" />
        {/* Hair */}
        <path d="M60 65 C60 40 80 30 100 30 C120 30 140 40 140 65 Z" fill="#334155" stroke="#0F172A" strokeWidth="2.5" />
        {/* Eyes & Smile */}
        <circle cx="80" cy="80" r="5" fill="#1E1B4B" />
        <circle cx="120" cy="80" r="5" fill="#1E1B4B" />
        <path d="M94 92 Q100 98 106 92" stroke="#7C2D12" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <circle cx="72" cy="90" r="5" fill="#FCA5A5" fillOpacity="0.6" />
        <circle cx="128" cy="90" r="5" fill="#FCA5A5" fillOpacity="0.6" />
        {/* Clipboard held in front */}
        <g transform="translate(65, 120)">
          <rect x="0" y="4" width="70" height="60" rx="5" fill="#B45309" stroke="#78350F" strokeWidth="2" />
          <rect x="22" y="0" width="26" height="8" rx="2" fill="#94A3B8" stroke="#475569" strokeWidth="1.5" />
          <rect x="6" y="10" width="58" height="48" rx="3" fill="#FFFFFF" />
          {/* Chart lines */}
          <line x1="12" y1="48" x2="58" y2="48" stroke="#CBD5E1" strokeWidth="1.5" />
          <rect x="16" y="32" width="8" height="16" fill="#38BDF8" />
          <rect x="28" y="24" width="8" height="24" fill="#22C55E" />
          <rect x="40" y="16" width="8" height="32" fill="#F59E0B" />
          <polyline points="20,30 32,22 44,14" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
};

// 9. AI Detective Companion (หุ่นยนต์/แท็บเล็ตนักสืบ AI)
export const DetectiveAIRobot: React.FC<{
  size?: number;
  className?: string;
  variant?: 'normal' | 'thinking' | 'clue' | 'happy';
}> = ({
  size = 100,
  className = '',
  variant = 'normal'
}) => {
  return (
    <div className={`inline-block select-none relative ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 140 140" className="w-full h-full drop-shadow-md" fill="none">
        {/* Hover Shadow */}
        <ellipse cx="70" cy="130" rx="35" ry="6" fill="#000000" fillOpacity="0.2" />

        {/* Antenna with Magnifier Lamp */}
        <line x1="70" y1="40" x2="70" y2="18" stroke="#64748B" strokeWidth="3" strokeLinecap="round" />
        <circle cx="70" cy="14" r="10" fill="#FDE047" stroke="#F59E0B" strokeWidth="2.5" />
        <circle cx="70" cy="14" r="5" fill="#FEF08A" />

        {/* Robot Head / Screen */}
        <rect x="30" y="38" width="80" height="60" rx="16" fill="#1E293B" stroke="#0284C7" strokeWidth="3.5" />
        {/* Inner Screen */}
        <rect x="36" y="44" width="68" height="48" rx="10" fill="#0F172A" />

        {/* Cheerful Detective Hat */}
        <path d="M42 42 C45 28 60 22 70 22 C80 22 95 28 98 42 Z" fill="#B45309" stroke="#78350F" strokeWidth="2" />
        <line x1="36" y1="42" x2="104" y2="42" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />

        {/* LED Eyes */}
        {variant === 'thinking' ? (
          <>
            <circle cx="54" cy="64" r="7" fill="#38BDF8" />
            <circle cx="56" cy="62" r="3" fill="#FFFFFF" />
            <path d="M80 64 Q86 58 92 64" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" fill="none" />
          </>
        ) : variant === 'clue' ? (
          <>
            <circle cx="54" cy="64" r="9" fill="#FACC15" />
            <polygon points="54,58 56,62 60,63 57,66 58,70 54,68 50,70 51,66 48,63 52,62" fill="#78350F" />
            <circle cx="86" cy="64" r="9" fill="#FACC15" />
            <polygon points="86,58 88,62 92,63 89,66 90,70 86,68 82,70 83,66 80,63 84,62" fill="#78350F" />
          </>
        ) : (
          <>
            <circle cx="54" cy="64" r="7" fill="#38BDF8" />
            <circle cx="52" cy="62" r="2.5" fill="#FFFFFF" />
            <circle cx="86" cy="64" r="7" fill="#38BDF8" />
            <circle cx="84" cy="62" r="2.5" fill="#FFFFFF" />
          </>
        )}

        {/* Digital Mouth */}
        <path d="M62 76 Q70 82 78 76" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Little Floating Body / Propulsion */}
        <rect x="52" y="98" width="36" height="20" rx="8" fill="#334155" stroke="#1E293B" strokeWidth="2" />
        <circle cx="70" cy="108" r="4" fill="#22C55E" />
        {/* Glow thrust */}
        <ellipse cx="70" cy="120" rx="10" ry="4" fill="#38BDF8" fillOpacity="0.7" />
      </svg>
    </div>
  );
};

