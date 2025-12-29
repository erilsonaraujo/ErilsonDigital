'use client';

import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { WHATSAPP_NUMBER, TRANSLATIONS } from '@/constants';
import { useThemeLanguage } from '@/contexts/ThemeLanguageContext';
import { trackEvent } from '@/components/AnalyticsTracker';

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
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formState, source: 'site-premium' }),
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
    <section id="contact" className="py-24 bg-ink-950 relative">
      <div className="absolute inset-0 noise-bg opacity-70" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10">
          <div className="rounded-[32px] border border-graphite-800 bg-ink-900/80 p-8 md:p-10">
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
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-full border border-graphite-700 px-5 py-2 text-sm text-graphite-200 hover:border-graphite-500"
              >
                {t.contact.whatsapp}
              </a>
          </div>

          <div className="rounded-[32px] border border-graphite-800 bg-ink-900/80 p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs uppercase tracking-[0.3em] text-graphite-500">{t.contact.labels.name}</label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-graphite-800 bg-ink-950/80 px-4 py-3 text-sm text-white focus:border-cobalt-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.3em] text-graphite-500">{t.contact.labels.email}</label>
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
                  <label className="text-xs uppercase tracking-[0.3em] text-graphite-500">{t.contact.labels.phone}</label>
                  <input
                    type="tel"
                    value={formState.phone}
                    onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-graphite-800 bg-ink-950/80 px-4 py-3 text-sm text-white focus:border-cobalt-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.3em] text-graphite-500">{t.contact.labels.company}</label>
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
                  <label className="text-xs uppercase tracking-[0.3em] text-graphite-500">{t.contact.labels.projectType}</label>
                  <select
                    required
                    value={formState.projectType}
                    onChange={(e) => setFormState({ ...formState, projectType: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-graphite-800 bg-ink-950/80 px-4 py-3 text-sm text-white focus:border-cobalt-400 focus:outline-none"
                  >
                    <option value="">{t.contact.projectOptions[0]}</option>
                    <option value="produto-digital">{t.contact.projectOptions[1]}</option>
                    <option value="ia-automacao">{t.contact.projectOptions[2]}</option>
                    <option value="backend">{t.contact.projectOptions[3]}</option>
                    <option value="dados">{t.contact.projectOptions[4]}</option>
                    <option value="outro">{t.contact.projectOptions[5]}</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.3em] text-graphite-500">{t.contact.labels.budget}</label>
                  <select
                    required
                    value={formState.budget}
                    onChange={(e) => setFormState({ ...formState, budget: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-graphite-800 bg-ink-950/80 px-4 py-3 text-sm text-white focus:border-cobalt-400 focus:outline-none"
                  >
                    <option value="">{t.contact.budgetOptions[0]}</option>
                    <option value="50-100">{t.contact.budgetOptions[1]}</option>
                    <option value="100-200">{t.contact.budgetOptions[2]}</option>
                    <option value="200-500">{t.contact.budgetOptions[3]}</option>
                    <option value="500+">{t.contact.budgetOptions[4]}</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.3em] text-graphite-500">{t.contact.labels.timeline}</label>
                  <select
                    required
                    value={formState.timeline}
                    onChange={(e) => setFormState({ ...formState, timeline: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-graphite-800 bg-ink-950/80 px-4 py-3 text-sm text-white focus:border-cobalt-400 focus:outline-none"
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
                  className="mt-2 w-full rounded-xl border border-graphite-800 bg-ink-950/80 px-4 py-3 text-sm text-white focus:border-cobalt-400 focus:outline-none"
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
        </div>
      </div>
    </section>
  );
};

export default Contact;
