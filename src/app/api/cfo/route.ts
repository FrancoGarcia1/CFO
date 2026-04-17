import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    // Check profile: plan + trial status
    const { data: profile } = await supabase
      .from('profiles')
      .select('plan, trial_used, created_at')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json(
        { error: 'Perfil no encontrado' },
        { status: 404 }
      );
    }

    const isTrial = profile.plan === 'trial';

    // Trial: 7 days, 3 queries/day
    if (isTrial) {
      const createdAt = new Date(profile.created_at);
      const daysSinceCreation = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24);

      if (daysSinceCreation > 7) {
        return NextResponse.json(
          { error: 'Tu prueba gratuita de 7 días ha expirado. Activa tu plan para continuar.' },
          { status: 403 }
        );
      }

      // Rate limit: 3 per day for trial
      const admin = createAdminClient();
      const { data: rl } = await admin.rpc('check_rate_limit', {
        p_user_id: user.id,
        p_max_calls: 3,
        p_window_seconds: 86400, // 24 hours
      });

      if (rl && rl.length > 0 && !rl[0].allowed) {
        return NextResponse.json(
          { error: 'Límite de 3 consultas/día en prueba gratuita. Activa tu plan para acceso ilimitado.' },
          { status: 429, headers: { 'Retry-After': '86400' } }
        );
      }
    }

    // Active plan: 10 queries/hour
    if (!isTrial) {
      const admin = createAdminClient();
      const { data: rl } = await admin.rpc('check_rate_limit', {
        p_user_id: user.id,
        p_max_calls: 10,
        p_window_seconds: 3600,
      });

      if (rl && rl.length > 0 && !rl[0].allowed) {
        return NextResponse.json(
          { error: 'Límite de 10 consultas/hora alcanzado.' },
          { status: 429, headers: { 'Retry-After': '3600' } }
        );
      }
    }

    // Parse request body
    const body = await request.json();
    const { system, messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Formato de mensaje inválido' },
        { status: 400 }
      );
    }

    // Gemini API
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY no configurada' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey: geminiKey });

    // Build Gemini contents from chat messages
    // Prepend system prompt as first user context
    const geminiContents = [];

    if (system) {
      geminiContents.push({
        role: 'user' as const,
        parts: [{ text: `[INSTRUCCIONES DEL SISTEMA]\n${system}\n[FIN INSTRUCCIONES]\n\nResponde siempre siguiendo las instrucciones anteriores.` }],
      });
      geminiContents.push({
        role: 'model' as const,
        parts: [{ text: 'Entendido. Soy tu Capital CFO, tu CFO Senior Virtual. Estoy listo para analizar tu negocio siguiendo mis instrucciones. ¿En qué te puedo ayudar?' }],
      });
    }

    // Map chat messages: user → user, assistant → model
    for (const msg of messages) {
      geminiContents.push({
        role: msg.role === 'assistant' ? 'model' as const : 'user' as const,
        parts: [{ text: msg.content }],
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      config: {
        maxOutputTokens: 1500,
      },
      contents: geminiContents,
    });

    const assistantText = response.text ?? 'Error generando respuesta.';

    // Track trial usage
    if (isTrial && !profile.trial_used) {
      const admin = createAdminClient();
      await admin
        .from('profiles')
        .update({ trial_used: true, trial_used_at: new Date().toISOString() })
        .eq('id', user.id);
    }

    // Save messages to chat_messages
    const lastUserMsg = messages[messages.length - 1];
    if (lastUserMsg) {
      const admin = createAdminClient();
      await admin.from('chat_messages').insert([
        { user_id: user.id, role: 'user', content: lastUserMsg.content },
        { user_id: user.id, role: 'assistant', content: assistantText },
      ]);
    }

    // Return in a consistent format for the frontend
    return NextResponse.json({
      content: [{ type: 'text', text: assistantText }],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error interno';
    return NextResponse.json(
      { error: `Error conectando con Gemini: ${message}` },
      { status: 500 }
    );
  }
}
