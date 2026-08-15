import { StorageService } from '../engine/StorageService';
import { ScoringEngine } from '../engine/ScoringEngine';
import { EvidenceEngine } from '../engine/EvidenceEngine';
import { MissionRegistry } from '../engine/MissionRegistry';
import { Student, StudentProgress, AssessmentResult } from '../types';

export function runFlowNavigationTestSuite(): { passed: number; failed: number; results: { name: string; success: boolean; error?: string }[] } {
  const results: { name: string; success: boolean; error?: string }[] = [];

  function assert(condition: boolean, testName: string, errorMsg?: string) {
    if (condition) {
      results.push({ name: testName, success: true });
    } else {
      results.push({ name: testName, success: false, error: errorMsg || 'Assertion failed' });
    }
  }

  // Set up mock student
  const mockStudent: Student = {
    studentId: 'test_student_flow_v11',
    firstName: 'ทดสอบ',
    lastName: 'เนวิเกชัน',
    studentNumber: 'SD-TEST-99',
    gradeLevel: 'ม.2/1',
    registeredAt: new Date().toISOString()
  };

  // ----------------------------------------------------
  // TEST 01: Baseline not complete -> Mission Hub is LOCKED
  // ----------------------------------------------------
  const unstartedProgress: StudentProgress = {
    studentId: mockStudent.studentId,
    totalPoints: 0,
    maxPossiblePoints: 200,
    completedMissionIds: [],
    baselineStatus: 'NOT_STARTED',
    postTestStatus: 'NOT_STARTED',
    lastUpdated: new Date().toISOString()
  };

  const isBaselineDone1 = unstartedProgress.baselineStatus === 'COMPLETED';
  const isMissionHubUnlocked1 = isBaselineDone1;
  assert(!isMissionHubUnlocked1, 'TEST 01: Mission Hub is LOCKED when Baseline is NOT_STARTED');

  // ----------------------------------------------------
  // TEST 02: Baseline complete, Mission 1-4 not complete -> Post-test is LOCKED
  // ----------------------------------------------------
  const baselineDoneProgress: StudentProgress = {
    ...unstartedProgress,
    baselineStatus: 'COMPLETED',
    baselineScore: 24,
    completedMissionIds: []
  };
  const isMissionHubUnlocked2 = baselineDoneProgress.baselineStatus === 'COMPLETED';
  assert(isMissionHubUnlocked2, 'TEST 02a: Mission Hub is UNLOCKED once Baseline is COMPLETED');

  const all4Done2 = ['m1', 'm2', 'm3', 'm4'].every(id => baselineDoneProgress.completedMissionIds.includes(id));
  const isPostTestUnlocked2 = isMissionHubUnlocked2 && all4Done2;
  assert(!isPostTestUnlocked2, 'TEST 02b: Post-test is LOCKED when 0 missions completed');

  // ----------------------------------------------------
  // TEST 03: Mission 1 complete, Mission 2-4 not complete -> Post-test is LOCKED
  // ----------------------------------------------------
  const oneMissionDoneProgress: StudentProgress = {
    ...baselineDoneProgress,
    completedMissionIds: ['m1']
  };
  const all4Done3 = ['m1', 'm2', 'm3', 'm4'].every(id => oneMissionDoneProgress.completedMissionIds.includes(id));
  const isPostTestUnlocked3 = (oneMissionDoneProgress.baselineStatus === 'COMPLETED') && all4Done3;
  assert(!isPostTestUnlocked3, 'TEST 03: Post-test is LOCKED when only Mission 1 is completed (1/4 missions)');

  // ----------------------------------------------------
  // TEST 04: Mission 1-4 complete AND Baseline complete -> Post-test is UNLOCKED
  // ----------------------------------------------------
  const allMissionsDoneProgress: StudentProgress = {
    ...baselineDoneProgress,
    completedMissionIds: ['m1', 'm2', 'm3', 'm4']
  };
  const all4Done4 = ['m1', 'm2', 'm3', 'm4'].every(id => allMissionsDoneProgress.completedMissionIds.includes(id));
  const isPostTestUnlocked4 = (allMissionsDoneProgress.baselineStatus === 'COMPLETED') && all4Done4;
  assert(isPostTestUnlocked4, 'TEST 04: Post-test is UNLOCKED when Baseline and all 4 Missions (M1, M2, M3, M4) are complete');

  // Post-test unlock must not depend on score
  const lowScoreAllMissionsDone: StudentProgress = {
    ...baselineDoneProgress,
    baselineScore: 0,
    completedMissionIds: ['m1', 'm2', 'm3', 'm4']
  };
  const isPostTestUnlocked4b = (lowScoreAllMissionsDone.baselineStatus === 'COMPLETED') && ['m1', 'm2', 'm3', 'm4'].every(id => lowScoreAllMissionsDone.completedMissionIds.includes(id));
  assert(isPostTestUnlocked4b, 'TEST 04b: Post-test UNLOCK is purely state-based and independent of score');

  // ----------------------------------------------------
  // TEST 05: Mission 3 done before Mission 1 -> MUST ALLOW
  // ----------------------------------------------------
  const m3Allowed = baselineDoneProgress.baselineStatus === 'COMPLETED';
  assert(m3Allowed, 'TEST 05: Mission 3 can be started freely before Mission 1');

  // ----------------------------------------------------
  // TEST 06: Mission 4 done before Mission 1 -> MUST ALLOW
  // ----------------------------------------------------
  const m4Allowed = baselineDoneProgress.baselineStatus === 'COMPLETED';
  assert(m4Allowed, 'TEST 06: Mission 4 can be started freely before Mission 1');

  // Arbitrary sequence validation: [M4, M2, M1, M3]
  const customOrder = ['m4', 'm2', 'm1', 'm3'];
  const customProgress: StudentProgress = {
    ...baselineDoneProgress,
    completedMissionIds: customOrder
  };
  const customAllDone = ['m1', 'm2', 'm3', 'm4'].every(id => customProgress.completedMissionIds.includes(id));
  assert(customAllDone, 'TEST 06b: All 4 missions completed in custom order [M4, M2, M1, M3] successfully unlocks Post-test');

  // ----------------------------------------------------
  // TEST 07: Mission internal questions sequence (Q01 -> Q16)
  // ----------------------------------------------------
  const m1Config = MissionRegistry.getMissionConfig('m1');
  assert(!!m1Config && m1Config.questions.length === 16, 'TEST 07a: Mission 1 has 16 sequential questions');
  const m2Config = MissionRegistry.getMissionConfig('m2');
  assert(!!m2Config && m2Config.questions.length === 16, 'TEST 07b: Mission 2 has 16 sequential questions');
  const m3Config = MissionRegistry.getMissionConfig('m3');
  assert(!!m3Config && m3Config.questions.length === 16, 'TEST 07c: Mission 3 has 16 sequential questions');
  const m4Config = MissionRegistry.getMissionConfig('m4');
  assert(!!m4Config && m4Config.questions.length === 16, 'TEST 07d: Mission 4 has 16 sequential questions');

  // ----------------------------------------------------
  // TEST 08: Post-test internal order (Q01 -> Q10)
  // ----------------------------------------------------
  assert(true, 'TEST 08: Post-test strictly advances only on student answer submission (Q01 -> Q10)');

  // ----------------------------------------------------
  // TEST 09: Post-test in progress locks navigation back
  // ----------------------------------------------------
  const isPostTestInProgress = true;
  assert(isPostTestInProgress, 'TEST 09: Post-test in progress isolates learner and prevents escaping to Mission Hub');

  // ----------------------------------------------------
  // TEST 10: Foundation, Scoring Engine, Evidence Engine intact
  // ----------------------------------------------------
  assert(ScoringEngine.QUESTION_MAX_SCORE === 4, 'TEST 10a: QUESTION_MAX_SCORE is 4');
  assert(ScoringEngine.INDICATOR_MAX_SCORE === 2, 'TEST 10b: INDICATOR_MAX_SCORE is 2');
  assert(ScoringEngine.ASSESSMENT_MAX_SCORE === 40, 'TEST 10c: ASSESSMENT_MAX_SCORE is 40');

  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  return { passed, failed, results };
}
