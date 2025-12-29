'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const VISITOR_KEY = 'erilson_visitor_id';
const SESSION_KEY = 'erilson_session_id';
const SESSION_LAST_KEY = 'erilson_session_last';
const CONSENT_KEY = 'erilson_analytics_consent';
const SESSION_TTL_MS = 30 * 60 * 1000;

const getConsent = () => {
  if (typeof window === 'undefined') return 'denied';
  return localStorage.getItem(CONSENT_KEY) || 'pending';
};

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

const getUtmParams = () => {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  const source = params.get('utm_source');
  const medium = params.get('utm_medium');
  const campaign = params.get('utm_campaign');
  const term = params.get('utm_term');
  const content = params.get('utm_content');
  if (!source && !medium && !campaign && !term && !content) return null;
  return { source, medium, campaign, term, content };
};

export const trackEvent = async (name: string, metadata?: Record<string, any>) => {
  try {
    if (getConsent() !== 'granted') return;
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
        if (getConsent() !== 'granted') return;
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
            title: document.title || null,
            utm: getUtmParams(),
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

  useEffect(() => {
    if (getConsent() !== 'granted') return;

    const thresholds = [25, 50, 75, 100];
    const triggered = new Set<number>();

    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percent = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
      thresholds.forEach((threshold) => {
        if (percent >= threshold && !triggered.has(threshold)) {
          triggered.add(threshold);
          trackEvent('scroll_depth', { percent: threshold });
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  useEffect(() => {
    if (getConsent() !== 'granted') return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const el = target.closest('[data-analytics-label]') as HTMLElement | null;
      if (!el) return;
      const label = el.getAttribute('data-analytics-label');
      if (label) trackEvent('click', { label });
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [pathname]);

  return null;
};

export default AnalyticsTracker;
