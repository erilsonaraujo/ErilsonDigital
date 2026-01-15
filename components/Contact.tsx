'use client';

import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { WHATSAPP_NUMBER, TRANSLATIONS } from '@/constants';
import { useThemeLanguage } from '@/contexts/ThemeLanguageContext';
import { trackEvent } from '@/components/AnalyticsTracker';
import { getRecaptchaToken } from '@/lib/recaptchaClient';
import Reveal from '@/components/ui/Reveal';
import Parallax from '@/components/ui/Parallax';
import TiltCard from '@/components/ui/TiltCard';

const Contact: React.FC = () => {
  const { language } = useThemeLanguage();
  const t = TRANSLATIONS[language];
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
      const recaptchaToken = await getRecaptchaToken('lead_submit');
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formState, source: 'site-premium', recaptchaToken }),
      });

      if (!response.ok) {
        throw new Error('Failed');
      }

      trackEvent('lead_submitted', { projectType: formState.projectType, budget: formState.budget });
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
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 noise-bg opacity-60" />
      <div className="absolute inset-0 grid-fade opacity-25" />
      <Parallax className="absolute -top-24 right-0 h-96 w-96 rounded-full bg-tide-500/10 blur-[120px]" speed={0.18} />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10">
          <Reveal as="div">
            <TiltCard className="rounded-[32px]">
              <div className="rounded-[32px] border border-graphite-800 bg-ink-900/80 p-8 md:p-10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/6 via-transparent to-transparent" />
                <div className="relative">
                  <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">{t.contact.title}</p>
                  <h2 className="text-3xl font-semibold text-white mt-4">{t.contact.subtitle}</h2>
                  <p className="text-graphite-300 mt-4">{t.contact.description}</p>

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
                      {t.contact.infoLocation}
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 inline-flex items-center justify-center gap-2 rounded-full border border-graphite-700 px-5 py-2 text-sm text-graphite-200 hover:border-graphite-500 hover:text-white transition-colors"
                  >
                    {t.contact.whatsapp}
                  </a>
                </div>
              </div>
            </TiltCard>
          </Reveal>

          <Reveal as="div" delayMs={80}>
            <TiltCard className="rounded-[32px]">
              <div className="rounded-[32px] border border-graphite-800 bg-ink-900/80 p-8 md:p-10 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(700px_380px_at_20%_20%,rgba(47,85,255,0.18),transparent_60%)]" />
                <form onSubmit={handleSubmit} className="relative space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs uppercase tracking-[0.3em] text-graphite-500">{t.contact.labels.name}</label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-graphite-800 bg-ink-950/80 px-4 py-3 text-sm text-white placeholder:text-graphite-500 focus:border-cobalt-400 focus:outline-none focus:ring-4 focus:ring-cobalt-500/10"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.3em] text-graphite-500">{t.contact.labels.email}</label>
                  <input
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-graphite-800 bg-ink-950/80 px-4 py-3 text-sm text-white placeholder:text-graphite-500 focus:border-cobalt-400 focus:outline-none focus:ring-4 focus:ring-cobalt-500/10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs uppercase tracking-[0.3em] text-graphite-500">{t.contact.labels.phone}</label>
                  <input
                    type="tel"
                    value={formState.phone}
                    onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-graphite-800 bg-ink-950/80 px-4 py-3 text-sm text-graphite-900 focus:border-cobalt-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.3em] text-graphite-500">{t.contact.labels.company}</label>
                  <input
                    type="text"
                    value={formState.company}
                    onChange={(e) => setFormState({ ...formState, company: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-graphite-800 bg-ink-950/80 px-4 py-3 text-sm text-white placeholder:text-graphite-500 focus:border-cobalt-400 focus:outline-none focus:ring-4 focus:ring-cobalt-500/10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-xs uppercase tracking-[0.3em] text-graphite-500">{t.contact.labels.projectType}</label>
                  <select
                    required
                    value={formState.projectType}
                    onChange={(e) => setFormState({ ...formState, projectType: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-graphite-800 bg-ink-950/80 px-4 py-3 text-sm text-white focus:border-cobalt-400 focus:outline-none focus:ring-4 focus:ring-cobalt-500/10"
                  >
                    <option value="">{t.contact.projectOptions[0]}</option>
                    <option value="Estetica">{t.contact.projectOptions[1]}</option>
                    <option value="Cirurgia/Dermato">{t.contact.projectOptions[2]}</option>
                    <option value="Odonto">{t.contact.projectOptions[3]}</option>
                    <option value="Outro">{t.contact.projectOptions[4]}</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.3em] text-graphite-500">{t.contact.labels.budget}</label>
                  <select
                    required
                    value={formState.budget}
                    onChange={(e) => setFormState({ ...formState, budget: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-graphite-800 bg-ink-950/80 px-4 py-3 text-sm text-white focus:border-cobalt-400 focus:outline-none focus:ring-4 focus:ring-cobalt-500/10"
                  >
                    <option value="">{t.contact.budgetOptions[0]}</option>
                    <option value="10k-30k">{t.contact.budgetOptions[1]}</option>
                    <option value="30k-50k">{t.contact.budgetOptions[2]}</option>
                    <option value="50k-100k">{t.contact.budgetOptions[3]}</option>
                    <option value="100k+">{t.contact.budgetOptions[4]}</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.3em] text-graphite-500">{t.contact.labels.timeline}</label>
                  <select
                    required
                    value={formState.timeline}
                    onChange={(e) => setFormState({ ...formState, timeline: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-graphite-800 bg-ink-950/80 px-4 py-3 text-sm text-white focus:border-cobalt-400 focus:outline-none focus:ring-4 focus:ring-cobalt-500/10"
                  >
                    <option value="">{t.contact.timelineOptions[0]}</option>
                    <option value="30d">{t.contact.timelineOptions[1]}</option>
                    <option value="60d">{t.contact.timelineOptions[2]}</option>
                    <option value="90d+">{t.contact.timelineOptions[3]}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-graphite-500">{t.contact.labels.message}</label>
                <textarea
                  required
                  rows={4}
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-graphite-800 bg-ink-950/80 px-4 py-3 text-sm text-white placeholder:text-graphite-500 focus:border-cobalt-400 focus:outline-none focus:ring-4 focus:ring-cobalt-500/10"
                />
              </div>

              {status === 'error' && (
                <p className="text-sm text-ember-400">{t.contact.error}</p>
              )}
              {status === 'success' && (
                <p className="text-sm text-tide-300">{t.contact.success}</p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="primary-cta w-full justify-center"
              >
                {status === 'sending' ? t.contact.ctaSending : status === 'success' ? t.contact.ctaSent : t.contact.cta}
                <Send size={16} />
              </button>
            </form>
              </div>
            </TiltCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Contact;
