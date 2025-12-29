import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Seguranca | Erilson Digital',
};

export default function SecurityPage() {
  return (
    <div className="pt-32 pb-20 px-4 bg-ink-950 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-[32px] border border-graphite-800 bg-ink-900/80 p-10 text-graphite-200">
          <h1 className="text-3xl md:text-4xl font-semibold text-white mb-3">Seguranca e LGPD</h1>
          <p className="text-sm text-graphite-400 mb-8">Ultima atualizacao: {new Date().toLocaleDateString('pt-BR')}</p>

          <div className="space-y-6 text-sm leading-relaxed">
            <p>Adotamos controles tecnicos e administrativos para proteger dados e garantir conformidade.</p>
            <div>
              <h2 className="text-lg font-semibold text-white mb-2">Controles aplicados</h2>
              <p>Headers de seguranca, monitoramento, autenticao reforcada e boas praticas OWASP.</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white mb-2">LGPD</h2>
              <p>Tratamento de dados com base legal adequada e uso estritamente necessario.</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white mb-2">Contato</h2>
              <p>Para duvidas sobre seguranca, utilize o formulario de contato ou e-mail principal.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
