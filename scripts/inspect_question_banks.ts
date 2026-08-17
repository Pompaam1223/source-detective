import { SAMPLE_QUESTIONS } from '../src/data/sampleQuestions';
import { MISSION_1_QUESTIONS } from '../src/data/mission1Questions';
import { MISSION_2_QUESTIONS } from '../src/data/mission2Questions';
import { MISSION_3_QUESTIONS } from '../src/data/mission3Questions';
import { MISSION_4_QUESTIONS } from '../src/data/mission4Questions';
import { INDICATOR_DEFINITIONS, COMPETENCY_DOMAINS } from '../src/data/indicators';

console.log('=== QUESTION BANK AUDIT ===');
console.log('Baseline / Post-Test Questions count:', SAMPLE_QUESTIONS.length);
console.log('Mission 1 Questions count:', MISSION_1_QUESTIONS.length);
console.log('Mission 2 Questions count:', MISSION_2_QUESTIONS.length);
console.log('Mission 3 Questions count:', MISSION_3_QUESTIONS.length);
console.log('Mission 4 Questions count:', MISSION_4_QUESTIONS.length);

const allQuestions = [
  ...SAMPLE_QUESTIONS.map(q => ({ ...q, phase: 'BASELINE_OR_POST' })),
  ...MISSION_1_QUESTIONS.map(q => ({ ...q, phase: 'MISSION_1' })),
  ...MISSION_2_QUESTIONS.map(q => ({ ...q, phase: 'MISSION_2' })),
  ...MISSION_3_QUESTIONS.map(q => ({ ...q, phase: 'MISSION_3' })),
  ...MISSION_4_QUESTIONS.map(q => ({ ...q, phase: 'MISSION_4' })),
];

console.log('Total question instances across all phases:', allQuestions.length);

// Indicator breakdown
const indicatorCounts: Record<string, number> = {};
allQuestions.forEach(q => {
  const ind = q.indicatorId || 'NO_INDICATOR';
  indicatorCounts[ind] = (indicatorCounts[ind] || 0) + 1;
});

console.log('\n=== INDICATOR COVERAGE ACROSS QUESTION BANKS ===');
console.table(Object.entries(indicatorCounts).map(([ind, count]) => ({
  indicatorId: ind,
  name: INDICATOR_DEFINITIONS[ind as any]?.nameTh || 'N/A',
  domain: INDICATOR_DEFINITIONS[ind as any]?.domain || 'N/A',
  questionCount: count
})));
