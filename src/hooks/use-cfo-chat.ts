'use client';

import { useState, useCallback, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { ChatMessage, KPIs } from '@/types/domain';
import { buildSystemPrompt, buildContext } from '@/utils/cfo-prompt';

function createMessage(
  role: ChatMessage['role'],
  content: string,
): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    created_at: new Date().toISOString(),
  };
}

export function useCfoChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);

  // Load chat history from Supabase on mount
  useEffect(() => {
    if (historyLoaded) return;

    async function loadHistory() {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;

        const { data } = await supabase
          .from('chat_messages')
          .select('id, role, content, created_at')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: true })
          .limit(50);

        if (data && data.length > 0) {
          setMessages(data as ChatMessage[]);
        }
      } catch {
        // Silently fail — history is optional
      } finally {
        setHistoryLoaded(true);
      }
    }

    loadHistory();
  }, [historyLoaded]);

  const sendChat = useCallback(
    async (
      input: string,
      kpis: KPIs,
      viewPeriod: string,
      growthRate: number,
    ) => {
      if (!input.trim() || chatLoading) return;

      const userMsg = createMessage('user', input);
      setMessages((prev: ChatMessage[]) => [...prev, userMsg]);
      setChatInput('');
      setChatLoading(true);

      try {
        const systemPrompt = buildSystemPrompt(kpis, viewPeriod, growthRate);

        const apiMessages = [
          ...messages.map((m: ChatMessage) => ({
            role: m.role,
            content: m.content,
          })),
          { role: 'user' as const, content: input },
        ];

        const res = await fetch('/api/cfo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system: systemPrompt,
            messages: apiMessages,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ error: `Error ${res.status}` }));
          throw new Error(errorData.error || `API error: ${res.status}`);
        }

        const data: { content: Array<{ text: string }> } = await res.json();
        const assistantText = data.content?.[0]?.text ?? 'Sin respuesta.';
        const assistantMsg = createMessage('assistant', assistantText);

        setMessages((prev: ChatMessage[]) => [...prev, assistantMsg]);
      } catch (err) {
        const errorText =
          err instanceof Error ? err.message : 'Error desconocido';
        const errorMsg = createMessage(
          'assistant',
          `Error al consultar al CFO: ${errorText}`,
        );
        setMessages((prev: ChatMessage[]) => [...prev, errorMsg]);
      } finally {
        setChatLoading(false);
      }
    },
    [messages, chatLoading],
  );

  const runDiagnosis = useCallback(
    async (kpis: KPIs, viewPeriod: string, growthRate: number) => {
      const ctx = buildContext(kpis, viewPeriod, growthRate);
      const diagnosisPrompt = `Realiza un diagnóstico financiero completo. Sé directo y crítico. Identifica el problema más urgente. Usa señales visuales 🔴🟡🟢⚡💡.\n\nDatos:\n${ctx}`;
      await sendChat(diagnosisPrompt, kpis, viewPeriod, growthRate);
    },
    [sendChat],
  );

  const clearHistory = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    chatInput,
    setChatInput,
    chatLoading,
    sendChat,
    runDiagnosis,
    setMessages,
    clearHistory,
    historyLoaded,
  };
}
