/**
 * P&L Gerencial XLSX Export — clone del informe Peru On Ice.
 * 8 hojas con fórmulas vivas, estilos, vínculos entre sheets y charts.
 *
 * Estructura:
 *   1. P&L Gerencial          — cuentas contables × 12 meses con SUM y márgenes
 *   2. Dashboard              — KPIs grandes + tabla mensual (charts se generan en Excel al abrir)
 *   3. Comparativo vs PSTO    — Real vs PL anterior vs Ppto con variaciones
 *   4. Indicadores Operativos — tarifas, ticket, ocupación, horas disponibles
 *   5. Punto de Equilibrio    — costos fijos/variables + sensibilidad
 *   6. Estrategia de Precios  — estructura tarifas con IGV + simulación
 *   7. Simulador              — tarifas editables + volumen + EBITDA
 *   8. Datos 2026             — base PCGE mensual
 */

import ExcelJS from 'exceljs';
import type { Transaction } from '@/types/domain';

const MONTHS = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
const MONTH_COLS = ['C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'];

/* ═══ Paleta (coherente con la marca Capital CFO) ═══ */
const C = {
  black: 'FF0A0A0A',
  gold: 'FFC8A15A',
  goldLight: 'FFD4B577',
  goldFoil: 'FFE6C88A',
  goldPale: 'FFF5E9D0',
  ivory: 'FFF5F0E8',
  muted: 'FFA8A19A',
  dim: 'FF6B6660',
  positive: 'FFA8C47A',
  negative: 'FFD9925A',
  danger: 'FFEF4444',
  warning: 'FFD9925A',
  bgSection: 'FF1A1410',
  bgHeader: 'FF0F0B08',
  bgRow: 'FFFFFFFF',
  bgRowAlt: 'FFFAF7F2',
  border: 'FFDDD4C3',
};

type ExportParams = {
  transactions: Transaction[];
  year: number;
  empresa?: string;
  ruc?: string;
  moneda?: string;
};

/* ═══════════════════════════════════════════════════════
   Helpers de estilo
   ═══════════════════════════════════════════════════════ */

function styleTitle(cell: ExcelJS.Cell) {
  cell.font = { name: 'Calibri', size: 16, bold: true, color: { argb: C.ivory } };
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.black } };
  cell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
}

function styleSubtitle(cell: ExcelJS.Cell) {
  cell.font = { name: 'Calibri', size: 10, italic: true, color: { argb: C.muted } };
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.black } };
  cell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
}

function styleHeaderRow(row: ExcelJS.Row) {
  row.eachCell((cell) => {
    cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: C.black } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.gold } };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
      top: { style: 'thin', color: { argb: C.goldLight } },
      bottom: { style: 'medium', color: { argb: C.black } },
    };
  });
}

function styleSectionHeader(cell: ExcelJS.Cell) {
  cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: C.ivory } };
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.bgSection } };
  cell.alignment = { vertical: 'middle', horizontal: 'left', indent: 0 };
}

function styleConcept(cell: ExcelJS.Cell, bold = false, indent = 1) {
  cell.font = { name: 'Calibri', size: 10, bold, color: { argb: C.black } };
  cell.alignment = { vertical: 'middle', horizontal: 'left', indent };
}

function styleMoney(cell: ExcelJS.Cell, bold = false, negative = false) {
  cell.font = {
    name: 'Calibri',
    size: 10,
    bold,
    color: { argb: negative ? C.negative : C.black },
  };
  cell.numFmt = '#,##0.00;[Red]-#,##0.00;""';
  cell.alignment = { vertical: 'middle', horizontal: 'right' };
}

function styleTotal(cell: ExcelJS.Cell, positive = false) {
  cell.font = {
    name: 'Calibri',
    size: 11,
    bold: true,
    color: { argb: positive ? C.positive : C.black },
  };
  cell.numFmt = '#,##0.00;[Red]-#,##0.00';
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.goldPale } };
  cell.alignment = { vertical: 'middle', horizontal: 'right' };
  cell.border = {
    top: { style: 'thin', color: { argb: C.gold } },
    bottom: { style: 'medium', color: { argb: C.gold } },
  };
}

function stylePercent(cell: ExcelJS.Cell, bold = false) {
  cell.font = { name: 'Calibri', size: 10, bold, italic: true, color: { argb: C.dim } };
  cell.numFmt = '0.00%';
  cell.alignment = { vertical: 'middle', horizontal: 'right' };
}

function styleMetricValue(cell: ExcelJS.Cell) {
  cell.font = { name: 'Calibri', size: 14, bold: true, color: { argb: C.gold } };
  cell.alignment = { vertical: 'middle', horizontal: 'center' };
  cell.numFmt = '#,##0.00';
}

function applyGridBorders(ws: ExcelJS.Worksheet, startRow: number, endRow: number, startCol: number, endCol: number) {
  for (let r = startRow; r <= endRow; r++) {
    for (let c = startCol; c <= endCol; c++) {
      const cell = ws.getCell(r, c);
      cell.border = {
        top: { style: 'hair', color: { argb: C.border } },
        left: { style: 'hair', color: { argb: C.border } },
        bottom: { style: 'hair', color: { argb: C.border } },
        right: { style: 'hair', color: { argb: C.border } },
      };
    }
  }
}

/* ═══════════════════════════════════════════════════════
   Aggregación de transacciones por mes + categoría
   ═══════════════════════════════════════════════════════ */

type CategoryRow = {
  type: 'income' | 'cost' | 'expense';
  category: string;
  code: string;       // código PCGE autogenerado
  months: number[];   // 12
};

function aggregate(transactions: Transaction[], year: number): CategoryRow[] {
  const map = new Map<string, CategoryRow>();

  // Códigos PCGE genéricos por tipo/categoría
  const codeByCat = new Map<string, string>();
  let incomeCounter = 7032100;
  let costCounter = 6361100;
  let expenseCounter = 6381100;

  function getCode(type: string, cat: string): string {
    const k = `${type}::${cat}`;
    if (codeByCat.has(k)) return codeByCat.get(k)!;
    let code: number;
    if (type === 'income') code = incomeCounter++;
    else if (type === 'cost') code = costCounter++;
    else code = expenseCounter++;
    const s = String(code);
    codeByCat.set(k, s);
    return s;
  }

  for (const t of transactions) {
    const [y, m] = t.date.split('-').map(Number);
    if (y !== year) continue;
    const k = `${t.type}::${t.category}`;
    if (!map.has(k)) {
      map.set(k, {
        type: t.type,
        category: t.category,
        code: getCode(t.type, t.category),
        months: Array(12).fill(0),
      });
    }
    map.get(k)!.months[m - 1] += Number(t.amount);
  }

  return Array.from(map.values());
}

/* ═══════════════════════════════════════════════════════
   HOJA 1: P&L Gerencial
   ═══════════════════════════════════════════════════════ */

type PnlRowMap = {
  incomeRows: number[];   // filas de categorías income
  totalIncome: number;    // fila del total ingresos
  costRows: number[];
  totalCost: number;
  utilBruta: number;
  margenBruto: number;
  expenseRows: number[];
  totalExpense: number;
  ebitda: number;
  margenEbitda: number;
};

