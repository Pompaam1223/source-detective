import React, { useState } from 'react';
import {
  Student,
  StudentAnswerValue,
  QuestionAttempt,
  AssessmentResult,
  AppScreen,
  QuestionNavStatus
} from '../types';
import { SAMPLE_QUESTIONS } from '../data/sampleQuestions';
import { QuestionCard } from '../components/QuestionCard';
import { StorageService } from '../engine/StorageService';
import { ScoringEngine } from '../engine/ScoringEngine';
import {
  FileCheck2,
  ArrowLeft,
  Award,
  Sparkles,
  CheckCircle2,
  RotateCcw,
  ClipboardCheck,
  Send,
  Edit3,
  AlertCircle
} from 'lucide-react';

interface AssessmentScreenProps {
  type: 'BASELINE' | 'POST_TEST';
  currentStudent: Student | null;
  onNavigate: (screen: AppScreen) => void;
  onAssessmentCompleted: (result: AssessmentResult) => void;
}

export const AssessmentScreen: React.FC<AssessmentScreenProps> = ({
  type,
  currentStudent,
  onNavigate,
  onAssessmentCompleted
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [maxUnlockedIdx, setMaxUnlockedIdx] = useState<number>(0);
  const [attemptsMap, setAttemptsMap] = useState<Record<string, QuestionAttempt>>({});
  const [attemptCounts, setAttemptCounts] = useState<Record<string, number>>({});
  const [viewMode, setViewMode] = useState<'QUESTION' | 'REVIEW'>('QUESTION');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const totalQuestions = SAMPLE_QUESTIONS.length;
  const currentQuestion = SAMPLE_QUESTIONS[currentIdx] || SAMPLE_QUESTIONS[0];

  const answeredCount = Object.keys(attemptsMap).length;
  const isAllAnswered = answeredCount === totalQuestions;

  // Determine status of each question
  const getQuestionStatus = (qId: string): QuestionNavStatus => {
    if (isSubmitted) return 'SUBMITTED';
    const attempt = attemptsMap[qId];
    if (!attempt) return 'UNANSWERED';
    const count = attemptCounts[qId] || 1;
    return count > 1 ? 'REVISED' : 'ANSWERED';
  };

  // Handle student answer submission on a single question
  const handleAnswerSubmit = (answerValue: StudentAnswerValue) => {
    if (isSubmitted) return;

    if (!currentStudent) {
      alert('กรุณาลงทะเบียนนักเรียนก่อนเริ่มทำแบบประเมิน');
      onNavigate('STUDENT_MODE');
      return;
    }

    const { score } = ScoringEngine.evaluateQuestionAnswer(currentQuestion, answerValue);
    const prevCount = attemptCounts[currentQuestion.questionId] || 0;
    const newCount = prevCount + 1;

    const attempt: QuestionAttempt = {
      attemptId: `asst_att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      studentId: currentStudent.studentId,
      missionId: type,
      questionId: currentQuestion.questionId,
      indicatorId: currentQuestion.indicatorId,
      answer: answerValue,
      score,
      maxScore: currentQuestion.maxScore,
      attemptNumber: newCount,
      timestamp: new Date().toISOString(),
      feedbackNote: newCount > 1 ? 'บันทึกการแก้ไขคำตอบเรียบร้อยแล้ว' : 'บันทึกคำตอบเรียบร้อยแล้ว'
    };

    // Update attempts map and counts (latest response is retained for final score)
    const updatedAttemptsMap = {
      ...attemptsMap,
      [currentQuestion.questionId]: attempt
    };
    setAttemptsMap(updatedAttemptsMap);
    setAttemptCounts(prev => ({
      ...prev,
      [currentQuestion.questionId]: newCount
    }));

    // Unlock next question index
    const nextMax = Math.max(maxUnlockedIdx, currentIdx + 1);
    setMaxUnlockedIdx(nextMax);

    // Sequential Navigation Transition
    if (currentIdx + 1 < totalQuestions) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // Reached the last question
      if (Object.keys(updatedAttemptsMap).length === totalQuestions) {
        setViewMode('REVIEW');
      }
    }
  };

  // Go to previous question
  const handleGoBack = () => {
    if (isSubmitted) return;
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    }
  };

  // Jump to a specific question (only allowed if unlocked or already answered)
  const handleJumpToQuestion = (index: number) => {
    if (isSubmitted) return;
    // Sequential rule: Cannot jump ahead of maxUnlockedIdx
    if (index <= maxUnlockedIdx && index >= 0 && index < totalQuestions) {
      setCurrentIdx(index);
      setViewMode('QUESTION');
    } else {
      alert('กรุณาทำข้อสอบตามลำดับทีละข้อ ไม่สามารถข้ามไปยังข้อที่ยังไม่เปิดได้');
    }
  };

  // Final Submit Handler
  const handleFinalSubmit = () => {
    if (isSubmitted) return;

    if (!currentStudent) {
      alert('กรุณาลงทะเบียนนักเรียนก่อนส่งแบบประเมิน');
      return;
    }

    if (!isAllAnswered) {
      alert(`กรุณาตอบคำถามให้ครบทุกข้อก่อนส่ง (ตอบแล้ว ${answeredCount}/${totalQuestions} ข้อ)`);
      return;
    }

    // Convert map to attempts list (ensures 1 score per questionId)
    const finalAttemptsList: QuestionAttempt[] = Object.values(attemptsMap);
    const totalScore: number = finalAttemptsList.reduce((sum: number, a: QuestionAttempt) => sum + (a.score || 0), 0);
    const domainScores = ScoringEngine.calculateDomainScores(finalAttemptsList);

    const result: AssessmentResult = {
      assessmentId: `asst_${Date.now()}`,
      type,
      studentId: currentStudent.studentId,
      score: totalScore,
      maxScore: 40,
      completedAt: new Date().toISOString(),
      domainScores,
      indicatorScores: {} as any
    };

    // Lock and persist
    setIsSubmitted(true);
    StorageService.saveAssessmentResult(result);
    onAssessmentCompleted(result);
  };

  const progressPercentage = Math.round((answeredCount / totalQuestions) * 100);

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        {type === 'BASELINE' && !isSubmitted ? (
          <button
            onClick={() => onNavigate('MISSION_MAP')}
            className="text-xs font-bold text-slate-400 hover:text-amber-400 flex items-center space-x-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับสู่หน้าหลัก</span>
          </button>
        ) : (
          <div className="flex items-center space-x-1.5 text-xs font-mono font-bold text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full">
            <span>🔒 อยู่ในระหว่างทำแบบประเมิน (ห้ามออกจากหน้าจนกว่าจะส่ง)</span>
          </div>
        )}

        <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${
          type === 'BASELINE'
            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
            : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
        }`}>
          {type === 'BASELINE' ? 'แบบประเมินก่อนเรียน (BASELINE)' : 'แบบประเมินหลังเรียน (POST-TEST)'}
        </span>
      </div>

      {/* Main Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-slate-100 shadow-xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {type === 'BASELINE' ? 'การประเมินทักษะก่อนเรียน (Baseline Test)' : 'การประเมินทักษะหลังเรียน (Post Test)'}
              </h2>
              <p className="text-xs text-slate-400">
                ข้อสอบวัดสมรรถนะการสืบสวนและตรวจสอบข้อมูลข่าวสาร (10 ข้อ 40 คะแนนเต็ม)
              </p>
            </div>
          </div>

          {/* Quick Stat */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <span className="text-xs text-slate-400 block">ความคืบหน้า</span>
              <span className="text-sm font-mono font-extrabold text-amber-400">
                ตอบแล้ว {answeredCount}/{totalQuestions} ข้อ
              </span>
            </div>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="space-y-1.5 pt-2">
          <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
            <div
              className="bg-amber-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Sequential Question Progress Pills */}
        <div className="flex items-center justify-between gap-1.5 overflow-x-auto pt-2 pb-1">
          {SAMPLE_QUESTIONS.map((q, idx) => {
            const status = getQuestionStatus(q.questionId);
            const isCurrent = idx === currentIdx && viewMode === 'QUESTION';
            const isUnlocked = idx <= maxUnlockedIdx;

            return (
              <button
                key={q.questionId}
                type="button"
                onClick={() => handleJumpToQuestion(idx)}
                disabled={!isUnlocked || isSubmitted}
                className={`flex-1 min-w-[36px] py-1.5 px-2 rounded-lg text-xs font-mono font-bold transition-all text-center border ${
                  isCurrent
                    ? 'bg-amber-500 text-slate-950 border-amber-400 ring-2 ring-amber-400/50 scale-105'
                    : status === 'REVISED'
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 hover:bg-purple-500/30'
                    : status === 'ANSWERED'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                    : isUnlocked
                    ? 'bg-slate-800 text-slate-300 border-slate-700 hover:border-amber-400'
                    : 'bg-slate-950 text-slate-600 border-slate-900 cursor-not-allowed opacity-50'
                }`}
                title={`ข้อที่ ${idx + 1}: ${status === 'ANSWERED' ? 'ตอบแล้ว' : status === 'REVISED' ? 'แก้ไขแล้ว' : 'ยังไม่ตอบ'}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* VIEW MODE: REVIEW & SUBMIT GATE */}
      {viewMode === 'REVIEW' ? (
        <div className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 text-slate-100 shadow-2xl space-y-6 animate-fadeIn">
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest block">
                REVIEW & SUBMIT GATE
              </span>
              <h3 className="text-xl font-black text-slate-100">
                ตรวจคำตอบของคุณให้เรียบร้อยก่อนส่ง
              </h3>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            คุณสามารถตรวจสอบสถานะคำตอบของทุกข้อ หรือกด <strong>[แก้ไข]</strong> เพื่อกลับไปปรับปรุงคำตอบก่อนยืนยันส่ง เมื่อกดส่งแล้วคำตอบจะถูกบันทึกและไม่สามารถแก้ไขได้อีก
          </p>

          {/* Question Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SAMPLE_QUESTIONS.map((q, idx) => {
              const attempt = attemptsMap[q.questionId];
              const status = getQuestionStatus(q.questionId);
              const count = attemptCounts[q.questionId] || 0;

              return (
                <div
                  key={q.questionId}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    status === 'UNANSWERED'
                      ? 'bg-red-500/10 border-red-500/30'
                      : status === 'REVISED'
                      ? 'bg-purple-500/10 border-purple-500/30'
                      : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-black text-xs px-2 py-0.5 rounded bg-slate-800 text-amber-300">
                        ข้อ {idx + 1}
                      </span>
                      {status === 'REVISED' && (
                        <span className="text-[10px] font-mono font-bold text-purple-300 bg-purple-500/20 px-1.5 py-0.5 rounded">
                          แก้ไข ({count} ครั้ง)
                        </span>
                      )}
                      {status === 'ANSWERED' && (
                        <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-500/20 px-1.5 py-0.5 rounded">
                          ตอบแล้ว
                        </span>
                      )}
                      {status === 'UNANSWERED' && (
                        <span className="text-[10px] font-mono font-bold text-red-400 bg-red-500/20 px-1.5 py-0.5 rounded">
                          ยังไม่ตอบ
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 font-medium line-clamp-1">
                      {q.title}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setCurrentIdx(idx);
                      setViewMode('QUESTION');
                    }}
                    className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 text-xs font-bold transition-all flex items-center space-x-1 shrink-0"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>แก้ไข</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Review Actions */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                setCurrentIdx(0);
                setViewMode('QUESTION');
              }}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm transition-all flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>กลับไปแก้ไขข้อสอบ</span>
            </button>

            <button
              type="button"
              id="btn_final_submit_assessment"
              onClick={handleFinalSubmit}
              disabled={!isAllAnswered || isSubmitted}
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-black text-sm px-8 py-3 rounded-2xl shadow-xl hover:shadow-amber-500/20 transition-all flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>ส่งคำตอบ (Submit)</span>
            </button>
          </div>
        </div>
      ) : (
        /* VIEW MODE: QUESTION RENDERER */
        <QuestionCard
          question={currentQuestion}
          questionNumber={currentIdx + 1}
          totalQuestions={totalQuestions}
          initialAnswer={attemptsMap[currentQuestion.questionId]?.answer}
          questionStatus={getQuestionStatus(currentQuestion.questionId)}
          canGoBack={currentIdx > 0}
          isLastQuestion={currentIdx === totalQuestions - 1}
          isAllAnswered={isAllAnswered}
          onBack={handleGoBack}
          onReviewAll={() => setViewMode('REVIEW')}
          onAnswerSubmit={handleAnswerSubmit}
        />
      )}

    </div>
  );
};

