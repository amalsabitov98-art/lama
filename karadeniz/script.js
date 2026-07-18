/* ============================================================
   Karadeniz — конфиг (замените на свои контакты и цену)
   ============================================================ */
const CONFIG = {
  phone: '998901234567',          // WhatsApp/Telegram номер без + и пробелов
  telegram: 'karadeniz_travel',   // username в Telegram без @
  email: 'hello@karadeniz.travel',
  price: '690'                    // цена «от $…» за человека
};

/* ============================================================
   Переводы RU / UZ / EN
   ============================================================ */
const I18N = {
  ru: {
    'nav.route':'Маршрут','nav.price':'Цена','nav.dates':'Даты','nav.reviews':'Отзывы','nav.faq':'FAQ','nav.book':'Забронировать <b>↗</b>',
    'word.day':'ДЕНЬ','stamp':'ТУРЦИЯ<br>×<br>ГРУЗИЯ','date.d1':'12 — 19 <b>мая</b>','date.d2':'02 — 09 <b>июня</b>','date.d3':'07 — 14 <b>июля</b>','date.d4':'01 — 08 <b>сент.</b>',
    'hero.tag':'BLACK SEA ESCAPE / 2027','hero.h1':'Загадочный<br><i>Karadeniz</i>','hero.lead':'8 дней по маршруту Ризе, Узунгёль, Айдер и Батуми.','hero.scroll':'Листайте, чтобы начать <span>↓</span>',
    'stmt.tag':'ТАМ, ГДЕ ГОРЫ ВСТРЕЧАЮТ МОРЕ','stmt.h2':'Один берег.<br>Два <i>мира.</i><br>Восемь дней.','stmt.text':'Мы собрали оба маршрута в одно выразительное путешествие: с мягким ритмом первых дней, природными открытиями, свободным временем и финальным возвращением домой.',
    'route.tag':'МАРШРУТ','route.h2':'Один берег,<br>четыре точки <i>притяжения.</i>','route.sub':'Черноморская дуга из Турции в Грузию — через горы, чайные яйлы, озёра и вечерний город у моря.','route.p1':'Чай, яйлы, горы','route.p2':'Озеро в облаках','route.p3':'Высокогорье 1350 м','route.p4':'Море и огни',
    'days.tag':'08 DAYS / 07 NIGHTS','days.h2':'Ваш маршрут<br>по <i>дням.</i>','days.sub':'Каждая карточка — отдельная глава путешествия. Только места, где хочется задержаться.',
    'd1.h':'Прилететь<br>к морю.','d1.p':'Ташкент → Батуми или Трабзон. Встреча в аэропорту, трансфер, заселение и первый спокойный вечер на черноморской набережной.','d1.t1':'Трансфер в отель','d1.t2':'Вечерняя прогулка','d1.t3':'Первый ужин у моря',
    'd2.h':'Водопад.<br>Крепость.<br><i>Горы.</i>','d2.p':'Батуми раскрывается за пределами города: мост царицы Тамары, водопад Махунцети и древняя крепость Гонио-Апсарос.','d2.t1':'Махунцети','d2.t2':'Мост царицы Тамары','d2.t3':'Грузинский ужин',
    'd3.h':'Туда, где<br>растёт <i>чай.</i>','d3.p':'Дорога в Айдер Яйласы — через чайные плантации, густые леса и горные реки. По пути: Зилкале и мощный водопад Паловит.','d3.t1':'Крепость Zilkale','d3.t2':'Водопад Palovit','d3.t3':'Айдер / 1350 м',
    'd4.h':'Оставить день<br><i>себе.</i>','d4.p':'Свободный день в Ризе или Батуми. Набережные, рынки, ботанический сад, чайные сады, маленькие кафе — без тайминга и спешки.','d4.t1':'Прогулка у моря','d4.t2':'Шопинг и кофе','d4.t3':'Доп. экскурсии',
    'd5.h':'Один берег.<br>Две <i>страны.</i>','d5.p':'Переезд вдоль Чёрного моря. Красивые перевалы, остановки для фото, паспортный контроль — и новая глава на другом берегу.','d5.t1':'Побережье Karadeniz','d5.t2':'Переход границы','d5.t3':'Вечер в новом городе',
    'd6.h':'Озеро между<br><i>облаками.</i>','d6.p':'Выезд в Узунгёль — живописное горное озеро. Пещеры Карача, Torul Cam Teras и виды, которые не помещаются в кадр.','d6.t1':'Узунгёль','d6.t2':'Пещеры Karaca','d6.t3':'Стеклянная терраса',
    'd7.h':'Город, который<br>умеет <i>светиться.</i>','d7.p':'Время Батуми: старый город, морская набережная, танцующие фонтаны, площади и вечер, который можно прожить по своему сценарию.','d7.t1':'Старый Батуми','d7.t2':'Набережная','d7.t3':'Местная кухня',
    'd8.h':'Увезти<br>с собой <i>море.</i>','d8.p':'Завтрак, последние прогулки и трансфер в аэропорт. Возвращение в Ташкент — с фотоальбомом, новыми вкусами и ощущением пройденного пути.','d8.t1':'Свободное время','d8.t2':'Трансфер в аэропорт','d8.t3':'Трабзон / Батуми → Ташкент',
    'price.tag':'ЦЕНА','price.h2':'Всё включено —<br>кроме <i>сюрпризов.</i>','price.from':'Стоимость тура','price.cur':'$','price.per':'за человека · 8 дней / 7 ночей','price.note':'Пример — укажите вашу цену в script.js (CONFIG.price).','price.cta':'Забронировать место <b>↗</b>',
    'incl.yes':'Включено','incl.y1':'Проживание 7 ночей (отели 3–4★)','incl.y2':'Все трансферы и переезды','incl.y3':'Русскоговорящий гид','incl.y4':'Завтраки, часть ужинов','incl.y5':'Экскурсии по программе',
    'incl.no':'Не включено','incl.n1':'Авиабилеты Ташкент ↔ регион','incl.n2':'Личные расходы и сувениры','incl.n3':'Доп. экскурсии свободного дня','incl.n4':'Страховка (можем оформить)',
    'dates.tag':'ДАТЫ ВЫЕЗДОВ','dates.h2':'Ближайшие <i>группы.</i>','dates.sub':'Даты — пример. Обновите список выездов под ваш сезон.','dates.spots':'Есть места','dates.few':'Осталось 4',
    'rev.tag':'ОТЗЫВЫ · ПРИМЕР — ЗАМЕНИТЕ НА РЕАЛЬНЫЕ','rev.h2':'Что говорят<br>после <i>поездки.</i>','rev.q1':'«Горы Ризе и вечерний Батуми в одном туре — идеально. Всё чётко по времени, гид супер.»','rev.n1':'Пример: Имя, город','rev.q2':'«Свободный день — лучшее решение. Не устали, успели и отдохнуть, и посмотреть.»','rev.n2':'Пример: Имя, город','rev.q3':'«Узунгёль — сказка. Фотографии не передают. Спасибо за организацию!»','rev.n3':'Пример: Имя, город',
    'about.tag':'О НАС','about.h2':'Возим по Черноморью<br>с <i>любовью к деталям.</i>','about.text':'Небольшая команда, которая знает регион не по путеводителям. Продуманная логистика, проверенные отели, гид рядом на всём маршруте. Текст — пример, замените на рассказ о себе.','about.s1':'лет на маршруте','about.s2':'довольных туристов','about.s3':'средняя оценка',
    'faq.tag':'ВОПРОСЫ','faq.h2':'Коротко о <i>важном.</i>',
    'faq.q1':'Нужна ли виза?','faq.a1':'Для граждан Узбекистана Турция и Грузия — безвизовый въезд на срок поездки. Нужен действующий загранпаспорт.',
    'faq.q2':'Что взять с собой?','faq.a2':'Удобную обувь, ветровку (в горах прохладно), купальник, зарядки и хорошее настроение. Полный список пришлём после брони.',
    'faq.q3':'Какой размер группы?','faq.a3':'Обычно 8–16 человек. Небольшие группы — больше внимания и гибкости в маршруте.',
    'faq.q4':'На каком языке гид?','faq.a4':'Русскоговорящий гид на всём маршруте. По запросу — узбекский или английский.',
    'faq.q5':'Можно с детьми?','faq.a5':'Да, маршрут подходит для семей. Для детей — специальные условия, уточняйте при бронировании.',
    'faq.q6':'Как оплатить и вернуть?','faq.a6':'Бронь по предоплате, остаток — до выезда. Условия возврата обсуждаем индивидуально. Напишите нам — всё расскажем.',
    'book.tag':'KARADENIZ / ЗАЯВКА','book.h2':'Ваше путешествие<br>начинается <i>здесь.</i>','book.m1':'8 ДНЕЙ','book.m2':'7 НОЧЕЙ','book.m3':'ТУРЦИЯ × ГРУЗИЯ',
    'form.name':'Ваше имя','form.phone':'Телефон +998 __ ___ __ __','form.date':'Дата выезда (выберите выше)','form.people':'Человек','form.msg':'Комментарий (необязательно)','form.submit':'Отправить заявку <b>↗</b>','form.wa':'WhatsApp','form.tg':'Telegram','form.hint':'Заявка откроет готовое сообщение в мессенджере — ничего не потеряется.',
    'sticky.book':'Забронировать',
    'msg.greeting':'Здравствуйте! Хочу узнать про тур «Karadeniz» (Ризе + Батуми).',
    'msg.lead':'Заявка на тур «Karadeniz»'
  },
  uz: {
    'nav.route':'Marshrut','nav.price':'Narx','nav.dates':'Sanalar','nav.reviews':'Sharhlar','nav.faq':'Savollar','nav.book':'Band qilish <b>↗</b>',
    'word.day':'KUN','stamp':'TURKIYA<br>×<br>GRUZIYA','date.d1':'12 — 19 <b>may</b>','date.d2':'02 — 09 <b>iyun</b>','date.d3':'07 — 14 <b>iyul</b>','date.d4':'01 — 08 <b>sent.</b>',
    'hero.tag':'BLACK SEA ESCAPE / 2027','hero.h1':'Sirli<br><i>Karadeniz</i>','hero.lead':'Rize, Uzungöl, Ayder va Batumi bo‘ylab 8 kun.','hero.scroll':'Boshlash uchun pastga suring <span>↓</span>',
    'stmt.tag':'TOG‘LAR DENGIZ BILAN UCHRASHGAN JOY','stmt.h2':'Bitta qirg‘oq.<br>Ikki <i>olam.</i><br>Sakkiz kun.','stmt.text':'Ikkala marshrutni bitta yorqin sayohatga jamladik: dastlabki kunlarning bosiq ritmi, tabiat kashfiyotlari, erkin vaqt va uyga qaytish.',
    'route.tag':'MARSHRUT','route.h2':'Bitta qirg‘oq,<br>to‘rt <i>joziba nuqtasi.</i>','route.sub':'Turkiyadan Gruziyaga Qora dengiz yoyi — tog‘lar, choy yaylovlari, ko‘llar va dengiz bo‘yidagi kechki shahar orqali.','route.p1':'Choy, yaylov, tog‘','route.p2':'Bulutlar orasidagi ko‘l','route.p3':'Baland tog‘ 1350 m','route.p4':'Dengiz va chiroqlar',
    'days.tag':'08 KUN / 07 KECHA','days.h2':'Marshrutingiz<br><i>kun</i> bo‘yicha.','days.sub':'Har bir karta — sayohatning alohida bobi. Faqat to‘xtagingiz keladigan joylar.',
    'd1.h':'Dengizga<br>uchib kelish.','d1.p':'Toshkent → Batumi yoki Trabzon. Aeroportda kutib olish, transfer, joylashish va dengiz bo‘yida birinchi tinch oqshom.','d1.t1':'Mehmonxonaga transfer','d1.t2':'Kechki sayr','d1.t3':'Dengiz bo‘yida kechki ovqat',
    'd2.h':'Sharshara.<br>Qal’a.<br><i>Tog‘lar.</i>','d2.p':'Batumi shahar tashqarisida ochiladi: Tamara malika ko‘prigi, Maxuntseti sharsharasi va qadimiy Gonio qal’asi.','d2.t1':'Maxuntseti','d2.t2':'Tamara malika ko‘prigi','d2.t3':'Gruzin taomlari',
    'd3.h':'Choy o‘sadigan<br><i>joyga.</i>','d3.p':'Ayder yaylovi sari yo‘l — choy plantatsiyalari, qalin o‘rmonlar va tog‘ daryolari orqali. Yo‘lda: Zilkale va kuchli Palovit sharsharasi.','d3.t1':'Zilkale qal’asi','d3.t2':'Palovit sharsharasi','d3.t3':'Ayder / 1350 m',
    'd4.h':'Bir kunni<br>o‘zingizga <i>qoldiring.</i>','d4.p':'Rize yoki Batumida erkin kun. Sohillar, bozorlar, botanika bog‘i, choyxonalar va kichik kafelar — shoshilmasdan.','d4.t1':'Dengiz bo‘yida sayr','d4.t2':'Xarid va kofe','d4.t3':'Qo‘shimcha ekskursiyalar',
    'd5.h':'Bitta qirg‘oq.<br>Ikki <i>davlat.</i>','d5.p':'Qora dengiz bo‘ylab ko‘chish. Chiroyli dovonlar, foto to‘xtashlar, chegara nazorati — va boshqa qirg‘oqda yangi bob.','d5.t1':'Karadeniz sohili','d5.t2':'Chegaradan o‘tish','d5.t3':'Yangi shaharda oqshom',
    'd6.h':'Bulutlar orasidagi<br><i>ko‘l.</i>','d6.p':'Uzungöl sari — go‘zal tog‘ ko‘li. Karaca g‘orlari, Torul Cam Teras va kadrga sig‘maydigan manzaralar.','d6.t1':'Uzungöl','d6.t2':'Karaca g‘orlari','d6.t3':'Shisha teras',
    'd7.h':'Nur socha oladigan<br><i>shahar.</i>','d7.p':'Batumi vaqti: eski shahar, dengiz sohili, raqsga tushuvchi favvoralar, maydonlar va o‘z stsenariyingiz bo‘yicha oqshom.','d7.t1':'Eski Batumi','d7.t2':'Sohil bo‘yi','d7.t3':'Mahalliy taomlar',
    'd8.h':'Dengizni<br>o‘zingiz bilan <i>olib keting.</i>','d8.p':'Nonushta, so‘nggi sayrlar va aeroportga transfer. Toshkentga qaytish — fotoalbom, yangi ta’mlar va bosib o‘tilgan yo‘l hissi bilan.','d8.t1':'Erkin vaqt','d8.t2':'Aeroportga transfer','d8.t3':'Trabzon / Batumi → Toshkent',
    'price.tag':'NARX','price.h2':'Hammasi ichida —<br><i>syurprizlardan</i> tashqari.','price.from':'Tur narxi','price.cur':'$','price.per':'kishi uchun · 8 kun / 7 kecha','price.note':'Namuna — narxni script.js da ko‘rsating (CONFIG.price).','price.cta':'Joy band qilish <b>↗</b>',
    'incl.yes':'Ichida','incl.y1':'7 kecha yashash (3–4★ mehmonxona)','incl.y2':'Barcha transfer va ko‘chishlar','incl.y3':'Rus tilida gid','incl.y4':'Nonushtalar, ba’zi kechki ovqatlar','incl.y5':'Dastur bo‘yicha ekskursiyalar',
    'incl.no':'Ichida emas','incl.n1':'Toshkent ↔ mintaqa aviachiptalari','incl.n2':'Shaxsiy xarajatlar va sovg‘alar','incl.n3':'Erkin kun qo‘shimcha ekskursiyalari','incl.n4':'Sug‘urta (rasmiylashtira olamiz)',
    'dates.tag':'CHIQISH SANALARI','dates.h2':'Yaqin <i>guruhlar.</i>','dates.sub':'Sanalar — namuna. Ro‘yxatni o‘z mavsumingizga moslang.','dates.spots':'Joylar bor','dates.few':'4 ta qoldi',
    'rev.tag':'SHARHLAR · NAMUNA — HAQIQIYSIGA ALMASHTIRING','rev.h2':'Sayohatdan<br>keyin <i>nima deyishadi.</i>','rev.q1':'«Rize tog‘lari va kechki Batumi bitta turda — ideal. Hammasi o‘z vaqtida, gid zo‘r.»','rev.n1':'Namuna: Ism, shahar','rev.q2':'«Erkin kun — eng yaxshi qaror. Charchamadik, ham dam oldik, ham ko‘rdik.»','rev.n2':'Namuna: Ism, shahar','rev.q3':'«Uzungöl — ertak. Suratlar yetkaza olmaydi. Tashkilot uchun rahmat!»','rev.n3':'Namuna: Ism, shahar',
    'about.tag':'BIZ HAQIMIZDA','about.h2':'Qora dengiz bo‘ylab<br><i>mehr bilan</i> olib boramiz.','about.text':'Mintaqani yo‘riqnomalardan emas, o‘z tajribasidan biladigan kichik jamoa. Puxta logistika, ishonchli mehmonxonalar, butun marshrutda yoningizda gid. Matn — namuna, o‘zingiz haqingizda yozing.','about.s1':'yillik tajriba','about.s2':'mamnun sayohatchi','about.s3':'o‘rtacha baho',
    'faq.tag':'SAVOLLAR','faq.h2':'Muhim narsalar <i>qisqacha.</i>',
    'faq.q1':'Viza kerakmi?','faq.a1':'O‘zbekiston fuqarolari uchun Turkiya va Gruziya — sayohat muddatiga vizasiz. Amaldagi xorijiy pasport kerak.',
    'faq.q2':'O‘zim bilan nima olay?','faq.a2':'Qulay poyabzal, shamol kurtka (tog‘da salqin), cho‘milish kiyimi, zaryadlagichlar va yaxshi kayfiyat. To‘liq ro‘yxatni bandlikdan so‘ng yuboramiz.',
    'faq.q3':'Guruh hajmi qanday?','faq.a3':'Odatda 8–16 kishi. Kichik guruhlar — ko‘proq e’tibor va marshrutda moslashuvchanlik.',
    'faq.q4':'Gid qaysi tilda?','faq.a4':'Butun marshrutda rus tilida gid. So‘rov bo‘yicha — o‘zbek yoki ingliz tilida.',
    'faq.q5':'Bolalar bilan bo‘ladimi?','faq.a5':'Ha, marshrut oilalar uchun mos. Bolalarga maxsus shartlar — bandlik vaqtida aniqlashtiring.',
    'faq.q6':'Qanday to‘lash va qaytarish?','faq.a6':'Oldindan to‘lov bilan bandlik, qolgani — chiqishdan oldin. Qaytarish shartlarini alohida muhokama qilamiz. Bizga yozing.',
    'book.tag':'KARADENIZ / ARIZA','book.h2':'Sayohatingiz<br>shu yerda <i>boshlanadi.</i>','book.m1':'8 KUN','book.m2':'7 KECHA','book.m3':'TURKIYA × GRUZIYA',
    'form.name':'Ismingiz','form.phone':'Telefon +998 __ ___ __ __','form.date':'Chiqish sanasi (yuqoridan tanlang)','form.people':'Kishi','form.msg':'Izoh (ixtiyoriy)','form.submit':'Ariza yuborish <b>↗</b>','form.wa':'WhatsApp','form.tg':'Telegram','form.hint':'Ariza messenjerda tayyor xabarni ochadi — hech narsa yo‘qolmaydi.',
    'sticky.book':'Band qilish',
    'msg.greeting':'Assalomu alaykum! «Karadeniz» turi (Rize + Batumi) haqida bilmoqchiman.',
    'msg.lead':'«Karadeniz» turiga ariza'
  },
  en: {
    'nav.route':'Route','nav.price':'Price','nav.dates':'Dates','nav.reviews':'Reviews','nav.faq':'FAQ','nav.book':'Book now <b>↗</b>',
    'word.day':'DAY','stamp':'TÜRKİYE<br>×<br>GEORGIA','date.d1':'12 — 19 <b>May</b>','date.d2':'02 — 09 <b>June</b>','date.d3':'07 — 14 <b>July</b>','date.d4':'01 — 08 <b>Sept.</b>',
    'hero.tag':'BLACK SEA ESCAPE / 2027','hero.h1':'Mysterious<br><i>Karadeniz</i>','hero.lead':'8 days across Rize, Uzungöl, Ayder and Batumi.','hero.scroll':'Scroll to begin <span>↓</span>',
    'stmt.tag':'WHERE THE MOUNTAINS MEET THE SEA','stmt.h2':'One coast.<br>Two <i>worlds.</i><br>Eight days.','stmt.text':'We merged both routes into one expressive journey: a gentle rhythm in the first days, nature discoveries, free time and a final return home.',
    'route.tag':'ROUTE','route.h2':'One coast,<br>four points of <i>attraction.</i>','route.sub':'A Black Sea arc from Türkiye to Georgia — through mountains, tea highlands, lakes and an evening city by the sea.','route.p1':'Tea, highlands, peaks','route.p2':'Lake in the clouds','route.p3':'Highland 1350 m','route.p4':'Sea and lights',
    'days.tag':'08 DAYS / 07 NIGHTS','days.h2':'Your route,<br>day by <i>day.</i>','days.sub':'Each card is a separate chapter. Only the places worth lingering in.',
    'd1.h':'Fly in<br>to the sea.','d1.p':'Tashkent → Batumi or Trabzon. Airport pickup, transfer, check-in and a first quiet evening on the Black Sea promenade.','d1.t1':'Hotel transfer','d1.t2':'Evening walk','d1.t3':'First dinner by the sea',
    'd2.h':'Waterfall.<br>Fortress.<br><i>Mountains.</i>','d2.p':'Batumi unfolds beyond the city: Queen Tamar bridge, Makhuntseti waterfall and the ancient Gonio fortress.','d2.t1':'Makhuntseti','d2.t2':'Queen Tamar bridge','d2.t3':'Georgian dinner',
    'd3.h':'To where<br>the <i>tea</i> grows.','d3.p':'The road to Ayder Yaylası — through tea plantations, dense forests and mountain rivers. Along the way: Zilkale and the mighty Palovit waterfall.','d3.t1':'Zilkale fortress','d3.t2':'Palovit waterfall','d3.t3':'Ayder / 1350 m',
    'd4.h':'A day<br>for <i>yourself.</i>','d4.p':'A free day in Rize or Batumi. Promenades, markets, botanical garden, tea gardens, small cafés — no timing, no rush.','d4.t1':'Walk by the sea','d4.t2':'Shopping & coffee','d4.t3':'Optional tours',
    'd5.h':'One coast.<br>Two <i>countries.</i>','d5.p':'A drive along the Black Sea. Scenic passes, photo stops, border control — and a new chapter on the other shore.','d5.t1':'Karadeniz coast','d5.t2':'Border crossing','d5.t3':'Evening in a new city',
    'd6.h':'A lake among<br>the <i>clouds.</i>','d6.p':'A trip to Uzungöl — a scenic mountain lake. Karaca caves, Torul Cam Teras and views that won’t fit the frame.','d6.t1':'Uzungöl','d6.t2':'Karaca caves','d6.t3':'Glass terrace',
    'd7.h':'A city that<br>knows how to <i>glow.</i>','d7.p':'Batumi time: the old town, seaside promenade, dancing fountains, squares and an evening to live by your own script.','d7.t1':'Old Batumi','d7.t2':'Promenade','d7.t3':'Local cuisine',
    'd8.h':'Take the<br>sea <i>with you.</i>','d8.p':'Breakfast, last walks and a transfer to the airport. Back to Tashkent — with a full photo album, new tastes and the feeling of a path travelled.','d8.t1':'Free time','d8.t2':'Airport transfer','d8.t3':'Trabzon / Batumi → Tashkent',
    'price.tag':'PRICE','price.h2':'All included —<br>except the <i>surprises.</i>','price.from':'Tour price','price.cur':'$','price.per':'per person · 8 days / 7 nights','price.note':'Example — set your price in script.js (CONFIG.price).','price.cta':'Reserve a spot <b>↗</b>',
    'incl.yes':'Included','incl.y1':'7 nights’ stay (3–4★ hotels)','incl.y2':'All transfers and drives','incl.y3':'Russian-speaking guide','incl.y4':'Breakfasts, some dinners','incl.y5':'Tours per program',
    'incl.no':'Not included','incl.n1':'Flights Tashkent ↔ region','incl.n2':'Personal expenses & souvenirs','incl.n3':'Free-day optional tours','incl.n4':'Insurance (we can arrange)',
    'dates.tag':'DEPARTURE DATES','dates.h2':'Upcoming <i>groups.</i>','dates.sub':'Dates are an example. Update the list for your season.','dates.spots':'Spots available','dates.few':'4 left',
    'rev.tag':'REVIEWS · SAMPLE — REPLACE WITH REAL ONES','rev.h2':'What people say<br>after the <i>trip.</i>','rev.q1':'“Rize mountains and evening Batumi in one tour — perfect. Everything on time, the guide was great.”','rev.n1':'Sample: Name, city','rev.q2':'“The free day was the best call. Not tired, we both rested and explored.”','rev.n2':'Sample: Name, city','rev.q3':'“Uzungöl is a fairy tale. Photos don’t do it justice. Thank you for the organization!”','rev.n3':'Sample: Name, city',
    'about.tag':'ABOUT US','about.h2':'We travel the Black Sea<br>with <i>an eye for detail.</i>','about.text':'A small team that knows the region firsthand, not from guidebooks. Thoughtful logistics, trusted hotels, a guide beside you the whole way. This text is an example — tell your own story.','about.s1':'years on the route','about.s2':'happy travellers','about.s3':'average rating',
    'faq.tag':'QUESTIONS','faq.h2':'The essentials, <i>briefly.</i>',
    'faq.q1':'Do I need a visa?','faq.a1':'For citizens of Uzbekistan, Türkiye and Georgia are visa-free for the trip. A valid passport is required.',
    'faq.q2':'What should I bring?','faq.a2':'Comfortable shoes, a windbreaker (it’s cool in the mountains), swimwear, chargers and good spirits. We’ll send a full list after booking.',
    'faq.q3':'What’s the group size?','faq.a3':'Usually 8–16 people. Small groups mean more attention and flexibility on the route.',
    'faq.q4':'What language is the guide?','faq.a4':'A Russian-speaking guide for the whole route. On request — Uzbek or English.',
    'faq.q5':'Can I come with kids?','faq.a5':'Yes, the route suits families. Special terms for children — please ask when booking.',
    'faq.q6':'How to pay and refund?','faq.a6':'Booking by prepayment, the rest before departure. Refund terms are discussed individually. Message us — we’ll explain everything.',
    'book.tag':'KARADENIZ / REQUEST','book.h2':'Your journey<br>begins <i>here.</i>','book.m1':'8 DAYS','book.m2':'7 NIGHTS','book.m3':'TÜRKİYE × GEORGIA',
    'form.name':'Your name','form.phone':'Phone +998 __ ___ __ __','form.date':'Departure date (pick above)','form.people':'People','form.msg':'Comment (optional)','form.submit':'Send request <b>↗</b>','form.wa':'WhatsApp','form.tg':'Telegram','form.hint':'Your request opens a ready message in the messenger — nothing gets lost.',
    'sticky.book':'Book now',
    'msg.greeting':'Hello! I’d like to know about the “Karadeniz” tour (Rize + Batumi).',
    'msg.lead':'Request for the “Karadeniz” tour'
  }
};