function buildPnlGerencial(
  wb: ExcelJS.Workbook,
  data: CategoryRow[],
  params: ExportParams,
): PnlRowMap {
  const ws = wb.addWorksheet('P&L Gerencial', {
    properties: { tabColor: { argb: C.gold } },
    views: [{ state: 'frozen', xSplit: 2, ySplit: 4 }],
  });

  // Column widths
  ws.getColumn(1).width = 38; // A - concepto
  ws.getColumn(2).width = 11; // B - cuenta
  for (let i = 3; i <= 14; i++) ws.getColumn(i).width = 13;
  ws.getColumn(15).width = 16; // O - total anual
  ws.getColumn(16).width = 11; // P - % rev

  // Row 1 — titulo
  ws.mergeCells('A1:P1');
  ws.getCell('A1').value = `${params.empresa ?? 'MI EMPRESA'} — P&L GERENCIAL ${params.year}`;
  styleTitle(ws.getCell('A1'));
  ws.getRow(1).height = 28;

  // Row 2 — subtitulo
  ws.mergeCells('A2:P2');
  ws.getCell('A2').value = `RUC: ${params.ruc ?? '—'}  |  Moneda: ${params.moneda ?? 'S/ Soles'}  |  Ejercicio: Enero–Diciembre ${params.year}`;
  styleSubtitle(ws.getCell('A2'));

  // Row 4 — headers
  const headers = ['CONCEPTO', 'CTA.', ...MONTHS, 'TOTAL ANUAL', '% REV.'];
  headers.forEach((h, i) => {
    ws.getCell(4, i + 1).value = h;
  });
  styleHeaderRow(ws.getRow(4));
  ws.getRow(4).height = 24;

  let currentRow = 5;
  const income = data.filter((d) => d.type === 'income');
  const costs = data.filter((d) => d.type === 'cost');
  const expenses = data.filter((d) => d.type === 'expense');

  const rowMap: PnlRowMap = {
    incomeRows: [], totalIncome: 0, costRows: [], totalCost: 0,
    utilBruta: 0, margenBruto: 0, expenseRows: [], totalExpense: 0,
    ebitda: 0, margenEbitda: 0,
  };

  // ═══ A. INGRESOS ═══
  ws.mergeCells(`A${currentRow}:P${currentRow}`);
  ws.getCell(`A${currentRow}`).value = '  A. INGRESOS';
  styleSectionHeader(ws.getCell(`A${currentRow}`));
  currentRow++;

  const incomeStartRow = currentRow;
  for (const it of income.length > 0 ? income : [{ type: 'income' as const, category: 'Ventas', code: '7032100', months: Array(12).fill(0) }]) {
    ws.getCell(`A${currentRow}`).value = it.category;
    ws.getCell(`B${currentRow}`).value = it.code;
    styleConcept(ws.getCell(`A${currentRow}`), false, 2);
    ws.getCell(`B${currentRow}`).font = { name: 'Consolas', size: 9, color: { argb: C.dim } };
    ws.getCell(`B${currentRow}`).alignment = { horizontal: 'center' };
    MONTH_COLS.forEach((col, i) => {
      const c = ws.getCell(`${col}${currentRow}`);
      c.value = it.months[i];
      styleMoney(c);
    });
    ws.getCell(`O${currentRow}`).value = { formula: `SUM(C${currentRow}:N${currentRow})` };
    styleMoney(ws.getCell(`O${currentRow}`));
    ws.getCell(`P${currentRow}`).value = { formula: `IFERROR(O${currentRow}/$O$${currentRow + income.length + 100},0)` }; // placeholder
    stylePercent(ws.getCell(`P${currentRow}`));
    rowMap.incomeRows.push(currentRow);
    currentRow++;
  }
  const incomeEndRow = currentRow - 1;

  // TOTAL INGRESOS
  ws.getCell(`A${currentRow}`).value = '  TOTAL INGRESOS';
  styleConcept(ws.getCell(`A${currentRow}`), true, 0);
  MONTH_COLS.forEach((col) => {
    const c = ws.getCell(`${col}${currentRow}`);
    c.value = { formula: `SUM(${col}${incomeStartRow}:${col}${incomeEndRow})` };
    styleTotal(c);
  });
  ws.getCell(`O${currentRow}`).value = { formula: `SUM(C${currentRow}:N${currentRow})` };
  styleTotal(ws.getCell(`O${currentRow}`), true);
  ws.getCell(`P${currentRow}`).value = 1;
  stylePercent(ws.getCell(`P${currentRow}`), true);
  rowMap.totalIncome = currentRow;
  currentRow += 2;

  // ═══ B. COSTOS ═══
  ws.mergeCells(`A${currentRow}:P${currentRow}`);
  ws.getCell(`A${currentRow}`).value = '  B. COSTOS OPERATIVOS';
  styleSectionHeader(ws.getCell(`A${currentRow}`));
  currentRow++;

  const costStartRow = currentRow;
  for (const it of costs.length > 0 ? costs : [{ type: 'cost' as const, category: 'Costos directos', code: '6361100', months: Array(12).fill(0) }]) {
    ws.getCell(`A${currentRow}`).value = it.category;
    ws.getCell(`B${currentRow}`).value = it.code;
    styleConcept(ws.getCell(`A${currentRow}`), false, 2);
    ws.getCell(`B${currentRow}`).font = { name: 'Consolas', size: 9, color: { argb: C.dim } };
    ws.getCell(`B${currentRow}`).alignment = { horizontal: 'center' };
    MONTH_COLS.forEach((col, i) => {
      const c = ws.getCell(`${col}${currentRow}`);
      c.value = it.months[i];
      styleMoney(c);
    });
    ws.getCell(`O${currentRow}`).value = { formula: `SUM(C${currentRow}:N${currentRow})` };
    styleMoney(ws.getCell(`O${currentRow}`));
    ws.getCell(`P${currentRow}`).value = { formula: `IFERROR(O${currentRow}/$O$${rowMap.totalIncome},0)` };
    stylePercent(ws.getCell(`P${currentRow}`));
    rowMap.costRows.push(currentRow);
    currentRow++;
  }
  const costEndRow = currentRow - 1;

  // TOTAL COSTOS
  ws.getCell(`A${currentRow}`).value = '  TOTAL COSTOS OPERATIVOS';
  styleConcept(ws.getCell(`A${currentRow}`), true, 0);
  MONTH_COLS.forEach((col) => {
    const c = ws.getCell(`${col}${currentRow}`);
    c.value = { formula: `SUM(${col}${costStartRow}:${col}${costEndRow})` };
    styleTotal(c);
  });
  ws.getCell(`O${currentRow}`).value = { formula: `SUM(C${currentRow}:N${currentRow})` };
  styleTotal(ws.getCell(`O${currentRow}`));
  ws.getCell(`P${currentRow}`).value = { formula: `IFERROR(O${currentRow}/$O$${rowMap.totalIncome},0)` };
  stylePercent(ws.getCell(`P${currentRow}`), true);
  rowMap.totalCost = currentRow;
  currentRow++;

  // UTILIDAD BRUTA
  ws.getCell(`A${currentRow}`).value = '  ★ UTILIDAD BRUTA OPERATIVA';
  styleConcept(ws.getCell(`A${currentRow}`), true, 0);
  ws.getCell(`A${currentRow}`).font = { bold: true, color: { argb: C.gold }, size: 11 };
  MONTH_COLS.forEach((col) => {
    const c = ws.getCell(`${col}${currentRow}`);
    c.value = { formula: `${col}${rowMap.totalIncome}-${col}${rowMap.totalCost}` };
    styleTotal(c, true);
  });
  ws.getCell(`O${currentRow}`).value = { formula: `O${rowMap.totalIncome}-O${rowMap.totalCost}` };
  styleTotal(ws.getCell(`O${currentRow}`), true);
  ws.getCell(`P${currentRow}`).value = { formula: `IFERROR(O${currentRow}/$O$${rowMap.totalIncome},0)` };
  stylePercent(ws.getCell(`P${currentRow}`), true);
  rowMap.utilBruta = currentRow;
  currentRow++;

  // Margen Bruto (%)
  ws.getCell(`A${currentRow}`).value = '    Margen Bruto (%)';
  styleConcept(ws.getCell(`A${currentRow}`), false, 2);
  ws.getCell(`A${currentRow}`).font = { italic: true, color: { argb: C.dim }, size: 10 };
  MONTH_COLS.forEach((col) => {
    const c = ws.getCell(`${col}${currentRow}`);
    c.value = { formula: `IFERROR(${col}${rowMap.utilBruta}/${col}${rowMap.totalIncome},0)` };
    stylePercent(c);
  });
  ws.getCell(`O${currentRow}`).value = { formula: `IFERROR(O${rowMap.utilBruta}/O${rowMap.totalIncome},0)` };
  stylePercent(ws.getCell(`O${currentRow}`), true);
  rowMap.margenBruto = currentRow;
  currentRow += 2;

  // ═══ C. GASTOS ═══
  ws.mergeCells(`A${currentRow}:P${currentRow}`);
  ws.getCell(`A${currentRow}`).value = '  C. GASTOS OPERATIVOS';
  styleSectionHeader(ws.getCell(`A${currentRow}`));
  currentRow++;

  const expStartRow = currentRow;
  for (const it of expenses.length > 0 ? expenses : [{ type: 'expense' as const, category: 'Gastos generales', code: '6381100', months: Array(12).fill(0) }]) {
    ws.getCell(`A${currentRow}`).value = it.category;
    ws.getCell(`B${currentRow}`).value = it.code;
    styleConcept(ws.getCell(`A${currentRow}`), false, 2);
    ws.getCell(`B${currentRow}`).font = { name: 'Consolas', size: 9, color: { argb: C.dim } };
    ws.getCell(`B${currentRow}`).alignment = { horizontal: 'center' };
    MONTH_COLS.forEach((col, i) => {
      const c = ws.getCell(`${col}${currentRow}`);
      c.value = it.months[i];
      styleMoney(c);
    });
    ws.getCell(`O${currentRow}`).value = { formula: `SUM(C${currentRow}:N${currentRow})` };
    styleMoney(ws.getCell(`O${currentRow}`));
    ws.getCell(`P${currentRow}`).value = { formula: `IFERROR(O${currentRow}/$O$${rowMap.totalIncome},0)` };
    stylePercent(ws.getCell(`P${currentRow}`));
    rowMap.expenseRows.push(currentRow);
    currentRow++;
  }
  const expEndRow = currentRow - 1;

  // TOTAL GASTOS
  ws.getCell(`A${currentRow}`).value = '  TOTAL GASTOS OPERATIVOS';
  styleConcept(ws.getCell(`A${currentRow}`), true, 0);
  MONTH_COLS.forEach((col) => {
    const c = ws.getCell(`${col}${currentRow}`);
    c.value = { formula: `SUM(${col}${expStartRow}:${col}${expEndRow})` };
    styleTotal(c);
  });
  ws.getCell(`O${currentRow}`).value = { formula: `SUM(C${currentRow}:N${currentRow})` };
  styleTotal(ws.getCell(`O${currentRow}`));
  ws.getCell(`P${currentRow}`).value = { formula: `IFERROR(O${currentRow}/$O$${rowMap.totalIncome},0)` };
  stylePercent(ws.getCell(`P${currentRow}`), true);
  rowMap.totalExpense = currentRow;
  currentRow += 2;

  // EBITDA
  ws.getCell(`A${currentRow}`).value = '  ★★ EBITDA (Utilidad Bruta − Gastos)';
  styleConcept(ws.getCell(`A${currentRow}`), true, 0);
  ws.getCell(`A${currentRow}`).font = { bold: true, color: { argb: C.gold }, size: 12 };
  MONTH_COLS.forEach((col) => {
    const c = ws.getCell(`${col}${currentRow}`);
    c.value = { formula: `${col}${rowMap.utilBruta}-${col}${rowMap.totalExpense}` };
    styleTotal(c, true);
    c.font = { bold: true, size: 11, color: { argb: C.positive } };
  });
  ws.getCell(`O${currentRow}`).value = { formula: `O${rowMap.utilBruta}-O${rowMap.totalExpense}` };
  styleTotal(ws.getCell(`O${currentRow}`), true);
  ws.getCell(`O${currentRow}`).font = { bold: true, size: 12, color: { argb: C.positive } };
  ws.getCell(`P${currentRow}`).value = { formula: `IFERROR(O${currentRow}/$O$${rowMap.totalIncome},0)` };
  stylePercent(ws.getCell(`P${currentRow}`), true);
  rowMap.ebitda = currentRow;
  currentRow++;

  // Margen EBITDA
  ws.getCell(`A${currentRow}`).value = '    Margen EBITDA (%)';
  styleConcept(ws.getCell(`A${currentRow}`), false, 2);
  ws.getCell(`A${currentRow}`).font = { italic: true, color: { argb: C.dim }, size: 10 };
  MONTH_COLS.forEach((col) => {
    const c = ws.getCell(`${col}${currentRow}`);
    c.value = { formula: `IFERROR(${col}${rowMap.ebitda}/${col}${rowMap.totalIncome},0)` };
    stylePercent(c);
  });
  ws.getCell(`O${currentRow}`).value = { formula: `IFERROR(O${rowMap.ebitda}/O${rowMap.totalIncome},0)` };
  stylePercent(ws.getCell(`O${currentRow}`), true);
  rowMap.margenEbitda = currentRow;

  // Fix el P (% REV) de las categorías de ingresos ahora que conocemos totalIncome row
  rowMap.incomeRows.forEach((r) => {
    ws.getCell(`P${r}`).value = { formula: `IFERROR(O${r}/$O$${rowMap.totalIncome},0)` };
  });

  applyGridBorders(ws, 4, currentRow, 1, 16);

  return rowMap;
}

