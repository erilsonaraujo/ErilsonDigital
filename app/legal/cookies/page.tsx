import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookies | Erilson Digital',
  description: 'Política de Cookies com categorias, finalidades e orientações de gerenciamento e consentimento.',
};

export default function CookiesPage() {
  const lastUpdated = '15/01/2026';

  return (
    <div className="pt-10 pb-20 px-4 bg-ink-950 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-[32px] border border-graphite-800 bg-ink-900/80 p-10 text-graphite-200">
          <h1 className="text-3xl md:text-4xl font-semibold text-graphite-900 mb-3">Politica de Cookies</h1>
          <p className="text-sm text-graphite-400 mb-8">Ultima atualizacao: {lastUpdated}</p>

          <div className="space-y-6 text-sm leading-relaxed">
            <p>
              Esta Politica explica o que sao cookies, como os utilizamos e como voce pode gerencia-los. Ao continuar navegando, voce entende que poderemos utilizar cookies conforme descrito,
              respeitando a legislacao aplicavel (incluindo LGPD) e as configuracoes do seu navegador/dispositivo.
            </p>
            <div>
              <h2 className="text-lg font-semibold text-graphite-900 mb-2">1. O que sao cookies</h2>
              <p>
                Cookies sao pequenos arquivos de texto armazenados no seu navegador. Eles permitem lembrar preferências, manter sessoes, medir desempenho e, em alguns casos,
                apoiar marketing e seguranca.
              </p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-graphite-900 mb-2">2. Tipos de cookies que podemos usar</h2>
              <ul className="list-disc pl-5 mt-3 space-y-1">
                <li><span className="font-semibold text-graphite-900">Essenciais:</span> necessarios para funcionamento, seguranca e entrega correta de conteudo.</li>
                <li><span className="font-semibold text-graphite-900">Desempenho/Analise:</span> ajudam a entender uso do site e melhorar conteudo e conversao.</li>
                <li><span className="font-semibold text-graphite-900">Marketing:</span> medem campanhas e permitem re-engajamento (ex.: pixels).</li>
                <li><span className="font-semibold text-graphite-900">Seguranca/Antifraude:</span> reduzem abuso e automatizacoes indevidas (ex.: reCAPTCHA).</li>
              </ul>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-graphite-900 mb-2">3. Ferramentas de terceiros</h2>
              <p>
                Dependendo da configuracao do site, podemos utilizar ferramentas de terceiros que tambem definem cookies/identificadores, como:
                Google Analytics e Google Tag Manager, Google reCAPTCHA, Meta Pixel e LinkedIn Insight. Esses fornecedores podem tratar dados conforme suas proprias politicas.
              </p>
              <p className="mt-3">
                Sempre que possivel, buscamos configuracoes que reduzam coleta excessiva e priorizem dados agregados/estatisticos.
              </p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-graphite-900 mb-2">4. Como gerenciar cookies</h2>
              <p>
                Voce pode bloquear ou excluir cookies nas configuracoes do seu navegador. Em geral, isso e feito em “Privacidade” ou “Seguranca” do navegador.
                Ao desabilitar cookies, algumas funcionalidades podem nao funcionar corretamente (ex.: formularios, carrinho/checkout, protecoes anti-abuso).
              </p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-graphite-900 mb-2">5. Atualizacoes</h2>
              <p>
                Podemos atualizar esta Politica para refletir mudancas tecnicas, legais ou operacionais. A versao vigente sera publicada nesta pagina com a data de ultima atualizacao.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
