import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { ensureAdminSession } from '@/lib/adminAuth';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  try {
    const recordingRes = await query(
      `SELECT id, session_id, visitor_id, start_path, started_at, ended_at, duration_seconds
       FROM analytics_recordings WHERE id = $1`,
      [id]
    );
    const recording = recordingRes.rows[0];
    if (!recording) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const chunksRes = await query(
      `SELECT sequence, events
       FROM analytics_recording_chunks
       WHERE recording_id = $1
       ORDER BY sequence ASC`,
      [id]
    );

    return NextResponse.json({ recording, chunks: chunksRes.rows });
  } catch (error) {
    console.error('Recording fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
