'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowUpRight, ShieldCheck, Sparkles, Workflow } from 'lucide-react';
import { useThemeLanguage } from '@/contexts/ThemeLanguageContext';
import { TRANSLATIONS } from '@/constants';
import Reveal from '@/components/ui/Reveal';
import Parallax from '@/components/ui/Parallax';
import TiltCard from '@/components/ui/TiltCard';

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
    <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24">
      <div className="absolute inset-0 noise-bg opacity-60" />
      <div className="absolute inset-0 grid-fade opacity-50" />
      <Parallax className="absolute -top-20 -right-20 h-96 w-96 rounded-full bg-cobalt-500/15 blur-[110px]" speed={0.25} />
      <Parallax className="absolute bottom-0 -left-24 h-[30rem] w-[30rem] rounded-full bg-tide-500/12 blur-[120px]" speed={0.18} offset={40} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
          <div className="space-y-8">
            <Reveal as="div">
              <div className="inline-flex items-center gap-2 rounded-full border border-graphite-800 bg-ink-900/70 px-4 py-2 text-xs text-graphite-300">
                <span className="h-2 w-2 rounded-full bg-tide-400 animate-pulse" />
                {content.badge}
              </div>
            </Reveal>

            <Reveal as="h1" delayMs={60} y={18} className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white leading-tight">
              <span className="block">
                {content.title}
              </span>
              <span className="mt-4 block text-base sm:text-lg font-medium text-graphite-400 max-w-xl">
                {content.subtitle}
              </span>
            </Reveal>

            <Reveal as="div" delayMs={120} className="flex flex-wrap gap-4">
              <a href="/agendar" className="primary-cta" data-analytics-label="hero-agendar">
                {content.ctaPrimary} <ArrowUpRight size={16} />
              </a>
              <a href="/portfolio" className="secondary-cta" data-analytics-label="hero-portfolio">
                {content.ctaSecondary}
              </a>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              {content.highlights.map((item, idx) => {
                const Icon = item.icon || ShieldCheck;
                return (
                  <Reveal key={idx} as="div" delayMs={160 + idx * 80}>
                    <TiltCard className="glass-panel relative rounded-2xl p-4 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent" />
                      <div className="relative">
                        <Icon className="text-tide-300 mb-3" size={20} />
                        <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                        <p className="text-xs text-graphite-400 mt-1">{item.text}</p>
                      </div>
                    </TiltCard>
                  </Reveal>
                );
              })}
            </div>

            <Reveal as="div" delayMs={420} className="group pt-6 border-t border-graphite-800/70">
              <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">{content.industriesLabel}</p>
              <div className="mt-4 flex flex-wrap gap-6 text-sm text-graphite-400">
                {content.industries.map((item) => (
                  <span key={item} className="relative after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-cobalt-400/50 after:transition-transform after:duration-500 group-hover:after:scale-x-100">
                    {item}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="relative">
            <Reveal as="div" delayMs={140} y={20} className="relative">
              <TiltCard className="relative rounded-[32px] border border-graphite-800/70 bg-ink-900/60 p-6 shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cobalt-500/10 via-transparent to-tide-500/10" />
                <div className="relative">
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
              </TiltCard>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
