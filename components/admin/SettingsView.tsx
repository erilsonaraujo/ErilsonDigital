'use client';

import React, { useEffect, useState } from 'react';
import { Save, ShieldCheck } from 'lucide-react';

const SettingsView: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    gtmId: '',
    gaId: '',
    metaPixelId: '',
    linkedInId: '',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/admin/settings');
        const data = await response.json();
        if (response.ok) {
          setForm({
            gtmId: data.value?.gtmId || '',
            gaId: data.value?.gaId || '',
            metaPixelId: data.value?.metaPixelId || '',
            linkedInId: data.value?.linkedInId || '',
          });
        }
      } catch (err) {
        console.error('Settings fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    } catch (err) {
      console.error('Settings save error:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-graphite-400">Carregando configuracoes...</div>;
  }

  return (
    <div className="rounded-[28px] border border-graphite-800 bg-ink-900/70 p-8 shadow-2xl">
      <div className="flex items-center gap-4 mb-8">
        <div className="h-12 w-12 rounded-2xl bg-tide-500/10 text-tide-300 flex items-center justify-center">
          <ShieldCheck size={20} />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">Pixels & tracking</p>
          <h2 className="text-xl font-semibold text-white">Integracoes de marketing</h2>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-[10px] uppercase tracking-[0.3em] text-graphite-500">GTM ID</label>
          <input
            value={form.gtmId}
            onChange={(e) => setForm({ ...form, gtmId: e.target.value })}
            className="mt-2 w-full rounded-2xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white focus:border-cobalt-400 focus:outline-none"
            placeholder="GTM-XXXXXXX"
          />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-[0.3em] text-graphite-500">GA4 ID</label>
          <input
            value={form.gaId}
            onChange={(e) => setForm({ ...form, gaId: e.target.value })}
            className="mt-2 w-full rounded-2xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white focus:border-cobalt-400 focus:outline-none"
            placeholder="G-XXXXXXXXXX"
          />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-[0.3em] text-graphite-500">Meta Pixel</label>
          <input
            value={form.metaPixelId}
            onChange={(e) => setForm({ ...form, metaPixelId: e.target.value })}
            className="mt-2 w-full rounded-2xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white focus:border-cobalt-400 focus:outline-none"
            placeholder="1234567890"
          />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-[0.3em] text-graphite-500">LinkedIn Partner ID</label>
          <input
            value={form.linkedInId}
            onChange={(e) => setForm({ ...form, linkedInId: e.target.value })}
            className="mt-2 w-full rounded-2xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white focus:border-cobalt-400 focus:outline-none"
            placeholder="1234567"
          />
        </div>

        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-cobalt-500 px-6 py-3 text-sm font-semibold text-white hover:bg-cobalt-400 transition-all"
          >
            <Save size={16} />
            {saving ? 'Salvando...' : 'Salvar configuracoes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsView;
