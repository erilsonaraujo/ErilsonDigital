'use client';

import React, { useEffect, useState } from 'react';
import { Flame, RefreshCcw } from 'lucide-react';

interface HeatmapPoint {
  event_type: string;
  x: number;
  y: number;
  total: number;
}

const HeatmapsView: React.FC = () => {
  const [paths, setPaths] = useState<string[]>([]);
  const [selectedPath, setSelectedPath] = useState('');
  const [points, setPoints] = useState<HeatmapPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPaths = async () => {
    const res = await fetch('/api/admin/analytics?range=30d');
    const json = await res.json();
    if (res.ok) {
      const urls = (json.metrics?.url || []).map((item: any) => item.x);
      setPaths(urls);
      if (!selectedPath && urls.length > 0) setSelectedPath(urls[0]);
    }
  };

  const loadHeatmap = async (path: string) => {
    if (!path) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/heatmaps?path=${encodeURIComponent(path)}`);
      const json = await res.json();
      if (res.ok) setPoints(json.points || []);
    } catch (error) {
      console.error('Heatmap fetch error', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPaths();
  }, []);

  useEffect(() => {
    if (selectedPath) loadHeatmap(selectedPath);
  }, [selectedPath]);

  const maxTotal = Math.max(1, ...points.map((point) => Number(point.total)));

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-graphite-400">
          <Flame size={18} className="text-ember-300" />
          <span className="text-xs uppercase tracking-[0.3em]">Heatmaps</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedPath}
            onChange={(e) => setSelectedPath(e.target.value)}
            className="rounded-full border border-graphite-800 bg-ink-900/70 px-4 py-2 text-xs text-white"
          >
            {paths.map((path) => (
              <option key={path} value={path}>{path}</option>
            ))}
          </select>
          <button
            onClick={() => loadHeatmap(selectedPath)}
            className="h-10 w-10 rounded-full border border-graphite-800 text-graphite-300 hover:text-white"
          >
            <RefreshCcw size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8">
        <div className="rounded-[28px] border border-graphite-800 bg-ink-900/70 p-6 shadow-2xl">
          <div className="relative w-full aspect-[3/2] rounded-2xl border border-graphite-800 bg-ink-950 overflow-hidden">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center text-sm text-graphite-500">
                Carregando heatmap...
              </div>
            )}
            {!loading && points.map((point, index) => (
              <span
                key={`${point.x}-${point.y}-${index}`}
                className="absolute h-3 w-3 rounded-full bg-ember-400 blur-[2px]"
                style={{
                  left: `${point.x}%`,
                  top: `${point.y}%`,
                  opacity: Math.min(1, Number(point.total) / maxTotal)
                }}
              />
            ))}
          </div>
          <p className="text-xs text-graphite-500 mt-4">
            Clique em pontos quentes para identificar concentracoes de interesse.
          </p>
        </div>

        <div className="rounded-[28px] border border-graphite-800 bg-ink-900/70 p-6 shadow-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">Top pontos</p>
          <div className="mt-4 space-y-3 text-sm text-graphite-300">
            {points.slice(0, 10).map((point, index) => (
              <div key={`${point.x}-${point.y}-${index}`} className="flex items-center justify-between rounded-2xl border border-graphite-800 bg-ink-950/50 px-4 py-3">
                <span>{point.event_type} ({point.x}%, {point.y}%)</span>
                <span className="text-graphite-100">{point.total}</span>
              </div>
            ))}
            {points.length === 0 && !loading && (
              <p className="text-xs text-graphite-500">Sem dados suficientes.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatmapsView;
