'use client';

import React from 'react';
import { Quote } from 'lucide-react';
import { TESTIMONIALS_BY_LANG, TRANSLATIONS } from '@/constants';
import { useThemeLanguage } from '@/contexts/ThemeLanguageContext';

const Testimonials: React.FC = () => {
  const { language } = useThemeLanguage();
  const t = TRANSLATIONS[language];
  const testimonials = TESTIMONIALS_BY_LANG[language];
  return (
    <section className="py-24 bg-ink-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between gap-10 mb-14">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">{t.testimonials.title}</p>
            <h2 className="section-title mt-4">{t.testimonials.subtitle}</h2>
          </div>
          <p className="section-lead max-w-xl">
            {t.testimonials.lead}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <div key={item.id} className="rounded-[26px] border border-graphite-800 bg-ink-900/70 p-6 shadow-xl">
              <Quote className="text-tide-300 mb-4" size={28} />
              <p className="text-sm text-graphite-200 italic leading-relaxed">"{item.content}"</p>
              <div className="mt-6 border-t border-graphite-800 pt-4">
                <p className="text-sm font-semibold text-graphite-900">{item.name}</p>
                <p className="text-xs text-graphite-400">{item.role} | {item.company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
