'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function AnalyticsTracker() {
    const pathname = usePathname();

    useEffect(() => {
        const trackView = async () => {
            try {
                // Persistent visitor ID in localStorage
                let visitorId = localStorage.getItem('visitor_id');
                if (!visitorId) {
                    visitorId = `v_${Math.random().toString(36).substring(2, 15)}`;
                    localStorage.setItem('visitor_id', visitorId);
                }

                await fetch('/api/analytics', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        path: pathname,
                        referrer: document.referrer,
                        visitorId: visitorId
                    }),
                });
            } catch (err) {
                // Silently fail to not break user experience
                console.debug('Analytics failed', err);
            }
        };

        trackView();
    }, [pathname]);

    return null;
}
