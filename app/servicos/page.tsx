import Services from '../../components/Services';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Serviços | Erilson Digital',
    description: 'Conheça nossos serviços de desenvolvimento de software, automação com IA e consultoria.',
};

export default function ServicesPage() {
    return (
        <div className="pt-10">
            <Services />
        </div>
    );
}
