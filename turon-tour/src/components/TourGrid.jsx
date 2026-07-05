import TourCard from './TourCard.jsx'

export default function TourGrid({ tours, onOpen, onReset }) {
  if (tours.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-accent/30 bg-surface p-10 text-center">
        <p className="text-muted">По выбранным условиям туров не нашлось.</p>
        <button
          type="button"
          onClick={onReset}
          className="mt-3 text-sm text-accent-strong underline underline-offset-2 hover:text-accent"
        >
          Сбросить фильтр
        </button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {tours.map((tour) => (
        <TourCard key={tour.id} tour={tour} onOpen={onOpen} />
      ))}
    </div>
  )
}
