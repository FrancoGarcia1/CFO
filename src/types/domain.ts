// ─── Enums / Literal Types ───────────────────────────────────
export type TransactionType = 'income' | 'cost' | 'expense';
export type PeriodType = 'daily' | 'weekly' | 'monthly';
export type ViewPeriod = 'day' | 'week' | 'month' | 'year';
export type PlanType = 'trial' | 'active' | 'cancelled';

// ─── Core Data Models ────────────────────────────────────────
export interface Transaction {
  id: string;
  user_id: string;
  date: string;
  period: PeriodType;
  type: TransactionType;
  category: string;
  concept: string;
  amount: number;
  note: string | null;
  created_at: string;
}

export interface Historical {
  id: string;
  user_id: string;
  year: number;
  month: number;
  income: number;
  cost: number;
  expense: number;
}

export interface Visitor {
  id: string;
  user_id: string;
  date: string;
  count: number;
}

export interface Occupancy {
  id: string;
  user_id: string;
  date: string;
  pct: number;
}

// ─── User / Settings ────────────────────────────────────────
export interface UserSettings {
  user_id: string;
  growth_rate: number;
  last_forecast_q: string | null;
}

export interface UserProfile {
  id: string;
  nombre: string;
  email: string;
  telefono: string | null;
  empresa: string | null;
  plan: PlanType;
  trial_used: boolean;
}

// ─── Calculated / Derived ───────────────────────────────────
export interface KPIs {
  income: number;
  cost: number;
  expense: number;
  grossProfit: number;
  ebitda: number;
  margenBruto: number;
  margenEbitda: number;
  costoRatio: number;
  pe: number;
  countIncome: number;
  avgTicket: number;
  score: number;
}

export interface ForecastMonth {
  month: number;
  projIncome: number;
  projCost: number;
  projExpense: number;
}

export interface SimulatorState {
  income: number;
  cost: number;
  expense: number;
}

export interface SimulatorResult {
  income: number;
  cost: number;
  expense: number;
  grossProfit: number;
  ebitda: number;
  margenBruto: number;
  margenEbitda: number;
  deltaEbitda: number;
}

// ─── Chat ────────────────────────────────────────────────────
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}