/* ============================================================
   i18n применение
   ============================================================ */
let LANG = 'ru';
function applyLang(lang) {
  LANG = I18N[lang] ? lang : 'ru';
  const dict = I18N[LANG];
  document.documentElement.lang = LANG;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const v = dict[el.getAttribute('data-i18n')];
    if (v != null) el.innerHTML = v;
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const v = dict[el.getAttribute('data-i18n-ph')];
    if (v != null) el.setAttribute('placeholder', v);
  });
  document.querySelectorAll('.lang button').forEach(b =>
    b.classList.toggle('on', b.dataset.lang === LANG));
  document.querySelector('[data-price]').textContent = CONFIG.price;
  buildChatLinks();
}
document.querySelectorAll('.lang button').forEach(b =>
  b.addEventListener('click', () => applyLang(b.dataset.lang)));

/* ============================================================
   Контакты: WhatsApp / Telegram / Email
   ============================================================ */
let SELECTED_DATE = '';
function waLink(text){ return 'https://wa.me/' + CONFIG.phone + '?text=' + encodeURIComponent(text); }
function tgLink(){ return 'https://t.me/' + CONFIG.telegram; }
function buildChatLinks(){
  const greet = I18N[LANG]['msg.greeting'];
  document.querySelectorAll('[data-chat="wa"]').forEach(a => a.href = waLink(greet));
  document.querySelectorAll('[data-chat="tg"]').forEach(a => a.href = tgLink());
  document.querySelectorAll('[data-mail]').forEach(a =>
    a.href = 'mailto:' + CONFIG.email + '?subject=' + encodeURIComponent(I18N[LANG]['msg.lead']));
}

