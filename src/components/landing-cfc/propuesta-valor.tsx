'use client';
import { useEffect, useRef, useState } from 'react';
import { DIFERENCIADORES, CFC_COLORS as C } from './data';

export function PropuestaValor() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    function handle(e: MouseEvent) {
      const r = el!.getBoundingClientRect();
      setMouse({
        x: (e.clientX - r.left) / r.width,
        y: Math.max(0, Math.min(1, (e.clientY - r.top) / r.height)),
      });
    }
    el.addEventListener('mousemove', handle);
    return () => {
      io.disconnect();
      el.removeEventListener('mousemove', handle);
    };
  }, []);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden px-6 md:px-12 lg:px-20 py-28 md:py-36"
      style={{
        background: `linear-gradient(180deg, ${C.bg}, ${C.bgCard} 100%)`,
        borderTop: `1px solid ${C.border}`,
      }}
    >
      {/* Orbital rings rotando — siguen sutilmente el mouse */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block pointer-events-none"
        style={{
          transform: `translate(calc(-50% + ${(mouse.x - 0.5) * 30}px), calc(-50% + ${(mouse.y - 0.5) * 30}px))`,
          transition: 'transform 1.2s ease-out',
        }}
      >
        <svg width="1100" height="1100" viewBox="0 0 1100 1100" className="opacity-30">
          <circle cx="550" cy="550" r="490" fill="none" stroke={C.bronze} strokeWidth="0.4" opacity="0.6" style={{ animation: 'cfcOrbit1 60s linear infinite', transformOrigin: '550px 550px' }} />
          <circle cx="550" cy="550" r="400" fill="none" stroke={C.bronze} strokeWidth="0.3" opacity="0.4" strokeDasharray="3,8" style={{ animation: 'cfcOrbit2 90s linear infinite reverse', transformOrigin: '550px 550px' }} />
          <circle cx="550" cy="550" r="310" fill="none" stroke={C.goldFoil} strokeWidth="0.3" opacity="0.4" />
          <circle cx="550" cy="550" r="220" fill="none" stroke={C.bronze} strokeWidth="0.4" opacity="0.5" strokeDasharray="2,4" style={{ animation: 'cfcOrbit1 45s linear infinite', transformOrigin: '550px 550px' }} />
          {/* Orbital dots */}
          <circle cx="1040" cy="550" r="3" fill={C.goldFoil} style={{ animation: 'cfcOrbit1 60s linear infinite', transformOrigin: '550px 550px' }}>
            <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="550" cy="240" r="2" fill={C.bronze} style={{ animation: 'cfcOrbit2 45s linear infinite reverse', transformOrigin: '550px 550px' }} />
          <circle cx="950" cy="550" r="2" fill={C.bronzeLight} style={{ animation: 'cfcOrbit2 90s linear infinite', transformOrigin: '550px 550px' }} />
        </svg>
      </div>

      {/* Ambient gold spot follows mouse */}
      <div
        className="absolute inset-0 pointer-events-none transition-[background] duration-700"
        style={{
          background: `radial-gradient(ellipse 55% 45% at ${mouse.x * 100}% ${mouse.y * 100}%, ${C.bronze}0F, transparent 60%)`,
        }}
      />

      <div className="relative mx-auto max-w-[1100px]">
        {/* Tagline destacado */}
        <div
          className="text-center max-w-3xl mx-auto mb-16"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity .9s cubic-bezier(.16,1,.3,1), transform .9s cubic-bezier(.16,1,.3,1)',
          }}
        >
          <p className="text-[10px] font-mono font-bold uppercase tracking-[3px] mb-5" style={{ color: C.bronze }}>
            Por qué Capital Founder
          </p>
          <p className="text-[clamp(24px,3.2vw,42px)] leading-[1.25] font-medium italic" style={{
            color: C.ivory,
            fontFamily: "'Fraunces', Georgia, serif",
            letterSpacing: '-0.015em',
          }}>
            &ldquo;No vendemos informes.{' '}
            <span style={{
              color: 'transparent',
              backgroundImage: `linear-gradient(95deg, ${C.bronzeLight}, ${C.goldFoil}, ${C.bronze})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
            }}>
              Acompañamos la transformación real del negocio.
            </span>
            &rdquo;
          </p>
          <p className="mt-6 text-[14px] leading-relaxed max-w-xl mx-auto" style={{ color: C.muted }}>
            Tres principios que nos diferencian de las consultoras tradicionales y de los productos genéricos de software.
          </p>
        </div>

        {/* 3 diferenciadores con halo pulsante */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {DIFERENCIADORES.map((d, i) => (
            <article
              key={d.title}
              className="relative p-7 rounded-xl text-center group overflow-hidden"
              style={{
                background: `linear-gradient(180deg, ${C.bgCard}, rgba(20,15,12,.3))`,
                border: `1px solid ${C.border}`,
                backdropFilter: 'blur(14px)',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(30px)',
                transition: `opacity .7s ${0.2 + i * 0.15}s cubic-bezier(.16,1,.3,1), transform .7s ${0.2 + i * 0.15}s cubic-bezier(.16,1,.3,1), border-color .35s`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${C.bronze}55`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = C.border;
              }}
            >
              {/* Halo pulsante de fondo */}
              <div className="absolute -inset-4 rounded-2xl pointer-events-none opacity-25" style={{
                background: `radial-gradient(circle at center top, ${C.bronze}30, transparent 60%)`,
                animation: `cfcBreathing 4s ease-in-out ${i * 0.7}s infinite`,
              }}/>

              {/* Top hairline */}
              <div className="absolute top-0 left-[12%] right-[12%] h-px" style={{
                background: `linear-gradient(90deg, transparent, ${C.bronze}, transparent)`,
                opacity: 0.55,
              }}/>

              {/* Número en círculo dorado con rings orbitales */}
              <div className="relative w-16 h-16 mx-auto mb-5 flex items-center justify-center">
                {/* Orbital ring exterior */}
                <span className="absolute inset-[-6px] rounded-full pointer-events-none" style={{
                  border: `1px dashed ${C.bronze}40`,
                  animation: `cfcSpinSlow 18s linear ${i * 1}s infinite`,
                }}/>
                {/* Halo radial */}
                <span className="absolute inset-[-4px] rounded-full pointer-events-none" style={{
                  background: `radial-gradient(circle, ${C.bronze}30, transparent 70%)`,
                  animation: 'cfcBreathing 3s ease-in-out infinite',
                  animationDelay: `${i * 0.5}s`,
                }}/>
                {/* Disco interior con número */}
                <span className="relative w-12 h-12 rounded-full flex items-center justify-center font-medium text-[15px]" style={{
                  background: `linear-gradient(135deg, ${C.bronzeLight}, ${C.bronze})`,
                  color: C.black,
                  boxShadow: `0 8px 20px -6px ${C.bronze}90, inset 0 1px 0 rgba(255,255,255,.25)`,
                  fontFamily: "'Fraunces', Georgia, serif",
                }}>
                  0{i + 1}
                </span>
                {/* Orbital dot */}
                <span className="absolute w-1.5 h-1.5 rounded-full" style={{
                  background: C.goldFoil,
                  boxShadow: `0 0 8px ${C.goldFoil}`,
                  top: '-3px',
                  left: 'calc(50% - 3px)',
                  transformOrigin: '3px 33px',
                  animation: `cfcSpinSlow 5s linear ${i * 0.4}s infinite`,
                }}/>
              </div>

              <h3 className="relative text-[19px] mb-3 leading-tight font-medium" style={{
                color: C.ivory,
                fontFamily: "'Fraunces', Georgia, serif",
                letterSpacing: '-0.01em',
              }}>
                {d.title}
              </h3>
              <p className="relative text-[13px] leading-[1.65]" style={{ color: C.muted }}>
                {d.body}
              </p>
            </article>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes cfcBreathing { 0%,100% { transform: scale(1); opacity: 0.7; } 50% { transform: scale(1.18); opacity: 1; } }
        @keyframes cfcOrbit1 { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes cfcOrbit2 { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </section>
  );
}
