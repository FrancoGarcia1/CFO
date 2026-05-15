'use client';
import { useEffect, useRef, useState } from 'react';
import { CFC_COLORS as C } from './data';

export function CtaFinal() {
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
      { threshold: 0.3 },
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
      id="contacto"
      className="relative px-6 md:px-12 lg:px-20 py-28 md:py-44 overflow-hidden"
      style={{
        background: C.bg,
        borderTop: `1px solid ${C.border}`,
      }}
    >
      {/* Apple Intelligence-style chromatic conic-gradient halo rotando */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] pointer-events-none"
        style={{
          opacity: 0.6,
          background: `conic-gradient(from 0deg at 50% 50%, ${C.bronze}60, ${C.goldFoil}40, ${C.finanzas}30, ${C.estrategia}50, ${C.tech}25, ${C.bronze}60)`,
          filter: 'blur(120px)',
          animation: 'cfcChromatic 14s linear infinite',
        }}
      />

      {/* Ambient gold spot follows mouse */}
      <div
        className="absolute inset-0 pointer-events-none transition-[background] duration-700"
        style={{
          background: `radial-gradient(ellipse 50% 40% at ${mouse.x * 100}% ${mouse.y * 100}%, ${C.bronze}15, transparent 60%)`,
        }}
      />

      {/* Animated mesh gradient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[500px] h-[500px] rounded-full blur-[120px]" style={{
          top: '10%', left: '15%',
          background: `radial-gradient(circle, ${C.bronze}30, transparent 60%)`,
          animation: 'cfcCtaFloat1 22s ease-in-out infinite',
        }}/>
        <div className="absolute w-[450px] h-[450px] rounded-full blur-[120px]" style={{
          bottom: '10%', right: '15%',
          background: `radial-gradient(circle, ${C.goldFoil}20, transparent 60%)`,
          animation: 'cfcCtaFloat2 26s ease-in-out infinite',
        }}/>
      </div>

      {/* Subtle grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{
        backgroundImage: `linear-gradient(${C.bronze} 1px, transparent 1px), linear-gradient(90deg, ${C.bronze} 1px, transparent 1px)`,
        backgroundSize: '90px 90px',
      }}/>

      {/* Grain */}
      <div className="absolute inset-0 pointer-events-none opacity-[.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        mixBlendMode: 'overlay',
      }}/>

      <div className="relative mx-auto max-w-[920px] text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-8" style={{
          background: `${C.bronze}12`,
          border: `1px solid ${C.bronze}50`,
          backdropFilter: 'blur(12px)',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(15px)',
          transition: 'opacity .8s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1)',
        }}>
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inset-0 rounded-full animate-ping" style={{ background: C.bronze, opacity: 0.6 }}/>
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: C.bronze }}/>
          </span>
          <span className="text-[10px] font-mono font-bold uppercase tracking-[3px]" style={{ color: C.bronzeLight }}>
            Conversación sin compromiso · 30 minutos
          </span>
        </div>

        {/* H2 con chromatic gradient en el accent */}
        <h2 className="text-[clamp(36px,6vw,80px)] leading-[1.02] font-medium tracking-tight mb-7" style={{
          color: C.ivory,
          fontFamily: "'Fraunces', Georgia, serif",
          letterSpacing: '-0.025em',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity .9s .15s cubic-bezier(.16,1,.3,1), transform .9s .15s cubic-bezier(.16,1,.3,1)',
        }}>
          ¿Listo para tomar{' '}
          <span className="italic block md:inline relative" style={{
            color: 'transparent',
            backgroundImage: `linear-gradient(95deg, ${C.bronzeLight}, ${C.goldFoil}, ${C.bronze})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            backgroundSize: '200% 100%',
            animation: 'cfcGradientShift 5s ease-in-out infinite',
          }}>
            mejores decisiones?
          </span>
        </h2>

        <p className="max-w-xl mx-auto text-[15px] md:text-[16px] leading-relaxed mb-11" style={{
          color: C.muted,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(15px)',
          transition: 'opacity .9s .3s cubic-bezier(.16,1,.3,1), transform .9s .3s cubic-bezier(.16,1,.3,1)',
        }}>
          Hablemos. Una conversación de 30 minutos para entender tu negocio y mostrarte concretamente cómo podemos acelerarlo. Sin propuesta agresiva, sin compromiso.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4" style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(15px)',
          transition: 'opacity .9s .45s cubic-bezier(.16,1,.3,1), transform .9s .45s cubic-bezier(.16,1,.3,1)',
        }}>
          {/* CTA Principal — liquid glass + chromatic shine */}
          <a
            href="mailto:contacto@capitalfounderconsulting.com?subject=Quiero%20agendar%20una%20consulta%20con%20Capital%20Founder"
            className="group relative inline-flex items-center gap-2 rounded-md px-8 py-4 text-[13px] font-semibold uppercase tracking-[2px] transition-all hover:translate-y-[-2px] overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${C.bronzeLight}, ${C.bronze})`,
              color: C.black,
              boxShadow: `0 20px 50px -10px ${C.bronze}80, inset 0 1px 0 rgba(255,255,255,.25), 0 0 60px ${C.bronze}25`,
            }}
          >
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{
              background: `linear-gradient(120deg, transparent 30%, rgba(255,255,255,.4) 50%, transparent 70%)`,
              animation: 'cfcShine 2s ease-in-out infinite',
            }}/>
            <span className="relative">Escríbenos hoy</span>
            <svg className="relative" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>

          {/* WhatsApp con liquid glass */}
          <a
            href="https://wa.me/51999999999?text=Hola%20Capital%20Founder%2C%20quiero%20agendar%20una%20consulta"
            target="_blank"
            rel="noopener"
            className="group relative inline-flex items-center gap-2 rounded-md px-7 py-4 text-[13px] font-semibold uppercase tracking-[2px] transition-all hover:translate-y-[-2px] overflow-hidden"
            style={{
              background: 'rgba(255,255,255,.04)',
              color: C.bronzeLight,
              border: `1px solid ${C.bronze}55`,
              backdropFilter: 'saturate(180%) blur(14px)',
              WebkitBackdropFilter: 'saturate(180%) blur(14px)',
            }}
          >
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-md" style={{
              background: `radial-gradient(circle at center, ${C.bronze}25, transparent 70%)`,
            }}/>
            <svg className="relative" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.371-.025-.52-.075-.149-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
            <span className="relative">WhatsApp</span>
          </a>
        </div>

        {/* Email visible */}
        <p className="mt-11 text-[11px] font-mono uppercase tracking-[2.5px]" style={{
          color: C.dim,
          opacity: visible ? 1 : 0,
          transition: 'opacity .9s .65s cubic-bezier(.16,1,.3,1)',
        }}>
          <span style={{ color: C.bronzeLight }}>contacto@capitalfounderconsulting.com</span>
          <span style={{ color: 'rgba(255,255,255,.2)' }}> · </span>
          <span>Lima, Perú</span>
        </p>
      </div>

      <style jsx>{`
        @keyframes cfcChromatic { from { transform: translate(-50%,-50%) rotate(0deg); } to { transform: translate(-50%,-50%) rotate(360deg); } }
        @keyframes cfcCtaFloat1 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(40px,30px) scale(1.1); } }
        @keyframes cfcCtaFloat2 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-50px,30px) scale(1.08); } }
        @keyframes cfcGradientShift { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
      `}</style>
    </section>
  );
}