/* ═══════════════════════════════════════════════════════
   HOJA 2: Dashboard
   ═══════════════════════════════════════════════════════ */

function buildDashboard(wb: ExcelJS.Workbook, pnl: PnlRowMap, params: ExportParams) {
  const ws = wb.addWorksheet('Dashboard', {
    properties: { tabColor: { argb: C.gold } },
    views: [{ showGridLines: false, state: 'normal' }],
  });

  ws.getColumn(1).width = 32;
  for (let i = 2; i <= 14; i++) ws.getColumn(i).width = 12;

  // Title
  ws.mergeCells('A1:N1');
  ws.getCell('A1').value = `${params.empresa ?? 'MI EMPRESA'} — DASHBOARD ${params.year}`;
  styleTitle(ws.getCell('A1'));
  ws.getRow(1).height = 30;

  // Subtitle
  ws.mergeCells('A2:N2');
  ws.getCell('A2').value = 'Análisis Visual | Ingresos | EBITDA | Margen | Indicadores';
  styleSubtitle(ws.getCell('A2'));

  // KPI labels row 4
  ws.mergeCells('A4:C4'); ws.getCell('A4').value = `INGRESOS ${params.year}`;
  ws.mergeCells('D4:F4'); ws.getCell('D4').value = `EBITDA ${params.year}`;
  ws.mergeCells('G4:I4'); ws.getCell('G4').value = 'MARGEN EBITDA';
  ws.mergeCells('J4:N4'); ws.getCell('J4').value = 'UTILIDAD BRUTA';
  ['A4', 'D4', 'G4', 'J4'].forEach((addr) => {
    const c = ws.getCell(addr);
    c.font = { name: 'Calibri', size: 9, bold: true, color: { argb: C.dim } };
    c.alignment = { horizontal: 'center' };
  });

  // KPI values row 5
  ws.mergeCells('A5:C5'); ws.getCell('A5').value = { formula: `'P&L Gerencial'!O${pnl.totalIncome}` };
  ws.mergeCells('D5:F5'); ws.getCell('D5').value = { formula: `'P&L Gerencial'!O${pnl.ebitda}` };
  ws.mergeCells('G5:I5'); ws.getCell('G5').value = { formula: `'P&L Gerencial'!O${pnl.margenEbitda}` };
  ws.mergeCells('J5:N5'); ws.getCell('J5').value = { formula: `'P&L Gerencial'!O${pnl.utilBruta}` };
  ['A5', 'D5', 'J5'].forEach((addr) => {
    styleMetricValue(ws.getCell(addr));
    ws.getCell(addr).numFmt = '"S/ "#,##0';
  });
  styleMetricValue(ws.getCell('G5'));
  ws.getCell('G5').numFmt = '0.0%';
  ws.getRow(5).height = 32;

  // Tabla mensual (row 7+)
  ws.getCell('A7').value = 'INDICADORES MENSUALES';
  ws.getCell('A7').font = { bold: true, size: 11, color: { argb: C.gold } };

  const tableHeader = ['Mes', 'Ingresos (S/)', 'Costos Op. (S/)', 'Utilidad Bruta (S/)', 'Gastos Op. (S/)', 'EBITDA (S/)', '% Margen EBITDA'];
  tableHeader.forEach((h, i) => {
    ws.getCell(8, i + 1).value = h;
  });
  styleHeaderRow(ws.getRow(8));

  for (let i = 0; i < 12; i++) {
    const r = 9 + i;
    const col = MONTH_COLS[i]; // col en P&L
    ws.getCell(`A${r}`).value = MONTHS[i];
    styleConcept(ws.getCell(`A${r}`), true, 0);
    ws.getCell(`B${r}`).value = { formula: `'P&L Gerencial'!${col}${pnl.totalIncome}` };
    ws.getCell(`C${r}`).value = { formula: `'P&L Gerencial'!${col}${pnl.totalCost}` };
    ws.getCell(`D${r}`).value = { formula: `'P&L Gerencial'!${col}${pnl.utilBruta}` };
    ws.getCell(`E${r}`).value = { formula: `'P&L Gerencial'!${col}${pnl.totalExpense}` };
    ws.getCell(`F${r}`).value = { formula: `'P&L Gerencial'!${col}${pnl.ebitda}` };
    ws.getCell(`G${r}`).value = { formula: `IFERROR(F${r}/B${r},0)` };
    ['B', 'C', 'D', 'E', 'F'].forEach((c) => styleMoney(ws.getCell(`${c}${r}`)));
    stylePercent(ws.getCell(`G${r}`));
  }

  // Total row
  const totalR = 21;
  ws.getCell(`A${totalR}`).value = 'TOTAL ANUAL';
  styleConcept(ws.getCell(`A${totalR}`), true, 0);
  ['B', 'C', 'D', 'E', 'F'].forEach((c) => {
    ws.getCell(`${c}${totalR}`).value = { formula: `SUM(${c}9:${c}20)` };
    styleTotal(ws.getCell(`${c}${totalR}`), c === 'F');
  });
  ws.getCell(`G${totalR}`).value = { formula: `IFERROR(F${totalR}/B${totalR},0)` };
  stylePercent(ws.getCell(`G${totalR}`), true);

  applyGridBorders(ws, 8, totalR, 1, 7);

  // Nota de charts
  ws.mergeCells('A23:N23');
  ws.getCell('A23').value = '📊 Tip: Selecciona el rango A8:G20 y pulsa Alt + F1 en Excel para generar gráficos automáticos.';
  ws.getCell('A23').font = { italic: true, size: 9, color: { argb: C.dim } };
  ws.getCell('A23').alignment = { horizontal: 'left', indent: 1 };
}

