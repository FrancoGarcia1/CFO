'use client';
import Link from 'next/link';

const VARIANTS = [
  { n: '01', slug: 'wizard', name: 'Wizard cinematográfico', mood: '3 pasos con transiciones slide + progress dorada', wow: 'Reduce fricción — el usuario avanza, no rellena un form' },
  { n: '02', slug: 'split', name: 'Split + preview en vivo', mood: 'Form a la izquierda, dashboard preview a la derecha', wow: 'Ves tu futura cuenta mientras escribes' },
  { n: '03', slug: 'chat', name: 'Chat conversacional', mood: 'El CFO te pregunta uno a uno con typewriter', wow: 'Humaniza el registro — conversación con un consultor' },
  { n: '04', slug: 'ficha', name: 'Ficha bancaria institucional', mood: 'Estética de apertura de banca privada · Fraunces serif', wow: 'Formal y premium — firmar una membresía, no un form' },
  { n: '05', slug: 'glass', name: 'Glass sobre dashboard vivo', mood: 'Form glass sobre dashboard animándose al fondo', wow: 'Muestra el producto vivo desde el primer click' },
];

export default function RegisterPreviewHub() {
  return (
    <div className="min-h-screen px-6 md:px-12 lg:px-20 py-14" style={{ background: '#0a0a0a', color: '#f5f0e8', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      <div className="mx-auto max-w-[1100px]">
        <Link href="/" className="text-[11px] font-mono uppercase tracking-[2px]" style={{ color: '#a8a19a' }}>
          ← Volver al inicio
        </Link>

        <p className="mt-10 text-[10px] font-mono font-bold uppercase tracking-[4px] mb-4" style={{ color: '#c8a15a' }}>
          Preview · Registro
        </p>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4" style={{ color: '#f5f0e8' }}>
          5 variantes del flujo de{' '}
          <span style={{ color: '#c8a15a' }}>registro</span>
        </h1>
        <p className="max-w-2xl text-[14px] leading-relaxed mb-12" style={{ color: '#a8a19a' }}>
          Cada variante es una página completa y funcional. Abrila en una pestaña nueva, llena los campos y
          dime cuál te gusta más.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {VARIANTS.map((v) => (
            <Link
              key={v.slug}
              href={`/register-preview/${v.slug}`}
              target="_blank"
              className="group relative p-6 md:p-7 rounded-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(19,17,16,.9), rgba(13,11,10,.65))',
                border: '1px solid rgba(200,161,90,.2)',
                boxShadow: '0 20px 40px -20px rgba(0,0,0,.7)',
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-px" style={{
                background: 'linear-gradient(90deg, transparent, rgba(200,161,90,.6), transparent)',
              }}/>

              <div className="flex items-baseline justify-between mb-5">
                <span className="text-[40px] md:text-[48px] font-extrabold tabular-nums leading-none tracking-tight" style={{ color: '#c8a15a' }}>
                  {v.n}
                </span>
                <span className="text-[10px] font-mono uppercase tracking-[2px] opacity-60 group-hover:opacity-100 transition-opacity flex items-center gap-1.5" style={{ color: '#c8a15a' }}>
                  Abrir demo
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-1 transition-transform">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </span>
              </div>

              <h2 className="text-[20px] md:text-[22px] font-bold mb-1.5 leading-tight" style={{ color: '#f5f0e8' }}>
                {v.name}
              </h2>
              <p className="text-[12px] mb-4" style={{ color: '#a8a19a' }}>
                {v.mood}
              </p>

              <div className="pt-3 flex items-start gap-2 text-[11px] italic" style={{
                borderTop: '1px solid rgba(200,161,90,.12)',
                color: '#c8a15a',
              }}>
                <span>⚡</span>
                <span>{v.wow}</span>
              </div>
            </Link>
          ))}
        </div>

        <p className="text-center text-[11px] mt-12" style={{ color: '#6b6660' }}>
          Cada variante usa el mismo endpoint de registro —
          puedes crear una cuenta real con cualquiera de las 5 para probar el flujo completo.
        </p>
      </div>
    </div>
  );
}
