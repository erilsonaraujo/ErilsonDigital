'use client';

import React, { useEffect, useState } from 'react';
import { RefreshCcw, Users2 } from 'lucide-react';

interface CohortRow {
  label: string;
  size: number;
  retention: { offset: number; count: number; percent: number }[];
}

const CohortsView: React.FC = () => {
  const [range, setRange] = useState('12w');
  const [interval, setInterval] = useState('week');
  const [cohorts, setCohorts] = useState<CohortRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCohorts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ range, interval });
      const res = await fetch(`/api/admin/cohorts?${params.toString()}`);
      const json = await res.json();
      if (res.ok) setCohorts(json.cohorts || []);
    } catch (error) {
      console.error('Cohorts fetch error', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCohorts();
  }, [range, interval]);

  const maxOffset = Math.max(0, ...cohorts.flatMap((cohort) => cohort.retention.map((r) => r.offset)));

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-graphite-400">
          <Users2 size={18} className="text-tide-300" />
          <span className="text-xs uppercase tracking-[0.3em]">Coortes</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-full border border-graphite-800 bg-ink-900/70 p-1">
            {['8w', '12w', '24w'].map((option) => (
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
            value={interval}
            onChange={(e) => setInterval(e.target.value)}
            className="rounded-full border border-graphite-800 bg-ink-900/70 px-4 py-2 text-xs text-white"
          >
            <option value="week">Semanal</option>
            <option value="day">Diario</option>
          </select>
          <button
            onClick={fetchCohorts}
            className="h-10 w-10 rounded-full border border-graphite-800 text-graphite-300 hover:text-white"
          >
            <RefreshCcw size={16} />
          </button>
        </div>
      </div>

      <div className="rounded-[28px] border border-graphite-800 bg-ink-900/70 p-6 shadow-2xl overflow-x-auto">
        {loading && (
          <p className="text-sm text-graphite-400">Carregando coortes...</p>
        )}
        {!loading && cohorts.length === 0 && (
          <p className="text-sm text-graphite-500">Sem dados suficientes para coortes no periodo.</p>
        )}
        {!loading && cohorts.length > 0 && (
          <table className="min-w-full text-sm text-graphite-300">
            <thead>
              <tr className="text-xs uppercase tracking-[0.2em] text-graphite-500">
                <th className="py-3 px-3 text-left">Cohort</th>
                <th className="py-3 px-3 text-left">Usuarios</th>
                {Array.from({ length: maxOffset + 1 }, (_, index) => (
                  <th key={index} className="py-3 px-3 text-left">+{index}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cohorts.map((cohort) => (
                <tr key={cohort.label} className="border-t border-graphite-800">
                  <td className="py-3 px-3 text-white font-semibold">{cohort.label}</td>
                  <td className="py-3 px-3">{cohort.size}</td>
                  {Array.from({ length: maxOffset + 1 }, (_, index) => {
                    const value = cohort.retention.find((item) => item.offset === index);
                    return (
                      <td key={index} className="py-3 px-3">
                        <span className="text-graphite-100">{value ? `${value.percent}%` : '0%'}</span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CohortsView;
