import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacidade | Erilson Digital',
};

export default function PrivacyPage() {
    return (
        <div className="pt-32 pb-20 px-4 bg-ink-950 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="rounded-[32px] border border-graphite-800 bg-ink-900/80 p-10 text-graphite-200">
                    <h1 className="text-3xl md:text-4xl font-semibold text-graphite-900 mb-3">Politica de Privacidade</h1>
                    <p className="text-sm text-graphite-400 mb-8">Ultima atualizacao: {new Date().toLocaleDateString('pt-BR')}</p>

                    <div className="space-y-6 text-sm leading-relaxed">
                        <p>Esta politica descreve como coletamos, utilizamos e protegemos seus dados quando voce acessa o site da Erilson Digital.</p>

                        <div>
                            <h2 className="text-lg font-semibold text-graphite-900 mb-2">Coleta de dados</h2>
                            <p>Coletamos apenas as informacoes necessarias para contato comercial, diagnostico e execucao de projetos.</p>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-graphite-900 mb-2">Uso de dados</h2>
                            <p>Utilizamos os dados exclusivamente para comunicacao, analise de demanda e melhoria dos servicos.</p>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-graphite-900 mb-2">Compartilhamento</h2>
                            <p>Dados nao sao compartilhados com terceiros sem base legal ou autorizacao expressa.</p>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-graphite-900 mb-2">Seguranca</h2>
                            <p>Adotamos controles tecnicos e administrativos para proteger dados pessoais contra acesso nao autorizado.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
