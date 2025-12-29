import { withTransaction, query } from '@/src/ecommerce/db/queries';
import { getCart } from '@/src/ecommerce/services/cartService';
import { consumeReservation, releaseReservation } from '@/src/ecommerce/services/inventoryService';

export async function createOrderFromCheckout(session: any) {
  return withTransaction(async (client) => {
    const existing = await client.query(
      'SELECT * FROM orders WHERE checkout_session_id = $1 LIMIT 1',
      [session.id]
    );
    if (existing.rows.length > 0) return existing.rows[0];

    const cart = await getCart(session.cart_id);
    if (!cart) throw new Error('Cart not found');

    const orderRes = await client.query(
      `INSERT INTO orders
       (checkout_session_id, customer_id, email, status, payment_status, fulfillment_status, currency,
        subtotal_cents, discount_cents, shipping_cents, tax_cents, total_cents)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [
        session.id,
        cart.customer_id || null,
        session.email || null,
        'awaiting_payment',
        'pending',
        'unfulfilled',
        cart.currency,
        cart.subtotal_cents,
        cart.discount_cents,
        cart.shipping_cents,
        cart.tax_cents,
        cart.total_cents,
      ]
    );

    const order = orderRes.rows[0];

    for (const item of cart.items || []) {
      await client.query(
        `INSERT INTO order_items
         (order_id, variant_id, sku_snapshot, title_snapshot, attrs_snapshot, qty, unit_price_cents, discount_cents, tax_cents, total_cents)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          order.id,
          item.variant_id,
          item.sku,
          item.product_title,
          JSON.stringify(item.attrs || {}),
          item.qty,
          item.unit_price_cents,
          0,
          0,
          Number(item.qty) * Number(item.unit_price_cents),
        ]
      );
    }

    await client.query(
      'INSERT INTO order_addresses (order_id, shipping, billing) VALUES ($1, $2, $3)',
      [order.id, session.shipping_address || null, session.billing_address || null]
    );

    await client.query(
      `INSERT INTO order_status_history (order_id, from_status, to_status, note)
       VALUES ($1, $2, $3, $4)`,
      [order.id, null, 'awaiting_payment', 'Order created from checkout']
    );

    return order;
  });
}

export async function markOrderPaid(orderId: string, checkoutSessionId: string) {
  await query(
    `UPDATE orders
     SET status = 'paid', payment_status = 'paid', updated_at = NOW()
     WHERE id = $1`,
    [orderId]
  );
  await query(
    'INSERT INTO order_status_history (order_id, from_status, to_status, note) VALUES ($1, $2, $3, $4)',
    [orderId, 'awaiting_payment', 'paid', 'Payment confirmed']
  );
  await consumeReservation('checkout_session', checkoutSessionId);
}

export async function cancelOrder(orderId: string, checkoutSessionId: string, reason?: string) {
  await query(
    `UPDATE orders
     SET status = 'canceled', updated_at = NOW()
     WHERE id = $1`,
    [orderId]
  );
  await query(
    'INSERT INTO order_status_history (order_id, from_status, to_status, note) VALUES ($1, $2, $3, $4)',
    [orderId, null, 'canceled', reason || 'Order canceled']
  );
  await releaseReservation('checkout_session', checkoutSessionId);
}

export async function listOrdersByEmail(email: string) {
  const ordersRes = await query('SELECT * FROM orders WHERE email = $1 ORDER BY created_at DESC', [email]);
  return ordersRes.rows;
}

export async function getOrderByNumber(orderNumber: string) {
  const orderRes = await query('SELECT * FROM orders WHERE order_number = $1', [orderNumber]);
  if (orderRes.rows.length === 0) return null;
  const itemsRes = await query('SELECT * FROM order_items WHERE order_id = $1', [orderRes.rows[0].id]);
  const addrRes = await query('SELECT * FROM order_addresses WHERE order_id = $1', [orderRes.rows[0].id]);
  return { ...orderRes.rows[0], items: itemsRes.rows, addresses: addrRes.rows[0] || null };
}
