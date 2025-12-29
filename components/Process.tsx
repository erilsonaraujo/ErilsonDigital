'use client';

import React from 'react';
import { CheckCircle2, Target, ShieldCheck, Sparkles } from 'lucide-react';

const Process: React.FC = () => {
  const steps = [
    {
      title: 'Diagnostico estrategico',
      text: 'Levantamento profundo de objetivos, risco e retorno financeiro.',
      icon: Target,
    },
    {
      title: 'Arquitetura premium',
      text: 'Modelagem tecnica e UX alinhadas ao posicionamento do negocio.',
      icon: ShieldCheck,
    },
    {
      title: 'Execucao com controle',
      text: 'Sprints com visibilidade total, qualidade e performance monitoradas.',
      icon: CheckCircle2,
    },
    {
      title: 'Escala e evolucao',
      text: 'Roadmap continuo para crescimento, automacao e novos mercados.',
      icon: Sparkles,
    },
  ];

  return (
    <section id="processo" className="py-24 bg-ink-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between gap-12 mb-16">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">Processo</p>
            <h2 className="section-title mt-4">Metodo que sustenta entregas de alto ticket.</h2>
          </div>
          <p className="section-lead max-w-xl">
            Um fluxo claro, com governanca, mitigacao de riscos e comunicacao executiva. Tudo para garantir previsibilidade e confianca.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={step.title} className="rounded-[24px] border border-graphite-800 bg-ink-900/70 p-6">
              <div className="h-11 w-11 rounded-xl bg-cobalt-500/10 text-cobalt-300 flex items-center justify-center mb-4">
                <step.icon size={20} />
              </div>
              <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">Etapa {index + 1}</p>
              <h3 className="text-lg font-semibold text-white mt-2">{step.title}</h3>
              <p className="text-sm text-graphite-300 mt-2">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
