import { Metadata } from 'next';
import Contact from '@/components/Contact';
import Breadcrumbs from '@/components/Breadcrumbs';
import ContactHero from '@/components/pages/ContactHero';

export const metadata: Metadata = {
    title: 'Contato | Erilson Digital',
    description: 'Briefing estrategico para projetos premium em produto digital, IA e automacao.',
};

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-ink-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Breadcrumbs />
                <ContactHero />
            </div>
            <Contact />
        </div>
    );
}
