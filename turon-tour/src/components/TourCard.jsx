import DestinationArt from './DestinationArt.jsx'
import { telegramBookingLink } from '../lib/contacts.js'

const formatPrice = (n) => new Intl.NumberFormat('ru-RU').format(n)

// «5 дней / 4 ночи» → «5 дней» (компактно для карточки).
const shortDuration = (d) => (d || '').split('/')[0].trim()

// «до 15 человек» → «до 15».
const shortGroup = (g) => (g || '').replace(/\s*человек.*/i, '')

// «15 августа 2026» → «15 авг».
const MONTH_SHORT = {
  января: 'янв', февраля: 'фев', марта: 'мар', апреля: 'апр', мая: 'мая', июня: 'июн',
  июля: 'июл', августа: 'авг', сентября: 'сен', октября: 'окт', ноября: 'ноя', декабря: 'дек',
}
const shortDate = (d) => {
  const [day, month] = (d || '').split(' ')
  return month ? `${day} ${MONTH_SHORT[month.toLowerCase()] || month}` : d
}

const STATUS = {
  хит: { label: 'Хит продаж', cls: 'bg-accent/95 text-white' },
  'мало мест': { label: 'Мало мест', cls: 'bg-surface/90 text-accent-strong ring-1 ring-accent/40' },
}

function MetaIcon({ name }) {
  const common = {
    viewBox: '0 0 24 24', fill: 'none', strokeWidth: 1.8,
    strokeLinecap: 'round', strokeLinejoin: 'round', className: 'h-3.5 w-3.5 stroke-accent',
  }
  if (name === 'clock')
    return (<svg {...common}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>)
  if (name === 'calendar')
    return (<svg {...common}><rect x="3" y="4.5" width="18" height="16" rx="2" /><path d="M3 9h18M8 2.5v4M16 2.5v4" /></svg>)
  return (<svg {...common}><circle cx="9" cy="8" r="3.2" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 5.5a3 3 0 0 1 0 5.4M17 20a6.5 6.5 0 0 0-2-4.7" /></svg>)
}

export default function TourCard({ tour, onOpen }) {
  const status = STATUS[tour.статус]
  return (
    <article className="group flex flex-col overflow-hidden rounded-[22px] border border-line bg-surface shadow-[0_1px_2px_rgba(28,23,20,.04),0_18px_40px_-24px_rgba(28,23,20,.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_1px_2px_rgba(28,23,20,.05),0_30px_60px_-28px_rgba(28,23,20,.4)]">
      {/* Фото (арт-иллюстрация; позже заменяется на <img src={tour.фотоURL}>) */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <div className="h-full w-full transition-transform duration-500 group-hover:scale-[1.045]">
          <DestinationArt tourId={tour.id} alt={`${tour.город}, ${tour.страна}`} />
        </div>
        {status && (
          <span
            className={`absolute left-3.5 top-3.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold backdrop-blur ${status.cls}`}
          >
            {tour.статус === 'хит' && <span className="h-1.5 w-1.5 rounded-full bg-accent-tint" />}
            {status.label}
          </span>
        )}
      </div>

      {/* Тело */}
      <div className="px-5 pb-1 pt-4">
        <h3 className="font-heading text-[22px] font-extrabold leading-tight tracking-tight text-ink">
          {tour.город}
          <span className="font-semibold text-muted">, {tour.страна}</span>
        </h3>
        <p className="mt-2 line-clamp-2 text-[13.5px] leading-relaxed text-muted">
          {tour.краткоеОписание}
        </p>

        <div className="mt-4 grid grid-cols-3 gap-2.5">
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1.5 text-[11px] text-muted">
              <MetaIcon name="clock" /> Срок
            </span>
            <span className="text-[13px] font-semibold text-ink">{shortDuration(tour.длительность)}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1.5 text-[11px] text-muted">
              <MetaIcon name="calendar" /> Выезд
            </span>
            <span className="text-[13px] font-semibold text-ink">{shortDate(tour.ближайшаяДата)}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1.5 text-[11px] text-muted">
              <MetaIcon name="group" /> Группа
            </span>
            <span className="text-[13px] font-semibold text-ink">{shortGroup(tour.размерГруппы)}</span>
          </div>
        </div>
      </div>

      {/* Signature: билетная перфорация */}
      <div className="relative mt-4 h-6">
        <div className="absolute left-[18px] right-[18px] top-1/2 border-t border-dashed border-line-strong" />
        <span className="ticket-notch -left-2.5 top-1/2 -translate-y-1/2" aria-hidden />
        <span className="ticket-notch -right-2.5 top-1/2 -translate-y-1/2" aria-hidden />
      </div>

      {/* Цена + действия */}
      <div className="flex items-center justify-between gap-3 px-5 pb-5 pt-1">
        <div>
          <div className="text-[11px] font-medium text-muted">от</div>
          <div className="font-heading text-[21px] font-extrabold tracking-tight text-ink [font-variant-numeric:tabular-nums]">
            {formatPrice(tour.ценаОт)}
            <span className="ml-1 text-xs font-semibold text-muted">сум</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={telegramBookingLink(tour)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Написать в Telegram"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-line-strong text-accent transition-colors hover:border-accent hover:bg-accent-tint"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-[19px] w-[19px]">
              <path d="M21.9 4.3l-3.3 15.6c-.25 1.1-.9 1.37-1.83.85l-5.05-3.72-2.44 2.35c-.27.27-.5.5-1.02.5l.36-5.15L18 5.3c.4-.36-.09-.56-.62-.2L7.1 11.9l-4.9-1.53c-1.06-.33-1.08-1.06.22-1.57L20.5 2.9c.9-.33 1.68.2 1.4 1.4z" />
            </svg>
          </a>
          <button
            type="button"
            onClick={() => onOpen(tour)}
            className="rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-on-accent transition-colors hover:bg-accent-strong"
          >
            Подробнее
          </button>
        </div>
      </div>
    </article>
  )
}
