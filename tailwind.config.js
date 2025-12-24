/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./*.html",
    "./src/**/*.{html,js}",
    "./script.js"
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0a0a0f',
        'bg-secondary': '#0d0d14',
        'bg-card': '#12121a',
        'bg-input': '#16161f',
        'bg-navbar': 'rgba(10, 10, 15, 0.85)',
        'text-primary': '#f5f5f7',
        'text-secondary': '#a1a1aa',
        'text-muted': '#71717a',
        'accent-blue': '#00d4ff',
        'accent-blue-dim': 'rgba(0, 212, 255, 0.15)',
        'accent-glow': 'rgba(0, 212, 255, 0.4)',
        'border-color': 'rgba(255, 255, 255, 0.08)',
        'border-input': 'rgba(255, 255, 255, 0.12)',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      maxWidth: {
        'container': '1200px',
      },
      container: {
        center: true,
        padding: '1.5rem',
      },
      spacing: {
        'nav-height': '72px',
      },
      backdropBlur: {
        'glass': '20px',
      },
      boxShadow: {
        'glow': '0 0 60px rgba(0, 212, 255, 0.4)',
        'glow-sm': '0 0 30px rgba(0, 212, 255, 0.25)',
        'glow-lg': '0 0 80px rgba(0, 212, 255, 0.5)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

