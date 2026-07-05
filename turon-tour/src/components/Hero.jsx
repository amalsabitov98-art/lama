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
    // Место под фоновое фото/градиент оставлено — сейчас нейтральный светлый блок.
    <section id="top" className="border-b border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
            Готовые туры из Ташкента — без хлопот
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Проверенные программы, фиксированные даты выезда и сопровождение на каждом этапе.
            Выбирайте направление и бронируйте в пару кликов.
          </p>

          {/* Простой блок подбора: два селекта + кнопка-скролл к сетке */}
          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end"
          >
            <label className="flex-1">
              <span className="mb-1 block text-sm font-medium text-gray-700">Направление</span>
              <select
                value={destination}
                onChange={(e) => onDestinationChange(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
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
              <span className="mb-1 block text-sm font-medium text-gray-700">Месяц</span>
              <select
                value={month}
                onChange={(e) => onMonthChange(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm capitalize focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
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
              className="rounded-md bg-gray-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 sm:w-auto"
            >
              Показать туры
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
