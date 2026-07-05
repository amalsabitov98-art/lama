/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Семантические токены направления «Тёплый закат».
      // Меняем значения здесь — палитра обновляется по всему сайту.
      colors: {
        sand: '#FFFBEB', // тёплый кремовый фон страницы
        ink: '#0F172A', // основной текст (slate-900)
        brand: {
          light: '#FBBF24', // amber-400
          DEFAULT: '#D97706', // amber-600 — акцент/CTA
          dark: '#B45309', // amber-700 — hover
        },
        stone: {
          // тёплый нейтральный (оставляем часть встроенной шкалы, задаём ключевые)
          500: '#78716C',
          600: '#57534E',
          700: '#44403C',
        },
      },
      fontFamily: {
        // Outfit — заголовки, Work Sans — текст. Подключены в index.css.
        heading: ['Outfit', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Work Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        // Мягкий тёплый градиент под hero (пока без фото).
        'hero-warm': 'linear-gradient(180deg, #FFFBEB 0%, #FEF3C7 55%, #FFFFFF 100%)',
      },
    },
  },
  plugins: [],
}
