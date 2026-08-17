import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { SAMPLE_QUESTIONS } from '../src/data/sampleQuestions';
import { MISSION_1_QUESTIONS } from '../src/data/mission1Questions';
import { MISSION_2_QUESTIONS } from '../src/data/mission2Questions';
import { MISSION_3_QUESTIONS } from '../src/data/mission3Questions';
import { MISSION_4_QUESTIONS } from '../src/data/mission4Questions';
import { INDICATOR_DEFINITIONS, COMPETENCY_DOMAINS } from '../src/data/indicators';

console.log('=== RUNNING DEEP RESEARCH ANALYSIS PACK & FORENSIC AUDIT ===');

const exportsDir = path.join(process.cwd(), 'exports');
const dumpPath = path.join(process.cwd(), 'audit_raw_firestore_dump.json');
const raw = JSON.parse(fs.readFileSync(dumpPath, 'utf-8'));

// 1. Files Audit: Row Count, Column Count, Size, Checksum
const filesList = [
  '01_question_level_long.csv',
  '02_question_level_wide.csv',
  '03_student_indicator_scores.csv',
  '04_student_summary.csv',
  '05_spss_master_dataset.csv',
  '06_spss_variable_codebook.csv',
  '07_ai_question_linkage.csv',
  '08_evidence_question_linkage.csv',
  '09_attempt_history_audit.csv',
  '10_data_quality_audit.csv',
  '11_research_master_dataset_level3.json',
  '12_data_dictionary_level3.md',
  '13_data_lineage_level3.csv',
  '14_gain_validation.csv'
];

