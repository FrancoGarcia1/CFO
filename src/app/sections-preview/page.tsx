'use client';
import { HeroDashboard } from '@/components/landing/hero/hero-dashboard';
import { HeroTerminal } from '@/components/landing/hero/hero-terminal';
import { HeroParallax } from '@/components/landing/hero/hero-parallax';
import { HeroAurora } from '@/components/landing/hero/hero-aurora';
import { HeroSplit } from '@/components/landing/hero/hero-split';
import { PricingComparativa } from '@/components/landing/pricing/pricing-comparativa';
import { PricingCalculadora } from '@/components/landing/pricing/pricing-calculadora';
import { PricingTarjeta } from '@/components/landing/pricing/pricing-tarjeta';
import { PricingTimeline } from '@/components/landing/pricing/pricing-timeline';
import { PricingOrbital } from '@/components/landing/pricing/pricing-orbital';

const HEROES = [
  { id: 'h1', n: '01', name: 'Dashboard vivo protagonista', mood: 'Dashboard 3D a la derecha con mini-paneles animados', C: HeroDashboard },
  { id: 'h2', n: '02', name: 'Terminal financiero narrativo', mood: 'Ventana macOS tipeando comandos reales', C: HeroTerminal },
  { id: 'h3', n: '03', name: 'Parallax cinemático', mood: 'Título central + capas flotando con mouse parallax', C: HeroParallax },
  { id: 'h4', n: '04', name: 'Aurora + texto scrambler', mood: 'Fondo dorado animado + letras scrambling + counters', C: HeroAurora },
  { id: 'h5', n: '05', name: 'Split diagonal metálico', mood: 'Corte diagonal + gráfica con números grandes', C: HeroSplit },
];

const PRICINGS = [
  { id: 'p1', n: '01', name: 'Comparativa tradicional vs CFO', mood: 'Side-by-side con contador de ahorro', C: PricingComparativa },
  { id: 'p2', n: '02', name: 'Calculadora de ahorro interactiva', mood: 'Slider de facturación con 3 resultados live', C: PricingCalculadora },
  { id: 'p3', n: '03', name: 'Tarjeta metálica premium', mood: 'Amex Platinum 3D tilt + specular', C: PricingTarjeta },
  { id: 'p4', n: '04', name: 'Timeline ROI narrativo', mood: 'Milestones iluminándose al scroll', C: PricingTimeline },
  { id: 'p5', n: '05', name: 'Pila de monedas orbital', mood: 'Coin stack + 6 iconos orbitando', C: PricingOrbital },
];

