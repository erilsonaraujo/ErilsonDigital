'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { useThemeLanguage } from '@/contexts/ThemeLanguageContext';
import { SERVICE_DETAILS_BY_LANG, TRANSLATIONS } from '@/constants';

const Breadcrumbs = () => {
    const pathname = usePathname();
    const paths = pathname.split('/').filter(path => path !== '');
    const { language } = useThemeLanguage();
    const t = TRANSLATIONS[language];

    // Don't show on home page
    if (paths.length === 0) return null;

    const labelMap: Record<string, string> = {
        servicos: t.nav.services,
        portfolio: t.nav.cases,
        sobre: t.nav.about,
        contato: t.nav.contact,
        agendar: t.nav.booking,
    };

    return (
        <nav className="flex mb-8" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                    <Link href="/" className="inline-flex items-center text-sm font-medium text-graphite-400 hover:text-white transition-colors">
                        <Home className="w-4 h-4 mr-2" />
                        {t.nav.home}
                    </Link>
                </li>
                {paths.map((path, index) => {
                    const href = `/${paths.slice(0, index + 1).join('/')}`;
                    const isLast = index === paths.length - 1;

                    // Format path name (e.g., ai-automation -> AI Automation)
                    const fallbackTitle = path
                        .split('-')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ');
                    const fromMap = labelMap[path];
                    const isServiceSlug = paths[index - 1] === 'servicos';
                    const serviceTitle = isServiceSlug
                        ? SERVICE_DETAILS_BY_LANG[language].find((service) => service.id === path)?.title
                        : undefined;
                    const title = fromMap || serviceTitle || fallbackTitle;

                    return (
                        <li key={path}>
                            <div className="flex items-center">
                                <ChevronRight className="w-4 h-4 text-graphite-500 mx-1" />
                                {isLast ? (
                                    <span className="ml-1 text-sm font-semibold text-white md:ml-2">
                                        {title}
                                    </span>
                                ) : (
                                    <Link href={href} className="ml-1 text-sm font-medium text-graphite-400 hover:text-white md:ml-2 transition-colors">
                                        {title}
                                    </Link>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;
