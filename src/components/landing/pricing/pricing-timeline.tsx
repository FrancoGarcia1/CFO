'use client';
import { useEffect, useRef, useState } from 'react';

const MILESTONES = [
  { month: 'Mes 01', label: 'Onboarding', title: 'Diagnóstico completo', body: 'Migramos tus datos, calculamos KPIs y generamos tu primer Health Score.', value: 'S/ 5,000', valueLabel: 'en valor entregado', color: '#c8a15a' },
  { month: 'Mes 02', label: 'Operación', title: 'Forecast automatizado', body: 'Proyecciones trimestrales con rolling adjust basado en tu desempeño real.', value: 'S/ 8,500', valueLabel: 'valor acumulado', color: '#c8a15a' },
  { month: 'Mes 03', label: 'Impacto', title: '+S/ 2,750 en EBITDA', body: 'Identificamos fugas en OPEX. Renegociamos contratos. Resultado medible.', value: '+3.4x', valueLabel: 'ROI sobre inversión', color: '#a8c47a' },
  { month: 'Mes 06', label: 'Break-even', title: 'Retorno de la inversión', body: 'Tu membresía se pagó sola. A partir de aquí, todo es ganancia neta.', value: '×1.0', valueLabel: 'break-even alcanzado', color: '#a8c47a' },
  { month: 'Mes 12', label: 'Escala', title: 'ROI 18× anualizado', body: 'Un año de diagnóstico, forecast y recomendaciones continuas.', value: '×18', valueLabel: 'retorno sobre inversión', color: '#c8a15a' },
];

