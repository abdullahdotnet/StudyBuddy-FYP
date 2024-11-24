/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width: {
        'fill-available': '-webkit-fill-available',
      },
      colors:{
        customDarkBlue: '#4255FF',
        customDarkBlueHover: '#4255ee',
        customLightBlue: "#EDEFFF",
        customTextDark: '#586380',
        customDarkOrange: '#FF703C',
        customLightOrange: '#FFCBA4',
        customDarkTeal: '#05EAA7',
        customLightTeal: '#DDFFF5',
      }
    },
  },
  plugins: [],
};
