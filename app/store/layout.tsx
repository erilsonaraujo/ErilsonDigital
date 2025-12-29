import React from 'react';
import Link from 'next/link';

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink-950 text-white">
      <header className="border-b border-white/10 bg-ink-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-lg font-semibold tracking-tight">Erilson Store</Link>
          <nav className="flex items-center gap-6 text-xs uppercase tracking-[0.2em] text-slate-400">
            <Link href="/store" className="hover:text-white">Produtos</Link>
            <Link href="/store/cart" className="hover:text-white">Carrinho</Link>
            <Link href="/store/account" className="hover:text-white">Pedidos</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
