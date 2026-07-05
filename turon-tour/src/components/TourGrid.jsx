import TourCard from './TourCard.jsx'

export default function TourGrid({ tours, onOpen, onReset }) {
  if (tours.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-brand/30 bg-white p-10 text-center">
        <p className="text-stone-600">По выбранным условиям туров не нашлось.</p>
        <button
          type="button"
          onClick={onReset}
          className="mt-3 text-sm text-brand-dark underline underline-offset-2 hover:text-brand"
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
