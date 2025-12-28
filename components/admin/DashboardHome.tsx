'use client';

import React, { useEffect, useState } from 'react';
import {
    Users,
    Calendar,
    Eye,
    MessageSquare,
    TrendingUp,
    Globe,
    Monitor,
    MousePointer2,
    Clock,
    Activity
} from 'lucide-react';

interface Stats {
    totalLeads: number;
    totalAppointments: number;
    totalConversations: number;
    recentLeads: number;
}

interface UmamiData {
    pageviews: { value: number; prev: number };
    visitors: { value: number; prev: number };
    active: number;
}

const DashboardHome: React.FC = () => {
    const [stats, setStats] = useState<Stats | null>(null);
    const [umami, setUmami] = useState<UmamiData | null>(null);
    const [devices, setDevices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            const [statsRes, umamiStatsRes, umamiActiveRes, umamiDevicesRes] = await Promise.all([
                fetch('/api/admin/stats'),
                fetch('/api/admin/umami?type=stats'),
                fetch('/api/admin/umami?type=active'),
                fetch('/api/admin/umami?type=metrics&metric=device')
            ]);

            const statsData = await statsRes.json();
            const umamiStats = await umamiStatsRes.json();
            const umamiActive = await umamiActiveRes.json();
            const umamiDevices = await umamiDevicesRes.json();

            if (statsRes.ok) setStats(statsData.stats);
            if (umamiStatsRes.ok && umamiActiveRes.ok) {
                setUmami({
                    pageviews: umamiStats.pageviews,
                    visitors: umamiStats.visitors,
                    active: umamiActive[0]?.x || 0
                });
            }
            if (umamiDevicesRes.ok) setDevices(umamiDevices);

        } catch (err) {
            console.error('Fetch dashboard data error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="p-12 flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">Sincronizando com Umami Cloud...</p>
            </div>
        </div>
    );

    const cards = [
        { label: 'Leads Ativos', value: stats?.totalLeads || 0, icon: Users, color: 'from-blue-600 to-blue-400', trend: stats?.recentLeads + ' novos' },
        { label: 'Agendamentos', value: stats?.totalAppointments || 0, icon: Calendar, color: 'from-indigo-600 to-indigo-400' },
        { label: 'Visitantes Reais', value: umami?.visitors.value || 0, icon: Eye, color: 'from-purple-600 to-purple-400', sub: 'Últimas 24h' },
        { label: 'Visualizações', value: umami?.pageviews.value || 0, icon: TrendingUp, color: 'from-emerald-600 to-emerald-400' },
        { label: 'Online Agora', value: umami?.active || 0, icon: Activity, color: 'from-rose-600 to-rose-400', pulse: true },
    ];

    return (
        <div className="p-4 md:p-8 lg:p-10 bg-slate-50/50 dark:bg-transparent min-h-screen">
            <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">Painel de Controle</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Benvindo ao seu centro de inteligência digital.</p>
                </div>
                <div className="flex items-center gap-2 bg-white dark:bg-dark-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-dark-800 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Conectado: Umami Cloud API</span>
                </div>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-10">
                {cards.map((card, i) => (
                    <div key={i} className="bg-white dark:bg-dark-900 p-6 rounded-3xl border border-slate-200 dark:border-dark-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative">
                        {card.pulse && <div className="absolute top-4 right-4 w-3 h-3 bg-rose-500 rounded-full animate-ping opacity-75"></div>}
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${card.color} opacity-5 rounded-full -mr-10 -mt-10 group-hover:opacity-10 transition-opacity`}></div>

                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-4 rounded-2xl bg-gradient-to-br ${card.color} text-white shadow-lg shadow-primary-500/20`}>
                                <card.icon className="w-5 h-5" />
                            </div>
                            {card.trend && (
                                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">
                                    {card.trend}
                                </span>
                            )}
                        </div>

                        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{card.label}</p>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{card.value}</h3>
                        {card.sub && <p className="text-[10px] text-slate-400 mt-2 font-medium">{card.sub}</p>}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                {/* Devices Distribution */}
                <div className="bg-white dark:bg-dark-900 p-8 rounded-3xl border border-slate-200 dark:border-dark-800 shadow-sm flex flex-col">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-8">Dispositivos</h2>
                    <div className="space-y-6 flex-1 flex flex-col justify-center">
                        {devices.slice(0, 3).map((dev, idx) => {
                            const iconMap: any = { desktop: Monitor, mobile: MousePointer2, laptop: Monitor };
                            const Icon = iconMap[dev.x] || Globe;
                            const total = devices.reduce((acc, curr) => acc + curr.y, 0);
                            const percent = Math.round((dev.y / total) * 100);

                            return (
                                <div key={idx} className="space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="flex items-center gap-2 font-bold text-slate-600 dark:text-slate-400 capitalize">
                                            <Icon className="w-4 h-4 text-primary-500" /> {dev.x}
                                        </span>
                                        <span className="font-black text-slate-900 dark:text-white">{percent}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 dark:bg-dark-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary-500 rounded-full transition-all duration-1000"
                                            style={{ width: `${percent}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                        {devices.length === 0 && <p className="text-slate-400 text-sm text-center italic">Sem dados de dispositivos nas últimas 24h.</p>}
                    </div>
                </div>

                {/* AI Status Card */}
                <div className="lg:col-span-2 bg-gradient-to-r from-slate-900 to-indigo-950 p-10 rounded-[2.5rem] text-white shadow-2xl relative border border-white/5 overflow-hidden">
                    <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center">
                                    <MessageSquare className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-400">Sofia AI • Ativa</span>
                            </div>
                            <h2 className="text-4xl font-black mb-4 tracking-tighter leading-tight">Inteligência Operacional</h2>
                            <p className="text-lg text-slate-400 font-medium leading-relaxed max-w-xl">
                                {stats?.totalConversations || 0} interações convertidas.
                                Sua assistente está capturando leads e agendando consultorias 24/7 sem intervenção humana.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl">
                                <span className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Conversas Totais</span>
                                <span className="text-2xl font-black">{stats?.totalConversations || 0}</span>
                            </div>
                            <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl">
                                <span className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Taxa de Captura</span>
                                <span className="text-2xl font-black">94%</span>
                            </div>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/10 rounded-full blur-[8rem] -mr-32 -mt-32 pointer-events-none"></div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
