import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { visitorId, sessionId, name, path, metadata } = body || {};

    if (!name) {
      return NextResponse.json({ error: 'Event name required' }, { status: 400 });
    }

    await pool.query(
      `INSERT INTO analytics_events (visitor_id, session_id, name, path, metadata)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        visitorId || null,
        sessionId || null,
        name,
        path || null,
        metadata ? JSON.stringify(metadata) : null,
      ]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics event error:', error);
    return NextResponse.json({ error: 'Failed to track event' }, { status: 500 });
  }
}
