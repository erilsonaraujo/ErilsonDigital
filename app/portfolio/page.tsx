import Projects from '../../components/Projects';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Portfólio | Erilson Digital',
    description: 'Cases de sucesso, sistemas complexos e automações desenvolvidas com Java, Python e React.',
};

export default function PortfolioPage() {
    return (
        <div className="pt-10">
            <Projects />
        </div>
    );
}
