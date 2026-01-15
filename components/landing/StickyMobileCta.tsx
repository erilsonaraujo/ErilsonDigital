'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { usePrefersReducedMotion } from '@/components/ui/usePrefersReducedMotion';

type StickyMobileCtaProps = {
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  hideWhenNearId?: string;
};

const StickyMobileCta: React.FC<StickyMobileCtaProps> = ({
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  hideWhenNearId = 'form',
}) => {
  const reducedMotion = usePrefersReducedMotion();
  const [hidden, setHidden] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const target = document.getElementById(hideWhenNearId);
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { root: null, threshold: 0.2, rootMargin: '180px 0px' }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hideWhenNearId]);

  useEffect(() => {
    if (reducedMotion) return;
    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, [reducedMotion]);

  return (
    <div
      className={[
        'fixed inset-x-0 bottom-0 z-[60] md:hidden',
        'pb-[calc(env(safe-area-inset-bottom)+12px)] px-4',
        hidden ? 'pointer-events-none opacity-0 translate-y-6' : 'opacity-100 translate-y-0',
        'transition-all duration-500',
      ].join(' ')}
    >
      <div className="rounded-2xl border border-graphite-800 bg-ink-950/80 backdrop-blur-xl shadow-2xl p-3">
        <div className="flex gap-2">
          {secondaryLabel && secondaryHref && (
            <a href={secondaryHref} className="secondary-cta flex-1 justify-center py-3">
              {secondaryLabel}
            </a>
          )}
          <a href={primaryHref} className="primary-cta flex-1 justify-center py-3" data-analytics-label="sticky-mobile-cta">
            {primaryLabel} <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default StickyMobileCta;

