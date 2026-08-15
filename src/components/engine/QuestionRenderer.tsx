import React, { useState, useEffect } from 'react';
import {
  Question,
  StudentAnswerValue,
  IndicatorId,
  QuestionNavStatus
} from '../../types';
import { INDICATOR_DEFINITIONS } from '../../data/indicators';
import { AnswerOption } from '../AnswerOption';
import { HintSystem } from './HintSystem';
import { DecisionRevision } from './DecisionRevision';
import {
  CheckCircle2,
  MoveUp,
  MoveDown,
  Layers,
  HelpCircle,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  ClipboardList
} from 'lucide-react';

interface QuestionRendererProps {
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

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
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

  // State for interactive question types
  const [selectedOptionId, setSelectedOptionId] = useState<string>('');
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<{ itemId: string; matchedTarget: string }[]>([]);
  const [orderedItemIds, setOrderedItemIds] = useState<string[]>([]);
  const [decisionChoice, setDecisionChoice] = useState<'BELIEVE' | 'REJECT' | 'NEED_MORE_EVIDENCE'>('REJECT');
  const [selfCheckRating, setSelfCheckRating] = useState<number>(3);
  const [multiStepAnswers, setMultiStepAnswers] = useState<{ [stepKey: string]: string }>({});
  const [hintUsed, setHintUsed] = useState<boolean>(false);

  // Initialize or restore state on question or initialAnswer change
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
      setDecisionChoice(initialAnswer.decisionChoice || 'REJECT');
      setSelfCheckRating(initialAnswer.selfCheckRating || 3);
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
      setDecisionChoice('REJECT');
      setSelfCheckRating(3);
      setHintUsed(false);

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

