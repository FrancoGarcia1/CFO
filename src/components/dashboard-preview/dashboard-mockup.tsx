'use client';
import type { Theme } from './themes';

const SERIF = "'Fraunces', Georgia, serif";
const MONO = "'JetBrains Mono', monospace";

// Static demo data
const KPIS = [
  { label: 'Ingresos', value: 'S/ 55,000', delta: '+24.0%', kind: 'pos', big: true },
  { label: 'EBITDA',   value: 'S/ 28,000', delta: 'Margen 50.9%', kind: 'neu' },
  { label: 'Utilidad bruta', value: 'S/ 36,500', delta: '66.4% margen', kind: 'neu' },
  { label: 'Health Score',   value: '77/100',    delta: 'Saludable', kind: 'pos' },
];

const SECONDARY = [
  { label: 'Punto de equilibrio', value: 'S/ 21,500', color: 'warning' },
  { label: 'Transacciones',       value: '284',       color: 'neutral' },
  { label: 'Ticket promedio',     value: 'S/ 193',    color: 'neutral' },
  { label: 'Visitantes',          value: '1,847',     color: 'neutral' },
  { label: 'Ocupación',           value: '68.2%',     color: 'neutral' },
];

const PNL_ROWS = [
  { label: 'Ingresos',       amount: 55000, pct: '100.0', bold: true },
  { label: '(−) Costos',     amount: -18500, pct: '33.6' },
  { label: '= Utilidad Bruta', amount: 36500, pct: '66.4', bold: true },
  { label: '(−) Gastos',     amount: -8500, pct: '15.5' },
  { label: '= EBITDA',       amount: 28000, pct: '50.9', bold: true, highlight: true },
];

