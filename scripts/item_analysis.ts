import * as fs from 'fs';
import * as path from 'path';
import { SAMPLE_QUESTIONS } from '../src/data/sampleQuestions';
import { MISSION_1_QUESTIONS } from '../src/data/mission1Questions';
import { MISSION_2_QUESTIONS } from '../src/data/mission2Questions';
import { MISSION_3_QUESTIONS } from '../src/data/mission3Questions';
import { MISSION_4_QUESTIONS } from '../src/data/mission4Questions';
import { INDICATOR_DEFINITIONS } from '../src/data/indicators';

const dumpPath = path.join(process.cwd(), 'audit_raw_firestore_dump.json');
const raw = JSON.parse(fs.readFileSync(dumpPath, 'utf-8'));
const assessmentsList = raw.assessments || [];
const students = raw.students || [];

// Calculate Pre-Test and Post-Test Item Analysis
// Each assessment has domainScores and score. Let's analyze the 10 shared items.
const preAssessments = assessmentsList.filter((a: any) => a.type === 'BASELINE');
const postAssessments = assessmentsList.filter((a: any) => a.type === 'POST_TEST');

console.log('Pre Assessments count:', preAssessments.length);
console.log('Post Assessments count:', postAssessments.length);

const itemAnalysis10 = SAMPLE_QUESTIONS.map((q, idx) => {
  const dom = INDICATOR_DEFINITIONS[q.indicatorId as any]?.domain;
  
  // Aggregate accuracy estimation from domainScores across students
  const preRatios = preAssessments.map((a: any) => a.domainScores ? (a.domainScores[dom] ?? 0) : 0);
  const postRatios = postAssessments.map((a: any) => a.domainScores ? (a.domainScores[dom] ?? 0) : 0);
  
  const pPre = preRatios.reduce((a: number, b: number) => a + b, 0) / preRatios.length;
  const pPost = postRatios.reduce((a: number, b: number) => a + b, 0) / postRatios.length;
  const meanPreScore = pPre * q.maxScore;
  const meanPostScore = pPost * q.maxScore;
  const diff = meanPostScore - meanPreScore;

  return {
    itemNo: idx + 1,
    questionId: q.questionId,
    title: q.title,
    type: q.type,
    indicator: q.indicatorId,
    domain: dom,
    maxScore: q.maxScore,
    p_pre: Number(pPre.toFixed(2)),
    meanPreScore: Number(meanPreScore.toFixed(2)),
    p_post: Number(pPost.toFixed(2)),
    meanPostScore: Number(meanPostScore.toFixed(2)),
    scoreGain: Number(diff.toFixed(2)),
    difficultyCategoryPre: pPre >= 0.8 ? 'EASY' : (pPre >= 0.5 ? 'MODERATE' : 'HARD'),
    difficultyCategoryPost: pPost >= 0.8 ? 'EASY' : (pPost >= 0.5 ? 'MODERATE' : 'HARD')
  };
});

console.table(itemAnalysis10);
