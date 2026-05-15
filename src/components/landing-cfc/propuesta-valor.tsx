'use client';
import { useEffect, useRef, useState } from 'react';
import { DIFERENCIADORES, CFC_COLORS as C } from './data';

/**
 * Propuesta de Valor — 3 diferenciadores con SVG decorativos:
 *  - Enfoque integral: triángulo 3-pilares (Finanzas/Estrategia/Tech)
 *  - Equipo multidisciplinario: red de avatares conectados
 *  - Visión local + global: globe con conexiones
 * + orbital rings de fondo · mouse parallax · halo pulsante
 */

/* ─── SVG 1 — Triángulo de pilares ─── */
function PilarsTriangle({ active }: { active: boolean }) {
  const pilares = [
    { x: 50, y: 14, label: 'F', color: C.finanzas, name: 'Finanzas' },
    { x: 20, y: 60, label: 'E', color: C.estrategia, name: 'Estrategia' },
    { x: 80, y: 60, label: 'T', color: C.tech, name: 'Tech' },
  ];
  return (
    <svg viewBox="0 0 100 80" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      {/* Lines connecting pilares */}
      {[[0, 1], [1, 2], [2, 0]].map(([a, b], i) => {
        const p1 = pilares[a];
        const p2 = pilares[b];
        return (
          <line
            key={i}
            x1={p1.x}
            y1={p1.y}
            x2={p2.x}
            y2={p2.y}
            stroke={C.bronze}
            strokeWidth="0.6"
            opacity="0.55"
            strokeDasharray="60"
            strokeDashoffset={active ? 0 : 60}
            style={{ transition: `stroke-dashoffset .9s ${0.2 + i * 0.2}s cubic-bezier(.22,1,.36,1)` }}
          />
        );
      })}
      {/* Central node — fusión */}
      <circle cx="50" cy="44" r="3.5" fill={C.bronze} opacity={active ? 0.8 : 0} style={{
        transition: 'opacity .6s 1s',
        filter: `drop-shadow(0 0 6px ${C.bronze})`,
      }}>
        {active && <animate attributeName="r" values="3.5;5;3.5" dur="2s" repeatCount="indefinite" />}
      </circle>
      <circle cx="50" cy="44" r="8" fill="none" stroke={C.bronze} strokeWidth="0.4" opacity={active ? 0.4 : 0} style={{ transition: 'opacity .6s 1.2s' }}/>

      {/* Pillars */}
      {pilares.map((p, i) => (
        <g key={i} opacity={active ? 1 : 0} style={{ transition: `opacity .5s ${0.3 + i * 0.15}s` }}>
          <circle cx={p.x} cy={p.y} r="9" fill={C.bg} stroke={p.color} strokeWidth="1" />
          <circle cx={p.x} cy={p.y} r="12" fill={p.color} opacity="0.15">
            <animate attributeName="r" values="11;14;11" dur="2.5s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.1;0.25;0.1" dur="2.5s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
          </circle>
          <text x={p.x} y={p.y + 2.5} textAnchor="middle" fontSize="7.5" fontWeight="700" fill={p.color} fontFamily="Fraunces, serif">
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ─── SVG 2 — Red multidisciplinaria de avatares ─── */
function TeamNetwork({ active }: { active: boolean }) {
  const team = [
    { x: 50, y: 30, init: 'F', primary: true },
    { x: 20, y: 18, init: 'M', color: C.finanzas },
    { x: 80, y: 22, init: 'C', color: C.estrategia },
    { x: 12, y: 60, init: 'S', color: C.tech },
    { x: 50, y: 65, init: 'P', color: C.goldFoil },
    { x: 85, y: 58, init: 'J', color: C.bronze },
  ];
  const edges = team.slice(1).map((_, i) => [0, i + 1] as [number, number]);

  return (
    <svg viewBox="0 0 100 80" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      {/* Edges */}
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={team[a].x}
          y1={team[a].y}
          x2={team[b].x}
          y2={team[b].y}
          stroke={C.bronze}
          strokeWidth="0.5"
          opacity="0.45"
          strokeDasharray="60"
          strokeDashoffset={active ? 0 : 60}
          style={{ transition: `stroke-dashoffset .8s ${0.2 + i * 0.1}s cubic-bezier(.22,1,.36,1)` }}
        />
      ))}

      {/* Avatares */}
      {team.map((m, i) => (
        <g key={i} opacity={active ? 1 : 0} style={{ transition: `opacity .5s ${0.3 + i * 0.1}s` }}>
          {m.primary && (
            <circle cx={m.x} cy={m.y} r="10" fill="none" stroke={C.bronze} strokeWidth="0.5" opacity="0.5">
              <animate attributeName="r" values="9;13;9" dur="2.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.5;0.1;0.5" dur="2.4s" repeatCount="indefinite" />
            </circle>
          )}
          <circle cx={m.x} cy={m.y} r={m.primary ? 7 : 5.5} fill={m.primary ? C.bronze : (m.color ?? C.bronze)} opacity={m.primary ? 1 : 0.85} />
          <text x={m.x} y={m.y + (m.primary ? 2.5 : 2)} textAnchor="middle" fontSize={m.primary ? 6.5 : 5.5} fontWeight="700" fill={C.bg} fontFamily="Fraunces, serif">
            {m.init}
          </text>
        </g>
      ))}

      {/* Pulsing particles between center and one peripheral */}
      {active && (
        <>
          <circle r="1" fill={C.goldFoil} style={{ filter: `drop-shadow(0 0 3px ${C.goldFoil})` }}>
            <animateMotion path="M50,30 L20,18" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle r="1" fill={C.goldFoil} style={{ filter: `drop-shadow(0 0 3px ${C.goldFoil})` }}>
            <animateMotion path="M50,30 L85,58" dur="2.5s" begin="0.7s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;1;0" dur="2.5s" begin="0.7s" repeatCount="indefinite" />
          </circle>
        </>
      )}
    </svg>
  );
}

/* ─── SVG 3 — Globe con conexiones LatAm ─── */
function GlobeLatAm({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 100 80" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id="globeFill" cx="40%" cy="35%">
          <stop offset="0%" stopColor={C.bronze} stopOpacity="0.4" />
          <stop offset="60%" stopColor={C.bronze} stopOpacity="0.15" />
          <stop offset="100%" stopColor={C.bronze} stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Globe */}
      <circle cx="50" cy="40" r="24" fill="url(#globeFill)" />
      <circle cx="50" cy="40" r="24" fill="none" stroke={C.bronze} strokeWidth="0.5" opacity="0.6" />
      {/* Meridians */}
      <ellipse cx="50" cy="40" rx="24" ry="9" fill="none" stroke={C.bronze} strokeWidth="0.35" opacity="0.4" />
      <ellipse cx="50" cy="40" rx="24" ry="16" fill="none" stroke={C.bronze} strokeWidth="0.3" opacity="0.3" />
      <ellipse cx="50" cy="40" rx="9" ry="24" fill="none" stroke={C.bronze} strokeWidth="0.35" opacity="0.4" />
      <ellipse cx="50" cy="40" rx="16" ry="24" fill="none" stroke={C.bronze} strokeWidth="0.3" opacity="0.3" />

      {/* Pin Lima (centro-base) */}
      {active && (
        <>
          <circle cx="50" cy="40" r="2.5" fill={C.bronzeLight} style={{ filter: `drop-shadow(0 0 4px ${C.bronzeLight})` }}>
            <animate attributeName="r" values="2.5;4;2.5" dur="1.8s" repeatCount="indefinite" />
          </circle>
          <text x="50" y="36" textAnchor="middle" fontSize="4" fontWeight="700" fill={C.bronzeLight} fontFamily="JetBrains Mono">LIM</text>
        </>
      )}

      {/* Arcos hacia otras ciudades LatAm */}
      {active && [
        { d: 'M50,40 Q35,15 25,18', city: 'BOG', tx: 23, ty: 14 },
        { d: 'M50,40 Q40,20 30,8', city: 'MEX', tx: 28, ty: 6 },
        { d: 'M50,40 Q70,25 80,30', city: 'SAO', tx: 82, ty: 28 },
        { d: 'M50,40 Q70,55 78,62', city: 'BAI', tx: 80, ty: 60 },
      ].map((arc, i) => (
        <g key={i}>
          <path
            d={arc.d}
            fill="none"
            stroke={C.bronze}
            strokeWidth="0.5"
            opacity="0.6"
            strokeDasharray="50"
            strokeDashoffset="50"
            style={{
              animation: `cfcGlobeDraw 2s ${0.4 + i * 0.3}s cubic-bezier(.22,1,.36,1) forwards`,
            }}
          />
          <circle r="1.3" fill={C.goldFoil} style={{ filter: `drop-shadow(0 0 3px ${C.goldFoil})` }}>
            <animateMotion path={arc.d} dur="2s" begin={`${0.4 + i * 0.3}s`} fill="freeze" />
          </circle>
          <text x={arc.tx} y={arc.ty} textAnchor="middle" fontSize="3.2" fontWeight="700" fill={C.bronzeLight} fontFamily="JetBrains Mono" opacity="0">
            {arc.city}
            <animate attributeName="opacity" values="0;1" dur=".4s" begin={`${0.4 + i * 0.3 + 1.8}s`} fill="freeze" />
          </text>
        </g>
      ))}
      <style jsx>{`
        @keyframes cfcGlobeDraw { to { stroke-dashoffset: 0; } }
      `}</style>
    </svg>
  );
}

const VISUALS: React.FC<{ active: boolean }>[] = [PilarsTriangle, TeamNetwork, GlobeLatAm];

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
      {/* Grid futurista sutil */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(${C.bronze} 1px, transparent 1px), linear-gradient(90deg, ${C.bronze} 1px, transparent 1px)`,
        backgroundSize: '110px 110px',
      }}/>

      {/* Orbital rings rotando — con parallax mouse */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block pointer-events-none"
        style={{
          transform: `translate(calc(-50% + ${(mouse.x - 0.5) * 24}px), calc(-50% + ${(mouse.y - 0.5) * 24}px))`,
          transition: 'transform 1.2s ease-out',
        }}
      >
        <svg width="1100" height="1100" viewBox="0 0 1100 1100" className="opacity-30">
          <circle cx="550" cy="550" r="490" fill="none" stroke={C.bronze} strokeWidth="0.4" opacity="0.6" style={{ animation: 'cfcOrbit1 60s linear infinite', transformOrigin: '550px 550px' }} />
          <circle cx="550" cy="550" r="400" fill="none" stroke={C.bronze} strokeWidth="0.3" opacity="0.4" strokeDasharray="3,8" style={{ animation: 'cfcOrbit2 90s linear infinite reverse', transformOrigin: '550px 550px' }} />
          <circle cx="550" cy="550" r="310" fill="none" stroke={C.goldFoil} strokeWidth="0.3" opacity="0.4" />
          <circle cx="550" cy="550" r="220" fill="none" stroke={C.bronze} strokeWidth="0.4" opacity="0.5" strokeDasharray="2,4" style={{ animation: 'cfcOrbit1 45s linear infinite', transformOrigin: '550px 550px' }} />
          {/* Orbital dots */}
          <g style={{ animation: 'cfcOrbit1 60s linear infinite', transformOrigin: '550px 550px' }}>
            <circle cx="1040" cy="550" r="3" fill={C.goldFoil}>
              <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
            </circle>
          </g>
          <g style={{ animation: 'cfcOrbit2 45s linear infinite reverse', transformOrigin: '550px 550px' }}>
            <circle cx="550" cy="240" r="2" fill={C.bronze} />
          </g>
          <g style={{ animation: 'cfcOrbit2 90s linear infinite', transformOrigin: '550px 550px' }}>
            <circle cx="950" cy="550" r="2" fill={C.bronzeLight} />
          </g>
        </svg>
      </div>

      {/* Ambient gold spot */}
      <div
        className="absolute inset-0 pointer-events-none transition-[background] duration-700"
        style={{
          background: `radial-gradient(ellipse 55% 45% at ${mouse.x * 100}% ${mouse.y * 100}%, ${C.bronze}0F, transparent 60%)`,
        }}
      />

      <div className="relative mx-auto max-w-[1200px]">
        {/* Tagline destacado */}
        <div
          className="text-center max-w-3xl mx-auto mb-14"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity .9s cubic-bezier(.16,1,.3,1), transform .9s cubic-bezier(.16,1,.3,1)',
          }}
        >
          <div className="inline-flex items-center gap-2 mb-5 px-3 py-1 rounded-full" style={{
            background: `${C.bronze}10`,
            border: `1px solid ${C.bronze}35`,
          }}>
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full animate-ping" style={{ background: C.bronze, opacity: 0.5 }}/>
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: C.bronze }}/>
            </span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-[3px]" style={{ color: C.bronzeLight }}>
              Por qué Capital Founder
            </span>
          </div>
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
          <p className="mt-5 text-[14px] leading-relaxed max-w-xl mx-auto" style={{ color: C.muted }}>
            Tres principios que nos diferencian de las consultoras tradicionales y de los productos genéricos de software.
          </p>
        </div>

        {/* 3 diferenciadores con SVG decorativo + halo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {DIFERENCIADORES.map((d, i) => {
            const Visual = VISUALS[i];
            return (
              <article
                key={d.title}
                className="relative p-7 rounded-xl group overflow-hidden"
                style={{
                  background: `linear-gradient(180deg, ${C.bgCard}, rgba(20,15,12,.4))`,
                  border: `1px solid ${C.border}`,
                  backdropFilter: 'blur(14px)',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(30px)',
                  transition: `opacity .7s ${0.2 + i * 0.15}s cubic-bezier(.16,1,.3,1), transform .7s ${0.2 + i * 0.15}s cubic-bezier(.16,1,.3,1), border-color .35s`,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${C.bronze}55`; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; }}
              >
                {/* Halo pulsante de fondo */}
                <div className="absolute -inset-3 rounded-2xl pointer-events-none opacity-30" style={{
                  background: `radial-gradient(circle at center top, ${C.bronze}28, transparent 65%)`,
                  animation: `cfcBreathing 4s ease-in-out ${i * 0.7}s infinite`,
                }}/>

                {/* Top hairline */}
                <div className="absolute top-0 left-[10%] right-[10%] h-px" style={{
                  background: `linear-gradient(90deg, transparent, ${C.bronze}, transparent)`,
                  opacity: 0.55,
                }}/>

                {/* SVG visual decorativo arriba */}
                <div className="relative h-[110px] mb-5 rounded-md p-3 overflow-hidden" style={{
                  background: `linear-gradient(180deg, ${C.bronze}07, transparent 80%)`,
                  border: `1px solid ${C.bronze}15`,
                }}>
                  <span className="absolute top-2 left-2 text-[8.5px] font-mono uppercase tracking-[2px]" style={{ color: C.dim }}>
                    PRINCIPIO 0{i + 1}
                  </span>
                  <span className="absolute top-2 right-2 text-[8px] font-mono uppercase tracking-[1.5px]" style={{ color: C.bronzeLight }}>
                    CFC
                  </span>
                  {Visual && <Visual active={visible} />}
                </div>

                {/* Número en disco metálico con orbital dot girando */}
                <div className="flex items-center gap-4 mb-3">
                  <div className="relative w-11 h-11 flex items-center justify-center flex-shrink-0">
                    {/* Orbital ring */}
                    <span className="absolute inset-[-4px] rounded-full pointer-events-none" style={{
                      border: `1px dashed ${C.bronze}40`,
                      animation: `cfcSpinSlow 18s linear ${i * 1}s infinite`,
                    }}/>
                    {/* Disco */}
                    <span className="relative w-10 h-10 rounded-full flex items-center justify-center font-medium text-[13px]" style={{
                      background: `linear-gradient(135deg, ${C.bronzeLight}, ${C.bronze})`,
                      color: C.black,
                      boxShadow: `0 6px 16px -4px ${C.bronze}80, inset 0 1px 0 rgba(255,255,255,.25)`,
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
                      transformOrigin: '3px 28px',
                      animation: `cfcSpinSlow 5s linear ${i * 0.4}s infinite`,
                    }}/>
                  </div>
                  <h3 className="text-[18px] leading-tight font-medium" style={{
                    color: C.ivory,
                    fontFamily: "'Fraunces', Georgia, serif",
                    letterSpacing: '-0.01em',
                  }}>
                    {d.title}
                  </h3>
                </div>
                <p className="relative text-[13px] leading-[1.65]" style={{ color: C.muted }}>
                  {d.body}
                </p>
              </article>
            );
          })}
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
