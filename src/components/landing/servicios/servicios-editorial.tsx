'use client';
import { SERVICES, ROMAN } from './data';

export function ServiciosEditorial() {
  return (
    <section
      className="relative px-6 md:px-12 lg:px-20 py-24"
      style={{ background: '#0a0a0a' }}
    >
      <div className="mx-auto max-w-[1100px]">
        {/* Running head */}
        <div
          className="flex items-baseline justify-between pb-4 mb-14"
          style={{ borderBottom: '1px solid rgba(200,161,90,.25)' }}
        >
          <p
            className="text-[10px] font-mono font-semibold uppercase tracking-[3px]"
            style={{ color: '#c8a15a' }}
          >
            Capítulo I · Servicios
          </p>
          <p
            className="text-[10px] font-mono"
            style={{ color: '#6b6660' }}
          >
            Manual de usuario · Ed. 2026
          </p>
        </div>

        {/* Title */}
        <div className="mb-16 max-w-3xl">
          <p
            className="text-[11px] italic mb-5"
            style={{
              color: '#c8a15a',
              fontFamily: 'Fraunces, Georgia, serif',
            }}
          >
            prólogo
          </p>
          <h2
            className="text-5xl md:text-7xl font-normal leading-[.95] mb-8"
            style={{
              fontFamily: 'Fraunces, Georgia, serif',
              color: '#f5f0e8',
              letterSpacing: '-0.035em',
            }}
          >
            Índice de{' '}
            <span className="italic" style={{ color: '#c8a15a' }}>
              servicios.
            </span>
          </h2>
          <p
            className="text-[15px] md:text-[17px] leading-[1.7] italic max-w-xl"
            style={{
              color: '#a8a19a',
              fontFamily: 'Fraunces, Georgia, serif',
              fontWeight: 300,
            }}
          >
            Seis capítulos que componen el operativo financiero de una
            PyME moderna. Léalos en orden, o comience por el que más le
            interese.
          </p>
        </div>

        {/* Ornamental separator */}
        <div className="flex items-center gap-4 mb-10">
          <div
            className="h-px flex-1"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(200,161,90,.4), transparent)',
            }}
          />
          <span
            className="text-[20px]"
            style={{ color: '#c8a15a', fontFamily: 'Fraunces, Georgia, serif' }}
          >
            ❦
          </span>
          <div
            className="h-px flex-1"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(200,161,90,.4), transparent)',
            }}
          />
        </div>

        {/* Entries */}
        <ol className="relative list-none">
          {SERVICES.map((s, i) => (
            <li
              key={s.n}
              className="group relative grid grid-cols-[110px_1fr] md:grid-cols-[140px_1fr] gap-8 py-7 cursor-pointer transition-all duration-300"
              style={{
                borderBottom:
                  i < SERVICES.length - 1
                    ? '1px solid rgba(200,161,90,.08)'
                    : 'none',
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.background =
                  'linear-gradient(90deg, rgba(200,161,90,.04), transparent 60%)')
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background =
                  'transparent')
              }
            >
              {/* Roman numeral column */}
              <div className="relative pt-1">
                <div className="flex items-baseline justify-end gap-2 pr-6">
                  <span
                    className="text-[56px] md:text-[72px] italic font-light leading-none transition-colors duration-300 group-hover:text-[color:#f5f0e8]"
                    style={{
                      fontFamily: 'Fraunces, Georgia, serif',
                      color: '#c8a15a',
                      letterSpacing: '-0.04em',
                    }}
                  >
                    {ROMAN[i]}
                  </span>
                </div>
                <div
                  className="text-[9px] font-mono uppercase tracking-[3px] text-right pr-6 mt-2"
                  style={{ color: '#6b6660' }}
                >
                  Pág. {String((i + 1) * 12).padStart(3, '0')}
                </div>
              </div>

              {/* Content column */}
              <div className="pl-6 relative" style={{ borderLeft: '1px solid rgba(200,161,90,.15)' }}>
                <div
                  className="absolute left-[-5px] top-3 w-[10px] h-[10px] rounded-full transition-all duration-300 group-hover:scale-125"
                  style={{
                    background: '#c8a15a',
                    boxShadow: '0 0 0 3px #0a0a0a, 0 0 15px rgba(200,161,90,.5)',
                  }}
                />

                <div className="flex items-center gap-3 mb-2">
                  <span
                    className="text-[9px] font-mono uppercase tracking-[3px]"
                    style={{ color: '#c8a15a' }}
                  >
                    § {s.n}
                  </span>
                  <span
                    className="text-[9px] font-mono uppercase tracking-[2px]"
                    style={{ color: '#6b6660' }}
                  >
                    — {i < 3 ? 'Módulo operativo' : i < 5 ? 'Módulo analítico' : 'Módulo global'}
                  </span>
                </div>

                <h3
                  className="text-[24px] md:text-[32px] font-normal leading-tight mb-3 transition-colors duration-300"
                  style={{
                    fontFamily: 'Fraunces, Georgia, serif',
                    color: '#f5f0e8',
                    letterSpacing: '-0.015em',
                  }}
                >
                  {s.t}
                  <span style={{ color: '#c8a15a' }}>.</span>
                </h3>

                <p
                  className="text-[14px] md:text-[15px] leading-[1.7] mb-4 max-w-2xl"
                  style={{
                    color: '#a8a19a',
                    fontFamily: 'Fraunces, Georgia, serif',
                  }}
                >
                  {s.d}
                </p>

                <div
                  className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[3px] opacity-50 group-hover:opacity-100 transition-opacity"
                  style={{ color: '#c8a15a' }}
                >
                  <span
                    className="h-px w-5 transition-all duration-300 group-hover:w-10"
                    style={{ background: '#c8a15a' }}
                  />
                  Continuar leyendo
                </div>
              </div>
            </li>
          ))}
        </ol>

        {/* End ornament */}
        <div className="flex items-center justify-center gap-3 mt-10 text-[11px] italic" style={{ color: '#6b6660', fontFamily: 'Fraunces, Georgia, serif' }}>
          <span>—</span>
          <span>fin del capítulo I</span>
          <span>—</span>
        </div>
      </div>
    </section>
  );
}
