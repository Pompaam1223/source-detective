import {
  Question,
  StudentAnswerValue,
  QuestionAttempt,
  IndicatorId,
  CompetencyDomain
} from '../types';
import { INDICATOR_DEFINITIONS } from '../data/indicators';

export class ScoringEngine {
  /**
   * Maximum scores specified by design rule:
   * Indicator max = 2
   * Question max = 4
   * Assessment max = 40
   */
  static readonly QUESTION_MAX_SCORE = 4;
  static readonly INDICATOR_MAX_SCORE = 2;
  static readonly ASSESSMENT_MAX_SCORE = 40;

  /**
   * Evaluate a student's answer submission for a question
   */
  static evaluateQuestionAnswer(
    question: Question,
    answer: StudentAnswerValue
  ): { score: number; feedback: string } {
    let score = 0;
    let feedback = '';
    const maxScore = question.maxScore || 4;

    switch (question.type) {
      case 'SINGLE_CHOICE':
      case 'REASON_SELECT': {
        const selected = question.options?.find(o => o.id === answer.selectedOptionId);
        if (selected?.isCorrect) {
          score = maxScore;
          feedback = selected.feedback || `ตอบถูกต้อง! ได้รับ ${maxScore} คะแนนเต็ม`;
        } else {
          score = 0;
          feedback = selected?.feedback || 'ยังไม่ถูกต้องทีเดียว ลองพิจารณาหลักฐานอีกครั้ง';
        }
        break;
      }

      case 'MULTI_SELECT': {
        const correctIds = question.options?.filter(o => o.isCorrect).map(o => o.id) || [];
        const selectedIds = answer.selectedOptionIds || [];

        const correctSelected = selectedIds.filter(id => correctIds.includes(id)).length;
        const incorrectSelected = selectedIds.filter(id => !correctIds.includes(id)).length;

        if (question.questionId === 'q04_t4' || question.questionId === 'q14_e2') {
          if (correctSelected === correctIds.length && incorrectSelected === 0) {
            score = maxScore; // 3
            feedback = 'ระบุปัจจัยความเสี่ยงและเหตุผลถูกต้องครบถ้วนได้รับคะแนนเต็ม!';
          } else if (correctSelected === 1 && incorrectSelected === 0) {
            score = 2;
            feedback = 'เลือกได้ถูกต้อง 1 ข้อ ควรพิจารณาความเสี่ยงเพิ่มเติมให้ครบถ้วน';
          } else if (correctSelected >= 1 && incorrectSelected >= 1) {
            score = 1;
            feedback = 'มีข้อที่เลือกถูกต้องแต่มีตัวเลือกที่ไม่สอดคล้องรวมอยู่ด้วย';
          } else {
            score = 0;
            feedback = 'ยังไม่ถูกต้อง ลองสังเกตป้ายเตือนและลักษณะโฆษณา';
          }
        } else if (question.questionId === 'q04_m2') {
          if (correctSelected === 2 && incorrectSelected === 0) {
            score = 3;
            feedback = 'เปรียบเทียบสาระสำคัญจากทั้งสองแหล่งได้ถูกต้องครบถ้วน!';
          } else if (correctSelected === 1 && incorrectSelected === 0) {
            score = 1.5;
            feedback = 'ถูกต้อง 1 ข้อ ควรเลือกข้อความที่ระบุตรงกันให้ครบถ้วน';
          } else {
            score = 0;
            feedback = 'ยังไม่ถูกต้อง ลองพิจารณาข้อความที่ทั้งสองแหล่งระบุตรงกัน';
          }
        } else if (question.questionId === 'q07_m2') {
          if (correctSelected === 2 && incorrectSelected === 0) {
            score = 3;
            feedback = 'คัดเลือกแผ่นเบาะแสหลักฐานชั้นต้นทางการแพทย์ได้ถูกต้องครบถ้วน!';
          } else if (correctSelected === 1 && incorrectSelected === 0) {
            score = 1.5;
            feedback = 'เลือกหลักฐานชั้นต้นได้ถูกต้อง 1 ใบ ควรเลือกให้ครบทั้ง 2 ใบ';
          } else {
            score = 0;
            feedback = 'ยังมีเบาะแสที่มาจากสื่อโฆษณาหรือความคิดเห็นส่วนบุคคลปะปนอยู่';
          }
        } else if (question.questionId === 'q10_m2' || question.questionId === 'q14_m2') {
          if (correctSelected === 3 && incorrectSelected === 0) {
            score = 3;
            feedback = 'เลือกแนวทาง/ชุดหลักฐานได้ถูกต้องครบถ้วนทุกข้อ!';
          } else if (correctSelected === 2 && incorrectSelected === 0) {
            score = 2;
            feedback = 'ถูกต้อง 2 ข้อ พยายามสังเกตแนวทาง/หลักฐานเพิ่มเติม';
          } else if (correctSelected === 1 && incorrectSelected === 0) {
            score = 1;
            feedback = 'ถูกต้อง 1 ข้อ';
          } else {
            score = 0;
            feedback = 'ยังมีตัวเลือกที่ไม่สอดคล้องรวมอยู่ด้วย';
          }
        } else if (question.questionId === 'q03_m4' || question.questionId === 'q07_m4') {
          if (correctSelected === 2 && incorrectSelected === 0) {
            score = 3;
            feedback = 'เลือกข้อมูล/หลักฐานที่ควรตรวจสอบได้ถูกต้องครบถ้วน!';
          } else if (correctSelected === 1 && incorrectSelected === 0) {
            score = 1.5;
            feedback = 'เลือกได้ถูกต้อง 1 ข้อ ควรตรวจสอบให้ครบถ้วนทั้ง 2 ด้าน';
          } else {
            score = 0;
            feedback = 'ยังมีตัวเลือกที่ไม่สอดคล้อง หรือยังระบุไม่ถูกต้อง';
          }
        } else {
          if (correctSelected === correctIds.length && incorrectSelected === 0) {
            score = maxScore;
            feedback = 'ระบุสัญญาณครบถ้วนแม่นยำทุกข้อ!';
          } else if (correctSelected > 0 && incorrectSelected === 0) {
            score = Math.max(1, Math.round((correctSelected / correctIds.length) * maxScore));
            feedback = `ถูกต้องส่วนหนึ่ง (${correctSelected}/${correctIds.length} ข้อ)`;
          } else if (correctSelected > 0) {
            score = 1;
            feedback = 'ถูกต้องบางข้อแต่มีตัวเลือกที่ไม่ตรงกับหลักฐาน';
          } else {
            score = 0;
            feedback = 'ยังระบุไม่ถูกต้อง ลองทบทวนข้อสังเกตเพิ่มเติม';
          }
        }
        break;
      }

      case 'MATCHING': {
        const pairs = question.matchingPairs || [];
        const userMatches = answer.matchedPairs || [];
        let correctCount = 0;

        userMatches.forEach(um => {
          const pair = pairs.find(p => p.id === um.itemId);
          if (pair && pair.targetMatch === um.matchedTarget) {
            correctCount++;
          }
        });

        if (pairs.length > 0) {
          if (correctCount === pairs.length) score = maxScore;
          else if (correctCount === 2) score = 2;
          else if (correctCount === 1) score = 1;
          else score = 0;
        } else {
          score = 0;
        }
        feedback = `จับคู่ถูกต้อง ${correctCount}/${pairs.length} รายการ (ได้ ${score}/${maxScore} คะแนน)`;
        break;
      }

      case 'ORDERING': {
        const items = question.orderingItems || [];
        const userOrder = answer.orderedItemIds || [];
        let correctCount = 0;

        userOrder.forEach((itemId, idx) => {
          const item = items.find(i => i.id === itemId);
          if (item && item.correctOrder === idx + 1) {
            correctCount++;
          }
        });

        if (question.questionId === 'q10_m4') {
          score = correctCount * 0.75;
        } else if (question.questionId === 'q16_m4') {
          if (correctCount === 3) score = 3;
          else if (correctCount === 2) score = 2;
          else if (correctCount === 1) score = 1;
          else score = 0;
        } else if (items.length > 0) {
          if (correctCount === items.length) score = maxScore;
          else if (correctCount === 3) score = 2;
          else if (correctCount === 2) score = 1;
          else score = 0;
        } else {
          score = 0;
        }
        feedback = `เรียงลำดับถูกต้อง ${correctCount}/${items.length} ขั้นตอน (ได้ ${score}/${maxScore} คะแนน)`;
        break;
      }

      case 'EVIDENCE_SELECT': {
        const selected = question.options?.find(o => o.id === answer.selectedOptionId);
        const evItem = question.evidenceItems?.find(e => e.id === answer.selectedOptionId || e.id === answer.selectedEvidenceIds?.[0]);

        if (selected?.isCorrect || evItem?.isCorrectEvidence) {
          score = maxScore;
          feedback = selected?.feedback || evItem?.explanation || 'ถูกต้อง! เลือกหลักฐานชั้นต้นที่มีความน่าเชื่อถือและน้ำหนักสูงสุด';
        } else {
          score = 0;
          feedback = selected?.feedback || evItem?.explanation || 'หลักฐานชิ้นนี้ยังมีน้ำหนักไม่พอ ลองพิจารณาเอกสารทางการ';
        }
        break;
      }

      case 'DECISION': {
        if (question.options && answer.selectedOptionId) {
          const selected = question.options.find(o => o.id === answer.selectedOptionId);
          if (selected?.isCorrect) {
            score = maxScore;
            feedback = selected.feedback || 'การตัดสินใจอย่างรอบคอบถูกต้อง!';
          } else {
            score = 0;
            feedback = selected?.feedback || 'หลีกเลี่ยงการรีบเชื่อทันทีโดยไม่มีหลักฐาน';
          }
        } else if (answer.decisionChoice === 'REJECT' || answer.decisionChoice === 'NEED_MORE_EVIDENCE') {
          score = maxScore;
          feedback = 'การตัดสินใจอย่างรอบคอบถูกต้อง!';
        } else {
          score = 0;
          feedback = 'หลีกเลี่ยงการรีบเชื่อทันทีโดยไม่มีหลักฐาน';
        }
        break;
      }

      case 'REVISION_SELECT': {
        if (question.multiStepQuestions && answer.multiStepAnswers) {
          let correctSteps = 0;
          const totalSteps = question.multiStepQuestions.length;

          question.multiStepQuestions.forEach(step => {
            const userStepAnsId = answer.multiStepAnswers?.[step.stepKey];
            const stepOpt = step.options.find(o => o.id === userStepAnsId);
            if (stepOpt?.isCorrect) {
              correctSteps++;
            }
          });

          if (question.questionId === 'q16_m2' || question.questionId === 'q16_composite') {
            if (correctSteps === 3) score = 4;
            else if (correctSteps === 2) score = 2;
            else if (correctSteps === 1) score = 1;
            else score = 0;
          } else if (question.questionId === 'q08_m4' || question.questionId === 'q14_m4') {
            if (correctSteps === 2) score = 3;
            else if (correctSteps === 1) score = 1.5;
            else score = 0;
          } else {
            // Scale score out of maxScore
            score = Math.round((correctSteps / totalSteps) * maxScore);
          }
          feedback = `ประเมินการทบทวนการตัดสินใจถูกต้อง ${correctSteps}/${totalSteps} ขั้นตอน (ได้ ${score}/${maxScore} คะแนน)`;
        } else {
          const selected = question.options?.find(o => o.id === answer.selectedOptionId);
          if (selected?.isCorrect) {
            score = maxScore;
            feedback = selected.feedback || 'การทบทวนการตัดสินใจถูกต้อง!';
          } else {
            score = 0;
            feedback = selected?.feedback || 'ลองพิจารณาหลักฐานใหม่และทบทวนข้อสรุป';
          }
        }
        break;
      }

      case 'SHORT_RESPONSE': {
        if (question.options && answer.selectedOptionId) {
          const selected = question.options.find(o => o.id === answer.selectedOptionId);
          score = selected?.isCorrect ? maxScore : 0;
          feedback = selected?.feedback || 'บันทึกคำตอบเรียบร้อยแล้ว';
        } else {
          score = Math.min(2, maxScore);
          feedback = 'บันทึกคำตอบเรียบร้อยแล้ว';
        }
        break;
      }

      case 'SELF_CHECK': {
        if (answer.selectedOptionId) {
          if (answer.selectedOptionId === 'sc4' || answer.selectedOptionId.endsWith('4')) score = 4;
          else if (answer.selectedOptionId === 'sc3' || answer.selectedOptionId.endsWith('3')) score = 3;
          else if (answer.selectedOptionId === 'sc2' || answer.selectedOptionId.endsWith('2')) score = 2;
          else score = 1;
        } else {
          const rating = answer.selfCheckRating || 3;
          score = Math.min(maxScore, Math.max(1, rating));
        }
        feedback = 'ขอบคุณสำหรับการประเมินตนเองอย่างซื่อสัตย์';
        break;
      }

      default:
        score = Math.min(2, maxScore);
        feedback = 'บันทึกคำตอบแล้ว';
    }

    return { score, feedback };
  }

