import React, { useState, useEffect } from 'react';
import {
  MissionConfig,
  Student,
  StudentAnswerValue,
  QuestionAttempt,
  Evidence,
  SourceCard,
  QuestionNavStatus
} from '../../types';
import { ScoringEngine } from '../../engine/ScoringEngine';
import { EvidenceEngine } from '../../engine/EvidenceEngine';
import { StorageService } from '../../engine/StorageService';
import { MissionIntro } from './MissionIntro';
import { MissionProgress } from './MissionProgress';
import { SourceCardViewer } from './SourceCardViewer';
import { QuestionRenderer } from './QuestionRenderer';
import { MissionResultView } from './MissionResultView';
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Shield,
  Award,
  Sparkles,
  BookOpen,
  ClipboardCheck,
  Edit3,
  Send,
  RotateCcw
} from 'lucide-react';

interface MissionEngineProps {
  missionConfig: MissionConfig;
  currentStudent: Student;
  onActiveContextChange?: (questionId: string, sourceCardId?: string) => void;
  onMissionCompleted?: (totalScore: number, attempts: QuestionAttempt[]) => void;
  onNavigateHome: () => void;
}

export const MissionEngine: React.FC<MissionEngineProps> = ({
  missionConfig,
  currentStudent,
  onActiveContextChange,
  onMissionCompleted,
  onNavigateHome
}) => {
  const [engineState, setEngineState] = useState<'INTRO' | 'PLAYING' | 'FEEDBACK' | 'REVIEW' | 'RESULT'>('INTRO');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [maxUnlockedIndex, setMaxUnlockedIndex] = useState<number>(0);
  const [attemptsMap, setAttemptsMap] = useState<Record<string, QuestionAttempt>>({});
  const [attemptCounts, setAttemptCounts] = useState<Record<string, number>>({});
  const [evidencesMap, setEvidencesMap] = useState<Record<string, Evidence>>({});
  const [lastFeedback, setLastFeedback] = useState<{ score: number; maxScore: number; text: string } | null>(null);

  const questions = missionConfig.questions;
  const currentQuestion = questions[currentQuestionIndex] || questions[0];

  const answeredCount = Object.keys(attemptsMap).length;
  const isAllAnswered = answeredCount === questions.length;

  // Find current stage
  const currentStage = missionConfig.stages.find(s =>
    s.questionIds.includes(currentQuestion.questionId)
  ) || missionConfig.stages[0];

  // Find relevant source cards for current question
  const questionSourceCardIds = currentQuestion.sourceCardIds || (currentQuestion.sourceCardId ? [currentQuestion.sourceCardId] : []);
  const activeSourceCards: SourceCard[] = questionSourceCardIds.length > 0
    ? missionConfig.sourceCards.filter(c => questionSourceCardIds.includes(c.sourceCardId))
    : (currentQuestion.sourceCardId
        ? missionConfig.sourceCards.filter(c => c.sourceCardId === currentQuestion.sourceCardId)
        : missionConfig.sourceCards);

  const primarySourceCardId = currentQuestion.sourceCardId || (activeSourceCards.length > 0 ? activeSourceCards[0].sourceCardId : undefined);

  // Notify parent of active question & source card context
  useEffect(() => {
    if (engineState === 'PLAYING' || engineState === 'FEEDBACK') {
      if (onActiveContextChange) {
        onActiveContextChange(currentQuestion.questionId, primarySourceCardId);
      }
    }
  }, [currentQuestionIndex, engineState, currentQuestion.questionId, primarySourceCardId, onActiveContextChange]);

  // Load existing attempts from StorageService on mount
  useEffect(() => {
    const existing = StorageService.getAttempts(currentStudent.studentId, missionConfig.missionId);
    if (existing.length > 0) {
      const map: Record<string, QuestionAttempt> = {};
      const counts: Record<string, number> = {};
      existing.forEach(a => {
        map[a.questionId] = a;
        counts[a.questionId] = a.attemptNumber || 1;
      });
      setAttemptsMap(map);
      setAttemptCounts(counts);
      setMaxUnlockedIndex(Math.min(existing.length, questions.length - 1));

      const studentEvidences = EvidenceEngine.getMissionEvidences(currentStudent.studentId, missionConfig.missionId);
      const evMap: Record<string, Evidence> = {};
      studentEvidences.forEach(e => {
        evMap[e.questionId] = e;
      });
      setEvidencesMap(evMap);
    }
  }, [currentStudent.studentId, missionConfig.missionId, questions.length]);

  // Determine question status
  const getQuestionStatus = (qId: string): QuestionNavStatus => {
    if (engineState === 'RESULT') return 'SUBMITTED';
    const attempt = attemptsMap[qId];
    if (!attempt) return 'UNANSWERED';
    const count = attemptCounts[qId] || 1;
    return count > 1 ? 'REVISED' : 'ANSWERED';
  };

  // Start mission
  const handleStartMission = () => {
    setEngineState('PLAYING');
    setCurrentQuestionIndex(0);
  };

  // Handle student answer submission
  const handleAnswerSubmit = (answerValue: StudentAnswerValue) => {
    // 1. Evaluate with Scoring Engine
    const { score, feedback } = ScoringEngine.evaluateQuestionAnswer(currentQuestion, answerValue);

    // 2. Record Attempt and Evidence via EvidenceEngine
    const { attempt, evidence } = EvidenceEngine.recordAttemptAndEvidence({
      studentId: currentStudent.studentId,
      mission: missionConfig,
      question: currentQuestion,
      answerValue,
      score,
      feedback,
      stageNumber: currentStage.stageNumber
    });

    const prevCount = attemptCounts[currentQuestion.questionId] || 0;
    const newCount = prevCount + 1;

    setAttemptsMap(prev => ({
      ...prev,
      [currentQuestion.questionId]: attempt
    }));
    setAttemptCounts(prev => ({
      ...prev,
      [currentQuestion.questionId]: newCount
    }));
    setEvidencesMap(prev => ({
      ...prev,
      [currentQuestion.questionId]: evidence
    }));

    // Unlock next question index
    const nextMax = Math.max(maxUnlockedIndex, currentQuestionIndex + 1);
    setMaxUnlockedIndex(nextMax);

    setLastFeedback({
      score,
      maxScore: currentQuestion.maxScore,
      text: feedback
    });

    setEngineState('FEEDBACK');
  };

  // Proceed to next question or review
  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setEngineState('PLAYING');
    } else {
      // Reached the end of questions -> Go to Review & Submit Gate
      setEngineState('REVIEW');
    }
  };

  // Go to previous question
  const handleGoBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setEngineState('PLAYING');
    }
  };

  // Jump to specific question (Sequential validation)
  const handleJumpToQuestion = (index: number) => {
    if (index <= maxUnlockedIndex && index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
      setEngineState('PLAYING');
    } else {
      alert('กรุณาทำภารกิจตามลำดับทีละข้อ ไม่สามารถข้ามไปยังข้อที่ยังไม่เปิดได้');
    }
  };

  // Final Submit Handler
  const handleFinalSubmit = () => {
    if (!isAllAnswered) {
      alert(`กรุณาทำภารกิจให้ครบทุกข้อก่อนส่ง (ทำแล้ว ${answeredCount}/${questions.length} ข้อ)`);
      return;
    }

    const finalAttempts: QuestionAttempt[] = Object.values(attemptsMap);
    const finalEvidences: Evidence[] = Object.values(evidencesMap);
    const totalScore: number = finalAttempts.reduce((sum: number, a: QuestionAttempt) => sum + (a.score || 0), 0);

    // Update student points in StorageService
    StorageService.addPoints(currentStudent.studentId, totalScore);

    setEngineState('RESULT');

    if (onMissionCompleted) {
      onMissionCompleted(totalScore, finalAttempts);
    }
  };

  // Retry mission
  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setEngineState('PLAYING');
  };

  // Compute live points (sum of latest attempt scores)
  const earnedScore: number = (Object.values(attemptsMap) as QuestionAttempt[]).reduce(
    (sum: number, a: QuestionAttempt) => sum + (a.score || 0),
    0
  );

  // Status mapping for MissionProgress pills
  const questionStatusesMap: Record<string, string> = {};
  questions.forEach(q => {
    questionStatusesMap[q.questionId] = getQuestionStatus(q.questionId);
  });

  // View: INTRO
  if (engineState === 'INTRO') {
    return (
      <MissionIntro
        mission={missionConfig}
        onStart={handleStartMission}
        onBack={onNavigateHome}
      />
    );
  }

  // View: RESULT
  if (engineState === 'RESULT') {
    return (
      <MissionResultView
        mission={missionConfig}
        attempts={Object.values(attemptsMap)}
        evidences={Object.values(evidencesMap)}
        totalScore={earnedScore}
        maxScore={missionConfig.totalScore}
        onRetry={handleRetry}
        onContinue={onNavigateHome}
      />
    );
  }

  // View: REVIEW & SUBMIT GATE
  if (engineState === 'REVIEW') {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn py-4">
        <div className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 text-slate-100 shadow-2xl space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest block">
                MISSION REVIEW & SUBMIT GATE
              </span>
              <h3 className="text-xl font-black text-slate-100">
                ตรวจคำตอบของคุณให้เรียบร้อยก่อนส่งภารกิจ
              </h3>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            คุณสามารถตรวจสอบสถานะการตอบของทั้ง 16 ข้อ หรือกด <strong>[แก้ไข]</strong> เพื่อกลับไปปรับปรุงคำตอบก่อนยืนยันส่งภารกิจ คะแนนจะถูกคำนวณจากคำตอบล่าสุดของแต่ละข้อ
          </p>

          {/* Question Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
            {questions.map((q, idx) => {
              const attempt = attemptsMap[q.questionId];
              const status = getQuestionStatus(q.questionId);
              const count = attemptCounts[q.questionId] || 0;

              return (
                <div
                  key={q.questionId}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    status === 'UNANSWERED'
                      ? 'bg-red-500/10 border-red-500/30'
                      : status === 'REVISED'
                      ? 'bg-purple-500/10 border-purple-500/30'
                      : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <div className="space-y-1 overflow-hidden">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-black text-xs px-2 py-0.5 rounded bg-slate-800 text-amber-300 shrink-0">
                        ข้อ {idx + 1}
                      </span>
                      {status === 'REVISED' && (
                        <span className="text-[10px] font-mono font-bold text-purple-300 bg-purple-500/20 px-1.5 py-0.5 rounded shrink-0">
                          แก้ไข ({count} ครั้ง)
                        </span>
                      )}
                      {status === 'ANSWERED' && (
                        <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-500/20 px-1.5 py-0.5 rounded shrink-0">
                          ตอบแล้ว
                        </span>
                      )}
                      {status === 'UNANSWERED' && (
                        <span className="text-[10px] font-mono font-bold text-red-400 bg-red-500/20 px-1.5 py-0.5 rounded shrink-0">
                          ยังไม่ตอบ
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 font-medium truncate">
                      {q.title}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setCurrentQuestionIndex(idx);
                      setEngineState('PLAYING');
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
                setCurrentQuestionIndex(0);
                setEngineState('PLAYING');
              }}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm transition-all flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>กลับไปแก้ไขภารกิจ</span>
            </button>

            <button
              type="button"
              id="btn_final_submit_mission"
              onClick={handleFinalSubmit}
              disabled={!isAllAnswered}
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-black text-sm px-8 py-3 rounded-2xl shadow-xl hover:shadow-amber-500/20 transition-all flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>ส่งผลการสืบสวน (Submit Mission)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // View: PLAYING or FEEDBACK
  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn py-2">
      {/* Top Mission Progress with Navigation Pills */}
      <MissionProgress
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        currentStageNumber={currentStage.stageNumber}
        totalStages={missionConfig.stages.length}
        stageTitle={currentStage.title}
        earnedScore={earnedScore}
        totalMaxScore={missionConfig.totalScore}
        activeIndicatorId={currentQuestion.indicatorId}
        maxUnlockedIndex={maxUnlockedIndex}
        questionStatuses={questionStatusesMap}
        questions={questions}
        onJumpToQuestion={handleJumpToQuestion}
      />

      {/* Main 2-Column or Stacked Interactive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Source Cards Viewer (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-4">
          <SourceCardViewer
            sourceCards={activeSourceCards}
            activeCardId={primarySourceCardId}
          />
        </div>

        {/* Right Column: Question Renderer or Feedback (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-4">
          {engineState === 'FEEDBACK' && lastFeedback ? (
            <div className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 text-slate-100 shadow-2xl space-y-6 animate-fadeIn">
              <div className="flex items-center space-x-3">
                {lastFeedback.score > 0 ? (
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
                    <Sparkles className="w-7 h-7" />
                  </div>
                )}
                <div>
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                    ผลการประเมินเบาะแส (ข้อ {currentQuestionIndex + 1}/{questions.length})
                  </span>
                  <h3 className="text-lg font-black text-slate-100">
                    ได้รับ +{lastFeedback.score} จาก {lastFeedback.maxScore} คะแนน
                  </h3>
                </div>
              </div>

              {/* Feedback text */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-slate-200 text-sm leading-relaxed">
                {lastFeedback.text}
              </div>

              {/* Action Buttons: Back, Review All, Next */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                {currentQuestionIndex > 0 ? (
                  <button
                    type="button"
                    onClick={handleGoBack}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-bold transition-all flex items-center justify-center space-x-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>ย้อนกลับไปข้อก่อนหน้า</span>
                  </button>
                ) : <div />}

                <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                  {isAllAnswered && (
                    <button
                      type="button"
                      onClick={() => setEngineState('REVIEW')}
                      className="px-4 py-2.5 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-300 font-bold text-xs sm:text-sm hover:bg-amber-500/20 transition-all"
                    >
                      ตรวจคำตอบทั้งหมด
                    </button>
                  )}

                  <button
                    id="btn_next_question_step"
                    onClick={handleNextQuestion}
                    className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm px-7 py-2.5 rounded-xl shadow-xl hover:shadow-amber-500/20 transition-all flex items-center justify-center space-x-2"
                  >
                    <span>
                      {currentQuestionIndex + 1 < questions.length ? 'ไปยังข้อถัดไป' : 'ไปยังหน้าตรวจคำตอบ & ส่งภารกิจ'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <QuestionRenderer
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              initialAnswer={attemptsMap[currentQuestion.questionId]?.answer}
              questionStatus={getQuestionStatus(currentQuestion.questionId)}
              canGoBack={currentQuestionIndex > 0}
              isLastQuestion={currentQuestionIndex === questions.length - 1}
              isAllAnswered={isAllAnswered}
              onBack={handleGoBack}
              onReviewAll={() => setEngineState('REVIEW')}
              onAnswerSubmit={handleAnswerSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
};

