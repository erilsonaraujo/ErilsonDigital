import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Seguranca | Erilson Digital',
  description: 'Práticas de segurança da informação, privacidade, LGPD e canal para reporte responsável de vulnerabilidades.',
};

export default function SecurityPage() {
  const lastUpdated = '15/01/2026';

  return (
    <div className="pt-10 pb-20 px-4 bg-ink-950 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-[32px] border border-graphite-800 bg-ink-900/80 p-10 text-graphite-200">
          <h1 className="text-3xl md:text-4xl font-semibold text-graphite-900 mb-3">Seguranca e LGPD</h1>
          <p className="text-sm text-graphite-400 mb-8">Ultima atualizacao: {lastUpdated}</p>

          <div className="space-y-6 text-sm leading-relaxed">
            <p>
              A seguranca e parte central da operacao da Erilson Digital. Mantemos controles tecnicos e administrativos proporcionais ao risco para proteger o site, os dados pessoais
              e a continuidade do servico.
            </p>
            <div>
              <h2 className="text-lg font-semibold text-graphite-900 mb-2">1. Controles e boas praticas</h2>
              <ul className="list-disc pl-5 mt-3 space-y-1">
                <li>Praticas OWASP (prevencao de vulnerabilidades comuns).</li>
                <li>Controle de acesso e principio do menor privilegio (quando aplicavel).</li>
                <li>Logs e monitoramento para deteccao de abuso e incidentes.</li>
                <li>Hardening e configuracoes seguras em infraestrutura e aplicacao.</li>
                <li>Backups e rotinas de recuperacao (quando aplicavel).</li>
              </ul>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-graphite-900 mb-2">2. Privacidade e LGPD</h2>
              <p>
                Buscamos tratar dados pessoais com base legal adequada, minimizacao (somente o necessario) e medidas de seguranca. Para detalhes sobre categorias de dados, finalidades e direitos,
                consulte a Politica de Privacidade e a Politica de Cookies.
              </p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-graphite-900 mb-2">3. Reporte responsavel de vulnerabilidades</h2>
              <p>
                Se voce identificar uma possivel vulnerabilidade, envie um e-mail para joseerilsonaraujo@gmail.com com o assunto “Seguranca - Vulnerabilidade”. Inclua:
              </p>
              <ul className="list-disc pl-5 mt-3 space-y-1">
                <li>descricao do problema e impacto;</li>
                <li>passos para reproducao (quando possivel);</li>
                <li>evidencias (prints/logs) e ambiente afetado;</li>
                <li>seu contato para retorno.</li>
              </ul>
              <p className="mt-3">
                Pedimos que nao explore a falha alem do necessario para demonstracao, nao acesse dados de terceiros e nao realize testes que possam degradar o servico. Faremos o melhor esforco
                para responder e corrigir em prazo razoavel.
              </p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-graphite-900 mb-2">4. Incidentes</h2>
              <p>
                Em caso de incidente relevante envolvendo dados pessoais, adotaremos medidas de contencao, investigacao e mitigacao. Quando aplicavel, realizaremos comunicacao nos termos
                da legislacao vigente e orientacoes da ANPD.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
