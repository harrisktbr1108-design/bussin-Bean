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
          50:  '#FDFBF7',
          100: '#FAF6F0',
          200: '#F4ECE1',
          300: '#EBE0CF',
          400: '#D6C7B2',
        },
        espresso: {
          500: '#7A4A2E',
          600: '#5C3318',
          700: '#4A2710',
          800: '#3D2314',
          900: '#2A160A',
          950: '#120703',
        },
        caramel: {
          400: '#D4944A',
          500: '#C47E38',
          600: '#A8632A',
        },
      },
      fontFamily: {
        sans:  ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft':       '0 10px 30px -5px rgba(18,7,3,0.10)',
        'card-hover': '0 20px 40px -10px rgba(18,7,3,0.18)',
        'glow':       '0 0 20px rgba(196,126,56,0.20)',
      },
    },
  },
  plugins: [],
}
