'use client';

import { useState, useRef, type FormEvent, type DragEvent } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useTransactions } from '@/hooks/use-transactions';
import { useVisitors } from '@/hooks/use-visitors';
import { usePeriod } from '@/app/(dashboard)/dashboard-shell';
import { useKpis } from '@/hooks/use-kpis';
import { useAuth } from '@/providers/auth-provider';
import { CATS } from '@/utils/constants';
import { downloadTemplate } from '@/utils/csv-export';
import { fmt } from '@/utils/formatters';
import type { TransactionType, PeriodType } from '@/types/domain';

const TYPE_OPTIONS: { value: TransactionType; label: string }[] = [
  { value: 'income', label: 'Ingreso' },
  { value: 'cost', label: 'Costo' },
  { value: 'expense', label: 'Gasto' },
];

const PERIOD_OPTIONS: { value: PeriodType; label: string }[] = [
  { value: 'daily', label: 'Diario' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'monthly', label: 'Mensual' },
];

const TYPE_BADGE_VARIANT = {
  income: 'success',
  cost: 'danger',
  expense: 'warning',
} as const;

const TYPE_COLORS: Record<TransactionType, string> = {
  income: 'bg-primary text-black',
  cost: 'bg-danger text-white',
  expense: 'bg-warning text-black',
};

