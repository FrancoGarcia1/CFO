'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { submitRegister, type RegisterForm } from '@/lib/register-submit';

const FOLIO = `2026·${Math.floor(Math.random() * 999).toString().padStart(3, '0')}·CFO`;

export default function RegisterFichaPage() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterForm>({ nombre: '', email: '', password: '', telefono: '', empresa: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const today = new Date();
  const dateStr = today.toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' });

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

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#080606' }}>
      {/* Paper grain */}
      <div className="fixed inset-0 pointer-events-none opacity-[.04]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }}/>

      {/* Ambient spot */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center, rgba(200,161,90,.06), transparent 60%)',
      }}/>

      <div className="relative w-full max-w-[620px]">
        {/* Dossier frame */}
        <div className="relative" style={{
          background: 'linear-gradient(180deg, #0d0b0a 0%, #080606 100%)',
          border: '1px solid rgba(200,161,90,.25)',
          boxShadow: '0 60px 120px -30px rgba(0,0,0,.95), inset 0 1px 0 rgba(200,161,90,.08)',
        }}>
          {/* Gold hairline top */}
          <div className="absolute top-0 left-0 right-0 h-px" style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(200,161,90,.7) 20%, #c8a15a 50%, rgba(200,161,90,.7) 80%, transparent 100%)',
          }}/>

          {/* Letterhead */}
          <div className="flex items-center justify-between px-8 md:px-12 pt-7 pb-4" style={{ borderBottom: '1px solid rgba(200,161,90,.15)' }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 flex items-center justify-center" style={{
                background: 'linear-gradient(135deg, #d4b577, #b0893f)',
                boxShadow: '0 2px 8px rgba(200,161,90,.3)',
              }}>
                <span className="text-[12px] font-bold" style={{ color: '#0a0a0a', fontFamily: 'Fraunces, Georgia, serif' }}>
                  CC
                </span>
              </div>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[3px]" style={{ color: '#c8a15a' }}>
                  Capital CFO
                </div>
                <div className="text-[9px] italic" style={{ color: '#6b6660', fontFamily: 'Fraunces, Georgia, serif' }}>
                  Dirección financiera virtual
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[9px] font-mono" style={{ color: '#6b6660' }}>FOLIO · {FOLIO}</div>
              <div className="text-[9px] font-mono" style={{ color: '#6b6660' }}>EMISIÓN · {dateStr}</div>
            </div>
          </div>

          {/* Body */}
          <div className="px-8 md:px-12 py-10 relative">
            {/* Confidential stamp */}
            <div className="absolute top-10 right-10 text-[9px] font-mono uppercase tracking-[2px] rotate-[-8deg] px-3 py-1 opacity-40" style={{
              color: '#c8a15a',
              border: '2px solid #c8a15a',
            }}>
              Confidencial
            </div>

            <p className="text-[9px] font-semibold uppercase tracking-[4px] mb-3" style={{ color: '#c8a15a' }}>
              Formulario de apertura · Ref-APT
            </p>
            <h1 className="text-[32px] md:text-[40px] font-normal leading-[1.02] mb-3" style={{
              fontFamily: 'Fraunces, Georgia, serif',
              color: '#f5f0e8',
              letterSpacing: '-0.02em',
            }}>
              Solicitud de acceso
              <span className="italic" style={{ color: '#c8a15a' }}> a membresía</span>
              <span style={{ color: '#c8a15a' }}>.</span>
            </h1>
            <p className="text-[13px] italic max-w-md mb-9" style={{
              color: '#a8a19a',
              fontFamily: 'Fraunces, Georgia, serif',
            }}>
              Complete los campos a continuación para activar su cuenta en
              Capital CFO. La información provista se tratará bajo estricta
              confidencialidad.
            </p>

            {/* Divider ornament */}
            <div className="flex items-center gap-3 mb-9">
              <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(200,161,90,.3), transparent)' }}/>
              <span className="text-[14px]" style={{ color: '#c8a15a', fontFamily: 'Fraunces, Georgia, serif' }}>§</span>
              <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(200,161,90,.3), transparent)' }}/>
            </div>

            {/* Form */}
            <form onSubmit={onSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
                <FichaField label="I. Nombre completo" name="nombre" type="text" placeholder="Juan García Mendoza" value={form.nombre} onChange={(v) => setForm({ ...form, nombre: v })} />
                <FichaField label="II. Correo institucional" name="email" type="email" placeholder="juan@empresa.com" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
                <FichaField label="III. Contraseña de acceso" name="password" type="password" placeholder="••••••" value={form.password} onChange={(v) => setForm({ ...form, password: v })} />
                <FichaField label="IV. Teléfono · WhatsApp" name="telefono" type="tel" placeholder="+51 999 999 999" value={form.telefono} onChange={(v) => setForm({ ...form, telefono: v })} />
                <div className="md:col-span-2">
                  <FichaField label="V. Razón social (opcional)" name="empresa" type="text" placeholder="Mi Empresa SAC" value={form.empresa} onChange={(v) => setForm({ ...form, empresa: v })} />
                </div>
              </div>

              {error && (
                <p className="text-[12px] mb-5 italic" style={{ color: '#ef4444', fontFamily: 'Fraunces, Georgia, serif' }}>
                  ⚠ {error}
                </p>
              )}

              {/* Signature area */}
              <div className="pt-6 mt-8" style={{ borderTop: '1px solid rgba(200,161,90,.15)' }}>
                <div className="flex items-end justify-between gap-6 flex-wrap">
                  <div>
                    <p className="text-[9px] uppercase tracking-[2px] mb-2" style={{ color: '#6b6660' }}>
                      Firma del solicitante
                    </p>
                    <div className="text-[24px] italic" style={{
                      color: '#c8a15a',
                      fontFamily: 'Fraunces, Georgia, serif',
                      minWidth: 200,
                      borderBottom: '1px solid rgba(200,161,90,.3)',
                      paddingBottom: 4,
                    }}>
                      {form.nombre || <span style={{ color: '#3a3a3a', fontStyle: 'italic' }}>— firma —</span>}
                    </div>
                    <p className="text-[9px] italic mt-1" style={{ color: '#6b6660', fontFamily: 'Fraunces, Georgia, serif' }}>
                      {dateStr}
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[2px] disabled:opacity-50"
                    style={{
                      background: 'linear-gradient(135deg, #d4b577, #c8a15a)',
                      color: '#0a0a0a',
                      boxShadow: '0 10px 30px -10px rgba(200,161,90,.5)',
                    }}
                  >
                    {loading ? 'Procesando...' : 'Firmar y activar cuenta'}
                    {!loading && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Footer legal */}
          <div className="px-8 md:px-12 py-4 text-[9px] font-mono uppercase tracking-[2px] flex items-center justify-between flex-wrap gap-2" style={{
            borderTop: '1px solid rgba(200,161,90,.12)',
            color: '#6b6660',
          }}>
            <span>Capital CFO · MMXXVI</span>
            <span>Documento protegido · Uso restringido</span>
            <Link href="/auth/login" className="hover:text-[color:#c8a15a]" style={{ color: '#c8a15a' }}>
              ¿Ya soy miembro? →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function FichaField({ label, name, type, placeholder, value, onChange }: {
  label: string; name: string; type: string; placeholder: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-[10px] font-semibold uppercase tracking-[2px] mb-2" style={{
        color: '#c8a15a',
        fontFamily: 'Fraunces, Georgia, serif',
        fontStyle: 'italic',
      }}>
        {label}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full py-2 text-[15px] outline-none transition-all"
        style={{
          background: 'transparent',
          borderBottom: '1px solid rgba(200,161,90,.3)',
          color: '#f5f0e8',
          fontFamily: 'Fraunces, Georgia, serif',
        }}
        onFocus={(e) => e.target.style.borderBottomColor = '#c8a15a'}
        onBlur={(e) => e.target.style.borderBottomColor = 'rgba(200,161,90,.3)'}
      />
    </div>
  );
}
