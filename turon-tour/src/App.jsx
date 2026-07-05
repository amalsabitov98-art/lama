import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import TourFilters from './components/TourFilters.jsx'
import TourGrid from './components/TourGrid.jsx'
import TourModal from './components/TourModal.jsx'
import About from './components/About.jsx'
import Reviews from './components/Reviews.jsx'
import Footer from './components/Footer.jsx'
import RouteDivider from './components/RouteDivider.jsx'
import { tours } from './data/tours.js'

// Порядок месяцев для сортировки селектов.
const MONTHS_ORDER = [
  'январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
  'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь',
]

// Родительный падеж из «ближайшаяДата» → именительный для селекта.
const GENITIVE_TO_NOMINATIVE = {
  января: 'январь', февраля: 'февраль', марта: 'март', апреля: 'апрель',
  мая: 'май', июня: 'июнь', июля: 'июль', августа: 'август',
  сентября: 'сентябрь', октября: 'октябрь', ноября: 'ноябрь', декабря: 'декабрь',
}

// Достаём месяц (именительный) из строки вида «15 августа 2026».
function monthOfTour(tour) {
  const word = (tour.ближайшаяДата || '').split(' ')[1]?.toLowerCase()
  return GENITIVE_TO_NOMINATIVE[word] || null
}

const ALL = 'all'

export default function App() {
  // Общий фильтр — им управляют и Hero, и TourFilters.
  const [destination, setDestination] = useState(ALL)
  const [month, setMonth] = useState(ALL)
  // Тур, открытый в модалке (null — модалка закрыта).
  const [activeTour, setActiveTour] = useState(null)
  // Тема оформления. Старт — от системной; тумблер в шапке переключает (без сохранения).
  const [theme, setTheme] = useState(() =>
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light',
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  // Списки опций считаем из данных, а не хардкодим.
  const destinationOptions = useMemo(
    () => [...new Set(tours.map((t) => t.страна))].sort((a, b) => a.localeCompare(b, 'ru')),
    [],
  )

  const monthOptions = useMemo(() => {
    const present = new Set(tours.map(monthOfTour).filter(Boolean))
    return MONTHS_ORDER.filter((m) => present.has(m))
  }, [])

  // Применение фильтра.
  const visibleTours = useMemo(() => {
    return tours.filter((t) => {
      const okDest = destination === ALL || t.страна === destination
      const okMonth = month === ALL || monthOfTour(t) === month
      return okDest && okMonth
    })
  }, [destination, month])

  const resetFilters = () => {
    setDestination(ALL)
    setMonth(ALL)
  }

  const scrollToTours = () => {
    document.getElementById('tours')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-ground font-sans text-ink">
      <Header theme={theme} onToggleTheme={toggleTheme} />

      <main>
        <Hero
          destination={destination}
          month={month}
          onDestinationChange={setDestination}
          onMonthChange={setMonth}
          destinationOptions={destinationOptions}
          monthOptions={monthOptions}
          allValue={ALL}
          onSubmit={scrollToTours}
        />

        <RouteDivider />

        <section id="tours" className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <div className="mb-8">
            <h2 className="font-heading text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Готовые туры
            </h2>
            <p className="mt-2 text-muted">Проверенные программы с фиксированными датами выезда.</p>
          </div>

          <TourFilters
            destination={destination}
            month={month}
            onDestinationChange={setDestination}
            onMonthChange={setMonth}
            destinationOptions={destinationOptions}
            monthOptions={monthOptions}
            allValue={ALL}
            resultsCount={visibleTours.length}
            onReset={resetFilters}
          />

          <TourGrid tours={visibleTours} onOpen={setActiveTour} onReset={resetFilters} />
        </section>

        <RouteDivider />
        <About />
        <RouteDivider />
        <Reviews />
      </main>

      <Footer />

      <TourModal tour={activeTour} onClose={() => setActiveTour(null)} />
    </div>
  )
}
