import { query } from '@/src/ecommerce/db/queries';

export async function getCartWeight(cartId: string) {
  const res = await query(
    `SELECT SUM(v.weight_grams * ci.qty) AS total_weight
     FROM cart_items ci
     JOIN product_variants v ON v.id = ci.variant_id
     WHERE ci.cart_id = $1`,
    [cartId]
  );
  return Number(res.rows[0]?.total_weight || 0);
}

export async function getShippingOptions(params: { cartId: string; regionCode: string; subtotalCents: number }) {
  const weight = await getCartWeight(params.cartId);
  const res = await query(
    `SELECT * FROM shipping_rates
     WHERE active = true
       AND region_code = $1
       AND (min_weight_grams IS NULL OR min_weight_grams <= $2)
       AND (max_weight_grams IS NULL OR max_weight_grams >= $2)
       AND (min_subtotal_cents IS NULL OR min_subtotal_cents <= $3)
       AND (max_subtotal_cents IS NULL OR max_subtotal_cents >= $3)
     ORDER BY price_cents ASC`,
    [params.regionCode, weight, params.subtotalCents]
  );

  return res.rows.map((row) => ({
    id: row.id,
    regionCode: row.region_code,
    priceCents: Number(row.price_cents),
    currency: row.currency,
    estimatedDays: row.estimated_days,
    label: `${row.region_code} - ${row.estimated_days || 0} dias`,
  }));
}
