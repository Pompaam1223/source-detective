import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { db } from './firebase';
import {
  Student,
  StudentAccount,
  TeacherStudentMapping,
  StudentProgress,
  QuestionAttempt,
  MissionResult,
  Evidence,
  AssessmentResult,
  AIUsageLog
} from '../types';

export class CloudStorageService {
  private static isAvailable(): boolean {
    return db !== null;
  }

  // --- Student Accounts ---
  static async saveAccount(account: StudentAccount): Promise<void> {
    if (!this.isAvailable()) return;
    try {
      const docRef = doc(db!, 'student_accounts', account.studentId);
      await setDoc(docRef, { ...account }, { merge: true });
    } catch (e) {
      console.warn('Cloud save account error:', e);
    }
  }

  static async getAccountByUsername(username: string): Promise<StudentAccount | null> {
    if (!this.isAvailable()) return null;
    try {
      const cleanUsername = username.trim().toLowerCase();
      const q = query(
        collection(db!, 'student_accounts'),
        where('username', '==', cleanUsername)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs[0].data() as StudentAccount;
      }
      return null;
    } catch (e) {
      console.warn('Cloud getAccountByUsername error:', e);
      return null;
    }
  }

  static async getAllAccounts(): Promise<StudentAccount[]> {
    if (!this.isAvailable()) return [];
    try {
      const snapshot = await getDocs(collection(db!, 'student_accounts'));
      return snapshot.docs.map(d => d.data() as StudentAccount);
    } catch (e) {
      console.warn('Cloud getAllAccounts error:', e);
      return [];
    }
  }

  // --- Students Profiles ---
  static async saveStudent(student: Student): Promise<void> {
    if (!this.isAvailable()) return;
    try {
      const docRef = doc(db!, 'students', student.studentId);
      await setDoc(docRef, { ...student }, { merge: true });
    } catch (e) {
      console.warn('Cloud save student error:', e);
    }
  }

  static async getAllStudents(): Promise<Student[]> {
    if (!this.isAvailable()) return [];
    try {
      const snapshot = await getDocs(collection(db!, 'students'));
      return snapshot.docs.map(d => d.data() as Student);
    } catch (e) {
      console.warn('Cloud getAllStudents error:', e);
      return [];
    }
  }

  // --- Student Progress ---
  static async saveProgress(progress: StudentProgress): Promise<void> {
    if (!this.isAvailable()) return;
    try {
      const docRef = doc(db!, 'progress', progress.studentId);
      await setDoc(docRef, { ...progress }, { merge: true });
    } catch (e) {
      console.warn('Cloud save progress error:', e);
    }
  }

