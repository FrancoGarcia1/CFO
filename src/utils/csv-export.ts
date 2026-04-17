import type { Transaction, KPIs } from '@/types/domain';
import { TYPE_LABELS } from '@/utils/constants';

/**
 * CSV delimiter — using `;` for better Excel compatibility in ES/LATAM locales.
 * Excel en español interpreta `,` como decimal y `;` como separador de columnas.
 */
const DELIMITER = ';';

/** Escape a CSV cell value (RFC 4180 with custom delimiter) */
function escapeCell(value: string | number): string {
  const str = String(value);
  // Quote if contains delimiter, quotes, or newlines
  if (str.includes(DELIMITER) || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/** Build a CSV string from rows of values */
function buildCSV(rows: (string | number)[][]): string {
  // Prepend "sep=;" hint for Excel to force the delimiter
  const hint = `sep=${DELIMITER}\n`;
  const body = rows.map((r) => r.map(escapeCell).join(DELIMITER)).join('\n');
  return hint + body;
}

/** Trigger a CSV file download in the browser */
function downloadCSV(csv: string, filename: string): void {
  const bom = '\ufeff'; // UTF-8 BOM for Excel compatibility
  const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Export all transactions as CSV (one transaction per row).
 */
export function exportCSV(transactions: Transaction[]): void {
  const headers: string[] = [
    'Fecha',
    'Período',
    'Tipo',
    'Categoría',
    'Concepto',
    'Monto (S/)',
    'Nota',
  ];

  const rows = transactions.map((t) => [
    t.date,
    t.period,
    TYPE_LABELS[t.type],
    t.category,
    t.concept,
    t.amount,
    t.note ?? '',
  ]);

  const csv = buildCSV([headers, ...rows]);
  const date = new Date().toISOString().slice(0, 10);
  downloadCSV(csv, `CapitalCFO_Transacciones_${date}.csv`);
}

/**
 * Export P&L summary as CSV — basic format.
 */
export function exportPnLCSV(data: KPIs): void {
  const rows: (string | number)[][] = [
    ['Concepto', 'Monto (S/)', '% Ingresos'],
    ['INGRESOS', data.income, '100%'],
    [
      '(-) Costo de ventas',
      data.cost,
      `${data.income > 0 ? ((data.cost / data.income) * 100).toFixed(1) : 0}%`,
    ],
    [
      '= Utilidad Bruta',
      data.grossProfit,
      `${data.margenBruto.toFixed(1)}%`,
    ],
    [
      '(-) Gastos operativos',
      data.expense,
      `${data.income > 0 ? ((data.expense / data.income) * 100).toFixed(1) : 0}%`,
    ],
    ['= EBITDA', data.ebitda, `${data.margenEbitda.toFixed(1)}%`],
    ['Punto de equilibrio', data.pe, ''],
    ['Ticket promedio', data.avgTicket, ''],
    ['Health Score', `${data.score}/100`, ''],
  ];

  const csv = buildCSV(rows);
  const date = new Date().toISOString().slice(0, 10);
  downloadCSV(csv, `CapitalCFO_PnL_${date}.csv`);
}

/**
 * Export P&L Gerencial anual — formato tipo informe.
 * Cada mes en su columna, secciones A/B/C, totales y márgenes.
 * Estilo Peru on Ice Informe.
 */
export function exportPnLGerencialCSV(params: {
  transactions: Transaction[];
  year: number;
  empresa?: string;
  ruc?: string;
}): void {
  const { transactions, year, empresa = 'MI EMPRESA', ruc = '' } = params;
  const MONTHS = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];

  // Aggregate by month + type + category
  const byMonth: number[][] = Array.from({ length: 12 }, () => Array(3).fill(0)); // [month][0=income, 1=cost, 2=expense]
  const byCategory: Record<string, { type: string; months: number[] }> = {};

  for (const t of transactions) {
    const [y, m] = t.date.split('-').map(Number);
    if (y !== year) continue;
    const monthIdx = m - 1;

    const typeIdx = t.type === 'income' ? 0 : t.type === 'cost' ? 1 : 2;
    byMonth[monthIdx][typeIdx] += Number(t.amount);

    const key = `${t.type}::${t.category}`;
    if (!byCategory[key]) {
      byCategory[key] = { type: t.type, months: Array(12).fill(0) };
    }
    byCategory[key].months[monthIdx] += Number(t.amount);
  }

  const totalIncome = byMonth.reduce((s, m) => s + m[0], 0);
  const totalCost = byMonth.reduce((s, m) => s + m[1], 0);
  const totalExpense = byMonth.reduce((s, m) => s + m[2], 0);

  const pct = (val: number) => totalIncome > 0 ? `${((val / totalIncome) * 100).toFixed(2)}%` : '0.00%';

  const incomeCategories = Object.entries(byCategory).filter(([, v]) => v.type === 'income');
  const costCategories = Object.entries(byCategory).filter(([, v]) => v.type === 'cost');
  const expenseCategories = Object.entries(byCategory).filter(([, v]) => v.type === 'expense');

  const rows: (string | number)[][] = [];

  // Header
  rows.push([`${empresa} — P&L GERENCIAL ${year}`]);
  if (ruc) rows.push([`RUC: ${ruc}  |  Moneda: S/ Soles  |  Ejercicio: Enero–Diciembre ${year}`]);
  rows.push([]);

  // Column headers
  rows.push(['CONCEPTO', ...MONTHS, 'TOTAL ANUAL', '% REV.']);

  // A. INGRESOS
  rows.push(['A. INGRESOS']);
  incomeCategories.forEach(([key, v]) => {
    const cat = key.split('::')[1];
    const total = v.months.reduce((s, m) => s + m, 0);
    rows.push([cat, ...v.months, total, pct(total)]);
  });
  const totalIncomeRow = [
    'TOTAL INGRESOS',
    ...byMonth.map((m) => m[0]),
    totalIncome,
    '100.00%',
  ];
  rows.push(totalIncomeRow);
  rows.push([]);

  // B. COSTOS
  rows.push(['B. COSTOS']);
  costCategories.forEach(([key, v]) => {
    const cat = key.split('::')[1];
    const total = v.months.reduce((s, m) => s + m, 0);
    rows.push([cat, ...v.months, total, pct(total)]);
  });
  rows.push([
    'TOTAL COSTOS',
    ...byMonth.map((m) => m[1]),
    totalCost,
    pct(totalCost),
  ]);
  rows.push([]);

  // Utilidad Bruta
  const grossByMonth = byMonth.map((m) => m[0] - m[1]);
  const grossTotal = totalIncome - totalCost;
  rows.push([
    '★ UTILIDAD BRUTA (A − B)',
    ...grossByMonth,
    grossTotal,
    pct(grossTotal),
  ]);
  const marginBrutoByMonth = byMonth.map((m) => m[0] > 0 ? `${((m[0] - m[1]) / m[0] * 100).toFixed(2)}%` : '0%');
  rows.push([
    'Margen Bruto (%)',
    ...marginBrutoByMonth,
    totalIncome > 0 ? `${((grossTotal / totalIncome) * 100).toFixed(2)}%` : '0%',
    '',
  ]);
  rows.push([]);

  // C. GASTOS
  rows.push(['C. GASTOS OPERATIVOS']);
  expenseCategories.forEach(([key, v]) => {
    const cat = key.split('::')[1];
    const total = v.months.reduce((s, m) => s + m, 0);
    rows.push([cat, ...v.months, total, pct(total)]);
  });
  rows.push([
    'TOTAL GASTOS',
    ...byMonth.map((m) => m[2]),
    totalExpense,
    pct(totalExpense),
  ]);
  rows.push([]);

  // EBITDA
  const ebitdaByMonth = byMonth.map((m) => m[0] - m[1] - m[2]);
  const ebitdaTotal = totalIncome - totalCost - totalExpense;
  rows.push([
    '★ EBITDA (Utilidad Bruta − C)',
    ...ebitdaByMonth,
    ebitdaTotal,
    pct(ebitdaTotal),
  ]);
  const marginEbitdaByMonth = byMonth.map((m) => m[0] > 0 ? `${(((m[0] - m[1] - m[2]) / m[0]) * 100).toFixed(2)}%` : '0%');
  rows.push([
    'Margen EBITDA (%)',
    ...marginEbitdaByMonth,
    totalIncome > 0 ? `${((ebitdaTotal / totalIncome) * 100).toFixed(2)}%` : '0%',
    '',
  ]);

  const csv = buildCSV(rows);
  downloadCSV(csv, `CapitalCFO_PnL_Gerencial_${year}.csv`);
}

/**
 * Download a blank CSV template for transaction import.
 * Uses `;` delimiter so Excel opens it with one field per cell.
 */
export function downloadTemplate(): void {
  const today = new Date().toISOString().slice(0, 10);
  const rows: (string | number)[][] = [
    ['fecha', 'período', 'tipo', 'categoría', 'concepto', 'monto', 'nota'],
    [today, 'monthly', 'Ingreso', 'Ventas productos', 'Venta enero', 5000, ''],
    [today, 'monthly', 'Costo', 'Materia prima', 'Compra insumos', 2000, 'Proveedor X'],
    [today, 'monthly', 'Gasto', 'Marketing y publicidad', 'Publicidad digital', 500, ''],
  ];

  const csv = buildCSV(rows);
  downloadCSV(csv, 'plantilla_CapitalCFO.csv');
}
