'use client';

import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { WHATSAPP_NUMBER } from '@/constants';

const Contact: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    budget: '',
    timeline: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formState, source: 'site-premium' }),
      });

      if (!response.ok) {
        throw new Error('Failed');
      }

      setStatus('success');
      setFormState({
        name: '',
        email: '',
        phone: '',
        company: '',
        projectType: '',
        budget: '',
        timeline: '',
        message: '',
      });
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-24 bg-ink-950 relative">
      <div className="absolute inset-0 noise-bg opacity-70" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10">
          <div className="rounded-[32px] border border-graphite-800 bg-ink-900/80 p-8 md:p-10">
            <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">Contato estrategico</p>
            <h2 className="text-3xl font-semibold text-white mt-4">Vamos desenhar o proximo salto da sua empresa.</h2>
            <p className="text-graphite-300 mt-4">
              Responda o briefing para avaliarmos alinhamento tecnico e escopo. Voce recebe retorno com estimativa macro e proximos passos.
            </p>

            <div className="mt-8 space-y-4 text-sm text-graphite-200">
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-tide-300" />
                +55 84 99434-9355
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-tide-300" />
                joseerilsonaraujo@gmail.com
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-tide-300" />
                Natal, RN - Brasil (Remoto / Hibrido)
              </div>
            </div>

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-full border border-graphite-700 px-5 py-2 text-sm text-graphite-200 hover:border-graphite-500"
            >
              Conversar no WhatsApp
            </a>
          </div>

          <div className="rounded-[32px] border border-graphite-800 bg-ink-900/80 p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs uppercase tracking-[0.3em] text-graphite-500">Nome</label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-graphite-800 bg-ink-950/80 px-4 py-3 text-sm text-white focus:border-cobalt-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.3em] text-graphite-500">Email</label>
                  <input
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-graphite-800 bg-ink-950/80 px-4 py-3 text-sm text-white focus:border-cobalt-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs uppercase tracking-[0.3em] text-graphite-500">Telefone</label>
                  <input
                    type="tel"
                    value={formState.phone}
                    onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-graphite-800 bg-ink-950/80 px-4 py-3 text-sm text-white focus:border-cobalt-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.3em] text-graphite-500">Empresa</label>
                  <input
                    type="text"
                    value={formState.company}
                    onChange={(e) => setFormState({ ...formState, company: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-graphite-800 bg-ink-950/80 px-4 py-3 text-sm text-white focus:border-cobalt-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-xs uppercase tracking-[0.3em] text-graphite-500">Tipo de projeto</label>
                  <select
                    required
                    value={formState.projectType}
                    onChange={(e) => setFormState({ ...formState, projectType: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-graphite-800 bg-ink-950/80 px-4 py-3 text-sm text-white focus:border-cobalt-400 focus:outline-none"
                  >
                    <option value="">Selecione</option>
                    <option value="produto-digital">Produto digital</option>
                    <option value="ia-automacao">IA e automacao</option>
                    <option value="backend">Backend enterprise</option>
                    <option value="dados">Analytics e dados</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.3em] text-graphite-500">Budget</label>
                  <select
                    required
                    value={formState.budget}
                    onChange={(e) => setFormState({ ...formState, budget: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-graphite-800 bg-ink-950/80 px-4 py-3 text-sm text-white focus:border-cobalt-400 focus:outline-none"
                  >
                    <option value="">Selecione</option>
                    <option value="50-100">R$ 50k - 100k</option>
                    <option value="100-200">R$ 100k - 200k</option>
                    <option value="200-500">R$ 200k - 500k</option>
                    <option value="500+">R$ 500k+</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.3em] text-graphite-500">Timeline</label>
                  <select
                    required
                    value={formState.timeline}
                    onChange={(e) => setFormState({ ...formState, timeline: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-graphite-800 bg-ink-950/80 px-4 py-3 text-sm text-white focus:border-cobalt-400 focus:outline-none"
                  >
                    <option value="">Selecione</option>
                    <option value="30d">30-60 dias</option>
                    <option value="60d">60-90 dias</option>
                    <option value="90d+">90+ dias</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-graphite-500">Contexto do projeto</label>
                <textarea
                  required
                  rows={4}
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-graphite-800 bg-ink-950/80 px-4 py-3 text-sm text-white focus:border-cobalt-400 focus:outline-none"
                />
              </div>

              {status === 'error' && (
                <p className="text-sm text-ember-400">Nao foi possivel enviar. Tente novamente.</p>
              )}
              {status === 'success' && (
                <p className="text-sm text-tide-300">Briefing enviado. Em breve voce recebe retorno.</p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="primary-cta w-full justify-center"
              >
                {status === 'sending' ? 'Enviando...' : 'Enviar briefing'}
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
