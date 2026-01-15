'use client';

import React from 'react';
import TiltCard from '@/components/ui/TiltCard';
import Reveal from '@/components/ui/Reveal';

const accents = {
  cobalt: {
    glow: 'bg-cobalt-500/14',
    ring: 'ring-cobalt-500/20',
    line: 'bg-cobalt-400/70',
    chip: 'border-cobalt-500/25 bg-cobalt-500/10 text-cobalt-200',
  },
  tide: {
    glow: 'bg-tide-500/14',
    ring: 'ring-tide-500/20',
    line: 'bg-tide-400/70',
    chip: 'border-tide-500/25 bg-tide-500/10 text-tide-200',
  },
  ember: {
    glow: 'bg-ember-500/12',
    ring: 'ring-ember-500/20',
    line: 'bg-ember-400/70',
    chip: 'border-ember-500/25 bg-ember-500/10 text-ember-200',
  },
} as const;

type LandingVisualProps = {
  accent?: keyof typeof accents;
};

const LandingVisual: React.FC<LandingVisualProps> = ({ accent = 'cobalt' }) => {
  const a = accents[accent];

  return (
    <div className="relative">
      <div className={`absolute -top-12 -right-10 h-72 w-72 rounded-full ${a.glow} blur-[120px]`} />
      <div className={`absolute bottom-0 left-0 h-80 w-80 rounded-full ${a.glow} blur-[120px]`} />

      <Reveal as="div" delayMs={120} y={18}>
        <TiltCard className={`relative rounded-[34px] border border-graphite-800/70 bg-ink-900/60 p-6 shadow-2xl ring-1 ${a.ring} overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent" />
          <div className="relative space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-2 w-40 rounded-full bg-white/10" />
                <div className="h-2 w-28 rounded-full bg-white/6" />
              </div>
              <span className={`rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.25em] ${a.chip}`}>
                conversao
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Leads qualificados', value: '+38%' },
                { label: 'No-show', value: '-27%' },
                { label: 'Tempo de resposta', value: '-54%' },
                { label: 'Agenda', value: '+2.1x' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-graphite-800 bg-ink-950/70 p-4">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-graphite-500">{item.label}</p>
                  <p className="mt-2 text-xl font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-graphite-800 bg-ink-950/60 p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">Pipeline</p>
                <span className="text-xs text-graphite-400">sem perda no WhatsApp</span>
              </div>
              <div className="mt-4 space-y-3">
                {[
                  { label: 'Novo lead', w: 'w-11/12' },
                  { label: 'Triagem', w: 'w-9/12' },
                  { label: 'Agendado', w: 'w-7/12' },
                  { label: 'Compareceu', w: 'w-6/12' },
                ].map((row) => (
                  <div key={row.label} className="flex items-center gap-3">
                    <span className="w-24 text-xs text-graphite-400">{row.label}</span>
                    <div className="h-2 flex-1 rounded-full bg-white/6 overflow-hidden">
                      <div className={`h-2 ${row.w} ${a.line}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TiltCard>
      </Reveal>
    </div>
  );
};

export default LandingVisual;

