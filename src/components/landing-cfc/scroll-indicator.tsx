'use client';
import { useEffect, useState } from 'react';
import { CFC_COLORS as C } from './data';

/**
 * Scroll indicator fijo a la derecha, chevrons up/down.
 * Se desvanece cerca del final del documento o cuando el hero está visible al inicio.
 */
export function ScrollIndicator() {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      // Aparece después de 30vh, se esconde a 95% del scroll
      const progress = max > 0 ? y / max : 0;
      setHidden(y < window.innerHeight * 0.3 || progress > 0.95);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function scrollBy(dir: 1 | -1) {
    window.scrollBy({ top: dir * window.innerHeight * 0.85, behavior: 'smooth' });
  }

  return (
    <div
      className="fixed right-4 md:right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-2"
      style={{
        opacity: hidden ? 0 : 1,
        pointerEvents: hidden ? 'none' : 'auto',
        transform: `translateY(-50%) translateX(${hidden ? 12 : 0}px)`,
        transition: 'opacity .45s cubic-bezier(.16,1,.3,1), transform .45s cubic-bezier(.16,1,.3,1)',
      }}
    >
      {[
        { dir: -1 as const, label: 'Sección anterior', path: <polyline points="18 15 12 9 6 15" /> },
        { dir: 1 as const, label: 'Sección siguiente', path: <polyline points="6 9 12 15 18 9" /> },
      ].map((b) => (
        <button
          key={b.dir}
          onClick={() => scrollBy(b.dir)}
          aria-label={b.label}
          className="group relative w-9 h-9 rounded-md flex items-center justify-center"
          style={{
            border: `1px solid ${C.bronze}30`,
            background: `${C.bgCard}cc`,
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            transition: 'border-color .25s, background .25s, transform .25s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = `${C.bronze}80`;
            e.currentTarget.style.background = `${C.bronze}18`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = `${C.bronze}30`;
            e.currentTarget.style.background = `${C.bgCard}cc`;
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.bronzeLight} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {b.path}
          </svg>
        </button>
      ))}
    </div>
  );
}
