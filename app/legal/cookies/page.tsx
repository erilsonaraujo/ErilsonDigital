import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookies | Erilson Digital',
};

export default function CookiesPage() {
  return (
    <div className="pt-32 pb-20 px-4 bg-ink-950 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-[32px] border border-graphite-800 bg-ink-900/80 p-10 text-graphite-200">
          <h1 className="text-3xl md:text-4xl font-semibold text-white mb-3">Politica de Cookies</h1>
          <p className="text-sm text-graphite-400 mb-8">Ultima atualizacao: {new Date().toLocaleDateString('pt-BR')}</p>

          <div className="space-y-6 text-sm leading-relaxed">
            <p>Utilizamos cookies para melhorar performance, medir conversoes e personalizar a experiencia.</p>
            <div>
              <h2 className="text-lg font-semibold text-white mb-2">Cookies essenciais</h2>
              <p>Garantem o funcionamento do site e protecoes basicas de seguranca.</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white mb-2">Cookies de analise</h2>
              <p>Coletam dados anonimizados para entender comportamento e otimizar resultados.</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white mb-2">Gerenciamento</h2>
              <p>Voce pode ajustar o uso de cookies nas configuracoes do seu navegador.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
