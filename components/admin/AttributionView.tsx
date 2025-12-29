'use client';

import React, { useEffect, useState } from 'react';
import { RefreshCcw, SplitSquareVertical } from 'lucide-react';

interface Goal {
  id: number;
  name: string;
}

interface AttributionResponse {
  model: string;
  totals: { channel: string; value: number }[];
  byGoal: Record<string, { goalName: string; totals: { channel: string; value: number }[] }>;
  totalConversions: number;
}

const AttributionView: React.FC = () => {
  const [range, setRange] = useState('30d');
  const [model, setModel] = useState('last');
  const [goalId, setGoalId] = useState('all');
  const [data, setData] = useState<AttributionResponse | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGoals = async () => {
    const res = await fetch('/api/admin/goals');
    const json = await res.json();
    if (res.ok) setGoals(json.goals || []);
  };

  const fetchAttribution = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ range, model });
      if (goalId !== 'all') params.set('goalId', goalId);
      const res = await fetch(`/api/admin/attribution?${params.toString()}`);
      const json = await res.json();
      if (res.ok) setData(json);
    } catch (error) {
      console.error('Attribution fetch error', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  useEffect(() => {
    fetchAttribution();
  }, [range, model, goalId]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-graphite-400">
          <SplitSquareVertical size={18} className="text-tide-300" />
          <span className="text-xs uppercase tracking-[0.3em]">Atribuicao</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-full border border-graphite-800 bg-ink-900/70 p-1">
            {['7d', '30d', '90d'].map((option) => (
              <button
                key={option}
                onClick={() => setRange(option)}
                className={`px-4 py-2 text-[10px] uppercase tracking-[0.2em] rounded-full ${range === option
                  ? 'bg-cobalt-500 text-white'
                  : 'text-graphite-400 hover:text-white'}
                `}
              >
                {option}
              </button>
            ))}
          </div>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="rounded-full border border-graphite-800 bg-ink-900/70 px-4 py-2 text-xs text-white"
          >
            <option value="last">Last click</option>
            <option value="first">First click</option>
            <option value="linear">Linear</option>
            <option value="time_decay">Time decay</option>
            <option value="position">Position-based</option>
          </select>
          <select
            value={goalId}
            onChange={(e) => setGoalId(e.target.value)}
            className="rounded-full border border-graphite-800 bg-ink-900/70 px-4 py-2 text-xs text-white"
          >
            <option value="all">Todas as metas</option>
            {goals.map((goal) => (
              <option key={goal.id} value={goal.id}>{goal.name}</option>
            ))}
          </select>
          <button
            onClick={fetchAttribution}
            className="h-10 w-10 rounded-full border border-graphite-800 text-graphite-300 hover:text-white"
          >
            <RefreshCcw size={16} />
          </button>
        </div>
      </div>

      {loading && (
        <div className="rounded-[28px] border border-graphite-800 bg-ink-900/70 p-8 text-sm text-graphite-400">
          Carregando atribuicao...
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8">
          <div className="rounded-[28px] border border-graphite-800 bg-ink-900/70 p-8 shadow-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">Distribuicao por canal</p>
            <div className="mt-6 space-y-3">
              {(data?.totals || []).map((item) => (
                <div key={item.channel} className="flex items-center justify-between rounded-2xl border border-graphite-800 bg-ink-950/50 px-4 py-3 text-sm text-graphite-300">
                  <span className="font-semibold text-white">{item.channel}</span>
                  <span className="text-graphite-100">{item.value}</span>
                </div>
              ))}
              {(data?.totals || []).length === 0 && (
                <p className="text-xs text-graphite-500">Sem conversoes no periodo selecionado.</p>
              )}
            </div>
          </div>

          <div className="rounded-[28px] border border-graphite-800 bg-ink-900/70 p-8 shadow-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">Resumo</p>
            <div className="mt-6 space-y-3 text-sm text-graphite-300">
              <div className="flex items-center justify-between">
                <span>Total de conversoes</span>
                <span className="text-white font-semibold">{data?.totalConversions || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Modelo atual</span>
                <span className="text-white font-semibold">{model.replace('_', ' ')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Metas monitoradas</span>
                <span className="text-white font-semibold">{goalId === 'all' ? 'Todas' : goals.find((g) => String(g.id) === goalId)?.name || 'Meta'}</span>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {Object.entries(data?.byGoal || {}).map(([id, goal]) => (
                <div key={id} className="rounded-2xl border border-graphite-800 bg-ink-950/50 px-4 py-3">
                  <p className="text-sm font-semibold text-white">{goal.goalName}</p>
                  <div className="mt-2 space-y-1 text-xs text-graphite-400">
                    {goal.totals.map((item) => (
                      <div key={item.channel} className="flex items-center justify-between">
                        <span>{item.channel}</span>
                        <span className="text-graphite-200">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttributionView;
