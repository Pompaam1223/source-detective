import { TeacherSession, TeacherAccessResult, UserRole } from '../types';

const TEACHER_SESSION_KEY = 'sd_teacher_auth_session';
const TEACHER_FAIL_COUNT_KEY = 'sd_teacher_fail_attempts';

export class TeacherAuthService {
  /**
   * Check if current browser has an active, non-expired Teacher session
   */
  static isAuthenticated(): boolean {
    const session = this.getSession();
    if (!session) return false;
    if (session.role !== 'TEACHER') return false;
    if (typeof session.expiresAt === 'number' && Date.now() > session.expiresAt) {
      this.logout();
      return false;
    }
    return true;
  }

  /**
   * Get current User Role (STUDENT vs TEACHER)
   */
  static getCurrentRole(): UserRole {
    return this.isAuthenticated() ? 'TEACHER' : 'STUDENT';
  }

  /**
   * Retrieve active Teacher Session from sessionStorage or localStorage
   */
  static getSession(): TeacherSession | null {
    try {
      const raw = sessionStorage.getItem(TEACHER_SESSION_KEY) || localStorage.getItem(TEACHER_SESSION_KEY);
      if (!raw) return null;
      const parsed: TeacherSession = JSON.parse(raw);
      if (parsed && parsed.role === 'TEACHER' && parsed.token) {
        if (typeof parsed.expiresAt === 'number' && Date.now() > parsed.expiresAt) {
          this.logout();
          return null;
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Save Teacher Session to both storages for stable persistence
   */
  private static saveSession(session: TeacherSession): void {
    try {
      const serialized = JSON.stringify(session);
      sessionStorage.setItem(TEACHER_SESSION_KEY, serialized);
      localStorage.setItem(TEACHER_SESSION_KEY, serialized);
    } catch (e) {
      console.warn('Failed to persist teacher session:', e);
    }
  }

  /**
   * Authenticate with Teacher Access Code
   */
  static async authenticate(accessCode: string): Promise<TeacherAccessResult> {
    if (!accessCode || !accessCode.trim()) {
      return {
        success: false,
        error: 'กรุณากรอก Teacher Access Code'
      };
    }

    // Check client-side rate limiting / cooldown
    const lockInfo = this.getLockoutInfo();
    if (lockInfo.isLocked) {
      return {
        success: false,
        error: `มีการพยายามเข้าถึงผิดพลาดหลายครั้ง กรุณารอ ${lockInfo.remainingSeconds} วินาที`,
        locked: true,
        remainingSeconds: lockInfo.remainingSeconds
      };
    }

    const normalizedInput = accessCode.trim().toUpperCase();
    const VALID_CODES = [
      'TEACHER@SD2026',
      'TEACHER2026',
      'TEACHER-SD-2025',
      'TEACHER2025',
      'TEACHER',
      'ADMIN',
      'SD2026',
      'SD-2026',
      'DETECTIVE_TEACHER_2025',
      'DETECTIVE'
    ];

    // 1. Direct validation against recognized Teacher Codes
    if (VALID_CODES.includes(normalizedInput)) {
      this.clearFailedAttempts();
      const expiresAt = Date.now() + 8 * 60 * 60 * 1000; // 8 hours active session
      const staticToken = `client_t_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
      const session: TeacherSession = {
        token: staticToken,
        role: 'TEACHER',
        authenticatedAt: new Date().toISOString(),
        expiresAt
      };
      this.saveSession(session);
      return {
        success: true,
        token: staticToken,
        role: 'TEACHER',
        expiresAt
      };
    }

    // 2. Optional server endpoint fallback
    try {
      const response = await fetch('/api/teacher/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: accessCode.trim() })
      });

      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await response.json();

        if (response.ok && data.success && data.token) {
          this.clearFailedAttempts();
          const session: TeacherSession = {
            token: data.token,
            role: 'TEACHER',
            authenticatedAt: new Date().toISOString(),
            expiresAt: data.expiresAt || (Date.now() + 8 * 60 * 60 * 1000)
          };
          this.saveSession(session);
          return {
            success: true,
            token: data.token,
            role: 'TEACHER',
            expiresAt: session.expiresAt
          };
        }

        if (response.status === 401 || response.status === 429) {
          this.recordFailedAttempt();
          return {
            success: false,
            error: data.error || 'รหัสไม่ถูกต้อง กรุณาลองใหม่',
            locked: data.locked,
            remainingSeconds: data.remainingSeconds
          };
        }
      }
    } catch {
      // Offline or static environment fallback handled above
    }

    // Record failed attempt
    this.recordFailedAttempt();
    return {
      success: false,
      error: 'รหัสไม่ถูกต้อง กรุณาลองใหม่'
    };
  }

  /**
   * Verify active session
   */
  static async verifySession(): Promise<boolean> {
    const session = this.getSession();
    if (!session) return false;

    if (Date.now() > session.expiresAt) {
      this.logout();
      return false;
    }

    return true;
  }

  /**
   * Clear session on Logout
   */
  static logout(): void {
    try {
      sessionStorage.removeItem(TEACHER_SESSION_KEY);
      localStorage.removeItem(TEACHER_SESSION_KEY);
      fetch('/api/teacher/logout', { method: 'POST' }).catch(() => {});
    } catch {
      // Ignore
    }
  }

  // --- Rate limiting helpers ---
  private static getLockoutInfo(): { isLocked: boolean; remainingSeconds: number } {
    try {
      const raw = sessionStorage.getItem(TEACHER_FAIL_COUNT_KEY);
      if (!raw) return { isLocked: false, remainingSeconds: 0 };
      const parsed = JSON.parse(raw);
      if (parsed.lockedUntil && Date.now() < parsed.lockedUntil) {
        return {
          isLocked: true,
          remainingSeconds: Math.ceil((parsed.lockedUntil - Date.now()) / 1000)
        };
      }
      return { isLocked: false, remainingSeconds: 0 };
    } catch {
      return { isLocked: false, remainingSeconds: 0 };
    }
  }

  private static recordFailedAttempt(): void {
    try {
      const raw = sessionStorage.getItem(TEACHER_FAIL_COUNT_KEY);
      let record = { count: 0, lockedUntil: 0 };
      if (raw) record = JSON.parse(raw);

      record.count += 1;
      if (record.count >= 5) {
        record.lockedUntil = Date.now() + 30 * 1000; // 30s lockout
        record.count = 0;
      }
      sessionStorage.setItem(TEACHER_FAIL_COUNT_KEY, JSON.stringify(record));
    } catch {
      // Ignore
    }
  }

  private static clearFailedAttempts(): void {
    try {
      sessionStorage.removeItem(TEACHER_FAIL_COUNT_KEY);
    } catch {
      // Ignore
    }
  }
}
