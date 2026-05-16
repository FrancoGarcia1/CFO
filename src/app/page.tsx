import Link from 'next/link';
import { HeroCFC } from '@/components/landing-cfc/hero-cfc';
import { ProblemaCFC } from '@/components/landing-cfc/problema-cfc';
import { ServiciosEcosistema } from '@/components/landing-cfc/servicios-ecosistema';
import { ProductosSuite } from '@/components/landing-cfc/productos-suite';
import { PropuestaValor } from '@/components/landing-cfc/propuesta-valor';
import { ParaQuien } from '@/components/landing-cfc/para-quien';
import { CtaFinal } from '@/components/landing-cfc/cta-final';
import { ScrollIndicator } from '@/components/landing-cfc/scroll-indicator';
import { CFC_COLORS as C } from '@/components/landing-cfc/data';

/**
 * Capital Founder Consulting E.I.R.L. — Landing principal de la firma.
 *
 * Identidad visual propia (diferenciada de Capital CFO):
 *  - Carbón cálido #0e0a07 + Bronce #a47148
 *  - Display serif Fraunces (Capital CFO usa sans Be Vietnam Pro)
 *  - Línea conectora ENTENDER → DECIDIR → EJECUTAR (firma de animación)
 *  - Tres pilares: Finanzas (acero) · Estrategia (bronce) · Tech (salvia)
 *
 * Capital CFO se presenta como UNO de los productos en la suite.
 */

const NAV_LINKS = [
  { href: '#servicios', label: 'Servicios' },
  { href: '#productos', label: 'Productos' },
  { href: '#para-quien', label: 'Clientes' },
  { href: '#contacto', label: 'Contacto' },
];

