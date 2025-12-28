import About from '../../components/About';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sobre Mim | Erilson Digital',
    description: 'Desenvolvedor Full Stack com background jurídico. Segurança, performance e visão de negócios.',
};

export default function AboutPage() {
    return (
        <div className="pt-10">
            <About />
        </div>
    );
}