/* ═══════════════════════════════════════════════════════
   HOJA 3: Comparativo vs PSTO
   ═══════════════════════════════════════════════════════ */

function buildComparativo(wb: ExcelJS.Workbook, pnl: PnlRowMap, params: ExportParams) {
  const ws = wb.addWorksheet('Comparativo vs PSTO', {
    properties: { tabColor: { argb: C.goldLight } },
  });
  ws.getColumn(1).width = 40;
  for (let i = 2; i <= 9; i++) ws.getColumn(i).width = 15;

  ws.mergeCells('A1:I1');
  ws.getCell('A1').value = `${params.empresa ?? 'MI EMPRESA'} — COMPARATIVO GERENCIAL`;
  styleTitle(ws.getCell('A1'));

  ws.mergeCells('A2:I2');
  ws.getCell('A2').value = `Ppto ${params.year + 1} = Proyectado | Compara Real ${params.year} vs. año anterior vs. presupuesto`;
  styleSubtitle(ws.getCell('A2'));

  ws.getCell('A3').value = '  ▌ RESUMEN ANUAL';
  ws.mergeCells('A3:I3');
  styleSectionHeader(ws.getCell('A3'));

  const headers = ['CONCEPTO', `REAL ${params.year} (S/)`, `PL ${params.year - 1} (S/)`, `PPTO ${params.year + 1} (S/)`, 'VAR. (S/)', 'VAR. (%)', `% REV ${params.year - 1}`, `% REV ${params.year + 1}`, 'TENDENCIA'];
  headers.forEach((h, i) => ws.getCell(4, i + 1).value = h);
  styleHeaderRow(ws.getRow(4));

  const rows = [
    { label: '  A. INGRESOS TOTALES', formula: `O${pnl.totalIncome}` },
    { label: '  B. COSTOS OPERATIVOS', formula: `O${pnl.totalCost}` },
    { label: '  ★ UTILIDAD BRUTA', formula: `O${pnl.utilBruta}`, highlight: true },
    { label: '  C. GASTOS OPERATIVOS', formula: `O${pnl.totalExpense}` },
    { label: '  ★★ EBITDA', formula: `O${pnl.ebitda}`, highlight: true },
  ];

  rows.forEach((row, idx) => {
    const r = 5 + idx;
    ws.getCell(`A${r}`).value = row.label;
    styleConcept(ws.getCell(`A${r}`), row.highlight === true, 0);
    if (row.highlight) ws.getCell(`A${r}`).font = { bold: true, color: { argb: C.gold }, size: 11 };

    // B = Real, C = PL anterior (editable, default 0), D = Ppto (editable, default Real * 1.1)
    ws.getCell(`B${r}`).value = { formula: `'P&L Gerencial'!${row.formula}` };
    ws.getCell(`C${r}`).value = 0; // Editable
    ws.getCell(`D${r}`).value = { formula: `B${r}*1.1` }; // Ppto = Real +10% por default
    ws.getCell(`E${r}`).value = { formula: `D${r}-B${r}` };
    ws.getCell(`F${r}`).value = { formula: `IFERROR((D${r}-B${r})/ABS(B${r}),0)` };
    ws.getCell(`G${r}`).value = { formula: `IFERROR(C${r}/'P&L Gerencial'!O${pnl.totalIncome},0)` };
    ws.getCell(`H${r}`).value = { formula: `IFERROR(D${r}/('P&L Gerencial'!O${pnl.totalIncome}*1.1),0)` };
    ws.getCell(`I${r}`).value = { formula: `IF(F${r}>0.05,"▲ Crecimiento",IF(F${r}<-0.05,"▼ Decrecimiento","═ Estable"))` };

    ['B', 'C', 'D', 'E'].forEach((c) => styleMoney(ws.getCell(`${c}${r}`), row.highlight === true));
    stylePercent(ws.getCell(`F${r}`), row.highlight === true);
    stylePercent(ws.getCell(`G${r}`));
    stylePercent(ws.getCell(`H${r}`));
    ws.getCell(`I${r}`).font = { name: 'Calibri', size: 10, italic: true, color: { argb: C.dim } };
    ws.getCell(`I${r}`).alignment = { horizontal: 'center' };
  });

  applyGridBorders(ws, 4, 9, 1, 9);

  ws.getCell('A11').value = '💡 Para comparar contra tu histórico: edita la columna C (PL anterior) con los totales del año pasado. La columna D (Ppto) se autocalcula como Real +10% — ajústala manualmente si quieres otro target.';
  ws.mergeCells('A11:I11');
  ws.getCell('A11').font = { italic: true, size: 9, color: { argb: C.dim } };
  ws.getCell('A11').alignment = { wrapText: true, vertical: 'top' };
  ws.getRow(11).height = 32;
}

