import { Metadata } from 'next';
import Services from '../../components/Services';

export const metadata: Metadata = {
    title: 'Servicos | Erilson Digital',
    description: 'Portfolio de servicos premium em engenharia, IA aplicada e produto digital.',
};

export default function ServicesPage() {
    return (
        <div className="pt-24">
            <Services />
        </div>
    );
}
