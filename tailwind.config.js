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
          DEFAULT: '#8b5cf6',
          bright: '#a78bfa',
          dim: '#7c3aed',
          muted: 'rgba(139, 92, 246, 0.14)',
        },
        violet: {
          glow: '#c4b5fd',
          border: 'rgba(167, 139, 250, 0.45)',
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
        glow: '0 0 40px rgba(139, 92, 246, 0.35)',
        'glow-sm': '0 0 20px rgba(139, 92, 246, 0.22)',
        card: '0 4px 24px rgba(0, 0, 0, 0.6)',
        poster: '0 8px 32px rgba(0, 0, 0, 0.7)',
      },
      backgroundImage: {
        'hero-gradient':
          'linear-gradient(to top, #060810 0%, rgba(6,8,16,0.85) 35%, rgba(6,8,16,0.2) 70%, transparent 100%)',
        'hero-side':
          'linear-gradient(to right, #060810 0%, transparent 50%), linear-gradient(to left, #060810 0%, transparent 30%)',
        'mesh':
          'radial-gradient(ellipse 80% 60% at 50% -30%, rgba(139,92,246,0.18), transparent), radial-gradient(ellipse 50% 40% at 100% 0%, rgba(99,102,241,0.1), transparent)',
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