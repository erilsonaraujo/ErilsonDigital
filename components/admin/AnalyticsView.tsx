'use client';

import React, { useEffect, useState } from 'react';
import { BarChart3, Activity, Users, Clock, TrendingDown, RefreshCcw, Globe, Monitor, Smartphone, Compass, Search } from 'lucide-react';

interface AnalyticsResponse {
  stats: {
    pageviews: number;
    visitors: number;
    avgSession: number;
    bounceRate: number;
  };
  metrics: {
    url: { x: string; y: number }[];
    referrer: { x: string; y: number }[];
    browser: { x: string; y: number }[];
    os: { x: string; y: number }[];
    device: { x: string; y: number }[];
    country: { x: string; y: number }[];
    region: { x: string; y: number }[];
    city: { x: string; y: number }[];
    event: { x: string; y: number }[];
  };
}

const AnalyticsView: React.FC = () => {
  const [range, setRange] = useState('24h');
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/analytics?range=${range}`);
      const json = await res.json();
      if (res.ok) setData(json);
    } catch (err) {
      console.error('Analytics fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [range]);

  if (loading) {
    return (
      <div className="p-12 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-cobalt-500 border-t-transparent animate-spin" />
          <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">Gerando relatorio</p>
        </div>
      </div>
    );
  }

  const stats = data?.stats;

  const MetricCard = ({ icon: Icon, label, value, note }: { icon: any; label: string; value: string | number; note: string }) => (
    <div className="rounded-[24px] border border-graphite-800 bg-ink-900/70 p-6 shadow-xl">
      <div className="flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-[0.3em] text-graphite-500">{label}</p>
        <div className="h-10 w-10 rounded-2xl bg-cobalt-500/10 text-cobalt-300 flex items-center justify-center">
          <Icon size={18} />
        </div>
      </div>
      <p className="text-3xl font-semibold text-white mt-6">{value}</p>
      <p className="text-xs text-graphite-500 mt-2">{note}</p>
    </div>
  );

  const MetricTable = ({ title, icon: Icon, data }: { title: string; icon: any; data: { x: string; y: number }[] }) => (
    <div className="rounded-[24px] border border-graphite-800 bg-ink-900/70 p-6 shadow-xl">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-tide-500/10 text-tide-300 flex items-center justify-center">
          <Icon size={18} />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="text-[10px] uppercase tracking-[0.3em] text-graphite-500">Top 20</p>
        </div>
      </div>
      <div className="mt-5 space-y-3">
        {data.slice(0, 8).map((item) => (
          <div key={item.x} className="flex items-center justify-between text-sm text-graphite-300">
            <span className="truncate pr-4">{item.x}</span>
            <span className="text-graphite-100">{item.y}</span>
          </div>
        ))}
        {data.length === 0 && <p className="text-xs text-graphite-500">Sem dados no periodo.</p>}
      </div>
    </div>
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-graphite-400">
          <BarChart3 size={18} className="text-cobalt-300" />
          <span className="text-xs uppercase tracking-[0.3em]">Analytics interno</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-full border border-graphite-800 bg-ink-900/70 p-1">
            {['24h', '7d', '30d'].map((option) => (
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
          <button
            onClick={fetchAnalytics}
            className="h-10 w-10 rounded-full border border-graphite-800 text-graphite-300 hover:text-white"
          >
            <RefreshCcw size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard icon={Activity} label="Pageviews" value={stats?.pageviews || 0} note="Total de paginas vistas" />
        <MetricCard icon={Users} label="Visitantes" value={stats?.visitors || 0} note="Usuarios unicos" />
        <MetricCard icon={Clock} label="Sessao media" value={`${Math.floor((stats?.avgSession || 0) / 60)}m`} note="Tempo medio" />
        <MetricCard icon={TrendingDown} label="Bounce" value={`${stats?.bounceRate || 0}%`} note="Saidas rapidas" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <MetricTable title="Paginas" icon={Compass} data={data?.metrics.url || []} />
        <MetricTable title="Origem" icon={Search} data={data?.metrics.referrer || []} />
        <MetricTable title="Paises" icon={Globe} data={data?.metrics.country || []} />
        <MetricTable title="Regioes" icon={Globe} data={data?.metrics.region || []} />
        <MetricTable title="Cidades" icon={Globe} data={data?.metrics.city || []} />
        <MetricTable title="Browsers" icon={Monitor} data={data?.metrics.browser || []} />
        <MetricTable title="Sistemas" icon={Monitor} data={data?.metrics.os || []} />
        <MetricTable title="Dispositivos" icon={Smartphone} data={data?.metrics.device || []} />
        <MetricTable title="Eventos" icon={Activity} data={data?.metrics.event || []} />
      </div>
    </div>
  );
};

export default AnalyticsView;
