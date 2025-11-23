import React, { useEffect } from 'react';
import { getCalApi } from "@calcom/embed-react";
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';
import { Calendar } from 'lucide-react';

const BookingSection: React.FC = () => {
    const { t, theme } = useThemeLanguage();

    useEffect(() => {
        (async function () {
            const cal = await getCalApi({});
            cal("ui", {
                theme: theme,
                styles: { branding: { brandColor: "#2563eb" } },
                hideEventTypeDetails: false,
                layout: "month_view"
            });
        })();
    }, [theme]);

    return (
        <section id="booking" className="py-20 bg-slate-50 dark:bg-dark-900 transition-colors duration-300">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 animate-on-scroll">
                    <div className="inline-flex items-center justify-center p-3 mb-4 rounded-2xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white mb-4">
                        {t.booking.title}
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        {t.booking.subtitle}
                    </p>
                </div>

                <div className="max-w-4xl mx-auto glass-card p-4 md:p-8 rounded-3xl overflow-hidden">
                    <iframe
                        src="https://cal.com/erilson/20min"
                        style={{ width: "100%", height: "100%", minHeight: "600px", border: "none" }}
                        title="Agendar Consultoria"
                    ></iframe>
                </div>
            </div>
        </section>
    );
};

export default BookingSection;
