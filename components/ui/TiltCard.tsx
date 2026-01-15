'use client';

import React, { useMemo, useRef } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

type TiltCardProps = {
  children: React.ReactNode;
  className?: string;
  strength?: number;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const TiltCard: React.FC<TiltCardProps> = ({ children, className, strength = 9 }) => {
  const reducedMotion = usePrefersReducedMotion();
  const elementRef = useRef<HTMLDivElement | null>(null);

  const handlers = useMemo(() => {
    if (reducedMotion) return {};

    const onMove = (event: React.MouseEvent<HTMLDivElement>) => {
      const element = elementRef.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      const ry = clamp((px - 0.5) * 2, -1, 1) * strength;
      const rx = clamp((0.5 - py) * 2, -1, 1) * strength;
      element.style.setProperty('--tilt-rx', `${rx}deg`);
      element.style.setProperty('--tilt-ry', `${ry}deg`);
      element.style.setProperty('--tilt-x', `${px * 100}%`);
      element.style.setProperty('--tilt-y', `${py * 100}%`);
    };

    const onLeave = () => {
      const element = elementRef.current;
      if (!element) return;
      element.style.setProperty('--tilt-rx', `0deg`);
      element.style.setProperty('--tilt-ry', `0deg`);
      element.style.setProperty('--tilt-x', `50%`);
      element.style.setProperty('--tilt-y', `50%`);
    };

    return { onMouseMove: onMove, onMouseLeave: onLeave };
  }, [reducedMotion, strength]);

  return (
    <div
      ref={elementRef}
      className={['tilt-card', className || ''].join(' ')}
      style={
        {
          '--tilt-rx': '0deg',
          '--tilt-ry': '0deg',
          '--tilt-x': '50%',
          '--tilt-y': '50%',
        } as React.CSSProperties
      }
      {...handlers}
    >
      {children}
    </div>
  );
};

export default TiltCard;
