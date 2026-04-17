'use client';
import { useRef, useState } from 'react';

export function PricingTarjeta() {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, mx: 50, my: 50, active: false });

  function onMove(e: React.MouseEvent) {
    const rect = ref.current!.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({
      ry: (x - 0.5) * 22,
      rx: -(y - 0.5) * 15,
      mx: x * 100,
      my: y * 100,
      active: true,
    });
  }

  function onLeave() {
    setTilt({ rx: 0, ry: 0, mx: 50, my: 50, active: false });
  }

  return (
    <section className="relative overflow-hidden px-6 md:px-12 lg:px-20 py-24 md:py-32" style={{ background: '#070706' }}>
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center, rgba(200,161,90,.1), transparent 60%)',
      }} />

      <div className="relative mx-auto max-w-[1100px]">
        <div className="text-center mb-12 md:mb-16">
          <p className="text-[10px] font-mono font-semibold uppercase tracking-[4px] mb-4" style={{ color: '#c8a15a' }}>
            Membresía Capital CFO
          </p>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.02]" style={{ color: '#f5f0e8' }}>
            Tu plan financiero, <br/>
            <span style={{ color: '#c8a15a' }}>convertido en estatus.</span>
          </h2>
          <p className="text-[14px] mt-6 max-w-lg mx-auto" style={{ color: '#a8a19a' }}>
            Una membresía anual que equivale a menos de un café al día.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-12 lg:gap-20 items-center">
          {/* Metallic card */}
          <div className="relative flex items-center justify-center" style={{ perspective: '1500px' }}>
            <div
              ref={ref}
              onMouseMove={onMove}
              onMouseLeave={onLeave}
              className="relative w-full max-w-[440px]"
              style={{
                aspectRatio: '1.586',
                transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
                transition: tilt.active ? 'transform .1s ease-out' : 'transform .5s cubic-bezier(.16,1,.3,1)',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Card glow behind */}
              <div className="absolute -inset-4 rounded-3xl blur-3xl pointer-events-none" style={{
                background: 'radial-gradient(circle, rgba(200,161,90,.4), transparent 65%)',
                opacity: tilt.active ? 1 : 0.35,
                transition: 'opacity .4s',
              }}/>

              {/* Card body */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden" style={{
                background: `
                  linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 50%, #1a1a1a 100%)
                `,
                border: '1px solid rgba(200,161,90,.35)',
                boxShadow: `
                  0 50px 100px -30px rgba(0,0,0,.95),
                  0 0 0 1px rgba(200,161,90,.1),
                  inset 0 2px 4px rgba(255,255,255,.1),
                  inset 0 -2px 4px rgba(0,0,0,.5)
                `,
              }}>
                {/* Specular highlight */}
                <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                  background: `radial-gradient(circle 300px at ${tilt.mx}% ${tilt.my}%, rgba(255,255,255,.15), transparent 55%)`,
                  opacity: tilt.active ? 1 : 0.3,
                  transition: 'opacity .25s',
                }}/>

                {/* Subtle carbon texture */}
                <div className="absolute inset-0 pointer-events-none opacity-[.03]" style={{
                  backgroundImage: 'repeating-linear-gradient(45deg, #c8a15a 0, #c8a15a 1px, transparent 1px, transparent 3px)',
                }}/>

                {/* Gold foil decorative corner */}
                <div className="absolute top-0 right-0 w-40 h-40 pointer-events-none" style={{
                  background: 'radial-gradient(circle at 100% 0%, rgba(200,161,90,.25), transparent 60%)',
                }}/>

                {/* Content */}
                <div className="relative h-full p-7 md:p-9 flex flex-col justify-between">
                  {/* Top */}
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[9px] font-mono font-bold uppercase tracking-[3px] mb-1.5" style={{ color: '#6b6660' }}>
                        CAPITAL CFO
                      </p>
                      <p className="text-[10px] italic" style={{ color: '#c8a15a', fontFamily: 'Fraunces, Georgia, serif' }}>
                        Elite Membership
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="w-10 h-7 rounded flex items-center justify-center" style={{
                        background: 'linear-gradient(135deg, #d4b577, #c8a15a)',
                      }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="3"><polyline points="3 17 9 11 13 15 21 7"/></svg>
                      </div>
                      <p className="text-[7px] font-mono uppercase tracking-[2px]" style={{ color: '#6b6660' }}>MEMBER</p>
                    </div>
                  </div>

                  {/* Middle — chip */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-9 rounded-sm" style={{
                      background: 'linear-gradient(135deg, #d4b577 0%, #b0893f 50%, #d4b577 100%)',
                      boxShadow: 'inset 0 0 8px rgba(0,0,0,.3)',
                    }}>
                      <div className="w-full h-full rounded-sm flex flex-col justify-between p-1" style={{
                        background: 'repeating-linear-gradient(0deg, transparent 0, transparent 1px, rgba(0,0,0,.25) 1px, rgba(0,0,0,.25) 2px), repeating-linear-gradient(90deg, transparent 0, transparent 1px, rgba(0,0,0,.25) 1px, rgba(0,0,0,.25) 2px)',
                      }}/>
                    </div>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c8a15a" strokeWidth="1.5" opacity="0.7">
                      <path d="M2 8 C6 12, 6 16, 2 20" />
                      <path d="M6 5 C12 10, 12 19, 6 23" />
                      <path d="M10 2 C18 9, 18 18, 10 25" />
                    </svg>
                  </div>

                  {/* Bottom */}
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[8px] font-mono uppercase tracking-[2px] mb-1" style={{ color: '#6b6660' }}>
                        Inversión mensual
                      </p>
                      <div className="text-[36px] font-extrabold tabular-nums tracking-tighter leading-none" style={{
                        color: 'transparent',
                        backgroundImage: 'linear-gradient(90deg, #f5e2b8, #c8a15a 50%, #a88348)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        letterSpacing: '.05em',
                      }}>
                        S/&nbsp;800
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] font-mono uppercase tracking-[2px] mb-1" style={{ color: '#6b6660' }}>Válido desde</p>
                      <p className="text-[14px] font-mono font-bold tabular-nums" style={{ color: '#f5f0e8', textShadow: '0 0 8px rgba(200,161,90,.4)' }}>
                        04/26
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Benefits + CTA */}
          <div>
            <p className="text-[11px] font-mono font-bold uppercase tracking-[3px] mb-5" style={{ color: '#c8a15a' }}>
              Incluye todo
            </p>
            <ul className="space-y-3 mb-8">
              {[
                'Dashboard financiero en tiempo real',
                'Forecast automatizado trimestral',
                'Simulador P&L ilimitado',
                'Consultor estratégico 24/7',
                'Reportes gerenciales PDF/XLSX',
                'Soporte para 18 monedas',
              ].map((b, i) => (
                <li key={b} className="flex items-start gap-3 text-[14px]" style={{ color: '#d9d4cc', animation: `slideIn .5s ${0.1 + i * 0.08}s both` }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c8a15a" strokeWidth="2.5" className="mt-0.5 flex-shrink-0">
                    <polyline points="4 12 10 18 20 6"/>
                  </svg>
                  {b}
                </li>
              ))}
            </ul>

            <div className="p-4 rounded-lg mb-6" style={{
              background: 'rgba(200,161,90,.08)',
              border: '1px solid rgba(200,161,90,.25)',
            }}>
              <div className="flex items-baseline justify-between">
                <span className="text-[10px] font-mono uppercase tracking-[2px]" style={{ color: '#a8a19a' }}>
                  Equivalente
                </span>
                <span className="text-[13px] font-mono" style={{ color: '#c8a15a' }}>
                  S/ 26.60 <span style={{ color: '#6b6660' }}>/ día</span>
                </span>
              </div>
            </div>

            <a href="/auth/register" className="flex items-center justify-center gap-2 rounded-md px-7 py-4 text-[13px] font-semibold uppercase tracking-wider mb-3" style={{
              background: 'linear-gradient(135deg, #d4b577, #c8a15a)',
              color: '#0a0a0a',
              boxShadow: '0 16px 40px -10px rgba(200,161,90,.55)',
            }}>
              Activar mi membresía
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
            <a href="/auth/login" className="flex items-center justify-center px-7 py-3 text-[12px] font-semibold uppercase tracking-wider rounded-md" style={{
              border: '1px solid rgba(200,161,90,.4)', color: '#c8a15a',
            }}>
              Ya soy miembro
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>
    </section>
  );
}
