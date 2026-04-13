import type { Transaction, TransactionType } from '@/types/domain';
import { CATS } from '@/utils/constants';

/**
 * RFC 4180-compliant CSV parser.
 * Handles quoted fields with embedded commas, newlines, and escaped quotes.
 * The original prototype used `line.split(",")` which breaks on quoted commas.
 */
export function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;
  let i = 0;

  while (i < line.length) {
    const ch = line[i];

    if (inQuotes) {
      if (ch === '"') {
        // Check for escaped quote ("")
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i += 2;
        } else {
          // End of quoted field
          inQuotes = false;
          i++;
        }
      } else {
        current += ch;
        i++;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
        i++;
      } else if (ch === ',') {
        fields.push(current.trim());
        current = '';
        i++;
      } else {
        current += ch;
        i++;
      }
    }
  }

  // Push last field
  fields.push(current.trim());

  return fields;
}

/**
 * Parse a full CSV string into an array of string arrays.
 * Handles both \r\n and \n line endings, and multi-line quoted fields.
 */
export function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  const lines = text.trim().replace(/\r\n/g, '\n').split('\n');

  let pendingLine = '';
  let inQuotes = false;

  for (const rawLine of lines) {
    if (inQuotes) {
      // Continue accumulating a multi-line quoted field
      pendingLine += '\n' + rawLine;
    } else {
      pendingLine = rawLine;
    }

    // Count unescaped quotes to determine if we're inside a quoted field
    let quoteCount = 0;
    for (let i = 0; i < pendingLine.length; i++) {
      if (pendingLine[i] === '"') quoteCount++;
    }
    inQuotes = quoteCount % 2 !== 0;

    if (!inQuotes) {
      rows.push(parseCSVLine(pendingLine));
      pendingLine = '';
    }
  }

  // If there's leftover (unclosed quote), parse what we have
  if (pendingLine) {
    rows.push(parseCSVLine(pendingLine));
  }

  return rows;
}

const TYPE_MAP: Record<string, TransactionType> = {
  ingreso: 'income',
  costo: 'cost',
  gasto: 'expense',
  income: 'income',
  cost: 'cost',
  expense: 'expense',
};

/**
 * Parse uploaded CSV text into Transaction objects.
 * Port of App.jsx parseCSVUpload (lines 133-143), upgraded to use
 * the RFC 4180-compliant parser instead of naive split(",").
 */
export function parseCSVUpload(text: string): Omit<Transaction, 'user_id' | 'created_at'>[] {
  const rows = parseCSV(text);
  if (rows.length < 2) return [];

  const headers = rows[0].map((h) =>
    h.replace(/"/g, '').trim().toLowerCase(),
  );

  return rows
    .slice(1)
    .map((vals) => {
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => {
        obj[h] = (vals[i] ?? '').replace(/"/g, '').trim();
      });

      const rawType = (obj.tipo ?? obj.type ?? 'ingreso').toLowerCase();
      const type: TransactionType = TYPE_MAP[rawType] ?? 'income';

      return {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        date:
          obj.fecha ?? obj.date ?? new Date().toISOString().slice(0, 10),
        period: (obj['período'] ?? obj.period ?? 'monthly') as Transaction['period'],
        type,
        category:
          obj['categoría'] ?? obj.categoria ?? obj.category ?? CATS[type][0],
        concept: obj.concepto ?? obj.concept ?? 'Sin concepto',
        amount: parseFloat(obj.monto ?? obj.amount ?? '0'),
        note: obj.nota ?? obj.note ?? null,
      };
    })
    .filter((t) => t.amount > 0);
}
