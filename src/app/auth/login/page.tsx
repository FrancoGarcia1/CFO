'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError('Credenciales incorrectas');
      setLoading(false);
      return;
    }

    router.push('/dashboard');
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
          Bienvenido de vuelta
        </h2>
        <p className="mb-8 text-sm" style={{ color: '#7a756e' }}>
          Ingresa a tu dashboard financiero
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[2px] mb-2" style={{ color: '#7a756e' }}>
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="juan@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[2px] mb-2" style={{ color: '#7a756e' }}>
              Contraseña
            </label>
            <input
              type="password"
              placeholder="Tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>

          <p className="text-center text-xs" style={{ color: '#7a756e' }}>
            No tienes cuenta?{' '}
            <Link href="/auth/register" className="font-semibold transition-colors" style={{ color: '#d4a574' }}>
              Regístrate gratis
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
