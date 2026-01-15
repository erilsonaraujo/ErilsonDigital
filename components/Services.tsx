'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SERVICES, SERVICES_I18N, SERVICE_DETAILS_BY_LANG, TRANSLATIONS } from '@/constants';
import { useThemeLanguage } from '@/contexts/ThemeLanguageContext';
import Reveal from '@/components/ui/Reveal';
import Parallax from '@/components/ui/Parallax';
import TiltCard from '@/components/ui/TiltCard';

const Services: React.FC = () => {
  const { language } = useThemeLanguage();
  const t = TRANSLATIONS[language];
  const serviceCopy = SERVICES_I18N[language];
  const details = SERVICE_DETAILS_BY_LANG[language];

  const cards = SERVICES.map((service) => {
    const copy = serviceCopy.find((item) => item.id === service.id);
    const detail = details.find((item) => item.id === service.id);
    return {
      ...service,
      title: copy?.title || service.title,
      description: copy?.description || service.description,
      image: detail?.image,
      summary: detail?.summary,
    };
  });

  return (
    <section id="services" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 noise-bg opacity-50" />
      <div className="absolute inset-0 grid-fade opacity-30" />
      <Parallax className="absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-ember-500/10 blur-[110px]" speed={0.16} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[0.45fr_0.55fr] gap-12 items-end mb-16">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">{t.services.note}</p>
            <Reveal as="h2" className="section-title mt-4">{t.services.title}</Reveal>
          </div>
          <Reveal as="p" delayMs={80} className="section-lead">{t.services.subtitle}</Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cards.map((service, index) => (
            <Reveal key={service.id} as="div" delayMs={80 + index * 70}>
              <TiltCard className="rounded-[28px]">
                <Link
                  href={`/servicos/${service.id}`}
                  className="group block rounded-[28px] border border-graphite-800 bg-ink-900/70 overflow-hidden shadow-xl hover:shadow-2xl transition-transform duration-500 hover:-translate-y-1"
                >
                  <div className="relative h-48">
                    {service.image && (
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(min-width: 1024px) 50vw, 100vw"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/30 to-transparent" />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(600px_240px_at_30%_20%,rgba(47,85,255,0.25),transparent_60%)]" />
                    <div className="absolute bottom-4 left-5">
                      <div className="flex items-center gap-2 text-xs text-graphite-200">
                        <service.icon size={16} className="text-tide-300" />
                        {service.title}
                      </div>
                    </div>
                  </div>
                  <div className="p-6 space-y-3">
                    <h3 className="text-xl font-semibold text-white">{service.title}</h3>
                    <p className="text-sm text-graphite-300">{service.description}</p>
                    {service.summary && (
                      <p className="text-xs text-graphite-500 uppercase tracking-[0.25em]">{service.summary}</p>
                    )}
                    <span className="inline-flex items-center gap-2 text-sm text-tide-300">
                      {t.services.cta}
                      <span className="h-px w-6 bg-tide-400/60 transition-all duration-500 group-hover:w-10" />
                    </span>
                  </div>
                </Link>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
