'use client';

import React from 'react';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Process from '@/components/Process';
import Projects from '@/components/Projects';
import BookingSection from '@/components/BookingSection';
import { ShieldCheck, Star, Lock } from 'lucide-react';

export default function SurgeryPage() {
    return (
        <main className="min-h-screen bg-ink-950 selection:bg-tide-500/30">
            <Hero
                badge="Cirurgia Plástica & Dermatologia"
                title="Engenharia digital para médicos de alto valor"
                subtitle="Sua autoridade técnica merece um processo comercial à altura. Filtre curiosos, proteja seus dados e entregue pacientes prontos para sua equipe."
                ctaPrimary="Planejar minha operação"
                ctaSecondary="Ver estrutura"
                highlights={[
                    { title: 'Posicionamento Premium', text: 'Design que reflete sua autoridade', icon: Star },
                    { title: 'Jornada do Paciente', text: 'Experiência fluida do anúncio à consulta', icon: ShieldCheck },
                    { title: 'Segurança & LGPD', text: 'Dados blindados e compliance médico', icon: Lock },
                ]}
                industries={['Cirurgia Plástica', 'Dermatologia Avançada', 'Transplante Capilar']}
                industriesLabel="Especialidades"
                profileCards={[
                    { label: 'Foco', value: 'Qualificação de Leads High-Ticket' },
                    { label: 'Diferencial', value: 'Segurança e Elegância' },
                ]}
            />

            <Services />

            <Process />

            <Projects />

            <BookingSection />
        </main>
    );
}
