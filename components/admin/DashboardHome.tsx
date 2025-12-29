'use client';

import React, { useEffect, useState } from 'react';
import { Users, CalendarCheck2, MessageSquare, Eye, Activity, ArrowUpRight, Smartphone, Monitor, Globe } from 'lucide-react';
import Link from 'next/link';

interface Stats {
  totalLeads: number;
  totalAppointments: number;
  totalConversations: number;
  recentLeads: number;
  uniqueVisitors?: number;
  pageViews?: number;
}

interface AnalyticsSummary {
  stats: {
    pageviews: number;
    visitors: number;
    avgSession: number;
    bounceRate: number;
  };
  metrics: {
    url: { x: string; y: number }[];
    referrer: { x: string; y: number }[];
    device: { x: string; y: number }[];
    country: { x: string; y: number }[];
  };
}

const DashboardHome: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsRes, analyticsRes] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/admin/analytics?range=24h')
        ]);
        const statsData = await statsRes.json();
        const analyticsData = await analyticsRes.json();
        if (statsRes.ok) setStats(statsData.stats);
        if (analyticsRes.ok) setAnalytics(analyticsData);
      } catch (err) {
        console.error('Dashboard data error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="p-12 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-cobalt-500 border-t-transparent animate-spin" />
          <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">Sincronizando dados</p>
        </div>
      </div>
    );
  }

  const cards = [
    { label: 'Visitantes 24h', value: analytics?.stats.visitors || 0, icon: Eye },
    { label: 'Pageviews 24h', value: analytics?.stats.pageviews || 0, icon: Activity },
    { label: 'Leads totais', value: stats?.totalLeads || 0, icon: Users },
    { label: 'Agendamentos', value: stats?.totalAppointments || 0, icon: CalendarCheck2 },
    { label: 'Conversas IA', value: stats?.totalConversations || 0, icon: MessageSquare },
  ];

  const devices = analytics?.metrics.device || [];
  const deviceIcon = (name: string) => {
    if (name.toLowerCase().includes('mobile')) return Smartphone;
    if (name.toLowerCase().includes('desktop')) return Monitor;
    return Globe;
  };

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
        {cards.map((card) => (
          <div key={card.label} className="rounded-[24px] border border-graphite-800 bg-ink-900/70 p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-[0.3em] text-graphite-500">{card.label}</p>
              <div className="h-10 w-10 rounded-2xl bg-cobalt-500/10 text-cobalt-300 flex items-center justify-center">
                <card.icon size={18} />
              </div>
            </div>
            <p className="text-3xl font-semibold text-white mt-6">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="rounded-[28px] border border-graphite-800 bg-ink-900/70 p-6 shadow-xl">
          <h3 className="text-sm font-semibold text-white">Top paginas</h3>
          <div className="mt-4 space-y-3">
            {(analytics?.metrics.url || []).slice(0, 6).map((item) => (
              <div key={item.x} className="flex items-center justify-between text-sm text-graphite-300">
                <span className="truncate pr-4">{item.x}</span>
                <span className="text-graphite-100">{item.y}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-graphite-800 bg-ink-900/70 p-6 shadow-xl">
          <h3 className="text-sm font-semibold text-white">Principais origens</h3>
          <div className="mt-4 space-y-3">
            {(analytics?.metrics.referrer || []).slice(0, 6).map((item) => (
              <div key={item.x} className="flex items-center justify-between text-sm text-graphite-300">
                <span className="truncate pr-4">{item.x}</span>
                <span className="text-graphite-100">{item.y}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-graphite-800 bg-ink-900/70 p-6 shadow-xl">
          <h3 className="text-sm font-semibold text-white">Dispositivos</h3>
          <div className="mt-4 space-y-4">
            {devices.slice(0, 4).map((item) => {
              const Icon = deviceIcon(item.x);
              return (
                <div key={item.x} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-graphite-300">
                    <Icon size={16} className="text-tide-300" />
                    {item.x}
                  </div>
                  <span className="text-sm text-graphite-100">{item.y}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-graphite-800 bg-gradient-to-r from-ink-900/90 to-ink-900/70 p-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">Sofia IA</p>
          <h3 className="text-2xl font-semibold text-white mt-2">Automacao ativa com coleta de leads 24/7</h3>
          <p className="text-sm text-graphite-400 mt-2">Monitore as conversas e ajuste o discurso de acordo com o perfil do publico.</p>
        </div>
        <Link href="/admin" className="primary-cta">
          Ver conversas <ArrowUpRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default DashboardHome;
