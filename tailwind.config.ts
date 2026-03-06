import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'calc-bg': '#1a1a2e',
        'calc-display': '#16213e',
        'calc-btn-num': '#0f3460',
        'calc-btn-op': '#e94560',
        'calc-btn-eq': '#e94560',
        'calc-btn-fn': '#533483',
        'calc-text': '#eaeaea',
      },
      animation: {
        'slide-in': 'slideIn 0.3s ease-out',
        'press': 'press 0.1s ease-in-out',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        press: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
