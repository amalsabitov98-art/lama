import { useEffect } from 'react'
import { telegramBookingLink } from '../lib/contacts.js'

const formatPrice = (n) => new Intl.NumberFormat('ru-RU').format(n) + ' сум'

// Небольшой список-колонка с маркерами (входит / не входит).
function List({ title, items, marker }) {
  return (
    <div>
      <h4 className="mb-2 text-sm font-semibold text-gray-900">{title}</h4>
      <ul className="space-y-1.5 text-sm text-gray-600">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2">
            <span aria-hidden className="select-none">
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
        className="relative my-8 w-full max-w-2xl rounded-lg bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Шапка модалки */}
        <div className="sticky top-0 flex items-start justify-between gap-4 rounded-t-lg border-b border-gray-200 bg-white p-5">
          <div>
            <h3 className="text-xl font-bold">
              {tour.город}, {tour.страна}
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              {tour.длительность} · {tour.размерГруппы}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="shrink-0 rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900"
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
            <h4 className="mb-3 text-sm font-semibold text-gray-900">Программа по дням</h4>
            <ol className="space-y-3">
              {tour.программаПоДням.map((day, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white">
                    {i + 1}
                  </span>
                  <span className="text-sm text-gray-700">{day}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Входит / не входит */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <List title="Входит в стоимость" items={tour.входитВстоимость} marker="✓" />
            <List title="Не входит" items={tour.неВходит} marker="—" />
          </div>
        </div>

        {/* Подвал модалки: цена + бронь */}
        <div className="sticky bottom-0 flex flex-col items-stretch justify-between gap-3 rounded-b-lg border-t border-gray-200 bg-white p-5 sm:flex-row sm:items-center">
          <div>
            <span className="block text-xs text-gray-500">Стоимость</span>
            <span className="text-2xl font-bold">от {formatPrice(tour.ценаОт)}</span>
          </div>
          <a
            href={telegramBookingLink(tour)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-gray-900 px-6 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-gray-700"
          >
            Забронировать в Telegram
          </a>
        </div>
      </div>
    </div>
  )
}
