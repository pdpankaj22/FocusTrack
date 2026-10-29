/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Design Tokens: Editorial Minimalism × Modern Study Journal
        canvas: '#F6F5F0',
        surface: {
          DEFAULT: '#FFFFFF',
          secondary: '#EFEEE7',
          tertiary: '#E5E4DC',
        },
        ink: {
          DEFAULT: '#252720',
          muted: '#77796F',
          faint: '#9DA092',
        },
        border: {
          DEFAULT: '#E2E1D9',
          subtle: '#ECEBE4',
          strong: '#C8C7BE',
        },
        forest: {
          DEFAULT: '#536747',
          hover: '#43563A',
          light: '#E7EBE1',
          subtle: '#F1F4EE',
          dark: '#2C3A25',
        },
        terracotta: {
          DEFAULT: '#C77B5A',
          hover: '#AF6949',
          light: '#F9EFE9',
          dark: '#8C4D32',
        },
        status: {
          success: '#53734D',
          'success-bg': '#EDF3EB',
          warning: '#B47A35',
          'warning-bg': '#FAF3E8',
          error: '#B65F53',
          'error-bg': '#F9EDEB',
        },
        // Semantic aliases for seamless backwards-compatibility
        primary: {
          50:  '#F1F4EE',
          100: '#E7EBE1',
          200: '#D2DCC7',
          300: '#B5C5A5',
          400: '#7E976E',
          500: '#536747',
          600: '#536747', // forest green action color
          700: '#43563A',
          800: '#34432E',
          900: '#252720',
        },
        neutral: {
          50:  '#F6F5F0', // warm canvas
          100: '#EFEEE7', // warm secondary surface
          200: '#E2E1D9', // warm border
          300: '#D5D4CB',
          400: '#9DA092',
          500: '#77796F', // secondary text
          600: '#5A5C53',
          700: '#3F4139',
          800: '#252720', // primary text
          900: '#1A1C16',
        },
      },
      fontFamily: {
        serif: ['Lora', 'Charter', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      borderRadius: {
        'sm': '6px',
        'md': '8px',
        'lg': '10px',
        'xl': '12px',
        '2xl': '16px',
        '3xl': '20px',
      },
      boxShadow: {
        'editorial': '0 1px 3px 0 rgba(37, 39, 32, 0.04), 0 1px 2px -1px rgba(37, 39, 32, 0.04)',
        'editorial-md': '0 4px 6px -1px rgba(37, 39, 32, 0.05), 0 2px 4px -2px rgba(37, 39, 32, 0.05)',
        'editorial-lg': '0 10px 15px -3px rgba(37, 39, 32, 0.06), 0 4px 6px -4px rgba(37, 39, 32, 0.04)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(6px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      }
    },
  },
  plugins: [],
}
