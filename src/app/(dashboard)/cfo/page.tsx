'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useTransactions } from '@/hooks/use-transactions';
import { useSettings } from '@/hooks/use-settings';
import { usePeriod } from '@/app/(dashboard)/dashboard-shell';
import { useKpis } from '@/hooks/use-kpis';
import { useCfoChat } from '@/hooks/use-cfo-chat';
import { MarkdownText } from '@/components/cfo/markdown-text';

const QUICK_PROMPTS = [
  '\u00bfEstoy ganando dinero de verdad?',
  '\u00bfCu\u00e1l es mi mayor riesgo?',
  '\u00bfPuedo contratar m\u00e1s gente?',
  '\u00bfQu\u00e9 hago este mes?',
  '\u00bfC\u00f3mo mejoro mi margen?',
  'Analiza mi tendencia',
  '\u00bfCu\u00e1ndo alcanzo el punto de equilibrio?',
] as const;

function getScoreBadgeVariant(score: number): 'success' | 'warning' | 'danger' {
  if (score >= 70) return 'success';
  if (score >= 45) return 'warning';
  return 'danger';
}

export default function CfoPage() {
  const searchParams = useSearchParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialPromptHandled = useRef(false);
  const promptsContainerRef = useRef<HTMLDivElement>(null);

  const { transactions, isLoading: txLoading } = useTransactions();
  const { settings } = useSettings();
  const { viewPeriod, viewYear, viewMonth } = usePeriod();
  const { kpis } = useKpis(transactions, viewPeriod, viewYear, viewMonth);
  const {
    messages,
    chatInput,
    setChatInput,
    chatLoading,
    sendChat,
  } = useCfoChat();

  const growthRate = settings?.growth_rate ?? 5;

  // Auto-fill from URL searchParams
  useEffect(() => {
    if (initialPromptHandled.current) return;
    const prompt = searchParams.get('prompt');
    if (prompt) {
      initialPromptHandled.current = true;
      setChatInput(prompt);
    }
  }, [searchParams, setChatInput]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, chatLoading]);

  function handleSend() {
    if (!chatInput.trim() || chatLoading) return;
    sendChat(chatInput, kpis, viewPeriod, growthRate);
  }

  function handleQuickPrompt(prompt: string) {
    setChatInput(prompt);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  if (txLoading) {
    return <LoadingSpinner className="mt-20" size="lg" />;
  }

  const hasInput = chatInput.trim().length > 0;

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col animate-enter">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <span className="text-black font-bold text-sm">F</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-foreground">
                Franco Garcia
              </h1>
              <span className="w-2 h-2 rounded-full bg-primary inline-block" />
            </div>
            <p className="text-xs text-muted-foreground">
              Consultor financiero con IA
            </p>
          </div>
        </div>
        <Badge variant={getScoreBadgeVariant(kpis.score)} className="tag">
          Health Score: {kpis.score}
        </Badge>
      </div>

      <div className="divider mb-3" />

      {/* Quick prompts - horizontal scroll */}
      <div
        ref={promptsContainerRef}
        className="flex gap-2 overflow-x-auto pb-3 mb-3 scrollbar-none"
        style={{ scrollbarWidth: 'none' }}
      >
        {QUICK_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => handleQuickPrompt(prompt)}
            disabled={chatLoading}
            className={
              'flex-shrink-0 bg-surface border border-border rounded-full px-4 py-1.5 text-xs ' +
              'text-muted-foreground whitespace-nowrap transition-all duration-200 ' +
              'hover:border-primary/40 hover:text-foreground ' +
              'disabled:opacity-40 disabled:cursor-not-allowed'
            }
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto mb-3 space-y-4 pr-1">
        {messages.length === 0 && !chatLoading && (
          <div className="flex-1 flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <span className="text-primary text-xl font-bold">F</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Haz una pregunta sobre tu negocio
              </p>
              <p className="text-xs text-darker mt-1">
                o selecciona una consulta rápida arriba
              </p>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            style={{ animation: 'msgIn 0.3s ease forwards' }}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                <span className="text-black text-xs font-bold">F</span>
              </div>
            )}
            <div
              className={`max-w-[80%] px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-primary text-black rounded-2xl rounded-br-sm shadow-lg'
                  : 'bg-surface border border-border rounded-2xl rounded-bl-sm'
              }`}
            >
              {msg.role === 'assistant' && (
                <p className="font-mono text-[10px] text-primary tracking-wider mb-1.5">
                  Franco Garcia &middot; CFO
                </p>
              )}
              {msg.role === 'assistant' ? (
                <MarkdownText content={msg.content} />
              ) : (
                <div className="text-sm leading-relaxed">
                  {msg.content}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading state: animated dots */}
        {chatLoading && (
          <div
            className="flex justify-start"
            style={{ animation: 'msgIn 0.3s ease forwards' }}
          >
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mr-2 mt-1">
              <span className="text-black text-xs font-bold">F</span>
            </div>
            <div className="bg-surface border border-border rounded-2xl rounded-bl-sm px-4 py-3">
              <p className="font-mono text-[10px] text-primary tracking-wider mb-1.5">
                Franco Garcia &middot; CFO
              </p>
              <div className="flex items-center gap-1 py-1">
                <span className="w-2 h-2 rounded-full bg-primary animate-dot-1" />
                <span className="w-2 h-2 rounded-full bg-primary animate-dot-2" />
                <span className="w-2 h-2 rounded-full bg-primary animate-dot-3" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat input bar */}
      <div className="flex items-center gap-2 bg-surface border-t border-border pt-3 px-1">
        <input
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe tu pregunta..."
          disabled={chatLoading}
          className={
            'flex-1 bg-transparent border-0 text-sm text-foreground py-2 ' +
            'placeholder:text-darker focus:outline-none disabled:opacity-40'
          }
        />
        <button
          onClick={handleSend}
          disabled={chatLoading || !hasInput}
          className={
            'icon-btn transition-all duration-200 ' +
            (hasInput && !chatLoading
              ? 'bg-primary text-black border-primary'
              : 'text-muted-foreground')
          }
          aria-label="Enviar mensaje"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>
    </div>
  );
}
