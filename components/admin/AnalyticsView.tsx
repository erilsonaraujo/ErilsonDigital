'use client';

import React, { useState } from 'react';
import { Globe, BarChart3, ExternalLink, Settings, ShieldCheck, RefreshCcw } from 'lucide-react';

const AnalyticsView: React.FC = () => {
    // Ideally the user provides a share URL like https://cloud.umami.is/share/ID/Website
    const [umamiShareUrl, setUmamiShareUrl] = useState('https://cloud.umami.is/share/458b37ce-b9e9-4105-aa3b-0f15f0f54d1f/erilsondigital.com');

    return (
        <div className="p-4 md:p-8 lg:p-12 h-screen flex flex-col overflow-hidden">
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 flex-shrink-0">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/20">
                            <BarChart3 className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Umami Analytics</h1>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium italic">Gestão de tráfego e métricas de privacidade.</p>
                </div>

                <div className="flex items-center gap-3">
                    <a
                        href="https://cloud.umami.is"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-800 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:shadow-lg transition-all"
                    >
                        <ExternalLink className="w-4 h-4" />
                        Painel Umami Cloud
                    </a>
                </div>
            </header>

            {/* Dashboard Container */}
            <div className="flex-1 bg-white dark:bg-dark-900 rounded-[2rem] border border-slate-200 dark:border-dark-800 shadow-2xl overflow-hidden relative group">
                {/* Overlay for setup if URL is missing or incorrect */}
                {!umamiShareUrl && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-50/90 dark:bg-dark-950/90 backdrop-blur-sm">
                        <div className="max-w-md text-center p-8">
                            <Settings className="w-16 h-16 text-primary-500 mx-auto mb-6 opacity-30" />
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Configuração Necessária</h2>
                            <p className="text-slate-500 mb-8">
                                Para visualizar os dados aqui, ative o <b>Share URL</b> no seu painel da Umami Cloud e insira o link abaixo:
                            </p>
                            <input
                                type="text"
                                placeholder="https://cloud.umami.is/share/..."
                                className="w-full p-4 rounded-xl border border-slate-200 dark:border-dark-800 bg-white dark:bg-dark-900 mb-4 outline-none focus:ring-2 focus:ring-primary-500"
                                onBlur={(e) => setUmamiShareUrl(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                {/* The Iframe */}
                <iframe
                    src={umamiShareUrl}
                    className="w-full h-full border-0"
                    title="Umami Analytics Dashboard"
                    allowFullScreen
                ></iframe>
            </div>

            {/* Privacy Note */}
            <footer className="mt-6 flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] flex-shrink-0">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Analíticos com foco em privacidade • Sem cookies invasivos • Dados 100% protegidos</span>
            </footer>
        </div>
    );
};

export default AnalyticsView;
