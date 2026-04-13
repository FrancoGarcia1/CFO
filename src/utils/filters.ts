import type { Transaction } from '@/types/domain';

interface FilterOptions {
  year?: number;
  month?: number | null;
  day?: number | null;
}

/**
 * Parse a date string "YYYY-MM-DD" without timezone conversion.
 * Using new Date("2026-04-01") interprets as UTC midnight, which
 * shifts to previous day in negative UTC offsets. This function
 * extracts parts directly from the string.
 */
function parseDateParts(dateStr: string): { year: number; month: number; day: number } {
  const [y, m, d] = dateStr.split('-').map(Number);
  return { year: y, month: m - 1, day: d }; // month is 0-indexed
}

/**
 * Filter transactions by year, month (0-based), and day.
 */
export function filterTxns(
  all: Transaction[],
  opts: FilterOptions = {},
): Transaction[] {
  const { year = new Date().getFullYear(), month = null, day = null } = opts;

  return all.filter((t) => {
    const d = parseDateParts(t.date);
    if (d.year !== year) return false;
    if (month !== null && month !== undefined && d.month !== month) return false;
    if (day !== null && day !== undefined && d.day !== day) return false;
    return true;
  });
}
