'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, CheckCircle2, ArrowUpRight } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import { TRANSLATIONS } from '@/constants';
import { useThemeLanguage } from '@/contexts/ThemeLanguageContext';

export default function BookingPage() {
    const { language } = useThemeLanguage();
    const t = TRANSLATIONS[language];
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        service: '',
        budget: '',
        preferredDate: '',
        preferredTime: '',
        message: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const response = await fetch('/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    company: formData.company,
                    service: formData.service,
                    budget: formData.budget,
                    preferred_date: formData.preferredDate,
                    preferred_time: formData.preferredTime,
                    message: formData.message,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create appointment');
            }

            setStatus('success');
        } catch (err) {
            console.error('Failed to save appointment', err);
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="min-h-screen bg-ink-950 pt-32 pb-20">
                <div className="max-w-2xl mx-auto px-4 text-center">
                    <div className="inline-flex p-6 bg-tide-500/10 rounded-full mb-8">
                        <CheckCircle2 className="w-16 h-16 text-tide-300" />
                    </div>
                    <h1 className="text-4xl font-semibold text-white mb-6">{t.booking.successTitle}</h1>
                    <p className="text-lg text-graphite-300 mb-10">{t.booking.successDescription}</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/" className="primary-cta">
                            {t.nav.home} <ArrowUpRight size={16} />
                        </Link>
                        <button
                            onClick={() => setStatus('idle')}
                            className="secondary-cta"
                        >
                            {t.booking.ctaPrimary}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-ink-950 pt-28 pb-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <Breadcrumbs />
                <div className="text-center mb-12">
                    <div className="inline-flex p-4 bg-cobalt-500/10 rounded-2xl mb-4">
                        <Calendar className="w-7 h-7 text-cobalt-300" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-semibold text-white">{t.booking.title}</h1>
                    <p className="text-lg text-graphite-300 mt-4 max-w-2xl mx-auto">{t.booking.description}</p>
                </div>

                <div className="rounded-[32px] border border-graphite-800 bg-ink-900/80 p-8 md:p-12">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {status === 'error' && (
                            <div className="p-4 bg-ember-500/10 border border-ember-500/30 rounded-xl text-ember-200 text-sm">
                                {t.booking.error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs uppercase tracking-[0.3em] text-graphite-500">{t.contact.labels.name}</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="mt-2 w-full rounded-xl border border-graphite-800 bg-ink-950/80 px-4 py-3 text-sm text-white focus:border-cobalt-400 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-xs uppercase tracking-[0.3em] text-graphite-500">{t.contact.labels.email}</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="mt-2 w-full rounded-xl border border-graphite-800 bg-ink-950/80 px-4 py-3 text-sm text-white focus:border-cobalt-400 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs uppercase tracking-[0.3em] text-graphite-500">{t.contact.labels.phone}</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="mt-2 w-full rounded-xl border border-graphite-800 bg-ink-950/80 px-4 py-3 text-sm text-white focus:border-cobalt-400 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-xs uppercase tracking-[0.3em] text-graphite-500">{t.contact.labels.company}</label>
                                <input
                                    type="text"
                                    value={formData.company}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    className="mt-2 w-full rounded-xl border border-graphite-800 bg-ink-950/80 px-4 py-3 text-sm text-white focus:border-cobalt-400 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="text-xs uppercase tracking-[0.3em] text-graphite-500">{t.contact.labels.projectType}</label>
                                <select
                                    required
                                    value={formData.service}
                                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                                    className="mt-2 w-full rounded-xl border border-graphite-800 bg-ink-950/80 px-4 py-3 text-sm text-white focus:border-cobalt-400 focus:outline-none"
                                >
                                    <option value="">{t.contact.projectOptions[0]}</option>
                                    <option value="Automacao e IA">{t.contact.projectOptions[2]}</option>
                                    <option value="Backend enterprise">{t.contact.projectOptions[3]}</option>
                                    <option value="Produto digital">{t.contact.projectOptions[1]}</option>
                                    <option value="Dados e analytics">{t.contact.projectOptions[4]}</option>
                                    <option value="Cloud e DevOps">{t.contact.projectOptions[5]}</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs uppercase tracking-[0.3em] text-graphite-500">{t.contact.labels.budget}</label>
                                <select
                                    required
                                    value={formData.budget}
                                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
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
                                <label className="text-xs uppercase tracking-[0.3em] text-graphite-500">{t.booking.form.dateLabel}</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.preferredDate}
                                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                                    className="mt-2 w-full rounded-xl border border-graphite-800 bg-ink-950/80 px-4 py-3 text-sm text-white focus:border-cobalt-400 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs uppercase tracking-[0.3em] text-graphite-500">{t.booking.form.timeLabel}</label>
                                <input
                                    type="time"
                                    required
                                    value={formData.preferredTime}
                                    onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                                    className="mt-2 w-full rounded-xl border border-graphite-800 bg-ink-950/80 px-4 py-3 text-sm text-white focus:border-cobalt-400 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-xs uppercase tracking-[0.3em] text-graphite-500">{t.contact.labels.message}</label>
                                <textarea
                                    rows={3}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="mt-2 w-full rounded-xl border border-graphite-800 bg-ink-950/80 px-4 py-3 text-sm text-white focus:border-cobalt-400 focus:outline-none"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="primary-cta w-full justify-center"
                        >
                            {status === 'loading' ? t.contact.ctaSending : t.booking.ctaPrimary}
                            <ArrowUpRight size={16} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
