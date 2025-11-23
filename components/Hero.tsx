import React from 'react';
import { ArrowRight, Github, Linkedin } from 'lucide-react';
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';
import { TRANSLATIONS, GITHUB_URL, LINKEDIN_URL } from '../constants';

const Hero: React.FC = () => {
  const { language } = useThemeLanguage();
  const t = TRANSLATIONS[language].hero;

  return (
    <section className="relative pt-32 pb-32 lg:pt-48 lg:pb-40 overflow-hidden bg-slate-50 dark:bg-dark-950 transition-colors duration-300">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 h-full z-0 pointer-events-none overflow-hidden">
            <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary-200 dark:bg-primary-900/20 rounded-full blur-3xl opacity-50 animate-blob"></div>
            <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-200 dark:bg-secondary-600/10 rounded-full blur-3xl opacity-50 animate-blob" style={{ animationDelay: '2s' }}></div>
        </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-700 text-slate-600 dark:text-primary-400 text-sm font-medium mb-8 shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
          {t.badge}
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-slate-900 dark:text-white tracking-tight mb-6 px-2">
          {t.title.split('Java')[0]} <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400 block sm:inline mt-2 sm:mt-0">
            Java & Python
          </span>
        </h1>

        <p className="mt-4 max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 dark:text-slate-400 leading-relaxed px-4">
          {t.subtitle}
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <a 
            href="#portfolio" 
            className="px-8 py-4 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/30 flex items-center justify-center group"
          >
            {t.ctaPrimary}
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <button
             onClick={() => window.scrollTo({ top: 600, behavior: 'smooth'})}
            className="px-8 py-4 rounded-lg bg-white dark:bg-dark-800 text-slate-900 dark:text-white font-semibold border border-slate-200 dark:border-dark-700 hover:bg-slate-50 dark:hover:bg-dark-700 transition-all flex items-center justify-center shadow-sm"
          >
            {t.ctaSecondary}
          </button>
        </div>

        <div className="mt-12 flex justify-center space-x-6 text-slate-400">
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer"><Github className="h-6 w-6 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors" /></a>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer"><Linkedin className="h-6 w-6 hover:text-blue-600 dark:hover:text-white cursor-pointer transition-colors" /></a>
        </div>
      </div>
    </section>
  );
};

export default Hero;