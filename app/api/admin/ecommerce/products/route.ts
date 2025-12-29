import { NextRequest, NextResponse } from 'next/server';
import { ensureAdminSession } from '@/lib/adminAuth';
import { listProducts, createProduct, updateProduct, deleteProduct, createVariant, setProductCategories } from '@/src/ecommerce/services/catalogService';
import { query } from '@/src/ecommerce/db/queries';
import { isEcommerceAdminEnabled } from '@/src/ecommerce/services/flags';

export async function GET(request: NextRequest) {
  if (!isEcommerceAdminEnabled()) {
    return NextResponse.json({ error: 'Ecommerce admin disabled' }, { status: 404 });
  }
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const products = await listProducts({ status });
  return NextResponse.json({ products });
}

export async function POST(request: NextRequest) {
  if (!isEcommerceAdminEnabled()) {
    return NextResponse.json({ error: 'Ecommerce admin disabled' }, { status: 404 });
  }
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const product = await createProduct({
    title: body.title,
    slug: body.slug,
    description: body.description || null,
    brand: body.brand || null,
    status: body.status || 'draft',
    seoTitle: body.seoTitle || null,
    seoDesc: body.seoDesc || null,
  });

  if (Array.isArray(body.categoryIds)) {
    await setProductCategories(product.id, body.categoryIds);
  }

  const variants = [] as any[];
  if (Array.isArray(body.variants)) {
    for (const variant of body.variants) {
      const created = await createVariant({
        productId: product.id,
        sku: variant.sku,
        attrs: variant.attrs || {},
        priceCents: Number(variant.priceCents || 0),
        compareAtCents: variant.compareAtCents ? Number(variant.compareAtCents) : null,
        currency: variant.currency || 'BRL',
        weightGrams: variant.weightGrams ? Number(variant.weightGrams) : 0,
        dims: variant.dims || {},
        status: variant.status || 'active',
        barcode: variant.barcode || null,
      });
      await query('INSERT INTO inventory_items (variant_id, tracked) VALUES ($1, $2) ON CONFLICT (variant_id) DO NOTHING', [created.id, true]);
      variants.push(created);
    }
  }

  return NextResponse.json({ product, variants });
}

export async function PATCH(request: NextRequest) {
  if (!isEcommerceAdminEnabled()) {
    return NextResponse.json({ error: 'Ecommerce admin disabled' }, { status: 404 });
  }
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  if (!body.id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const updated = await updateProduct(body.id, {
    status: body.status,
    title: body.title,
    slug: body.slug,
    description: body.description,
    brand: body.brand,
    seoTitle: body.seoTitle,
    seoDesc: body.seoDesc,
  });

  if (Array.isArray(body.categoryIds)) {
    await setProductCategories(body.id, body.categoryIds);
  }

  return NextResponse.json({ product: updated });
}

export async function DELETE(request: NextRequest) {
  if (!isEcommerceAdminEnabled()) {
    return NextResponse.json({ error: 'Ecommerce admin disabled' }, { status: 404 });
  }
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  await deleteProduct(id);
  return NextResponse.json({ success: true });
}
