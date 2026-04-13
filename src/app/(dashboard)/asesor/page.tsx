'use client';

import { useCallback, useState, useSyncExternalStore } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AdvisorClient {
  id: string;
  name: string;
  email: string;
  healthScore: number;
  lastActivity: string;
}

const STORAGE_KEY = 'vcfo_advisor_clients';

const listeners = new Set<() => void>();
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
function notifyAll() {
  listeners.forEach((fn) => fn());
}

function getClients(): AdvisorClient[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as AdvisorClient[];
  } catch {
    return [];
  }
}

function saveClients(clients: AdvisorClient[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
  notifyAll();
}

function getSnapshot(): string {
  if (typeof window === 'undefined') return '[]';
  return localStorage.getItem(STORAGE_KEY) ?? '[]';
}

function getServerSnapshot(): string {
  return '[]';
}

const BORDER_COLORS = [
  'border-l-emerald-500',
  'border-l-blue-500',
  'border-l-violet-500',
  'border-l-amber-500',
  'border-l-rose-500',
  'border-l-cyan-500',
];

function scoreColor(score: number): string {
  if (score >= 70) return 'bg-emerald-500/20 text-emerald-400';
  if (score >= 40) return 'bg-amber-500/20 text-amber-400';
  return 'bg-rose-500/20 text-rose-400';
}

function scoreLabel(score: number): string {
  if (score >= 70) return 'Saludable';
  if (score >= 40) return 'Alerta';
  return 'Critico';
}

export default function AsesorPage() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const clients: AdvisorClient[] = (() => {
    try { return JSON.parse(raw) as AdvisorClient[]; } catch { return []; }
  })();

  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  const handleAdd = useCallback(() => {
    if (!formName.trim() || !formEmail.trim()) return;

    const newClient: AdvisorClient = {
      id: crypto.randomUUID(),
      name: formName.trim(),
      email: formEmail.trim(),
      healthScore: Math.floor(Math.random() * 60) + 30,
      lastActivity: new Date().toISOString().slice(0, 10),
    };

    saveClients([...clients, newClient]);
    setFormName('');
    setFormEmail('');
    setShowForm(false);
  }, [formName, formEmail, clients]);

  const handleRemove = useCallback(
    (id: string) => {
      saveClients(clients.filter((c) => c.id !== id));
    },
    [clients],
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Panel de Asesor
          </h2>
          <p className="text-xs text-muted-foreground">
            Gestiona tus clientes desde un solo lugar
          </p>
        </div>
        <Button onClick={() => setShowForm((prev) => !prev)} size="sm">
          {showForm ? 'Cancelar' : '+ Agregar cliente'}
        </Button>
      </div>

      {/* Inline add form */}
      {showForm && (
        <Card className="border-l-4 border-l-primary">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="block text-[10px] font-bold uppercase tracking-[1.5px] text-dim mb-1">
                Nombre empresa
              </label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Empresa S.A.C."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-dim focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="flex-1">
              <label className="block text-[10px] font-bold uppercase tracking-[1.5px] text-dim mb-1">
                Email contacto
              </label>
              <input
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                placeholder="contacto@empresa.com"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-dim focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAdd} size="sm">
                Guardar
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Client grid */}
      {clients.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-4xl mb-3">👥</p>
          <p className="text-sm font-medium text-foreground mb-1">
            Sin clientes registrados
          </p>
          <p className="text-xs text-muted-foreground">
            Agrega tu primer cliente para comenzar a gestionar sus finanzas.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {clients.map((client, i) => (
            <div
              key={client.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedClient(client.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setSelectedClient(client.id);
              }}
              className="cursor-pointer transition-all hover:scale-[1.01] hover:shadow-lg"
            >
            <Card
              className={`border-l-4 ${BORDER_COLORS[i % BORDER_COLORS.length]}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    {client.name}
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    {client.email}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${scoreColor(client.healthScore)}`}
                >
                  {client.healthScore}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${scoreColor(client.healthScore)}`}
                  >
                    {scoreLabel(client.healthScore)}
                  </span>
                  <span className="text-[10px] text-dim">
                    Ultimo: {client.lastActivity}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(client.id);
                  }}
                  className="text-[10px] text-dim hover:text-rose-400 transition-colors"
                  aria-label={`Eliminar ${client.name}`}
                >
                  Eliminar
                </button>
              </div>
            </Card>
            </div>
          ))}
        </div>
      )}

      {/* Coming soon modal */}
      {selectedClient && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setSelectedClient(null)}
        >
          <div
            className="rounded-xl border border-border bg-card p-6 max-w-sm mx-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-4xl mb-3">🚀</p>
            <h3 className="text-sm font-bold text-foreground mb-2">
              Proximamente: gestion multi-cliente
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              La vista detallada de cada cliente estara disponible en la proxima
              version. Podras ver dashboards individuales, generar reportes y
              gestionar transacciones por empresa.
            </p>
            <Button onClick={() => setSelectedClient(null)} size="sm">
              Entendido
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
