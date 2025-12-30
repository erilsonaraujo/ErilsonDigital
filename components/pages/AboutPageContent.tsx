'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { TRANSLATIONS } from '@/constants';
import { useThemeLanguage } from '@/contexts/ThemeLanguageContext';

const AboutPageContent: React.FC = () => {
  const { language } = useThemeLanguage();
  const t = TRANSLATIONS[language];

  return (
    <>
      <section className="pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-14 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">{t.about.label}</p>
            <h1 className="text-4xl md:text-5xl font-semibold text-graphite-900 mt-4">{t.about.headline}</h1>
            <p className="text-lg text-graphite-300 mt-6">{t.about.description}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/contato" className="primary-cta">
                {t.about.ctaPrimary} <ArrowUpRight size={16} />
              </Link>
              <Link href="/agendar" className="secondary-cta">
                {t.about.ctaSecondary}
              </Link>
            </div>
          </div>

          <div className="rounded-[32px] border border-graphite-800 bg-ink-900/70 p-6">
            <div className="rounded-[24px] overflow-hidden border border-graphite-800">
              <Image
                src="/erilson.jpg"
                alt="Erilson Araujo"
                width={600}
                height={720}
                className="h-[420px] w-full object-cover"
                priority
              />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-graphite-300">
              {t.about.highlights.slice(0, 2).map((item) => (
                <div key={item.title} className="rounded-2xl border border-graphite-800 bg-ink-950/70 p-4">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-graphite-500">{item.title}</p>
                  <p className="mt-2 text-graphite-200">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-graphite-800">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.about.highlights.map((item) => (
            <div key={item.title} className="rounded-[24px] border border-graphite-800 bg-ink-900/70 p-6">
              <h3 className="text-lg font-semibold text-graphite-900">{item.title}</h3>
              <p className="text-sm text-graphite-300 mt-2">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20">
        <div className="rounded-[32px] border border-graphite-800 bg-ink-900/80 p-10 md:p-14">
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">{t.about.label}</p>
              <h2 className="text-3xl md:text-4xl font-semibold text-graphite-900 mt-4">{t.about.headline}</h2>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="/contato" className="primary-cta">
                {t.about.ctaPrimary} <ArrowUpRight size={16} />
              </Link>
              <Link href="/portfolio" className="secondary-cta">
                {t.projects.viewProject}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPageContent;
