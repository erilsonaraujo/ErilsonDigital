import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { ensureAdminSession } from '@/lib/adminAuth';

const SETTINGS_KEY = 'pixels';

export async function GET(request: NextRequest) {
  const session = await ensureAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await query('SELECT value FROM site_settings WHERE key = $1', [SETTINGS_KEY]);
  const value = result.rows[0]?.value;
  return NextResponse.json({ value: value ? JSON.parse(value) : {} });
}

export async function POST(request: NextRequest) {
  const session = await ensureAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const payload = JSON.stringify(body || {});

  await query(
    `INSERT INTO site_settings (key, value, updated_at)
     VALUES ($1, $2, NOW())
     ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = NOW()`,
    [SETTINGS_KEY, payload]
  );

  return NextResponse.json({ success: true });
}
