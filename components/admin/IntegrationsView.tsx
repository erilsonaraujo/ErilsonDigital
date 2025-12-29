'use client';

import React, { useEffect, useState } from 'react';
import { KeyRound, RefreshCcw, UploadCloud } from 'lucide-react';

const IntegrationsView: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [gaCsv, setGaCsv] = useState('');
  const [gaSummary, setGaSummary] = useState<{ pageviews: number; users: number; sessions: number } | null>(null);
  const [sources, setSources] = useState<{ source: string; sessions: number }[]>([]);
  const [pages, setPages] = useState<{ page: string; pageviews: number }[]>([]);

  const loadSettings = async () => {
    const res = await fetch('/api/admin/analytics-settings');
    const json = await res.json();
    if (res.ok) setApiKey(json.value?.publicApiKey || '');
  };

  const saveSettings = async (key: string) => {
    await fetch('/api/admin/analytics-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publicApiKey: key })
    });
  };

  const generateKey = () => {
    const key = `ea_${crypto.randomUUID().replace(/-/g, '')}`;
    setApiKey(key);
    saveSettings(key);
  };

  const loadGaSummary = async () => {
    const res = await fetch('/api/admin/ga/summary?range=30d');
    const json = await res.json();
    if (res.ok) {
      setGaSummary({
        pageviews: Number(json.summary?.pageviews || 0),
        users: Number(json.summary?.users || 0),
        sessions: Number(json.summary?.sessions || 0)
      });
      setSources(json.sources || []);
      setPages(json.pages || []);
    }
  };

  useEffect(() => {
    loadSettings();
    loadGaSummary();
  }, []);

  const importGa = async () => {
    if (!gaCsv) return;
    await fetch('/api/admin/ga/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ csv: gaCsv })
    });
    setGaCsv('');
    loadGaSummary();
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-8">
      <div className="rounded-[28px] border border-graphite-800 bg-ink-900/70 p-8 shadow-2xl space-y-6">
        <div className="flex items-center gap-3">
          <KeyRound size={18} className="text-tide-300" />
          <div>
            <h2 className="text-lg font-semibold text-white">API publica v1</h2>
            <p className="text-xs text-graphite-400">Use o header x-erilson-analytics-key.</p>
          </div>
        </div>
        <input
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Chave publica"
          className="w-full rounded-2xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white"
        />
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => saveSettings(apiKey)}
            className="rounded-full bg-cobalt-500 px-5 py-3 text-sm font-semibold text-white"
          >
            Salvar chave
          </button>
          <button
            onClick={generateKey}
            className="rounded-full border border-graphite-800 px-5 py-3 text-sm text-graphite-200"
          >
            Gerar nova
          </button>
        </div>
      </div>

      <div className="rounded-[28px] border border-graphite-800 bg-ink-900/70 p-8 shadow-2xl space-y-4">
        <div className="flex items-center gap-3">
          <UploadCloud size={18} className="text-tide-300" />
          <div>
            <h2 className="text-lg font-semibold text-white">Google Analytics Import</h2>
            <p className="text-xs text-graphite-400">Cole CSV (date,source,medium,campaign,page,sessions,users,pageviews).</p>
          </div>
        </div>
        <textarea
          value={gaCsv}
          onChange={(e) => setGaCsv(e.target.value)}
          rows={6}
          className="w-full rounded-2xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white"
        />
        <button
          onClick={importGa}
          className="rounded-full bg-cobalt-500 px-5 py-3 text-sm font-semibold text-white"
        >
          Importar CSV
        </button>
      </div>

      <div className="rounded-[28px] border border-graphite-800 bg-ink-900/70 p-8 shadow-2xl space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">Resumo GA</p>
            <h3 className="text-lg font-semibold text-white">Ultimos 30 dias</h3>
          </div>
          <button
            onClick={loadGaSummary}
            className="h-10 w-10 rounded-full border border-graphite-800 text-graphite-300 hover:text-white"
          >
            <RefreshCcw size={16} />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3 text-sm text-graphite-300">
          <div className="rounded-2xl border border-graphite-800 bg-ink-950/50 px-4 py-3">
            <p className="text-xs text-graphite-500">Pageviews</p>
            <p className="text-lg text-white font-semibold">{gaSummary?.pageviews || 0}</p>
          </div>
          <div className="rounded-2xl border border-graphite-800 bg-ink-950/50 px-4 py-3">
            <p className="text-xs text-graphite-500">Usuarios</p>
            <p className="text-lg text-white font-semibold">{gaSummary?.users || 0}</p>
          </div>
          <div className="rounded-2xl border border-graphite-800 bg-ink-950/50 px-4 py-3">
            <p className="text-xs text-graphite-500">Sessoes</p>
            <p className="text-lg text-white font-semibold">{gaSummary?.sessions || 0}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-graphite-300">
          <div>
            <p className="text-xs text-graphite-500">Fontes</p>
            <div className="mt-3 space-y-2">
              {sources.map((item) => (
                <div key={item.source} className="flex items-center justify-between rounded-2xl border border-graphite-800 bg-ink-950/50 px-3 py-2">
                  <span>{item.source}</span>
                  <span className="text-graphite-100">{item.sessions}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-graphite-500">Paginas</p>
            <div className="mt-3 space-y-2">
              {pages.map((item) => (
                <div key={item.page} className="flex items-center justify-between rounded-2xl border border-graphite-800 bg-ink-950/50 px-3 py-2">
                  <span className="truncate">{item.page}</span>
                  <span className="text-graphite-100">{item.pageviews}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsView;
