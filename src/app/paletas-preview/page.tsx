'use client';
import { DashboardMockup } from '@/components/dashboard-preview/dashboard-mockup';
import { THEMES } from '@/components/dashboard-preview/themes';
import Link from 'next/link';

export default function DashboardPreviewPage() {
  return (
    <div style={{ background: '#0a0a0a', color: '#f5f0e8', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      {/* Top nav */}
      <nav className="sticky top-0 z-[60] flex items-center justify-between px-5 md:px-6 py-3 backdrop-blur" style={{
        background: 'rgba(10,10,10,.88)',
        borderBottom: '1px solid rgba(200,161,90,.25)',
      }}>
        <div className="flex items-center gap-3 flex-wrap">
          <Link href="/" className="text-[10px] font-mono uppercase tracking-[2px]" style={{ color: '#a8a19a' }}>
            ← Inicio
          </Link>
          <span style={{ color: '#3a3a3a' }}>·</span>
          <span className="text-[10px] font-mono font-bold uppercase tracking-[2px]" style={{ color: '#c8a15a' }}>
            Preview · Dashboard paletas
          </span>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {THEMES.map((t, i) => (
            <a key={t.id} href={`#${t.id}`} className="px-2.5 py-1 text-[10px] font-mono font-bold rounded" style={{
              border: '1px solid rgba(200,161,90,.3)', color: '#c8a15a',
            }}>
              {String(i + 1).padStart(2, '0')}
            </a>
          ))}
        </div>
      </nav>

      {/* Intro */}
      <section className="px-6 md:px-12 lg:px-20 py-14 border-b" style={{ borderColor: 'rgba(200,161,90,.15)' }}>
        <div className="mx-auto max-w-[1100px]">
          <p className="text-[10px] font-mono font-bold uppercase tracking-[4px] mb-3" style={{ color: '#c8a15a' }}>
            Elige tu paleta preferida
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4" style={{ color: '#f5f0e8' }}>
            6 paletas para el <span style={{ color: '#c8a15a' }}>Dashboard</span>
          </h1>
          <p className="max-w-2xl text-[14px] leading-relaxed mb-10" style={{ color: '#a8a19a' }}>
            Cada variante aplica un sistema de color completo al mismo mockup de dashboard.
            Mismos KPIs, mismo chart, misma tabla — solo cambia la paleta.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {THEMES.map((t, i) => (
              <a
                key={t.id}
                href={`#${t.id}`}
                className="flex items-start gap-4 p-4 rounded transition-colors"
                style={{ border: '1px solid rgba(200,161,90,.15)' }}
              >
                {/* Palette swatches */}
                <div className="flex flex-col gap-1 flex-shrink-0">
                  <div className="flex gap-1">
                    <div className="w-4 h-4 rounded-sm" style={{ background: t.bg }}/>
                    <div className="w-4 h-4 rounded-sm" style={{ background: t.card }}/>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-4 h-4 rounded-sm" style={{ background: t.accent }}/>
                    <div className="w-4 h-4 rounded-sm" style={{ background: t.positive }}/>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[12px] font-bold" style={{ color: '#f5f0e8' }}>{t.name}</div>
                  <div className="text-[10px] mt-0.5" style={{ color: '#a8a19a' }}>{t.subtitle}</div>
                  <div className="text-[9.5px] italic mt-0.5" style={{ color: '#6b6660' }}>{t.mood}</div>
                </div>
                <span className="text-[11px]" style={{ color: '#c8a15a' }}>↓</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Variants */}
      {THEMES.map((t, i) => (
        <div key={t.id} id={t.id}>
          {/* Label bar */}
          <div className="sticky top-[48px] z-50 px-5 md:px-6 py-2.5 backdrop-blur" style={{
            background: 'rgba(10,10,10,.92)',
            borderTop: '1px solid rgba(200,161,90,.4)',
            borderBottom: '1px solid rgba(200,161,90,.15)',
          }}>
            <div className="mx-auto max-w-[1100px] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-[10px] font-mono font-bold uppercase tracking-[2px] px-2 py-0.5 rounded flex-shrink-0" style={{
                  background: 'rgba(200,161,90,.15)',
                  color: '#c8a15a',
                  border: '1px solid rgba(200,161,90,.4)',
                }}>
                  Paleta {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-[12px] font-bold truncate" style={{ color: '#f5f0e8' }}>{t.name}</span>
                <span className="hidden md:inline text-[10px] truncate" style={{ color: '#6b6660' }}>— {t.mood}</span>
              </div>
              <a href="#top" className="text-[9px] font-mono uppercase tracking-[2px] flex-shrink-0" style={{ color: '#c8a15a' }}>
                ↑ Top
              </a>
            </div>
          </div>

          <DashboardMockup theme={t} />
        </div>
      ))}

      <footer className="px-6 py-12 text-center" style={{ borderTop: '1px solid rgba(200,161,90,.15)' }}>
        <p className="text-[12px]" style={{ color: '#a8a19a' }}>
          Dime qué paleta te gusta (por número) y la aplico al dashboard real.
        </p>
      </footer>
    </div>
  );
}
