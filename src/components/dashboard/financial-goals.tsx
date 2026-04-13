'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { COLORS } from '@/utils/constants';
import { fmt } from '@/utils/formatters';
import type { KPIs } from '@/types/domain';

const STORAGE_KEY = 'vcfo_goals';

type GoalMetric = 'income' | 'ebitda' | 'margenBruto';
type GoalPeriod = 'month' | 'year';

interface FinancialGoal {
  id: string;
  label: string;
  target: number;
  metric: GoalMetric;
  period: GoalPeriod;
}

const METRIC_LABELS: Record<GoalMetric, string> = {
  income: 'Ingresos',
  ebitda: 'EBITDA',
  margenBruto: 'Margen Bruto (%)',
};

function getGoalColor(pct: number): string {
  if (pct >= 100) return COLORS.positive;
  if (pct >= 70) return COLORS.warning;
  return COLORS.negative;
}

function readGoals(): FinancialGoal[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as FinancialGoal[]) : [];
  } catch {
    return [];
  }
}

function writeGoals(goals: FinancialGoal[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
}

function getCurrentValue(metric: GoalMetric, kpis: KPIs): number {
  switch (metric) {
    case 'income': return kpis.income;
    case 'ebitda': return kpis.ebitda;
    case 'margenBruto': return kpis.margenBruto;
  }
}

function formatValue(metric: GoalMetric, value: number): string {
  if (metric === 'margenBruto') return `${value.toFixed(1)}%`;
  return fmt(value);
}

interface FinancialGoalsProps {
  kpis: KPIs;
}

export function FinancialGoals({ kpis }: FinancialGoalsProps) {
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formLabel, setFormLabel] = useState('');
  const [formTarget, setFormTarget] = useState('');
  const [formMetric, setFormMetric] = useState<GoalMetric>('income');
  const [formPeriod, setFormPeriod] = useState<GoalPeriod>('month');

  useEffect(() => {
    setGoals(readGoals());
  }, []);

  const saveGoal = useCallback(() => {
    const target = parseFloat(formTarget);
    if (!formLabel.trim() || isNaN(target) || target <= 0) return;
    const newGoal: FinancialGoal = {
      id: crypto.randomUUID(),
      label: formLabel.trim(),
      target,
      metric: formMetric,
      period: formPeriod,
    };
    const updated = [...goals, newGoal];
    setGoals(updated);
    writeGoals(updated);
    setFormLabel('');
    setFormTarget('');
    setShowForm(false);
  }, [formLabel, formTarget, formMetric, formPeriod, goals]);

  const removeGoal = useCallback((id: string) => {
    const updated = goals.filter((g) => g.id !== id);
    setGoals(updated);
    writeGoals(updated);
  }, [goals]);

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[9px] tracking-[2.5px] text-dim font-bold uppercase">
          METAS FINANCIERAS
        </h3>
        <button
          onClick={() => setShowForm((p) => !p)}
          className="text-[10px] font-bold text-primary hover:text-primary/80 transition-colors"
        >
          {showForm ? 'Cancelar' : '+ Agregar meta'}
        </button>
      </div>

      {showForm && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 p-3 bg-background/50 rounded-lg border border-border">
          <input
            type="text"
            placeholder="Nombre de la meta"
            value={formLabel}
            onChange={(e) => setFormLabel(e.target.value)}
            className="col-span-2 sm:col-span-1 bg-card border border-border rounded px-2 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <input
            type="number"
            placeholder="Objetivo"
            value={formTarget}
            onChange={(e) => setFormTarget(e.target.value)}
            className="bg-card border border-border rounded px-2 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <select
            value={formMetric}
            onChange={(e) => setFormMetric(e.target.value as GoalMetric)}
            className="bg-card border border-border rounded px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="income">Ingresos</option>
            <option value="ebitda">EBITDA</option>
            <option value="margenBruto">Margen Bruto</option>
          </select>
          <div className="flex gap-2">
            <select
              value={formPeriod}
              onChange={(e) => setFormPeriod(e.target.value as GoalPeriod)}
              className="flex-1 bg-card border border-border rounded px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="month">Mensual</option>
              <option value="year">Anual</option>
            </select>
            <Button onClick={saveGoal} className="text-xs px-3 py-1.5">
              Guardar
            </Button>
          </div>
        </div>
      )}

      {goals.length === 0 && !showForm && (
        <p className="text-xs text-muted-foreground">
          No hay metas configuradas. Agrega una para hacer seguimiento.
        </p>
      )}

      <div className="space-y-3">
        {goals.map((goal) => {
          const current = getCurrentValue(goal.metric, kpis);
          const pct = goal.target > 0 ? (current / goal.target) * 100 : 0;
          const barWidth = Math.min(pct, 100);
          const color = getGoalColor(pct);

          return (
            <div key={goal.id} className="group">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-foreground">
                    {goal.label}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {METRIC_LABELS[goal.metric]} &middot;{' '}
                    {goal.period === 'month' ? 'Mensual' : 'Anual'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold" style={{ color }}>
                    {pct.toFixed(0)}%
                  </span>
                  <button
                    onClick={() => removeGoal(goal.id)}
                    className="opacity-0 group-hover:opacity-100 text-[10px] text-muted-foreground hover:text-red-400 transition-all"
                    title="Eliminar meta"
                  >
                    &times;
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-border/50 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${barWidth}%`,
                      background: `linear-gradient(90deg, ${color}80, ${color})`,
                    }}
                  />
                </div>
                <span className="text-[10px] font-mono text-muted-foreground whitespace-nowrap">
                  {formatValue(goal.metric, current)} / {formatValue(goal.metric, goal.target)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
