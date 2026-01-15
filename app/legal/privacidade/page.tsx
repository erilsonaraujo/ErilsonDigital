import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacidade | Erilson Digital',
    description: 'Política de Privacidade e informações sobre tratamento de dados pessoais, direitos do titular e LGPD.',
};

export default function PrivacyPage() {
    const lastUpdated = '15/01/2026';

    return (
        <div className="pt-10 pb-20 px-4 bg-ink-950 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="rounded-[32px] border border-graphite-800 bg-ink-900/80 p-10 text-graphite-200">
                    <h1 className="text-3xl md:text-4xl font-semibold text-graphite-900 mb-3">Politica de Privacidade</h1>
                    <p className="text-sm text-graphite-400 mb-8">Ultima atualizacao: {lastUpdated}</p>

                    <div className="space-y-6 text-sm leading-relaxed">
                        <p>
                            Esta Politica de Privacidade descreve como a Erilson Digital realiza o tratamento de dados pessoais quando voce acessa este site, entra em contato,
                            agenda uma consultoria, contrata servicos ou utiliza funcionalidades disponiveis.
                        </p>
                        <p className="text-xs text-graphite-400">
                            Observacao: este documento e informativo e nao substitui aconselhamento juridico. Recomenda-se revisao por profissional qualificado para adequacao ao seu caso,
                            especialmente se houver CNPJ, responsavel legal, operacoes internacionais ou tratamento de dados sensiveis.
                        </p>

                        <div>
                            <h2 className="text-lg font-semibold text-graphite-900 mb-2">1. Controlador e contato</h2>
                            <p>
                                Controlador: 59.094.822 ALTA MARIA DA SILVA ARAUJO, CNPJ 59.094.822/0001-21 (nome fantasia: Erilson Digital).
                                Para exercer direitos, tirar duvidas ou tratar de privacidade, contate:
                            </p>
                            <ul className="list-disc pl-5 mt-3 space-y-1">
                                <li>E-mail: joseerilsonaraujo@gmail.com</li>
                                <li>WhatsApp: +55 84 99434-9355</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-graphite-900 mb-2">2. Dados pessoais tratados</h2>
                            <p>Podemos tratar, conforme o caso, as seguintes categorias de dados:</p>
                            <ul className="list-disc pl-5 mt-3 space-y-1">
                                <li>Identificacao e contato: nome, e-mail, telefone/WhatsApp e empresa (quando informado).</li>
                                <li>Informacoes fornecidas pelo usuario: mensagens, briefing, preferencia de data/horario e demais dados inseridos em formularios.</li>
                                <li>Dados tecnicos: endereco IP, identificadores de dispositivo/navegador, data/hora de acesso, paginas visitadas e eventos de navegacao.</li>
                                <li>Cookies e identificadores: conforme descrito na Politica de Cookies.</li>
                                <li>
                                    Dados de compra (quando a funcionalidade de loja estiver habilitada): informacoes de pedido e pagamento processadas por provedores de pagamento.
                                    Nao solicitamos nem armazenamos dados completos de cartao; o processamento ocorre em ambiente do provedor.
                                </li>
                            </ul>
                            <p className="mt-3">
                                Nao ha intencao de tratar dados pessoais sensiveis (ex.: dados de saude) por meio deste site. Se voce nos enviar esse tipo de dado por iniciativa propria,
                                avaliaremos a necessidade e aplicaremos medidas adequadas, podendo solicitar informacoes adicionais ou orientar outro canal.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-graphite-900 mb-2">3. Finalidades e bases legais</h2>
                            <p>Tratamos dados pessoais para as seguintes finalidades, conforme as bases legais da LGPD:</p>
                            <ul className="list-disc pl-5 mt-3 space-y-1">
                                <li>Atender solicitacoes e responder contatos (legitimo interesse e/ou consentimento, conforme o caso).</li>
                                <li>Agendar reunioes e prestar consultoria/servicos (execucao de contrato ou de procedimentos preliminares).</li>
                                <li>Emitir notas fiscais e cumprir obrigacoes legais (cumprimento de obrigacao legal/regulatoria).</li>
                                <li>Seguranca, prevencao a fraude e melhoria continua do site (legitimo interesse).</li>
                                <li>Mensuracao de performance e marketing (consentimento e/ou legitimo interesse, conforme configuracoes e contexto).</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-graphite-900 mb-2">4. Compartilhamento e operadores</h2>
                            <p>
                                Podemos compartilhar dados com fornecedores (operadores) estritamente para viabilizar o funcionamento do site e a prestacao dos servicos, tais como:
                                hospedagem/infraestrutura, provedores de e-mail, ferramentas de analise e mensuracao (ex.: Google Analytics/Tag Manager), plataformas de marketing (ex.: Meta Pixel,
                                LinkedIn Insight) e mecanismos de seguranca/antibot (ex.: reCAPTCHA).
                            </p>
                            <p className="mt-3">
                                Quando aplicavel, o compartilhamento ocorre sob contratos e obrigacoes de confidencialidade, com medidas de seguranca e acesso restrito. Nao vendemos dados pessoais.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-graphite-900 mb-2">5. Transferencias internacionais</h2>
                            <p>
                                Alguns fornecedores podem operar fora do Brasil. Nesses casos, podem ocorrer transferencias internacionais de dados, observadas as regras da LGPD e medidas
                                de protecao adequadas (ex.: clausulas contratuais, politicas e controles de seguranca do fornecedor).
                            </p>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-graphite-900 mb-2">6. Retencao e eliminacao</h2>
                            <p>
                                Mantemos dados pessoais pelo tempo necessario para cumprir as finalidades descritas nesta Politica, para atender exigencias legais, resolver disputas e
                                garantir direitos. Dados de contato/briefings podem ser retidos por periodo razoavel para historico comercial. Dados legais/fiscais seguem prazos obrigatorios.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-graphite-900 mb-2">7. Direitos do titular (LGPD)</h2>
                            <p>
                                Nos termos da LGPD, voce pode solicitar: confirmacao de tratamento, acesso, correcao, anonimização/bloqueio/eliminacao (quando aplicavel), portabilidade,
                                informacao sobre compartilhamentos, revogacao de consentimento e revisao de decisoes automatizadas (quando existentes).
                            </p>
                            <p className="mt-3">
                                Para solicitar, envie e-mail para joseerilsonaraujo@gmail.com com o assunto “Privacidade - Direitos do Titular”, descrevendo o pedido. Podemos solicitar
                                informacoes adicionais para confirmar identidade e prevenir fraude.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-graphite-900 mb-2">8. Seguranca da informacao</h2>
                            <p>
                                Adotamos medidas tecnicas e administrativas proporcionais ao risco, como controles de acesso, criptografia quando aplicavel, boas praticas OWASP,
                                monitoramento e registros de auditoria. Ainda assim, nenhum sistema e totalmente isento de riscos; em caso de incidente relevante, atuaremos para conter,
                                investigar e, quando necessario, comunicar nos termos da legislacao aplicavel.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-graphite-900 mb-2">9. Atualizacoes desta Politica</h2>
                            <p>
                                Podemos atualizar esta Politica periodicamente. A versao vigente sera publicada nesta pagina com a data de ultima atualizacao.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
