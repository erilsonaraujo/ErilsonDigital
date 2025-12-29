import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Termos | Erilson Digital',
};

export default function TermsPage() {
    return (
        <div className="pt-32 pb-20 px-4 bg-ink-950 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="rounded-[32px] border border-graphite-800 bg-ink-900/80 p-10 text-graphite-200">
                    <h1 className="text-3xl md:text-4xl font-semibold text-white mb-3">Termos de Uso</h1>
                    <p className="text-sm text-graphite-400 mb-8">Ultima atualizacao: {new Date().toLocaleDateString('pt-BR')}</p>

                    <div className="space-y-6 text-sm leading-relaxed">
                        <div>
                            <h2 className="text-lg font-semibold text-white mb-2">1. Aceitacao</h2>
                            <p>Ao utilizar este site, voce concorda com estes termos e com a legislacao aplicavel.</p>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-white mb-2">2. Uso permitido</h2>
                            <p>O conteudo disponibilizado e exclusivamente informativo, nao configurando proposta contratual automatica.</p>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-white mb-2">3. Responsabilidades</h2>
                            <p>As decisoes comerciais tomadas com base nas informacoes do site sao de responsabilidade do visitante.</p>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-white mb-2">4. Propriedade intelectual</h2>
                            <p>Marcas, textos e layouts sao de propriedade da Erilson Digital e nao podem ser reproduzidos sem autorizacao.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
