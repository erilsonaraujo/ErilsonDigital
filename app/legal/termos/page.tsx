import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Termos | Erilson Digital',
    description: 'Termos de Uso do site, regras de utilização, propriedade intelectual e responsabilidades.',
};

export default function TermsPage() {
    const lastUpdated = '15/01/2026';

    return (
        <div className="pt-10 pb-20 px-4 bg-ink-950 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="rounded-[32px] border border-graphite-800 bg-ink-900/80 p-10 text-graphite-200">
                    <h1 className="text-3xl md:text-4xl font-semibold text-graphite-900 mb-3">Termos de Uso</h1>
                    <p className="text-sm text-graphite-400 mb-8">Ultima atualizacao: {lastUpdated}</p>

                    <div className="space-y-6 text-sm leading-relaxed">
                        <div>
                            <h2 className="text-lg font-semibold text-graphite-900 mb-2">1. Aceitacao e escopo</h2>
                            <p>
                                Ao acessar e utilizar este site, voce declara que leu e concorda com estes Termos e com a legislacao aplicavel. Se nao concordar, nao utilize o site.
                                Estes Termos regem o uso do conteudo, formularios e funcionalidades disponiveis, incluindo (quando habilitado) paginas de produtos e funcionalidades de e-commerce.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-graphite-900 mb-2">2. Uso permitido e conduta</h2>
                            <p>Voce se compromete a utilizar o site de forma licita e responsavel. E proibido:</p>
                            <ul className="list-disc pl-5 mt-3 space-y-1">
                                <li>tentar violar mecanismos de seguranca, autenticao ou restricoes de acesso;</li>
                                <li>realizar engenharia social, scraping abusivo, automacoes maliciosas ou ataques (ex.: DDoS);</li>
                                <li>inserir conteudo ilicito, ofensivo, fraudulento ou que viole direitos de terceiros;</li>
                                <li>interferir no funcionamento do site, servidores ou redes.</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-graphite-900 mb-2">3. Conteudo e limitacoes</h2>
                            <p>
                                O conteudo do site e apresentado para fins informativos e pode ser atualizado sem aviso. Nada aqui constitui proposta contratual automatica.
                                Eventuais propostas, escopo, prazos, valores e condicoes serao definidos por escrito, conforme cada caso.
                            </p>
                            <p className="mt-3">
                                Na maxima extensao permitida pela lei, nao garantimos que o site estara sempre disponivel, livre de erros ou que atendera a um objetivo especifico.
                                O uso do site e por sua conta e risco.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-graphite-900 mb-2">4. Propriedade intelectual</h2>
                            <p>
                                Marcas, textos, layouts, identidades visuais, codigos, imagens e demais conteudos sao protegidos por direitos de propriedade intelectual e pertencem a Erilson Digital
                                ou a seus licenciadores. E proibida a reproducao, distribuicao, modificacao ou uso comercial sem autorizacao previa e expressa, salvo nos limites legais.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-graphite-900 mb-2">5. Links e servicos de terceiros</h2>
                            <p>
                                O site pode conter links para sites/servicos de terceiros. Nao controlamos esses ambientes e nao nos responsabilizamos por seu conteudo, politicas ou praticas.
                                O uso de terceiros esta sujeito aos termos e politicas deles.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-graphite-900 mb-2">6. Privacidade</h2>
                            <p>
                                O tratamento de dados pessoais e regido pela Politica de Privacidade e pela Politica de Cookies. Ao utilizar o site, voce declara estar ciente desses documentos.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-graphite-900 mb-2">7. Alteracoes destes Termos</h2>
                            <p>
                                Podemos atualizar estes Termos periodicamente. A versao vigente sera publicada nesta pagina com a data de ultima atualizacao.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-graphite-900 mb-2">8. Lei aplicavel e foro</h2>
                            <p>
                                Estes Termos sao regidos pelas leis da Republica Federativa do Brasil. Fica eleito o foro da comarca do titular/empresa responsavel, salvo disposicao legal em contrario.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
