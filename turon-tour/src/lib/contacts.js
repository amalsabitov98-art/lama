// Единая точка для всех контактов и плейсхолдеров.
// Меняем значения здесь — они подтягиваются по всему сайту.

export const CONTACTS = {
  companyName: 'Turon Tour',
  phone: '+998 (__) ___-__-__', // плейсхолдер
  phoneHref: 'tel:+998000000000', // плейсхолдер
  telegramUsername: 'turontour', // плейсхолдер: username без @
  whatsappNumber: '998000000000', // плейсхолдер: только цифры
  address: 'г. Ташкент, ул. ______, д. __', // плейсхолдер
  workingHours: 'Пн–Сб: 09:00–19:00, Вс: выходной', // плейсхолдер
  licenseNumber: '№ ____-____ от __.__.____', // плейсхолдер номера лицензии
  // Курс валют — плейсхолдер. Позже подтянем из источника (сайт ЦБ / Sheets).
  currencyRate: { usdToUzs: '00 000', updatedAt: '__.__.____' },
  socials: {
    telegram: 'https://t.me/turontour', // плейсхолдер
    instagram: 'https://instagram.com/turontour', // плейсхолдер
    facebook: 'https://facebook.com/turontour', // плейсхолдер
  },
}

// Ссылка в Telegram с автозаполненным текстом брони.
// tour — объект тура из data/tours.js; date — строка даты (по умолчанию ближайшаяДата тура).
export function telegramBookingLink(tour, date) {
  const when = date || tour?.ближайшаяДата || ''
  const text =
    `Здравствуйте! Хочу забронировать тур: ` +
    `${tour?.город}, ${tour?.страна}` +
    (tour?.длительность ? ` (${tour.длительность})` : '') +
    (when ? `. Дата выезда: ${when}` : '') +
    `.`
  return `https://t.me/${CONTACTS.telegramUsername}?text=${encodeURIComponent(text)}`
}

// Ссылка «просто написать» в Telegram (без привязки к туру) — для шапки/футера.
export function telegramContactLink() {
  return `https://t.me/${CONTACTS.telegramUsername}`
}

// Ссылка в WhatsApp с текстом брони (запас на будущее, если понадобится в карточке/модалке).
export function whatsappBookingLink(tour, date) {
  const when = date || tour?.ближайшаяДата || ''
  const text =
    `Здравствуйте! Хочу забронировать тур: ` +
    `${tour?.город}, ${tour?.страна}` +
    (when ? `. Дата выезда: ${when}` : '') +
    `.`
  return `https://wa.me/${CONTACTS.whatsappNumber}?text=${encodeURIComponent(text)}`
}
