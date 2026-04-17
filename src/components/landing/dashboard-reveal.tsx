'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Cinematic Dashboard Reveal — scroll-synced storytelling.
 *
 * 3 beats with cross-fade transitions (no abrupt switching):
 *   BEAT 1 (0-33%)   REGISTRA — transactions materialize through depth-blur
 *   BEAT 2 (33-66%)  ANALIZA  — KPIs rise with glow, charts draw layer by layer
 *   BEAT 3 (66-100%) DECIDE   — CFO insight reveals with typewriter + CTA lifts
 *
 * Overlapping beat zones (8% crossfade) prevent jarring switches.
 * Background gradient spotlight follows active beat position.
 */
export function DashboardReveal() {
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

  // Map progress to [0,1] over middle 80% for breathing room at top/bottom
  const p = Math.max(0, Math.min(1, (progress - 0.08) / 0.84));

  // Smooth easing for cross-fades — cubic ease-out
  const ease = (x: number) => 1 - Math.pow(1 - Math.max(0, Math.min(1, x)), 3);

  // Beat opacities with crossfade (overlapping ranges)
  // Beat 1: visible 0-0.40, fade out 0.33-0.40
  // Beat 2: fade in 0.28-0.40, visible 0.40-0.70, fade out 0.63-0.70
  // Beat 3: fade in 0.60-0.72, visible 0.72-1.0
  const o1 = ease(Math.max(0, Math.min(1, (0.40 - p) / 0.08)));
  const o2 = ease(
    p < 0.35
      ? (p - 0.28) / 0.08
      : p > 0.63
        ? (0.72 - p) / 0.08
        : 1
  );
  const o3 = ease(Math.max(0, Math.min(1, (p - 0.60) / 0.12)));

  // Per-beat internal progress (for micro-animations inside each beat)
  const b1 = ease(Math.max(0, Math.min(1, p / 0.33)));
  const b2 = ease(Math.max(0, Math.min(1, (p - 0.33) / 0.33)));
  const b3 = ease(Math.max(0, Math.min(1, (p - 0.66) / 0.30)));

  // Active beat for title highlight + spotlight position
  const activeBeat = p < 0.38 ? 1 : p < 0.68 ? 2 : 3;
  // Spotlight horizontal position follows active beat (0% left → 100% right)
  const spotX = 15 + p * 70;

  // Derived interpolations for beat 2
  const incomeCount = Math.round(55000 * b2);
  const ebitdaCount = Math.round(28000 * b2);
  const score = Math.round(40 + 50 * b2);
  const marginPct = (b2 * 50.9).toFixed(1);
  const momPct = (b2 * 24).toFixed(1);

  // Transaction stagger delays (normalized timing)
  const txProgress = [0.08, 0.25, 0.42, 0.58, 0.74];
  const txOpacities = txProgress.map((t) => ease(Math.max(0, Math.min(1, (b1 - t) / 0.12))));

  return (
    <section
      ref={wrapperRef}
      className="relative"
      style={{ height: '320vh', background: '#0a0a0a' }}
    >
      {/* ── Cinematic spotlight background (moves with active beat) ── */}
      <div className="sticky top-0 h-screen overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none transition-[background] duration-500 ease-out"
          style={{
            background: `radial-gradient(ellipse 60% 50% at ${spotX}% 45%, rgba(200, 161, 90, 0.08), transparent 70%)`,
          }}
        />
        {/* Film grain overlay for cinematic texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* ── Content container ── */}
        <div className="relative h-full flex flex-col">
          {/* Header with dynamic beat indicator */}
          <div className="pt-12 md:pt-20 px-6 md:px-12 lg:px-20">
            <div className="mx-auto max-w-[1400px]">
              {/* Label with animated dot */}
              <div className="flex items-center gap-2.5 mb-5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inset-0 rounded-full animate-ping" style={{ background: '#c8a15a', opacity: 0.5 }} />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: '#c8a15a' }} />
                </span>
                <p className="text-[10px] font-semibold uppercase tracking-[4px]" style={{ color: '#c8a15a' }}>
                  Cómo funciona
                </p>
              </div>

              {/* Cinematic title with per-word states */}
              <div className="flex items-end justify-between flex-wrap gap-6 mb-8 md:mb-14">
                <h2 className="text-[clamp(36px,5.5vw,72px)] font-extrabold leading-[1.02] tracking-tight">
                  <WordHighlight word="Registra." active={activeBeat === 1} past={activeBeat > 1} />
                  {' '}
                  <WordHighlight word="Analiza." active={activeBeat === 2} past={activeBeat > 2} gold />
                  {' '}
                  <WordHighlight word="Decide." active={activeBeat === 3} past={false} />
                </h2>

                {/* Beat indicator with smooth track */}
                <div className="relative flex items-center gap-1.5 h-2">
                  {[1, 2, 3].map((n) => (
                    <div
                      key={n}
                      className="h-[3px] rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: activeBeat === n ? 48 : activeBeat > n ? 14 : 14,
                        background: activeBeat >= n ? '#c8a15a' : 'rgba(255,255,255,.12)',
                        opacity: activeBeat === n ? 1 : activeBeat > n ? 0.55 : 1,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ═══ Main visual: Dashboard frame with beat layers ═══ */}
          <div className="flex-1 flex items-center justify-center px-6 md:px-12 lg:px-20 pb-6">
            <div className="mx-auto max-w-[1050px] w-full">
              {/* Dashboard frame with 3D depth */}
              <div
                className="relative rounded-[18px] p-5 md:p-7 overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #151515 0%, #101010 100%)',
                  border: '1px solid rgba(200,161,90,.08)',
                  boxShadow: `
                    0 0 0 1px rgba(0,0,0,.5),
                    0 20px 60px rgba(0,0,0,.6),
                    0 40px 120px rgba(200,161,90,.08),
                    inset 0 1px 0 rgba(255,255,255,.03)
                  `,
                }}
              >
                {/* Subtle top reflection */}
                <div
                  className="absolute inset-x-0 top-0 h-px pointer-events-none"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(200,161,90,.3), transparent)' }}
                />

                {/* Dashboard chrome — top bar */}
                <div className="flex items-center justify-between mb-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,.05)' }}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-md flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, #d4b577, #a88348)',
                        boxShadow: '0 2px 12px rgba(200,161,90,.3)',
                      }}
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="3" strokeLinecap="round">
                        <polyline points="3 17 9 11 13 15 21 7" />
                      </svg>
                    </div>
                    <span className="text-[12px] font-bold">Capital<span style={{ color: '#c8a15a' }}>CFO</span></span>
                  </div>

                  {/* Tabs with sliding indicator */}
                  <div className="relative flex items-center gap-6 text-[10px] font-semibold uppercase tracking-[2px]">
                    {['Entrada', 'Dashboard', 'Chat'].map((tab, i) => {
                      const isActive = activeBeat === i + 1;
                      return (
                        <span
                          key={tab}
                          className="relative transition-colors duration-500"
                          style={{ color: isActive ? '#c8a15a' : '#6b6660' }}
                        >
                          {tab}
                          {isActive && (
                            <span
                              className="absolute left-0 right-0 -bottom-[17px] h-[2px] rounded-full"
                              style={{
                                background: '#c8a15a',
                                boxShadow: '0 0 8px rgba(200,161,90,.6)',
                              }}
                            />
                          )}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* ═══ STACKED BEAT LAYERS (all present, cross-fade via opacity) ═══ */}
                <div className="relative" style={{ minHeight: 300 }}>

                  {/* ── LAYER 1: Transaction list ── */}
                  <div
                    className="absolute inset-0 space-y-2"
                    style={{
                      opacity: o1,
                      pointerEvents: o1 > 0.5 ? 'auto' : 'none',
                      transform: `translateY(${(1 - o1) * -8}px) scale(${0.98 + o1 * 0.02})`,
                      filter: `blur(${(1 - o1) * 4}px)`,
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[9px] font-bold uppercase tracking-[2px]" style={{ color: '#6b6660' }}>
                        Últimas transacciones
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inset-0 rounded-full animate-ping" style={{ background: '#c8a15a', opacity: 0.6 }} />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: '#c8a15a' }} />
                        </span>
                        <span className="text-[10px] font-mono tabular-nums" style={{ color: '#c8a15a' }}>
                          {txOpacities.filter((o) => o > 0.5).length}/5 registradas
                        </span>
                      </div>
                    </div>
                    {[
                      { type: 'INGRESO', cat: 'Ventas servicios', concept: 'Consultoría abril', amount: '+15,000', color: '#c8a15a' },
                      { type: 'INGRESO', cat: 'Ventas productos', concept: 'Licencia software', amount: '+8,000', color: '#c8a15a' },
                      { type: 'COSTO', cat: 'Mano de obra', concept: 'Freelancer diseño', amount: '-4,500', color: '#ef4444' },
                      { type: 'GASTO', cat: 'Alquiler', concept: 'Oficina Miraflores', amount: '-5,000', color: '#eab308' },
                      { type: 'GASTO', cat: 'Marketing', concept: 'Google Ads', amount: '-2,500', color: '#eab308' },
                    ].map((tx, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-2.5 px-3 rounded-lg"
                        style={{
                          background: 'rgba(10,10,10,.7)',
                          border: `1px solid ${txOpacities[i] > 0.8 ? 'rgba(200,161,90,.15)' : 'rgba(31,31,31,1)'}`,
                          opacity: 0.2 + txOpacities[i] * 0.8,
                          transform: `translateY(${(1 - txOpacities[i]) * 10}px) scale(${0.96 + txOpacities[i] * 0.04})`,
                          transition: 'border-color .4s ease',
                          boxShadow: txOpacities[i] > 0.9 ? `0 4px 20px ${tx.color}10` : 'none',
                        }}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded tracking-wider flex-shrink-0"
                            style={{ background: `${tx.color}18`, color: tx.color }}
                          >
                            {tx.type}
                          </span>
                          <span className="text-[11px] truncate" style={{ color: '#9a9490' }}>{tx.cat}</span>
                          <span className="text-[11px] font-medium truncate hidden sm:inline">{tx.concept}</span>
                        </div>
                        <span className="text-[12px] font-mono font-bold tabular-nums flex-shrink-0" style={{ color: tx.color }}>
                          {tx.amount}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* ── LAYER 2: KPIs grid ── */}
                  <div
                    className="absolute inset-0 grid grid-cols-4 gap-3"
                    style={{
                      opacity: o2,
                      pointerEvents: o2 > 0.5 ? 'auto' : 'none',
                      transform: `translateY(${(1 - o2) * 12}px) scale(${0.96 + o2 * 0.04})`,
                      filter: `blur(${(1 - o2) * 5}px)`,
                    }}
                  >
                    {/* INGRESOS — big gold tile */}
                    <div
                      className="col-span-2 rounded-xl p-4 md:p-5 relative overflow-hidden"
                      style={{
                        background: 'linear-gradient(135deg, #d4b577, #c8a15a 60%, #a88348)',
                        boxShadow: `0 8px 32px rgba(200,161,90,${0.15 + b2 * 0.2})`,
                      }}
                    >
                      {/* Shine overlay */}
                      <div
                        className="absolute inset-0 pointer-events-none opacity-30"
                        style={{ background: 'linear-gradient(135deg, rgba(255,255,255,.25), transparent 50%)' }}
                      />
                      <div className="relative">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-[9px] font-bold uppercase tracking-[2px] text-black/60">Ingresos</div>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round">
                            <polyline points="18 15 12 9 6 15" />
                          </svg>
                        </div>
                        <div className="text-2xl md:text-3xl font-mono font-bold text-black tabular-nums">
                          S/ {incomeCount.toLocaleString()}
                        </div>
                        <div className="text-[10px] font-medium text-black/60 mt-2 flex items-center gap-1.5">
                          <span className="inline-block w-0 h-0" style={{
                            borderLeft: '3px solid transparent',
                            borderRight: '3px solid transparent',
                            borderBottom: '4px solid rgba(0,0,0,.6)',
                          }} />
                          {momPct}% vs mes anterior
                        </div>
                      </div>
                    </div>

                    {/* EBITDA — cream tile */}
                    <div
                      className="col-span-2 rounded-xl p-4 md:p-5 relative overflow-hidden"
                      style={{
                        background: 'linear-gradient(135deg, #f0d5b0, #e8c9a8 60%, #d4b590)',
                        boxShadow: '0 8px 24px rgba(232,201,168,.12)',
                      }}
                    >
                      <div
                        className="absolute inset-0 pointer-events-none opacity-30"
                        style={{ background: 'linear-gradient(135deg, rgba(255,255,255,.3), transparent 50%)' }}
                      />
                      <div className="relative">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-[9px] font-bold uppercase tracking-[2px] text-black/60">EBITDA</div>
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/10 text-black/70">
                            {marginPct}%
                          </span>
                        </div>
                        <div className="text-2xl md:text-3xl font-mono font-bold text-black tabular-nums">
                          S/ {ebitdaCount.toLocaleString()}
                        </div>
                        <div className="text-[10px] font-medium text-black/60 mt-2">
                          Margen operativo saludable
                        </div>
                      </div>
                    </div>

                    {/* HEALTH SCORE ring */}
                    <div
                      className="col-span-2 rounded-xl p-4 flex items-center justify-center relative overflow-hidden"
                      style={{
                        background: 'linear-gradient(135deg, #131313, #0a0a0a)',
                        border: '1px solid rgba(200,161,90,.08)',
                      }}
                    >
                      {/* Radial glow behind ring */}
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: `radial-gradient(circle at center, ${score >= 70 ? 'rgba(200,161,90,' : score >= 45 ? 'rgba(234,179,8,' : 'rgba(239,68,68,'}${0.08 + b2 * 0.1}), transparent 60%)`,
                        }}
                      />
                      <HealthRing score={score} intensity={b2} />
                    </div>

                    {/* BAR CHART */}
                    <div
                      className="col-span-2 rounded-xl p-4 relative"
                      style={{
                        background: 'linear-gradient(135deg, #131313, #0a0a0a)',
                        border: '1px solid rgba(200,161,90,.08)',
                      }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-[9px] font-bold uppercase tracking-[2px]" style={{ color: '#6b6660' }}>
                          Ingresos 6M
                        </div>
                        <span className="text-[9px] font-mono" style={{ color: '#c8a15a' }}>
                          +{momPct}% ↗
                        </span>
                      </div>
                      <div className="flex items-end justify-between h-20 gap-1.5">
                        {[0.4, 0.55, 0.45, 0.8, 0.7, 0.95].map((h, i) => {
                          const delay = i * 0.08;
                          const barGrow = Math.max(0, Math.min(1, (b2 - delay) / 0.3));
                          const isHighlight = i >= 3;
                          return (
                            <div
                              key={i}
                              className="flex-1 rounded-t-md relative"
                              style={{
                                height: `${h * barGrow * 100}%`,
                                background: isHighlight
                                  ? 'linear-gradient(180deg, #d4b577, #a88348)'
                                  : 'linear-gradient(180deg, rgba(200,161,90,.35), rgba(200,161,90,.15))',
                                boxShadow: isHighlight ? `0 0 12px rgba(200,161,90,${0.3 + b2 * 0.3})` : 'none',
                                transition: 'height .3s cubic-bezier(.22,1,.36,1)',
                              }}
                            />
                          );
                        })}
                      </div>
                      <div className="flex justify-between mt-2 text-[8px] font-mono" style={{ color: '#6b6660' }}>
                        {['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN'].map((m, i) => (
                          <span key={m} style={{ color: i >= 3 ? '#c8a15a' : '#6b6660' }}>{m}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* ── LAYER 3: CFO chat ── */}
                  <div
                    className="absolute inset-0 flex flex-col gap-4"
                    style={{
                      opacity: o3,
                      pointerEvents: o3 > 0.5 ? 'auto' : 'none',
                      transform: `translateY(${(1 - o3) * 16}px)`,
                      filter: `blur(${(1 - o3) * 4}px)`,
                    }}
                  >
                    {/* User question */}
                    <div
                      className="flex justify-end"
                      style={{
                        opacity: ease(Math.max(0, Math.min(1, b3 / 0.2))),
                        transform: `translateY(${Math.max(0, (0.2 - b3) * 40)}px)`,
                        transition: 'all .4s ease-out',
                      }}
                    >
                      <div
                        className="max-w-[70%] px-4 py-2.5 rounded-2xl rounded-br-sm text-[13px] font-medium"
                        style={{
                          background: 'linear-gradient(135deg, #d4b577, #c8a15a)',
                          color: '#0a0a0a',
                          boxShadow: '0 6px 20px rgba(200,161,90,.2)',
                        }}
                      >
                        ¿Cómo mejoro mi margen EBITDA?
                      </div>
                    </div>

                    {/* CFO response */}
                    <div
                      className="flex items-start gap-2"
                      style={{
                        opacity: ease(Math.max(0, Math.min(1, (b3 - 0.2) / 0.2))),
                        transform: `translateY(${Math.max(0, (0.4 - b3) * 30)}px)`,
                        transition: 'all .4s ease-out',
                      }}
                    >
                      <div
                        className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold"
                        style={{
                          background: 'linear-gradient(135deg, #d4b577, #a88348)',
                          color: '#0a0a0a',
                          boxShadow: '0 4px 16px rgba(200,161,90,.3)',
                        }}
                      >
                        CC
                      </div>
                      <div
                        className="max-w-[85%] px-5 py-4 rounded-2xl rounded-bl-sm relative overflow-hidden"
                        style={{
                          background: 'linear-gradient(135deg, rgba(20,20,20,.95), rgba(10,10,10,.95))',
                          border: '1px solid rgba(200,161,90,.15)',
                          boxShadow: '0 8px 32px rgba(0,0,0,.4)',
                        }}
                      >
                        {/* Subtle top accent line */}
                        <div
                          className="absolute inset-x-0 top-0 h-px"
                          style={{ background: 'linear-gradient(90deg, transparent, rgba(200,161,90,.5), transparent)' }}
                        />
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-mono font-bold tracking-[1.5px]" style={{ color: '#c8a15a' }}>
                            CAPITAL CFO
                          </span>
                          <span className="text-[8px] font-mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(200,161,90,.12)', color: '#c8a15a' }}>
                            AI
                          </span>
                        </div>
                        <p className="text-[13px] leading-relaxed" style={{ color: '#f5f0e8' }}>
                          <span className="inline-block w-2 h-2 rounded-full mr-1.5 align-middle" style={{ background: '#ef4444', boxShadow: '0 0 8px #ef4444' }} />
                          <strong>Tu mayor fuga:</strong> los gastos operativos son <strong className="font-mono">33.6%</strong> de tus ingresos. Reduce 5% en marketing pagado y redirige a contenido orgánico.
                        </p>
                        <div
                          className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg"
                          style={{ background: 'rgba(200,161,90,.08)', border: '1px solid rgba(200,161,90,.2)' }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#c8a15a" strokeWidth="2.5" strokeLinecap="round">
                            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                          </svg>
                          <span className="text-[11px] font-semibold" style={{ color: '#c8a15a' }}>
                            Impacto: +S/ 2,750/mes en EBITDA
                          </span>
                        </div>
                        <div className="mt-3 pt-3 flex items-center gap-2 text-[10px]" style={{ borderTop: '1px solid rgba(200,161,90,.1)' }}>
                          <span style={{ color: '#6b6660' }}>📌 Prioridad ahora:</span>
                          <span className="font-semibold" style={{ color: '#c8a15a' }}>3 acciones sugeridas →</span>
                        </div>
                      </div>
                    </div>

                    {/* CTA */}
                    <div
                      className="flex-1 flex items-end justify-center pb-2"
                      style={{
                        opacity: ease(Math.max(0, Math.min(1, (b3 - 0.45) / 0.25))),
                        transform: `translateY(${Math.max(0, (0.70 - b3) * 40)}px)`,
                        transition: 'all .5s ease-out',
                      }}
                    >
                      <a
                        href="/auth/register"
                        className="group inline-flex items-center gap-3 rounded-xl px-8 py-4 text-[13px] font-bold uppercase tracking-[2px] relative overflow-hidden"
                        style={{
                          background: 'linear-gradient(135deg, #d4b577, #c8a15a, #a88348)',
                          color: '#0a0a0a',
                          boxShadow: '0 12px 40px rgba(200,161,90,.35), 0 0 0 1px rgba(200,161,90,.2)',
                        }}
                      >
                        <span
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{ background: 'linear-gradient(135deg, #e0c38a, #d4b577)' }}
                        />
                        <span className="relative z-10">Comenzar prueba gratuita</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Cinematic caption with cross-fade ── */}
              <div className="mt-6 md:mt-8 relative h-6 flex items-center justify-center">
                {[
                  'Sube tus transacciones o importa un CSV. Capital CFO las organiza por tipo y categoría al instante.',
                  'Los KPIs se calculan automáticamente. Health Score, márgenes, tendencias — todo al día.',
                  'Tu CFO virtual analiza los datos reales y sugiere las acciones de mayor impacto financiero.',
                ].map((text, i) => {
                  const captionOpacity = activeBeat === i + 1 ? 1 : 0;
                  return (
                    <p
                      key={i}
                      className="absolute inset-0 text-[13px] text-center flex items-center justify-center max-w-2xl mx-auto transition-opacity duration-500"
                      style={{
                        color: '#9a9490',
                        opacity: captionOpacity,
                      }}
                    >
                      {text}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Cinematic scroll hint ── */}
          <div className="pb-8 flex justify-center items-center gap-3">
            <div
              className="h-px transition-all duration-500"
              style={{
                width: progress < 0.9 ? 40 : 0,
                background: 'linear-gradient(90deg, transparent, rgba(200,161,90,.5))',
              }}
            />
            <p className="text-[9px] uppercase tracking-[4px] font-bold" style={{ color: progress < 0.9 ? '#c8a15a' : '#3a3a3a' }}>
              {progress < 0.9 ? 'Scrollea' : '✓ Completo'}
            </p>
            <div
              className="h-px transition-all duration-500"
              style={{
                width: progress < 0.9 ? 40 : 0,
                background: 'linear-gradient(270deg, transparent, rgba(200,161,90,.5))',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Animated Word with underline/highlight ─── */
function WordHighlight({ word, active, past, gold }: { word: string; active: boolean; past: boolean; gold?: boolean }) {
  return (
    <span className="relative inline-block">
      <span
        className="transition-all duration-700 ease-out"
        style={{
          color: active ? (gold ? '#c8a15a' : '#fff') : past ? 'rgba(200,161,90,.35)' : 'rgba(255,255,255,.18)',
          textShadow: active ? (gold ? '0 0 40px rgba(200,161,90,.4)' : '0 0 40px rgba(255,255,255,.2)') : 'none',
          filter: active ? 'none' : 'blur(0.2px)',
        }}
      >
        {word}
      </span>
      {active && (
        <span
          className="absolute -bottom-1 left-0 h-[2px] rounded-full"
          style={{
            width: '80%',
            background: 'linear-gradient(90deg, #c8a15a, transparent)',
            animation: 'underlineGrow .6s cubic-bezier(.22,1,.36,1) forwards',
          }}
        />
      )}
      <style>{`@keyframes underlineGrow{from{width:0}to{width:80%}}`}</style>
    </span>
  );
}

/* ─── Cinematic Health Ring with glow ─── */
function HealthRing({ score, intensity = 1 }: { score: number; intensity?: number }) {
  const clamped = Math.max(0, Math.min(100, score));
  const r = 34;
  const circ = 2 * Math.PI * r;
  const offset = circ - (clamped / 100) * circ;
  const color = clamped >= 70 ? '#c8a15a' : clamped >= 45 ? '#eab308' : '#ef4444';
  const label = clamped >= 70 ? 'SALUDABLE' : clamped >= 45 ? 'EN RIESGO' : 'CRÍTICO';

  return (
    <div className="flex flex-col items-center gap-2 relative">
      <svg width="100" height="100" viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 ${8 + intensity * 12}px ${color}${Math.round(40 + intensity * 40).toString(16)})` }}>
        <defs>
          <linearGradient id={`ring-${color}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.6" />
          </linearGradient>
        </defs>
        {/* Track */}
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,.05)" strokeWidth="5" />
        {/* Progress */}
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke={`url(#ring-${color})`}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dashoffset .3s cubic-bezier(.22,1,.36,1)' }}
        />
        {/* Score */}
        <text x="50" y="48" textAnchor="middle" fontSize="22" fontWeight="800" fill={color} fontFamily="JetBrains Mono, monospace">
          {clamped}
        </text>
        <text x="50" y="62" textAnchor="middle" fontSize="6" fontWeight="700" letterSpacing="2" fill={color}>
          {label}
        </text>
      </svg>
      <span className="text-[8px] font-bold uppercase tracking-[2.5px]" style={{ color: '#6b6660' }}>
        Health Score
      </span>
    </div>
  );
}
