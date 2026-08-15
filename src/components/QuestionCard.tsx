import React, { useState, useEffect } from 'react';
import {
  Question,
  StudentAnswerValue,
  IndicatorId,
  QuestionNavStatus
} from '../types';
import { INDICATOR_DEFINITIONS } from '../data/indicators';
import { SOURCE_CARDS } from '../data/sourceCards';
import { SourceCardComponent } from './SourceCardComponent';
import { AnswerOption } from './AnswerOption';
import {
  Search,
  CheckCircle2,
  HelpCircle,
  MoveUp,
  MoveDown,
  FileCheck,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  Layers,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  ClipboardList
} from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  initialAnswer?: StudentAnswerValue;
  questionStatus?: QuestionNavStatus;
  canGoBack?: boolean;
  isLastQuestion?: boolean;
  isAllAnswered?: boolean;
  onBack?: () => void;
  onReviewAll?: () => void;
  onAnswerSubmit: (answerValue: StudentAnswerValue) => void;
  isSubmitting?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  initialAnswer,
  questionStatus = 'UNANSWERED',
  canGoBack = false,
  isLastQuestion = false,
  isAllAnswered = false,
  onBack,
  onReviewAll,
  onAnswerSubmit
}) => {
  const indicatorDef = INDICATOR_DEFINITIONS[question.indicatorId];

  // State for different question types
  const [selectedOptionId, setSelectedOptionId] = useState<string>('');
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<{ itemId: string; matchedTarget: string }[]>([]);
  const [orderedItemIds, setOrderedItemIds] = useState<string[]>([]);
  const [selectedEvidenceIds, setSelectedEvidenceIds] = useState<string[]>([]);
  const [decisionChoice, setDecisionChoice] = useState<'BELIEVE' | 'REJECT' | 'NEED_MORE_EVIDENCE'>('REJECT');
  const [shortResponseText, setShortResponseText] = useState<string>('');
  const [selfCheckRating, setSelfCheckRating] = useState<number>(3);
  const [reasoningText, setReasoningText] = useState<string>('');
  const [multiStepAnswers, setMultiStepAnswers] = useState<{ [stepKey: string]: string }>({});

  // Initialize or restore state when question or initialAnswer changes
  useEffect(() => {
    if (initialAnswer) {
      setSelectedOptionId(initialAnswer.selectedOptionId || '');
      setSelectedOptionIds(initialAnswer.selectedOptionIds || []);
      if (initialAnswer.matchedPairs && initialAnswer.matchedPairs.length > 0) {
        setMatchedPairs(initialAnswer.matchedPairs);
      } else {
        setMatchedPairs(
          question.matchingPairs?.map(p => ({ itemId: p.id, matchedTarget: '' })) || []
        );
      }
      if (initialAnswer.orderedItemIds && initialAnswer.orderedItemIds.length > 0) {
        setOrderedItemIds(initialAnswer.orderedItemIds);
      } else {
        setOrderedItemIds(question.orderingItems?.map(i => i.id) || []);
      }
      setSelectedEvidenceIds(initialAnswer.selectedEvidenceIds || []);
      setDecisionChoice(initialAnswer.decisionChoice || 'REJECT');
      setShortResponseText(initialAnswer.shortResponseText || '');
      setSelfCheckRating(initialAnswer.selfCheckRating || 3);
      setReasoningText(initialAnswer.reasoningText || '');
      if (initialAnswer.multiStepAnswers) {
        setMultiStepAnswers(initialAnswer.multiStepAnswers);
      } else if (question.multiStepQuestions) {
        const initialSteps: { [key: string]: string } = {};
        question.multiStepQuestions.forEach(step => {
          initialSteps[step.stepKey] = '';
        });
        setMultiStepAnswers(initialSteps);
      } else {
        setMultiStepAnswers({});
      }
    } else {
      setSelectedOptionId('');
      setSelectedOptionIds([]);
      setMatchedPairs(
        question.matchingPairs?.map(p => ({ itemId: p.id, matchedTarget: '' })) || []
      );
      setOrderedItemIds(question.orderingItems?.map(i => i.id) || []);
      setSelectedEvidenceIds([]);
      setDecisionChoice('REJECT');
      setShortResponseText('');
      setSelfCheckRating(3);
      setReasoningText('');
      if (question.multiStepQuestions) {
        const initialSteps: { [key: string]: string } = {};
        question.multiStepQuestions.forEach(step => {
          initialSteps[step.stepKey] = '';
        });
        setMultiStepAnswers(initialSteps);
      } else {
        setMultiStepAnswers({});
      }
    }
  }, [question, initialAnswer]);

  // Handlers
  const handleSingleSelect = (id: string) => {
    setSelectedOptionId(id);
  };

  const handleMultiSelect = (id: string) => {
    setSelectedOptionIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleMatchingChange = (pairId: string, targetValue: string) => {
    setMatchedPairs(prev =>
      prev.map(p => (p.itemId === pairId ? { ...p, matchedTarget: targetValue } : p))
    );
  };

  const moveOrderedItem = (index: number, direction: 'UP' | 'DOWN') => {
    const newOrder = [...orderedItemIds];
    const targetIdx = direction === 'UP' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newOrder.length) return;
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIdx];
    newOrder[targetIdx] = temp;
    setOrderedItemIds(newOrder);
  };

  const toggleEvidenceSelect = (evId: string) => {
    setSelectedEvidenceIds(prev =>
      prev.includes(evId) ? prev.filter(i => i !== evId) : [...prev, evId]
    );
  };

  const handleMultiStepSelect = (stepKey: string, optionId: string) => {
    setMultiStepAnswers(prev => ({
      ...prev,
      [stepKey]: optionId
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Answer Validation
    if (question.multiStepQuestions && question.multiStepQuestions.length > 0) {
      const allFilled = question.multiStepQuestions.every(s => !!multiStepAnswers[s.stepKey]);
      if (!allFilled) {
        alert('กรุณาตอบคำถามให้ครบทุกขั้นตอน');
        return;
      }
    } else if (
      question.type === 'SINGLE_CHOICE' ||
      question.type === 'REASON_SELECT' ||
      question.type === 'EVIDENCE_SELECT' ||
      question.type === 'SHORT_RESPONSE' ||
      question.type === 'SELF_CHECK'
    ) {
      if (!selectedOptionId) {
        alert('กรุณาเลือกคำตอบก่อนดำเนินการต่อ');
        return;
      }
    } else if (question.type === 'MULTI_SELECT') {
      if (selectedOptionIds.length === 0) {
        alert('กรุณาเลือกอย่างน้อย 1 ตัวเลือก');
        return;
      }
    } else if (question.type === 'MATCHING') {
      const allMatched = matchedPairs.every(p => p.matchedTarget.trim().length > 0);
      if (!allMatched) {
        alert('กรุณาจับคู่ให้ครบทุกรายการ');
        return;
      }
    }

    const answerValue: StudentAnswerValue = {
      selectedOptionId,
      selectedOptionIds,
      matchedPairs,
      orderedItemIds,
      selectedEvidenceIds,
      decisionChoice,
      shortResponseText,
      selfCheckRating,
      reasoningText,
      sourceCardId: question.sourceCardId,
      multiStepAnswers
    };

    onAnswerSubmit(answerValue);
  };

  // Resolve Source Card(s)
  const singleCard = question.sourceCardId
    ? SOURCE_CARDS.find(c => c.sourceCardId === question.sourceCardId)
    : null;

  const multipleCards = question.sourceCardIds
    ? question.sourceCardIds.map(id => SOURCE_CARDS.find(c => c.sourceCardId === id)).filter(Boolean)
    : [];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl space-y-5">
      
      {/* Stage Badge & Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
          {question.stageName && (
            <span className="bg-slate-800 text-amber-300 border border-slate-700 text-xs font-bold px-3 py-1 rounded-lg flex items-center space-x-1">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>{question.stageName}</span>
            </span>
          )}
          <span className="bg-amber-500 text-slate-950 text-xs font-mono font-extrabold px-2.5 py-1 rounded-lg">
            ข้อที่ {questionNumber}/{totalQuestions}
          </span>
          <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
            [คะแนนเต็ม: {question.maxScore}]
          </span>

          {/* Question Status Badge */}
          {questionStatus === 'REVISED' && (
            <span className="bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[11px] font-mono font-bold px-2 py-0.5 rounded-md flex items-center space-x-1">
              <RotateCcw className="w-3 h-3" />
              <span>แก้ไขคำตอบแล้ว</span>
            </span>
          )}
          {questionStatus === 'ANSWERED' && (
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-mono font-bold px-2 py-0.5 rounded-md flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>ตอบแล้ว</span>
            </span>
          )}
          {questionStatus === 'UNANSWERED' && (
            <span className="bg-slate-800 text-slate-400 border border-slate-700 text-[11px] font-mono font-bold px-2 py-0.5 rounded-md">
              ยังไม่ตอบ
            </span>
          )}
        </div>

        {indicatorDef && (
          <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-300 dark:border-slate-700 text-xs">
            <Search className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-bold text-slate-800 dark:text-slate-200">{indicatorDef.code}</span>
            <span className="text-slate-500 dark:text-slate-400 hidden sm:inline">- {indicatorDef.nameTh}</span>
          </div>
        )}
      </div>

      {/* Associated Source Cards Section */}
      {singleCard && (
        <div className="space-y-1">
          <p className="text-xs font-bold text-slate-400 flex items-center space-x-1">
            <span>🔍 แผ่นเบาะแสอ้างอิงสำหรับข้อนี้:</span>
          </p>
          <SourceCardComponent card={singleCard} compact />
        </div>
      )}

      {multipleCards.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-400">
            🔍 แผ่นเบาะแสเปรียบเทียบในคดีนี้ ({multipleCards.length} แผ่น):
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {multipleCards.map((card, idx) => card && (
              <SourceCardComponent key={idx} card={card} compact />
            ))}
          </div>
        </div>
      )}

      {/* Scenario / Stem Box */}
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 leading-snug">
          {question.title}
        </h3>

        {question.contextScenario && (
          <div className="mt-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-slate-800 dark:text-amber-100 text-sm leading-relaxed flex items-start space-x-3">
            <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-amber-900 dark:text-amber-300 font-semibold mb-0.5">แฟ้มคดี / บริบทสถานการณ์:</strong>
              {question.contextScenario}
            </div>
          </div>
        )}

        <p className="mt-3 text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          {question.stem}
        </p>
      </div>

      {/* Dynamic Question Renderers by Type */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* MULTI_STEP QUESTIONS (Decision Revision Task - Q16) */}
        {question.multiStepQuestions && question.multiStepQuestions.length > 0 ? (
          <div className="space-y-6">
            <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl text-xs text-amber-300 font-medium">
              💡 กิจกรรม 5 ขั้นตอน: เลือกตัวเลือกที่เหมาะสมในแต่ละขั้นตอนโดยไม่ต้องพิมพ์คำตอบ
            </div>

            {question.multiStepQuestions.map((step, idx) => (
              <div key={step.stepKey} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold font-mono text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <h4 className="text-sm font-bold text-amber-300">{step.title}</h4>
                </div>
                <p className="text-xs text-slate-300 font-medium">{step.prompt}</p>

                <div className="space-y-2">
                  {step.options.map(opt => (
                    <AnswerOption
                      key={opt.id}
                      id={opt.id}
                      label={opt.label}
                      selected={multiStepAnswers[step.stepKey] === opt.id}
                      onSelect={(optId) => handleMultiStepSelect(step.stepKey, optId)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* TYPE 1: SINGLE_CHOICE */}
            {question.type === 'SINGLE_CHOICE' && question.options && (
              <div className="space-y-2.5">
                {question.options.map(opt => (
                  <AnswerOption
                    key={opt.id}
                    id={opt.id}
                    label={opt.label}
                    selected={selectedOptionId === opt.id}
                    onSelect={handleSingleSelect}
                  />
                ))}
              </div>
            )}

            {/* TYPE 2: MULTI_SELECT */}
            {question.type === 'MULTI_SELECT' && question.options && (
              <div className="space-y-2.5">
                <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                  * เลือกได้มากกว่า 1 ตัวเลือก
                </p>
                {question.options.map(opt => (
                  <AnswerOption
                    key={opt.id}
                    id={opt.id}
                    label={opt.label}
                    multiSelect
                    selected={selectedOptionIds.includes(opt.id)}
                    onSelect={handleMultiSelect}
                  />
                ))}
              </div>
            )}

            {/* TYPE 3: MATCHING */}
            {question.type === 'MATCHING' && question.matchingPairs && (
              <div className="space-y-3">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">เลือกข้อสรุปหรือลักษณะให้ตรงกับ Source Card ฝั่งซ้าย:</p>
                {(() => {
                  const distinctTargets = Array.from(
                    new Set(question.matchingPairs.map(p => p.targetMatch.trim()).filter(Boolean))
                  );
                  return (
                    <div className="space-y-3">
                      {question.matchingPairs.map(pair => {
                        const currentMatch = matchedPairs.find(m => m.itemId === pair.id)?.matchedTarget || '';
                        return (
                          <div key={pair.id} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex-1">
                              {pair.item}
                            </span>
                            <select
                              value={currentMatch}
                              onChange={(e) => handleMatchingChange(pair.id, e.target.value)}
                              className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 w-full sm:w-auto shrink-0"
                            >
                              <option value="">-- เลือกข้อสรุปที่ตรงกัน --</option>
                              {distinctTargets.map(targetText => (
                                <option key={targetText} value={targetText}>
                                  {targetText}
                                </option>
                              ))}
                            </select>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* TYPE 4: ORDERING */}
            {question.type === 'ORDERING' && question.orderingItems && (
              <div className="space-y-2.5">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">ใช้ปุ่มขึ้น/ลง เพื่อจัดเรียงขั้นตอนจาก 1 ไป {orderedItemIds.length}:</p>
                {orderedItemIds.map((itemId, index) => {
                  const itemObj = question.orderingItems?.find(i => i.id === itemId);
                  if (!itemObj) return null;
                  return (
                    <div key={itemId} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between gap-3">
                      <div className="flex items-center space-x-3">
                        <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold font-mono text-xs flex items-center justify-center shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-sm text-slate-800 dark:text-slate-200 font-medium">{itemObj.text}</span>
                      </div>
                      <div className="flex items-center space-x-1 shrink-0">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => moveOrderedItem(index, 'UP')}
                          className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30 text-slate-700 dark:text-slate-300"
                        >
                          <MoveUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          disabled={index === orderedItemIds.length - 1}
                          onClick={() => moveOrderedItem(index, 'DOWN')}
                          className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30 text-slate-700 dark:text-slate-300"
                        >
                          <MoveDown className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* TYPE 5: EVIDENCE_SELECT */}
            {question.type === 'EVIDENCE_SELECT' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  เลือกหลักฐานที่มีน้ำหนักและความน่าเชื่อถือมากที่สุด (1 ชิ้น):
                </p>
                {question.options && question.options.length > 0 ? (
                  <div className="space-y-2.5">
                    {question.options.map(opt => (
                      <AnswerOption
                        key={opt.id}
                        id={opt.id}
                        label={opt.label}
                        selected={selectedOptionId === opt.id}
                        onSelect={handleSingleSelect}
                      />
                    ))}
                  </div>
                ) : question.evidenceItems && question.evidenceItems.length > 0 ? (
                  <div className="space-y-3">
                    {question.evidenceItems.map(ev => {
                      const isSelected = selectedOptionId === ev.id;
                      return (
                        <div
                          key={ev.id}
                          onClick={() => handleSingleSelect(ev.id)}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            isSelected
                              ? 'border-amber-500 bg-amber-500/10 text-slate-900 dark:text-slate-100 shadow-md ring-2 ring-amber-500/30'
                              : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 hover:border-amber-400/60 text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <span className="font-bold text-xs sm:text-sm text-amber-600 dark:text-amber-400">
                              {ev.sourceName}
                            </span>
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              {ev.type}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm font-medium leading-relaxed">
                            {ev.content}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-xs text-red-400 p-3 bg-red-500/10 rounded-lg">
                    ไม่พบตัวเลือกสำหรับคำถามนี้
                  </div>
                )}
              </div>
            )}

            {/* TYPE 6: DECISION */}
            {question.type === 'DECISION' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">เลือกการตัดสินใจของนักสืบ:</p>
                {question.options ? (
                  <div className="space-y-2.5">
                    {question.options.map(opt => (
                      <AnswerOption
                        key={opt.id}
                        id={opt.id}
                        label={opt.label}
                        selected={selectedOptionId === opt.id}
                        onSelect={handleSingleSelect}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {[
                      { key: 'REJECT', label: '❌ ปัดตก (REJECT)' },
                      { key: 'BELIEVE', label: '✅ เชื่อข่าว (BELIEVE)' },
                      { key: 'NEED_MORE_EVIDENCE', label: '🔍 สืบเพิ่มเติม (NEED MORE)' }
                    ].map(d => (
                      <button
                        key={d.key}
                        type="button"
                        onClick={() => setDecisionChoice(d.key as any)}
                        className={`p-3.5 rounded-xl border text-xs sm:text-sm font-bold transition-all ${
                          decisionChoice === d.key
                            ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md ring-2 ring-amber-400'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-amber-400'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TYPE 7: REASON_SELECT & REVISION_SELECT */}
            {(question.type === 'REASON_SELECT' || question.type === 'REVISION_SELECT' || question.type === 'SHORT_RESPONSE') && (
              <div className="space-y-2.5">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">เลือกตัวเลือกหรือเหตุผลที่เหมาะสมที่สุด:</p>
                {question.options && question.options.map(opt => (
                  <AnswerOption
                    key={opt.id}
                    id={opt.id}
                    label={opt.label}
                    selected={selectedOptionId === opt.id}
                    onSelect={handleSingleSelect}
                  />
                ))}
              </div>
            )}

            {/* TYPE 8: SELF_CHECK */}
            {question.type === 'SELF_CHECK' && question.options && (
              <div className="space-y-2.5">
                {question.options.map(opt => (
                  <AnswerOption
                    key={opt.id}
                    id={opt.id}
                    label={opt.label}
                    selected={selectedOptionId === opt.id}
                    onSelect={handleSingleSelect}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Navigation & Submit Action Bar */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Back Button */}
          <div>
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                disabled={!canGoBack}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>ย้อนกลับ</span>
              </button>
            )}
          </div>

          {/* Right Action Group */}
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            {isAllAnswered && onReviewAll && (
              <button
                type="button"
                onClick={onReviewAll}
                className="px-4 py-2.5 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-300 font-bold text-xs sm:text-sm hover:bg-amber-500/20 transition-all flex items-center space-x-1.5"
              >
                <ClipboardList className="w-4 h-4" />
                <span>ตรวจคำตอบทั้งหมด</span>
              </button>
            )}

            <button
              type="submit"
              id="btn_submit_question_card"
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-lg hover:shadow-amber-500/20 transition-all flex items-center justify-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {isLastQuestion
                  ? 'ยืนยันคำตอบ & ตรวจสอบข้อสอบ'
                  : questionStatus === 'ANSWERED' || questionStatus === 'REVISED'
                  ? 'บันทึกการแก้ไข & ถัดไป'
                  : 'ยืนยันคำตอบ & ถัดไป'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};