/* ═══════════════════════════════════════════════════════
   HOJA 4: Indicadores Operativos
   ═══════════════════════════════════════════════════════ */

function buildIndicadoresOperativos(wb: ExcelJS.Workbook, pnl: PnlRowMap, params: ExportParams) {
  const ws = wb.addWorksheet('Indicadores Operativos', {
    properties: { tabColor: { argb: C.goldLight } },
  });
  ws.getColumn(1).width = 42;
  for (let i = 2; i <= 14; i++) ws.getColumn(i).width = 12;
  ws.getColumn(15).width = 16;

  ws.mergeCells('A1:O1');
  ws.getCell('A1').value = `${params.empresa ?? 'MI EMPRESA'} — DRIVERS OPERATIVOS`;
  styleTitle(ws.getCell('A1'));
  ws.mergeCells('A2:O2');
  ws.getCell('A2').value = 'Aforo, ticket promedio, horas disponibles, ocupación y costos unitarios';
  styleSubtitle(ws.getCell('A2'));

  const headers = ['MÉTRICA / PARÁMETRO', ...MONTHS, 'TOTAL / PROM.'];
  headers.forEach((h, i) => ws.getCell(4, i + 1).value = h);
  styleHeaderRow(ws.getRow(4));

  // ═══ 1. Tarifas (editable) ═══
  ws.mergeCells('A5:O5');
  ws.getCell('A5').value = '  1. ESTRUCTURA DE TARIFAS (editable)';
  styleSectionHeader(ws.getCell('A5'));

  const tarifas = [
    ['  Ticket promedio (S/)', 35, 'Tarifa estándar por cliente'],
    ['  Tarifa premium (S/)', 60, 'Tarifa extendida / premium'],
    ['  Membresía mensual (S/)', 150, 'Suscripción mensual'],
  ];
  tarifas.forEach((t, i) => {
    const r = 6 + i;
    ws.getCell(`A${r}`).value = t[0];
    ws.getCell(`B${r}`).value = t[1];
    ws.mergeCells(`C${r}:O${r}`);
    ws.getCell(`C${r}`).value = t[2];
    styleConcept(ws.getCell(`A${r}`), false, 2);
    styleMoney(ws.getCell(`B${r}`), true);
    ws.getCell(`C${r}`).font = { italic: true, color: { argb: C.dim }, size: 9 };
  });

  // ═══ 2. Visitas mensuales ═══
  ws.mergeCells('A10:O10');
  ws.getCell('A10').value = '  2. VOLUMEN Y TICKET PROMEDIO';
  styleSectionHeader(ws.getCell('A10'));

  ws.getCell('A11').value = '  Visitas / transacciones al mes';
  styleConcept(ws.getCell('A11'), false, 2);
  MONTH_COLS.forEach((col, i) => {
    const c = ws.getCell(`${col}11`);
    c.value = 0; // Editable — el usuario lo llena
    c.font = { italic: true, color: { argb: C.muted }, size: 10 };
    c.alignment = { horizontal: 'right' };
    c.numFmt = '#,##0';
  });
  ws.getCell('O11').value = { formula: 'SUM(B11:N11)' };
  styleMoney(ws.getCell('O11'), true);

  ws.getCell('A12').value = '  Ticket promedio real (S/)';
  styleConcept(ws.getCell('A12'), false, 2);
  MONTH_COLS.forEach((col) => {
    const c = ws.getCell(`${col}12`);
    c.value = { formula: `IFERROR('P&L Gerencial'!${col}${pnl.totalIncome}/${col}11,0)` };
    styleMoney(c);
  });
  ws.getCell('O12').value = { formula: `IFERROR('P&L Gerencial'!O${pnl.totalIncome}/O11,0)` };
  styleMoney(ws.getCell('O12'), true);

  // ═══ 3. Capacidad ═══
  ws.mergeCells('A14:O14');
  ws.getCell('A14').value = '  3. CAPACIDAD Y OCUPACIÓN';
  styleSectionHeader(ws.getCell('A14'));

  ws.getCell('A15').value = '  Horas disponibles al público';
  styleConcept(ws.getCell('A15'), false, 2);
  MONTH_COLS.forEach((col) => {
    const c = ws.getCell(`${col}15`);
    c.value = 300; // Default editable
    c.font = { italic: true, color: { argb: C.muted }, size: 10 };
    c.alignment = { horizontal: 'right' };
    c.numFmt = '#,##0.0';
  });
  ws.getCell('O15').value = { formula: 'SUM(B15:N15)' };
  styleMoney(ws.getCell('O15'), true);

  ws.getCell('A16').value = '  Aforo máximo (personas)';
  styleConcept(ws.getCell('A16'), false, 2);
  ws.getCell('B16').value = 40; // Editable
  ws.getCell('B16').font = { bold: true };
  ws.getCell('B16').alignment = { horizontal: 'center' };
  ws.mergeCells('C16:O16');
  ws.getCell('C16').value = '← Editable — cambia aquí el aforo máximo';
  ws.getCell('C16').font = { italic: true, color: { argb: C.dim }, size: 9 };

  ws.getCell('A17').value = '  Capacidad máxima (person-horas)';
  styleConcept(ws.getCell('A17'), false, 2);
  MONTH_COLS.forEach((col) => {
    const c = ws.getCell(`${col}17`);
    c.value = { formula: `${col}15*$B$16` };
    styleMoney(c);
  });
  ws.getCell('O17').value = { formula: 'SUM(B17:N17)' };
  styleMoney(ws.getCell('O17'), true);

  ws.getCell('A18').value = '  ★ % Ocupación pista';
  styleConcept(ws.getCell('A18'), true, 0);
  ws.getCell('A18').font = { bold: true, color: { argb: C.gold } };
  MONTH_COLS.forEach((col) => {
    const c = ws.getCell(`${col}18`);
    c.value = { formula: `IFERROR(${col}11/${col}17,0)` };
    stylePercent(c);
  });
  ws.getCell('O18').value = { formula: 'AVERAGE(B18:N18)' };
  stylePercent(ws.getCell('O18'), true);

  // ═══ 4. Costo unitario ═══
  ws.mergeCells('A20:O20');
  ws.getCell('A20').value = '  4. COSTO POR HORA DISPONIBLE';
  styleSectionHeader(ws.getCell('A20'));

  ws.getCell('A21').value = '  Costo total operativo (Op + Pers) S/';
  styleConcept(ws.getCell('A21'), false, 2);
  MONTH_COLS.forEach((col) => {
    const c = ws.getCell(`${col}21`);
    c.value = { formula: `'P&L Gerencial'!${col}${pnl.totalCost}+'P&L Gerencial'!${col}${pnl.totalExpense}` };
    styleMoney(c);
  });
  ws.getCell('O21').value = { formula: `'P&L Gerencial'!O${pnl.totalCost}+'P&L Gerencial'!O${pnl.totalExpense}` };
  styleMoney(ws.getCell('O21'), true);

  ws.getCell('A22').value = '  Costo / hora disponible (S/)';
  styleConcept(ws.getCell('A22'), false, 2);
  MONTH_COLS.forEach((col) => {
    const c = ws.getCell(`${col}22`);
    c.value = { formula: `IFERROR(${col}21/${col}15,0)` };
    styleMoney(c);
  });
  ws.getCell('O22').value = { formula: `IFERROR(O21/O15,0)` };
  styleMoney(ws.getCell('O22'), true);

  ws.getCell('A23').value = '  Ingreso / hora disponible (S/)';
  styleConcept(ws.getCell('A23'), false, 2);
  MONTH_COLS.forEach((col) => {
    const c = ws.getCell(`${col}23`);
    c.value = { formula: `IFERROR('P&L Gerencial'!${col}${pnl.totalIncome}/${col}15,0)` };
    styleMoney(c);
  });
  ws.getCell('O23').value = { formula: `IFERROR('P&L Gerencial'!O${pnl.totalIncome}/O15,0)` };
  styleMoney(ws.getCell('O23'), true);

  applyGridBorders(ws, 4, 23, 1, 15);
}

