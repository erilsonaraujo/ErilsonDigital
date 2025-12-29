import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { ensureAdminSession } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const formsRes = await query(
      `SELECT COALESCE(form_name, form_id, '(not set)') AS form,
              COUNT(*) FILTER (WHERE action = 'submit') AS submits,
              COUNT(*) FILTER (WHERE action = 'focus') AS focuses,
              COUNT(*) FILTER (WHERE action = 'blur') AS blurs
       FROM analytics_form_events
       GROUP BY form
       ORDER BY submits DESC
       LIMIT 50`
    );

    const fieldsRes = await query(
      `SELECT COALESCE(field_name, '(not set)') AS field,
              COUNT(*) FILTER (WHERE action = 'input') AS inputs,
              AVG(time_since_start) AS avg_time
       FROM analytics_form_events
       WHERE field_name IS NOT NULL
       GROUP BY field
       ORDER BY inputs DESC
       LIMIT 50`
    );

    return NextResponse.json({ forms: formsRes.rows, fields: fieldsRes.rows });
  } catch (error) {
    console.error('Form analytics error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
