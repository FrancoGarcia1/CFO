'use client';
import { useEffect, useRef, useState } from 'react';
import { HERO_CONTENT as H } from './data';

export function HeroDashboard() {
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    function handle(e: MouseEvent) {
      const rect = el!.getBoundingClientRect();
      setMouse({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      });
    }
    el.addEventListener('mousemove', handle);
    return () => el.removeEventListener('mousemove', handle);
  }, []);

  const tx = (mouse.x - 0.5) * 16;
  const ty = (mouse.y - 0.5) * 12;

  return (
    <section
      ref={ref}
      className="relative overflow-hidden px-6 md:px-12 lg:px-20 pt-10 md:pt-16 pb-16"
      style={{ background: '#0a0a0a' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 70% 60% at ${30 + mouse.x * 20}% ${mouse.y * 100}%, rgba(200,161,90,.08), transparent 60%)`,
        }}
      />
      <div className="relative mx-auto max-w-[1400px] grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-center">
        {/* Left */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-7" style={{ border: '1px solid rgba(200,161,90,.3)', background: 'rgba(200,161,90,.06)' }}>
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full animate-ping" style={{ background: '#c8a15a', opacity: 0.5 }} />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: '#c8a15a' }} />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[3px]" style={{ color: '#c8a15a' }}>
              {H.badge}
            </span>
          </div>

          <h1 className="text-[clamp(40px,5.5vw,68px)] font-extrabold leading-[1.02] tracking-tight mb-7" style={{ color: '#f5f0e8' }}>
            {H.titleLine1}
            <br />
            <span style={{ color: '#c8a15a' }}>{H.titleAccent}</span>
            <br />
            {H.titleLine3}
          </h1>

          <p className="max-w-xl text-[15px] leading-relaxed mb-9" style={{ color: '#a8a19a' }}>
            {H.description}
          </p>

          <div className="flex items-center gap-5 mb-12">
            <a href="/auth/register" className="group inline-flex items-center gap-2 rounded-md px-6 py-3.5 text-[13px] font-semibold uppercase tracking-wider transition-all" style={{ background: 'linear-gradient(135deg, #d4b577, #c8a15a)', color: '#0a0a0a', boxShadow: '0 10px 30px -10px rgba(200,161,90,.5)' }}>
              {H.ctaPrimary}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-1 transition-transform"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
            <a href="#casos" className="text-[13px] transition-colors" style={{ color: '#a8a19a' }}>
              {H.ctaSecondary} ›
            </a>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {H.stats.map((s) => (
              <div key={s.label}>
                <div className="text-[22px] md:text-[26px] font-extrabold tracking-tight" style={{ color: '#f5f0e8' }}>{s.value}</div>
                <div className="text-[9px] font-semibold uppercase tracking-[2px] mt-1" style={{ color: '#6b6660' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Live dashboard floating */}
        <div
          className="relative"
          style={{
            perspective: '1400px',
            transform: `translate3d(${tx}px, ${ty}px, 0)`,
            transition: 'transform .25s ease-out',
          }}
        >
          <div
            className="relative p-4 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(19,17,16,.95), rgba(13,11,10,.85))',
              border: '1px solid rgba(200,161,90,.25)',
              boxShadow: '0 40px 80px -20px rgba(0,0,0,.9), 0 0 60px rgba(200,161,90,.08)',
              backdropFilter: 'blur(16px)',
              transformStyle: 'preserve-3d',
              transform: `rotateY(${(mouse.x - 0.5) * -8}deg) rotateX(${(mouse.y - 0.5) * 6}deg)`,
              transition: 'transform .3s ease-out',
            }}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-3 py-2 mb-3" style={{ borderBottom: '1px solid rgba(200,161,90,.15)' }}>
              <div className="flex items-center gap-2">
                <span className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#ef4444' }} />
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#eab308' }} />
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#22c55e' }} />
                </span>
                <span className="text-[10px] font-mono uppercase tracking-[2px] ml-3" style={{ color: '#c8a15a' }}>
                  Capital CFO · Dashboard
                </span>
              </div>
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 rounded-full animate-ping" style={{ background: '#22c55e', opacity: 0.6 }} />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: '#22c55e' }} />
              </span>
            </div>

            {/* Content grid */}
            <div className="grid grid-cols-2 gap-3 p-2">
              <MiniPanel accent="#a8c47a" label="EBITDA" value="S/ 28,450" delta="+18.3%" i={0} />
              <MiniPanel accent="#c8a15a" label="INGRESOS" value="S/ 55,000" delta="+24.0%" i={1} />
              <MiniPanel accent="#d9925a" label="OPEX" value="33.6%" delta="+5.1 pts" i={2} />
              <MiniPanel accent="#a8c47a" label="SCORE" value="77/100" delta="Saludable" i={3} />
            </div>

            {/* Big chart */}
            <div className="mt-2 p-3 rounded-lg" style={{ background: 'rgba(200,161,90,.04)', border: '1px solid rgba(200,161,90,.1)' }}>
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-[9px] font-mono font-bold uppercase tracking-[2px]" style={{ color: '#c8a15a' }}>
                  Flujo de ingresos
                </span>
                <span className="text-[9px] font-mono tabular-nums" style={{ color: '#a8a19a' }}>
                  12 meses
                </span>
              </div>
              <svg viewBox="0 0 300 70" className="w-full" preserveAspectRatio="none" style={{ height: 70 }}>
                <defs>
                  <linearGradient id="area-hero" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#c8a15a" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#c8a15a" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,58 L30,50 L60,52 L90,42 L120,38 L150,44 L180,32 L210,28 L240,22 L270,18 L300,12 L300,70 L0,70 Z" fill="url(#area-hero)" />
                <path d="M0,58 L30,50 L60,52 L90,42 L120,38 L150,44 L180,32 L210,28 L240,22 L270,18 L300,12" fill="none" stroke="#c8a15a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 4px rgba(200,161,90,.5))' }} />
                <circle cx="300" cy="12" r="3" fill="#c8a15a">
                  <animate attributeName="r" values="3;5;3" dur="1.5s" repeatCount="indefinite" />
                </circle>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniPanel({ accent, label, value, delta, i }: { accent: string; label: string; value: string; delta: string; i: number }) {
  return (
    <div className="p-3 rounded-md" style={{ background: 'rgba(200,161,90,.04)', border: `1px solid ${accent}25`, animation: `fadeUp .5s ${0.2 + i * 0.1}s both` }}>
      <div className="text-[8px] font-mono font-bold uppercase tracking-[2px] mb-1.5" style={{ color: '#6b6660' }}>{label}</div>
      <div className="text-[18px] font-mono font-bold tabular-nums leading-none" style={{ color: accent }}>{value}</div>
      <div className="text-[9px] font-mono tabular-nums mt-1" style={{ color: accent, opacity: 0.7 }}>▲ {delta}</div>
      <style jsx>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
