'use client';
import { useState } from 'react';

const MIN = 5;
const MAX = 500;
const MONTHLY_FEE = 800;
const CFO_COST_RATIO = 0.08; // 8% of monthly revenue as rough CFO cost

export function PricingCalculadora() {
  const [revenue, setRevenue] = useState(50);

  const revenueK = revenue * 1000;
  const traditionalCost = Math.round(revenueK * CFO_COST_RATIO);
  const savingsMonth = Math.max(0, traditionalCost - MONTHLY_FEE);
  const savingsYear = savingsMonth * 12;
  const roi = savingsMonth / MONTHLY_FEE;

  const percent = ((revenue - MIN) / (MAX - MIN)) * 100;

  return (
    <section className="relative overflow-hidden px-6 md:px-12 lg:px-20 py-24 md:py-32" style={{ background: '#0a0a0a' }}>
      {/* Background ambient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[140px] pointer-events-none" style={{
        background: 'radial-gradient(circle, rgba(200,161,90,.12), transparent 60%)',
      }} />

      <div className="relative mx-auto max-w-[1100px]">
        <div className="text-center mb-14">
          <p className="text-[10px] font-mono font-semibold uppercase tracking-[4px] mb-4" style={{ color: '#c8a15a' }}>
            Calcula tu ahorro real
          </p>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.02]" style={{ color: '#f5f0e8' }}>
            ¿Cuánto gastas hoy <br/>
            <span style={{ color: '#c8a15a' }}>en finanzas?</span>
          </h2>
        </div>

        {/* Slider card */}
        <div className="rounded-2xl p-7 md:p-10 mb-6" style={{
          background: 'linear-gradient(135deg, rgba(19,17,16,.9), rgba(13,11,10,.7))',
          border: '1px solid rgba(200,161,90,.2)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 30px 60px -20px rgba(0,0,0,.7)',
        }}>
          <div className="flex items-baseline justify-between mb-5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-[2px]" style={{ color: '#c8a15a' }}>
              Tu facturación mensual
            </span>
            <span className="text-[11px] font-mono" style={{ color: '#6b6660' }}>
              ← Arrastra →
            </span>
          </div>

          <div className="mb-4 text-center">
            <span className="text-[52px] md:text-[72px] font-extrabold tracking-tighter leading-none tabular-nums" style={{
              color: 'transparent',
              backgroundImage: 'linear-gradient(180deg, #f5e2b8 0%, #c8a15a 70%, #8c6b33 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              filter: 'drop-shadow(0 4px 16px rgba(200,161,90,.3))',
            }}>
              S/ {revenueK.toLocaleString()}
            </span>
            <span className="text-[14px] ml-2" style={{ color: '#a8a19a' }}>/mes</span>
          </div>

          {/* Slider */}
          <div className="relative mb-3">
            <input
              type="range"
              min={MIN}
              max={MAX}
              step="5"
              value={revenue}
              onChange={(e) => setRevenue(Number(e.target.value))}
              className="w-full cursor-pointer opacity-0 relative z-10"
              style={{ height: 24 }}
            />
            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-2 rounded-full pointer-events-none" style={{ background: 'rgba(200,161,90,.15)' }}>
              <div className="h-full rounded-full" style={{
                width: `${percent}%`,
                background: 'linear-gradient(90deg, #d4b577, #c8a15a)',
                boxShadow: '0 0 12px rgba(200,161,90,.6)',
              }} />
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full pointer-events-none transition-all" style={{
              left: `calc(${percent}% - 12px)`,
              background: 'radial-gradient(circle at 30% 30%, #f5e2b8, #c8a15a)',
              boxShadow: '0 0 0 4px rgba(200,161,90,.2), 0 0 20px rgba(200,161,90,.6), inset 0 1px 0 rgba(255,255,255,.4)',
              border: '1px solid #c8a15a',
            }}/>
          </div>

          <div className="flex justify-between text-[10px] font-mono" style={{ color: '#6b6660' }}>
            <span>S/ 5K</span>
            <span>S/ 100K</span>
            <span>S/ 250K</span>
            <span>S/ 500K</span>
          </div>
        </div>

        {/* Results grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultCard
            label="Costo tradicional"
            value={`S/ ${traditionalCost.toLocaleString()}`}
            suffix="/mes"
            note="CFO in-house estimado"
            color="#ef4444"
            icon="↓"
          />
          <ResultCard
            label="Ahorro mensual"
            value={`+S/ ${savingsMonth.toLocaleString()}`}
            suffix="/mes"
            note="Con Capital CFO a S/ 800"
            color="#c8a15a"
            icon="▲"
            highlight
          />
          <ResultCard
            label="Ahorro anual"
            value={`+S/ ${savingsYear.toLocaleString()}`}
            suffix="/año"
            note={`ROI · ${roi.toFixed(0)}× retorno`}
            color="#a8c47a"
            icon="★"
          />
        </div>

        <div className="text-center mt-10">
          <a href="/auth/register" className="inline-flex items-center gap-2 rounded-md px-8 py-4 text-[14px] font-semibold uppercase tracking-wider" style={{
            background: 'linear-gradient(135deg, #d4b577, #c8a15a)',
            color: '#0a0a0a',
            boxShadow: '0 16px 40px -10px rgba(200,161,90,.6)',
          }}>
            Quiero ahorrar S/ {savingsMonth.toLocaleString()} / mes
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
          <p className="mt-3 text-[11px]" style={{ color: '#6b6660' }}>
            Prueba gratuita · Sin tarjeta · Cancela cuando quieras
          </p>
        </div>
      </div>
    </section>
  );
}

function ResultCard({ label, value, suffix, note, color, icon, highlight }: {
  label: string; value: string; suffix: string; note: string; color: string; icon: string; highlight?: boolean;
}) {
  return (
    <div className="rounded-xl p-6" style={{
      background: highlight ? `linear-gradient(180deg, ${color}14, rgba(13,11,10,.6))` : 'linear-gradient(180deg, rgba(19,17,16,.7), rgba(13,11,10,.4))',
      border: `1px solid ${color}${highlight ? '55' : '25'}`,
      boxShadow: highlight ? `0 20px 40px -15px ${color}40` : 'none',
    }}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-[10px] font-mono font-bold uppercase tracking-[2px]" style={{ color }}>{label}</span>
        <span className="text-[14px]" style={{ color }}>{icon}</span>
      </div>
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-[28px] md:text-[32px] font-extrabold tabular-nums tracking-tight" style={{ color }}>{value}</span>
        <span className="text-[12px]" style={{ color: '#6b6660' }}>{suffix}</span>
      </div>
      <p className="text-[11px]" style={{ color: '#a8a19a' }}>{note}</p>
    </div>
  );
}
