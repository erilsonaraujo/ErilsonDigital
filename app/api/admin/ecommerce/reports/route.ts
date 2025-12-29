import { NextRequest, NextResponse } from 'next/server';
import { ensureAdminSession } from '@/lib/adminAuth';
import { query } from '@/src/ecommerce/db/queries';
import { isEcommerceAdminEnabled } from '@/src/ecommerce/services/flags';

const getRange = (range: string) => {
  const now = new Date();
  let start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  if (range === '7d') start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  if (range === '30d') start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  return { start, end: now };
};

export async function GET(request: NextRequest) {
  if (!isEcommerceAdminEnabled()) {
    return NextResponse.json({ error: 'Ecommerce admin disabled' }, { status: 404 });
  }
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const range = searchParams.get('range') || '24h';
  const { start, end } = getRange(range);

  const [ordersRes, revenueRes, refundsRes] = await Promise.all([
    query('SELECT COUNT(*) FROM orders WHERE created_at BETWEEN $1 AND $2', [start, end]),
    query('SELECT COALESCE(SUM(total_cents), 0) AS total FROM orders WHERE created_at BETWEEN $1 AND $2', [start, end]),
    query('SELECT COALESCE(SUM(amount_cents), 0) AS total FROM refunds WHERE created_at BETWEEN $1 AND $2', [start, end]),
  ]);

  return NextResponse.json({
    stats: {
      orders: Number(ordersRes.rows[0].count || 0),
      revenueCents: Number(revenueRes.rows[0].total || 0),
      refundsCents: Number(refundsRes.rows[0].total || 0),
    },
  });
}
