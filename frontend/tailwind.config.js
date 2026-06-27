/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sbi-blue': '#2874F0',
        'sbi-navy': '#0A1E4A'
      }
    },
  },
  plugins: [],
}
