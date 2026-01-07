'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowUpRight, ShieldCheck, Sparkles, Workflow, LucideIcon } from 'lucide-react';
import { useThemeLanguage } from '@/contexts/ThemeLanguageContext';
import { TRANSLATIONS } from '@/constants';

interface HeroProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  ctaPrimary?: string;
  ctaSecondary?: string;
  highlights?: { title: string; text: string; icon?: any }[];
  industries?: string[];
  industriesLabel?: string;
  profileCards?: { label: string; value: string }[];
}

const Hero: React.FC<HeroProps> = ({
  badge,
  title,
  subtitle,
  ctaPrimary,
  ctaSecondary,
  highlights,
  industries,
  industriesLabel,
  profileCards
}) => {
  const { language } = useThemeLanguage();
  const t = TRANSLATIONS[language];

  // Fallbacks to generic translations if props are not provided
  const content = {
    badge: badge || t.hero.badge,
    title: title || t.hero.title,
    subtitle: subtitle || t.hero.subtitle,
    ctaPrimary: ctaPrimary || t.hero.ctaPrimary,
    ctaSecondary: ctaSecondary || t.hero.ctaSecondary,
    highlights: highlights || [
      { icon: ShieldCheck, ...t.hero.highlights[0] },
      { icon: Workflow, ...t.hero.highlights[1] },
      { icon: Sparkles, ...t.hero.highlights[2] },
    ],
    industries: industries || t.hero.industries,
    industriesLabel: industriesLabel || t.hero.industriesLabel,
    profileCards: profileCards || t.hero.profileCards,
  };

  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40">
      <div className="absolute inset-0 noise-bg" />
      <div className="absolute inset-0 grid-fade opacity-70" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-graphite-800 bg-ink-900/70 px-4 py-2 text-xs text-graphite-300">
              <span className="h-2 w-2 rounded-full bg-tide-400 animate-pulse" />
              {content.badge}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white leading-tight">
              {content.title}
            </h1>

            <p className="text-lg text-graphite-300 leading-relaxed max-w-xl">
              {content.subtitle}
            </p>

            <div className="flex flex-wrap gap-4">
              <a href="/agendar" className="primary-cta" data-analytics-label="hero-agendar">
                {content.ctaPrimary} <ArrowUpRight size={16} />
              </a>
              <a href="/portfolio" className="secondary-cta" data-analytics-label="hero-portfolio">
                {content.ctaSecondary}
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              {content.highlights.map((item, idx) => {
                const Icon = item.icon || ShieldCheck;
                return (
                  <div key={idx} className="glass-panel rounded-2xl p-4">
                    <Icon className="text-tide-300 mb-3" size={20} />
                    <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                    <p className="text-xs text-graphite-400 mt-1">{item.text}</p>
                  </div>
                );
              })}
            </div>

            <div className="pt-6 border-t border-graphite-800/70">
              <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">{content.industriesLabel}</p>
              <div className="mt-4 flex flex-wrap gap-6 text-sm text-graphite-400">
                {content.industries.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-10 -right-8 h-64 w-64 rounded-full bg-cobalt-500/20 blur-[120px]" />
            <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-tide-500/20 blur-[120px]" />

            <div className="relative rounded-[32px] border border-graphite-800/70 bg-ink-900/60 p-6 shadow-2xl">
              <div className="rounded-[24px] overflow-hidden border border-graphite-800">
                <Image
                  src="/erilson.jpg"
                  alt="Erilson Araujo"
                  width={640}
                  height={720}
                  className="h-[420px] w-full object-cover"
                  priority
                />
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4">
                {content.profileCards.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-graphite-800 bg-ink-950/70 p-4">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-graphite-500">{item.label}</p>
                    <p className="text-sm text-graphite-200 mt-2">{item.value}</p>
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

export default Hero;
