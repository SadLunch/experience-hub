/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        fontTitle: ['FontTitle', 'sans-serif'],
        fontBtnMenus: ['FontBtnMenus', 'sans-serif'],
        fontSans: ['OpenSans', 'sans-serif'],
      }
    }
  },
  plugins: [],
};