export function DashboardMockup({ theme }: { theme: Theme }) {
  const fmt = (n: number) => `S/ ${Math.abs(n).toLocaleString('en-US')}`;

  return (
    <div
      className="relative p-6 md:p-8"
      style={{
        background: theme.bgGradient ?? theme.bg,
        color: theme.text,
        fontFamily: "'Be Vietnam Pro', -apple-system, sans-serif",
        minHeight: '100%',
      }}
    >
      {/* Apple Intelligence-style halo (only for apple/hybrid) */}
      {(theme.id === 'apple' || theme.id === 'hybrid') && (
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] pointer-events-none"
          style={{
            background: `radial-gradient(ellipse, ${theme.halo}, transparent 70%)`,
            filter: 'blur(60px)',
            opacity: 0.4,
          }}
        />
      )}

      <div className="relative mx-auto max-w-[1100px]">
        {/* ═══ HEADER ═══ */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded flex items-center justify-center" style={{
              background: theme.accentGradient,
              boxShadow: theme.id === 'apple' || theme.id === 'hybrid' ? `0 0 20px ${theme.halo}` : undefined,
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="3"><polyline points="3 17 9 11 13 15 21 7"/></svg>
            </div>
            <div>
              <div className="text-[13px] font-bold tracking-tight" style={{ color: theme.text }}>
                Capital<span style={{ color: theme.accent }}>CFO</span>
              </div>
              <div className="text-[10px] font-mono uppercase tracking-[2px]" style={{ color: theme.textDim }}>
                Dashboard · Q2 2026
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-[2px]" style={{
              background: theme.accentSoft,
              border: `1px solid ${theme.borderStrong}`,
              color: theme.accent,
              backdropFilter: theme.glass ? 'blur(8px)' : undefined,
            }}>
              Abril 2026
            </div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold" style={{
              background: theme.accentGradient,
              color: '#0a0a0a',
            }}>
              JT
            </div>
          </div>
        </div>

        {/* ═══ HERO KPIS ═══ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          {KPIS.map((k, i) => {
            const isHero = i === 0;
            const isScore = i === 3;
            const deltaColor = k.kind === 'pos' ? theme.positive : k.kind === 'neg' ? theme.negative : theme.textMuted;

            return (
              <div
                key={k.label}
                className="relative p-4 rounded-lg overflow-hidden"
                style={{
                  background: isHero && (theme.id === 'brand' || theme.id === 'bloomberg' || theme.id === 'hybrid')
                    ? theme.accentGradient
                    : theme.card,
                  border: `1px solid ${theme.border}`,
                  backdropFilter: theme.glass ? 'saturate(180%) blur(16px)' : undefined,
                  boxShadow: theme.id === 'apple' || theme.id === 'hybrid'
                    ? `0 1px 0 rgba(255,255,255,.04) inset, 0 20px 40px -20px rgba(0,0,0,.6)`
                    : '0 8px 24px -12px rgba(0,0,0,.5)',
                  color: isHero && (theme.id === 'brand' || theme.id === 'bloomberg' || theme.id === 'hybrid') ? '#0a0a0a' : theme.text,
                }}
              >
                <div className="text-[9px] font-semibold uppercase tracking-[2px] mb-2" style={{
                  color: isHero && (theme.id === 'brand' || theme.id === 'bloomberg' || theme.id === 'hybrid')
                    ? 'rgba(10,10,10,.5)'
                    : theme.textDim,
                }}>
                  {k.label}
                </div>
                <div className="text-[22px] md:text-[26px] font-mono font-bold tabular-nums tracking-tight leading-none mb-2" style={{
                  color: isHero && (theme.id === 'brand' || theme.id === 'bloomberg' || theme.id === 'hybrid') ? '#0a0a0a' : theme.text,
                }}>
                  {k.value}
                </div>
                <div className="text-[10px] font-mono tabular-nums" style={{
                  color: isHero && (theme.id === 'brand' || theme.id === 'bloomberg' || theme.id === 'hybrid')
                    ? 'rgba(10,10,10,.6)'
                    : deltaColor,
                }}>
                  {k.kind === 'pos' ? '▲' : ''} {k.delta}
                </div>
                {isScore && (
                  <div className="absolute top-3 right-3">
                    <svg width="44" height="44" viewBox="0 0 44 44">
                      <circle cx="22" cy="22" r="18" fill="none" stroke={theme.border} strokeWidth="2.5" />
                      <circle cx="22" cy="22" r="18" fill="none" stroke={theme.positive} strokeWidth="2.5" strokeLinecap="round" strokeDasharray="113" strokeDashoffset="26" transform="rotate(-90 22 22)" style={{ filter: `drop-shadow(0 0 4px ${theme.positive})` }}/>
                      <text x="22" y="26" textAnchor="middle" fontSize="11" fontWeight="700" fill={theme.positive} fontFamily="JetBrains Mono, monospace">77</text>
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ═══ SECONDARY KPIS ═══ */}
        <div className="grid grid-cols-5 gap-2 mb-5">
          {SECONDARY.map((s) => (
            <div key={s.label} className="px-3 py-2 rounded-md" style={{
              background: theme.card,
              border: `1px solid ${theme.border}`,
              borderLeft: `2px solid ${s.color === 'warning' ? theme.warning : theme.textDim}`,
              backdropFilter: theme.glass ? 'blur(10px)' : undefined,
            }}>
              <div className="text-[8px] font-semibold uppercase tracking-[1.5px]" style={{ color: theme.textDim }}>
                {s.label}
              </div>
              <div className="text-[13px] font-mono font-bold tabular-nums mt-1" style={{ color: theme.text }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* ═══ CHARTS ROW ═══ */}
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-4 mb-5">
          {/* Chart card */}
          <div className="p-5 rounded-lg" style={{
            background: theme.card,
            border: `1px solid ${theme.border}`,
            backdropFilter: theme.glass ? 'saturate(180%) blur(16px)' : undefined,
          }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-[9px] font-semibold uppercase tracking-[2px] mb-1" style={{ color: theme.textDim, fontFamily: theme.useSerif ? SERIF : undefined }}>
                  Ingresos · últimos 12 meses
                </div>
                <div className="text-[11px] font-mono tabular-nums" style={{ color: theme.textMuted }}>
                  +24% vs. año anterior
                </div>
              </div>
              <div className="flex gap-1">
                {['M', 'S', 'A'].map((p, i) => (
                  <button key={p} className="px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider" style={{
                    background: i === 0 ? theme.accentSoft : 'transparent',
                    border: `1px solid ${i === 0 ? theme.borderStrong : theme.border}`,
                    color: i === 0 ? theme.accent : theme.textDim,
                  }}>{p}</button>
                ))}
              </div>
            </div>

            <svg viewBox="0 0 400 120" className="w-full" preserveAspectRatio="none" style={{ height: 150 }}>
              <defs>
                <linearGradient id={`area-${theme.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={theme.accent} stopOpacity="0.35" />
                  <stop offset="100%" stopColor={theme.accent} stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Grid */}
              {[30, 60, 90].map((y) => (
                <line key={y} x1="0" y1={y} x2="400" y2={y} stroke={theme.border} strokeWidth="0.5" strokeDasharray="2,3"/>
              ))}
              <path d="M0,100 L33,90 L67,95 L100,82 L133,85 L167,70 L200,75 L233,60 L267,55 L300,42 L333,38 L367,28 L400,18 L400,120 L0,120 Z" fill={`url(#area-${theme.id})`}/>
              <path d="M0,100 L33,90 L67,95 L100,82 L133,85 L167,70 L200,75 L233,60 L267,55 L300,42 L333,38 L367,28 L400,18" fill="none" stroke={theme.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 6px ${theme.halo})` }}/>
              <circle cx="400" cy="18" r="4" fill={theme.accent}/>
              <circle cx="400" cy="18" r="8" fill="none" stroke={theme.accent} strokeWidth="1" opacity="0.4"/>
            </svg>
          </div>

          {/* EBITDA bars */}
          <div className="p-5 rounded-lg" style={{
            background: theme.card,
            border: `1px solid ${theme.border}`,
            backdropFilter: theme.glass ? 'saturate(180%) blur(16px)' : undefined,
          }}>
            <div className="text-[9px] font-semibold uppercase tracking-[2px] mb-1" style={{ color: theme.textDim, fontFamily: theme.useSerif ? SERIF : undefined }}>
              EBITDA mensual
            </div>
            <div className="text-[11px] font-mono tabular-nums mb-4" style={{ color: theme.textMuted }}>
              Margen 50.9% · ▲ estable
            </div>
            <div className="flex items-end gap-1.5 h-[120px]">
              {[40, 55, 45, 65, 58, 70, 78, 72, 85, 90, 95, 98].map((h, i) => (
                <div key={i} className="flex-1 rounded-t" style={{
                  background: i >= 9 ? theme.accent : i >= 6 ? `${theme.accent}88` : `${theme.accent}44`,
                  height: `${h}%`,
                  boxShadow: i === 11 ? `0 0 12px ${theme.halo}` : 'none',
                }}/>
              ))}
            </div>
            <div className="flex justify-between text-[9px] font-mono mt-2" style={{ color: theme.textDim }}>
              <span>May</span>
              <span>Abr</span>
            </div>
          </div>
        </div>

        {/* ═══ P&L TABLE ═══ */}
        <div className="p-5 rounded-lg" style={{
          background: theme.card,
          border: `1px solid ${theme.border}`,
          backdropFilter: theme.glass ? 'saturate(180%) blur(16px)' : undefined,
        }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[9px] font-semibold uppercase tracking-[2px] mb-1" style={{ color: theme.textDim, fontFamily: theme.useSerif ? SERIF : undefined }}>
                Estado de resultados
              </div>
              <div className="text-[12px] font-medium" style={{ color: theme.text, fontFamily: theme.useSerif ? SERIF : undefined }}>
                Abril 2026
              </div>
            </div>
            <button className="text-[10px] font-mono uppercase tracking-[2px] flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{
              background: theme.accentSoft,
              border: `1px solid ${theme.borderStrong}`,
              color: theme.accent,
            }}>
              Exportar
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>

          <div className="space-y-0">
            {PNL_ROWS.map((row, i) => {
              const isNeg = row.amount < 0;
              const isHighlight = row.highlight;
              return (
                <div key={row.label} className="flex items-center justify-between py-2.5" style={{
                  borderBottom: i < PNL_ROWS.length - 1 ? `1px solid ${theme.border}` : 'none',
                  background: isHighlight ? theme.accentSoft : 'transparent',
                  margin: isHighlight ? '0 -8px' : undefined,
                  padding: isHighlight ? '10px 8px' : undefined,
                  borderRadius: isHighlight ? 6 : undefined,
                }}>
                  <span className="text-[13px]" style={{
                    color: theme.text,
                    fontWeight: row.bold ? 700 : 400,
                    fontFamily: theme.useSerif && row.bold ? SERIF : undefined,
                  }}>
                    {row.label}
                  </span>
                  <div className="flex items-center gap-6">
                    <span className="text-[11px] font-mono tabular-nums text-right w-12" style={{ color: theme.textMuted }}>
                      {row.pct}%
                    </span>
                    <span className="text-[14px] font-mono tabular-nums text-right w-28" style={{
                      color: isHighlight ? theme.positive : isNeg ? theme.textMuted : theme.text,
                      fontWeight: row.bold ? 700 : 400,
                    }}>
                      {fmt(row.amount)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
