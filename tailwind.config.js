/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        fontTitle: ['FontTitle', 'sans-serif'],
        fontBtnMenus: ['FontBtnMenus', 'sans-serif'],
        fontSans: ['OpenSans', 'sans-serif'],
      },
      animation: {
        'pulsate': 'pulsate 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        'pulsate': {
          '0%': { transform: 'scale(1)', opacity: '0.5' },
          '75%': { transform: 'scale(1.15)', opacity: '0' },
          '100%': { transform: 'scale(1.15)', opacity: '0' }
        }
      }
    }
  },
  plugins: [],
};
