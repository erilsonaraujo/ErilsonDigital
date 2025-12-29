import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { ensureAdminSession } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const result = await query('SELECT * FROM analytics_goals ORDER BY created_at DESC');
  return NextResponse.json({ goals: result.rows });
}

export async function POST(request: NextRequest) {
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { name, type, matchValue, value } = body || {};

  if (!name || !type || !matchValue) {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
  }

  const result = await query(
    `INSERT INTO analytics_goals (name, type, match_value, value)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [name, type, matchValue, value || 0]
  );

  return NextResponse.json({ goal: result.rows[0] }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

  await query('DELETE FROM analytics_goals WHERE id = $1', [id]);
  return NextResponse.json({ success: true });
}
