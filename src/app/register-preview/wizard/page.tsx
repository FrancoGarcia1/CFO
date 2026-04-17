'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { submitRegister, validateField, type RegisterForm } from '@/lib/register-submit';

const STEPS = [
  {
    title: 'Empecemos por conocerte',
    subtitle: 'Solo necesitamos lo básico para abrirte tu cuenta.',
    fields: ['nombre', 'email'] as (keyof RegisterForm)[],
    labels: { nombre: 'Nombre completo', email: 'Correo electrónico' } as Record<string, string>,
    placeholders: { nombre: 'Juan García', email: 'juan@empresa.com' } as Record<string, string>,
    types: { nombre: 'text', email: 'email' } as Record<string, string>,
  },
  {
    title: 'Asegura tu cuenta',
    subtitle: 'Necesitamos una contraseña y una forma de contactarte rápido.',
    fields: ['password', 'telefono'] as (keyof RegisterForm)[],
    labels: { password: 'Contraseña', telefono: 'Teléfono / WhatsApp' } as Record<string, string>,
    placeholders: { password: 'Mínimo 6 caracteres', telefono: '+51 999 999 999' } as Record<string, string>,
    types: { password: 'password', telefono: 'tel' } as Record<string, string>,
  },
  {
    title: 'Un último detalle',
    subtitle: 'Esto nos ayuda a personalizar tu dashboard desde el primer día.',
    fields: ['empresa'] as (keyof RegisterForm)[],
    labels: { empresa: 'Empresa (opcional)' } as Record<string, string>,
    placeholders: { empresa: 'Mi Empresa SAC' } as Record<string, string>,
    types: { empresa: 'text' } as Record<string, string>,
  },
];

