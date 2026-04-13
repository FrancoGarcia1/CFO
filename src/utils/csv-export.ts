import type { Transaction, KPIs } from '@/types/domain';
import { TYPE_LABELS } from '@/utils/constants';

/** Escape a CSV cell value (RFC 4180) */
function escapeCell(value: string | number): string {
  const str = String(value);
  return `"${str.replace(/"/g, '""')}"`;
}

/** Build a CSV string from rows of values */
function buildCSV(rows: (string | number)[][]): string {
  return rows.map((r) => r.map(escapeCell).join(',')).join('\n');
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
 * Export all transactions as CSV.
 * Port of App.jsx exportCSV (lines 108-114).
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
  downloadCSV(csv, `vCFO_${date}.csv`);
}

/**
 * Export P&L summary as CSV.
 * Port of App.jsx exportPnLCSV (lines 116-131).
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
  downloadCSV(csv, `vCFO_PnL_${date}.csv`);
}

/**
 * Download a blank CSV template for transaction import.
 * Port of App.jsx downloadTemplate (lines 145-149).
 */
export function downloadTemplate(): void {
  const today = new Date().toISOString().slice(0, 10);
  const rows: (string | number)[][] = [
    [
      'fecha',
      'período',
      'tipo',
      'categoría',
      'concepto',
      'monto',
      'nota',
    ],
    [today, 'monthly', 'Ingreso', 'Ventas productos', 'Venta enero', 5000, ''],
    [
      today,
      'monthly',
      'Costo',
      'Materia prima',
      'Compra insumos',
      2000,
      'Proveedor X',
    ],
    [
      today,
      'monthly',
      'Gasto',
      'Marketing y publicidad',
      'Publicidad digital',
      500,
      '',
    ],
  ];

  const csv = buildCSV(rows);
  downloadCSV(csv, 'plantilla_vCFO.csv');
}
