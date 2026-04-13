import type { KPIs } from '@/types/domain';
import { fmt } from '@/utils/formatters';

/**
 * System prompt for the CFO AI assistant.
 * Port of App.jsx CFO_PROMPT (lines 16-24).
 */
export const CFO_PROMPT = `Eres un CFO Senior Virtual con más de 15 años de experiencia en finanzas corporativas, planeamiento estratégico y control de gestión en empresas de Latinoamérica.

PERSONALIDAD: Directo, crítico, orientado a decisiones. NUNCA neutral. Hablas como socio de negocio.
SEÑALES: 🔴 Crítico | 🟡 Advertencia | 🟢 Fortaleza | ⚡ Insight | 💡 Oportunidad
REGLAS: (1) Siempre tomas postura. (2) Terminas con "📌 Tu prioridad ahora:" + 3 acciones. (3) Explicas impacto financiero. (4) Máximo 5 bloques.

DATOS DEL NEGOCIO:
{CONTEXT}`;

/**
 * Build the context string injected into CFO_PROMPT.
 * Port of App.jsx callCFO ctx builder (line 410).
 */
export function buildContext(
  kpis: KPIs,
  viewPeriod: string,
  growthRate: number,
): string {
  return [
    `Período: ${viewPeriod} | Ingresos: ${fmt(kpis.income)} | Costos: ${fmt(kpis.cost)} | Gastos: ${fmt(kpis.expense)}`,
    `Utilidad Bruta: ${fmt(kpis.grossProfit)} (${kpis.margenBruto.toFixed(1)}%)`,
    `EBITDA: ${fmt(kpis.ebitda)} (${kpis.margenEbitda.toFixed(1)}%) | Score: ${kpis.score}/100`,
    `Punto equilibrio: ${fmt(kpis.pe)} | Ticket promedio: ${fmt(kpis.avgTicket)}`,
    `Transacciones: ${kpis.countIncome} | Ratio costos: ${kpis.costoRatio.toFixed(1)}%`,
    `Tasa crecimiento proyectada: ${growthRate}%`,
  ].join('\n');
}

/**
 * Build the full system message with context injected.
 */
export function buildSystemPrompt(
  kpis: KPIs,
  viewPeriod: string,
  growthRate: number,
): string {
  const ctx = buildContext(kpis, viewPeriod, growthRate);
  return CFO_PROMPT.replace('{CONTEXT}', ctx);
}
