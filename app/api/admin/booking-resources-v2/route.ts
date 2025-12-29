import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { ensureAdminSession } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const result = await query('SELECT * FROM booking_resources_v2 ORDER BY created_at DESC');
  return NextResponse.json({ resources: result.rows });
}

export async function POST(request: NextRequest) {
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { name, slug, status, capacity, timezone } = body || {};
  if (!name || !slug) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

  const result = await query(
    `INSERT INTO booking_resources_v2 (name, slug, status, capacity, timezone)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [name, slug, status || 'active', capacity || 1, timezone || null]
  );
  return NextResponse.json({ resource: result.rows[0] });
}

export async function PUT(request: NextRequest) {
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { id, name, slug, status, capacity, timezone } = body || {};
  if (!id || !name || !slug) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

  const result = await query(
    `UPDATE booking_resources_v2
     SET name = $1, slug = $2, status = $3, capacity = $4, timezone = $5
     WHERE id = $6
     RETURNING *`,
    [name, slug, status || 'active', capacity || 1, timezone || null, id]
  );
  return NextResponse.json({ resource: result.rows[0] });
}
