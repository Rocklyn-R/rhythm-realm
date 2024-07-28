/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        '1md': '980px',
        '1xs': '460px',
        'xs': '370px', // Adjust the value to 280px
        'xxs': '280px'
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
      },
      fontWeight: {
        light: 300,
        bold: 700,
      },
      width: {
        '9/20': '45%',
      },
      spacing: {
        '23': '5.75rem', // This adds a custom spacing value
        '1/2': '2px'
      },
      colors: {
        darkred: '#8B0000', // Hex code for dark red
      },
    },
  },
  plugins: [],
}

