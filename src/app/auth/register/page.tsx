'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { submitRegister, validateField, type RegisterForm } from '@/lib/register-submit';

type Step = {
  field: keyof RegisterForm | null;
  label: string;
  question: string;
  hint: string;
  placeholder: string;
  type: string;
};

const SCRIPT: Step[] = [
  { field: null,       label: 'Inicio',      question: 'Hola. Voy a crear tu cuenta en 5 pasos.',     hint: '',                                       placeholder: '',                 type: '' },
  { field: 'nombre',   label: 'Nombre',      question: '¿Cómo te llamas?',                            hint: '',                                       placeholder: 'Tu nombre',        type: 'text' },
  { field: 'email',    label: 'Correo',      question: 'Gracias {nombre}. ¿Y tu correo?',             hint: 'También lo usarás para iniciar sesión.', placeholder: 'tu@correo.com',    type: 'email' },
  { field: 'password', label: 'Contraseña',  question: 'Crea una contraseña. Se guarda cifrada.',     hint: 'Mínimo 6 caracteres.',                   placeholder: '••••••',           type: 'password' },
  { field: 'telefono', label: 'WhatsApp',    question: '¿Tu WhatsApp?',                               hint: 'Sólo para alertas importantes.',         placeholder: '+51 999 999 999',  type: 'tel' },
  { field: 'empresa',  label: 'Empresa',     question: '¿Tu empresa? (opcional)',                     hint: '',                                       placeholder: 'Opcional',         type: 'text' },
  { field: null,       label: 'Confirmar',   question: 'Revisa y confirma.',                          hint: '',                                       placeholder: '',                 type: '' },
];

type Msg = { role: 'cfo' | 'user'; text: string; typing?: boolean };

