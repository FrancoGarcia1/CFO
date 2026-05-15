'use client';
import { useEffect, useRef, useState } from 'react';
import { PROBLEMAS, CFC_COLORS as C } from './data';

/**
 * Sección "El Problema" — 3 cards con línea superior animada al entrar a viewport.
 * Misma "escuela" cinematográfica que CFO pero con tratamiento editorial (Fraunces).
 */

function Icon({ name }: { name: string }) {
  const props = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  switch (name) {
    case 'chart':
      return (
        <svg {...props}>
          <line x1="3" y1="21" x2="21" y2="21" />
          <rect x="6" y="14" width="3" height="6" />
          <rect x="11" y="9" width="3" height="11" />
          <rect x="16" y="4" width="3" height="16" />
        </svg>
      );
    case 'compass':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
      );
    case 'cog':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      );
    default:
      return null;
  }
}

export function ProblemaCFC() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative px-6 md:px-12 lg:px-20 py-24 md:py-32" style={{
      background: C.bg,
      borderTop: `1px solid ${C.border}`,
    }}>
      <div className="mx-auto max-w-[1400px]">
        {/* Eyebrow + título */}
        <div className="max-w-3xl mb-14">
          <p className="text-[10px] font-mono font-bold uppercase tracking-[3px] mb-4" style={{ color: C.bronze }}>
            El reto del founder peruano
          </p>
          <h2 className="text-[clamp(32px,4.5vw,52px)] leading-[1.05] font-medium tracking-tight mb-5" style={{
            color: C.ivory,
            fontFamily: "'Fraunces', Georgia, serif",
            letterSpacing: '-0.02em',
          }}>
            3 fricciones que <span className="italic" style={{ color: C.bronzeLight }}>frenan</span> el crecimiento.
          </h2>
          <p className="text-[15px] leading-relaxed max-w-2xl" style={{ color: C.muted }}>
            La mayoría de empresas medianas en Perú no fallan por falta de oportunidad — fallan por falta de claridad, dirección y procesos. Estos son los tres patrones que vemos en todos lados.
          </p>
        </div>

        {/* 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PROBLEMAS.map((p, i) => (
            <article
              key={p.n}
              className="relative p-7 rounded-xl group transition-all duration-500 hover:-translate-y-1"
              style={{
                background: `linear-gradient(180deg, ${C.bgCard}, rgba(20,15,12,.5))`,
                border: `1px solid ${C.border}`,
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(30px)',
                transition: `opacity .8s ${0.15 * i}s cubic-bezier(.16,1,.3,1), transform .8s ${0.15 * i}s cubic-bezier(.16,1,.3,1), border-color .3s`,
              }}
            >
              {/* Línea superior animada (cuando entra a viewport) */}
              <div className="absolute top-0 left-0 h-px overflow-hidden" style={{
                width: visible ? '100%' : '0%',
                background: `linear-gradient(90deg, transparent, ${C.bronze}, transparent)`,
                transition: `width 1.2s ${0.3 + i * 0.15}s cubic-bezier(.22,1,.36,1)`,
              }}/>

              {/* Número y icon row */}
              <div className="flex items-start justify-between mb-6">
                <div className="w-11 h-11 rounded-lg flex items-center justify-center" style={{
                  background: `${C.bronze}10`,
                  border: `1px solid ${C.border}`,
                  color: C.bronzeLight,
                }}>
                  <Icon name={p.icon} />
                </div>
                <span className="text-[28px] font-mono tabular-nums leading-none italic" style={{
                  color: C.bronze,
                  fontFamily: "'Fraunces', Georgia, serif",
                  opacity: 0.5,
                }}>
                  {p.n}
                </span>
              </div>

              <h3 className="text-[20px] md:text-[22px] mb-3 leading-tight tracking-tight font-medium" style={{
                color: C.ivory,
                fontFamily: "'Fraunces', Georgia, serif",
                letterSpacing: '-0.01em',
              }}>
                {p.title}
              </h3>
              <p className="text-[13.5px] leading-[1.65]" style={{ color: C.muted }}>
                {p.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
