import { Metadata } from 'next';
import AboutPageContent from '@/components/pages/AboutPageContent';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
    title: 'Sobre | Erilson Digital',
    description: 'Consultoria premium em produto digital, IA e automacao com foco em ROI, seguranca e escalabilidade.',
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-ink-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Breadcrumbs />
                <AboutPageContent />
            </div>
        </div>
    );
}