export function PricingTimeline() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(-1);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.idx);
            setActiveIdx((prev) => Math.max(prev, idx));
          }
        });
      },
      { threshold: 0.5, rootMargin: '-10% 0px -30% 0px' }
    );
    el.querySelectorAll('[data-milestone]').forEach((m) => observer.observe(m));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden px-6 md:px-12 lg:px-20 py-24 md:py-32" style={{ background: '#0a0a0a' }}>
      <div className="mx-auto max-w-[1100px]">
        <div className="text-center mb-20">
          <p className="text-[10px] font-mono font-semibold uppercase tracking-[4px] mb-4" style={{ color: '#c8a15a' }}>
            Tu primer año con Capital CFO
          </p>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.02]" style={{ color: '#f5f0e8' }}>
            Cada mes, <br/>
            <span style={{ color: '#c8a15a' }}>más valor entregado.</span>
          </h2>
          <p className="text-[14px] mt-6 max-w-xl mx-auto" style={{ color: '#a8a19a' }}>
            No es un gasto. Es la inversión con mayor ROI de tu negocio.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical rail */}
          <div className="absolute left-[85px] md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[2px]" style={{
            background: 'linear-gradient(180deg, rgba(200,161,90,.1) 0%, rgba(200,161,90,.4) 50%, rgba(200,161,90,.1) 100%)',
          }} />

          {MILESTONES.map((m, i) => {
            const isActive = i <= activeIdx;
            const isLeft = i % 2 === 0;

            return (
              <div
                key={i}
                data-milestone
                data-idx={i}
                className={`relative mb-10 md:mb-14 md:grid md:grid-cols-2 md:gap-10 ${isLeft ? '' : 'md:grid-flow-dense'}`}
              >
                {/* Node */}
                <div className="absolute left-[85px] md:left-1/2 -translate-x-1/2 top-4 flex items-center justify-center z-10">
                  <div className="w-5 h-5 rounded-full transition-all duration-700" style={{
                    background: isActive ? m.color : '#1a1a1a',
                    border: `2px solid ${m.color}`,
                    boxShadow: isActive ? `0 0 0 4px ${m.color}22, 0 0 20px ${m.color}88` : 'none',
                    transform: isActive ? 'scale(1)' : 'scale(.7)',
                  }}/>
                </div>

                {/* Month badge */}
                <div className={`pl-0 md:pl-0 mb-3 md:mb-0 ${isLeft ? 'md:col-start-1 md:text-right md:pr-14' : 'md:col-start-2 md:pl-14'}`}>
                  <div className={`inline-block transition-all duration-700 ${isLeft ? 'md:ml-auto' : ''}`} style={{
                    opacity: isActive ? 1 : 0.3,
                    transform: isActive ? 'translateY(0)' : 'translateY(12px)',
                  }}>
                    <p className="text-[10px] font-mono font-bold uppercase tracking-[3px]" style={{ color: m.color }}>
                      {m.month}
                    </p>
                    <p className="text-[9px] italic mt-0.5" style={{ color: '#6b6660', fontFamily: 'Fraunces, Georgia, serif' }}>
                      — {m.label}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className={`pl-[120px] md:pl-0 ${isLeft ? 'md:col-start-2 md:pl-14' : 'md:col-start-1 md:text-right md:pr-14'}`}>
                  <div className="relative p-5 md:p-6 rounded-xl transition-all duration-700" style={{
                    background: isActive ? 'linear-gradient(135deg, rgba(19,17,16,.95), rgba(13,11,10,.75))' : 'rgba(19,17,16,.4)',
                    border: `1px solid ${isActive ? m.color + '40' : 'rgba(200,161,90,.08)'}`,
                    boxShadow: isActive ? `0 20px 40px -15px rgba(0,0,0,.8), 0 0 40px ${m.color}15` : 'none',
                    backdropFilter: 'blur(10px)',
                    opacity: isActive ? 1 : 0.4,
                    transform: isActive ? 'translateY(0)' : 'translateY(20px)',
                  }}>
                    <h3 className="text-[20px] md:text-[22px] font-bold mb-2" style={{ color: '#f5f0e8' }}>
                      {m.title}
                    </h3>
                    <p className="text-[13px] leading-relaxed mb-4" style={{ color: '#a8a19a' }}>
                      {m.body}
                    </p>
                    <div className={`flex items-baseline gap-3 ${!isLeft ? 'md:justify-end' : ''}`}>
                      <span className="text-[24px] font-extrabold tabular-nums tracking-tight" style={{ color: m.color }}>
                        {m.value}
                      </span>
                      <span className="text-[10px] font-mono uppercase tracking-[1.5px]" style={{ color: '#6b6660' }}>
                        {m.valueLabel}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Final CTA block */}
        <div className="mt-16 md:mt-20 relative">
          {/* Rail continuation */}
          <div className="absolute left-[85px] md:left-1/2 md:-translate-x-1/2 -top-14 h-14 w-[2px]" style={{ background: 'rgba(200,161,90,.3)' }} />

          <div className="relative p-8 md:p-12 rounded-2xl text-center overflow-hidden" style={{
            background: 'linear-gradient(135deg, rgba(200,161,90,.12), rgba(200,161,90,.02))',
            border: '2px solid rgba(200,161,90,.4)',
            boxShadow: '0 40px 80px -20px rgba(0,0,0,.8), 0 0 100px rgba(200,161,90,.15)',
          }}>
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #c8a15a, transparent)' }} />

            <p className="text-[10px] font-mono font-bold uppercase tracking-[4px] mb-4" style={{ color: '#c8a15a' }}>
              Tu inversión mensual
            </p>
            <div className="text-[80px] md:text-[112px] font-extrabold tabular-nums tracking-tighter leading-none mb-3" style={{
              color: 'transparent',
              backgroundImage: 'linear-gradient(180deg, #f5e2b8 0%, #c8a15a 50%, #8c6b33 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              filter: 'drop-shadow(0 4px 20px rgba(200,161,90,.35))',
            }}>
              S/ 800
            </div>
            <p className="text-[13px] mb-8" style={{ color: '#a8a19a' }}>
              Para desbloquear todo lo anterior. Sin sorpresas.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <a href="/auth/register" className="flex items-center justify-center gap-2 rounded-md px-7 py-4 text-[13px] font-semibold uppercase tracking-wider" style={{
                background: 'linear-gradient(135deg, #d4b577, #c8a15a)', color: '#0a0a0a',
                boxShadow: '0 16px 40px -10px rgba(200,161,90,.5)',
              }}>
                Empezar mes 01
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </a>
              <a href="/auth/login" className="flex items-center justify-center px-7 py-4 text-[13px] font-semibold uppercase tracking-wider rounded-md" style={{
                border: '1px solid rgba(200,161,90,.4)', color: '#c8a15a',
              }}>
                Ya soy cliente
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
