import { useEffect } from 'react'
import { telegramBookingLink } from '../lib/contacts.js'

const formatPrice = (n) => new Intl.NumberFormat('ru-RU').format(n) + ' сум'

// Небольшой список-колонка с маркерами (входит / не входит).
function List({ title, items, marker, markerClass }) {
  return (
    <div>
      <h4 className="mb-2 text-sm font-semibold text-ink">{title}</h4>
      <ul className="space-y-1.5 text-sm text-stone-600">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2">
            <span aria-hidden className={`select-none font-semibold ${markerClass}`}>
              {marker}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function TourModal({ tour, onClose }) {
  // Закрытие по Escape + блокировка прокрутки фона, пока модалка открыта.
  useEffect(() => {
    if (!tour) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [tour, onClose])

  if (!tour) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={`Тур: ${tour.город}, ${tour.страна}`}
      onClick={onClose}
    >
      {/* stopPropagation — клик внутри окна не закрывает модалку */}
      <div
        className="relative my-8 w-full max-w-2xl rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Шапка модалки */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 rounded-t-2xl border-b border-stone-200 bg-white p-5">
          <div>
            <h3 className="font-heading text-xl font-bold text-ink">
              {tour.город}, {tour.страна}
            </h3>
            <p className="mt-1 text-sm text-stone-600">
              {tour.длительность} · {tour.размерГруппы}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="shrink-0 rounded-lg p-1 text-stone-400 transition-colors hover:bg-brand/10 hover:text-brand-dark"
          >
            <span className="text-2xl leading-none">&times;</span>
          </button>
        </div>

        {/* Тело модалки */}
        <div className="space-y-6 p-5">
          <img
            src={tour.фотоURL}
            alt={`${tour.город}, ${tour.страна}`}
            className="aspect-[3/2] w-full rounded-md object-cover"
          />

          <p className="text-gray-700">{tour.краткоеОписание}</p>

          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
            <span className="text-gray-600">
              Ближайшая дата: <span className="font-medium text-gray-900">{tour.ближайшаяДата}</span>
            </span>
            <span className="text-gray-600">
              Размер группы: <span className="font-medium text-gray-900">{tour.размерГруппы}</span>
            </span>
          </div>

          {/* Программа по дням */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-ink">Программа по дням</h4>
            <ol className="space-y-3 border-l border-dashed border-brand/40 pl-5">
              {tour.программаПоДням.map((day, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[1.65rem] flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-semibold text-white">
                    {i + 1}
                  </span>
                  <span className="text-sm text-stone-700">{day}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Входит / не входит */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <List
              title="Входит в стоимость"
              items={tour.входитВстоимость}
              marker="✓"
              markerClass="text-brand"
            />
            <List title="Не входит" items={tour.неВходит} marker="—" markerClass="text-stone-400" />
          </div>
        </div>

        {/* Подвал модалки: цена + бронь */}
        <div className="sticky bottom-0 flex flex-col items-stretch justify-between gap-3 rounded-b-2xl border-t border-stone-200 bg-sand p-5 sm:flex-row sm:items-center">
          <div>
            <span className="block text-xs text-stone-500">Стоимость</span>
            <span className="font-heading text-2xl font-bold text-brand-dark">
              от {formatPrice(tour.ценаОт)}
            </span>
          </div>
          <a
            href={telegramBookingLink(tour)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-brand px-6 py-3 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark"
          >
            Забронировать в Telegram
          </a>
        </div>
      </div>
    </div>
  )
}
