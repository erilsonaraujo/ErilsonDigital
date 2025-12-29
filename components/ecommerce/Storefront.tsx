'use client';

import React, { useEffect, useState } from 'react';
import ProductCard from '@/components/ecommerce/ProductCard';

const Storefront: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/ecommerce/products');
      const data = await res.json();
      if (res.ok) setProducts(data.products || []);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-graphite-400">Catalogo</p>
        <h1 className="mt-2 text-3xl font-semibold">Produtos premium</h1>
        <p className="mt-3 max-w-2xl text-sm text-graphite-400">
          Um catalogo exclusivo para produtos digitais e servicos premium. Selecione um item para detalhes.
        </p>
      </div>

      {loading && <div className="text-sm text-graphite-500">Carregando produtos...</div>}

      {!loading && products.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-sm text-graphite-400">
          Nenhum produto publicado ainda.
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Storefront;
