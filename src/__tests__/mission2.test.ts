import { MissionRegistry } from '../engine/MissionRegistry';
import { ScoringEngine } from '../engine/ScoringEngine';
import { MISSION_002_CONFIG } from '../data/configs/mission2Config';
import { MISSION_001_CONFIG } from '../data/configs/mission1Config';
import { MISSION_2_SOURCE_CARDS, getSourceCardById } from '../data/sourceCards';
import { MISSION_2_QUESTIONS } from '../data/mission2Questions';
import { StudentAnswerValue, QuestionAttempt } from '../types';

export function runMission2TestSuite(): { passed: number; failed: number; results: { name: string; success: boolean; error?: string }[] } {
  const results: { name: string; success: boolean; error?: string }[] = [];

  function assert(condition: boolean, testName: string, errorMsg?: string) {
    if (condition) {
      results.push({ name: testName, success: true });
    } else {
      results.push({ name: testName, success: false, error: errorMsg || 'Assertion failed' });
    }
  }

  // TEST-01: Mission 2 Registry & Configuration
  const m1Config = MissionRegistry.getMissionConfig('m1');
  const m2Config = MissionRegistry.getMissionConfig('m2');
  assert(!!m2Config, 'TEST-01a: Mission 2 is registered in MissionRegistry');
  assert(m2Config?.questions.length === 16, `TEST-01b: Mission 2 has 16 questions (found ${m2Config?.questions.length})`);
  assert(m2Config?.totalScore === 40, `TEST-01c: Mission 2 total score is 40 (found ${m2Config?.totalScore})`);
  assert(m2Config?.caseCode === 'M2-001', `TEST-01d: Mission 2 case code is M2-001 (found ${m2Config?.caseCode})`);
  assert(m1Config?.missionTitle !== m2Config?.missionTitle, 'TEST-01e: Mission 1 and Mission 2 titles are distinct');
  assert(m2Config?.missionTitle.includes('หลักฐานบอกอะไร?'), 'TEST-01f: Mission 2 title is "หลักฐานบอกอะไร?"');
  assert(m1Config?.missionTitle.includes('ใครพูด? เชื่อได้แค่ไหน?'), 'TEST-01g: Mission 1 title is "ใครพูด? เชื่อได้แค่ไหน?"');

  // TEST-02: 10 Source Cards (SC-M2-01 to SC-M2-10)
  assert(m2Config?.sourceCards.length === 10, `TEST-02a: Mission 2 has 10 source cards (found ${m2Config?.sourceCards.length})`);
  const expectedCardIds = [
    'SC-M2-01', 'SC-M2-02', 'SC-M2-03', 'SC-M2-04', 'SC-M2-05',
    'SC-M2-06', 'SC-M2-07', 'SC-M2-08', 'SC-M2-09', 'SC-M2-10'
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
  m2Config?.questions.forEach(q => {
    indicatorSet.add(q.indicatorId);
    if (q.indicatorIds) {
      q.indicatorIds.forEach(id => indicatorSet.add(id));
    }
  });
  assert(indicatorSet.has('T1') && indicatorSet.has('T2') && indicatorSet.has('T3') && indicatorSet.has('T4'), 'TEST-03a: Covers THINK domain (T1-T4)');
  assert(indicatorSet.has('C1') && indicatorSet.has('C2') && indicatorSet.has('C3') && indicatorSet.has('C4'), 'TEST-03b: Covers CHECK domain (C1-C4)');
  assert(indicatorSet.has('S1') && indicatorSet.has('S2') && indicatorSet.has('S3'), 'TEST-03c: Covers SOLVE domain (S1-S3)');
  assert(indicatorSet.has('E2') && indicatorSet.has('E3') && indicatorSet.has('E4'), 'TEST-03d: Covers EXPLAIN domain (E2-E4)');
  assert(indicatorSet.has('G1') && indicatorSet.has('G2') && indicatorSet.has('G3') && indicatorSet.has('G4'), 'TEST-03e: Covers GROW domain (G1-G4)');

  // TEST-04: Q01 - CDC Publisher (T1) -> Exact 2 pts
  const q01 = m2Config?.questions.find(q => q.questionId === 'q01_m2')!;
  const q01Correct = ScoringEngine.evaluateQuestionAnswer(q01, { selectedOptionId: 'opt_m2_q1_b' });
  const q01Wrong = ScoringEngine.evaluateQuestionAnswer(q01, { selectedOptionId: 'opt_m2_q1_a' });
  assert(q01Correct.score === 2, `TEST-04a: Q01 correct answer receives 2 pts (got ${q01Correct.score})`);
  assert(q01Wrong.score === 0, `TEST-04b: Q01 wrong answer receives 0 pts (got ${q01Wrong.score})`);

  // TEST-05: Q02 - Ramathibodi Source (C1) -> Exact 2 pts
  const q02 = m2Config?.questions.find(q => q.questionId === 'q02_m2')!;
  const q02Correct = ScoringEngine.evaluateQuestionAnswer(q02, { selectedOptionId: 'opt_m2_q2_c' });
  const q02Wrong = ScoringEngine.evaluateQuestionAnswer(q02, { selectedOptionId: 'opt_m2_q2_a' });
  assert(q02Correct.score === 2, `TEST-05a: Q02 correct answer receives 2 pts (got ${q02Correct.score})`);
  assert(q02Wrong.score === 0, `TEST-05b: Q02 wrong answer receives 0 pts (got ${q02Wrong.score})`);

  // TEST-06: Q03 - CDC vs Social Ad (C2) -> Exact 2 pts
  const q03 = m2Config?.questions.find(q => q.questionId === 'q03_m2')!;
  const q03Correct = ScoringEngine.evaluateQuestionAnswer(q03, { selectedOptionId: 'opt_m2_q3_b' });
  const q03Wrong = ScoringEngine.evaluateQuestionAnswer(q03, { selectedOptionId: 'opt_m2_q3_a' });
  assert(q03Correct.score === 2, `TEST-06a: Q03 correct answer receives 2 pts (got ${q03Correct.score})`);
  assert(q03Wrong.score === 0, `TEST-06b: Q03 wrong answer receives 0 pts (got ${q03Wrong.score})`);

  // TEST-07: Q04 - Multi-select Synthesis (C3) -> Partial 3 pts
  const q04 = m2Config?.questions.find(q => q.questionId === 'q04_m2')!;
  const q04Full = ScoringEngine.evaluateQuestionAnswer(q04, { selectedOptionIds: ['opt_m2_q4_a', 'opt_m2_q4_b'] });
  const q04Partial = ScoringEngine.evaluateQuestionAnswer(q04, { selectedOptionIds: ['opt_m2_q4_a'] });
  const q04Wrong = ScoringEngine.evaluateQuestionAnswer(q04, { selectedOptionIds: ['opt_m2_q4_c'] });
  assert(q04Full.score === 3, `TEST-07a: Q04 full selection receives 3 pts (got ${q04Full.score})`);
  assert(q04Partial.score === 1.5, `TEST-07b: Q04 partial selection receives 1.5 pt (got ${q04Partial.score})`);
  assert(q04Wrong.score === 0, `TEST-07c: Q04 incorrect selection receives 0 pts (got ${q04Wrong.score})`);

  // TEST-08: Q05 - Matching Source Reliability (C2) -> Partial 3 pts
  const q05 = m2Config?.questions.find(q => q.questionId === 'q05_m2')!;
  const q05Full = ScoringEngine.evaluateQuestionAnswer(q05, {
    matchedPairs: [
      { itemId: 'pair_m2_a', matchedTarget: 'ความน่าเชื่อถือสูงมาก (หน่วยงานทางการแพทย์/สาธารณสุขระดับสากล)' },
      { itemId: 'pair_m2_b', matchedTarget: 'ความน่าเชื่อถือต่ำ/มีความเสี่ยง (สื่อโฆษณาเพื่อการค้า มีผลประโยชน์แอบแฝง)' },
      { itemId: 'pair_m2_c', matchedTarget: 'เป็นเพียงความคิดเห็นส่วนบุคคล (ยังไม่ถือเป็นหลักฐานเชิงประจักษ์)' }
    ]
  });
  const q05Partial = ScoringEngine.evaluateQuestionAnswer(q05, {
    matchedPairs: [
      { itemId: 'pair_m2_a', matchedTarget: 'ความน่าเชื่อถือสูงมาก (หน่วยงานทางการแพทย์/สาธารณสุขระดับสากล)' },
      { itemId: 'pair_m2_b', matchedTarget: 'ความน่าเชื่อถือต่ำ/มีความเสี่ยง (สื่อโฆษณาเพื่อการค้า มีผลประโยชน์แอบแฝง)' },
      { itemId: 'pair_m2_c', matchedTarget: 'wrong' }
    ]
  });
  assert(q05Full.score === 3, `TEST-08a: Q05 full matching receives 3 pts (got ${q05Full.score})`);
  assert(q05Partial.score === 2, `TEST-08b: Q05 2 pairs matching receives 2 pts (got ${q05Partial.score})`);

  // TEST-09: Q06 - Opinion vs Fact (T3) -> Exact 2 pts
  const q06 = m2Config?.questions.find(q => q.questionId === 'q06_m2')!;
  const q06Correct = ScoringEngine.evaluateQuestionAnswer(q06, { selectedOptionId: 'opt_m2_q6_b' });
  assert(q06Correct.score === 2, `TEST-09: Q06 correct answer receives 2 pts (got ${q06Correct.score})`);

  // TEST-10: Q07 - Primary Evidence Selection (T2, C2) -> Partial 3 pts
  const q07 = m2Config?.questions.find(q => q.questionId === 'q07_m2')!;
  const q07Full = ScoringEngine.evaluateQuestionAnswer(q07, { selectedOptionIds: ['opt_m2_q7_a', 'opt_m2_q7_b'] });
  const q07Partial = ScoringEngine.evaluateQuestionAnswer(q07, { selectedOptionIds: ['opt_m2_q7_a'] });
  assert(q07Full.score === 3, `TEST-10a: Q07 full selection receives 3 pts (got ${q07Full.score})`);
  assert(q07Partial.score === 1.5, `TEST-10b: Q07 partial selection receives 1.5 pts (got ${q07Partial.score})`);

  // TEST-11: Q08 - Investigation Step Ordering (S1) -> Partial 3 pts
  const q08 = m2Config?.questions.find(q => q.questionId === 'q08_m2')!;
  const q08Full = ScoringEngine.evaluateQuestionAnswer(q08, {
    orderedItemIds: ['ord_m2_step2', 'ord_m2_step3', 'ord_m2_step4', 'ord_m2_step1']
  });
  assert(q08Full.score === 3, `TEST-11: Q08 correct ordering (2->3->4->1) receives 3 pts (got ${q08Full.score})`);

  // TEST-12: Q09 - Detecting Commercial Interest (C4) -> Exact 2 pts
  const q09 = m2Config?.questions.find(q => q.questionId === 'q09_m2')!;
  const q09Correct = ScoringEngine.evaluateQuestionAnswer(q09, { selectedOptionId: 'opt_m2_q9_b' });
  assert(q09Correct.score === 2, `TEST-12: Q09 correct answer receives 2 pts (got ${q09Correct.score})`);

  // TEST-13: Q10 - Multi-select Verification Strategy (C3, S2) -> Partial 3 pts
  const q10 = m2Config?.questions.find(q => q.questionId === 'q10_m2')!;
  const q10Full = ScoringEngine.evaluateQuestionAnswer(q10, { selectedOptionIds: ['opt_m2_q10_a', 'opt_m2_q10_b', 'opt_m2_q10_c'] });
  const q10Partial = ScoringEngine.evaluateQuestionAnswer(q10, { selectedOptionIds: ['opt_m2_q10_a', 'opt_m2_q10_b'] });
  assert(q10Full.score === 3, `TEST-13a: Q10 full selection receives 3 pts (got ${q10Full.score})`);
  assert(q10Partial.score === 2, `TEST-13b: Q10 partial 2 selection receives 2 pts (got ${q10Partial.score})`);

  // TEST-14: Q11 - Correlation vs Causation (C2, C4) -> Exact 2 pts
  const q11 = m2Config?.questions.find(q => q.questionId === 'q11_m2')!;
  const q11Correct = ScoringEngine.evaluateQuestionAnswer(q11, { selectedOptionId: 'opt_m2_q11_b' });
  assert(q11Correct.score === 2, `TEST-14: Q11 correct answer receives 2 pts (got ${q11Correct.score})`);

  // TEST-15: Q12 - Time Context Evaluation (T4, E2) -> Exact 2 pts
  const q12 = m2Config?.questions.find(q => q.questionId === 'q12_m2')!;
  const q12Correct = ScoringEngine.evaluateQuestionAnswer(q12, { selectedOptionId: 'opt_m2_q12_c' });
  assert(q12Correct.score === 2, `TEST-15: Q12 correct answer receives 2 pts (got ${q12Correct.score})`);

  // TEST-16: Q13 - Growth Mindset & Cognitive Reflection (G1) -> Exact 2 pts
  const q13 = m2Config?.questions.find(q => q.questionId === 'q13_m2')!;
  const q13Correct = ScoringEngine.evaluateQuestionAnswer(q13, { selectedOptionId: 'opt_m2_q13_b' });
  assert(q13Correct.score === 2, `TEST-16: Q13 correct answer receives 2 pts (got ${q13Correct.score})`);

  // TEST-17: Q14 - Evidence Selection for Communication (S3, E3) -> Partial 3 pts
  const q14 = m2Config?.questions.find(q => q.questionId === 'q14_m2')!;
  const q14Full = ScoringEngine.evaluateQuestionAnswer(q14, { selectedOptionIds: ['opt_m2_q14_a', 'opt_m2_q14_b', 'opt_m2_q14_c'] });
  assert(q14Full.score === 3, `TEST-17: Q14 full selection receives 3 pts (got ${q14Full.score})`);

  // TEST-18: Q15 - Perspective Revision with New Evidence (G3) -> Exact 2 pts
  const q15 = m2Config?.questions.find(q => q.questionId === 'q15_m2')!;
  const q15Correct = ScoringEngine.evaluateQuestionAnswer(q15, { selectedOptionId: 'opt_m2_q15_c' });
  assert(q15Correct.score === 2, `TEST-18: Q15 correct answer receives 2 pts (got ${q15Correct.score})`);

  // TEST-19: Q16 - Composite Decision Revision (G2, G4, E4) -> Max 4 pts
  const q16 = m2Config?.questions.find(q => q.questionId === 'q16_m2')!;
  const q16Full = ScoringEngine.evaluateQuestionAnswer(q16, {
    multiStepAnswers: {
      stepA: 'stepA_opt2',
      stepB: 'stepB_opt1',
      stepC: 'stepC_opt3'
    }
  });
  const q16Partial = ScoringEngine.evaluateQuestionAnswer(q16, {
    multiStepAnswers: {
      stepA: 'stepA_opt2',
      stepB: 'stepB_opt1',
      stepC: 'stepC_opt1'
    }
  });
  assert(q16Full.score === 4, `TEST-19a: Q16 full multi-step answers receive 4 pts (got ${q16Full.score})`);
  assert(q16Partial.score === 2, `TEST-19b: Q16 2 steps correct receive 2 pts (got ${q16Partial.score})`);

  // TEST-20: Perfect Run Total Calculation (Sum = 40)
  const allMaxScores = m2Config?.questions.reduce((sum, q) => sum + q.maxScore, 0);
  assert(allMaxScores === 40, `TEST-20: Total max score of all 16 questions equals 40 (got ${allMaxScores})`);

  // TEST-21: Mission 1 config compatibility
  assert(!!m1Config, 'TEST-21a: Mission 1 is still registered and intact');
  assert(m1Config?.questions.length === 16, 'TEST-21b: Mission 1 questions length is 16');
  assert(m1Config?.totalScore === 40, 'TEST-21c: Mission 1 total score is 40');

  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  return { passed, failed, results };
}

// Self-executing runner for tsx execution
if (typeof process !== 'undefined' && Array.isArray(process.argv) && process.argv[1]?.includes('mission2.test')) {
  const { passed, failed, results } = runMission2TestSuite();
  console.log(`\n========================================`);
  console.log(`   SOURCE DETECTIVE - MISSION 2 TESTS   `);
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
