'use client';

import React from 'react';
import Link from 'next/link';

interface ProductCardProps {
  product: any;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const variant = product.variants?.[0];
  return (
    <Link
      href={`/store/products/${product.slug}`}
      className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-cobalt-400"
    >
      <div className="text-xs uppercase tracking-[0.3em] text-graphite-400">{product.status}</div>
      <h3 className="mt-3 text-lg font-semibold text-white group-hover:text-cobalt-200">{product.title}</h3>
      <p className="mt-2 text-sm text-graphite-400 line-clamp-2">{product.description}</p>
      <div className="mt-4 text-sm font-semibold text-white">
        {variant ? `R$ ${(variant.price_cents / 100).toFixed(2)}` : 'Sob consulta'}
      </div>
    </Link>
  );
};

export default ProductCard;
