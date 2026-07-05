import { CONTACTS, telegramContactLink } from '../lib/contacts.js'

const NAV = [
  { label: 'Туры', href: '#tours' },
  { label: 'О нас', href: '#about' },
  { label: 'Отзывы', href: '#reviews' },
  { label: 'Контакты', href: '#footer' },
]

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-brand/15 bg-sand/90 backdrop-blur">
      {/* Верхняя служебная строка: курс валют + номер лицензии (плейсхолдеры) */}
      <div className="border-b border-brand/10 bg-brand/5 text-xs text-stone-600">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-1.5">
          <span>
            Курс: 1 USD = {CONTACTS.currencyRate.usdToUzs} сум
            <span className="ml-1 text-stone-500">(обновлено {CONTACTS.currencyRate.updatedAt})</span>
          </span>
          <span>Лицензия {CONTACTS.licenseNumber}</span>
        </div>
      </div>

      {/* Основная строка шапки */}
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        {/* Логотип */}
        <a href="#top" className="flex items-center gap-2 shrink-0">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-sm font-bold text-white shadow-sm">
            TT
          </span>
          <span className="font-heading text-lg font-bold tracking-tight text-ink">
            {CONTACTS.companyName}
          </span>
        </a>

        {/* Меню (скрыто на мобильных — упростим/добавим бургер на этапе дизайна) */}
        <nav className="hidden items-center gap-6 md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-stone-600 transition-colors hover:text-brand"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Контакты справа */}
        <div className="flex items-center gap-3">
          <a
            href={CONTACTS.phoneHref}
            className="hidden text-sm font-semibold text-ink hover:text-brand sm:inline"
          >
            {CONTACTS.phone}
          </a>
          <a
            href={telegramContactLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-brand px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark"
          >
            Написать в Telegram
          </a>
        </div>
      </div>
    </header>
  )
}
