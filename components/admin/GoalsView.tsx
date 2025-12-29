'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Target, Route } from 'lucide-react';

interface Goal {
  id: number;
  name: string;
  type: string;
  match_value: string;
  value: number;
}

interface Funnel {
  id: number;
  name: string;
  steps: { id: number; step_order: number; type: string; match_value: string }[];
}

const GoalsView: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [funnels, setFunnels] = useState<Funnel[]>([]);
  const [goalForm, setGoalForm] = useState({ name: '', type: 'url', matchValue: '', value: '' });
  const [funnelForm, setFunnelForm] = useState({ name: '', steps: '' });

  const loadData = async () => {
    const [goalsRes, funnelsRes] = await Promise.all([
      fetch('/api/admin/goals'),
      fetch('/api/admin/funnels')
    ]);
    const goalsData = await goalsRes.json();
    const funnelsData = await funnelsRes.json();
    if (goalsRes.ok) setGoals(goalsData.goals || []);
    if (funnelsRes.ok) setFunnels(funnelsData.funnels || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  const createGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/admin/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: goalForm.name,
        type: goalForm.type,
        matchValue: goalForm.matchValue,
        value: Number(goalForm.value || 0)
      })
    });
    setGoalForm({ name: '', type: 'url', matchValue: '', value: '' });
    loadData();
  };

  const deleteGoal = async (id: number) => {
    await fetch(`/api/admin/goals?id=${id}`, { method: 'DELETE' });
    loadData();
  };

  const createFunnel = async (e: React.FormEvent) => {
    e.preventDefault();
    const steps = funnelForm.steps
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        if (line.startsWith('event:')) {
          return { type: 'event', matchValue: line.replace('event:', '').trim() };
        }
        if (line.startsWith('url:')) {
          return { type: 'url', matchValue: line.replace('url:', '').trim() };
        }
        return { type: 'url', matchValue: line };
      });

    await fetch('/api/admin/funnels', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: funnelForm.name, steps })
    });
    setFunnelForm({ name: '', steps: '' });
    loadData();
  };

  const deleteFunnel = async (id: number) => {
    await fetch(`/api/admin/funnels/${id}`, { method: 'DELETE' });
    loadData();
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-8">
      <div className="rounded-[28px] border border-graphite-800 bg-ink-900/70 p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <Target size={18} className="text-tide-300" />
          <div>
            <h2 className="text-lg font-semibold text-white">Metas de conversao</h2>
            <p className="text-xs text-graphite-400">Crie metas por URL ou evento.</p>
          </div>
        </div>

        <form onSubmit={createGoal} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            value={goalForm.name}
            onChange={(e) => setGoalForm({ ...goalForm, name: e.target.value })}
            placeholder="Nome da meta"
            className="rounded-2xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white"
            required
          />
          <select
            value={goalForm.type}
            onChange={(e) => setGoalForm({ ...goalForm, type: e.target.value })}
            className="rounded-2xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white"
          >
            <option value="url">URL</option>
            <option value="event">Evento</option>
          </select>
          <input
            value={goalForm.matchValue}
            onChange={(e) => setGoalForm({ ...goalForm, matchValue: e.target.value })}
            placeholder="/contato ou lead_submitted"
            className="rounded-2xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white"
            required
          />
          <input
            value={goalForm.value}
            onChange={(e) => setGoalForm({ ...goalForm, value: e.target.value })}
            placeholder="Valor (opcional)"
            className="rounded-2xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white"
          />
          <button
            type="submit"
            className="md:col-span-2 inline-flex items-center justify-center gap-2 rounded-full bg-cobalt-500 px-6 py-3 text-sm font-semibold text-white"
          >
            <Plus size={16} /> Criar meta
          </button>
        </form>

        <div className="mt-8 space-y-3">
          {goals.map((goal) => (
            <div key={goal.id} className="flex items-center justify-between rounded-2xl border border-graphite-800 bg-ink-950/50 px-4 py-3">
              <div>
                <p className="text-sm text-white font-semibold">{goal.name}</p>
                <p className="text-xs text-graphite-400">{goal.type}: {goal.match_value}</p>
              </div>
              <button
                onClick={() => deleteGoal(goal.id)}
                className="text-graphite-400 hover:text-ember-300"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {goals.length === 0 && <p className="text-xs text-graphite-500">Nenhuma meta criada.</p>}
        </div>
      </div>

      <div className="rounded-[28px] border border-graphite-800 bg-ink-900/70 p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <Route size={18} className="text-tide-300" />
          <div>
            <h2 className="text-lg font-semibold text-white">Funis personalizados</h2>
            <p className="text-xs text-graphite-400">Insira uma etapa por linha. Use prefixo "event:" ou "url:".</p>
          </div>
        </div>

        <form onSubmit={createFunnel} className="space-y-4">
          <input
            value={funnelForm.name}
            onChange={(e) => setFunnelForm({ ...funnelForm, name: e.target.value })}
            placeholder="Nome do funil"
            className="w-full rounded-2xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white"
            required
          />
          <textarea
            value={funnelForm.steps}
            onChange={(e) => setFunnelForm({ ...funnelForm, steps: e.target.value })}
            placeholder="url:/\nurl:/servicos\nevent:lead_submitted"
            rows={6}
            className="w-full rounded-2xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white"
            required
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-cobalt-500 px-6 py-3 text-sm font-semibold text-white"
          >
            <Plus size={16} /> Criar funil
          </button>
        </form>

        <div className="mt-8 space-y-3">
          {funnels.map((funnel) => (
            <div key={funnel.id} className="rounded-2xl border border-graphite-800 bg-ink-950/50 px-4 py-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-white font-semibold">{funnel.name}</p>
                <button onClick={() => deleteFunnel(funnel.id)} className="text-graphite-400 hover:text-ember-300">
                  <Trash2 size={16} />
                </button>
              </div>
              <ul className="mt-2 text-xs text-graphite-400 space-y-1">
                {funnel.steps.map((step) => (
                  <li key={step.id}>#{step.step_order} {step.type}: {step.match_value}</li>
                ))}
              </ul>
            </div>
          ))}
          {funnels.length === 0 && <p className="text-xs text-graphite-500">Nenhum funil criado.</p>}
        </div>
      </div>
    </div>
  );
};

export default GoalsView;
