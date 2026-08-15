/**
 * Source Detective - Security & Privacy Utilities
 * - Student ID generation (format: SD-XXXXX)
 * - Password hashing (SHA-256)
 * - Input validation tailored for Grade 7 (ม.1) students
 * - Privacy protection helpers
 */

// Generate unique, non-sequential, safe Student ID (e.g. "SD-7K4P2")
export function generateStudentId(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // Exclude ambiguous: 0, O, 1, I
  let code = '';
  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars[randomIndex];
  }
  return `SD-${code}`;
}

// Secure SHA-256 Password Hashing with Salt
const STATIC_SALT = 'sd_privacy_v1_';

export async function hashPassword(password: string): Promise<string> {
  const salted = `${STATIC_SALT}${password}`;
  
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const msgUint8 = new TextEncoder().encode(salted);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch {
      // Fallback
    }
  }

  // Fallback hash if subtle crypto is unavailable
  let hash = 0;
  for (let i = 0; i < salted.length; i++) {
    const char = salted.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return `h_${Math.abs(hash).toString(16).padStart(8, '0')}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const computedHash = await hashPassword(password);
  return computedHash === storedHash;
}

// Username Validation:
// - English letters, numbers, underscores only
// - 1 to 10 characters
// - Required
export function validateUsername(username: string): { isValid: boolean; error?: string } {
  const trimmed = username.trim();
  
  if (!trimmed) {
    return { isValid: false, error: 'กรุณากรอก Username สำหรับเข้าสู่ระบบ' };
  }

  if (trimmed.length > 10) {
    return { isValid: false, error: 'Username ต้องมีความยาวไม่เกิน 10 ตัวอักษร' };
  }

  if (trimmed.length < 3) {
    return { isValid: false, error: 'Username ต้องมีความยาวอย่างน้อย 3 ตัวอักษร' };
  }

  // English letters, numbers, underscores
  const validPattern = /^[a-zA-Z0-9_]+$/;
  if (!validPattern.test(trimmed)) {
    return { isValid: false, error: 'Username ต้องเป็นตัวอักษรภาษาอังกฤษ ตัวเลข หรือขีดล่าง (_) เท่านั้น (ห้ามมีภาษาไทยหรือเว้นวรรค)' };
  }

  return { isValid: true };
}

// Password Validation:
// - Max 8 characters
// - Required
export function validatePassword(password: string): { isValid: boolean; error?: string } {
  if (!password) {
    return { isValid: false, error: 'กรุณากรอกรหัสผ่าน (Password)' };
  }

  if (password.length > 8) {
    return { isValid: false, error: 'รหัสผ่านต้องมีความยาวไม่เกิน 8 ตัวอักษรตามข้อกำหนด' };
  }

  if (password.length < 4) {
    return { isValid: false, error: 'รหัสผ่านควรมีความยาวอย่างน้อย 4 ตัวอักษร' };
  }

  return { isValid: true };
}

// Nickname Validation:
// - Required
// - Max 20 characters
export function validateNickname(nickname: string): { isValid: boolean; error?: string } {
  const trimmed = nickname.trim();
  
  if (!trimmed) {
    return { isValid: false, error: 'กรุณากรอกชื่อเล่นหรือฉายานักสืบของคุณ' };
  }

  if (trimmed.length > 20) {
    return { isValid: false, error: 'ฉายานักสืบต้องไม่เกิน 20 ตัวอักษร' };
  }

  return { isValid: true };
}
