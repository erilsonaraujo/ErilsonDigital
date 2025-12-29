import { NextRequest, NextResponse } from 'next/server';
import { ensureAdminSession } from '@/lib/adminAuth';
import { query } from '@/src/ecommerce/db/queries';
import { markOrderPaid } from '@/src/ecommerce/services/orderService';
import { isEcommerceAdminEnabled } from '@/src/ecommerce/services/flags';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  if (!isEcommerceAdminEnabled()) {
    return NextResponse.json({ error: 'Ecommerce admin disabled' }, { status: 404 });
  }
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const paymentRes = await query('SELECT * FROM payments WHERE id = $1', [params.id]);
  if (paymentRes.rows.length === 0) {
    return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
  }
  const payment = paymentRes.rows[0];

  await query('UPDATE payments SET status = $1, updated_at = NOW() WHERE id = $2', ['paid', payment.id]);
  await query('UPDATE pix_payments SET status = $1 WHERE payment_id = $2', ['paid', payment.id]);

  const orderRes = await query('SELECT * FROM orders WHERE id = $1', [payment.order_id]);
  if (orderRes.rows.length > 0) {
    const order = orderRes.rows[0];
    if (order.checkout_session_id) {
      await markOrderPaid(order.id, order.checkout_session_id);
    }
  }

  return NextResponse.json({ success: true });
}
