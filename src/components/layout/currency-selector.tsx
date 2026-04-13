'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/cn';
import { CURRENCIES, type CurrencyCode } from '@/utils/constants';
import { useCurrency } from '@/hooks/use-currency';

const CURRENCY_FLAGS: Record<CurrencyCode, string> = {
  PEN: 'PE',
  USD: 'US',
  COP: 'CO',
  MXN: 'MX',
};

const CURRENCY_LIST = Object.values(CURRENCIES);

export function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const current = CURRENCIES[currency];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors',
          'text-dim hover:text-foreground hover:bg-border',
        )}
        aria-label="Cambiar moneda"
      >
        <span className="text-xs">{CURRENCY_FLAGS[currency]}</span>
        <span>{current.code}</span>
        <span className="text-[9px] opacity-60">&#x25BC;</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 min-w-[180px] rounded-lg border border-border bg-card shadow-lg py-1">
          {CURRENCY_LIST.map((c) => {
            const code = c.code as CurrencyCode;
            const isActive = code === currency;
            return (
              <button
                key={code}
                onClick={() => {
                  setCurrency(code);
                  setOpen(false);
                }}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-1.5 text-xs transition-colors text-left',
                  isActive
                    ? 'bg-border-hover text-primary'
                    : 'text-dim hover:text-foreground hover:bg-border',
                )}
              >
                <span className="text-sm">{CURRENCY_FLAGS[code]}</span>
                <span className="font-medium">{code}</span>
                <span className="text-[10px] text-muted-foreground">{c.symbol} {c.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
