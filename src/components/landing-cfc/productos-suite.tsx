'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { PRODUCTOS, CFC_COLORS as C } from './data';

const COLORS_MAP = {
  finanzas: C.finanzas,
  estrategia: C.estrategia,
  tech: C.tech,
};

/* ═══ Mini-previews por producto ═══ */

function PreviewKanban({ color }: { color: string }) {
  return (
    <div className="flex gap-1.5 w-full h-full items-end opacity-90">
      {[
        { h: 60, items: 3 }, { h: 80, items: 4 }, { h: 40, items: 2 },
      ].map((col, i) => (
        <div key={i} className="flex-1 flex flex-col gap-1 justify-end" style={{ height: '100%' }}>
          {Array.from({ length: col.items }).map((_, j) => (
            <div key={j} className="rounded-sm" style={{
              background: `${color}${20 + j * 15}`,
              height: '8px',
              animation: `cfcPreviewIn .4s ${0.1 + j * 0.08 + i * 0.15}s cubic-bezier(.16,1,.3,1) both`,
            }}/>
          ))}
        </div>
      ))}
    </div>
  );
}

function PreviewDoc({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 100 30" className="w-full h-full" preserveAspectRatio="none">
      <rect x="8" y="2" width="84" height="26" rx="1" fill="none" stroke={color} strokeWidth="0.6" opacity="0.4"/>
      {[6, 11, 16, 21].map((y, i) => (
        <line
          key={y}
          x1="14"
          y1={y}
          x2={14 + (50 - i * 8)}
          y2={y}
          stroke={color}
          strokeWidth="0.8"
          opacity="0.6"
          style={{ strokeDasharray: 50, strokeDashoffset: 50, animation: `cfcDraw 1.2s ${0.2 + i * 0.18}s ease-out forwards` }}
        />
      ))}
    </svg>
  );
}

function PreviewPeople({ color }: { color: string }) {
  return (
    <div className="flex -space-x-2 items-center w-full h-full justify-center opacity-85">
      {['CL', 'PA', 'SV', 'JT'].map((init, i) => (
        <div key={init} className="w-7 h-7 rounded-full flex items-center justify-center text-[8px] font-bold" style={{
          background: `linear-gradient(135deg, ${color}, ${color}aa)`,
          color: C.black,
          border: `1.5px solid ${C.bg}`,
          animation: `cfcPeopleIn .5s ${0.1 + i * 0.1}s cubic-bezier(.16,1,.3,1) both`,
        }}>
          {init}
        </div>
      ))}
      <span className="ml-1 text-[9px] font-mono" style={{ color }}>+12</span>
    </div>
  );
}

function PreviewPipeline({ color }: { color: string }) {
  return (
    <div className="flex items-center gap-1.5 w-full h-full">
      {['Lead', 'Pitch', 'Won'].map((s, i) => (
        <div key={s} className="flex-1 text-center">
          <div className="h-1.5 rounded-full" style={{
            background: i <= 1 ? color : `${color}40`,
            boxShadow: i <= 1 ? `0 0 4px ${color}` : 'none',
          }}/>
          <span className="text-[7.5px] font-mono mt-1 inline-block" style={{ color: i <= 1 ? color : C.dim }}>
            {s}
          </span>
        </div>
      ))}
    </div>
  );
}

function PreviewChart({ color }: { color: string }) {
  return (
    <div className="flex items-end gap-1 w-full h-full">
      {[40, 60, 50, 75, 65, 90].map((h, i) => (
        <div key={i} className="flex-1 rounded-t" style={{
          height: `${h}%`,
          background: i === 5 ? color : `${color}60`,
          boxShadow: i === 5 ? `0 0 6px ${color}` : 'none',
          animation: `cfcBarUp .6s ${0.1 + i * 0.08}s cubic-bezier(.16,1,.3,1) both`,
          transformOrigin: 'bottom',
        }}/>
      ))}
    </div>
  );
}

