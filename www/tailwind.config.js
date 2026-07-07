/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
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
          'cream': '#F7F3EB',
          'soil': '#14302A',
          'soil-deep': '#0E241F',
          'moss': '#5F7D57',
          'bark': '#8A6F4D',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        'poplar-gradient': 'linear-gradient(to bottom, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