/* Выбор даты */
document.querySelectorAll('.date-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.date-card').forEach(c => c.classList.remove('sel'));
    card.classList.add('sel');
    const dtxt = card.querySelector('.dc-date').textContent.trim().replace(/\s+/g, ' ');
    const yr = card.querySelector('.dc-year').textContent.trim();
    SELECTED_DATE = dtxt + ' ' + yr;
    const dateInput = document.querySelector('.book-form [name="date"]');
    if (dateInput) dateInput.value = SELECTED_DATE;
    document.getElementById('book').scrollIntoView({ behavior: 'smooth' });
  });
});

/* Отправка формы → готовое сообщение в WhatsApp */
const form = document.querySelector('.book-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const f = form;
    const name = f.name.value.trim();
    const phone = f.phone.value.trim();
    if (!name || !phone) {
      (!name ? f.name : f.phone).focus();
      return;
    }
    const L = I18N[LANG];
    const lines = [
      L['msg.lead'] + ':',
      '👤 ' + name,
      '📞 ' + phone,
      SELECTED_DATE ? '📅 ' + SELECTED_DATE : '',
      '👥 ' + (f.people.value || '—'),
      f.msg.value.trim() ? '💬 ' + f.msg.value.trim() : ''
    ].filter(Boolean);
    window.open(waLink(lines.join('\n')), '_blank');
  });
}

