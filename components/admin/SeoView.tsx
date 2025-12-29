'use client';

import React, { useEffect, useState } from 'react';
import { Search, RefreshCcw, UploadCloud } from 'lucide-react';

interface KeywordRow {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface PageRow {
  page: string;
  clicks: number;
  impressions: number;
}

const SeoView: React.FC = () => {
  const [range, setRange] = useState('30d');
  const [keywords, setKeywords] = useState<KeywordRow[]>([]);
  const [pages, setPages] = useState<PageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [importForm, setImportForm] = useState({
    accessToken: '',
    property: '',
    startDate: '',
    endDate: ''
  });
  const [manualJson, setManualJson] = useState('');

  const loadKeywords = async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/seo/keywords?range=${range}`);
    const json = await res.json();
    if (res.ok) {
      setKeywords(json.keywords || []);
      setPages(json.pages || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadKeywords();
  }, [range]);

  const importFromSearchConsole = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/admin/seo/keywords', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(importForm)
    });
    loadKeywords();
  };

  const importManual = async () => {
    if (!manualJson) return;
    try {
      const keywords = JSON.parse(manualJson);
      await fetch('/api/admin/seo/keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keywords })
      });
      setManualJson('');
      loadKeywords();
    } catch (error) {
      console.error('Manual import error', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-graphite-400">
          <Search size={18} className="text-tide-300" />
          <span className="text-xs uppercase tracking-[0.3em]">SEO Keywords</span>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="rounded-full border border-graphite-800 bg-ink-900/70 px-4 py-2 text-xs text-white"
          >
            <option value="7d">7d</option>
            <option value="30d">30d</option>
            <option value="90d">90d</option>
          </select>
          <button
            onClick={loadKeywords}
            className="h-10 w-10 rounded-full border border-graphite-800 text-graphite-300 hover:text-white"
          >
            <RefreshCcw size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-8">
        <div className="rounded-[28px] border border-graphite-800 bg-ink-900/70 p-8 shadow-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">Top palavras</p>
          {loading && <p className="text-sm text-graphite-400 mt-4">Carregando...</p>}
          {!loading && (
            <div className="mt-4 space-y-3">
              {keywords.map((item) => (
                <div key={item.query} className="rounded-2xl border border-graphite-800 bg-ink-950/50 px-4 py-3 text-sm text-graphite-300">
                  <p className="text-white font-semibold">{item.query}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-graphite-400">
                    <span>Clicks: {item.clicks}</span>
                    <span>Impress: {item.impressions}</span>
                    <span>CTR: {Number(item.ctr || 0).toFixed(2)}</span>
                    <span>Pos: {Number(item.position || 0).toFixed(2)}</span>
                  </div>
                </div>
              ))}
              {keywords.length === 0 && <p className="text-xs text-graphite-500">Sem dados.</p>}
            </div>
          )}
        </div>

        <div className="rounded-[28px] border border-graphite-800 bg-ink-900/70 p-8 shadow-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">Paginas</p>
          <div className="mt-4 space-y-3">
            {pages.map((item) => (
              <div key={item.page} className="rounded-2xl border border-graphite-800 bg-ink-950/50 px-4 py-3 text-sm text-graphite-300">
                <p className="text-white font-semibold truncate">{item.page}</p>
                <div className="mt-2 flex items-center gap-3 text-xs text-graphite-400">
                  <span>Clicks: {item.clicks}</span>
                  <span>Impress: {item.impressions}</span>
                </div>
              </div>
            ))}
            {pages.length === 0 && <p className="text-xs text-graphite-500">Sem dados.</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-8">
        <form onSubmit={importFromSearchConsole} className="rounded-[28px] border border-graphite-800 bg-ink-900/70 p-8 shadow-2xl space-y-4">
          <div className="flex items-center gap-3">
            <UploadCloud size={18} className="text-tide-300" />
            <div>
              <h3 className="text-lg font-semibold text-white">Importar Search Console</h3>
              <p className="text-xs text-graphite-400">Cole access token e property URL.</p>
            </div>
          </div>
          <input
            value={importForm.accessToken}
            onChange={(e) => setImportForm({ ...importForm, accessToken: e.target.value })}
            placeholder="Access token"
            className="w-full rounded-2xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white"
          />
          <input
            value={importForm.property}
            onChange={(e) => setImportForm({ ...importForm, property: e.target.value })}
            placeholder="Property (ex: https://erilsondigital.com/)"
            className="w-full rounded-2xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              value={importForm.startDate}
              onChange={(e) => setImportForm({ ...importForm, startDate: e.target.value })}
              placeholder="YYYY-MM-DD"
              className="rounded-2xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white"
            />
            <input
              value={importForm.endDate}
              onChange={(e) => setImportForm({ ...importForm, endDate: e.target.value })}
              placeholder="YYYY-MM-DD"
              className="rounded-2xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-cobalt-500 px-6 py-3 text-sm font-semibold text-white"
          >
            Importar dados
          </button>
        </form>

        <div className="rounded-[28px] border border-graphite-800 bg-ink-900/70 p-8 shadow-2xl space-y-4">
          <h3 className="text-lg font-semibold text-white">Importar manual</h3>
          <p className="text-xs text-graphite-400">{'Cole JSON no formato: [{"date":"YYYY-MM-DD","query":"..."}]'}</p>
          <textarea
            value={manualJson}
            onChange={(e) => setManualJson(e.target.value)}
            rows={6}
            className="w-full rounded-2xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white"
          />
          <button
            onClick={importManual}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-graphite-800 px-6 py-3 text-sm font-semibold text-white"
          >
            Importar JSON
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeoView;
