import { query } from '@/src/ecommerce/db/queries';

export async function validateCoupon(code: string, subtotalCents: number, customerId?: string | null) {
  const result = await query('SELECT * FROM coupons WHERE code = $1 AND active = true', [code]);
  if (result.rows.length === 0) return { ok: false, reason: 'Coupon not found' } as const;

  const coupon = result.rows[0];
  const now = new Date();
  if (coupon.starts_at && new Date(coupon.starts_at) > now) return { ok: false, reason: 'Coupon not active' } as const;
  if (coupon.ends_at && new Date(coupon.ends_at) < now) return { ok: false, reason: 'Coupon expired' } as const;

  if (coupon.min_subtotal_cents && subtotalCents < Number(coupon.min_subtotal_cents)) {
    return { ok: false, reason: 'Minimum subtotal not met' } as const;
  }

  if (coupon.max_uses) {
    const usage = await query('SELECT COUNT(*) FROM coupon_redemptions WHERE coupon_id = $1', [coupon.id]);
    if (Number(usage.rows[0].count) >= Number(coupon.max_uses)) {
      return { ok: false, reason: 'Coupon maxed out' } as const;
    }
  }

  if (coupon.per_customer_limit && customerId) {
    const usage = await query(
      'SELECT COUNT(*) FROM coupon_redemptions WHERE coupon_id = $1 AND customer_id = $2',
      [coupon.id, customerId]
    );
    if (Number(usage.rows[0].count) >= Number(coupon.per_customer_limit)) {
      return { ok: false, reason: 'Coupon limit reached' } as const;
    }
  }

  return { ok: true, coupon } as const;
}

export function calculateDiscount(coupon: any, subtotalCents: number, shippingCents: number) {
  if (coupon.type === 'percent') {
    return Math.floor(subtotalCents * (Number(coupon.amount) / 100));
  }
  if (coupon.type === 'fixed') {
    return Math.min(subtotalCents, Number(coupon.amount));
  }
  if (coupon.type === 'free_shipping') {
    return shippingCents;
  }
  return 0;
}
