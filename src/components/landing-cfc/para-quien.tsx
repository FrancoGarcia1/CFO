'use client';
import { useEffect, useRef, useState } from 'react';
import { AUDIENCIAS, CFC_COLORS as C } from './data';

export function ParaQuien() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

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
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} id="para-quien" className="relative px-6 md:px-12 lg:px-20 py-24 md:py-32" style={{
      background: C.bg,
      borderTop: `1px solid ${C.border}`,
    }}>
      <div className="mx-auto max-w-[1400px]">
        <div className="max-w-3xl mb-14">
          <p className="text-[10px] font-mono font-bold uppercase tracking-[3px] mb-4" style={{ color: C.bronze }}>
            ¿Para quién trabajamos?
          </p>
          <h2 className="text-[clamp(32px,4.5vw,52px)] leading-[1.05] font-medium tracking-tight" style={{
            color: C.ivory,
            fontFamily: "'Fraunces', Georgia, serif",
            letterSpacing: '-0.02em',
          }}>
            Tres perfiles, una <span className="italic" style={{ color: C.bronzeLight }}>misma exigencia.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {AUDIENCIAS.map((a, i) => (
            <article
              key={a.n}
              className="relative p-7 md:p-8 rounded-xl group transition-all duration-500 cursor-pointer overflow-hidden"
              style={{
                background: `linear-gradient(180deg, ${C.bgCard}, rgba(20,15,12,.4))`,
                border: `1px solid ${C.border}`,
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(30px)',
                transition: `opacity .7s ${0.15 * i}s cubic-bezier(.16,1,.3,1), transform .4s ease, border-color .3s`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${C.bronze}55`;
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = C.border;
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Número grande decorativo */}
              <div className="absolute top-4 right-5 text-[80px] leading-none font-medium pointer-events-none opacity-[0.06]" style={{
                color: C.bronze,
                fontFamily: "'Fraunces', Georgia, serif",
              }}>
                {a.n}
              </div>

              <div className="relative">
                <span className="text-[10px] font-mono font-bold uppercase tracking-[3px]" style={{ color: C.bronze }}>
                  Cliente · {a.n}
                </span>
                <h3 className="mt-4 mb-4 text-[24px] md:text-[26px] leading-tight font-medium" style={{
                  color: C.ivory,
                  fontFamily: "'Fraunces', Georgia, serif",
                  letterSpacing: '-0.015em',
                }}>
                  {a.title}<span style={{ color: C.bronzeLight }}>.</span>
                </h3>
                <p className="text-[13.5px] leading-[1.65] mb-6 max-w-[28ch]" style={{ color: C.muted }}>
                  {a.body}
                </p>
                <a href="#contacto" className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[2px] transition-transform group-hover:translate-x-1" style={{
                  color: C.bronzeLight,
                }}>
                  {a.cta}
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
