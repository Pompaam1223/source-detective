import * as fs from 'fs';
import * as path from 'path';

// Read raw firestore dump
const raw = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'audit_raw_firestore_dump.json'), 'utf-8'));

const exportsDir = path.join(process.cwd(), 'exports');
if (!fs.existsSync(exportsDir)) {
  fs.mkdirSync(exportsDir, { recursive: true });
}

// 1. Helper function for CSV Escaping
function toCSVRow(items: any[]): string {
  return items.map(item => {
    if (item === null || item === undefined) return 'NULL';
    const str = String(item);
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }).join(',');
}

// ==========================================
// FILE 01: students_summary.csv
// ==========================================
const studentsSummaryHeaders = [
  'studentId',
  'alias',
  'username',
  'role',
  'registeredAt',
  'totalPointsRecorded',
  'baselineStatus',
  'postTestStatus',
  'completedMissionsCount',
  'completedMissionsList'
];

const studentsSummaryRows: any[][] = [];

raw.students.forEach((s: any) => {
  const account = raw.student_accounts.find((a: any) => a.studentId === s.studentId);
  const prog = raw.progress.find((p: any) => p.studentId === s.studentId);

  studentsSummaryRows.push([
    s.studentId,
    s.nickname || 'UNKNOWN',
    account?.username || 'UNKNOWN',
    account?.role || 'STUDENT',
    s.registeredAt || 'NOT_AVAILABLE',
    prog?.totalPoints ?? 'NULL',
    prog?.baselineStatus || 'PENDING',
    prog?.postTestStatus || 'PENDING',
    prog?.completedMissionIds?.length ?? 0,
    prog?.completedMissionIds?.join(';') || 'NONE'
  ]);
});

const file01Content = [
  toCSVRow(studentsSummaryHeaders),
  ...studentsSummaryRows.map(r => toCSVRow(r))
].join('\n');

fs.writeFileSync(path.join(exportsDir, 'students_summary.csv'), file01Content, 'utf-8');
fs.writeFileSync(path.join(process.cwd(), 'students_summary.csv'), file01Content, 'utf-8');

// ==========================================
// FILE 02: assessment_answers.csv
// ==========================================
const assessmentHeaders = [
  'studentAlias',
  'studentId',
  'assessmentType',
  'assessmentId',
  'score',
  'maxScore',
  'domainScores_THINK',
  'domainScores_CHECK',
  'domainScores_SOLVE',
  'domainScores_EXPLAIN',
  'domainScores_GROW',
  'completedAt',
  'answersCount',
  'answersData'
];

const assessmentRows: any[][] = [];

raw.assessments.forEach((a: any) => {
  const student = raw.students.find((s: any) => s.studentId === a.studentId);
  const alias = student?.nickname || 'UNKNOWN';

  assessmentRows.push([
    alias,
    a.studentId,
    a.type,
    a.assessmentId || a._docId,
    a.score,
    a.maxScore,
    a.domainScores?.THINK ?? 'NULL',
    a.domainScores?.CHECK ?? 'NULL',
    a.domainScores?.SOLVE ?? 'NULL',
    a.domainScores?.EXPLAIN ?? 'NULL',
    a.domainScores?.GROW ?? 'NULL',
    a.completedAt,
    a.answers ? a.answers.length : 0,
    a.answers ? JSON.stringify(a.answers) : 'NULL'
  ]);
});

const file02Content = [
  toCSVRow(assessmentHeaders),
  ...assessmentRows.map(r => toCSVRow(r))
].join('\n');

fs.writeFileSync(path.join(exportsDir, 'assessment_answers.csv'), file02Content, 'utf-8');
fs.writeFileSync(path.join(process.cwd(), 'assessment_answers.csv'), file02Content, 'utf-8');

// ==========================================
// FILE 03: mission_results.csv
// ==========================================
const missionHeaders = [
  'studentAlias',
  'studentId',
  'missionId',
  'score',
  'maxScore',
  'completed',
  'attemptsCount',
  'timeSpentSeconds',
  'completedAt'
];

const missionRows: any[][] = [];

