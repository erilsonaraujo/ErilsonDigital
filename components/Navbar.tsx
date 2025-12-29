'use client';

import React, { useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        { label: 'Servicos', href: '/servicos' },
        { label: 'Cases', href: '/portfolio' },
        { label: 'Processo', href: '/#processo' },
        { label: 'Sobre', href: '/sobre' },
        { label: 'Contato', href: '/contato' },
    ];

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
                            <a key={item.href} href={item.href} className="hover:text-white transition-colors">
                                {item.label}
                            </a>
                        ))}
                        <a href="/agendar" className="primary-cta">
                            Diagnostico Estrategico <ArrowUpRight size={16} />
                        </a>
                    </div>

                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="lg:hidden flex items-center justify-center h-10 w-10 rounded-full border border-graphite-700 text-graphite-200"
                        aria-label="Abrir menu"
                    >
                        {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>
                </div>
            </div>

            {isMenuOpen && (
                <div className="lg:hidden border-t border-graphite-800 bg-ink-950/95 px-6 pb-8 pt-4">
                    <div className="flex flex-col gap-4 text-base text-graphite-200">
                        {navItems.map((item) => (
                            <a key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)} className="hover:text-white">
                                {item.label}
                            </a>
                        ))}
                        <a href="/agendar" className="secondary-cta w-full justify-between">
                            Diagnostico Estrategico <ArrowUpRight size={16} />
                        </a>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
