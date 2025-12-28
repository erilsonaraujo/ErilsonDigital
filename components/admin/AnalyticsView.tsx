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
    ShieldCheck,
    Clock,
    Users,
    MousePointer2,
    Calendar,
    Search
} from 'lucide-react';

const AnalyticsView: React.FC = () => {
    const [stats, setStats] = useState<any>(null);
    const [range, setRange] = useState('24h');
    const [metrics, setMetrics] = useState<any>({
        url: [],
        referrer: [],
        browser: [],
        os: [],
        device: [],
        country: [],
        event: []
    });
    const [loading, setLoading] = useState(true);

    const fetchAllMetrics = async () => {
        setLoading(true);
        try {
            const types = ['url', 'referrer', 'browser', 'os', 'device', 'country', 'event'];
            const [statsRes, ...metricsPromises] = await Promise.all([
                fetch(`/api/admin/umami?type=stats&range=${range}`),
                ...types.map(t => fetch(`/api/admin/umami?type=metrics&metric=${t}&range=${range}`))
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
            console.error('Fetch all metrics error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllMetrics();
    }, [range]);

    if (loading) return (
        <div className="p-12 flex items-center justify-center min-h-screen">
            <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Sincronizando com a Infraestrutura Umami...</p>
            </div>
        </div>
    );

    const MetricTable = ({ title, data, icon: Icon, color, suffix = 'cliques' }: { title: string, data: any[], icon: any, color: string, suffix?: string }) => (
        <div className="bg-white dark:bg-dark-900 rounded-[2.5rem] border border-slate-200 dark:border-dark-800 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-8 border-b border-slate-100 dark:border-dark-800 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl bg-${color}-500/10 text-${color}-500 shadow-inner`}>
                        <Icon size={20} />
                    </div>
                    <div>
                        <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-wider text-xs">{title}</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Ranking Principal</p>
                    </div>
                </div>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-dark-800 flex-1 overflow-y-auto max-h-[400px]">
                {data.map((item, idx) => {
                    const total = data.reduce((acc, curr) => acc + curr.y, 0);
                    const percent = Math.round((item.y / (total || 1)) * 100);
                    return (
                        <div key={idx} className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-dark-800/20 transition-all group">
                            <div className="flex flex-col gap-1.5 min-w-0 pr-4">
                                <span className="text-sm font-black text-slate-700 dark:text-slate-200 truncate group-hover:text-primary-500 transition-colors">{item.x}</span>
                                <div className="h-1.5 w-32 bg-slate-100 dark:bg-dark-800 rounded-full overflow-hidden">
                                    <div className={`h-full bg-${color}-500`} style={{ width: `${percent}%` }}></div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end flex-shrink-0">
                                <span className="text-base font-black text-slate-900 dark:text-white">{item.y}</span>
                                <span className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">{suffix}</span>
                            </div>
                        </div>
                    );
                })}
                {data.length === 0 && <div className="p-12 text-center text-slate-400 text-xs italic font-medium">Nenhum dado capturado para este período.</div>}
            </div>
        </div>
    );

    return (
        <div className="bg-slate-50 dark:bg-dark-950 pb-20">
            <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-12">
                <header className="mb-12 flex flex-col xl:flex-row xl:items-end justify-between gap-8">
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-14 h-14 bg-primary-600 rounded-[1.25rem] flex items-center justify-center shadow-2xl shadow-primary-500/40 text-white">
                                <BarChart3 size={32} />
                            </div>
                            <div>
                                <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">Business Analytics</h1>
                                <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-1">Full Umami Cloud Telemetry</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex bg-white dark:bg-dark-900 p-1.5 rounded-2xl border border-slate-200 dark:border-dark-800 shadow-sm">
                            {['24h', '7d', '30d'].map((r) => (
                                <button
                                    key={r}
                                    onClick={() => setRange(r)}
                                    className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${range === r
                                            ? 'bg-primary-600 text-white shadow-lg'
                                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                                        }`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={fetchAllMetrics}
                            className="p-4 bg-white dark:bg-dark-900 text-primary-500 rounded-2xl border border-slate-200 dark:border-dark-800 hover:bg-primary-500 hover:text-white transition-all shadow-sm group"
                        >
                            <RefreshCcw size={20} className="group-active:rotate-180 transition-transform duration-500" />
                        </button>
                    </div>
                </header>

                {/* Main Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {[
                        { label: 'Visualizações', value: stats?.pageviews.value, icon: MousePointer2, color: 'blue', sub: 'Total de páginas abertas' },
                        { label: 'Visitantes Reais', value: stats?.visitors.value, icon: Users, color: 'primary', sub: 'Usuários únicos' },
                        { label: 'Tempo de Sessão', value: `${Math.floor((stats?.totaltime.value || 0) / 60)}m ${Math.round((stats?.totaltime.value || 0) % 60)}s`, icon: Clock, color: 'emerald', sub: 'Média de permanência' },
                        { label: 'Taxa de Saída', value: `${Math.round((stats?.bounces.value / (stats?.visitors.value || 1)) * 100)}%`, icon: ExternalLink, color: 'rose', sub: 'Usuários que saíram logo' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white dark:bg-dark-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-dark-800 shadow-sm group hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
                            <div className={`absolute -right-4 -bottom-4 w-24 h-24 bg-${stat.color}-500/5 rounded-full group-hover:scale-150 transition-transform duration-700`}></div>
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.25em] mb-4 block">{stat.label}</span>
                            <div className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">{stat.value || 0}</div>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest italic opacity-70">
                                <stat.icon size={12} className={`text-${stat.color}-500`} />
                                {stat.sub}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Deep Data Grids */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    <MetricTable title="Páginas (URL)" data={metrics.url} icon={Navigation} color="blue" />
                    <MetricTable title="Fontes de Tráfego" data={metrics.referrer} icon={Search} color="primary" />
                    <MetricTable title="Geolocalização" data={metrics.country} icon={Globe} color="emerald" suffix="visitantes" />
                    <MetricTable title="Navegadores" data={metrics.browser} icon={Monitor} color="indigo" />
                    <MetricTable title="Sistemas" data={metrics.os} icon={Navigation} color="slate" />
                    <MetricTable title="Dispositivos" data={metrics.device} icon={Smartphone} color="rose" />
                    <MetricTable title="Eventos (Ações)" data={metrics.event} icon={Calendar} color="amber" suffix="vincular" />
                </div>

                <footer className="mt-20 flex flex-col md:flex-row items-center justify-between p-10 bg-slate-900 dark:bg-dark-900 rounded-[3rem] border border-white/5 text-white gap-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-500/20 text-emerald-500 rounded-2xl flex items-center justify-center border border-emerald-500/30">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-black uppercase tracking-widest">Monitoramento Ativo</p>
                            <p className="text-xs text-slate-400 font-bold">Privacidade garantida via Umami Infrastructure</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <a
                            href="https://cloud.umami.is"
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
                        >
                            Painel Umami Web <ArrowUpRight size={16} />
                        </a>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default AnalyticsView;
