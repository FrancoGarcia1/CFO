'use client';
import { useEffect, useRef, useState } from 'react';
import { HERO_CONTENT as H } from './data';

export function HeroParallax() {
  const ref = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });

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

  const layer = (d: number) => ({
    transform: `translate3d(${(mouse.x - 0.5) * d * 30}px, ${(mouse.y - 0.5) * d * 25}px, 0)`,
    transition: 'transform .4s cubic-bezier(.16,1,.3,1)',
  });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden px-6 md:px-12 lg:px-20 pt-16 md:pt-24 pb-20"
      style={{ background: 'radial-gradient(ellipse at top, #14100a 0%, #0a0a0a 60%)', minHeight: '720px' }}
    >
      {/* Constellation BG */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.12]" style={{
        backgroundImage: 'radial-gradient(circle 1px at 20% 30%, #c8a15a, transparent), radial-gradient(circle 1px at 65% 20%, #c8a15a, transparent), radial-gradient(circle 1px at 80% 70%, #c8a15a, transparent), radial-gradient(circle 1px at 15% 75%, #c8a15a, transparent), radial-gradient(circle 1px at 45% 55%, #c8a15a, transparent)',
        backgroundSize: '100% 100%',
      }}/>
      {/* Orb left */}
      <div className="absolute -left-20 top-0 w-[380px] h-[380px] rounded-full blur-[80px] pointer-events-none" style={{ ...layer(0.2), background: 'radial-gradient(circle, rgba(200,161,90,.18), transparent 65%)' }} />
      {/* Orb right */}
      <div className="absolute -right-32 bottom-10 w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none" style={{ ...layer(0.35), background: 'radial-gradient(circle, rgba(168,196,122,.1), transparent 65%)' }} />

      <div className="relative mx-auto max-w-[1400px]">
        {/* Central title block */}
        <div className="relative text-center" style={layer(-0.15)}>
          <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-8" style={{ border: '1px solid rgba(200,161,90,.3)', background: 'rgba(200,161,90,.06)' }}>
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full animate-ping" style={{ background: '#c8a15a', opacity: 0.5 }} />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: '#c8a15a' }} />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[3px]" style={{ color: '#c8a15a' }}>{H.badge}</span>
          </div>

          <h1 className="text-[clamp(44px,7vw,88px)] font-extrabold leading-[.98] tracking-tight mb-8" style={{ color: '#f5f0e8' }}>
            {H.titleLine1}
            <br />
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: 'linear-gradient(90deg, #d4b577 0%, #c8a15a 45%, #a88348 100%)',
                filter: 'drop-shadow(0 0 30px rgba(200,161,90,.35))',
              }}
            >
              {H.titleAccent}
            </span>
            <br />
            {H.titleLine3}
          </h1>

          <p className="max-w-xl mx-auto text-[15px] md:text-[16px] leading-relaxed mb-10" style={{ color: '#a8a19a' }}>
            {H.description}
          </p>

          <div className="flex items-center justify-center gap-6 mb-16">
            <a href="/auth/register" className="group inline-flex items-center gap-2 rounded-md px-7 py-3.5 text-[13px] font-semibold uppercase tracking-wider transition-all" style={{ background: 'linear-gradient(135deg, #d4b577, #c8a15a)', color: '#0a0a0a', boxShadow: '0 16px 40px -10px rgba(200,161,90,.6)' }}>
              {H.ctaPrimary}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-1 transition-transform"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
            <a href="#casos" className="text-[13px]" style={{ color: '#a8a19a' }}>{H.ctaSecondary} ›</a>
          </div>
        </div>

        {/* Floating layers around the title */}
        {/* Layer 1 (far left) — sparkline floating */}
        <div className="hidden md:block absolute left-0 top-[15%] p-4 rounded-xl" style={{ ...layer(0.7), background: 'rgba(19,17,16,.55)', backdropFilter: 'blur(12px)', border: '1px solid rgba(200,161,90,.25)', width: 180 }}>
          <div className="text-[8px] font-mono uppercase tracking-[2px] mb-1.5" style={{ color: '#6b6660' }}>EBITDA</div>
          <div className="text-[18px] font-mono font-bold tabular-nums" style={{ color: '#c8a15a' }}>S/ 28,450</div>
          <svg viewBox="0 0 120 30" className="w-full mt-2" style={{ height: 26 }}>
            <path d="M0,25 L20,20 L40,22 L60,15 L80,10 L100,12 L120,5" fill="none" stroke="#c8a15a" strokeWidth="1.2" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 3px rgba(200,161,90,.6))' }}/>
          </svg>
        </div>

        {/* Layer 2 (close left, below) — Health ring */}
        <div className="hidden md:block absolute left-[12%] bottom-[8%] p-4 rounded-full flex items-center gap-3" style={{ ...layer(0.9), background: 'rgba(19,17,16,.6)', backdropFilter: 'blur(12px)', border: '1px solid rgba(168,196,122,.3)', padding: '16px 20px' }}>
          <svg width="36" height="36" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(168,196,122,.15)" strokeWidth="3" />
            <circle cx="20" cy="20" r="16" fill="none" stroke="#a8c47a" strokeWidth="3" strokeLinecap="round" strokeDasharray="100" strokeDashoffset="23" transform="rotate(-90 20 20)" />
            <text x="20" y="24" textAnchor="middle" fontSize="11" fontWeight="700" fill="#a8c47a" fontFamily="JetBrains Mono">77</text>
          </svg>
          <div>
            <div className="text-[8px] font-mono uppercase tracking-[2px]" style={{ color: '#6b6660' }}>Health</div>
            <div className="text-[11px] font-mono font-bold" style={{ color: '#a8c47a' }}>Saludable</div>
          </div>
        </div>

        {/* Layer 3 (far right) — Forecast card */}
        <div className="hidden md:block absolute right-0 top-[22%] p-4 rounded-xl" style={{ ...layer(0.6), background: 'rgba(19,17,16,.55)', backdropFilter: 'blur(12px)', border: '1px solid rgba(200,161,90,.25)', width: 190 }}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[8px] font-mono uppercase tracking-[2px]" style={{ color: '#6b6660' }}>FORECAST Q3</span>
            <span className="text-[8px] font-mono tabular-nums" style={{ color: '#a8c47a' }}>+24%</span>
          </div>
          <div className="text-[18px] font-mono font-bold tabular-nums" style={{ color: '#f5f0e8' }}>S/ 185,200</div>
          <div className="flex gap-1 mt-2 items-end h-6">
            {[40, 55, 45, 65, 70, 85, 92].map((h, i) => (
              <div key={i} className="flex-1 rounded-sm" style={{ background: i >= 4 ? '#c8a15a' : 'rgba(200,161,90,.35)', height: `${h}%` }}/>
            ))}
          </div>
        </div>

        {/* Layer 4 (close right, below) — Transaction ticker */}
        <div className="hidden md:block absolute right-[10%] bottom-[12%] p-3 rounded-xl" style={{ ...layer(1.1), background: 'rgba(19,17,16,.65)', backdropFilter: 'blur(12px)', border: '1px solid rgba(200,161,90,.25)', minWidth: 200 }}>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="relative flex h-1.5 w-1.5"><span className="absolute inset-0 rounded-full animate-ping" style={{ background: '#a8c47a', opacity: 0.5 }}/><span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: '#a8c47a' }}/></span>
            <span className="text-[8px] font-mono font-bold uppercase tracking-[2px]" style={{ color: '#a8c47a' }}>LIVE</span>
          </div>
          <div className="text-[11px] font-mono tabular-nums" style={{ color: '#f5f0e8' }}>+S/ 15,000</div>
          <div className="text-[9px]" style={{ color: '#a8a19a' }}>Consultoría Abril</div>
        </div>

        {/* Stats */}
        <div className="relative grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-8" style={{ borderTop: '1px solid rgba(200,161,90,.15)', ...layer(-0.1) }}>
          {H.stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-[26px] md:text-[32px] font-extrabold tracking-tight" style={{ color: '#f5f0e8' }}>{s.value}</div>
              <div className="text-[9px] font-semibold uppercase tracking-[2px] mt-1" style={{ color: '#6b6660' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
