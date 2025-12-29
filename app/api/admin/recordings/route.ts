import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { ensureAdminSession } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const recordingsRes = await query(
      `SELECT id, session_id, visitor_id, start_path, started_at, ended_at, duration_seconds
       FROM analytics_recordings
       ORDER BY started_at DESC
       LIMIT 200`
    );
    return NextResponse.json({ recordings: recordingsRes.rows });
  } catch (error) {
    console.error('Recordings list error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
