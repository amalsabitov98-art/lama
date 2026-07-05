import { CONTACTS, telegramContactLink } from '../lib/contacts.js'

export default function Footer() {
  return (
    <footer id="footer" className="border-t border-line bg-surface text-muted">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Бренд + курс валют */}
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-sm font-bold text-on-accent">
                TT
              </span>
              <span className="font-heading text-lg font-extrabold text-ink">
                {CONTACTS.companyName}
              </span>
            </div>
            <p className="mt-4 text-sm">
              Пакетные туры из Ташкента. Подбор, бронирование и сопровождение.
            </p>
            <p className="mt-4 text-sm">
              Курс: 1 USD = {CONTACTS.currencyRate.usdToUzs} сум
              <span className="block text-xs opacity-70">
                обновлено {CONTACTS.currencyRate.updatedAt}
              </span>
            </p>
          </div>

          {/* Контакты */}
          <div>
            <h3 className="text-sm font-semibold text-ink">Контакты</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a href={CONTACTS.phoneHref} className="transition-colors hover:text-accent">
                  {CONTACTS.phone}
                </a>
              </li>
              <li>
                <a
                  href={telegramContactLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-accent"
                >
                  Написать в Telegram
                </a>
              </li>
              <li>{CONTACTS.address}</li>
            </ul>
          </div>

          {/* Режим работы */}
          <div>
            <h3 className="text-sm font-semibold text-ink">Режим работы</h3>
            <p className="mt-4 text-sm">{CONTACTS.workingHours}</p>
          </div>

          {/* Соцсети */}
          <div>
            <h3 className="text-sm font-semibold text-ink">Мы в сети</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a
                  href={CONTACTS.socials.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-accent"
                >
                  Telegram
                </a>
              </li>
              <li>
                <a
                  href={CONTACTS.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-accent"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={CONTACTS.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-accent"
                >
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Нижняя строка: лицензия + копирайт */}
        <div className="mt-10 flex flex-col gap-2 border-t border-line pt-6 text-xs opacity-80 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} {CONTACTS.companyName}. Лицензия {CONTACTS.licenseNumber}
          </span>
          <span>г. Ташкент, Узбекистан</span>
        </div>
      </div>
    </footer>
  )
}