export default function RegisterChatPage() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterForm>({ nombre: '', email: '', password: '', telefono: '', empresa: '' });
  const [stepIdx, setStepIdx] = useState(0);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [showTrust, setShowTrust] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingStepRef = useRef<number>(-1);
  const [isTouch, setIsTouch] = useState(false);
  const step = SCRIPT[stepIdx];

  useEffect(() => {
    const mq = window.matchMedia('(hover: none), (pointer: coarse)');
    setIsTouch(mq.matches);
  }, []);

  function handleInputFocus() {
    // En mobile: al abrir el teclado, scroll al último mensaje para que se vea
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, 300);
  }

  const questionSteps = SCRIPT.filter((s) => s.field !== null).length;
  const currentQ = SCRIPT.slice(0, stepIdx).filter((s) => s.field !== null).length;
  const progressPct = Math.min(100, (currentQ / questionSteps) * 100);

  useEffect(() => {
    if (!step) return;
    if (typingStepRef.current === stepIdx) return;
    typingStepRef.current = stepIdx;

    const text = step.question.replace('{nombre}', form.nombre.split(' ')[0] || '');
    setMessages((m) => [...m, { role: 'cfo', text: '', typing: true }]);
    setIsThinking(true);

    setTimeout(() => {
      if (typingStepRef.current !== stepIdx) return;
      let chars = 0;
      const timer = window.setInterval(() => {
        if (typingStepRef.current !== stepIdx) { clearInterval(timer); return; }
        chars += 2;
        setMessages((m) => {
          if (m.length === 0) return m;
          const copy = [...m];
          copy[copy.length - 1] = { role: 'cfo', text: text.slice(0, chars), typing: chars < text.length };
          return copy;
        });
        if (chars >= text.length) {
          clearInterval(timer);
          setIsThinking(false);
        }
      }, 18);
    }, 350);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIdx]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  function handleStart() { setStepIdx((s) => s + 1); }

  function handleSend() {
    setError('');
    if (!step.field) return;
    const value = input.trim();
    if (step.field !== 'empresa') {
      const err = validateField(step.field, value);
      if (err) { setError(err); return; }
    }
    setForm((f) => ({ ...f, [step.field as string]: value }));
    setMessages((m) => [...m, { role: 'user', text: step.type === 'password' ? '•'.repeat(value.length || 0) : value || '—' }]);
    setInput('');
    setTimeout(() => setStepIdx((s) => s + 1), 380);
  }

  async function handleConfirm() {
    setError('');
    setLoading(true);
    setIsThinking(true);
    const res = await submitRegister(form);
    if (!res.success) {
      setError(res.error || 'Error al crear cuenta');
      setLoading(false);
      setIsThinking(false);
      return;
    }
    setDone(true);
    setTimeout(() => router.push('/dashboard'), 1500);
  }

  const isWelcome = stepIdx === 0;
  const isConfirm = stepIdx === SCRIPT.length - 1;
  const isQuestion = !!step?.field;

  return (
    <div
      className="flex flex-col relative overflow-hidden"
      style={{
        // 100svh = small viewport, siempre respeta barras visibles de iOS Safari
        minHeight: '100svh',
        height: '100svh',
        background: '#050404',
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* ═══ MESH GRADIENT BACKGROUND (animated) ═══ */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute w-[900px] h-[900px] rounded-full" style={{
          top: '-30%', left: '-15%',
          background: 'radial-gradient(circle, rgba(212,181,119,.18) 0%, rgba(200,161,90,.08) 25%, transparent 55%)',
          filter: 'blur(100px)',
          animation: 'meshFloat1 24s ease-in-out infinite',
        }}/>
        <div className="absolute w-[700px] h-[700px] rounded-full" style={{
          top: '20%', right: '-20%',
          background: 'radial-gradient(circle, rgba(168,196,122,.1) 0%, rgba(104,157,179,.06) 40%, transparent 60%)',
          filter: 'blur(110px)',
          animation: 'meshFloat2 28s ease-in-out infinite',
        }}/>
        <div className="absolute w-[800px] h-[800px] rounded-full" style={{
          bottom: '-30%', left: '30%',
          background: 'radial-gradient(circle, rgba(218,158,98,.12) 0%, rgba(200,161,90,.05) 40%, transparent 65%)',
          filter: 'blur(120px)',
          animation: 'meshFloat3 32s ease-in-out infinite',
        }}/>
      </div>

      {/* Grain overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[.028]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        mixBlendMode: 'overlay',
      }}/>

      {/* ═══ TOP NAV — LIQUID GLASS ═══ */}
      <nav className="relative z-30 flex items-center justify-between px-5 md:px-8 py-3.5" style={{
        background: 'rgba(8,6,6,.55)',
        backdropFilter: 'saturate(180%) blur(32px)',
        WebkitBackdropFilter: 'saturate(180%) blur(32px)',
        borderBottom: '1px solid rgba(255,255,255,.04)',
      }}>
        <Link href="/" className="flex items-center gap-2" style={{ color: '#f5f0e8' }}>
          <div className="w-5 h-5 rounded-[5px] flex items-center justify-center relative" style={{
            background: 'linear-gradient(135deg, #d4b577, #c8a15a)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,.3), 0 2px 4px rgba(0,0,0,.4)',
          }}>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="3"><polyline points="3 17 9 11 13 15 21 7"/></svg>
          </div>
          <span className="text-[13px] font-medium tracking-[-0.01em]">
            Capital<span style={{ color: '#c8a15a' }}>CFO</span>
          </span>
        </Link>

        <button
          onClick={() => setShowTrust(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all"
          style={{
            background: 'rgba(255,255,255,.04)',
            border: '1px solid rgba(255,255,255,.06)',
            color: 'rgba(245,240,232,.65)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="5" y="11" width="14" height="9" rx="1"/>
            <path d="M8 11V7a4 4 0 0 1 8 0v4"/>
          </svg>
          <span>Cifrado</span>
        </button>
      </nav>

      {/* Hairline progress */}
      <div className="relative h-[1px] z-30" style={{ background: 'rgba(255,255,255,.04)' }}>
        <div
          className="absolute inset-y-0 left-0 transition-all duration-700 ease-out"
          style={{
            width: `${progressPct}%`,
            background: 'linear-gradient(90deg, rgba(212,181,119,0) 0%, #d4b577 50%, #c8a15a 100%)',
            boxShadow: '0 0 8px rgba(200,161,90,.7)',
          }}
        />
      </div>

      {/* ═══ MAIN ═══ */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-5 md:px-8 py-6 md:py-10">
        <div className="w-full max-w-[620px] flex flex-col flex-1 relative">
          {/* Apple Intelligence-style animated glow ring */}
          <div
            className="absolute inset-0 rounded-[32px] pointer-events-none"
            style={{
              opacity: isThinking ? 1 : 0.35,
              transition: 'opacity .5s ease',
              background: 'conic-gradient(from 0deg at 50% 50%, rgba(212,181,119,.6), rgba(168,196,122,.4), rgba(218,158,98,.5), rgba(200,161,90,.6), rgba(212,181,119,.6))',
              filter: 'blur(40px)',
              animation: 'spinSlow 8s linear infinite',
              zIndex: -1,
            }}
          />

          {/* Crystalline glass surface */}
          <div className="relative flex flex-col flex-1 rounded-[24px] overflow-hidden" style={{
            background: 'linear-gradient(135deg, rgba(22,19,16,.72) 0%, rgba(13,11,10,.6) 100%)',
            backdropFilter: 'saturate(180%) blur(40px)',
            WebkitBackdropFilter: 'saturate(180%) blur(40px)',
            border: '1px solid rgba(255,255,255,.06)',
            boxShadow: `
              0 1px 0 rgba(255,255,255,.04) inset,
              0 -1px 0 rgba(0,0,0,.4) inset,
              0 60px 120px -20px rgba(0,0,0,.8),
              0 0 0 1px rgba(200,161,90,.04)
            `,
            minHeight: 'calc(100vh - 220px)',
          }}>
            {/* Top specular highlight */}
            <div className="absolute top-0 left-[10%] right-[10%] h-px" style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.15) 50%, transparent)',
            }}/>

            {/* CFO persona header */}
            <div className="flex items-center gap-3 px-5 md:px-6 py-4" style={{
              borderBottom: '1px solid rgba(255,255,255,.05)',
            }}>
              {/* Apple Intelligence-style avatar with holographic ring */}
              <div className="relative">
                {/* Animated halo ring */}
                <div className="absolute -inset-1 rounded-full pointer-events-none" style={{
                  background: 'conic-gradient(from 0deg, #d4b577, #e6c88a, #c8a15a, #b08c47, #d4b577)',
                  animation: isThinking ? 'spinSlow 3s linear infinite' : 'spinSlow 8s linear infinite',
                  filter: 'blur(4px)',
                  opacity: isThinking ? 0.9 : 0.4,
                }}/>
                <div className="relative w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-semibold tracking-wide" style={{
                  background: 'linear-gradient(135deg, #3a2d18 0%, #1a1510 100%)',
                  border: '1px solid rgba(200,161,90,.4)',
                  color: '#f5e2b8',
                  backdropFilter: 'blur(12px)',
                }}>
                  <span className="relative">CC</span>
                  {/* Inner highlight */}
                  <div className="absolute inset-0 rounded-full pointer-events-none" style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,.08) 0%, transparent 50%)',
                  }}/>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-medium tracking-[-0.01em]" style={{ color: '#f5f0e8' }}>
                  Capital CFO
                </div>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full" style={{
                    background: '#a8c47a',
                    boxShadow: '0 0 6px rgba(168,196,122,.8)',
                    animation: 'pulseDot 2s ease-in-out infinite',
                  }}/>
                  <span style={{ color: 'rgba(168,196,122,.9)' }}>En línea</span>
                  <span style={{ color: 'rgba(255,255,255,.25)' }}>·</span>
                  <span style={{ color: 'rgba(245,240,232,.5)' }}>{step?.label ?? 'Inicio'}</span>
                </div>
              </div>

              <div className="text-[10px] font-medium tabular-nums hidden sm:flex items-center gap-1" style={{ color: 'rgba(245,240,232,.4)' }}>
                <span className="tabular-nums" style={{ color: '#c8a15a' }}>{String(currentQ).padStart(2, '0')}</span>
                <span style={{ color: 'rgba(255,255,255,.2)' }}>/</span>
                <span>{String(questionSteps).padStart(2, '0')}</span>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 md:px-6 py-6 space-y-2.5">
              {messages.map((msg, i) => {
                const prev = messages[i - 1];
                const isSameSender = prev?.role === msg.role;
                return (
                  <div
                    key={i}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    style={{ marginTop: isSameSender ? 2 : 12 }}
                  >
                    <div
                      className="max-w-[78%] px-4 py-2.5 text-[14px] leading-[1.5] relative"
                      style={{
                        background: msg.role === 'user'
                          ? 'linear-gradient(135deg, #d4b577 0%, #c8a15a 100%)'
                          : 'rgba(255,255,255,.05)',
                        color: msg.role === 'user' ? '#0a0a0a' : 'rgba(245,240,232,.95)',
                        borderRadius: msg.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                        border: msg.role === 'user'
                          ? '1px solid rgba(255,255,255,.15)'
                          : '1px solid rgba(255,255,255,.05)',
                        animation: 'bubbleIn .35s cubic-bezier(.16,1,.3,1) both',
                        fontWeight: msg.role === 'user' ? 500 : 400,
                        backdropFilter: msg.role === 'cfo' ? 'blur(12px)' : undefined,
                        boxShadow: msg.role === 'user'
                          ? '0 8px 24px -8px rgba(200,161,90,.35), inset 0 1px 0 rgba(255,255,255,.2)'
                          : '0 1px 0 rgba(255,255,255,.03) inset',
                      }}
                    >
                      {msg.typing && !msg.text ? (
                        <div className="flex gap-1.5 items-center py-1">
                          <span className="w-1.5 h-1.5 rounded-full" style={{
                            background: 'linear-gradient(135deg, #d4b577, #c8a15a)',
                            animation: 'typingDot 1.2s ease-in-out infinite',
                          }}/>
                          <span className="w-1.5 h-1.5 rounded-full" style={{
                            background: 'linear-gradient(135deg, #d4b577, #c8a15a)',
                            animation: 'typingDot 1.2s ease-in-out .2s infinite',
                          }}/>
                          <span className="w-1.5 h-1.5 rounded-full" style={{
                            background: 'linear-gradient(135deg, #d4b577, #c8a15a)',
                            animation: 'typingDot 1.2s ease-in-out .4s infinite',
                          }}/>
                        </div>
                      ) : (
                        <>
                          {msg.text}
                          {msg.typing && <span className="inline-block w-[2px] h-[14px] ml-0.5 align-middle" style={{ background: '#c8a15a', animation: 'blink 1s infinite' }}/>}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Summary on confirm */}
              {isConfirm && !done && (
                <div
                  className="max-w-[82%] px-5 py-4 text-[13.5px] relative overflow-hidden"
                  style={{
                    background: 'rgba(255,255,255,.05)',
                    border: '1px solid rgba(200,161,90,.18)',
                    borderRadius: '22px 22px 22px 4px',
                    animation: 'bubbleIn .4s cubic-bezier(.16,1,.3,1) both',
                    backdropFilter: 'blur(16px)',
                    marginTop: 12,
                    boxShadow: '0 12px 32px -12px rgba(0,0,0,.5), 0 0 0 1px rgba(200,161,90,.05) inset',
                  }}
                >
                  <div className="absolute top-0 left-[20%] right-[20%] h-px" style={{
                    background: 'linear-gradient(90deg, transparent, rgba(200,161,90,.4), transparent)',
                  }}/>
                  <div className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-2">
                    <SummaryRow label="Nombre" value={form.nombre} />
                    <SummaryRow label="Correo" value={form.email} />
                    <SummaryRow label="Clave" value={'•'.repeat(form.password.length)} />
                    <SummaryRow label="WhatsApp" value={form.telefono} />
                    <SummaryRow label="Empresa" value={form.empresa || '—'} dim={!form.empresa} />
                  </div>
                </div>
              )}

              {done && (
                <div className="flex justify-center pt-4">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full text-[12px]" style={{
                    background: 'rgba(168,196,122,.1)',
                    border: '1px solid rgba(168,196,122,.25)',
                    color: 'rgba(168,196,122,1)',
                    backdropFilter: 'blur(8px)',
                  }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="4 12 10 18 20 6"/></svg>
                    Cuenta creada
                  </div>
                </div>
              )}

              {error && (
                <div className="text-center text-[12px] pt-2" style={{ color: '#ef4444' }}>
                  {error}
                </div>
              )}
            </div>

            {/* Input dock */}
            <div className="px-4 md:px-5 pt-3.5" style={{
              background: 'linear-gradient(180deg, transparent 0%, rgba(10,10,10,.3) 100%)',
              borderTop: '1px solid rgba(255,255,255,.04)',
              paddingBottom: 'max(14px, env(safe-area-inset-bottom))',
            }}>
              {isWelcome ? (
                <button
                  onClick={handleStart}
                  className="w-full flex items-center justify-center gap-2 rounded-full py-3.5 text-[13px] font-medium transition-all hover:translate-y-[-1px] relative overflow-hidden group"
                  style={{
                    background: 'linear-gradient(135deg, #d4b577, #c8a15a)',
                    color: '#0a0a0a',
                    boxShadow: '0 10px 28px -8px rgba(200,161,90,.5), inset 0 1px 0 rgba(255,255,255,.25)',
                  }}
                >
                  <span
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      background: 'linear-gradient(120deg, transparent 30%, rgba(255,255,255,.25) 50%, transparent 70%)',
                      animation: 'shine 2s ease-in-out infinite',
                    }}
                  />
                  <span className="relative">Empezar</span>
                  <svg className="relative" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </button>
              ) : isConfirm ? (
                <div className="grid grid-cols-[auto_1fr] gap-2">
                  <button
                    onClick={() => setStepIdx(1)}
                    disabled={loading || done}
                    className="px-5 py-3.5 rounded-full text-[12px] font-medium disabled:opacity-40 transition-colors"
                    style={{
                      background: 'rgba(255,255,255,.05)',
                      color: 'rgba(245,240,232,.75)',
                      border: '1px solid rgba(255,255,255,.08)',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={loading || done}
                    className="inline-flex items-center justify-center gap-2 rounded-full py-3.5 text-[13px] font-medium disabled:opacity-60 transition-all relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #d4b577, #c8a15a)',
                      color: '#0a0a0a',
                      boxShadow: '0 10px 28px -8px rgba(200,161,90,.5), inset 0 1px 0 rgba(255,255,255,.25)',
                    }}
                  >
                    {loading ? 'Creando…' : 'Confirmar y crear cuenta'}
                    {!loading && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="4 12 10 18 20 6"/></svg>}
                  </button>
                </div>
              ) : isQuestion ? (
                <>
                  <div className="flex items-center gap-2 rounded-full pr-1.5 pl-5 relative" style={{
                    background: 'rgba(255,255,255,.04)',
                    border: '1px solid rgba(255,255,255,.08)',
                    backdropFilter: 'saturate(180%) blur(16px)',
                  }}>
                    <input
                      type={step.type}
                      placeholder={step.placeholder}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                      onFocus={handleInputFocus}
                      autoFocus={!isTouch}
                      autoComplete={step.type === 'password' ? 'new-password' : 'off'}
                      className="flex-1 min-w-0 py-3 bg-transparent outline-none font-medium tracking-[-0.01em]"
                      style={{ color: '#f5f0e8', fontSize: '16px' }}
                    />
                    <button
                      onClick={handleSend}
                      disabled={!input.trim() && step.field !== 'empresa'}
                      aria-label="Enviar"
                      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-30 transition-all hover:scale-105"
                      style={{
                        background: 'linear-gradient(135deg, #d4b577, #c8a15a)',
                        boxShadow: '0 4px 12px -2px rgba(200,161,90,.45), inset 0 1px 0 rgba(255,255,255,.3)',
                      }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2.4">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <polyline points="5 12 12 5 19 12"/>
                      </svg>
                    </button>
                  </div>
                  {step.hint && (
                    <p className="mt-2 text-center text-[11px]" style={{ color: 'rgba(245,240,232,.42)' }}>
                      {step.hint}
                    </p>
                  )}
                </>
              ) : null}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-5 text-[11px]" style={{ color: 'rgba(245,240,232,.35)' }}>
            <Link href="/auth/login" className="transition-colors hover:text-[color:#c8a15a]" style={{ color: 'rgba(200,161,90,.75)' }}>
              Iniciar sesión
            </Link>
            <span>7 días gratis · Sin tarjeta</span>
          </div>
        </div>
      </main>

      {/* ═══ TRUST SHEET — iOS 26 liquid glass style ═══ */}
      {showTrust && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
          onClick={() => setShowTrust(false)}
          style={{ animation: 'fadeIn .25s ease-out' }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: 'rgba(0,0,0,.45)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
          />
          <div
            className="relative w-full md:max-w-md mx-0 md:mx-4 rounded-t-[28px] md:rounded-[28px] p-6 md:p-7 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(180deg, rgba(30,25,20,.9) 0%, rgba(16,13,11,.88) 100%)',
              border: '1px solid rgba(255,255,255,.08)',
              backdropFilter: 'saturate(200%) blur(40px)',
              WebkitBackdropFilter: 'saturate(200%) blur(40px)',
              boxShadow: '0 -30px 80px -20px rgba(0,0,0,.9)',
              animation: 'sheetIn .45s cubic-bezier(.22,1,.36,1)',
            }}
          >
            {/* Top shine */}
            <div className="absolute top-0 left-[15%] right-[15%] h-px" style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.15), transparent)',
            }}/>

            <div className="flex justify-center md:hidden mb-4">
              <div className="w-9 h-1 rounded-full" style={{ background: 'rgba(255,255,255,.15)' }}/>
            </div>

            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-[18px] font-semibold mb-1 tracking-[-0.01em]" style={{ color: '#f5f0e8' }}>
                  Tus datos están seguros
                </h3>
                <p className="text-[12.5px]" style={{ color: 'rgba(245,240,232,.55)' }}>
                  Tres garantías que mantenemos por diseño.
                </p>
              </div>
              <button
                onClick={() => setShowTrust(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,.06)', color: 'rgba(245,240,232,.7)' }}
                aria-label="Cerrar"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className="space-y-2">
              <TrustRow
                icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="5" y="11" width="14" height="9" rx="1"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>}
                title="Cifrado TLS 1.3"
                body="Tu información viaja encriptada extremo a extremo."
              />
              <TrustRow
                icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2l8 3v7c0 5-4 9-8 10-4-1-8-5-8-10V5l8-3z"/></svg>}
                title="Contraseña con Argon2"
                body="Ni nuestro equipo puede leer tu contraseña."
              />
              <TrustRow
                icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 21V4h14l-3 4 3 4H4"/></svg>}
                title="Ley 29733 del Perú"
                body="No compartimos tus datos con terceros. Por contrato."
              />
            </div>

            <div className="mt-6 pt-5 flex items-center justify-between text-[11px]" style={{
              borderTop: '1px solid rgba(255,255,255,.06)',
              color: 'rgba(245,240,232,.45)',
            }}>
              <Link href="/privacidad" style={{ color: 'rgba(200,161,90,.8)' }}>
                Política de privacidad →
              </Link>
              <span>Auditado 2026</span>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes bubbleIn { from { opacity: 0; transform: translateY(8px) scale(.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes typingDot { 0%,60%,100% { opacity: .25; transform: translateY(0); } 30% { opacity: 1; transform: translateY(-3px); } }
        @keyframes blink { 0%,49% { opacity: 1; } 50%,100% { opacity: 0; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes sheetIn { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes spinSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulseDot { 0%,100% { box-shadow: 0 0 6px rgba(168,196,122,.8), 0 0 0 0 rgba(168,196,122,.4); } 50% { box-shadow: 0 0 8px rgba(168,196,122,1), 0 0 0 4px rgba(168,196,122,0); } }
        @keyframes meshFloat1 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(60px, 40px) scale(1.1); } }
        @keyframes meshFloat2 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-50px, 60px) scale(1.08); } }
        @keyframes meshFloat3 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(40px, -50px) scale(1.15); } }
        @keyframes shine { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
      `}</style>
    </div>
  );
}

function TrustRow({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-2xl" style={{
      background: 'rgba(255,255,255,.03)',
      border: '1px solid rgba(255,255,255,.04)',
    }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, rgba(200,161,90,.15), rgba(200,161,90,.05))',
        border: '1px solid rgba(200,161,90,.2)',
        color: '#d4b577',
      }}>
        {icon}
      </div>
      <div className="min-w-0 pt-0.5">
        <div className="text-[13px] font-medium tracking-[-0.01em]" style={{ color: '#f5f0e8' }}>{title}</div>
        <div className="text-[11.5px] leading-[1.45] mt-0.5" style={{ color: 'rgba(245,240,232,.52)' }}>{body}</div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, dim }: { label: string; value: string; dim?: boolean }) {
  return (
    <>
      <dt className="text-[11.5px] font-medium tracking-[-0.005em]" style={{ color: 'rgba(245,240,232,.5)' }}>{label}</dt>
      <dd className="text-right truncate font-medium" style={{
        color: dim ? 'rgba(245,240,232,.42)' : '#f5f0e8',
      }}>
        {value}
      </dd>
    </>
  );
}
