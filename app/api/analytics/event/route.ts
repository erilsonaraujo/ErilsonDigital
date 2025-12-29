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

    if (sessionId) {
      await pool.query(
        `UPDATE analytics_sessions
         SET last_seen = NOW(), events = events + 1
         WHERE session_id = $1`,
        [sessionId]
      );
    }

    if (sessionId) {
      const goals = await pool.query(
        'SELECT id, value FROM analytics_goals WHERE type = $1 AND match_value = $2',
        ['event', name]
      );

      for (const goal of goals.rows) {
        await pool.query(
          `INSERT INTO analytics_goal_conversions (goal_id, visitor_id, session_id, event_name, value)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (goal_id, session_id) DO NOTHING`,
          [goal.id, visitorId || null, sessionId, name, goal.value || 0]
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics event error:', error);
    return NextResponse.json({ error: 'Failed to track event' }, { status: 500 });
  }
}
