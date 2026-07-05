// Превью-переключатель дизайн-направлений (временный инструмент для выбора).
// Без localStorage — просто React-состояние на уровне App.
// Когда направление утвердим, этот компонент и состояние темы можно удалить.
const THEMES = [
  { id: 'theme-sunset', label: 'A · Тёплый закат', swatch: '#D97706' },
  { id: 'theme-teal', label: 'B · Премиум-бирюза', swatch: '#0F766E' },
  { id: 'theme-silk', label: 'C · Шёлковый путь', swatch: '#1E40AF' },
]

export default function ThemeSwitcher({ theme, onChange }) {
  return (
    <div className="fixed bottom-4 right-4 z-[60] rounded-xl border border-black/10 bg-white/95 p-2 shadow-lg backdrop-blur">
      <div className="px-2 pb-1.5 pt-0.5 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
        Превью темы
      </div>
      <div className="flex flex-col gap-1">
        {THEMES.map((t) => {
          const active = t.id === theme
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              aria-pressed={active}
              className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors ${
                active ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span
                className="h-3.5 w-3.5 shrink-0 rounded-full ring-1 ring-black/10"
                style={{ backgroundColor: t.swatch }}
              />
              {t.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
