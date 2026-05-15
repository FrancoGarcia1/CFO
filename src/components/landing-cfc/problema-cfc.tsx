'use client';
import { useEffect, useRef, useState } from 'react';
import { PROBLEMAS, CFC_COLORS as C } from './data';

/**
 * "El Problema" — 3 cards con SVG diagnósticos animados estilo dashboard/terminal.
 * Cada card tiene un visual interactivo que ilustra la fricción.
 * Inspirado en ServiciosLayers de Capital CFO.
 */

/* ─── SVG 1 — Gráfico financiero con caída + alertas ─── */
function ChartBroken({ accent, active }: { accent: string; active: boolean }) {
  return (
    <svg viewBox="0 0 140 70" className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="brokenGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.25" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Grid bg */}
      {[15, 30, 45, 60].map((y) => (
        <line key={y} x1="0" y1={y} x2="140" y2={y} stroke={accent} strokeWidth="0.3" strokeDasharray="2,3" opacity="0.15" />
      ))}
      {/* Línea histórica (subida) — luego cae sin sustento */}
      <path
        d="M5,55 L25,48 L45,40 L65,30 L85,22 L100,18"
        fill="none"
        stroke={accent}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeDasharray="160"
        strokeDashoffset={active ? 0 : 160}
        style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(.22,1,.36,1)' }}
      />
      {/* Caída brusca con dashed alerta */}
      <path
        d="M100,18 L115,38 L130,60"
        fill="none"
        stroke={accent}
        strokeWidth="1.2"
        strokeDasharray="3,3"
        strokeLinecap="round"
        opacity={active ? 0.9 : 0}
        style={{ transition: 'opacity .8s .8s ease', filter: `drop-shadow(0 0 3px ${accent})` }}
      />
      {/* Question mark al final (no se sabe qué pasa) */}
      <text x="130" y="64" fontSize="6" fontWeight="700" fill={accent} fontFamily="JetBrains Mono" opacity={active ? 1 : 0} style={{ transition: 'opacity .5s 1.6s' }}>?</text>
      {/* Dot final pulsante */}
      <circle cx="100" cy="18" r="2" fill={accent} opacity={active ? 1 : 0} style={{ transition: 'opacity .5s 1.2s' }}>
        {active && <animate attributeName="r" values="2;3.2;2" dur="1.6s" repeatCount="indefinite" />}
      </circle>
      {/* Alerta triangle */}
      <g transform="translate(118, 12)" opacity={active ? 0.7 : 0} style={{ transition: 'opacity .5s 1.4s' }}>
        <path d="M0,5 L3,0 L6,5 Z" fill="none" stroke={accent} strokeWidth="0.6" />
        <line x1="3" y1="1.5" x2="3" y2="3" stroke={accent} strokeWidth="0.5" />
        <circle cx="3" cy="4" r="0.3" fill={accent} />
      </g>
    </svg>
  );
}

/* ─── SVG 2 — Brújula sin norte fijo (dirección difusa) ─── */
function CompassLost({ accent, active }: { accent: string; active: boolean }) {
  return (
    <svg viewBox="0 0 140 70" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <g transform="translate(70, 35)">
        {/* Outer ring */}
        <circle cx="0" cy="0" r="26" fill="none" stroke={accent} strokeWidth="0.6" opacity="0.4" />
        {/* Inner ring */}
        <circle cx="0" cy="0" r="20" fill="none" stroke={accent} strokeWidth="0.4" opacity="0.25" strokeDasharray="1,3" />
        {/* Cardinal marks */}
        {[0, 90, 180, 270].map((deg) => {
          const r1 = 20, r2 = 25;
          const rad = (deg - 90) * Math.PI / 180;
          return (
            <line
              key={deg}
              x1={Math.cos(rad) * r1}
              y1={Math.sin(rad) * r1}
              x2={Math.cos(rad) * r2}
              y2={Math.sin(rad) * r2}
              stroke={accent}
              strokeWidth="0.6"
              opacity="0.6"
            />
          );
        })}
        {/* N label */}
        <text x="0" y="-30" textAnchor="middle" fontSize="5.5" fontWeight="700" fill={accent} fontFamily="JetBrains Mono">N</text>
        {/* Needle — girando errático (sin saber norte) */}
        <g style={{
          transformOrigin: 'center',
          animation: active ? 'cfcCompassErratic 6s ease-in-out infinite' : 'none',
        }}>
          <path d="M0,-16 L2.5,2 L0,4 L-2.5,2 Z" fill={accent} opacity="0.9" />
          <path d="M0,16 L2.5,-2 L0,-4 L-2.5,-2 Z" fill={accent} opacity="0.35" />
          <circle cx="0" cy="0" r="1.5" fill={accent} />
        </g>
        {/* Question marks orbiting */}
        {active && [0, 1, 2].map((i) => (
          <text
            key={i}
            x={Math.cos((i * 120 - 90) * Math.PI / 180) * 32}
            y={Math.sin((i * 120 - 90) * Math.PI / 180) * 32 + 1.5}
            textAnchor="middle"
            fontSize="6"
            fill={accent}
            opacity="0.4"
            style={{
              transformOrigin: 'center',
              animation: `cfcCompassFloat 3s ease-in-out ${i * 0.3}s infinite`,
            }}
          >?</text>
        ))}
      </g>
      <style jsx>{`
        @keyframes cfcCompassErratic {
          0%, 100% { transform: rotate(-15deg); }
          20% { transform: rotate(70deg); }
          40% { transform: rotate(-45deg); }
          60% { transform: rotate(110deg); }
          80% { transform: rotate(-20deg); }
        }
        @keyframes cfcCompassFloat {
          0%, 100% { opacity: 0.2; transform: translateY(0); }
          50% { opacity: 0.6; transform: translateY(-2px); }
        }
      `}</style>
    </svg>
  );
}

