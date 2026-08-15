import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

let app: any = null;
let db: Firestore | null = null;

try {
  if (firebaseConfig && firebaseConfig.projectId && firebaseConfig.apiKey) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    
    // Initialize custom databaseId if specified
    const dbId = (firebaseConfig as any).firestoreDatabaseId;
    if (dbId && dbId !== '(default)' && dbId.trim() !== '') {
      db = getFirestore(app, dbId);
    } else {
      db = getFirestore(app);
    }
  }
} catch (error) {
  console.warn('Firebase initialization notice:', error);
}

export { app, db };
