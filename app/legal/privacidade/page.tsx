import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Política de Privacidade | Erilson Digital',
};

export default function PrivacyPage() {
    return (
        <div className="pt-32 pb-20 px-4 bg-white dark:bg-dark-950 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="prose prose-lg dark:prose-invert max-w-none">
                    <h1 className="text-4xl font-bold mb-4">Política de Privacidade</h1>
                    <p className="text-slate-600 dark:text-slate-400 mb-8">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

                    <p className="text-lg">A sua privacidade é importante para nós. É política do Erilson Digital respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site <a href="https://erilsondigital.com" className="text-primary-600 hover:text-primary-700">Erilson Digital</a>.</p>

                    <h2 className="text-2xl font-bold mt-8 mb-4">Coleta de Dados</h2>
                    <p>Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento.</p>

                    <h2 className="text-2xl font-bold mt-8 mb-4">Uso de Dados</h2>
                    <p>Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado. Quando armazenamos dados, protegemos dentro de meios comercialmente aceitáveis ​​para evitar perdas e roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados.</p>

                    <h2 className="text-2xl font-bold mt-8 mb-4">Compartilhamento</h2>
                    <p>Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei.</p>

                    <h2 className="text-2xl font-bold mt-8 mb-4">Links Externos</h2>
                    <p>Nosso site pode ter links para sites externos que não são operados por nós. Esteja ciente de que não temos controle sobre o conteúdo e práticas desses sites e não podemos aceitar responsabilidade por suas respectivas políticas de privacidade.</p>
                </div>
            </div>
        </div>
    );
}
