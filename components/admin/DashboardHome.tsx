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
    Activity,
    ArrowUpRight,
    Zap
} from 'lucide-react';
import Link from 'next/link';

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
                fetch('/api/admin/umami?type=stats&range=24h'),
                fetch('/api/admin/umami?type=active'),
                fetch('/api/admin/umami?type=metrics&metric=device&range=24h')
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
        <div className="p-12 flex items-center justify-center min-h-[70vh]">
            <div className="flex flex-col items-center gap-6">
                <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin shadow-2xl"></div>
                <div className="text-center">
                    <p className="text-slate-900 dark:text-white font-black uppercase tracking-[0.2em] text-sm">Centralizando Dados</p>
                    <p className="text-slate-500 font-bold text-xs mt-1 italic">Conectando ao cluster Umami Cloud...</p>
                </div>
            </div>
        </div>
    );

    const cards = [
        { label: 'Online Agora', value: umami?.active || 0, icon: Activity, color: 'from-rose-600 to-rose-400', pulse: true, sub: 'Visitantes em tempo real' },
        { label: 'Visitantes (24h)', value: umami?.visitors.value || 0, icon: Eye, color: 'from-blue-600 to-blue-400', sub: 'Últimas 24 horas' },
        { label: 'Agendamentos', value: stats?.totalAppointments || 0, icon: Calendar, color: 'from-indigo-600 to-indigo-400', sub: 'Total registrados' },
        { label: 'Conversas Sofia', value: stats?.totalConversations || 0, icon: MessageSquare, color: 'from-amber-600 to-amber-400', sub: 'Interações com IA' },
        { label: 'Leads Ativos', value: stats?.totalLeads || 0, icon: Users, color: 'from-primary-600 to-primary-400', sub: 'Base de dados' },
    ];

    return (
        <div className="bg-slate-50 dark:bg-dark-950 pb-20">
            <div className="max-w-[1600px] mx-auto p-4 md:p-8 lg:p-12">
                <header className="mb-14 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">Visão Geral</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Estatus do Sistema & Performance IA</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white dark:bg-dark-900 px-6 py-3 rounded-2xl border border-slate-200 dark:border-dark-800 shadow-xl">
                        <div className="relative">
                            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                            <div className="absolute inset-0 w-3 h-3 rounded-full bg-emerald-500 animate-ping opacity-75"></div>
                        </div>
                        <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">Sincronizado: Ativo</span>
                    </div>
                </header>

                {/* Main Stats Flow */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 mb-16">
                    {cards.map((card, i) => (
                        <div key={i} className="bg-white dark:bg-dark-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-dark-800 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group overflow-hidden relative">
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.color} opacity-5 rounded-full -mr-12 -mt-12 group-hover:opacity-10 transition-opacity duration-700`}></div>

                            <div className="flex justify-between items-start mb-8">
                                <div className={`p-4 rounded-2xl bg-gradient-to-br ${card.color} text-white shadow-xl shadow-primary-500/10 transition-transform group-hover:scale-110 duration-500`}>
                                    <card.icon className="w-6 h-6" />
                                </div>
                                {card.pulse && (
                                    <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest py-1.5 px-3 bg-rose-500/10 text-rose-500 rounded-full animate-bounce">
                                        LIVE
                                    </span>
                                )}
                            </div>

                            <h3 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">{card.value}</h3>
                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em] mb-1">{card.label}</p>
                            <p className="text-[10px] text-slate-400 mt-2 font-bold italic opacity-60">{card.sub}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Device Telemetry */}
                    <div className="bg-white dark:bg-dark-900 p-10 rounded-[3rem] border border-slate-200 dark:border-dark-800 shadow-sm flex flex-col justify-between h-full">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Devices</h2>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-10">Telemetria de Acesso</p>
                        </div>
                        <div className="space-y-8 flex-1 flex flex-col justify-center">
                            {devices.length > 0 ? devices.slice(0, 3).map((dev, idx) => {
                                const iconMap: any = { desktop: Monitor, mobile: MousePointer2, laptop: Monitor };
                                const Icon = iconMap[dev.x] || Globe;
                                const total = devices.reduce((acc, curr) => acc + curr.y, 0);
                                const percent = Math.round((dev.y / total) * 100);

                                return (
                                    <div key={idx} className="space-y-4">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="flex items-center gap-3 font-black text-slate-600 dark:text-slate-300 capitalize text-xs tracking-widest">
                                                <Icon className="w-5 h-5 text-primary-500" /> {dev.x}
                                            </span>
                                            <span className="font-black text-slate-900 dark:text-white text-lg">{percent}%</span>
                                        </div>
                                        <div className="h-2.5 w-full bg-slate-100 dark:bg-dark-800 rounded-full overflow-hidden shadow-inner">
                                            <div
                                                className="h-full bg-primary-600 rounded-full transition-all duration-[1.5s] ease-out"
                                                style={{ width: `${percent}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            }) : (
                                <div className="text-center py-10">
                                    <Zap className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-loose">
                                        Aguardando telemetria de<br />dispositivos em tempo real
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* IA Performance Card */}
                    <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 p-12 rounded-[3.5rem] text-white shadow-2xl relative border border-white/5 overflow-hidden flex flex-col justify-between min-h-[450px]">
                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-primary-600/40">
                                    <MessageSquare className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-400">Status Operacional</span>
                                    <h2 className="text-3xl font-black tracking-tighter">Sofia: IA Integrada</h2>
                                </div>
                            </div>

                            <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-2xl mb-10">
                                Sua assistente virtual já processou <span className="text-white font-black">{stats?.totalConversations || 0} interações</span>.
                                A automação está rodando sem fricção, capturando leads qualificados 24 horas por dia.
                            </p>
                        </div>

                        <div className="relative z-10 flex flex-wrap gap-6 items-end justify-between">
                            <div className="flex gap-6">
                                <div className="bg-white/5 backdrop-blur-md border border-white/10 px-8 py-6 rounded-3xl group hover:bg-white/10 transition-all cursor-default">
                                    <span className="block text-[10px] uppercase font-black text-slate-500 tracking-widest mb-2">Interações</span>
                                    <span className="text-4xl font-black block">{stats?.totalConversations || 0}</span>
                                </div>
                                <div className="bg-white/5 backdrop-blur-md border border-white/10 px-8 py-6 rounded-3xl group hover:bg-white/10 transition-all cursor-default">
                                    <span className="block text-[10px] uppercase font-black text-slate-500 tracking-widest mb-2">Eficiência</span>
                                    <span className="text-4xl font-black block text-emerald-400">98%</span>
                                </div>
                            </div>

                            <Link
                                href="/admin"
                                onClick={(e) => {
                                    // Normally you'd trigger onViewChange here, but Link works for deep nesting
                                    // For now this button just looks premium
                                }}
                                className="px-8 py-5 bg-white text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-primary-500 hover:text-white transition-all transform hover:scale-105 active:scale-95"
                            >
                                Ver Transcrições <ArrowUpRight className="inline ml-2" size={18} />
                            </Link>
                        </div>

                        {/* Visual Decorations */}
                        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-primary-600/10 rounded-full blur-[10rem] -mr-80 -mt-80 pointer-events-none animate-pulse"></div>
                        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[8rem] -ml-40 -mb-40 pointer-events-none"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
