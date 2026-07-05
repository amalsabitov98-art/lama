// Отзывы-заглушки. Реальные добавим позже (структуру оставляем той же).
const REVIEWS = [
  {
    id: 1,
    имя: 'Имя Фамилия',
    направление: 'Дубай, ОАЭ',
    текст:
      'Всё прошло отлично: трансферы вовремя, отель как на фото, гид помогал на каждом шагу. (Текст-заглушка.)',
  },
  {
    id: 2,
    имя: 'Имя Фамилия',
    направление: 'Стамбул, Турция',
    текст:
      'Организация на высоте, программа насыщенная, но без спешки. Обязательно поедем снова. (Текст-заглушка.)',
  },
  {
    id: 3,
    имя: 'Имя Фамилия',
    направление: 'Тбилиси, Грузия',
    текст:
      'Спасибо за подбор тура под наши даты. Всё честно по цене, никаких скрытых доплат. (Текст-заглушка.)',
  },
  {
    id: 4,
    имя: 'Имя Фамилия',
    направление: 'Шарм-эль-Шейх, Египет',
    текст:
      'Отдыхали семьёй, детям понравилось. Менеджер был на связи всю поездку. (Текст-заглушка.)',
  },
]

function Avatar({ имя }) {
  const initials = имя
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-sm font-semibold text-accent-strong">
      {initials}
    </div>
  )
}

export default function Reviews() {
  return (
    <section id="reviews" className="bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <h2 className="font-heading text-3xl font-bold text-ink sm:text-4xl">Отзывы</h2>
        <p className="mt-2 text-muted">Что говорят туристы, которые уже съездили с нами.</p>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {REVIEWS.map((r) => (
            <figure
              key={r.id}
              className="flex flex-col rounded-xl border border-line bg-ground p-5"
            >
              <blockquote className="flex-1 text-sm text-muted">«{r.текст}»</blockquote>
              <figcaption className="mt-4 flex items-center gap-3 border-t border-dashed border-line pt-4">
                <Avatar имя={r.имя} />
                <div>
                  <div className="text-sm font-semibold text-ink">{r.имя}</div>
                  <div className="text-xs text-muted">{r.направление}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
