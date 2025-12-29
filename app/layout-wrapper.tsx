'use client';

import { usePathname } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AnalyticsTracker from '@/components/AnalyticsTracker';

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
            <AnalyticsTracker />
            <main className="flex-grow flex flex-col pt-20">
                {children}
            </main>
            <Footer />
        </div>
    );
}
