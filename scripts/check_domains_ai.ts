import * as fs from 'fs';
import * as path from 'path';

const raw = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'audit_raw_firestore_dump.json'), 'utf-8'));

console.log('=== DOMAIN SCORES IN ASSESSMENTS ===');
raw.assessments.forEach((a: any) => {
  console.log(`Student: ${a.studentId} | Type: ${a.type} | Score: ${a.score} | DomainScores:`, a.domainScores);
});

console.log('\n=== AI LOGS FULL CONTENT ===');
raw.ai_logs.forEach((l: any, i: number) => {
  console.log(`\nLog #${i+1}: Student: ${l.studentId}, Mission: ${l.missionId}, Question: ${l.questionId}, Card: ${l.sourceCardId}`);
  console.log(`AI Used: ${l.aiUsed}, Sessions: ${l.aiSessionCount}, Opens: ${l.aiOpenCount}, Queries: ${l.aiQueryCount}`);
  if (l.aiQueries && l.aiQueries.length > 0) {
    console.log('Queries:', JSON.stringify(l.aiQueries));
  }
});
