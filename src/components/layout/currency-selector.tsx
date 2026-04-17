'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/cn';
import { CURRENCIES, type CurrencyCode } from '@/utils/constants';
import { useCurrency } from '@/hooks/use-currency';

const CURRENCY_LIST = Object.values(CURRENCIES);

export function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const current = CURRENCIES[currency];

  const filtered = CURRENCY_LIST.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q);
  });

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors',
          'text-dim hover:text-foreground hover:bg-border',
        )}
        aria-label="Cambiar moneda"
      >
        <span className="text-sm leading-none">{current.flag}</span>
        <span className="font-mono font-semibold">{current.code}</span>
        <svg width="9" height="9" viewBox="0 0 12 12" fill="none" className="opacity-50">
          <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 w-[260px] rounded-lg border border-border bg-card shadow-2xl overflow-hidden">
          <div className="p-2 border-b border-border">
            <input
              type="text"
              placeholder="Buscar moneda..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-xs py-1.5 px-2 text-foreground outline-none placeholder:text-dim"
              autoFocus
            />
          </div>
          <div className="max-h-[280px] overflow-y-auto py-1">
            {filtered.length === 0 && (
              <p className="text-center text-[11px] text-dim py-4">No encontrada</p>
            )}
            {filtered.map((c) => {
              const code = c.code as CurrencyCode;
              const isActive = code === currency;
              return (
                <button
                  key={code}
                  onClick={() => {
                    setCurrency(code);
                    setOpen(false);
                    setSearch('');
                  }}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 text-xs transition-colors text-left',
                    isActive
                      ? 'bg-border-hover text-primary'
                      : 'text-dim hover:text-foreground hover:bg-border',
                  )}
                >
                  <span className="text-base leading-none">{c.flag}</span>
                  <span className="font-mono font-semibold w-10">{c.code}</span>
                  <span className="text-muted-foreground text-[10px] w-8">{c.symbol}</span>
                  <span className="text-[11px] flex-1 truncate">{c.name}</span>
                  {isActive && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
