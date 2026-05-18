/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          base: '#060810',
          raised: '#0d1020',
          card: '#111525',
          hover: '#181d30',
        },
        accent: {
          DEFAULT: '#6366f1',
          bright: '#818cf8',
          dim: '#4f46e5',
          muted: 'rgba(99, 102, 241, 0.12)',
        },
        forge: {
          black: '#060810',
          dark: '#0d1020',
          card: 'rgba(255, 255, 255, 0.04)',
          border: 'rgba(99, 102, 241, 0.25)',
          green: '#6366f1',
          glow: '#818cf8',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 40px rgba(99, 102, 241, 0.3)',
        'glow-sm': '0 0 20px rgba(99, 102, 241, 0.2)',
        card: '0 4px 24px rgba(0, 0, 0, 0.6)',
        poster: '0 8px 32px rgba(0, 0, 0, 0.7)',
      },
      backgroundImage: {
        'hero-gradient':
          'linear-gradient(to top, #060810 0%, rgba(6,8,16,0.85) 35%, rgba(6,8,16,0.2) 70%, transparent 100%)',
        'hero-side':
          'linear-gradient(to right, #060810 0%, transparent 50%), linear-gradient(to left, #060810 0%, transparent 30%)',
        'mesh':
          'radial-gradient(ellipse 80% 60% at 50% -30%, rgba(99,102,241,0.15), transparent), radial-gradient(ellipse 50% 40% at 100% 0%, rgba(99,102,241,0.08), transparent)',
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
        'fade-up': 'fadeUp 0.5s ease-out',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};