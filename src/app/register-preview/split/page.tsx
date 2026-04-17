'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { submitRegister, type RegisterForm } from '@/lib/register-submit';

export default function RegisterSplitPage() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterForm>({ nombre: '', email: '', password: '', telefono: '', empresa: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

  const displayName = form.nombre || 'tu nombre';
  const firstName = form.nombre.split(' ')[0] || 'Usuario';
  const initials = form.nombre.split(' ').map((p) => p[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || '?';
  const displayEmpresa = form.empresa || 'Mi empresa';
  const domain = form.email.split('@')[1] || '';

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[1fr_1.1fr]" style={{ background: '#0a0a0a' }}>
      {/* ═══ LEFT — FORM ═══ */}
      <div className="relative flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-[440px]">
          <Link href="/" className="flex items-center gap-2 mb-10" style={{ color: '#f5f0e8' }}>
            <div className="w-7 h-7 flex items-center justify-center rounded-md" style={{ background: 'linear-gradient(135deg, #d4b577, #c8a15a)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="3"><polyline points="3 17 9 11 13 15 21 7"/></svg>
            </div>
            <span className="text-[14px] font-bold tracking-tight">
              Capital<span style={{ color: '#c8a15a' }}>CFO</span>
            </span>
          </Link>

          <p className="text-[10px] font-mono font-bold uppercase tracking-[3px] mb-3" style={{ color: '#c8a15a' }}>
            Prueba gratuita · 7 días
          </p>
          <h1 className="text-[36px] md:text-[42px] font-extrabold leading-[1.05] tracking-tight mb-4" style={{ color: '#f5f0e8' }}>
            Activa tu{' '}
            <span style={{ color: '#c8a15a' }}>CFO virtual.</span>
          </h1>
          <p className="text-[14px] mb-8" style={{ color: '#a8a19a' }}>
            Mientras completas el formulario, tu dashboard se va preparando a la derecha →
          </p>

          <form onSubmit={onSubmit} className="space-y-5">
            <Field label="Nombre completo" name="nombre" type="text" placeholder="Juan García" value={form.nombre} onChange={(v) => setForm({ ...form, nombre: v })} />
            <Field label="Correo electrónico" name="email" type="email" placeholder="juan@empresa.com" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
            <Field label="Contraseña" name="password" type="password" placeholder="Mínimo 6 caracteres" value={form.password} onChange={(v) => setForm({ ...form, password: v })} />
            <Field label="Teléfono / WhatsApp" name="telefono" type="tel" placeholder="+51 999 999 999" value={form.telefono} onChange={(v) => setForm({ ...form, telefono: v })} />
            <Field label="Empresa (opcional)" name="empresa" type="text" placeholder="Mi Empresa SAC" value={form.empresa} onChange={(v) => setForm({ ...form, empresa: v })} />

            {error && <p className="text-[12px]" style={{ color: '#ef4444' }}>⚠ {error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-md px-6 py-3.5 text-[13px] font-bold uppercase tracking-wider disabled:opacity-50 mt-8"
              style={{
                background: 'linear-gradient(135deg, #d4b577, #c8a15a)',
                color: '#0a0a0a',
                boxShadow: '0 10px 30px -10px rgba(200,161,90,.5)',
              }}
            >
              {loading ? 'Creando cuenta...' : 'Activar mi dashboard'}
              {!loading && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>}
            </button>

            <p className="text-center text-[11px] mt-2" style={{ color: '#6b6660' }}>
              ¿Ya tienes cuenta?{' '}
              <Link href="/auth/login" className="font-semibold" style={{ color: '#c8a15a' }}>Inicia sesión</Link>
            </p>
          </form>
        </div>
      </div>

      {/* ═══ RIGHT — LIVE PREVIEW ═══ */}
      <div className="relative hidden lg:flex items-center justify-center p-10 overflow-hidden" style={{
        background: 'radial-gradient(ellipse at top right, #1a140a 0%, #0a0a0a 70%)',
        borderLeft: '1px solid rgba(200,161,90,.15)',
      }}>
        <div className="absolute inset-0 pointer-events-none opacity-[.03]" style={{
          backgroundImage: 'linear-gradient(rgba(200,161,90,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(200,161,90,.6) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}/>

        <div className="relative w-full max-w-[560px]">
          {/* Floating "preview" label */}
          <div className="flex items-center gap-2 mb-4">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full animate-ping" style={{ background: '#a8c47a', opacity: 0.6 }}/>
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: '#a8c47a' }}/>
            </span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-[3px]" style={{ color: '#a8c47a' }}>
              Preview en vivo · Así se verá tu cuenta
            </span>
          </div>

          {/* Dashboard preview card */}
          <div className="rounded-2xl overflow-hidden" style={{
            background: 'linear-gradient(135deg, rgba(19,17,16,.95), rgba(13,11,10,.85))',
            border: '1px solid rgba(200,161,90,.25)',
            boxShadow: '0 40px 80px -20px rgba(0,0,0,.9), 0 0 60px rgba(200,161,90,.06)',
            backdropFilter: 'blur(14px)',
          }}>
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: 'linear-gradient(180deg, #1e1b19, #16130f)', borderBottom: '1px solid rgba(200,161,90,.12)' }}>
              <span className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff5f57' }}/>
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#febc2e' }}/>
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#28c840' }}/>
              </span>
              <div className="flex-1 text-center text-[10px] font-mono" style={{ color: '#a8a19a' }}>
                capitalcfo.com/dashboard
              </div>
            </div>

            {/* Top bar */}
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(200,161,90,.1)' }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center rounded-md" style={{ background: 'linear-gradient(135deg, #d4b577, #c8a15a)' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="3"><polyline points="3 17 9 11 13 15 21 7"/></svg>
                </div>
                <span className="text-[13px] font-bold">
                  Capital<span style={{ color: '#c8a15a' }}>CFO</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold" style={{
                  background: 'linear-gradient(135deg, #d4b577, #c8a15a)', color: '#0a0a0a',
                }}>
                  {initials}
                </div>
              </div>
            </div>

            {/* Welcome */}
            <div className="px-6 pt-6 pb-4">
              <p className="text-[11px] font-mono font-bold uppercase tracking-[3px]" style={{ color: '#c8a15a' }}>
                Bienvenido
              </p>
              <h2 className="text-[24px] font-extrabold tracking-tight mt-1" style={{ color: '#f5f0e8' }}>
                Hola,{' '}
                <span style={{ color: '#c8a15a' }}>
                  {firstName}
                </span>
                <span style={{ color: '#c8a15a' }}>.</span>
              </h2>
              <p className="text-[12px] mt-2" style={{ color: '#a8a19a' }}>
                <span style={{ color: '#f5f0e8' }}>{displayEmpresa}</span>
                {domain && <span style={{ color: '#6b6660' }}> · {domain}</span>}
                <span style={{ color: '#6b6660' }}> · Q2 2026</span>
              </p>
            </div>

            {/* KPI mini grid */}
            <div className="grid grid-cols-2 gap-3 px-6 pb-6">
              <MockKpi label="EBITDA" value="S/ 0" hint="Sube tu primer CSV →" accent="#c8a15a" />
              <MockKpi label="Ingresos" value="S/ 0" hint="Esperando datos..." accent="#a8c47a" />
              <MockKpi label="Health Score" value="—" hint="Listo para calcular" accent="#c8a15a" />
              <MockKpi label="Transacciones" value="0" hint="Carga tu primer archivo" accent="#9ba8d4" />
            </div>

            {/* Activity card */}
            <div className="mx-6 mb-6 p-4 rounded-lg" style={{ background: 'rgba(200,161,90,.05)', border: '1px solid rgba(200,161,90,.15)' }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #d4b577, #c8a15a)' }}>
                  <span className="text-[9px] font-bold" style={{ color: '#0a0a0a' }}>✓</span>
                </div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-[2px]" style={{ color: '#c8a15a' }}>
                  Pendiente
                </span>
              </div>
              <p className="text-[13px]" style={{ color: '#d9d4cc' }}>
                {displayName ? `Hola ${firstName}, sube tu primer CSV para ver tu Health Score` : 'Completa el formulario para empezar →'}
              </p>
            </div>
          </div>

          {/* Preview caption */}
          <p className="text-[11px] text-center mt-5 italic" style={{ color: '#6b6660' }}>
            Este es exactamente el dashboard que verás al crear tu cuenta.
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, name, type, placeholder, value, onChange }: {
  label: string; name: string; type: string; placeholder: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase tracking-[2px] mb-2" style={{ color: '#6b6660' }}>
        {label}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full py-3 text-[14px] outline-none transition-all"
        style={{
          background: 'transparent',
          borderBottom: '1px solid rgba(200,161,90,.25)',
          color: '#f5f0e8',
        }}
        onFocus={(e) => e.target.style.borderBottomColor = '#c8a15a'}
        onBlur={(e) => e.target.style.borderBottomColor = 'rgba(200,161,90,.25)'}
      />
    </div>
  );
}

function MockKpi({ label, value, hint, accent }: { label: string; value: string; hint: string; accent: string }) {
  return (
    <div className="p-3 rounded-md" style={{ background: 'rgba(200,161,90,.03)', border: `1px solid ${accent}20` }}>
      <div className="text-[9px] font-mono font-bold uppercase tracking-[2px] mb-1" style={{ color: '#6b6660' }}>{label}</div>
      <div className="text-[18px] font-mono font-bold tabular-nums" style={{ color: accent }}>{value}</div>
      <div className="text-[9px] mt-1" style={{ color: '#a8a19a' }}>{hint}</div>
    </div>
  );
}
