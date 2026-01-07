'use client';

import React from 'react';
import { ShieldCheck, Lock, Code2, Server, Database, Globe } from 'lucide-react';
import { useThemeLanguage } from '@/contexts/ThemeLanguageContext';

const Authority: React.FC = () => {
    return (
        <section className="py-20 bg-ink-950 border-y border-graphite-800/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Manifesto / Philosophy */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <p className="text-xs uppercase tracking-[0.3em] text-cobalt-400 font-semibold mb-4">
                        Manifesto
                    </p>
                    <h2 className="text-2xl md:text-3xl font-semibold text-white leading-relaxed">
                        "Beleza sem performance é apenas enfeite. Segurança sem usabilidade é burocracia. Eu construo o equilíbrio entre <span className="text-tide-300">engenharia robusta</span> e <span className="text-tide-300">vendas agressivas</span>."
                    </h2>
                </div>

                {/* Trust Signals & Standards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    <div className="p-6 rounded-2xl bg-ink-900/50 border border-graphite-800 hover:border-graphite-700 transition-colors">
                        <ShieldCheck className="w-8 h-8 text-emerald-400 mb-4" />
                        <h3 className="text-lg font-semibold text-white mb-2">Padrões OWASP</h3>
                        <p className="text-sm text-graphite-300">
                            Desenvolvimento seguro seguindo os padrões internacionais da Open Web Application Security Project.
                        </p>
                    </div>
                    <div className="p-6 rounded-2xl bg-ink-900/50 border border-graphite-800 hover:border-graphite-700 transition-colors">
                        <Lock className="w-8 h-8 text-tide-400 mb-4" />
                        <h3 className="text-lg font-semibold text-white mb-2">LGPD & Compliance</h3>
                        <p className="text-sm text-graphite-300">
                            Estruturas preparadas para dados sensíveis médicos e financeiros, com criptografia e logs.
                        </p>
                    </div>
                    <div className="p-6 rounded-2xl bg-ink-900/50 border border-graphite-800 hover:border-graphite-700 transition-colors">
                        <Server className="w-8 h-8 text-cobalt-400 mb-4" />
                        <h3 className="text-lg font-semibold text-white mb-2">Infraestrutura Enterprise</h3>
                        <p className="text-sm text-graphite-300">
                            Backends e bancos de dados que aguentam escala. Nada de sistemas que caem no lançamento.
                        </p>
                    </div>
                </div>

                {/* Stack */}
                <div className="border-t border-graphite-800 pt-10">
                    <p className="text-center text-xs uppercase tracking-[0.3em] text-graphite-500 mb-8">
                        Stack & Tecnologia
                    </p>
                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-mono text-graphite-400">
                        <span className="flex items-center gap-2"><Globe size={14} /> Next.js</span>
                        <span className="flex items-center gap-2"><Code2 size={14} /> React</span>
                        <span className="flex items-center gap-2"><Code2 size={14} /> TypeScript</span>
                        <span className="flex items-center gap-2"><Server size={14} /> Node.js</span>
                        <span className="flex items-center gap-2"><Database size={14} /> PostgreSQL</span>
                        <span className="flex items-center gap-2"><Database size={14} /> Supabase</span>
                        <span className="flex items-center gap-2"><Lock size={14} /> Auth0</span>
                        <span className="flex items-center gap-2"><Server size={14} /> Docker</span>
                        <span className="flex items-center gap-2"><Globe size={14} /> Vercel</span>
                        <span className="flex items-center gap-2"><Code2 size={14} /> Python</span>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Authority;
