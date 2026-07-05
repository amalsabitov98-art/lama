import { CONTACTS, telegramContactLink } from '../lib/contacts.js'

const NAV = [
  { label: 'Туры', href: '#tours' },
  { label: 'О нас', href: '#about' },
  { label: 'Отзывы', href: '#reviews' },
  { label: 'Контакты', href: '#footer' },
]

function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark'
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isDark ? 'Светлая тема' : 'Тёмная тема'}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-line-strong text-muted transition-colors hover:border-accent hover:text-accent"
    >
      {isDark ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      )}
    </button>
  )
}

export default function Header({ theme, onToggleTheme }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ground/85 backdrop-blur">
      {/* Верхняя служебная строка: курс валют + номер лицензии (плейсхолдеры) */}
      <div className="border-b border-line bg-accent/[0.06] text-xs text-muted">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-1.5">
          <span>
            Курс: 1 USD = {CONTACTS.currencyRate.usdToUzs} сум
            <span className="ml-1 opacity-70">(обновлено {CONTACTS.currencyRate.updatedAt})</span>
          </span>
          <span>Лицензия {CONTACTS.licenseNumber}</span>
        </div>
      </div>

      {/* Основная строка шапки */}
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        {/* Логотип */}
        <a href="#top" className="flex shrink-0 items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-sm font-bold text-on-accent shadow-sm">
            TT
          </span>
          <span className="font-heading text-lg font-extrabold tracking-tight text-ink">
            {CONTACTS.companyName}
          </span>
        </a>

        {/* Меню (на мобильных скрыто — бургер добавим позже) */}
        <nav className="hidden items-center gap-6 md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted transition-colors hover:text-accent"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Контакты справа */}
        <div className="flex items-center gap-2.5">
          <a
            href={CONTACTS.phoneHref}
            className="hidden text-sm font-semibold text-ink transition-colors hover:text-accent lg:inline"
          >
            {CONTACTS.phone}
          </a>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <a
            href={telegramContactLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-accent px-3.5 py-2 text-sm font-semibold text-on-accent shadow-sm transition-colors hover:bg-accent-strong"
          >
            <span className="hidden sm:inline">Написать в </span>Telegram
          </a>
        </div>
      </div>
    </header>
  )
}
