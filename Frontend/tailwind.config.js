/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        customDarkOrange: '#ff703c',
        customeLightOrange: '#FFCBA4'
      }
    },
  },
  plugins: [],
}

