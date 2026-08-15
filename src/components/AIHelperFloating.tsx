import React, { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, X, Send, Bot, Shield, HelpCircle, BookOpen, AlertTriangle, UserCheck, FileSearch } from 'lucide-react';
import { Student, AIQueryLog, AIUsageLog } from '../types';
import { StorageService } from '../engine/StorageService';
import { getSourceCardById } from '../data/sourceCards';
import { DetectiveAIRobot, DetectiveDog } from './characters/DetectiveCharacters';

interface AIHelperFloatingProps {
  currentStudent: Student | null;
  currentScreen?: string;
  activeQuestionId?: string;
  activeMissionId?: string;
  activeSourceCardId?: string;
}

const LOCAL_STORAGE_POS_KEY = 'sd_ai_helper_pos';

export const AIHelperFloating: React.FC<AIHelperFloatingProps> = ({
  currentStudent,
  currentScreen,
  activeQuestionId,
  activeMissionId,
  activeSourceCardId
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [queryInput, setQueryInput] = useState('');
  const [messages, setMessages] = useState<AIQueryLog[]>([
    {
      id: 'welcome_1',
      query: '',
      response: 'สวัสดีครับ! ผมคือ "น้องนักสืบ" ผู้ช่วย AI สำหรับช่วยคุณสังเกตแหล่งที่มา อธิบายคำศัพท์ และให้คำแนะนำวิธีสืบสวน (ไม่เฉลยข้อสอบ) มีอะไรให้ช่วยแนะนำไหมครับ? 🕵️‍♂️✨',
      timestamp: new Date().toISOString()
    }
  ]);

  // Floating Position State
  const [position, setPosition] = useState<{ x: number; y: number }>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_POS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return {
      x: typeof window !== 'undefined' ? Math.max(20, window.innerWidth - 90) : 300,
      y: typeof window !== 'undefined' ? Math.max(20, window.innerHeight - 130) : 500
    };
  });

  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const elementStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const hasDragged = useRef(false);

  // Usage stats tracking
  const openCountRef = useRef(0);
  const queryCountRef = useRef(0);
  const sessionStartRef = useRef<string | null>(null);

  const activeCard = activeSourceCardId ? getSourceCardById(activeSourceCardId) : undefined;

  // Save position to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_POS_KEY, JSON.stringify(position));
    } catch (e) {
      console.error('Failed to save AI helper position:', e);
    }
  }, [position]);

  // Handle Dragging Events (Mouse & Touch)
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    hasDragged.current = false;
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    elementStartPos.current = { ...position };
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      setIsDragging(true);
      hasDragged.current = false;
      dragStartPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      elementStartPos.current = { ...position };
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartPos.current.x;
      const dy = e.clientY - dragStartPos.current.y;

      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        hasDragged.current = true;
      }

      const newX = Math.min(Math.max(20, elementStartPos.current.x + dx), window.innerWidth - 80);
      const newY = Math.min(Math.max(20, elementStartPos.current.y + dy), window.innerHeight - 90);

      setPosition({ x: newX, y: newY });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length === 0) return;
      const dx = e.touches[0].clientX - dragStartPos.current.x;
      const dy = e.touches[0].clientY - dragStartPos.current.y;

      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        hasDragged.current = true;
      }

      const newX = Math.min(Math.max(20, elementStartPos.current.x + dx), window.innerWidth - 80);
      const newY = Math.min(Math.max(20, elementStartPos.current.y + dy), window.innerHeight - 90);

      setPosition({ x: newX, y: newY });
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging]);

  // Handle Toggle Popup Window
  const handleToggleOpen = () => {
    if (hasDragged.current) {
      hasDragged.current = false;
      return;
    }

    const nextState = !isOpen;
    setIsOpen(nextState);

    if (nextState) {
      openCountRef.current += 1;
      sessionStartRef.current = new Date().toISOString();

      // Log AI open event
      if (currentStudent) {
        const log: AIUsageLog = {
          logId: `ai_log_${Date.now()}`,
          studentId: currentStudent.studentId,
          missionId: activeMissionId,
          questionId: activeQuestionId,
          sourceCardId: activeSourceCardId,
          aiUsed: true,
          aiOpenCount: openCountRef.current,
          aiSessionCount: 1,
          aiQueryCount: queryCountRef.current,
          aiQueries: messages.filter(m => m.query.length > 0),
          aiOpenTimestamp: sessionStartRef.current,
          timestamp: new Date().toISOString()
        };
        StorageService.saveAILog(log);
      }
    }
  };

  // Response Generator (Enforces strict pedagogical "No Direct Answer" rule)
  const generateAIResponse = (userQuery: string, menuKey?: string): string => {
    const q = userQuery.trim().toLowerCase();

    // Check if user is asking for direct test answers or options
    const isAskingForAnswer = 
      q.includes('ตอบข้อไหน') || 
      q.includes('ข้อไหนถูก') || 
      q.includes('เฉลย') || 
      q.includes('คำตอบคือ') || 
      q.includes('เลือกข้อ') ||
      q.includes('ตอบก') ||
      q.includes('ตอบข') ||
      q.includes('ตอบค') ||
      q.includes('ตอบง') ||
      q.includes('ข้อ 1 ถูกไหม') ||
      q.includes('ข้อ 2 ถูกไหม') ||
      q.includes('ข้อ 3 ถูกไหม') ||
      q.includes('ช่วยตอบข้อนี้');

    if (isAskingForAnswer) {
      return `น้องนักสืบช่วยค้นหา ทำความเข้าใจ และวิเคราะห์ได้ครับ แต่ผมไม่สามารถบอกตัวเลือกที่ถูกต้องหรือเฉลยข้อสอบได้ครับ! 🕵️‍♂️✨\n\nลองใช้กระบวนการสืบสวน 3 ขั้นตอนนี้ดูครับ:\n1. ตรวจสอบว่าผู้เผยแพร่หรือผู้ส่งสารคือใคร มีความเชี่ยวชาญตรงกับเนื้อหาหรือไม่\n2. ตรวจสอบว่ามีหลักฐานอ้างอิงชัดเจน หรือเป็นเพียงความคิดเห็น/โฆษณา\n3. เปรียบเทียบข้อมูลกับแหล่งข้อมูลทางการแพทย์อื่นก่อนสรุปครับ`;
    }

    // 5 Main Structured Help Menus
    if (menuKey === 'MENU_AUTHOR' || q.includes('มาจากใคร') || q.includes('ผู้ส่งสาร') || q.includes('ใครเผยแพร่')) {
      if (activeCard) {
        const id = activeCard.sourceCardId;
        if (id === 'SC01' || id === 'SC-M2-01' || id === 'SC-M3-01' || id === 'SC-M4-01') {
          return `👤 [วิเคราะห์ผู้เผยแพร่ ${id}]\nข้อมูลนี้เผยแพร่โดย "${activeCard.publisher}" ซึ่งเป็นหน่วยงานสาธารณสุขระดับประเทศและระดับสากลของสหรัฐอเมริกา มีความเชี่ยวชาญด้านการแพทย์และสุขอนามัยโดยตรงครับ`;
        }
        if (id === 'SC02' || id === 'SC-M2-02' || id === 'SC-M3-02' || id === 'SC-M4-02') {
          return `👤 [วิเคราะห์ผู้เผยแพร่ ${id}]\nข้อมูลนี้เผยแพร่โดย "${activeCard.publisher}" ซึ่งเป็นโรงเรียนแพทย์และสถาบันการแพทย์ชั้นนำของไทย มีความน่าเชื่อถือสูงในด้านสุขภาพเด็กและวัยรุ่นครับ`;
        }
        if (id === 'SC03' || id === 'SC-M2-03' || id === 'SC-M3-03' || id === 'SC-M4-03') {
          return `👤 [วิเคราะห์ผู้เผยแพร่ ${id}]\nข้อมูลนี้เผยแพร่โดย "${activeCard.publisher}" อธิบายเรื่องระบบนาฬิกาชีวภาพและการทำงานของร่างกาย`;
        }
        if (id === 'SC04' || id === 'SC-M2-04' || id === 'SC-M3-04' || id === 'SC-M4-04') {
          return `👤 [วิเคราะห์ผู้เผยแพร่ ${id}]\nข้อมูลนี้เผยแพร่โดย "${activeCard.publisher}" ระบุเรื่อง "ความสัมพันธ์เชิงสถิติ" ซึ่งต้องแยกออกจากสาเหตุโดยตรงที่เกิดกับทุกคน`;
        }
        if (id === 'SC05' || id === 'SC-M2-05' || id === 'SC-M3-05' || id === 'SC-M4-05') {
          return `👤 [วิเคราะห์ผู้เผยแพร่ ${id}]\nข้อมูลนี้มาจาก "${activeCard.publisher}" ซึ่งเป็นเพจในโซเชียลมีเดียที่เน้นโปรโมตสินค้า ไม่ใช่สถาบันการแพทย์หรือหน่วยงานสาธารณสุขทางการครับ`;
        }
        if (id === 'SC06' || id === 'SC-M2-06' || id === 'SC-M3-06' || id === 'SC-M4-06') {
          return `👤 [วิเคราะห์ผู้เผยแพร่ ${id}]\nข้อมูลนี้มาจาก "${activeCard.publisher}" ซึ่งเป็นบุคคลทั่วไปที่โพสต์เล่าประสบการณ์ส่วนตัว ไม่ใช่แพทย์หรือนักวิจัยครับ`;
        }
        if (id === 'SC07' || id === 'SC-M2-07' || id === 'SC-M3-07' || id === 'SC-M4-07') {
          return `👤 [วิเคราะห์ผู้เผยแพร่ ${id}]\nข้อมูลนี้เผยแพร่โดย "${activeCard.publisher}" เมื่อปี 2017 เป็นข้อมูลทางการแพทย์ในอดีตที่ควรตรวจสอบความทันสมัยร่วมด้วยครับ`;
        }
        if (id === 'SC08' || id === 'SC-M2-08' || id === 'SC-M3-08' || id === 'SC-M4-08') {
          return `👤 [วิเคราะห์ผู้เผยแพร่ ${id}]\nข้อมูลนี้เผยแพร่โดย "${activeCard.publisher}" ซึ่งเป็นองค์กรของรัฐที่ดูแลด้านการสร้างเสริมสุขภาพของประชาชน`;
        }
        if (id === 'SC09' || id === 'SC-M2-09' || id === 'SC-M3-09' || id === 'SC-M4-09') {
          return `👤 [วิเคราะห์ผู้เผยแพร่ ${id}]\nข้อมูลนี้เผยแพร่โดย "${activeCard.publisher}" อธิบายแง่มุมเพิ่มเติมเกี่ยวกับคุณภาพและความต่อเนื่องของการนอนหลับ`;
        }
        if (id === 'SC10' || id === 'SC-M2-10' || id === 'SC-M3-10' || id === 'SC-M4-10') {
          return `👤 [วิเคราะห์ผู้เผยแพร่ ${id}]\nข้อมูลนี้มาจาก "${activeCard.publisher}" ซึ่งเป็นบริษัทเอกชนที่แสวงหาผลประโยชน์ทางการค้าจากการขายอาหารเสริม`;
        }
        return `👤 [วิเคราะห์ผู้เผยแพร่ ${id}]\nผู้เผยแพร่คือ "${activeCard.publisher}" (${activeCard.sourceType}) วันที่เผยแพร่: ${activeCard.publicationDate}`;
      }
      return `👤 [การตรวจสอบผู้ส่งสาร]\nสังเกตว่า:\n1. มีชื่อผู้เขียน ตำแหน่ง หรือชื่อองค์กรทางการหรือไม่\n2. หน่วยงานมีความเชี่ยวชาญตรงกับเนื้อหาที่กล่าวอ้างหรือไม่\n3. มีเจตนาเพื่อการค้าหรือเพื่อเผยแพร่ความรู้`;
    }

    if (menuKey === 'MENU_DEFINITION' || q.includes('หมายความว่า') || q.includes('คำศัพท์') || q.includes('คืออะไร')) {
      return `📖 [พจนานุกรมนักสืบ]\n• "แหล่งอ้างอิง" (Source): ที่มาของข้อมูล เช่น เอกสารวิชาการ ประกาศทางการ\n• "ข้ออ้าง" (Claim): สิ่งที่ผู้เขียนต้องการให้เราเชื่อ\n• "ความสัมพันธ์" (Correlation): สิ่งที่เกิดขึ้นร่วมกัน แต่ไม่ได้แปลว่าเป็นสาเหตุโดยตรงกับทุกคน\n• "คุณภาพการนอน": ความลึกและความต่อเนื่องของการหลับ ไม่ใช่แค่จำนวนชั่วโมง`;
    }

    if (menuKey === 'MENU_VERIFY' || q.includes('ตรวจสอบอย่างไร') || q.includes('วิธีตรวจสอบ')) {
      return `🔍 [แนวทางการตรวจสอบข้อมูล]\n1. ตรวจสอบว่ามีเอกสารหรือผลการศึกษาวิจัยรองรับหรือไม่\n2. ตรวจสอบวันที่เผยแพร่ว่าเป็นข้อมูลปัจจุบันหรือไม่\n3. หาข้อมูลจากแหล่งที่สอง (Cross-check) เช่น เปรียบเทียบ CDC กับ สสส. หรือมหาวิทยาลัยมหิดล\n4. ตรวจสอบว่าข้อความระบุกลุ่มเป้าหมายชัดเจนหรือไม่ (เช่น เด็ก 6–12 ปี หรือวัยรุ่น 13–18 ปี)`;
    }

    if (menuKey === 'MENU_RISK' || q.includes('ควรระวัง') || q.includes('สัญญาณเตือน')) {
      if (activeCard?.isSimulated) {
        return `⚠️ [ข้อควรระวังสำหรับ ${activeCard.sourceCardId}]\nการ์ดนี้เป็น "สถานการณ์จำลองสำหรับเกม" มีสัญญาณความเสี่ยง:\n• มีการกระตุ้นให้ซื้อสินค้าหรือโปรโมชัน\n• นำประสบการณ์คนเดียวมาสรุปเหมารวมว่าใช้ได้กับทุกคน\n• ใช้คำอวดอ้างสรรพคุณเกินจริงโดยไม่มีผลการทดลองทางการแพทย์ยืนยัน`;
      }
      if (activeCard?.sourceCardId === 'SC07') {
        return `⚠️ [ข้อควรระวังสำหรับ SC07]\nบทความนี้ตีพิมพ์ในปี 2017 (ข้อมูลในอดีต) นักสืบควรตรวจสอบว่ามีแนวทางหรือข้อมูลวิจัยฉบับปรับปรุงใหม่ล่าสุดหรือไม่`;
      }
      return `⚠️ [สัญญาณความเสี่ยงทั่วไป]\n• มีเจตนาแอบแฝงทางการค้า\n• เร่งเร้าให้ตัดสินใจทันที ("ด่วนที่สุด", "ลด 50%")\n• ไม่มีชื่อผู้รับผิดชอบหรือหน่วยงานที่ตรวจสอบได้`;
    }

    if (menuKey === 'MENU_MORE_INFO' || q.includes('หาข้อมูลอะไรเพิ่ม') || q.includes('สืบค้นเพิ่ม')) {
      return `🔎 [ข้อมูลที่ควรสืบค้นเพิ่มเติม]\n• คำแนะนำชั่วโมงการนอนจากองค์กรสากล (เช่น CDC หรือ สสส.)\n• ผลกระทบของการนอนไม่พอต่อสุขภาพในระยะยาว\n• ปัจจัยเรื่อง "คุณภาพการนอน" และสภาพแวดล้อมห้องนอนนอกเหนือจากจำนวนชั่วโมง`;
    }

    // Default Educational Guidance
    return `น้องนักสืบรับทราบคำถามเกี่ยวกับ "${userQuery}" ครับ! 🔎\n\nคำแนะนำในการสืบสวน:\nคุณสามารถใช้ข้อมูลจากแผ่นเบาะแส (Source Cards) ในกระดานคดีมาประกอบการคิด โดยสังเกตชื่อผู้ส่งสาร ความน่าเชื่อถือขององค์กร และความสอดคล้องของตัวเลขชั่วโมงการนอนครับ!`;
  };

  // Submit Search Query or Preset Menu Selection
  const handleSendQuery = (textToSend?: string, menuKey?: string) => {
    const text = textToSend || queryInput;
    if (!text.trim()) return;

    const responseText = generateAIResponse(text, menuKey);

    const userMessage: AIQueryLog = {
      id: `query_${Date.now()}`,
      query: text,
      response: responseText,
      timestamp: new Date().toISOString(),
      contextScreen: currentScreen,
      questionId: activeQuestionId,
      sourceCardId: activeSourceCardId,
      aiMenuSelected: menuKey || text
    };

    queryCountRef.current += 1;
    setMessages(prev => [...prev, userMessage]);
    setQueryInput('');

    // Save Log to Storage
    if (currentStudent) {
      const log: AIUsageLog = {
        logId: `ai_log_${Date.now()}`,
        studentId: currentStudent.studentId,
        missionId: activeMissionId,
        questionId: activeQuestionId,
        sourceCardId: activeSourceCardId,
        aiMenuSelected: menuKey || text,
        aiUsed: true,
        aiOpenCount: openCountRef.current,
        aiSessionCount: 1,
        aiQueryCount: queryCountRef.current,
        aiQueries: [userMessage],
        timestamp: new Date().toISOString()
      };
      StorageService.saveAILog(log);
    }
  };

  // 5 Structured Detective Menus
  const helperMenus = [
    { key: 'MENU_AUTHOR', label: '👤 ข้อมูลนี้มาจากใคร?', icon: <UserCheck className="w-3.5 h-3.5 text-sky-400" /> },
    { key: 'MENU_DEFINITION', label: '📖 คำนี้หมายความว่าอะไร?', icon: <BookOpen className="w-3.5 h-3.5 text-amber-400" /> },
    { key: 'MENU_VERIFY', label: '🔍 จะตรวจสอบข้อมูลนี้อย่างไร?', icon: <FileSearch className="w-3.5 h-3.5 text-emerald-400" /> },
    { key: 'MENU_RISK', label: '⚠️ มีอะไรที่ควรระวัง?', icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> },
    { key: 'MENU_MORE_INFO', label: '🔎 ควรหาข้อมูลอะไรเพิ่ม?', icon: <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> }
  ];

  return (
    <>
      {/* Floating Draggable Badge Icon */}
      <div
        id="ai_helper_floating_trigger"
        style={{
          position: 'fixed',
          left: `${position.x}px`,
          top: `${position.y}px`,
          zIndex: 9999,
          touchAction: 'none'
        }}
        className="cursor-grab active:cursor-grabbing select-none transition-transform hover:scale-105 group"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onClick={handleToggleOpen}
        title="กดเพื่อเปิดผู้ช่วย AI / ลากเพื่อเปลี่ยนตำแหน่ง"
      >
        <div className="relative">
          {/* Outer Pulse Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-indigo-500 rounded-full blur opacity-70 group-hover:opacity-100 transition duration-300 animate-pulse"></div>

          {/* Icon Badge Body */}
          <div className="relative bg-slate-900 border-2 border-amber-400 text-slate-100 p-2 sm:p-2.5 rounded-full shadow-2xl flex items-center justify-center space-x-1.5 hover:border-amber-300">
            <div className="relative flex items-center justify-center">
              <DetectiveAIRobot size={42} variant="happy" className="animate-bounce" />
            </div>
            <span className="hidden md:inline-block text-xs font-mono font-extrabold text-amber-300 pr-1">
              🔎 ผู้ช่วย AI
            </span>
          </div>

          {/* Badge Tag */}
          <span className="absolute -top-2 -right-2 bg-amber-500 text-slate-950 font-extrabold text-[9px] px-1.5 py-0.5 rounded-full shadow border border-slate-950 font-mono">
            {activeSourceCardId || 'สืบค้น'}
          </span>
        </div>
      </div>

      {/* Pop-up Window Modal */}
      {isOpen && (
        <div 
          id="ai_helper_modal"
          className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn"
        >
          <div className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header Bar with Cartoon Detective AI */}
            <div className="bg-slate-950 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <DetectiveAIRobot size={48} variant="clue" className="shrink-0" />
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-extrabold text-slate-100 text-base flex items-center gap-1.5">
                      <span>หุ่นยนต์นักสืบ AI</span>
                    </h3>
                    <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold">
                      โหมดแนะนำ
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    “สืบให้ลึก คิดให้รอบ ตรวจสอบก่อนเชื่อ!” (ไม่เฉลยข้อสอบ)
                  </p>
                </div>
              </div>

              <button
                id="btn_close_ai_helper"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
                title="ปิดผู้ช่วย AI"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Active Source Card Badge Notification */}
            {activeCard && (
              <div className="bg-slate-950/80 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 overflow-hidden">
                  <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 font-mono font-bold px-1.5 py-0.5 rounded shrink-0 text-[10px]">
                    {activeCard.sourceCardId}
                  </span>
                  <span className="text-slate-300 font-semibold truncate">
                    {activeCard.title}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0 ml-2 font-mono">
                  {activeCard.publisher}
                </span>
              </div>
            )}

            {/* Chat Body & History */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 text-xs sm:text-sm">
              
              {/* 5 Structured Helper Menu Buttons */}
              <div className="space-y-2 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                <p className="text-[11px] font-bold text-amber-400 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>เลือกหัวข้อที่ต้องการให้น้องนักสืบแนะนำ:</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {helperMenus.map(menu => (
                    <button
                      key={menu.key}
                      id={`ai_menu_${menu.key.toLowerCase()}`}
                      onClick={() => handleSendQuery(menu.label, menu.key)}
                      className="bg-slate-800/90 hover:bg-slate-750 text-slate-200 border border-slate-700 hover:border-amber-500/50 text-[11px] px-3 py-2 rounded-xl transition-all text-left flex items-center space-x-2 font-medium"
                    >
                      <span>{menu.icon}</span>
                      <span className="truncate">{menu.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat messages */}
              <div className="border-t border-slate-800 pt-3 space-y-3">
                {messages.map((m, idx) => (
                  <div key={idx} className="space-y-2">
                    {m.query && (
                      <div className="flex justify-end">
                        <div className="bg-amber-500 text-slate-950 font-semibold px-3.5 py-2 rounded-2xl rounded-tr-none max-w-[85%] shadow-sm text-xs sm:text-sm">
                          {m.query}
                        </div>
                      </div>
                    )}
                    <div className="flex justify-start items-start space-x-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="bg-slate-800 border border-slate-700 text-slate-200 px-3.5 py-2.5 rounded-2xl rounded-tl-none max-w-[88%] whitespace-pre-line leading-relaxed text-xs sm:text-sm">
                        {m.response}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* Input Footer Bar */}
            <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex items-center space-x-2">
              <input
                id="ai_helper_custom_input"
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendQuery()}
                placeholder="พิมพ์คำถามเพื่อสืบค้นข้อมูลเพิ่มเติม..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                id="btn_ai_helper_send"
                onClick={() => handleSendQuery()}
                disabled={!queryInput.trim()}
                className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition-all flex items-center space-x-1 shrink-0 text-xs sm:text-sm"
              >
                <span>ค้นหา</span>
                <Send className="w-3.5 h-3.5" />
              </button>
              <button
                id="btn_ai_helper_close_footer"
                onClick={() => setIsOpen(false)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium px-3 py-2.5 rounded-xl transition-all text-xs shrink-0"
              >
                ปิด
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
