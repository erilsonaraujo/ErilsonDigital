import { query } from '@/src/ecommerce/db/queries';

export async function calculateTax(subtotalCents: number, regionCode: string) {
  const res = await query(
    'SELECT rate_percent FROM tax_rates WHERE active = true AND region_code = $1 ORDER BY rate_percent DESC LIMIT 1',
    [regionCode]
  );
  if (res.rows.length === 0) return { amountCents: 0, ratePercent: 0 };
  const rate = Number(res.rows[0].rate_percent || 0);
  const amount = Math.round(subtotalCents * (rate / 100));
  return { amountCents: amount, ratePercent: rate };
}
