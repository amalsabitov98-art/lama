// Формат цены: число сум → «4 500 000 сум».
const formatPrice = (n) => new Intl.NumberFormat('ru-RU').format(n) + ' сум'

// Цвета бейджа по статусу (нейтральные, доработаем на этапе дизайна).
const STATUS_STYLES = {
  хит: 'bg-gray-900 text-white',
  'мало мест': 'bg-amber-100 text-amber-800 border border-amber-200',
}

function StatusBadge({ статус }) {
  if (!статус) return null
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[статус] || 'bg-gray-100 text-gray-700'}`}
    >
      {статус}
    </span>
  )
}

export default function TourCard({ tour, onOpen }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md">
      {/* Фото (плейсхолдер) */}
      <div className="relative aspect-[3/2] bg-gray-100">
        <img
          src={tour.фотоURL}
          alt={`${tour.город}, ${tour.страна}`}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        {tour.статус && (
          <div className="absolute left-3 top-3">
            <StatusBadge статус={tour.статус} />
          </div>
        )}
      </div>

      {/* Контент карточки */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold">
          {tour.город}
          <span className="font-normal text-gray-500">, {tour.страна}</span>
        </h3>

        <dl className="mt-3 space-y-1.5 text-sm text-gray-600">
          <div className="flex justify-between gap-2">
            <dt>Длительность</dt>
            <dd className="text-right text-gray-900">{tour.длительность}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt>Ближайшая дата</dt>
            <dd className="text-right text-gray-900">{tour.ближайшаяДата}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt>Группа</dt>
            <dd className="text-right text-gray-900">{tour.размерГруппы}</dd>
          </div>
        </dl>

        <p className="mt-3 line-clamp-3 text-sm text-gray-600">{tour.краткоеОписание}</p>

        {/* Цена + кнопка прижаты к низу карточки */}
        <div className="mt-auto flex items-end justify-between pt-5">
          <div>
            <span className="block text-xs text-gray-500">от</span>
            <span className="text-xl font-bold">{formatPrice(tour.ценаОт)}</span>
          </div>
          <button
            type="button"
            onClick={() => onOpen(tour)}
            className="rounded-md border border-gray-900 px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-900 hover:text-white"
          >
            Подробнее
          </button>
        </div>
      </div>
    </article>
  )
}
