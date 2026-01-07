'use client';

import React from 'react';
import { CheckCircle2, Target, ShieldCheck, Sparkles } from 'lucide-react';
import { useThemeLanguage } from '@/contexts/ThemeLanguageContext';
import { TRANSLATIONS } from '@/constants';

const Process: React.FC = () => {
  const { language } = useThemeLanguage();
  const t = TRANSLATIONS[language];

  const steps = [
    { icon: Target, ...t.process.steps[0] },
    { icon: ShieldCheck, ...t.process.steps[1] },
    { icon: CheckCircle2, ...t.process.steps[2] },
    { icon: Sparkles, ...t.process.steps[3] },
  ];

  return (
    <section id="processo" className="py-24 bg-ink-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between gap-12 mb-16">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">{t.nav.process}</p>
            <h2 className="section-title mt-4">{t.process.title}</h2>
          </div>
          <p className="section-lead max-w-xl">
            {t.process.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={step.title} className="rounded-[24px] border border-graphite-800 bg-ink-900/70 p-6">
              <div className="h-11 w-11 rounded-xl bg-cobalt-500/10 text-cobalt-300 flex items-center justify-center mb-4">
                <step.icon size={20} />
              </div>
              <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">{t.process.stepLabel} {index + 1}</p>
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