/* ═══════════════════════════════════════════════════════
   HOJA 5: Punto de Equilibrio
   ═══════════════════════════════════════════════════════ */

function buildPuntoEquilibrio(wb: ExcelJS.Workbook, pnl: PnlRowMap, params: ExportParams) {
  const ws = wb.addWorksheet('Punto de Equilibrio', {
    properties: { tabColor: { argb: C.goldFoil } },
  });
  ws.getColumn(1).width = 45;
  ws.getColumn(2).width = 20;
  ws.getColumn(3).width = 50;

  ws.mergeCells('A1:C1');
  ws.getCell('A1').value = `${params.empresa ?? 'MI EMPRESA'} — ANÁLISIS PUNTO DE EQUILIBRIO`;
  styleTitle(ws.getCell('A1'));
  ws.mergeCells('A2:C2');
  ws.getCell('A2').value = 'Todos los cálculos se actualizan con los datos del P&L Gerencial';
  styleSubtitle(ws.getCell('A2'));

  // 1. Estructura anual
  ws.mergeCells('A4:C4');
  ws.getCell('A4').value = '  1. ESTRUCTURA ANUAL';
  styleSectionHeader(ws.getCell('A4'));

  const rows1 = [
    ['  Ingresos totales (A)', `'P&L Gerencial'!O${pnl.totalIncome}`, 'Fuente: P&L Gerencial'],
    ['  Costos operativos (B)', `'P&L Gerencial'!O${pnl.totalCost}`, 'Costos directos'],
    ['  Gastos operativos (C)', `'P&L Gerencial'!O${pnl.totalExpense}`, 'Gastos fijos'],
  ];
  rows1.forEach((r, i) => {
    const row = 5 + i;
    ws.getCell(`A${row}`).value = r[0];
    ws.getCell(`B${row}`).value = { formula: r[1] };
    ws.getCell(`C${row}`).value = r[2];
    styleConcept(ws.getCell(`A${row}`), false, 2);
    styleMoney(ws.getCell(`B${row}`));
    ws.getCell(`C${row}`).font = { italic: true, color: { argb: C.dim }, size: 9 };
  });

  // 2. Clasificación fijo/variable
  ws.mergeCells('A9:C9');
  ws.getCell('A9').value = '  2. CLASIFICACIÓN FIJO / VARIABLE';
  styleSectionHeader(ws.getCell('A9'));

  ws.getCell('A10').value = '  (+) Costos Fijos Totales';
  ws.getCell('B10').value = { formula: 'B6+B7' };
  ws.getCell('C10').value = 'Costos Op. + Gastos Op. (asumidos como fijos)';
  styleConcept(ws.getCell('A10'), true, 2);
  styleMoney(ws.getCell('B10'), true);
  ws.getCell('C10').font = { italic: true, color: { argb: C.dim }, size: 9 };

  ws.getCell('A11').value = '  (−) Costos Variables Totales';
  ws.getCell('B11').value = { formula: 'B5*0.053' };
  ws.getCell('C11').value = 'Ajustable: 5.3% default (comisiones, marketing variable)';
  styleConcept(ws.getCell('A11'), false, 2);
  styleMoney(ws.getCell('B11'));
  ws.getCell('C11').font = { italic: true, color: { argb: C.dim }, size: 9 };

  ws.getCell('A12').value = '  % Costos Variables / Ventas';
  ws.getCell('B12').value = { formula: 'IFERROR(B11/B5,0)' };
  ws.getCell('C12').value = 'Ratio para cálculo de BE';
  styleConcept(ws.getCell('A12'), false, 2);
  stylePercent(ws.getCell('B12'));
  ws.getCell('C12').font = { italic: true, color: { argb: C.dim }, size: 9 };

  ws.getCell('A13').value = '  Margen de Contribución (%)';
  ws.getCell('B13').value = { formula: '1-B12' };
  ws.getCell('C13').value = '% que queda de cada S/ de ingreso para cubrir fijos';
  styleConcept(ws.getCell('A13'), true, 2);
  stylePercent(ws.getCell('B13'), true);
  ws.getCell('C13').font = { italic: true, color: { argb: C.dim }, size: 9 };

  // 3. Punto de equilibrio
  ws.mergeCells('A15:C15');
  ws.getCell('A15').value = '  3. PUNTO DE EQUILIBRIO';
  styleSectionHeader(ws.getCell('A15'));

  ws.getCell('A16').value = '  ▶ BE en VENTAS ANUALES (S/)';
  ws.getCell('B16').value = { formula: 'IFERROR(B10/B13,0)' };
  ws.getCell('C16').value = 'Ingresos mínimos anuales para no perder';
  styleConcept(ws.getCell('A16'), true, 0);
  ws.getCell('A16').font = { bold: true, color: { argb: C.gold }, size: 11 };
  styleTotal(ws.getCell('B16'), true);
  ws.getCell('C16').font = { italic: true, color: { argb: C.dim }, size: 9 };

  ws.getCell('A17').value = '  ▶ BE MENSUAL (S/)';
  ws.getCell('B17').value = { formula: 'B16/12' };
  ws.getCell('C17').value = 'Ingresos mínimos por mes';
  styleConcept(ws.getCell('A17'), true, 0);
  styleTotal(ws.getCell('B17'));
  ws.getCell('C17').font = { italic: true, color: { argb: C.dim }, size: 9 };

  ws.getCell('A18').value = '  BE como % de ventas actuales';
  ws.getCell('B18').value = { formula: 'IFERROR(B16/B5,0)' };
  ws.getCell('C18').value = '<100% = negocio con margen; >100% = pérdida';
  styleConcept(ws.getCell('A18'), false, 2);
  stylePercent(ws.getCell('B18'), true);
  ws.getCell('C18').font = { italic: true, color: { argb: C.dim }, size: 9 };

  // 4. Sensibilidad
  ws.mergeCells('A20:C20');
  ws.getCell('A20').value = '  4. SENSIBILIDAD (variaciones de precio / volumen)';
  styleSectionHeader(ws.getCell('A20'));

  const sens = [
    ['    Precio −20%', 'IFERROR(B10/(B13-0.2),0)'],
    ['    Precio +20%', 'IFERROR(B10/(B13+0.2),0)'],
    ['    Costos fijos +10%', 'IFERROR((B10*1.1)/B13,0)'],
    ['    Costos fijos −10%', 'IFERROR((B10*0.9)/B13,0)'],
  ];
  sens.forEach((r, i) => {
    const row = 21 + i;
    ws.getCell(`A${row}`).value = r[0];
    ws.getCell(`B${row}`).value = { formula: r[1] };
    ws.getCell(`C${row}`).value = 'BE en ventas anuales';
    styleConcept(ws.getCell(`A${row}`), false, 3);
    styleMoney(ws.getCell(`B${row}`));
    ws.getCell(`C${row}`).font = { italic: true, color: { argb: C.dim }, size: 9 };
  });

  applyGridBorders(ws, 4, 24, 1, 3);
}

/* ═══════════════════════════════════════════════════════
   HOJA 6: Estrategia de Precios
   ═══════════════════════════════════════════════════════ */