raw.mission_results.forEach((m: any) => {
  const student = raw.students.find((s: any) => s.studentId === m.studentId);
  const alias = student?.nickname || 'UNKNOWN';

  missionRows.push([
    alias,
    m.studentId,
    m.missionId,
    m.score,
    m.maxScore,
    m.completed ? 'TRUE' : 'FALSE',
    m.attemptsCount ?? 'NULL',
    m.timeSpentSeconds ?? 'NOT_AVAILABLE',
    m.completedAt
  ]);
});

const file03Content = [
  toCSVRow(missionHeaders),
  ...missionRows.map(r => toCSVRow(r))
].join('\n');

fs.writeFileSync(path.join(exportsDir, 'mission_results.csv'), file03Content, 'utf-8');
fs.writeFileSync(path.join(process.cwd(), 'mission_results.csv'), file03Content, 'utf-8');

// ==========================================
// FILE 04: evidence_ledger.csv
// ==========================================
const evidenceHeaders = [
  'studentAlias',
  'studentId',
  'missionId',
  'questionId',
  'indicatorId',
  'evidenceId',
  'evidenceType',
  'title',
  'content',
  'sourceTag',
  'isVerified',
  'timestamp'
];

const evidenceRows: any[][] = [];

raw.evidences.forEach((e: any) => {
  const student = raw.students.find((s: any) => s.studentId === e.studentId);
  const alias = student?.nickname || 'UNKNOWN';

  evidenceRows.push([
    alias,
    e.studentId,
    e.missionId,
    e.questionId ?? 'NULL',
    e.indicatorId ?? 'NULL',
    e.id || e._docId,
    e.type || 'NULL',
    e.title || 'NULL',
    e.content || 'NULL',
    e.sourceTag || 'NULL',
    e.isVerified ? 'TRUE' : 'FALSE',
    e.timestamp || 'NOT_AVAILABLE'
  ]);
});

const file04Content = [
  toCSVRow(evidenceHeaders),
  ...evidenceRows.map(r => toCSVRow(r))
].join('\n');

fs.writeFileSync(path.join(exportsDir, 'evidence_ledger.csv'), file04Content, 'utf-8');
fs.writeFileSync(path.join(process.cwd(), 'evidence_ledger.csv'), file04Content, 'utf-8');

// ==========================================
// FILE 05: ai_usage_logs.csv
// ==========================================
const aiHeaders = [
  'studentAlias',
  'studentId',
  'logDocId',
  'missionId',
  'questionId',
  'sourceCardId',
  'aiUsed',
  'aiSessionCount',
  'aiOpenCount',
  'aiQueryCount',
  'timestamp',
  'queriesJSON'
];

const aiRows: any[][] = [];

raw.ai_logs.forEach((l: any) => {
  const student = raw.students.find((s: any) => s.studentId === l.studentId);
  const alias = student?.nickname || 'UNKNOWN';

  aiRows.push([
    alias,
    l.studentId,
    l._docId,
    l.missionId,
    l.questionId,
    l.sourceCardId ?? 'NULL',
    l.aiUsed ? 'TRUE' : 'FALSE',
    l.aiSessionCount ?? 0,
    l.aiOpenCount ?? 0,
    l.aiQueryCount ?? 0,
    l.timestamp,
    l.aiQueries ? JSON.stringify(l.aiQueries) : '[]'
  ]);
});

const file05Content = [
  toCSVRow(aiHeaders),
  ...aiRows.map(r => toCSVRow(r))
].join('\n');

fs.writeFileSync(path.join(exportsDir, 'ai_usage_logs.csv'), file05Content, 'utf-8');
fs.writeFileSync(path.join(process.cwd(), 'ai_usage_logs.csv'), file05Content, 'utf-8');

