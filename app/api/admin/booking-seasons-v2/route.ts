import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { ensureAdminSession } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const result = await query('SELECT * FROM booking_seasons_v2 ORDER BY start_date DESC');
  return NextResponse.json({ seasons: result.rows });
}

export async function POST(request: NextRequest) {
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { name, startDate, endDate, status } = body || {};
  if (!name || !startDate || !endDate) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

  const result = await query(
    `INSERT INTO booking_seasons_v2 (name, start_date, end_date, status)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [name, startDate, endDate, status || 'active']
  );
  return NextResponse.json({ season: result.rows[0] });
}

export async function DELETE(request: NextRequest) {
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  await query('DELETE FROM booking_seasons_v2 WHERE id = $1', [id]);
  return NextResponse.json({ success: true });
}
