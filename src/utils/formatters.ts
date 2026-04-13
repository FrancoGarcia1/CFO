import { COLORS, CURRENCIES, type CurrencyCode } from '@/utils/constants';

const formatterCache = new Map<string, Intl.NumberFormat>();

function getCurrencyFormatter(currency: CurrencyCode): Intl.NumberFormat {
  const cached = formatterCache.get(currency);
  if (cached) return cached;

  const config = CURRENCIES[currency];
  const formatter = new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.code,
    maximumFractionDigits: 0,
  });
  formatterCache.set(currency, formatter);
  return formatter;
}

const numberFormatter = new Intl.NumberFormat('es-PE', {
  maximumFractionDigits: 0,
});

/** Format as currency: "S/ 10,000" (PEN default) */
export function fmt(
  n: number | null | undefined,
  currency: CurrencyCode = 'PEN',
): string {
  if (n == null) return '—';
  return getCurrencyFormatter(currency).format(n);
}

/** Format as plain number: "10,000" */
export function fmtN(n: number | null | undefined): string {
  return numberFormatter.format(n ?? 0);
}

/** Format as signed percentage: "+5.2%" or "-3.1%" */
export function pctStr(n: number): string {
  return `${n >= 0 ? '+' : ''}${n.toFixed(1)}%`;
}

/** Return color string based on sign of value */
export function clr(
  v: number,
  positive: string = COLORS.positive,
  negative: string = COLORS.negative,
): string {
  if (v > 0) return positive;
  if (v < 0) return negative;
  return COLORS.neutral;
}