export default function EntradaPage() {
  const { loading: authLoading } = useAuth();
  const { transactions, isLoading, createTransaction, deleteTransaction } =
    useTransactions();
  const { visitors, occupancy, upsertVisitor, upsertOccupancy } =
    useVisitors();
  const { viewPeriod, viewYear, viewMonth } = usePeriod();
  const { filteredTxns } = useKpis(transactions, viewPeriod, viewYear, viewMonth);

  const fileRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Transaction form state
  const [txDate, setTxDate] = useState(new Date().toISOString().slice(0, 10));
  const [txPeriod, setTxPeriod] = useState<PeriodType>('monthly');
  const [txType, setTxType] = useState<TransactionType>('income');
  const [txCategory, setTxCategory] = useState(CATS.income[0]);
  const [txConcept, setTxConcept] = useState('');
  const [txAmount, setTxAmount] = useState('');
  const [txNote, setTxNote] = useState('');

  // Visitor form state
  const [visDate, setVisDate] = useState(new Date().toISOString().slice(0, 10));
  const [visCount, setVisCount] = useState('');
  const [visPct, setVisPct] = useState('');

  const categories = CATS[txType];

  function handleTypeChange(newType: TransactionType) {
    setTxType(newType);
    setTxCategory(CATS[newType][0]);
  }

  function handleTxSubmit(e: FormEvent) {
    e.preventDefault();
    const amount = parseFloat(txAmount);
    if (!txConcept.trim() || isNaN(amount) || amount <= 0) return;

    createTransaction.mutate({
      date: txDate,
      period: txPeriod,
      type: txType,
      category: txCategory,
      concept: txConcept.trim(),
      amount,
      note: txNote.trim() || null,
    });

    setTxConcept('');
    setTxAmount('');
    setTxNote('');
  }

  function handleVisitorSubmit(e: FormEvent) {
    e.preventDefault();
    const count = parseInt(visCount, 10);
    const pct = parseFloat(visPct);

    if (!isNaN(count) && count >= 0) {
      upsertVisitor.mutate({
        user_id: '',
        date: visDate,
        count,
      });
    }

    if (!isNaN(pct) && pct >= 0 && pct <= 100) {
      upsertOccupancy.mutate({
        user_id: '',
        date: visDate,
        pct,
      });
    }

    setVisCount('');
    setVisPct('');
  }

  function processCSVFile(file: File) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.split('\n').filter((l) => l.trim());
      const rows = lines.slice(1);

      for (const row of rows) {
        const cols = row.split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
        if (cols.length < 6) continue;

        const typeMap: Record<string, TransactionType> = {
          ingreso: 'income',
          costo: 'cost',
          gasto: 'expense',
        };
        const parsedType = typeMap[cols[2].toLowerCase()] ?? 'expense';

        createTransaction.mutate({
          date: cols[0],
          period: (cols[1] as PeriodType) || 'monthly',
          type: parsedType,
          category: cols[3],
          concept: cols[4],
          amount: parseFloat(cols[5]) || 0,
          note: cols[6] || null,
        });
      }
    };
    reader.readAsText(file);
  }

  function handleCSVUpload() {
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    processCSVFile(file);
    if (fileRef.current) fileRef.current.value = '';
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.csv')) {
      processCSVFile(file);
    }
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  const displayTxns = filteredTxns.slice(0, 50);

  return (
    <div className="space-y-6 animate-enter">
      {/* ── CSV Upload ────────────────────────────────────── */}
      <section>
        <span className="micro-label mb-4 block">IMPORTAR CSV</span>
        <div className="tile-surface rounded-lg p-6">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileRef.current?.click()}
            className={`
              border-2 border-dashed rounded-lg p-8
              flex flex-col items-center justify-center gap-3
              cursor-pointer transition-all duration-200
              ${isDragging
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-muted-foreground'
              }
            `}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className={`transition-colors ${isDragging ? 'text-primary' : 'text-darker'}`}
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p className="text-sm text-muted-foreground text-center">
              Arrastra tu CSV aqu&iacute; o haz click para seleccionar
            </p>
            <p className="text-[11px] text-darker">
              Columnas: fecha, per&iacute;odo, tipo, categor&iacute;a, concepto, monto, nota
            </p>
            <input
              ref={fileRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleCSVUpload}
            />
          </div>

          <div className="flex items-center gap-3 mt-4">
            <Button onClick={handleCSVUpload} size="sm">
              Importar
            </Button>
            <Button variant="secondary" size="sm" onClick={downloadTemplate}>
              Descargar plantilla
            </Button>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── Forms Grid ────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Transaction Form — spans 2 cols */}
        <Card elevation="flat" className="lg:col-span-2 animate-enter delay-1">
          <span className="micro-label mb-5 block">NUEVA TRANSACCI&Oacute;N</span>
          <form onSubmit={handleTxSubmit} className="space-y-5">
            {/* Row 1: Date + Period */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tx-date">Fecha</Label>
                <Input
                  id="tx-date"
                  type="date"
                  value={txDate}
                  onChange={(e) => setTxDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="tx-period">Per&iacute;odo</Label>
                <Select
                  id="tx-period"
                  value={txPeriod}
                  onChange={(e) => setTxPeriod(e.target.value as PeriodType)}
                >
                  {PERIOD_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            {/* Row 2: Type toggle buttons */}
            <div>
              <Label>Tipo</Label>
              <div className="flex gap-2 mt-1">
                {TYPE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleTypeChange(opt.value)}
                    className={`
                      flex-1 py-2.5 px-3 rounded-md text-sm font-semibold
                      transition-all duration-200 border
                      ${txType === opt.value
                        ? TYPE_COLORS[opt.value] + ' border-transparent shadow-lg'
                        : 'bg-transparent border-border text-muted-foreground hover:text-foreground hover:border-border-hover'
                      }
                    `}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Row 3: Category + Concept */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tx-cat">Categor&iacute;a</Label>
                <Select
                  id="tx-cat"
                  value={txCategory}
                  onChange={(e) => setTxCategory(e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="tx-concept">Concepto</Label>
                <Input
                  id="tx-concept"
                  value={txConcept}
                  onChange={(e) => setTxConcept(e.target.value)}
                  placeholder="Descripci&oacute;n de la transacci&oacute;n"
                />
              </div>
            </div>

            {/* Row 4: Amount + Note */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tx-amount">Monto (S/)</Label>
                <Input
                  id="tx-amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={txAmount}
                  onChange={(e) => setTxAmount(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="tx-note">Nota</Label>
                <Input
                  id="tx-note"
                  value={txNote}
                  onChange={(e) => setTxNote(e.target.value)}
                  placeholder="Opcional"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={createTransaction.isPending}
            >
              {createTransaction.isPending ? 'Guardando...' : 'Registrar transacci\u00f3n'}
            </Button>
          </form>
        </Card>

        {/* Visitors / Occupancy Form — 1 col */}
        <Card elevation="flat" className="animate-enter delay-2">
          <span className="micro-label mb-5 block">VISITANTES Y OCUPACI&Oacute;N</span>
          <form onSubmit={handleVisitorSubmit} className="space-y-5">
            <div>
              <Label htmlFor="vis-date">Fecha</Label>
              <Input
                id="vis-date"
                type="date"
                value={visDate}
                onChange={(e) => setVisDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="vis-count">Visitantes</Label>
              <Input
                id="vis-count"
                type="number"
                min="0"
                value={visCount}
                onChange={(e) => setVisCount(e.target.value)}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="vis-pct">Ocupaci&oacute;n (%)</Label>
              <Input
                id="vis-pct"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={visPct}
                onChange={(e) => setVisPct(e.target.value)}
                placeholder="0"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={upsertVisitor.isPending || upsertOccupancy.isPending}
            >
              Guardar datos
            </Button>
          </form>

          <div className="divider my-4" />
          <p className="text-[11px] text-darker">
            Registros: {visitors.length} visitantes, {occupancy.length} ocupaciones
          </p>
        </Card>
      </div>

      <div className="divider" />

      {/* ── Transaction List ──────────────────────────────── */}
      <section className="animate-enter delay-3">
        <span className="micro-label mb-4 block">
          TRANSACCIONES ({displayTxns.length})
        </span>

        <Card elevation="flat" className="p-0 overflow-hidden">
          {displayTxns.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-darker mb-4"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="9" y1="21" x2="9" y2="9" />
              </svg>
              <p className="text-sm text-muted-foreground">
                No hay transacciones en este per&iacute;odo
              </p>
              <p className="text-[11px] text-darker mt-1">
                Registra tu primera transacci&oacute;n arriba
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-2/50">
                    <th className="py-3 px-5 text-left micro-label">
                      Fecha
                    </th>
                    <th className="py-3 px-4 text-left micro-label">
                      Tipo
                    </th>
                    <th className="py-3 px-4 text-left micro-label">
                      Categor&iacute;a
                    </th>
                    <th className="py-3 px-4 text-left micro-label">
                      Concepto
                    </th>
                    <th className="py-3 px-4 text-right micro-label">
                      Monto
                    </th>
                    <th className="py-3 px-4 w-12" />
                  </tr>
                </thead>
                <tbody>
                  {displayTxns.map((t, idx) => (
                    <tr
                      key={t.id}
                      className={`
                        border-b border-border/30
                        hover:bg-surface-2 transition-colors duration-150
                        ${idx % 2 === 0 ? 'bg-transparent' : 'bg-surface/50'}
                      `}
                    >
                      <td className="py-3 px-5 font-mono text-xs text-muted-foreground">
                        {t.date}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={TYPE_BADGE_VARIANT[t.type]}>
                          {TYPE_OPTIONS.find((o) => o.value === t.type)?.label}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-xs text-foreground">
                        {t.category}
                      </td>
                      <td className="py-3 px-4 text-xs text-foreground max-w-[200px] truncate">
                        {t.concept}
                      </td>
                      <td
                        className="py-3 px-4 text-right font-mono text-xs font-bold"
                        style={{
                          color: t.type === 'income' ? '#45ffbc' : '#ff4757',
                        }}
                      >
                        {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`\u00bfEliminar "${t.concept}" (${fmt(t.amount)})? Esta acci\u00f3n no se puede deshacer.`)) {
                              deleteTransaction.mutate(t.id);
                            }
                          }}
                          disabled={deleteTransaction.isPending}
                          className="icon-btn text-danger hover:bg-danger/10"
                          aria-label={`Eliminar ${t.concept}`}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </section>
    </div>
  );
}
