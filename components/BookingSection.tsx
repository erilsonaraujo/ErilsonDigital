'use client';

import React from 'react';
import { useThemeLanguage } from '@/contexts/ThemeLanguageContext';
import { Calendar, MessageCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { TRANSLATIONS, WHATSAPP_NUMBER } from '@/constants';

const BookingSection: React.FC = () => {
    const { language } = useThemeLanguage();
    const t = TRANSLATIONS[language];

    const bookingTitle = t?.booking?.title || 'Agende uma Consultoria';
    const bookingSubtitle = t?.booking?.subtitle || 'Sessões de 30 minutos para discutir seu projeto e viabilidade técnica.';

    return (
        <section id="booking" className="py-20 bg-slate-50 dark:bg-dark-900 transition-colors duration-300">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center p-3 mb-4 rounded-2xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white mb-4">
                        {bookingTitle}
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        {bookingSubtitle}
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Agendar via Formulário */}
                        <Link
                            href="/agendar"
                            className="group bg-white dark:bg-dark-800 p-8 rounded-2xl border-2 border-slate-200 dark:border-dark-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all shadow-lg hover:shadow-xl"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
                                    <Calendar className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                                </div>
                                <ArrowRight className="w-6 h-6 text-slate-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                Agendar Reunião
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                Preencha o formulário e envie sua solicitação diretamente pelo WhatsApp.
                            </p>
                        </Link>

                        {/* WhatsApp Direto */}
                        <a
                            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Olá! Gostaria de agendar uma consultoria.')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group bg-gradient-to-br from-[#25D366] to-[#128C7E] p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-white/20 rounded-xl">
                                    <MessageCircle className="w-8 h-8 text-white" />
                                </div>
                                <ArrowRight className="w-6 h-6 text-white/80 group-hover:text-white group-hover:translate-x-1 transition-all" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">
                                Falar Agora no WhatsApp
                            </h3>
                            <p className="text-white/90">
                                Inicie uma conversa direta e agende seu horário rapidamente.
                            </p>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BookingSection;
