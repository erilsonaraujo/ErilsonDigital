import React from 'react';
import { ArrowRight, Github, Linkedin } from 'lucide-react';
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';
import { TRANSLATIONS, GITHUB_URL, LINKEDIN_URL } from '../constants';

const Hero: React.FC = () => {
  const { language } = useThemeLanguage();
  const t = TRANSLATIONS[language].hero;

  return (
    <section className="relative pt-32 pb-32 lg:pt-48 lg:pb-40 overflow-hidden bg-slate-50 dark:bg-dark-950 transition-colors duration-300">
      {/* background: Animated Tech Grid & Flow */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Base Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

        {/* Glowing Blobs (Mobile Optimized) */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary-500/10 dark:bg-primary-600/5 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 dark:bg-secondary-600/5 rounded-full blur-[120px] animate-blob" style={{ animationDelay: '2s' }}></div>

        {/* Floating Tech Polygons */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.15] dark:opacity-[0.2]" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="grid-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
              <stop offset="50%" stopColor="currentColor" stopOpacity="1" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Horizontal scanning line */}
          <rect width="100" height="0.1" fill="url(#grid-grad)" className="text-primary-500 animate-[drift_10s_ease-in-out_infinite]" />
        </svg>

        {/* Circuit-like paths */}
        <div className="absolute inset-0 opacity-20 dark:opacity-40">
          <div className="absolute top-[15%] left-[10%] w-32 h-32 border-l border-t border-primary-500/30 rounded-tl-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-[20%] right-[15%] w-48 h-48 border-r border-b border-primary-400/20 rounded-br-[4rem] animate-pulse-slow-reverse" style={{ animationDelay: '1s' }}></div>

          {/* Random floating technical nodes */}
          <div className="absolute top-1/4 right-[25%] w-2 h-2 bg-primary-500 rounded-full animate-ping"></div>
          <div className="absolute bottom-1/3 left-[20%] w-1.5 h-1.5 bg-primary-400 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
        </div>

        {/* Geometric Polygons in motion */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-primary-500/5 dark:border-primary-500/10 rounded-full animate-spin-slow opacity-50"></div>
          <div className="absolute top-1/3 left-1/3 w-96 h-96 border border-dashed border-primary-400/5 dark:border-primary-400/10 rounded-full animate-reverse-spin opacity-30"></div>

          {/* Floating Tech Crystals/Hexagons */}
          <div className="absolute top-20 right-[15%] w-24 h-24 bg-primary-500/5 dark:bg-primary-500/10 backdrop-blur-sm rotate-45 animate-drift hidden lg:block"></div>
          <div className="absolute bottom-40 left-[10%] w-32 h-32 bg-purple-500/5 dark:bg-purple-600/5 backdrop-blur-sm -rotate-12 animate-drift-reverse hidden lg:block"></div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-700 text-slate-600 dark:text-primary-400 text-sm font-medium mb-8 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
              {t.badge}
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-slate-900 dark:text-white tracking-tight mb-6">
              {t.title} <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400 block sm:inline mt-2 sm:mt-0">
                {t.titleHighlight}
              </span>
            </h1>

            <p className="mt-4 max-w-2xl lg:mx-0 mx-auto text-lg sm:text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
              {t.subtitle}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <a
                href="#portfolio"
                className="px-8 py-4 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/30 flex items-center justify-center group"
              >
                {t.ctaPrimary}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <button
                onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
                className="px-8 py-4 rounded-lg bg-white dark:bg-dark-800 text-slate-900 dark:text-white font-semibold border border-slate-200 dark:border-dark-700 hover:bg-slate-50 dark:hover:bg-dark-700 transition-all flex items-center justify-center shadow-sm"
              >
                {t.ctaSecondary}
              </button>
            </div>

            <div className="mt-12 flex justify-center lg:justify-start space-x-6 text-slate-400 border-t border-slate-100 dark:border-dark-800/50 pt-8">
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer"><Github className="h-6 w-6 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors" /></a>
              <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer"><Linkedin className="h-6 w-6 hover:text-blue-600 dark:hover:text-white cursor-pointer transition-colors" /></a>
            </div>
          </div>

          <div className="flex-1 relative lg:block">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-[450px] lg:h-[450px] mx-auto">
              {/* Decorative elements */}
              <div className="absolute inset-0 bg-primary-500/10 dark:bg-primary-500/20 rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute -inset-4 border border-dashed border-primary-500/30 rounded-full animate-spin-slow"></div>

              <div className="relative w-full h-full rounded-2xl overflow-hidden border-4 border-white dark:border-dark-800 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 group">
                <img
                  src="/erilson.jpg"
                  alt="Erilson Araujo"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/40 to-transparent opacity-60"></div>
              </div>

              {/* Float labels */}
              <div className="absolute -right-4 top-10 bg-white dark:bg-dark-800 p-4 rounded-xl shadow-xl border border-slate-100 dark:border-dark-700 animate-bounce-slow hidden sm:block">
                <p className="text-primary-600 font-bold text-sm">AI Agent Expert 🤖</p>
              </div>
              <div className="absolute -left-8 bottom-20 bg-white dark:bg-dark-800 p-4 rounded-xl shadow-xl border border-slate-100 dark:border-dark-700 animate-bounce-slow delay-700 hidden sm:block">
                <p className="text-secondary-500 font-bold text-sm">Fullstack Dev 💻</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;