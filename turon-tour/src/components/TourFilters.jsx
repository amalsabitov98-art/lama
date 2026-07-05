export default function TourFilters({
  destination,
  month,
  onDestinationChange,
  onMonthChange,
  destinationOptions,
  monthOptions,
  allValue,
  resultsCount,
  onReset,
}) {
  const hasActiveFilter = destination !== allValue || month !== allValue

  return (
    <div className="mb-8 flex flex-col gap-4 rounded-xl border border-stone-200 bg-white p-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <label className="sm:w-48">
          <span className="mb-1 block text-sm font-medium text-stone-700">Направление</span>
          <select
            value={destination}
            onChange={(e) => onDestinationChange(e.target.value)}
            className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          >
            <option value={allValue}>Все направления</option>
            {destinationOptions.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>

        <label className="sm:w-48">
          <span className="mb-1 block text-sm font-medium text-stone-700">Месяц</span>
          <select
            value={month}
            onChange={(e) => onMonthChange(e.target.value)}
            className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm capitalize focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          >
            <option value={allValue}>Любой месяц</option>
            {monthOptions.map((m) => (
              <option key={m} value={m} className="capitalize">
                {m}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex items-center gap-4 text-sm text-stone-600">
        <span>
          Найдено: <span className="font-semibold text-ink">{resultsCount}</span>
        </span>
        {hasActiveFilter && (
          <button
            type="button"
            onClick={onReset}
            className="text-brand-dark underline underline-offset-2 hover:text-brand"
          >
            Сбросить
          </button>
        )}
      </div>
    </div>
  )
}
