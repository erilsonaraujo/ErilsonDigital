'use client';

import React, { useEffect, useState } from 'react';

const CheckoutView: React.FC = () => {
  const [cart, setCart] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [regionCode, setRegionCode] = useState('BR');
  const [shippingOptions, setShippingOptions] = useState<any[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<any | null>(null);
  const [provider, setProvider] = useState('mercadopago');
  const [coupon, setCoupon] = useState('');
  const [loadingPay, setLoadingPay] = useState(false);
  const [pixPayload, setPixPayload] = useState<any | null>(null);

  const loadCart = async () => {
    const res = await fetch('/api/ecommerce/cart');
    const data = await res.json();
    if (res.ok) setCart(data.cart);
    setLoading(false);
  };

  useEffect(() => {
    loadCart();
  }, []);

  const startCheckout = async () => {
    if (!cart?.id || !email) return;
    const res = await fetch('/api/ecommerce/checkout/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartId: cart.id, email }),
    });
    const data = await res.json();
    if (res.ok) setSessionId(data.session.id);
  };

  const loadShipping = async () => {
    if (!sessionId) return;
    const res = await fetch('/api/ecommerce/checkout/shipping', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, regionCode }),
    });
    const data = await res.json();
    if (res.ok) setShippingOptions(data.options || []);
  };

  const selectShipping = async () => {
    if (!sessionId || !selectedShipping) return;
    await fetch('/api/ecommerce/checkout/shipping', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, regionCode, selection: selectedShipping }),
    });
    loadCart();
  };

  const applyCoupon = async () => {
    if (!cart?.id || !coupon) return;
    await fetch('/api/ecommerce/checkout/apply-coupon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartId: cart.id, code: coupon }),
    });
    loadCart();
  };

  const pay = async () => {
    if (!sessionId) return;
    setLoadingPay(true);
    const res = await fetch('/api/ecommerce/checkout/pay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, provider }),
    });
    const data = await res.json();
    setLoadingPay(false);
    if (res.ok && data.checkoutUrl) {
      window.location.href = data.checkoutUrl;
      return;
    }
    if (res.ok && data.pix) {
      setPixPayload(data.pix);
    }
  };

  if (loading) return <div className="text-sm text-graphite-500">Carregando checkout...</div>;
  if (!cart || !cart.items?.length) return <div className="text-sm text-graphite-500">Carrinho vazio.</div>;

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">Dados do comprador</h2>
        <input
          className="w-full rounded-lg bg-white/5 p-3 text-sm text-white"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          className="rounded-lg bg-cobalt-500 px-4 py-2 text-sm font-semibold text-white"
          onClick={startCheckout}
        >
          Iniciar checkout
        </button>

        <div className="border-t border-white/10 pt-4 space-y-3">
          <h3 className="text-sm font-semibold text-white">Frete</h3>
          <input
            className="w-full rounded-lg bg-white/5 p-3 text-sm text-white"
            placeholder="Regiao"
            value={regionCode}
            onChange={(e) => setRegionCode(e.target.value)}
          />
          <button
            className="rounded-lg bg-white/10 px-4 py-2 text-xs text-white"
            onClick={loadShipping}
          >
            Calcular frete
          </button>
          <div className="space-y-2">
            {shippingOptions.map((opt) => (
              <label key={opt.id} className="flex items-center gap-2 text-xs text-graphite-300">
                <input
                  type="radio"
                  name="shipping"
                  checked={selectedShipping?.id === opt.id}
                  onChange={() => setSelectedShipping(opt)}
                />
                {opt.label} - R$ {(opt.priceCents / 100).toFixed(2)}
              </label>
            ))}
          </div>
          <button
            className="rounded-lg bg-white/10 px-4 py-2 text-xs text-white"
            onClick={selectShipping}
          >
            Aplicar frete
          </button>
        </div>

        <div className="border-t border-white/10 pt-4 space-y-3">
          <h3 className="text-sm font-semibold text-white">Cupom</h3>
          <input
            className="w-full rounded-lg bg-white/5 p-3 text-sm text-white"
            placeholder="Codigo"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
          />
          <button className="rounded-lg bg-white/10 px-4 py-2 text-xs text-white" onClick={applyCoupon}>
            Aplicar cupom
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-ink-900/70 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">Pagamento</h2>
        <div className="text-xs text-graphite-400">Subtotal: R$ {(cart.subtotal_cents / 100).toFixed(2)}</div>
        <div className="text-xs text-graphite-400">Total: R$ {(cart.total_cents / 100).toFixed(2)}</div>

        <select
          className="w-full rounded-lg bg-white/5 p-3 text-sm text-white"
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
        >
          <option value="mercadopago">Mercado Pago</option>
          <option value="stripe">Stripe</option>
          <option value="paypal">PayPal</option>
          <option value="pix">PIX (transferencia direta)</option>
        </select>

        <button
          className="w-full rounded-full bg-cobalt-500 px-6 py-3 text-sm font-semibold text-white"
          onClick={pay}
          disabled={loadingPay}
        >
          {loadingPay ? 'Redirecionando...' : 'Pagar agora'}
        </button>

        {pixPayload && (
          <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-graphite-300">
            <p className="text-sm font-semibold text-white">PIX gerado</p>
            <p className="mt-2">Codigo: <span className="text-graphite-100">{pixPayload.code}</span></p>
            <p className="mt-1">Texto QR: <span className="text-graphite-100">{pixPayload.qrText}</span></p>
            <p className="mt-1">Expira em: {new Date(pixPayload.expiresAt).toLocaleString('pt-BR')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutView;
