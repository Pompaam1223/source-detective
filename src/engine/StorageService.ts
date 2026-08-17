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
import { generateStudentId } from '../utils/security';
import { GoogleSheetsService } from '../services/googleSheetsService';
import { CloudStorageService } from '../services/cloudStorageService';

const STORAGE_KEYS = {
  CURRENT_STUDENT: 'sd_current_student',
  STUDENT_ACCOUNTS: 'sd_student_accounts',
  STUDENTS_LIST: 'sd_students_list',
  TEACHER_MAPPINGS: 'sd_teacher_mappings',
  STUDENT_PROGRESS: 'sd_progress_',
  ATTEMPTS: 'sd_attempts_',
  MISSION_RESULTS: 'sd_results_',
  EVIDENCES: 'sd_evidences_',
  ASSESSMENTS: 'sd_assessments_',
  AI_LOGS: 'sd_ai_logs_'
};

export class StorageService {
  // --- Student Account Management (Privacy by Design) ---
  static getAllAccounts(): StudentAccount[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDENT_ACCOUNTS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to fetch accounts list:', e);
      return [];
    }
  }

  static getAccountByUsername(username: string): StudentAccount | null {
    const list = this.getAllAccounts();
    const cleanUsername = username.trim().toLowerCase();
    return list.find(acc => acc.username.toLowerCase() === cleanUsername) || null;
  }

  static getAccountByStudentId(studentId: string): StudentAccount | null {
    const list = this.getAllAccounts();
    return list.find(acc => acc.studentId === studentId) || null;
  }

  static async registerAccount(
    nickname: string,
    username: string,
    passwordHash: string
  ): Promise<{ success: boolean; account?: StudentAccount; student?: Student; error?: string }> {
    try {
      const cleanUsername = username.trim().toLowerCase();
      const cleanNickname = nickname.trim();

      // 1. Check local & cloud uniqueness
      let existing = this.getAccountByUsername(cleanUsername);
      if (!existing) {
        existing = await CloudStorageService.getAccountByUsername(cleanUsername);
      }

      if (existing) {
        return { success: false, error: `Username "${username}" ถูกใช้งานแล้ว กรุณาเลือก Username อื่น` };
      }

      // 2. Generate unique Student ID (SD-XXXXX)
      let studentId = generateStudentId();
      const accounts = this.getAllAccounts();
      while (accounts.some(a => a.studentId === studentId)) {
        studentId = generateStudentId();
      }

      const now = new Date().toISOString();
      const newAccount: StudentAccount = {
        studentId,
        nickname: cleanNickname,
        username: cleanUsername,
        passwordHash,
        createdAt: now,
        lastLoginAt: now,
        accountStatus: 'ACTIVE'
      };

      accounts.push(newAccount);
      localStorage.setItem(STORAGE_KEYS.STUDENT_ACCOUNTS, JSON.stringify(accounts));

      // 3. Create Student profile session
      const student: Student = {
        studentId,
        nickname: cleanNickname,
        username: cleanUsername,
        registeredAt: now,
        lastActiveAt: now
      };
      this.saveStudent(student);

      // 4. Initialize clean progress for this student
      const initialProgress: StudentProgress = {
        studentId,
        totalPoints: 0,
        maxPossiblePoints: 200,
        completedMissionIds: [],
        baselineStatus: 'NOT_STARTED',
        postTestStatus: 'NOT_STARTED',
        lastUpdated: now
      };
      this.saveProgress(initialProgress);

      // 5. Cloud Firestore Synchronization
      CloudStorageService.saveAccount(newAccount).catch(err => console.warn('Cloud sync error:', err));
      CloudStorageService.saveStudent(student).catch(err => console.warn('Cloud sync error:', err));
      CloudStorageService.saveProgress(initialProgress).catch(err => console.warn('Cloud sync error:', err));

      return { success: true, account: newAccount, student };
    } catch (e) {
      console.error('Failed to register account:', e);
      return { success: false, error: 'เกิดข้อผิดพลาดในการลงทะเบียน กรุณาลองใหม่อีกครั้ง' };
    }
  }

  static async login(
    username: string,
    passwordHash: string
  ): Promise<{ success: boolean; account?: StudentAccount; student?: Student; error?: string }> {
    try {
      const cleanUsername = username.trim().toLowerCase();
      let accounts = this.getAllAccounts();
      let account = accounts.find(a => a.username.toLowerCase() === cleanUsername);

      // If not in LocalStorage, check Cloud Firestore for cross-device support
      if (!account) {
        const cloudAccount = await CloudStorageService.getAccountByUsername(cleanUsername);
        if (cloudAccount) {
          account = cloudAccount;
          accounts.push(cloudAccount);
          localStorage.setItem(STORAGE_KEYS.STUDENT_ACCOUNTS, JSON.stringify(accounts));

          // Fetch student progress from Cloud if exists
          const cloudProgress = await CloudStorageService.getProgress(cloudAccount.studentId);
          if (cloudProgress) {
            this.saveProgress(cloudProgress);
          }
        }
      }

      if (!account) {
        return { success: false, error: 'ไม่พบบัญชีผู้ใช้นี้ กรุณาตรวจสอบ Username หรือสมัครบัญชีใหม่' };
      }

      if (account.passwordHash !== passwordHash) {
        return { success: false, error: 'รหัสผ่าน (Password) ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง' };
      }

      // Update lastLoginAt
      const now = new Date().toISOString();
      account.lastLoginAt = now;
      const accountIdx = accounts.findIndex(a => a.studentId === account!.studentId);
      if (accountIdx >= 0) {
        accounts[accountIdx] = account;
        localStorage.setItem(STORAGE_KEYS.STUDENT_ACCOUNTS, JSON.stringify(accounts));
      }

      // Set current student session
      const student: Student = {
        studentId: account.studentId,
        nickname: account.nickname,
        username: account.username,
        registeredAt: account.createdAt,
        lastActiveAt: now
      };
      this.saveStudent(student);

      // Make sure progress exists
      const existingProgress = this.getProgress(account.studentId);
      if (!existingProgress) {
        this.saveProgress({
          studentId: account.studentId,
          totalPoints: 0,
          maxPossiblePoints: 200,
          completedMissionIds: [],
          baselineStatus: 'NOT_STARTED',
          postTestStatus: 'NOT_STARTED',
          lastUpdated: now
        });
      }

      // Sync updated login to Cloud
      CloudStorageService.saveAccount(account).catch(err => console.warn('Cloud sync error:', err));
      CloudStorageService.saveStudent(student).catch(err => console.warn('Cloud sync error:', err));

      return { success: true, account, student };
    } catch (e) {
      console.error('Failed to login:', e);
      return { success: false, error: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' };
    }
  }

  static teacherResetPassword(studentId: string, newPasswordHash: string): boolean {
    try {
      const accounts = this.getAllAccounts();
      const idx = accounts.findIndex(a => a.studentId === studentId);
      if (idx >= 0) {
        accounts[idx].passwordHash = newPasswordHash;
        localStorage.setItem(STORAGE_KEYS.STUDENT_ACCOUNTS, JSON.stringify(accounts));
        
        // Sync to cloud
        CloudStorageService.resetPassword(studentId, newPasswordHash).catch(err => console.warn('Cloud reset error:', err));
        return true;
      }
      return false;
    } catch (e) {
      console.error('Failed to reset password:', e);
      return false;
    }
  }

  static deleteStudentAccount(studentId: string): boolean {
    try {
      // 1. Remove from student accounts
      const accounts = this.getAllAccounts().filter(a => a.studentId !== studentId);
      localStorage.setItem(STORAGE_KEYS.STUDENT_ACCOUNTS, JSON.stringify(accounts));

      // 2. Remove from students list
      const students = this.getAllStudents().filter(s => s.studentId !== studentId);
      localStorage.setItem(STORAGE_KEYS.STUDENTS_LIST, JSON.stringify(students));

      // 3. Remove from teacher mappings
      const mappings = this.getTeacherMappings();
      if (mappings[studentId]) {
        delete mappings[studentId];
        localStorage.setItem(STORAGE_KEYS.TEACHER_MAPPINGS, JSON.stringify(mappings));
      }

      // 4. Remove all individual learning records
      localStorage.removeItem(`${STORAGE_KEYS.STUDENT_PROGRESS}${studentId}`);
      localStorage.removeItem(`${STORAGE_KEYS.ATTEMPTS}${studentId}`);
      localStorage.removeItem(`${STORAGE_KEYS.MISSION_RESULTS}${studentId}`);
      localStorage.removeItem(`${STORAGE_KEYS.EVIDENCES}${studentId}`);
      localStorage.removeItem(`${STORAGE_KEYS.ASSESSMENTS}${studentId}`);
      localStorage.removeItem(`${STORAGE_KEYS.AI_LOGS}${studentId}`);

      // 5. If currently active session matches this student, clear it
      const current = this.getStudent();
      if (current && current.studentId === studentId) {
        this.clearStudent();
      }

      // 6. Delete from Cloud
      CloudStorageService.deleteStudent(studentId).catch(err => console.warn('Cloud delete error:', err));

      return true;
    } catch (e) {
      console.error('Failed to delete student account:', e);
      return false;
    }
  }

  // --- Teacher Mapping (Separation of Real Identity & Learning Data) ---
  static getTeacherMappings(): Record<string, TeacherStudentMapping> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TEACHER_MAPPINGS);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.error('Failed to get teacher mappings:', e);
      return {};
    }
  }

  static getTeacherMapping(studentId: string): TeacherStudentMapping | null {
    const mappings = this.getTeacherMappings();
    return mappings[studentId] || null;
  }

  static saveTeacherMapping(mapping: TeacherStudentMapping): void {
    try {
      const mappings = this.getTeacherMappings();
      mappings[mapping.studentId] = {
        ...mapping,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEYS.TEACHER_MAPPINGS, JSON.stringify(mappings));

      // Sync to cloud
      CloudStorageService.saveTeacherMapping(mappings[mapping.studentId]).catch(err => console.warn('Cloud save mapping error:', err));
    } catch (e) {
      console.error('Failed to save teacher mapping:', e);
    }
  }

  // --- Student Session Management ---
  static saveStudent(student: Student): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_STUDENT, JSON.stringify(student));
      
      // Also sync to students list
      const list = this.getAllStudents();
      const existingIdx = list.findIndex(s => s.studentId === student.studentId);
      if (existingIdx >= 0) {
        list[existingIdx] = student;
      } else {
        list.push(student);
      }
      localStorage.setItem(STORAGE_KEYS.STUDENTS_LIST, JSON.stringify(list));

      // Sync to Cloud
      CloudStorageService.saveStudent(student).catch(err => console.warn('Cloud save student error:', err));

      // Trigger Google Sheets live event (respecting privacy: log nickname and studentId)
      GoogleSheetsService.logSystemEvent(
        'นักสืบเข้าสู่ระบบ (Detective Active)',
        `นักสืบ ${student.nickname || student.firstName || 'นักสืบ'} [ID: ${student.studentId}] เข้าสู่ระบบ`,
        student,
        'STUDENT_MODE'
      );
    } catch (e) {
      console.error('Failed to save student to localStorage:', e);
    }
  }

  static getStudent(): Student | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_STUDENT);
      if (!data) return null;
      const student: Student = JSON.parse(data);
      if (!student.nickname) {
        student.nickname = student.firstName || 'นักสืบเยาวชน';
      }
      return student;
    } catch (e) {
      console.error('Failed to read student from localStorage:', e);
      return null;
    }
  }

  static clearStudent(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_STUDENT);
    } catch (e) {
      console.error('Failed to clear current student:', e);
    }
  }

  static getAllStudents(): Student[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDENTS_LIST);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to fetch students list:', e);
      return [];
    }
  }

  // --- Student Progress ---
  static saveProgress(progress: StudentProgress): void {
    try {
      const key = `${STORAGE_KEYS.STUDENT_PROGRESS}${progress.studentId}`;
      localStorage.setItem(key, JSON.stringify(progress));

      // Sync to cloud
      CloudStorageService.saveProgress(progress).catch(err => console.warn('Cloud save progress error:', err));
    } catch (e) {
      console.error('Failed to save progress:', e);
    }
  }

  static getProgress(studentId: string): StudentProgress | null {
    try {
      const key = `${STORAGE_KEYS.STUDENT_PROGRESS}${studentId}`;
      const data = localStorage.getItem(key);
      if (data) {
        const progress: StudentProgress = JSON.parse(data);
        const expectedMax = progress.postTestStatus === 'COMPLETED' ? 240 : 200;
        if (!progress.maxPossiblePoints || progress.maxPossiblePoints === 40) {
          progress.maxPossiblePoints = expectedMax;
        }
        return progress;
      }

      // Default fresh progress
      return {
        studentId,
        totalPoints: 0,
        maxPossiblePoints: 200,
        completedMissionIds: [],
        baselineStatus: 'NOT_STARTED',
        postTestStatus: 'NOT_STARTED',
        lastUpdated: new Date().toISOString()
      };
    } catch (e) {
      console.error('Failed to get progress:', e);
      return null;
    }
  }

  static syncProgressPoints(studentId: string): StudentProgress | null {
    try {
      const progress = this.getProgress(studentId);
      if (!progress) return null;

      const missionResults = this.getMissionResults(studentId);
      const missionScoreSum = missionResults.reduce((sum, r) => sum + (r.score || 0), 0);
      const baselineScore = progress.baselineStatus === 'COMPLETED' ? (progress.baselineScore || 0) : 0;
      const postTestScore = progress.postTestStatus === 'COMPLETED' ? (progress.postTestScore || 0) : 0;

      const computedTotal = missionScoreSum + baselineScore + postTestScore;
      
      progress.totalPoints = computedTotal > 0 ? computedTotal : (progress.totalPoints || 0);
      progress.maxPossiblePoints = progress.postTestStatus === 'COMPLETED' ? 240 : 200;
      progress.lastUpdated = new Date().toISOString();
      this.saveProgress(progress);
      return progress;
    } catch (e) {
      console.error('Failed to sync progress points:', e);
      return null;
    }
  }

  static addPoints(studentId: string, points: number): void {
    const progress = this.syncProgressPoints(studentId) || this.getProgress(studentId);
    if (progress) {
      if (points > 0 && progress.totalPoints === 0) {
        progress.totalPoints = points;
        this.saveProgress(progress);
      }
    }
  }

  // --- Question Attempts ---
  static saveAttempt(attempt: QuestionAttempt): void {
    try {
      const attempts = this.getAttempts(attempt.studentId);
      const existingIdx = attempts.findIndex(
        a => a.questionId === attempt.questionId && a.missionId === attempt.missionId
      );
      if (existingIdx >= 0) {
        attempts[existingIdx] = attempt;
      } else {
        attempts.push(attempt);
      }
      const key = `${STORAGE_KEYS.ATTEMPTS}${attempt.studentId}`;
      localStorage.setItem(key, JSON.stringify(attempts));

      // Sync to cloud
      CloudStorageService.saveAttempt(attempt).catch(err => console.warn('Cloud save attempt error:', err));

      // Trigger Google Sheets live event
      const currentStudent = this.getStudent();
      GoogleSheetsService.logSystemEvent(
        'ตอบคำถาม (Question Attempt)',
        `ตอบข้อ ${attempt.questionId} (${attempt.missionId.toUpperCase()}) ได้ ${attempt.score}/${attempt.maxScore} คะแนน [ตัวชี้วัด ${attempt.indicatorId}]`,
        currentStudent,
        'MISSION_DETAIL'
      );
    } catch (e) {
      console.error('Failed to save question attempt:', e);
    }
  }

  static getAttempts(studentId: string, missionId?: string): QuestionAttempt[] {
    try {
      const key = `${STORAGE_KEYS.ATTEMPTS}${studentId}`;
      const data = localStorage.getItem(key);
      const attempts: QuestionAttempt[] = data ? JSON.parse(data) : [];
      if (missionId) {
        return attempts.filter(a => a.missionId === missionId);
      }
      return attempts;
    } catch (e) {
      console.error('Failed to get attempts:', e);
      return [];
    }
  }

  // --- Mission Results ---
  static saveMissionResult(result: MissionResult): void {
    try {
      const results = this.getMissionResults(result.studentId);
      const existingIdx = results.findIndex(r => r.missionId === result.missionId);
      if (existingIdx >= 0) {
        results[existingIdx] = result;
      } else {
        results.push(result);
      }
      const key = `${STORAGE_KEYS.MISSION_RESULTS}${result.studentId}`;
      localStorage.setItem(key, JSON.stringify(results));

      // Also update progress completed missions and sync points
      const progress = this.getProgress(result.studentId);
      if (progress) {
        if (!progress.completedMissionIds.includes(result.missionId)) {
          progress.completedMissionIds.push(result.missionId);
        }
        progress.lastUpdated = new Date().toISOString();
        this.saveProgress(progress);
        this.syncProgressPoints(result.studentId);
      }

      // Sync to cloud
      CloudStorageService.saveMissionResult(result).catch(err => console.warn('Cloud save mission result error:', err));

      // Trigger Google Sheets live event
      const currentStudent = this.getStudent();
      GoogleSheetsService.logSystemEvent(
        'ทำภารกิจสำเร็จ (Mission Completed)',
        `สำเร็จภารกิจ ${result.missionId.toUpperCase()} คะแนน: ${result.score}/${result.maxScore}`,
        currentStudent,
        'RESULT'
      );
    } catch (e) {
      console.error('Failed to save mission result:', e);
    }
  }

  static getMissionResults(studentId: string): MissionResult[] {
    try {
      const key = `${STORAGE_KEYS.MISSION_RESULTS}${studentId}`;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to get mission results:', e);
      return [];
    }
  }

  // --- Evidences ---
  static saveEvidence(evidence: Evidence): void {
    try {
      const evidences = this.getEvidences(evidence.studentId);
      const existingIdx = evidences.findIndex(e => e.id === evidence.id);
      if (existingIdx >= 0) {
        evidences[existingIdx] = evidence;
      } else {
        evidences.push(evidence);
      }
      const key = `${STORAGE_KEYS.EVIDENCES}${evidence.studentId}`;
      localStorage.setItem(key, JSON.stringify(evidences));

      // Sync to cloud
      CloudStorageService.saveEvidence(evidence).catch(err => console.warn('Cloud save evidence error:', err));
    } catch (e) {
      console.error('Failed to save evidence:', e);
    }
  }

  static getEvidences(studentId: string): Evidence[] {
    try {
      const key = `${STORAGE_KEYS.EVIDENCES}${studentId}`;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to get evidences:', e);
      return [];
    }
  }

  // --- Assessment Results (Baseline / Post-test) ---
  static saveAssessmentResult(result: AssessmentResult): void {
    try {
      const key = `${STORAGE_KEYS.ASSESSMENTS}${result.studentId}`;
      const data = localStorage.getItem(key);
      const list: AssessmentResult[] = data ? JSON.parse(data) : [];
      const idx = list.findIndex(a => a.type === result.type);
      if (idx >= 0) {
        list[idx] = result;
      } else {
        list.push(result);
      }
      localStorage.setItem(key, JSON.stringify(list));

      // Update student progress
      const progress = this.getProgress(result.studentId);
      if (progress) {
        if (result.type === 'BASELINE') {
          progress.baselineStatus = 'COMPLETED';
          progress.baselineScore = result.score;
        } else if (result.type === 'POST_TEST') {
          progress.postTestStatus = 'COMPLETED';
          progress.postTestScore = result.score;
        }
        progress.lastUpdated = new Date().toISOString();
        this.saveProgress(progress);
        this.syncProgressPoints(result.studentId);
      }

      // Sync to cloud
      CloudStorageService.saveAssessmentResult(result).catch(err => console.warn('Cloud save assessment error:', err));

      // Trigger Google Sheets live event
      const currentStudent = this.getStudent();
      GoogleSheetsService.logSystemEvent(
        `ทำแบบประเมินเสร็จสิ้น (${result.type})`,
        `ทำแบบทดสอบ ${result.type === 'BASELINE' ? 'ก่อนเรียน (Pre-test)' : 'หลังเรียน (Post-test)'} ได้ ${result.score}/${result.maxScore} คะแนน`,
        currentStudent,
        'ASSESSMENT'
      );
    } catch (e) {
      console.error('Failed to save assessment result:', e);
    }
  }

  static getAssessmentResults(studentId: string): AssessmentResult[] {
    try {
      const key = `${STORAGE_KEYS.ASSESSMENTS}${studentId}`;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to get assessment results:', e);
      return [];
    }
  }

  // --- AI Helper Usage Logging ---
  static saveAILog(log: AIUsageLog): void {
    try {
      const key = `${STORAGE_KEYS.AI_LOGS}${log.studentId}`;
      const data = localStorage.getItem(key);
      const list: AIUsageLog[] = data ? JSON.parse(data) : [];
      list.push(log);
      localStorage.setItem(key, JSON.stringify(list));

      // Sync to cloud
      CloudStorageService.saveAILog(log).catch(err => console.warn('Cloud save AI log error:', err));

      // Trigger Google Sheets live event
      const currentStudent = this.getStudent();
      const lastQuery = log.aiQueries && log.aiQueries.length > 0 ? log.aiQueries[log.aiQueries.length - 1] : null;
      GoogleSheetsService.logSystemEvent(
        'ขอคำแนะนำจาก AI Helper',
        lastQuery ? `คำถาม: "${lastQuery.query.slice(0, 40)}..."` : 'เปิดใช้งานผู้ช่วย AI',
        currentStudent,
        'AI_HELPER'
      );
    } catch (e) {
      console.error('Failed to save AI log:', e);
    }
  }

  static getAILogs(studentId: string): AIUsageLog[] {
    try {
      const key = `${STORAGE_KEYS.AI_LOGS}${studentId}`;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to get AI logs:', e);
      return [];
    }
  }

  // --- Aggregated Read-Only Helpers for Teacher Mode ---
  static getAllStudentProgresses(): Record<string, StudentProgress> {
    const students = this.getAllStudents();
    const result: Record<string, StudentProgress> = {};
    students.forEach(s => {
      const p = this.getProgress(s.studentId);
      if (p) result[s.studentId] = p;
    });
    return result;
  }

  static getAllStudentEvidences(): Evidence[] {
    const all: Evidence[] = [];
    const seenIds = new Set<string>();

    // 1. Collect from known students
    const students = this.getAllStudents();
    students.forEach(s => {
      const evs = this.getEvidences(s.studentId);
      evs.forEach(e => {
        if (!seenIds.has(e.id)) {
          seenIds.add(e.id);
          all.push(e);
        }
      });
    });

    // 2. Also scan any evidence keys in localStorage directly to prevent data loss
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(STORAGE_KEYS.EVIDENCES)) {
          const raw = localStorage.getItem(key);
          if (raw) {
            const parsed: Evidence[] = JSON.parse(raw);
            if (Array.isArray(parsed)) {
              parsed.forEach(e => {
                if (e && e.id && !seenIds.has(e.id)) {
                  seenIds.add(e.id);
                  all.push(e);
                }
              });
            }
          }
        }
      }
    } catch {
      // Ignore scan error
    }

    return all;
  }

  static getAllStudentAILogs(): AIUsageLog[] {
    const students = this.getAllStudents();
    const all: AIUsageLog[] = [];
    students.forEach(s => {
      const logs = this.getAILogs(s.studentId);
      all.push(...logs);
    });
    return all;
  }

  static getAllStudentAssessments(): AssessmentResult[] {
    const students = this.getAllStudents();
    const all: AssessmentResult[] = [];
    students.forEach(s => {
      const tests = this.getAssessmentResults(s.studentId);
      all.push(...tests);
    });
    return all;
  }

  static getAllStudentMissionResults(): MissionResult[] {
    const students = this.getAllStudents();
    const all: MissionResult[] = [];
    students.forEach(s => {
      const ms = this.getMissionResults(s.studentId);
      all.push(...ms);
    });
    return all;
  }

  static getAllStudentAttempts(): QuestionAttempt[] {
    const students = this.getAllStudents();
    const all: QuestionAttempt[] = [];
    students.forEach(s => {
      const atts = this.getAttempts(s.studentId);
      all.push(...atts);
    });
    return all;
  }

  // --- Master Cloud Sync for Teacher Mode (Pull from Cloud to LocalStorage) ---
  static async syncAllFromCloud(): Promise<{ studentCount: number; timestamp: string }> {
    try {
      const [
        cloudAccounts,
        cloudStudents,
        cloudProgresses,
        cloudAttempts,
        cloudResults,
        cloudEvidences,
        cloudAssessments,
        cloudAILogs,
        cloudMappings
      ] = await Promise.all([
        CloudStorageService.getAllAccounts(),
        CloudStorageService.getAllStudents(),
        CloudStorageService.getAllProgresses(),
        CloudStorageService.getAllAttempts(),
        CloudStorageService.getAllMissionResults(),
        CloudStorageService.getAllEvidences(),
        CloudStorageService.getAllAssessments(),
        CloudStorageService.getAllAILogs(),
        CloudStorageService.getAllTeacherMappings()
      ]);

      // Merge Accounts
      if (cloudAccounts.length > 0) {
        const localAccounts = this.getAllAccounts();
        const accountMap = new Map<string, StudentAccount>();
        localAccounts.forEach(a => accountMap.set(a.studentId, a));
        cloudAccounts.forEach(a => accountMap.set(a.studentId, a));
        localStorage.setItem(STORAGE_KEYS.STUDENT_ACCOUNTS, JSON.stringify(Array.from(accountMap.values())));
      }

      // Merge Students
      if (cloudStudents.length > 0) {
        const localStudents = this.getAllStudents();
        const studentMap = new Map<string, Student>();
        localStudents.forEach(s => studentMap.set(s.studentId, s));
        cloudStudents.forEach(s => studentMap.set(s.studentId, s));
        localStorage.setItem(STORAGE_KEYS.STUDENTS_LIST, JSON.stringify(Array.from(studentMap.values())));
      }

      // Save Progresses
      Object.entries(cloudProgresses).forEach(([studentId, progress]) => {
        if (progress) {
          const key = `${STORAGE_KEYS.STUDENT_PROGRESS}${studentId}`;
          localStorage.setItem(key, JSON.stringify(progress));
        }
      });

      // Save Attempts
      if (cloudAttempts.length > 0) {
        const studentAttemptsMap = new Map<string, QuestionAttempt[]>();
        cloudAttempts.forEach(att => {
          if (!studentAttemptsMap.has(att.studentId)) {
            studentAttemptsMap.set(att.studentId, []);
          }
          studentAttemptsMap.get(att.studentId)!.push(att);
        });
        studentAttemptsMap.forEach((atts, studentId) => {
          const key = `${STORAGE_KEYS.ATTEMPTS}${studentId}`;
          localStorage.setItem(key, JSON.stringify(atts));
        });
      }

      // Save Mission Results
      if (cloudResults.length > 0) {
        const studentResultsMap = new Map<string, MissionResult[]>();
        cloudResults.forEach(res => {
          if (!studentResultsMap.has(res.studentId)) {
            studentResultsMap.set(res.studentId, []);
          }
          studentResultsMap.get(res.studentId)!.push(res);
        });
        studentResultsMap.forEach((results, studentId) => {
          const key = `${STORAGE_KEYS.MISSION_RESULTS}${studentId}`;
          localStorage.setItem(key, JSON.stringify(results));
        });
      }

      // Save Evidences
      if (cloudEvidences.length > 0) {
        const studentEvidencesMap = new Map<string, Evidence[]>();
        cloudEvidences.forEach(ev => {
          if (!studentEvidencesMap.has(ev.studentId)) {
            studentEvidencesMap.set(ev.studentId, []);
          }
          studentEvidencesMap.get(ev.studentId)!.push(ev);
        });
        studentEvidencesMap.forEach((evs, studentId) => {
          const key = `${STORAGE_KEYS.EVIDENCES}${studentId}`;
          localStorage.setItem(key, JSON.stringify(evs));
        });
      }

      // Save Assessments
      if (cloudAssessments.length > 0) {
        const studentAssessmentsMap = new Map<string, AssessmentResult[]>();
        cloudAssessments.forEach(ass => {
          if (!studentAssessmentsMap.has(ass.studentId)) {
            studentAssessmentsMap.set(ass.studentId, []);
          }
          studentAssessmentsMap.get(ass.studentId)!.push(ass);
        });
        studentAssessmentsMap.forEach((assessments, studentId) => {
          const key = `${STORAGE_KEYS.ASSESSMENTS}${studentId}`;
          localStorage.setItem(key, JSON.stringify(assessments));
        });
      }

      // Save AI Logs
      if (cloudAILogs.length > 0) {
        const studentLogsMap = new Map<string, AIUsageLog[]>();
        cloudAILogs.forEach(log => {
          if (!studentLogsMap.has(log.studentId)) {
            studentLogsMap.set(log.studentId, []);
          }
          studentLogsMap.get(log.studentId)!.push(log);
        });
        studentLogsMap.forEach((logs, studentId) => {
          const key = `${STORAGE_KEYS.AI_LOGS}${studentId}`;
          localStorage.setItem(key, JSON.stringify(logs));
        });
      }

      // Save Mappings
      if (Object.keys(cloudMappings).length > 0) {
        const localMappings = this.getTeacherMappings();
        const mergedMappings = { ...localMappings, ...cloudMappings };
        localStorage.setItem(STORAGE_KEYS.TEACHER_MAPPINGS, JSON.stringify(mergedMappings));
      }

      const totalStudents = this.getAllStudents().length;
      return {
        studentCount: totalStudents,
        timestamp: new Date().toLocaleTimeString('th-TH')
      };
    } catch (e) {
      console.error('Failed to sync all from cloud:', e);
      return {
        studentCount: this.getAllStudents().length,
        timestamp: new Date().toLocaleTimeString('th-TH')
      };
    }
  }

  // --- Demo Seeding & Data Reset ---
  static seedComprehensiveEvidences(): Evidence[] {
    // 1. Ensure we have representative students
    let students = this.getAllStudents();
    if (students.length === 0) {
      const sampleStudents: Student[] = [
        {
          studentId: 'std_demo_001',
          firstName: 'สมชาย',
          lastName: 'ใจดี',
          nickname: 'นักสืบชาย',
          studentNumber: '01',
          gradeLevel: 'ม.2/1',
          registeredAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString()
        },
        {
          studentId: 'std_demo_002',
          firstName: 'กานดา',
          lastName: 'สุขใจ',
          nickname: 'นักสืบกานดา',
          studentNumber: '02',
          gradeLevel: 'ม.2/1',
          registeredAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString()
        },
        {
          studentId: 'std_demo_003',
          firstName: 'ธนพล',
          lastName: 'มุ่งมั่น',
          nickname: 'นักสืบพล',
          studentNumber: '03',
          gradeLevel: 'ม.2/2',
          registeredAt: new Date(Date.now() - 3600000 * 24 * 1).toISOString()
        }
      ];
      sampleStudents.forEach(s => this.saveStudent(s));
      students = sampleStudents;
    }

    const s1 = students[0].studentId;
    const s2 = students[1] ? students[1].studentId : s1;
    const s3 = students[2] ? students[2].studentId : s1;

    const sampleEvidences: Evidence[] = [
      // --- Mission 1 (ข่าวลือปิดโรงเรียน) ---
      {
        id: `ev_m1_${Date.now()}_01`,
        studentId: s1,
        missionId: 'm1',
        questionId: 'q1_single',
        indicatorId: 'T1',
        type: 'AUTHOR',
        title: 'SC01: ตรวจสอบผู้ส่งสารในแชทกลุ่มไลน์',
        content: 'พบข้อความส่งต่อ "ด่วนที่สุด! โรงเรียนจะสั่งปิด 1 สัปดาห์" จากผู้ใช้ไม่ระบุชื่อชัดเจนและไม่มีตราประทับทางการของโรงเรียน',
        sourceTag: 'Line Group Chat - ข่าวสารห้อง ม.2',
        score: 10,
        maxScore: 10,
        isVerified: true,
        timestamp: new Date(Date.now() - 3600000 * 18).toISOString()
      },
      {
        id: `ev_m1_${Date.now()}_02`,
        studentId: s1,
        missionId: 'm1',
        questionId: 'q2_date',
        indicatorId: 'T2',
        type: 'DATE',
        title: 'SC02: ตรวจสอบวันที่ในภาพประกาศที่ถูกแชร์',
        content: 'พบว่าประกาศที่ถูกส่งต่อเป็นเอกสารเก่าของปีการศึกษา 2566 นำมาแชร์ซ้ำทำให้เกิดความเข้าใจผิดว่าเกิดขึ้นในสัปดาห์นี้',
        sourceTag: 'Facebook School Page Archive',
        score: 10,
        maxScore: 10,
        isVerified: true,
        timestamp: new Date(Date.now() - 3600000 * 17).toISOString()
      },
      {
        id: `ev_m1_${Date.now()}_03`,
        studentId: s2,
        missionId: 'm1',
        questionId: 'q3_compare',
        indicatorId: 'T3',
        type: 'COMPARISON',
        title: 'SC03: เปรียบเทียบแถลงการณ์บนเว็บไซต์ทางการ',
        content: 'ตรวจสอบเทียบกับเว็บไซต์ทางการของโรงเรียน พบประกาศยืนยันว่า "จัดการเรียนการสอนตามปกติ ไม่มีการสั่งปิดโรงเรียนแต่อย่างใด"',
        sourceTag: 'www.school.ac.th/official-announcement',
        score: 10,
        maxScore: 10,
        isVerified: true,
        timestamp: new Date(Date.now() - 3600000 * 16).toISOString()
      },
      {
        id: `ev_m1_${Date.now()}_04`,
        studentId: s2,
        missionId: 'm1',
        questionId: 'q4_decision',
        indicatorId: 'T4',
        type: 'DECISION',
        title: 'สรุปสำนวนคดีข่าวลือปิดโรงเรียน (Case Verdict M1)',
        content: 'ข่าวลือเรื่องการปิดโรงเรียนเป็น "ข่าวปลอม (Fake News)" ที่เกิดจากการนำรูปภาพเก่ามาตัดต่อและกระจายต่อเพื่อเรียกยอดแชร์ในกลุ่มแชท',
        sourceTag: 'Detective Final Report M1',
        score: 10,
        maxScore: 10,
        isVerified: true,
        timestamp: new Date(Date.now() - 3600000 * 15).toISOString()
      },

      // --- Mission 2 (น้ำวิเศษปราบมะเร็ง) ---
      {
        id: `ev_m2_${Date.now()}_01`,
        studentId: s1,
        missionId: 'm2',
        questionId: 'q5_claim',
        indicatorId: 'C1',
        type: 'CLAIM',
        title: 'SC04: วิเคราะห์ข้ออ้างสรรพคุณเกินจริง',
        content: 'โฆษณาอ้างว่า "น้ำหมักชีวภาพสูตรพิเศษดื่มแล้วรักษามะเร็งหายขาดภายใน 3 วัน" ซึ่งขัดกับหลักการแพทย์และไม่มีผลการทดลองทางคลินิกรองรับ',
        sourceTag: 'TikTok Viral Health Video Clip',
        score: 10,
        maxScore: 10,
        isVerified: true,
        timestamp: new Date(Date.now() - 3600000 * 12).toISOString()
      },
      {
        id: `ev_m2_${Date.now()}_02`,
        studentId: s2,
        missionId: 'm2',
        questionId: 'q6_fda',
        indicatorId: 'C2',
        type: 'SOURCE',
        title: 'SC05: ตรวจสอบเลข อย. ในฐานข้อมูลระบบสารสนเทศ',
        content: 'ค้นหาเลขที่จดแจ้ง อย. ในระบบ e-Submission ของสำนักงานคณะกรรมการอาหารและยา พบว่าเป็นเลขปลอมที่สวมรอยผลิตภัณฑ์น้ำผลไม้ชนิดอื่น',
        sourceTag: 'FDA Thailand Official Registry Database',
        score: 10,
        maxScore: 10,
        isVerified: true,
        timestamp: new Date(Date.now() - 3600000 * 11).toISOString()
      },
      {
        id: `ev_m2_${Date.now()}_03`,
        studentId: s3,
        missionId: 'm2',
        questionId: 'q7_doctor',
        indicatorId: 'C3',
        type: 'REASON',
        title: 'SC06: ข้อเท็จจริงและคำเตือนจากแพทย์ผู้เชี่ยวชาญ',
        content: 'แพทย์ผู้เชี่ยวชาญระบุว่าการดื่มน้ำหมักที่ไม่ผ่านการฆ่าเชื้ออาจทำให้ติดเชื้อในกระแสเลือด กรดเกินในกระเพาะ และเป็นอันตรายร้ายแรงถึงชีวิต',
        sourceTag: 'แถลงการณ์กรมการแพทย์และสมาคมมะเร็งวิทยา',
        score: 10,
        maxScore: 10,
        isVerified: true,
        timestamp: new Date(Date.now() - 3600000 * 10).toISOString()
      },
      {
        id: `ev_m2_${Date.now()}_04`,
        studentId: s3,
        missionId: 'm2',
        questionId: 'q8_revision',
        indicatorId: 'C4',
        type: 'REVISION',
        title: 'การปรับเปลี่ยนข้อสรุปหลังได้รับข้อมูลผลตรวจแล็บ',
        content: 'ตอนแรกเชื่อว่าอาจเป็นสมุนไพรพื้นบ้านที่ปลอดภัย แต่เมื่อเห็นผลตรวจแล็บที่พบสารปนเปื้อนโลหะหนักและเชื้อแบคทีเรีย จึงปรับข้อสรุปเป็นผลิตภัณฑ์อันตรายห้ามดื่มเด็ดขาด',
        sourceTag: 'Scientific Laboratory Report',
        score: 10,
        maxScore: 10,
        isVerified: true,
        timestamp: new Date(Date.now() - 3600000 * 9).toISOString()
      },

      // --- Mission 3 (คลิปตัดต่อแฉอาจารย์) ---
      {
        id: `ev_m3_${Date.now()}_01`,
        studentId: s1,
        missionId: 'm3',
        questionId: 'q9_video_cut',
        indicatorId: 'E1',
        type: 'PROCESS',
        title: 'SC07: ตรวจสอบความผิดปกติของภาพและเสียง (Deepfake/Cut)',
        content: 'พบรอยต่อของคลื่นเสียงที่ถูกตัดแปะในวินาทีที่ 0:14 และระดับแสงเงาบริเวณใบหน้าที่ไม่สัมพันธ์กับการเคลื่อนไหวในคลิปวิดีโอ',
        sourceTag: 'Digital Video Forensic Inspection',
        score: 10,
        maxScore: 10,
        isVerified: true,
        timestamp: new Date(Date.now() - 3600000 * 6).toISOString()
      },
      {
        id: `ev_m3_${Date.now()}_02`,
        studentId: s2,
        missionId: 'm3',
        questionId: 'q10_cctv',
        indicatorId: 'E2',
        type: 'COMPARISON',
        title: 'SC08: เปรียบเทียบกับคลิปฉบับเต็มจากกล้องวงจรปิด',
        content: 'เมื่อนำคลิปที่ถูกแชร์มาเทียบกับกล้องวงจรปิดของโรงเรียน พบว่าอาจารย์กำลังสาธิตการแสดงในบทเรียน ไม่ได้กำลังดุด่านักเรียนอย่างที่ถูกตัดต่อบิดเบือน',
        sourceTag: 'School CCTV High-Definition Archive',
        score: 10,
        maxScore: 10,
        isVerified: true,
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString()
      },
      {
        id: `ev_m3_${Date.now()}_03`,
        studentId: s3,
        missionId: 'm3',
        questionId: 'q11_account',
        indicatorId: 'E3',
        type: 'AUTHOR',
        title: 'SC09: ตรวจสอบบัญชีผู้โพสต์คลิปแฉในโซเชียลมีเดีย',
        content: 'บัญชีผู้โพสต์เป็นบัญชีอวตาร (Anonymous Account) สร้างขึ้นมาใหม่เพียง 2 ชั่วโมงก่อนปล่อยคลิป และไม่มีประวัติการโพสต์ข้อความอื่นใด',
        sourceTag: 'X (Twitter) Profile Forensic Audit',
        score: 10,
        maxScore: 10,
        isVerified: true,
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString()
      },
      {
        id: `ev_m3_${Date.now()}_04`,
        studentId: s2,
        missionId: 'm3',
        questionId: 'q12_student_voice',
        indicatorId: 'E4',
        type: 'STUDENT_VOICE',
        title: 'เสียงสะท้อนนักเรียนหลังผ่านภารกิจสืบสวน',
        content: 'ได้เรียนรู้ว่าไม่ควรแชร์หรือคอมเมนต์ด่าทอตามกระแสโซเชียล เพราะภาพและเสียงสามารถตัดต่อบิดเบือนได้ ต้องหาคลิปฉบับเต็มและพยานแวดล้อมก่อนเสมอ',
        sourceTag: 'Detective Reflection & Ethics Log',
        score: 10,
        maxScore: 10,
        isVerified: true,
        timestamp: new Date(Date.now() - 3600000 * 3).toISOString()
      },

      // --- Mission 4 (ภารกิจตัดสินความจริง) ---
      {
        id: `ev_m4_${Date.now()}_01`,
        studentId: s1,
        missionId: 'm4',
        questionId: 'q13_witness',
        indicatorId: 'S1',
        type: 'SOURCE',
        title: 'SC10: การรวบรวมหลักฐานปฐมภูมิจากพื้นที่เกิดเหตุ',
        content: 'บันทึกคำให้การของพยานบุคคล 3 คนที่อยู่ในเหตุการณ์จริง ระบุตรงกันว่าไม่ได้มีเหตุการณ์รุนแรงตามที่เพจข่าวท้องถิ่นโพสต์สร้างกระแส',
        sourceTag: 'Primary Witness Interview Transcript',
        score: 10,
        maxScore: 10,
        isVerified: true,
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
      },
      {
        id: `ev_m4_${Date.now()}_02`,
        studentId: s2,
        missionId: 'm4',
        questionId: 'q14_bias',
        indicatorId: 'S2',
        type: 'REASON',
        title: 'SC11: ตรวจสอบผลประโยชน์ทับซ้อนและเจตนาแอบแฝง',
        content: 'พบว่าเพจที่ปล่อยข่าวลือมีการแทรกแบนเนอร์โฆษณาเว็บพนันออนไลน์และขายสินค้า เพื่อหาผลประโยชน์จากยอดเข้าชมและการแชร์ (Clickbait Marketing)',
        sourceTag: 'Page Commercial Monetization Audit',
        score: 10,
        maxScore: 10,
        isVerified: true,
        timestamp: new Date(Date.now() - 3600000 * 1).toISOString()
      },
      {
        id: `ev_m4_${Date.now()}_03`,
        studentId: s3,
        missionId: 'm4',
        questionId: 'q15_master',
        indicatorId: 'G1',
        type: 'DECISION',
        title: 'คำแถลงปิดคดีสืบสวนความจริงระดับปรมาจารย์ (Master Verdict)',
        content: 'สังเคราะห์ข้อมูลจาก 4 มิติ (ผู้ส่งสาร, วันที่, แหล่งอ้างอิง, และผลตรวจทางวิทยาศาสตร์) สรุปเป็นสำนวนคดีส่งมอบให้โรงเรียนและชุมชน',
        sourceTag: 'Master Detective Comprehensive Verdict',
        score: 10,
        maxScore: 10,
        isVerified: true,
        timestamp: new Date().toISOString()
      }
    ];

    sampleEvidences.forEach(e => {
      this.saveEvidence(e);
    });

    return sampleEvidences;
  }

  static seedDemoData(): void {
    this.seedComprehensiveEvidences();
  }

  static resetAllData(): void {
    try {
      localStorage.clear();
    } catch (e) {
      console.error('Failed to clear storage:', e);
    }
  }
}
