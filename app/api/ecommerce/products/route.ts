import { NextRequest, NextResponse } from 'next/server';
import { listProducts } from '@/src/ecommerce/services/catalogService';
import { isEcommerceEnabled } from '@/src/ecommerce/services/flags';

export async function GET(request: NextRequest) {
  if (!isEcommerceEnabled()) {
    return NextResponse.json({ error: 'Ecommerce disabled' }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const queryText = searchParams.get('query');
  const category = searchParams.get('category');
  const min = searchParams.get('min');
  const max = searchParams.get('max');
  const attrsRaw = searchParams.get('attrs');

  let attrs: Record<string, string> | null = null;
  if (attrsRaw) {
    try {
      attrs = JSON.parse(attrsRaw);
    } catch {
      attrs = null;
    }
  }

  const products = await listProducts({
    queryText,
    category,
    minPrice: min ? Number(min) : null,
    maxPrice: max ? Number(max) : null,
    attrs,
    status: 'active',
  });

  return NextResponse.json({ products });
}
