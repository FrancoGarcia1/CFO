'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ScoreRing } from '@/components/charts/score-ring';
import { BarChart } from '@/components/charts/bar-chart';
import { LineChart } from '@/components/charts/line-chart';
import { useTransactions } from '@/hooks/use-transactions';
import { useVisitors } from '@/hooks/use-visitors';
import { useSettings } from '@/hooks/use-settings';
import { usePeriod } from '@/app/(dashboard)/dashboard-shell';
import { useKpis } from '@/hooks/use-kpis';
import { useCfoChat } from '@/hooks/use-cfo-chat';
import { FinancialGoals } from '@/components/dashboard/financial-goals';
import { MONTHS, COLORS } from '@/utils/constants';
import { fmt, fmtN } from '@/utils/formatters';
import { exportPnLCSV } from '@/utils/csv-export';

export default function DashboardPage() {
  const router = useRouter();
  const { transactions, isLoading: txLoading } = useTransactions();
  const { visitors, occupancy, isLoading: visLoading } = useVisitors();
  const { settings } = useSettings();
  const { viewPeriod, viewYear, viewMonth } = usePeriod();
  const { kpis, monthlyData } = useKpis(transactions, viewPeriod, viewYear, viewMonth);
  const { runDiagnosis } = useCfoChat();

  const { avgVisitors, avgOccupancy } = useMemo(() => {
    const mVis = visitors.filter((v) => {
      const [, m] = v.date.split('-').map(Number);
      return m - 1 === viewMonth;
    });
    const mOcc = occupancy.filter((o) => {
      const [, m] = o.date.split('-').map(Number);
      return m - 1 === viewMonth;
    });
    return {
      avgVisitors: mVis.length > 0 ? mVis.reduce((s, v) => s + v.count, 0) / mVis.length : 0,
      avgOccupancy: mOcc.length > 0 ? mOcc.reduce((s, o) => s + o.pct, 0) / mOcc.length : 0,
    };
  }, [visitors, occupancy, viewMonth]);

  // Month-over-month delta
  const prevIdx = viewMonth > 0 ? viewMonth - 1 : null;
  const prev = prevIdx !== null ? monthlyData[prevIdx] : null;
  const prevLabel = prevIdx !== null ? MONTHS[prevIdx] : '';

  function delta(cur: number, prv: number | null) {
    if (prv === null || prv === 0) return null;
    return ((cur - prv) / Math.abs(prv)) * 100;
  }

  function DeltaBadge({ cur, prv }: { cur: number; prv: number | null }) {
    const d = delta(cur, prv);
    if (d === null) return null;
    const positive = d >= 0;
    return (
      <span className={`inline-flex items-center gap-0.5 text-[10px] font-mono font-medium ${positive ? 'text-primary' : 'text-danger'}`}>
        {positive ? '▲' : '▼'} {Math.abs(d).toFixed(1)}%
        <span className="text-darker font-normal ml-0.5">vs {prevLabel}</span>
      </span>
    );
  }

  // Chart data
  const incomeChart = MONTHS.map((label, i) => ({ label, value: monthlyData[i].income }));
  const ebitdaChart = MONTHS.map((label, i) => ({
    label,
    value: Math.max(0, monthlyData[i].ebitda),
    value2: monthlyData[i].ebitda < 0 ? Math.abs(monthlyData[i].ebitda) : 0,
  }));
  const incomeTrend = MONTHS.map((label, i) => ({ label, value: monthlyData[i].income }));
  const marginTrend = MONTHS.map((label, i) => ({ label, value: monthlyData[i].margenEbitda }));

  const costPct = kpis.income > 0 ? ((kpis.cost / kpis.income) * 100).toFixed(1) : '0.0';
  const expPct = kpis.income > 0 ? ((kpis.expense / kpis.income) * 100).toFixed(1) : '0.0';

  async function handleDiagnosis() {
    await runDiagnosis(kpis, viewPeriod, settings?.growth_rate ?? 5);
    router.push('/cfo');
  }

  if (txLoading || visLoading) {
    return <LoadingSpinner className="mt-20" size="lg" />;
  }

  return (
    <div className="space-y-6 animate-enter">

      {/* ═══ Hero KPIs — tiles + score ring ═══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        {/* Tile: Ingresos */}
        <div className="tile tile-green min-h-0 p-3 sm:p-5">
          <div>
            <div className="text-[10px] font-semibold text-black/50 uppercase tracking-wider">Ingresos</div>
            <div className="text-xl sm:text-2xl font-mono font-bold tracking-tight mt-0.5">{fmt(kpis.income)}</div>
          </div>
          <DeltaBadge cur={kpis.income} prv={prev?.income ?? null} />
        </div>

        {/* Tile: EBITDA */}
        <div className="tile tile-olive min-h-0 p-3 sm:p-5">
          <div>
            <div className="text-[10px] font-semibold text-black/50 uppercase tracking-wider">EBITDA</div>
            <div className="text-xl sm:text-2xl font-mono font-bold tracking-tight mt-0.5">{fmt(kpis.ebitda)}</div>
          </div>
          <div className="text-[10px] font-medium text-black/60">
            Margen {kpis.margenEbitda.toFixed(1)}%
          </div>
        </div>

        {/* Tile: Utilidad Bruta */}
        <div className="tile tile-surface min-h-0 p-3 sm:p-5">
          <div>
            <div className="micro-label text-[8px]">Utilidad Bruta</div>
            <div className="text-xl sm:text-2xl font-mono font-bold tracking-tight text-foreground mt-0.5">
              {fmt(kpis.grossProfit)}
            </div>
          </div>
          <div className="text-[10px] font-mono text-muted-foreground">
            {kpis.margenBruto.toFixed(1)}% margen
          </div>
        </div>

        {/* Score Ring */}
        <div className="card-bordered rounded-lg p-2 sm:p-4 flex items-center justify-center">
          <ScoreRing score={kpis.score} size="sm" />
        </div>
      </div>

      {/* ═══ Secondary KPIs — scrollable on mobile ═══ */}
      <div className="flex gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-5 sm:overflow-visible" style={{ scrollbarWidth: 'none' }}>
        {[
          { label: 'P. EQUILIBRIO', value: fmt(kpis.pe), color: '#f5a623' },
          { label: 'TRANSACC.', value: fmtN(kpis.countIncome), color: '#969593' },
          { label: 'TICKET', value: fmt(kpis.avgTicket), color: '#969593' },
          { label: 'VISITANTES', value: avgVisitors > 0 ? fmtN(avgVisitors) : '—', color: '#969593' },
          { label: 'OCUPACIÓN', value: avgOccupancy > 0 ? `${avgOccupancy.toFixed(1)}%` : '—', color: '#969593' },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="kpi-indicator bg-surface rounded-lg p-2.5 sm:p-3 flex-shrink-0 min-w-[110px] sm:min-w-0"
            style={{ '--kpi-color': kpi.color } as React.CSSProperties}
          >
            <div className="text-[8px] sm:text-[9px] font-semibold uppercase tracking-[1.5px] text-muted-foreground">
              {kpi.label}
            </div>
            <div className="font-mono text-sm sm:text-lg font-bold text-foreground mt-0.5">
              {kpi.value}
            </div>
          </div>
        ))}
      </div>

      {/* ═══ Charts — 2x2 grid ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
        <Card className="p-3 sm:p-5">
          <h3 className="micro-label mb-2">Ingresos por mes</h3>
          <BarChart data={incomeChart} color={COLORS.positive} />
        </Card>
        <Card className="p-3 sm:p-5">
          <h3 className="micro-label mb-2">EBITDA por mes</h3>
          <BarChart data={ebitdaChart} color={COLORS.positive} color2={COLORS.negative} />
        </Card>
        <Card className="p-3 sm:p-5">
          <h3 className="micro-label mb-2">Tendencia ingresos</h3>
          <LineChart data={incomeTrend} />
        </Card>
        <Card className="p-3 sm:p-5">
          <h3 className="micro-label mb-2">Margen % tendencia</h3>
          <LineChart data={marginTrend} />
        </Card>
      </div>

      {/* ═══ P&L Table ═══ */}
      <Card>
        <h3 className="micro-label mb-4">Estado de Resultados</h3>
        <div className="space-y-0">
          <PnlRow label="Ingresos" amount={kpis.income} pct="100.0" bold />
          <PnlRow label="(-) Costos" amount={-kpis.cost} pct={costPct} />
          <PnlRow label="= Utilidad Bruta" amount={kpis.grossProfit} pct={kpis.margenBruto.toFixed(1)} bold />
          <PnlRow label="(-) Gastos" amount={-kpis.expense} pct={expPct} />
          <PnlRow label="= EBITDA" amount={kpis.ebitda} pct={kpis.margenEbitda.toFixed(1)} bold highlight />
        </div>
      </Card>

      {/* ═══ Financial Goals ═══ */}
      <FinancialGoals kpis={kpis} />

      {/* ═══ Actions ═══ */}
      <div className="flex flex-wrap gap-2 pb-4">
        <Button variant="secondary" onClick={() => exportPnLCSV(kpis)}>
          Exportar Excel
        </Button>
        <Button variant="secondary" onClick={() => window.print()}>
          Imprimir PDF
        </Button>
        <Button onClick={handleDiagnosis}>
          Diagnóstico CFO
        </Button>
      </div>
    </div>
  );
}

/* ─── P&L Row ─── */
function PnlRow({
  label,
  amount,
  pct,
  bold,
  highlight,
}: {
  label: string;
  amount: number;
  pct: string;
  bold?: boolean;
  highlight?: boolean;
}) {
  const weight = bold ? 'font-bold' : 'font-normal';
  const color = highlight
    ? amount >= 0 ? 'text-primary' : 'text-danger'
    : 'text-foreground';

  return (
    <div className={`flex items-center justify-between py-3 border-b border-border/30 ${bold ? 'bg-surface/50 -mx-5 px-5 rounded' : ''}`}>
      <span className={`text-sm ${weight} ${color}`}>{label}</span>
      <div className="flex items-center gap-6">
        <span className="text-xs font-mono text-muted-foreground w-14 text-right">
          {pct}%
        </span>
        <span className={`text-sm font-mono ${weight} ${color} w-24 text-right`}>
          {fmt(Math.abs(amount))}
        </span>
      </div>
    </div>
  );
}
