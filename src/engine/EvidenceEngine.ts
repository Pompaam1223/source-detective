import {
  Evidence,
  QuestionAttempt,
  StudentAnswerValue,
  IndicatorId,
  Question,
  MissionConfig
} from '../types';
import { StorageService } from './StorageService';

export class EvidenceEngine {
  /**
   * Structure and record both QuestionAttempt and Evidence into persistent storage
   */
  static recordAttemptAndEvidence(params: {
    studentId: string;
    mission: MissionConfig;
    question: Question;
    answerValue: StudentAnswerValue;
    score: number;
    feedback: string;
    stageNumber?: number;
    hintUsed?: boolean;
    aiUsed?: boolean;
    aiMenuSelected?: string;
  }): { attempt: QuestionAttempt; evidence: Evidence } {
    const {
      studentId,
      mission,
      question,
      answerValue,
      score,
      feedback,
      hintUsed = false,
      aiUsed = false,
      aiMenuSelected
    } = params;

    const primarySourceCardId = question.sourceCardId || (question.sourceCardIds && question.sourceCardIds.length > 0 ? question.sourceCardIds[0] : undefined);

    // Track attempt number and revisions
    const existingAttempts = StorageService.getAttempts(studentId, mission.missionId);
    const prevAttempt = existingAttempts.find(a => a.questionId === question.questionId);
    const attemptNumber = prevAttempt ? (prevAttempt.attemptNumber || 1) + 1 : 1;

    // Structure Decision Revision metadata if applicable (e.g. Q16)
    const structuredAnswer: StudentAnswerValue = {
      ...answerValue,
      initialDecision: answerValue.multiStepAnswers?.stepA || answerValue.initialDecision,
      newEvidence: answerValue.multiStepAnswers?.stepB || (primarySourceCardId ? `SC09 (คุณภาพของการนอน)` : answerValue.newEvidence),
      decisionChanged: answerValue.multiStepAnswers?.stepC === 'sC_opt1' || answerValue.decisionChanged,
      revisionReason: answerValue.multiStepAnswers?.stepD || answerValue.revisionReason,
      finalDecision: answerValue.multiStepAnswers?.stepE || answerValue.finalDecision
    };

    // Build QuestionAttempt record
    const attempt: QuestionAttempt = {
      attemptId: `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      studentId,
      missionId: mission.missionId,
      questionId: question.questionId,
      indicatorId: question.indicatorId,
      sourceCardId: primarySourceCardId,
      answer: structuredAnswer,
      score,
      maxScore: question.maxScore,
      attemptNumber,
      hintUsed,
      aiUsed,
      aiMenuSelected,
      evidenceType: attemptNumber > 1 && !question.evidenceType ? 'REVISION' : (question.evidenceType || 'CLAIM'),
      timestamp: new Date().toISOString(),
      feedbackNote: feedback
    };

    StorageService.saveAttempt(attempt);

    // Build Evidence record
    const autoVerifyThreshold = mission.evidenceConfig?.autoVerifyThreshold ?? 0.75;
    const isVerified = score >= (question.maxScore * autoVerifyThreshold);

    const evidence: Evidence = {
      id: `ev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      studentId,
      missionId: mission.missionId,
      questionId: question.questionId,
      indicatorId: question.indicatorId,
      sourceCardId: primarySourceCardId,
      type: attemptNumber > 1 && !question.evidenceType ? 'REVISION' : (question.evidenceType || 'CLAIM'),
      title: `${mission.caseCode}: ${question.title}${attemptNumber > 1 ? ` (แก้ไขครั้งที่ ${attemptNumber - 1})` : ''}`,
      content: structuredAnswer.revisionReason || structuredAnswer.reasoningText || structuredAnswer.shortResponseText || feedback || 'บันทึกหลักฐานจากการสืบค้น',
      sourceTag: mission.missionTitle,
      answer: structuredAnswer,
      score,
      maxScore: question.maxScore,
      attemptNumber,
      hintUsed,
      aiUsed,
      aiMenuSelected,
      isVerified,
      timestamp: new Date().toISOString()
    };

    StorageService.saveEvidence(evidence);

    return { attempt, evidence };
  }

  /**
   * Get all evidences for a given student and mission
   */
  static getMissionEvidences(studentId: string, missionId: string): Evidence[] {
    const allEvidences = StorageService.getEvidences(studentId);
    return allEvidences.filter(e => e.missionId === missionId);
  }
}
