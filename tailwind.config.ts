import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // ═══ Hybrid palette: gold + liquid glass ═══
        background: '#0a0808',
        surface: {
          DEFAULT: 'rgba(22, 18, 15, 0.6)',
          2: 'rgba(30, 24, 19, 0.7)',
          3: 'rgba(38, 30, 24, 0.8)',
        },
        card: {
          DEFAULT: 'rgba(22, 18, 15, 0.6)',
          hover: 'rgba(30, 24, 19, 0.75)',
        },
        border: {
          DEFAULT: 'rgba(200, 161, 90, 0.15)',
          hover: 'rgba(200, 161, 90, 0.3)',
          active: '#c8a15a',
        },
        input: 'rgba(22, 18, 15, 0.6)',
        // Primary = positivo (verde oliva suave, ya no mint)
        primary: {
          DEFAULT: '#a8c47a',
          foreground: '#0a0a0a',
          dim: 'rgba(168, 196, 122, 0.12)',
        },
        // Gold accent (nuevo — brand principal)
        gold: {
          DEFAULT: '#c8a15a',
          light: '#d4b577',
          deep: '#b08c47',
          foil: '#e6c88a',
          soft: 'rgba(200, 161, 90, 0.08)',
          halo: 'rgba(200, 161, 90, 0.4)',
          foreground: '#0a0a0a',
        },
        danger: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff',
          dim: 'rgba(239, 68, 68, 0.12)',
        },
        warning: {
          DEFAULT: '#d9925a',
          foreground: '#0a0a0a',
          dim: 'rgba(217, 146, 90, 0.12)',
        },
        accent: {
          DEFAULT: '#c8a15a',
          dim: 'rgba(200, 161, 90, 0.12)',
        },
        'brand-red': '#ef4444',
        foreground: '#f5f0e8',
        'muted-foreground': 'rgba(245, 240, 232, 0.6)',
        dim: 'rgba(245, 240, 232, 0.5)',
        darker: 'rgba(245, 240, 232, 0.35)',
      },
      fontFamily: {
        sans: ['Be Vietnam Pro', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '8px',
      },
      keyframes: {
        enter: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'enter-scale': {
          from: { opacity: '0', transform: 'scale(0.97)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        msgIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        dotPulse: {
          '0%, 80%, 100%': { opacity: '0.3', transform: 'scale(0.8)' },
          '40%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        enter: 'enter 0.3s ease forwards',
        'enter-scale': 'enter-scale 0.25s ease forwards',
        msgIn: 'msgIn 0.3s ease forwards',
        'dot-1': 'dotPulse 1.4s infinite ease-in-out',
        'dot-2': 'dotPulse 1.4s infinite ease-in-out 0.2s',
        'dot-3': 'dotPulse 1.4s infinite ease-in-out 0.4s',
      },
    },
  },
  plugins: [],
};

export default config;
