'use client';

import { useMemo } from 'react';
import type { Transaction, ViewPeriod, KPIs } from '@/types/domain';
import { calcFromTxns } from '@/utils/calculations';
import { filterTxns } from '@/utils/filters';
import { MONTHS } from '@/utils/constants';

function todayParts() {
  const t = new Date();
  return { year: t.getFullYear(), month: t.getMonth(), day: t.getDate(), dow: t.getDay() };
}

function parseDateStr(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return { year: y, month: m, day: d }; // month 1-indexed here for comparison
}

function filterByWeek(transactions: Transaction[]): Transaction[] {
  const today = new Date();
  const dow = today.getDay();
  const diff = dow === 0 ? 6 : dow - 1;
  const mondayDate = new Date(today);
  mondayDate.setDate(today.getDate() - diff);
  const monY = mondayDate.getFullYear();
  const monM = mondayDate.getMonth() + 1;
  const monD = mondayDate.getDate();
  const todY = today.getFullYear();
  const todM = today.getMonth() + 1;
  const todD = today.getDate();
  const monVal = monY * 10000 + monM * 100 + monD;
  const todVal = todY * 10000 + todM * 100 + todD;

  return transactions.filter((t) => {
    const p = parseDateStr(t.date);
    const val = p.year * 10000 + p.month * 100 + p.day;
    return val >= monVal && val <= todVal;
  });
}

function filterByDay(transactions: Transaction[]): Transaction[] {
  const { year, month, day } = todayParts();
  const todayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return transactions.filter((t) => t.date === todayStr || t.date.startsWith(todayStr));
}

export function useKpis(
  transactions: Transaction[],
  viewPeriod: ViewPeriod,
  viewYear: number,
  viewMonth: number,
) {
  const filteredTxns = useMemo(() => {
    switch (viewPeriod) {
      case 'day':
        return filterByDay(transactions);
      case 'week':
        return filterByWeek(transactions);
      case 'month':
        return filterTxns(transactions, { year: viewYear, month: viewMonth });
      case 'year':
        return filterTxns(transactions, { year: viewYear });
      default:
        return transactions;
    }
  }, [transactions, viewPeriod, viewYear, viewMonth]);

  const kpis: KPIs = useMemo(
    () => calcFromTxns(filteredTxns),
    [filteredTxns],
  );

  const monthlyData: KPIs[] = useMemo(
    () =>
      MONTHS.map((_, i) =>
        calcFromTxns(filterTxns(transactions, { year: viewYear, month: i })),
      ),
    [transactions, viewYear],
  );

  return { filteredTxns, kpis, monthlyData };
}
