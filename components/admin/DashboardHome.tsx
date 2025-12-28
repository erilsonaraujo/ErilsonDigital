'use client';

import React, { useEffect, useState } from 'react';
import { Users, Calendar, Eye, MessageSquare, TrendingUp, ArrowUpRight } from 'lucide-react';

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

    if (loading) return <div className="p-8 text-slate-500">Carregando estatísticas...</div>;

    const cards = [
        { label: 'Total de Leads', value: stats?.totalLeads || 0, icon: Users, color: 'bg-blue-500', trend: stats?.recentLeads + ' hoje' },
        { label: 'Agendamentos', value: stats?.totalAppointments || 0, icon: Calendar, color: 'bg-indigo-500' },
        { label: 'Visitantes Únicos', value: stats?.uniqueVisitors || 0, icon: Eye, color: 'bg-purple-500' },
        { label: 'Visualizações', value: stats?.pageViews || 0, icon: TrendingUp, color: 'bg-emerald-500' },
        { label: 'Conversas IA', value: stats?.totalConversations || 0, icon: MessageSquare, color: 'bg-amber-500' },
    ];

    return (
        <div className="p-8">
            <header className="mb-10">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Painel de Controle</h1>
                <p className="text-slate-500 dark:text-slate-400">Resumo de desempenho e atividades recentes.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
                {cards.map((card, i) => (
                    <div key={i} className="bg-white dark:bg-dark-900 p-6 rounded-2xl border border-slate-200 dark:border-dark-800 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl ${card.color} text-white`}>
                                <card.icon className="w-6 h-6" />
                            </div>
                            <button className="text-slate-400 hover:text-primary-500 transition-colors">
                                <ArrowUpRight className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{card.label}</p>
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{card.value}</h3>
                        {card.trend && <p className="text-xs text-emerald-500 mt-2 font-bold">+ {card.trend}</p>}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-dark-900 p-8 rounded-2xl border border-slate-200 dark:border-dark-800 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Tráfego por Dispositivo</h2>
                    <div className="space-y-6">
                        {/* Placeholder for simple bars */}
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-600 dark:text-slate-400">Mobile</span>
                                <span className="font-bold text-slate-900 dark:text-white">65%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 dark:bg-dark-800 rounded-full overflow-hidden">
                                <div className="h-full bg-primary-500 rounded-full" style={{ width: '65%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-600 dark:text-slate-400">Desktop</span>
                                <span className="font-bold text-slate-900 dark:text-white">32%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 dark:bg-dark-800 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: '32%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-600 dark:text-slate-400">Tablet</span>
                                <span className="font-bold text-slate-900 dark:text-white">3%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 dark:bg-dark-800 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500 rounded-full" style={{ width: '3%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-primary-600 to-indigo-700 p-8 rounded-2xl text-white shadow-lg overflow-hidden relative">
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold mb-4">Sofia está ativa ✨</h2>
                        <p className="text-primary-100 mb-8 max-w-sm leading-relaxed">
                            Sua assistente já gerenciou {stats?.totalConversations || 0} conversas.
                            Continue refinando o "cérebro" dela para melhores resultados.
                        </p>
                        <button className="bg-white text-primary-600 font-bold px-6 py-3 rounded-xl hover:bg-slate-100 transition-all shadow-lg active:scale-95">
                            Ver Transcrições
                        </button>
                    </div>
                    {/* Decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
