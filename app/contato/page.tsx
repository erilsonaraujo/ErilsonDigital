import Contact from '../../components/Contact';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Fale Comigo | Erilson Digital',
    description: 'Entre em contato para discutir seu projeto. Atendimento via WhatsApp ou Email.',
};

export default function ContactPage() {
    return (
        <div className="pt-10">
            <Contact />
        </div>
    );
}
