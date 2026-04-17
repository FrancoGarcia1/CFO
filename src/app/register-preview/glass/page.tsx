'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { submitRegister, type RegisterForm } from '@/lib/register-submit';

export default function RegisterGlassPage() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterForm>({ nombre: '', email: '', password: '', telefono: '', empresa: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pulseTick, setPulseTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setPulseTick((t) => t + 1), 1500);
    return () => clearInterval(id);
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await submitRegister(form);
    if (!res.success) {
      setError(res.error || 'Error al crear cuenta');
      setLoading(false);
      return;
    }
    router.push('/dashboard');
  }

  // Mock numbers that change per pulse
  const ebitda = 28000 + (pulseTick % 5) * 150;
  const score = 75 + (pulseTick % 4);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#060606' }}>
      {/* ═══ LIVE DASHBOARD BACKGROUND ═══ */}
      <div className="absolute inset-0 p-6 md:p-10 grid grid-cols-12 grid-rows-6 gap-4">
        {/* Panel 1 — Large chart */}
        <BgPanel className="col-span-7 row-span-3">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-[8px] font-mono font-bold uppercase tracking-[2px]" style={{ color: '#6b6660' }}>INGRESOS · MTD</div>
              <div className="text-[32px] font-mono font-bold tabular-nums mt-1" style={{ color: '#c8a15a' }}>S/ 55,000</div>
            </div>
            <span className="text-[10px] font-mono tabular-nums px-2 py-0.5 rounded" style={{ color: '#a8c47a', background: 'rgba(168,196,122,.1)', border: '1px solid rgba(168,196,122,.3)' }}>▲ +24%</span>
          </div>
          <svg viewBox="0 0 300 70" className="w-full" preserveAspectRatio="none" style={{ height: 90 }}>
            <defs>
              <linearGradient id="bgArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c8a15a" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#c8a15a" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0,55 L30,50 L60,48 L90,40 L120,42 L150,30 L180,32 L210,22 L240,18 L270,12 L300,8 L300,70 L0,70 Z" fill="url(#bgArea)"/>
            <path d="M0,55 L30,50 L60,48 L90,40 L120,42 L150,30 L180,32 L210,22 L240,18 L270,12 L300,8" fill="none" stroke="#c8a15a" strokeWidth="1.6" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 3px rgba(200,161,90,.6))' }}/>
          </svg>
        </BgPanel>

        {/* Panel 2 — Health ring */}
        <BgPanel className="col-span-5 row-span-3">
          <div className="h-full flex items-center gap-4">
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(168,196,122,.15)" strokeWidth="4"/>
              <circle cx="50" cy="50" r="40" fill="none" stroke="#a8c47a" strokeWidth="4" strokeLinecap="round" strokeDasharray="251.3" strokeDashoffset={251.3 * (1 - score / 100)} transform="rotate(-90 50 50)" style={{ transition: 'stroke-dashoffset .4s', filter: 'drop-shadow(0 0 6px rgba(168,196,122,.5))' }}/>
              <text x="50" y="53" textAnchor="middle" fontSize="22" fontWeight="700" fill="#a8c47a" fontFamily="JetBrains Mono, monospace">{score}</text>
              <text x="50" y="68" textAnchor="middle" fontSize="8" fontWeight="600" letterSpacing="2" fill="#a8c47a">SALUD</text>
            </svg>
            <div className="flex-1">
              <div className="text-[8px] font-mono font-bold uppercase tracking-[2px] mb-1" style={{ color: '#6b6660' }}>HEALTH SCORE</div>
              <div className="text-[14px] font-bold" style={{ color: '#a8c47a' }}>Saludable</div>
              <div className="text-[10px] mt-1" style={{ color: '#a8a19a' }}>Todos los KPIs en rango</div>
            </div>
          </div>
        </BgPanel>

        {/* Panel 3 — EBITDA */}
        <BgPanel className="col-span-4 row-span-3">
          <div className="text-[8px] font-mono font-bold uppercase tracking-[2px] mb-2" style={{ color: '#6b6660' }}>EBITDA · LIVE</div>
          <div className="text-[28px] font-mono font-bold tabular-nums" style={{ color: '#c8a15a' }}>
            S/ {ebitda.toLocaleString()}
          </div>
          <div className="text-[10px] font-mono mt-1" style={{ color: '#a8c47a' }}>▲ Margen 50.9%</div>
          <div className="mt-4 h-1.5 rounded-full" style={{ background: 'rgba(200,161,90,.15)' }}>
            <div className="h-full rounded-full" style={{
              width: '68%',
              background: 'linear-gradient(90deg, #d4b577, #c8a15a)',
              boxShadow: '0 0 8px rgba(200,161,90,.5)',
            }}/>
          </div>
        </BgPanel>

        {/* Panel 4 — Transaction feed */}
        <BgPanel className="col-span-5 row-span-3">
          <div className="flex items-center gap-2 mb-3">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full animate-ping" style={{ background: '#a8c47a', opacity: 0.6 }}/>
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: '#a8c47a' }}/>
            </span>
            <span className="text-[9px] font-mono font-bold uppercase tracking-[2px]" style={{ color: '#a8c47a' }}>LIVE · FEED</span>
          </div>
          {[
            { t: '14:32', d: 'Consultoría Abril', a: '+S/ 15,000', c: '#a8c47a' },
            { t: '14:33', d: 'Freelancer diseño', a: '-S/ 4,500', c: '#ef4444' },
            { t: '14:34', d: 'Licencia Software', a: '+S/ 8,000', c: '#a8c47a' },
          ].map((tx, i) => (
            <div key={i} className="flex items-center gap-2 text-[10px] font-mono py-1.5" style={{ borderBottom: '1px solid rgba(200,161,90,.08)' }}>
              <span style={{ color: '#6b6660' }}>{tx.t}</span>
              <span className="flex-1" style={{ color: '#a8a19a' }}>{tx.d}</span>
              <span className="font-bold tabular-nums" style={{ color: tx.c }}>{tx.a}</span>
            </div>
          ))}
        </BgPanel>

        {/* Panel 5 — Forecast */}
        <BgPanel className="col-span-3 row-span-3">
          <div className="text-[8px] font-mono font-bold uppercase tracking-[2px] mb-2" style={{ color: '#6b6660' }}>FORECAST Q3</div>
          <div className="text-[22px] font-mono font-bold tabular-nums" style={{ color: '#f5f0e8' }}>+12%</div>
          <div className="flex items-end gap-1 mt-3 h-10">
            {[40, 55, 45, 65, 75, 85, 95].map((h, i) => (
              <div key={i} className="flex-1 rounded-sm" style={{
                background: i >= 4 ? '#c8a15a' : 'rgba(200,161,90,.35)',
                height: `${h}%`,
              }}/>
            ))}
          </div>
        </BgPanel>
      </div>

      {/* Blur overlay to ensure form readability */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center, rgba(6,6,6,.7), rgba(6,6,6,.92) 60%)',
      }}/>

      {/* ═══ GLASS FORM ═══ */}
      <div className="relative min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-[460px]">
          <Link href="/" className="flex items-center gap-2 mb-8" style={{ color: '#f5f0e8' }}>
            <div className="w-7 h-7 flex items-center justify-center rounded-md" style={{ background: 'linear-gradient(135deg, #d4b577, #c8a15a)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="3"><polyline points="3 17 9 11 13 15 21 7"/></svg>
            </div>
            <span className="text-[14px] font-bold tracking-tight">
              Capital<span style={{ color: '#c8a15a' }}>CFO</span>
            </span>
          </Link>

          <div className="relative rounded-2xl p-7 md:p-9 overflow-hidden" style={{
            background: 'linear-gradient(135deg, rgba(13,11,10,.55), rgba(6,6,6,.45))',
            backdropFilter: 'blur(28px) saturate(140%)',
            WebkitBackdropFilter: 'blur(28px) saturate(140%)',
            border: '1px solid rgba(200,161,90,.3)',
            boxShadow: `
              0 40px 100px -20px rgba(0,0,0,.8),
              0 0 80px rgba(200,161,90,.08),
              inset 0 1px 0 rgba(255,255,255,.08),
              inset 0 0 0 1px rgba(200,161,90,.08)
            `,
          }}>
            {/* Top gold hairline */}
            <div className="absolute top-0 left-0 right-0 h-px" style={{
              background: 'linear-gradient(90deg, transparent, #c8a15a, transparent)',
            }}/>

            <div className="flex items-center gap-2 mb-4">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 rounded-full animate-ping" style={{ background: '#c8a15a', opacity: 0.5 }}/>
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: '#c8a15a' }}/>
              </span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-[3px]" style={{ color: '#c8a15a' }}>
                Dashboard en preparación
              </span>
            </div>

            <h1 className="text-[28px] md:text-[32px] font-extrabold leading-tight tracking-tight mb-3" style={{ color: '#f5f0e8' }}>
              Tu cuenta <span style={{ color: '#c8a15a' }}>está a un paso.</span>
            </h1>
            <p className="text-[13px] mb-7" style={{ color: '#a8a19a' }}>
              Detrás de esta ventana ya corre tu dashboard. Solo falta que te identifiques.
            </p>

            <form onSubmit={onSubmit} className="space-y-4">
              <GlassField label="Nombre completo" name="nombre" type="text" placeholder="Juan García" value={form.nombre} onChange={(v) => setForm({ ...form, nombre: v })} />
              <GlassField label="Correo electrónico" name="email" type="email" placeholder="juan@empresa.com" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
              <div className="grid grid-cols-2 gap-3">
                <GlassField label="Contraseña" name="password" type="password" placeholder="••••••" value={form.password} onChange={(v) => setForm({ ...form, password: v })} />
                <GlassField label="WhatsApp" name="telefono" type="tel" placeholder="+51 999..." value={form.telefono} onChange={(v) => setForm({ ...form, telefono: v })} />
              </div>
              <GlassField label="Empresa (opcional)" name="empresa" type="text" placeholder="Mi Empresa SAC" value={form.empresa} onChange={(v) => setForm({ ...form, empresa: v })} />

              {error && (
                <p className="text-[12px]" style={{ color: '#ef4444' }}>⚠ {error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-md px-6 py-3.5 text-[13px] font-bold uppercase tracking-wider disabled:opacity-50 mt-5"
                style={{
                  background: 'linear-gradient(135deg, #d4b577, #c8a15a)',
                  color: '#0a0a0a',
                  boxShadow: '0 16px 40px -10px rgba(200,161,90,.6)',
                }}
              >
                {loading ? 'Entrando al dashboard...' : 'Entrar a mi dashboard'}
                {!loading && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>}
              </button>

              <p className="text-center text-[11px] pt-2" style={{ color: '#6b6660' }}>
                ¿Ya tienes cuenta?{' '}
                <Link href="/auth/login" className="font-semibold" style={{ color: '#c8a15a' }}>Inicia sesión</Link>
              </p>
            </form>
          </div>

          <p className="text-center text-[10px] mt-6" style={{ color: '#6b6660' }}>
            Prueba gratuita · Sin tarjeta de crédito · Acceso inmediato
          </p>
        </div>
      </div>
    </div>
  );
}

function BgPanel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={className} style={{
      background: 'linear-gradient(135deg, rgba(19,17,16,.6), rgba(13,11,10,.4))',
      border: '1px solid rgba(200,161,90,.12)',
      borderRadius: 12,
      padding: 16,
    }}>
      {children}
    </div>
  );
}

function GlassField({ label, name, type, placeholder, value, onChange }: {
  label: string; name: string; type: string; placeholder: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-[9px] font-bold uppercase tracking-[2px] mb-1.5" style={{ color: '#a8a19a' }}>
        {label}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3.5 py-2.5 text-[13px] rounded-md outline-none transition-all"
        style={{
          background: 'rgba(10,10,10,.4)',
          border: '1px solid rgba(200,161,90,.2)',
          color: '#f5f0e8',
          backdropFilter: 'blur(8px)',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#c8a15a';
          e.target.style.boxShadow = '0 0 0 3px rgba(200,161,90,.1)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'rgba(200,161,90,.2)';
          e.target.style.boxShadow = 'none';
        }}
      />
    </div>
  );
}
