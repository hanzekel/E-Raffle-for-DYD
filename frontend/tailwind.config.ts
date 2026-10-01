import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // --- DYD26 Brand Palette ---
        'royal-blue': '#1A3A8F',
        'midnight-navy': '#0D1F5C',
        gold: '#F5A623',
        'sky-blue': '#5BB8F5',
        'highlight-red': '#E63030',
        // Utility shades
        'royal-blue-light': '#2A4FA8',
        'royal-blue-dark': '#142E73',
        'gold-light': '#F7B84D',
        'gold-dark': '#D48E1A',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'filipiniana-pattern':
          'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(245, 166, 35, 0.05) 10px, rgba(245, 166, 35, 0.05) 20px)',
        'hero-gradient':
          'linear-gradient(135deg, #0D1F5C 0%, #1A3A8F 50%, #0D1F5C 100%)',
        'radial-gradient': 'radial-gradient(circle at center, var(--tw-gradient-stops))',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'appear': 'appear 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
        'appear-zoom': 'appearZoom 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
        'glow': 'glow 3s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        appear: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        appearZoom: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        glow: {
          '0%': { opacity: '0.8', transform: 'scale(1)' },
          '100%': { opacity: '1', transform: 'scale(1.05)' },
        },
      },
      transitionDelay: {
        '100': '100ms',
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
        '500': '500ms',
        '600': '600ms',
        '700': '700ms',
        '1000': '1000ms',
        '1500': '1500ms',
        '2000': '2000ms',
      }
    },
  },
  plugins: [],
} satisfies Config;
