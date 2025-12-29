import { NextRequest, NextResponse } from 'next/server';
import { ensureAdminSession } from '@/lib/adminAuth';
import { query } from '@/src/ecommerce/db/queries';
import { isEcommerceAdminEnabled } from '@/src/ecommerce/services/flags';

export async function GET(request: NextRequest) {
  if (!isEcommerceAdminEnabled()) {
    return NextResponse.json({ error: 'Ecommerce admin disabled' }, { status: 404 });
  }
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || 'pending';

  const res = await query(
    `SELECT p.id AS payment_id,
            p.order_id,
            p.amount_cents,
            p.currency,
            p.status AS payment_status,
            o.order_number,
            o.email,
            px.code,
            px.qr_text,
            px.expires_at,
            px.status AS pix_status
     FROM pix_payments px
     JOIN payments p ON p.id = px.payment_id
     JOIN orders o ON o.id = p.order_id
     WHERE px.status = $1
     ORDER BY px.created_at DESC`,
    [status]
  );

  return NextResponse.json({ pix: res.rows });
}
