// Формат цены: число сум → «4 500 000 сум».
const formatPrice = (n) => new Intl.NumberFormat('ru-RU').format(n) + ' сум'

// Цвета бейджа по статусу.
const STATUS_STYLES = {
  хит: 'bg-brand text-white',
  'мало мест': 'bg-white/90 text-brand-dark border border-brand/40',
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
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md">
      {/* Фото (плейсхолдер) */}
      <div className="relative aspect-[3/2] overflow-hidden bg-stone-100">
        <img
          src={tour.фотоURL}
          alt={`${tour.город}, ${tour.страна}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        {tour.статус && (
          <div className="absolute left-3 top-3">
            <StatusBadge статус={tour.статус} />
          </div>
        )}
      </div>

      {/* Signature: «билетная» надсечка на стыке фото и тела карточки */}
      <div className="ticket-notch -left-2 top-[calc(66.66%-0.5rem)]" aria-hidden />
      <div className="ticket-notch -right-2 top-[calc(66.66%-0.5rem)]" aria-hidden />

      {/* Контент карточки */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-heading text-lg font-bold text-ink">
          {tour.город}
          <span className="font-normal text-stone-500">, {tour.страна}</span>
        </h3>

        <dl className="mt-3 space-y-1.5 text-sm text-stone-600">
          <div className="flex justify-between gap-2">
            <dt>Длительность</dt>
            <dd className="text-right font-medium text-ink">{tour.длительность}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt>Ближайшая дата</dt>
            <dd className="text-right font-medium text-ink">{tour.ближайшаяДата}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt>Группа</dt>
            <dd className="text-right font-medium text-ink">{tour.размерГруппы}</dd>
          </div>
        </dl>

        <p className="mt-3 line-clamp-3 text-sm text-stone-600">{tour.краткоеОписание}</p>

        {/* Цена + кнопка прижаты к низу карточки */}
        <div className="mt-auto flex items-end justify-between border-t border-dashed border-stone-200 pt-4">
          <div>
            <span className="block text-xs text-stone-500">от</span>
            <span className="font-heading text-xl font-bold text-brand-dark">
              {formatPrice(tour.ценаОт)}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onOpen(tour)}
            className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark"
          >
            Подробнее
          </button>
        </div>
      </div>
    </article>
  )
}
