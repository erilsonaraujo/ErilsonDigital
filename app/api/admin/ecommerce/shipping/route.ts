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

  const res = await query('SELECT * FROM shipping_rates ORDER BY region_code ASC');
  return NextResponse.json({ rates: res.rows });
}

export async function POST(request: NextRequest) {
  if (!isEcommerceAdminEnabled()) {
    return NextResponse.json({ error: 'Ecommerce admin disabled' }, { status: 404 });
  }
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const res = await query(
    `INSERT INTO shipping_rates (region_code, min_weight_grams, max_weight_grams, min_subtotal_cents, max_subtotal_cents, price_cents, currency, estimated_days, active)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [
      body.regionCode,
      body.minWeightGrams ?? 0,
      body.maxWeightGrams ?? null,
      body.minSubtotalCents ?? 0,
      body.maxSubtotalCents ?? null,
      Number(body.priceCents),
      body.currency || 'BRL',
      body.estimatedDays ?? 0,
      body.active !== false,
    ]
  );
  return NextResponse.json({ rate: res.rows[0] });
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
    `UPDATE shipping_rates
     SET region_code = COALESCE($1, region_code),
         min_weight_grams = COALESCE($2, min_weight_grams),
         max_weight_grams = COALESCE($3, max_weight_grams),
         min_subtotal_cents = COALESCE($4, min_subtotal_cents),
         max_subtotal_cents = COALESCE($5, max_subtotal_cents),
         price_cents = COALESCE($6, price_cents),
         currency = COALESCE($7, currency),
         estimated_days = COALESCE($8, estimated_days),
         active = COALESCE($9, active)
     WHERE id = $10
     RETURNING *`,
    [
      body.regionCode || null,
      body.minWeightGrams ?? null,
      body.maxWeightGrams ?? null,
      body.minSubtotalCents ?? null,
      body.maxSubtotalCents ?? null,
      body.priceCents ?? null,
      body.currency || null,
      body.estimatedDays ?? null,
      body.active ?? null,
      body.id,
    ]
  );
  return NextResponse.json({ rate: res.rows[0] });
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

  await query('DELETE FROM shipping_rates WHERE id = $1', [id]);
  return NextResponse.json({ success: true });
}
