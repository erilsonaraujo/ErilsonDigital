'use client';

import React from 'react';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Process from '@/components/Process';
import Projects from '@/components/Projects';
import BookingSection from '@/components/BookingSection';
import { ShieldCheck, UserCheck, MessageCircle } from 'lucide-react';

export default function EstheticsPage() {
    return (
        <main className="min-h-screen bg-ink-950 selection:bg-tide-500/30">
            <Hero
                badge="Para Clínicas de Estética"
                title="Transforme leads de estética em agenda cheia (sem depender de sorte)"
                subtitle="Sistema de captação e conversão automatizada para clínicas que não querem apenas likes, querem pacientes na cadeira. Chega de curiosos e no-shows."
                ctaPrimary="Agendar Diagnóstico"
                ctaSecondary="Ver como funciona"
                highlights={[
                    { title: 'Leads Qualificados', text: 'Triagem automática antes da secretária', icon: UserCheck },
                    { title: 'Anti No-Show', text: 'Confirmação e lembretes automáticos', icon: ShieldCheck },
                    { title: 'Reativação', text: 'Recupere pacientes sumidos do WhatsApp', icon: MessageCircle },
                ]}
                industries={['Harmonização', 'Corporal', 'Laser', 'Capilar']}
                industriesLabel="Procedimentos em foco"
                profileCards={[
                    { label: 'Meta', value: 'Previsibilidade de agenda' },
                    { label: 'Especialidade', value: 'Automação de atendimento' },
                ]}
            />

            <Services />

            {/* Custom section for Authority/Pain points could go here */}

            <Process />

            <Projects />

            <BookingSection />
        </main>
    );
}
