/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        plex: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          gold: '#e5a00d',
          dark: '#0a0d14',
          surface: '#111622',
          card: '#161d2d',
          border: 'rgba(255, 255, 255, 0.08)',
          hover: '#1d273c',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace']
      },
      boxShadow: {
        'glow-plex': '0 0 20px -3px rgba(229, 160, 13, 0.25)',
        'glow-blue': '0 0 20px -3px rgba(56, 189, 248, 0.25)',
        'card-hover': '0 12px 24px -10px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(229, 160, 13, 0.3)',
      }
    },
  },
  plugins: [],
}
