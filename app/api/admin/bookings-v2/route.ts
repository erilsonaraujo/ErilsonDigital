import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { ensureAdminSession } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const result = await query(
    `SELECT b.*, r.name AS resource_name
     FROM bookings_v2 b
     LEFT JOIN booking_resources_v2 r ON r.id = b.resource_id
     ORDER BY b.created_at DESC
     LIMIT 200`
  );
  return NextResponse.json({ bookings: result.rows });
}

export async function POST(request: NextRequest) {
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { resourceId, startAt, endAt, customerName, customerEmail, customerPhone, notes } = body || {};
  if (!resourceId || !startAt || !endAt) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

  const result = await query(
    `INSERT INTO bookings_v2
      (resource_id, start_at, end_at, customer_name, customer_email, customer_phone, notes)
     SELECT $1, $2, $3, $4, $5, $6, $7
     WHERE NOT EXISTS (
       SELECT 1 FROM bookings_v2
       WHERE resource_id = $1
         AND status NOT IN ('canceled', 'declined')
         AND tsrange(start_at, end_at, '[)') && tsrange($2, $3, '[)')
     )
     RETURNING *`,
    [resourceId, new Date(startAt), new Date(endAt), customerName || null, customerEmail || null, customerPhone || null, notes || null]
  );
  if (!result.rows[0]) {
    return NextResponse.json({ error: 'Conflito de horario' }, { status: 409 });
  }
  return NextResponse.json({ booking: result.rows[0] });
}

export async function PUT(request: NextRequest) {
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { id, status, startAt, endAt } = body || {};
  if (!id) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

  const result = await query(
    `UPDATE bookings_v2
     SET status = COALESCE($1, status),
         start_at = COALESCE($2, start_at),
         end_at = COALESCE($3, end_at)
     WHERE id = $4
     RETURNING *`,
    [status || null, startAt ? new Date(startAt) : null, endAt ? new Date(endAt) : null, id]
  );
  return NextResponse.json({ booking: result.rows[0] });
}
