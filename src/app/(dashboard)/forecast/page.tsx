'use client';

import { useState, useMemo, type FormEvent } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { LineChart } from '@/components/charts/line-chart';
import { useTransactions } from '@/hooks/use-transactions';
import { useHistorical } from '@/hooks/use-historical';
import { useSettings } from '@/hooks/use-settings';
import { usePeriod } from '@/app/(dashboard)/dashboard-shell';
import { useKpis } from '@/hooks/use-kpis';
import { useForecast } from '@/hooks/use-forecast';
import { MONTHS, COLORS } from '@/utils/constants';
import { fmt, pctStr } from '@/utils/formatters';

function buildCSVAndDownload(rows: (string | number)[][], filename: string) {
  const bom = '\ufeff';
  const csv = rows
    .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ForecastPage() {
  const { transactions, isLoading: txLoading } = useTransactions();
  const { historical, isLoading: histLoading, upsertHistorical } =
    useHistorical();
  const { settings, isLoading: setLoading, updateSettings } = useSettings();
  const { viewPeriod, viewYear, viewMonth } = usePeriod();
  const { monthlyData } = useKpis(transactions, viewPeriod, viewYear, viewMonth);
  const { forecast, updateRollingForecast } = useForecast(
    historical,
    transactions,
    settings,
  );

  const growthRate = settings?.growth_rate ?? 5;

  // Historical form state
  const [histYear, setHistYear] = useState(viewYear - 1);
  const [histMonth, setHistMonth] = useState(0);
  const [histIncome, setHistIncome] = useState('');
  const [histCost, setHistCost] = useState('');
  const [histExpense, setHistExpense] = useState('');

  function handleHistoricalSubmit(e: FormEvent) {
    e.preventDefault();
    const income = parseFloat(histIncome);
    const cost = parseFloat(histCost);
    const expense = parseFloat(histExpense);
    if (isNaN(income) || isNaN(cost) || isNaN(expense)) return;

    upsertHistorical.mutate({
      user_id: '',
      year: histYear,
      month: histMonth,
      income,
      cost,
      expense,
    });

    setHistIncome('');
    setHistCost('');
    setHistExpense('');
  }

  function handleGrowthChange(value: number) {
    updateSettings.mutate({ growth_rate: value });
  }

  const comparisonData = useMemo(() => {
    return MONTHS.map((label, i) => {
      const hist = historical.find(
        (h) => h.year === viewYear - 1 && h.month === i,
      );
      const actual = monthlyData[i];
      const proj = forecast.find((f) => f.month === i);

      const prevIncome = hist?.income ?? 0;
      const actualIncome = actual.income;
      const projIncome = proj?.projIncome ?? 0;

      const variation =
        prevIncome > 0
          ? ((actualIncome - prevIncome) / prevIncome) * 100
          : 0;

      const compliance =
        projIncome > 0
          ? ((actualIncome / projIncome) * 100)
          : 0;

      return {
        label,
        month: i,
        prevIncome,
        actualIncome,
        variation,
        projIncome,
        compliance,
      };
    });
  }, [historical, monthlyData, forecast, viewYear]);

  const chartActualData = useMemo(
    () =>
      MONTHS.map((label, i) => ({
        label,
        value: monthlyData[i].income,
      })),
    [monthlyData],
  );

  const chartProjectedData = useMemo(
    () =>
      MONTHS.map((label, i) => {
        const proj = forecast.find((f) => f.month === i);
        return { label, value: proj?.projIncome ?? 0 };
      }),
    [forecast],
  );

  function handleExportComparison() {
    const headers = [
      'Mes',
      'A\u00f1o Anterior',
      'Actual',
      'Variaci\u00f3n %',
      'Proyectado',
      'Cumplimiento %',
    ];
    const rows = comparisonData.map((r) => [
      r.label,
      r.prevIncome,
      r.actualIncome,
      `${r.variation.toFixed(1)}%`,
      r.projIncome,
      `${r.compliance.toFixed(1)}%`,
    ]);
    const date = new Date().toISOString().slice(0, 10);
    buildCSVAndDownload([headers, ...rows], `CapitalCFO_Forecast_${date}.csv`);
  }

  function complianceColor(value: number): string {
    if (value >= 100) return COLORS.positive;
    if (value >= 80) return COLORS.warning;
    return COLORS.negative;
  }

  if (txLoading || histLoading || setLoading) {
    return <LoadingSpinner className="mt-20" size="lg" />;
  }

  return (
    <div className="space-y-6 animate-enter">
      {/* ── Top Grid: Historical + Rolling Forecast ───── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Historical Data Form */}
        <div className="card-bordered rounded-lg p-5 animate-enter delay-1">
          <span className="micro-label mb-5 block">DATOS HIST&Oacute;RICOS</span>
          <form onSubmit={handleHistoricalSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hist-year">A&ntilde;o</Label>
                <Input
                  id="hist-year"
                  type="number"
                  value={histYear}
                  onChange={(e) => setHistYear(parseInt(e.target.value, 10))}
                />
              </div>
              <div>
                <Label htmlFor="hist-month">Mes</Label>
                <select
                  id="hist-month"
                  value={histMonth}
                  onChange={(e) => setHistMonth(parseInt(e.target.value, 10))}
                  className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none transition-colors duration-200"
                >
                  {MONTHS.map((m, i) => (
                    <option key={i} value={i}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="hist-income">Ingresos</Label>
                <Input
                  id="hist-income"
                  type="number"
                  min="0"
                  step="0.01"
                  value={histIncome}
                  onChange={(e) => setHistIncome(e.target.value)}
                  placeholder="S/ 0"
                />
              </div>
              <div>
                <Label htmlFor="hist-cost">Costos</Label>
                <Input
                  id="hist-cost"
                  type="number"
                  min="0"
                  step="0.01"
                  value={histCost}
                  onChange={(e) => setHistCost(e.target.value)}
                  placeholder="S/ 0"
                />
              </div>
              <div>
                <Label htmlFor="hist-expense">Gastos</Label>
                <Input
                  id="hist-expense"
                  type="number"
                  min="0"
                  step="0.01"
                  value={histExpense}
                  onChange={(e) => setHistExpense(e.target.value)}
                  placeholder="S/ 0"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={upsertHistorical.isPending}
            >
              {upsertHistorical.isPending ? 'Guardando...' : 'Guardar'}
            </Button>
          </form>
        </div>

        {/* Rolling Forecast Panel */}
        <div className="card-bordered rounded-lg p-5 animate-enter delay-2">
          <span className="micro-label mb-5 block">ROLLING FORECAST</span>

          <div className="space-y-6">
            {/* Big stat display */}
            <div className="flex flex-col items-center py-4">
              <span className="micro-label mb-2">TASA DE CRECIMIENTO</span>
              <span className="stat-value text-5xl text-primary">
                {growthRate.toFixed(1)}%
              </span>
            </div>

            {/* Slider */}
            <div className="space-y-2">
              <input
                type="range"
                min={3}
                max={15}
                step={0.5}
                value={growthRate}
                onChange={(e) => handleGrowthChange(Number(e.target.value))}
                className="w-full h-2 rounded-full bg-border appearance-none cursor-pointer"
                style={{ accentColor: '#c8a15a' }}
              />
              <div className="flex justify-between">
                <span className="font-mono text-[11px] text-darker">3%</span>
                <span className="font-mono text-[11px] text-darker">15%</span>
              </div>
            </div>

            {/* Action button */}
            <Button
              onClick={updateRollingForecast}
              className="w-full"
            >
              Ajustar forecast
            </Button>

            {settings?.last_forecast_q && (
              <p className="text-[11px] text-darker text-center">
                &Uacute;ltima actualizaci&oacute;n: {settings.last_forecast_q}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="divider" />

      {/* ── Comparison Table ──────────────────────────────── */}
      <section className="animate-enter delay-3">
        <div className="flex items-center justify-between mb-4">
          <span className="micro-label">COMPARATIVO MENSUAL</span>
          <Button variant="secondary" size="sm" onClick={handleExportComparison}>
            Exportar CSV
          </Button>
        </div>

        <Card elevation="flat" className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-2/50">
                  <th className="py-3 px-5 text-left micro-label">Mes</th>
                  <th className="py-3 px-4 text-right micro-label">A&ntilde;o ant.</th>
                  <th className="py-3 px-4 text-right micro-label">Actual</th>
                  <th className="py-3 px-4 text-right micro-label">Variaci&oacute;n</th>
                  <th className="py-3 px-4 text-right micro-label">Proyectado</th>
                  <th className="py-3 px-4 text-right micro-label">Cumpl.</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, idx) => (
                  <tr
                    key={row.month}
                    className={`
                      border-b border-border/30
                      hover:bg-surface-2 transition-colors duration-150
                      ${idx % 2 === 0 ? 'bg-transparent' : 'bg-surface/50'}
                    `}
                  >
                    <td className="py-3 px-5 text-foreground font-medium text-sm">
                      {row.label}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-xs text-muted-foreground">
                      {fmt(row.prevIncome)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-xs font-bold text-foreground">
                      {fmt(row.actualIncome)}
                    </td>
                    <td
                      className="py-3 px-4 text-right font-mono text-xs font-bold"
                      style={{
                        color:
                          row.variation > 0
                            ? COLORS.positive
                            : row.variation < 0
                              ? COLORS.negative
                              : COLORS.neutral,
                      }}
                    >
                      {pctStr(row.variation)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-xs text-warning">
                      {fmt(row.projIncome)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className="inline-flex items-center font-mono text-xs font-bold px-2 py-0.5 rounded-sm"
                        style={{
                          color: complianceColor(row.compliance),
                          backgroundColor:
                            row.compliance >= 100
                              ? 'rgba(0, 229, 160, 0.1)'
                              : row.compliance >= 80
                                ? 'rgba(245, 166, 35, 0.1)'
                                : 'rgba(255, 71, 87, 0.1)',
                        }}
                      >
                        {row.compliance.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      <div className="divider" />

      {/* ── Trend Chart ───────────────────────────────────── */}
      <section className="animate-enter delay-4">
        <span className="micro-label mb-4 block">ACTUAL VS PROYECTADO</span>
        <Card elevation="flat">
          <div className="flex items-center gap-5 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-4 h-[3px] rounded-full bg-primary" />
              <span className="text-[11px] text-muted-foreground">Actual</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-[3px] rounded-full bg-warning opacity-70" />
              <span className="text-[11px] text-muted-foreground">Proyectado</span>
            </div>
          </div>
          <LineChart data={chartActualData} data2={chartProjectedData} />
        </Card>
      </section>
    </div>
  );
}
