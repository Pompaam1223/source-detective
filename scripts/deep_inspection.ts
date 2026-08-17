import * as fs from 'fs';
import * as path from 'path';

const raw = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'audit_raw_firestore_dump.json'), 'utf-8'));

console.log('==================================================');
console.log('1. ALL 10 STUDENTS & ACCOUNTS');
console.log('==================================================');

const studentsMap: Record<string, any> = {};

raw.students.forEach((s: any) => {
  studentsMap[s.studentId] = {
    studentId: s.studentId,
    nickname: s.nickname,
    avatarId: s.avatarId,
    registeredAt: s.registeredAt
  };
});

raw.student_accounts.forEach((a: any) => {
  if (studentsMap[a.studentId]) {
    studentsMap[a.studentId].username = a.username;
    studentsMap[a.studentId].role = a.role;
  }
});

raw.progress.forEach((p: any) => {
  if (studentsMap[p.studentId]) {
    studentsMap[p.studentId].progress = p;
  }
});

console.log('Found students count:', Object.keys(studentsMap).length);

console.log('\n==================================================');
console.log('2. ALL 40 MISSION RESULTS');
console.log('==================================================');
console.table(raw.mission_results.map((m: any) => ({
  studentId: m.studentId,
  missionId: m.missionId,
  score: m.score,
  maxScore: m.maxScore,
  completed: m.completed,
  attemptsCount: m.attemptsCount,
  completedAt: m.completedAt,
  timeSpentSeconds: m.timeSpentSeconds
})));

console.log('\n==================================================');
console.log('3. ALL 20 ASSESSMENTS');
console.log('==================================================');
console.table(raw.assessments.map((a: any) => ({
  studentId: a.studentId,
  type: a.type,
  score: a.score,
  maxScore: a.maxScore,
  completedAt: a.completedAt,
  domainScores: JSON.stringify(a.domainScores),
  indicatorScores: JSON.stringify(a.indicatorScores),
  answers: a.answers ? a.answers.length : 0
})));

console.log('\n==================================================');
console.log('4. ALL 10 AI LOGS');
console.log('==================================================');
console.table(raw.ai_logs.map((log: any) => ({
  _docId: log._docId,
  studentId: log.studentId,
  missionId: log.missionId,
  questionId: log.questionId,
  sourceCardId: log.sourceCardId,
  aiUsed: log.aiUsed,
  aiOpenCount: log.aiOpenCount,
  aiQueryCount: log.aiQueryCount,
  aiSessionCount: log.aiSessionCount,
  timestamp: log.timestamp,
  queryCount: log.aiQueries?.length || 0
})));

console.log('\n==================================================');
console.log('5. STUDENT MASTER MATRIX (10 STUDENTS)');
console.log('==================================================');

const masterList = Object.values(studentsMap).map((st: any) => {
  const base = raw.assessments.find((a: any) => a.studentId === st.studentId && a.type === 'BASELINE');
  const post = raw.assessments.find((a: any) => a.studentId === st.studentId && a.type === 'POST_TEST');
  const m1 = raw.mission_results.find((m: any) => m.studentId === st.studentId && m.missionId === 'm1');
  const m2 = raw.mission_results.find((m: any) => m.studentId === st.studentId && m.missionId === 'm2');
  const m3 = raw.mission_results.find((m: any) => m.studentId === st.studentId && m.missionId === 'm3');
  const m4 = raw.mission_results.find((m: any) => m.studentId === st.studentId && m.missionId === 'm4');
  const aiLog = raw.ai_logs.find((l: any) => l.studentId === st.studentId);

  const baseScore = base?.score ?? null;
  const postScore = post?.score ?? null;
  const m1Score = m1?.score ?? null;
  const m2Score = m2?.score ?? null;
  const m3Score = m3?.score ?? null;
  const m4Score = m4?.score ?? null;

  const totalMissionScore = (m1Score ?? 0) + (m2Score ?? 0) + (m3Score ?? 0) + (m4Score ?? 0);
  const totalSystemScore = (baseScore ?? 0) + totalMissionScore + (postScore ?? 0);
  const recordedTotalPoints = st.progress?.totalPoints ?? null;

  let rawGain = null;
  let normalizedGain = null;

  if (baseScore !== null && postScore !== null) {
    rawGain = postScore - baseScore;
    if (40 - baseScore > 0) {
      normalizedGain = Number(((postScore - baseScore) / (40 - baseScore)).toFixed(4));
    }
  }

  return {
    studentId: st.studentId,
    alias: st.nickname,
    username: st.username,
    baselineScore: baseScore,
    m1Score,
    m2Score,
    m3Score,
    m4Score,
    postTestScore: postScore,
    totalMissionScore,
    totalSystemScore,
    recordedTotalPoints,
    scoreMatch: totalSystemScore === recordedTotalPoints,
    rawGain,
    normalizedGain,
    aiOpenCount: aiLog?.aiOpenCount ?? 0,
    aiQueryCount: aiLog?.aiQueryCount ?? 0,
    completedMissions: st.progress?.completedMissionIds?.length ?? 0
  };
});

console.table(masterList);