// ==========================================
// FILE 06: research_master_dataset.csv
// ==========================================
const masterHeaders = [
  'studentAlias',
  'studentId',
  'baselineScore',
  'mission1Score',
  'mission2Score',
  'mission3Score',
  'mission4Score',
  'postTestScore',
  'totalMissionScore',
  'totalSystemScore',
  'recordedTotalPoints',
  'rawGain',
  'normalizedGain',
  'domain_THINK_Pre',
  'domain_CHECK_Pre',
  'domain_SOLVE_Pre',
  'domain_EXPLAIN_Pre',
  'domain_GROW_Pre',
  'domain_THINK_Post',
  'domain_CHECK_Post',
  'domain_SOLVE_Post',
  'domain_EXPLAIN_Post',
  'domain_GROW_Post',
  'evidenceCount',
  'verifiedEvidenceCount',
  'aiOpenCount',
  'aiQueryCount',
  'totalMissionTime',
  'completionStatus'
];

const masterRows: any[][] = [];

raw.students.forEach((s: any) => {
  const base = raw.assessments.find((a: any) => a.studentId === s.studentId && a.type === 'BASELINE');
  const post = raw.assessments.find((a: any) => a.studentId === s.studentId && a.type === 'POST_TEST');
  const m1 = raw.mission_results.find((m: any) => m.studentId === s.studentId && m.missionId === 'm1');
  const m2 = raw.mission_results.find((m: any) => m.studentId === s.studentId && m.missionId === 'm2');
  const m3 = raw.mission_results.find((m: any) => m.studentId === s.studentId && m.missionId === 'm3');
  const m4 = raw.mission_results.find((m: any) => m.studentId === s.studentId && m.missionId === 'm4');
  const prog = raw.progress.find((p: any) => p.studentId === s.studentId);
  const studentAiLogs = raw.ai_logs.filter((l: any) => l.studentId === s.studentId);
  const studentEvidences = raw.evidences.filter((e: any) => e.studentId === s.studentId);

  const baseScore = base?.score ?? null;
  const postScore = post?.score ?? null;
  const m1Score = m1?.score ?? null;
  const m2Score = m2?.score ?? null;
  const m3Score = m3?.score ?? null;
  const m4Score = m4?.score ?? null;

  const totalMissionScore = (m1Score ?? 0) + (m2Score ?? 0) + (m3Score ?? 0) + (m4Score ?? 0);
  const totalSystemScore = (baseScore ?? 0) + totalMissionScore + (postScore ?? 0);
  const recordedTotalPoints = prog?.totalPoints ?? 'NULL';

  let rawGain = null;
  let normalizedGain = null;

  if (baseScore !== null && postScore !== null) {
    rawGain = postScore - baseScore;
    if (40 - baseScore > 0) {
      normalizedGain = Number(((postScore - baseScore) / (40 - baseScore)).toFixed(4));
    }
  }

  const aiOpenTotal = studentAiLogs.reduce((acc: number, cur: any) => Math.max(acc, cur.aiOpenCount ?? 0), 0);
  const aiQueryTotal = studentAiLogs.reduce((acc: number, cur: any) => Math.max(acc, cur.aiQueryCount ?? 0), 0);

  const completionStatus = (prog?.baselineStatus === 'COMPLETED' &&
    prog?.postTestStatus === 'COMPLETED' &&
    prog?.completedMissionIds?.length === 4) ? 'FULLY_COMPLETED' : 'INCOMPLETE';

  masterRows.push([
    s.nickname || 'UNKNOWN',
    s.studentId,
    baseScore,
    m1Score,
    m2Score,
    m3Score,
    m4Score,
    postScore,
    totalMissionScore,
    totalSystemScore,
    recordedTotalPoints,
    rawGain,
    normalizedGain,
    base?.domainScores?.THINK ?? 'NULL',
    base?.domainScores?.CHECK ?? 'NULL',
    base?.domainScores?.SOLVE ?? 'NULL',
    base?.domainScores?.EXPLAIN ?? 'NULL',
    base?.domainScores?.GROW ?? 'NULL',
    post?.domainScores?.THINK ?? 'NULL',
    post?.domainScores?.CHECK ?? 'NULL',
    post?.domainScores?.SOLVE ?? 'NULL',
    post?.domainScores?.EXPLAIN ?? 'NULL',
    post?.domainScores?.GROW ?? 'NULL',
    studentEvidences.length,
    studentEvidences.filter((e: any) => e.isVerified).length,
    aiOpenTotal,
    aiQueryTotal,
    'NOT_AVAILABLE',
    completionStatus
  ]);
});

