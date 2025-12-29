import { NextRequest, NextResponse } from 'next/server';
import { ensureAdminSession } from '@/lib/adminAuth';
import { query } from '@/src/ecommerce/db/queries';
import { adjustInventory } from '@/src/ecommerce/services/inventoryService';
import { isEcommerceAdminEnabled } from '@/src/ecommerce/services/flags';

export async function GET(request: NextRequest) {
  if (!isEcommerceAdminEnabled()) {
    return NextResponse.json({ error: 'Ecommerce admin disabled' }, { status: 404 });
  }
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const res = await query(
    `SELECT il.*, v.sku, p.title AS product_title
     FROM inventory_levels il
     JOIN product_variants v ON v.id = il.variant_id
     JOIN products p ON p.id = v.product_id
     ORDER BY p.title ASC`
  );
  return NextResponse.json({ inventory: res.rows });
}

export async function PATCH(request: NextRequest) {
  if (!isEcommerceAdminEnabled()) {
    return NextResponse.json({ error: 'Ecommerce admin disabled' }, { status: 404 });
  }
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { variantId, delta, reason } = await request.json();
  if (!variantId || delta === undefined) {
    return NextResponse.json({ error: 'variantId and delta required' }, { status: 400 });
  }

  const result = await adjustInventory(variantId, Number(delta), reason || 'manual_adjust');
  return NextResponse.json({ inventory: result });
}
