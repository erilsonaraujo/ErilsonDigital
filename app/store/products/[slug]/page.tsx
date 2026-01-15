import ProductDetail from '@/components/ecommerce/ProductDetail';
import { canonicalProductSlug } from '@/src/ecommerce/slugAliases';
import { redirect } from 'next/navigation';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const canonical = canonicalProductSlug(slug);
  if (canonical !== slug) {
    redirect(`/store/products/${canonical}`);
  }
  return <ProductDetail slug={canonical} />;
}
