'use client';

import React from 'react';
import { useThemeLanguage } from '@/contexts/ThemeLanguageContext';
import { Calendar } from 'lucide-react';

import { TRANSLATIONS } from '@/constants';

const BookingSection: React.FC = () => {
    const { language } = useThemeLanguage();
    const t = TRANSLATIONS[language];

    // Safe fallback in case translations aren't loaded
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

                <div className="max-w-4xl mx-auto glass-card p-4 md:p-8 rounded-3xl overflow-hidden">
                    {/* Calendly iframe embed */}
                    <iframe
                        src="https://calendly.com/joseerilsonaraujo/30min?embed_domain=localhost&embed_type=Inline&hide_gdpr_banner=1&primary_color=2563eb"
                        width="100%"
                        height="700"
                        frameBorder="0"
                        title="Agendar Consultoria"
                        style={{ minHeight: '700px', border: 'none' }}
                    ></iframe>
                </div>
            </div>
        </section>
    );
};

export default BookingSection;
