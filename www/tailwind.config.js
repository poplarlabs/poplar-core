/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    '../app/frontend/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'poplar': {
          'text': '#1A3C34',
          'button': '#C15A36',
          'accent': '#F0E4D7',
          'gradient-start': '#C6DABF',
          'gradient-end': '#6B8E23',
          'placeholder': '#A0AEC0',
          'off-white': '#F5F5F5',
        },
      },
      backgroundImage: {
        'poplar-gradient': 'linear-gradient(to bottom, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
