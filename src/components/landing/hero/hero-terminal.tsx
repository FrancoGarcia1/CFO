'use client';
import { useEffect, useState } from 'react';
import { HERO_CONTENT as H } from './data';

const SESSIONS = [
  [
    { cmd: 'analyze_finances --period Q2', out: null },
    { cmd: null, out: '→ Cargando 2,847 transacciones... [OK]' },
    { cmd: null, out: '→ EBITDA: S/ 28,450 (50.9% margen)' },
    { cmd: null, out: '→ Health Score: 77/100 · Saludable' },
    { cmd: 'recommend_optimizations', out: null },
    { cmd: null, out: '✓ Reducir OPEX marketing (5%)' },
    { cmd: null, out: '✓ Renegociar arrendamiento' },
    { cmd: null, out: '→ Impacto: +S/ 2,750 / mes' },
  ],
  [
    { cmd: 'forecast --quarters 4', out: null },
    { cmd: null, out: '→ Aplicando rolling adjust...' },
    { cmd: null, out: '→ Q3: S/ 185,200 (+12%)' },
    { cmd: null, out: '→ Q4: S/ 201,840 (+9%)' },
    { cmd: null, out: '→ Q1 27: S/ 224,500 (+11%)' },
    { cmd: null, out: '✓ Forecast saved → reports/Q3-Q1.csv' },
  ],
  [
    { cmd: 'simulate ingresos +15% opex -5%', out: null },
    { cmd: null, out: '→ Calculando impacto...' },
    { cmd: null, out: '→ EBITDA nuevo: S/ 36,900 (+29.7%)' },
    { cmd: null, out: '→ Margen: 58.2% (+7.3 pts)' },
    { cmd: null, out: '→ Break-even: 3.2 meses antes' },
  ],
];