export default function CapitalFounderConsultingPage() {
  return (
    <div className="min-h-screen" style={{
      background: C.bg,
      color: C.ivory,
      fontFamily: "'Be Vietnam Pro', system-ui, sans-serif",
      overflowX: 'clip',
    }}>
      {/* Grain global sutil */}
      <div className="fixed inset-0 pointer-events-none z-[1] opacity-[.025]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        mixBlendMode: 'overlay',
      }}/>

      {/* ═══ NAV ═══ */}
      <nav className="relative z-30 flex items-center justify-between px-6 md:px-12 lg:px-20 py-5" style={{
        background: `${C.bg}cc`,
        backdropFilter: 'saturate(180%) blur(20px)',
        borderBottom: `1px solid ${C.border}`,
      }}>
        <Link href="/" className="flex items-center gap-3">
          {/* Monograma CFC con estilo serif/dorado */}
          <div className="relative w-9 h-9 rounded-md flex items-center justify-center" style={{
            background: `linear-gradient(135deg, ${C.bronzeLight}, ${C.bronze})`,
            boxShadow: `0 1px 0 rgba(255,255,255,.1) inset, 0 6px 18px -6px ${C.bronze}60`,
          }}>
            <span className="text-[14px] font-semibold tracking-tight" style={{
              color: C.black,
              fontFamily: "'Fraunces', Georgia, serif",
              letterSpacing: '-0.02em',
            }}>
              CF
            </span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[14px] tracking-tight font-medium" style={{
              color: C.ivory,
              fontFamily: "'Fraunces', Georgia, serif",
              letterSpacing: '-0.01em',
            }}>
              Capital Founder
            </span>
            <span className="text-[8.5px] font-mono uppercase tracking-[2px]" style={{ color: C.bronze }}>
              Consulting · E.I.R.L.
            </span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[12.5px] font-medium transition-colors hover:text-[color:#c89570]"
              style={{ color: C.muted }}
            >
              {l.label}
            </a>
          ))}
        </div>

        <a
          href="#contacto"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-[11.5px] font-semibold uppercase tracking-[2px] transition-all"
          style={{
            border: `1px solid ${C.bronze}80`,
            color: C.bronzeLight,
            background: 'transparent',
          }}
        >
          Contacto
        </a>
      </nav>

      {/* Scroll indicator chevrons fijos (desktop) */}
      <ScrollIndicator />

      {/* ═══ SECCIONES ═══ */}
      <HeroCFC />
      <ProblemaCFC />
      <ServiciosEcosistema />
      <ProductosSuite />
      <PropuestaValor />
      <ParaQuien />
      <CtaFinal />

      {/* ═══ FOOTER ═══ */}
      <footer className="px-6 md:px-12 lg:px-20 py-12" style={{
        background: C.bgCard,
        borderTop: `1px solid ${C.border}`,
      }}>
        <div className="mx-auto max-w-[1400px]">
          <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr_1fr_1fr] gap-10 mb-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-md flex items-center justify-center" style={{
                  background: `linear-gradient(135deg, ${C.bronzeLight}, ${C.bronze})`,
                }}>
                  <span className="text-[14px] font-semibold" style={{
                    color: C.black,
                    fontFamily: "'Fraunces', Georgia, serif",
                  }}>
                    CF
                  </span>
                </div>
                <div>
                  <div className="text-[14px] font-medium" style={{
                    color: C.ivory,
                    fontFamily: "'Fraunces', Georgia, serif",
                  }}>
                    Capital Founder Consulting
                  </div>
                  <div className="text-[9px] font-mono uppercase tracking-[2px]" style={{ color: C.bronze }}>
                    E.I.R.L. · Lima, Perú
                  </div>
                </div>
              </div>
              <p className="text-[12px] leading-relaxed max-w-md" style={{ color: C.muted }}>
                Consultora integral que combina rigor financiero, pensamiento estratégico y tecnología aplicada para llevar negocios al siguiente nivel.
              </p>
            </div>

            {/* Servicios */}
            <div>
              <p className="text-[10px] font-mono font-bold uppercase tracking-[2px] mb-4" style={{ color: C.bronze }}>
                Servicios
              </p>
              <ul className="space-y-2 text-[12px]" style={{ color: C.muted }}>
                <li><a href="#servicios" className="transition-colors hover:text-[color:#c89570]">Finanzas</a></li>
                <li><a href="#servicios" className="transition-colors hover:text-[color:#c89570]">Estrategia</a></li>
                <li><a href="#servicios" className="transition-colors hover:text-[color:#c89570]">Tech &amp; IA</a></li>
                <li><a href="#productos" className="transition-colors hover:text-[color:#c89570]">Productos</a></li>
              </ul>
            </div>

            {/* Empresa */}
            <div>
              <p className="text-[10px] font-mono font-bold uppercase tracking-[2px] mb-4" style={{ color: C.bronze }}>
                Empresa
              </p>
              <ul className="space-y-2 text-[12px]" style={{ color: C.muted }}>
                <li><a href="#para-quien" className="transition-colors hover:text-[color:#c89570]">Clientes</a></li>
                <li><Link href="/capital-cfo" className="transition-colors hover:text-[color:#c89570]">Capital CFO</Link></li>
                <li><Link href="/auth/login" className="transition-colors hover:text-[color:#c89570]">Iniciar sesión</Link></li>
                <li><Link href="/auth/register" className="transition-colors hover:text-[color:#c89570]">Crear cuenta</Link></li>
              </ul>
            </div>

            {/* Contacto */}
            <div>
              <p className="text-[10px] font-mono font-bold uppercase tracking-[2px] mb-4" style={{ color: C.bronze }}>
                Contacto
              </p>
              <ul className="space-y-2 text-[12px]" style={{ color: C.muted }}>
                <li>
                  <a href="mailto:contacto@capitalfounderconsulting.com" className="break-all transition-colors hover:text-[color:#c89570]">
                    contacto@capitalfounderconsulting.com
                  </a>
                </li>
                <li>Lima, Perú</li>
                <li className="text-[10px] font-mono" style={{ color: C.dim }}>
                  Fundada · 2025
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom legal bar */}
          <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[10px] font-mono" style={{
            borderTop: `1px solid ${C.border}`,
            color: C.dim,
          }}>
            <span>© 2025 Capital Founder Consulting E.I.R.L. · Todos los derechos reservados</span>
            <span className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full" style={{ background: C.bronze }}/>
              Lima · Perú · LatAm
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
