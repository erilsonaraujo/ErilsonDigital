'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowUpRight, ShieldCheck, Sparkles, Workflow } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40">
      <div className="absolute inset-0 noise-bg" />
      <div className="absolute inset-0 grid-fade opacity-70" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-graphite-800 bg-ink-900/70 px-4 py-2 text-xs text-graphite-300">
              <span className="h-2 w-2 rounded-full bg-tide-400 animate-pulse" />
              Consultoria premium em engenharia, IA e produto digital
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white leading-tight">
              Estruture software de alto valor com engenharia precisa, automacao inteligente e
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cobalt-300 to-tide-300"> execucao global</span>.
            </h1>

            <p className="text-lg text-graphite-300 leading-relaxed max-w-xl">
              Projetos para empresas que exigem confianca, seguranca e performance real.
              Construo sistemas que suportam crescimento acelerado e posicionam sua operacao no mesmo nivel de consultorias globais.
            </p>

            <div className="flex flex-wrap gap-4">
              <a href="/agendar" className="primary-cta">
                Diagnostico estrategico <ArrowUpRight size={16} />
              </a>
              <a href="/portfolio" className="secondary-cta">
                Ver cases
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              {[
                { icon: ShieldCheck, title: 'Seguranca', text: 'Arquitetura OWASP e governanca de dados.' },
                { icon: Workflow, title: 'Escalabilidade', text: 'Projetos prontos para alto volume e automacao.' },
                { icon: Sparkles, title: 'Valor Premium', text: 'Entregas alinhadas ao ROI e ao posicionamento.' },
              ].map((item) => (
                <div key={item.title} className="glass-panel rounded-2xl p-4">
                  <item.icon className="text-tide-300 mb-3" size={20} />
                  <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                  <p className="text-xs text-graphite-400 mt-1">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-graphite-800/70">
              <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">Confiado por lideres que exigem excelencia</p>
              <div className="mt-4 flex flex-wrap gap-6 text-sm text-graphite-400">
                <span>Fintechs</span>
                <span>LegalTech</span>
                <span>HealthTech</span>
                <span>Consultorias</span>
                <span>SaaS B2B</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-10 -right-8 h-64 w-64 rounded-full bg-cobalt-500/20 blur-[120px]" />
            <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-tide-500/20 blur-[120px]" />

            <div className="relative rounded-[32px] border border-graphite-800/70 bg-ink-900/60 p-6 shadow-2xl">
              <div className="rounded-[24px] overflow-hidden border border-graphite-800">
                <Image
                  src="/erilson.jpg"
                  alt="Erilson Araujo"
                  width={640}
                  height={720}
                  className="h-[420px] w-full object-cover"
                  priority
                />
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4">
                {[
                  { label: 'Especialidades', value: 'IA aplicada, backends criticos, produtos premium' },
                  { label: 'Foco', value: 'Solucoes sob medida com eficiencia de capital' },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-graphite-800 bg-ink-950/70 p-4">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-graphite-500">{item.label}</p>
                    <p className="text-sm text-graphite-200 mt-2">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
