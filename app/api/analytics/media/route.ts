import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      visitorId,
      sessionId,
      path,
      mediaType,
      mediaLabel,
      action,
      currentTime,
      duration
    } = body || {};

    if (!mediaType || !action) {
      return NextResponse.json({ error: 'mediaType and action required' }, { status: 400 });
    }

    await pool.query(
      `INSERT INTO analytics_media_events
        (visitor_id, session_id, path, media_type, media_label, action, media_time, duration)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        visitorId || null,
        sessionId || null,
        path || null,
        mediaType,
        mediaLabel || null,
        action,
        typeof currentTime === 'number' ? currentTime : null,
        typeof duration === 'number' ? duration : null
      ]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Media track error:', error);
    return NextResponse.json({ error: 'Failed to track media' }, { status: 500 });
  }
}
