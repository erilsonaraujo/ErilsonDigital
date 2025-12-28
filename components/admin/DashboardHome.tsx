'use client';

import React, { useEffect, useState } from 'react';
import {
    Users,
    Calendar,
    Eye,
    MessageSquare,
    TrendingUp,
    ArrowUpRight,
    Globe,
    Monitor,
    MousePointer2,
    Clock
} from 'lucide-react';

interface Stats {
    totalLeads: number;
    totalAppointments: number;
    uniqueVisitors: number;
    pageViews: number;
    totalConversations: number;
    recentLeads: number;
}

const DashboardHome: React.FC = () => {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/admin/stats');
            const data = await response.json();
            if (response.ok) {
                setStats(data.stats);
            }
        } catch (err) {
            console.error('Fetch stats error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="p-12 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 font-medium animate-pulse">Sincronizando dados...</p>
            </div>
        </div>
    );

    const cards = [
        { label: 'Total de Leads', value: stats?.totalLeads || 0, icon: Users, color: 'from-blue-600 to-blue-400', trend: stats?.recentLeads + ' novos' },
        { label: 'Agendamentos', value: stats?.totalAppointments || 0, icon: Calendar, color: 'from-indigo-600 to-indigo-400' },
        { label: 'Visitantes Únicos', value: stats?.uniqueVisitors || 0, icon: Eye, color: 'from-purple-600 to-purple-400' },
        { label: 'Visualizações', value: stats?.pageViews || 0, icon: TrendingUp, color: 'from-emerald-600 to-emerald-400' },
        { label: 'Conversas IA', value: stats?.totalConversations || 0, icon: MessageSquare, color: 'from-amber-600 to-amber-400' },
    ];

    return (
        <div className="p-4 md:p-8 lg:p-10 bg-slate-50/50 dark:bg-transparent min-h-screen">
            <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">Visão Geral</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Benvindo ao seu centro de inteligência digital.</p>
                </div>
                <div className="flex items-center gap-2 bg-white dark:bg-dark-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-dark-800 shadow-sm">
                    <Clock className="w-4 h-4 text-primary-500" />
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Atualizado: agora mesmo</span>
                </div>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mb-10">
                {cards.map((card, i) => (
                    <div key={i} className="bg-white dark:bg-dark-900 p-6 rounded-3xl border border-slate-200 dark:border-dark-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative">
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
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                {/* Traffic Chart (Simulated Google Analytics style) */}
                <div className="lg:col-span-2 bg-white dark:bg-dark-900 p-8 rounded-3xl border border-slate-200 dark:border-dark-800 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Fluxo de Tráfego</h2>
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-widest mt-1">Últimos 7 dias</p>
                        </div>
                        <div className="flex gap-2">
                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400"><div className="w-2 h-2 rounded-full bg-primary-500"></div> Visitantes</span>
                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400"><div className="w-2 h-2 rounded-full bg-slate-200"></div> Anterior</span>
                        </div>
                    </div>

                    <div className="h-48 flex items-end justify-between gap-2 px-2">
                        {[45, 78, 52, 91, 64, 85, 120].map((val, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                                <div className="relative w-full flex flex-col items-center justify-end h-full">
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full mb-2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                        {val} views
                                    </div>
                                    <div
                                        className="w-full max-w-[24px] bg-slate-100 dark:bg-dark-800 rounded-t-lg transition-all duration-500"
                                        style={{ height: '100%' }}
                                    ></div>
                                    <div
                                        className="absolute bottom-0 w-full max-w-[24px] bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-lg transition-all duration-700 delay-100 group-hover:shadow-[0_0_15px_rgba(var(--primary-rgb),0.4)]"
                                        style={{ height: `${val}%` }}
                                    ></div>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                    {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'][i]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Device Distribution */}
                <div className="bg-white dark:bg-dark-900 p-8 rounded-3xl border border-slate-200 dark:border-dark-800 shadow-sm flex flex-col">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-8">Por Dispositivo</h2>
                    <div className="space-y-8 flex-1 flex flex-col justify-center">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="flex items-center gap-2 font-bold text-slate-600 dark:text-slate-400">
                                    <Monitor className="w-4 h-4 text-blue-500" /> Desktop
                                </span>
                                <span className="font-black text-slate-900 dark:text-white">42%</span>
                            </div>
                            <div className="h-3 w-full bg-slate-100 dark:bg-dark-800 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: '42%' }}></div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="flex items-center gap-2 font-bold text-slate-600 dark:text-slate-400">
                                    <MousePointer2 className="w-4 h-4 text-emerald-500" /> Mobile
                                </span>
                                <span className="font-black text-slate-900 dark:text-white">55%</span>
                            </div>
                            <div className="h-3 w-full bg-slate-100 dark:bg-dark-800 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '55%' }}></div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="flex items-center gap-2 font-bold text-slate-600 dark:text-slate-400">
                                    <Globe className="w-4 h-4 text-purple-500" /> Outros
                                </span>
                                <span className="font-black text-slate-900 dark:text-white">3%</span>
                            </div>
                            <div className="h-3 w-full bg-slate-100 dark:bg-dark-800 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500 rounded-full" style={{ width: '3%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Assistant Promo Card */}
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-10 rounded-[2.5rem] text-white shadow-2xl overflow-hidden relative border border-white/5">
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div className="max-w-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/40">
                                <MessageSquare className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-primary-400">Recurso Premium Ativo</span>
                        </div>
                        <h2 className="text-4xl font-black mb-4 tracking-tighter leading-tight">Sofia: Sua Inteligência Artificial está gerando resultados.</h2>
                        <p className="text-lg text-slate-400 font-medium leading-relaxed">
                            {stats?.totalConversations || 0} conversas capturadas até agora.
                            A Sofia identifica leads automaticamente e os registra em sua base de dados instantaneamente.
                        </p>
                    </div>
                    <button className="bg-white text-slate-900 font-black px-10 py-5 rounded-2xl hover:bg-primary-400 hover:text-white transition-all shadow-xl active:scale-95 text-lg">
                        Explorar Transcrições
                    </button>
                </div>
                {/* Background Decorations */}
                <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-primary-600/10 rounded-full blur-[8rem] -mr-80 -mt-80 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[6rem] -ml-40 -mb-40 pointer-events-none"></div>
            </div>
        </div>
    );
};

export default DashboardHome;
