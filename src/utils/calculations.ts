import type {
  Transaction,
  Historical,
  ForecastMonth,
  KPIs,
  SimulatorState,
  SimulatorResult,
} from '@/types/domain';
import { MONTHS } from '@/utils/constants';
import { filterTxns } from '@/utils/filters';

/**
 * Aggregate transactions into KPIs including health score.
 * Port of App.jsx calcFromTxns (lines 48-66).
 */
export function calcFromTxns(txns: Transaction[]): KPIs {
  const income = txns
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0);
  const cost = txns
    .filter((t) => t.type === 'cost')
    .reduce((s, t) => s + t.amount, 0);
  const expense = txns
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);

  const grossProfit = income - cost;
  const ebitda = grossProfit - expense;
  const margenBruto = income > 0 ? (grossProfit / income) * 100 : 0;
  const margenEbitda = income > 0 ? (ebitda / income) * 100 : 0;
  const costoRatio = income > 0 ? ((cost + expense) / income) * 100 : 0;
  const pe = margenBruto > 0 ? expense / (margenBruto / 100) : 0;
  const countIncome = txns.filter((t) => t.type === 'income').length;
  const avgTicket = countIncome > 0 ? income / countIncome : 0;

  // Health score algorithm — exact port
  let score = 50;
  if (margenBruto >= 50) score += 15;
  else if (margenBruto >= 30) score += 8;
  else if (margenBruto < 15) score -= 20;

  if (margenEbitda >= 15) score += 15;
  else if (margenEbitda >= 5) score += 5;
  else if (margenEbitda < 0) score -= 25;

  if (costoRatio < 70) score += 10;
  else if (costoRatio > 90) score -= 15;

  score = Math.max(0, Math.min(100, Math.round(score)));

  return {
    income,
    cost,
    expense,
    grossProfit,
    ebitda,
    margenBruto,
    margenEbitda,
    costoRatio,
    pe,
    countIncome,
    avgTicket,
    score,
  };
}

/**
 * Build 12-month forecast from historical data.
 * Port of App.jsx calcForecast (lines 78-83).
 */
export function calcForecast(
  historical: Historical[],
  growthRate: number,
): ForecastMonth[] {
  const byMonth: Record<
    number,
    { income: number; cost: number; expense: number }
  > = {};

  historical.forEach((h) => {
    const k = h.month;
    byMonth[k] = {
      income: (byMonth[k]?.income ?? 0) + h.income,
      cost: (byMonth[k]?.cost ?? 0) + h.cost,
      expense: (byMonth[k]?.expense ?? 0) + h.expense,
    };
  });

  const r = growthRate / 100;

  return MONTHS.map((_, i) => ({
    month: i,
    projIncome: (byMonth[i]?.income ?? 0) * (1 + r),
    projCost: (byMonth[i]?.cost ?? 0) * (1 + r),
    projExpense: (byMonth[i]?.expense ?? 0) * (1 + r),
  }));
}

/**
 * Rolling adjustment: compare last 3 months actual vs projected,
 * blend 60% current + 40% adjusted, clamp to 3-15%.
 * Port of App.jsx rollingAdjust (lines 85-95).
 */
export function rollingAdjust(
  transactions: Transaction[],
  forecast: ForecastMonth[],
  currentRate: number,
): number {
  const now = new Date();
  const cm = now.getMonth();
  const cy = now.getFullYear();
  const months = [cm - 2, cm - 1, cm].filter((m) => m >= 0);

  if (months.length < 2) return currentRate;

  const actualSum = months.reduce(
    (s, m) =>
      s +
      filterTxns(transactions, { year: cy, month: m })
        .filter((t) => t.type === 'income')
        .reduce((ss, t) => ss + t.amount, 0),
    0,
  );

  const projSum = months.reduce(
    (s, m) => s + (forecast[m]?.projIncome ?? 0),
    0,
  );

  if (projSum === 0) return currentRate;

  const variance = (actualSum / projSum - 1) * 100;
  const adjusted = Math.max(3, currentRate + variance * 0.3);
  const blended = currentRate * 0.6 + adjusted * 0.4;

  return Math.max(3, Math.min(15, Math.round(blended * 10) / 10));
}

/**
 * Simulate P&L changes by applying percentage shifts.
 * Port of App.jsx simResult useMemo (lines 441-447).
 */
export function calcSimulation(
  kpis: KPIs,
  simState: SimulatorState,
): SimulatorResult {
  const income = kpis.income * (1 + simState.income / 100);
  const cost = kpis.cost * (1 + simState.cost / 100);
  const expense = kpis.expense * (1 + simState.expense / 100);
  const grossProfit = income - cost;
  const ebitda = grossProfit - expense;

  return {
    income,
    cost,
    expense,
    grossProfit,
    ebitda,
    margenBruto: income > 0 ? (grossProfit / income) * 100 : 0,
    margenEbitda: income > 0 ? (ebitda / income) * 100 : 0,
    deltaEbitda: ebitda - kpis.ebitda,
  };
}
