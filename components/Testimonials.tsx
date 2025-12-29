'use client';

import React from 'react';
import { Quote } from 'lucide-react';
import { TESTIMONIALS } from '@/constants';

const Testimonials: React.FC = () => {
  return (
    <section className="py-24 bg-ink-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between gap-10 mb-14">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">Prova social</p>
            <h2 className="section-title mt-4">Stakeholders que exigem precisao e entrega.</h2>
          </div>
          <p className="section-lead max-w-xl">
            Lideres de produto, CTOs e founders confiam pela capacidade de executar rapido com consistencia tecnica e
            responsabilidade.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TESTIMONIALS.slice(0, 6).map((t) => (
            <div key={t.id} className="rounded-[26px] border border-graphite-800 bg-ink-900/70 p-6 shadow-xl">
              <Quote className="text-tide-300 mb-4" size={28} />
              <p className="text-sm text-graphite-200 italic leading-relaxed">"{t.content}"</p>
              <div className="mt-6 border-t border-graphite-800 pt-4">
                <p className="text-sm font-semibold text-white">{t.name}</p>
                <p className="text-xs text-graphite-400">{t.role} | {t.company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
