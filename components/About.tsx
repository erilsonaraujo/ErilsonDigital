'use client';

import React from 'react';
import Image from 'next/image';
import { SKILLS, TRANSLATIONS } from '@/constants';
import { useThemeLanguage } from '@/contexts/ThemeLanguageContext';
import Reveal from '@/components/ui/Reveal';
import Parallax from '@/components/ui/Parallax';
import TiltCard from '@/components/ui/TiltCard';

const About: React.FC = () => {
  const { language } = useThemeLanguage();
  const t = TRANSLATIONS[language];
  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 noise-bg opacity-45" />
      <Parallax className="absolute -top-24 right-8 h-80 w-80 rounded-full bg-ember-500/10 blur-[120px]" speed={0.18} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-16 items-center">
          <div className="space-y-8">
            <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">{t.about.label}</p>
            <Reveal as="h2" className="section-title">{t.about.headline}</Reveal>
            <Reveal as="p" delayMs={80} className="section-lead">{t.about.description}</Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {t.about.highlights.map((item, index) => (
                <Reveal key={item.title} as="div" delayMs={120 + index * 70}>
                  <TiltCard className="rounded-2xl">
                    <div className="rounded-2xl border border-graphite-800 bg-ink-900/70 p-4 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/6 via-transparent to-transparent" />
                      <div className="relative">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-graphite-500">{item.title}</p>
                        <p className="text-sm text-graphite-200 mt-2">{item.text}</p>
                      </div>
                    </div>
                  </TiltCard>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <Reveal as="div" delayMs={120}>
              <TiltCard className="rounded-[32px]">
                <div className="rounded-[32px] border border-graphite-800 bg-ink-900/70 p-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-cobalt-500/10 via-transparent to-tide-500/10" />
                  <div className="relative">
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
                </div>
              </TiltCard>
            </Reveal>

            <Reveal as="div" delayMs={180}>
              <TiltCard className="rounded-[28px]">
                <div className="rounded-[28px] border border-graphite-800 bg-ink-900/70 p-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/6 via-transparent to-transparent" />
                  <div className="relative">
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
              </TiltCard>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
