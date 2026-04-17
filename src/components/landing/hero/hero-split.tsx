'use client';
import { HERO_CONTENT as H } from './data';

export function HeroSplit() {
  return (
    <section className="relative overflow-hidden" style={{ background: '#0a0a0a', minHeight: '720px' }}>
      {/* Diagonal gold divider */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'linear-gradient(110deg, #0a0a0a 0%, #0a0a0a 52%, transparent 52%, transparent 100%)',
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'linear-gradient(110deg, transparent 48%, transparent 52%, #0d0b09 52%, #0d0b09 100%)',
      }} />

      {/* Metallic gold divider line */}
      <div className="absolute top-0 bottom-0 w-1 pointer-events-none overflow-hidden" style={{
        left: 'calc(52% - 2px)',
        transform: 'rotate(20deg) scaleY(1.8)',
        transformOrigin: 'center',
      }}>
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, transparent 0%, #c8a15a 30%, #f5e2b8 50%, #c8a15a 70%, transparent 100%)',
          boxShadow: '0 0 24px rgba(200,161,90,.8), 0 0 60px rgba(200,161,90,.3)',
        }} />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, transparent, rgba(255,255,255,.8), transparent)',
          animation: 'dividerSheen 4s ease-in-out infinite',
        }} />
      </div>

      {/* Right side texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[.04]" style={{
        backgroundImage: 'linear-gradient(rgba(200,161,90,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(200,161,90,.6) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        clipPath: 'polygon(52% 0, 100% 0, 100% 100%, 58% 100%)',
      }} />

      {/* Orbital glow right */}
      <div className="absolute top-[30%] right-[10%] w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none" style={{
        background: 'radial-gradient(circle, rgba(200,161,90,.2), transparent 60%)',
      }} />

      <div className="relative grid grid-cols-1 lg:grid-cols-2 min-h-[720px]">
        {/* Left — Text */}
        <div className="flex items-center px-6 md:px-12 lg:pl-20 lg:pr-32 py-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-8" style={{ border: '1px solid rgba(200,161,90,.3)', background: 'rgba(200,161,90,.06)' }}>
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 rounded-full animate-ping" style={{ background: '#c8a15a', opacity: 0.5 }} />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: '#c8a15a' }} />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[3px]" style={{ color: '#c8a15a' }}>{H.badge}</span>
            </div>

            <h1 className="text-[clamp(40px,5.5vw,64px)] font-extrabold leading-[1.02] tracking-tight mb-8" style={{ color: '#f5f0e8' }}>
              {H.titleLine1}
              <br />
              <span style={{ color: '#c8a15a' }}>{H.titleAccent}</span>
              <br />
              {H.titleLine3}
            </h1>

            <p className="max-w-lg text-[15px] leading-relaxed mb-10" style={{ color: '#a8a19a' }}>
              {H.description}
            </p>

            <div className="flex items-center gap-5 mb-14">
              <a href="/auth/register" className="group inline-flex items-center gap-2 rounded-md px-7 py-3.5 text-[13px] font-semibold uppercase tracking-wider" style={{
                background: 'linear-gradient(135deg, #d4b577, #c8a15a)',
                color: '#0a0a0a',
                boxShadow: '0 10px 30px -10px rgba(200,161,90,.5)',
              }}>
                {H.ctaPrimary}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-1 transition-transform"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </a>
              <a href="#casos" className="text-[13px]" style={{ color: '#a8a19a' }}>{H.ctaSecondary} ›</a>
            </div>

            <div className="grid grid-cols-4 gap-4 max-w-lg">
              {H.stats.map((s) => (
                <div key={s.label}>
                  <div className="text-[22px] md:text-[24px] font-extrabold tracking-tight" style={{ color: '#f5f0e8' }}>{s.value}</div>
                  <div className="text-[9px] font-semibold uppercase tracking-[2px] mt-1" style={{ color: '#6b6660' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Dashboard snapshot */}
        <div className="relative flex items-center justify-center px-6 md:px-12 lg:px-20 py-12 lg:py-0" style={{ paddingLeft: '12%' }}>
          <div className="relative w-full max-w-[450px]">
            {/* Big number */}
            <div className="relative mb-5 text-center">
              <p className="text-[10px] font-mono font-semibold uppercase tracking-[3px] mb-2" style={{ color: '#c8a15a' }}>
                EBITDA promedio clientes
              </p>
              <div className="text-[clamp(60px,8vw,112px)] font-extrabold tracking-tighter leading-none" style={{
                color: 'transparent',
                backgroundImage: 'linear-gradient(180deg, #f5e2b8 0%, #c8a15a 50%, #8c6b33 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                filter: 'drop-shadow(0 4px 20px rgba(200,161,90,.4))',
              }}>
                26.4%
              </div>
              <div className="text-[11px] font-mono mt-2" style={{ color: '#a8a19a' }}>
                <span style={{ color: '#a8c47a' }}>▲</span> vs. línea base del sector
              </div>
            </div>

            {/* Chart card */}
            <div className="p-5 rounded-xl" style={{
              background: 'linear-gradient(135deg, rgba(19,17,16,.95), rgba(13,11,10,.85))',
              border: '1px solid rgba(200,161,90,.25)',
              boxShadow: '0 40px 80px -20px rgba(0,0,0,.9), 0 0 60px rgba(200,161,90,.08)',
              backdropFilter: 'blur(14px)',
            }}>
              <div className="flex justify-between items-baseline mb-3">
                <p className="text-[9px] font-mono font-bold uppercase tracking-[2px]" style={{ color: '#c8a15a' }}>
                  EBITDA · 12 meses
                </p>
                <p className="text-[9px] font-mono" style={{ color: '#6b6660' }}>2025 – 2026</p>
              </div>

              <div className="flex items-end gap-1.5 h-28 mb-4">
                {[30, 42, 38, 55, 48, 62, 70, 65, 78, 85, 92, 95].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm relative"
                    style={{
                      background: i >= 8
                        ? 'linear-gradient(180deg, #d4b577, #c8a15a)'
                        : i >= 5
                          ? 'rgba(200,161,90,.45)'
                          : 'rgba(200,161,90,.22)',
                      height: `${h}%`,
                      animation: `barGrow .8s ${0.8 + i * 0.05}s cubic-bezier(.22,1,.36,1) both`,
                      transformOrigin: 'bottom',
                      boxShadow: i >= 8 ? '0 0 12px rgba(200,161,90,.5)' : 'none',
                    }}
                  >
                    {i === 11 && (
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-mono font-bold tabular-nums px-1.5 py-0.5 rounded" style={{
                        background: '#c8a15a',
                        color: '#0a0a0a',
                      }}>
                        NOW
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid rgba(200,161,90,.12)' }}>
                <div>
                  <div className="text-[8px] font-mono uppercase tracking-[1.5px]" style={{ color: '#6b6660' }}>INICIO</div>
                  <div className="text-[13px] font-mono font-bold tabular-nums" style={{ color: '#a8a19a' }}>12.3%</div>
                </div>
                <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
                  <path d="M0 6 L14 6 M10 2 L14 6 L10 10" stroke="#c8a15a" strokeWidth="1.5" />
                </svg>
                <div className="text-right">
                  <div className="text-[8px] font-mono uppercase tracking-[1.5px]" style={{ color: '#6b6660' }}>ACTUAL</div>
                  <div className="text-[13px] font-mono font-bold tabular-nums" style={{ color: '#c8a15a' }}>26.4%</div>
                </div>
              </div>
            </div>

            {/* Badge below */}
            <div className="absolute -bottom-4 -right-4 px-4 py-2.5 rounded-lg font-mono" style={{
              background: 'linear-gradient(135deg, #d4b577, #c8a15a)',
              color: '#0a0a0a',
              boxShadow: '0 10px 24px -8px rgba(200,161,90,.5)',
            }}>
              <div className="text-[8px] font-bold uppercase tracking-[2px] opacity-70">Growth</div>
              <div className="text-[15px] font-bold tabular-nums">+114%</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes dividerSheen { 0%,100% { transform: translateY(-100%); } 50% { transform: translateY(100%); } }
        @keyframes barGrow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
      `}</style>
    </section>
  );
}