function PreviewStamp({ color }: { color: string }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg width="40" height="28" viewBox="0 0 40 28">
        <rect x="2" y="2" width="36" height="24" rx="2" fill="none" stroke={color} strokeWidth="0.8" opacity="0.5"/>
        <text x="20" y="17" textAnchor="middle" fontSize="8" fontWeight="700" fill={color} fontFamily="JetBrains Mono">v2.0</text>
        <circle cx="32" cy="6" r="3" fill={color}>
          <animate attributeName="r" values="3;4;3" dur="1.5s" repeatCount="indefinite"/>
        </circle>
      </svg>
    </div>
  );
}

function PreviewCockpit({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 100 30" className="w-full h-full" preserveAspectRatio="none">
      <circle cx="20" cy="15" r="10" fill="none" stroke={color} strokeWidth="1.5" opacity="0.4"/>
      <circle cx="20" cy="15" r="10" fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="62.8" strokeDashoffset="20" transform="rotate(-90 20 15)" style={{ filter: `drop-shadow(0 0 2px ${color})` }}/>
      <text x="20" y="18" textAnchor="middle" fontSize="6" fontWeight="700" fill={color} fontFamily="JetBrains Mono">77</text>
      <line x1="40" y1="10" x2="80" y2="10" stroke={color} strokeWidth="0.5" opacity="0.4"/>
      <line x1="40" y1="15" x2="70" y2="15" stroke={color} strokeWidth="0.5" opacity="0.6"/>
      <line x1="40" y1="20" x2="75" y2="20" stroke={color} strokeWidth="0.5" opacity="0.3"/>
    </svg>
  );
}

const PREVIEWS_BY_NAME: Record<string, (props: { color: string }) => JSX.Element> = {
  'Capital Projects': PreviewKanban,
  'Capital Knowledge': PreviewDoc,
  'Capital Talent': PreviewPeople,
  'Capital CRM': PreviewPipeline,
  'Capital QBR': PreviewChart,
  'Capital Deliverables': PreviewStamp,
  'Capital Command': PreviewCockpit,
};

