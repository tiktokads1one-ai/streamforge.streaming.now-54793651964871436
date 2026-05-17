/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          base: '#050505',
          raised: '#0c0c0c',
          card: '#121212',
          hover: '#1a1a1a',
        },
        accent: {
          DEFAULT: '#22c55e',
          bright: '#4ade80',
          dim: '#16a34a',
          muted: 'rgba(34, 197, 94, 0.12)',
        },
        forge: {
          black: '#050505',
          dark: '#0c0c0c',
          card: 'rgba(255, 255, 255, 0.04)',
          border: 'rgba(34, 197, 94, 0.25)',
          green: '#22c55e',
          glow: '#4ade80',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 40px rgba(34, 197, 94, 0.25)',
        'glow-sm': '0 0 20px rgba(34, 197, 94, 0.2)',
        card: '0 4px 24px rgba(0, 0, 0, 0.5)',
        poster: '0 8px 32px rgba(0, 0, 0, 0.6)',
      },
      backgroundImage: {
        'hero-gradient':
          'linear-gradient(to top, #050505 0%, rgba(5,5,5,0.85) 35%, rgba(5,5,5,0.2) 70%, transparent 100%)',
        'hero-side':
          'linear-gradient(to right, #050505 0%, transparent 50%), linear-gradient(to left, #050505 0%, transparent 30%)',
        'mesh':
          'radial-gradient(ellipse 80% 60% at 50% -30%, rgba(34,197,94,0.12), transparent), radial-gradient(ellipse 50% 40% at 100% 0%, rgba(34,197,94,0.06), transparent)',
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
