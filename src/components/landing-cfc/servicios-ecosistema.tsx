'use client';
import { useEffect, useRef, useState } from 'react';
import { AREAS, CFC_COLORS as C } from './data';

/**
 * Servicios — Scroll-driven storytelling cinemático.
 * 4 beats: Intro → ENTENDER → DECIDIR → EJECUTAR.
 * Cada beat activa su pilar con glow + crossfade. Línea conectora con partículas viajando.
 */

const COLORS_MAP = {
  finanzas: C.finanzas,
  estrategia: C.estrategia,
  tech: C.tech,
};

export function ServiciosEcosistema() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    let raf: number | null = null;
    function update() {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrolled = vh - rect.top;
      const total = rect.height + vh;
      const p = Math.max(0, Math.min(1, scrolled / total));
      setProgress(p);
    }
    function onScroll() {
      if (raf) return;
      raf = requestAnimationFrame(() => { update(); raf = null; });
    }
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Easing
  const ease = (x: number) => 1 - Math.pow(1 - Math.max(0, Math.min(1, x)), 3);
  const p = ease(Math.max(0, Math.min(1, (progress - 0.05) / 0.9)));

  // Smoothstep para crossfade limpio entre beats
  const ss = (a: number, b: number, x: number) => {
    const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
  };

  // Boundaries de beats
  const t01 = ss(0.18, 0.22, p);
  const t12 = ss(0.42, 0.46, p);
  const t23 = ss(0.66, 0.70, p);

  // Opacities
  const op0 = 1 - t01;
  const op1 = t01 * (1 - t12);
  const op2 = t12 * (1 - t23);
  const op3 = t23;

  // Progress en la línea (0→1 a lo largo del scroll)
  const linePct = Math.max(0, Math.min(1, (p - 0.15) / 0.7)) * 100;

  // Beat activo (para el indicador 01/02/03)
  const activeBeat = p >= 0.70 ? 3 : p >= 0.46 ? 2 : p >= 0.22 ? 1 : 0;

  return (
    <section
      ref={wrapperRef}
      id="servicios"
      className="relative"
      style={{
        height: '340vh',
        background: `linear-gradient(180deg, ${C.bg} 0%, ${C.bgCard} 50%, ${C.bg} 100%)`,
        borderTop: `1px solid ${C.border}`,
      }}
    >
      {/* Sticky storytelling stage */}
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col">
        {/* Ambient backgrounds — color cambia por beat */}
        <div className="absolute inset-0 pointer-events-none transition-opacity duration-700" style={{
          background: `radial-gradient(ellipse 70% 50% at 30% 40%, ${C.finanzas}15, transparent 60%)`,
          opacity: op1,
        }}/>
        <div className="absolute inset-0 pointer-events-none transition-opacity duration-700" style={{
          background: `radial-gradient(ellipse 70% 50% at 50% 50%, ${C.estrategia}20, transparent 60%)`,
          opacity: op2,
        }}/>
        <div className="absolute inset-0 pointer-events-none transition-opacity duration-700" style={{
          background: `radial-gradient(ellipse 70% 50% at 70% 40%, ${C.tech}15, transparent 60%)`,
          opacity: op3,
        }}/>

        {/* Constelación de fondo */}
        <div className="absolute inset-0 pointer-events-none opacity-20" style={{
          backgroundImage: `radial-gradient(circle 1px at 20% 30%, ${C.bronze}, transparent), radial-gradient(circle 1px at 65% 80%, ${C.bronze}, transparent), radial-gradient(circle 1px at 80% 25%, ${C.bronze}, transparent), radial-gradient(circle 1px at 35% 65%, ${C.bronze}, transparent)`,
        }}/>

        {/* ═══ HEADER ═══ */}
        <div className="relative z-10 px-6 md:px-12 lg:px-20 pt-10 md:pt-14 pb-4">
          <div className="mx-auto max-w-[1400px] text-center">
            <p className="text-[10px] font-mono font-bold uppercase tracking-[3px] mb-3" style={{ color: C.bronze }}>
              Servicios · Ecosistema integrado
            </p>
            <h2 className="text-[clamp(28px,4vw,48px)] leading-[1.05] font-medium tracking-tight" style={{
              color: C.ivory,
              fontFamily: "'Fraunces', Georgia, serif",
              letterSpacing: '-0.02em',
            }}>
              Tres pilares que <span className="italic" style={{ color: C.bronzeLight }}>trabajan juntos.</span>
            </h2>
          </div>
        </div>

        {/* ═══ INDICADOR DE BEATS — siempre visible ═══ */}
        <div className="relative z-10 px-6 md:px-12 lg:px-20 mt-2 mb-4">
          <div className="relative mx-auto max-w-[860px]">
            <div className="flex items-center justify-between gap-8 relative">
              {AREAS.map((a, i) => {
                const beatActive = activeBeat >= i + 1;
                const accent = COLORS_MAP[a.color];
                return (
                  <div key={a.etapa} className="relative z-10 flex flex-col items-center gap-2.5 flex-1">
                    <div className="relative w-4 h-4 rounded-full transition-all duration-500" style={{
                      background: beatActive ? accent : '#1a130e',
                      border: `2px solid ${accent}`,
                      boxShadow: beatActive
                        ? `0 0 0 6px ${accent}25, 0 0 24px ${accent}90`
                        : `0 0 0 2px ${accent}20`,
                      transform: beatActive ? 'scale(1.1)' : 'scale(1)',
                    }}>
                      {beatActive && (
                        <span className="absolute inset-0 rounded-full animate-ping" style={{
                          background: accent, opacity: 0.3,
                        }}/>
                      )}
                    </div>
                    <span className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[3px] transition-colors duration-500" style={{
                      color: beatActive ? accent : C.dim,
                    }}>
                      {a.etapa}
                    </span>
                    <span className="text-[8.5px] font-mono uppercase tracking-[2px]" style={{
                      color: C.dim,
                    }}>
                      0{i + 1} / 03
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Línea conectora — progresa con scroll */}
            <div className="absolute top-2 left-[16%] right-[16%] h-px -z-0" style={{
              background: `${C.bronze}20`,
            }}/>
            <div className="absolute top-2 left-[16%] h-px -z-0" style={{
              width: `calc(${linePct}% * 0.68)`,
              maxWidth: '68%',
              background: `linear-gradient(90deg, ${C.finanzas} 0%, ${C.estrategia} 50%, ${C.tech} 100%)`,
              boxShadow: `0 0 8px ${C.bronze}90`,
              transition: 'width .4s ease-out',
            }}/>
            {/* Partícula viajando */}
            {linePct > 5 && linePct < 95 && (
              <div className="absolute top-[6px] w-2 h-2 rounded-full pointer-events-none" style={{
                left: `calc(16% + ${linePct}% * 0.68 - 4px)`,
                background: C.goldFoil,
                boxShadow: `0 0 12px ${C.goldFoil}, 0 0 24px ${C.bronze}`,
                transition: 'left .4s ease-out',
                animation: 'cfcParticlePulse 1.4s ease-in-out infinite',
              }}/>
            )}
          </div>
        </div>

        {/* ═══ ESCENARIOS / BEATS ═══ */}
        <div className="relative z-10 flex-1 min-h-0 px-6 md:px-12 lg:px-20 pb-8 md:pb-12">
          <div className="relative mx-auto max-w-[1100px] h-full">
            {/* Beat 0 — Intro */}
            <BeatStage opacity={op0}>
              <div className="text-center max-w-2xl mx-auto pt-6 md:pt-12">
                <p className="text-[11px] font-mono uppercase tracking-[3px] mb-5" style={{ color: C.bronze }}>
                  El ciclo completo
                </p>
                <p className="text-[16px] md:text-[20px] leading-[1.6] mb-7 italic" style={{
                  color: C.muted,
                  fontFamily: "'Fraunces', Georgia, serif",
                }}>
                  No vendemos servicios sueltos. Acompañamos el ciclo completo:{' '}
                  <span style={{ color: C.bronzeLight }}>entender el negocio</span>, decidir la dirección y ejecutar con tecnología.
                </p>
                <p className="text-[12px] font-mono uppercase tracking-[2px]" style={{ color: C.dim }}>
                  ↓ Desplázate para conocer cada pilar
                </p>
              </div>
            </BeatStage>

            {/* Beats 1-3 — Áreas */}
            {AREAS.map((a, i) => (
              <BeatStage key={a.area} opacity={i === 0 ? op1 : i === 1 ? op2 : op3}>
                <AreaBeat area={a} index={i} />
              </BeatStage>
            ))}
          </div>
        </div>

        {/* ═══ FOOTER scroll indicator ═══ */}
        <div className="relative z-10 px-6 md:px-12 lg:px-20 pb-4 flex items-center justify-between text-[9px] font-mono uppercase tracking-[2px]" style={{ color: C.dim }}>
          <span>Capital Founder · Servicios</span>
          <span>
            <span style={{ color: C.bronze }}>{Math.round(p * 100).toString().padStart(2, '0')}%</span>
            <span style={{ color: 'rgba(255,255,255,.2)' }}> / </span>
            <span>100%</span>
          </span>
          <span className="hidden sm:inline">{activeBeat > 0 ? AREAS[activeBeat - 1]?.etapa : 'INTRO'}</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes cfcParticlePulse {
          0%,100% { transform: scale(1); box-shadow: 0 0 12px ${C.goldFoil}, 0 0 24px ${C.bronze}; }
          50% { transform: scale(1.5); box-shadow: 0 0 18px ${C.goldFoil}, 0 0 36px ${C.bronze}; }
        }
      `}</style>
    </section>
  );
}

/* ─── BeatStage: contenedor con crossfade absoluto ─── */
function BeatStage({ children, opacity }: { children: React.ReactNode; opacity: number }) {
  const visible = opacity > 0.02;
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        opacity,
        visibility: visible ? 'visible' : 'hidden',
        pointerEvents: opacity > 0.5 ? 'auto' : 'none',
        transition: 'opacity .25s ease',
      }}
    >
      <div className="w-full">{children}</div>
    </div>
  );
}

/* ─── AreaBeat: card cinemática de un pilar ─── */
function AreaBeat({ area, index }: { area: typeof AREAS[number]; index: number }) {
  const accent = COLORS_MAP[area.color];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-6 md:gap-10 items-center">
      {/* Izquierda — Título + descripción */}
      <div>
        <div className="inline-flex items-center gap-2 mb-5 px-3 py-1 rounded-full" style={{
          background: `${accent}15`,
          border: `1px solid ${accent}40`,
        }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}/>
          <span className="text-[10px] font-mono font-bold uppercase tracking-[2.5px]" style={{ color: accent }}>
            {area.etapa} · 0{index + 1} / 03
          </span>
        </div>
        <h3 className="text-[clamp(40px,5.5vw,72px)] leading-[1.02] mb-5 font-medium" style={{
          color: C.ivory,
          fontFamily: "'Fraunces', Georgia, serif",
          letterSpacing: '-0.025em',
        }}>
          {area.area}<span style={{ color: accent }}>.</span>
        </h3>
        <p className="text-[14px] md:text-[16px] leading-[1.7] max-w-md" style={{ color: C.muted }}>
          {area.subtitle}
        </p>
      </div>

      {/* Derecha — Lista de servicios con stagger */}
      <div className="relative rounded-2xl p-6 md:p-8 overflow-hidden" style={{
        background: `linear-gradient(135deg, ${C.bgCard}, rgba(20,15,12,.4))`,
        border: `1px solid ${accent}33`,
        backdropFilter: 'blur(16px)',
        boxShadow: `0 30px 60px -20px rgba(0,0,0,.7), 0 0 40px ${accent}12`,
      }}>
        {/* Halo accent en esquina */}
        <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full pointer-events-none blur-3xl" style={{
          background: `${accent}30`,
        }}/>
        {/* Top hairline */}
        <div className="absolute top-0 left-[8%] right-[8%] h-px" style={{
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        }}/>

        <p className="relative text-[10px] font-mono font-bold uppercase tracking-[2.5px] mb-5" style={{ color: accent }}>
          Servicios principales · {area.servicios.length}
        </p>
        <ul className="relative grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2.5">
          {area.servicios.map((s, j) => (
            <li
              key={s}
              className="flex items-start gap-2 text-[12.5px] md:text-[13px] leading-[1.5]"
              style={{
                color: 'rgba(240,233,221,.85)',
                animation: `cfcBeatItem .5s ${0.05 + j * 0.04}s cubic-bezier(.16,1,.3,1) both`,
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.5" className="mt-1 flex-shrink-0">
                <polyline points="4 12 10 18 20 6"/>
              </svg>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>

      <style jsx>{`
        @keyframes cfcBeatItem {
          from { opacity: 0; transform: translateX(-8px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
