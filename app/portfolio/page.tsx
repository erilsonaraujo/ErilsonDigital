import { Metadata } from 'next';
import Projects from '../../components/Projects';

export const metadata: Metadata = {
    title: 'Cases | Erilson Digital',
    description: 'Casos estrategicos, plataformas criticas e sistemas que sustentam crescimento real.',
};

export default function PortfolioPage() {
    return (
        <div className="pt-10">
            <Projects />
        </div>
    );
}
