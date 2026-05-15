'use client';
import { useEffect, useRef, useState } from 'react';
import { AUDIENCIAS, CFC_COLORS as C } from './data';

/**
 * ¿Para quién? — 3 cards de audiencia con SVG mockups identitarios:
 *  - Empresas en crecimiento: bars escalonadas + flecha ↗
 *  - Startups: rocket con trail
 *  - Proyectos de inversión: nodos conectados (red de capital)
 * Cada card: tilt 3D sutil, mouse parallax, indicador de match score.
 */

/* ─── SVG 1 — Bars de crecimiento + arrow up ─── */
function GrowthBars({ accent, active }: { accent: string; active: boolean }) {
  const heights = [30, 45, 38, 60, 55, 75, 85];
  return (
    <svg viewBox="0 0 120 70" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="growBar" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={accent} stopOpacity="0.15" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.9" />
        </linearGradient>
      </defs>
      {/* Grid sutil */}
      {[20, 35, 50].map((y) => (
        <line key={y} x1="0" y1={y} x2="120" y2={y} stroke={accent} strokeWidth="0.3" strokeDasharray="2,3" opacity="0.18" />
      ))}
      {/* Bars */}
      {heights.map((h, i) => (
        <rect
          key={i}
          x={5 + i * 14}
          y={active ? 65 - (h * 0.55) : 65}
          width="9"
          height={active ? h * 0.55 : 0}
          fill="url(#growBar)"
          rx="1"
          style={{
            transition: `y .7s ${0.1 + i * 0.08}s cubic-bezier(.22,1,.36,1), height .7s ${0.1 + i * 0.08}s cubic-bezier(.22,1,.36,1)`,
          }}
        />
      ))}
      {/* Línea de tendencia */}
      <path
        d="M9,55 L23,49 L37,52 L51,42 L65,45 L79,32 L93,22 L107,14"
        fill="none"
        stroke={accent}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="200"
        strokeDashoffset={active ? 0 : 200}
        style={{
          transition: 'stroke-dashoffset 1.4s 0.6s cubic-bezier(.22,1,.36,1)',
          filter: `drop-shadow(0 0 3px ${accent}80)`,
        }}
      />
      {/* Arrow up final */}
      <g transform="translate(105, 10)" opacity={active ? 1 : 0} style={{ transition: 'opacity .5s 1.6s' }}>
        <path d="M0,5 L4,0 L8,5 M4,0 L4,8" stroke={accent} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>
      <text x="100" y="9" fontSize="5.5" fontWeight="700" fill={accent} fontFamily="JetBrains Mono" opacity={active ? 0.9 : 0} style={{ transition: 'opacity .5s 1.8s' }}>+24%</text>
    </svg>
  );
}

/* ─── SVG 2 — Rocket con trail dorado ─── */
function RocketTrail({ accent, active }: { accent: string; active: boolean }) {
  return (
    <svg viewBox="0 0 120 70" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="rocketTrail" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor={accent} stopOpacity="0" />
          <stop offset="50%" stopColor={accent} stopOpacity="0.4" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="rocketBody" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={accent} stopOpacity="0.5" />
          <stop offset="100%" stopColor={accent} stopOpacity="1" />
        </linearGradient>
      </defs>
      {/* Stars */}
      {[[10, 15], [25, 50], [35, 25], [60, 10], [75, 55], [95, 30]].map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r="0.6"
          fill={accent}
          opacity={active ? 0.7 : 0}
          style={{
            transition: `opacity .5s ${0.2 + i * 0.1}s`,
            animation: active ? `cfcRocketStar 2.5s ease-in-out ${i * 0.3}s infinite` : 'none',
          }}
        />
      ))}

      {/* Trail */}
      <path
        d="M10,55 Q30,52 50,40 T100,15"
        fill="none"
        stroke="url(#rocketTrail)"
        strokeWidth="6"
        strokeLinecap="round"
        opacity={active ? 0.5 : 0}
        style={{ transition: 'opacity .8s .3s' }}
      />
      <path
        d="M10,55 Q30,52 50,40 T100,15"
        fill="none"
        stroke={accent}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeDasharray="120"
        strokeDashoffset={active ? 0 : 120}
        style={{
          transition: 'stroke-dashoffset 1.4s cubic-bezier(.22,1,.36,1)',
          filter: `drop-shadow(0 0 4px ${accent})`,
        }}
      />

      {/* Rocket body */}
      <g
        transform="translate(100, 15)"
        opacity={active ? 1 : 0}
        style={{
          transition: 'opacity .5s 1.4s, transform .8s cubic-bezier(.22,1,.36,1)',
          transformOrigin: '0 0',
        }}
      >
        <g transform="rotate(-45)">
          <path d="M0,-7 L4,3 L4,9 L-4,9 L-4,3 Z" fill="url(#rocketBody)" />
          <path d="M0,-7 L2.5,-1 L-2.5,-1 Z" fill={accent} />
          <circle cx="0" cy="3" r="1.5" fill={C.bg} />
          <path d="M-4,9 L-7,13 M4,9 L7,13" stroke={accent} strokeWidth="1" strokeLinecap="round" />
          {/* Fuego */}
          <path d="M-2,9 L0,15 L2,9 Z" fill={accent} opacity="0.7">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="0.4s" repeatCount="indefinite"/>
          </path>
        </g>
      </g>

      <style jsx>{`
        @keyframes cfcRocketStar {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.3); }
        }
      `}</style>
    </svg>
  );
}

