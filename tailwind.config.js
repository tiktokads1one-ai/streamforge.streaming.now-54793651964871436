/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          base: '#0F0F17',
          raised: '#161622',
          card: '#1E1E2E',
          hover: '#2A2A3E',
        },
        accent: {
          DEFAULT: '#8B5CF6',
          deep: '#6D28D9',
          bright: '#A78BFA',
          dim: '#5B21B6',
          muted: 'rgba(139, 92, 246, 0.2)',
        },
        purple: {
          DEFAULT: '#8B5CF6',
          deep: '#6D28D9',
          light: '#A78BFA',
          dark: '#4C1D95',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 30px rgba(139, 92, 246, 0.6)',
        'glow-sm': '0 0 15px rgba(139, 92, 246, 0.4)',
        card: '0 4px 20px rgba(0, 0, 0, 0.6)',
      },
      backgroundImage: {
        'hero-gradient':
          'linear-gradient(to top, #0F0F17 0%, rgba(15, 15, 23, 0.95) 35%, rgba(15, 15, 23, 0.3) 70%, transparent 100%)',
        'mesh':
          'radial-gradient(ellipse 80% 60% at 50% -30%, rgba(139, 92, 246, 0.3), transparent), radial-gradient(ellipse 50% 40% at 100% 0%, rgba(109, 40, 217, 0.2), transparent)',
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
}
