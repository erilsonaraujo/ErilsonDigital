import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      visitorId,
      sessionId,
      path,
      formId,
      formName,
      fieldName,
      fieldType,
      action,
      valueLength,
      timeSinceStart
    } = body || {};

    if (!action) {
      return NextResponse.json({ error: 'Action required' }, { status: 400 });
    }

    await pool.query(
      `INSERT INTO analytics_form_events
        (visitor_id, session_id, path, form_id, form_name, field_name, field_type, action, value_length, time_since_start)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        visitorId || null,
        sessionId || null,
        path || null,
        formId || null,
        formName || null,
        fieldName || null,
        fieldType || null,
        action,
        typeof valueLength === 'number' ? valueLength : null,
        typeof timeSinceStart === 'number' ? timeSinceStart : null
      ]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Form track error:', error);
    return NextResponse.json({ error: 'Failed to track form' }, { status: 500 });
  }
}
