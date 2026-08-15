import { getAccessToken } from './googleAuth';
import { StorageService } from '../engine/StorageService';
import { Student, StudentProgress, QuestionAttempt, AIUsageLog, AssessmentResult } from '../types';

export interface SpreadsheetInfo {
  id: string;
  name: string;
  url: string;
  modifiedTime?: string;
}

export interface SyncResult {
  success: boolean;
  message: string;
  summaryCount: number;
  attemptsCount: number;
  systemLogsCount: number;
  aiLogsCount: number;
  spreadsheetUrl: string;
  timestamp: string;
}

const SETTINGS_KEY = 'sd_connected_spreadsheet';

export class GoogleSheetsService {
  // --- Persistent Active Spreadsheet Setting ---
  static getConnectedSpreadsheet(): SpreadsheetInfo | null {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  static setConnectedSpreadsheet(info: SpreadsheetInfo | null): void {
    try {
      if (info) {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(info));
      } else {
        localStorage.removeItem(SETTINGS_KEY);
      }
    } catch (e) {
      console.error('Failed to save connected spreadsheet:', e);
    }
  }

  // --- Helper for authenticated API calls ---
  private static async fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('กรุณาลงชื่อเข้าใช้ด้วย Google Account ก่อนดำเนินการ');
    }

    const headers = {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      let errorMsg = `Google API Error (${res.status} ${res.statusText})`;
      try {
        const errJson = await res.json();
        if (errJson?.error?.message) {
          errorMsg = errJson.error.message;
        }
      } catch {
        // ignore parse error
      }
      throw new Error(errorMsg);
    }

    return res;
  }

  // --- List spreadsheets from Drive ---
  static async listSpreadsheets(): Promise<SpreadsheetInfo[]> {
    const query = encodeURIComponent("mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false");
    const fields = encodeURIComponent('files(id, name, modifiedTime, webViewLink)');
    const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=${fields}&orderBy=modifiedTime desc&pageSize=30`;

    const res = await this.fetchWithAuth(url);
    const data = await res.json();

    return (data.files || []).map((f: any) => ({
      id: f.id,
      name: f.name,
      url: f.webViewLink || `https://docs.google.com/spreadsheets/d/${f.id}/edit`,
      modifiedTime: f.modifiedTime
    }));
  }

  // --- Create a brand new formatted Detective Spreadsheet ---
  static async createDetectiveSpreadsheet(
    customTitle?: string
  ): Promise<SpreadsheetInfo> {
    const title = customTitle || `Source Detective - บันทึกคะแนนและระบบสืบสวน (${new Date().toLocaleDateString('th-TH')})`;

    const requestBody = {
      properties: {
        title: title
      },
      sheets: [
        {
          properties: {
            title: 'สรุปคะแนนนักเรียน',
            gridProperties: { frozenRowCount: 1 }
          }
        },
        {
          properties: {
            title: 'บันทึกการตอบรายข้อ',
            gridProperties: { frozenRowCount: 1 }
          }
        },
        {
          properties: {
            title: 'ประวัติการใช้งานระบบ',
            gridProperties: { frozenRowCount: 1 }
          }
        },
        {
          properties: {
            title: 'บันทึกการใช้ AI',
            gridProperties: { frozenRowCount: 1 }
          }
        }
      ]
    };

    const res = await this.fetchWithAuth('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    });

    const createdData = await res.json();
    const spreadsheetId = createdData.spreadsheetId;
    const spreadsheetUrl = createdData.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

    // Initialize Headers for all 4 sheets
    await this.initializeSheetHeaders(spreadsheetId);

    const info: SpreadsheetInfo = {
      id: spreadsheetId,
      name: title,
      url: spreadsheetUrl,
      modifiedTime: new Date().toISOString()
    };

    this.setConnectedSpreadsheet(info);
    return info;
  }

  // --- Initialize Table Headers ---
  static async initializeSheetHeaders(spreadsheetId: string): Promise<void> {
    const headerData = [
      {
        range: "'สรุปคะแนนนักเรียน'!A1:P1",
        values: [[
          'วัน-เวลาที่อัปเดตล่าสุด',
          'รหัสระบบ (Student ID)',
          'เลขที่ / รหัสประจำตัว',
          'ชื่อ - นามสกุล',
          'ระดับชั้น / ห้อง',
          'แบบประเมินก่อนเรียน Pre-Test (/40)',
          'ภารกิจ M1: ข่าวปลอมโซเชียล (/40)',
          'ภารกิจ M2: สุขภาพแอบอ้าง (/40)',
          'ภารกิจ M3: โฆษณาหลอกลงทุน (/40)',
          'ภารกิจ M4: สิ่งแวดล้อม (/40)',
          'รวมคะแนน 4 ภารกิจ (/160)',
          'แบบประเมินหลังเรียน Post-Test (/40)',
          'คะแนนสะสมรวมทั้งหมด (Total Points)',
          'การพัฒนาทักษะ Learning Gain (%)',
          'ยศนักสืบ (Detective Rank)',
          'สถานะภารกิจครบ'
        ]]
      },
      {
        range: "'บันทึกการตอบรายข้อ'!A1:M1",
        values: [[
          'วัน-เวลาที่ตอบ (Timestamp)',
          'รหัสนักเรียน',
          'ชื่อ - นามสกุล',
          'ระดับชั้น',
          'ภารกิจ / แบบทดสอบ (Mission/Test)',
          'รหัสข้อ (Question ID)',
          'ตัวชี้วัด (Indicator)',
          'คำตอบของนักเรียน (Answer)',
          'ได้คะแนน (Score)',
          'คะแนนเต็ม (Max)',
          'ใช้คำใบ้ (Hint Used)',
          'ใช้ผู้ช่วย AI (AI Used)',
          'ข้อเสนอแนะระบบ (Feedback)'
        ]]
      },
      {
        range: "'ประวัติการใช้งานระบบ'!A1:G1",
        values: [[
          'วัน-เวลา (Timestamp)',
          'รหัสผู้ใช้/นักเรียน',
          'ชื่อผู้ใช้งาน',
          'ประเภทกิจกรรม (Activity)',
          'รายละเอียดกิจกรรม (Details)',
          'หน้าจอ/โมดูล (Screen)',
          'สถานะ (Status)'
        ]]
      },
      {
        range: "'บันทึกการใช้ AI'!A1:G1",
        values: [[
          'วัน-เวลาที่ปรึกษา AI (Timestamp)',
          'รหัสนักเรียน',
          'ชื่อนักเรียน',
          'ภารกิจ / ข้อคำถาม',
          'คำถาม/สิ่งที่ขอคำแนะนำจาก AI (Student Query)',
          'คำชี้แนะจาก AI (AI Guidance Response)',
          'เมนูช่วยคิดที่เลือก (AI Menu Tool)'
        ]]
      }
    ];

    await this.fetchWithAuth(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`,
      {
        method: 'POST',
        body: JSON.stringify({
          valueInputOption: 'USER_ENTERED',
          data: headerData
        })
      }
    );
  }

  // --- Append a real-time System Usage Log ---
  static async logSystemEvent(
    activity: string,
    details: string,
    student?: Student | null,
    screen?: string
  ): Promise<void> {
    const spreadsheet = this.getConnectedSpreadsheet();
    if (!spreadsheet) return;

    try {
      const now = new Date();
      const thaiDateTime = now.toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' });

      const row = [
        thaiDateTime,
        student?.studentNumber || student?.studentId || 'GUEST',
        student ? `${student.firstName} ${student.lastName}` : 'ผู้ใช้งานทั่วไป',
        activity,
        details,
        screen || 'APP',
        'SUCCESS'
      ];

      const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheet.id}/values/'ประวัติการใช้งานระบบ'!A:G:append?valueInputOption=USER_ENTERED`;
      await this.fetchWithAuth(url, {
        method: 'POST',
        body: JSON.stringify({ values: [row] })
      });
    } catch (e) {
      console.warn('Silent fallback: Could not push system log to Google Sheets:', e);
    }
  }

  // --- Full Synchronization of all Student Scores and History ---
  static async syncAllData(spreadsheetId: string): Promise<SyncResult> {
    // 1. Ensure headers exist
    await this.initializeSheetHeaders(spreadsheetId);

    const students = StorageService.getAllStudents();
    const now = new Date();
    const thaiDateTime = now.toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' });

    // Prepare Summary Rows
    const summaryRows: any[][] = [];
    const attemptRows: any[][] = [];
    const aiLogRows: any[][] = [];
    const systemRows: any[][] = [];

    // System sync event
    systemRows.push([
      thaiDateTime,
      'TEACHER_SYSTEM',
      'ระบบศูนย์ข้อมูลครู',
      'ซิงค์คะแนนทั้งหมด',
      `ทำการบันทึกข้อมูลนักเรียน ${students.length} คนขึ้นสู่ Google Sheets`,
      'TEACHER_DASHBOARD',
      'COMPLETED'
    ]);

    for (const std of students) {
      const progress = StorageService.getProgress(std.studentId);
      const missionResults = StorageService.getMissionResults(std.studentId);
      const attempts = StorageService.getAttempts(std.studentId);
      const aiLogs = StorageService.getAILogs(std.studentId);
      const assessments = StorageService.getAssessmentResults(std.studentId);

      const baselineScore = progress?.baselineStatus === 'COMPLETED' ? (progress.baselineScore ?? '-') : 'ยังไม่ทำ';
      const postTestScore = progress?.postTestStatus === 'COMPLETED' ? (progress.postTestScore ?? '-') : 'ยังไม่ทำ';

      const m1Score = missionResults.find(m => m.missionId === 'm1')?.score ?? '-';
      const m2Score = missionResults.find(m => m.missionId === 'm2')?.score ?? '-';
      const m3Score = missionResults.find(m => m.missionId === 'm3')?.score ?? '-';
      const m4Score = missionResults.find(m => m.missionId === 'm4')?.score ?? '-';

      const missionSum = missionResults.reduce((acc, curr) => acc + (curr.score || 0), 0);
      const totalPoints = progress?.totalPoints || 0;

      // Calculate Learning Gain if both pre and post completed
      let learningGain = '-';
      if (typeof baselineScore === 'number' && typeof postTestScore === 'number') {
        const gain = postTestScore - baselineScore;
        const gainPercent = baselineScore < 40 ? Math.round((gain / (40 - baselineScore)) * 100) : 0;
        learningGain = `${gain >= 0 ? '+' : ''}${gain} แต้ม (${gainPercent}%)`;
      }

      // Rank Title
      let rankTitle = 'นักสืบฝึกหัด';
      if (totalPoints >= 180) rankTitle = 'ยอดนักสืบระดับตำนาน (Master Detective)';
      else if (totalPoints >= 140) rankTitle = 'นักสืบระดับชำนาญการ (Senior Detective)';
      else if (totalPoints >= 90) rankTitle = 'นักสืบข่าวสาร (Detective Agent)';
      else if (totalPoints >= 40) rankTitle = 'ผู้ช่วยนักสืบ (Detective Assistant)';

      const completedStatus = (progress?.completedMissionIds.length || 0) >= 4 ? 'ครบ 4 ภารกิจ' : `${progress?.completedMissionIds.length || 0}/4 ภารกิจ`;

      summaryRows.push([
        thaiDateTime,
        std.studentId,
        std.studentNumber || '-',
        `${std.firstName} ${std.lastName}`,
        std.gradeLevel || '-',
        baselineScore,
        m1Score,
        m2Score,
        m3Score,
        m4Score,
        missionSum,
        postTestScore,
        totalPoints,
        learningGain,
        rankTitle,
        completedStatus
      ]);

      // Populate attempts
      for (const att of attempts) {
        let answerStr = '';
        if (typeof att.answer === 'string') answerStr = att.answer;
        else if (att.answer?.selectedOptionId) answerStr = `ตัวเลือก: ${att.answer.selectedOptionId}`;
        else if (att.answer?.decisionChoice) answerStr = `การตัดสิน: ${att.answer.decisionChoice}`;
        else if (att.answer?.shortResponseText) answerStr = att.answer.shortResponseText;
        else answerStr = JSON.stringify(att.answer);

        attemptRows.push([
          new Date(att.timestamp).toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' }),
          std.studentNumber || std.studentId,
          `${std.firstName} ${std.lastName}`,
          std.gradeLevel || '-',
          att.missionId.toUpperCase(),
          att.questionId,
          att.indicatorId,
          answerStr,
          att.score,
          att.maxScore,
          att.hintUsed ? 'ใช่' : 'ไม่',
          att.aiUsed ? 'ใช่' : 'ไม่',
          att.feedbackNote || '-'
        ]);
      }

      // Populate AI Logs
      for (const log of aiLogs) {
        for (const query of (log.aiQueries || [])) {
          aiLogRows.push([
            new Date(query.timestamp).toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' }),
            std.studentNumber || std.studentId,
            `${std.firstName} ${std.lastName}`,
            log.missionId ? log.missionId.toUpperCase() : 'GENERAL',
            query.query,
            query.response,
            query.aiMenuSelected || log.aiMenuSelected || 'AI_HELPER'
          ]);
        }
      }
    }

    // Write Summary Sheet (Overwriting rows starting from A2)
    if (summaryRows.length > 0) {
      await this.fetchWithAuth(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'สรุปคะแนนนักเรียน'!A2:P${summaryRows.length + 1}?valueInputOption=USER_ENTERED`,
        {
          method: 'PUT',
          body: JSON.stringify({ values: summaryRows })
        }
      );
    }

    // Append Question Attempts
    if (attemptRows.length > 0) {
      await this.fetchWithAuth(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'บันทึกการตอบรายข้อ'!A:M:append?valueInputOption=USER_ENTERED`,
        {
          method: 'POST',
          body: JSON.stringify({ values: attemptRows })
        }
      );
    }

    // Append AI Logs
    if (aiLogRows.length > 0) {
      await this.fetchWithAuth(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'บันทึกการใช้ AI'!A:G:append?valueInputOption=USER_ENTERED`,
        {
          method: 'POST',
          body: JSON.stringify({ values: aiLogRows })
        }
      );
    }

    // Append System Log
    if (systemRows.length > 0) {
      await this.fetchWithAuth(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'ประวัติการใช้งานระบบ'!A:G:append?valueInputOption=USER_ENTERED`,
        {
          method: 'POST',
          body: JSON.stringify({ values: systemRows })
        }
      );
    }

    const info = this.getConnectedSpreadsheet();
    const finalUrl = info?.url || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

    return {
      success: true,
      message: `บันทึกข้อมูลนักเรียน ${summaryRows.length} คน, ประวัติคำตอบ ${attemptRows.length} รายการ, บันทึก AI ${aiLogRows.length} รายการ ลง Google Sheets สำเร็จ!`,
      summaryCount: summaryRows.length,
      attemptsCount: attemptRows.length,
      systemLogsCount: systemRows.length,
      aiLogsCount: aiLogRows.length,
      spreadsheetUrl: finalUrl,
      timestamp: thaiDateTime
    };
  }

  // --- Read Back Data from Sheets (for retrospective review) ---
  static async readSheetValues(
    spreadsheetId: string,
    sheetName: string = 'สรุปคะแนนนักเรียน'
  ): Promise<any[][]> {
    const encodedRange = encodeURIComponent(`'${sheetName}'!A1:P100`);
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodedRange}`;
    const res = await this.fetchWithAuth(url);
    const data = await res.json();
    return data.values || [];
  }
}
