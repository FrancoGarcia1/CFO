'use client';

import { useCallback, useSyncExternalStore } from 'react';
import { CURRENCIES, type CurrencyCode } from '@/utils/constants';

const STORAGE_KEY = 'vcfo_currency';
const DEFAULT_CURRENCY: CurrencyCode = 'PEN';

const listeners = new Set<() => void>();

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot(): CurrencyCode {
  if (typeof window === 'undefined') return DEFAULT_CURRENCY;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && stored in CURRENCIES) return stored as CurrencyCode;
  return DEFAULT_CURRENCY;
}

function getServerSnapshot(): CurrencyCode {
  return DEFAULT_CURRENCY;
}

export function useCurrency() {
  const currency = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setCurrency = useCallback((code: CurrencyCode) => {
    localStorage.setItem(STORAGE_KEY, code);
    listeners.forEach((fn) => fn());
  }, []);

  return { currency, setCurrency };
}
