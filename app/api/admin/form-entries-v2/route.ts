import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { ensureAdminSession } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const formId = searchParams.get('formId');
  if (!formId) return NextResponse.json({ error: 'Missing formId' }, { status: 400 });

  const result = await query(
    `SELECT * FROM form_entries_v2
     WHERE form_id = $1
     ORDER BY created_at DESC
     LIMIT 200`,
    [formId]
  );
  const entries = result.rows.map((row) => ({
    ...row,
    data: row.data ? JSON.parse(row.data) : null
  }));
  return NextResponse.json({ entries });
}
