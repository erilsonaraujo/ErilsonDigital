import { query, withTransaction } from '@/src/ecommerce/db/queries';
import { ensureDefaultLocation, getInventoryLevel } from '@/src/ecommerce/services/inventoryService';
import crypto from 'crypto';

export async function createCart(sessionId?: string | null, customerId?: string | null) {
  const cart = await query(
    `INSERT INTO carts (session_id, customer_id)
     VALUES ($1, $2)
     RETURNING *`,
    [sessionId || null, customerId || null]
  );
  return cart.rows[0];
}

export async function resolveCart(sessionId?: string | null, customerId?: string | null) {
  if (customerId) {
    const byCustomer = await query(
      'SELECT * FROM carts WHERE customer_id = $1 ORDER BY created_at DESC LIMIT 1',
      [customerId]
    );
    if (byCustomer.rows.length > 0) return byCustomer.rows[0];
  }

  if (sessionId) {
    const bySession = await query(
      'SELECT * FROM carts WHERE session_id = $1 ORDER BY created_at DESC LIMIT 1',
      [sessionId]
    );
    if (bySession.rows.length > 0) return bySession.rows[0];
  }

  const newSession = sessionId || crypto.randomUUID();
  return createCart(newSession, customerId || null);
}

export async function getCart(cartId: string) {
  const cartRes = await query('SELECT * FROM carts WHERE id = $1', [cartId]);
  if (cartRes.rows.length === 0) return null;
  const itemsRes = await query(
    `SELECT ci.*, v.sku, v.price_cents, v.currency, v.attrs, p.title AS product_title
     FROM cart_items ci
     JOIN product_variants v ON v.id = ci.variant_id
     JOIN products p ON p.id = v.product_id
     WHERE ci.cart_id = $1
     ORDER BY ci.created_at ASC`,
    [cartId]
  );
  return { ...cartRes.rows[0], items: itemsRes.rows };
}

export async function addItem(cartId: string, variantId: string, qty: number) {
  return withTransaction(async (client) => {
    const variantRes = await client.query(
      'SELECT * FROM product_variants WHERE id = $1 LIMIT 1',
      [variantId]
    );
    if (variantRes.rows.length === 0) throw new Error('Variant not found');
    const variant = variantRes.rows[0];

    const inventoryItemRes = await client.query(
      'SELECT tracked FROM inventory_items WHERE variant_id = $1',
      [variantId]
    );
    const tracked = inventoryItemRes.rows.length === 0 ? true : inventoryItemRes.rows[0].tracked;
    if (tracked) {
      await ensureDefaultLocation(client);
      const { level } = await getInventoryLevel(variantId, client);
      if (Number(level.available) < qty) throw new Error('Insufficient inventory');
    }

    const existing = await client.query(
      'SELECT * FROM cart_items WHERE cart_id = $1 AND variant_id = $2 LIMIT 1',
      [cartId, variantId]
    );

    if (existing.rows.length > 0) {
      const nextQty = Number(existing.rows[0].qty) + qty;
      await client.query(
        'UPDATE cart_items SET qty = $1, updated_at = NOW() WHERE id = $2',
        [nextQty, existing.rows[0].id]
      );
    } else {
      await client.query(
        `INSERT INTO cart_items (cart_id, variant_id, qty, unit_price_cents)
         VALUES ($1, $2, $3, $4)`,
        [cartId, variantId, qty, variant.price_cents]
      );
    }

    await recalcCart(cartId, client);
    return getCart(cartId);
  });
}

export async function updateItemQty(itemId: string, qty: number) {
  return withTransaction(async (client) => {
    const itemRes = await client.query('SELECT * FROM cart_items WHERE id = $1', [itemId]);
    if (itemRes.rows.length === 0) throw new Error('Item not found');
    const item = itemRes.rows[0];

    if (qty <= 0) {
      await client.query('DELETE FROM cart_items WHERE id = $1', [itemId]);
    } else {
      await client.query('UPDATE cart_items SET qty = $1, updated_at = NOW() WHERE id = $2', [qty, itemId]);
    }

    await recalcCart(item.cart_id, client);
    return getCart(item.cart_id);
  });
}

export async function removeItem(itemId: string) {
  return withTransaction(async (client) => {
    const itemRes = await client.query('SELECT * FROM cart_items WHERE id = $1', [itemId]);
    if (itemRes.rows.length === 0) throw new Error('Item not found');
    const item = itemRes.rows[0];
    await client.query('DELETE FROM cart_items WHERE id = $1', [itemId]);
    await recalcCart(item.cart_id, client);
    return getCart(item.cart_id);
  });
}

export async function recalcCart(cartId: string, clientOverride?: { query: (text: string, params?: unknown[]) => Promise<any> }) {
  const executor = clientOverride || { query };
  const itemsRes = await executor.query(
    'SELECT qty, unit_price_cents FROM cart_items WHERE cart_id = $1',
    [cartId]
  );
  const subtotal = itemsRes.rows.reduce(
    (sum: number, row: { qty: number; unit_price_cents: number }) => sum + Number(row.qty) * Number(row.unit_price_cents),
    0
  );

  const cartRes = await executor.query('SELECT discount_cents, shipping_cents, tax_cents FROM carts WHERE id = $1', [cartId]);
  const cart = cartRes.rows[0] || { discount_cents: 0, shipping_cents: 0, tax_cents: 0 };
  const discount = Number(cart.discount_cents || 0);
  const shipping = Number(cart.shipping_cents || 0);
  const tax = Number(cart.tax_cents || 0);
  const total = Math.max(0, subtotal - discount + shipping + tax);

  await executor.query(
    'UPDATE carts SET subtotal_cents = $1, total_cents = $2, updated_at = NOW() WHERE id = $3',
    [subtotal, total, cartId]
  );
}
