'use client';
import { useEffect, useRef, useState } from 'react';
import { SERVICES } from './data';

const ACCENTS = ['#a8c47a', '#c8a15a', '#d9925a', '#c8a15a', '#9ba8d4', '#c8a15a'];

/* ═══════════════════════════════════════════════════════
   PREVIEWS — mini micro-animaciones por módulo
   ═══════════════════════════════════════════════════════ */

type PreviewProps = { accent: string };

function PreviewDashboard({ accent }: PreviewProps) {
  return (
    <svg viewBox="0 0 200 70" className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      <line x1="0" y1="55" x2="200" y2="55" stroke={accent} strokeWidth="0.4" opacity="0.2" strokeDasharray="2,2" />
      <path
        d="M0,55 L30,42 L60,48 L90,30 L120,36 L150,18 L180,24 L200,14 L200,70 L0,70 Z"
        fill="url(#areaGrad)"
      />
      <path
        d="M0,55 L30,42 L60,48 L90,30 L120,36 L150,18 L180,24 L200,14"
        fill="none"
        stroke={accent}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 0 3px ${accent})` }}
      />
      <circle cx="200" cy="14" r="3" fill={accent}>
        <animate attributeName="r" values="3;5;3" dur="1.6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.4;1" dur="1.6s" repeatCount="indefinite" />
      </circle>
      <text x="8" y="16" fontSize="10" fontWeight="700" fill={accent} fontFamily="JetBrains Mono, monospace">
        77
      </text>
      <text x="26" y="16" fontSize="7" fill={accent} opacity="0.6" fontFamily="JetBrains Mono, monospace">
        /100
      </text>
    </svg>
  );
}

function PreviewForecast({ accent }: PreviewProps) {
  return (
    <svg viewBox="0 0 200 70" className="w-full h-full" preserveAspectRatio="none">
      <path d="M0,50 L40,46 L80,40 L100,34" fill="none" stroke={accent} strokeWidth="1.6" strokeLinecap="round" />
      <path
        d="M100,34 L130,24 L160,16 L200,8"
        fill="none"
        stroke={accent}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeDasharray="4,3"
        opacity="0.85"
        style={{ animation: 'dashMarch 2.5s linear infinite' }}
      />
      <line x1="100" y1="0" x2="100" y2="70" stroke={accent} strokeWidth="0.4" strokeDasharray="1,2" opacity="0.35" />
      <text x="104" y="8" fontSize="6" fill={accent} opacity="0.65" fontFamily="JetBrains Mono, monospace">
        HOY
      </text>
      <circle cx="100" cy="34" r="2.5" fill={accent} />
      <circle cx="200" cy="8" r="3.5" fill={accent}>
        <animate attributeName="r" values="3.5;5.5;3.5" dur="1.4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.45;1" dur="1.4s" repeatCount="indefinite" />
      </circle>
      <g transform="translate(155,30)">
        <rect x="0" y="0" width="40" height="14" rx="1" fill={accent} opacity="0.15" />
        <text x="20" y="9.5" textAnchor="middle" fontSize="8" fontWeight="700" fill={accent} fontFamily="JetBrains Mono, monospace">
          +24%
        </text>
      </g>
    </svg>
  );
}

function PreviewSimulador({ accent }: PreviewProps) {
  const [pct, setPct] = useState(0.5);
  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const tick = (t: number) => {
      const elapsed = (t - start) / 1000;
      setPct(Math.sin(elapsed * 0.9) * 0.32 + 0.5);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const income = Math.round(20000 + pct * 20000);

  return (
    <div className="w-full h-full flex flex-col justify-center gap-3 px-1">
      <div>
        <div className="flex justify-between items-baseline mb-1.5">
          <span className="text-[9px] font-mono uppercase tracking-[1.5px]" style={{ color: accent, opacity: 0.7 }}>
            Ingresos
          </span>
          <span className="text-[9px] font-mono tabular-nums" style={{ color: accent }}>
            {Math.round(pct * 100)}%
          </span>
        </div>
        <div className="h-1.5 rounded-full relative" style={{ background: `${accent}20` }}>
          <div
            className="absolute top-0 left-0 h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, ${accent}80, ${accent})`,
              width: `${pct * 100}%`,
              boxShadow: `0 0 8px ${accent}80`,
            }}
          />
          <div
            className="absolute top-1/2 w-3 h-3 rounded-full"
            style={{
              background: accent,
              boxShadow: `0 0 10px ${accent}, inset 0 1px 0 rgba(255,255,255,0.4)`,
              left: `calc(${pct * 100}% - 6px)`,
              transform: 'translateY(-50%)',
            }}
          />
        </div>
      </div>
      <div className="flex items-baseline justify-between">
        <span className="text-[9px] font-mono uppercase tracking-[1.5px]" style={{ color: '#6b6660' }}>
          EBITDA →
        </span>
        <span className="text-[15px] font-mono font-bold tabular-nums" style={{ color: accent, textShadow: `0 0 12px ${accent}55` }}>
          S/ {income.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

const CHAT_CYCLE = [
  { who: 'TÚ', text: '¿Puedo contratar a alguien?' },
  { who: 'CFO', text: 'Tu flujo permite +S/ 3,200/mes.' },
  { who: 'TÚ', text: '¿Y si subo precios 5%?' },
  { who: 'CFO', text: 'EBITDA crecería 18%.' },
];

function PreviewConsultor({ accent }: PreviewProps) {
  const [lineIdx, setLineIdx] = useState(0);
  const [chars, setChars] = useState(0);

  useEffect(() => {
    const line = CHAT_CYCLE[lineIdx].text;
    if (chars < line.length) {
      const id = setTimeout(() => setChars((c) => c + 1), 35);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => {
      setLineIdx((i) => (i + 1) % CHAT_CYCLE.length);
      setChars(0);
    }, 1400);
    return () => clearTimeout(id);
  }, [chars, lineIdx]);

  const line = CHAT_CYCLE[lineIdx];

  return (
    <div className="w-full h-full flex flex-col justify-center gap-1.5 px-1">
      <div className="flex items-start gap-2">
        <span
          className="text-[8px] font-mono font-bold uppercase tracking-[1.5px] flex-shrink-0 px-1.5 py-0.5 rounded mt-0.5"
          style={{
            color: line.who === 'CFO' ? accent : '#6b6660',
            background: line.who === 'CFO' ? `${accent}18` : 'transparent',
            border: line.who === 'CFO' ? `1px solid ${accent}50` : '1px solid rgba(107,102,96,.3)',
          }}
        >
          {line.who}
        </span>
        <div className="text-[12px] font-mono leading-snug" style={{ color: line.who === 'CFO' ? '#f5f0e8' : '#a8a19a' }}>
          {line.text.slice(0, chars)}
          <span
            className="inline-block w-1 h-3 ml-0.5 align-middle"
            style={{ background: accent, animation: 'blinkCursor 1s infinite' }}
          />
        </div>
      </div>
      <div className="flex gap-1 mt-1 ml-8">
        {CHAT_CYCLE.map((_, i) => (
          <div
            key={i}
            className="h-0.5 flex-1 rounded-full transition-all duration-300"
            style={{
              background: i === lineIdx ? accent : `${accent}25`,
              maxWidth: i === lineIdx ? '20px' : '8px',
            }}
          />
        ))}
      </div>
    </div>
  );
}

function PreviewReportes({ accent }: PreviewProps) {
  return (
    <svg viewBox="0 0 200 70" className="w-full h-full" preserveAspectRatio="none">
      <rect x="14" y="8" width="64" height="54" rx="2" fill="none" stroke={accent} strokeWidth="1" opacity="0.5" />
      {[18, 26, 34, 42, 50].map((y, i) => (
        <line
          key={y}
          x1="20"
          y1={y}
          x2={20 + (i * 6 + 36) % 50 + 14}
          y2={y}
          stroke={accent}
          strokeWidth="1"
          opacity="0.75"
          strokeLinecap="round"
          style={{
            strokeDasharray: 55,
            strokeDashoffset: 55,
            animation: `drawLines 3.5s ${i * 0.18}s ease-out infinite`,
          }}
        />
      ))}
      <path d="M82 35 L94 35 M89 31 L94 35 L89 39" stroke={accent} strokeWidth="1.2" fill="none" opacity="0.7" />
      <g transform="translate(100,24)">
        <rect x="0" y="0" width="38" height="22" rx="2" fill={accent} opacity="0.08" stroke={accent} strokeWidth="0.8" />
        <text x="19" y="14" textAnchor="middle" fontSize="8" fontWeight="700" fill={accent} fontFamily="JetBrains Mono, monospace">
          XLSX
        </text>
      </g>
      <g transform="translate(148,24)">
        <rect x="0" y="0" width="38" height="22" rx="2" fill={accent} opacity="0.08" stroke={accent} strokeWidth="0.8" />
        <text x="19" y="14" textAnchor="middle" fontSize="8" fontWeight="700" fill={accent} fontFamily="JetBrains Mono, monospace">
          PDF
        </text>
      </g>
    </svg>
  );
}

const CURRENCIES = [
  { flag: '🇵🇪', code: 'PEN', name: 'Sol peruano' },
  { flag: '🇺🇸', code: 'USD', name: 'Dólar US' },
  { flag: '🇪🇺', code: 'EUR', name: 'Euro' },
  { flag: '🇲🇽', code: 'MXN', name: 'Peso MXN' },
  { flag: '🇨🇴', code: 'COP', name: 'Peso COP' },
  { flag: '🇧🇷', code: 'BRL', name: 'Real BR' },
  { flag: '🇨🇱', code: 'CLP', name: 'Peso CLP' },
  { flag: '🇦🇷', code: 'ARS', name: 'Peso ARS' },
];

function PreviewMoneda({ accent }: PreviewProps) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % CURRENCIES.length), 1400);
    return () => clearInterval(id);
  }, []);

  const c = CURRENCIES[idx];

  return (
    <div className="w-full h-full flex items-center justify-between px-2 gap-3">
      <div className="flex items-center gap-3" key={idx} style={{ animation: 'fadeSlide .5s ease-out' }}>
        <span className="text-3xl leading-none">{c.flag}</span>
        <div>
          <div className="text-[16px] font-mono font-bold leading-none" style={{ color: accent }}>
            {c.code}
          </div>
          <div className="text-[9px] uppercase tracking-[1.5px] mt-1" style={{ color: '#a8a19a' }}>
            {c.name}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="text-[9px] font-mono font-bold uppercase tracking-[1.5px]" style={{ color: accent, opacity: 0.7 }}>
          +{CURRENCIES.length - 1}
        </span>
        <div className="flex gap-0.5">
          {CURRENCIES.slice(0, 8).map((_, i) => (
            <div
              key={i}
              className="w-1 h-1 rounded-full transition-all duration-300"
              style={{ background: i === idx ? accent : `${accent}30` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const PREVIEWS = [
  PreviewDashboard,
  PreviewForecast,
  PreviewSimulador,
  PreviewConsultor,
  PreviewReportes,
  PreviewMoneda,
];

/* ═══════════════════════════════════════════════════════
   TILT CARD — 3D perspective + specular highlight
   ═══════════════════════════════════════════════════════ */

type TiltProps = {
  n: string;
  t: string;
  d: string;
  accent: string;
  depth: number;
  Preview: React.FC<PreviewProps>;
  isTouch: boolean;
};

function TiltCard({ n, t, d, accent, depth, Preview, isTouch }: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, mx: 50, my: 50, active: false });
  const rafRef = useRef<number | null>(null);

  function handleMove(e: React.MouseEvent) {
    if (isTouch) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const rect = ref.current!.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    rafRef.current = requestAnimationFrame(() => {
      setTilt({
        ry: (x - 0.5) * 12,
        rx: -(y - 0.5) * 9,
        mx: x * 100,
        my: y * 100,
        active: true,
      });
    });
  }

  function handleLeave() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setTilt({ rx: 0, ry: 0, mx: 50, my: 50, active: false });
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="relative group"
      style={{
        transform: `perspective(1100px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateZ(${tilt.active ? 12 : 0}px)`,
        transition: tilt.active
          ? 'transform .1s ease-out'
          : 'transform .45s cubic-bezier(.16,1,.3,1)',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Glow behind — scales with tilt active */}
      <div
        className="absolute -inset-2 rounded-2xl blur-2xl pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, ${accent}40, transparent 65%)`,
          opacity: tilt.active ? 1 : 0.15,
          transition: 'opacity .35s ease',
          transform: 'translateZ(-50px)',
        }}
      />

      {/* Main panel */}
      <div
        className="relative p-5 sm:p-6 rounded-xl overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, rgba(22,20,18,.92) 0%, rgba(13,11,10,.8) 100%)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          border: `1px solid ${accent}30`,
          boxShadow: `
            0 ${18 + depth * 6}px ${45 + depth * 12}px -18px rgba(0,0,0,.92),
            inset 0 1px 0 rgba(255,255,255,.04),
            inset 0 0 0 1px rgba(200,161,90,.02)
          `,
          minHeight: 310,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Specular highlight — follows cursor */}
        <div
          className="absolute inset-0 pointer-events-none rounded-xl"
          style={{
            background: `radial-gradient(circle 200px at ${tilt.mx}% ${tilt.my}%, ${accent}22, transparent 60%)`,
            opacity: tilt.active ? 1 : 0,
            transition: 'opacity .25s',
            mixBlendMode: 'screen',
          }}
        />

        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${accent}90 50%, transparent 100%)`,
          }}
        />

        {/* Corner brackets */}
        <div
          className="absolute top-3 right-3 w-2.5 h-2.5 pointer-events-none"
          style={{ borderTop: `1px solid ${accent}80`, borderRight: `1px solid ${accent}80` }}
        />
        <div
          className="absolute bottom-3 left-3 w-2.5 h-2.5 pointer-events-none"
          style={{ borderBottom: `1px solid ${accent}50`, borderLeft: `1px solid ${accent}50` }}
        />

        {/* Header row */}
        <div
          className="relative flex items-center justify-between mb-4"
          style={{ transform: 'translateZ(18px)' }}
        >
          <div className="flex items-center gap-2.5">
            <span
              className="text-[9px] font-mono font-bold tracking-[2px] px-1.5 py-0.5"
              style={{
                background: `${accent}14`,
                color: accent,
                border: `1px solid ${accent}50`,
              }}
            >
              MOD·{n}
            </span>
            <span
              className="text-[8px] font-mono uppercase tracking-[2px]"
              style={{ color: '#6b6660' }}
            >
              Capa {depth}/3
            </span>
          </div>
          <span className="relative flex h-1.5 w-1.5">
            <span
              className="absolute inset-0 rounded-full animate-ping"
              style={{ background: accent, opacity: 0.6 }}
            />
            <span
              className="relative inline-flex h-1.5 w-1.5 rounded-full"
              style={{ background: accent }}
            />
          </span>
        </div>

        {/* Preview area */}
        <div
          className="relative h-[76px] mb-5 flex items-center rounded-md overflow-hidden"
          style={{
            transform: 'translateZ(30px)',
            background: `linear-gradient(180deg, ${accent}06, transparent 70%)`,
            border: `1px solid ${accent}15`,
          }}
        >
          <Preview accent={accent} />
        </div>

        {/* Title */}
        <h3
          className="text-[19px] sm:text-[20px] font-bold mb-2 leading-tight relative"
          style={{ color: '#f5f0e8', transform: 'translateZ(22px)' }}
        >
          {t}
        </h3>

        {/* Description */}
        <p
          className="text-[12.5px] leading-[1.55] relative"
          style={{ color: '#a8a19a', transform: 'translateZ(14px)' }}
        >
          {d}
        </p>

        {/* Footer */}
        <div
          className="absolute bottom-5 left-6 right-6 flex items-center justify-between pt-2.5"
          style={{
            borderTop: `1px solid ${accent}18`,
            transform: 'translateZ(16px)',
          }}
        >
          <span
            className="text-[8.5px] font-mono uppercase tracking-[2px]"
            style={{ color: '#6b6660' }}
          >
            ▲ ONLINE
          </span>
          <span
            className="text-[10px] font-mono uppercase tracking-[2px] flex items-center gap-1.5 transition-all"
            style={{
              color: accent,
              opacity: tilt.active ? 1 : 0.55,
            }}
          >
            Explorar
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              style={{
                transform: tilt.active ? 'translateX(3px)' : 'translateX(0)',
                transition: 'transform .3s',
              }}
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SECTION
   ═══════════════════════════════════════════════════════ */

export function ServiciosLayers() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(hover: none), (pointer: coarse)');
    setIsTouch(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsTouch(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || isTouch) return;
    function handle(e: MouseEvent) {
      const rect = el!.getBoundingClientRect();
      setMouse({
        x: Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)),
        y: Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height)),
      });
    }
    el.addEventListener('mousemove', handle);
    return () => el.removeEventListener('mousemove', handle);
  }, [isTouch]);

  return (
    <section
      ref={sectionRef}
      className="relative px-6 md:px-12 lg:px-20 py-24 md:py-32 overflow-hidden"
      style={{ background: '#060606' }}
    >
      {/* Ambient gold spot (desktop only) */}
      {!isTouch && (
        <div
          className="absolute inset-0 pointer-events-none transition-[background] duration-300"
          style={{
            background: `radial-gradient(ellipse 55% 45% at ${mouse.x * 100}% ${mouse.y * 100}%, rgba(200,161,90,.1), transparent 55%)`,
          }}
        />
      )}

      {/* Grid bg */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(200,161,90,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(200,161,90,.6) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      <div className="relative mx-auto max-w-[1400px]">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14 md:mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="relative flex h-2 w-2">
                <span
                  className="absolute inset-0 rounded-full animate-ping"
                  style={{ background: '#c8a15a', opacity: 0.6 }}
                />
                <span
                  className="relative inline-flex h-2 w-2 rounded-full"
                  style={{ background: '#c8a15a' }}
                />
              </span>
              <p
                className="text-[10px] font-mono font-semibold uppercase tracking-[4px]"
                style={{ color: '#c8a15a' }}
              >
                Sala de control · 06 módulos activos
              </p>
            </div>
            <h2
              className="text-4xl md:text-6xl font-extrabold leading-[1.02] tracking-tight"
              style={{ color: '#f5f0e8' }}
            >
              Seis módulos,
              <br />
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage:
                    'linear-gradient(90deg, #d4b577 0%, #c8a15a 50%, #8c6b33 100%)',
                }}
              >
                operando en paralelo.
              </span>
            </h2>
          </div>
          <p
            className="max-w-xs text-[13px] leading-relaxed self-end lg:pb-2"
            style={{ color: '#a8a19a' }}
          >
            {isTouch
              ? 'Toca cualquier módulo para conocerlo en detalle. Cada panel opera como una capa independiente.'
              : 'Mueve el cursor sobre cualquier panel para inclinarlo. Los módulos responden en 3D real.'}
          </p>
        </div>

        {/* Grid de tilt cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {SERVICES.map((s, i) => (
            <TiltCard
              key={s.n}
              n={s.n}
              t={s.t}
              d={s.d}
              accent={ACCENTS[i]}
              depth={(i % 3) + 1}
              Preview={PREVIEWS[i]}
              isTouch={isTouch}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes dashMarch {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -14; }
        }
        @keyframes drawLines {
          0% { stroke-dashoffset: 55; }
          55% { stroke-dashoffset: 0; }
          95% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 55; }
        }
        @keyframes blinkCursor {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        @keyframes fadeSlide {
          0% { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
