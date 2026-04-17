'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const FIELDS = [
  { name: 'nombre', label: 'Nombre completo', placeholder: 'Juan Garcia', type: 'text' },
  { name: 'email', label: 'Correo electrónico', placeholder: 'juan@empresa.com', type: 'email' },
  { name: 'password', label: 'Contraseña', placeholder: 'Mínimo 6 caracteres', type: 'password' },
  { name: 'telefono', label: 'Teléfono / WhatsApp', placeholder: '+51 999 999 999', type: 'tel' },
  { name: 'empresa', label: 'Empresa (opcional)', placeholder: 'Mi Empresa SAC', type: 'text' },
] as const;

type FormData = Record<(typeof FIELDS)[number]['name'], string>;

export default function RegisterPage() {
  const [form, setForm] = useState<FormData>({ nombre: '', email: '', password: '', telefono: '', empresa: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.nombre.trim()) { setError('Ingresa tu nombre'); return; }
    if (!form.email.includes('@')) { setError('Email inválido'); return; }
    if (form.password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return; }
    if (form.telefono.replace(/\D/g, '').length < 9) { setError('Teléfono inválido'); return; }

    setLoading(true);

    // Step 1: Create user via admin API (auto-confirms email, no SMTP needed)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          nombre: form.nombre,
          telefono: form.telefono,
          empresa: form.empresa,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error al crear cuenta');
        setLoading(false);
        return;
      }

      // Step 2: Sign in the newly created user
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (signInError) {
        setError('Cuenta creada. Por favor inicia sesión.');
        setLoading(false);
        return;
      }

      router.push('/dashboard');
    } catch {
      setError('Error de conexión. Intenta de nuevo.');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6" style={{ background: '#0f0f0f', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
      `}</style>

      <div className="w-full max-w-[400px]">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-sm font-bold tracking-tight" style={{ color: '#f5f0eb' }}>
            Franco Garcia<span style={{ color: '#d4a574' }}> · CFO</span>
          </Link>
        </div>

        <h2 className="mb-2 text-2xl font-extrabold tracking-tight" style={{ color: '#f5f0eb' }}>
          Comienza tu prueba gratuita
        </h2>
        <p className="mb-8 text-sm" style={{ color: '#7a756e' }}>
          7 días gratis · Sin tarjeta de crédito
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {FIELDS.map(({ name, label, placeholder, type }) => (
            <div key={name}>
              <label className="block text-[10px] font-bold uppercase tracking-[2px] mb-2" style={{ color: '#7a756e' }}>
                {label}
              </label>
              <input
                name={name}
                type={type}
                placeholder={placeholder}
                value={form[name]}
                onChange={handleChange}
                className="w-full py-3 text-sm outline-none transition-all duration-200"
                style={{
                  background: 'transparent',
                  borderBottom: '1px solid #2a2a2a',
                  color: '#f5f0eb',
                }}
                onFocus={(e) => e.target.style.borderColor = '#d4a574'}
                onBlur={(e) => e.target.style.borderColor = '#2a2a2a'}
              />
            </div>
          ))}

          {error && (
            <p className="text-xs text-center" style={{ color: '#ff4757' }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 text-sm font-bold uppercase tracking-wider transition-all duration-200 disabled:opacity-40"
            style={{ background: '#d4a574', color: '#0f0f0f' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#f5f0eb'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#d4a574'; }}
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta gratuita'}
          </button>

          <p className="text-center text-[11px] leading-relaxed" style={{ color: '#3a3a3a' }}>
            Tus datos son privados y no se comparten con terceros.
          </p>

          <p className="text-center text-xs" style={{ color: '#7a756e' }}>
            Ya tienes cuenta?{' '}
            <Link href="/auth/login" className="font-semibold transition-colors" style={{ color: '#d4a574' }}>
              Inicia sesión
            </Link>
          </p>
        </form>

        {/* Decorative line */}
        <div className="mt-12 h-px" style={{ background: 'linear-gradient(90deg, transparent, #2a2a2a, transparent)' }} />
        <p className="mt-4 text-center text-[10px]" style={{ color: '#3a3a3a' }}>
          Franco Garcia · Consultor Financiero
        </p>
      </div>
    </div>
  );
}
