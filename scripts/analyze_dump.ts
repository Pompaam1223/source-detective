import * as fs from 'fs';
import * as path from 'path';

const raw = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'audit_raw_firestore_dump.json'), 'utf-8'));

console.log('=== 1. STUDENTS DETAILS ===');
console.table(raw.students.map((s: any) => ({
  studentId: s.studentId,
  nickname: s.nickname,
  avatarId: s.avatarId,
  registeredAt: s.registeredAt
})));

console.log('\n=== 2. STUDENT ACCOUNTS ===');
console.table(raw.student_accounts.map((a: any) => ({
  studentId: a.studentId,
  username: a.username,
  role: a.role
})));

console.log('\n=== 3. PROGRESS DETAILS ===');
console.table(raw.progress.map((p: any) => ({
  studentId: p.studentId,
  totalPoints: p.totalPoints,
  baselineStatus: p.baselineStatus,
  postTestStatus: p.postTestStatus,
  completedMissions: p.completedMissionIds?.join(', ')
})));

console.log('\n=== 4. ASSESSMENTS DETAILS ===');
console.table(raw.assessments.map((a: any) => ({
  studentId: a.studentId,
  type: a.type,
  score: a.score,
  maxScore: a.maxScore,
  completedAt: a.completedAt,
  answersLength: a.answers ? a.answers.length : (a.answers === undefined ? 'undefined' : 'null')
})));

console.log('\n=== 5. SAMPLE ASSESSMENT DOCUMENT ===');
if (raw.assessments.length > 0) {
  console.log(JSON.stringify(raw.assessments[0], null, 2));
}

console.log('\n=== 6. SAMPLE MISSION RESULT DOCUMENT ===');
if (raw.mission_results.length > 0) {
  console.log(JSON.stringify(raw.mission_results[0], null, 2));
}

console.log('\n=== 7. SAMPLE AI LOG DOCUMENT ===');
if (raw.ai_logs.length > 0) {
  console.log(JSON.stringify(raw.ai_logs[0], null, 2));
}
