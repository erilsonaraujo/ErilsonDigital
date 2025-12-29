import { NextRequest, NextResponse } from 'next/server';
import { cancelOrder } from '@/src/ecommerce/services/orderService';
import { query } from '@/src/ecommerce/db/queries';
import { isEcommerceEnabled } from '@/src/ecommerce/services/flags';

export async function POST(_request: NextRequest, { params }: { params: Promise<{ orderNumber: string }> }) {
  if (!isEcommerceEnabled()) {
    return NextResponse.json({ error: 'Ecommerce disabled' }, { status: 404 });
  }

  const { orderNumber } = await params;
  const orderRes = await query('SELECT * FROM orders WHERE order_number = $1', [orderNumber]);
  if (orderRes.rows.length === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const order = orderRes.rows[0];
  await cancelOrder(order.id, order.checkout_session_id, 'Customer canceled');
  return NextResponse.json({ success: true });
}
