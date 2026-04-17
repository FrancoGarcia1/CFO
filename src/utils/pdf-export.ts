import type { KPIs } from '@/types/domain';
import { CURRENCIES, type CurrencyCode } from '@/utils/constants';

function fmtAmount(n: number, currencyCode: string): string {
  const config = CURRENCIES[currencyCode as CurrencyCode] ?? CURRENCIES.PEN;
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.code,
    maximumFractionDigits: 0,
  }).format(n);
}

function pct(value: number, total: number): string {
  if (total === 0) return '0.0%';
  return `${((value / total) * 100).toFixed(1)}%`;
}

function scoreColor(score: number): string {
  if (score >= 70) return '#00e5a0';
  if (score >= 40) return '#f5a623';
  return '#ff4757';
}

function scoreBadge(score: number): string {
  if (score >= 70) return 'Saludable';
  if (score >= 40) return 'Alerta';
  return 'Crítico';
}

export function generatePDFReport(params: {
  kpis: KPIs;
  periodLabel: string;
  userName: string;
  empresa: string;
  currency?: string;
}): void {
  const { kpis, periodLabel, userName, empresa, currency = 'PEN' } = params;
  const f = (n: number) => fmtAmount(n, currency);
  const now = new Date().toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Informe Financiero - ${empresa}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #1a1a2e;
      background: #fff;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
      font-size: 13px;
      line-height: 1.5;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #1a1a2e;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    .header h1 {
      font-size: 22px;
      font-weight: 700;
      color: #1a1a2e;
    }
    .header .subtitle {
      font-size: 12px;
      color: #666;
      margin-top: 4px;
    }
    .header .meta {
      text-align: right;
      font-size: 11px;
      color: #666;
    }
    .header .meta .period {
      font-size: 14px;
      font-weight: 600;
      color: #1a1a2e;
    }

    .section-title {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: #888;
      margin-bottom: 10px;
      margin-top: 28px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 8px;
    }
    th, td {
      padding: 8px 12px;
      text-align: left;
      font-size: 12px;
    }
    th {
      background: #f5f5f8;
      font-weight: 600;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #666;
      border-bottom: 1px solid #ddd;
    }
    td {
      border-bottom: 1px solid #eee;
    }
    td.amount {
      text-align: right;
      font-family: 'SF Mono', 'Fira Code', monospace;
      font-weight: 600;
    }
    td.pct {
      text-align: right;
      color: #888;
      font-size: 11px;
    }
    tr.subtotal td {
      font-weight: 700;
      border-top: 2px solid #1a1a2e;
      border-bottom: 2px solid #1a1a2e;
      background: #f9f9fc;
    }
    tr.total td {
      font-weight: 700;
      font-size: 13px;
      border-top: 2px solid #1a1a2e;
      border-bottom: none;
    }
    tr.positive td.amount { color: #00875a; }
    tr.negative td.amount { color: #d63031; }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-top: 12px;
    }
    .kpi-card {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 14px;
      text-align: center;
    }
    .kpi-card .kpi-label {
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #888;
      margin-bottom: 6px;
    }
    .kpi-card .kpi-value {
      font-size: 20px;
      font-weight: 800;
      font-family: 'SF Mono', 'Fira Code', monospace;
    }
    .kpi-card .kpi-sub {
      font-size: 10px;
      color: #aaa;
      margin-top: 2px;
    }

    .footer {
      margin-top: 40px;
      padding-top: 16px;
      border-top: 1px solid #ddd;
      font-size: 10px;
      color: #999;
      text-align: center;
    }

    @media print {
      body { padding: 20px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1>${empresa}</h1>
      <div class="subtitle">Estado de Resultados</div>
    </div>
    <div class="meta">
      <div class="period">${periodLabel}</div>
      <div>${now}</div>
      <div>Preparado por: ${userName}</div>
    </div>
  </div>

  <div class="section-title">Estado de Resultados (P&amp;L)</div>
  <table>
    <thead>
      <tr>
        <th>Concepto</th>
        <th style="text-align:right">Monto</th>
        <th style="text-align:right">% Ingresos</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Ingresos</td>
        <td class="amount">${f(kpis.income)}</td>
        <td class="pct">100.0%</td>
      </tr>
      <tr>
        <td>(-) Costo de ventas</td>
        <td class="amount">${f(kpis.cost)}</td>
        <td class="pct">${pct(kpis.cost, kpis.income)}</td>
      </tr>
      <tr class="subtotal ${kpis.grossProfit >= 0 ? 'positive' : 'negative'}">
        <td>= Utilidad Bruta</td>
        <td class="amount">${f(kpis.grossProfit)}</td>
        <td class="pct">${kpis.margenBruto.toFixed(1)}%</td>
      </tr>
      <tr>
        <td>(-) Gastos operativos</td>
        <td class="amount">${f(kpis.expense)}</td>
        <td class="pct">${pct(kpis.expense, kpis.income)}</td>
      </tr>
      <tr class="total ${kpis.ebitda >= 0 ? 'positive' : 'negative'}">
        <td>= EBITDA</td>
        <td class="amount">${f(kpis.ebitda)}</td>
        <td class="pct">${kpis.margenEbitda.toFixed(1)}%</td>
      </tr>
    </tbody>
  </table>

  <div class="section-title">Indicadores Clave</div>
  <div class="kpi-grid">
    <div class="kpi-card">
      <div class="kpi-label">Health Score</div>
      <div class="kpi-value" style="color: ${scoreColor(kpis.score)}">${kpis.score}</div>
      <div class="kpi-sub">${scoreBadge(kpis.score)}</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Margen Bruto</div>
      <div class="kpi-value">${kpis.margenBruto.toFixed(1)}%</div>
      <div class="kpi-sub">Utilidad / Ingresos</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Margen EBITDA</div>
      <div class="kpi-value">${kpis.margenEbitda.toFixed(1)}%</div>
      <div class="kpi-sub">EBITDA / Ingresos</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Punto Equilibrio</div>
      <div class="kpi-value" style="font-size:16px">${f(kpis.pe)}</div>
      <div class="kpi-sub">Break-even mensual</div>
    </div>
  </div>

  <div class="footer">
    Generado por Capital CFO
  </div>

  <script>window.onload = function() { window.print(); }</script>
</body>
</html>`;

  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  printWindow.document.write(html);
  printWindow.document.close();
}
