import { Pool } from 'pg';
import crypto from 'crypto';
import fetch from 'node-fetch';

const POSTGRES_URL = process.env.POSTGRES_URL;
const SITE_URL = process.env.SITE_URL || 'https://erilsondigital.com';

if (!POSTGRES_URL) {
  console.error('POSTGRES_URL is required');
  process.exit(1);
}

const pool = new Pool({
  connectionString: POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

const makeId = () => crypto.randomUUID();

async function run() {
  const slug = 'consultoria-produto-ia';
  const productRes = await fetch(`${SITE_URL}/api/ecommerce/products/${slug}`);
  const productData = await productRes.json();
  if (!productRes.ok) throw new Error('Failed to fetch product');
  const variantId = productData.product?.variants?.[0]?.id;
  if (!variantId) throw new Error('No variant found');

  const createCartRes = await fetch(`${SITE_URL}/api/ecommerce/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  const setCookie = createCartRes.headers.get('set-cookie') || '';
  const cartData = await createCartRes.json();
  if (!createCartRes.ok) throw new Error('Failed to create cart');
  const cartId = cartData.cart?.id;
  if (!cartId) throw new Error('Missing cart id');

  const addItemRes = await fetch(`${SITE_URL}/api/ecommerce/cart/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', cookie: setCookie },
    body: JSON.stringify({ variantId, qty: 1 }),
  });
  const addItemData = await addItemRes.json();
  if (!addItemRes.ok) throw new Error(`Failed to add item: ${JSON.stringify(addItemData)}`);

  const checkoutRes = await fetch(`${SITE_URL}/api/ecommerce/checkout/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', cookie: setCookie },
    body: JSON.stringify({ cartId, email: 'qa@erilsondigital.com' }),
  });
  const checkoutData = await checkoutRes.json();
  if (!checkoutRes.ok) throw new Error(`Failed to start checkout: ${JSON.stringify(checkoutData)}`);
  const sessionId = checkoutData.session?.id;
  if (!sessionId) throw new Error('Missing checkout session');

  const payRes = await fetch(`${SITE_URL}/api/ecommerce/checkout/pay`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', cookie: setCookie },
    body: JSON.stringify({ sessionId, provider: 'pix' }),
  });
  const payData = await payRes.json();
  if (!payRes.ok) throw new Error(`Failed to pay: ${JSON.stringify(payData)}`);
  const paymentId = payData?.pix ? null : null;

  console.log('Storefront flow OK', {
    cartId,
    checkoutSessionId: sessionId,
    pix: payData.pix || null,
  });

  if (payData.order?.id) {
    const paymentRes = await pool.query('SELECT id FROM payments WHERE order_id = $1 ORDER BY created_at DESC LIMIT 1', [payData.order.id]);
    const paymentIdDb = paymentRes.rows[0]?.id;
    if (paymentIdDb) {
      await fetch(`${SITE_URL}/api/admin/ecommerce/payments/${paymentIdDb}/mark-paid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }).catch(() => {});
    }
  }

  await pool.end();
}

run().catch(async (error) => {
  console.error('Storefront test error:', error);
  await pool.end();
  process.exit(1);
});
