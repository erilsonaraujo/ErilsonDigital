import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Termos e Condições | Erilson Digital',
};

export default function TermsPage() {
    return (
        <div className="pt-24 pb-12 px-4 bg-white dark:bg-dark-950 min-h-screen">
            <div className="max-w-3xl mx-auto prose dark:prose-invert">
                <h1>Termos e Condições</h1>
                <p>Ao acessar ao site <a href="https://erilsondigital.com">Erilson Digital</a>, concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis ​​e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis.</p>
                <h2>Uso de Licença</h2>
                <p>É concedida permissão para baixar temporariamente uma cópia dos materiais (informações ou software) no site Erilson Digital, apenas para visualização transitória pessoal e não comercial.</p>
                <h2>Isenção de responsabilidade</h2>
                <p>Os materiais no site da Erilson Digital são fornecidos 'como estão'. Erilson Digital não oferece garantias, expressas ou implícitas, e, por este meio, isenta e nega todas as outras garantias.</p>
            </div>
        </div>
    );
}
