'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { submitRegister, validateField, type RegisterForm } from '@/lib/register-submit';

type Step = {
  field: keyof RegisterForm;
  title: string;
  subtitle: string;
  label: string;
  placeholder: string;
  type: string;
  hint?: string;
  optional?: boolean;
};

const STEPS: Step[] = [
  {
    field: 'nombre',
    title: 'Empecemos por conocerte',
    subtitle: '¿Cuál es tu nombre completo?',
    label: 'Nombre',
    placeholder: 'Juan García',
    type: 'text',
  },
  {
    field: 'email',
    title: 'Gracias',
    subtitle: '¿A qué correo te escribimos?',
    label: 'Correo',
    placeholder: 'juan@empresa.com',
    type: 'email',
    hint: 'También lo usarás para iniciar sesión.',
  },
  {
    field: 'password',
    title: 'Asegura tu cuenta',
    subtitle: 'Crea una contraseña segura',
    label: 'Contraseña',
    placeholder: 'Mínimo 6 caracteres',
    type: 'password',
    hint: 'Se guarda cifrada. Ni nuestro equipo la puede leer.',
  },
  {
    field: 'telefono',
    title: 'Un par más',
    subtitle: '¿Cuál es tu WhatsApp?',
    label: 'Teléfono',
    placeholder: '+51 999 999 999',
    type: 'tel',
    hint: 'Sólo para alertas importantes sobre tu cuenta.',
  },
  {
    field: 'empresa',
    title: 'Un último detalle',
    subtitle: '¿Cómo se llama tu empresa?',
    label: 'Empresa (opcional)',
    placeholder: 'Mi Empresa SAC',
    type: 'text',
    optional: true,
    hint: 'Puedes dejarlo vacío y completarlo después.',
  },
];

