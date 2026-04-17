'use client';
import { useEffect, useState } from 'react';
import { SERVICES } from './data';

const METRICS = [
  { base: 14200, prefix: 'S/', suffix: '', label: 'procesado hoy' },
  { base: 89, prefix: '', suffix: '%', label: 'precisión forecast' },
  { base: 2847, prefix: '', suffix: '', label: 'simulaciones' },
  { base: 1204, prefix: '', suffix: '', label: 'consultas CFO' },
  { base: 168, prefix: '', suffix: '', label: 'exportes hoy' },
  { base: 18, prefix: '', suffix: '', label: 'monedas activas' },
];

export function ServiciosLedger() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1500);
    return () => clearInterval(id);
  }, []);

  // Live drift: pseudo-random micro changes per metric
  const now = Math.floor(Date.now() / 1500);
  const drift = (seed: number) => {
    const r = Math.sin(now * 0.3 + seed) * 0.5 + 0.5;
    return Math.floor((r - 0.5) * 20);
  };

  return (
    <section
      className="relative px-6 md:px-12 lg:px-20 py-24"
      style={{ background: '#070606' }}
    >
      <div className="mx-auto max-w-[1400px]">
        {/* Ticker strip */}
        <div
          className="relative overflow-hidden mb-10 py-2.5 flex items-center gap-10"
          style={{
            background: 'linear-gradient(180deg, #0f0d0c, #0a0908)',
            border: '1px solid rgba(200,161,90,.2)',
            borderLeft: 'none',
            borderRight: 'none',
          }}
        >
          <div className="flex items-center gap-2 pl-4 flex-shrink-0">
            <span className="relative flex h-1.5 w-1.5">
              <span
                className="absolute inset-0 rounded-full animate-ping"
                style={{ background: '#a8c47a', opacity: 0.6 }}
              />
              <span
                className="relative inline-flex h-1.5 w-1.5 rounded-full"
                style={{ background: '#a8c47a' }}
              />
            </span>
            <span className="text-[9px] font-mono font-bold tracking-[2px]" style={{ color: '#a8c47a' }}>
              LIVE
            </span>
          </div>
          <div className="flex gap-8 animate-marquee whitespace-nowrap text-[10px] font-mono uppercase tracking-[2px]">
            {[...SERVICES, ...SERVICES].map((s, i) => (
              <span key={i} className="flex items-center gap-2" style={{ color: '#6b6660' }}>
                {s.t.toUpperCase()}
                <span style={{ color: '#c8a15a' }}>
                  ▲ {METRICS[i % 6].prefix}{METRICS[i % 6].base + drift(i)}
                  {METRICS[i % 6].suffix}
                </span>
                <span style={{ color: '#3a3a3a' }}>·</span>
              </span>
            ))}
          </div>
        </div>

        {/* Heading */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p
              className="text-[10px] font-mono font-semibold uppercase tracking-[4px] mb-3"
              style={{ color: '#c8a15a' }}
            >
              Libro mayor · Servicios activos
            </p>
            <h2
              className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.02]"
              style={{ color: '#f5f0e8' }}
            >
              Datos en vivo,{' '}
              <span style={{ color: '#c8a15a' }}>sin intermediarios.</span>
            </h2>
          </div>
          <div className="text-right hidden md:block">
            <div
              className="text-[9px] font-mono uppercase tracking-[3px]"
              style={{ color: '#6b6660' }}
            >
              Hora del servidor
            </div>
            <div
              className="text-[20px] font-mono font-semibold tabular-nums"
              style={{ color: '#c8a15a' }}
            >
              {new Date().toLocaleTimeString('es-PE', { hour12: false })}
            </div>
          </div>
        </div>

        {/* Table */}
        <div
          className="overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, #0d0b0a 0%, #080706 100%)',
            border: '1px solid rgba(200,161,90,.15)',
          }}
        >
          {/* Table header */}
          <div
            className="grid grid-cols-[60px_1fr_180px_180px_80px] md:grid-cols-[80px_1.3fr_1fr_140px_100px] gap-4 px-5 py-3.5 text-[9px] font-mono font-bold uppercase tracking-[2px]"
            style={{
              background: 'rgba(200,161,90,.06)',
              borderBottom: '1px solid rgba(200,161,90,.2)',
              color: '#c8a15a',
            }}
          >
            <span>Ref</span>
            <span>Servicio</span>
            <span className="hidden md:block">Descripción</span>
            <span>Métrica</span>
            <span>Estado</span>
          </div>

          {/* Rows */}
          {SERVICES.map((s, i) => {
            const m = METRICS[i];
            const value = m.base + drift(i);
            return (
              <div
                key={s.n}
                className="group grid grid-cols-[60px_1fr_180px_180px_80px] md:grid-cols-[80px_1.3fr_1fr_140px_100px] gap-4 px-5 py-5 items-center transition-colors cursor-pointer"
                style={{
                  borderBottom:
                    i < SERVICES.length - 1
                      ? '1px solid rgba(200,161,90,.08)'
                      : 'none',
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLDivElement).style.background =
                    'rgba(200,161,90,.04)')
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLDivElement).style.background =
                    'transparent')
                }
              >
                {/* Ref */}
                <span
                  className="text-[12px] font-mono font-bold"
                  style={{ color: '#c8a15a' }}
                >
                  {s.n}
                </span>
                {/* Service name */}
                <div>
                  <div
                    className="text-[14px] font-semibold group-hover:text-white transition-colors"
                    style={{ color: '#f5f0e8' }}
                  >
                    {s.t}
                  </div>
                  <div className="md:hidden text-[11px] mt-0.5" style={{ color: '#6b6660' }}>
                    {s.d}
                  </div>
                </div>
                {/* Description */}
                <p
                  className="hidden md:block text-[12px] leading-relaxed"
                  style={{ color: '#a8a19a' }}
                >
                  {s.d}
                </p>
                {/* Metric */}
                <div>
                  <div
                    className="text-[15px] font-mono font-bold tabular-nums"
                    style={{ color: drift(i) >= 0 ? '#a8c47a' : '#d9925a' }}
                  >
                    {drift(i) >= 0 ? '▲' : '▼'} {m.prefix}
                    {value.toLocaleString('en-US')}
                    {m.suffix}
                  </div>
                  <div
                    className="text-[9px] font-mono uppercase tracking-[1.5px] mt-0.5"
                    style={{ color: '#6b6660' }}
                  >
                    {m.label}
                  </div>
                </div>
                {/* Status */}
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span
                      className="absolute inset-0 rounded-full animate-ping"
                      style={{ background: '#a8c47a', opacity: 0.55 }}
                    />
                    <span
                      className="relative inline-flex h-2 w-2 rounded-full"
                      style={{ background: '#a8c47a' }}
                    />
                  </span>
                  <span
                    className="text-[10px] font-mono font-bold uppercase tracking-[1.5px]"
                    style={{ color: '#a8c47a' }}
                  >
                    Activo
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee { animation: marquee 50s linear infinite; }
      `}</style>
    </section>
  );
}
