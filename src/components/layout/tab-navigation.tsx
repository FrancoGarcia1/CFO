'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSyncExternalStore } from 'react';
import { cn } from '@/utils/cn';

interface Tab {
  href: string;
  label: string;
}

const BASE_TABS: Tab[] = [
  { href: '/entrada', label: 'Entrada' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/forecast', label: 'Forecast' },
  { href: '/simulador', label: 'Simulador' },
  { href: '/cfo', label: 'Conversemos' },
  { href: '/reportes', label: 'Reportes' },
];

const ADVISOR_TAB: Tab = { href: '/asesor', label: 'Asesor' };

const ADVISOR_KEY = 'vcfo_advisor_mode';

function subscribeToStorage(callback: () => void): () => void {
  function handleStorage(e: StorageEvent) {
    if (e.key === ADVISOR_KEY) callback();
  }
  window.addEventListener('storage', handleStorage);
  return () => window.removeEventListener('storage', handleStorage);
}

function getAdvisorSnapshot(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(ADVISOR_KEY) === 'true';
}

function getServerSnapshot(): boolean {
  return false;
}

export function TabNavigation() {
  const pathname = usePathname();
  const isAdvisor = useSyncExternalStore(
    subscribeToStorage,
    getAdvisorSnapshot,
    getServerSnapshot,
  );

  const tabs = isAdvisor ? [...BASE_TABS, ADVISOR_TAB] : BASE_TABS;

  return (
    <nav className="border-b border-border bg-surface no-print">
      <div className="mx-auto flex max-w-[1200px] gap-1 sm:gap-4 overflow-x-auto px-3 sm:px-5" style={{ scrollbarWidth: 'none' }}>
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'relative whitespace-nowrap py-2.5 sm:py-3 px-2 sm:px-1 text-[11px] sm:text-xs transition-colors',
                isActive
                  ? 'font-medium text-primary'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 h-0.5 w-full bg-primary" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
