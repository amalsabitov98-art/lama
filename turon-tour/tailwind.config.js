/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Семантические токены ссылаются на CSS-переменные тем (см. index.css).
      // RGB-каналы + <alpha-value> — чтобы работали модификаторы прозрачности.
      colors: {
        sand: 'rgb(var(--c-sand) / <alpha-value>)',
        ink: 'rgb(var(--c-ink) / <alpha-value>)',
        brand: {
          light: 'rgb(var(--c-brand-light) / <alpha-value>)',
          DEFAULT: 'rgb(var(--c-brand) / <alpha-value>)',
          dark: 'rgb(var(--c-brand-dark) / <alpha-value>)',
        },
      },
      fontFamily: {
        heading: 'var(--font-heading)',
        sans: 'var(--font-sans)',
      },
    },
  },
  plugins: [],
}
