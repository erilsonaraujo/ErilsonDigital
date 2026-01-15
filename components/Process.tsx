'use client';

import React from 'react';
import { CheckCircle2, Target, ShieldCheck, Sparkles } from 'lucide-react';
import { useThemeLanguage } from '@/contexts/ThemeLanguageContext';
import { TRANSLATIONS } from '@/constants';
import Reveal from '@/components/ui/Reveal';
import Parallax from '@/components/ui/Parallax';
import TiltCard from '@/components/ui/TiltCard';

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
    <section id="processo" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 grid-fade opacity-20" />
      <Parallax className="absolute -top-20 -left-24 h-72 w-72 rounded-full bg-cobalt-500/12 blur-[110px]" speed={0.2} />
      <Parallax className="absolute bottom-0 -right-24 h-96 w-96 rounded-full bg-tide-500/10 blur-[120px]" speed={0.16} offset={60} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between gap-12 mb-16">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">{t.nav.process}</p>
            <Reveal as="h2" className="section-title mt-4">{t.process.title}</Reveal>
          </div>
          <Reveal as="p" delayMs={80} className="section-lead max-w-xl">{t.process.subtitle}</Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <Reveal key={step.title} as="div" delayMs={100 + index * 70}>
              <TiltCard className="rounded-[24px]">
                <div className="rounded-[24px] border border-graphite-800 bg-ink-900/70 p-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/6 via-transparent to-transparent" />
                  <div className="relative">
                    <div className="h-11 w-11 rounded-xl bg-cobalt-500/10 text-cobalt-300 flex items-center justify-center mb-4">
                      <step.icon size={20} />
                    </div>
                    <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">{t.process.stepLabel} {index + 1}</p>
                    <h3 className="text-lg font-semibold text-white mt-2">{step.title}</h3>
                    <p className="text-sm text-graphite-300 mt-2">{step.text}</p>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
