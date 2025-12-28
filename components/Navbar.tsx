'use client';

import React, { useState } from 'react';
import { Menu, Moon, Sun, Globe } from 'lucide-react';
import { useThemeLanguage } from '@/contexts/ThemeLanguageContext';
import { TRANSLATIONS } from '@/constants';

const Navbar = () => {
    const { theme, toggleTheme, language, setLanguage } = useThemeLanguage();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const t = TRANSLATIONS[language].nav;

    return (
        <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-dark-950/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrink-0 flex items-center">
                        <span className="font-display font-bold text-xl text-slate-900 dark:text-white tracking-tight">Erilson<span className="text-primary-600 dark:text-primary-500">Digital</span></span>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        <a href="/#services" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-white transition-colors">{t.services}</a>
                        <a href="/#portfolio" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-white transition-colors">{t.portfolio}</a>
                        <a href="/#about" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-white transition-colors">{t.about}</a>
                        <a href="/agendar" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-white transition-colors">{t.booking}</a>

                        <div className="h-6 w-px bg-slate-200 dark:bg-dark-700 mx-2"></div>

                        {/* Theme Toggle */}
                        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-dark-800 text-slate-600 dark:text-slate-400 transition-colors">
                            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                        </button>

                        {/* Lang Toggle */}
                        <div className="relative group">
                            <button className="flex items-center gap-1 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 transition-colors uppercase">
                                <Globe className="w-4 h-4" /> {language}
                            </button>
                            <div className="absolute right-0 mt-2 w-24 bg-white dark:bg-dark-800 rounded-md shadow-lg py-1 border border-slate-200 dark:border-dark-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                {(['pt', 'en', 'es'] as const).map(l => (
                                    <button
                                        key={l}
                                        onClick={() => setLanguage(l)}
                                        className={`block w-full text-left px-4 py-2 text-sm uppercase ${language === l ? 'text-primary-600 font-bold bg-slate-50 dark:bg-dark-700' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-700'}`}
                                    >
                                        {l}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <a href="#contact" className="px-4 py-2 rounded-md bg-slate-900 dark:bg-primary-600 text-white text-sm font-medium hover:opacity-90 transition-all shadow-md">
                            {t.contact}
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        <button onClick={toggleTheme} className="text-slate-600 dark:text-slate-400">
                            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                        </button>
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-900 dark:text-slate-300 hover:text-primary-600">
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white dark:bg-dark-900 border-t border-slate-200 dark:border-dark-800 px-4 pt-2 pb-6 space-y-4 shadow-xl">
                    <a href="/#services" className="block text-slate-600 dark:text-slate-300 py-2" onClick={() => setIsMenuOpen(false)}>{t.services}</a>
                    <a href="/#portfolio" className="block text-slate-600 dark:text-slate-300 py-2" onClick={() => setIsMenuOpen(false)}>{t.portfolio}</a>
                    <a href="/#about" className="block text-slate-600 dark:text-slate-300 py-2" onClick={() => setIsMenuOpen(false)}>{t.about}</a>
                    <a href="/agendar" className="block text-slate-600 dark:text-slate-300 py-2" onClick={() => setIsMenuOpen(false)}>{t.booking}</a>
                    <div className="flex gap-4 pt-2 border-t border-slate-100 dark:border-dark-800">
                        {(['pt', 'en', 'es'] as const).map(l => (
                            <button
                                key={l}
                                onClick={() => { setLanguage(l); setIsMenuOpen(false); }}
                                className={`px-3 py-1 rounded border ${language === l ? 'border-primary-500 text-primary-600' : 'border-slate-200 dark:border-dark-700 text-slate-500'} text-xs uppercase`}
                            >
                                {l}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
