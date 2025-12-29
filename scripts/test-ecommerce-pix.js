import { Pool } from 'pg';
import crypto from 'crypto';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

const makeId = () => crypto.randomUUID();

async function run() {
  const client = await pool.connect();
  const ids = {
    productId: makeId(),
    variantId: makeId(),
    cartId: makeId(),
    checkoutId: makeId(),
    orderId: makeId(),
    paymentId: makeId(),
  };

  try {
    await client.query('BEGIN');

    const locRes = await client.query('SELECT * FROM inventory_locations ORDER BY name ASC LIMIT 1');
    const location = locRes.rows[0];

    await client.query(
      `INSERT INTO products (id, status, title, slug)
       VALUES ($1, 'active', 'Teste PIX', $2)`,
      [ids.productId, `teste-pix-${ids.productId.slice(0, 8)}`]
    );

    await client.query(
      `INSERT INTO product_variants (id, product_id, sku, price_cents, currency, status)
       VALUES ($1, $2, $3, 1200, 'BRL', 'active')`,
      [ids.variantId, ids.productId, `PIX-${ids.variantId.slice(0, 6)}`]
    );

    if (location) {
      await client.query(
        `INSERT INTO inventory_levels (variant_id, location_id, available, reserved)
         VALUES ($1, $2, 10, 0)
         ON CONFLICT (variant_id, location_id)
         DO UPDATE SET available = EXCLUDED.available`,
        [ids.variantId, location.id]
      );
    }

    await client.query(
      `INSERT INTO carts (id, currency, subtotal_cents, discount_cents, shipping_cents, tax_cents, total_cents)
       VALUES ($1, 'BRL', 0, 0, 0, 0, 0)`,
      [ids.cartId]
    );

    await client.query(
      `INSERT INTO cart_items (cart_id, variant_id, qty, unit_price_cents)
       VALUES ($1, $2, 1, 1200)`,
      [ids.cartId, ids.variantId]
    );

    await client.query(
      `UPDATE carts SET subtotal_cents = 1200, total_cents = 1200 WHERE id = $1`,
      [ids.cartId]
    );

    await client.query(
      `INSERT INTO checkout_sessions (id, cart_id, state, email, expires_at)
       VALUES ($1, $2, 'reserved', 'pix@teste.com', NOW() + INTERVAL '15 minutes')`,
      [ids.checkoutId, ids.cartId]
    );

    await client.query(
      `INSERT INTO orders (id, checkout_session_id, email, status, payment_status, fulfillment_status, currency, subtotal_cents, discount_cents, shipping_cents, tax_cents, total_cents)
       VALUES ($1, $2, 'pix@teste.com', 'awaiting_payment', 'pending', 'unfulfilled', 'BRL', 1200, 0, 0, 0, 1200)`,
      [ids.orderId, ids.checkoutId]
    );

    await client.query(
      `INSERT INTO payments (id, order_id, provider, intent_id, status, amount_cents, currency)
       VALUES ($1, $2, 'pix', $3, 'pending', 1200, 'BRL')`,
      [ids.paymentId, ids.orderId, `pix-${ids.paymentId.slice(0, 8)}`]
    );

    await client.query(
      `INSERT INTO pix_payments (payment_id, code, qr_text, expires_at, status)
       VALUES ($1, $2, $3, NOW() + INTERVAL '30 minutes', 'pending')`,
      [ids.paymentId, `PIX-${ids.orderId.slice(0, 6)}`, 'PIX|demo']
    );

    await client.query(
      `UPDATE payments SET status = 'paid' WHERE id = $1`,
      [ids.paymentId]
    );

    await client.query(
      `UPDATE pix_payments SET status = 'paid' WHERE payment_id = $1`,
      [ids.paymentId]
    );

    await client.query(
      `UPDATE orders SET status = 'paid', payment_status = 'paid' WHERE id = $1`,
      [ids.orderId]
    );

    const orderRes = await client.query('SELECT status, payment_status FROM orders WHERE id = $1', [ids.orderId]);
    const paymentRes = await client.query('SELECT status FROM payments WHERE id = $1', [ids.paymentId]);
    const pixRes = await client.query('SELECT status FROM pix_payments WHERE payment_id = $1', [ids.paymentId]);

    console.log('Order status:', orderRes.rows[0]);
    console.log('Payment status:', paymentRes.rows[0]);
    console.log('Pix status:', pixRes.rows[0]);

    await client.query('COMMIT');
    console.log('PIX flow test completed');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('PIX flow test error:', error);
    process.exitCode = 1;
  } finally {
    const cleanup = async () => {
      await client.query('DELETE FROM pix_payments WHERE payment_id = $1', [ids.paymentId]);
      await client.query('DELETE FROM payments WHERE id = $1', [ids.paymentId]);
      await client.query('DELETE FROM orders WHERE id = $1', [ids.orderId]);
      await client.query('DELETE FROM checkout_sessions WHERE id = $1', [ids.checkoutId]);
      await client.query('DELETE FROM cart_items WHERE cart_id = $1', [ids.cartId]);
      await client.query('DELETE FROM carts WHERE id = $1', [ids.cartId]);
      await client.query('DELETE FROM product_variants WHERE id = $1', [ids.variantId]);
      await client.query('DELETE FROM products WHERE id = $1', [ids.productId]);
    };

    try {
      await cleanup();
    } catch (cleanupError) {
      console.error('Cleanup error:', cleanupError);
    }

    client.release();
    await pool.end();
  }
}

run();
