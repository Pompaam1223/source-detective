import { MissionRegistry } from '../engine/MissionRegistry';
import { ScoringEngine } from '../engine/ScoringEngine';
import { MISSION_004_CONFIG } from '../data/configs/mission4Config';
import { MISSION_003_CONFIG } from '../data/configs/mission3Config';
import { MISSION_002_CONFIG } from '../data/configs/mission2Config';
import { MISSION_001_CONFIG } from '../data/configs/mission1Config';
import { MISSION_4_SOURCE_CARDS, getSourceCardById } from '../data/sourceCards';
import { MISSION_4_QUESTIONS } from '../data/mission4Questions';
import { MISSIONS_DATA } from '../data/missions';

export function runMission4TestSuite(): { passed: number; failed: number; results: { name: string; success: boolean; error?: string }[] } {
  const results: { name: string; success: boolean; error?: string }[] = [];

  function assert(condition: boolean, testName: string, errorMsg?: string) {
    if (condition) {
      results.push({ name: testName, success: true });
    } else {
      results.push({ name: testName, success: false, error: errorMsg || 'Assertion failed' });
    }
  }

  // TEST-01: Mission 4 Registry & Configuration
  const m4Config = MissionRegistry.getMissionConfig('m4');
  assert(!!m4Config, 'TEST-01a: Mission 4 is registered in MissionRegistry');
  assert(m4Config?.questions.length === 16, `TEST-01b: Mission 4 has 16 questions (found ${m4Config?.questions.length})`);
  assert(m4Config?.totalScore === 40, `TEST-01c: Mission 4 total score is 40 (found ${m4Config?.totalScore})`);
  assert(m4Config?.caseCode === 'M4-001', `TEST-01d: Mission 4 case code is M4-001 (found ${m4Config?.caseCode})`);
  assert(m4Config?.stages.length === 4, `TEST-01e: Mission 4 has 4 stages (found ${m4Config?.stages.length})`);

  // TEST-02: MISSIONS_DATA metadata
  const m4Meta = MISSIONS_DATA.find(m => m.missionId === 'm4');
  assert(!!m4Meta, 'TEST-02a: Mission 4 metadata exists in MISSIONS_DATA');
  assert(m4Meta?.caseCode === 'M4-001', `TEST-02b: Mission 4 case code is M4-001 (found ${m4Meta?.caseCode})`);
  assert(m4Meta?.totalQuestionsCount === 16, `TEST-02c: Mission 4 questions count in metadata is 16 (found ${m4Meta?.totalQuestionsCount})`);

  // TEST-03: 10 Source Cards (SC-M4-01 to SC-M4-10)
  assert(m4Config?.sourceCards.length === 10, `TEST-03a: Mission 4 has 10 source cards (found ${m4Config?.sourceCards.length})`);
  const expectedCardIds = [
    'SC-M4-01', 'SC-M4-02', 'SC-M4-03', 'SC-M4-04', 'SC-M4-05',
    'SC-M4-06', 'SC-M4-07', 'SC-M4-08', 'SC-M4-09', 'SC-M4-10'
  ];
  expectedCardIds.forEach(id => {
    const card = getSourceCardById(id);
    assert(!!card, `TEST-03b: Card ${id} exists in repository`);
    if (card?.isSimulated) {
      assert(card.sourceType.includes('สถานการณ์จำลองเพื่อการเรียนรู้'), `TEST-03c: Simulated card ${id} has clear simulation label`);
    }
  });

  // TEST-04: Indicator Mapping (20 indicators)
  const indicatorSet = new Set<string>();
  m4Config?.questions.forEach(q => {
    indicatorSet.add(q.indicatorId);
    if (q.indicatorIds) {
      q.indicatorIds.forEach(id => indicatorSet.add(id));
    }
  });
  assert(indicatorSet.has('T1') && indicatorSet.has('T2') && indicatorSet.has('T3') && indicatorSet.has('T4'), 'TEST-04a: Covers THINK domain (T1-T4)');
  assert(indicatorSet.has('C1') && indicatorSet.has('C2') && indicatorSet.has('C3') && indicatorSet.has('C4'), 'TEST-04b: Covers CHECK domain (C1-C4)');
  assert(indicatorSet.has('S1') && indicatorSet.has('S2') && indicatorSet.has('S3') && indicatorSet.has('S4'), 'TEST-04c: Covers SOLVE domain (S1-S4)');
  assert(indicatorSet.has('E1') && indicatorSet.has('E2') && indicatorSet.has('E3') && indicatorSet.has('E4'), 'TEST-04d: Covers EXPLAIN domain (E1-E4)');
  assert(indicatorSet.has('G1') && indicatorSet.has('G2') && indicatorSet.has('G3') && indicatorSet.has('G4'), 'TEST-04e: Covers GROW domain (G1-G4)');

  // TEST-05: Questions per-item max score verification
  const expectedScores: Record<string, number> = {
    q01_m4: 2, q02_m4: 2, q03_m4: 3, q04_m4: 3,
    q05_m4: 2, q06_m4: 2, q07_m4: 3, q08_m4: 3,
    q09_m4: 2, q10_m4: 3, q11_m4: 2, q12_m4: 3,
    q13_m4: 2, q14_m4: 3, q15_m4: 2, q16_m4: 3
  };
  m4Config?.questions.forEach(q => {
    assert(q.maxScore === expectedScores[q.questionId], `TEST-05: Question ${q.questionId} has maxScore ${expectedScores[q.questionId]} (got ${q.maxScore})`);
  });

  // TEST-06: Stage Point Balances (4 stages, 10 points each)
  m4Config?.stages.forEach(st => {
    const stQuestions = m4Config.questions.filter(q => st.questionIds.includes(q.questionId));
    const stScore = stQuestions.reduce((sum, q) => sum + (q.maxScore || 0), 0);
    assert(stScore === 10, `TEST-06: Stage ${st.stageId} has 10 points (got ${stScore})`);
  });

  // TEST-07: Q01 Evaluation (EXACT 2 pts)
  const q01 = m4Config?.questions.find(q => q.questionId === 'q01_m4')!;
  const q01Correct = ScoringEngine.evaluateQuestionAnswer(q01, { selectedOptionId: 'opt_m4_q1_b' });
  const q01Wrong = ScoringEngine.evaluateQuestionAnswer(q01, { selectedOptionId: 'opt_m4_q1_a' });
  assert(q01Correct.score === 2, `TEST-07a: Q01 correct gives 2 pts (got ${q01Correct.score})`);
  assert(q01Wrong.score === 0, `TEST-07b: Q01 wrong gives 0 pts (got ${q01Wrong.score})`);

  // TEST-08: Q03 Evaluation (MULTI_SELECT 3 pts: A+B=3, 1 correct=1.5, wrong=0)
  const q03 = m4Config?.questions.find(q => q.questionId === 'q03_m4')!;
  const q03Full = ScoringEngine.evaluateQuestionAnswer(q03, { selectedOptionIds: ['opt_m4_q3_a', 'opt_m4_q3_b'] });
  const q03PartialA = ScoringEngine.evaluateQuestionAnswer(q03, { selectedOptionIds: ['opt_m4_q3_a'] });
  const q03PartialB = ScoringEngine.evaluateQuestionAnswer(q03, { selectedOptionIds: ['opt_m4_q3_b'] });
  const q03Wrong = ScoringEngine.evaluateQuestionAnswer(q03, { selectedOptionIds: ['opt_m4_q3_c'] });
  assert(q03Full.score === 3, `TEST-08a: Q03 full gives 3 pts (got ${q03Full.score})`);
  assert(q03PartialA.score === 1.5, `TEST-08b: Q03 partial A gives 1.5 pts (got ${q03PartialA.score})`);
  assert(q03PartialB.score === 1.5, `TEST-08c: Q03 partial B gives 1.5 pts (got ${q03PartialB.score})`);
  assert(q03Wrong.score === 0, `TEST-08d: Q03 wrong gives 0 pts (got ${q03Wrong.score})`);

  // TEST-09: Q04 Evaluation (MATCHING 3 pts: 1 pt per pair)
  const q04 = m4Config?.questions.find(q => q.questionId === 'q04_m4')!;
  const q04Full = ScoringEngine.evaluateQuestionAnswer(q04, {
    matchedPairs: [
      { itemId: 'm4_q4_pair1', matchedTarget: '1. ตรวจเพิ่ม' },
      { itemId: 'm4_q4_pair2', matchedTarget: '2. ตรวจแหล่งนั้น' },
      { itemId: 'm4_q4_pair3', matchedTarget: '3. ยังไม่สรุปแทนทุกคน' }
    ]
  });
  const q04Two = ScoringEngine.evaluateQuestionAnswer(q04, {
    matchedPairs: [
      { itemId: 'm4_q4_pair1', matchedTarget: '1. ตรวจเพิ่ม' },
      { itemId: 'm4_q4_pair2', matchedTarget: '2. ตรวจแหล่งนั้น' },
      { itemId: 'm4_q4_pair3', matchedTarget: '1. ตรวจเพิ่ม' }
    ]
  });
  assert(q04Full.score === 3, `TEST-09a: Q04 3 pairs give 3 pts (got ${q04Full.score})`);
  assert(q04Two.score === 2, `TEST-09b: Q04 2 pairs give 2 pts (got ${q04Two.score})`);

  // TEST-10: Q08 Evaluation (REVISION_SELECT 2-step 3 pts: Part A=1.5, Part B=1.5)
  const q08 = m4Config?.questions.find(q => q.questionId === 'q08_m4')!;
  const q08Full = ScoringEngine.evaluateQuestionAnswer(q08, {
    multiStepAnswers: {
      q08_a: 'opt_m4_q8_a1',
      q08_b: 'opt_m4_q8_b1'
    }
  });
  const q08Half = ScoringEngine.evaluateQuestionAnswer(q08, {
    multiStepAnswers: {
      q08_a: 'opt_m4_q8_a1',
      q08_b: 'opt_m4_q8_b2'
    }
  });
  assert(q08Full.score === 3, `TEST-10a: Q08 both steps give 3 pts (got ${q08Full.score})`);
  assert(q08Half.score === 1.5, `TEST-10b: Q08 one step gives 1.5 pts (got ${q08Half.score})`);

  // TEST-11: Q10 Evaluation (ORDERING 3 pts: 0.75 per position)
  const q10 = m4Config?.questions.find(q => q.questionId === 'q10_m4')!;
  const q10Full = ScoringEngine.evaluateQuestionAnswer(q10, {
    orderedItemIds: ['m4_q10_item2', 'm4_q10_item3', 'm4_q10_item1', 'm4_q10_item4']
  });
  const q10Two = ScoringEngine.evaluateQuestionAnswer(q10, {
    orderedItemIds: ['m4_q10_item2', 'm4_q10_item3', 'm4_q10_item4', 'm4_q10_item1']
  });
  assert(q10Full.score === 3, `TEST-11a: Q10 4 positions give 3 pts (got ${q10Full.score})`);
  assert(q10Two.score === 1.5, `TEST-11b: Q10 2 positions give 1.5 pts (got ${q10Two.score})`);

  // TEST-12: Q14 Evaluation (REVISION_SELECT 2-step 3 pts)
  const q14 = m4Config?.questions.find(q => q.questionId === 'q14_m4')!;
  const q14Full = ScoringEngine.evaluateQuestionAnswer(q14, {
    multiStepAnswers: {
      q14_a: 'opt_m4_q14_a3',
      q14_b: 'opt_m4_q14_b1'
    }
  });
  const q14Half = ScoringEngine.evaluateQuestionAnswer(q14, {
    multiStepAnswers: {
      q14_a: 'opt_m4_q14_a1',
      q14_b: 'opt_m4_q14_b1'
    }
  });
  assert(q14Full.score === 3, `TEST-12a: Q14 both steps give 3 pts (got ${q14Full.score})`);
  assert(q14Half.score === 1.5, `TEST-12b: Q14 one step gives 1.5 pts (got ${q14Half.score})`);

  // TEST-13: Q16 Evaluation (ORDERING 3 pts: 1->2->3)
  const q16 = m4Config?.questions.find(q => q.questionId === 'q16_m4')!;
  const q16Full = ScoringEngine.evaluateQuestionAnswer(q16, {
    orderedItemIds: ['m4_q16_item1', 'm4_q16_item2', 'm4_q16_item3']
  });
  const q16Two = ScoringEngine.evaluateQuestionAnswer(q16, {
    orderedItemIds: ['m4_q16_item1', 'm4_q16_item2', 'm4_q16_item1']
  });
  assert(q16Full.score === 3, `TEST-13a: Q16 3 items give 3 pts (got ${q16Full.score})`);
  assert(q16Two.score === 2, `TEST-13b: Q16 2 items give 2 pts (got ${q16Two.score})`);

  // TEST-14: Backward compatibility of Mission 1, 2, 3 configs
  assert(!!MISSION_001_CONFIG, 'TEST-14a: Mission 1 config is intact');
  assert(!!MISSION_002_CONFIG, 'TEST-14b: Mission 2 config is intact');
  assert(!!MISSION_003_CONFIG, 'TEST-14c: Mission 3 config is intact');

  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  return { passed, failed, results };
}
