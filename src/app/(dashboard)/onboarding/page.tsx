'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/providers/auth-provider';
import { fmt } from '@/utils/formatters';
import type { TransactionType } from '@/types/domain';

/* ─── Constants ─────────────────────────────────────────────── */

const TOTAL_STEPS = 3;

const REVENUE_MIN = 5_000;
const REVENUE_MAX = 1_000_000;
const REVENUE_STEP = 1_000;

type RevenueSource = 'Productos' | 'Servicios' | 'Mixto';
const REVENUE_SOURCES: RevenueSource[] = ['Productos', 'Servicios', 'Mixto'];

interface CostField {
  key: string;
  label: string;
  category: string;
  type: TransactionType;
}

const COST_FIELDS: CostField[] = [
  { key: 'materiaPrima', label: 'Materia prima / Insumos', category: 'Materia prima', type: 'cost' },
  { key: 'personal', label: 'Personal (sueldos)', category: 'Mano de obra directa', type: 'cost' },
  { key: 'alquiler', label: 'Alquiler', category: 'Alquiler', type: 'expense' },
];

const EXPENSE_FIELDS: CostField[] = [
  { key: 'marketing', label: 'Marketing', category: 'Marketing y publicidad', type: 'expense' },
  { key: 'serviciosBasicos', label: 'Servicios básicos (luz/agua/internet)', category: 'Servicios básicos', type: 'expense' },
  { key: 'contabilidad', label: 'Contabilidad / Legal', category: 'Contabilidad y legal', type: 'expense' },
];

/* ─── Helpers ───────────────────────────────────────────────── */

function buildIncomeCategory(source: RevenueSource): string {
  if (source === 'Productos') return 'Ventas productos';
  if (source === 'Servicios') return 'Ventas servicios';
  return 'Ventas productos';
}

function splitRevenueMixto(amount: number): { productos: number; servicios: number } {
  const productos = Math.round(amount * 0.6);
  return { productos, servicios: amount - productos };
}

function getCurrentDateStr(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/* ─── Step Indicator ────────────────────────────────────────── */

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => {
        const step = i + 1;
        const isActive = step === current;
        const isDone = step < current;
        return (
          <div key={step} className="flex items-center gap-2">
            <div
              className={
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ' +
                (isActive
                  ? 'bg-primary text-black'
                  : isDone
                    ? 'bg-primary/20 text-primary'
                    : 'bg-border text-dim')
              }
            >
              {isDone ? '✓' : step}
            </div>
            {i < TOTAL_STEPS - 1 && (
              <div
                className={
                  'w-8 h-0.5 transition-colors ' +
                  (isDone ? 'bg-primary' : 'bg-border')
                }
              />
            )}
          </div>
        );
      })}
      <span className="ml-auto text-xs text-dim font-mono">
        {current}/{TOTAL_STEPS}
      </span>
    </div>
  );
}

/* ─── Currency Input ────────────────────────────────────────── */

function CurrencyInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-dim font-mono">
          S/
        </span>
        <Input
          type="number"
          min={0}
          step={100}
          value={value || ''}
          onChange={(e) => onChange(Number(e.target.value))}
          className="pl-10 font-mono text-lg"
          placeholder="0"
        />
      </div>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────── */

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1
  const [revenue, setRevenue] = useState(50_000);
  const [revenueSource, setRevenueSource] = useState<RevenueSource>('Servicios');

  // Step 2
  const [costs, setCosts] = useState<Record<string, number>>({
    materiaPrima: 0,
    personal: 0,
    alquiler: 0,
  });

  // Step 3
  const [expenses, setExpenses] = useState<Record<string, number>>({
    marketing: 0,
    serviciosBasicos: 0,
    contabilidad: 0,
  });

  function updateCost(key: string, value: number) {
    setCosts((prev) => ({ ...prev, [key]: value }));
  }

  function updateExpense(key: string, value: number) {
    setExpenses((prev) => ({ ...prev, [key]: value }));
  }

  function goNext() {
    if (step < TOTAL_STEPS) setStep(step + 1);
  }

  function goPrev() {
    if (step > 1) setStep(step - 1);
  }

  async function handleSubmit() {
    if (!user) {
      setError('No se encontró sesión. Inicia sesión nuevamente.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const supabase = createClient();
      const dateStr = getCurrentDateStr();

      interface TransactionInsert {
        user_id: string;
        date: string;
        period: 'monthly';
        type: TransactionType;
        category: string;
        concept: string;
        amount: number;
        note: string;
      }

      const rows: TransactionInsert[] = [];

      // Income transactions
      if (revenueSource === 'Mixto') {
        const { productos, servicios } = splitRevenueMixto(revenue);
        rows.push({
          user_id: user.id,
          date: dateStr,
          period: 'monthly',
          type: 'income',
          category: 'Ventas productos',
          concept: 'Ingreso mensual por productos',
          amount: productos,
          note: 'Generado por onboarding',
        });
        rows.push({
          user_id: user.id,
          date: dateStr,
          period: 'monthly',
          type: 'income',
          category: 'Ventas servicios',
          concept: 'Ingreso mensual por servicios',
          amount: servicios,
          note: 'Generado por onboarding',
        });
      } else {
        rows.push({
          user_id: user.id,
          date: dateStr,
          period: 'monthly',
          type: 'income',
          category: buildIncomeCategory(revenueSource),
          concept: `Ingreso mensual por ${revenueSource.toLowerCase()}`,
          amount: revenue,
          note: 'Generado por onboarding',
        });
      }

      // Cost and expense transactions from Step 2
      for (const field of COST_FIELDS) {
        const amount = costs[field.key];
        if (amount > 0) {
          rows.push({
            user_id: user.id,
            date: dateStr,
            period: 'monthly',
            type: field.type,
            category: field.category,
            concept: field.label,
            amount,
            note: 'Generado por onboarding',
          });
        }
      }

      // Expense transactions from Step 3
      for (const field of EXPENSE_FIELDS) {
        const amount = expenses[field.key];
        if (amount > 0) {
          rows.push({
            user_id: user.id,
            date: dateStr,
            period: 'monthly',
            type: field.type,
            category: field.category,
            concept: field.label,
            amount,
            note: 'Generado por onboarding',
          });
        }
      }

      const { error: insertError } = await supabase
        .from('transactions')
        .insert(rows);

      if (insertError) throw insertError;

      router.push('/dashboard');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Error al guardar datos';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-lg animate-enter">
      {/* Branding */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-sm bg-primary flex items-center justify-center text-lg">
          📊
        </div>
        <div>
          <h1 className="text-base font-semibold text-foreground">
            Capital CFO
          </h1>
          <p className="text-xs text-muted-foreground">
            Configura tu perfil financiero
          </p>
        </div>
      </div>

      <Card className="p-6">
        <StepIndicator current={step} />

        {/* ─── Step 1: Revenue ──────────────────────────── */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-1">
                ¿Cuánto facturas al mes?
              </h2>
              <p className="text-sm text-muted-foreground">
                Aproximado de tus ingresos mensuales
              </p>
            </div>

            <div className="space-y-3">
              <div className="text-center">
                <span className="text-3xl font-bold text-primary font-mono">
                  {fmt(revenue)}
                </span>
                <span className="text-sm text-dim ml-1">/mes</span>
              </div>
              <Slider
                min={REVENUE_MIN}
                max={REVENUE_MAX}
                value={revenue}
                onChange={(v) => {
                  // Snap to nearest REVENUE_STEP
                  setRevenue(Math.round(v / REVENUE_STEP) * REVENUE_STEP);
                }}
              />
              <div className="flex justify-between text-[10px] text-dim font-mono">
                <span>{fmt(REVENUE_MIN)}</span>
                <span>{fmt(REVENUE_MAX)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Fuente principal de ingresos</Label>
              <div className="grid grid-cols-3 gap-2">
                {REVENUE_SOURCES.map((src) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setRevenueSource(src)}
                    className={
                      'px-3 py-2.5 rounded-lg text-sm font-medium transition-all border ' +
                      (revenueSource === src
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-input text-dim hover:border-border-hover')
                    }
                  >
                    {src}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── Step 2: Costs ───────────────────────────── */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-1">
                ¿Cuáles son tus costos principales?
              </h2>
              <p className="text-sm text-muted-foreground">
                Montos aproximados mensuales. Deja en 0 si no aplica.
              </p>
            </div>

            <div className="space-y-4">
              {COST_FIELDS.map((field) => (
                <CurrencyInput
                  key={field.key}
                  label={field.label}
                  value={costs[field.key]}
                  onChange={(v) => updateCost(field.key, v)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ─── Step 3: Expenses ────────────────────────── */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-1">
                ¿Cuáles son tus otros gastos?
              </h2>
              <p className="text-sm text-muted-foreground">
                Gastos operativos mensuales aproximados
              </p>
            </div>

            <div className="space-y-4">
              {EXPENSE_FIELDS.map((field) => (
                <CurrencyInput
                  key={field.key}
                  label={field.label}
                  value={expenses[field.key]}
                  onChange={(v) => updateExpense(field.key, v)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ─── Error ───────────────────────────────────── */}
        {error && (
          <div className="mt-4 p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm">
            {error}
          </div>
        )}

        {/* ─── Navigation ──────────────────────────────── */}
        <div className="flex items-center justify-between mt-8">
          {step > 1 ? (
            <Button variant="ghost" onClick={goPrev} disabled={submitting}>
              ← Anterior
            </Button>
          ) : (
            <div />
          )}

          {step < TOTAL_STEPS ? (
            <Button onClick={goNext}>Siguiente →</Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              size="lg"
              className="gap-2"
            >
              {submitting ? (
                <span className="animate-pulse">Generando...</span>
              ) : (
                'Generar mi dashboard'
              )}
            </Button>
          )}
        </div>
      </Card>

      {/* Footer hint */}
      <p className="text-center text-[10px] text-dim mt-4">
        Podrás ajustar estos datos en cualquier momento desde el dashboard
      </p>
    </div>
  );
}
