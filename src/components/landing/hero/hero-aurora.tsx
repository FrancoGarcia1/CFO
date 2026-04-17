'use client';
import { useEffect, useState } from 'react';
import { HERO_CONTENT as H } from './data';

/**
 * Elegant word-by-word reveal — Apple/Vision Pro style.
 * Each word fades in from below with a subtle blur-to-sharp transition.
 */
function Reveal({ text, startDelay = 0, stagger = 90 }: { text: string; startDelay?: number; stagger?: number }) {
  const words = text.split(' ');
  return (
    <>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block will-change-[transform,filter,opacity]"
          style={{
            opacity: 0,
            transform: 'translateY(.42em)',
            filter: 'blur(10px)',
            animation: `wordReveal .95s cubic-bezier(.16,1,.3,1) ${startDelay + i * stagger}ms forwards`,
          }}
        >
          {word}
          {i < words.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </>
  );
}

function Counter({ to, suffix = '', duration = 1500, delay = 0 }: { to: number; suffix?: string; duration?: number; delay?: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const tick = (t: number) => {
      const elapsed = t - start - delay;
      if (elapsed < 0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const prog = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - prog, 3);
      setVal(eased * to);
      if (prog < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration, delay]);

  const fmt = to >= 10 ? Math.round(val) : val.toFixed(1);
  return <>{fmt}{suffix}</>;
}

export function HeroAurora() {
  return (
    <section className="relative overflow-hidden px-6 md:px-12 lg:px-20 pt-16 md:pt-24 pb-24" style={{ background: '#0a0a0a', minHeight: '720px' }}>
      {/* Aurora blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[700px] h-[700px] rounded-full blur-[120px]" style={{
          top: '-20%', left: '-10%',
          background: 'radial-gradient(circle, rgba(200,161,90,.22), transparent 60%)',
          animation: 'auroraA 14s ease-in-out infinite',
        }}/>
        <div className="absolute w-[600px] h-[600px] rounded-full blur-[110px]" style={{
          top: '10%', right: '-15%',
          background: 'radial-gradient(circle, rgba(168,196,122,.13), transparent 60%)',
          animation: 'auroraB 18s ease-in-out infinite',
        }}/>
        <div className="absolute w-[550px] h-[550px] rounded-full blur-[110px]" style={{
          bottom: '-20%', left: '30%',
          background: 'radial-gradient(circle, rgba(217,146,90,.12), transparent 60%)',
          animation: 'auroraC 16s ease-in-out infinite',
        }}/>
      </div>

      {/* Mesh grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[.04]" style={{
        backgroundImage: 'linear-gradient(rgba(200,161,90,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(200,161,90,.5) 1px, transparent 1px)',
        backgroundSize: '64px 64px',
      }}/>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <span key={i} className="absolute w-1 h-1 rounded-full" style={{
            left: `${(i * 47) % 100}%`,
            top: `${(i * 31) % 90}%`,
            background: i % 3 === 0 ? '#c8a15a' : '#a8a19a',
            opacity: 0.4,
            animation: `floatUp ${8 + (i % 5)}s linear ${i * 0.3}s infinite`,
          }}/>
        ))}
      </div>

      <div className="relative mx-auto max-w-[1200px] text-center">
        <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-10" style={{
          border: '1px solid rgba(200,161,90,.35)',
          background: 'rgba(200,161,90,.08)',
          backdropFilter: 'blur(12px)',
        }}>
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inset-0 rounded-full animate-ping" style={{ background: '#c8a15a', opacity: 0.5 }} />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: '#c8a15a' }} />
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[3px]" style={{ color: '#c8a15a' }}>{H.badge}</span>
        </div>

        <h1 className="text-[clamp(44px,7vw,92px)] font-extrabold leading-[.98] tracking-tight mb-10" style={{ color: '#f5f0e8' }}>
          <span className="block">
            <Reveal text={H.titleLine1} startDelay={150} stagger={90} />
          </span>
          <span className="block relative" style={{ color: '#c8a15a', textShadow: '0 0 60px rgba(200,161,90,.4)' }}>
            <Reveal text={H.titleAccent} startDelay={550} stagger={90} />
            <span className="absolute inset-x-0 -bottom-2 h-1 rounded-full" style={{
              background: 'linear-gradient(90deg, transparent, #c8a15a 50%, transparent)',
              opacity: 0,
              animation: 'shineReveal 1s 1.6s forwards, shine 2.5s ease-in-out 2.6s infinite',
            }}/>
          </span>
          <span className="block">
            <Reveal text={H.titleLine3} startDelay={900} stagger={90} />
          </span>
        </h1>

        <p className="max-w-xl mx-auto text-[15px] md:text-[16px] leading-relaxed mb-12" style={{ color: '#a8a19a', opacity: 0, animation: 'fadeUp .9s 1.7s cubic-bezier(.16,1,.3,1) forwards' }}>
          {H.description}
        </p>

        <div className="flex items-center justify-center gap-6 mb-16" style={{ opacity: 0, animation: 'fadeUp .9s 2s cubic-bezier(.16,1,.3,1) forwards' }}>
          <a href="/auth/register" className="group relative inline-flex items-center gap-2 rounded-md px-7 py-3.5 text-[13px] font-semibold uppercase tracking-wider overflow-hidden" style={{
            background: 'linear-gradient(135deg, #d4b577, #c8a15a)',
            color: '#0a0a0a',
            boxShadow: '0 20px 50px -10px rgba(200,161,90,.6)',
          }}>
            <span className="absolute inset-0 rounded-md" style={{
              background: 'linear-gradient(120deg, transparent 30%, rgba(255,255,255,.35) 50%, transparent 70%)',
              animation: 'slide 3s ease-in-out infinite',
            }}/>
            <span className="relative">{H.ctaPrimary}</span>
            <svg className="relative group-hover:translate-x-1 transition-transform" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
          <a href="#casos" className="text-[13px]" style={{ color: '#a8a19a' }}>{H.ctaSecondary} ›</a>
        </div>

        {/* Stats row with animated counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto pt-10" style={{ borderTop: '1px solid rgba(200,161,90,.15)', opacity: 0, animation: 'fadeUp 1s 2.3s cubic-bezier(.16,1,.3,1) forwards' }}>
          <div>
            <div className="text-[28px] md:text-[34px] font-extrabold tabular-nums tracking-tight" style={{ color: '#f5f0e8' }}>
              <Counter to={26.4} suffix="%" delay={2400} />
            </div>
            <div className="text-[9px] font-semibold uppercase tracking-[2px] mt-1" style={{ color: '#6b6660' }}>EBITDA prom.</div>
          </div>
          <div>
            <div className="text-[28px] md:text-[34px] font-extrabold tabular-nums tracking-tight" style={{ color: '#f5f0e8' }}>24/7</div>
            <div className="text-[9px] font-semibold uppercase tracking-[2px] mt-1" style={{ color: '#6b6660' }}>Disponible</div>
          </div>
          <div>
            <div className="text-[28px] md:text-[34px] font-extrabold tabular-nums tracking-tight" style={{ color: '#f5f0e8' }}>
              &lt;<Counter to={2} delay={2500} />min
            </div>
            <div className="text-[9px] font-semibold uppercase tracking-[2px] mt-1" style={{ color: '#6b6660' }}>Diagnóstico</div>
          </div>
          <div>
            <div className="text-[28px] md:text-[34px] font-extrabold tabular-nums tracking-tight" style={{ color: '#f5f0e8' }}>
              +<Counter to={85} delay={2600} />
            </div>
            <div className="text-[9px] font-semibold uppercase tracking-[2px] mt-1" style={{ color: '#6b6660' }}>Empresas</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes auroraA { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(60px,40px) scale(1.15); } }
        @keyframes auroraB { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-80px,60px) scale(1.1); } }
        @keyframes auroraC { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(40px,-50px) scale(1.2); } }
        @keyframes floatUp { 0% { transform: translateY(0); opacity: 0; } 10% { opacity: 0.5; } 90% { opacity: 0.3; } 100% { transform: translateY(-100vh); opacity: 0; } }
        @keyframes fadeIn { to { opacity: 1; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes wordReveal { to { opacity: 1; transform: translateY(0); filter: blur(0); } }
        @keyframes shineReveal { to { opacity: 1; } }
        @keyframes shine { 0%,100% { opacity: 0.4; transform: scaleX(1); } 50% { opacity: 1; transform: scaleX(1.2); } }
        @keyframes slide { 0% { transform: translateX(-150%); } 100% { transform: translateX(250%); } }
      `}</style>
    </section>
  );
}
