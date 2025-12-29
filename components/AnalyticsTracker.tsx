'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const VISITOR_KEY = 'erilson_visitor_id';
const SESSION_KEY = 'erilson_session_id';
const SESSION_LAST_KEY = 'erilson_session_last';
const SESSION_TTL_MS = 30 * 60 * 1000;

const getVisitorId = () => {
  if (typeof window === 'undefined') return 'anonymous';
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
};

const getSessionId = () => {
  if (typeof window === 'undefined') return 'session';
  const now = Date.now();
  const last = Number(localStorage.getItem(SESSION_LAST_KEY) || '0');
  let sessionId = localStorage.getItem(SESSION_KEY);

  if (!sessionId || now - last > SESSION_TTL_MS) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, sessionId);
  }

  localStorage.setItem(SESSION_LAST_KEY, String(now));
  return sessionId;
};

export const trackEvent = async (name: string, metadata?: Record<string, any>) => {
  try {
    const visitorId = getVisitorId();
    const sessionId = getSessionId();
    await fetch('/api/analytics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitorId,
        sessionId,
        name,
        path: window.location.pathname,
        metadata,
      }),
    });
  } catch (error) {
    console.debug('Track event failed', error);
  }
};

const AnalyticsTracker = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const track = async () => {
      try {
        const visitorId = getVisitorId();
        const sessionId = getSessionId();
        const path = `${pathname || ''}${searchParams?.toString() ? `?${searchParams}` : ''}`;
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            visitorId,
            sessionId,
            path,
            referrer: document.referrer || null,
          }),
        });
      } catch (error) {
        console.debug('Track pageview failed', error);
      }
    };

    if (pathname && !pathname.startsWith('/admin')) {
      track();
    }
  }, [pathname, searchParams]);

  return null;
};

export default AnalyticsTracker;
