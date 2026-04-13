import type { TransactionType } from '@/types/domain';

export const MONTHS = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
] as const;

export const CATS: Record<TransactionType, string[]> = {
  income: [
    'Ventas productos',
    'Ventas servicios',
    'Ingresos financieros',
    'Descuentos recibidos',
    'Otros ingresos',
  ],
  cost: [
    'Materia prima',
    'Mano de obra directa',
    'Producción',
    'Logística y envíos',
    'Otros costos',
  ],
  expense: [
    'Marketing y publicidad',
    'Sueldos admin',
    'Alquiler',
    'Servicios básicos',
    'Contabilidad y legal',
    'Gastos financieros',
    'Depreciación',
    'Otros gastos',
  ],
};

export const CURRENCIES = {
  PEN: { code: 'PEN', symbol: 'S/', locale: 'es-PE', name: 'Sol peruano' },
  USD: { code: 'USD', symbol: '$', locale: 'en-US', name: 'Dólar americano' },
  COP: { code: 'COP', symbol: '$', locale: 'es-CO', name: 'Peso colombiano' },
  MXN: { code: 'MXN', symbol: '$', locale: 'es-MX', name: 'Peso mexicano' },
} as const;

export type CurrencyCode = keyof typeof CURRENCIES;

export const COLORS = {
  positive: '#00e5a0',
  negative: '#ff4757',
  warning: '#f5a623',
  neutral: '#8892b0',
} as const;

export const TYPE_LABELS: Record<TransactionType, string> = {
  income: 'Ingreso',
  cost: 'Costo',
  expense: 'Gasto',
} as const;
