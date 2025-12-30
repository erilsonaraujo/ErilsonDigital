import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '@/types';

interface ThemeLanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const ThemeLanguageContext = createContext<ThemeLanguageContextType | undefined>(undefined);

export const ThemeLanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('pt');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language | null;
    if (savedLang) {
      setLanguage(savedLang);
    } else {
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'pt') setLanguage('pt');
      if (browserLang === 'en') setLanguage('en');
      if (browserLang === 'es') setLanguage('es');
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('dark');
    root.classList.add('light');
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
    const root = window.document.documentElement;
    if (language === 'pt') root.lang = 'pt-BR';
    if (language === 'en') root.lang = 'en-US';
    if (language === 'es') root.lang = 'es-ES';
  }, [language]);

  return (
    <ThemeLanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </ThemeLanguageContext.Provider>
  );
};

export const useThemeLanguage = () => {
  const context = useContext(ThemeLanguageContext);
  if (!context) {
    throw new Error('useThemeLanguage must be used within a ThemeLanguageProvider');
  }
  return context;
};
