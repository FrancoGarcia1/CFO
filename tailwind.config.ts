import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#000000',
        surface: {
          DEFAULT: '#1a1a1a',
          2: '#2e2e2e',
          3: '#313131',
        },
        card: {
          DEFAULT: '#1a1a1a',
          hover: '#242424',
        },
        border: {
          DEFAULT: '#313131',
          hover: '#4a4a4a',
          active: '#45ffbc',
        },
        input: '#1a1a1a',
        primary: {
          DEFAULT: '#45ffbc',
          foreground: '#000000',
          dim: 'rgba(69, 255, 188, 0.12)',
        },
        danger: {
          DEFAULT: '#ff4757',
          foreground: '#ffffff',
          dim: 'rgba(255, 71, 87, 0.12)',
        },
        warning: {
          DEFAULT: '#f5a623',
          foreground: '#000000',
          dim: 'rgba(245, 166, 35, 0.12)',
        },
        accent: {
          DEFAULT: '#e3ffa8',
          dim: 'rgba(227, 255, 168, 0.12)',
        },
        'brand-red': '#dc2626',
        foreground: '#ffffff',
        'muted-foreground': '#969593',
        dim: '#969593',
        darker: '#6b6b6b',
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
