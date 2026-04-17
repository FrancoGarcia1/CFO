import { createClient } from '@/lib/supabase/client';

export type RegisterForm = {
  nombre: string;
  email: string;
  password: string;
  telefono: string;
  empresa: string;
};

export type RegisterResult = { success: boolean; error?: string };

export function validateField(name: keyof RegisterForm, value: string): string | null {
  if (name === 'nombre' && !value.trim()) return 'Ingresa tu nombre';
  if (name === 'email' && !value.includes('@')) return 'Email inválido';
  if (name === 'password' && value.length < 6) return 'Mínimo 6 caracteres';
  if (name === 'telefono' && value.replace(/\D/g, '').length < 9) return 'Teléfono inválido';
  return null;
}

export async function submitRegister(form: RegisterForm): Promise<RegisterResult> {
  for (const [name, value] of Object.entries(form) as [keyof RegisterForm, string][]) {
    const err = validateField(name, value);
    if (err && name !== 'empresa') return { success: false, error: err };
  }

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, error: data.error || 'Error al crear cuenta' };

    const supabase = createClient();
    await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    return { success: true };
  } catch {
    return { success: false, error: 'Error de conexión. Intenta de nuevo.' };
  }
}
