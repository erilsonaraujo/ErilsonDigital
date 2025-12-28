import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Termos e Condições | Erilson Digital',
};

export default function TermsPage() {
    return (
        <div className="pt-32 pb-20 px-4 bg-white dark:bg-dark-950 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="prose prose-lg dark:prose-invert max-w-none">
                    <h1 className="text-4xl font-bold mb-4">Termos de Serviço</h1>
                    <p className="text-slate-600 dark:text-slate-400 mb-8">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

                    <h2 className="text-2xl font-bold mt-8 mb-4">1. Termos</h2>
                    <p>Ao acessar ao site <a href="https://erilsondigital.com" className="text-primary-600 hover:text-primary-700">Erilson Digital</a>, você concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis ​​e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis.</p>

                    <h2 className="text-2xl font-bold mt-8 mb-4">2. Uso de Licença</h2>
                    <p>É concedida permissão para baixar temporariamente uma cópia dos materiais (informações ou software) no site Erilson Digital, apenas para visualização transitória pessoal e não comercial.</p>

                    <h2 className="text-2xl font-bold mt-8 mb-4">3. Isenção de responsabilidade</h2>
                    <p>Os materiais no site da Erilson Digital são fornecidos 'como estão'. Erilson Digital não oferece garantias, expressas ou implícitas, e, por este meio, isenta e nega todas as outras garantias, incluindo, sem limitação, garantias implícitas ou condições de comercialização, adequação a um fim específico ou não violação de propriedade intelectual ou outra violação de direitos.</p>

                    <h2 className="text-2xl font-bold mt-8 mb-4">4. Limitações</h2>
                    <p>Em nenhum caso o Erilson Digital ou seus fornecedores serão responsáveis ​​por quaisquer danos (incluindo, sem limitação, danos por perda de dados ou lucro ou devido a interrupção dos negócios) decorrentes do uso ou da incapacidade de usar os materiais em Erilson Digital.</p>
                </div>
            </div>
        </div>
    );
}
