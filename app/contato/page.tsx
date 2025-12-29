import { Metadata } from 'next';
import Contact from '@/components/Contact';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
    title: 'Contato | Erilson Digital',
    description: 'Briefing estrategico para projetos premium em engenharia, IA e produto digital.',
};

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-ink-950 pt-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Breadcrumbs />
                <div className="mt-6 mb-10">
                    <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">Contato executivo</p>
                    <h1 className="text-4xl md:text-5xl font-semibold text-white mt-4">
                        Vamos alinhar estrategia, escopo e valor.
                    </h1>
                    <p className="text-lg text-graphite-300 mt-4 max-w-2xl">
                        Envie um briefing detalhado para avaliarmos aderencia tecnica e estimativas iniciais.
                    </p>
                </div>
            </div>
            <Contact />
        </div>
    );
}