/* ─── SVG 3 — Engranajes con uno atascado (cuello de botella) ─── */
function GearsStuck({ accent, active }: { accent: string; active: boolean }) {
  return (
    <svg viewBox="0 0 140 70" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <symbol id="cfcGear" viewBox="-15 -15 30 30">
          <g>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
              const rad = deg * Math.PI / 180;
              return (
                <rect
                  key={deg}
                  x="-2"
                  y="-13.5"
                  width="4"
                  height="3.5"
                  fill="currentColor"
                  transform={`rotate(${deg})`}
                />
              );
            })}
            <circle cx="0" cy="0" r="10.5" fill="currentColor" />
            <circle cx="0" cy="0" r="5.5" fill={C.bg} />
            <circle cx="0" cy="0" r="2" fill="currentColor" />
          </g>
        </symbol>
      </defs>
      {/* Gear 1 — girando */}
      <g transform="translate(30, 35)" style={{
        transformOrigin: 'center',
        animation: active ? 'cfcGearSpin1 6s linear infinite' : 'none',
      }}>
        <use href="#cfcGear" width="30" height="30" x="-15" y="-15" color={accent} opacity="0.85" />
      </g>
      {/* Gear 2 — central, atascado, parpadea con alerta */}
      <g transform="translate(70, 35)">
        <use href="#cfcGear" width="38" height="38" x="-19" y="-19" color={accent} opacity={active ? 0.95 : 0.3} style={{
          filter: active ? `drop-shadow(0 0 6px ${accent})` : 'none',
          transition: 'opacity .6s, filter .6s',
        }} />
        {/* X marker — atascado */}
        {active && (
          <>
            <line x1="-5" y1="-5" x2="5" y2="5" stroke={C.bg} strokeWidth="2" />
            <line x1="-5" y1="5" x2="5" y2="-5" stroke={C.bg} strokeWidth="2" />
          </>
        )}
      </g>
      {/* Gear 3 — girando lento (depende del 2) */}
      <g transform="translate(110, 35)" style={{
        transformOrigin: 'center',
        animation: active ? 'cfcGearSpin2 9s linear infinite reverse' : 'none',
        opacity: active ? 0.4 : 0.6,
        transition: 'opacity .6s',
      }}>
        <use href="#cfcGear" width="26" height="26" x="-13" y="-13" color={accent} />
      </g>
      {/* Pulse alerta sobre el central */}
      {active && (
        <circle cx="70" cy="35" r="22" fill="none" stroke={accent} strokeWidth="0.5" opacity="0.5">
          <animate attributeName="r" values="22;28;22" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0;0.5" dur="1.8s" repeatCount="indefinite" />
        </circle>
      )}
      <style jsx>{`
        @keyframes cfcGearSpin1 { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes cfcGearSpin2 { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </svg>
  );
}

const VISUALS: Record<string, React.FC<{ accent: string; active: boolean }>> = {
  chart: ChartBroken,
  compass: CompassLost,
  cog: GearsStuck,
};

export function ProblemaCFC() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

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
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative px-6 md:px-12 lg:px-20 py-24 md:py-32 overflow-hidden"
      style={{
        background: C.bg,
        borderTop: `1px solid ${C.border}`,
      }}
    >
      {/* Grid futurista de fondo (más sutil) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]" style={{
        backgroundImage: `linear-gradient(${C.bronze} 1px, transparent 1px), linear-gradient(90deg, ${C.bronze} 1px, transparent 1px)`,
        backgroundSize: '90px 90px',
      }}/>

      {/* Aura ambient sutil */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[400px] h-[400px] rounded-full blur-[120px]" style={{
          top: '20%', right: '-5%',
          background: `radial-gradient(circle, ${C.bronze}10, transparent 60%)`,
        }}/>
      </div>

      <div className="relative mx-auto max-w-[1400px]">
        {/* Header */}
        <div className="max-w-3xl mb-14 md:mb-16">
          <div className="flex items-center gap-2 mb-4">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full animate-ping" style={{ background: C.bronze, opacity: 0.5 }}/>
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: C.bronze }}/>
            </span>
            <p className="text-[10px] font-mono font-bold uppercase tracking-[3px]" style={{ color: C.bronze }}>
              Diagnóstico · El reto del founder peruano
            </p>
          </div>
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

        {/* 3 cards con SVG diagnóstico */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative">
          {/* Línea conectora sutil entre cards (en desktop) */}
          <div className="hidden md:block absolute top-1/2 left-[8%] right-[8%] h-px -z-10" style={{
            background: `linear-gradient(90deg, transparent, ${C.bronze}25, ${C.bronze}40, ${C.bronze}25, transparent)`,
            opacity: visible ? 1 : 0,
            transition: 'opacity 1s 0.6s',
          }}/>

          {PROBLEMAS.map((p, i) => {
            const Visual = VISUALS[p.icon];
            const isHover = hoverIdx === i;
            return (
              <article
                key={p.n}
                onMouseEnter={() => setHoverIdx(i)}
                onMouseLeave={() => setHoverIdx(null)}
                className="relative rounded-xl overflow-hidden group cursor-default"
                style={{
                  background: `linear-gradient(180deg, ${C.bgCard}, rgba(20,15,12,.4))`,
                  border: `1px solid ${isHover ? C.bronze + '50' : C.border}`,
                  backdropFilter: 'blur(12px)',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(30px)',
                  transition: `opacity .8s ${0.15 * i}s cubic-bezier(.16,1,.3,1), transform .8s ${0.15 * i}s cubic-bezier(.16,1,.3,1), border-color .35s`,
                }}
              >
                {/* Top line animated */}
                <div className="absolute top-0 left-0 h-px" style={{
                  width: visible ? '100%' : '0%',
                  background: `linear-gradient(90deg, transparent, ${C.bronze}, transparent)`,
                  transition: `width 1.2s ${0.3 + i * 0.15}s cubic-bezier(.22,1,.36,1)`,
                }}/>

                {/* Halo glow on hover */}
                <div className="absolute -inset-px rounded-xl pointer-events-none transition-opacity duration-500" style={{
                  background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${C.bronze}10, transparent 70%)`,
                  opacity: isHover ? 1 : 0,
                }}/>

                {/* Card content */}
                <div className="relative p-6 md:p-7">
                  {/* Tag terminal-style + numero */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="inline-flex items-center gap-1.5 text-[8.5px] font-mono font-bold uppercase tracking-[2px] px-2 py-1 rounded" style={{
                      background: `${C.bronze}10`,
                      color: C.bronze,
                      border: `1px solid ${C.bronze}30`,
                    }}>
                      <span className="w-1 h-1 rounded-full" style={{ background: C.bronze, boxShadow: `0 0 4px ${C.bronze}` }}/>
                      Issue · {p.n} / 03
                    </span>
                    <span className="text-[40px] leading-none font-medium italic" style={{
                      color: C.bronze,
                      fontFamily: "'Fraunces', Georgia, serif",
                      opacity: 0.18,
                    }}>
                      {p.n}
                    </span>
                  </div>

                  {/* SVG diagnóstico — 110px alto */}
                  <div className="relative h-[100px] mb-5 rounded-md p-3 overflow-hidden" style={{
                    background: `linear-gradient(180deg, ${C.bronze}08, transparent 80%)`,
                    border: `1px solid ${C.bronze}15`,
                  }}>
                    {/* Pequeños tick marks de "monitor" */}
                    <span className="absolute top-1.5 left-1.5 flex gap-1">
                      <span className="w-1 h-1 rounded-full" style={{ background: '#ef4444', opacity: 0.7 }}/>
                      <span className="w-1 h-1 rounded-full" style={{ background: '#eab308', opacity: 0.7 }}/>
                      <span className="w-1 h-1 rounded-full" style={{ background: '#22c55e', opacity: 0.7 }}/>
                    </span>
                    <span className="absolute top-1.5 right-2 text-[7.5px] font-mono uppercase tracking-[1.5px]" style={{ color: C.dim }}>
                      LIVE
                    </span>
                    {Visual && <Visual accent={C.bronzeLight} active={visible} />}
                  </div>

                  <h3 className="text-[19px] md:text-[20px] mb-2.5 leading-tight tracking-tight font-medium" style={{
                    color: C.ivory,
                    fontFamily: "'Fraunces', Georgia, serif",
                    letterSpacing: '-0.01em',
                  }}>
                    {p.title}
                  </h3>
                  <p className="text-[13px] leading-[1.65]" style={{ color: C.muted }}>
                    {p.body}
                  </p>
                </div>

                {/* Bottom hairline accent (visible on hover) */}
                <div className="absolute bottom-0 left-0 right-0 h-px" style={{
                  background: `linear-gradient(90deg, transparent, ${C.bronze}, transparent)`,
                  opacity: isHover ? 0.7 : 0,
                  transition: 'opacity .4s',
                }}/>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
