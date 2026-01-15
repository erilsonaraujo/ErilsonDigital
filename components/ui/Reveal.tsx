'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  as?: keyof HTMLElementTagNameMap;
  delayMs?: number;
  y?: number;
};

const Reveal: React.FC<RevealProps> = ({ children, className, as = 'div', delayMs = 0, y = 14 }) => {
  const reducedMotion = usePrefersReducedMotion();
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  const Tag = useMemo(() => as, [as]) as unknown as keyof JSX.IntrinsicElements;

  useEffect(() => {
    if (reducedMotion) {
      setVisible(true);
      return;
    }

    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { root: null, threshold: 0.12, rootMargin: '120px 0px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <div
      ref={elementRef}
      className={['reveal', visible ? 'reveal--in' : 'reveal--out'].join(' ')}
      style={
        {
          '--reveal-delay': `${delayMs}ms`,
          '--reveal-y': `${y}px`,
        } as React.CSSProperties
      }
    >
      <Tag className={className}>{children}</Tag>
    </div>
  );
};

export default Reveal;
