'use client';

import React, { useState, useEffect } from 'react';
import {
    BarChart3,
    Globe,
    Monitor,
    Smartphone,
    Navigation,
    ExternalLink,
    ArrowUpRight,
    RefreshCcw,
    ShieldCheck
} from 'lucide-react';

const AnalyticsView: React.FC = () => {
    const [stats, setStats] = useState<any>(null);
    const [metrics, setMetrics] = useState<any>({
        url: [],
        referrer: [],
        browser: [],
        os: [],
        device: [],
        country: []
    });
    const [loading, setLoading] = useState(true);

    const fetchMetrics = async () => {
        setLoading(true);
        try {
            const types = ['url', 'referrer', 'browser', 'os', 'device', 'country'];
            const [statsRes, ...metricsPromises] = await Promise.all([
                fetch('/api/admin/umami?type=stats'),
                ...types.map(t => fetch(`/api/admin/umami?type=metrics&metric=${t}`))
            ]);

            const statsData = await statsRes.json();
            const metricsResults = await Promise.all(metricsPromises.map(p => p.json()));

            setStats(statsData);
            const newMetrics: any = {};
            types.forEach((t, i) => {
                newMetrics[t] = metricsResults[i];
            });
            setMetrics(newMetrics);
        } catch (err) {
            console.error('Fetch metrics error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMetrics();
    }, []);

    if (loading) return (
        <div className="p-12 flex items-center justify-center h-screen">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Mapeando Tráfego Global...</p>
            </div>
        </div>
    );

    const MetricTable = ({ title, data, icon: Icon, color }: { title: string, data: any[], icon: any, color: string }) => (
        <div className="bg-white dark:bg-dark-900 rounded-[2rem] border border-slate-200 dark:border-dark-800 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 dark:border-dark-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-${color}-500/10 text-${color}-500`}>
                        <Icon size={18} />
                    </div>
                    <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-wider text-xs">{title}</h3>
                </div>
                <span className="text-[10px] font-bold text-slate-400">TOP 5</span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-dark-800 flex-1">
                {data.slice(0, 5).map((item, idx) => {
                    const total = data.reduce((acc, curr) => acc + curr.y, 0);
                    const percent = Math.round((item.y / total) * 100);
                    return (
                        <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-dark-800/10 transition-colors">
                            <div className="flex flex-col gap-0.5 min-w-0">
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">{item.x}</span>
                                <div className="h-1 w-24 bg-slate-100 dark:bg-dark-800 rounded-full overflow-hidden">
                                    <div className={`h-full bg-${color}-500`} style={{ width: `${percent}%` }}></div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-sm font-black text-slate-900 dark:text-white">{item.y}</span>
                                <span className="text-[10px] text-slate-400 font-medium">cliques</span>
                            </div>
                        </div>
                    );
                })}
                {data.length === 0 && <div className="p-8 text-center text-slate-400 text-xs italic">Sem dados registrados.</div>}
            </div>
        </div>
    );

    return (
        <div className="p-4 md:p-8 lg:p-12 min-h-screen">
            <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 text-white">
                            <BarChart3 size={24} />
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Analytics</h1>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium italic">Dados reais processados via Umami Cloud API.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchMetrics}
                        className="p-3 bg-slate-100 dark:bg-dark-800 text-slate-500 rounded-xl hover:bg-primary-500 hover:text-white transition-all shadow-sm"
                    >
                        <RefreshCcw size={20} />
                    </button>
                    <a
                        href="https://cloud.umami.is"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-xl font-black text-sm shadow-xl active:scale-95 transition-all"
                    >
                        Dashboard Completo <ArrowUpRight size={16} />
                    </a>
                </div>
            </header>

            {/* Core Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="bg-white dark:bg-dark-900 p-8 rounded-3xl border border-slate-200 dark:border-dark-800 shadow-sm">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2 block">Visualizações</span>
                    <div className="text-4xl font-black text-slate-900 dark:text-white">{stats?.pageviews.value || 0}</div>
                    <div className="mt-2 flex items-center gap-1.5 font-bold text-xs text-emerald-500 bg-emerald-500/5 px-2 py-0.5 rounded-full w-fit">
                        +{Math.round(((stats?.pageviews.value - stats?.pageviews.prev) / (stats?.pageviews.prev || 1)) * 100)}% vs ontem
                    </div>
                </div>
                <div className="bg-white dark:bg-dark-900 p-8 rounded-3xl border border-slate-200 dark:border-dark-800 shadow-sm">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2 block">Visitantes</span>
                    <div className="text-4xl font-black text-slate-900 dark:text-white">{stats?.visitors.value || 0}</div>
                    <div className="mt-2 text-[10px] text-slate-500 font-medium">Impacto em tempo real</div>
                </div>
                <div className="bg-white dark:bg-dark-900 p-8 rounded-3xl border border-slate-200 dark:border-dark-800 shadow-sm">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2 block">Tempo Médio</span>
                    <div className="text-4xl font-black text-slate-900 dark:text-white">
                        {Math.floor((stats?.totaltime.value || 0) / 60)}m {Math.round((stats?.totaltime.value || 0) % 60)}s
                    </div>
                    <div className="mt-2 text-[10px] text-slate-500 font-medium italic">Retenção de usuários</div>
                </div>
                <div className="bg-white dark:bg-dark-900 p-8 rounded-3xl border border-slate-200 dark:border-dark-800 shadow-sm">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2 block">Taxa de Rejeição</span>
                    <div className="text-4xl font-black text-slate-900 dark:text-white">
                        {Math.round((stats?.bounces.value / (stats?.visitors.value || 1)) * 100)}%
                    </div>
                    <div className="mt-2 text-[10px] text-slate-500 font-medium">Qualidade do tráfego</div>
                </div>
            </div>

            {/* Metrics Grids */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                <MetricTable title="Páginas Mais Vistas" data={metrics.url} icon={Navigation} color="primary" />
                <MetricTable title="Fontes de Tráfego" data={metrics.referrer} icon={ExternalLink} color="blue" />
                <MetricTable title="Cidades / Países" data={metrics.country} icon={Globe} color="emerald" />
                <MetricTable title="Navegadores" data={metrics.browser} icon={Monitor} color="indigo" />
                <MetricTable title="Sistemas Operacionais" data={metrics.os} icon={Navigation} color="slate" />
                <MetricTable title="Dispositivos" data={metrics.device} icon={Smartphone} color="rose" />
            </div>

            <footer className="flex items-center justify-between py-10 border-t border-slate-100 dark:border-dark-800">
                <div className="flex items-center gap-3 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                    <ShieldCheck className="text-emerald-500" size={16} />
                    Monitoramento 100% Protegido e Privado
                </div>
                <div className="text-[10px] text-slate-400 font-bold italic">Integrado com a infraestrutura cloud Umami</div>
            </footer>
        </div>
    );
};

export default AnalyticsView;
