/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
    colors: {
      White: '#FCFBFB',
      Orange: '#EF1725',
      DarkBrown: '#3B43431',
      LightPink: '#F2AFAE',
      Black: '#170E0F',
      MediumGray: '#b3aaaa',
      StatusBar: '#fa5263',
      Green: '#2af68c',
      HeaderColor: '#fae4e3',
      Blue: '#5484d0',
      ...colors,
    },
  },
  plugins: [],
};
