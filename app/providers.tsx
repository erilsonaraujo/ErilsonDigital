'use client';

import React from 'react';
import { ThemeLanguageProvider } from '../contexts/ThemeLanguageContext';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeLanguageProvider>
            {children}
        </ThemeLanguageProvider>
    );
}
