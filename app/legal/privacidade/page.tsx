import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Política de Privacidade | Erilson Digital',
};

export default function PrivacyPage() {
    return (
        <div className="pt-24 pb-12 px-4 bg-white dark:bg-dark-950 min-h-screen">
            <div className="max-w-3xl mx-auto prose dark:prose-invert">
                <h1>Política de Privacidade</h1>
                <p>Última atualização: {new Date().toLocaleDateString()}</p>
                <p>A sua privacidade é importante para nós. É política do Erilson Digital respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site <a href="https://erilsondigital.com">Erilson Digital</a>.</p>
                <h2>Coleta de Dados</h2>
                <p>Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento.</p>
                <h2>Uso de Dados</h2>
                <p>Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado. Quando armazenamos dados, protegemos dentro de meios comercialmente aceitáveis ​​para evitar perdas e roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados.</p>
                <h2>Compartilhamento</h2>
                <p>Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei.</p>
            </div>
        </div>
    );
}
