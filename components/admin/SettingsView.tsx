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
    umamiId: '',
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
            umamiId: data.value?.umamiId || '',
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
    return <div className="p-8 text-slate-500">Carregando configuracoes...</div>;
  }

  return (
    <div className="max-w-[1200px] mx-auto p-4 md:p-8 lg:p-12">
      <header className="mb-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary-600 text-white flex items-center justify-center">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">Pixels & Tracking</h1>
            <p className="text-xs text-slate-500 uppercase tracking-[0.2em] font-bold mt-1">Configuracao centralizada</p>
          </div>
        </div>
      </header>

      <form onSubmit={handleSave} className="bg-white dark:bg-dark-900 rounded-[2rem] border border-slate-200 dark:border-dark-800 shadow-sm p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">GTM ID</label>
            <input
              value={form.gtmId}
              onChange={(e) => setForm({ ...form, gtmId: e.target.value })}
              className="mt-2 w-full rounded-xl border border-slate-200 dark:border-dark-800 bg-slate-50 dark:bg-dark-950 px-4 py-3 text-sm text-slate-900 dark:text-white"
              placeholder="GTM-XXXXXXX"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">GA4 ID</label>
            <input
              value={form.gaId}
              onChange={(e) => setForm({ ...form, gaId: e.target.value })}
              className="mt-2 w-full rounded-xl border border-slate-200 dark:border-dark-800 bg-slate-50 dark:bg-dark-950 px-4 py-3 text-sm text-slate-900 dark:text-white"
              placeholder="G-XXXXXXXXXX"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Meta Pixel</label>
            <input
              value={form.metaPixelId}
              onChange={(e) => setForm({ ...form, metaPixelId: e.target.value })}
              className="mt-2 w-full rounded-xl border border-slate-200 dark:border-dark-800 bg-slate-50 dark:bg-dark-950 px-4 py-3 text-sm text-slate-900 dark:text-white"
              placeholder="1234567890"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">LinkedIn Partner ID</label>
            <input
              value={form.linkedInId}
              onChange={(e) => setForm({ ...form, linkedInId: e.target.value })}
              className="mt-2 w-full rounded-xl border border-slate-200 dark:border-dark-800 bg-slate-50 dark:bg-dark-950 px-4 py-3 text-sm text-slate-900 dark:text-white"
              placeholder="1234567"
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Umami Website ID</label>
          <input
            value={form.umamiId}
            onChange={(e) => setForm({ ...form, umamiId: e.target.value })}
            className="mt-2 w-full rounded-xl border border-slate-200 dark:border-dark-800 bg-slate-50 dark:bg-dark-950 px-4 py-3 text-sm text-slate-900 dark:text-white"
            placeholder="UUID do Umami"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-all inline-flex items-center gap-2"
        >
          <Save size={16} />
          {saving ? 'Salvando...' : 'Salvar configuracoes'}
        </button>
      </form>
    </div>
  );
};

export default SettingsView;
