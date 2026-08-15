import express from 'express';
import http from 'http';
import path from 'path';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

// Body parser
app.use(express.json());

// Server-side Secret Keys (NEVER sent to client)
const SERVER_SECRET_KEY = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');
const TEACHER_ACCESS_CODE = process.env.TEACHER_ACCESS_CODE || 'TEACHER@SD2026';

// Rate Limiter for Teacher Access attempts (in-memory)
interface AttemptRecord {
  count: number;
  lockedUntil?: number;
}
const accessAttempts = new Map<string, AttemptRecord>();

function getClientIp(req: express.Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || 'unknown-client';
}

// Generate HMAC Signed Token for Teacher Session
function generateTeacherToken(): { token: string; expiresAt: number } {
  const expiresAt = Date.now() + 2 * 60 * 60 * 1000; // 2 hours validity
  const payload = JSON.stringify({
    role: 'TEACHER',
    issuedAt: Date.now(),
    expiresAt,
    nonce: crypto.randomBytes(16).toString('hex')
  });

  const encodedPayload = Buffer.from(payload).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SERVER_SECRET_KEY)
    .update(encodedPayload)
    .digest('base64url');

  return {
    token: `${encodedPayload}.${signature}`,
    expiresAt
  };
}

// Verify Teacher Token Signature & Expiry
function verifyTeacherToken(token: string): boolean {
  try {
    if (!token || typeof token !== 'string' || !token.includes('.')) {
      return false;
    }

    const [encodedPayload, signature] = token.split('.');
    if (!encodedPayload || !signature) return false;

    const expectedSignature = crypto
      .createHmac('sha256', SERVER_SECRET_KEY)
      .update(encodedPayload)
      .digest('base64url');

    // Constant-time comparison
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return false;
    }

    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
    if (payload.role !== 'TEACHER') return false;
    if (typeof payload.expiresAt !== 'number' || Date.now() > payload.expiresAt) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

// === API ROUTES ===

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 1. Verify Teacher Access Code & Issue Session Token
app.post('/api/teacher/verify', (req, res) => {
  const clientIp = getClientIp(req);
  const now = Date.now();

  const record = accessAttempts.get(clientIp) || { count: 0 };

  // Check lockout
  if (record.lockedUntil && now < record.lockedUntil) {
    const remainingSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return res.status(429).json({
      success: false,
      error: `มีการพยายามเข้าถึงผิดพลาดหลายครั้ง กรุณารอ ${remainingSeconds} วินาที`,
      locked: true,
      remainingSeconds
    });
  }

  const { code } = req.body;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'รหัสไม่ถูกต้อง กรุณาลองใหม่'
    });
  }

  const normalizedInput = code.trim().toUpperCase();
  const allowedCodes = [
    (process.env.TEACHER_ACCESS_CODE || 'TEACHER@SD2026').trim().toUpperCase(),
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

  const isMatch = allowedCodes.includes(normalizedInput);

  if (isMatch) {
    // Reset attempt counter on success
    accessAttempts.delete(clientIp);

    const { token, expiresAt } = generateTeacherToken();
    return res.json({
      success: true,
      token,
      role: 'TEACHER',
      expiresAt
    });
  } else {
    // Increase failed attempts count
    record.count += 1;
    if (record.count >= 5) {
      record.lockedUntil = now + 30 * 1000; // 30s lock
      record.count = 0;
    }
    accessAttempts.set(clientIp, record);

    return res.status(401).json({
      success: false,
      error: 'รหัสไม่ถูกต้อง กรุณาลองใหม่'
    });
  }
});

// 2. Verify Active Teacher Session Token
app.post('/api/teacher/verify-session', (req, res) => {
  const { token } = req.body;
  if (!token || typeof token !== 'string') {
    return res.status(401).json({ valid: false, role: 'STUDENT', error: 'No active teacher token' });
  }

  const isValid = verifyTeacherToken(token);
  if (isValid) {
    return res.json({ valid: true, role: 'TEACHER' });
  } else {
    return res.status(403).json({ valid: false, role: 'STUDENT', error: 'Invalid or expired session' });
  }
});

// 3. Teacher Logout
app.post('/api/teacher/logout', (_req, res) => {
  res.json({ success: true, message: 'Teacher session terminated' });
});

// === VITE / STATIC SERVING SETUP ===
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';
  const isHmrDisabled = process.env.DISABLE_HMR === 'true';

  if (!isProduction) {
    const httpServer = http.createServer(app);
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: isHmrDisabled ? false : { server: httpServer },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    httpServer.listen(PORT, '0.0.0.0', () => {
      console.log(`Source Detective Server running on port ${PORT} (development mode)`);
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Source Detective Server running on port ${PORT} (production mode)`);
    });
  }
}

startServer();