/* ============================================================
   Шапка: подложка после скролла
   ============================================================ */
const header = document.querySelector('header');
addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 60), { passive: true });

/* ============================================================
   Анимации появления (каскад)
   ============================================================ */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
function riseIn(el, delay = 0) {
  el.animate([{ opacity: 0, transform: 'translateY(30px)' }, { opacity: 1, transform: 'translateY(0)' }],
    { duration: 850, delay, fill: 'both', easing: 'cubic-bezier(.16,.84,.28,1)' });
}
function staggerChildren(container, step = 90, base = 0) {
  [...container.children].forEach((el, i) => riseIn(el, base + i * step));
}
if (!reduce) {
  const hero = document.querySelector('.hero-copy');
  if (hero) staggerChildren(hero, 120);
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const t = entry.target;
      if (t.classList.contains('day')) staggerChildren(t.querySelector('.day-info'), 110);
      else staggerChildren(t, 90);
      io.unobserve(t);
    });
  }, { threshold: 0.18 });
  document.querySelectorAll('.day, .route-head, .price-head, .dates-head, .reviews-head, .about-copy, .faq-head, .book-wrap')
    .forEach((el) => io.observe(el));
}

/* ============================================================
   Cross-fade фото дней + прогресс-рельс
   ============================================================ */