/* ─── SVG 3 — Red de nodos de inversión ─── */
function InvestmentNetwork({ accent, active }: { accent: string; active: boolean }) {
  const nodes = [
    { x: 20, y: 35, r: 4.5 },
    { x: 50, y: 18, r: 3.5 },
    { x: 60, y: 50, r: 4 },
    { x: 90, y: 25, r: 5 },
    { x: 100, y: 55, r: 3 },
  ];
  const edges: [number, number][] = [[0, 1], [0, 2], [1, 3], [2, 3], [2, 4], [3, 4]];

  return (
    <svg viewBox="0 0 120 70" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id="invNode">
          <stop offset="0%" stopColor={accent} stopOpacity="1" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.3" />
        </radialGradient>
      </defs>

      {/* Edges with stagger */}
      {edges.map(([a, b], i) => {
        const n1 = nodes[a];
        const n2 = nodes[b];
        const dist = Math.sqrt(Math.pow(n2.x - n1.x, 2) + Math.pow(n2.y - n1.y, 2));
        return (
          <line
            key={i}
            x1={n1.x}
            y1={n1.y}
            x2={n2.x}
            y2={n2.y}
            stroke={accent}
            strokeWidth="0.6"
            opacity="0.5"
            strokeDasharray={dist}
            strokeDashoffset={active ? 0 : dist}
            style={{ transition: `stroke-dashoffset .8s ${0.2 + i * 0.12}s cubic-bezier(.22,1,.36,1)` }}
          />
        );
      })}

      {/* Particle traveling on first edge */}
      {active && (
        <circle r="1.2" fill={accent} style={{ filter: `drop-shadow(0 0 4px ${accent})` }}>
          <animateMotion path="M20,35 L50,18 L90,25" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;1;1;0" dur="3s" repeatCount="indefinite" />
        </circle>
      )}

      {/* Nodes */}
      {nodes.map((n, i) => (
        <g key={i} opacity={active ? 1 : 0} style={{ transition: `opacity .5s ${0.4 + i * 0.1}s` }}>
          {/* Outer halo */}
          <circle cx={n.x} cy={n.y} r={n.r + 2.5} fill={accent} opacity="0.15">
            <animate attributeName="r" values={`${n.r + 1.5};${n.r + 4};${n.r + 1.5}`} dur="3s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.05;0.25;0.05" dur="3s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
          </circle>
          {/* Core */}
          <circle cx={n.x} cy={n.y} r={n.r} fill="url(#invNode)" stroke={accent} strokeWidth="0.5" />
          {/* Inner $ for first node */}
          {i === 3 && (
            <text x={n.x} y={n.y + 1.5} textAnchor="middle" fontSize="4.5" fontWeight="700" fill={C.bg} fontFamily="JetBrains Mono">$</text>
          )}
        </g>
      ))}

      {/* Label */}
      <text x="60" y="68" textAnchor="middle" fontSize="5" fontWeight="700" fill={accent} fontFamily="JetBrains Mono" opacity={active ? 0.7 : 0} style={{ transition: 'opacity .5s 1.4s', letterSpacing: '1px' }}>
        DEAL FLOW · ACTIVE
      </text>
    </svg>
  );
}

