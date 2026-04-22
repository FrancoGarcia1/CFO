'use client';

import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useTransactions } from '@/hooks/use-transactions';
import { useHistorical } from '@/hooks/use-historical';
import { useSettings } from '@/hooks/use-settings';
import { usePeriod } from '@/app/(dashboard)/dashboard-shell';
import { useKpis } from '@/hooks/use-kpis';
import { useForecast } from '@/hooks/use-forecast';
import { useAuth } from '@/providers/auth-provider';
import { useCurrency } from '@/hooks/use-currency';
import { exportCSV, exportPnLCSV, exportPnLGerencialCSV } from '@/utils/csv-export';
import { exportPnLGerencialXLSX } from '@/utils/xlsx-export';
import { generatePDFReport } from '@/utils/pdf-export';
import { MONTHS } from '@/utils/constants';
import { fmt } from '@/utils/formatters';
import { filterTxns } from '@/utils/filters';

interface ExportCard {
  icon: string;
  title: string;
  description: string;
  action: () => void;
  buttonLabel: string;
  isPrimary?: boolean;
}

function buildCSVAndDownload(rows: (string | number)[][], filename: string) {
  const bom = '\ufeff';
  const DELIM = ';';
  const hint = `sep=${DELIM}\n`;
  const body = rows
    .map((r) => r.map((c) => {
      const s = String(c);
      return s.includes(DELIM) || s.includes('"') || s.includes('\n')
        ? `"${s.replace(/"/g, '""')}"`
        : s;
    }).join(DELIM))
    .join('\n');
  const blob = new Blob([bom + hint + body], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ReportesPage() {
  const { transactions, isLoading: txLoading } = useTransactions();
  const { historical } = useHistorical();
  const { settings } = useSettings();
  const { viewPeriod, viewYear, viewMonth } = usePeriod();
  const { kpis, monthlyData } = useKpis(transactions, viewPeriod, viewYear, viewMonth);
  const { forecast } = useForecast(historical, transactions, settings);
  const { profile } = useAuth();
  const { currency } = useCurrency();

  // Year-to-date KPIs
  const ytdKpis = useMemo(() => {
    const ytdTxns = filterTxns(transactions, { year: viewYear });
    const income = ytdTxns.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const cost = ytdTxns.filter((t) => t.type === 'cost').reduce((s, t) => s + t.amount, 0);
    const expense = ytdTxns.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const ebitda = income - cost - expense;
    const margin = income > 0 ? (ebitda / income) * 100 : 0;
    const count = ytdTxns.length;
    return { income, ebitda, margin, count };
  }, [transactions, viewYear]);

  // Month-to-date KPIs
  const mtdKpis = useMemo(() => {
    return {
      income: kpis.income,
      ebitda: kpis.ebitda,
      margin: kpis.margenEbitda,
      count: kpis.countIncome,
    };
  }, [kpis]);

  function handleExportForecast() {
    const headers = [
      'Mes',
      'Actual Ingresos',
      'Proyectado Ingresos',
      'Actual Costos',
      'Proyectado Costos',
      'Actual Gastos',
      'Proyectado Gastos',
    ];
    const rows = MONTHS.map((label, i) => {
      const actual = monthlyData[i];
      const proj = forecast.find((f) => f.month === i);
      return [
        label,
        actual.income,
        proj?.projIncome ?? 0,
        actual.cost,
        proj?.projCost ?? 0,
        actual.expense,
        proj?.projExpense ?? 0,
      ];
    });
    const date = new Date().toISOString().slice(0, 10);
    buildCSVAndDownload([headers, ...rows], `CapitalCFO_ForecastVsReal_${date}.csv`);
  }

  const exportCards: ExportCard[] = [
    {
      icon: '\uD83D\uDCD1',
      title: 'Informe Gerencial Completo (XLSX)',
      description: '8 hojas con fórmulas vivas: P&L, Dashboard, Comparativo vs PSTO, Indicadores Operativos, Punto de Equilibrio, Estrategia de Precios, Simulador y base de Datos.',
      action: () => exportPnLGerencialXLSX({
        transactions,
        year: viewYear,
        empresa: profile?.empresa ?? 'MI EMPRESA',
      }),
      buttonLabel: 'Exportar Informe (8 hojas)',
      isPrimary: true,
    },
    {
      icon: '\uD83D\uDCCA',
      title: 'P&L Gerencial Anual (CSV)',
      description: 'Formato plano CSV para importar a otros sistemas (1 sola hoja).',
      action: () => exportPnLGerencialCSV({
        transactions,
        year: viewYear,
        empresa: profile?.empresa ?? 'MI EMPRESA',
      }),
      buttonLabel: 'Exportar P&L CSV',
    },
    {
      icon: '\uD83D\uDCC8',
      title: 'P&L Resumen',
      description: 'Estado de resultados del período con indicadores clave.',
      action: () => exportPnLCSV(kpis),
      buttonLabel: 'Exportar resumen',
    },
    {
      icon: '\uD83D\uDCCB',
      title: 'Transacciones',
      description: 'Listado completo de todas las transacciones registradas.',
      action: () => exportCSV(transactions),
      buttonLabel: 'Exportar transacciones',
    },
    {
      icon: '\uD83D\uDCC9',
      title: 'Forecast vs Real',
      description: 'Comparativo mensual entre proyecciones y datos reales.',
      action: handleExportForecast,
      buttonLabel: 'Exportar forecast',
    },
    {
      icon: '\uD83D\uDCC4',
      title: 'Informe PDF',
      description: 'Imprime o guarda como PDF el dashboard actual.',
      action: () =>
        generatePDFReport({
          kpis,
          periodLabel: `${MONTHS[viewMonth]} ${viewYear}`,
          userName: profile?.nombre ?? 'Usuario',
          empresa: profile?.empresa ?? 'Mi Empresa',
          currency,
        }),
      buttonLabel: 'Generar PDF',
    },
  ];

  if (txLoading) {
    return <LoadingSpinner className="mt-20" size="lg" />;
  }

  return (
    <div className="animate-enter space-y-6">
      {/* Section: Export Cards */}
      <section>
        <p className="micro-label mb-3">EXPORTAR REPORTES</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {exportCards.map((card) => (
            <div
              key={card.title}
              className="card-bordered card-interactive flex flex-col items-center
                text-center p-5 hover:-translate-y-1 transition-transform"
            >
              <span className="text-3xl mb-3">{card.icon}</span>
              <h3 className="font-semibold text-foreground text-sm mb-1">
                {card.title}
              </h3>
              <p className="text-xs text-muted-foreground mb-4 line-clamp-2 flex-1">
                {card.description}
              </p>
              <Button
                onClick={card.action}
                variant={card.isPrimary ? 'primary' : 'secondary'}
                size="sm"
                className="w-full"
              >
                {card.buttonLabel}
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="divider" />

      {/* Section: Accumulated Summary */}
      <section>
        <p className="micro-label mb-3">RESUMEN ACUMULADO</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SummaryTile
            title="AÑO COMPLETO"
            subtitle={`Enero - Diciembre ${viewYear}`}
            variant="green"
            income={ytdKpis.income}
            ebitda={ytdKpis.ebitda}
            margin={ytdKpis.margin}
            count={ytdKpis.count}
          />
          <SummaryTile
            title="MES ACTUAL"
            subtitle={`${MONTHS[viewMonth]} ${viewYear}`}
            variant="surface"
            income={mtdKpis.income}
            ebitda={mtdKpis.ebitda}
            margin={mtdKpis.margin}
            count={mtdKpis.count}
          />
        </div>
      </section>
    </div>
  );
}

/* ── Summary Tile ── */

interface SummaryTileProps {
  title: string;
  subtitle: string;
  variant: 'green' | 'surface';
  income: number;
  ebitda: number;
  margin: number;
  count: number;
}

function SummaryTile({
  title,
  subtitle,
  variant,
  income,
  ebitda,
  margin,
  count,
}: SummaryTileProps) {
  const tileClass = variant === 'green' ? 'tile tile-green' : 'tile tile-surface';
  const labelColor = variant === 'green' ? 'text-black/60' : 'text-muted-foreground';
  const valueColor = variant === 'green' ? 'text-black' : 'text-foreground';
  const ebitdaNegColor = variant === 'green' ? 'text-red-900' : 'text-danger';

  const metrics = [
    { label: 'Ingresos', value: fmt(income) },
    { label: 'EBITDA', value: fmt(ebitda), negative: ebitda < 0 },
    { label: 'Margen', value: `${margin.toFixed(1)}%` },
    { label: 'Transacciones', value: String(count) },
  ];

  return (
    <div className={tileClass}>
      <div className="mb-4">
        <h3 className={`text-[10px] font-bold uppercase tracking-[2px] ${labelColor}`}>
          {title}
        </h3>
        <p className={`text-xs ${labelColor}`}>{subtitle}</p>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
        {metrics.map((m) => (
          <div key={m.label}>
            <p className={`text-xs ${labelColor} mb-0.5`}>{m.label}</p>
            <p
              className={`stat-value text-lg ${
                m.negative ? ebitdaNegColor : valueColor
              }`}
            >
              {m.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
