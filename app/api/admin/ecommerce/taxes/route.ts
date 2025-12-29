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

  const res = await query('SELECT * FROM tax_rates ORDER BY region_code ASC');
  return NextResponse.json({ taxes: res.rows });
}

export async function POST(request: NextRequest) {
  if (!isEcommerceAdminEnabled()) {
    return NextResponse.json({ error: 'Ecommerce admin disabled' }, { status: 404 });
  }
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const res = await query(
    `INSERT INTO tax_rates (region_code, rate_percent, active)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [body.regionCode, body.ratePercent, body.active !== false]
  );
  return NextResponse.json({ tax: res.rows[0] });
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
    `UPDATE tax_rates
     SET region_code = COALESCE($1, region_code),
         rate_percent = COALESCE($2, rate_percent),
         active = COALESCE($3, active)
     WHERE id = $4
     RETURNING *`,
    [body.regionCode || null, body.ratePercent ?? null, body.active ?? null, body.id]
  );
  return NextResponse.json({ tax: res.rows[0] });
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

  await query('DELETE FROM tax_rates WHERE id = $1', [id]);
  return NextResponse.json({ success: true });
}
