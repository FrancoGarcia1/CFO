'use client';
import { ServiciosExpediente } from '@/components/landing/servicios/servicios-expediente';
import { ServiciosLedger } from '@/components/landing/servicios/servicios-ledger';
import { ServiciosMedallones } from '@/components/landing/servicios/servicios-medallones';
import { ServiciosEditorial } from '@/components/landing/servicios/servicios-editorial';
import { ServiciosLayers } from '@/components/landing/servicios/servicios-layers';

const VARIANTS = [
  {
    n: '01',
    name: 'Expediente confidencial',
    mood: 'Archivo de banca privada · folders con tab dorado',
    Component: ServiciosExpediente,
  },
  {
    n: '02',
    name: 'Bloomberg Ledger',
    mood: 'Data table institucional · métricas live · ticker',
    Component: ServiciosLedger,
  },
  {
    n: '03',
    name: 'Medallones grabados',
    mood: 'Numismática de lujo · flip 3D al hover',
    Component: ServiciosMedallones,
  },
  {
    n: '04',
    name: 'Índice editorial',
    mood: 'Tabla de contenidos · serif · numerales romanos',
    Component: ServiciosEditorial,
  },
  {
    n: '05',
    name: 'Sala de control (parallax)',
    mood: 'Paneles translúcidos con parallax del mouse',
    Component: ServiciosLayers,
  },
];

export default function ServiciosPreviewPage() {
  return (
    <div style={{ background: '#0a0a0a', color: '#f5f0e8' }}>
      {/* Nav */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur"
        style={{
          background: 'rgba(10,10,10,.85)',
          borderBottom: '1px solid rgba(200,161,90,.2)',
        }}
      >
        <div className="flex items-center gap-4">
          <a
            href="/"
            className="text-[11px] font-mono uppercase tracking-[2px] hover:text-[color:#c8a15a] transition-colors"
            style={{ color: '#a8a19a' }}
          >
            ← Volver al inicio
          </a>
          <span style={{ color: '#3a3a3a' }}>·</span>
          <span
            className="text-[11px] font-mono uppercase tracking-[2px]"
            style={{ color: '#c8a15a' }}
          >
            Preview · Servicios
          </span>
        </div>
        <div className="flex gap-1.5">
          {VARIANTS.map((v) => (
            <a
              key={v.n}
              href={`#v${v.n}`}
              className="px-2.5 py-1 text-[10px] font-mono font-bold rounded transition-colors"
              style={{
                border: '1px solid rgba(200,161,90,.3)',
                color: '#c8a15a',
              }}
            >
              {v.n}
            </a>
          ))}
        </div>
      </nav>

      {/* Hero intro */}
      <section
        className="px-6 md:px-12 lg:px-20 py-16 border-b"
        style={{ borderColor: 'rgba(200,161,90,.15)' }}
      >
        <div className="mx-auto max-w-[1400px]">
          <p
            className="text-[10px] font-mono font-semibold uppercase tracking-[4px] mb-3"
            style={{ color: '#c8a15a' }}
          >
            Elige tu preferida
          </p>
          <h1
            className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4"
            style={{ color: '#f5f0e8' }}
          >
            5 propuestas para la sección{' '}
            <span style={{ color: '#c8a15a' }}>Servicios</span>
          </h1>
          <p className="max-w-2xl text-[14px] leading-relaxed" style={{ color: '#a8a19a' }}>
            Cada versión compromete una dirección estética distinta. Desliza
            hacia abajo para ver las 5 una debajo de otra. Usa los botones
            numéricos del nav para saltar rápido.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-10">
            {VARIANTS.map((v) => (
              <a
                key={v.n}
                href={`#v${v.n}`}
                className="flex items-center gap-4 px-5 py-3 rounded transition-all hover:bg-[rgba(200,161,90,0.04)]"
                style={{
                  border: '1px solid rgba(200,161,90,.15)',
                }}
              >
                <span
                  className="text-[22px] font-mono font-bold"
                  style={{ color: '#c8a15a' }}
                >
                  {v.n}
                </span>
                <div>
                  <div className="text-[14px] font-bold" style={{ color: '#f5f0e8' }}>
                    {v.name}
                  </div>
                  <div className="text-[11px]" style={{ color: '#a8a19a' }}>
                    {v.mood}
                  </div>
                </div>
                <span className="ml-auto text-[14px]" style={{ color: '#c8a15a' }}>
                  ↓
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Variants */}
      {VARIANTS.map((v) => (
        <div key={v.n} id={`v${v.n}`}>
          {/* Variant label bar */}
          <div
            className="sticky top-[57px] z-40 px-6 md:px-12 lg:px-20 py-3 backdrop-blur"
            style={{
              background: 'rgba(10,10,10,.9)',
              borderTop: '1px solid rgba(200,161,90,.4)',
              borderBottom: '1px solid rgba(200,161,90,.15)',
            }}
          >
            <div className="mx-auto max-w-[1400px] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className="text-[22px] font-mono font-bold"
                  style={{ color: '#c8a15a' }}
                >
                  {v.n}
                </span>
                <div>
                  <div
                    className="text-[14px] font-bold uppercase tracking-[2px]"
                    style={{ color: '#f5f0e8' }}
                  >
                    {v.name}
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-[2px]" style={{ color: '#6b6660' }}>
                    {v.mood}
                  </div>
                </div>
              </div>
              <a
                href="#top"
                className="text-[10px] font-mono uppercase tracking-[2px]"
                style={{ color: '#c8a15a' }}
              >
                ↑ Volver arriba
              </a>
            </div>
          </div>

          <v.Component />
        </div>
      ))}

      {/* Footer */}
      <footer
        className="px-6 md:px-12 lg:px-20 py-10 text-center"
        style={{ borderTop: '1px solid rgba(200,161,90,.15)' }}
      >
        <p className="text-[12px]" style={{ color: '#a8a19a' }}>
          Dime cuál te gusta (por número) y la integro a la landing.
        </p>
      </footer>
    </div>
  );
}
