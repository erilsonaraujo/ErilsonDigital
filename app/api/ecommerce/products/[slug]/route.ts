import { NextRequest, NextResponse } from 'next/server';
import { getProductBySlug } from '@/src/ecommerce/services/catalogService';
import { isEcommerceEnabled } from '@/src/ecommerce/services/flags';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!isEcommerceEnabled()) {
    return NextResponse.json({ error: 'Ecommerce disabled' }, { status: 404 });
  }

  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ product });
}
