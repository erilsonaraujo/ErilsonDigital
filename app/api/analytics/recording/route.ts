import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { visitorId, sessionId, path, sequence, events, endedAt, durationSeconds } = body || {};

    if (!sessionId || !Array.isArray(events)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const recordingRes = await query(
      `INSERT INTO analytics_recordings (session_id, visitor_id, start_path, started_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (session_id) DO UPDATE SET session_id = EXCLUDED.session_id
       RETURNING id`,
      [sessionId, visitorId || null, path || null]
    );

    const recordingId = recordingRes.rows[0]?.id;
    if (!recordingId) {
      return NextResponse.json({ error: 'Failed to create recording' }, { status: 500 });
    }

    await query(
      `INSERT INTO analytics_recording_chunks (recording_id, sequence, events)
       VALUES ($1, $2, $3)`,
      [recordingId, sequence || 0, JSON.stringify(events)]
    );

    if (endedAt || durationSeconds) {
      await query(
        `UPDATE analytics_recordings
         SET ended_at = COALESCE($1, ended_at),
             duration_seconds = COALESCE($2, duration_seconds)
         WHERE id = $3`,
        [endedAt ? new Date(endedAt) : null, durationSeconds || null, recordingId]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Recording track error:', error);
    return NextResponse.json({ error: 'Failed to track recording' }, { status: 500 });
  }
}
