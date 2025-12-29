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

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');

  const params: any[] = [];
  let where = '';
  if (status) {
    params.push(status);
    where = `WHERE status = $${params.length}`;
  }

  const res = await query(
    `SELECT * FROM orders ${where} ORDER BY created_at DESC LIMIT 200`,
    params
  );

  return NextResponse.json({ orders: res.rows });
}

export async function PATCH(request: NextRequest) {
  if (!isEcommerceAdminEnabled()) {
    return NextResponse.json({ error: 'Ecommerce admin disabled' }, { status: 404 });
  }
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, status, paymentStatus, fulfillmentStatus, note } = await request.json();
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const result = await query(
    `UPDATE orders
     SET status = COALESCE($1, status),
         payment_status = COALESCE($2, payment_status),
         fulfillment_status = COALESCE($3, fulfillment_status),
         updated_at = NOW()
     WHERE id = $4
     RETURNING *`,
    [status || null, paymentStatus || null, fulfillmentStatus || null, id]
  );

  if (status) {
    await query(
      'INSERT INTO order_status_history (order_id, from_status, to_status, actor_id, note) VALUES ($1, $2, $3, $4, $5)',
      [id, null, status, session.admin_id, note || 'Admin update']
    );
  }

  return NextResponse.json({ order: result.rows[0] });
}
