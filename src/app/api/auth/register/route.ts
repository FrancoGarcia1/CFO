import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password, nombre, telefono, empresa } = await request.json();

    if (!email || !password || !nombre) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }

    const admin = createAdminClient();

    // Create user with email already confirmed (bypasses SMTP requirement)
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        nombre,
        telefono: telefono || '',
        empresa: empresa || '',
      },
    });

    if (error) {
      // Handle specific errors
      if (error.message.includes('already registered') || error.message.includes('already exists')) {
        return NextResponse.json(
          { error: 'Este correo ya está registrado. Intenta iniciar sesión.' },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, user: data.user });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error interno';
    return NextResponse.json(
      { error: `Error al crear cuenta: ${message}` },
      { status: 500 }
    );
  }
}
