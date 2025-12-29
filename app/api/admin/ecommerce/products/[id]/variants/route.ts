import { NextRequest, NextResponse } from 'next/server';
import { ensureAdminSession } from '@/lib/adminAuth';
import { createVariant, updateVariant, deleteVariant } from '@/src/ecommerce/services/catalogService';
import { query } from '@/src/ecommerce/db/queries';
import { isEcommerceAdminEnabled } from '@/src/ecommerce/services/flags';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isEcommerceAdminEnabled()) {
    return NextResponse.json({ error: 'Ecommerce admin disabled' }, { status: 404 });
  }
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const res = await query('SELECT * FROM product_variants WHERE product_id = $1 ORDER BY created_at ASC', [id]);
  return NextResponse.json({ variants: res.rows });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isEcommerceAdminEnabled()) {
    return NextResponse.json({ error: 'Ecommerce admin disabled' }, { status: 404 });
  }
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { id } = await params;
  const created = await createVariant({
    productId: id,
    sku: body.sku,
    attrs: body.attrs || {},
    priceCents: Number(body.priceCents || 0),
    compareAtCents: body.compareAtCents ? Number(body.compareAtCents) : null,
    currency: body.currency || 'BRL',
    weightGrams: body.weightGrams ? Number(body.weightGrams) : 0,
    dims: body.dims || {},
    status: body.status || 'active',
    barcode: body.barcode || null,
  });
  await query('INSERT INTO inventory_items (variant_id, tracked) VALUES ($1, $2) ON CONFLICT (variant_id) DO NOTHING', [created.id, true]);
  return NextResponse.json({ variant: created });
}

export async function PATCH(request: NextRequest) {
  if (!isEcommerceAdminEnabled()) {
    return NextResponse.json({ error: 'Ecommerce admin disabled' }, { status: 404 });
  }
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  if (!body.id) return NextResponse.json({ error: 'variant id required' }, { status: 400 });

  const updated = await updateVariant(body.id, {
    sku: body.sku,
    barcode: body.barcode,
    attrs: body.attrs,
    priceCents: body.priceCents,
    compareAtCents: body.compareAtCents,
    currency: body.currency,
    weightGrams: body.weightGrams,
    dims: body.dims,
    status: body.status,
  });
  return NextResponse.json({ variant: updated });
}

export async function DELETE(request: NextRequest) {
  if (!isEcommerceAdminEnabled()) {
    return NextResponse.json({ error: 'Ecommerce admin disabled' }, { status: 404 });
  }
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'variant id required' }, { status: 400 });

  await deleteVariant(id);
  return NextResponse.json({ success: true });
}
