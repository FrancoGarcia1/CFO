import Link from 'next/link';
import { DashboardReveal } from '@/components/landing/dashboard-reveal';
import { ServiciosLayers } from '@/components/landing/servicios/servicios-layers';
import { HeroAurora } from '@/components/landing/hero/hero-aurora';
import { PricingTarjeta } from '@/components/landing/pricing/pricing-tarjeta';

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
        <HeroAurora />

        {/* ═══ CLIENTS ROW ═══ */}
        <div className="px-6 md:px-12 lg:px-20 py-8" style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <div className="mx-auto max-w-[1400px] flex flex-wrap items-center justify-around gap-x-8 gap-y-4">
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

        {/* ═══ DASHBOARD REVEAL — scroll storytelling ═══ */}
        <DashboardReveal />

        {/* ═══ SERVICIOS SECTION ═══ */}
        <div id="servicios" style={{ borderTop: '1px solid var(--border)' }}>
          <ServiciosLayers />
        </div>

        {/* ═══ PRICING ═══ */}
        <div id="precios" style={{ borderTop: '1px solid var(--border)' }}>
          <PricingTarjeta />
        </div>

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
