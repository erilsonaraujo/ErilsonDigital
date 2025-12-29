'use client';

import React from 'react';
import { useThemeLanguage } from '@/contexts/ThemeLanguageContext';
import { TRANSLATIONS } from '@/constants';

const ContactHero: React.FC = () => {
  const { language } = useThemeLanguage();
  const t = TRANSLATIONS[language];

  return (
    <div className="mt-6 mb-10">
      <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">{t.contact.title}</p>
      <h1 className="text-4xl md:text-5xl font-semibold text-white mt-4">{t.contact.subtitle}</h1>
      <p className="text-lg text-graphite-300 mt-4 max-w-2xl">{t.contact.description}</p>
    </div>
  );
};

export default ContactHero;
