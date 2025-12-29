import crypto from 'crypto';
import { query, withTransaction } from '@/src/ecommerce/db/queries';
import { createOrderFromCheckout, markOrderPaid } from '@/src/ecommerce/services/orderService';
import { reserveInventoryForCheckout } from '@/src/ecommerce/services/checkoutService';
import { getPaymentGateway } from '@/src/ecommerce/providers';

export async function createCheckoutPayment(params: {
  session: any;
  provider: 'mercadopago' | 'stripe' | 'paypal' | 'pix';
  returnUrl: string;
  cancelUrl: string;
}) {
  const { session, provider, returnUrl, cancelUrl } = params;
  const order = await createOrderFromCheckout(session);

  await reserveInventoryForCheckout(session.id);

  if (provider === 'pix') {
    const idempotencyKey = crypto.randomUUID();
    const paymentRes = await query(
      `INSERT INTO payments (order_id, provider, intent_id, status, amount_cents, currency, idempotency_key)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [order.id, provider, `pix-${idempotencyKey}`, 'pending', order.total_cents, order.currency, idempotencyKey]
    );

    const payment = paymentRes.rows[0];
    const pixCode = `PIX-${order.order_number}-${idempotencyKey.slice(0, 8)}`;
    const qrText = `PIX|order:${order.order_number}|amount:${order.total_cents}|currency:${order.currency}|code:${pixCode}`;
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    await query(
      `INSERT INTO pix_payments (payment_id, code, qr_text, expires_at, status)
       VALUES ($1, $2, $3, $4, $5)`,
      [payment.id, pixCode, qrText, expiresAt.toISOString(), 'pending']
    );

    return { order, checkoutUrl: null, pix: { code: pixCode, qrText, expiresAt } };
  }

  const idempotencyKey = crypto.randomUUID();
  const gateway = getPaymentGateway(provider);

  const checkout = await gateway.createCheckout({
    orderId: order.id,
    amountCents: Number(order.total_cents),
    currency: order.currency,
    returnUrl,
    cancelUrl,
    idempotencyKey,
    metadata: { orderId: order.id, checkoutSessionId: session.id },
  });

  await query(
    `INSERT INTO payments (order_id, provider, intent_id, status, amount_cents, currency, idempotency_key)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [order.id, provider, checkout.providerPaymentId, 'pending', order.total_cents, order.currency, idempotencyKey]
  );

  return { order, checkoutUrl: checkout.checkoutUrl, pix: null };
}

export async function recordPaymentEvent(params: {
  provider: string;
  providerEventId: string;
  payload: Record<string, unknown>;
  paymentId?: string | null;
}) {
  const { provider, providerEventId, payload, paymentId } = params;
  return withTransaction(async (client) => {
    const exists = await client.query(
      'SELECT id FROM payment_events WHERE provider = $1 AND provider_event_id = $2',
      [provider, providerEventId]
    );
    if (exists.rows.length > 0) return { inserted: false };

    await client.query(
      `INSERT INTO payment_events (provider, provider_event_id, type, payment_id, payload)
       VALUES ($1, $2, $3, $4, $5)`,
      [provider, providerEventId, payload.type || null, paymentId || null, JSON.stringify(payload)]
    );
    return { inserted: true };
  });
}

export async function markPaymentStatus(paymentId: string, status: string) {
  await query('UPDATE payments SET status = $1, updated_at = NOW() WHERE id = $2', [status, paymentId]);
}

export async function handleProviderEvent(event: { provider: string; providerEventId: string; status: string; orderId?: string | null; paymentId?: string | null; amountCents?: number | null; raw: Record<string, unknown> }) {
  const { provider, providerEventId, status, orderId, paymentId } = event;
  const recorded = await recordPaymentEvent({ provider, providerEventId, payload: event.raw, paymentId: paymentId || null });
  if (!recorded.inserted) return { ok: true, duplicate: true };

  if (paymentId) {
    await markPaymentStatus(paymentId, status);
  }

  if (status === 'paid' && orderId) {
    const orderRes = await query('SELECT * FROM orders WHERE id = $1', [orderId]);
    if (orderRes.rows.length > 0) {
      const order = orderRes.rows[0];
      if (order.checkout_session_id) {
        await markOrderPaid(order.id, order.checkout_session_id);
      }
    }
  }

  return { ok: true };
}
