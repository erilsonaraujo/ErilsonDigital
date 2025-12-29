'use client';

import { useEffect, useRef } from 'react';
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

type TagDefinition = {
  id: number;
  name: string;
  trigger_type: string;
  trigger_match?: string;
  match_type?: string;
  tag_type: string;
  tag_config?: Record<string, any>;
};

type ExperimentDefinition = {
  id: number;
  name: string;
  traffic_percent?: number;
  target_path?: string;
  variants: { id: number; name: string; weight: number }[];
};

const matchValue = (value: string, match: string, matchType?: string) => {
  if (!match) return false;
  if (matchType === 'equals') return value === match;
  if (matchType === 'regex') {
    try {
      const regex = new RegExp(match, 'i');
      return regex.test(value);
    } catch {
      return false;
    }
  }
  return value.includes(match);
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
  const tagsRef = useRef<TagDefinition[]>([]);
  const firedTags = useRef<Set<number>>(new Set());
  const timersRef = useRef<Record<number, number>>({});
  const recordingQueueRef = useRef<any[]>([]);
  const recordingSequenceRef = useRef(0);
  const recordingFlushRef = useRef<number | null>(null);
  const formStartRef = useRef<Map<string, number>>(new Map());
  const experimentAssignmentsRef = useRef<Record<string, { experimentId: number; variantId: number; variantName: string }>>({});

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

  const trackHeatmap = async (payload: Record<string, any>) => {
    try {
      if (getConsent() !== 'granted') return;
      const visitorId = getVisitorId();
      const sessionId = getSessionId();
      await fetch('/api/analytics/heatmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorId,
          sessionId,
          path: window.location.pathname,
          ...payload
        })
      });
    } catch (error) {
      console.debug('Heatmap track failed', error);
    }
  };

  const trackFormEvent = async (payload: Record<string, any>) => {
    try {
      if (getConsent() !== 'granted') return;
      const visitorId = getVisitorId();
      const sessionId = getSessionId();
      await fetch('/api/analytics/form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorId,
          sessionId,
          path: window.location.pathname,
          ...payload
        })
      });
    } catch (error) {
      console.debug('Form track failed', error);
    }
  };

  const trackMediaEvent = async (payload: Record<string, any>) => {
    try {
      if (getConsent() !== 'granted') return;
      const visitorId = getVisitorId();
      const sessionId = getSessionId();
      await fetch('/api/analytics/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorId,
          sessionId,
          path: window.location.pathname,
          ...payload
        })
      });
    } catch (error) {
      console.debug('Media track failed', error);
    }
  };

  const flushRecording = async (payload?: { endedAt?: string; durationSeconds?: number }) => {
    if (recordingQueueRef.current.length === 0) return;
    try {
      if (getConsent() !== 'granted') return;
      const visitorId = getVisitorId();
      const sessionId = getSessionId();
      const events = recordingQueueRef.current.splice(0, recordingQueueRef.current.length);
      const sequence = recordingSequenceRef.current++;
      await fetch('/api/analytics/recording', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorId,
          sessionId,
          path: window.location.pathname,
          sequence,
          events,
          ...payload
        })
      });
    } catch (error) {
      console.debug('Recording flush failed', error);
    }
  };

  const pushRecordingEvent = (event: Record<string, any>) => {
    if (getConsent() !== 'granted') return;
    recordingQueueRef.current.push({ ts: Date.now(), ...event });
    if (recordingQueueRef.current.length >= 20) {
      flushRecording();
    }
  };

  useEffect(() => {
    if (getConsent() !== 'granted') return;
    const fetchTags = async () => {
      try {
        const res = await fetch('/api/analytics/tags');
        const json = await res.json();
        if (res.ok) {
          tagsRef.current = json.tags || [];
          evaluateTags('pageview', { path: pathname || window.location.pathname });
        }
      } catch (error) {
        console.debug('Tag manager fetch failed', error);
      }
    };
    fetchTags();
  }, [pathname]);

  useEffect(() => {
    if (getConsent() !== 'granted') return;
    const fetchExperiments = async () => {
      try {
        const res = await fetch(`/api/analytics/experiments?path=${encodeURIComponent(window.location.pathname)}`);
        const json = await res.json();
        if (!res.ok) return;
        const experiments: ExperimentDefinition[] = json.experiments || [];
        for (const experiment of experiments) {
          const key = `erilson_exp_${experiment.id}`;
          const existing = localStorage.getItem(key);
          if (existing) {
            try {
              experimentAssignmentsRef.current[experiment.name] = JSON.parse(existing);
            } catch {
              localStorage.removeItem(key);
            }
            continue;
          }

          const trafficRoll = Math.random() * 100;
          if (experiment.traffic_percent && trafficRoll > experiment.traffic_percent) continue;
          const totalWeight = experiment.variants.reduce((sum, variant) => sum + (variant.weight || 0), 0);
          let roll = Math.random() * totalWeight;
          let selected = experiment.variants[0];
          for (const variant of experiment.variants) {
            roll -= variant.weight || 0;
            if (roll <= 0) {
              selected = variant;
              break;
            }
          }
          const assignment = { experimentId: experiment.id, variantId: selected.id, variantName: selected.name };
          localStorage.setItem(key, JSON.stringify(assignment));
          experimentAssignmentsRef.current[experiment.name] = assignment;

          await fetch('/api/analytics/experiments/assign', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              visitorId: getVisitorId(),
              sessionId: getSessionId(),
              experimentId: experiment.id,
              variantId: selected.id
            })
          });
          trackEvent('experiment_assignment', { experiment: experiment.name, variant: selected.name });
        }

        (window as any).__erilsonExperiments = experimentAssignmentsRef.current;
        (window as any).erilsonAnalyticsConvert = async (experimentName: string, goal: string, value?: number) => {
          const assignment = experimentAssignmentsRef.current[experimentName];
          if (!assignment) return;
          await fetch('/api/analytics/experiments/convert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              visitorId: getVisitorId(),
              sessionId: getSessionId(),
              experimentId: assignment.experimentId,
              variantId: assignment.variantId,
              goal,
              value: value || 0
            })
          });
          trackEvent('experiment_conversion', { experiment: experimentName, variant: assignment.variantName, goal });
        };
      } catch (error) {
        console.debug('Experiment fetch failed', error);
      }
    };
    fetchExperiments();
  }, [pathname]);

  const fireTag = (tag: TagDefinition) => {
    const config = tag.tag_config || {};
    if (config.once !== false && firedTags.current.has(tag.id)) return;
    firedTags.current.add(tag.id);

    if (tag.tag_type === 'event') {
      const eventName = config.eventName || tag.name;
      trackEvent(eventName, { ...config.metadata, tagId: tag.id, source: 'tag-manager' });
      return;
    }

    if (tag.tag_type === 'script') {
      if (document.querySelector(`script[data-tag-id="${tag.id}"]`)) return;
      const script = document.createElement('script');
      script.setAttribute('data-tag-id', String(tag.id));
      if (config.src) {
        script.src = config.src;
        script.async = config.async !== false;
      }
      if (config.inline) {
        script.textContent = config.inline;
      }
      document.head.appendChild(script);
    }
  };

  const evaluateTags = (triggerType: string, payload?: Record<string, any>) => {
    if (getConsent() !== 'granted') return;
    tagsRef.current
      .filter((tag) => tag.trigger_type === triggerType)
      .forEach((tag) => {
        if (triggerType === 'pageview') {
          const path = payload?.path || window.location.pathname;
          if (!tag.trigger_match || matchValue(path, tag.trigger_match, tag.match_type)) {
            fireTag(tag);
          }
          return;
        }

        if (triggerType === 'click') {
          const label = payload?.label || '';
          if (!tag.trigger_match || matchValue(label, tag.trigger_match, tag.match_type)) {
            fireTag(tag);
          }
          return;
        }

        if (triggerType === 'scroll') {
          const percent = payload?.percent;
          const triggerPercent = Number(tag.trigger_match || 0);
          if (Number.isFinite(triggerPercent) && percent >= triggerPercent) {
            fireTag(tag);
          }
          return;
        }
      });
  };

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
          trackHeatmap({ eventType: 'scroll', yPercent: percent });
          evaluateTags('scroll', { percent: threshold });
          pushRecordingEvent({ type: 'scroll', percent });
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
      const xPercent = (event.clientX / window.innerWidth) * 100;
      const yPercent = (event.clientY / window.innerHeight) * 100;
      const el = target.closest('[data-analytics-label]') as HTMLElement | null;
      const label = el ? el.getAttribute('data-analytics-label') : null;
      if (label) {
        trackEvent('click', { label });
        evaluateTags('click', { label });
      }
      trackHeatmap({
        eventType: 'click',
        xPercent: typeof xPercent === 'number' ? Number(xPercent.toFixed(2)) : null,
        yPercent: typeof yPercent === 'number' ? Number(yPercent.toFixed(2)) : null,
        viewportW: window.innerWidth,
        viewportH: window.innerHeight,
        elementTag: el ? el.tagName.toLowerCase() : null,
        elementLabel: label || null
      });
      pushRecordingEvent({
        type: 'click',
        label: label || null,
        x: event.clientX,
        y: event.clientY
      });
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [pathname]);

  useEffect(() => {
    if (getConsent() !== 'granted') return;

    const handleFocus = (event: Event) => {
      const target = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
      if (!target) return;
      if (target.type === 'password' || target.type === 'hidden') return;
      const form = target.closest('form') as HTMLFormElement | null;
      const formId = form?.id || null;
      const formName = form?.getAttribute('name') || form?.getAttribute('data-analytics-label') || null;
      const key = formId || formName || 'form';
      if (!formStartRef.current.has(key)) {
        formStartRef.current.set(key, Date.now());
      }
      const timeSinceStart = Date.now() - (formStartRef.current.get(key) || Date.now());
      trackFormEvent({
        formId,
        formName,
        fieldName: target.name || target.id || null,
        fieldType: target.type || target.tagName.toLowerCase(),
        action: 'focus',
        valueLength: target.value?.length || 0,
        timeSinceStart
      });
      pushRecordingEvent({
        type: 'form_focus',
        formId,
        field: target.name || target.id || null
      });
    };

    const handleBlur = (event: Event) => {
      const target = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
      if (!target) return;
      if (target.type === 'password' || target.type === 'hidden') return;
      const form = target.closest('form') as HTMLFormElement | null;
      const formId = form?.id || null;
      const formName = form?.getAttribute('name') || form?.getAttribute('data-analytics-label') || null;
      const key = formId || formName || 'form';
      const timeSinceStart = Date.now() - (formStartRef.current.get(key) || Date.now());
      trackFormEvent({
        formId,
        formName,
        fieldName: target.name || target.id || null,
        fieldType: target.type || target.tagName.toLowerCase(),
        action: 'blur',
        valueLength: target.value?.length || 0,
        timeSinceStart
      });
    };

    const handleInput = (event: Event) => {
      const target = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
      if (!target) return;
      if (target.type === 'password' || target.type === 'hidden') return;
      const form = target.closest('form') as HTMLFormElement | null;
      const formId = form?.id || null;
      const formName = form?.getAttribute('name') || form?.getAttribute('data-analytics-label') || null;
      const key = formId || formName || 'form';
      const timeSinceStart = Date.now() - (formStartRef.current.get(key) || Date.now());
      trackFormEvent({
        formId,
        formName,
        fieldName: target.name || target.id || null,
        fieldType: target.type || target.tagName.toLowerCase(),
        action: 'input',
        valueLength: target.value?.length || 0,
        timeSinceStart
      });
    };

    const handleSubmit = (event: Event) => {
      const form = event.target as HTMLFormElement | null;
      if (!form) return;
      const formId = form.id || null;
      const formName = form.getAttribute('name') || form.getAttribute('data-analytics-label') || null;
      const key = formId || formName || 'form';
      const timeSinceStart = Date.now() - (formStartRef.current.get(key) || Date.now());
      trackFormEvent({
        formId,
        formName,
        action: 'submit',
        valueLength: null,
        timeSinceStart
      });
      formStartRef.current.delete(key);
    };

    document.addEventListener('focusin', handleFocus);
    document.addEventListener('focusout', handleBlur);
    document.addEventListener('input', handleInput, true);
    document.addEventListener('submit', handleSubmit, true);

    return () => {
      document.removeEventListener('focusin', handleFocus);
      document.removeEventListener('focusout', handleBlur);
      document.removeEventListener('input', handleInput, true);
      document.removeEventListener('submit', handleSubmit, true);
    };
  }, [pathname]);

  useEffect(() => {
    if (getConsent() !== 'granted') return;
    const lastMediaUpdate = new WeakMap<Element, number>();

    const handleMediaEvent = (event: Event, action: string) => {
      const target = event.target as HTMLMediaElement | null;
      if (!target) return;
      const label = target.getAttribute('data-analytics-label') || target.currentSrc || target.src || 'media';
      trackMediaEvent({
        mediaType: target.tagName.toLowerCase(),
        mediaLabel: label,
        action,
        currentTime: typeof target.currentTime === 'number' ? target.currentTime : null,
        duration: typeof target.duration === 'number' ? target.duration : null
      });
      pushRecordingEvent({
        type: `media_${action}`,
        label,
        currentTime: target.currentTime
      });
    };

    const handleTimeUpdate = (event: Event) => {
      const target = event.target as HTMLMediaElement | null;
      if (!target) return;
      const last = lastMediaUpdate.get(target) || 0;
      if (Date.now() - last < 10000) return;
      lastMediaUpdate.set(target, Date.now());
      handleMediaEvent(event, 'progress');
    };

    const handlePlay = (event: Event) => handleMediaEvent(event, 'play');
    const handlePause = (event: Event) => handleMediaEvent(event, 'pause');
    const handleEnded = (event: Event) => handleMediaEvent(event, 'ended');

    document.addEventListener('play', handlePlay, true);
    document.addEventListener('pause', handlePause, true);
    document.addEventListener('ended', handleEnded, true);
    document.addEventListener('timeupdate', handleTimeUpdate, true);

    return () => {
      document.removeEventListener('play', handlePlay, true);
      document.removeEventListener('pause', handlePause, true);
      document.removeEventListener('ended', handleEnded, true);
      document.removeEventListener('timeupdate', handleTimeUpdate, true);
    };
  }, [pathname]);

  useEffect(() => {
    if (getConsent() !== 'granted') return;
    if (recordingFlushRef.current) window.clearInterval(recordingFlushRef.current);
    recordingFlushRef.current = window.setInterval(() => flushRecording(), 10000);
    pushRecordingEvent({ type: 'pageview', path: pathname || window.location.pathname });
    return () => {
      if (recordingFlushRef.current) window.clearInterval(recordingFlushRef.current);
      flushRecording({ endedAt: new Date().toISOString() });
    };
  }, [pathname]);

  useEffect(() => {
    if (getConsent() !== 'granted') return;
    tagsRef.current
      .filter((tag) => tag.trigger_type === 'timer')
      .forEach((tag) => {
        if (timersRef.current[tag.id]) return;
        const delay = Number(tag.trigger_match || 0);
        if (!Number.isFinite(delay) || delay <= 0) return;
        timersRef.current[tag.id] = window.setTimeout(() => fireTag(tag), delay);
      });

    evaluateTags('pageview', { path: pathname || window.location.pathname });

    return () => {
      Object.values(timersRef.current).forEach((timerId) => window.clearTimeout(timerId));
      timersRef.current = {};
    };
  }, [pathname]);

  return null;
};

export default AnalyticsTracker;
