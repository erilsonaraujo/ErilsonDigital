'use client';

import React, { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

type ParallaxProps = {
  children?: React.ReactNode;
  className?: string;
  speed?: number;
  offset?: number;
};

const Parallax: React.FC<ParallaxProps> = ({ children, className, speed = 0.12, offset = 0 }) => {
  const reducedMotion = usePrefersReducedMotion();
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reducedMotion) return;

    const element = elementRef.current;
    if (!element) return;

    let raf = 0;
    let scheduled = false;

    const render = () => {
      scheduled = false;
      const rect = element.getBoundingClientRect();
      const viewportH = window.innerHeight || 1;
      const progress = (rect.top + rect.height * 0.5 - viewportH * 0.5) / viewportH;
      const translateY = (progress * 120 + offset) * speed;
      element.style.transform = `translate3d(0, ${translateY}px, 0)`;
    };

    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      raf = window.requestAnimationFrame(render);
    };

    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.cancelAnimationFrame(raf);
    };
  }, [offset, reducedMotion, speed]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
};

export default Parallax;
