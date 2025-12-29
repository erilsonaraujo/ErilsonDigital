import { NextRequest, NextResponse } from 'next/server';
import { ensureAdminSession } from '@/lib/adminAuth';
import { query } from '@/src/ecommerce/db/queries';
import { isEcommerceAdminEnabled } from '@/src/ecommerce/services/flags';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  if (!isEcommerceAdminEnabled()) {
    return NextResponse.json({ error: 'Ecommerce admin disabled' }, { status: 404 });
  }
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { carrier, trackingCode, labelUrl } = await request.json();
  const result = await query(
    `INSERT INTO fulfillments (order_id, status, carrier, tracking_code, label_url, shipped_at)
     VALUES ($1, $2, $3, $4, $5, NOW())
     RETURNING *`,
    [params.id, 'shipped', carrier || null, trackingCode || null, labelUrl || null]
  );

  await query(
    `UPDATE orders SET fulfillment_status = 'shipped', status = 'shipped', updated_at = NOW() WHERE id = $1`,
    [params.id]
  );

  await query(
    'INSERT INTO order_status_history (order_id, from_status, to_status, actor_id, note) VALUES ($1, $2, $3, $4, $5)',
    [params.id, null, 'shipped', session.admin_id, 'Order fulfilled']
  );

  return NextResponse.json({ fulfillment: result.rows[0] });
}