  const handleStepAnswerChange = (stepKey: string, optionId: string) => {
    setMultiStepAnswers(prev => ({
      ...prev,
      [stepKey]: optionId
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (question.multiStepQuestions) {
      const allFilled = question.multiStepQuestions.every(s => !!multiStepAnswers[s.stepKey]);
      if (!allFilled) {
        alert('กรุณาตอบคำถามให้ครบทุกขั้นตอน (A ถึง E)');
        return;
      }
    } else if (question.type === 'SINGLE_CHOICE' || question.type === 'REASON_SELECT' || question.type === 'EVIDENCE_SELECT' || question.type === 'SHORT_RESPONSE') {
      if (!selectedOptionId) {
        alert('กรุณาเลือกคำตอบก่อนยืนยัน');
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
      decisionChoice,
      selfCheckRating,
      multiStepAnswers: Object.keys(multiStepAnswers).length > 0 ? multiStepAnswers : undefined
    };

    onAnswerSubmit(answerValue);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
          <span className="bg-amber-500 text-slate-950 font-mono font-black text-xs px-2.5 py-1 rounded-lg">
            ข้อที่ {questionNumber}/{totalQuestions}
          </span>
          <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
            {question.stageName || (question.stageNumber ? `ด่านที่ ${question.stageNumber}` : '')}
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

        <div className="flex items-center space-x-2">
          <HintSystem
            hintText={question.hint}
            rubricHint={question.rubricHint}
            onHintUsed={() => setHintUsed(true)}
          />
          <span className="text-xs font-mono font-bold bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 px-2.5 py-1 rounded-lg">
            คะแนนเต็ม: {question.maxScore} คะแนน
          </span>
        </div>
      </div>

      {/* Stem / Scenario */}
      <div className="space-y-3">
        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 leading-snug">
          {question.title}
        </h3>

        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed">
          {question.stem || question.questionText}
        </div>

        {question.contextScenario && (
          <div className="bg-sky-50 dark:bg-sky-950/30 p-3.5 rounded-xl border border-sky-200 dark:border-sky-800/40 text-xs sm:text-sm text-sky-900 dark:text-sky-200 font-medium">
            💡 {question.contextScenario}
          </div>
        )}
      </div>

      {/* Form Interactive Body */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Multi-step Revision Check */}
        {question.multiStepQuestions && question.multiStepQuestions.length > 0 ? (
          <DecisionRevision
            question={question}
            answers={multiStepAnswers}
            onStepAnswerChange={handleStepAnswerChange}
          />
        ) : (
          <>
            {/* SINGLE_CHOICE / REASON_SELECT / SHORT_RESPONSE */}
            {(question.type === 'SINGLE_CHOICE' ||
              question.type === 'REASON_SELECT' ||
              question.type === 'SHORT_RESPONSE') && (
              <div className="space-y-2.5">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  เลือกคำตอบที่ถูกต้องที่สุด (1 ตัวเลือก):
                </p>
                {question.options?.map(opt => (
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

            {/* EVIDENCE_SELECT */}
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

            {/* MULTI_SELECT */}
            {question.type === 'MULTI_SELECT' && (
              <div className="space-y-2.5">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  เลือกคำตอบที่ถูกต้อง (เลือกได้มากกว่า 1 ตัวเลือก):
                </p>
                {question.options?.map(opt => (
                  <AnswerOption
                    key={opt.id}
                    id={opt.id}
                    label={opt.label}
                    selected={selectedOptionIds.includes(opt.id)}
                    multiSelect={true}
                    onSelect={handleMultiSelect}
                  />
                ))}
              </div>
            )}

            {/* MATCHING */}
            {question.type === 'MATCHING' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  จับคู่รายการด้านซ้ายกับคำอธิบายด้านขวาให้ถูกต้อง:
                </p>
                {(() => {
                  const distinctTargets = Array.from(
                    new Set(question.matchingPairs?.map(p => p.targetMatch.trim()).filter(Boolean) || [])
                  );
                  return (
                    <div className="space-y-3">
                      {question.matchingPairs?.map(pair => {
                        const currentMatch = matchedPairs.find(p => p.itemId === pair.id)?.matchedTarget || '';
                        return (
                          <div
                            key={pair.id}
                            className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                          >
                            <div className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 flex-1">
                              {pair.item}
                            </div>
                            <select
                              value={currentMatch}
                              onChange={(e) => handleMatchingChange(pair.id, e.target.value)}
                              className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs sm:text-sm rounded-xl p-2.5 focus:ring-2 focus:ring-amber-500 font-medium"
                            >
                              <option value="">-- เลือกจับคู่ --</option>
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

            {/* ORDERING */}
            {question.type === 'ORDERING' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  จัดเรียงลำดับขั้นตอนโดยใช้ปุ่มขึ้น/ลง:
                </p>
                <div className="space-y-2">
                  {orderedItemIds.map((itemId, idx) => {
                    const item = question.orderingItems?.find(i => i.id === itemId);
                    if (!item) return null;
                    return (
                      <div
                        key={itemId}
                        className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 shadow-sm"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-mono font-black text-xs flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium">
                            {item.text}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 shrink-0">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => moveOrderedItem(idx, 'UP')}
                            className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 disabled:opacity-30 hover:bg-amber-400 dark:hover:bg-amber-600 transition-colors"
                          >
                            <MoveUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === orderedItemIds.length - 1}
                            onClick={() => moveOrderedItem(idx, 'DOWN')}
                            className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 disabled:opacity-30 hover:bg-amber-400 dark:hover:bg-amber-600 transition-colors"
                          >
                            <MoveDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* DECISION */}
            {question.type === 'DECISION' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  เลือกการตัดสินใจของนักสืบ:
                </p>
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

            {/* SELF_CHECK */}
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
              id="btn_submit_question_answer"
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-xl hover:shadow-amber-500/20 transition-all flex items-center justify-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {isLastQuestion
                  ? 'ยืนยันคำตอบ & ตรวจสอบภารกิจ'
                  : questionStatus === 'ANSWERED' || questionStatus === 'REVISED'
                  ? 'บันทึกการแก้ไข & ถัดไป'
                  : 'ยืนยันคำตอบ & บันทึกหลักฐาน'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

