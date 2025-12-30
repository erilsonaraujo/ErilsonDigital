'use client';

import React, { useEffect, useState } from 'react';
import { Package, ShoppingBag, Layers, TicketPercent, Truck, ShieldCheck, BarChart3, Upload } from 'lucide-react';
import { formatDateTime } from '@/lib/date';

const tabs = [
  { id: 'products', label: 'Produtos', icon: Package },
  { id: 'orders', label: 'Pedidos', icon: ShoppingBag },
  { id: 'inventory', label: 'Estoque', icon: Layers },
  { id: 'coupons', label: 'Cupons', icon: TicketPercent },
  { id: 'shipping', label: 'Frete', icon: Truck },
  { id: 'taxes', label: 'Impostos', icon: ShieldCheck },
  { id: 'pix', label: 'PIX', icon: Upload },
  { id: 'reports', label: 'Relatorios', icon: BarChart3 },
];

const EcommerceView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [shippingRates, setShippingRates] = useState<any[]>([]);
  const [taxRates, setTaxRates] = useState<any[]>([]);
  const [reports, setReports] = useState<any>(null);
  const [pixPayments, setPixPayments] = useState<any[]>([]);

  const [newProduct, setNewProduct] = useState({
    title: '',
    slug: '',
    description: '',
    status: 'draft',
    sku: '',
    priceCents: 0,
  });
  const [aiLoading, setAiLoading] = useState(false);

  const [newCoupon, setNewCoupon] = useState({
    code: '',
    type: 'percent',
    amount: 10,
  });

  const [newShipping, setNewShipping] = useState({
    regionCode: 'BR',
    minWeightGrams: 0,
    maxWeightGrams: 0,
    minSubtotalCents: 0,
    maxSubtotalCents: 0,
    priceCents: 0,
    estimatedDays: 3,
  });

  const [newTax, setNewTax] = useState({
    regionCode: 'BR',
    ratePercent: 0,
  });

  useEffect(() => {
    if (activeTab === 'products') fetchProducts();
    if (activeTab === 'orders') fetchOrders();
    if (activeTab === 'inventory') fetchInventory();
    if (activeTab === 'coupons') fetchCoupons();
    if (activeTab === 'shipping') fetchShipping();
    if (activeTab === 'taxes') fetchTaxes();
    if (activeTab === 'pix') fetchPix();
    if (activeTab === 'reports') fetchReports();
  }, [activeTab]);

  const fetchProducts = async () => {
    const res = await fetch('/api/admin/ecommerce/products');
    const data = await res.json();
    if (res.ok) setProducts(data.products || []);
  };

  const fetchOrders = async () => {
    const res = await fetch('/api/admin/ecommerce/orders');
    const data = await res.json();
    if (res.ok) setOrders(data.orders || []);
  };

  const fetchInventory = async () => {
    const res = await fetch('/api/admin/ecommerce/inventory');
    const data = await res.json();
    if (res.ok) setInventory(data.inventory || []);
  };

  const fetchCoupons = async () => {
    const res = await fetch('/api/admin/ecommerce/coupons');
    const data = await res.json();
    if (res.ok) setCoupons(data.coupons || []);
  };

  const fetchShipping = async () => {
    const res = await fetch('/api/admin/ecommerce/shipping');
    const data = await res.json();
    if (res.ok) setShippingRates(data.rates || []);
  };

  const fetchTaxes = async () => {
    const res = await fetch('/api/admin/ecommerce/taxes');
    const data = await res.json();
    if (res.ok) setTaxRates(data.taxes || []);
  };

  const fetchPix = async () => {
    const res = await fetch('/api/admin/ecommerce/pix?status=pending');
    const data = await res.json();
    if (res.ok) setPixPayments(data.pix || []);
  };

  const fetchReports = async () => {
    const res = await fetch('/api/admin/ecommerce/reports?range=30d');
    const data = await res.json();
    if (res.ok) setReports(data.stats || null);
  };

  const createProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/ecommerce/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newProduct.title,
        slug: newProduct.slug,
        description: newProduct.description,
        status: newProduct.status,
        variants: [
          {
            sku: newProduct.sku,
            priceCents: Number(newProduct.priceCents || 0),
          },
        ],
      }),
    });
    if (res.ok) {
      setNewProduct({ title: '', slug: '', description: '', status: 'draft', sku: '', priceCents: 0 });
      fetchProducts();
    }
  };

  const generateDescription = async () => {
    if (!newProduct.title) return;
    setAiLoading(true);
    const res = await fetch('/api/admin/ecommerce/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newProduct.title }),
    });
    const data = await res.json();
    if (res.ok) {
      setNewProduct((prev) => ({ ...prev, description: data.description || prev.description }));
    }
    setAiLoading(false);
  };

  const uploadMedia = async (productId: string, file: File) => {
    const form = new FormData();
    form.append('productId', productId);
    form.append('file', file);
    await fetch('/api/admin/ecommerce/media/upload', { method: 'POST', body: form });
    fetchProducts();
  };

  const createCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/ecommerce/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCoupon),
    });
    if (res.ok) {
      setNewCoupon({ code: '', type: 'percent', amount: 10 });
      fetchCoupons();
    }
  };

  const createShipping = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/ecommerce/shipping', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newShipping),
    });
    if (res.ok) {
      fetchShipping();
    }
  };

  const createTax = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/ecommerce/taxes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTax),
    });
    if (res.ok) {
      fetchTaxes();
    }
  };

  const markPixPaid = async (paymentId: string) => {
    const res = await fetch(`/api/admin/ecommerce/payments/${paymentId}/mark-paid`, {
      method: 'POST',
    });
    if (res.ok) fetchPix();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-all ${
              activeTab === tab.id ? 'bg-primary-500 text-white shadow-lg' : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'products' && (
        <div className="space-y-6">
          <form onSubmit={createProduct} className="rounded-2xl border border-white/10 bg-ink-900/70 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Novo produto</h3>
            <div className="grid gap-3 md:grid-cols-2">
              <input
                className="rounded-lg bg-white/5 p-3 text-sm text-white"
                placeholder="Titulo"
                value={newProduct.title}
                onChange={(e) => setNewProduct((prev) => ({ ...prev, title: e.target.value }))}
                required
              />
              <input
                className="rounded-lg bg-white/5 p-3 text-sm text-white"
                placeholder="Slug"
                value={newProduct.slug}
                onChange={(e) => setNewProduct((prev) => ({ ...prev, slug: e.target.value }))}
                required
              />
              <input
                className="rounded-lg bg-white/5 p-3 text-sm text-white"
                placeholder="SKU principal"
                value={newProduct.sku}
                onChange={(e) => setNewProduct((prev) => ({ ...prev, sku: e.target.value }))}
                required
              />
              <input
                type="number"
                className="rounded-lg bg-white/5 p-3 text-sm text-white"
                placeholder="Preco em centavos"
                value={newProduct.priceCents}
                onChange={(e) => setNewProduct((prev) => ({ ...prev, priceCents: Number(e.target.value) }))}
                required
              />
            </div>
            <textarea
              className="min-h-[120px] w-full rounded-lg bg-white/5 p-3 text-sm text-white"
              placeholder="Descricao"
              value={newProduct.description}
              onChange={(e) => setNewProduct((prev) => ({ ...prev, description: e.target.value }))}
            />
            <button
              type="button"
              className="rounded-lg border border-white/10 px-4 py-2 text-xs font-semibold text-white hover:border-cobalt-400"
              onClick={generateDescription}
              disabled={aiLoading}
            >
              {aiLoading ? 'Gerando...' : 'Gerar descricao com IA'}
            </button>
            <button className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white">Criar produto</button>
          </form>

          <div className="grid gap-4 md:grid-cols-2">
            {products.map((product) => (
              <div key={product.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-semibold text-white">{product.title}</h4>
                    <p className="text-xs text-slate-400">/{product.slug}</p>
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] uppercase tracking-widest text-slate-300">
                    {product.status}
                  </span>
                </div>
                <div className="mt-4 text-xs text-slate-400">
                  Variantes: {product.variants?.length || 0}
                </div>
                <label className="mt-4 flex cursor-pointer items-center gap-2 text-xs text-slate-300">
                  <Upload className="h-4 w-4" />
                  <span>Enviar imagem</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) uploadMedia(product.id, e.target.files[0]);
                    }}
                  />
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="grid gap-3">
          {orders.map((order) => (
            <div key={order.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">Pedido #{order.order_number}</p>
                  <p className="text-xs text-slate-400">{order.email}</p>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] uppercase tracking-widest text-slate-300">
                  {order.status}
                </span>
              </div>
              <div className="mt-2 text-xs text-slate-400">Total: R$ {(order.total_cents / 100).toFixed(2)}</div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="grid gap-3">
          {inventory.map((item) => (
            <div key={`${item.variant_id}-${item.location_id}`} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-semibold text-white">{item.product_title}</p>
              <p className="text-xs text-slate-400">SKU: {item.sku}</p>
              <div className="mt-2 text-xs text-slate-400">Disponivel: {item.available} | Reservado: {item.reserved}</div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'coupons' && (
        <div className="space-y-6">
          <form onSubmit={createCoupon} className="rounded-2xl border border-white/10 bg-ink-900/70 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Novo cupom</h3>
            <div className="grid gap-3 md:grid-cols-3">
              <input
                className="rounded-lg bg-white/5 p-3 text-sm text-white"
                placeholder="Codigo"
                value={newCoupon.code}
                onChange={(e) => setNewCoupon((prev) => ({ ...prev, code: e.target.value }))}
                required
              />
              <select
                className="rounded-lg bg-white/5 p-3 text-sm text-white"
                value={newCoupon.type}
                onChange={(e) => setNewCoupon((prev) => ({ ...prev, type: e.target.value }))}
              >
                <option value="percent">Percentual</option>
                <option value="fixed">Fixo</option>
                <option value="free_shipping">Frete Gratis</option>
              </select>
              <input
                type="number"
                className="rounded-lg bg-white/5 p-3 text-sm text-white"
                placeholder="Valor"
                value={newCoupon.amount}
                onChange={(e) => setNewCoupon((prev) => ({ ...prev, amount: Number(e.target.value) }))}
                required
              />
            </div>
            <button className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white">Criar cupom</button>
          </form>

          <div className="grid gap-3">
            {coupons.map((coupon) => (
              <div key={coupon.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">{coupon.code}</p>
                  <span className="text-xs text-slate-400">{coupon.type}</span>
                </div>
                <div className="text-xs text-slate-400">Valor: {coupon.amount}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'shipping' && (
        <div className="space-y-6">
          <form onSubmit={createShipping} className="rounded-2xl border border-white/10 bg-ink-900/70 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Nova faixa de frete</h3>
            <div className="grid gap-3 md:grid-cols-3">
              <input
                className="rounded-lg bg-white/5 p-3 text-sm text-white"
                placeholder="Regiao"
                value={newShipping.regionCode}
                onChange={(e) => setNewShipping((prev) => ({ ...prev, regionCode: e.target.value }))}
                required
              />
              <input
                type="number"
                className="rounded-lg bg-white/5 p-3 text-sm text-white"
                placeholder="Preco (centavos)"
                value={newShipping.priceCents}
                onChange={(e) => setNewShipping((prev) => ({ ...prev, priceCents: Number(e.target.value) }))}
                required
              />
              <input
                type="number"
                className="rounded-lg bg-white/5 p-3 text-sm text-white"
                placeholder="Prazo (dias)"
                value={newShipping.estimatedDays}
                onChange={(e) => setNewShipping((prev) => ({ ...prev, estimatedDays: Number(e.target.value) }))}
                required
              />
            </div>
            <button className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white">Salvar frete</button>
          </form>

          <div className="grid gap-3">
            {shippingRates.map((rate) => (
              <div key={rate.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">{rate.region_code}</p>
                  <span className="text-xs text-slate-400">R$ {(rate.price_cents / 100).toFixed(2)}</span>
                </div>
                <div className="text-xs text-slate-400">Prazo: {rate.estimated_days} dias</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'taxes' && (
        <div className="space-y-6">
          <form onSubmit={createTax} className="rounded-2xl border border-white/10 bg-ink-900/70 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Nova taxa</h3>
            <div className="grid gap-3 md:grid-cols-2">
              <input
                className="rounded-lg bg-white/5 p-3 text-sm text-white"
                placeholder="Regiao"
                value={newTax.regionCode}
                onChange={(e) => setNewTax((prev) => ({ ...prev, regionCode: e.target.value }))}
                required
              />
              <input
                type="number"
                className="rounded-lg bg-white/5 p-3 text-sm text-white"
                placeholder="Aliquota (%)"
                value={newTax.ratePercent}
                onChange={(e) => setNewTax((prev) => ({ ...prev, ratePercent: Number(e.target.value) }))}
                required
              />
            </div>
            <button className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white">Salvar taxa</button>
          </form>

          <div className="grid gap-3">
            {taxRates.map((tax) => (
              <div key={tax.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">{tax.region_code}</p>
                  <span className="text-xs text-slate-400">{tax.rate_percent}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'pix' && (
        <div className="space-y-4">
          {pixPayments.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-graphite-400">
              Nenhum pagamento PIX pendente.
            </div>
          )}
          {pixPayments.map((payment) => (
            <div key={payment.payment_id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">Pedido #{payment.order_number}</p>
                  <p className="text-xs text-graphite-400">{payment.email || 'Sem email'}</p>
                </div>
                <span className="text-xs text-graphite-300">
                  R$ {(payment.amount_cents / 100).toFixed(2)}
                </span>
              </div>
              <div className="mt-3 text-xs text-graphite-400">
                Codigo PIX: <span className="text-graphite-200">{payment.code}</span>
              </div>
              <div className="mt-1 text-xs text-graphite-400">
                Expira: {formatDateTime(payment.expires_at)}
              </div>
              <button
                className="mt-4 rounded-lg bg-emerald-500/90 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-400"
                onClick={() => markPixPaid(payment.payment_id)}
              >
                Marcar como pago
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="rounded-2xl border border-white/10 bg-ink-900/70 p-6">
          <h3 className="text-lg font-semibold text-white">Resumo 30 dias</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-white/5 p-4">
              <p className="text-xs uppercase tracking-widest text-slate-400">Pedidos</p>
              <p className="mt-2 text-2xl font-semibold text-white">{reports?.orders || 0}</p>
            </div>
            <div className="rounded-xl bg-white/5 p-4">
              <p className="text-xs uppercase tracking-widest text-slate-400">Receita</p>
              <p className="mt-2 text-2xl font-semibold text-white">R$ {((reports?.revenueCents || 0) / 100).toFixed(2)}</p>
            </div>
            <div className="rounded-xl bg-white/5 p-4">
              <p className="text-xs uppercase tracking-widest text-slate-400">Reembolsos</p>
              <p className="mt-2 text-2xl font-semibold text-white">R$ {((reports?.refundsCents || 0) / 100).toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EcommerceView;
