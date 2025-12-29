import { NextRequest, NextResponse } from 'next/server';
import { ensureAdminSession } from '@/lib/adminAuth';
import { query } from '@/src/ecommerce/db/queries';
import { isEcommerceAdminEnabled } from '@/src/ecommerce/services/flags';

export async function GET(request: NextRequest) {
  if (!isEcommerceAdminEnabled()) {
    return NextResponse.json({ error: 'Ecommerce admin disabled' }, { status: 404 });
  }
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const res = await query('SELECT * FROM promotions ORDER BY created_at DESC');
  return NextResponse.json({ promotions: res.rows });
}

export async function POST(request: NextRequest) {
  if (!isEcommerceAdminEnabled()) {
    return NextResponse.json({ error: 'Ecommerce admin disabled' }, { status: 404 });
  }
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const res = await query(
    `INSERT INTO promotions (name, rules, starts_at, ends_at, stackable)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [body.name, JSON.stringify(body.rules || {}), body.startsAt || null, body.endsAt || null, body.stackable || false]
  );
  return NextResponse.json({ promotion: res.rows[0] });
}

export async function PATCH(request: NextRequest) {
  if (!isEcommerceAdminEnabled()) {
    return NextResponse.json({ error: 'Ecommerce admin disabled' }, { status: 404 });
  }
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  if (!body.id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const res = await query(
    `UPDATE promotions
     SET name = COALESCE($1, name),
         rules = COALESCE($2, rules),
         starts_at = COALESCE($3, starts_at),
         ends_at = COALESCE($4, ends_at),
         stackable = COALESCE($5, stackable)
     WHERE id = $6
     RETURNING *`,
    [body.name || null, body.rules ? JSON.stringify(body.rules) : null, body.startsAt ?? null, body.endsAt ?? null, body.stackable ?? null, body.id]
  );
  return NextResponse.json({ promotion: res.rows[0] });
}

export async function DELETE(request: NextRequest) {
  if (!isEcommerceAdminEnabled()) {
    return NextResponse.json({ error: 'Ecommerce admin disabled' }, { status: 404 });
  }
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  await query('DELETE FROM promotions WHERE id = $1', [id]);
  return NextResponse.json({ success: true });
}