const bg = document.querySelector('.day-bg');
const daysSection = document.getElementById('days');
const rail = document.querySelector('.progress-rail');
if (rail) for (let i = 0; i < 8; i++) rail.appendChild(document.createElement('i'));
const railDots = rail ? [...rail.children] : [];

if (bg) {
  const layers = [...bg.querySelectorAll('.layer')];
  const days = [...document.querySelectorAll('.day')];
  let ticking = false;
  function paint() {
    ticking = false;
    const vh = innerHeight, viewCenter = scrollY + vh / 2;
    let nearest = 0, nearestVis = -1;
    days.forEach((day, i) => {
      const rect = day.getBoundingClientRect();
      const center = rect.top + scrollY + rect.height / 2;
      const dist = Math.abs(center - viewCenter) / vh;
      const vis = Math.max(0, 1 - dist);
      const layer = layers[i];
      if (layer) {
        layer.style.opacity = vis.toFixed(3);
        if (!reduce) layer.style.transform = 'scale(' + (1.03 + 0.03 * vis).toFixed(3) + ')';
      }
      if (vis > nearestVis) { nearestVis = vis; nearest = i; }
    });
    // прогресс-рельс: показываем, пока секция дней в кадре
    if (rail && daysSection) {
      const r = daysSection.getBoundingClientRect();
      const inView = r.top < vh * 0.5 && r.bottom > vh * 0.5;
      rail.classList.toggle('show', inView);
      railDots.forEach((d, i) => d.classList.toggle('on', i === nearest && inView));
    }
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(paint); } }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', paint);
  paint();
}

/* Инициализация языка */
applyLang('ru');