  static async getProgress(studentId: string): Promise<StudentProgress | null> {
    if (!this.isAvailable()) return null;
    try {
      const docRef = doc(db!, 'progress', studentId);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return snapshot.data() as StudentProgress;
      }
      return null;
    } catch (e) {
      console.warn('Cloud getProgress error:', e);
      return null;
    }
  }

  static async getAllProgresses(): Promise<Record<string, StudentProgress>> {
    if (!this.isAvailable()) return {};
    try {
      const snapshot = await getDocs(collection(db!, 'progress'));
      const result: Record<string, StudentProgress> = {};
      snapshot.docs.forEach(d => {
        const p = d.data() as StudentProgress;
        if (p && p.studentId) {
          result[p.studentId] = p;
        }
      });
      return result;
    } catch (e) {
      console.warn('Cloud getAllProgresses error:', e);
      return {};
    }
  }

  // --- Question Attempts ---
  static async saveAttempt(attempt: QuestionAttempt): Promise<void> {
    if (!this.isAvailable()) return;
    try {
      const docId = `${attempt.studentId}_${attempt.missionId}_${attempt.questionId}`;
      const docRef = doc(db!, 'attempts', docId);
      await setDoc(docRef, { ...attempt }, { merge: true });
    } catch (e) {
      console.warn('Cloud save attempt error:', e);
    }
  }

  static async getAllAttempts(): Promise<QuestionAttempt[]> {
    if (!this.isAvailable()) return [];
    try {
      const snapshot = await getDocs(collection(db!, 'attempts'));
      return snapshot.docs.map(d => d.data() as QuestionAttempt);
    } catch (e) {
      console.warn('Cloud getAllAttempts error:', e);
      return [];
    }
  }

  // --- Mission Results ---
  static async saveMissionResult(result: MissionResult): Promise<void> {
    if (!this.isAvailable()) return;
    try {
      const docId = `${result.studentId}_${result.missionId}`;
      const docRef = doc(db!, 'mission_results', docId);
      await setDoc(docRef, { ...result }, { merge: true });
    } catch (e) {
      console.warn('Cloud save mission result error:', e);
    }
  }

  static async getAllMissionResults(): Promise<MissionResult[]> {
    if (!this.isAvailable()) return [];
    try {
      const snapshot = await getDocs(collection(db!, 'mission_results'));
      return snapshot.docs.map(d => d.data() as MissionResult);
    } catch (e) {
      console.warn('Cloud getAllMissionResults error:', e);
      return [];
    }
  }

  // --- Evidences ---
  static async saveEvidence(evidence: Evidence): Promise<void> {
    if (!this.isAvailable()) return;
    try {
      const docId = `${evidence.studentId}_${evidence.id}`;
      const docRef = doc(db!, 'evidences', docId);
      await setDoc(docRef, { ...evidence }, { merge: true });
    } catch (e) {
      console.warn('Cloud save evidence error:', e);
    }
  }

  static async getAllEvidences(): Promise<Evidence[]> {
    if (!this.isAvailable()) return [];
    try {
      const snapshot = await getDocs(collection(db!, 'evidences'));
      return snapshot.docs.map(d => d.data() as Evidence);
    } catch (e) {
      console.warn('Cloud getAllEvidences error:', e);
      return [];
    }
  }

  // --- Assessment Results ---
  static async saveAssessmentResult(result: AssessmentResult): Promise<void> {
    if (!this.isAvailable()) return;
    try {
      const docId = `${result.studentId}_${result.type}`;
      const docRef = doc(db!, 'assessments', docId);
      await setDoc(docRef, { ...result }, { merge: true });
    } catch (e) {
      console.warn('Cloud save assessment error:', e);
    }
  }

  static async getAllAssessments(): Promise<AssessmentResult[]> {
    if (!this.isAvailable()) return [];
    try {
      const snapshot = await getDocs(collection(db!, 'assessments'));
      return snapshot.docs.map(d => d.data() as AssessmentResult);
    } catch (e) {
      console.warn('Cloud getAllAssessments error:', e);
      return [];
    }
  }

  // --- AI Usage Logs ---
  static async saveAILog(log: AIUsageLog): Promise<void> {
    if (!this.isAvailable()) return;
    try {
      const docId = `${log.studentId}_${Date.now()}`;
      const docRef = doc(db!, 'ai_logs', docId);
      await setDoc(docRef, { ...log }, { merge: true });
    } catch (e) {
      console.warn('Cloud save AI log error:', e);
    }
  }

  static async getAllAILogs(): Promise<AIUsageLog[]> {
    if (!this.isAvailable()) return [];
    try {
      const snapshot = await getDocs(collection(db!, 'ai_logs'));
      return snapshot.docs.map(d => d.data() as AIUsageLog);
    } catch (e) {
      console.warn('Cloud getAllAILogs error:', e);
      return [];
    }
  }

  // --- Teacher Mappings ---
  static async saveTeacherMapping(mapping: TeacherStudentMapping): Promise<void> {
    if (!this.isAvailable()) return;
    try {
      const docRef = doc(db!, 'teacher_mappings', mapping.studentId);
      await setDoc(docRef, { ...mapping }, { merge: true });
    } catch (e) {
      console.warn('Cloud save teacher mapping error:', e);
    }
  }

  static async getAllTeacherMappings(): Promise<Record<string, TeacherStudentMapping>> {
    if (!this.isAvailable()) return {};
    try {
      const snapshot = await getDocs(collection(db!, 'teacher_mappings'));
      const result: Record<string, TeacherStudentMapping> = {};
      snapshot.docs.forEach(d => {
        const m = d.data() as TeacherStudentMapping;
        if (m && m.studentId) {
          result[m.studentId] = m;
        }
      });
      return result;
    } catch (e) {
      console.warn('Cloud getAllTeacherMappings error:', e);
      return {};
    }
  }

  // --- Account Administration ---
  static async resetPassword(studentId: string, newPasswordHash: string): Promise<void> {
    if (!this.isAvailable()) return;
    try {
      const docRef = doc(db!, 'student_accounts', studentId);
      await setDoc(docRef, { passwordHash: newPasswordHash }, { merge: true });
    } catch (e) {
      console.warn('Cloud reset password error:', e);
    }
  }

  static async deleteStudent(studentId: string): Promise<void> {
    if (!this.isAvailable()) return;
    try {
      // 1. Delete student account
      await deleteDoc(doc(db!, 'student_accounts', studentId));
      // 2. Delete student profile
      await deleteDoc(doc(db!, 'students', studentId));
      // 3. Delete progress
      await deleteDoc(doc(db!, 'progress', studentId));
      // 4. Delete teacher mapping
      await deleteDoc(doc(db!, 'teacher_mappings', studentId));
    } catch (e) {
      console.warn('Cloud delete student error:', e);
    }
  }

  // --- Real-time Subscription for Teacher Dashboard ---
  static subscribeToClassroom(onUpdate: () => void): Unsubscribe | null {
    if (!this.isAvailable()) return null;
    try {
      // Listen to student progress updates
      const unsub = onSnapshot(collection(db!, 'progress'), () => {
        onUpdate();
      }, (err) => {
        console.warn('Classroom realtime listener notice:', err);
      });
      return unsub;
    } catch (e) {
      console.warn('Failed to attach classroom listener:', e);
      return null;
    }
  }
}