  /**
   * Convert question attempts into Indicator Proficiency Scores (Range 0 - 2)
   */
  static calculateIndicatorScore(attemptsForIndicator: QuestionAttempt[]): number {
    if (attemptsForIndicator.length === 0) return 0;
    
    // Average percentage score across attempts (0 - 100%)
    const totalScore = attemptsForIndicator.reduce((sum, a) => sum + a.score, 0);
    const totalMax = attemptsForIndicator.reduce((sum, a) => sum + a.maxScore, 0);
    const ratio = totalMax > 0 ? totalScore / totalMax : 0;

    // Scale to Indicator Max Score (0.0 to 2.0)
    return Math.round(ratio * this.INDICATOR_MAX_SCORE * 10) / 10;
  }

  /**
   * Aggregate domain scores based on attempts
   */
  static calculateDomainScores(attempts: QuestionAttempt[]): Record<CompetencyDomain, number> {
    const domainScores: Record<CompetencyDomain, number> = {
      THINK: 0,
      CHECK: 0,
      SOLVE: 0,
      EXPLAIN: 0,
      GROW: 0
    };

    const domainTotals: Record<CompetencyDomain, { earned: number; max: number }> = {
      THINK: { earned: 0, max: 0 },
      CHECK: { earned: 0, max: 0 },
      SOLVE: { earned: 0, max: 0 },
      EXPLAIN: { earned: 0, max: 0 },
      GROW: { earned: 0, max: 0 }
    };

    attempts.forEach(a => {
      const def = INDICATOR_DEFINITIONS[a.indicatorId];
      if (def) {
        domainTotals[def.domain].earned += a.score;
        domainTotals[def.domain].max += a.maxScore;
      }
    });

    (Object.keys(domainTotals) as CompetencyDomain[]).forEach(d => {
      const { earned, max } = domainTotals[d];
      domainScores[d] = max > 0 ? Math.round((earned / max) * 10) / 10 : 0;
    });

    return domainScores;
  }

  /**
   * Detective Level Rank text
   */
  static getDetectiveRankTitle(scorePercent: number): { title: string; badge: string; color: string } {
    if (scorePercent >= 85) {
      return { title: 'ยอดนักสืบระดับศิษย์เอก (Master Detective)', badge: '🏆', color: 'text-amber-600 dark:text-amber-400' };
    } else if (scorePercent >= 70) {
      return { title: 'นักสืบอาชญากรรมไซเบอร์ (Senior Detective)', badge: '⭐', color: 'text-sky-600 dark:text-sky-400' };
    } else if (scorePercent >= 50) {
      return { title: 'นักสืบฝึกหัด (Junior Detective)', badge: '🔍', color: 'text-emerald-600 dark:text-emerald-400' };
    } else {
      return { title: 'ผู้พิทักษ์ข้อมูลเบื้องต้น (Detective Trainee)', badge: '🛡️', color: 'text-slate-600 dark:text-slate-400' };
    }
  }
}
