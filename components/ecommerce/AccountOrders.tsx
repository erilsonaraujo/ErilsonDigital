'use client';

import React, { useState } from 'react';

const AccountOrders: React.FC = () => {
  const [email, setEmail] = useState('');
  const [orders, setOrders] = useState<any[]>([]);

  const loadOrders = async () => {
    if (!email) return;
    const res = await fetch(`/api/ecommerce/orders?email=${encodeURIComponent(email)}`);
    const data = await res.json();
    if (res.ok) setOrders(data.orders || []);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3">
        <h1 className="text-lg font-semibold text-white">Consultar pedidos</h1>
        <input
          className="w-full rounded-lg bg-white/5 p-3 text-sm text-white"
          placeholder="Email usado na compra"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          className="rounded-lg bg-cobalt-500 px-4 py-2 text-sm font-semibold text-white"
          onClick={loadOrders}
        >
          Buscar pedidos
        </button>
      </div>

      <div className="space-y-3">
        {orders.map((order) => (
          <div key={order.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-white">Pedido #{order.order_number}</p>
              <span className="text-xs text-graphite-400">{order.status}</span>
            </div>
            <div className="text-xs text-graphite-400">Total: R$ {(order.total_cents / 100).toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountOrders;
