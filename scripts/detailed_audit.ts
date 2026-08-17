import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import * as fs from 'fs';
import * as path from 'path';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function fullDump() {
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

  const fullData: Record<string, any[]> = {};

  for (const colName of collections) {
    try {
      const snap = await getDocs(collection(db, colName));
      fullData[colName] = snap.docs.map(doc => ({ _docId: doc.id, ...doc.data() }));
    } catch (e: any) {
      console.error(`Error reading ${colName}:`, e.message);
      fullData[colName] = [];
    }
  }

  // Write full raw dump to a temp audit json
  const outPath = path.join(process.cwd(), 'audit_raw_firestore_dump.json');
  fs.writeFileSync(outPath, JSON.stringify(fullData, null, 2), 'utf-8');
  console.log('Successfully written raw dump to', outPath);

  // Print summary breakdown
  console.log('\n--- COLLECTION STATS ---');
  for (const [k, v] of Object.entries(fullData)) {
    console.log(`${k}: ${v.length} documents`);
  }
}

fullDump().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
