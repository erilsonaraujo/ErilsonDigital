'use client';

import React, { useEffect, useState } from 'react';
import { Globe, MapPin, Monitor, Clock, Link as LinkIcon } from 'lucide-react';

interface AnalyticsItem {
    id: number;
    visitor_id: string;
    path: string;
    referrer?: string;
    ip: string;
    country: string;
    city: string;
    device: string;
    created_at: string;
}

const AnalyticsView: React.FC = () => {
    const [analytics, setAnalytics] = useState<AnalyticsItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const response = await fetch('/api/admin/analytics');
            const data = await response.json();
            if (response.ok) {
                setAnalytics(data.analytics || []);
            }
        } catch (err) {
            console.error('Fetch analytics error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-slate-500">Carregando dados de tráfego...</div>;

    return (
        <div className="p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Traffic Analytics</h1>
                <p className="text-slate-500 dark:text-slate-400">Rastreamento em tempo real de visitantes e interações.</p>
            </header>

            <div className="bg-white dark:bg-dark-900 rounded-2xl border border-slate-200 dark:border-dark-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-dark-800/50 border-b border-slate-200 dark:border-dark-800">
                                <th className="text-left py-4 px-6 text-xs uppercase font-bold text-slate-500 tracking-wider">Visitante</th>
                                <th className="text-left py-4 px-6 text-xs uppercase font-bold text-slate-500 tracking-wider">Página</th>
                                <th className="text-left py-4 px-6 text-xs uppercase font-bold text-slate-500 tracking-wider">Localização</th>
                                <th className="text-left py-4 px-6 text-xs uppercase font-bold text-slate-500 tracking-wider">Dispositivo</th>
                                <th className="text-left py-4 px-6 text-xs uppercase font-bold text-slate-500 tracking-wider text-right">Horário</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-dark-800">
                            {analytics.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-dark-800/50 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-900 dark:text-white uppercase truncate max-w-[120px]">
                                                {item.visitor_id.substring(0, 8)}
                                            </span>
                                            <span className="text-[10px] text-slate-500 font-mono">{item.ip}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-slate-100 dark:bg-dark-800 rounded text-slate-500">
                                                <LinkIcon className="w-3 h-3" />
                                            </div>
                                            <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">/{item.path.replace(/^\//, '')}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2">
                                            <Globe className="w-4 h-4 text-primary-500" />
                                            <span className="text-sm text-slate-600 dark:text-slate-400">{item.city || 'Desconhecida'}, {item.country}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2">
                                            <Monitor className="w-4 h-4 text-slate-400" />
                                            <span className="text-xs text-slate-600 dark:text-slate-400 capitalize">{item.device}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <div className="flex flex-col items-end">
                                            <span className="text-sm text-slate-900 dark:text-white font-medium">
                                                {new Date(item.created_at).toLocaleDateString('pt-BR')}
                                            </span>
                                            <span className="text-xs text-slate-500 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {new Date(item.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {analytics.length === 0 && (
                    <div className="p-12 text-center text-slate-500">Nenhum dado de tráfego registrado ainda.</div>
                )}
            </div>
        </div>
    );
};

export default AnalyticsView;
