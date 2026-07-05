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
    <section id="about" className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="font-heading text-3xl font-bold text-ink sm:text-4xl">О нас</h2>
            <p className="mt-4 text-stone-600">
              {CONTACTS.companyName} — туроператор из Ташкента. Мы собираем готовые пакетные туры:
              подбираем отели, перелёты и экскурсии, проверяем каждую программу и сопровождаем
              туристов на всех этапах. (Текст-заглушка — заменим на реальный.)
            </p>

            <ul className="mt-6 space-y-3 text-sm text-stone-700">
              <li className="flex gap-2">
                <span aria-hidden className="text-brand">•</span> Официальная лицензия{' '}
                {CONTACTS.licenseNumber}
              </li>
              <li className="flex gap-2">
                <span aria-hidden className="text-brand">•</span> Фиксированные даты выезда и
                прозрачные цены
              </li>
              <li className="flex gap-2">
                <span aria-hidden className="text-brand">•</span> Русскоговорящие гиды и поддержка в
                поездке
              </li>
            </ul>

            {/* Блок «перезвоним за 15 минут» */}
            <div className="mt-8 rounded-xl border border-brand/20 bg-sand p-5">
              <p className="font-heading font-bold text-ink">Перезвоним за 15 минут</p>
              <p className="mt-1 text-sm text-stone-600">
                Оставьте заявку в Telegram или позвоните — подберём тур под ваш бюджет и даты.
              </p>
              <a
                href={CONTACTS.phoneHref}
                className="mt-4 inline-block rounded-lg bg-brand px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark"
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
                className="rounded-xl border border-stone-200 bg-sand p-6 text-center"
              >
                <div className="font-heading text-3xl font-bold text-brand-dark">{s.value}</div>
                <div className="mt-1 text-sm text-stone-600">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
