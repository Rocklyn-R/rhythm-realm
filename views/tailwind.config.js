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
        '1/2': '2px',
        '96': '20rem', // Add custom spacing value
        '112': '28rem',
        '128': '32rem',
        // Add more as needed
      },
      colors: {
        darkred: '#8B0000', // Hex code for dark red
      },
      translate: {
        '25': '6.25rem',  // 25 units
        '30': '7.5rem',   // 30 units
        '40': '10rem',    // 40 units
        '50': '20rem',  // 50 units
        // Add more as needed
      },
      zIndex: {
        '45': '45',
      },
    },
  },
  plugins: [],
}