function buildEstrategiaPrecios(wb: ExcelJS.Workbook, pnl: PnlRowMap, params: ExportParams) {
  const ws = wb.addWorksheet('Estrategia de Precios', {
    properties: { tabColor: { argb: C.goldFoil } },
  });
  [42, 32, 8, 14, 12, 14, 14, 12, 14, 14, 30].forEach((w, i) => { ws.getColumn(i + 1).width = w; });

  ws.mergeCells('A1:K1');
  ws.getCell('A1').value = `${params.empresa ?? 'MI EMPRESA'} — ESTRATEGIA DE PRECIOS ${params.year + 1}`;
  styleTitle(ws.getCell('A1'));
  ws.mergeCells('A2:K2');
  ws.getCell('A2').value = 'Diagnóstico actual + propuesta de estructura tarifaria con IGV';
  styleSubtitle(ws.getCell('A2'));

  // KPIs
  ws.getCell('A4').value = 'MARGEN EBITDA ACTUAL';
  ws.getCell('C4').value = 'EBITDA ACTUAL (S/)';
  ws.getCell('E4').value = 'GAP A CERRAR';
  ws.getCell('G4').value = 'TICKET PROM.';
  ['A4', 'C4', 'E4', 'G4'].forEach((a) => {
    ws.getCell(a).font = { name: 'Calibri', size: 9, bold: true, color: { argb: C.dim } };
  });

  ws.getCell('A5').value = { formula: `'P&L Gerencial'!O${pnl.margenEbitda}` };
  ws.getCell('C5').value = { formula: `'P&L Gerencial'!O${pnl.ebitda}` };
  ws.getCell('E5').value = { formula: `'P&L Gerencial'!O${pnl.totalIncome}*0.3-'P&L Gerencial'!O${pnl.ebitda}` };
  ws.getCell('G5').value = { formula: `'Indicadores Operativos'!O12` };
  styleMetricValue(ws.getCell('A5')); ws.getCell('A5').numFmt = '0.0%';
  styleMetricValue(ws.getCell('C5')); ws.getCell('C5').numFmt = '"S/ "#,##0';
  styleMetricValue(ws.getCell('E5')); ws.getCell('E5').numFmt = '"S/ "#,##0';
  styleMetricValue(ws.getCell('G5')); ws.getCell('G5').numFmt = '"S/ "#,##0.00';

  // Bloque 1: estructura tarifaria
  ws.mergeCells('A7:K7');
  ws.getCell('A7').value = '  ▌ BLOQUE 1 — ESTRUCTURA TARIFARIA PROPUESTA';
  styleSectionHeader(ws.getCell('A7'));

  const headers = ['CATEGORÍA', 'SERVICIO / DESCRIPCIÓN', 'MIN', 'PRECIO c/IGV', 'IGV (18%)', 'PRECIO NETO', 'PRECIO ANT.', 'VARIACIÓN', 'MEMBRESÍA c/IGV', 'MBR NETO', 'OBSERVACIÓN'];
  headers.forEach((h, i) => ws.getCell(8, i + 1).value = h);
  styleHeaderRow(ws.getRow(8));

  // Tarifas default (genéricas, editables)
  const tarifas = [
    ['Estándar', 'Servicio principal', 25, 40, null, null, 30, null, null, null, 'Tarifa base'],
    ['Estándar', 'Servicio extendido', 55, 65, null, null, 50, null, null, null, 'Duración extendida'],
    ['Premium', 'Full day', null, 150, null, null, null, 'NUEVO', null, null, 'Acceso todo el día'],
    ['Membresía', 'Mensual estándar', null, null, null, null, null, null, 350, null, 'Suscripción mes'],
    ['Membresía', 'Premium', null, null, null, null, null, null, 500, null, 'Suscripción premium'],
  ];

  tarifas.forEach((t, i) => {
    const r = 9 + i;
    t.forEach((v, j) => {
      const c = ws.getCell(r, j + 1);
      if (v === null) {
        if (j === 4 && t[3]) {
          c.value = { formula: `${String.fromCharCode(68 + 0)}${r}*0.18/1.18` }; // D*0.18/1.18
          c.numFmt = '#,##0.00';
        } else if (j === 5 && t[3]) {
          c.value = { formula: `D${r}-E${r}` };
          c.numFmt = '#,##0.00';
        } else if (j === 9 && t[8]) {
          c.value = { formula: `I${r}/1.18` };
          c.numFmt = '#,##0.00';
        } else {
          c.value = '—';
          c.alignment = { horizontal: 'center' };
        }
      } else {
        c.value = v;
        if (typeof v === 'number' && j >= 2) c.numFmt = '#,##0.00';
      }
      if (j === 0) c.font = { bold: true, size: 10, color: { argb: C.gold } };
      if (j === 10) c.font = { italic: true, size: 9, color: { argb: C.dim } };
    });
  });

  applyGridBorders(ws, 8, 9 + tarifas.length - 1, 1, 11);

  ws.mergeCells('A17:K17');
  ws.getCell('A17').value = '💡 Estas tarifas son defaults editables. Modifica columnas D (precio c/IGV) y I (membresía) para simular escenarios. Los campos NETO e IGV se recalculan automáticamente.';
  ws.getCell('A17').font = { italic: true, size: 9, color: { argb: C.dim } };
  ws.getCell('A17').alignment = { wrapText: true };
  ws.getRow(17).height = 30;
}

/* ═══════════════════════════════════════════════════════
   HOJA 7: Simulador
   ═══════════════════════════════════════════════════════ */

