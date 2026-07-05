import { CONTACTS } from '../lib/contacts.js'

// Цифры-плейсхолдеры. Заменим на реальные на этапе наполнения.
const STATS = [
  { value: '__ лет', label: 'на рынке' },
  { value: '____+', label: 'довольных туристов' },
  { value: '__', label: 'направлений' },
  { value: '4.9', label: 'средняя оценка' },
]

export default function About() {
  return (
    <section id="about" className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">О нас</h2>
            <p className="mt-4 text-gray-600">
              {CONTACTS.companyName} — туроператор из Ташкента. Мы собираем готовые пакетные туры:
              подбираем отели, перелёты и экскурсии, проверяем каждую программу и сопровождаем
              туристов на всех этапах. (Текст-заглушка — заменим на реальный.)
            </p>

            <ul className="mt-6 space-y-3 text-sm text-gray-700">
              <li className="flex gap-2">
                <span aria-hidden>•</span> Официальная лицензия {CONTACTS.licenseNumber}
              </li>
              <li className="flex gap-2">
                <span aria-hidden>•</span> Фиксированные даты выезда и прозрачные цены
              </li>
              <li className="flex gap-2">
                <span aria-hidden>•</span> Русскоговорящие гиды и поддержка в поездке
              </li>
            </ul>

            {/* Блок «перезвоним за 15 минут» */}
            <div className="mt-8 rounded-lg border border-gray-200 bg-white p-5">
              <p className="font-semibold text-gray-900">Перезвоним за 15 минут</p>
              <p className="mt-1 text-sm text-gray-600">
                Оставьте заявку в Telegram или позвоните — подберём тур под ваш бюджет и даты.
              </p>
              <a
                href={CONTACTS.phoneHref}
                className="mt-4 inline-block rounded-md bg-gray-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700"
              >
                {CONTACTS.phone}
              </a>
            </div>
          </div>

          {/* Цифры */}
          <div className="grid grid-cols-2 gap-4">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-lg border border-gray-200 bg-white p-6 text-center"
              >
                <div className="text-3xl font-bold text-gray-900">{s.value}</div>
                <div className="mt-1 text-sm text-gray-600">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
