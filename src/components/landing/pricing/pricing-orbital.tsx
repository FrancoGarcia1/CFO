'use client';
import { useEffect, useState } from 'react';

const FEATURES = [
  { icon: '📊', label: 'Dashboard', angle: 0 },
  { icon: '📈', label: 'Forecast', angle: 60 },
  { icon: '🎚', label: 'Simulador', angle: 120 },
  { icon: '💬', label: 'Consultor', angle: 180 },
  { icon: '📑', label: 'Reportes', angle: 240 },
  { icon: '🌎', label: 'Multi-moneda', angle: 300 },
];

export function PricingOrbital() {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const tick = (t: number) => {
      setRotation(((t - start) / 60) % 360);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section className="relative overflow-hidden px-6 md:px-12 lg:px-20 py-24 md:py-32" style={{ background: '#060606' }}>
      {/* Starfield */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => (
          <span key={i} className="absolute w-0.5 h-0.5 rounded-full bg-white" style={{
            left: `${(i * 37) % 100}%`,
            top: `${(i * 43) % 100}%`,
            opacity: 0.2 + (i % 3) * 0.15,
            animation: `twinkle ${3 + (i % 4)}s ease-in-out ${i * 0.2}s infinite`,
          }}/>
        ))}
      </div>

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px] pointer-events-none" style={{
        background: 'radial-gradient(circle, rgba(200,161,90,.18), transparent 65%)',
      }}/>

      <div className="relative mx-auto max-w-[1100px]">
        <div className="text-center mb-12">
          <p className="text-[10px] font-mono font-semibold uppercase tracking-[4px] mb-4" style={{ color: '#c8a15a' }}>
            Todo orbita alrededor de tu inversión
          </p>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.02]" style={{ color: '#f5f0e8' }}>
            Seis módulos. <br/>
            <span style={{ color: '#c8a15a' }}>Una sola inversión.</span>
          </h2>
        </div>

        {/* Orbital system */}
        <div className="relative flex items-center justify-center mb-16" style={{ height: 540 }}>
          {/* Orbital rings */}
          <div className="absolute w-[420px] h-[420px] rounded-full pointer-events-none" style={{
            border: '1px dashed rgba(200,161,90,.25)',
          }}/>
          <div className="absolute w-[520px] h-[520px] rounded-full pointer-events-none" style={{
            border: '1px dashed rgba(200,161,90,.12)',
          }}/>

          {/* Orbiting features */}
          <div className="absolute w-[420px] h-[420px]" style={{
            transform: `rotate(${rotation}deg)`,
          }}>
            {FEATURES.map((f) => {
              const angleRad = ((f.angle - 90) * Math.PI) / 180;
              const x = Math.cos(angleRad) * 210;
              const y = Math.sin(angleRad) * 210;
              return (
                <div key={f.label} className="absolute" style={{
                  left: '50%',
                  top: '50%',
                  transform: `translate(calc(${x}px - 50%), calc(${y}px - 50%)) rotate(-${rotation}deg)`,
                }}>
                  <div className="flex flex-col items-center gap-2 group">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl transition-all duration-300 group-hover:scale-110" style={{
                      background: 'linear-gradient(135deg, rgba(19,17,16,.95), rgba(13,11,10,.8))',
                      border: '1px solid rgba(200,161,90,.4)',
                      boxShadow: '0 10px 30px -8px rgba(0,0,0,.8), inset 0 1px 0 rgba(200,161,90,.15)',
                      backdropFilter: 'blur(10px)',
                    }}>
                      {f.icon}
                    </div>
                    <span className="text-[9px] font-mono font-bold uppercase tracking-[2px] px-2 py-0.5 rounded" style={{
                      color: '#c8a15a',
                      background: 'rgba(10,10,10,.8)',
                      border: '1px solid rgba(200,161,90,.15)',
                      whiteSpace: 'nowrap',
                    }}>
                      {f.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Center — Price + stack */}
          <div className="relative z-10 text-center">
            {/* Gold coin stack */}
            <div className="relative mx-auto mb-6" style={{ width: 160, height: 60 }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="absolute left-1/2 -translate-x-1/2 rounded-full" style={{
                  bottom: `${i * 6}px`,
                  width: `${130 - i * 4}px`,
                  height: '12px',
                  background: i === 5
                    ? 'linear-gradient(180deg, #f5e2b8 0%, #c8a15a 60%, #b0893f 100%)'
                    : 'linear-gradient(180deg, #d4b577 0%, #c8a15a 60%, #8c6b33 100%)',
                  border: '1px solid #b0893f',
                  boxShadow: `0 1px 2px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.25), inset 0 -1px 0 rgba(0,0,0,.3)${i === 5 ? ', 0 0 20px rgba(200,161,90,.5)' : ''}`,
                  animation: `stackRise .6s ${i * 0.1}s cubic-bezier(.22,1,.36,1) both`,
                }}>
                  <div className="w-full h-full rounded-full" style={{
                    backgroundImage: 'repeating-linear-gradient(90deg, transparent 0, transparent 2px, rgba(0,0,0,.2) 2px, rgba(0,0,0,.2) 3px)',
                    opacity: 0.5,
                  }}/>
                </div>
              ))}
              {/* Top coin face */}
              <div className="absolute left-1/2 -translate-x-1/2 rounded-full flex items-center justify-center" style={{
                bottom: '36px',
                width: '110px',
                height: '110px',
                background: 'radial-gradient(circle at 30% 30%, #f5e2b8 0%, #c8a15a 50%, #8c6b33 100%)',
                border: '2px solid #b0893f',
                boxShadow: '0 12px 30px -8px rgba(0,0,0,.8), inset 0 2px 4px rgba(255,255,255,.3), 0 0 30px rgba(200,161,90,.5)',
                animation: 'coinSpin 4s ease-in-out infinite',
              }}>
                <div className="text-center" style={{ color: '#0a0a0a' }}>
                  <div className="text-[9px] font-mono font-bold tracking-[1px] opacity-70">CAPITAL</div>
                  <div className="text-[24px] font-extrabold tabular-nums leading-none">800</div>
                  <div className="text-[9px] font-mono font-bold tracking-[1px] opacity-70">S/ · MES</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 180 }}>
              <p className="text-[10px] font-mono font-bold uppercase tracking-[3px] mb-2" style={{ color: '#c8a15a' }}>
                Tu plan incluye
              </p>
              <p className="text-[14px] max-w-[240px] mx-auto" style={{ color: '#a8a19a' }}>
                los 6 módulos sin costos adicionales.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <a href="/auth/register" className="inline-flex items-center gap-2 rounded-md px-8 py-4 text-[13px] font-semibold uppercase tracking-wider" style={{
            background: 'linear-gradient(135deg, #d4b577, #c8a15a)',
            color: '#0a0a0a',
            boxShadow: '0 16px 40px -10px rgba(200,161,90,.6)',
          }}>
            Reclama tu acceso
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
          <p className="mt-4 text-[11px]" style={{ color: '#6b6660' }}>
            Prueba gratuita · Sin tarjeta de crédito · Cancela cuando quieras
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes twinkle { 0%,100% { opacity: 0.15; } 50% { opacity: 0.7; } }
        @keyframes stackRise { from { opacity: 0; transform: translate(-50%, 20px) scaleY(0.3); } to { opacity: 1; transform: translate(-50%, 0) scaleY(1); } }
        @keyframes coinSpin { 0%,100% { transform: translate(-50%, 0) rotateY(0deg); } 50% { transform: translate(-50%, 0) rotateY(12deg); } }
      `}</style>
    </section>
  );
}
