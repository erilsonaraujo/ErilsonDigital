'use client';

import React from 'react';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import Reveal from '@/components/ui/Reveal';
import TiltCard from '@/components/ui/TiltCard';
import Parallax from '@/components/ui/Parallax';
import LandingVisual from './LandingVisual';
import LandingLeadForm from './LandingLeadForm';
import StickyMobileCta from './StickyMobileCta';
import type { LandingConfig } from './types';

const accentMap = {
  cobalt: {
    chip: 'border-cobalt-500/25 bg-cobalt-500/10 text-cobalt-200',
    line: 'bg-cobalt-500/70',
  },
  tide: {
    chip: 'border-tide-500/25 bg-tide-500/10 text-tide-200',
    line: 'bg-tide-500/70',
  },
  ember: {
    chip: 'border-ember-500/25 bg-ember-500/10 text-ember-200',
    line: 'bg-ember-500/70',
  },
} as const;

const LandingTemplate: React.FC<{ config: LandingConfig }> = ({ config }) => {
  const a = accentMap[config.accent];

  return (
    <main className="min-h-screen selection:bg-cobalt-500/20">
      <StickyMobileCta
        primaryLabel={config.primaryCta.label}
        primaryHref={config.primaryCta.href}
        secondaryLabel={config.secondaryCta.label}
        secondaryHref={config.secondaryCta.href}
        hideWhenNearId="form"
      />

      <section className="relative overflow-hidden pt-16 pb-14 lg:pt-24">
        <div className="absolute inset-0 noise-bg opacity-55" />
        <div className="absolute inset-0 grid-fade opacity-35" />
        <Parallax className="absolute -top-28 right-0 h-[30rem] w-[30rem] rounded-full bg-cobalt-500/10 blur-[130px]" speed={0.18} />
        <Parallax className="absolute bottom-0 -left-24 h-[34rem] w-[34rem] rounded-full bg-tide-500/8 blur-[140px]" speed={0.12} offset={50} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-14 items-center">
            <div className="space-y-8">
              <Reveal as="div">
                <span className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs ${a.chip}`}>
                  <span className={`h-2 w-2 rounded-full ${a.line}`} />
                  {config.badge}
                </span>
              </Reveal>

              <Reveal as="h1" delayMs={70} y={18} className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white leading-[1.05]">
                {config.headline}
              </Reveal>
              <Reveal as="p" delayMs={120} className="text-base sm:text-lg text-graphite-300 leading-relaxed max-w-2xl">
                {config.subheadline}
              </Reveal>

              <Reveal as="div" delayMs={160} className="flex flex-wrap gap-4">
                <a href={config.primaryCta.href} className="primary-cta" data-analytics-label={`${config.slug}-hero-primary`}>
                  {config.primaryCta.label} <ArrowUpRight size={16} />
                </a>
                <a href={config.secondaryCta.href} className="secondary-cta" data-analytics-label={`${config.slug}-hero-secondary`}>
                  {config.secondaryCta.label}
                </a>
              </Reveal>

              <Reveal as="div" delayMs={220} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {config.metrics.map((metric) => (
                  <TiltCard key={metric.label} className="rounded-2xl">
                    <div className="rounded-2xl border border-graphite-800 bg-ink-900/70 p-4">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-graphite-500">{metric.label}</p>
                      <p className="mt-2 text-lg font-semibold text-white">{metric.value}</p>
                    </div>
                  </TiltCard>
                ))}
              </Reveal>

              <Reveal as="div" delayMs={300} className="flex flex-wrap gap-2">
                {config.proofChips.map((chip) => (
                  <span key={chip} className="rounded-full border border-graphite-800 bg-ink-950/60 px-3 py-1 text-[11px] text-graphite-300">
                    {chip}
                  </span>
                ))}
              </Reveal>
            </div>

            {config.heroImage ? (
              <Reveal as="div" delayMs={120} y={18}>
                <TiltCard className="rounded-[34px]">
                  <div className="relative rounded-[34px] border border-graphite-800/70 bg-ink-900/60 shadow-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950/95 via-ink-950/55 to-transparent" />
                    <div className="absolute inset-0 bg-[radial-gradient(900px_380px_at_50%_70%,rgba(0,0,0,0.45),transparent_60%)]" />
                    <Image
                      src={config.heroImage.src}
                      alt={config.heroImage.alt}
                      width={1200}
                      height={1400}
                      className="h-[520px] w-full object-cover"
                      priority
                    />
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <div className="rounded-3xl border border-graphite-800 bg-ink-950/55 backdrop-blur-xl p-3 shadow-[0_24px_80px_-42px_rgba(0,0,0,0.85)]">
                        <div className="grid grid-cols-2 gap-3">
                          {config.metrics.slice(0, 4).map((metric) => (
                            <div key={metric.label} className="rounded-2xl border border-graphite-800/90 bg-ink-950/85 p-4">
                              <p className="text-[10px] uppercase tracking-[0.3em] keep-white opacity-80">{metric.label}</p>
                              <p className="mt-2 text-base font-semibold keep-white drop-shadow-[0_10px_18px_rgba(0,0,0,0.8)]">
                                {metric.value}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            ) : (
              <LandingVisual accent={config.accent} />
            )}
          </div>
        </div>
      </section>

      <section id="dor" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[0.55fr_0.45fr] gap-12 items-start">
            <div>
              <Reveal as="h2" className="section-title">{config.painTitle}</Reveal>
              <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                {config.painCards.map((card, index) => (
                  <Reveal key={card.title} as="div" delayMs={80 + index * 70}>
                    <TiltCard className="rounded-[24px]">
                      <div className="rounded-[24px] border border-graphite-800 bg-ink-900/70 p-6 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/7 via-transparent to-transparent" />
                        <div className="relative">
                          {card.eyebrow && <p className="text-[10px] uppercase tracking-[0.3em] text-graphite-500">{card.eyebrow}</p>}
                          <h3 className="mt-2 text-lg font-semibold text-white">{card.title}</h3>
                          <p className="mt-3 text-sm text-graphite-300">{card.description}</p>
                        </div>
                      </div>
                    </TiltCard>
                  </Reveal>
                ))}
              </div>
            </div>

            <Reveal as="div" delayMs={120}>
              <div className="rounded-[28px] border border-graphite-800 bg-ink-900/70 p-7">
                <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">O que muda</p>
                <div className="mt-5 space-y-3">
                  {[
                    'Uma esteira clara do anuncio ao agendamento',
                    'Triagem antes da secretaria (menos curiosos)',
                    'Follow-up e reativacao com automacao',
                    'Dados de conversao para decidir com seguranca',
                  ].map((text) => (
                    <div key={text} className="flex items-start gap-3">
                      <CheckCircle2 size={18} className="mt-0.5 text-tide-300" />
                      <p className="text-sm text-graphite-300">{text}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-7 pt-6 border-t border-graphite-800 flex flex-col gap-3">
                  <a href={config.primaryCta.href} className="primary-cta justify-center" data-analytics-label={`${config.slug}-pain-primary`}>
                    {config.primaryCta.label} <ArrowUpRight size={16} />
                  </a>
                  <p className="text-xs text-graphite-500 text-center">Sem compromisso. Diagnostico rapido e direto.</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {config.procedureSection && (
        <section id="procedimentos" className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 noise-bg opacity-40" />
          <Parallax className="absolute -top-24 right-8 h-80 w-80 rounded-full bg-cobalt-500/10 blur-[120px]" speed={0.16} />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal as="h2" className="section-title">{config.procedureSection.title}</Reveal>
            <Reveal as="p" delayMs={80} className="section-lead mt-5 max-w-2xl">{config.procedureSection.subtitle}</Reveal>

            <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {config.procedureSection.items.map((item, index) => (
                <Reveal key={item.slug} as="div" delayMs={100 + index * 70}>
                  <TiltCard className="rounded-[26px]">
                    <a
                      href={`/campanhas/${config.slug}/${item.slug}`}
                      className="block rounded-[26px] border border-graphite-800 bg-ink-900/70 overflow-hidden hover:border-graphite-600 transition-colors"
                      data-analytics-label={`${config.slug}-procedure-${item.slug}`}
                    >
                      {item.image && (
                        <div className="relative h-44">
                          <Image
                            src={item.image.src}
                            alt={item.image.alt}
                            width={1200}
                            height={800}
                            className="h-44 w-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/20 to-transparent" />
                        </div>
                      )}
                      <div className="p-6">
                        {item.ctaLabel && (
                          <p className="text-[10px] uppercase tracking-[0.3em] text-graphite-500">{item.ctaLabel}</p>
                        )}
                        <h3 className="mt-2 text-lg font-semibold text-white">{item.title}</h3>
                        <p className="mt-3 text-sm text-graphite-300">{item.description}</p>
                        <ul className="mt-5 space-y-2">
                          {item.highlights.slice(0, 3).map((h) => (
                            <li key={h} className="flex items-start gap-3 text-sm text-graphite-300">
                              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-tide-400/80" />
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-6 inline-flex items-center gap-2 text-sm text-tide-300">
                          Ver pagina do procedimento <ArrowUpRight size={16} />
                        </div>
                      </div>
                    </a>
                  </TiltCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {config.comparisonSection && (
        <section id="comparativo" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal as="h2" className="section-title">{config.comparisonSection.title}</Reveal>
            <Reveal as="p" delayMs={80} className="section-lead mt-5 max-w-2xl">{config.comparisonSection.subtitle}</Reveal>

            <div className="mt-12 overflow-hidden rounded-[26px] border border-graphite-800 bg-ink-900/70">
              <div className="grid grid-cols-3 border-b border-graphite-800">
                <div className="p-5 text-xs uppercase tracking-[0.3em] text-graphite-500">{config.comparisonSection.leftLabel}</div>
                <div className="p-5 text-xs uppercase tracking-[0.3em] text-graphite-500 border-x border-graphite-800">{config.comparisonSection.middleLabel}</div>
                <div className="p-5 text-xs uppercase tracking-[0.3em] text-white">{config.comparisonSection.rightLabel}</div>
              </div>
              <div className="divide-y divide-graphite-800">
                {config.comparisonSection.rows.map((row) => (
                  <div key={row.topic} className="grid grid-cols-1 lg:grid-cols-3">
                    <div className="p-5">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-graphite-500">{row.topic}</p>
                      <p className="mt-2 text-sm text-graphite-300">{row.left}</p>
                    </div>
                    <div className="p-5 border-y border-graphite-800 lg:border-y-0 lg:border-x">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-graphite-500">{row.topic}</p>
                      <p className="mt-2 text-sm text-graphite-300">{row.middle}</p>
                    </div>
                    <div className="p-5">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-graphite-500">{row.topic}</p>
                      <p className="mt-2 text-sm text-graphite-200">{row.right}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section id="oferta" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 noise-bg opacity-45" />
        <Parallax className="absolute -top-24 left-1/3 h-80 w-80 rounded-full bg-ember-500/10 blur-[120px]" speed={0.16} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[0.55fr_0.45fr] gap-12 items-end">
            <div>
              <Reveal as="h2" className="section-title">{config.offerTitle}</Reveal>
              <Reveal as="p" delayMs={80} className="section-lead mt-5 max-w-2xl">{config.offerSubtitle}</Reveal>
            </div>
            <Reveal as="div" delayMs={120} className="rounded-[24px] border border-graphite-800 bg-ink-900/60 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">Entrega com governanca</p>
              <p className="mt-3 text-sm text-graphite-300">
                Sem gambiarra: eventos de conversao, padrao visual premium, performance e base legal/privacidade alinhadas ao seu modelo.
              </p>
            </Reveal>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {config.offerCards.map((card, index) => (
              <Reveal key={card.title} as="div" delayMs={100 + index * 60}>
                <TiltCard className="rounded-[24px]">
                  <div className="rounded-[24px] border border-graphite-800 bg-ink-900/70 p-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/7 via-transparent to-transparent" />
                    <div className="relative">
                      {card.eyebrow && <p className="text-[10px] uppercase tracking-[0.3em] text-graphite-500">{card.eyebrow}</p>}
                      <h3 className="mt-2 text-lg font-semibold text-white">{card.title}</h3>
                      <p className="mt-3 text-sm text-graphite-300">{card.description}</p>
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="metodo" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal as="h2" className="section-title">{config.processTitle}</Reveal>
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-4 gap-6">
            {config.processSteps.map((step, index) => (
              <Reveal key={step.title} as="div" delayMs={80 + index * 70}>
                <TiltCard className="rounded-[24px]">
                  <div className="rounded-[24px] border border-graphite-800 bg-ink-900/70 p-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/7 via-transparent to-transparent" />
                    <div className="relative">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-graphite-500">Fase {index + 1}</p>
                      <h3 className="mt-2 text-lg font-semibold text-white">{step.title}</h3>
                      <p className="mt-3 text-sm text-graphite-300">{step.description}</p>
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 grid-fade opacity-25" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[0.55fr_0.45fr] gap-12 items-start">
            <div>
              <Reveal as="h2" className="section-title">{config.faqTitle}</Reveal>
              <div className="mt-10 space-y-4">
                {config.faqs.map((faq, index) => (
                  <Reveal key={faq.question} as="div" delayMs={60 + index * 60}>
                    <details className="group rounded-[22px] border border-graphite-800 bg-ink-900/70 p-5">
                      <summary className="cursor-pointer list-none text-sm font-semibold text-white flex items-center justify-between gap-4">
                        {faq.question}
                        <span className="text-graphite-400 group-open:rotate-45 transition-transform">+</span>
                      </summary>
                      <p className="mt-3 text-sm text-graphite-300 leading-relaxed">{faq.answer}</p>
                    </details>
                  </Reveal>
                ))}
              </div>
            </div>

            <div id="form">
              <LandingLeadForm
                title={config.formTitle}
                subtitle={config.formSubtitle}
                source={config.formSource}
                defaultProjectType={config.pageTitle}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LandingTemplate;
