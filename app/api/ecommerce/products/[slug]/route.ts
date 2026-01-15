import { NextRequest, NextResponse } from 'next/server';
import { getProductBySlug } from '@/src/ecommerce/services/catalogService';
import { isEcommerceEnabled } from '@/src/ecommerce/services/flags';
import { productSlugCandidates } from '@/src/ecommerce/slugAliases';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!isEcommerceEnabled()) {
    return NextResponse.json({ error: 'Ecommerce disabled' }, { status: 404 });
  }

  const { slug } = await params;
  const candidates = productSlugCandidates(slug);
  const products = await Promise.all(candidates.map((candidate) => getProductBySlug(candidate)));
  const product = products.find(Boolean) ?? null;
  if (!product) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ product });
}
