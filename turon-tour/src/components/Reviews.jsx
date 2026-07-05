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
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-600">
      {initials}
    </div>
  )
}

export default function Reviews() {
  return (
    <section id="reviews" className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <h2 className="text-2xl font-bold sm:text-3xl">Отзывы</h2>
        <p className="mt-2 text-gray-600">Что говорят туристы, которые уже съездили с нами.</p>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {REVIEWS.map((r) => (
            <figure
              key={r.id}
              className="flex flex-col rounded-lg border border-gray-200 bg-white p-5"
            >
              <blockquote className="flex-1 text-sm text-gray-700">«{r.текст}»</blockquote>
              <figcaption className="mt-4 flex items-center gap-3 border-t border-gray-100 pt-4">
                <Avatar имя={r.имя} />
                <div>
                  <div className="text-sm font-semibold text-gray-900">{r.имя}</div>
                  <div className="text-xs text-gray-500">{r.направление}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
