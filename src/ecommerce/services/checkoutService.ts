import { query, withTransaction } from '@/src/ecommerce/db/queries';
import { recalcCart, getCart } from '@/src/ecommerce/services/cartService';
import { validateCoupon, calculateDiscount } from '@/src/ecommerce/services/promoService';
import { getShippingOptions } from '@/src/ecommerce/services/shippingService';
import { calculateTax } from '@/src/ecommerce/services/taxService';
import { reserveInventory } from '@/src/ecommerce/services/inventoryService';

const CHECKOUT_TTL_MINUTES = 15;

export async function startCheckout(cartId: string, email: string) {
  const cart = await getCart(cartId);
  if (!cart) throw new Error('Cart not found');

  const expiresAt = new Date(Date.now() + CHECKOUT_TTL_MINUTES * 60 * 1000);
  const result = await query(
    `INSERT INTO checkout_sessions (cart_id, state, email, expires_at)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [cartId, 'created', email, expiresAt]
  );
  return result.rows[0];
}

export async function updateAddresses(sessionId: string, payload: { shipping: any; billing?: any }) {
  const result = await query(
    `UPDATE checkout_sessions
     SET shipping_address = $1, billing_address = $2, updated_at = NOW()
     WHERE id = $3
     RETURNING *`,
    [JSON.stringify(payload.shipping), JSON.stringify(payload.billing || payload.shipping), sessionId]
  );
  return result.rows[0];
}

export async function getCheckout(sessionId: string) {
  const res = await query('SELECT * FROM checkout_sessions WHERE id = $1', [sessionId]);
  return res.rows[0] || null;
}

export async function computeShipping(sessionId: string, regionCode: string) {
  const session = await getCheckout(sessionId);
  if (!session) throw new Error('Checkout not found');
  const cart = await getCart(session.cart_id);
  if (!cart) throw new Error('Cart not found');

  const options = await getShippingOptions({
    cartId: cart.id,
    regionCode,
    subtotalCents: cart.subtotal_cents,
  });
  return options;
}

export async function selectShipping(sessionId: string, selection: { id: string; priceCents: number; label: string; regionCode: string; estimatedDays?: number }) {
  const session = await getCheckout(sessionId);
  if (!session) throw new Error('Checkout not found');
  const cartId = session.cart_id;

  await query(
    'UPDATE carts SET shipping_cents = $1 WHERE id = $2',
    [selection.priceCents, cartId]
  );

  const updated = await query(
    `UPDATE checkout_sessions
     SET selected_shipping = $1, updated_at = NOW()
     WHERE id = $2
     RETURNING *`,
    [JSON.stringify(selection), sessionId]
  );

  await recalcCart(cartId);
  return updated.rows[0];
}

export async function applyCouponToCart(cartId: string, code: string, customerId?: string | null) {
  const cart = await getCart(cartId);
  if (!cart) throw new Error('Cart not found');

  const validation = await validateCoupon(code, cart.subtotal_cents, customerId || null);
  if (!validation.ok) return { ok: false, reason: validation.reason } as const;

  const discount = calculateDiscount(validation.coupon, cart.subtotal_cents, cart.shipping_cents);
  await query(
    'UPDATE carts SET coupon_code = $1, discount_cents = $2 WHERE id = $3',
    [code, discount, cartId]
  );
  await recalcCart(cartId);
  return { ok: true, coupon: validation.coupon, discount } as const;
}

export async function computeTaxes(sessionId: string, regionCode: string) {
  const session = await getCheckout(sessionId);
  if (!session) throw new Error('Checkout not found');
  const cart = await getCart(session.cart_id);
  if (!cart) throw new Error('Cart not found');

  const tax = await calculateTax(cart.subtotal_cents - cart.discount_cents, regionCode);
  await query('UPDATE carts SET tax_cents = $1 WHERE id = $2', [tax.amountCents, cart.id]);
  await recalcCart(cart.id);
  return tax;
}

export async function reserveInventoryForCheckout(sessionId: string) {
  const session = await getCheckout(sessionId);
  if (!session) throw new Error('Checkout not found');
  const cart = await getCart(session.cart_id);
  if (!cart) throw new Error('Cart not found');

  const expiresAt = new Date(session.expires_at);
  for (const item of cart.items || []) {
    const trackedRes = await query('SELECT tracked FROM inventory_items WHERE variant_id = $1', [item.variant_id]);
    const tracked = trackedRes.rows.length === 0 ? true : trackedRes.rows[0].tracked;
    if (!tracked) continue;
    await reserveInventory({
      variantId: item.variant_id,
      qty: Number(item.qty),
      refType: 'checkout_session',
      refId: session.id,
      expiresAt,
    });
  }

  await query('UPDATE checkout_sessions SET state = $1 WHERE id = $2', ['reserved', session.id]);
}

export async function checkoutTotals(sessionId: string) {
  const session = await getCheckout(sessionId);
  if (!session) throw new Error('Checkout not found');
  const cart = await getCart(session.cart_id);
  if (!cart) throw new Error('Cart not found');
  return cart;
}

export async function markCheckoutState(sessionId: string, state: string) {
  await query('UPDATE checkout_sessions SET state = $1, updated_at = NOW() WHERE id = $2', [state, sessionId]);
}
