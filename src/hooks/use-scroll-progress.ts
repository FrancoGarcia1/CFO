'use client';

import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

/**
 * Hook que retorna un progress (0 → 1) basado en cuánto el elemento
 * ha scrolleado a través del viewport.
 *
 * progress = 0 cuando el top del elemento entra al viewport desde abajo
 * progress = 1 cuando el bottom del elemento sale del viewport por arriba
 *
 * Usado para sincronizar animaciones al scroll (estilo Apple / Framer Scroll Sequence).
 */
export function useScrollProgress(ref: RefObject<HTMLElement>): number {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function update() {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh;
      const scrolled = vh - rect.top;
      const p = Math.max(0, Math.min(1, scrolled / total));
      setProgress(p);
    }

    function onScroll() {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        update();
        rafRef.current = null;
      });
    }

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [ref]);

  return progress;
}

/** Linear interpolation between two values */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Map a value from range [inMin, inMax] to [outMin, outMax], clamped to output range */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number {
  const t = (value - inMin) / (inMax - inMin);
  const clamped = Math.max(0, Math.min(1, t));
  return outMin + clamped * (outMax - outMin);
}
