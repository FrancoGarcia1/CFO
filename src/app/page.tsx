import Link from 'next/link';
import Image from 'next/image';
import { TextScramble, AnimatedCounter, MagneticButton, MorphingBlob, SpotlightHero } from '@/components/landing/wow-effects';

const FEATURES = [
  { n: '01', title: 'Dashboard financiero', desc: 'Health Score, KPIs, márgenes, EBITDA y punto de equilibrio actualizados al instante.' },
  { n: '02', title: 'Forecast inteligente', desc: 'Proyecciones con ajuste trimestral automático basado en tu desempeño real.' },
  { n: '03', title: 'Simulador P&L', desc: 'Cambia variables y ve el impacto inmediato en tu estado de resultados.' },
  { n: '04', title: 'Consultor estratégico', desc: 'Hazle cualquier pregunta. Responde con tus datos financieros reales.' },
];

const TICKER_TEXT = 'DASHBOARD · FORECAST · SIMULADOR · CONSULTOR · REPORTES · EBITDA · HEALTH SCORE · P&L · ';

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden text-[#f5f0eb]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        :root{
          --bg:#0f0f0f;
          --bg2:#1a1a1a;
          --bg3:#242424;
          --ivory:#f5f0eb;
          --cream:#e8e4df;
          --copper:#d4a574;
          --copper-light:#e8c9a8;
          --dim:#7a756e;
          --border:#2a2a2a;
        }
        .lp{font-family:'Plus Jakarta Sans',sans-serif}

        /* Grain */
        .grain::after{content:'';position:fixed;inset:0;z-index:200;pointer-events:none;opacity:.025;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}

        /* Marquee */
        .ticker{overflow:hidden;white-space:nowrap}
        .ticker-track{display:inline-block;animation:marquee 30s linear infinite}
        @keyframes marquee{to{transform:translateX(-50%)}}

        /* Entries */
        .e1{animation:rise .6s cubic-bezier(.22,1,.36,1) .05s forwards;opacity:0}
        .e2{animation:rise .6s cubic-bezier(.22,1,.36,1) .12s forwards;opacity:0}
        .e3{animation:rise .6s cubic-bezier(.22,1,.36,1) .22s forwards;opacity:0}
        .e4{animation:rise .6s cubic-bezier(.22,1,.36,1) .35s forwards;opacity:0}
        .e5{animation:rise .7s cubic-bezier(.22,1,.36,1) .25s forwards;opacity:0}
        @keyframes rise{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}

        /* Photo reveal */
        .img-reveal{animation:unveil .8s cubic-bezier(.22,1,.36,1) .15s forwards;clip-path:inset(100% 0 0 0)}
        @keyframes unveil{to{clip-path:inset(0 0 0 0)}}

        /* Feature row */
        .feat-row{border-bottom:1px solid var(--border);transition:all .25s ease}
        .feat-row:first-child{border-top:1px solid var(--border)}
        .feat-row:hover{background:var(--bg2);padding-left:1rem}
        .feat-row:hover .feat-idx{color:var(--copper)}
        .feat-row:hover .feat-title{color:var(--copper-light)}
        .feat-idx{color:var(--border);transition:color .25s}

        /* CTA */
        .cta-solid{background:var(--copper);color:var(--bg);font-weight:700;transition:all .2s}
        .cta-solid:hover{background:var(--ivory);color:var(--bg)}
        .cta-outline{border:1px solid var(--copper);color:var(--copper);transition:all .2s}
        .cta-outline:hover{background:var(--copper);color:var(--bg)}
      `}</style>

      <div className="grain lp" style={{ background: 'var(--bg)' }}>

        {/* ═══ NAV ═══ */}
        <nav className="relative z-10 flex items-center justify-between px-5 py-5 md:px-10 lg:px-16" style={{ borderBottom: '1px solid var(--border)' }}>
          <span className="text-sm font-bold tracking-tight" style={{ color: 'var(--ivory)' }}>
            Franco Garcia<span style={{ color: 'var(--copper)' }}> · CFO</span>
          </span>
          <div className="flex items-center gap-5">
            <Link href="/auth/login" className="hidden sm:inline text-xs uppercase tracking-widest transition-colors" style={{ color: 'var(--dim)' }}>
              Ingresar
            </Link>
            <Link href="/auth/register" className="cta-solid px-5 py-2.5 text-xs uppercase tracking-widest">
              Comenzar
            </Link>
          </div>
        </nav>

        {/* ═══ HERO ═══ */}
        <SpotlightHero className="px-5 md:px-10 lg:px-16">
          <div className="mx-auto max-w-[1400px]">
            <div className="flex flex-col md:flex-row md:items-end gap-8 md:gap-0 pt-10 md:pt-20 pb-14 md:pb-0">

              {/* Text */}
              <div className="flex-1 md:pb-20 lg:pb-28">
                <p className="e1 text-[10px] font-bold uppercase tracking-[4px] mb-6" style={{ color: 'var(--copper)' }}>
                  Consultor Financiero
                </p>

                <h1 className="e2 text-[clamp(34px,7vw,78px)] font-extrabold leading-[0.95] tracking-tight mb-8">
                  <TextScramble text="Tu CFO" delay={200} className="" /><br/>
                  <span style={{ color: 'var(--copper)' }}><TextScramble text="senior." delay={600} /></span><br/>
                  <span style={{ color: 'var(--dim)' }}><TextScramble text="Sin contratarlo." delay={1000} /></span>
                </h1>

                <p className="e3 max-w-lg text-sm md:text-base leading-relaxed mb-10" style={{ color: 'var(--dim)' }}>
                  Registra, analiza y proyecta las finanzas de tu negocio con la
                  guía de un director financiero con más de 8 años de experiencia.
                  Disponible cuando lo necesites.
                </p>

                <div className="e4 flex flex-col sm:flex-row items-start gap-4">
                  <MagneticButton href="/auth/register" className="cta-solid items-center gap-3 px-8 py-4 text-sm uppercase tracking-wider">
                    Prueba gratuita
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </MagneticButton>
                  <span className="text-[11px] pt-3" style={{ color: 'var(--dim)' }}>
                    7 días gratis · Sin tarjeta
                  </span>
                </div>

                {/* Stats */}
                <div className="e4 mt-12 flex items-center gap-8">
                  <div>
                    <AnimatedCounter value={50} suffix=".9%" className="text-xl md:text-2xl font-mono font-bold" style={{ color: 'var(--copper)' }} delay={300} />
                    <div className="text-[9px] uppercase tracking-[1.5px] mt-1" style={{ color: 'var(--dim)' }}>EBITDA prom.</div>
                  </div>
                  <div>
                    <div className="text-xl md:text-2xl font-mono font-bold" style={{ color: 'var(--copper)' }}>24/7</div>
                    <div className="text-[9px] uppercase tracking-[1.5px] mt-1" style={{ color: 'var(--dim)' }}>Disponible</div>
                  </div>
                  <div>
                    <div className="text-xl md:text-2xl font-mono font-bold" style={{ color: 'var(--copper)' }}>&lt;2min</div>
                    <div className="text-[9px] uppercase tracking-[1.5px] mt-1" style={{ color: 'var(--dim)' }}>Diagnóstico</div>
                  </div>
                </div>
              </div>

              {/* Photo */}
              <div className="e5 relative md:w-[320px] lg:w-[400px] md:-mb-1 flex-shrink-0">
                <div className="absolute -inset-16 flex items-center justify-center pointer-events-none">
                  <MorphingBlob color="#d4a574" size={500} />
                </div>
                <div className="img-reveal relative aspect-[3/4] w-full overflow-hidden">
                  <Image src="/franco.jpg" alt="Franco Garcia" fill className="object-cover object-top" priority />
                  <div className="absolute inset-x-0 bottom-0 h-2/5" style={{ background: 'linear-gradient(to top, var(--bg), transparent)' }} />
                </div>
                <div className="absolute bottom-6 left-0 right-0 px-4">
                  <div className="pl-4" style={{ borderLeft: '3px solid var(--copper)' }}>
                    <div className="text-lg font-bold" style={{ color: 'var(--ivory)' }}>Franco Garcia</div>
                    <div className="text-[11px] font-mono" style={{ color: 'var(--dim)' }}>CFO Senior · MBA UNI · +8 años</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SpotlightHero>

        {/* ═══ TICKER ═══ */}
        <div className="py-3 overflow-hidden" style={{ background: 'var(--copper)', borderTop: '1px solid var(--copper-light)', borderBottom: '1px solid var(--copper-light)' }}>
          <div className="ticker">
            <div className="ticker-track font-bold text-[11px] tracking-[3px] uppercase" style={{ color: 'var(--bg)' }}>
              {TICKER_TEXT.repeat(6)}
            </div>
          </div>
        </div>

        {/* ═══ FEATURES ═══ */}
        <section style={{ background: 'var(--bg2)' }}>
          <div className="mx-auto max-w-[1400px] px-5 md:px-10 lg:px-16 py-20 md:py-28">
            <div className="flex flex-col md:flex-row gap-12 md:gap-20">
              <div className="md:w-[38%] md:sticky md:top-24 md:self-start">
                <p className="text-[10px] font-bold uppercase tracking-[4px] mb-4" style={{ color: 'var(--copper)' }}>
                  Plataforma
                </p>
                <h2 className="text-3xl md:text-4xl font-extrabold leading-tight tracking-tight" style={{ color: 'var(--ivory)' }}>
                  Todo lo que un<br/>CFO hace.
                </h2>
                <p className="text-sm mt-4 leading-relaxed" style={{ color: 'var(--dim)' }}>
                  Automatizado, disponible siempre, a una fracción del costo.
                </p>
              </div>
              <div className="flex-1">
                {FEATURES.map((f) => (
                  <div key={f.n} className="feat-row group py-6 md:py-8 flex items-start gap-6 md:gap-8">
                    <span className="feat-idx font-mono text-2xl font-bold flex-shrink-0">{f.n}</span>
                    <div>
                      <h3 className="feat-title text-base md:text-lg font-bold mb-1.5 transition-colors" style={{ color: 'var(--ivory)' }}>
                        {f.title}
                      </h3>
                      <p className="text-xs md:text-sm leading-relaxed max-w-md" style={{ color: 'var(--dim)' }}>
                        {f.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ TICKER 2 ═══ */}
        <div className="py-3 overflow-hidden" style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <div className="ticker">
            <div className="ticker-track font-bold text-[11px] tracking-[3px] uppercase" style={{ color: 'var(--copper)', opacity: 0.35, animationDirection: 'reverse' }}>
              {('REGISTRO · ANÁLISIS · PROYECCIÓN · DECISIONES · CONTROL · CRECIMIENTO · ').repeat(6)}
            </div>
          </div>
        </div>

        {/* ═══ BIO + PRICING ═══ */}
        <section className="px-5 md:px-10 lg:px-16 py-20 md:py-28">
          <div className="mx-auto max-w-[1400px] grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
            {/* Bio */}
            <div className="rounded-lg p-8 md:p-10" style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
              <p className="text-[10px] font-bold uppercase tracking-[4px] mb-6" style={{ color: 'var(--copper)' }}>
                Quién está detrás
              </p>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0" style={{ border: '2px solid var(--copper)' }}>
                  <Image src="/franco.jpg" alt="Franco Garcia" width={64} height={64} className="w-full h-full object-cover object-top" />
                </div>
                <div>
                  <div className="text-lg font-bold" style={{ color: 'var(--ivory)' }}>Franco Garcia</div>
                  <div className="text-xs font-mono" style={{ color: 'var(--copper)' }}>CFO Senior · MBA UNI</div>
                </div>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--dim)' }}>
                Administrador de Empresas con más de 8 años en finanzas corporativas.
                Gerente en empresas líderes del país, en áreas de planeamiento
                estratégico y control de gestión.
              </p>
              <div className="flex flex-wrap gap-2 mt-6">
                {['MBA UNI', '+8 años', 'Finanzas', 'Estrategia'].map((t) => (
                  <span key={t} className="text-[10px] font-mono font-medium px-3 py-1.5 uppercase tracking-wider" style={{ background: 'var(--bg3)', color: 'var(--cream)', border: '1px solid var(--border)' }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div className="flex flex-col justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[4px] mb-6" style={{ color: 'var(--copper)' }}>
                  Inversión
                </p>
                <div className="flex items-baseline gap-3 mb-4">
                  <AnimatedCounter value={800} className="text-6xl md:text-7xl font-mono font-bold tracking-tighter" style={{ color: 'var(--copper)' }} duration={2000} />
                  <div>
                    <div className="text-lg font-mono" style={{ color: 'var(--dim)' }}>S/</div>
                    <div className="text-xs" style={{ color: 'var(--dim)' }}>/mes</div>
                  </div>
                </div>
                <p className="text-sm leading-relaxed max-w-sm" style={{ color: 'var(--dim)' }}>
                  Un consultor financiero cobra entre{' '}
                  <span className="font-mono font-semibold" style={{ color: 'var(--ivory)' }}>S/ 10,000</span>{' '}
                  y{' '}
                  <span className="font-mono font-semibold" style={{ color: 'var(--ivory)' }}>S/ 30,000</span>{' '}
                  al mes.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <Link href="/auth/register" className="cta-solid inline-flex items-center justify-center gap-3 px-8 py-4 text-sm uppercase tracking-wider">
                  Activar prueba gratuita
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </Link>
                <Link href="/auth/login" className="cta-outline inline-flex items-center justify-center px-8 py-4 text-sm uppercase tracking-wider">
                  Ya tengo cuenta
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer className="px-5 md:px-10 lg:px-16 py-8 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid var(--border)' }}>
          <span className="text-[11px] font-mono" style={{ color: 'var(--dim)' }}>© 2026</span>
          <span className="text-[11px]" style={{ color: 'var(--dim)' }}>Franco Garcia · Consultor Financiero</span>
        </footer>
      </div>
    </div>
  );
}
