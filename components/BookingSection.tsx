'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Calendar, ShieldCheck, MessageCircle } from 'lucide-react';
import { WHATSAPP_NUMBER } from '@/constants';

const BookingSection: React.FC = () => {
    return (
        <section id="booking" className="py-24 bg-ink-950 relative">
            <div className="absolute inset-0 noise-bg opacity-70" />
            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="rounded-[36px] border border-graphite-800 bg-ink-900/80 p-10 md:p-14 shadow-2xl">
                    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
                        <div className="space-y-6">
                            <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">Diagnostico premium</p>
                            <h2 className="text-3xl md:text-4xl font-semibold text-white">
                                Estruture a estrategia tecnica antes de investir alto.
                            </h2>
                            <p className="text-graphite-300">
                                Uma sessao executiva para mapear riscos, oportunidades e o plano de execucao mais eficiente.
                                Indicada para projetos de alto ticket e operacoes criticas.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Link href="/agendar" className="primary-cta">
                                    Agendar diagnostico <ArrowUpRight size={16} />
                                </Link>
                                <a
                                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Olá! Gostaria de agendar um diagnostico estrategico.')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="secondary-cta"
                                >
                                    Conversar no WhatsApp
                                </a>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {[
                                { icon: Calendar, title: 'Sessao estrategica', text: '30 minutos com foco em ROI e caminho tecnico.' },
                                { icon: ShieldCheck, title: 'Confidencialidade', text: 'Conversas protegidas e NDA disponivel.' },
                                { icon: MessageCircle, title: 'Follow-up executivo', text: 'Resumo com proximos passos e estimativa macro.' },
                            ].map((item) => (
                                <div key={item.title} className="rounded-2xl border border-graphite-800 bg-ink-950/70 p-4 flex items-start gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-tide-500/10 text-tide-300 flex items-center justify-center">
                                        <item.icon size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-white">{item.title}</p>
                                        <p className="text-xs text-graphite-400 mt-1">{item.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BookingSection;
