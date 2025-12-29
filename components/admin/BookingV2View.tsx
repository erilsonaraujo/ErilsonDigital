'use client';

import React, { useEffect, useState } from 'react';
import { CalendarRange, Plus, RefreshCcw, Trash2 } from 'lucide-react';

type Resource = {
  id: number;
  name: string;
  slug: string;
  status: string;
  capacity: number;
  timezone?: string;
};

type Booking = {
  id: number;
  resource_id: number;
  resource_name?: string;
  status: string;
  start_at: string;
  end_at: string;
  customer_name?: string;
  customer_email?: string;
};

const BookingV2View: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [seasons, setSeasons] = useState<any[]>([]);
  const [pricing, setPricing] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [resourceForm, setResourceForm] = useState({ name: '', slug: '', capacity: '1', status: 'active', timezone: 'America/Sao_Paulo' });
  const [bookingForm, setBookingForm] = useState({ resourceId: '', startAt: '', endAt: '', name: '', email: '' });
  const [seasonForm, setSeasonForm] = useState({ name: '', startDate: '', endDate: '', status: 'active' });
  const [pricingForm, setPricingForm] = useState({ resourceId: '', seasonId: '', pricePerDay: '', pricePerHour: '' });
  const [couponForm, setCouponForm] = useState({ code: '', discountType: 'percent', discountValue: '', minTotal: '', expiresAt: '' });

  const loadResources = async () => {
    const res = await fetch('/api/admin/booking-resources-v2');
    const json = await res.json();
    if (res.ok) setResources(json.resources || []);
  };

  const loadBookings = async () => {
    const res = await fetch('/api/admin/bookings-v2');
    const json = await res.json();
    if (res.ok) setBookings(json.bookings || []);
  };

  const loadSeasons = async () => {
    const res = await fetch('/api/admin/booking-seasons-v2');
    const json = await res.json();
    if (res.ok) setSeasons(json.seasons || []);
  };

  const loadPricing = async () => {
    const res = await fetch('/api/admin/booking-pricing-v2');
    const json = await res.json();
    if (res.ok) setPricing(json.pricing || []);
  };

  const loadCoupons = async () => {
    const res = await fetch('/api/admin/booking-coupons-v2');
    const json = await res.json();
    if (res.ok) setCoupons(json.coupons || []);
  };

  useEffect(() => {
    loadResources();
    loadBookings();
    loadSeasons();
    loadPricing();
    loadCoupons();
  }, []);

  const createResource = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/admin/booking-resources-v2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: resourceForm.name,
        slug: resourceForm.slug,
        capacity: Number(resourceForm.capacity || 1),
        status: resourceForm.status,
        timezone: resourceForm.timezone
      })
    });
    setResourceForm({ name: '', slug: '', capacity: '1', status: 'active', timezone: 'America/Sao_Paulo' });
    loadResources();
  };

  const deleteResource = async (id: number) => {
    await fetch(`/api/admin/booking-resources-v2/${id}`, { method: 'DELETE' });
    loadResources();
  };

  const createBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/admin/bookings-v2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resourceId: Number(bookingForm.resourceId),
        startAt: bookingForm.startAt,
        endAt: bookingForm.endAt,
        customerName: bookingForm.name,
        customerEmail: bookingForm.email
      })
    });
    setBookingForm({ resourceId: '', startAt: '', endAt: '', name: '', email: '' });
    loadBookings();
  };

  const createSeason = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/admin/booking-seasons-v2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: seasonForm.name,
        startDate: seasonForm.startDate,
        endDate: seasonForm.endDate,
        status: seasonForm.status
      })
    });
    setSeasonForm({ name: '', startDate: '', endDate: '', status: 'active' });
    loadSeasons();
  };

  const createPricing = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/admin/booking-pricing-v2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resourceId: Number(pricingForm.resourceId),
        seasonId: pricingForm.seasonId ? Number(pricingForm.seasonId) : null,
        pricePerDay: Number(pricingForm.pricePerDay || 0),
        pricePerHour: Number(pricingForm.pricePerHour || 0)
      })
    });
    setPricingForm({ resourceId: '', seasonId: '', pricePerDay: '', pricePerHour: '' });
    loadPricing();
  };

  const createCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/admin/booking-coupons-v2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: couponForm.code,
        discountType: couponForm.discountType,
        discountValue: Number(couponForm.discountValue || 0),
        minTotal: Number(couponForm.minTotal || 0),
        expiresAt: couponForm.expiresAt || null
      })
    });
    setCouponForm({ code: '', discountType: 'percent', discountValue: '', minTotal: '', expiresAt: '' });
    loadCoupons();
  };

  const deleteSeason = async (id: number) => {
    await fetch(`/api/admin/booking-seasons-v2?id=${id}`, { method: 'DELETE' });
    loadSeasons();
  };

  const deleteCoupon = async (id: number) => {
    await fetch(`/api/admin/booking-coupons-v2?id=${id}`, { method: 'DELETE' });
    loadCoupons();
  };

  return (
    <div className="space-y-8">
      <div className="rounded-[28px] border border-graphite-800 bg-ink-900/70 p-8 shadow-2xl">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CalendarRange size={18} className="text-tide-300" />
            <div>
              <h2 className="text-lg font-semibold text-white">Resources</h2>
              <p className="text-xs text-graphite-400">Crie recursos reservaveis.</p>
            </div>
          </div>
          <button
            onClick={loadResources}
            className="h-10 w-10 rounded-full border border-graphite-800 text-graphite-300 hover:text-white"
          >
            <RefreshCcw size={16} />
          </button>
        </div>

        <form onSubmit={createResource} className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            value={resourceForm.name}
            onChange={(e) => setResourceForm({ ...resourceForm, name: e.target.value })}
            placeholder="Nome"
            className="rounded-2xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white"
            required
          />
          <input
            value={resourceForm.slug}
            onChange={(e) => setResourceForm({ ...resourceForm, slug: e.target.value })}
            placeholder="Slug"
            className="rounded-2xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white"
            required
          />
          <input
            value={resourceForm.capacity}
            onChange={(e) => setResourceForm({ ...resourceForm, capacity: e.target.value })}
            placeholder="Capacidade"
            className="rounded-2xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white"
          />
          <select
            value={resourceForm.status}
            onChange={(e) => setResourceForm({ ...resourceForm, status: e.target.value })}
            className="rounded-2xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white"
          >
            <option value="active">Ativo</option>
            <option value="paused">Pausado</option>
          </select>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-cobalt-500 px-5 py-3 text-sm font-semibold text-white"
          >
            <Plus size={16} /> Criar
          </button>
        </form>

        <div className="mt-6 space-y-3">
          {resources.map((resource) => (
            <div key={resource.id} className="flex items-center justify-between rounded-2xl border border-graphite-800 bg-ink-950/50 px-4 py-3 text-sm text-graphite-300">
              <div>
                <p className="text-white font-semibold">{resource.name}</p>
                <p className="text-xs text-graphite-500">{resource.slug} • cap {resource.capacity}</p>
              </div>
              <button onClick={() => deleteResource(resource.id)} className="text-graphite-400 hover:text-ember-300">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {resources.length === 0 && <p className="text-xs text-graphite-500">Nenhum recurso criado.</p>}
        </div>
      </div>

      <div className="rounded-[28px] border border-graphite-800 bg-ink-900/70 p-8 shadow-2xl">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CalendarRange size={18} className="text-tide-300" />
            <div>
              <h2 className="text-lg font-semibold text-white">Bookings</h2>
              <p className="text-xs text-graphite-400">Criar e monitorar reservas.</p>
            </div>
          </div>
          <button
            onClick={loadBookings}
            className="h-10 w-10 rounded-full border border-graphite-800 text-graphite-300 hover:text-white"
          >
            <RefreshCcw size={16} />
          </button>
        </div>

        <form onSubmit={createBooking} className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
          <select
            value={bookingForm.resourceId}
            onChange={(e) => setBookingForm({ ...bookingForm, resourceId: e.target.value })}
            className="rounded-2xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white"
            required
          >
            <option value="">Recurso</option>
            {resources.map((resource) => (
              <option key={resource.id} value={resource.id}>{resource.name}</option>
            ))}
          </select>
          <input
            type="datetime-local"
            value={bookingForm.startAt}
            onChange={(e) => setBookingForm({ ...bookingForm, startAt: e.target.value })}
            className="rounded-2xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white"
            required
          />
          <input
            type="datetime-local"
            value={bookingForm.endAt}
            onChange={(e) => setBookingForm({ ...bookingForm, endAt: e.target.value })}
            className="rounded-2xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white"
            required
          />
          <input
            value={bookingForm.name}
            onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
            placeholder="Cliente"
            className="rounded-2xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-cobalt-500 px-5 py-3 text-sm font-semibold text-white"
          >
            <Plus size={16} /> Criar
          </button>
        </form>

        <div className="mt-6 space-y-3">
          {bookings.map((booking) => (
            <div key={booking.id} className="rounded-2xl border border-graphite-800 bg-ink-950/50 px-4 py-3 text-sm text-graphite-300">
              <p className="text-white font-semibold">{booking.resource_name || 'Recurso'}</p>
              <p className="text-xs text-graphite-500">
                {new Date(booking.start_at).toLocaleString()} - {new Date(booking.end_at).toLocaleString()}
              </p>
              <p className="text-xs text-graphite-500">{booking.customer_name || 'Cliente'}</p>
            </div>
          ))}
          {bookings.length === 0 && <p className="text-xs text-graphite-500">Nenhum booking criado.</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_1fr] gap-8">
        <div className="rounded-[28px] border border-graphite-800 bg-ink-900/70 p-8 shadow-2xl">
          <h3 className="text-lg font-semibold text-white">Seasons</h3>
          <form onSubmit={createSeason} className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              value={seasonForm.name}
              onChange={(e) => setSeasonForm({ ...seasonForm, name: e.target.value })}
              placeholder="Nome"
              className="rounded-2xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white"
              required
            />
            <input
              type="date"
              value={seasonForm.startDate}
              onChange={(e) => setSeasonForm({ ...seasonForm, startDate: e.target.value })}
              className="rounded-2xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white"
              required
            />
            <input
              type="date"
              value={seasonForm.endDate}
              onChange={(e) => setSeasonForm({ ...seasonForm, endDate: e.target.value })}
              className="rounded-2xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white"
              required
            />
            <button className="rounded-full bg-cobalt-500 px-5 py-3 text-sm font-semibold text-white">Adicionar</button>
          </form>
          <div className="mt-4 space-y-2">
            {seasons.map((season) => (
              <div key={season.id} className="flex items-center justify-between rounded-2xl border border-graphite-800 bg-ink-950/50 px-4 py-3 text-sm text-graphite-300">
                <span>{season.name} ({season.start_date} - {season.end_date})</span>
                <button onClick={() => deleteSeason(season.id)} className="text-graphite-400 hover:text-ember-300">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {seasons.length === 0 && <p className="text-xs text-graphite-500">Sem seasons.</p>}
          </div>
        </div>

        <div className="rounded-[28px] border border-graphite-800 bg-ink-900/70 p-8 shadow-2xl">
          <h3 className="text-lg font-semibold text-white">Pricing</h3>
          <form onSubmit={createPricing} className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={pricingForm.resourceId}
              onChange={(e) => setPricingForm({ ...pricingForm, resourceId: e.target.value })}
              className="rounded-2xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white"
              required
            >
              <option value="">Recurso</option>
              {resources.map((resource) => (
                <option key={resource.id} value={resource.id}>{resource.name}</option>
              ))}
            </select>
            <select
              value={pricingForm.seasonId}
              onChange={(e) => setPricingForm({ ...pricingForm, seasonId: e.target.value })}
              className="rounded-2xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white"
            >
              <option value="">Sem season</option>
              {seasons.map((season) => (
                <option key={season.id} value={season.id}>{season.name}</option>
              ))}
            </select>
            <input
              value={pricingForm.pricePerDay}
              onChange={(e) => setPricingForm({ ...pricingForm, pricePerDay: e.target.value })}
              placeholder="Preco/dia"
              className="rounded-2xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white"
            />
            <button className="rounded-full bg-cobalt-500 px-5 py-3 text-sm font-semibold text-white">Salvar</button>
          </form>
          <div className="mt-4 space-y-2">
            {pricing.map((item) => (
              <div key={item.id} className="rounded-2xl border border-graphite-800 bg-ink-950/50 px-4 py-3 text-sm text-graphite-300">
                <span>{item.resource_name} • {item.season_name || 'Sem season'} • {item.price_per_day}</span>
              </div>
            ))}
            {pricing.length === 0 && <p className="text-xs text-graphite-500">Sem pricing.</p>}
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-graphite-800 bg-ink-900/70 p-8 shadow-2xl">
        <h3 className="text-lg font-semibold text-white">Cupons</h3>
        <form onSubmit={createCoupon} className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            value={couponForm.code}
            onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value })}
            placeholder="Codigo"
            className="rounded-2xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white"
            required
          />
          <select
            value={couponForm.discountType}
            onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value })}
            className="rounded-2xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white"
          >
            <option value="percent">Percentual</option>
            <option value="fixed">Fixo</option>
          </select>
          <input
            value={couponForm.discountValue}
            onChange={(e) => setCouponForm({ ...couponForm, discountValue: e.target.value })}
            placeholder="Valor"
            className="rounded-2xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white"
            required
          />
          <input
            value={couponForm.expiresAt}
            onChange={(e) => setCouponForm({ ...couponForm, expiresAt: e.target.value })}
            placeholder="Expira em (YYYY-MM-DD)"
            className="rounded-2xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white"
          />
          <button className="rounded-full bg-cobalt-500 px-5 py-3 text-sm font-semibold text-white">Criar</button>
        </form>
        <div className="mt-4 space-y-2">
          {coupons.map((coupon) => (
            <div key={coupon.id} className="flex items-center justify-between rounded-2xl border border-graphite-800 bg-ink-950/50 px-4 py-3 text-sm text-graphite-300">
              <span>{coupon.code} • {coupon.discount_type} {coupon.discount_value}</span>
              <button onClick={() => deleteCoupon(coupon.id)} className="text-graphite-400 hover:text-ember-300">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {coupons.length === 0 && <p className="text-xs text-graphite-500">Sem cupons.</p>}
        </div>
      </div>
    </div>
  );
};

export default BookingV2View;
