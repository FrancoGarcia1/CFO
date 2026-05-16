'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { HERO_CONTENT as H, PRODUCTOS, CFC_COLORS as C } from './data';

/**
 * Hero + Suite Transition con coreografía estilo Pallet Ross:
 *   1. INTRO (0 → 3.7s): Capital CFO emerge desde abajo, vuela a slot derecho,
 *      sweep left a su posición FAN. Las 7 cards próximamente revelan opacity
 *      conforme el lead "pasa" por sus posiciones.
 *   2. SCROLL FAN → STACK (0 → 0.35·lockProgress): cards colapsan al centro.
 *   3. STACK held (0.35·lp → 0.70·lp): visualmente "una sola suite".
 *   4. SCROLL STACK → CASCADE (0.70·lp → lp): cards se despliegan en cascada
 *      diagonal hacia el lado derecho de la sección Suite.
 *   5. LOCKED (>= lp): el overlay cambia de fixed a absolute y queda anclado.
 */

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => t * t * (3 - 2 * t);

const COLORS_MAP: Record<string, string> = {
  finanzas: C.finanzas,
  estrategia: C.estrategia,
  tech: C.tech,
};

/* ─── FAN: 8 slots de izquierda a derecha ─── */
const FAN: { x: number; y: number; rotate: number; scale: number; z: number }[] = [
  { x: -540, y: 32,  rotate: -22, scale: 0.82, z: 1 }, // 0 leftmost
  { x: -380, y: 14,  rotate: -14, scale: 0.88, z: 2 },
  { x: -220, y: 2,   rotate: -7,  scale: 0.94, z: 3 },
  { x:  -60, y: -8,  rotate: -2,  scale: 1.00, z: 5 }, // 3 = LEAD slot (Capital CFO)
  { x:  100, y: -8,  rotate:  2,  scale: 0.99, z: 4 },
  { x:  260, y: 2,   rotate:  7,  scale: 0.94, z: 3 },
  { x:  420, y: 14,  rotate: 14,  scale: 0.88, z: 2 },
  { x:  580, y: 32,  rotate: 22,  scale: 0.82, z: 1 }, // 7 rightmost
];

const LEAD_SLOT = 3;

/* Mapeo: PRODUCTOS[0]=Capital CFO va a slot 3.
   PRODUCTOS[1..3] → slots 0,1,2 (izquierda)
   PRODUCTOS[4..7] → slots 4,5,6,7 (derecha)        */
function fanSlotFor(productIdx: number): number {
  if (productIdx === 0) return LEAD_SLOT;
  if (productIdx <= 3) return productIdx - 1; // 1→0, 2→1, 3→2
  return productIdx; // 4→4, 5→5, 6→6, 7→7
}

/* ─── CASCADE: 8 escalones diagonales ─── */
function cascadeFor(slotIdx: number) {
  // Diagonal de arriba-izq a abajo-der, anclada al lado derecho de la suite section
  return {
    x: -60 + slotIdx * 75,
    y: -200 + slotIdx * 50,
    rotate: -8 + slotIdx * 2.4,
    scale: 0.86,
    z: 8 - slotIdx,
  };
}

const CARD_W = 210;
const CARD_H = 260;
const HERO_FAN_Y_RATIO = 0.82; // 82% del viewport — cards quedan en la mitad inferior, no tapan el headline

interface Pose { x: number; y: number; rotate: number; scale: number; }

function getScrollPose(productIdx: number, progress: number, lockProgress: number): Pose {
  const slot = fanSlotFor(productIdx);
  const fan = FAN[slot];
  const cascade = cascadeFor(slot);
  const stack: Pose = { x: 0, y: -10, rotate: 0, scale: 1 };

  const lp = Math.max(lockProgress, 0.1);
  const p1 = lp * 0.35;
  const p2 = lp * 0.70;
  const clamped = clamp(progress, 0, lp);

  if (clamped <= p1) {
    const t = smooth(clamped / p1);
    return {
      x: lerp(fan.x, stack.x, t),
      y: lerp(fan.y, stack.y, t),
      rotate: lerp(fan.rotate, stack.rotate, t),
      scale: lerp(fan.scale, stack.scale, t),
    };
  }
  if (clamped <= p2) {
    return stack;
  }
  const t = smooth((clamped - p2) / (lp - p2));
  return {
    x: lerp(stack.x, cascade.x, t),
    y: lerp(stack.y, cascade.y, t),
    rotate: lerp(stack.rotate, cascade.rotate, t),
    scale: lerp(stack.scale, cascade.scale, t),
  };
}

