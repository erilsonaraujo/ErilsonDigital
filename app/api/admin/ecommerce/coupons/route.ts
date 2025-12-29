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

  const res = await query('SELECT * FROM coupons ORDER BY created_at DESC');
  return NextResponse.json({ coupons: res.rows });
}

export async function POST(request: NextRequest) {
  if (!isEcommerceAdminEnabled()) {
    return NextResponse.json({ error: 'Ecommerce admin disabled' }, { status: 404 });
  }
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const res = await query(
    `INSERT INTO coupons (code, type, amount, min_subtotal_cents, max_uses, per_customer_limit, starts_at, ends_at, active)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [
      body.code,
      body.type,
      Number(body.amount),
      body.minSubtotalCents || null,
      body.maxUses || null,
      body.perCustomerLimit || null,
      body.startsAt || null,
      body.endsAt || null,
      body.active !== false,
    ]
  );
  return NextResponse.json({ coupon: res.rows[0] });
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
    `UPDATE coupons
     SET code = COALESCE($1, code),
         type = COALESCE($2, type),
         amount = COALESCE($3, amount),
         min_subtotal_cents = COALESCE($4, min_subtotal_cents),
         max_uses = COALESCE($5, max_uses),
         per_customer_limit = COALESCE($6, per_customer_limit),
         starts_at = COALESCE($7, starts_at),
         ends_at = COALESCE($8, ends_at),
         active = COALESCE($9, active)
     WHERE id = $10
     RETURNING *`,
    [
      body.code || null,
      body.type || null,
      body.amount ?? null,
      body.minSubtotalCents ?? null,
      body.maxUses ?? null,
      body.perCustomerLimit ?? null,
      body.startsAt ?? null,
      body.endsAt ?? null,
      body.active ?? null,
      body.id,
    ]
  );
  return NextResponse.json({ coupon: res.rows[0] });
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

  await query('DELETE FROM coupons WHERE id = $1', [id]);
  return NextResponse.json({ success: true });
}
