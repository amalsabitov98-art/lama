export default function Hero({
  destination,
  month,
  onDestinationChange,
  onMonthChange,
  destinationOptions,
  monthOptions,
  allValue,
  onSubmit,
}) {
  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    // Тёплый градиент под hero. Место под фоновое фото оставлено (можно положить image поверх градиента).
    <section id="top" className="border-b border-brand/15 bg-hero-warm">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-dark">
            Туроператор в Ташкенте
          </span>
          <h1 className="mt-4 text-4xl font-extrabold leading-[1.1] tracking-tight text-ink sm:text-6xl">
            Готовые туры из Ташкента —{' '}
            <span className="text-brand">без хлопот</span>
          </h1>
          <p className="mt-5 text-lg text-stone-600">
            Проверенные программы, фиксированные даты выезда и сопровождение на каждом этапе.
            Выбирайте направление и бронируйте в пару кликов.
          </p>

          {/* Простой блок подбора: два селекта + кнопка-скролл к сетке */}
          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col gap-3 rounded-xl border border-brand/20 bg-white/90 p-4 shadow-sm backdrop-blur sm:flex-row sm:items-end"
          >
            <label className="flex-1">
              <span className="mb-1 block text-sm font-medium text-stone-700">Направление</span>
              <select
                value={destination}
                onChange={(e) => onDestinationChange(e.target.value)}
                className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              >
                <option value={allValue}>Любое</option>
                {destinationOptions.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex-1">
              <span className="mb-1 block text-sm font-medium text-stone-700">Месяц</span>
              <select
                value={month}
                onChange={(e) => onMonthChange(e.target.value)}
                className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm capitalize focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              >
                <option value={allValue}>Любой</option>
                {monthOptions.map((m) => (
                  <option key={m} value={m} className="capitalize">
                    {m}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="submit"
              className="rounded-lg bg-brand px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark sm:w-auto"
            >
              Показать туры
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
