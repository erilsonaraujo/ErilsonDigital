'use client';

import { usePathname } from 'next/navigation';
import { Suspense } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AnalyticsTracker from '@/components/AnalyticsTracker';
import ConsentBanner from '@/components/ConsentBanner';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');

    if (isAdmin) {
        return (
            <div className="flex flex-col min-h-screen bg-ink-950">
                {children}
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <Suspense fallback={null}>
                <AnalyticsTracker />
            </Suspense>
            <ConsentBanner />
            <main className="flex-grow flex flex-col pt-20">
                {children}
            </main>
            <Footer />
        </div>
    );
}
