/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand': {
          DEFAULT: '#2ECC71', // Parrot Green
          50: '#E8FAF0',
          100: '#C2F0D5',
          200: '#9CE7BA',
          300: '#75DEA0',
          400: '#4FD485',
          500: '#2ECC71',
          600: '#25A25A',
          700: '#1C7943',
          800: '#12502D',
          900: '#092816',
        },
        'stadium': {
          'low': '#2ECC71',     // Green
          'medium': '#F39C12',  // Yellow
          'high': '#E74C3C',    // Red
          'bg': '#F8FAFC',      // Off-white minimal UI
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 10px 40px -10px rgba(0,0,0,0.08)',
        'float': '0 20px 40px -10px rgba(46, 204, 113, 0.2)',
      }
    },
  },
  plugins: [],
}
