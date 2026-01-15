'use client';

import React, { useEffect, useState } from 'react';
import { canonicalProductSlug } from '@/src/ecommerce/slugAliases';

interface ProductDetailProps {
  slug: string;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ slug }) => {
  const [product, setProduct] = useState<any | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const resolvedSlug = canonicalProductSlug(slug);
    const load = async () => {
      const res = await fetch(`/api/ecommerce/products/${resolvedSlug}`);
      const data = await res.json();
      if (res.ok) {
        setProduct(data.product);
        const firstVariant = data.product?.variants?.[0]?.id;
        if (firstVariant) setSelectedVariant(firstVariant);
      }
      setLoading(false);
    };
    load();
  }, [slug]);

  const addToCart = async () => {
    if (!selectedVariant) return;
    setAdding(true);
    await fetch('/api/ecommerce/cart/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ variantId: selectedVariant, qty: 1 }),
    });
    setAdding(false);
  };

  if (loading) return <div className="text-sm text-graphite-500">Carregando produto...</div>;
  if (!product) return <div className="text-sm text-graphite-500">Produto nao encontrado.</div>;

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-graphite-400">{product.status}</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">{product.title}</h1>
        <p className="mt-4 text-sm text-graphite-400">{product.description}</p>
      </div>
      <div className="rounded-3xl border border-white/10 bg-ink-900/70 p-8 space-y-4">
        <h3 className="text-lg font-semibold text-white">Detalhes</h3>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-[0.2em] text-graphite-500">Variante</label>
          <select
            className="w-full rounded-lg bg-white/5 p-3 text-sm text-white"
            value={selectedVariant}
            onChange={(e) => setSelectedVariant(e.target.value)}
          >
            {product.variants?.map((variant: any) => (
              <option key={variant.id} value={variant.id}>
                {variant.sku} - R$ {(variant.price_cents / 100).toFixed(2)}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={addToCart}
          className="w-full rounded-full bg-cobalt-500 px-6 py-3 text-sm font-semibold text-white hover:bg-cobalt-400"
        >
          {adding ? 'Adicionando...' : 'Adicionar ao carrinho'}
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