/* ─── INTRO Pallet Ross: solo lead card "baila" ─── */
const INTRO_T = {
  emerge: 0.00,      // 0.00 → 0.22 emerge desde abajo
  emergeEnd: 0.22,
  flyEnd: 0.43,      // 0.22 → 0.43 vuela a slot 7 (rightmost)
  sweepEnd: 1.00,    // 0.43 → 1.00 sweep left a slot LEAD
};

function getIntroPose(productIdx: number, introT: number): { pose: Pose; opacity: number } {
  const slot = fanSlotFor(productIdx);
  const fan = FAN[slot];

  if (productIdx === 0) {
    // LEAD card: dance choreography
    if (introT <= INTRO_T.emergeEnd) {
      const t = smooth(introT / INTRO_T.emergeEnd);
      return {
        pose: { x: 0, y: lerp(220, 0, t), rotate: 0, scale: lerp(0.3, 1, t) },
        opacity: t,
      };
    }
    if (introT <= INTRO_T.flyEnd) {
      const t = smooth((introT - INTRO_T.emergeEnd) / (INTRO_T.flyEnd - INTRO_T.emergeEnd));
      const target = FAN[7];
      return {
        pose: {
          x: lerp(0, target.x, t),
          y: lerp(0, target.y, t),
          rotate: lerp(0, target.rotate, t),
          scale: lerp(1, target.scale, t),
        },
        opacity: 1,
      };
    }
    // sweep from rightmost to LEAD slot
    const t = smooth((introT - INTRO_T.flyEnd) / (INTRO_T.sweepEnd - INTRO_T.flyEnd));
    const from = FAN[7];
    return {
      pose: {
        x: lerp(from.x, fan.x, t),
        y: lerp(from.y, fan.y, t),
        rotate: lerp(from.rotate, fan.rotate, t),
        scale: lerp(from.scale, fan.scale, t),
      },
      opacity: 1,
    };
  }

  // NON-LEAD: opacity reveal cuando lead "pasa" por su slot durante el sweep
  // Lead sweeps from slot 7 (x=580) to slot LEAD=3 (x=-60). It passes slots 6,5,4 on the way.
  // For slots > LEAD: reveal cuando lead pasa por ellos (durante el sweep).
  // For slots < LEAD (0,1,2): reveal cerca del final del sweep.
  let revealAt: number;
  if (slot > LEAD_SLOT) {
    // Reveal proporcional: slot 7 = sweep 0%, slot 4 = sweep 80% (jamás llega del todo)
    const sweepFrac = (FAN[7].x - fan.x) / (FAN[7].x - FAN[LEAD_SLOT].x);
    revealAt = INTRO_T.flyEnd + clamp(sweepFrac, 0, 1) * (INTRO_T.sweepEnd - INTRO_T.flyEnd);
  } else {
    // Slots 0,1,2: revelar progressivamente en el último 40% del sweep
    const leftFrac = (LEAD_SLOT - slot) / LEAD_SLOT; // slot 0 = 1, slot 1 = 0.66, slot 2 = 0.33
    revealAt = INTRO_T.flyEnd + (0.55 + leftFrac * 0.40) * (INTRO_T.sweepEnd - INTRO_T.flyEnd);
  }

  const revealDur = 0.06;
  const op = clamp((introT - revealAt) / revealDur, 0, 1);
  return {
    pose: { x: fan.x, y: fan.y, rotate: fan.rotate, scale: fan.scale },
    opacity: op,
  };
}

