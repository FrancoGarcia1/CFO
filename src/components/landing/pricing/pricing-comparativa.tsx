'use client';
import { useEffect, useState } from 'react';

const TRADITIONAL = [
  { label: 'Salario base', value: 'S/ 15,000 – 30,000' },
  { label: 'Beneficios sociales (+45%)', value: 'S/ 6,750 – 13,500' },
  { label: 'Equipo de cómputo', value: 'S/ 5,000 único' },
  { label: 'Software financiero', value: 'S/ 1,200 / mes' },
  { label: 'Disponibilidad', value: 'Lun – Vie, 9am – 6pm' },
  { label: 'Tiempo diagnóstico', value: '3 – 5 días' },
];

const CAPITAL = [
  { label: 'Inversión mensual', value: 'S/ 800' },
  { label: 'Sin costos ocultos', value: 'Todo incluido' },
  { label: 'Sin equipamiento adicional', value: '100% en nube' },
  { label: 'Software incluido', value: 'Suite completa' },
  { label: 'Disponibilidad', value: '24 / 7, todos los días' },
  { label: 'Tiempo diagnóstico', value: '<2 minutos' },
];

export function PricingComparativa() {
  const [savings, setSavings] = useState(0);

  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const target = 24000;
    const duration = 2000;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setSavings(Math.floor(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section className="relative overflow-hidden px-6 md:px-12 lg:px-20 py-24 md:py-32" style={{ background: '#0a0a0a' }}>
      <div className="mx-auto max-w-[1400px]">
        <div className="text-center mb-14">
          <p className="text-[10px] font-mono font-semibold uppercase tracking-[4px] mb-4" style={{ color: '#c8a15a' }}>
            La matemática es simple
          </p>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.02]" style={{ color: '#f5f0e8' }}>
            Ahorras{' '}
            <span
              className="text-transparent bg-clip-text tabular-nums"
              style={{ backgroundImage: 'linear-gradient(90deg, #d4b577, #c8a15a, #a88348)' }}
            >
              S/ {savings.toLocaleString()}
            </span>
            <br />
            al mes.
          </h2>
          <p className="text-[14px] mt-6 max-w-lg mx-auto" style={{ color: '#a8a19a' }}>
            Mismo análisis financiero profesional, sin el costo de un CFO a tiempo completo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Traditional */}
          <div className="relative rounded-xl p-7 md:p-8" style={{
            background: 'linear-gradient(180deg, rgba(60,25,25,.25) 0%, rgba(30,12,12,.15) 100%)',
            border: '1px solid rgba(239,68,68,.25)',
          }}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-[10px] font-mono font-bold uppercase tracking-[3px] mb-2" style={{ color: '#ef4444' }}>
                  Opción tradicional
                </p>
                <h3 className="text-[22px] font-bold" style={{ color: '#f5f0e8' }}>
                  Consultor CFO In-house
                </h3>
              </div>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
            </div>

            <div className="space-y-3 mb-6 pb-6" style={{ borderBottom: '1px solid rgba(239,68,68,.2)' }}>
              {TRADITIONAL.map((r) => (
                <div key={r.label} className="flex items-start justify-between gap-4 text-[13px]">
                  <span className="flex items-center gap-2" style={{ color: '#a8a19a' }}>
                    <span style={{ color: '#ef4444' }}>✕</span>
                    {r.label}
                  </span>
                  <span className="font-mono tabular-nums text-right" style={{ color: '#d9d4cc' }}>{r.value}</span>
                </div>
              ))}
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-[10px] font-mono uppercase tracking-[2px]" style={{ color: '#6b6660' }}>Costo mensual</span>
              <span className="text-[28px] md:text-[32px] font-extrabold tabular-nums" style={{ color: '#ef4444' }}>
                S/ 22,950 – 49,700
              </span>
            </div>
          </div>

          {/* Capital CFO */}
          <div className="relative rounded-xl p-7 md:p-8 overflow-hidden" style={{
            background: 'linear-gradient(180deg, rgba(200,161,90,.08) 0%, rgba(13,11,10,.6) 100%)',
            border: '2px solid rgba(200,161,90,.55)',
            boxShadow: '0 40px 80px -20px rgba(0,0,0,.9), 0 0 80px rgba(200,161,90,.18), inset 0 1px 0 rgba(200,161,90,.12)',
          }}>
            {/* Top shine */}
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #c8a15a, transparent)' }} />

            {/* Recommended badge */}
            <div className="absolute top-5 right-5 px-2.5 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-[2px]" style={{
              background: 'linear-gradient(135deg, #d4b577, #c8a15a)', color: '#0a0a0a',
            }}>
              ★ Recomendado
            </div>

            <div className="flex items-start gap-3 mb-6">
              <div className="w-9 h-9 flex items-center justify-center rounded-md" style={{ background: 'linear-gradient(135deg, #d4b577, #c8a15a)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="3"><polyline points="3 17 9 11 13 15 21 7"/></svg>
              </div>
              <div>
                <p className="text-[10px] font-mono font-bold uppercase tracking-[3px] mb-1" style={{ color: '#c8a15a' }}>
                  Capital CFO
                </p>
                <h3 className="text-[22px] font-bold" style={{ color: '#f5f0e8' }}>
                  Dirección Financiera Virtual
                </h3>
              </div>
            </div>

            <div className="space-y-3 mb-6 pb-6" style={{ borderBottom: '1px solid rgba(200,161,90,.2)' }}>
              {CAPITAL.map((r) => (
                <div key={r.label} className="flex items-start justify-between gap-4 text-[13px]">
                  <span className="flex items-center gap-2" style={{ color: '#d9d4cc' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#a8c47a" strokeWidth="3"><polyline points="4 12 10 18 20 6"/></svg>
                    {r.label}
                  </span>
                  <span className="font-mono tabular-nums text-right font-semibold" style={{ color: '#c8a15a' }}>{r.value}</span>
                </div>
              ))}
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-[10px] font-mono uppercase tracking-[2px]" style={{ color: '#6b6660' }}>Inversión mensual</span>
              <span className="text-[36px] md:text-[44px] font-extrabold tabular-nums" style={{
                color: 'transparent',
                backgroundImage: 'linear-gradient(90deg, #f5e2b8, #c8a15a)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
              }}>
                S/ 800
              </span>
            </div>

            <a href="/auth/register" className="mt-6 flex items-center justify-center gap-2 rounded-md px-6 py-3.5 text-[13px] font-semibold uppercase tracking-wider" style={{
              background: 'linear-gradient(135deg, #d4b577, #c8a15a)', color: '#0a0a0a',
              boxShadow: '0 10px 30px -10px rgba(200,161,90,.5)',
            }}>
              Comenzar prueba gratuita
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
          </div>
        </div>

        <div className="text-center mt-10">
          <p className="text-[11px]" style={{ color: '#6b6660' }}>
            Sin tarjeta de crédito · Cancela cuando quieras · Migración de datos incluida
          </p>
        </div>
      </div>
    </section>
  );
}
