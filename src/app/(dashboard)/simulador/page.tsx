'use client';

import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useTransactions } from '@/hooks/use-transactions';
import { usePeriod } from '@/app/(dashboard)/dashboard-shell';
import { useKpis } from '@/hooks/use-kpis';
import { useSimulator } from '@/hooks/use-simulator';
import { COLORS } from '@/utils/constants';
import { fmt } from '@/utils/formatters';
import type { SimulatorState } from '@/types/domain';

interface SliderConfig {
  key: keyof SimulatorState;
  label: string;
  min: number;
  max: number;
  favorableWhen: 'positive' | 'negative';
}

const SLIDERS: SliderConfig[] = [
  { key: 'income', label: 'VARIACION INGRESOS', min: -50, max: 100, favorableWhen: 'positive' },
  { key: 'cost', label: 'VARIACION COSTOS', min: -40, max: 50, favorableWhen: 'negative' },
  { key: 'expense', label: 'VARIACION GASTOS', min: -40, max: 50, favorableWhen: 'negative' },
];

function getSliderColor(value: number, favorableWhen: 'positive' | 'negative'): string {
  if (value === 0) return COLORS.neutral;
  const isFavorable =
    favorableWhen === 'positive' ? value > 0 : value < 0;
  return isFavorable ? COLORS.positive : COLORS.negative;
}

export default function SimuladorPage() {
  const router = useRouter();
  const { transactions, isLoading } = useTransactions();
  const { viewPeriod, viewYear, viewMonth } = usePeriod();
  const { kpis } = useKpis(transactions, viewPeriod, viewYear, viewMonth);
  const { simLines, simResult, setSimLine, reset } = useSimulator(kpis);

  function handleCfoEval() {
    const prompt = encodeURIComponent(
      `Evalúa este escenario: ingresos ${simLines.income > 0 ? '+' : ''}${simLines.income}%, ` +
      `costos ${simLines.cost > 0 ? '+' : ''}${simLines.cost}%, ` +
      `gastos ${simLines.expense > 0 ? '+' : ''}${simLines.expense}%. ` +
      `EBITDA pasaría de ${fmt(kpis.ebitda)} a ${fmt(simResult.ebitda)}. ` +
      `¿Es viable? ¿Qué riesgos hay?`,
    );
    router.push(`/cfo?prompt=${prompt}`);
  }

  if (isLoading) {
    return <LoadingSpinner className="mt-20" size="lg" />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-enter">
      {/* Left Column: Sliders */}
      <Card elevation="flat">
        <p className="micro-label mb-5">VARIABLES DE SIMULACION</p>

        <div className="flex flex-col">
          {SLIDERS.map((slider, idx) => {
            const value = simLines[slider.key];
            const color = getSliderColor(value, slider.favorableWhen);

            return (
              <div key={slider.key}>
                <div className="card-bordered rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="micro-label">{slider.label}</span>
                    <span
                      className="stat-value text-2xl"
                      style={{ color }}
                    >
                      {value > 0 ? '+' : ''}{value}%
                    </span>
                  </div>
                  <Slider
                    min={slider.min}
                    max={slider.max}
                    value={value}
                    onChange={(v) => setSimLine(slider.key, v)}
                    accentColor={color}
                  />
                  <div className="flex justify-between font-mono text-xs text-darker mt-2">
                    <span>{slider.min}%</span>
                    <span>{slider.max}%</span>
                  </div>
                </div>
                {idx < SLIDERS.length - 1 && <div className="divider my-4" />}
              </div>
            );
          })}
        </div>

        <div className="divider my-4" />
        <Button variant="ghost" size="sm" onClick={reset} className="w-full">
          Resetear
        </Button>
      </Card>

      {/* Right Column: Results */}
      <div className="space-y-4">
        {/* Projected P&L Table */}
        <Card elevation="flat">
          <p className="micro-label mb-4">P&L PROYECTADO</p>
          <div className="divider mb-3" />

          <div className="flex flex-col gap-0.5">
            <SimRow label="Ingresos" base={kpis.income} projected={simResult.income} />
            <SimRow label="Costos" base={kpis.cost} projected={simResult.cost} />
            <SimRow
              label="Utilidad Bruta"
              base={kpis.grossProfit}
              projected={simResult.grossProfit}
              bold
            />
            <SimRow label="Gastos" base={kpis.expense} projected={simResult.expense} />
            <SimRow
              label="EBITDA"
              base={kpis.ebitda}
              projected={simResult.ebitda}
              bold
              highlight
            />
          </div>
        </Card>

        {/* EBITDA Impact Card */}
        <Card elevation="flat">
          <div className="text-center py-4">
            <p
              className="stat-value text-4xl"
              style={{
                color:
                  simResult.deltaEbitda >= 0
                    ? COLORS.positive
                    : COLORS.negative,
              }}
            >
              {simResult.deltaEbitda >= 0 ? '+' : ''}
              {fmt(simResult.deltaEbitda)}
            </p>
            <p className="micro-label mt-2">VARIACION EBITDA</p>
          </div>

          <div className="divider my-3" />

          <div className="grid grid-cols-2 gap-3">
            <div className="card-bordered rounded-lg p-4 text-center">
              <p className="micro-label mb-2">MARGEN ANTES</p>
              <p className="stat-value text-xl text-foreground">
                {kpis.margenEbitda.toFixed(1)}%
              </p>
            </div>
            <div className="card-bordered rounded-lg p-4 text-center">
              <p className="micro-label mb-2">MARGEN DESPUES</p>
              <p
                className="stat-value text-xl"
                style={{
                  color:
                    simResult.margenEbitda >= kpis.margenEbitda
                      ? COLORS.positive
                      : COLORS.negative,
                }}
              >
                {simResult.margenEbitda.toFixed(1)}%
              </p>
            </div>
          </div>
        </Card>

        {/* CFO Evaluation Button */}
        <Button onClick={handleCfoEval} className="w-full" size="lg">
          Evaluar con CFO
        </Button>
      </div>
    </div>
  );
}

function SimRow({
  label,
  base,
  projected,
  bold,
  highlight,
}: {
  label: string;
  base: number;
  projected: number;
  bold?: boolean;
  highlight?: boolean;
}) {
  const diff = projected - base;
  const isBold = bold ?? false;
  const projColor = highlight
    ? projected >= 0
      ? COLORS.positive
      : COLORS.negative
    : undefined;

  return (
    <div
      className={`flex items-center justify-between py-2.5 px-2 rounded ${
        isBold ? 'bg-surface/50' : ''
      } border-b border-border/30`}
    >
      <span className={`text-sm text-foreground ${isBold ? 'font-bold' : ''}`}>
        {label}
      </span>
      <div className="flex items-center gap-3">
        <span className={`font-mono text-sm text-muted-foreground ${isBold ? 'font-bold' : ''}`}>
          {fmt(base)}
        </span>
        <span className="text-darker text-xs">{'\u2192'}</span>
        <span
          className={`font-mono text-sm ${isBold ? 'font-bold' : ''}`}
          style={{ color: projColor }}
        >
          {fmt(projected)}
        </span>
      </div>
    </div>
  );
}
