/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
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
      },
    },
  },
  plugins: [],
}

