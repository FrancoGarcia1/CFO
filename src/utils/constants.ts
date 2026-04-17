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

/**
 * Monedas soportadas — para expansión global.
 * LATAM: PEN, MXN, COP, ARS, CLP, BRL, UYU, BOB, PYG, VES
 * Globales: USD, EUR, GBP, CAD
 */
export const CURRENCIES = {
  // LATAM
  PEN: { code: 'PEN', symbol: 'S/', locale: 'es-PE', name: 'Sol peruano', flag: '🇵🇪' },
  MXN: { code: 'MXN', symbol: '$', locale: 'es-MX', name: 'Peso mexicano', flag: '🇲🇽' },
  COP: { code: 'COP', symbol: '$', locale: 'es-CO', name: 'Peso colombiano', flag: '🇨🇴' },
  ARS: { code: 'ARS', symbol: '$', locale: 'es-AR', name: 'Peso argentino', flag: '🇦🇷' },
  CLP: { code: 'CLP', symbol: '$', locale: 'es-CL', name: 'Peso chileno', flag: '🇨🇱' },
  BRL: { code: 'BRL', symbol: 'R$', locale: 'pt-BR', name: 'Real brasileño', flag: '🇧🇷' },
  UYU: { code: 'UYU', symbol: '$U', locale: 'es-UY', name: 'Peso uruguayo', flag: '🇺🇾' },
  BOB: { code: 'BOB', symbol: 'Bs', locale: 'es-BO', name: 'Boliviano', flag: '🇧🇴' },
  PYG: { code: 'PYG', symbol: '₲', locale: 'es-PY', name: 'Guaraní paraguayo', flag: '🇵🇾' },
  VES: { code: 'VES', symbol: 'Bs.S', locale: 'es-VE', name: 'Bolívar venezolano', flag: '🇻🇪' },
  DOP: { code: 'DOP', symbol: 'RD$', locale: 'es-DO', name: 'Peso dominicano', flag: '🇩🇴' },
  CRC: { code: 'CRC', symbol: '₡', locale: 'es-CR', name: 'Colón costarricense', flag: '🇨🇷' },
  GTQ: { code: 'GTQ', symbol: 'Q', locale: 'es-GT', name: 'Quetzal guatemalteco', flag: '🇬🇹' },
  // Global
  USD: { code: 'USD', symbol: '$', locale: 'en-US', name: 'Dólar americano', flag: '🇺🇸' },
  EUR: { code: 'EUR', symbol: '€', locale: 'es-ES', name: 'Euro', flag: '🇪🇺' },
  GBP: { code: 'GBP', symbol: '£', locale: 'en-GB', name: 'Libra esterlina', flag: '🇬🇧' },
  CAD: { code: 'CAD', symbol: 'C$', locale: 'en-CA', name: 'Dólar canadiense', flag: '🇨🇦' },
  AUD: { code: 'AUD', symbol: 'A$', locale: 'en-AU', name: 'Dólar australiano', flag: '🇦🇺' },
} as const;

export type CurrencyCode = keyof typeof CURRENCIES;

export const COLORS = {
  positive: '#a8c47a',  // verde oliva suave
  negative: '#d9925a',  // terracota
  warning: '#d9925a',
  neutral: '#6b6660',
  accent: '#c8a15a',    // gold brand
} as const;

export const TYPE_LABELS: Record<TransactionType, string> = {
  income: 'Ingreso',
  cost: 'Costo',
  expense: 'Gasto',
} as const;
