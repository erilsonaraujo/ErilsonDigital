'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Globe, ChevronDown } from 'lucide-react';
import { useThemeLanguage } from '@/contexts/ThemeLanguageContext';
import { TRANSLATIONS } from '@/constants';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { language, setLanguage } = useThemeLanguage();
    const t = TRANSLATIONS[language];

    const clinicsOverviewLabel = language === 'en' ? 'Overview' : language === 'es' ? 'Resumen' : 'Visao geral';

    const navItems = [
        { label: t.nav.services, href: '/servicos' },
        {
            label: t.nav.forClinics,
            href: '#',
            children: [
                { label: clinicsOverviewLabel, href: '/para-clinicas' },
                { label: t.nav.esthetics, href: '/clinicas-estetica' },
                { label: t.nav.surgery, href: '/cirurgia-dermato-premium' },
                { label: t.nav.dentistry, href: '/odontologia-premium' },
            ]
        },
        { label: t.nav.cases, href: '/portfolio' },
        { label: t.nav.process, href: '/#processo' },
        { label: t.nav.about, href: '/sobre' },
        { label: t.nav.contact, href: '/contato' },
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="fixed top-0 w-full z-50 border-b border-graphite-800/80 bg-ink-950/70 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <a href="/" className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cobalt-400 to-tide-400 text-ink-950 flex items-center justify-center font-semibold">
                            ED
                        </div>
                        <div className="leading-none">
                            <span className="block text-sm font-semibold tracking-[0.25em] text-graphite-400">ERILSON</span>
                            <span className="block text-lg font-semibold text-white">Digital</span>
                        </div>
                    </a>

                    <div className="hidden lg:flex items-center gap-10 text-sm text-graphite-300">
                        {navItems.map((item) => (
                            item.children ? (
                                <div key={item.label} className="relative group" ref={dropdownRef}>
                                    <button
                                        className="flex items-center gap-1 hover:text-white transition-colors focus:outline-none"
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        onMouseEnter={() => setIsDropdownOpen(true)}
                                    >
                                        {item.label}
                                        <ChevronDown size={14} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {isDropdownOpen && (
                                        <div
                                            className="absolute top-full left-0 mt-2 w-56 rounded-xl border border-graphite-800 bg-ink-950/95 shadow-xl py-2"
                                            onMouseLeave={() => setIsDropdownOpen(false)}
                                        >
                                            {item.children.map((child) => (
                                                <a
                                                    key={child.href}
                                                    href={child.href}
                                                    className="block px-4 py-2 hover:bg-graphite-800/50 hover:text-white transition-colors"
                                                >
                                                    {child.label}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <a key={item.href} href={item.href} className="hover:text-white transition-colors">
                                    {item.label}
                                </a>
                            )
                        ))}
                        <a href="/agendar" className="primary-cta" data-analytics-label="nav-agendar">
                            {t.nav.booking} <ArrowUpRight size={16} />
                        </a>
                        <div className="relative group">
                            <button
                                className="h-10 w-10 rounded-full border border-graphite-700 text-graphite-200 flex items-center justify-center hover:border-graphite-500"
                                aria-label={t.nav.languageToggle}
                            >
                                <Globe size={16} />
                            </button>
                            <div className="absolute right-0 mt-2 w-28 rounded-xl border border-graphite-800 bg-ink-950/95 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                {(['pt', 'en', 'es'] as const).map((lang) => (
                                    <button
                                        key={lang}
                                        onClick={() => setLanguage(lang)}
                                        className={`w-full text-left px-4 py-2 text-xs uppercase tracking-[0.2em] ${language === lang ? 'text-white' : 'text-graphite-400 hover:text-white'}`}
                                    >
                                        {lang}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="lg:hidden flex items-center gap-3">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="flex items-center justify-center h-10 w-10 rounded-full border border-graphite-700 text-graphite-200"
                            aria-label={t.nav.menuToggle}
                        >
                            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
                        </button>
                    </div>
                </div>
            </div>

            {isMenuOpen && (
                <div className="lg:hidden border-t border-graphite-800 bg-ink-950/95 px-6 pb-8 pt-4 h-screen overflow-y-auto">
                    <div className="flex flex-col gap-4 text-base text-graphite-200">
                        {navItems.map((item) => (
                            item.children ? (
                                <div key={item.label} className="flex flex-col gap-2">
                                    <div className="font-semibold text-graphite-400">{item.label}</div>
                                    <div className="pl-4 flex flex-col gap-3 border-l-2 border-graphite-800">
                                        {item.children.map((child) => (
                                            <a
                                                key={child.href}
                                                href={child.href}
                                                onClick={() => setIsMenuOpen(false)}
                                                className="hover:text-graphite-900"
                                            >
                                                {child.label}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <a key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)} className="hover:text-graphite-900">
                                    {item.label}
                                </a>
                            )
                        ))}
                        <a href="/agendar" className="secondary-cta w-full justify-between mt-4">
                            {t.nav.booking} <ArrowUpRight size={16} />
                        </a>
                        <div className="flex items-center gap-2 pt-6">
                            {(['pt', 'en', 'es'] as const).map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => setLanguage(lang)}
                                    className={`px-3 py-1 rounded-full border text-xs uppercase tracking-[0.2em] ${language === lang ? 'border-graphite-400 text-white' : 'border-graphite-700 text-graphite-400'}`}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