/* ═══ Carrusel del mockup Capital CFO — 3 vistas auto-cycle ═══ */
function CapitalCfoMockupCarousel() {
  const [view, setView] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setView((v) => (v + 1) % 3), 4200);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <div
      className="hidden md:block w-44 h-44 lg:w-52 lg:h-52 flex-shrink-0 rounded-2xl relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${C.bronze}25, ${C.bronze}05)`,
        border: `1px solid ${C.bronze}35`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,.06), inset 0 0 30px rgba(0,0,0,.4)`,
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Header simulado siempre visible */}
      <div className="absolute top-2 left-2 right-2 z-10 flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#ef4444' }}/>
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#eab308' }}/>
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#22c55e' }}/>
        <span className="ml-auto text-[7px] font-mono uppercase tracking-[1.5px]" style={{ color: C.bronzeLight, opacity: 0.7 }}>
          {['CASHFLOW', 'KPIs', 'FORECAST'][view]}
        </span>
      </div>

      {/* Vista 0 — Cashflow (sparkline area) */}
      <svg className="absolute inset-x-3 top-7 bottom-6" viewBox="0 0 100 80" preserveAspectRatio="none" style={{
        opacity: view === 0 ? 1 : 0,
        transform: view === 0 ? 'scale(1)' : 'scale(1.04)',
        transition: 'opacity .55s ease-in-out, transform .55s ease-in-out',
      }}>
        <defs>
          <linearGradient id="cfoMini0" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.bronzeLight} stopOpacity="0.5"/>
            <stop offset="100%" stopColor={C.bronze} stopOpacity="0"/>
          </linearGradient>
        </defs>
        <path d="M5,60 L20,52 L35,55 L50,38 L65,42 L80,22 L95,18 L95,80 L5,80 Z" fill="url(#cfoMini0)"/>
        <path d="M5,60 L20,52 L35,55 L50,38 L65,42 L80,22 L95,18" fill="none" stroke={C.goldFoil} strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="95" cy="18" r="2.5" fill={C.goldFoil}>
          <animate attributeName="r" values="2.5;4;2.5" dur="2s" repeatCount="indefinite"/>
        </circle>
        <text x="8" y="13" fontSize="6" fontWeight="700" fill={C.bronzeLight} fontFamily="JetBrains Mono">+24%</text>
      </svg>

      {/* Vista 1 — KPI gauges */}
      <svg className="absolute inset-x-3 top-7 bottom-6" viewBox="0 0 100 80" preserveAspectRatio="xMidYMid meet" style={{
        opacity: view === 1 ? 1 : 0,
        transform: view === 1 ? 'scale(1)' : 'scale(1.04)',
        transition: 'opacity .55s ease-in-out, transform .55s ease-in-out',
      }}>
        {[
          { cx: 22, cy: 30, label: 'CR', val: 78, color: C.bronzeLight },
          { cx: 50, cy: 30, label: 'MR', val: 92, color: C.goldFoil },
          { cx: 78, cy: 30, label: 'BR', val: 64, color: C.bronze },
        ].map((g, i) => {
          const circumference = 2 * Math.PI * 9;
          const dashOffset = circumference - (g.val / 100) * circumference;
          return (
            <g key={i}>
              <circle cx={g.cx} cy={g.cy} r="9" fill="none" stroke={`${g.color}33`} strokeWidth="2.2" />
              <circle cx={g.cx} cy={g.cy} r="9" fill="none" stroke={g.color} strokeWidth="2.2"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                transform={`rotate(-90 ${g.cx} ${g.cy})`}
                style={{ filter: `drop-shadow(0 0 3px ${g.color})` }}
              />
              <text x={g.cx} y={g.cy + 1.5} textAnchor="middle" fontSize="5.5" fontWeight="700" fill={g.color} fontFamily="JetBrains Mono">{g.val}</text>
              <text x={g.cx} y={g.cy + 18} textAnchor="middle" fontSize="4.5" fontWeight="600" fill={C.dim} fontFamily="JetBrains Mono">{g.label}</text>
            </g>
          );
        })}
        {/* mini status bar abajo */}
        <line x1="10" y1="65" x2="90" y2="65" stroke={`${C.bronze}40`} strokeWidth="0.5" />
        <line x1="10" y1="65" x2="68" y2="65" stroke={C.goldFoil} strokeWidth="1.2" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 2px ${C.goldFoil})` }}/>
        <text x="50" y="74" textAnchor="middle" fontSize="4.5" fontWeight="700" fill={C.bronzeLight} fontFamily="JetBrains Mono">EBITDA · 78%</text>
      </svg>

      {/* Vista 2 — Forecast (dual área) */}
      <svg className="absolute inset-x-3 top-7 bottom-6" viewBox="0 0 100 80" preserveAspectRatio="none" style={{
        opacity: view === 2 ? 1 : 0,
        transform: view === 2 ? 'scale(1)' : 'scale(1.04)',
        transition: 'opacity .55s ease-in-out, transform .55s ease-in-out',
      }}>
        <defs>
          <linearGradient id="cfoFc1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.bronze} stopOpacity="0.5"/>
            <stop offset="100%" stopColor={C.bronze} stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="cfoFc2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.goldFoil} stopOpacity="0.4"/>
            <stop offset="100%" stopColor={C.goldFoil} stopOpacity="0"/>
          </linearGradient>
        </defs>
        {/* Real */}
        <path d="M5,55 L20,48 L35,50 L50,42 L65,38 L65,80 L5,80 Z" fill="url(#cfoFc1)"/>
        <path d="M5,55 L20,48 L35,50 L50,42 L65,38" fill="none" stroke={C.bronze} strokeWidth="1.4" strokeLinecap="round"/>
        {/* Forecast (dashed) */}
        <path d="M65,38 L80,28 L95,16" fill="none" stroke={C.goldFoil} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3,2.5"/>
        <path d="M65,38 L80,28 L95,16 L95,80 L65,80 Z" fill="url(#cfoFc2)" opacity="0.6"/>
        {/* divider vertical */}
        <line x1="65" y1="14" x2="65" y2="76" stroke={C.bronze} strokeWidth="0.4" opacity="0.4" strokeDasharray="1,2"/>
        <text x="40" y="13" fontSize="5" fontWeight="700" fill={C.muted} fontFamily="JetBrains Mono">REAL</text>
        <text x="78" y="13" fontSize="5" fontWeight="700" fill={C.goldFoil} fontFamily="JetBrains Mono">+Q4E</text>
        <circle cx="95" cy="16" r="2.5" fill={C.goldFoil}>
          <animate attributeName="r" values="2.5;4;2.5" dur="2s" repeatCount="indefinite"/>
        </circle>
      </svg>

      {/* Dots indicador */}
      <div className="absolute bottom-2 left-0 right-0 z-10 flex items-center justify-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setView(i); }}
            aria-label={`Vista ${i + 1}`}
            className="rounded-full transition-all"
            style={{
              width: view === i ? 14 : 4,
              height: 4,
              background: view === i ? C.bronzeLight : `${C.bronze}55`,
              transition: 'width .35s, background .35s',
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ═══ TiltCard ═══ */
function TiltCard({ children, accent, className, disabled = false }: {
  children: React.ReactNode;
  accent: string;
  className?: string;
  disabled?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, mx: 50, my: 50, active: false });

  function onMove(e: React.MouseEvent) {
    if (disabled || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    setTilt({
      ry: (x - 0.5) * 9,
      rx: -(y - 0.5) * 7,
      mx: x * 100,
      my: y * 100,
      active: true,
    });
  }
  function onLeave() {
    setTilt({ rx: 0, ry: 0, mx: 50, my: 50, active: false });
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`relative ${className ?? ''}`}
      style={{
        transform: `perspective(1100px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateZ(${tilt.active ? 8 : 0}px)`,
        transition: tilt.active
          ? 'transform .12s ease-out'
          : 'transform .45s cubic-bezier(.16,1,.3,1)',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Specular highlight overlay */}
      <div className="absolute inset-0 pointer-events-none rounded-xl" style={{
        background: `radial-gradient(circle 220px at ${tilt.mx}% ${tilt.my}%, ${accent}25, transparent 55%)`,
        opacity: tilt.active ? 1 : 0,
        transition: 'opacity .25s',
        mixBlendMode: 'screen',
      }}/>
      {children}
    </div>
  );
}

export function ProductosSuite() {
  const ref = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setEntered(true);
          io.disconnect();
        }
      },
      { threshold: 0.18 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const hero = PRODUCTOS[0];
  const rest = PRODUCTOS.slice(1);

  return (
    <section
      ref={ref}
      id="productos"
      className="relative px-6 md:px-12 lg:px-20 py-24 md:py-32"
      style={{
        background: C.bg,
        borderTop: `1px solid ${C.border}`,
      }}
      data-entered={entered ? 'true' : 'false'}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[600px] h-[600px] rounded-full blur-[140px]" style={{
          top: '10%', right: '-10%',
          background: `radial-gradient(circle, ${C.bronze}12, transparent 60%)`,
        }}/>
        <div className="absolute w-[500px] h-[500px] rounded-full blur-[120px]" style={{
          bottom: '5%', left: '-5%',
          background: `radial-gradient(circle, ${C.goldFoil}08, transparent 60%)`,
        }}/>
      </div>

      <div className="relative mx-auto max-w-[1400px]">
        {/* Header — más corto porque el mensaje principal ya se contó arriba en SuiteTransition */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <p className="text-[10px] font-mono font-bold uppercase tracking-[3px] mb-3" style={{
              color: C.bronze,
              opacity: entered ? 1 : 0,
              transition: 'opacity .7s cubic-bezier(.16,1,.3,1)',
            }}>
              El detalle · 8 productos
            </p>
            <p className="text-[15px] leading-relaxed" style={{
              color: C.muted,
              opacity: entered ? 1 : 0,
              transform: entered ? 'translateY(0)' : 'translateY(10px)',
              transition: 'opacity .8s .15s cubic-bezier(.16,1,.3,1), transform .8s .15s cubic-bezier(.16,1,.3,1)',
            }}>
              Cada producto resuelve un dolor real que vivimos como firma. Capital CFO ya está en producción — el resto sale a lo largo del año.
            </p>
          </div>
          <div className="flex-shrink-0 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[2px]" style={{
            color: C.dim,
            opacity: entered ? 1 : 0,
            transition: 'opacity .8s .35s cubic-bezier(.16,1,.3,1)',
          }}>
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full animate-ping" style={{ background: C.bronze, opacity: 0.5 }}/>
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: C.bronze }}/>
            </span>
            1 activo · 7 próximamente
          </div>
        </div>

        {/* ═══ HERO CARD — Capital CFO Amex metallic con tilt ═══ */}
        <div
          style={{
            perspective: '1400px',
            marginBottom: 20,
            opacity: entered ? 1 : 0,
            transform: entered ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity .8s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1)',
          }}
        >
          <TiltCard accent={C.bronze}>
            <Link
              href={hero.href ?? '#'}
              className="relative block p-7 md:p-10 rounded-2xl group overflow-hidden"
              style={{
                background: `linear-gradient(135deg, #1a1108 0%, #0a0705 50%, #1a1108 100%)`,
                border: `1px solid ${C.bronze}60`,
                boxShadow: `
                  0 1px 0 rgba(255,255,255,.08) inset,
                  0 -1px 0 rgba(0,0,0,.6) inset,
                  0 40px 80px -30px rgba(0,0,0,.85),
                  0 0 60px ${C.bronze}18
                `,
              }}
            >
              {/* Gold top sheen line */}
              <div className="absolute top-0 left-[5%] right-[5%] h-px" style={{
                background: `linear-gradient(90deg, transparent, ${C.bronze}, ${C.goldFoil}, ${C.bronze}, transparent)`,
              }}/>
              {/* Subtle carbon texture */}
              <div className="absolute inset-0 pointer-events-none opacity-[.025]" style={{
                backgroundImage: `repeating-linear-gradient(45deg, ${C.bronze} 0, ${C.bronze} 1px, transparent 1px, transparent 3px)`,
              }}/>
              {/* Gold foil corner */}
              <div className="absolute top-0 right-0 w-60 h-60 pointer-events-none" style={{
                background: `radial-gradient(circle at 100% 0%, ${C.bronze}28, transparent 65%)`,
              }}/>
              {/* Inner halo */}
              <div className="absolute -inset-1 rounded-2xl blur-3xl pointer-events-none opacity-25" style={{
                background: `radial-gradient(ellipse 60% 50% at 70% 50%, ${C.bronze}40, transparent 70%)`,
              }}/>

              <div className="relative grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-center">
                <div>
                  <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-[3px] px-2.5 py-1 rounded" style={{
                      background: `linear-gradient(135deg, ${C.bronzeLight}, ${C.bronze})`,
                      color: C.black,
                      boxShadow: `0 4px 12px -4px ${C.bronze}80`,
                    }}>
                      ⭑ Producto activo
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-[2px]" style={{ color: C.dim }}>
                      {hero.tag} · {hero.pilar}
                    </span>
                  </div>
                  <h3 className="text-[40px] md:text-[52px] leading-[1.02] font-medium tracking-tight mb-4" style={{
                    color: C.ivory,
                    fontFamily: "'Fraunces', Georgia, serif",
                    letterSpacing: '-0.025em',
                  }}>
                    <span style={{
                      color: 'transparent',
                      backgroundImage: `linear-gradient(95deg, ${C.bronzeLight}, ${C.goldFoil}, ${C.bronze})`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                    }}>Capital</span>
                    <span style={{ color: C.ivory }}> CFO</span>
                  </h3>
                  <p className="text-[14px] md:text-[15.5px] leading-[1.7] max-w-2xl mb-6" style={{ color: C.muted }}>
                    {hero.descripcion}
                  </p>
                  <div className="inline-flex items-center gap-2 text-[12px] font-mono uppercase tracking-[2px] transition-transform group-hover:translate-x-1" style={{
                    color: C.bronzeLight,
                  }}>
                    Explorar producto
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </div>
                </div>

                {/* Mini dashboard — carrusel 3 vistas */}
                <CapitalCfoMockupCarousel />
              </div>
            </Link>
          </TiltCard>
        </div>

        {/* ═══ GRID DE 7 PLACEHOLDERS — entrada teatral en abanico ═══ */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          style={{ perspective: '1400px' }}
        >
          {rest.map((p, i) => {
            const accent = COLORS_MAP[p.color];
            const Preview = PREVIEWS_BY_NAME[p.nombre];

            return (
              <div
                key={p.nombre}
                style={{
                  opacity: entered ? 1 : 0,
                  transform: entered ? 'translateY(0)' : 'translateY(20px)',
                  transition: `opacity .6s ${0.15 + i * 0.06}s cubic-bezier(.16,1,.3,1), transform .6s ${0.15 + i * 0.06}s cubic-bezier(.16,1,.3,1)`,
                }}
              >
                <TiltCard accent={accent}>
                  <article
                    className="relative p-6 rounded-xl group transition-all duration-300"
                    style={{
                      background: `linear-gradient(180deg, ${C.bgCard}, rgba(20,15,12,.4))`,
                      border: `1px solid ${C.border}`,
                      backdropFilter: 'blur(12px)',
                      boxShadow: `0 10px 24px -12px rgba(0,0,0,.55)`,
                    }}
                  >
                    {/* Top accent hairline */}
                    <div className="absolute top-0 left-[12%] right-[12%] h-px opacity-50 group-hover:opacity-90 transition-opacity" style={{
                      background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
                    }}/>
                    {/* Halo behind */}
                    <div className="absolute -inset-px rounded-xl pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100" style={{
                      background: `radial-gradient(ellipse at center, ${accent}10, transparent 70%)`,
                    }}/>

                    {/* Tag próximamente */}
                    <div className="relative flex items-center justify-between mb-4">
                      <span className="text-[8.5px] font-mono font-bold uppercase tracking-[2.5px] px-2 py-0.5 rounded" style={{
                        background: 'rgba(255,255,255,.03)',
                        color: C.dim,
                        border: `1px solid rgba(255,255,255,.10)`,
                      }}>
                        Próximamente
                      </span>
                      <span className="text-[9px] font-mono uppercase tracking-[2px]" style={{ color: accent, opacity: 0.7 }}>
                        {p.pilar}
                      </span>
                    </div>

                    <h3 className="relative text-[20px] md:text-[22px] mb-2 leading-tight font-medium tracking-tight" style={{
                      color: C.ivory,
                      fontFamily: "'Fraunces', Georgia, serif",
                      letterSpacing: '-0.01em',
                      opacity: 0.9,
                    }}>
                      {p.nombre}
                    </h3>

                    <p className="relative text-[10.5px] font-mono uppercase tracking-[1.5px] mb-3" style={{ color: accent, opacity: 0.75 }}>
                      {p.tag}
                    </p>

                    <p className="relative text-[12.5px] leading-[1.55] mb-4" style={{ color: 'rgba(255,255,255,.62)' }}>
                      {p.descripcion}
                    </p>

                    {/* Mini preview */}
                    {Preview && (
                      <div className="relative h-12 mt-4 rounded-md overflow-hidden p-2" style={{
                        background: `linear-gradient(180deg, ${accent}08, transparent 80%)`,
                        border: `1px solid ${accent}15`,
                      }}>
                        <Preview color={accent} />
                      </div>
                    )}

                    {/* Decorative dot pattern */}
                    <div className="absolute top-3 right-3 flex gap-0.5 opacity-30">
                      {[0, 1, 2].map((d) => (
                        <span key={d} className="w-1 h-1 rounded-full" style={{ background: accent }}/>
                      ))}
                    </div>
                  </article>
                </TiltCard>
              </div>
            );
          })}
        </div>

        {/* Roadmap label */}
        <p className="mt-12 text-center text-[11px] font-mono italic uppercase tracking-[2px]" style={{
          color: C.dim,
          opacity: entered ? 1 : 0,
          transition: `opacity .8s ${600 + rest.length * 110 + 300}ms cubic-bezier(.16,1,.3,1)`,
        }}>
          Roadmap 2026 · construyendo la firma del futuro
        </p>
      </div>

      <style jsx global>{`
        @keyframes cfcSuiteReveal { to { opacity: 1; transform: translateY(0); filter: blur(0); } }
        @keyframes cfcPreviewIn { from { opacity: 0; transform: scaleX(0); transform-origin: left; } to { opacity: 1; transform: scaleX(1); } }
        @keyframes cfcDraw { to { stroke-dashoffset: 0; } }
        @keyframes cfcPeopleIn { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes cfcBarUp { from { opacity: 0; transform: scaleY(0); } to { opacity: 1; transform: scaleY(1); } }
      `}</style>
    </section>
  );
}
