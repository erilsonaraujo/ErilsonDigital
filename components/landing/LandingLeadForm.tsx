'use client';

import React, { useMemo, useState } from 'react';
import { Send, ShieldCheck } from 'lucide-react';
import { getRecaptchaToken } from '@/lib/recaptchaClient';
import { trackEvent } from '@/components/AnalyticsTracker';

type LandingLeadFormProps = {
  title: string;
  subtitle: string;
  source: string;
  defaultProjectType: string;
};

const LandingLeadForm: React.FC<LandingLeadFormProps> = ({ title, subtitle, source, defaultProjectType }) => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    city: '',
    goal: '',
    budget: '',
  });

  const message = useMemo(() => {
    const parts = [
      formState.city ? `Cidade: ${formState.city}` : null,
      formState.goal ? `Objetivo: ${formState.goal}` : null,
      formState.budget ? `Orçamento: ${formState.budget}` : null,
    ].filter(Boolean);
    return parts.length ? parts.join('\n') : '';
  }, [formState.budget, formState.city, formState.goal]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus('sending');
    try {
      const recaptchaToken = await getRecaptchaToken('landing_lead');
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          phone: formState.phone,
          company: formState.company,
          projectType: defaultProjectType,
          budget: formState.budget,
          timeline: 'A combinar',
          message,
          source,
          recaptchaToken,
        }),
      });
      if (!res.ok) throw new Error('failed');
      trackEvent('landing_lead_submitted', { source, projectType: defaultProjectType });
      setStatus('success');
      setFormState({ name: '', email: '', phone: '', company: '', city: '', goal: '', budget: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="rounded-[28px] border border-graphite-800 bg-ink-900/70 p-6 md:p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent" />
      <div className="relative">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">Próximo passo</p>
            <h3 className="mt-3 text-2xl md:text-3xl font-semibold text-white">{title}</h3>
            <p className="mt-3 text-sm text-graphite-300">{subtitle}</p>
          </div>
          <div className="hidden md:flex items-center gap-2 rounded-full border border-graphite-800 bg-ink-950/70 px-4 py-2 text-xs text-graphite-300">
            <ShieldCheck size={14} className="text-tide-300" />
            LGPD + segurança
          </div>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-graphite-500">Nome</label>
              <input
                required
                value={formState.name}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                className="mt-2 w-full rounded-xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white placeholder:text-graphite-500 focus:border-cobalt-400 focus:outline-none focus:ring-4 focus:ring-cobalt-500/10"
                placeholder="Seu nome"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-graphite-500">E-mail</label>
              <input
                type="email"
                required
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                className="mt-2 w-full rounded-xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white placeholder:text-graphite-500 focus:border-cobalt-400 focus:outline-none focus:ring-4 focus:ring-cobalt-500/10"
                placeholder="voce@clinica.com.br"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-graphite-500">WhatsApp</label>
              <input
                value={formState.phone}
                onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                className="mt-2 w-full rounded-xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white placeholder:text-graphite-500 focus:border-cobalt-400 focus:outline-none focus:ring-4 focus:ring-cobalt-500/10"
                placeholder="+55 84 9xxxx-xxxx"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-graphite-500">Clínica</label>
              <input
                value={formState.company}
                onChange={(e) => setFormState({ ...formState, company: e.target.value })}
                className="mt-2 w-full rounded-xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white placeholder:text-graphite-500 focus:border-cobalt-400 focus:outline-none focus:ring-4 focus:ring-cobalt-500/10"
                placeholder="Nome da clínica (opcional)"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-graphite-500">Cidade</label>
              <input
                value={formState.city}
                onChange={(e) => setFormState({ ...formState, city: e.target.value })}
                className="mt-2 w-full rounded-xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white placeholder:text-graphite-500 focus:border-cobalt-400 focus:outline-none focus:ring-4 focus:ring-cobalt-500/10"
                placeholder="Natal/RN"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs uppercase tracking-[0.3em] text-graphite-500">Objetivo</label>
              <input
                value={formState.goal}
                onChange={(e) => setFormState({ ...formState, goal: e.target.value })}
                className="mt-2 w-full rounded-xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white placeholder:text-graphite-500 focus:border-cobalt-400 focus:outline-none focus:ring-4 focus:ring-cobalt-500/10"
                placeholder="Ex.: reduzir no-show, qualificar leads, aumentar agendamentos"
              />
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-graphite-500">Orçamento (opcional)</label>
            <input
              value={formState.budget}
              onChange={(e) => setFormState({ ...formState, budget: e.target.value })}
              className="mt-2 w-full rounded-xl border border-graphite-800 bg-ink-950/70 px-4 py-3 text-sm text-white placeholder:text-graphite-500 focus:border-cobalt-400 focus:outline-none focus:ring-4 focus:ring-cobalt-500/10"
              placeholder="Ex.: R$ 10–30k"
            />
          </div>

          {status === 'error' && (
            <p className="text-sm text-ember-400">Nao foi possivel enviar. Tente novamente.</p>
          )}
          {status === 'success' && (
            <p className="text-sm text-tide-300">Recebido. Vou te retornar em ate 24h com o proximo passo.</p>
          )}

          <button type="submit" disabled={status === 'sending'} className="primary-cta w-full justify-center">
            {status === 'sending' ? 'Enviando...' : 'Quero um plano para minha clinica'}
            <Send size={16} />
          </button>

          <p className="text-xs text-graphite-500">
            Ao enviar, voce concorda com o contato para este atendimento. Voce pode solicitar a exclusao dos seus dados a qualquer momento.
          </p>
        </form>
      </div>
    </div>
  );
};

export default LandingLeadForm;

