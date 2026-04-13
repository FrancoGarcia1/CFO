'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { TabNavigation } from '@/components/layout/tab-navigation';
import { PeriodSelector } from '@/components/layout/period-selector';
import { useTransactions } from '@/hooks/use-transactions';
import type { ViewPeriod } from '@/types/domain';

interface PeriodContextValue {
  viewPeriod: ViewPeriod;
  viewYear: number;
  viewMonth: number;
  setViewPeriod: (period: ViewPeriod) => void;
  setViewYear: (year: number) => void;
  setViewMonth: (month: number) => void;
}

const PeriodContext = createContext<PeriodContextValue>({
  viewPeriod: 'month',
  viewYear: new Date().getFullYear(),
  viewMonth: new Date().getMonth(),
  setViewPeriod: () => {},
  setViewYear: () => {},
  setViewMonth: () => {},
});

export function usePeriod() {
  return useContext(PeriodContext);
}

function OnboardingBanner() {
  const { transactions, isLoading } = useTransactions();

  if (isLoading || transactions.length > 0) return null;

  return (
    <div className="max-w-[1120px] mx-auto px-4 pt-4">
      <div className="flex items-center justify-between gap-4 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3">
        <p className="text-sm text-foreground">
          <span className="font-semibold text-primary">¡Bienvenido!</span>{' '}
          Configura tus datos financieros iniciales para comenzar.
        </p>
        <Link
          href="/onboarding"
          className="shrink-0 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-primary/90"
        >
          Configurar →
        </Link>
      </div>
    </div>
  );
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const now = new Date();
  const [viewPeriod, setViewPeriod] = useState<ViewPeriod>('month');
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());

  return (
    <PeriodContext.Provider
      value={{
        viewPeriod,
        viewYear,
        viewMonth,
        setViewPeriod,
        setViewYear,
        setViewMonth,
      }}
    >
      <div className="min-h-screen bg-background">
        <Header />
        <TabNavigation />
        <div className="border-b border-border bg-surface no-print overflow-hidden">
          <div className="max-w-[1200px] mx-auto px-3 sm:px-5">
            <PeriodSelector
              viewPeriod={viewPeriod}
              viewYear={viewYear}
              viewMonth={viewMonth}
              onPeriodChange={setViewPeriod}
              onYearChange={setViewYear}
              onMonthChange={setViewMonth}
            />
          </div>
        </div>
        <OnboardingBanner />
        <main className="mx-auto max-w-[1200px] px-3 py-4 sm:px-5">
          {children}
        </main>
      </div>
    </PeriodContext.Provider>
  );
}
