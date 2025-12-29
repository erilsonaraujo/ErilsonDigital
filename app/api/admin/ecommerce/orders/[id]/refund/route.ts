import { NextRequest, NextResponse } from 'next/server';
import { ensureAdminSession } from '@/lib/adminAuth';
import { query } from '@/src/ecommerce/db/queries';
import { getPaymentGateway } from '@/src/ecommerce/providers';
import { isEcommerceAdminEnabled } from '@/src/ecommerce/services/flags';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  if (!isEcommerceAdminEnabled()) {
    return NextResponse.json({ error: 'Ecommerce admin disabled' }, { status: 404 });
  }
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { paymentId, provider, amountCents, reason } = await request.json();
  if (!paymentId || !provider || !amountCents) {
    return NextResponse.json({ error: 'paymentId, provider, amountCents required' }, { status: 400 });
  }

  const gateway = getPaymentGateway(provider);
  await gateway.refund(paymentId, Number(amountCents));

  const refundRes = await query(
    `INSERT INTO refunds (order_id, provider, provider_ref, amount_cents, reason, status)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [params.id, provider, paymentId, Number(amountCents), reason || null, 'completed']
  );

  await query(
    `UPDATE orders SET status = 'refunded', payment_status = 'refunded', updated_at = NOW() WHERE id = $1`,
    [params.id]
  );

  await query(
    'INSERT INTO order_status_history (order_id, from_status, to_status, actor_id, note) VALUES ($1, $2, $3, $4, $5)',
    [params.id, null, 'refunded', session.admin_id, 'Refund issued']
  );

  return NextResponse.json({ refund: refundRes.rows[0] });
}