export default function RegisterWizardPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<RegisterForm>({ nombre: '', email: '', password: '', telefono: '', empresa: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  function handleNext() {
    setError('');
    for (const name of current.fields) {
      const err = validateField(name, form[name]);
      if (err && name !== 'empresa') {
        setError(err);
        return;
      }
    }
    setDirection(1);
    setStep((s) => s + 1);
  }

  function handleBack() {
    setError('');
    setDirection(-1);
    setStep((s) => Math.max(0, s - 1));
  }

  async function handleFinish() {
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
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" style={{ background: '#0a0a0a' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[600px] h-[600px] rounded-full blur-[120px]" style={{
          top: '-15%', left: '-10%',
          background: 'radial-gradient(circle, rgba(200,161,90,.15), transparent 65%)',
          animation: 'float 16s ease-in-out infinite',
        }}/>
        <div className="absolute w-[500px] h-[500px] rounded-full blur-[100px]" style={{
          bottom: '-20%', right: '-10%',
          background: 'radial-gradient(circle, rgba(168,196,122,.08), transparent 65%)',
          animation: 'float 20s ease-in-out infinite reverse',
        }}/>
      </div>

      <div className="relative w-full max-w-[520px]">
        <Link href="/" className="flex items-center gap-2 mb-10" style={{ color: '#f5f0e8' }}>
          <div className="w-7 h-7 flex items-center justify-center rounded-md" style={{ background: 'linear-gradient(135deg, #d4b577, #c8a15a)' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="3"><polyline points="3 17 9 11 13 15 21 7"/></svg>
          </div>
          <span className="text-[14px] font-bold tracking-tight">
            Capital<span style={{ color: '#c8a15a' }}>CFO</span>
          </span>
        </Link>

        {/* Progress */}
        <div className="flex items-center gap-3 mb-8">
          {STEPS.map((_, i) => (
            <div key={i} className="flex-1">
              <div className="h-1 rounded-full transition-all duration-500" style={{
                background: i <= step ? 'linear-gradient(90deg, #d4b577, #c8a15a)' : 'rgba(200,161,90,.15)',
                boxShadow: i === step ? '0 0 12px rgba(200,161,90,.5)' : 'none',
              }}/>
              <div className="text-[9px] font-mono uppercase tracking-[2px] mt-2" style={{
                color: i === step ? '#c8a15a' : '#6b6660',
              }}>
                Paso {String(i + 1).padStart(2, '0')}
              </div>
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="relative overflow-hidden" style={{ minHeight: 340 }}>
          <div
            key={step}
            className="absolute inset-0"
            style={{
              animation: direction === 1
                ? 'slideInRight .5s cubic-bezier(.16,1,.3,1) both'
                : 'slideInLeft .5s cubic-bezier(.16,1,.3,1) both',
            }}
          >
            <p className="text-[10px] font-mono font-bold uppercase tracking-[3px] mb-3" style={{ color: '#c8a15a' }}>
              {isLast ? '✓ Casi listo' : `${step + 1} de ${STEPS.length}`}
            </p>
            <h1 className="text-[32px] md:text-[36px] font-extrabold leading-tight mb-3 tracking-tight" style={{ color: '#f5f0e8' }}>
              {current.title}
            </h1>
            <p className="text-[14px] mb-8 leading-relaxed" style={{ color: '#a8a19a' }}>
              {current.subtitle}
            </p>

            <div className="space-y-5">
              {current.fields.map((name) => (
                <div key={name}>
                  <label className="block text-[10px] font-bold uppercase tracking-[2px] mb-2" style={{ color: '#6b6660' }}>
                    {current.labels[name]}
                  </label>
                  <input
                    name={name}
                    type={current.types[name]}
                    placeholder={current.placeholders[name]}
                    value={form[name]}
                    onChange={(e) => setForm((f) => ({ ...f, [name]: e.target.value }))}
                    className="w-full py-3 text-[15px] outline-none transition-all"
                    autoFocus={name === current.fields[0]}
                    style={{
                      background: 'transparent',
                      borderBottom: '1px solid rgba(200,161,90,.25)',
                      color: '#f5f0e8',
                    }}
                    onFocus={(e) => e.target.style.borderBottomColor = '#c8a15a'}
                    onBlur={(e) => e.target.style.borderBottomColor = 'rgba(200,161,90,.25)'}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !isLast) { e.preventDefault(); handleNext(); } }}
                  />
                </div>
              ))}
            </div>

            {error && (
              <p className="text-[12px] mt-5" style={{ color: '#ef4444' }}>⚠ {error}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-10">
          {step > 0 ? (
            <button onClick={handleBack} className="text-[12px] uppercase tracking-[2px] font-semibold" style={{ color: '#a8a19a' }}>
              ← Atrás
            </button>
          ) : (
            <Link href="/auth/login" className="text-[12px] uppercase tracking-[2px] font-semibold" style={{ color: '#a8a19a' }}>
              ¿Ya tienes cuenta?
            </Link>
          )}

          {isLast ? (
            <button
              onClick={handleFinish}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-md px-7 py-3.5 text-[13px] font-bold uppercase tracking-wider disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #d4b577, #c8a15a)',
                color: '#0a0a0a',
                boxShadow: '0 10px 30px -10px rgba(200,161,90,.6)',
              }}
            >
              {loading ? 'Creando cuenta...' : 'Crear mi cuenta'}
              {!loading && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-2 rounded-md px-7 py-3.5 text-[13px] font-bold uppercase tracking-wider"
              style={{
                background: 'linear-gradient(135deg, #d4b577, #c8a15a)',
                color: '#0a0a0a',
                boxShadow: '0 10px 30px -10px rgba(200,161,90,.5)',
              }}
            >
              Siguiente
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          )}
        </div>

        <p className="text-center text-[10px] mt-10" style={{ color: '#6b6660' }}>
          Prueba gratuita · Sin tarjeta de crédito · Cancela cuando quieras
        </p>
      </div>

      <style jsx>{`
        @keyframes slideInRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInLeft { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes float { 0%,100% { transform: translate(0,0); } 50% { transform: translate(40px,30px); } }
      `}</style>
    </div>
  );
}
