'use client';
import { useEffect, useRef, useState } from 'react';
import { HERO_CONTENT as H, CFC_COLORS as C } from './data';

/**
 * Hero CFC — parallax 3D · constelación animada · stat cards con tilt magnético.
 * Misma "escuela" cinemática que Capital CFO pero con identidad serif/bronce propia.
 */

function Reveal({ text, startDelay = 0, stagger = 80 }: { text: string; startDelay?: number; stagger?: number }) {
  const words = text.split(' ');
  return (
    <>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block will-change-[transform,filter,opacity]"
          style={{
            opacity: 0,
            transform: 'translateY(.4em)',
            filter: 'blur(8px)',
            animation: `cfcReveal .9s cubic-bezier(.16,1,.3,1) ${startDelay + i * stagger}ms forwards`,
          }}
        >
          {word}
          {i < words.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </>
  );
}

/* Stat card con 3D tilt magnético */
function StatCard({ stat, idx }: { stat: typeof H.stats[number]; idx: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, mx: 50, my: 50, active: false });

  function onMove(e: React.MouseEvent) {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    setTilt({
      ry: (x - 0.5) * 10,
      rx: -(y - 0.5) * 8,
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
      className="relative p-5 rounded-lg overflow-hidden group cursor-default"
      style={{
        background: `linear-gradient(135deg, ${C.bgCard}, rgba(20,15,12,.4))`,
        border: `1px solid ${tilt.active ? C.bronze + '55' : C.border}`,
        backdropFilter: 'blur(14px)',
        transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateZ(${tilt.active ? 6 : 0}px)`,
        transition: tilt.active ? 'transform .1s ease-out, border-color .2s' : 'transform .5s cubic-bezier(.16,1,.3,1), border-color .3s',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Top hairline */}
      <div className="absolute top-0 left-[8%] right-[8%] h-px" style={{
        background: `linear-gradient(90deg, transparent, ${C.bronze}, transparent)`,
        opacity: tilt.active ? 0.9 : 0.45,
        transition: 'opacity .25s',
      }}/>

      {/* Specular highlight follows cursor */}
      <div className="absolute inset-0 pointer-events-none rounded-lg" style={{
        background: `radial-gradient(circle 180px at ${tilt.mx}% ${tilt.my}%, ${C.bronze}22, transparent 55%)`,
        opacity: tilt.active ? 1 : 0,
        transition: 'opacity .25s',
        mixBlendMode: 'screen',
      }}/>

      <div className="relative flex items-center justify-between">
        <div>
          <div className="text-[9px] font-mono font-bold uppercase tracking-[2.5px] mb-1" style={{ color: C.dim }}>
            {stat.label}
          </div>
          <div className="text-[28px] md:text-[32px] font-medium tracking-tight leading-none" style={{
            color: C.ivory,
            fontFamily: "'Fraunces', Georgia, serif",
          }}>
            {stat.value}
          </div>
        </div>
        <div className="text-[10px] font-mono tabular-nums" style={{ color: C.bronze }}>
          0{idx + 1}
        </div>
      </div>
    </div>
  );
}

export function HeroCFC() {
  const ref = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      setMouse({
        x: (e.clientX - r.left) / r.width,
        y: Math.max(0, Math.min(1, (e.clientY - r.top) / r.height)),
      });
    }
    const el = ref.current;
    el?.addEventListener('mousemove', handle);
    return () => el?.removeEventListener('mousemove', handle);
  }, []);

  // Constelación — generamos dots con seed estable
  const dots = [
    { x: 8, y: 22, size: 1, delay: 0 },
    { x: 14, y: 60, size: 1.5, delay: 1.2 },
    { x: 25, y: 85, size: 1, delay: 2.4 },
    { x: 38, y: 18, size: 1, delay: 0.8 },
    { x: 52, y: 90, size: 1.5, delay: 1.6 },
    { x: 68, y: 35, size: 1, delay: 0.4 },
    { x: 82, y: 75, size: 1.5, delay: 2.0 },
    { x: 92, y: 20, size: 1, delay: 1.0 },
    { x: 96, y: 55, size: 1, delay: 2.8 },
  ];

  return (
    <section
      ref={ref}
      className="relative overflow-hidden px-6 md:px-12 lg:px-20 pt-12 md:pt-20 pb-20"
      style={{ background: C.bg, minHeight: '92vh' }}
    >
      {/* 4 capas aurora con velocidades distintas y parallax */}
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
        <div className="absolute w-[600px] h-[600px] rounded-full blur-[110px]" style={{
          bottom: '-20%', left: '40%',
          background: `radial-gradient(circle, ${C.tech}1A, transparent 60%)`,
          animation: 'cfcFloat3 32s ease-in-out infinite',
          transform: `translate(${(mouse.x - 0.5) * 20}px, ${(mouse.y - 0.5) * -25}px)`,
          transition: 'transform .8s ease-out',
        }}/>
        <div className="absolute w-[500px] h-[500px] rounded-full blur-[100px]" style={{
          top: '40%', left: '20%',
          background: `radial-gradient(circle, ${C.goldFoil}15, transparent 60%)`,
          animation: 'cfcFloat4 26s ease-in-out infinite',
        }}/>
      </div>

      {/* Constelación de dots */}
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
        {/* Líneas conectoras de constelación */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-25" viewBox="0 0 100 100" preserveAspectRatio="none">
          <line x1="8" y1="22" x2="14" y2="60" stroke={C.bronze} strokeWidth="0.05" />
          <line x1="14" y1="60" x2="25" y2="85" stroke={C.bronze} strokeWidth="0.05" />
          <line x1="25" y1="85" x2="52" y2="90" stroke={C.bronze} strokeWidth="0.05" />
          <line x1="38" y1="18" x2="68" y2="35" stroke={C.bronze} strokeWidth="0.05" />
          <line x1="68" y1="35" x2="82" y2="75" stroke={C.bronze} strokeWidth="0.05" />
          <line x1="82" y1="75" x2="92" y2="20" stroke={C.bronze} strokeWidth="0.05" />
        </svg>
      </div>

      {/* Círculos orbitales decorativos */}
      <svg className="absolute top-[15%] right-[6%] hidden md:block pointer-events-none" width="220" height="220" viewBox="0 0 220 220" style={{
        transform: `translate(${(mouse.x - 0.5) * 15}px, ${(mouse.y - 0.5) * 15}px)`,
        transition: 'transform 1s ease-out',
        animation: 'cfcSpinSlow 60s linear infinite',
      }}>
        <circle cx="110" cy="110" r="105" fill="none" stroke={C.bronze} strokeWidth="0.4" opacity="0.3" />
        <circle cx="110" cy="110" r="80" fill="none" stroke={C.bronze} strokeWidth="0.3" opacity="0.2" strokeDasharray="2,5" />
        <circle cx="110" cy="110" r="55" fill="none" stroke={C.bronze} strokeWidth="0.5" opacity="0.4" strokeDasharray="1,3" />
        <circle cx="110" cy="15" r="2.5" fill={C.goldFoil}>
          <animate attributeName="opacity" values="1;0.3;1" dur="2.4s" repeatCount="indefinite" />
        </circle>
      </svg>
      <svg className="absolute bottom-[12%] left-[3%] hidden md:block pointer-events-none" width="280" height="280" viewBox="0 0 280 280" style={{
        transform: `translate(${(mouse.x - 0.5) * -10}px, ${(mouse.y - 0.5) * -10}px)`,
        transition: 'transform 1s ease-out',
      }}>
        <circle cx="140" cy="140" r="135" fill="none" stroke={C.goldFoil} strokeWidth="0.3" opacity="0.18" />
        <circle cx="140" cy="140" r="95" fill="none" stroke={C.goldFoil} strokeWidth="0.3" opacity="0.12" strokeDasharray="1,4" />
      </svg>

      {/* Grain */}
      <div className="absolute inset-0 pointer-events-none opacity-[.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        mixBlendMode: 'overlay',
      }}/>

      <div className="relative mx-auto max-w-[1400px] grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-20 items-center">
        {/* LEFT — TEXTO */}
        <div>
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

          <h1 className="text-[clamp(40px,5.5vw,72px)] leading-[1.02] tracking-tight mb-7 font-medium" style={{
            color: C.ivory,
            fontFamily: "'Fraunces', Georgia, serif",
            letterSpacing: '-0.02em',
          }}>
            <span className="block">
              <Reveal text={H.titleLine1} startDelay={150} stagger={85} />
            </span>
            <span
              className="block italic relative will-change-[transform,filter,opacity]"
              style={{
                color: 'transparent',
                backgroundImage: `linear-gradient(95deg, ${C.bronzeLight} 0%, ${C.goldFoil} 50%, ${C.bronze} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                opacity: 0,
                transform: 'translateY(.4em)',
                filter: 'blur(8px)',
                animation: 'cfcReveal .9s cubic-bezier(.16,1,.3,1) 460ms forwards',
              }}
            >
              {H.titleAccent}
            </span>
            <span className="block">
              <Reveal text={H.titleLine3} startDelay={780} stagger={85} />
            </span>
          </h1>

          <p className="max-w-xl text-[15px] md:text-[16.5px] leading-[1.7] mb-10" style={{
            color: C.muted,
            opacity: 0,
            animation: 'cfcFadeUp .9s 1.4s cubic-bezier(.16,1,.3,1) forwards',
          }}>
            {H.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-5" style={{
            opacity: 0,
            animation: 'cfcFadeUp .9s 1.7s cubic-bezier(.16,1,.3,1) forwards',
          }}>
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
        </div>

        {/* RIGHT — 3 STAT CARDS con tilt 3D */}
        <div className="space-y-3" style={{
          opacity: 0,
          animation: 'cfcFadeUp 1s 1.9s cubic-bezier(.16,1,.3,1) forwards',
          perspective: '1100px',
        }}>
          {H.stats.map((s, i) => (
            <StatCard key={s.label} stat={s} idx={i} />
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes cfcReveal { to { opacity: 1; transform: translateY(0); filter: blur(0); } }
        @keyframes cfcFadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes cfcFloat1 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(40px,40px) scale(1.1); } }
        @keyframes cfcFloat2 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-50px,30px) scale(1.08); } }
        @keyframes cfcFloat3 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(40px,-40px) scale(1.12); } }
        @keyframes cfcFloat4 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-30px,30px) scale(1.1); } }
        @keyframes cfcShine { 0% { transform: translateX(-150%); } 100% { transform: translateX(250%); } }
        @keyframes cfcTwinkle { 0%,100% { opacity: 0.2; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.4); } }
        @keyframes cfcSpinSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </section>
  );
}