const VISUALS: Record<string, React.FC<{ accent: string; active: boolean }>> = {
  '01': GrowthBars,
  '02': RocketTrail,
  '03': InvestmentNetwork,
};

const META_BY_INDEX = [
  { ticket: 'S/ 5K – 30K', sector: 'PyMEs Medianas', match: 92 },
  { ticket: 'S/ 3K – 15K', sector: 'Startups & New Biz', match: 88 },
  { ticket: 'S/ 8K – 50K+', sector: 'Capital & Inversión', match: 95 },
];

/* ─── Card con tilt 3D ─── */
function AudienceCard({
  audience,
  idx,
  visible,
}: {
  audience: typeof AUDIENCIAS[number];
  idx: number;
  visible: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, mx: 50, my: 50, active: false });
  const Visual = VISUALS[audience.n];
  const meta = META_BY_INDEX[idx];

  function onMove(e: React.MouseEvent) {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    setTilt({
      ry: (x - 0.5) * 7,
      rx: -(y - 0.5) * 5,
      mx: x * 100,
      my: y * 100,
      active: true,
    });
  }
  function onLeave() {
    setTilt({ rx: 0, ry: 0, mx: 50, my: 50, active: false });
  }

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity .8s ${0.15 * idx}s cubic-bezier(.16,1,.3,1), transform .8s ${0.15 * idx}s cubic-bezier(.16,1,.3,1)`,
      }}
    >
      <article
        ref={cardRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="relative rounded-xl group cursor-default overflow-hidden"
        style={{
          background: `linear-gradient(180deg, ${C.bgCard}, rgba(20,15,12,.4))`,
          border: `1px solid ${tilt.active ? C.bronze + '55' : C.border}`,
          backdropFilter: 'blur(14px)',
          transform: `perspective(1100px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateZ(${tilt.active ? 8 : 0}px)`,
          transition: tilt.active
            ? 'transform .12s ease-out, border-color .2s'
            : 'transform .45s cubic-bezier(.16,1,.3,1), border-color .3s',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Specular highlight */}
        <div className="absolute inset-0 pointer-events-none rounded-xl" style={{
          background: `radial-gradient(circle 220px at ${tilt.mx}% ${tilt.my}%, ${C.bronze}25, transparent 55%)`,
          opacity: tilt.active ? 1 : 0,
          transition: 'opacity .25s',
          mixBlendMode: 'screen',
        }}/>
        {/* Top hairline */}
        <div className="absolute top-0 left-[10%] right-[10%] h-px" style={{
          background: `linear-gradient(90deg, transparent, ${C.bronze}, transparent)`,
          opacity: tilt.active ? 0.9 : 0.5,
          transition: 'opacity .25s',
        }}/>

        {/* Número decorativo gigante de fondo */}
        <div className="absolute top-3 right-5 text-[110px] leading-none font-medium pointer-events-none italic" style={{
          color: C.bronze,
          fontFamily: "'Fraunces', Georgia, serif",
          opacity: 0.05,
        }}>
          {audience.n}
        </div>

        <div className="relative p-7 md:p-8">
          {/* Tag + match */}
          <div className="flex items-center justify-between mb-5">
            <span className="text-[9px] font-mono font-bold uppercase tracking-[2.5px] px-2 py-1 rounded" style={{
              background: `${C.bronze}12`,
              color: C.bronzeLight,
              border: `1px solid ${C.bronze}35`,
            }}>
              Cliente · {audience.n}
            </span>
            <span className="text-[8.5px] font-mono uppercase tracking-[1.5px]" style={{ color: C.dim }}>
              MATCH <span style={{ color: C.bronzeLight }}>{meta.match}%</span>
            </span>
          </div>

          {/* SVG mockup */}
          <div className="relative h-[105px] mb-5 rounded-md p-3 overflow-hidden" style={{
            background: `linear-gradient(180deg, ${C.bronze}07, transparent 80%)`,
            border: `1px solid ${C.bronze}18`,
          }}>
            {/* Status dot */}
            <span className="absolute top-2 left-2 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: C.tech, boxShadow: `0 0 4px ${C.tech}` }}/>
              <span className="text-[7.5px] font-mono uppercase tracking-[1.5px]" style={{ color: C.dim }}>
                ACTIVO
              </span>
            </span>
            <span className="absolute top-2 right-2 text-[7.5px] font-mono tabular-nums" style={{ color: C.bronze }}>
              {String(idx + 1).padStart(2, '0')}/03
            </span>
            {Visual && <Visual accent={C.bronzeLight} active={visible} />}
          </div>

          <h3 className="text-[22px] md:text-[24px] mb-3 leading-tight font-medium" style={{
            color: C.ivory,
            fontFamily: "'Fraunces', Georgia, serif",
            letterSpacing: '-0.015em',
          }}>
            {audience.title}<span style={{ color: C.bronzeLight }}>.</span>
          </h3>
          <p className="text-[13px] leading-[1.65] mb-5 max-w-[32ch]" style={{ color: C.muted }}>
            {audience.body}
          </p>

          {/* Meta data */}
          <div className="grid grid-cols-2 gap-3 mb-5 py-3" style={{
            borderTop: `1px dashed ${C.border}`,
            borderBottom: `1px dashed ${C.border}`,
          }}>
            <div>
              <div className="text-[8.5px] font-mono uppercase tracking-[1.5px]" style={{ color: C.dim }}>
                Sector
              </div>
              <div className="text-[11px] font-medium mt-0.5" style={{ color: C.ivory }}>
                {meta.sector}
              </div>
            </div>
            <div>
              <div className="text-[8.5px] font-mono uppercase tracking-[1.5px]" style={{ color: C.dim }}>
                Ticket
              </div>
              <div className="text-[11px] font-mono font-medium tabular-nums mt-0.5" style={{ color: C.bronzeLight }}>
                {meta.ticket}
              </div>
            </div>
          </div>

          <a
            href="#contacto"
            className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[2px] transition-transform group-hover:translate-x-1"
            style={{ color: C.bronzeLight }}
          >
            {audience.cta}
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
        </div>
      </article>
    </div>
  );
}

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
    <section
      ref={ref}
      id="para-quien"
      className="relative px-6 md:px-12 lg:px-20 py-24 md:py-32 overflow-hidden"
      style={{
        background: C.bg,
        borderTop: `1px solid ${C.border}`,
      }}
    >
      {/* Grid sutil */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]" style={{
        backgroundImage: `linear-gradient(${C.bronze} 1px, transparent 1px), linear-gradient(90deg, ${C.bronze} 1px, transparent 1px)`,
        backgroundSize: '100px 100px',
      }}/>

      {/* Aura ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[500px] h-[500px] rounded-full blur-[140px]" style={{
          top: '40%', left: '-10%',
          background: `radial-gradient(circle, ${C.bronze}10, transparent 60%)`,
        }}/>
        <div className="absolute w-[400px] h-[400px] rounded-full blur-[120px]" style={{
          top: '10%', right: '-5%',
          background: `radial-gradient(circle, ${C.goldFoil}10, transparent 60%)`,
        }}/>
      </div>

      <div className="relative mx-auto max-w-[1400px]">
        {/* Header */}
        <div className="max-w-3xl mb-14 md:mb-16">
          <div className="flex items-center gap-2 mb-4">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full animate-ping" style={{ background: C.bronze, opacity: 0.5 }}/>
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: C.bronze }}/>
            </span>
            <p className="text-[10px] font-mono font-bold uppercase tracking-[3px]" style={{ color: C.bronze }}>
              ¿Para quién trabajamos?
            </p>
          </div>
          <h2 className="text-[clamp(32px,4.5vw,52px)] leading-[1.05] font-medium tracking-tight" style={{
            color: C.ivory,
            fontFamily: "'Fraunces', Georgia, serif",
            letterSpacing: '-0.02em',
          }}>
            Tres perfiles, una <span className="italic" style={{ color: C.bronzeLight }}>misma exigencia.</span>
          </h2>
        </div>

        {/* Cards */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
          style={{ perspective: '1400px' }}
        >
          {AUDIENCIAS.map((a, i) => (
            <AudienceCard key={a.n} audience={a} idx={i} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}
