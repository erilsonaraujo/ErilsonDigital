import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { ensureAdminSession } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const result = await query('SELECT * FROM booking_coupons_v2 ORDER BY created_at DESC');
  return NextResponse.json({ coupons: result.rows });
}

export async function POST(request: NextRequest) {
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  const { code, discountType, discountValue, minTotal, expiresAt } = body || {};
  if (!code || !discountType || !discountValue) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

  const result = await query(
    `INSERT INTO booking_coupons_v2 (code, discount_type, discount_value, min_total, expires_at)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [code, discountType, discountValue, minTotal || 0, expiresAt || null]
  );
  return NextResponse.json({ coupon: result.rows[0] });
}

export async function DELETE(request: NextRequest) {
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  await query('DELETE FROM booking_coupons_v2 WHERE id = $1', [id]);
  return NextResponse.json({ success: true });
}
