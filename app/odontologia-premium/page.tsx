'use client';

import React from 'react';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Process from '@/components/Process';
import Projects from '@/components/Projects';
import BookingSection from '@/components/BookingSection';
import { Target, Users, BarChart } from 'lucide-react';

export default function DentistryPage() {
    return (
        <main className="min-h-screen bg-ink-950 selection:bg-tide-500/30">
            <Hero
                badge="Odontologia Premium"
                title="Escale tratamentos de alto ticket com previsibilidade"
                subtitle="Implantes, lentes e Invisalign vendidos com processo. Da landing page ao fechamento, crie uma esteira que não deixa dinheiro na mesa."
                ctaPrimary="Agendar Diagnóstico"
                ctaSecondary="Conhecer o método"
                highlights={[
                    { title: 'Filtro de Qualificação', text: 'Chega de leads sem potencial de compra', icon: Target },
                    { title: 'Recuperação de Ociosidade', text: 'Preencha buracos na agenda automaticamente', icon: Users },
                    { title: 'CRM Estruturado', text: 'Controle total do pipeline de vendas', icon: BarChart },
                ]}
                industries={['Implantes', 'Lentes de Contato', 'Invisalign', 'Ortodontia']}
                industriesLabel="Foco em Tratamentos"
                profileCards={[
                    { label: 'Resultado', value: 'Aumento de LTV e ROAS' },
                    { label: 'Estratégia', value: 'Funil de Vendas Odontológico' },
                ]}
            />

            <Services />

            <Process />

            <Projects />

            <BookingSection />
        </main>
    );
}