const file06Content = [
  toCSVRow(masterHeaders),
  ...masterRows.map(r => toCSVRow(r))
].join('\n');

fs.writeFileSync(path.join(exportsDir, 'research_master_dataset.csv'), file06Content, 'utf-8');
fs.writeFileSync(path.join(process.cwd(), 'research_master_dataset.csv'), file06Content, 'utf-8');

// ==========================================
// FILE 07: research_master_dataset.json
// ==========================================
const nestedMasterJSON = {
  metadata: {
    systemName: "SOURCE DETECTIVE",
    version: "RDFE-v1.0",
    freezeTimestamp: "2026-08-16T03:40:00.000Z",
    targetCohort: "Grade 7 (M.1)",
    studentsCount: raw.students.length,
    databaseId: "ai-studio-sourcedetective-035a7a2f-2f14-4a61-88f4-83f8c6771fa1",
    dataIntegrity: "READ_ONLY_AUDITED_NO_MODIFICATIONS"
  },
  students: raw.students.map((s: any) => {
    const account = raw.student_accounts.find((a: any) => a.studentId === s.studentId);
    const prog = raw.progress.find((p: any) => p.studentId === s.studentId);
    const base = raw.assessments.find((a: any) => a.studentId === s.studentId && a.type === 'BASELINE');
    const post = raw.assessments.find((a: any) => a.studentId === s.studentId && a.type === 'POST_TEST');
    const missions = raw.mission_results.filter((m: any) => m.studentId === s.studentId);
    const aiLogs = raw.ai_logs.filter((l: any) => l.studentId === s.studentId);
    const evidences = raw.evidences.filter((e: any) => e.studentId === s.studentId);

    const baseScore = base?.score ?? null;
    const postScore = post?.score ?? null;
    const m1Score = missions.find((m: any) => m.missionId === 'm1')?.score ?? null;
    const m2Score = missions.find((m: any) => m.missionId === 'm2')?.score ?? null;
    const m3Score = missions.find((m: any) => m.missionId === 'm3')?.score ?? null;
    const m4Score = missions.find((m: any) => m.missionId === 'm4')?.score ?? null;

    const totalMissionScore = (m1Score ?? 0) + (m2Score ?? 0) + (m3Score ?? 0) + (m4Score ?? 0);
    const totalSystemScore = (baseScore ?? 0) + totalMissionScore + (postScore ?? 0);

    let rawGain = null;
    let normalizedGain = null;
    if (baseScore !== null && postScore !== null) {
      rawGain = postScore - baseScore;
      if (40 - baseScore > 0) {
        normalizedGain = Number(((postScore - baseScore) / (40 - baseScore)).toFixed(4));
      }
    }

    return {
      identity: {
        studentId: s.studentId,
        alias: s.nickname,
        username: account?.username || null,
        role: account?.role || 'STUDENT',
        registeredAt: s.registeredAt
      },
      progress: prog,
      assessments: {
        baseline: base,
        postTest: post,
        derivedMetrics: {
          rawGain,
          normalizedGain
        }
      },
      missions: missions,
      performanceSummary: {
        baselineScore: baseScore,
        mission1Score: m1Score,
        mission2Score: m2Score,
        mission3Score: m3Score,
        mission4Score: m4Score,
        postTestScore: postScore,
        totalMissionScore,
        totalSystemScore,
        recordedTotalPoints: prog?.totalPoints ?? null,
        scoresConsistent: totalSystemScore === (prog?.totalPoints ?? null)
      },
      evidences: evidences,
      aiUsage: {
        logsCount: aiLogs.length,
        logs: aiLogs
      }
    };
  })
};

fs.writeFileSync(path.join(exportsDir, 'research_master_dataset.json'), JSON.stringify(nestedMasterJSON, null, 2), 'utf-8');
fs.writeFileSync(path.join(process.cwd(), 'research_master_dataset.json'), JSON.stringify(nestedMasterJSON, null, 2), 'utf-8');

console.log('All 7 export data files generated successfully!');