const fileStructureAudit = filesList.map(fileName => {
  const filePath = path.join(exportsDir, fileName);
  if (!fs.existsSync(filePath)) {
    return { fileName, status: 'NOT_FOUND' };
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  const stats = fs.statSync(filePath);
  const sha = crypto.createHash('sha256').update(content).digest('hex');
  const lines = content.split('\n').filter(l => l.trim().length > 0);
  const rowCount = lines.length;
  let colCount = 0;
  if (fileName.endsWith('.csv') && rowCount > 0) {
    colCount = lines[0].split(',').length;
  }
  return {
    fileName,
    sizeBytes: stats.size,
    rowCount,
    colCount: colCount > 0 ? colCount : 'N/A',
    dataRows: fileName.endsWith('.csv') ? rowCount - 1 : rowCount,
    sha256: sha
  };
});

console.log('\n--- 1. FILE STRUCTURE AUDIT ---');
console.table(fileStructureAudit);

// 2. Statistical helpers
function calcMean(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function calcMedian(arr: number[]): number {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function calcSampleSD(arr: number[]): number {
  if (arr.length <= 1) return 0;
  const mean = calcMean(arr);
  const sumSquaredDiff = arr.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0);
  return Math.sqrt(sumSquaredDiff / (arr.length - 1));
}

// 3. Extract Students & Scoring
const students = raw.students || [];
const studentAccounts = raw.student_accounts || [];
const progressList = raw.progress || [];
const assessmentsList = raw.assessments || [];
const missionResultsList = raw.mission_results || [];
const aiLogsList = raw.ai_logs || [];
const evidencesList = raw.evidences || [];

const studentMatrix = students.map((st: any) => {
  const account = studentAccounts.find((a: any) => a.studentId === st.studentId);
  const prog = progressList.find((p: any) => p.studentId === st.studentId);
  const base = assessmentsList.find((a: any) => a.studentId === st.studentId && a.type === 'BASELINE');
  const post = assessmentsList.find((a: any) => a.studentId === st.studentId && a.type === 'POST_TEST');
  const m1 = missionResultsList.find((m: any) => m.studentId === st.studentId && m.missionId === 'm1');
  const m2 = missionResultsList.find((m: any) => m.studentId === st.studentId && m.missionId === 'm2');
  const m3 = missionResultsList.find((m: any) => m.studentId === st.studentId && m.missionId === 'm3');
  const m4 = missionResultsList.find((m: any) => m.studentId === st.studentId && m.missionId === 'm4');

  const baseScore = base?.score ?? 0;
  const postScore = post?.score ?? 0;
  const m1Score = m1?.score ?? 0;
  const m2Score = m2?.score ?? 0;
  const m3Score = m3?.score ?? 0;
  const m4Score = m4?.score ?? 0;
  const totalMission = m1Score + m2Score + m3Score + m4Score;
  const totalSystem = baseScore + totalMission + postScore;
  const storedTotal = prog?.totalPoints ?? 0;

  const rawGain = postScore - baseScore;
  const normalizedGain = (40 - baseScore > 0) ? Number(((postScore - baseScore) / (40 - baseScore)).toFixed(4)) : 0;

  const stEv = evidencesList.filter((e: any) => e.studentId === st.studentId);
  const stAi = aiLogsList.filter((l: any) => l.studentId === st.studentId);

  return {
    studentId: st.studentId,
    alias: st.nickname,
    username: account?.username,
    baseScore,
    m1Score,
    m2Score,
    m3Score,
    m4Score,
    postScore,
    totalMission,
    totalSystem,
    storedTotal,
    scoreMatch: totalSystem === storedTotal,
    rawGain,
    normalizedGain,
    baseDomains: base?.domainScores || {},
    postDomains: post?.domainScores || {},
    evCount: stEv.length,
    aiCount: stAi.reduce((acc: number, c: any) => Math.max(acc, c.aiQueryCount || 0), 0)
  };
});

console.log('\n--- 2. STUDENT STATS OVERVIEW ---');
console.table(studentMatrix.map(s => ({
  ID: s.studentId,
  Alias: s.alias,
  Pre: s.baseScore,
  M1: s.m1Score,
  M2: s.m2Score,
  M3: s.m3Score,
  M4: s.m4Score,
  Post: s.postScore,
  MissionTot: s.totalMission,
  SysTot: s.totalSystem,
  Gain: s.rawGain,
  NormGain: s.normalizedGain
})));

// 4. Domain & Indicator Analyses
const domains = ['THINK', 'CHECK', 'SOLVE', 'EXPLAIN', 'GROW'];
const domainSummary = domains.map(dom => {
  const preScores = studentMatrix.map(s => s.baseDomains[dom] ?? 0);
  const postScores = studentMatrix.map(s => s.postDomains[dom] ?? 0);
  const preMean = calcMean(preScores);
  const postMean = calcMean(postScores);
  const preSD = calcSampleSD(preScores);
  const postSD = calcSampleSD(postScores);
  const gain = postMean - preMean;
  const normGain = (1 - preMean > 0) ? (postMean - preMean) / (1 - preMean) : 0;

  return {
    Domain: dom,
    PreMean: Number((preMean * 100).toFixed(2)),
    PreSD: Number((preSD * 100).toFixed(2)),
    PostMean: Number((postMean * 100).toFixed(2)),
    PostSD: Number((postSD * 100).toFixed(2)),
    DeltaPct: Number((gain * 100).toFixed(2)),
    NormGain: Number(normGain.toFixed(4))
  };
});

console.log('\n--- 3. 5 DOMAINS COMPARISON (PRE vs POST) ---');
console.table(domainSummary);

// 5. Pre/Post Item Level Comparison (10 Shared Items)
const prePostItems = SAMPLE_QUESTIONS.map((q, idx) => {
  const ind = q.indicatorId || 'N/A';
  const dom = INDICATOR_DEFINITIONS[ind as any]?.domain || 'N/A';
  return {
    ItemNo: idx + 1,
    QuestionId: q.questionId,
    Type: q.type,
    Indicator: ind,
    Domain: dom,
    MaxScore: q.maxScore
  };
});

console.log('\n--- 4. 10 PRE/POST ITEMS DEFINITIONS ---');
console.table(prePostItems);

// 6. Evidence & AI Linkage Breakdown
const evidenceSummary = evidencesList.map((e: any) => ({
  studentId: e.studentId,
  evidenceId: e.id || e._docId,
  missionId: e.missionId,
  questionId: e.questionId,
  indicatorId: e.indicatorId,
  type: e.type || e.evidenceType,
  title: e.title,
  sourceTag: e.sourceTag,
  score: e.score,
  isVerified: e.isVerified
}));

console.log(`\nTotal Evidences: ${evidenceSummary.length}`);

// 7. Checksums of exports
console.log('\nAudit complete.');
