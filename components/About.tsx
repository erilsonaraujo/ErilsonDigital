'use client';

import React from 'react';
import Image from 'next/image';
import { SKILLS, TRANSLATIONS } from '@/constants';
import { useThemeLanguage } from '@/contexts/ThemeLanguageContext';

const About: React.FC = () => {
  const { language } = useThemeLanguage();
  const t = TRANSLATIONS[language];
  return (
    <section id="about" className="py-24 bg-ink-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-16 items-center">
          <div className="space-y-8">
            <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">{t.about.label}</p>
            <h2 className="section-title">{t.about.headline}</h2>
            <p className="section-lead">{t.about.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {t.about.highlights.map((item) => (
                <div key={item.title} className="rounded-2xl border border-graphite-800 bg-ink-900/70 p-4">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-graphite-500">{item.title}</p>
                  <p className="text-sm text-graphite-200 mt-2">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="rounded-[32px] border border-graphite-800 bg-ink-900/70 p-6">
              <div className="rounded-[24px] overflow-hidden border border-graphite-800">
                <Image
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1600"
                  alt={t.about.headline}
                  width={1200}
                  height={800}
                  className="h-64 w-full object-cover"
                />
              </div>
              <div className="mt-6">
                <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">{t.process.title}</p>
                <p className="text-sm text-graphite-200 mt-2">{t.process.subtitle}</p>
              </div>
            </div>

            <div className="rounded-[28px] border border-graphite-800 bg-ink-900/70 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">{t.about.stackLabel}</p>
              <div className="mt-4 space-y-4">
                {SKILLS.slice(0, 5).map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between text-sm text-graphite-300">
                      <span>{skill.name}</span>
                      <span className="text-xs uppercase tracking-[0.3em] text-graphite-500">{skill.category}</span>
                    </div>
                    <div className="mt-2 h-1.5 rounded-full bg-graphite-800">
                      <div className="h-1.5 rounded-full bg-gradient-to-r from-cobalt-400 to-tide-400" style={{ width: `${skill.level}%` }} />
                    </div>
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

export default About;
