import { NextRequest } from 'next/server';
import { pool } from '@/lib/db';
import crypto from 'crypto';

const SESSION_MAX_AGE_MINUTES = 8 * 60;
const SESSION_IDLE_MINUTES = 30;

export const getClientIp = (request: NextRequest) => {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim();
  return request.headers.get('x-real-ip') || 'unknown';
};

export const createSessionToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

export const ensureAdminSession = async (request: Pick<NextRequest, 'cookies' | 'headers'>) => {
  const sessionCookie = request.cookies.get('admin_session');
  if (!sessionCookie) return null;

  const token = sessionCookie.value;
  const result = await pool.query(
    `SELECT s.id, s.admin_id, s.last_active_at, s.expires_at
     FROM admin_sessions s
     WHERE s.session_token = $1
     LIMIT 1`,
    [token]
  );

  if (result.rows.length === 0) return null;

  const session = result.rows[0];
  const now = new Date();
  const expiresAt = new Date(session.expires_at);
  const lastActive = new Date(session.last_active_at);
  const idleMs = SESSION_IDLE_MINUTES * 60 * 1000;

  if (expiresAt.getTime() < now.getTime()) return null;
  if (now.getTime() - lastActive.getTime() > idleMs) return null;

  await pool.query(
    'UPDATE admin_sessions SET last_active_at = NOW() WHERE id = $1',
    [session.id]
  );

  return session;
};

export const createAdminSession = async (adminId: number, request: NextRequest) => {
  const token = createSessionToken();
  const ip = getClientIp(request);
  const userAgent = request.headers.get('user-agent');
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_MINUTES * 60 * 1000);

  await pool.query(
    `INSERT INTO admin_sessions (admin_id, session_token, ip, user_agent, expires_at)
     VALUES ($1, $2, $3, $4, $5)`,
    [adminId, token, ip, userAgent || null, expiresAt.toISOString()]
  );

  return { token, expiresAt };
};

export const clearAdminSession = async (token: string) => {
  await pool.query('DELETE FROM admin_sessions WHERE session_token = $1', [token]);
};

export const isLoginLocked = async (identifier: string, ip: string) => {
  const result = await pool.query(
    `SELECT attempts, last_attempt_at
     FROM login_attempts
     WHERE identifier = $1 AND ip = $2
     LIMIT 1`,
    [identifier, ip]
  );

  if (result.rows.length === 0) return false;
  const record = result.rows[0];
  const lastAttempt = new Date(record.last_attempt_at);
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;

  if (now - lastAttempt.getTime() > windowMs) {
    await pool.query(
      'DELETE FROM login_attempts WHERE identifier = $1 AND ip = $2',
      [identifier, ip]
    );
    return false;
  }

  return record.attempts >= 5;
};

export const registerLoginAttempt = async (identifier: string, ip: string, success: boolean) => {
  if (success) {
    await pool.query(
      'DELETE FROM login_attempts WHERE identifier = $1 AND ip = $2',
      [identifier, ip]
    );
    return;
  }

  await pool.query(
    `INSERT INTO login_attempts (identifier, ip, attempts, last_attempt_at)
     VALUES ($1, $2, 1, NOW())
     ON CONFLICT (identifier, ip)
     DO UPDATE SET attempts = login_attempts.attempts + 1, last_attempt_at = NOW()`,
    [identifier, ip]
  );
};

export const getSessionCookieOptions = (expiresAt: Date) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  expires: expiresAt,
  path: '/',
});
