import Link from 'next/link';
import { MagneticButton, SpotlightHero } from '@/components/landing/wow-effects';
import { DashboardReveal } from '@/components/landing/dashboard-reveal';

const NAV_LINKS = [
  { href: '#servicios', label: 'Servicios' },
  { href: '#casos', label: 'Casos de éxito' },
  { href: '#equipo', label: 'Equipo' },
  { href: '#precios', label: 'Precios' },
];

const TEAM_INITIALS = [
  { initials: 'MR', color: '#ef4444' },
  { initials: 'CL', color: '#06b6d4' },
  { initials: 'PA', color: '#8b5cf6' },
  { initials: 'SV', color: '#10b981' },
  { initials: 'JT', color: '#eab308' },
];

const STATS = [
  { value: '26.4%', label: 'EBITDA prom.' },
  { value: '24/7', label: 'Disponible' },
  { value: '<2min', label: 'Diagnóstico' },
  { value: '+85', label: 'Empresas' },
];

const CLIENT_LOGOS = [
  'CONFÍAN EN NOSOTROS',
  'INVERSIONES PACÍFICO',
  'GRUPONOVA',
  'ANDEAN CAPITAL',
  'RETAILPRO',
  'TECHMASS',
];

export default function LandingPage() {
  return (
    <div className="min-h-screen text-white" style={{ background: '#0a0a0a', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        :root{
          --bg:#0a0a0a;
          --bg-card:#141414;
          --border:#1f1f1f;
          --gold:#c8a15a;
          --gold-light:#d4b577;
          --gold-dark:#a88348;
          --ivory:#f5f0e8;
          --dim:#6b6660;
          --muted:#9a9490;
        }

        /* Logo icon square */
        .logo-icon{
          width:28px;height:28px;border-radius:6px;
          background:linear-gradient(135deg,#c8a15a,#a88348);
          display:flex;align-items:center;justify-content:center;
        }

        /* Entry animations */
        .e1{animation:rise .7s cubic-bezier(.22,1,.36,1) .05s forwards;opacity:0}
        .e2{animation:rise .7s cubic-bezier(.22,1,.36,1) .15s forwards;opacity:0}
        .e3{animation:rise .7s cubic-bezier(.22,1,.36,1) .25s forwards;opacity:0}
        .e4{animation:rise .7s cubic-bezier(.22,1,.36,1) .35s forwards;opacity:0}
        .e5{animation:rise .8s cubic-bezier(.22,1,.36,1) .3s forwards;opacity:0}
        .e6{animation:rise .7s cubic-bezier(.22,1,.36,1) .5s forwards;opacity:0}
        @keyframes rise{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}

        .cta-gold{
          background:linear-gradient(135deg,#c8a15a,#a88348);
          color:#0a0a0a;font-weight:600;
          transition:all .25s;
        }
        .cta-gold:hover{
          background:linear-gradient(135deg,#d4b577,#c8a15a);
          box-shadow:0 0 30px rgba(200,161,90,.25);
        }

        .nav-link{
          color:rgba(255,255,255,.65);
          transition:color .2s;
        }
        .nav-link:hover{color:#c8a15a}

        /* Bar animation */
        @keyframes barGrow{from{transform:scaleY(0)}to{transform:scaleY(1)}}
        .bar{transform-origin:bottom;animation:barGrow .8s ease .8s forwards;transform:scaleY(0)}

        /* Grain */
        .grain::before{
          content:'';position:fixed;inset:0;z-index:100;pointer-events:none;opacity:.02;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }
      `}</style>

      <div className="grain">

        {/* ═══ NAV ═══ */}
        <nav className="relative z-20 flex items-center justify-between px-6 md:px-12 lg:px-20 py-5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="logo-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 17 9 11 13 15 21 7" />
                <polyline points="14 7 21 7 21 14" />
              </svg>
            </div>
            <span className="text-[15px] font-bold tracking-tight">
              Capital<span style={{ color: 'var(--gold)' }}>CFO</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="nav-link text-[13px] font-medium">
                {l.label}
              </a>
            ))}
          </div>

          <Link href="/auth/register" className="cta-gold rounded-md px-4 py-2 text-[12px] uppercase tracking-wider">
            Diagnóstico gratuito
          </Link>
        </nav>

        {/* ═══ HERO ═══ */}
        <SpotlightHero className="px-6 md:px-12 lg:px-20">
          <div className="mx-auto max-w-[1400px]">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 lg:gap-16 pt-10 md:pt-16 pb-10 md:pb-20">

              {/* LEFT: Text */}
              <div>
                {/* Badge */}
                <div className="e1 mb-8 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5" style={{ border: '1px solid rgba(200,161,90,.25)', background: 'rgba(200,161,90,.05)' }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--gold)' }} />
                  <span className="text-[10px] font-semibold uppercase tracking-[2.5px]" style={{ color: 'var(--gold)' }}>
                    Consultoría Financiera
                  </span>
                </div>

                {/* Title */}
                <h1 className="e2 text-[clamp(38px,5.5vw,64px)] font-extrabold leading-[1.05] tracking-tight mb-8">
                  Tu área financiera,<br/>
                  <span style={{ color: 'var(--gold)' }}>sin el costo</span><br/>
                  de una contratación.
                </h1>

                {/* Description */}
                <p className="e3 max-w-xl text-[15px] leading-relaxed mb-10" style={{ color: 'var(--muted)' }}>
                  Registramos, analizamos y proyectamos las finanzas de tu negocio con un
                  equipo especializado de directores financieros senior. Disponibles cuando
                  lo necesites, sin estructura fija.
                </p>

                {/* CTAs */}
                <div className="e4 flex items-center gap-5">
                  <MagneticButton href="/auth/register" className="cta-gold items-center gap-2 rounded-md px-6 py-3 text-[13px] font-semibold">
                    Diagnóstico gratuito
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </MagneticButton>
                  <Link href="#casos" className="text-[13px] transition-colors" style={{ color: 'var(--muted)' }}>
                    Ver casos de éxito ›
                  </Link>
                </div>
              </div>

              {/* RIGHT: Two cards stacked */}
              <div className="e5 space-y-4 lg:self-end">

                {/* Card 1: Team */}
                <div className="rounded-xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <p className="text-[10px] font-semibold uppercase tracking-[2px] mb-3.5" style={{ color: 'var(--dim)' }}>
                    Nuestro equipo
                  </p>
                  <div className="flex items-center -space-x-2 mb-3">
                    {TEAM_INITIALS.map((t) => (
                      <div
                        key={t.initials}
                        className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold"
                        style={{
                          background: t.color,
                          color: '#fff',
                          border: '2px solid var(--bg-card)',
                        }}
                      >
                        {t.initials}
                      </div>
                    ))}
                  </div>
                  <p className="text-[12.5px] leading-relaxed" style={{ color: 'var(--ivory)' }}>
                    <span className="font-bold">+12 directores financieros</span>
                    <span style={{ color: 'var(--muted)' }}> con experiencia en 6+ industrias</span>
                  </p>
                </div>

                {/* Card 2: EBITDA with mini chart */}
                <div className="rounded-xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <p className="text-[10px] font-semibold uppercase tracking-[2px] mb-2.5" style={{ color: 'var(--dim)' }}>
                    EBITDA promedio clientes
                  </p>
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <div className="text-[28px] font-extrabold tracking-tight leading-none" style={{ color: 'var(--gold)' }}>
                        26.4%
                      </div>
                      <p className="text-[11px] mt-2" style={{ color: 'var(--muted)' }}>
                        <span style={{ color: 'var(--gold)' }}>↑</span> vs. línea base
                      </p>
                    </div>
                    <div className="flex items-end gap-1 h-12">
                      {[40, 55, 45, 70, 85, 95].map((h, i) => (
                        <div
                          key={i}
                          className="bar w-2.5 rounded-sm"
                          style={{
                            height: `${h}%`,
                            background: i >= 3 ? 'var(--gold)' : 'rgba(200,161,90,0.3)',
                            animationDelay: `${0.8 + i * 0.08}s`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ═══ STATS ROW ═══ */}
            <div className="e6 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 pb-10 md:pb-14">
              {STATS.map((s) => (
                <div key={s.label} className="text-center md:text-left">
                  <div className="text-[28px] md:text-[32px] font-extrabold tracking-tight" style={{ color: 'var(--ivory)' }}>
                    {s.value}
                  </div>
                  <div className="text-[10px] font-semibold uppercase tracking-[2px] mt-1" style={{ color: 'var(--dim)' }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* ═══ CLIENTS ROW ═══ */}
            <div className="pb-14 md:pb-20" style={{ borderTop: '1px solid var(--border)' }}>
              <div className="flex flex-wrap items-center justify-around gap-x-8 gap-y-4 pt-6">
                {CLIENT_LOGOS.map((l, i) => (
                  <span
                    key={l}
                    className="text-[10px] font-semibold uppercase tracking-[2px]"
                    style={{ color: i === 0 ? 'var(--gold)' : 'var(--dim)' }}
                  >
                    {l}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </SpotlightHero>

        {/* ═══ DASHBOARD REVEAL — scroll storytelling ═══ */}
        <DashboardReveal />

        {/* ═══ SERVICIOS SECTION ═══ */}
        <section id="servicios" className="px-6 md:px-12 lg:px-20 py-20 md:py-28" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="mx-auto max-w-[1400px]">
            <p className="text-[10px] font-semibold uppercase tracking-[3px] mb-4" style={{ color: 'var(--gold)' }}>
              Servicios
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-14 max-w-2xl">
              Todo lo que tu área financiera necesita.{' '}
              <span style={{ color: 'var(--muted)' }}>Automatizado.</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { n: '01', t: 'Dashboard financiero', d: 'Health Score, KPIs, márgenes, EBITDA y punto de equilibrio actualizados al instante.' },
                { n: '02', t: 'Forecast inteligente', d: 'Proyecciones con ajuste trimestral automático basado en tu desempeño real.' },
                { n: '03', t: 'Simulador P&L', d: 'Cambia variables y ve el impacto inmediato en tu estado de resultados.' },
                { n: '04', t: 'Consultor estratégico', d: 'Hazle cualquier pregunta. Responde con tus datos financieros reales.' },
                { n: '05', t: 'Reportes gerenciales', d: 'P&L anual, forecast vs real, exportes en Excel y PDF profesional.' },
                { n: '06', t: 'Multi-moneda', d: 'Soporte para 18 monedas: LATAM, USD, EUR. Sin límites de expansión.' },
              ].map((f) => (
                <div
                  key={f.n}
                  className="p-6 rounded-xl transition-all duration-300 hover:-translate-y-0.5"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[18px] font-bold" style={{ color: 'var(--gold)' }}>
                      {f.n}
                    </span>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(200,161,90,.1)' }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--gold)' }}>
                        <line x1="7" y1="17" x2="17" y2="7"/>
                        <polyline points="7 7 17 7 17 17"/>
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-[15px] font-bold mb-1.5">{f.t}</h3>
                  <p className="text-[12.5px] leading-relaxed" style={{ color: 'var(--muted)' }}>
                    {f.d}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ PRICING ═══ */}
        <section id="precios" className="px-6 md:px-12 lg:px-20 py-20 md:py-28" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="mx-auto max-w-[1400px] flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[3px] mb-4" style={{ color: 'var(--gold)' }}>
                Inversión mensual
              </p>
              <div className="flex items-baseline gap-3">
                <span className="text-[72px] md:text-[96px] font-extrabold font-mono tracking-tighter leading-none" style={{ color: 'var(--gold)' }}>
                  800
                </span>
                <div>
                  <div className="text-lg font-mono" style={{ color: 'var(--muted)' }}>S/</div>
                  <div className="text-xs" style={{ color: 'var(--dim)' }}>/mes</div>
                </div>
              </div>
              <p className="mt-5 max-w-md text-[13px] leading-relaxed" style={{ color: 'var(--muted)' }}>
                Un consultor financiero senior cobra entre{' '}
                <span className="font-mono font-semibold" style={{ color: 'var(--ivory)' }}>S/ 10,000</span>
                {' '}y{' '}
                <span className="font-mono font-semibold" style={{ color: 'var(--ivory)' }}>S/ 30,000</span>
                {' '}al mes. Capital CFO te da el mismo análisis por una fracción.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/auth/register" className="cta-gold inline-flex items-center justify-center gap-2 rounded-md px-7 py-3.5 text-[13px] font-semibold uppercase tracking-wider">
                Comenzar prueba
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
              <Link href="/auth/login" className="inline-flex items-center justify-center px-7 py-3.5 text-[13px] font-semibold uppercase tracking-wider rounded-md transition-colors" style={{ border: '1px solid var(--gold)', color: 'var(--gold)' }}>
                Ya soy cliente
              </Link>
            </div>
          </div>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer className="px-6 md:px-12 lg:px-20 py-8 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2">
            <div className="logo-icon" style={{ width: 22, height: 22 }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 17 9 11 13 15 21 7" />
              </svg>
            </div>
            <span className="text-[12px] font-bold tracking-tight">
              Capital<span style={{ color: 'var(--gold)' }}>CFO</span>
            </span>
          </div>
          <span className="text-[11px] font-mono" style={{ color: 'var(--dim)' }}>
            © 2026 · Consultoría Financiera
          </span>
        </footer>
      </div>
    </div>
  );
}
