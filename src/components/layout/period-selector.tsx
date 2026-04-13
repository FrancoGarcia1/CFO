'use client';

import { useState } from 'react';
import { cn } from '@/utils/cn';
import { MONTHS } from '@/utils/constants';
import type { ViewPeriod } from '@/types/domain';

interface PeriodSelectorProps {
  viewPeriod: ViewPeriod;
  viewYear: number;
  viewMonth: number;
  selectedDay?: number;
  onPeriodChange: (period: ViewPeriod) => void;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
  onDayChange?: (day: number) => void;
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

const PERIODS: { value: ViewPeriod; label: string }[] = [
  { value: 'day', label: 'Día' },
  { value: 'week', label: 'Semana' },
  { value: 'month', label: 'Mes' },
  { value: 'year', label: 'Año' },
];

function getPeriodLabel(period: ViewPeriod, year: number, month: number, day?: number): string {
  switch (period) {
    case 'day': return day ? `${day} ${MONTHS[month]} ${year}` : `Hoy · ${MONTHS[month]} ${year}`;
    case 'week': return `Semana · ${MONTHS[month]}`;
    case 'month': return `${MONTHS[month]} ${year}`;
    case 'year': return `Año ${year}`;
  }
}

export function PeriodSelector({
  viewPeriod,
  viewYear,
  viewMonth,
  selectedDay,
  onPeriodChange,
  onYearChange,
  onMonthChange,
  onDayChange,
}: PeriodSelectorProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 4 }, (_, i) => currentYear - 2 + i);
  const label = getPeriodLabel(viewPeriod, viewYear, viewMonth, selectedDay);

  return (
    <>
      {/* ── Desktop: inline selector ── */}
      <div className="hidden sm:flex items-center gap-3 py-2">
        {/* Period buttons */}
        <div className="flex items-center">
          {PERIODS.map((p, i) => (
            <span key={p.value} className="flex items-center">
              <button
                onClick={() => onPeriodChange(p.value)}
                className={cn(
                  'px-2 py-1 text-xs transition-colors',
                  viewPeriod === p.value
                    ? 'font-medium text-primary'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {p.label}
              </button>
              {i < PERIODS.length - 1 && <span className="text-border text-[10px]">|</span>}
            </span>
          ))}
        </div>

        <span className="text-border">·</span>

        {/* Years */}
        <div className="flex items-center">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => onYearChange(year)}
              className={cn(
                'px-1.5 py-1 text-xs font-mono transition-colors',
                viewYear === year ? 'font-medium text-primary' : 'text-darker hover:text-foreground',
              )}
            >
              {year}
            </button>
          ))}
        </div>

        {/* Months */}
        {viewPeriod !== 'year' && (
          <>
            <span className="text-border">·</span>
            <div className="flex">
              {MONTHS.map((month, i) => (
                <button
                  key={month}
                  onClick={() => onMonthChange(i)}
                  className={cn(
                    'px-1 py-1 text-[11px] font-mono transition-colors',
                    viewMonth === i ? 'font-medium text-primary' : 'text-darker hover:text-foreground',
                  )}
                >
                  {month}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Label */}
        <div className="ml-auto text-xs font-medium text-primary font-mono">
          {label}
        </div>
      </div>

      {/* ── Mobile: compact trigger + bottom sheet ── */}
      <div className="sm:hidden py-2">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center justify-between w-full"
        >
          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span className="text-xs font-medium text-primary font-mono">{label}</span>
          </div>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>

      {/* ── Bottom Sheet Modal ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[200] sm:hidden" onClick={() => setMobileOpen(false)}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60" style={{ animation: 'fadeIn 0.2s ease' }} />

          {/* Sheet */}
          <div
            className="absolute bottom-0 left-0 right-0 bg-surface rounded-t-2xl p-5 pb-8"
            style={{ animation: 'slideUp 0.25s ease' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="w-10 h-1 rounded-full bg-border mx-auto mb-5" />

            <h3 className="text-sm font-semibold text-foreground mb-4">Seleccionar período</h3>

            {/* Period type */}
            <div className="mb-4">
              <p className="micro-label mb-2">Período</p>
              <div className="grid grid-cols-4 gap-2">
                {PERIODS.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => onPeriodChange(p.value)}
                    className={cn(
                      'py-2.5 rounded-lg text-xs font-medium transition-all',
                      viewPeriod === p.value
                        ? 'bg-primary text-black'
                        : 'bg-surface-2 text-muted-foreground',
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Year */}
            <div className="mb-4">
              <p className="micro-label mb-2">Año</p>
              <div className="grid grid-cols-4 gap-2">
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => onYearChange(year)}
                    className={cn(
                      'py-2.5 rounded-lg text-xs font-mono font-medium transition-all',
                      viewYear === year
                        ? 'bg-primary text-black'
                        : 'bg-surface-2 text-muted-foreground',
                    )}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            {/* Month */}
            {viewPeriod !== 'year' && (
              <div className="mb-4">
                <p className="micro-label mb-2">Mes</p>
                <div className="grid grid-cols-4 gap-2">
                  {MONTHS.map((month, i) => (
                    <button
                      key={month}
                      onClick={() => onMonthChange(i)}
                      className={cn(
                        'py-2.5 rounded-lg text-xs font-mono font-medium transition-all',
                        viewMonth === i
                          ? 'bg-primary text-black'
                          : 'bg-surface-2 text-muted-foreground',
                      )}
                    >
                      {month}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Day — only when period is 'day' */}
            {viewPeriod === 'day' && (
              <div className="mb-5">
                <p className="micro-label mb-2">Día</p>
                <div className="grid grid-cols-7 gap-1.5 max-h-[180px] overflow-y-auto">
                  {Array.from({ length: daysInMonth(viewYear, viewMonth) }, (_, i) => i + 1).map((day) => {
                    const isToday =
                      day === new Date().getDate() &&
                      viewMonth === new Date().getMonth() &&
                      viewYear === new Date().getFullYear();
                    return (
                      <button
                        key={day}
                        onClick={() => onDayChange?.(day)}
                        className={cn(
                          'py-2 rounded-lg text-xs font-mono font-medium transition-all',
                          selectedDay === day
                            ? 'bg-primary text-black'
                            : isToday
                              ? 'bg-primary/20 text-primary'
                              : 'bg-surface-2 text-muted-foreground',
                        )}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Apply button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="w-full py-3 rounded-lg bg-primary text-black font-semibold text-sm transition-colors hover:brightness-90"
            >
              Aplicar — {label}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
