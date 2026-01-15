'use client';

import React from 'react';
import { ShieldCheck, Lock, Code2, Server, Database, Globe } from 'lucide-react';
import { useThemeLanguage } from '@/contexts/ThemeLanguageContext';
import Reveal from '@/components/ui/Reveal';
import Parallax from '@/components/ui/Parallax';
import TiltCard from '@/components/ui/TiltCard';

const Authority: React.FC = () => {
    return (
        <section className="py-20 relative overflow-hidden border-y border-graphite-800/50">
            <div className="absolute inset-0 grid-fade opacity-20" />
            <Parallax className="absolute -top-20 left-10 h-80 w-80 rounded-full bg-cobalt-500/10 blur-[120px]" speed={0.16} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Manifesto / Philosophy */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <p className="text-xs uppercase tracking-[0.3em] text-cobalt-400 font-semibold mb-4">
                        Manifesto
                    </p>
                    <Reveal
                        as="h2"
                        className="text-2xl md:text-3xl font-semibold text-white leading-relaxed"
                    >
                        "Beleza sem performance é apenas enfeite. Segurança sem usabilidade é burocracia. Eu construo o equilíbrio entre <span className="text-tide-300">base técnica robusta</span> e <span className="text-tide-300">vendas agressivas</span>."
                    </Reveal>
                </div>

                {/* Trust Signals & Standards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {[
                        {
                            icon: ShieldCheck,
                            title: 'Padrões OWASP',
                            body: 'Segurança by-design seguindo boas práticas internacionais para aplicações web.',
                            accent: 'text-emerald-400',
                        },
                        {
                            icon: Lock,
                            title: 'LGPD & Compliance',
                            body: 'Minimização de dados, controles de acesso, logs e rastreabilidade para operar com confiança.',
                            accent: 'text-tide-400',
                        },
                        {
                            icon: Server,
                            title: 'Infraestrutura Confiável',
                            body: 'Performance, observabilidade e estabilidade: operação preparada para crescer sem sustos.',
                            accent: 'text-cobalt-400',
                        },
                    ].map((item, index) => (
                        <Reveal key={item.title} as="div" delayMs={80 + index * 90}>
                            <TiltCard className="rounded-2xl">
                                <div className="p-6 rounded-2xl bg-ink-900/50 border border-graphite-800 hover:border-graphite-700 transition-colors relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/6 via-transparent to-transparent" />
                                    <div className="relative">
                                        <item.icon className={`w-8 h-8 mb-4 ${item.accent}`} />
                                        <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                                        <p className="text-sm text-graphite-300">{item.body}</p>
                                    </div>
                                </div>
                            </TiltCard>
                        </Reveal>
                    ))}
                </div>

                {/* Stack */}
                <div className="border-t border-graphite-800 pt-10">
                    <p className="text-center text-xs uppercase tracking-[0.3em] text-graphite-500 mb-8">
                        Stack & Tecnologia
                    </p>
                    <Reveal as="div" delayMs={120} className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-mono text-graphite-400">
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
                    </Reveal>
                </div>

            </div>
        </section>
    );
};

export default Authority;
