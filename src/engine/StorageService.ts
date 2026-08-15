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

  static registerAccount(
    nickname: string,
    username: string,
    passwordHash: string
  ): { success: boolean; account?: StudentAccount; student?: Student; error?: string } {
    try {
      const cleanUsername = username.trim().toLowerCase();
      const cleanNickname = nickname.trim();

      // 1. Check uniqueness
      const existing = this.getAccountByUsername(cleanUsername);
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
      this.saveProgress({
        studentId,
        totalPoints: 0,
        maxPossiblePoints: 200,
        completedMissionIds: [],
        baselineStatus: 'NOT_STARTED',
        postTestStatus: 'NOT_STARTED',
        lastUpdated: now
      });

      return { success: true, account: newAccount, student };
    } catch (e) {
      console.error('Failed to register account:', e);
      return { success: false, error: 'เกิดข้อผิดพลาดในการลงทะเบียน กรุณาลองใหม่อีกครั้ง' };
    }
  }

  static login(
    username: string,
    passwordHash: string
  ): { success: boolean; account?: StudentAccount; student?: Student; error?: string } {
    try {
      const cleanUsername = username.trim().toLowerCase();
      const accounts = this.getAllAccounts();
      const accountIdx = accounts.findIndex(a => a.username.toLowerCase() === cleanUsername);

      if (accountIdx === -1) {
        return { success: false, error: 'ไม่พบบัญชีผู้ใช้นี้ กรุณาตรวจสอบ Username หรือสมัครบัญชีใหม่' };
      }

      const account = accounts[accountIdx];
      if (account.passwordHash !== passwordHash) {
        return { success: false, error: 'รหัสผ่าน (Password) ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง' };
      }

      // Update lastLoginAt
      const now = new Date().toISOString();
      account.lastLoginAt = now;
      accounts[accountIdx] = account;
      localStorage.setItem(STORAGE_KEYS.STUDENT_ACCOUNTS, JSON.stringify(accounts));

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

      // 5. If currently active session in student mode matches this student, clear it
      const current = this.getStudent();
      if (current && current.studentId === studentId) {
        this.clearStudent();
      }

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
      // Ensure nickname fallback
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
      
      // Update points and max points
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
    const students = this.getAllStudents();
    const all: Evidence[] = [];
    students.forEach(s => {
      const evs = this.getEvidences(s.studentId);
      all.push(...evs);
    });
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

  // --- Demo Seeding & Data Reset ---
  static seedDemoData(): void {
    const demoStudent: Student = {
      studentId: 'std_demo_001',
      firstName: 'สมชาย',
      lastName: 'ใจดี',
      studentNumber: '101',
      gradeLevel: 'ห้อง 2',
      registeredAt: new Date().toISOString()
    };
    this.saveStudent(demoStudent);

    const demoProgress: StudentProgress = {
      studentId: demoStudent.studentId,
      totalPoints: 28,
      maxPossiblePoints: 200,
      completedMissionIds: ['m1', 'm2'],
      baselineStatus: 'COMPLETED',
      postTestStatus: 'NOT_STARTED',
      baselineScore: 22,
      lastUpdated: new Date().toISOString()
    };
    this.saveProgress(demoProgress);

    const demoEvidences: Evidence[] = [
      {
        id: 'ev_001',
        studentId: demoStudent.studentId,
        missionId: 'm1',
        questionId: 'q1_single',
        indicatorId: 'T1',
        type: 'AUTHOR',
        title: 'ตรวจสอบผู้ส่งสาร',
        content: 'พบข้อความไร้ชื่อผู้ส่งสาร ถูกแชร์ในกลุ่มไลน์ สร้างความเข้าใจผิดเกี่ยวกับการหยุดเรียน',
        sourceTag: 'Line Group Chat',
        isVerified: true,
        timestamp: new Date().toISOString()
      },
      {
        id: 'ev_002',
        studentId: demoStudent.studentId,
        missionId: 'm2',
        questionId: 'q5_evidence',
        indicatorId: 'C3',
        type: 'SOURCE',
        title: 'เปรียบเทียบเอกสารราชการ',
        content: 'บันทึกการประชุมโรงเรียนยืนยันว่าไม่มีการทุบสนามฟุตบอลเพื่อสร้างอาคารจอดรถ',
        sourceTag: 'Official School Board',
        isVerified: true,
        timestamp: new Date().toISOString()
      }
    ];
    demoEvidences.forEach(e => this.saveEvidence(e));
  }

  static resetAllData(): void {
    try {
      localStorage.clear();
    } catch (e) {
      console.error('Failed to clear storage:', e);
    }
  }
}
