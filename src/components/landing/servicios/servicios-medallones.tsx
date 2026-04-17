'use client';
import { SERVICES } from './data';

const ICONS = [
  // 01 Dashboard
  `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="6" y="8" width="28" height="20" rx="1" /><line x1="6" y1="15" x2="34" y2="15" /><rect x="10" y="19" width="3" height="5" /><rect x="16" y="17" width="3" height="7" /><rect x="22" y="21" width="3" height="3" /><rect x="28" y="18" width="3" height="6" /></svg>`,
  // 02 Forecast
  `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 28 L13 20 L20 24 L28 14 L35 16" /><circle cx="5" cy="28" r="1.5" fill="currentColor"/><circle cx="13" cy="20" r="1.5" fill="currentColor"/><circle cx="20" cy="24" r="1.5" fill="currentColor"/><circle cx="28" cy="14" r="1.5" fill="currentColor"/><circle cx="35" cy="16" r="1.5" fill="currentColor"/></svg>`,
  // 03 Simulador
  `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="7" y="8" width="26" height="24" rx="1.5"/><circle cx="14" cy="16" r="2"/><circle cx="26" cy="16" r="2"/><line x1="14" y1="22" x2="26" y2="22"/><line x1="14" y1="26" x2="26" y2="26"/></svg>`,
  // 04 Consultor
  `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 14 Q10 8 16 8 L26 8 Q32 8 32 14 L32 22 Q32 26 28 26 L20 26 L14 32 L14 26 L14 26 Q10 26 10 22 Z"/><line x1="16" y1="17" x2="26" y2="17"/><line x1="16" y1="21" x2="22" y2="21"/></svg>`,
  // 05 Reportes
  `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 6 L28 6 L32 10 L32 34 L12 34 Z"/><line x1="16" y1="16" x2="28" y2="16"/><line x1="16" y1="20" x2="28" y2="20"/><line x1="16" y1="24" x2="28" y2="24"/><line x1="16" y1="28" x2="24" y2="28"/></svg>`,
  // 06 Multi-moneda
  `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="20" cy="20" r="14"/><ellipse cx="20" cy="20" rx="6" ry="14"/><line x1="6" y1="20" x2="34" y2="20"/><line x1="20" y1="6" x2="20" y2="34"/></svg>`,
];

