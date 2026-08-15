import { MissionRegistry } from '../engine/MissionRegistry';
import { ScoringEngine } from '../engine/ScoringEngine';
import { MISSION_003_CONFIG } from '../data/configs/mission3Config';
import { MISSION_002_CONFIG } from '../data/configs/mission2Config';
import { MISSION_001_CONFIG } from '../data/configs/mission1Config';
import { MISSION_3_SOURCE_CARDS, getSourceCardById } from '../data/sourceCards';
import { MISSION_3_QUESTIONS } from '../data/mission3Questions';
import { StudentAnswerValue, QuestionAttempt } from '../types';

export function runMission3TestSuite(): { passed: number; failed: number; results: { name: string; success: boolean; error?: string }[] } {
  const results: { name: string; success: boolean; error?: string }[] = [];

  function assert(condition: boolean, testName: string, errorMsg?: string) {
    if (condition) {
      results.push({ name: testName, success: true });
    } else {
      results.push({ name: testName, success: false, error: errorMsg || 'Assertion failed' });
    }
  }

  // TEST-01: Mission 3 Registry & Configuration
  const m3Config = MissionRegistry.getMissionConfig('m3');
  assert(!!m3Config, 'TEST-01a: Mission 3 is registered in MissionRegistry');
  assert(m3Config?.questions.length === 16, `TEST-01b: Mission 3 has 16 questions (found ${m3Config?.questions.length})`);
  assert(m3Config?.totalScore === 40, `TEST-01c: Mission 3 total score is 40 (found ${m3Config?.totalScore})`);
  assert(m3Config?.caseCode === 'M3-001', `TEST-01d: Mission 3 case code is M3-001 (found ${m3Config?.caseCode})`);
  assert(m3Config?.stages.length === 4, `TEST-01e: Mission 3 has 4 stages (found ${m3Config?.stages.length})`);

  // TEST-02: 10 Source Cards (SC-M3-01 to SC-M3-10)
  assert(m3Config?.sourceCards.length === 10, `TEST-02a: Mission 3 has 10 source cards (found ${m3Config?.sourceCards.length})`);
  const expectedCardIds = [
    'SC-M3-01', 'SC-M3-02', 'SC-M3-03', 'SC-M3-04', 'SC-M3-05',
    'SC-M3-06', 'SC-M3-07', 'SC-M3-08', 'SC-M3-09', 'SC-M3-10'
  ];
  expectedCardIds.forEach(id => {
    const card = getSourceCardById(id);
    assert(!!card, `TEST-02: Card ${id} exists in repository`);
    if (card?.isSimulated) {
      assert(card.sourceType.includes('สถานการณ์จำลองเพื่อการเรียนรู้'), `TEST-02: Simulated card ${id} has clear simulation label`);
    }
  });

  // TEST-03: Indicator Mapping (20 indicators)
  const indicatorSet = new Set<string>();
  m3Config?.questions.forEach(q => {
    indicatorSet.add(q.indicatorId);
    if (q.indicatorIds) {
      q.indicatorIds.forEach(id => indicatorSet.add(id));
    }
  });
  assert(indicatorSet.has('T1') && indicatorSet.has('T2') && indicatorSet.has('T3') && indicatorSet.has('T4'), 'TEST-03a: Covers THINK domain (T1-T4)');
  assert(indicatorSet.has('C1') && indicatorSet.has('C2') && indicatorSet.has('C3') && indicatorSet.has('C4'), 'TEST-03b: Covers CHECK domain (C1-C4)');
  assert(indicatorSet.has('S1') && indicatorSet.has('S2') && indicatorSet.has('S3') && indicatorSet.has('S4'), 'TEST-03c: Covers SOLVE domain (S1-S4)');
  assert(indicatorSet.has('E1') && indicatorSet.has('E2') && indicatorSet.has('E3') && indicatorSet.has('E4'), 'TEST-03d: Covers EXPLAIN domain (E1-E4)');
  assert(indicatorSet.has('G1') && indicatorSet.has('G2') && indicatorSet.has('G3') && indicatorSet.has('G4'), 'TEST-03e: Covers GROW domain (G1-G4)');

  // TEST-04: Q01 - T2 (MaxScore 2) -> Single Choice -> Ans: B
  const q01 = m3Config?.questions.find(q => q.questionId === 'q01_m3')!;
  const q01Correct = ScoringEngine.evaluateQuestionAnswer(q01, { selectedOptionId: 'opt_m3_q1_b' });
  const q01Wrong = ScoringEngine.evaluateQuestionAnswer(q01, { selectedOptionId: 'opt_m3_q1_a' });
  assert(q01Correct.score === 2, `TEST-04a: Q01 correct answer receives 2 pts (got ${q01Correct.score})`);
  assert(q01Wrong.score === 0, `TEST-04b: Q01 wrong answer receives 0 pts (got ${q01Wrong.score})`);

  // TEST-05: Q02 - T1, T3 (MaxScore 2: 1 + 1) -> Multi-step / Revision Select
  const q02 = m3Config?.questions.find(q => q.questionId === 'q02_m3')!;
  const q02Full = ScoringEngine.evaluateQuestionAnswer(q02, {
    multiStepAnswers: {
      q02_a: 'opt_m3_q2_a1',
      q02_b: 'opt_m3_q2_b1'
    }
  });
  const q02Partial = ScoringEngine.evaluateQuestionAnswer(q02, {
    multiStepAnswers: {
      q02_a: 'opt_m3_q2_a1',
      q02_b: 'opt_m3_q2_b2'
    }
  });
  assert(q02Full.score === 2, `TEST-05a: Q02 full answers receive 2 pts (got ${q02Full.score})`);
  assert(q02Partial.score === 1, `TEST-05b: Q02 1 step correct receives 1 pt (got ${q02Partial.score})`);

  // TEST-06: Q03 - T4 (MaxScore 3: 2 + 1) -> Multi-step / Revision Select
  const q03 = m3Config?.questions.find(q => q.questionId === 'q03_m3')!;
  const q03Full = ScoringEngine.evaluateQuestionAnswer(q03, {
    multiStepAnswers: {
      q03_part1: 'opt_m3_q3_p1_b',
      q03_part2: 'opt_m3_q3_p2_a'
    }
  });
  const q03Part1Only = ScoringEngine.evaluateQuestionAnswer(q03, {
    multiStepAnswers: {
      q03_part1: 'opt_m3_q3_p1_b',
      q03_part2: 'opt_m3_q3_p2_b'
    }
  });
  assert(q03Full.score === 3, `TEST-06a: Q03 full answers receive 3 pts (got ${q03Full.score})`);
  assert(q03Part1Only.score >= 1.5, `TEST-06b: Q03 part 1 correct receives at least 1.5 pt (got ${q03Part1Only.score})`);

  // TEST-07: Q04 - T2, C1 (MaxScore 3) -> Matching (1 pt per pair)
  const q04 = m3Config?.questions.find(q => q.questionId === 'q04_m3')!;
  const q04Full = ScoringEngine.evaluateQuestionAnswer(q04, {
    matchedPairs: [
      { itemId: 'm3_q4_pair1', matchedTarget: 'การนอนส่งผลต่อ Growth Hormone และการเรียนรู้ของวัยรุ่น' },
      { itemId: 'm3_q4_pair2', matchedTarget: 'ระบบนาฬิกาชีวภาพต้องการเวลาพักผ่อนที่สม่ำเสมอ' },
      { itemId: 'm3_q4_pair3', matchedTarget: 'คุณภาพและความต่อเนื่องของการนอนสำคัญไม่แพ้จำนวนชั่วโมง' }
    ]
  });
  const q04Partial = ScoringEngine.evaluateQuestionAnswer(q04, {
    matchedPairs: [
      { itemId: 'm3_q4_pair1', matchedTarget: 'การนอนส่งผลต่อ Growth Hormone และการเรียนรู้ของวัยรุ่น' },
      { itemId: 'm3_q4_pair2', matchedTarget: 'ระบบนาฬิกาชีวภาพต้องการเวลาพักผ่อนที่สม่ำเสมอ' },
      { itemId: 'm3_q4_pair3', matchedTarget: 'wrong' }
    ]
  });
  assert(q04Full.score === 3, `TEST-07a: Q04 3 pairs matched receives 3 pts (got ${q04Full.score})`);
  assert(q04Partial.score === 2, `TEST-07b: Q04 2 pairs matched receives 2 pts (got ${q04Partial.score})`);

  // TEST-08: Q05 - C2 (MaxScore 2) -> Single Choice -> Ans: A
  const q05 = m3Config?.questions.find(q => q.questionId === 'q05_m3')!;
  const q05Correct = ScoringEngine.evaluateQuestionAnswer(q05, { selectedOptionId: 'opt_m3_q5_a' });
  const q05Wrong = ScoringEngine.evaluateQuestionAnswer(q05, { selectedOptionId: 'opt_m3_q5_c' });
  assert(q05Correct.score === 2, `TEST-08a: Q05 correct answer receives 2 pts (got ${q05Correct.score})`);
  assert(q05Wrong.score === 0, `TEST-08b: Q05 wrong answer receives 0 pts (got ${q05Wrong.score})`);

  // TEST-09: Q06 - C3 (MaxScore 2) -> Single Choice -> Ans: B
  const q06 = m3Config?.questions.find(q => q.questionId === 'q06_m3')!;
  const q06Correct = ScoringEngine.evaluateQuestionAnswer(q06, { selectedOptionId: 'opt_m3_q6_b' });
  assert(q06Correct.score === 2, `TEST-09: Q06 correct answer receives 2 pts (got ${q06Correct.score})`);

  // TEST-10: Q07 - C3, C4 (MaxScore 3) -> Multi-Select (Choose 2: A, B)
  const q07 = m3Config?.questions.find(q => q.questionId === 'q07_m3')!;
  const q07Full = ScoringEngine.evaluateQuestionAnswer(q07, { selectedOptionIds: ['opt_m3_q7_a', 'opt_m3_q7_b'] });
  const q07Partial = ScoringEngine.evaluateQuestionAnswer(q07, { selectedOptionIds: ['opt_m3_q7_a'] });
  assert(q07Full.score === 3, `TEST-10a: Q07 full selection receives 3 pts (got ${q07Full.score})`);
  assert(q07Partial.score >= 1.5, `TEST-10b: Q07 partial selection receives at least 1.5 pts (got ${q07Partial.score})`);

  // TEST-11: Q08 - S2, S1 (MaxScore 3: 1 + 2) -> Multi-step / Revision Select
  const q08 = m3Config?.questions.find(q => q.questionId === 'q08_m3')!;
  const q08Full = ScoringEngine.evaluateQuestionAnswer(q08, {
    multiStepAnswers: {
      q08_a: 'opt_m3_q8_a1',
      q08_b: 'opt_m3_q8_b1'
    }
  });
  assert(q08Full.score === 3, `TEST-11: Q08 full multi-step answers receive 3 pts (got ${q08Full.score})`);

  // TEST-12: Q09 - E1 (MaxScore 3) -> Multi-Select (Choose 2: A, B)
  const q09 = m3Config?.questions.find(q => q.questionId === 'q09_m3')!;
  const q09Full = ScoringEngine.evaluateQuestionAnswer(q09, { selectedOptionIds: ['opt_m3_q9_a', 'opt_m3_q9_b'] });
  const q09Partial = ScoringEngine.evaluateQuestionAnswer(q09, { selectedOptionIds: ['opt_m3_q9_a'] });
  assert(q09Full.score === 3, `TEST-12a: Q09 full selection receives 3 pts (got ${q09Full.score})`);
  assert(q09Partial.score >= 1.5, `TEST-12b: Q09 partial selection receives at least 1.5 pts (got ${q09Partial.score})`);

  // TEST-13: Q10 - E2 (MaxScore 2) -> Single Choice -> Ans: B
  const q10 = m3Config?.questions.find(q => q.questionId === 'q10_m3')!;
  const q10Correct = ScoringEngine.evaluateQuestionAnswer(q10, { selectedOptionId: 'opt_m3_q10_b' });
  assert(q10Correct.score === 2, `TEST-13: Q10 correct answer receives 2 pts (got ${q10Correct.score})`);

  // TEST-14: Q11 - E3 (MaxScore 2) -> Single Choice -> Ans: C
  const q11 = m3Config?.questions.find(q => q.questionId === 'q11_m3')!;
  const q11Correct = ScoringEngine.evaluateQuestionAnswer(q11, { selectedOptionId: 'opt_m3_q11_c' });
  assert(q11Correct.score === 2, `TEST-14: Q11 correct answer receives 2 pts (got ${q11Correct.score})`);

  // TEST-15: Q12 - E4 (MaxScore 2) -> Single Choice -> Ans: C
  const q12 = m3Config?.questions.find(q => q.questionId === 'q12_m3')!;
  const q12Correct = ScoringEngine.evaluateQuestionAnswer(q12, { selectedOptionId: 'opt_m3_q12_c' });
  assert(q12Correct.score === 2, `TEST-15: Q12 correct answer receives 2 pts (got ${q12Correct.score})`);

  // TEST-16: Q13 - G1 (MaxScore 2) -> Single Choice -> Ans: C
  const q13 = m3Config?.questions.find(q => q.questionId === 'q13_m3')!;
  const q13Correct = ScoringEngine.evaluateQuestionAnswer(q13, { selectedOptionId: 'opt_m3_q13_c' });
  assert(q13Correct.score === 2, `TEST-16: Q13 correct answer receives 2 pts (got ${q13Correct.score})`);

  // TEST-17: Q14 - S3, G2, S4 (MaxScore 3: 2 + 1) -> Multi-step / Revision Select
  const q14 = m3Config?.questions.find(q => q.questionId === 'q14_m3')!;
  const q14Full = ScoringEngine.evaluateQuestionAnswer(q14, {
    multiStepAnswers: {
      q14_a: 'opt_m3_q14_a1',
      q14_b: 'opt_m3_q14_b2'
    }
  });
  assert(q14Full.score === 3, `TEST-17: Q14 full multi-step answers receive 3 pts (got ${q14Full.score})`);

  // TEST-18: Q15 - G3 (MaxScore 2) -> Single Choice -> Ans: C
  const q15 = m3Config?.questions.find(q => q.questionId === 'q15_m3')!;
  const q15Correct = ScoringEngine.evaluateQuestionAnswer(q15, { selectedOptionId: 'opt_m3_q15_c' });
  assert(q15Correct.score === 2, `TEST-18: Q15 correct answer receives 2 pts (got ${q15Correct.score})`);

  // TEST-19: Q16 - E4, G4 (MaxScore 4: 1+1+1+1) -> 4 Steps
  const q16 = m3Config?.questions.find(q => q.questionId === 'q16_m3')!;
  const q16Full = ScoringEngine.evaluateQuestionAnswer(q16, {
    multiStepAnswers: {
      q16_a: 'opt_m3_q16_a2',
      q16_b: 'opt_m3_q16_b1',
      q16_c: 'opt_m3_q16_c2',
      q16_d: 'opt_m3_q16_d1'
    }
  });
  const q16Partial = ScoringEngine.evaluateQuestionAnswer(q16, {
    multiStepAnswers: {
      q16_a: 'opt_m3_q16_a2',
      q16_b: 'opt_m3_q16_b1',
      q16_c: 'opt_m3_q16_c1',
      q16_d: 'opt_m3_q16_d2'
    }
  });
  assert(q16Full.score === 4, `TEST-19a: Q16 all 4 steps correct receive 4 pts (got ${q16Full.score})`);
  assert(q16Partial.score === 2, `TEST-19b: Q16 2 steps correct receive 2 pts (got ${q16Partial.score})`);

  // TEST-20: Perfect Run Total Calculation (Sum = 40)
  const allMaxScores = m3Config?.questions.reduce((sum, q) => sum + q.maxScore, 0);
  assert(allMaxScores === 40, `TEST-20: Total max score of all 16 questions equals 40 (got ${allMaxScores})`);

  // TEST-21: Mission 1 & 2 configs compatibility & integrity
  const m1Config = MissionRegistry.getMissionConfig('m1');
  assert(!!m1Config, 'TEST-21a: Mission 1 is still registered and intact');
  assert(m1Config?.questions.length === 16, 'TEST-21b: Mission 1 questions length is 16');
  assert(m1Config?.totalScore === 40, 'TEST-21c: Mission 1 total score is 40');

  const m2ConfigIntact = MissionRegistry.getMissionConfig('m2');
  assert(!!m2ConfigIntact, 'TEST-21d: Mission 2 is still registered and intact');
  assert(m2ConfigIntact?.questions.length === 16, 'TEST-21e: Mission 2 questions length is 16');
  assert(m2ConfigIntact?.totalScore === 40, 'TEST-21f: Mission 2 total score is 40');

  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  return { passed, failed, results };
}

// Self-executing runner for tsx execution
if (typeof process !== 'undefined' && Array.isArray(process.argv) && process.argv[1]?.includes('mission3.test')) {
  const { passed, failed, results } = runMission3TestSuite();
  console.log(`\n========================================`);
  console.log(`   SOURCE DETECTIVE - MISSION 3 TESTS   `);
  console.log(`========================================`);
  results.forEach((r, idx) => {
    console.log(`${r.success ? '✅' : '❌'} [${idx + 1}] ${r.name} ${r.error ? `-> Error: ${r.error}` : ''}`);
  });
  console.log(`========================================`);
  console.log(`TOTAL: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log(`========================================\n`);
  if (failed > 0) {
    process.exit(1);
  }
}
