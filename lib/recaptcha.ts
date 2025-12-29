import { NextRequest } from 'next/server';

const SCORE_THRESHOLD = 0.5;

export const verifyRecaptcha = async (token: string | undefined, request?: NextRequest) => {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return { ok: true, score: null };
  if (!token) return { ok: false, score: null };

  const ip = request?.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const params = new URLSearchParams({
    secret,
    response: token,
  });
  if (ip) params.append('remoteip', ip);

  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  if (!response.ok) return { ok: false, score: null };
  const data = await response.json();
  const score = Number(data.score || 0);
  const ok = Boolean(data.success) && score >= SCORE_THRESHOLD;
  return { ok, score };
};
