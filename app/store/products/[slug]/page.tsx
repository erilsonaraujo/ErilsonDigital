import ProductDetail from '@/components/ecommerce/ProductDetail';

export default function ProductPage({ params }: { params: { slug: string } }) {
  return <ProductDetail slug={params.slug} />;
}
