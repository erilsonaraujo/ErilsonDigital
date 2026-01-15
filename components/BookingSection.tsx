'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Calendar, ShieldCheck, MessageCircle } from 'lucide-react';
import { WHATSAPP_NUMBER, TRANSLATIONS } from '@/constants';
import { useThemeLanguage } from '@/contexts/ThemeLanguageContext';
import Reveal from '@/components/ui/Reveal';
import Parallax from '@/components/ui/Parallax';
import TiltCard from '@/components/ui/TiltCard';

const BookingSection: React.FC = () => {
    const { language } = useThemeLanguage();
    const t = TRANSLATIONS[language];
    return (
        <section id="booking" className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 noise-bg opacity-55" />
            <div className="absolute inset-0 grid-fade opacity-25" />
            <Parallax className="absolute -top-28 left-1/3 h-96 w-96 rounded-full bg-cobalt-500/12 blur-[120px]" speed={0.18} />
            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <Reveal as="div">
                    <TiltCard className="rounded-[36px]">
                        <div className="rounded-[36px] border border-graphite-800 bg-ink-900/80 p-10 md:p-14 shadow-2xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/6 via-transparent to-transparent" />
                            <div className="relative grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
                        <div className="space-y-6">
                            <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">{t.booking.label}</p>
                            <h2 className="text-3xl md:text-4xl font-semibold text-white">
                                {t.booking.title}
                            </h2>
                            <p className="text-graphite-300">
                                {t.booking.description}
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Link href="/agendar" className="primary-cta" data-analytics-label="booking-agendar">
                                    {t.booking.ctaPrimary} <ArrowUpRight size={16} />
                                </Link>
                                <a
                                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t.booking.ctaSecondary)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="secondary-cta"
                                    data-analytics-label="booking-whatsapp"
                                >
                                    {t.booking.ctaSecondary}
                                </a>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {[
                                { icon: Calendar, text: t.booking.items[0] },
                                { icon: ShieldCheck, text: t.booking.items[1] },
                                { icon: MessageCircle, text: t.booking.items[2] },
                            ].map((item, index) => (
                                <Reveal key={index} as="div" delayMs={120 + index * 90}>
                                    <div className="rounded-2xl border border-graphite-800 bg-ink-950/70 p-4 flex items-start gap-4 hover:border-graphite-600 transition-colors">
                                        <div className="h-10 w-10 rounded-xl bg-tide-500/10 text-tide-300 flex items-center justify-center">
                                            <item.icon size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-white">#{index + 1}</p>
                                            <p className="text-xs text-graphite-400 mt-1">{item.text}</p>
                                        </div>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                        </div>
                    </TiltCard>
                </Reveal>
            </div>
        </section>
    );
};

export default BookingSection;
