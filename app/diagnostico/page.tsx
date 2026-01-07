'use client';

import React from 'react';
import Hero from '@/components/Hero';
import BookingSection from '@/components/BookingSection';
import { ClipboardList, Lightbulb, Map, XCircle } from 'lucide-react';
import { useThemeLanguage } from '@/contexts/ThemeLanguageContext';
import { TRANSLATIONS } from '@/constants';

export default function DiagnosticoPage() {
    const { language } = useThemeLanguage();
    const t = TRANSLATIONS[language];

    return (
        <main className="min-h-screen bg-ink-950 selection:bg-tide-500/30">
            <Hero
                badge="Diagnóstico Gratuito"
                title="Entenda por que sua operação trava e desenhe o plano para destravá-la"
                subtitle="Uma conversa de 20-30 minutos para mapear gargalos. Não é uma 'call de vendas' roteirizada, é uma consultoria estratégica inicial."
                ctaPrimary="Agendar agora"
                ctaSecondary="Voltar ao início"
                highlights={[
                    { title: 'Sem Venda Forçada', text: 'Se não for para você, eu aviso.', icon: XCircle },
                    { title: 'Análise Técnica', text: 'Olhar de engenharia sobre seu negócio', icon: MagnifyingGlassIcon },
                    { title: 'Plano Prático', text: 'Saia com próximos passos claros', icon: Map },
                ]}
                industries={[]}
                industriesLabel=""
                profileCards={[
                    { label: 'Duração', value: '30 Minutos' },
                    { label: 'Formato', value: 'Google Meet' },
                ]}
            />

            <section className="py-20 bg-ink-900/50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-semibold text-graphite-900 mb-12 text-center">O que acontece nessa conversa?</h2>

                    <div className="space-y-8">
                        <div className="flex gap-6 items-start p-6 rounded-2xl border border-graphite-800 bg-ink-950 hover:border-graphite-700 transition-colors">
                            <div className="shrink-0 p-3 rounded-full bg-tide-500/10 text-tide-400">
                                <ClipboardList size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-graphite-900 mb-2">1. Raio-X do cenário atual</h3>
                                <p className="text-graphite-300">Você me conta como sua operação roda hoje: de onde vêm os leads, como são atendidos e onde você sente que está perdendo dinheiro.</p>
                            </div>
                        </div>

                        <div className="flex gap-6 items-start p-6 rounded-2xl border border-graphite-800 bg-ink-950 hover:border-graphite-700 transition-colors">
                            <div className="shrink-0 p-3 rounded-full bg-cobalt-500/10 text-cobalt-400">
                                <Lightbulb size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-graphite-900 mb-2">2. Identificação de gargalos</h3>
                                <p className="text-graphite-300">Eu aponto onde a tecnologia ou o processo estão falhando. Pode ser o site lento, o WhatsApp bagunçado ou a falta de dados.</p>
                            </div>
                        </div>

                        <div className="flex gap-6 items-start p-6 rounded-2xl border border-graphite-800 bg-ink-950 hover:border-graphite-700 transition-colors">
                            <div className="shrink-0 p-3 rounded-full bg-emerald-500/10 text-emerald-400">
                                <Map size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-graphite-900 mb-2">3. Direcionamento</h3>
                                <p className="text-graphite-300">Se eu puder resolver, apresento uma proposta. Se não, indico o caminho ou profissional mais adequado. Jogo limpo.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <BookingSection />
        </main>
    );
}

// Helper component just for this file if needed, or stick to lucide imports
function MagnifyingGlassIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    )
}
