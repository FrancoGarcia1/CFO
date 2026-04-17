'use client';
import { SERVICES } from './data';

export function ServiciosExpediente() {
  return (
    <section
      className="relative px-6 md:px-12 lg:px-20 py-24 overflow-hidden"
      style={{ background: '#0a0a0a' }}
    >
      {/* subtle paper grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative mx-auto max-w-[1400px]">
        {/* Running head */}
        <div
          className="flex items-baseline justify-between pb-4 mb-10"
          style={{ borderBottom: '1px solid rgba(200,161,90,.2)' }}
        >
          <p
            className="text-[10px] font-mono font-semibold uppercase tracking-[3px]"
            style={{ color: '#c8a15a' }}
          >
            Archivo central · Capital CFO
          </p>
          <p
            className="text-[10px] font-mono"
            style={{ color: '#6b6660' }}
          >
            06 volúmenes · Uso restringido
          </p>
        </div>

        <div className="flex items-end justify-between mb-14">
          <div>
            <p
              className="text-[10px] font-semibold uppercase tracking-[4px] mb-3"
              style={{ color: '#c8a15a' }}
            >
              Servicios
            </p>
            <h2
              className="text-4xl md:text-6xl font-normal leading-[1.02]"
              style={{
                fontFamily: 'Fraunces, Georgia, serif',
                color: '#f5f0e8',
                letterSpacing: '-0.02em',
              }}
            >
              Expediente de{' '}
              <span className="italic" style={{ color: '#c8a15a' }}>
                servicios
              </span>
              <span style={{ color: '#c8a15a' }}>.</span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
          {SERVICES.map((s) => (
            <div key={s.n} className="group relative pt-7">
              {/* Tab superior dorado */}
              <div
                className="absolute top-0 left-6 right-16 h-8 flex items-center justify-between px-4 transition-transform duration-400 group-hover:-translate-y-1"
                style={{
                  background:
                    'linear-gradient(180deg, #d4b577 0%, #b0893f 100%)',
                  clipPath:
                    'polygon(0 0, calc(100% - 12px) 0, 100% 100%, 0 100%)',
                  boxShadow:
                    '0 -2px 8px rgba(200,161,90,.2), inset 0 1px 0 rgba(255,255,255,.3)',
                }}
              >
                <span
                  className="text-[10px] font-bold tracking-[2px] uppercase"
                  style={{ color: '#0a0a0a' }}
                >
                  Volumen {s.n}
                </span>
                <span
                  className="text-[9px] font-mono"
                  style={{ color: '#0a0a0a', opacity: 0.55 }}
                >
                  ▲ Q2·26
                </span>
              </div>

              {/* Folder body */}
              <div
                className="relative p-7 transition-all duration-400 group-hover:-translate-y-1.5"
                style={{
                  background:
                    'linear-gradient(180deg, #131110 0%, #0d0b0a 100%)',
                  border: '1px solid rgba(200,161,90,.18)',
                  borderLeft: '3px solid rgba(200,161,90,.5)',
                  boxShadow:
                    '0 12px 32px -14px rgba(0,0,0,.9), inset 0 1px 0 rgba(200,161,90,.05)',
                  minHeight: 240,
                }}
              >
                {/* Sello confidencial */}
                <div
                  className="absolute top-7 right-5 text-[8px] font-mono uppercase tracking-[1.5px] rotate-[-5deg] px-2 py-0.5 opacity-35 group-hover:opacity-60 transition-opacity"
                  style={{
                    color: '#c8a15a',
                    border: '1px solid #c8a15a',
                  }}
                >
                  Confidencial
                </div>

                {/* Ref */}
                <div
                  className="text-[9px] font-mono uppercase tracking-[2px] mb-5"
                  style={{ color: '#6b6660' }}
                >
                  Ref. 2026·{s.n}·CFO
                </div>

                {/* Título */}
                <h3
                  className="text-[22px] mb-3 leading-tight"
                  style={{
                    fontFamily: 'Fraunces, Georgia, serif',
                    color: '#f5f0e8',
                    fontWeight: 500,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {s.t}
                </h3>

                <div
                  className="h-px w-10 mb-4"
                  style={{
                    background: 'linear-gradient(90deg, #c8a15a, transparent)',
                  }}
                />

                <p
                  className="text-[13px] leading-[1.7] italic mb-5"
                  style={{
                    color: '#a8a19a',
                    fontFamily: 'Fraunces, Georgia, serif',
                  }}
                >
                  {s.d}
                </p>

                {/* Footer */}
                <div
                  className="absolute bottom-5 left-7 right-5 flex items-center justify-between"
                  style={{ borderTop: '1px dashed rgba(200,161,90,.15)', paddingTop: 10 }}
                >
                  <span
                    className="text-[9px] font-mono uppercase tracking-[2px]"
                    style={{ color: '#6b6660' }}
                  >
                    Revisado · CFO
                  </span>
                  <span
                    className="text-[10px] font-mono uppercase tracking-[2px] flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity"
                    style={{ color: '#c8a15a' }}
                  >
                    Abrir
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
