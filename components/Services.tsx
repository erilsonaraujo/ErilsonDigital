import React from 'react';
import Link from 'next/link';
import { SERVICES, TRANSLATIONS } from '../constants';
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';

const Services: React.FC = () => {
  const { language } = useThemeLanguage();
  const t = TRANSLATIONS[language].services;

  return (
    <section id="services" className="py-24 bg-slate-100 dark:bg-dark-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white mb-4">
            {t.title}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {SERVICES.map((service) => (
            <Link href={`/servicos/${service.id}`}
              key={service.id}
              className="bg-white dark:bg-dark-800 p-6 rounded-xl border border-slate-200 dark:border-dark-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all duration-300 hover:-translate-y-1 group shadow-sm hover:shadow-xl block"
            >
              <div className="w-12 h-12 bg-primary-50 dark:bg-dark-950 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-600 group-hover:text-white transition-all text-primary-600">
                <service.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{service.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                {service.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;