export default function SectionsPreviewPage() {
  return (
    <div style={{ background: '#0a0a0a', color: '#f5f0e8', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      {/* Top nav */}
      <nav className="sticky top-0 z-[60] flex items-center justify-between px-4 md:px-6 py-3 backdrop-blur" style={{
        background: 'rgba(10,10,10,.9)',
        borderBottom: '1px solid rgba(200,161,90,.25)',
      }}>
        <div className="flex items-center gap-3 flex-wrap">
          <a href="/" className="text-[10px] font-mono uppercase tracking-[2px]" style={{ color: '#a8a19a' }}>
            ← Inicio
          </a>
          <span style={{ color: '#3a3a3a' }}>·</span>
          <span className="text-[10px] font-mono font-bold uppercase tracking-[2px]" style={{ color: '#c8a15a' }}>
            Preview Secciones
          </span>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <span className="text-[9px] font-mono uppercase tracking-[2px] self-center mr-1" style={{ color: '#6b6660' }}>Hero</span>
          {HEROES.map((h) => (
            <a key={h.id} href={`#${h.id}`} className="px-2 py-1 text-[10px] font-mono font-bold rounded" style={{
              border: '1px solid rgba(200,161,90,.3)', color: '#c8a15a',
            }}>H{h.n}</a>
          ))}
          <span className="text-[9px] font-mono uppercase tracking-[2px] self-center mx-1" style={{ color: '#6b6660' }}>Pricing</span>
          {PRICINGS.map((p) => (
            <a key={p.id} href={`#${p.id}`} className="px-2 py-1 text-[10px] font-mono font-bold rounded" style={{
              border: '1px solid rgba(200,161,90,.3)', color: '#c8a15a',
            }}>P{p.n}</a>
          ))}
        </div>
      </nav>

      {/* Intro */}
      <section className="px-6 md:px-12 lg:px-20 py-14" style={{ borderBottom: '1px solid rgba(200,161,90,.15)' }}>
        <div className="mx-auto max-w-[1400px]">
          <p className="text-[10px] font-mono font-bold uppercase tracking-[4px] mb-3" style={{ color: '#c8a15a' }}>
            Elige tus preferidos
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4" style={{ color: '#f5f0e8' }}>
            5 variantes de <span style={{ color: '#c8a15a' }}>Hero</span> y 5 de <span style={{ color: '#c8a15a' }}>Pricing</span>
          </h1>
          <p className="max-w-2xl text-[14px] leading-relaxed mb-8" style={{ color: '#a8a19a' }}>
            Cada variante está completa y funcional. Desliza hacia abajo para verlas todas, o usa los botones del nav para saltar.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-[11px] font-mono font-bold uppercase tracking-[3px] mb-3" style={{ color: '#c8a15a' }}>Hero — 5 opciones</p>
              <div className="space-y-1.5">
                {HEROES.map((h) => (
                  <a key={h.id} href={`#${h.id}`} className="flex items-center gap-3 p-3 rounded hover:bg-[rgba(200,161,90,.04)] transition-colors" style={{ border: '1px solid rgba(200,161,90,.12)' }}>
                    <span className="text-[18px] font-mono font-bold" style={{ color: '#c8a15a' }}>H{h.n}</span>
                    <div className="flex-1">
                      <div className="text-[13px] font-bold" style={{ color: '#f5f0e8' }}>{h.name}</div>
                      <div className="text-[10px]" style={{ color: '#a8a19a' }}>{h.mood}</div>
                    </div>
                    <span style={{ color: '#c8a15a' }}>↓</span>
                  </a>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[11px] font-mono font-bold uppercase tracking-[3px] mb-3" style={{ color: '#c8a15a' }}>Pricing — 5 opciones</p>
              <div className="space-y-1.5">
                {PRICINGS.map((p) => (
                  <a key={p.id} href={`#${p.id}`} className="flex items-center gap-3 p-3 rounded hover:bg-[rgba(200,161,90,.04)] transition-colors" style={{ border: '1px solid rgba(200,161,90,.12)' }}>
                    <span className="text-[18px] font-mono font-bold" style={{ color: '#c8a15a' }}>P{p.n}</span>
                    <div className="flex-1">
                      <div className="text-[13px] font-bold" style={{ color: '#f5f0e8' }}>{p.name}</div>
                      <div className="text-[10px]" style={{ color: '#a8a19a' }}>{p.mood}</div>
                    </div>
                    <span style={{ color: '#c8a15a' }}>↓</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Heroes */}
      {HEROES.map((h) => (
        <div key={h.id} id={h.id}>
          <VariantLabel kind="Hero" n={h.n} name={h.name} mood={h.mood} />
          <h.C />
        </div>
      ))}

      {/* Divider */}
      <div className="px-6 md:px-12 lg:px-20 py-12 text-center" style={{ background: '#0a0a0a', borderTop: '2px solid rgba(200,161,90,.3)', borderBottom: '2px solid rgba(200,161,90,.3)' }}>
        <p className="text-[10px] font-mono font-bold uppercase tracking-[6px]" style={{ color: '#c8a15a' }}>
          — Pricing —
        </p>
      </div>

      {/* Pricings */}
      {PRICINGS.map((p) => (
        <div key={p.id} id={p.id}>
          <VariantLabel kind="Pricing" n={p.n} name={p.name} mood={p.mood} />
          <p.C />
        </div>
      ))}

      <footer className="px-6 py-12 text-center" style={{ borderTop: '1px solid rgba(200,161,90,.15)' }}>
        <p className="text-[12px]" style={{ color: '#a8a19a' }}>
          Dime cuál Hero y cuál Pricing (por número) y los integro a la landing.
        </p>
      </footer>
    </div>
  );
}

function VariantLabel({ kind, n, name, mood }: { kind: string; n: string; name: string; mood: string }) {
  return (
    <div className="sticky top-[45px] z-50 px-4 md:px-6 lg:px-20 py-2.5 backdrop-blur" style={{
      background: 'rgba(10,10,10,.92)',
      borderTop: '1px solid rgba(200,161,90,.4)',
      borderBottom: '1px solid rgba(200,161,90,.15)',
    }}>
      <div className="mx-auto max-w-[1400px] flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[2px] px-2 py-0.5 rounded flex-shrink-0" style={{
            background: 'rgba(200,161,90,.15)', color: '#c8a15a', border: '1px solid rgba(200,161,90,.4)',
          }}>
            {kind} {n}
          </span>
          <span className="text-[12px] font-bold truncate" style={{ color: '#f5f0e8' }}>{name}</span>
          <span className="hidden md:inline text-[10px] truncate" style={{ color: '#6b6660' }}>— {mood}</span>
        </div>
        <a href="#top" className="text-[9px] font-mono uppercase tracking-[2px] flex-shrink-0" style={{ color: '#c8a15a' }}>
          ↑ Top
        </a>
      </div>
    </div>
  );
}