export function HeroTerminal() {
  const [sessionIdx, setSessionIdx] = useState(0);
  const [lineIdx, setLineIdx] = useState(0);
  const [chars, setChars] = useState(0);
  const [phase, setPhase] = useState<'typing' | 'output' | 'pausing'>('typing');

  useEffect(() => {
    const session = SESSIONS[sessionIdx];
    const line = session[lineIdx];
    const text = line.cmd ?? line.out ?? '';

    if (phase === 'typing') {
      if (chars < text.length) {
        const id = setTimeout(() => setChars((c) => c + 1), line.cmd ? 45 : 18);
        return () => clearTimeout(id);
      }
      const id = setTimeout(() => setPhase('output'), 350);
      return () => clearTimeout(id);
    }
    if (phase === 'output') {
      if (lineIdx < session.length - 1) {
        setLineIdx((i) => i + 1);
        setChars(0);
        setPhase('typing');
      } else {
        setPhase('pausing');
      }
      return;
    }
    // pausing → restart with new session
    const id = setTimeout(() => {
      setSessionIdx((s) => (s + 1) % SESSIONS.length);
      setLineIdx(0);
      setChars(0);
      setPhase('typing');
    }, 2400);
    return () => clearTimeout(id);
  }, [chars, lineIdx, sessionIdx, phase]);

  const session = SESSIONS[sessionIdx];
  const visible = session.slice(0, lineIdx + 1);

  return (
    <section className="relative overflow-hidden px-6 md:px-12 lg:px-20 pt-10 md:pt-16 pb-16" style={{ background: '#0a0a0a' }}>
      <div className="relative mx-auto max-w-[1400px] grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-16 items-center">
        {/* Left */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-7" style={{ border: '1px solid rgba(200,161,90,.3)', background: 'rgba(200,161,90,.06)' }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#c8a15a' }} />
            <span className="text-[10px] font-bold uppercase tracking-[3px]" style={{ color: '#c8a15a' }}>{H.badge}</span>
          </div>

          <h1 className="text-[clamp(40px,5.5vw,68px)] font-extrabold leading-[1.02] tracking-tight mb-7" style={{ color: '#f5f0e8' }}>
            {H.titleLine1}
            <br />
            <span style={{ color: '#c8a15a' }}>{H.titleAccent}</span>
            <br />
            {H.titleLine3}
          </h1>

          <p className="max-w-xl text-[15px] leading-relaxed mb-9" style={{ color: '#a8a19a' }}>
            {H.description}
          </p>

          <div className="flex items-center gap-5 mb-12">
            <a href="/auth/register" className="inline-flex items-center gap-2 rounded-md px-6 py-3.5 text-[13px] font-semibold uppercase tracking-wider" style={{ background: 'linear-gradient(135deg, #d4b577, #c8a15a)', color: '#0a0a0a', boxShadow: '0 10px 30px -10px rgba(200,161,90,.5)' }}>
              {H.ctaPrimary}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
            <a href="#casos" className="text-[13px]" style={{ color: '#a8a19a' }}>{H.ctaSecondary} ›</a>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {H.stats.map((s) => (
              <div key={s.label}>
                <div className="text-[22px] md:text-[26px] font-extrabold tracking-tight" style={{ color: '#f5f0e8' }}>{s.value}</div>
                <div className="text-[9px] font-semibold uppercase tracking-[2px] mt-1" style={{ color: '#6b6660' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Terminal */}
        <div className="relative">
          {/* Glow */}
          <div className="absolute -inset-6 rounded-3xl blur-3xl pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(200,161,90,.15), transparent 70%)' }} />

          <div className="relative rounded-lg overflow-hidden" style={{
            background: 'linear-gradient(180deg, #1a1715 0%, #0d0b0a 100%)',
            border: '1px solid rgba(200,161,90,.25)',
            boxShadow: '0 40px 80px -20px rgba(0,0,0,.95), inset 0 1px 0 rgba(200,161,90,.1)',
          }}>
            {/* Mac header */}
            <div className="flex items-center gap-2 px-4 py-3" style={{ background: 'linear-gradient(180deg, #1e1b19, #16130f)', borderBottom: '1px solid rgba(200,161,90,.15)' }}>
              <span className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
                <span className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
                <span className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
              </span>
              <span className="flex-1 text-center text-[11px] font-mono" style={{ color: '#a8a19a' }}>
                capital-cfo — zsh — 80×24
              </span>
              <span className="text-[9px] font-mono" style={{ color: '#6b6660' }}>
                · {sessionIdx + 1}/{SESSIONS.length}
              </span>
            </div>

            {/* Terminal body */}
            <div className="p-5 md:p-6 font-mono text-[12px] md:text-[13px] leading-[1.75]" style={{ minHeight: '380px', background: '#0a0908' }}>
              <div className="mb-3" style={{ color: '#6b6660' }}>
                <span style={{ color: '#a8c47a' }}>giuseppe@capital-cfo</span>
                <span style={{ color: '#6b6660' }}>:</span>
                <span style={{ color: '#c8a15a' }}>~/Q2_2026</span>
                <span style={{ color: '#6b6660' }}> % </span>
                <span className="italic" style={{ color: '#6b6660' }}>cfo shell v2.0 ready</span>
              </div>

              {visible.map((line, i) => {
                const isLast = i === visible.length - 1;
                const text = line.cmd ?? line.out ?? '';
                const display = isLast && phase === 'typing' ? text.slice(0, chars) : text;
                const isCmd = Boolean(line.cmd);

                return (
                  <div key={`${sessionIdx}-${i}`} className="flex gap-2 mb-1.5">
                    {isCmd ? (
                      <>
                        <span style={{ color: '#c8a15a' }}>▸</span>
                        <span style={{ color: '#f5f0e8' }}>{display}</span>
                      </>
                    ) : (
                      <span style={{ color: display.includes('✓') ? '#a8c47a' : display.includes('→') ? '#c8a15a' : '#a8a19a' }}>
                        {display}
                      </span>
                    )}
                    {isLast && phase === 'typing' && (
                      <span className="inline-block w-2 h-3.5 -ml-0.5" style={{ background: '#c8a15a', animation: 'blink 1s infinite' }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
      `}</style>
    </section>
  );
}
