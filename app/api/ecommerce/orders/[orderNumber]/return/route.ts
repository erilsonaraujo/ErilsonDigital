import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/src/ecommerce/db/queries';
import { isEcommerceEnabled } from '@/src/ecommerce/services/flags';

export async function POST(request: NextRequest, { params }: { params: { orderNumber: string } }) {
  if (!isEcommerceEnabled()) {
    return NextResponse.json({ error: 'Ecommerce disabled' }, { status: 404 });
  }

  const { items, reason } = await request.json();
  const orderRes = await query('SELECT * FROM orders WHERE order_number = $1', [params.orderNumber]);
  if (orderRes.rows.length === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const order = orderRes.rows[0];
  const result = await query(
    `INSERT INTO returns (order_id, status, items, reason)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [order.id, 'requested', JSON.stringify(items || []), reason || null]
  );

  return NextResponse.json({ return: result.rows[0] });
}
