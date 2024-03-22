/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
    colors: {
      white: '#FCFBFB',
      Orange: '#EF1725',
      darkBrown: '#3B43431',
      lightPink: '#F2AFAE',
      black: '#170E0F',
      mediumGray: '#b3aaaa',
      statusBar: '#fa5263',
      green: '#2af68c',
      headerColor: '#fae4e3',
      blue: '#5484d0',
      ...colors,
    },
  },
  plugins: [],
};
