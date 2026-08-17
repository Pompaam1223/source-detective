import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function inspectAll() {
  console.log('=== CONNECTING TO FIRESTORE ===');
  console.log('Database ID:', firebaseConfig.firestoreDatabaseId);

  const collections = [
    'students',
    'student_accounts',
    'progress',
    'assessments',
    'attempts',
    'mission_results',
    'evidences',
    'ai_logs',
    'teacher_mappings'
  ];

  const results: Record<string, any[]> = {};

  for (const colName of collections) {
    try {
      const snap = await getDocs(collection(db, colName));
      results[colName] = snap.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
      console.log(`Collection [${colName}]: ${results[colName].length} documents found.`);
    } catch (e: any) {
      console.error(`Error reading [${colName}]:`, e.message);
      results[colName] = [];
    }
  }

  console.log('\n=== STUDENTS LIST ===');
  results['students']?.forEach((s, idx) => {
    console.log(`${idx + 1}. ID: ${s.studentId || s._id} | Nickname: ${s.nickname} | Avatar: ${s.avatarId} | Registered: ${s.registeredAt}`);
  });

  console.log('\n=== STUDENT ACCOUNTS ===');
  results['student_accounts']?.forEach((a, idx) => {
    console.log(`${idx + 1}. ID: ${a.studentId || a._id} | User: ${a.username} | Role: ${a.role}`);
  });

  console.log('\n=== PROGRESS ===');
  results['progress']?.forEach((p, idx) => {
    console.log(`${idx + 1}. Student: ${p.studentId} | Points: ${p.totalPoints} | Baseline: ${p.baselineStatus} | PostTest: ${p.postTestStatus} | Missions: ${JSON.stringify(p.completedMissionIds)}`);
  });

  console.log('\n=== ASSESSMENTS ===');
  results['assessments']?.forEach((a, idx) => {
    console.log(`${idx + 1}. Doc: ${a._id} | Student: ${a.studentId} | Type: ${a.type} | Score: ${a.score}/${a.maxScore} | Date: ${a.completedAt} | Answers Count: ${a.answers?.length || 0}`);
  });

  console.log('\n=== MISSION RESULTS ===');
  results['mission_results']?.forEach((m, idx) => {
    console.log(`${idx + 1}. Doc: ${m._id} | Student: ${m.studentId} | Mission: ${m.missionId} | Score: ${m.score}/${m.maxScore} | Time: ${m.timeSpentSeconds}s | Date: ${m.completedAt}`);
  });

  console.log('\n=== EVIDENCES SUMMARY ===');
  console.log(`Total evidences: ${results['evidences']?.length}`);

  console.log('\n=== AI LOGS SUMMARY ===');
  console.log(`Total AI logs: ${results['ai_logs']?.length}`);

  console.log('\n=== ATTEMPTS SUMMARY ===');
  console.log(`Total attempts: ${results['attempts']?.length}`);

  console.log('\n=== TEACHER MAPPINGS ===');
  results['teacher_mappings']?.forEach((m, idx) => {
    console.log(`${idx + 1}. Student: ${m.studentId} | RealName: ${m.realName} | Number: ${m.studentNumber} | Room: ${m.classroom}`);
  });
}

inspectAll().then(() => process.exit(0)).catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
