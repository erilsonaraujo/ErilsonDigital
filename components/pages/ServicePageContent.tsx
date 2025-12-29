'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { ServiceDetail, Language } from '@/types';
import { useThemeLanguage } from '@/contexts/ThemeLanguageContext';
import { TRANSLATIONS } from '@/constants';

interface ServicePageContentProps {
  detailsByLanguage: Record<Language, ServiceDetail>;
}

const ServicePageContent: React.FC<ServicePageContentProps> = ({ detailsByLanguage }) => {
  const { language } = useThemeLanguage();
  const t = TRANSLATIONS[language];
  const service = detailsByLanguage[language] || detailsByLanguage.pt;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-start">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">{t.services.note}</p>
        <h1 className="text-4xl md:text-5xl font-semibold text-white mt-4">{service.title}</h1>
        <p className="text-lg text-graphite-300 mt-6">{service.description}</p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/agendar" className="primary-cta">
            {t.hero.ctaPrimary} <ArrowUpRight size={16} />
          </Link>
          <Link href="/contato" className="secondary-cta">
            {t.contact.cta}
          </Link>
        </div>

        <div className="mt-10 rounded-[24px] border border-graphite-800 bg-ink-900/70 p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">{t.servicePage.outcomesLabel}</p>
          <ul className="mt-4 space-y-3 text-sm text-graphite-200">
            {service.outcomes.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-tide-300 mt-1" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-[32px] border border-graphite-800 bg-ink-900/70 p-6">
        <div className="rounded-[24px] overflow-hidden border border-graphite-800">
          <Image
            src={service.image}
            alt={service.title}
            width={600}
            height={520}
            className="h-64 w-full object-cover"
          />
        </div>
        <div className="mt-6 space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">{t.servicePage.deliverablesLabel}</p>
            <ul className="mt-3 space-y-2 text-sm text-graphite-200">
              {service.deliverables.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-cobalt-300 mt-1" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">{t.servicePage.timelineLabel}</p>
            <p className="text-sm text-graphite-200 mt-2">{service.timeline}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">{t.servicePage.stackLabel}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {service.stack.map((item) => (
                <span key={item} className="rounded-full border border-graphite-700 px-3 py-1 text-[11px] text-graphite-300">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">{t.servicePage.idealForLabel}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {service.suitableFor.map((item) => (
                <span key={item} className="rounded-full border border-graphite-700 px-3 py-1 text-[11px] text-graphite-300">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicePageContent;
