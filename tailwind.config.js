/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './public/**/*.{svg,png,jpg,jpeg,gif}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'gray-750': '#2D3748',
      },
      backgroundColor: {
        'gray-750': '#2D3748',
      },
    },
  },
  plugins: [],
} 