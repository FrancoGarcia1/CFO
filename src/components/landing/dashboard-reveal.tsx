'use client';

import { useRef } from 'react';
import { useScrollProgress, mapRange, lerp } from '@/hooks/use-scroll-progress';

/**
 * Dashboard Reveal — scroll-synced storytelling section.
 *
 * The user scrolls through 3 beats:
 *   1. REGISTRA (0-33%): Transactions appear one by one
 *   2. ANALIZA (33-66%): KPIs count up, charts draw, Health Score fills
 *   3. DECIDE (66-100%): CFO chat bubble appears with insight, CTA reveals
 *
 * Pinned canvas-style section that stays fixed while the user scrolls 300vh.
 * Everything is SVG + CSS (no pre-rendered images needed, fully responsive).
 */
export function DashboardReveal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(sectionRef);

  // Beats — each is a slice of the total progress
  const beat1 = mapRange(progress, 0.1, 0.35, 0, 1);  // Registra
  const beat2 = mapRange(progress, 0.35, 0.65, 0, 1); // Analiza
  const beat3 = mapRange(progress, 0.65, 0.9, 0, 1);  // Decide

  // Derived values — everything interpolated from progress
  const incomeCount = Math.round(lerp(0, 55000, beat2));
  const ebitdaCount = Math.round(lerp(0, 28000, beat2));
  const score = Math.round(lerp(40, 90, beat2));
  const barHeights = [beat2 * 0.4, beat2 * 0.75, beat2 * 0.55, beat2 * 0.95, beat2 * 0.65, beat2 * 0.85];
  const lineDrawLength = beat2;

  // Which transactions are visible (beat 1)
  const txVisible = [
    beat1 > 0.15,
    beat1 > 0.35,
    beat1 > 0.55,
    beat1 > 0.75,
    beat1 > 0.9,
  ];

  // Which beat is "active" (for title highlighting)
  const activeBeat = progress < 0.35 ? 1 : progress < 0.65 ? 2 : 3;

  return (
    <section ref={sectionRef} className="relative" style={{ height: '350vh', background: '#0a0a0a' }}>
      {/* Sticky container — stays pinned while user scrolls through 350vh */}
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col">

        {/* ═══ Header: Beat indicator ═══ */}
        <div className="pt-8 md:pt-14 px-6 md:px-12 lg:px-20">
          <div className="mx-auto max-w-[1400px]">
            <p className="text-[10px] font-semibold uppercase tracking-[3px] mb-4" style={{ color: '#c8a15a' }}>
              Cómo funciona
            </p>
            <div className="flex items-end justify-between flex-wrap gap-6">
              <h2 className="text-[clamp(32px,5vw,56px)] font-extrabold leading-[1.05] tracking-tight max-w-3xl">
                <span style={{ color: activeBeat === 1 ? '#fff' : 'rgba(255,255,255,.2)', transition: 'color .3s' }}>Registra.</span>{' '}
                <span style={{ color: activeBeat === 2 ? '#c8a15a' : 'rgba(200,161,90,.15)', transition: 'color .3s' }}>Analiza.</span>{' '}
                <span style={{ color: activeBeat === 3 ? '#fff' : 'rgba(255,255,255,.2)', transition: 'color .3s' }}>Decide.</span>
              </h2>
              {/* Progress dots */}
              <div className="flex gap-2">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="h-1 rounded-full transition-all duration-500"
                    style={{
                      width: activeBeat === n ? 40 : 16,
                      background: activeBeat === n ? '#c8a15a' : 'rgba(255,255,255,.15)',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ═══ Main visual area: Fake dashboard ═══ */}
        <div className="flex-1 flex items-center justify-center px-6 md:px-12 lg:px-20 pt-6 pb-10">
          <div className="mx-auto max-w-[1100px] w-full relative">

            {/* Dashboard frame */}
            <div
              className="rounded-xl p-5 md:p-7 shadow-2xl"
              style={{
                background: '#141414',
                border: '1px solid #1f1f1f',
                boxShadow: '0 0 80px rgba(200,161,90,.06)',
              }}
            >
              {/* Dashboard header */}
              <div className="flex items-center justify-between mb-5 pb-4" style={{ borderBottom: '1px solid #1f1f1f' }}>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#c8a15a,#a88348)' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="3" strokeLinecap="round"><polyline points="3 17 9 11 13 15 21 7" /></svg>
                  </div>
                  <span className="text-[11px] font-bold">CapitalCFO</span>
                </div>
                <div className="flex items-center gap-3 text-[9px] font-semibold uppercase tracking-wider" style={{ color: '#6b6660' }}>
                  <span style={{ color: activeBeat >= 1 ? '#c8a15a' : '#6b6660', transition: 'color .3s' }}>Entrada</span>
                  <span style={{ color: activeBeat >= 2 ? '#c8a15a' : '#6b6660', transition: 'color .3s' }}>Dashboard</span>
                  <span style={{ color: activeBeat >= 3 ? '#c8a15a' : '#6b6660', transition: 'color .3s' }}>CFO Chat</span>
                </div>
              </div>

              {/* ═══ BEAT 1 OVERLAY: Transaction entry list ═══ */}
              {activeBeat === 1 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: '#6b6660' }}>
                      Últimas transacciones
                    </p>
                    <span className="text-[9px] font-mono" style={{ color: '#c8a15a' }}>
                      {txVisible.filter(Boolean).length} registradas
                    </span>
                  </div>
                  {[
                    { type: 'Ingreso', cat: 'Ventas servicios', concept: 'Consultoría abril', amount: '+15,000', color: '#c8a15a' },
                    { type: 'Ingreso', cat: 'Ventas productos', concept: 'Licencia software', amount: '+8,000', color: '#c8a15a' },
                    { type: 'Costo', cat: 'Mano de obra', concept: 'Freelancer diseño', amount: '-4,500', color: '#ef4444' },
                    { type: 'Gasto', cat: 'Alquiler', concept: 'Oficina Miraflores', amount: '-5,000', color: '#eab308' },
                    { type: 'Gasto', cat: 'Marketing', concept: 'Google Ads', amount: '-2,500', color: '#eab308' },
                  ].map((tx, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2.5 px-3 rounded-md transition-all duration-500"
                      style={{
                        background: '#0a0a0a',
                        border: '1px solid #1f1f1f',
                        opacity: txVisible[i] ? 1 : 0,
                        transform: txVisible[i] ? 'translateY(0)' : 'translateY(12px)',
                      }}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className="text-[9px] font-mono uppercase px-2 py-0.5 rounded flex-shrink-0"
                          style={{ background: `${tx.color}15`, color: tx.color }}
                        >
                          {tx.type}
                        </span>
                        <span className="text-[11px] truncate" style={{ color: '#9a9490' }}>{tx.cat}</span>
                        <span className="text-[11px] font-medium truncate hidden sm:inline">{tx.concept}</span>
                      </div>
                      <span className="text-[12px] font-mono font-bold flex-shrink-0" style={{ color: tx.color }}>
                        {tx.amount}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* ═══ BEAT 2 OVERLAY: KPI dashboard with animated counters ═══ */}
              {activeBeat === 2 && (
                <div className="grid grid-cols-4 gap-3">
                  {/* KPI tiles */}
                  <div className="col-span-2 rounded-lg p-4" style={{ background: '#c8a15a' }}>
                    <div className="text-[9px] font-bold uppercase tracking-wider text-black/60 mb-1">Ingresos</div>
                    <div className="text-2xl md:text-3xl font-mono font-bold text-black">
                      S/ {incomeCount.toLocaleString()}
                    </div>
                    <div className="text-[10px] font-medium text-black/60 mt-2">
                      ↑ {(beat2 * 24).toFixed(1)}% vs mes anterior
                    </div>
                  </div>

                  <div className="col-span-2 rounded-lg p-4" style={{ background: '#e8c9a8' }}>
                    <div className="text-[9px] font-bold uppercase tracking-wider text-black/60 mb-1">EBITDA</div>
                    <div className="text-2xl md:text-3xl font-mono font-bold text-black">
                      S/ {ebitdaCount.toLocaleString()}
                    </div>
                    <div className="text-[10px] font-medium text-black/60 mt-2">
                      Margen {(beat2 * 50.9).toFixed(1)}%
                    </div>
                  </div>

                  {/* Health Score ring */}
                  <div className="col-span-2 rounded-lg p-4 flex items-center justify-center" style={{ background: '#0a0a0a', border: '1px solid #1f1f1f' }}>
                    <HealthRing score={score} />
                  </div>

                  {/* Bar chart */}
                  <div className="col-span-2 rounded-lg p-4" style={{ background: '#0a0a0a', border: '1px solid #1f1f1f' }}>
                    <div className="text-[9px] font-bold uppercase tracking-wider mb-3" style={{ color: '#6b6660' }}>
                      Ingresos por mes
                    </div>
                    <div className="flex items-end justify-between h-20 gap-1.5">
                      {barHeights.map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-t transition-all"
                          style={{
                            height: `${h * 100}%`,
                            background: i >= 3 ? '#c8a15a' : 'rgba(200,161,90,.3)',
                          }}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between mt-2 text-[8px] font-mono" style={{ color: '#6b6660' }}>
                      {['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN'].map((m) => (
                        <span key={m}>{m}</span>
                      ))}
                    </div>
                  </div>

                  {/* Line chart — full width */}
                  <div className="col-span-4 rounded-lg p-4" style={{ background: '#0a0a0a', border: '1px solid #1f1f1f' }}>
                    <div className="text-[9px] font-bold uppercase tracking-wider mb-3" style={{ color: '#6b6660' }}>
                      Tendencia EBITDA
                    </div>
                    <TrendLine progress={lineDrawLength} />
                  </div>
                </div>
              )}

              {/* ═══ BEAT 3 OVERLAY: CFO chat insight ═══ */}
              {activeBeat === 3 && (
                <div className="space-y-4">
                  {/* User message */}
                  <div className="flex justify-end" style={{ opacity: beat3 > 0.1 ? 1 : 0, transition: 'opacity .4s' }}>
                    <div
                      className="max-w-[70%] px-4 py-2.5 rounded-2xl rounded-br-sm text-[13px]"
                      style={{ background: '#c8a15a', color: '#0a0a0a' }}
                    >
                      ¿Cómo mejoro mi margen EBITDA?
                    </div>
                  </div>

                  {/* CFO response — typewriter-like reveal */}
                  <div className="flex items-start gap-2" style={{ opacity: beat3 > 0.3 ? 1 : 0, transition: 'opacity .4s' }}>
                    <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold" style={{ background: '#c8a15a', color: '#0a0a0a' }}>
                      CC
                    </div>
                    <div
                      className="max-w-[85%] px-4 py-3 rounded-2xl rounded-bl-sm"
                      style={{ background: '#0a0a0a', border: '1px solid #1f1f1f' }}
                    >
                      <p className="text-[10px] font-mono font-bold mb-1.5" style={{ color: '#c8a15a' }}>
                        Capital CFO
                      </p>
                      <p className="text-[13px] leading-relaxed" style={{ color: '#f5f0e8' }}>
                        🔴 <strong>Tu mayor fuga:</strong> los gastos operativos son 33.6% de tus ingresos.
                        Reduce 5% en marketing pagado y redirige a contenido orgánico.{' '}
                        <span style={{ color: '#c8a15a' }}>
                          Impacto estimado: +S/ 2,750/mes en EBITDA.
                        </span>
                      </p>
                      <div className="mt-3 pt-3 flex items-center gap-4 text-[10px]" style={{ borderTop: '1px solid #1f1f1f', color: '#6b6660' }}>
                        <span>📌 Prioridad ahora:</span>
                        <span style={{ color: '#c8a15a' }}>3 acciones sugeridas</span>
                      </div>
                    </div>
                  </div>

                  {/* CTA that appears at the end */}
                  <div
                    className="pt-6 flex justify-center"
                    style={{
                      opacity: beat3 > 0.7 ? 1 : 0,
                      transform: beat3 > 0.7 ? 'translateY(0)' : 'translateY(20px)',
                      transition: 'all .5s ease',
                    }}
                  >
                    <a
                      href="/auth/register"
                      className="inline-flex items-center gap-2 rounded-md px-7 py-3 text-[13px] font-semibold uppercase tracking-wider transition-all"
                      style={{
                        background: 'linear-gradient(135deg,#c8a15a,#a88348)',
                        color: '#0a0a0a',
                        boxShadow: '0 0 40px rgba(200,161,90,.3)',
                      }}
                    >
                      Comenzar prueba gratuita
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* ═══ Beat caption below dashboard ═══ */}
            <div className="mt-6 md:mt-8 text-center">
              <p className="text-[13px] md:text-[15px] max-w-2xl mx-auto" style={{ color: '#9a9490' }}>
                {activeBeat === 1 && 'Sube tus transacciones manualmente o importa un CSV. Capital CFO las organiza por tipo y categoría al instante.'}
                {activeBeat === 2 && 'Los KPIs se calculan automáticamente. Health Score, márgenes, punto de equilibrio, tendencias — todo al día.'}
                {activeBeat === 3 && 'Conversa con tu CFO virtual. Responde con tus números reales y sugiere las acciones con mayor impacto.'}
              </p>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="pb-4 text-center">
          <p className="text-[9px] uppercase tracking-[3px] font-semibold" style={{ color: '#3a3a3a' }}>
            {progress < 0.9 ? '↓ Continúa scrolleando' : '✓ Has visto el flujo completo'}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─── Health Ring ─── */
function HealthRing({ score }: { score: number }) {
  const clamped = Math.max(0, Math.min(100, score));
  const r = 32;
  const circ = 2 * Math.PI * r;
  const offset = circ - (clamped / 100) * circ;
  const color = clamped >= 70 ? '#c8a15a' : clamped >= 45 ? '#eab308' : '#ef4444';
  const label = clamped >= 70 ? 'SALUDABLE' : clamped >= 45 ? 'EN RIESGO' : 'CRÍTICO';

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="90" height="90" viewBox="0 0 90 90">
        <circle cx="45" cy="45" r={r} fill="none" stroke="#1f1f1f" strokeWidth="5" />
        <circle
          cx="45"
          cy="45"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform="rotate(-90 45 45)"
          style={{ transition: 'stroke-dashoffset .2s, stroke .3s' }}
        />
        <text x="45" y="42" textAnchor="middle" fontSize="18" fontWeight="700" fill={color} fontFamily="JetBrains Mono, monospace">
          {clamped}
        </text>
        <text x="45" y="56" textAnchor="middle" fontSize="6" fontWeight="600" letterSpacing="1.5" fill={color}>
          {label}
        </text>
      </svg>
      <span className="text-[8px] font-semibold uppercase tracking-[2px]" style={{ color: '#6b6660' }}>
        HEALTH SCORE
      </span>
    </div>
  );
}

/* ─── Animated Trend Line ─── */
function TrendLine({ progress }: { progress: number }) {
  // Fake data points
  const points = [
    { x: 5, y: 70 },
    { x: 20, y: 55 },
    { x: 35, y: 60 },
    { x: 50, y: 40 },
    { x: 65, y: 35 },
    { x: 80, y: 25 },
    { x: 95, y: 18 },
  ];
  const path = points.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(' ');
  const areaPath = `${path} L95,90 L5,90 Z`;

  // Total path length (approximate) for stroke-dasharray trick
  const totalLength = 150;
  const draw = progress * totalLength;

  return (
    <svg viewBox="0 0 100 90" className="w-full" preserveAspectRatio="xMidYMid meet" style={{ height: 90 }}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c8a15a" stopOpacity=".25" />
          <stop offset="100%" stopColor="#c8a15a" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {[25, 50, 75].map((y) => (
        <line key={y} x1="5" y1={y} x2="95" y2={y} stroke="#1f1f1f" strokeWidth="0.3" />
      ))}
      {/* Area */}
      <path d={areaPath} fill="url(#areaGrad)" opacity={progress} />
      {/* Line */}
      <path
        d={path}
        fill="none"
        stroke="#c8a15a"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={totalLength}
        strokeDashoffset={totalLength - draw}
      />
      {/* Points */}
      {points.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={progress > (i + 1) / points.length ? 1.3 : 0}
          fill="#c8a15a"
          style={{ transition: 'r .2s' }}
        />
      ))}
    </svg>
  );
}