export default function RegisterPage() {
  const router = useRouter();
  const [stepIdx, setStepIdx] = useState(0);
  const [form, setForm] = useState<RegisterForm>({ nombre: '', email: '', password: '', telefono: '', empresa: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isTouch, setIsTouch] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const step = STEPS[stepIdx];
  const isLast = stepIdx === STEPS.length - 1;

  // Detectar si es touch device
  useEffect(() => {
    const mq = window.matchMedia('(hover: none), (pointer: coarse)');
    setIsTouch(mq.matches);
  }, []);

  // visualViewport API: ajusta altura cuando abre el teclado
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    function update() {
      if (!rootRef.current || !vv) return;
      rootRef.current.style.height = `${vv.height}px`;
    }
    update();
    vv.addEventListener('resize', update);
    return () => { vv.removeEventListener('resize', update); };
  }, []);

  // Focus input al cambiar de paso (solo desktop; mobile lo evita hasta que el user toca)
  useEffect(() => {
    if (!isTouch) {
      setTimeout(() => inputRef.current?.focus(), 400);
    }
  }, [stepIdx, isTouch]);

  function handleNext() {
    setError('');
    if (!step.optional) {
      const err = validateField(step.field, form[step.field]);
      if (err) {
        setError(err);
        return;
      }
    }
    if (isLast) {
      void handleFinish();
      return;
    }
    setDirection(1);
    setStepIdx((s) => s + 1);
  }

  function handleBack() {
    setError('');
    setDirection(-1);
    setStepIdx((s) => Math.max(0, s - 1));
  }

  async function handleFinish() {
    setLoading(true);
    const res = await submitRegister(form);
    if (!res.success) {
      setError(res.error || 'Error al crear cuenta');
      setLoading(false);
      return;
    }
    router.push('/dashboard');
  }

  const currentValue = form[step.field];
  const canAdvance = step.optional || currentValue.length > 0;
  const progressPct = ((stepIdx + 1) / STEPS.length) * 100;

  return (
    <div
      ref={rootRef}
      className="flex flex-col relative overflow-hidden"
      style={{
        height: '100svh',
        background: '#0a0a0a',
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Ambient aurora gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute w-[600px] h-[600px] rounded-full blur-[120px]" style={{
          top: '-20%', left: '-15%',
          background: 'radial-gradient(circle, rgba(200,161,90,.16), transparent 65%)',
          animation: 'float1 20s ease-in-out infinite',
        }}/>
        <div className="absolute w-[500px] h-[500px] rounded-full blur-[100px]" style={{
          bottom: '-20%', right: '-10%',
          background: 'radial-gradient(circle, rgba(168,196,122,.08), transparent 65%)',
          animation: 'float2 24s ease-in-out infinite',
        }}/>
      </div>

      {/* ═══ TOP BAR — logo + progress ═══ */}
      <header className="flex-shrink-0 relative z-20 px-5 md:px-8 pt-5 pb-4">
        <div className="flex items-center justify-between mb-5">
          <Link href="/" className="flex items-center gap-2" style={{ color: '#f5f0e8' }}>
            <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #d4b577, #c8a15a)' }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="3"><polyline points="3 17 9 11 13 15 21 7"/></svg>
            </div>
            <span className="text-[13px] font-medium tracking-tight">
              Capital<span style={{ color: '#c8a15a' }}>CFO</span>
            </span>
          </Link>

          <span className="text-[11px] font-mono tabular-nums" style={{ color: 'rgba(245,240,232,.5)' }}>
            <span style={{ color: '#c8a15a' }}>{String(stepIdx + 1).padStart(2, '0')}</span>
            <span style={{ color: 'rgba(255,255,255,.25)' }}> / </span>
            <span>{String(STEPS.length).padStart(2, '0')}</span>
          </span>
        </div>

        {/* Progress bar */}
        <div className="relative h-[3px] rounded-full" style={{ background: 'rgba(200,161,90,.1)' }}>
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${progressPct}%`,
              background: 'linear-gradient(90deg, #d4b577, #c8a15a)',
              boxShadow: '0 0 10px rgba(200,161,90,.6)',
            }}
          />
        </div>
      </header>

      {/* ═══ MAIN — question + input ═══ */}
      <main className="flex-1 min-h-0 relative z-10 flex flex-col justify-center px-5 md:px-8 py-4 overflow-hidden">
        <div
          key={stepIdx}
          className="relative w-full max-w-[520px] mx-auto"
          style={{
            animation: direction === 1
              ? 'slideInR .45s cubic-bezier(.16,1,.3,1) both'
              : 'slideInL .45s cubic-bezier(.16,1,.3,1) both',
          }}
        >
          {/* Step badge */}
          <div className="inline-flex items-center gap-2 mb-5 px-3 py-1 rounded-full" style={{
            background: 'rgba(200,161,90,.08)',
            border: '1px solid rgba(200,161,90,.25)',
          }}>
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full animate-ping" style={{ background: '#c8a15a', opacity: 0.5 }} />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: '#c8a15a' }} />
            </span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-[2px]" style={{ color: '#c8a15a' }}>
              {isLast ? 'Último paso' : `Paso ${stepIdx + 1}`}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-[28px] md:text-[36px] font-bold leading-[1.1] tracking-tight mb-2" style={{ color: '#f5f0e8' }}>
            {step.title}<span style={{ color: '#c8a15a' }}>.</span>
          </h1>

          {/* Subtitle / question */}
          <p className="text-[17px] md:text-[19px] mb-8 leading-snug" style={{ color: 'rgba(245,240,232,.75)' }}>
            {step.subtitle}
          </p>

          {/* Label */}
          <label htmlFor={step.field} className="block text-[10px] font-bold uppercase tracking-[2px] mb-2.5" style={{ color: 'rgba(200,161,90,.9)' }}>
            {step.label}
          </label>

          {/* Big input */}
          <input
            id={step.field}
            ref={inputRef}
            name={step.field}
            type={step.type}
            placeholder={step.placeholder}
            value={currentValue}
            onChange={(e) => setForm((f) => ({ ...f, [step.field]: e.target.value }))}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleNext(); } }}
            autoComplete={step.type === 'password' ? 'new-password' : 'off'}
            className="w-full px-0 py-4 bg-transparent outline-none font-medium"
            style={{
              fontSize: '18px',
              color: '#f5f0e8',
              borderBottom: '2px solid rgba(200,161,90,.25)',
              transition: 'border-color .2s',
            }}
            onFocus={(e) => e.target.style.borderBottomColor = '#c8a15a'}
            onBlur={(e) => e.target.style.borderBottomColor = 'rgba(200,161,90,.25)'}
          />

          {/* Hint */}
          {step.hint && !error && (
            <p className="mt-3 text-[12px] flex items-start gap-1.5" style={{ color: 'rgba(245,240,232,.45)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 flex-shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="0.5" fill="currentColor"/></svg>
              {step.hint}
            </p>
          )}

          {/* Error */}
          {error && (
            <p className="mt-3 text-[12.5px] flex items-start gap-1.5" style={{ color: '#ef4444' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 flex-shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/></svg>
              {error}
            </p>
          )}
        </div>
      </main>

      {/* ═══ FOOTER — actions ═══ */}
      <footer
        className="flex-shrink-0 relative z-20 px-5 md:px-8 pt-3"
        style={{ paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}
      >
        <div className="w-full max-w-[520px] mx-auto">
          <div className="flex items-center gap-3">
            {stepIdx > 0 ? (
              <button
                onClick={handleBack}
                className="w-12 h-[52px] flex-shrink-0 rounded-xl flex items-center justify-center transition-all"
                style={{
                  background: 'rgba(255,255,255,.04)',
                  border: '1px solid rgba(255,255,255,.08)',
                  color: 'rgba(245,240,232,.7)',
                }}
                aria-label="Paso anterior"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
              </button>
            ) : null}

            <button
              onClick={handleNext}
              disabled={loading || (!canAdvance)}
              className="flex-1 flex items-center justify-center gap-2 h-[52px] rounded-xl text-[14px] font-bold uppercase tracking-wider disabled:opacity-40 transition-all"
              style={{
                background: 'linear-gradient(135deg, #d4b577, #c8a15a)',
                color: '#0a0a0a',
                boxShadow: '0 10px 28px -8px rgba(200,161,90,.55), inset 0 1px 0 rgba(255,255,255,.25)',
              }}
            >
              {loading ? 'Creando cuenta...' : isLast ? 'Crear mi cuenta' : 'Siguiente'}
              {!loading && (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              )}
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between text-[11px]" style={{ color: 'rgba(245,240,232,.4)' }}>
            <Link href="/auth/login" style={{ color: 'rgba(200,161,90,.75)' }}>
              Iniciar sesión
            </Link>
            <span className="flex items-center gap-1.5">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="5" y="11" width="14" height="9" rx="1"/>
                <path d="M8 11V7a4 4 0 0 1 8 0v4"/>
              </svg>
              Cifrado · Sin tarjeta
            </span>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes slideInR { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInL { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes float1 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(40px, 30px); } }
        @keyframes float2 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-30px, 40px); } }
      `}</style>
    </div>
  );
}
