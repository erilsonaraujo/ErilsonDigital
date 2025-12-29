'use client';

import React, { useEffect, useState } from 'react';
import { FlaskConical, Plus, Trash2, RefreshCcw } from 'lucide-react';

interface Variant {
  id: number;
  name: string;
  weight: number;
  assignments?: number;
  conversions?: number;
}

interface Experiment {
  id: number;
  name: string;
  status: string;
  target_path?: string;
  traffic_percent: number;
  variants: Variant[];
}

const ExperimentsView: React.FC = () => {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [form, setForm] = useState({
    name: '',
    status: 'active',
    targetPath: '',
    trafficPercent: '100',
    variants: 'Controle:50\nVariante B:50'
  });

  const loadData = async () => {
    const res = await fetch('/api/admin/experiments');
    const json = await res.json();
    if (res.ok) setExperiments(json.experiments || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  const createExperiment = async (e: React.FormEvent) => {
    e.preventDefault();
    const variants = form.variants
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [name, weight] = line.split(':');
        return { name: name.trim(), weight: Number(weight || 50) };
      });

    await fetch('/api/admin/experiments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        status: form.status,
        targetPath: form.targetPath || null,
        trafficPercent: Number(form.trafficPercent || 100),
        variants
      })
    });
    setForm({ ...form, name: '', targetPath: '' });
    loadData();
  };

  const deleteExperiment = async (id: number) => {
    await fetch(`/api/admin/experiments/${id}`, { method: 'DELETE' });
    loadData();
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-8">
      <div className="rounded-[28px] border border-graphite-800 bg-ink-900/70 p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <FlaskConical size={18} className="text-tide-300" />
          <div>
            <h2 className="text-lg font-semibold text-white">A/B Testing</h2>
            <p className="text-xs text-graphite-400">Crie experimentos e acompanhe conversoes.</p>
          </div>
        </div>

        <form onSubmit={createExperiment} className="space-y-4">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Nome do experimento"
            className="w-full rounded-2xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white"
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="rounded-2xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white"
            >
              <option value="active">Ativo</option>
              <option value="paused">Pausado</option>
            </select>
            <input
              value={form.trafficPercent}
              onChange={(e) => setForm({ ...form, trafficPercent: e.target.value })}
              placeholder="Trafego %"
              className="rounded-2xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white"
            />
          </div>
          <input
            value={form.targetPath}
            onChange={(e) => setForm({ ...form, targetPath: e.target.value })}
            placeholder="Target path (opcional)"
            className="w-full rounded-2xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white"
          />
          <textarea
            value={form.variants}
            onChange={(e) => setForm({ ...form, variants: e.target.value })}
            rows={5}
            className="w-full rounded-2xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white"
            placeholder="Controle:50\nVariante B:50"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-cobalt-500 px-6 py-3 text-sm font-semibold text-white"
          >
            <Plus size={16} /> Criar experimento
          </button>
        </form>
      </div>

      <div className="rounded-[28px] border border-graphite-800 bg-ink-900/70 p-8 shadow-2xl">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <FlaskConical size={18} className="text-tide-300" />
            <div>
              <h2 className="text-lg font-semibold text-white">Experimentos ativos</h2>
              <p className="text-xs text-graphite-400">Resultados por variante.</p>
            </div>
          </div>
          <button
            onClick={loadData}
            className="h-10 w-10 rounded-full border border-graphite-800 text-graphite-300 hover:text-white"
          >
            <RefreshCcw size={16} />
          </button>
        </div>

        <div className="space-y-4">
          {experiments.map((experiment) => (
            <div key={experiment.id} className="rounded-2xl border border-graphite-800 bg-ink-950/50 px-4 py-3 text-sm text-graphite-300">
              <div className="flex items-center justify-between">
                <p className="text-white font-semibold">{experiment.name}</p>
                <button onClick={() => deleteExperiment(experiment.id)} className="text-graphite-400 hover:text-ember-300">
                  <Trash2 size={16} />
                </button>
              </div>
              <p className="text-xs text-graphite-500 mt-1">
                {experiment.status} • {experiment.target_path || 'todos os caminhos'} • {experiment.traffic_percent}% trafego
              </p>
              <div className="mt-3 space-y-2">
                {experiment.variants.map((variant) => (
                  <div key={variant.id} className="flex items-center justify-between text-xs text-graphite-400">
                    <span>{variant.name} ({variant.weight}%)</span>
                    <span>Assign: {variant.assignments || 0} • Conv: {variant.conversions || 0}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {experiments.length === 0 && <p className="text-sm text-graphite-500">Nenhum experimento criado.</p>}
        </div>
      </div>
    </div>
  );
};

export default ExperimentsView;