function buildSimulador(wb: ExcelJS.Workbook, pnl: PnlRowMap, params: ExportParams) {
  const ws = wb.addWorksheet('Simulador', {
    properties: { tabColor: { argb: C.goldPale } },
  });
  [40, 15, 15, 15, 15, 30].forEach((w, i) => { ws.getColumn(i + 1).width = w; });

  ws.mergeCells('A1:F1');
  ws.getCell('A1').value = `${params.empresa ?? 'MI EMPRESA'} — SIMULADOR DE INGRESOS Y EBITDA`;
  styleTitle(ws.getCell('A1'));

  // Bloque 1: Tarifas
  ws.mergeCells('A3:F3');
  ws.getCell('A3').value = '  📋 BLOQUE 1 — TARIFAS VIGENTES (editables)';
  styleSectionHeader(ws.getCell('A3'));

  const tHead = ['PRODUCTO / SERVICIO', 'PRECIO c/IGV', 'IGV (S/)', 'PRECIO NETO', 'DESCRIPCIÓN', ''];
  tHead.forEach((h, i) => ws.getCell(4, i + 1).value = h);
  styleHeaderRow(ws.getRow(4));

  const tarifas = [
    ['Servicio estándar', 40, 'Tarifa base'],
    ['Servicio extendido', 65, 'Duración larga'],
    ['Membresía mensual', 350, 'Suscripción'],
    ['Producto premium', 150, 'Acceso premium'],
    ['🆕 Nuevo producto 1', 0, 'Completa con datos reales'],
  ];
  tarifas.forEach((t, i) => {
    const r = 5 + i;
    ws.getCell(`A${r}`).value = t[0];
    ws.getCell(`B${r}`).value = t[1];
    ws.getCell(`C${r}`).value = { formula: `ROUND(B${r}*$B$11/(1+$B$11),2)` };
    ws.getCell(`D${r}`).value = { formula: `ROUND(B${r}/(1+$B$11),2)` };
    ws.getCell(`E${r}`).value = t[2];
    styleConcept(ws.getCell(`A${r}`), false, 2);
    styleMoney(ws.getCell(`B${r}`), true);
    styleMoney(ws.getCell(`C${r}`));
    styleMoney(ws.getCell(`D${r}`), true);
    ws.getCell(`E${r}`).font = { italic: true, color: { argb: C.dim }, size: 9 };
  });

  // Tasa IGV
  ws.getCell('A11').value = '  ⚙ TASA IGV';
  ws.getCell('B11').value = 0.18;
  ws.getCell('B11').numFmt = '0%';
  styleConcept(ws.getCell('A11'), true, 2);
  ws.getCell('B11').font = { bold: true, color: { argb: C.gold } };
  ws.getCell('B11').alignment = { horizontal: 'center' };
  ws.mergeCells('C11:F11');
  ws.getCell('C11').value = '← IGV 18% incluido en precios. Modifica si cambia la tasa.';
  ws.getCell('C11').font = { italic: true, color: { argb: C.dim }, size: 9 };

  // Bloque 2: Volumen
  ws.mergeCells('A13:F13');
  ws.getCell('A13').value = '  📊 BLOQUE 2 — VOLUMEN MENSUAL PROYECTADO';
  styleSectionHeader(ws.getCell('A13'));

  const vHead = ['PRODUCTO', 'CANTIDAD / MES', 'PRECIO NETO', 'INGRESO / MES', 'INGRESO / AÑO', '% DEL TOTAL'];
  vHead.forEach((h, i) => ws.getCell(14, i + 1).value = h);
  styleHeaderRow(ws.getRow(14));

  for (let i = 0; i < 5; i++) {
    const r = 15 + i;
    ws.getCell(`A${r}`).value = tarifas[i][0];
    ws.getCell(`B${r}`).value = 100; // Editable
    ws.getCell(`C${r}`).value = { formula: `D${5 + i}` };
    ws.getCell(`D${r}`).value = { formula: `B${r}*C${r}` };
    ws.getCell(`E${r}`).value = { formula: `D${r}*12` };
    ws.getCell(`F${r}`).value = { formula: `IFERROR(D${r}/$D$20,0)` };
    styleConcept(ws.getCell(`A${r}`), false, 2);
    ws.getCell(`B${r}`).font = { italic: true, color: { argb: C.muted } };
    ws.getCell(`B${r}`).numFmt = '#,##0';
    ws.getCell(`B${r}`).alignment = { horizontal: 'right' };
    styleMoney(ws.getCell(`C${r}`));
    styleMoney(ws.getCell(`D${r}`), true);
    styleMoney(ws.getCell(`E${r}`), true);
    stylePercent(ws.getCell(`F${r}`));
  }

  // TOTAL
  ws.getCell('A20').value = '  TOTAL INGRESOS MENSUAL';
  styleConcept(ws.getCell('A20'), true, 0);
  ws.getCell('D20').value = { formula: 'SUM(D15:D19)' };
  ws.getCell('E20').value = { formula: 'D20*12' };
  ws.getCell('F20').value = 1;
  styleTotal(ws.getCell('D20'), true);
  styleTotal(ws.getCell('E20'), true);
  stylePercent(ws.getCell('F20'), true);

  // Bloque 3: EBITDA
  ws.mergeCells('A22:F22');
  ws.getCell('A22').value = '  💰 BLOQUE 3 — EBITDA PROYECTADO';
  styleSectionHeader(ws.getCell('A22'));

  const ebitdaRows = [
    ['  Ingresos mensuales proyectados', `D20`],
    ['  (−) Costos variables (% ingreso)', `D20*0.053`],
    ['  Margen de contribución', `D20-D24`],
    ['  (−) Costos fijos operativos / mes', `'P&L Gerencial'!O${pnl.totalCost}/12`],
    ['  (−) Gastos operativos / mes', `'P&L Gerencial'!O${pnl.totalExpense}/12`],
    ['  ★ EBITDA proyectado / mes', `D25-D26-D27`],
    ['  ★ EBITDA proyectado / año', `D28*12`],
    ['  Margen EBITDA proyectado', `IFERROR(D28/D20,0)`],
  ];
  ebitdaRows.forEach((r, i) => {
    const row = 23 + i;
    ws.getCell(`A${row}`).value = r[0];
    ws.getCell(`D${row}`).value = { formula: r[1] };
    styleConcept(ws.getCell(`A${row}`), r[0].includes('★'), 2);
    if (row >= 28) {
      styleTotal(ws.getCell(`D${row}`), true);
      if (row === 30) {
        ws.getCell(`D${row}`).numFmt = '0.00%';
      }
    } else {
      styleMoney(ws.getCell(`D${row}`));
    }
    if (row === 28 || row === 29) {
      ws.getCell(`A${row}`).font = { bold: true, color: { argb: C.gold } };
    }
  });

  applyGridBorders(ws, 4, 30, 1, 6);
}

/* ═══════════════════════════════════════════════════════
   HOJA 8: Datos 2026 (base PCGE mensual)
   ═══════════════════════════════════════════════════════ */

function buildDatos(wb: ExcelJS.Workbook, data: CategoryRow[], params: ExportParams) {
  const ws = wb.addWorksheet(`Datos ${params.year}`, {
    properties: { tabColor: { argb: C.muted } },
  });
  ws.getColumn(1).width = 14;
  ws.getColumn(2).width = 38;
  for (let i = 3; i <= 14; i++) ws.getColumn(i).width = 12;
  ws.getColumn(15).width = 16;

  ws.mergeCells('A1:O1');
  ws.getCell('A1').value = `${params.empresa ?? 'MI EMPRESA'} — BASE DE DATOS P&L ${params.year}`;
  styleTitle(ws.getCell('A1'));
  ws.mergeCells('A2:O2');
  ws.getCell('A2').value = 'Fuente: transacciones agregadas por cuenta contable (PCGE) y mes';
  styleSubtitle(ws.getCell('A2'));

  // Header
  const headers = ['CUENTA', 'DESCRIPCIÓN', ...MONTHS, 'TOTAL'];
  headers.forEach((h, i) => ws.getCell(3, i + 1).value = h);
  styleHeaderRow(ws.getRow(3));

  // Filas por categoría
  let r = 4;
  for (const row of data) {
    ws.getCell(`A${r}`).value = row.code;
    ws.getCell(`B${r}`).value = row.category;
    ws.getCell(`A${r}`).font = { name: 'Consolas', size: 9, color: { argb: C.dim } };
    ws.getCell(`A${r}`).alignment = { horizontal: 'center' };
    styleConcept(ws.getCell(`B${r}`), false, 1);
    MONTH_COLS.forEach((col, i) => {
      const c = ws.getCell(`${col}${r}`);
      c.value = row.months[i];
      styleMoney(c);
    });
    ws.getCell(`O${r}`).value = { formula: `SUM(C${r}:N${r})` };
    styleMoney(ws.getCell(`O${r}`), true);
    r++;
  }

  applyGridBorders(ws, 3, r - 1, 1, 15);
}

/* ═══════════════════════════════════════════════════════
   ENTRY POINT
   ═══════════════════════════════════════════════════════ */

export async function exportPnLGerencialXLSX(params: ExportParams): Promise<void> {
  const { transactions, year } = params;
  const data = aggregate(transactions, year);

  const wb = new ExcelJS.Workbook();
  wb.creator = 'Capital CFO';
  wb.created = new Date();
  wb.modified = new Date();
  wb.properties.date1904 = false;

  const pnlMap = buildPnlGerencial(wb, data, params);
  buildDashboard(wb, pnlMap, params);
  buildComparativo(wb, pnlMap, params);
  buildIndicadoresOperativos(wb, pnlMap, params);
  buildPuntoEquilibrio(wb, pnlMap, params);
  buildEstrategiaPrecios(wb, pnlMap, params);
  buildSimulador(wb, pnlMap, params);
  buildDatos(wb, data, params);

  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `CapitalCFO_Informe_Gerencial_${year}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
}