/* ═══════════ CARD VISUAL ═══════════ */
function CardVisual({ product, accent, isLead, orderNum }: {
  product: typeof PRODUCTOS[number];
  accent: string;
  isLead: boolean;
  orderNum: number;
}) {
  const Preview = null; // mantenemos cards limpias en la coreografía
  return (
    <div
      className="relative w-full h-full rounded-2xl overflow-hidden"
      style={{
        background: isLead
          ? `linear-gradient(135deg, #1a1108 0%, #0a0705 50%, #1a1108 100%)`
          : `linear-gradient(180deg, #2a201a 0%, #1a1310 100%)`,
        border: `1.5px solid ${isLead ? `${C.bronze}c0` : `${accent}`}`,
        boxShadow: isLead
          ? `0 1px 0 rgba(255,255,255,.08) inset, 0 -1px 0 rgba(0,0,0,.6) inset, 0 30px 60px -20px rgba(0,0,0,.95), 0 0 60px ${C.bronze}50`
          : `0 1px 0 rgba(255,255,255,.08) inset, 0 24px 50px -18px rgba(0,0,0,.95), 0 0 40px ${accent}55`,
        backdropFilter: 'blur(14px)',
      }}
    >
      {isLead && (
        <div className="absolute top-0 left-[8%] right-[8%] h-px" style={{
          background: `linear-gradient(90deg, transparent, ${C.bronze}, ${C.goldFoil}, ${C.bronze}, transparent)`,
        }}/>
      )}
      {!isLead && (
        <div className="absolute top-0 left-[14%] right-[14%] h-px opacity-55" style={{
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        }}/>
      )}
      {/* Halo */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{
        background: isLead
          ? `radial-gradient(ellipse at top right, ${C.bronze}24, transparent 65%)`
          : `radial-gradient(ellipse at center, ${accent}0d, transparent 70%)`,
      }}/>
      {/* Subtle carbon texture en lead */}
      {isLead && (
        <div className="absolute inset-0 pointer-events-none opacity-[.025]" style={{
          backgroundImage: `repeating-linear-gradient(45deg, ${C.bronze} 0, ${C.bronze} 1px, transparent 1px, transparent 3px)`,
        }}/>
      )}

      <div className="relative h-full flex flex-col p-5">
        {/* Tag row */}
        <div className="flex items-center justify-between mb-3">
          {isLead ? (
            <span className="text-[8px] font-mono font-bold uppercase tracking-[2.5px] px-1.5 py-0.5 rounded" style={{
              background: `linear-gradient(135deg, ${C.bronzeLight}, ${C.bronze})`,
              color: C.black,
              boxShadow: `0 3px 8px -2px ${C.bronze}80`,
            }}>
              ⭑ Activo
            </span>
          ) : (
            <span className="text-[7.5px] font-mono font-bold uppercase tracking-[2px] px-1.5 py-0.5 rounded" style={{
              background: 'rgba(240,233,221,.04)',
              color: C.dim,
              border: `1px solid rgba(240,233,221,.1)`,
            }}>
              Próximamente
            </span>
          )}
          <span className="text-[8px] font-mono uppercase tracking-[1.5px]" style={{
            color: isLead ? C.bronzeLight : accent,
            opacity: 0.8,
          }}>
            {product.pilar}
          </span>
        </div>

        {/* Name */}
        <h3
          className={`leading-tight font-medium tracking-tight ${isLead ? 'text-[26px]' : 'text-[18px]'}`}
          style={{
            color: C.ivory,
            fontFamily: "'Fraunces', Georgia, serif",
            letterSpacing: '-0.018em',
          }}
        >
          {isLead ? (
            <>
              <span style={{
                color: 'transparent',
                backgroundImage: `linear-gradient(95deg, ${C.bronzeLight}, ${C.goldFoil}, ${C.bronze})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
              }}>
                Capital
              </span>
              <br />
              CFO
            </>
          ) : (
            product.nombre.replace('Capital ', '')
          )}
        </h3>

        {/* Tag */}
        <p className="text-[8.5px] font-mono uppercase tracking-[1.5px] mt-2" style={{
          color: accent,
          opacity: 0.78,
        }}>
          {product.tag}
        </p>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Footer */}
        <div className="flex items-end justify-between">
          <span className="text-[9.5px] font-mono tabular-nums" style={{
            color: isLead ? C.bronzeLight : C.dim,
          }}>
            {String(orderNum).padStart(2, '0')} / 08
          </span>
          {isLead && (
            <span className="inline-flex items-center gap-1 text-[8.5px] font-mono uppercase tracking-[2px]" style={{
              color: C.bronzeLight,
            }}>
              Activo
              <span className="relative flex h-1 w-1">
                <span className="absolute inset-0 rounded-full animate-ping" style={{ background: C.bronzeLight, opacity: 0.7 }}/>
                <span className="relative inline-flex h-1 w-1 rounded-full" style={{ background: C.bronzeLight }}/>
              </span>
            </span>
          )}
          {!isLead && (
            <span className="flex gap-0.5 opacity-50">
              {[0, 1, 2].map((d) => (
                <span key={d} className="w-1 h-1 rounded-full" style={{ background: accent }}/>
              ))}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════ Main component ═══════════ */
export function HeroWithCards() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [lockProgress, setLockProgress] = useState(0.5);
  const [scrollableHeight, setScrollableHeight] = useState(0);
  const [viewport, setViewport] = useState({ w: 1440, h: 900 });
  const [introT, setIntroT] = useState(0);
  const [introDone, setIntroDone] = useState(false);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });

  /* Measurement */
  useEffect(() => {
    function measure() {
      const containerEl = containerRef.current;
      if (!containerEl) return;
      const suiteEl = containerEl.querySelector('[data-section="suite-transition"]') as HTMLElement | null;
      if (!suiteEl) return;

      const cRect = containerEl.getBoundingClientRect();
      const sRect = suiteEl.getBoundingClientRect();
      const cTopDoc = cRect.top + window.scrollY;
      const sTopDoc = sRect.top + window.scrollY;
      const sh = Math.max(containerEl.offsetHeight - window.innerHeight, 1);
      const lp = clamp((sTopDoc - cTopDoc) / sh, 0.05, 0.99);
      setLockProgress(lp);
      setScrollableHeight(sh);
      setViewport({ w: window.innerWidth, h: window.innerHeight });
    }
    measure();
    const t1 = setTimeout(measure, 300);
    const t2 = setTimeout(measure, 800);
    window.addEventListener('resize', measure);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('resize', measure);
    };
  }, []);

  /* Scroll */
  useEffect(() => {
    function onScroll() {
      const containerEl = containerRef.current;
      if (!containerEl) return;
      const rect = containerEl.getBoundingClientRect();
      const sh = Math.max(containerEl.offsetHeight - window.innerHeight, 1);
      const progress = clamp(-rect.top / sh, 0, 1);
      setScrollProgress(progress);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Intro animation rAF — duration 3.7s */
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const duration = 3700;
    function tick(now: number) {
      const t = clamp((now - start) / duration, 0, 1);
      setIntroT(t);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setIntroDone(true);
      }
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* Mouse parallax (Hero) */
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (!containerRef.current) return;
      const r = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / Math.min(r.height, window.innerHeight);
      setMouse({ x: clamp(x), y: clamp(y) });
    }
    window.addEventListener('mousemove', handle);
    return () => window.removeEventListener('mousemove', handle);
  }, []);

  const isLocked = scrollProgress >= lockProgress;
  const heroFanY = viewport.h * HERO_FAN_Y_RATIO;
  const centerX = viewport.w / 2;

  /* Constelación dots */
  const dots = [
    { x: 8, y: 22, size: 1, delay: 0 },
    { x: 14, y: 60, size: 1.5, delay: 1.2 },
    { x: 25, y: 85, size: 1, delay: 2.4 },
    { x: 38, y: 18, size: 1, delay: 0.8 },
    { x: 52, y: 90, size: 1.5, delay: 1.6 },
    { x: 68, y: 35, size: 1, delay: 0.4 },
    { x: 82, y: 75, size: 1.5, delay: 2.0 },
    { x: 92, y: 20, size: 1, delay: 1.0 },
  ];

  return (
    <div ref={containerRef} className="relative" style={{ background: C.bg }}>
      {/* ═══ Hero Section ═══ */}
      <section
        className="relative overflow-hidden px-6 md:px-12 lg:px-20 pt-12 md:pt-20 pb-0"
        style={{ minHeight: '100vh' }}
      >
        {/* Aurora layers + parallax */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-[900px] h-[900px] rounded-full blur-[140px]" style={{
            top: '-30%', left: '-20%',
            background: `radial-gradient(circle, ${C.bronze}33, transparent 60%)`,
            animation: 'cfcFloat1 22s ease-in-out infinite',
            transform: `translate(${(mouse.x - 0.5) * -40}px, ${(mouse.y - 0.5) * -30}px)`,
            transition: 'transform .8s ease-out',
          }}/>
          <div className="absolute w-[700px] h-[700px] rounded-full blur-[120px]" style={{
            top: '5%', right: '-20%',
            background: `radial-gradient(circle, ${C.finanzas}22, transparent 60%)`,
            animation: 'cfcFloat2 28s ease-in-out infinite',
            transform: `translate(${(mouse.x - 0.5) * 30}px, ${(mouse.y - 0.5) * 20}px)`,
            transition: 'transform .8s ease-out',
          }}/>
          <div className="absolute w-[500px] h-[500px] rounded-full blur-[100px]" style={{
            top: '40%', left: '20%',
            background: `radial-gradient(circle, ${C.goldFoil}15, transparent 60%)`,
            animation: 'cfcFloat4 26s ease-in-out infinite',
          }}/>
        </div>

        {/* Constelación */}
        <div className="absolute inset-0 pointer-events-none">
          {dots.map((d, i) => (
            <span
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${d.x}%`,
                top: `${d.y}%`,
                width: d.size + 'px',
                height: d.size + 'px',
                background: C.bronze,
                boxShadow: `0 0 ${d.size * 3}px ${C.bronze}`,
                animation: `cfcTwinkle 3s ease-in-out ${d.delay}s infinite`,
              }}
            />
          ))}
        </div>

        {/* Grain */}
        <div className="absolute inset-0 pointer-events-none opacity-[.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay',
        }}/>

        <div className="relative mx-auto max-w-[1200px] flex flex-col items-center text-center pt-4 md:pt-10">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 mb-7 px-3 py-1.5 rounded-full" style={{
            background: `${C.bronze}10`,
            border: `1px solid ${C.bronze}40`,
            backdropFilter: 'blur(8px)',
          }}>
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full animate-ping" style={{ background: C.bronze, opacity: 0.6 }}/>
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: C.bronze }}/>
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[3px]" style={{ color: C.bronzeLight }}>
              {H.eyebrow}
            </span>
          </div>

          <h1 className="text-[clamp(40px,6vw,76px)] leading-[1.02] tracking-tight mb-7 font-medium max-w-[18ch]" style={{
            color: C.ivory,
            fontFamily: "'Fraunces', Georgia, serif",
            letterSpacing: '-0.02em',
          }}>
            <span className="block">{H.titleLine1}</span>
            <span className="block italic relative" style={{
              color: 'transparent',
              backgroundImage: `linear-gradient(95deg, ${C.bronzeLight} 0%, ${C.goldFoil} 50%, ${C.bronze} 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
            }}>
              {H.titleAccent}
            </span>
            <span className="block">{H.titleLine3}</span>
          </h1>

          <p className="max-w-xl text-[15px] md:text-[16.5px] leading-[1.7] mb-9" style={{ color: C.muted }}>
            {H.subtitle}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-5 mb-6">
            <a href="#contacto" className="group relative inline-flex items-center gap-2 rounded-md px-6 py-3.5 text-[13px] font-semibold uppercase tracking-[2px] overflow-hidden transition-all hover:translate-y-[-1px]" style={{
              background: `linear-gradient(135deg, ${C.bronzeLight}, ${C.bronze})`,
              color: C.black,
              boxShadow: `0 10px 30px -10px ${C.bronze}80, inset 0 1px 0 rgba(255,255,255,.2)`,
            }}>
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{
                background: `linear-gradient(120deg, transparent 30%, rgba(255,255,255,.3) 50%, transparent 70%)`,
                animation: 'cfcShine 2s ease-in-out infinite',
              }}/>
              <span className="relative">{H.ctaPrimary}</span>
              <svg className="relative" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
            <a href="#servicios" className="text-[13px] transition-colors hover:text-[color:#c89570]" style={{ color: C.muted }}>
              {H.ctaSecondary} ›
            </a>
          </div>

          {/* Spacer para que las cards en FAN tengan espacio visual debajo del headline */}
          <div style={{ height: 'min(420px, 46vh)' }} aria-hidden />
        </div>
      </section>

      {/* ═══ Suite Transition Section ═══ */}
      <section
        data-section="suite-transition"
        className="relative px-6 md:px-12 lg:px-20"
        style={{ minHeight: '170vh' }}
      >
        <div className="sticky top-0 h-screen flex items-center">
          <div className="relative mx-auto max-w-[1400px] w-full grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 lg:gap-16 items-center">
            <div>
              <p className="text-[10px] font-mono font-bold uppercase tracking-[3px] mb-4" style={{ color: C.bronze }}>
                Suite de productos · Capital Founder
              </p>
              <h2 className="text-[clamp(34px,5vw,64px)] leading-[1.05] font-medium tracking-tight mb-6" style={{
                color: C.ivory,
                fontFamily: "'Fraunces', Georgia, serif",
                letterSpacing: '-0.02em',
              }}>
                Software propio que{' '}
                <span className="italic" style={{
                  color: 'transparent',
                  backgroundImage: `linear-gradient(95deg, ${C.bronzeLight}, ${C.goldFoil}, ${C.bronze})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                }}>
                  multiplica
                </span>{' '}
                nuestro impacto.
              </h2>
              <p className="text-[15px] leading-relaxed max-w-md mb-3" style={{ color: C.muted }}>
                Ocho productos. Uno activo, siete en construcción. Cada uno resuelve un dolor real que vivimos como firma — lo usamos internamente antes de venderlo.
              </p>
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[2px] mt-2" style={{ color: C.dim }}>
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inset-0 rounded-full animate-ping" style={{ background: C.bronze, opacity: 0.5 }}/>
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: C.bronze }}/>
                </span>
                8 productos · 1 activo · Roadmap 2026
              </div>
            </div>
            {/* Espacio reservado para la cascada de cards a la derecha */}
            <div className="relative h-[560px]" aria-hidden />
          </div>
        </div>
      </section>

      {/* ═══ Cards overlay global ═══ */}
      <div
        className="pointer-events-none"
        style={{
          position: isLocked ? 'absolute' : 'fixed',
          top: isLocked ? lockProgress * scrollableHeight : 0,
          left: 0,
          width: '100%',
          height: viewport.h,
          zIndex: 5,
        }}
      >
        {PRODUCTOS.map((p, i) => {
          const accent = i === 0 ? C.bronze : (COLORS_MAP[p.color] || C.bronze);
          const isLead = i === 0;

          let pose: Pose;
          let opacity = 1;

          if (!introDone) {
            const r = getIntroPose(i, introT);
            pose = r.pose;
            opacity = r.opacity;
          } else {
            pose = getScrollPose(i, scrollProgress, lockProgress);
          }

          // Anchor: durante FAN/STACK ancla al centro del viewport; durante CASCADE
          // se mueve al lado derecho del viewport (donde está visualmente la zona derecha del Suite)
          const lp = Math.max(lockProgress, 0.1);
          const cascadeBlend = clamp((scrollProgress - lp * 0.70) / (lp - lp * 0.70), 0, 1);
          const cascadeAnchorX = viewport.w * 0.72;
          const cascadeAnchorY = viewport.h * 0.50;
          const anchorX = lerp(centerX, cascadeAnchorX, smooth(cascadeBlend));
          const anchorY = lerp(heroFanY, cascadeAnchorY, smooth(cascadeBlend));

          const slot = fanSlotFor(i);
          const zIdx = isLead ? 20 : FAN[slot].z + 5;

          return (
            <div
              key={p.nombre}
              className="absolute"
              style={{
                top: 0,
                left: 0,
                width: CARD_W,
                height: CARD_H,
                transform: `translate(${anchorX + pose.x - CARD_W / 2}px, ${anchorY + pose.y - CARD_H / 2}px) rotate(${pose.rotate}deg) scale(${pose.scale})`,
                transformOrigin: 'center center',
                willChange: 'transform, opacity',
                opacity,
                transition: introDone ? 'none' : 'opacity .25s ease-out',
                zIndex: zIdx,
              }}
            >
              <CardVisual product={p} accent={accent} isLead={isLead} orderNum={i + 1} />
            </div>
          );
        })}
      </div>

      <style jsx global>{`
        @keyframes cfcFloat1 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(40px,40px) scale(1.1); } }
        @keyframes cfcFloat2 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-50px,30px) scale(1.08); } }
        @keyframes cfcFloat4 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-30px,30px) scale(1.1); } }
        @keyframes cfcShine { 0% { transform: translateX(-150%); } 100% { transform: translateX(250%); } }
        @keyframes cfcTwinkle { 0%,100% { opacity: 0.2; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.4); } }
        @media (prefers-reduced-motion: reduce) {
          .pointer-events-none { transition: none !important; }
        }
      `}</style>
    </div>
  );
}
