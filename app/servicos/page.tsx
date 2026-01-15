import { Metadata } from 'next';
import Services from '../../components/Services';

export const metadata: Metadata = {
    title: 'Servicos | Erilson Digital',
    description: 'Portfolio de servicos premium em produto digital, IA aplicada e automacao.',
};

export default function ServicesPage() {
    return (
        <div className="pt-10">
            <Services />
        </div>
    );
}
