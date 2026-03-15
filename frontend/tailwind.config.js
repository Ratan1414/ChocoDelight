/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        chocolate: {
          DEFAULT: '#7B3F00',
          50: '#FFF5E1',
          100: '#FFE8C2',
          200: '#FFDBA3',
          300: '#D4A574',
          400: '#A0714A',
          500: '#7B3F00',
          600: '#663300',
          700: '#522900',
          800: '#3D1F00',
          900: '#291500',
        },
        coral: {
          DEFAULT: '#FF6F61',
          50: '#FFF0EE',
          100: '#FFD5D0',
          200: '#FFB3AB',
          300: '#FF9186',
          400: '#FF6F61',
          500: '#E5574A',
          600: '#CC3F33',
        },
        gold: {
          DEFAULT: '#FFD700',
          50: '#FFFDE6',
          100: '#FFF9B3',
          200: '#FFF580',
          300: '#FFEF4D',
          400: '#FFE91A',
          500: '#FFD700',
          600: '#CCB000',
        },
        cream: {
          DEFAULT: '#FFF5E1',
          50: '#FFFDF8',
          100: '#FFF5E1',
          200: '#FFEDC4',
          300: '#FFE5A7',
        }
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.6s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      },
    },
  },
  plugins: [],
}
