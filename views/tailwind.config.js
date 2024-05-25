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
    },
  },
  plugins: [],
}

