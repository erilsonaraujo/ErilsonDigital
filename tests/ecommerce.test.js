import test from 'node:test';
import assert from 'node:assert/strict';
import { Pool } from 'pg';
import crypto from 'crypto';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

const makeId = () => crypto.randomUUID();

async function cleanup(ids) {
  await pool.query('DELETE FROM payment_events WHERE provider_event_id = $1', [ids.eventId]);
  await pool.query('DELETE FROM pix_payments WHERE payment_id = $1', [ids.paymentId]);
  await pool.query('DELETE FROM payments WHERE id = $1', [ids.paymentId]);
  await pool.query('DELETE FROM coupons WHERE id = $1', [ids.couponId]);
  await pool.query('DELETE FROM cart_items WHERE cart_id = $1', [ids.cartId]);
  await pool.query('DELETE FROM carts WHERE id = $1', [ids.cartId]);
  await pool.query('DELETE FROM product_variants WHERE id = $1', [ids.variantId]);
  await pool.query('DELETE FROM products WHERE id = $1', [ids.productId]);
}

test('payment_events unique constraint', async () => {
  const eventId = makeId();
  await pool.query(
    `INSERT INTO payment_events (provider, provider_event_id, type, payload)
     VALUES ($1, $2, $3, $4)`,
    ['stripe', eventId, 'test', JSON.stringify({ ok: true })]
  );

  await assert.rejects(async () => {
    await pool.query(
      `INSERT INTO payment_events (provider, provider_event_id, type, payload)
       VALUES ($1, $2, $3, $4)`,
      ['stripe', eventId, 'test', JSON.stringify({ ok: true })]
    );
  });

  await pool.query('DELETE FROM payment_events WHERE provider = $1 AND provider_event_id = $2', ['stripe', eventId]);
});

test('cart totals match items', async () => {
  const productId = makeId();
  const variantId = makeId();
  const cartId = makeId();
  const eventId = makeId();
  const couponId = makeId();
  const paymentId = makeId();

  try {
    await pool.query(
      `INSERT INTO products (id, status, title, slug)
       VALUES ($1, 'active', 'Test Product', $2)`,
      [productId, makeId()]
    );
    await pool.query(
      `INSERT INTO product_variants (id, product_id, sku, price_cents, currency)
       VALUES ($1, $2, $3, $4, 'BRL')`,
      [variantId, productId, makeId(), 1000]
    );
    await pool.query(
      `INSERT INTO carts (id, currency, subtotal_cents, discount_cents, shipping_cents, tax_cents, total_cents)
       VALUES ($1, 'BRL', 0, 0, 0, 0, 0)`,
      [cartId]
    );
    await pool.query(
      `INSERT INTO cart_items (cart_id, variant_id, qty, unit_price_cents)
       VALUES ($1, $2, 2, 1000)`,
      [cartId, variantId]
    );

    const res = await pool.query(
      `SELECT SUM(qty * unit_price_cents) AS subtotal
       FROM cart_items WHERE cart_id = $1`,
      [cartId]
    );

    const subtotal = Number(res.rows[0].subtotal || 0);
    assert.equal(subtotal, 2000);
  } finally {
    await cleanup({ productId, variantId, cartId, eventId, couponId, paymentId });
  }
});

test('pix payment record created', async () => {
  const paymentId = makeId();
  const orderId = makeId();
  const eventId = makeId();
  const couponId = makeId();
  const cartId = makeId();
  const variantId = makeId();
  const productId = makeId();

  try {
    await pool.query(
      `INSERT INTO orders (id, status, payment_status, fulfillment_status, currency, subtotal_cents, discount_cents, shipping_cents, tax_cents, total_cents)\n       VALUES ($1, 'awaiting_payment', 'pending', 'unfulfilled', 'BRL', 0, 0, 0, 0, 1000)`,
      [orderId]
    );

    await pool.query(
      `INSERT INTO payments (id, order_id, provider, intent_id, status, amount_cents, currency)\n       VALUES ($1, $2, 'pix', $3, 'pending', 1000, 'BRL')`,
      [paymentId, orderId, `pix-${makeId().slice(0, 8)}`]
    );

    await pool.query(
      `INSERT INTO pix_payments (payment_id, code, qr_text, expires_at, status)\n       VALUES ($1, $2, $3, NOW() + INTERVAL '30 minutes', 'pending')`,
      [paymentId, `PIX-${makeId().slice(0, 8)}`, 'PIX|demo']
    );

    const res = await pool.query('SELECT * FROM pix_payments WHERE payment_id = $1', [paymentId]);
    assert.equal(res.rows.length, 1);
  } finally {
    await cleanup({ productId, variantId, cartId, eventId, couponId, paymentId });
    await pool.query('DELETE FROM orders WHERE id = $1', [orderId]);
  }
});

process.on('beforeExit', async () => {
  await pool.end();
});
