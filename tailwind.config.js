// Tailwind theme: maps the FitNova palette to class names (bg-card, text-accent, border-line ...).
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0B0F0C',
        card: '#121A15',
        panel: '#19221C',
        raised: '#202B23',
        accent: { DEFAULT: '#B7D8B8', 2: '#98BE9C', muted: '#78977C' },
        ink: '#F2F5F1',
        soft: '#A6B0A6',
        line: '#29352D',
      },
      fontFamily: { sans: ['Manrope', 'Inter', 'system-ui', 'sans-serif'] },
      boxShadow: { soft: '0 14px 40px -18px rgba(0,0,0,0.65)' },
    },
  },
  plugins: [],
};
