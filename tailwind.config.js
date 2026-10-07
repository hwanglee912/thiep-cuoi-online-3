/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFBF7',
          100: '#FAF6EE',
          200: '#F4ECE0',
          300: '#ECE0CE',
          400: '#DFCDAF',
        },
        champagne: {
          DEFAULT: '#E5D3B3',
          light: '#F5EBD9',
          dark: '#C8B087',
        },
        gold: {
          50: '#FBF6EA',
          200: '#EBD8AA',
          300: '#DFBE7A',
          400: '#CFA453',
          500: '#B88D37',
          600: '#946E22',
          700: '#76551B',
        },
        rosewood: {
          DEFAULT: '#7C4A47',
          light: '#A36864',
          dark: '#58312F',
        },
        charcoal: {
          800: '#262422',
          900: '#1A1816',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', '"EB Garamond"', 'serif'],
        display: ['"Playfair Display"', '"EB Garamond"', 'serif'],
        sans: ['Roboto', 'Arial', 'sans-serif'],
        script: ['"GreatVibes-Regular.ttf"', 'cursive'],
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(184, 141, 55, 0.12)',
        'soft': '0 10px 30px -10px rgba(0, 0, 0, 0.05)',
        'glass': '0 8px 32px 0 rgba(190, 160, 120, 0.15)',
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
        'float': 'float 4s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.02)' },
        }
      }
    },
  },
  plugins: [],
}
