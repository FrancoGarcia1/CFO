export type Theme = {
  id: string;
  name: string;
  subtitle: string;
  mood: string;
  // Backgrounds
  bg: string;
  bgGradient?: string;
  card: string;
  cardHover: string;
  glass?: boolean;
  // Borders
  border: string;
  borderStrong: string;
  // Text
  text: string;
  textMuted: string;
  textDim: string;
  // Accents
  accent: string;
  accentGradient: string;
  accentSoft: string;
  positive: string;
  negative: string;
  warning: string;
  // Optional secondary accent for variety
  info?: string;
  // Halo color for rings/glow
  halo: string;
  // Serif usage for labels
  useSerif?: boolean;
};

export const THEMES: Theme[] = [
  {
    id: 'brand',
    name: '① Coherencia con la marca',
    subtitle: 'Gold institucional · coherente con el landing',
    mood: 'Private banking · elegante y profesional',
    bg: '#0a0a0a',
    card: '#141110',
    cardHover: '#191613',
    border: 'rgba(200,161,90,.12)',
    borderStrong: 'rgba(200,161,90,.25)',
    text: '#f5f0e8',
    textMuted: '#a8a19a',
    textDim: '#6b6660',
    accent: '#c8a15a',
    accentGradient: 'linear-gradient(135deg, #d4b577, #c8a15a)',
    accentSoft: 'rgba(200,161,90,.08)',
    positive: '#a8c47a',
    negative: '#d9925a',
    warning: '#d9925a',
    halo: 'rgba(200,161,90,.3)',
  },
  {
    id: 'bloomberg',
    name: '② Bloomberg terminal',
    subtitle: 'Institucional financiero · data-first',
    mood: 'WSJ, Bloomberg · serio y preciso',
    bg: '#080606',
    card: '#0f0d0b',
    cardHover: '#14110e',
    border: 'rgba(200,161,90,.18)',
    borderStrong: 'rgba(200,161,90,.4)',
    text: '#f5f0e8',
    textMuted: '#b5b0a8',
    textDim: '#7a756c',
    accent: '#c8a15a',
    accentGradient: 'linear-gradient(135deg, #d4b577, #c8a15a)',
    accentSoft: 'rgba(200,161,90,.1)',
    positive: '#4ade80',
    negative: '#f87171',
    warning: '#fbbf24',
    halo: 'rgba(74,222,128,.25)',
  },
  {
    id: 'private',
    name: '③ Private Banking paper',
    subtitle: 'Papel tostado · old money',
    mood: 'Rothschild, Morgan · clásico digital',
    bg: '#1a1512',
    bgGradient: 'radial-gradient(ellipse at top, #251e18 0%, #1a1512 70%)',
    card: '#231c16',
    cardHover: '#2b231b',
    border: 'rgba(200,161,90,.22)',
    borderStrong: 'rgba(200,161,90,.45)',
    text: '#ece4d4',
    textMuted: '#b8ae9c',
    textDim: '#7a6f5e',
    accent: '#b89a5f',
    accentGradient: 'linear-gradient(135deg, #c8a876, #b89a5f)',
    accentSoft: 'rgba(184,154,95,.1)',
    positive: '#059669',
    negative: '#c87d4d',
    warning: '#d97706',
    info: '#5f7a9a',
    halo: 'rgba(184,154,95,.3)',
    useSerif: true,
  },
  {
    id: 'aurora',
    name: '④ Aurora / Stripe',
    subtitle: 'Contemporáneo SaaS · gradientes sutiles',
    mood: 'Stripe, Linear · moderno y productizado',
    bg: '#0b0a12',
    bgGradient: 'radial-gradient(ellipse at top right, rgba(139,92,246,.08) 0%, transparent 50%), radial-gradient(ellipse at bottom left, rgba(200,161,90,.06) 0%, transparent 50%), #0b0a12',
    card: '#151420',
    cardHover: '#1c1b28',
    border: 'rgba(139,92,246,.15)',
    borderStrong: 'rgba(200,161,90,.3)',
    text: '#f5f3ff',
    textMuted: '#a8a4b8',
    textDim: '#6b6680',
    accent: '#c8a15a',
    accentGradient: 'linear-gradient(135deg, #d4b577, #c8a15a)',
    accentSoft: 'rgba(200,161,90,.08)',
    positive: '#10b981',
    negative: '#f43f5e',
    warning: '#fbbf24',
    info: '#8b5cf6',
    halo: 'rgba(139,92,246,.3)',
  },
  {
    id: 'apple',
    name: '⑤ Apple Intelligence',
    subtitle: 'Liquid glass · minimalismo extremo',
    mood: 'Vision Pro, Vercel · precisión y aire',
    bg: '#050404',
    bgGradient: 'radial-gradient(ellipse 80% 60% at 50% 20%, rgba(200,161,90,.04), transparent 60%), #050404',
    card: 'rgba(255,255,255,.03)',
    cardHover: 'rgba(255,255,255,.05)',
    glass: true,
    border: 'rgba(255,255,255,.06)',
    borderStrong: 'rgba(255,255,255,.1)',
    text: 'rgba(255,255,255,.95)',
    textMuted: 'rgba(255,255,255,.55)',
    textDim: 'rgba(255,255,255,.35)',
    accent: '#c8a15a',
    accentGradient: 'linear-gradient(135deg, #e6c88a, #c8a15a, #b08c47)',
    accentSoft: 'rgba(200,161,90,.06)',
    positive: '#bedb7f',
    negative: '#e6a476',
    warning: '#e6a476',
    halo: 'rgba(200,161,90,.4)',
  },
  {
    id: 'hybrid',
    name: '⑥ Hybrid (① + ⑤)',
    subtitle: 'Marca dorada + liquid glass',
    mood: 'Lo mejor de ambos — premium + Apple',
    bg: '#0a0808',
    bgGradient: 'radial-gradient(ellipse 70% 50% at 50% 20%, rgba(200,161,90,.06), transparent 60%), radial-gradient(ellipse at bottom, rgba(168,196,122,.03), transparent 60%), #0a0808',
    card: 'rgba(22,18,15,.6)',
    cardHover: 'rgba(30,24,19,.7)',
    glass: true,
    border: 'rgba(200,161,90,.15)',
    borderStrong: 'rgba(200,161,90,.3)',
    text: '#f5f0e8',
    textMuted: 'rgba(245,240,232,.6)',
    textDim: 'rgba(245,240,232,.35)',
    accent: '#c8a15a',
    accentGradient: 'linear-gradient(135deg, #e6c88a, #c8a15a, #b08c47)',
    accentSoft: 'rgba(200,161,90,.08)',
    positive: '#a8c47a',
    negative: '#d9925a',
    warning: '#d9925a',
    halo: 'rgba(200,161,90,.4)',
  },
];
