'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const CartView: React.FC = () => {
  const [cart, setCart] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const loadCart = async () => {
    const res = await fetch('/api/ecommerce/cart');
    const data = await res.json();
    if (res.ok) setCart(data.cart);
    setLoading(false);
  };

  useEffect(() => {
    loadCart();
  }, []);

  const updateQty = async (itemId: string, qty: number) => {
    await fetch(`/api/ecommerce/cart/items/${itemId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qty }),
    });
    loadCart();
  };

  if (loading) return <div className="text-sm text-graphite-500">Carregando carrinho...</div>;

  if (!cart || !cart.items?.length) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-sm text-graphite-400">
        Seu carrinho esta vazio. <Link href="/store" className="text-cobalt-400">Explorar produtos</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-white">Carrinho</h1>
      <div className="space-y-4">
        {cart.items.map((item: any) => (
          <div key={item.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">{item.product_title}</p>
                <p className="text-xs text-graphite-400">SKU: {item.sku}</p>
              </div>
              <div className="text-sm text-white">R$ {(item.unit_price_cents / 100).toFixed(2)}</div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <button
                className="h-8 w-8 rounded-full bg-white/10 text-white"
                onClick={() => updateQty(item.id, Math.max(1, item.qty - 1))}
              >
                -
              </button>
              <span className="text-sm text-white">{item.qty}</span>
              <button
                className="h-8 w-8 rounded-full bg-white/10 text-white"
                onClick={() => updateQty(item.id, item.qty + 1)}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-white/10 bg-ink-900/70 p-6">
        <div className="flex items-center justify-between text-sm text-graphite-300">
          <span>Subtotal</span>
          <span>R$ {(cart.subtotal_cents / 100).toFixed(2)}</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm text-graphite-300">
          <span>Total</span>
          <span>R$ {(cart.total_cents / 100).toFixed(2)}</span>
        </div>
        <Link
          href="/store/checkout"
          className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-cobalt-500 px-6 py-3 text-sm font-semibold text-white"
        >
          Finalizar compra
        </Link>
      </div>
    </div>
  );
};

export default CartView;
