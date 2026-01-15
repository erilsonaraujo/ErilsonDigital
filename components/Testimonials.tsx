'use client';

import React from 'react';
import { Quote } from 'lucide-react';
import { TESTIMONIALS_BY_LANG, TRANSLATIONS } from '@/constants';
import { useThemeLanguage } from '@/contexts/ThemeLanguageContext';
import Reveal from '@/components/ui/Reveal';
import Parallax from '@/components/ui/Parallax';
import TiltCard from '@/components/ui/TiltCard';

const Testimonials: React.FC = () => {
  const { language } = useThemeLanguage();
  const t = TRANSLATIONS[language];
  const testimonials = TESTIMONIALS_BY_LANG[language];
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 grid-fade opacity-20" />
      <Parallax className="absolute -top-24 left-0 h-80 w-80 rounded-full bg-tide-500/10 blur-[120px]" speed={0.18} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between gap-10 mb-14">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">{t.testimonials.title}</p>
            <Reveal as="h2" className="section-title mt-4">{t.testimonials.subtitle}</Reveal>
          </div>
          <Reveal as="p" delayMs={80} className="section-lead max-w-xl">{t.testimonials.lead}</Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <Reveal key={item.id} as="div" delayMs={100 + index * 70}>
              <TiltCard className="rounded-[26px]">
                <div className="rounded-[26px] border border-graphite-800 bg-ink-900/70 p-6 shadow-xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/6 via-transparent to-transparent" />
                  <div className="relative">
                    <Quote className="text-tide-300 mb-4" size={28} />
                    <p className="text-sm text-graphite-200 italic leading-relaxed">"{item.content}"</p>
                    <div className="mt-6 border-t border-graphite-800 pt-4">
                      <p className="text-sm font-semibold text-white">{item.name}</p>
                      <p className="text-xs text-graphite-400">{item.role} | {item.company}</p>
                    </div>
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

export default Testimonials;