export function ServiciosMedallones() {
  return (
    <section
      className="relative px-6 md:px-12 lg:px-20 py-28"
      style={{
        background:
          'radial-gradient(ellipse at center, #140e05 0%, #0a0806 50%, #050403 100%)',
      }}
    >
      <style jsx>{`
        .coin {
          perspective: 1400px;
        }
        .coin-inner {
          position: relative;
          width: 100%;
          aspect-ratio: 1;
          transition: transform 0.9s cubic-bezier(0.4, 0, 0.2, 1);
          transform-style: preserve-3d;
        }
        .coin:hover .coin-inner {
          transform: rotateY(180deg);
        }
        .coin-face {
          position: absolute;
          inset: 0;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }
        .coin-back {
          transform: rotateY(180deg);
        }
      `}</style>

      <div className="relative mx-auto max-w-[1400px]">
        {/* Header */}
        <div className="text-center mb-20">
          <p
            className="text-[10px] font-semibold uppercase tracking-[5px] mb-4"
            style={{ color: '#c8a15a' }}
          >
            — Colección — Servicios — 2026 —
          </p>
          <h2
            className="text-4xl md:text-6xl font-normal leading-[1.05]"
            style={{
              fontFamily: 'Fraunces, Georgia, serif',
              color: '#f5f0e8',
              letterSpacing: '-0.02em',
            }}
          >
            Seis piezas{' '}
            <span className="italic" style={{ color: '#c8a15a' }}>
              de colección.
            </span>
          </h2>
          <p
            className="mt-4 text-[13px] italic max-w-xl mx-auto"
            style={{
              color: '#a8a19a',
              fontFamily: 'Fraunces, Georgia, serif',
            }}
          >
            Grabadas y forjadas para el equipo financiero más exigente. Pase el cursor para ver el reverso.
          </p>
        </div>

        {/* Coins grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
          {SERVICES.map((s, i) => (
            <div key={s.n} className="coin cursor-pointer">
              <div className="coin-inner">
                {/* Front — Coin face */}
                <div
                  className="coin-face"
                  style={{
                    background:
                      'radial-gradient(circle at 35% 30%, #3a2f18 0%, #1a1410 55%, #080605 100%)',
                    boxShadow: `
                      0 0 0 2px rgba(200,161,90,.65),
                      0 0 0 3px rgba(0,0,0,.3),
                      inset 0 0 40px rgba(200,161,90,.25),
                      inset 0 2px 4px rgba(255,255,255,.1),
                      0 30px 60px -20px rgba(0,0,0,.9),
                      0 0 60px rgba(200,161,90,.1)
                    `,
                  }}
                >
                  {/* Guilloche pattern */}
                  <svg
                    className="absolute inset-[18px] pointer-events-none"
                    viewBox="0 0 100 100"
                    style={{ opacity: 0.35 }}
                  >
                    <defs>
                      <radialGradient id={`gd-${i}`}>
                        <stop offset="0%" stopColor="#c8a15a" />
                        <stop offset="100%" stopColor="#c8a15a" stopOpacity="0" />
                      </radialGradient>
                    </defs>
                    <circle cx="50" cy="50" r="48" fill="none" stroke="#c8a15a" strokeWidth="0.3" />
                    <circle cx="50" cy="50" r="44" fill="none" stroke="#c8a15a" strokeWidth="0.2" strokeDasharray="0.5,0.5" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#c8a15a" strokeWidth="0.2" />
                    {Array.from({ length: 24 }).map((_, j) => {
                      const a = (j * 15 * Math.PI) / 180;
                      const x1 = 50 + 40 * Math.cos(a);
                      const y1 = 50 + 40 * Math.sin(a);
                      const x2 = 50 + 44 * Math.cos(a);
                      const y2 = 50 + 44 * Math.sin(a);
                      return (
                        <line
                          key={j}
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke="#c8a15a"
                          strokeWidth="0.3"
                          opacity="0.5"
                        />
                      );
                    })}
                  </svg>

                  {/* Top text */}
                  <p
                    className="text-[9px] font-bold uppercase tracking-[3px] text-center absolute top-[18%] left-0 right-0"
                    style={{ color: '#c8a15a' }}
                  >
                    Capital · CFO
                  </p>

                  {/* Icon */}
                  <div
                    className="relative z-10 mb-3"
                    style={{ color: '#d4b577', filter: 'drop-shadow(0 0 8px rgba(200,161,90,.4))' }}
                  >
                    <div
                      className="w-14 h-14"
                      dangerouslySetInnerHTML={{ __html: ICONS[i] }}
                    />
                  </div>

                  {/* Title */}
                  <p
                    className="text-[13px] md:text-[14px] text-center relative z-10 px-4 leading-tight"
                    style={{
                      fontFamily: 'Fraunces, Georgia, serif',
                      color: '#f5f0e8',
                      fontWeight: 500,
                    }}
                  >
                    {s.t}
                  </p>

                  {/* Bottom ornament */}
                  <p
                    className="text-[9px] font-mono tracking-[3px] absolute bottom-[18%] left-0 right-0 text-center"
                    style={{ color: '#c8a15a', opacity: 0.7 }}
                  >
                    · {s.n} ·
                  </p>
                </div>

                {/* Back — Description */}
                <div
                  className="coin-face coin-back"
                  style={{
                    background:
                      'radial-gradient(circle at 70% 70%, #2a2212 0%, #0a0806 75%)',
                    boxShadow: `
                      0 0 0 2px rgba(200,161,90,.6),
                      inset 0 0 30px rgba(200,161,90,.18),
                      0 30px 60px -20px rgba(0,0,0,.9)
                    `,
                  }}
                >
                  <p
                    className="text-[9px] font-mono font-bold uppercase tracking-[3px] mb-4"
                    style={{ color: '#c8a15a' }}
                  >
                    Anverso · {s.n}
                  </p>
                  <p
                    className="text-[12px] md:text-[13px] text-center leading-relaxed italic px-2"
                    style={{
                      color: '#d9d4cc',
                      fontFamily: 'Fraunces, Georgia, serif',
                    }}
                  >
                    {s.d}
                  </p>
                  <div
                    className="mt-5 text-[10px] font-mono uppercase tracking-[2px] flex items-center gap-1.5"
                    style={{ color: '#c8a15a' }}
                  >
                    Descubrir
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
