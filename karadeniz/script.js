/* ============================================================
   Karadeniz — конфиг (замените на свои контакты и цену)
   ============================================================ */
const CONFIG = {
  phone: '998901234567',          // WhatsApp/Telegram номер без + и пробелов
  telegram: 'karadeniz_travel',   // username в Telegram без @
  email: 'hello@karadeniz.travel',
  price: '690',                   // цена «от $…» за человека
  webhook: ''                     // URL для приёма заявок на сервер (Google Sheet/CRM). Пусто = только мессенджеры
};

/* ============================================================
   Переводы RU / UZ / EN
   ============================================================ */
const I18N = {
  ru: {
    'nav.route':'Маршрут','nav.price':'Цена','nav.dates':'Даты','nav.reviews':'Отзывы','nav.faq':'FAQ','nav.book':'Забронировать <b>↗</b>',
    'word.day':'ДЕНЬ','stamp':'ТУРЦИЯ<br>×<br>ГРУЗИЯ','date.d1':'12 — 19 <b>мая</b>','date.d2':'02 — 09 <b>июня</b>','date.d3':'07 — 14 <b>июля</b>','date.d4':'01 — 08 <b>сент.</b>',
    'nav.about':'О нас','hero.from':'от','hero.audience':'вылет из Ташкента · 8 дней / 7 ночей','hero.pricelink':'что входит →','form.email':'Email','form.mail':'Отправьте на email →','float.cta':'Цена и бронь <b>↗</b>',
    'hero.tag':'BLACK SEA ESCAPE / 2027','hero.h1':'Загадочный<br><i>Karadeniz</i>','hero.lead':'8 дней по маршруту Ризе, Узунгёль, Айдер и Батуми.','hero.scroll':'Листайте, чтобы начать <span>↓</span>',
    'stmt.tag':'ТАМ, ГДЕ ГОРЫ ВСТРЕЧАЮТ МОРЕ','stmt.h2':'Один берег.<br>Два <i>мира.</i><br>Восемь дней.','stmt.text':'Единый маршрут из Турции в Грузию: горы и чайные яйлы Ризе, озеро Узунгёль, свободные дни и вечерний Батуми у моря — продуманная логистика и всего один переход границы.',
    'route.tag':'МАРШРУТ','route.h2':'Один берег,<br>четыре точки <i>притяжения.</i>','route.sub':'Черноморская дуга из Турции в Грузию — через горы, чайные яйлы, озёра и вечерний город у моря.','route.p1':'Чай, яйлы, горы','route.p2':'Озеро в облаках','route.p3':'Высокогорье 1350 м','route.p4':'Море и огни',
    'days.tag':'08 DAYS / 07 NIGHTS','days.h2':'Ваш маршрут<br>по <i>дням.</i>','days.sub':'Каждая карточка — отдельная глава путешествия. Только места, где хочется задержаться.',
    'd1.h':'Прилететь<br>к морю.','d1.p':'Ташкент → Трабзон, прилёт в 17:45. Встреча в аэропорту, трансфер и заселение в отель Rhisos Gold Hotel Rize. Вечерняя прогулка по Ризе и первый ужин турецкой кухни (по желанию).','d1.t1':'Rhisos Gold Rize','d1.t2':'Вечерняя Ризе','d1.t3':'Турецкий ужин',
    'd2.h':'Озеро между<br><i>облаками.</i>','d2.p':'Узунгёль — живописное горное озеро: прогулка, чай, сувениры. По пути в Трабзон — пещера Карача и стеклянная терраса Torul Cam Teras. Вечером — шопинг в Forum AVM.','d2.t1':'Узунгёль','d2.t2':'Karaca · Cam Teras','d2.t3':'Трабзон · Forum AVM',
    'd3.h':'Туда, где<br>растёт <i>чай.</i>','d3.p':'Айдер Яйласы через чайные плантации, леса и горные реки. По пути: крепость Зилкале и водопад Паловит. Плато Айдер — 1350 м. По желанию — гора Хусер на закат.','d3.t1':'Zilkale','d3.t2':'Palovit','d3.t3':'Айдер / 1350 м',
    'd4.h':'Оставить день<br><i>себе.</i>','d4.p':'Свободный день в Ризе: набережная, шопинг, кафе. По желанию — доп. экскурсии: смотровая Дуатепе и чайные плантации Ceceve Bahçesi с дегустацией.','d4.t1':'Прогулка и шопинг','d4.t2':'Дуатепе (опц.)','d4.t3':'Чай Ceceve (опц.)',
    'd5.h':'Один берег.<br>Две <i>страны.</i>','d5.p':'Переезд Ризе → Батуми на автобусе (~3–4 ч) вдоль побережья, погранконтроль. Заселение в отель Batumi View Luxury и вечерний Батуми: танцующие фонтаны, площадь Европы, старый город. Ужин по желанию — грузинская кухня или рыбный рынок.','d5.t1':'Переход границы','d5.t2':'Batumi View Luxury','d5.t3':'Танцующие фонтаны',
    'd6.h':'Водопад.<br>Крепость.<br><i>Горы.</i>','d6.p':'Аджария за пределами Батуми: мост царицы Тамары, водопад Махунцети и крепость Гонио-Апсарос. По желанию — зиплайн. Вечером — ужин в грузинской семье в Махунцети: халяльные блюда, музыка и танцы.','d6.t1':'Махунцети · Гонио','d6.t2':'Зиплайн (опц.)','d6.t3':'Ужин в семье · халяль',
    'd7.h':'Город, который<br>умеет <i>светиться.</i>','d7.p':'Свободный день в Батуми: набережная, ботанический сад, старый город, Башня Алфавита, шопинг. По желанию — дельфинарий (за доплату).','d7.t1':'Набережная · старый город','d7.t2':'Башня Алфавита','d7.t3':'Дельфинарий (опц.)',
    'd8.h':'Увезти<br>с собой <i>море.</i>','d8.p':'Свободное время утром, трансфер в аэропорт. Рейс Батуми → Ташкент, вылет в 00:20. Домой — с фотоальбомом, новыми вкусами и ощущением пройденного пути.','d8.t1':'Свободное время','d8.t2':'Трансфер в аэропорт','d8.t3':'Батуми → Ташкент 00:20',
    'price.tag':'ЦЕНА','price.h2':'Всё включено —<br>кроме <i>сюрпризов.</i>','price.from':'Стоимость тура','price.cur':'$','price.per':'за человека · 8 дней / 7 ночей','price.note':'Пример — укажите вашу цену в script.js (CONFIG.price).','price.cta':'Забронировать место <b>↗</b>',
    'incl.yes':'Включено','incl.y1':'7 ночей: Rhisos Gold Rize + Batumi View Luxury','incl.y2':'Все трансферы и переезд Ризе → Батуми','incl.y3':'Русскоговорящий гид','incl.y4':'Завтраки, часть ужинов','incl.y5':'Экскурсии по программе',
    'price.paidlabel':'За доплату, по желанию:','price.paidlist':'дельфинарий · зиплайн в Гонио · отдельные ужины · доп. экскурсии (Дуатепе, Ceceve Bahçesi)','faq.q7':'Могут ли измениться экскурсии?','faq.a7':'Да. Даты и время экскурсий могут меняться из-за погодных условий, изменения рейса или иных обстоятельств — программа сохраняется, порядок может корректироваться на месте.',
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
    'faq.q6':'Как оплатить и вернуть?','faq.a6':'Бронь — по предоплате, остаток до выезда. Возврат по договору: при отмене заранее возвращаем предоплату за вычетом уже понесённых расходов (брони отелей, билеты). Точные сроки и суммы — в договоре, пришлём до оплаты.',
    'book.tag':'KARADENIZ / ЗАЯВКА','book.h2':'Ваше путешествие<br>начинается <i>здесь.</i>','book.m1':'8 ДНЕЙ','book.m2':'7 НОЧЕЙ','book.m3':'ТУРЦИЯ × ГРУЗИЯ',
    'form.name':'Ваше имя','form.phone':'Телефон +998 __ ___ __ __','form.date':'Дата выезда (выберите выше)','form.people':'Человек','form.msg':'Комментарий (необязательно)','form.submit':'Отправить заявку <b>↗</b>','form.wa':'WhatsApp','form.tg':'Telegram','form.hint':'Заявка откроет готовое сообщение в мессенджере — ничего не потеряется.',
    'sticky.book':'Забронировать',
    'msg.greeting':'Здравствуйте! Хочу узнать про тур «Karadeniz» (Ризе + Батуми).',
    'msg.lead':'Заявка на тур «Karadeniz»'
  },
  uz: {
    'nav.route':'Marshrut','nav.price':'Narx','nav.dates':'Sanalar','nav.reviews':'Sharhlar','nav.faq':'Savollar','nav.book':'Band qilish <b>↗</b>',
    'word.day':'KUN','stamp':'TURKIYA<br>×<br>GRUZIYA','date.d1':'12 — 19 <b>may</b>','date.d2':'02 — 09 <b>iyun</b>','date.d3':'07 — 14 <b>iyul</b>','date.d4':'01 — 08 <b>sent.</b>',
    'nav.about':'Biz haqimizda','hero.from':'narxi','hero.audience':'Toshkentdan uchish · 8 kun / 7 kecha','hero.pricelink':'nima kiradi →','form.email':'Email','form.mail':'Email orqali yuboring →','float.cta':'Narx va bandlik <b>↗</b>',
    'hero.tag':'BLACK SEA ESCAPE / 2027','hero.h1':'Sirli<br><i>Karadeniz</i>','hero.lead':'Rize, Uzungöl, Ayder va Batumi bo‘ylab 8 kun.','hero.scroll':'Boshlash uchun pastga suring <span>↓</span>',
    'stmt.tag':'TOG‘LAR DENGIZ BILAN UCHRASHGAN JOY','stmt.h2':'Bitta qirg‘oq.<br>Ikki <i>olam.</i><br>Sakkiz kun.','stmt.text':'Turkiyadan Gruziyaga yagona marshrut: Rize tog‘lari va choy yaylovlari, Uzungöl ko‘li, erkin kunlar va dengiz bo‘yidagi kechki Batumi — puxta logistika va bitta chegara o‘tish bilan.',
    'route.tag':'MARSHRUT','route.h2':'Bitta qirg‘oq,<br>to‘rt <i>joziba nuqtasi.</i>','route.sub':'Turkiyadan Gruziyaga Qora dengiz yoyi — tog‘lar, choy yaylovlari, ko‘llar va dengiz bo‘yidagi kechki shahar orqali.','route.p1':'Choy, yaylov, tog‘','route.p2':'Bulutlar orasidagi ko‘l','route.p3':'Baland tog‘ 1350 m','route.p4':'Dengiz va chiroqlar',
    'days.tag':'08 KUN / 07 KECHA','days.h2':'Marshrutingiz<br><i>kun</i> bo‘yicha.','days.sub':'Har bir karta — sayohatning alohida bobi. Faqat to‘xtagingiz keladigan joylar.',
    'd1.h':'Dengizga<br>uchib kelish.','d1.p':'Toshkent → Trabzon, kelish 17:45 da. Aeroportda kutib olish, transfer va Rhisos Gold Hotel Rize mehmonxonasiga joylashish. Rize bo‘ylab kechki sayr va turk taomlaridan birinchi kechki ovqat (ixtiyoriy).','d1.t1':'Rhisos Gold Rize','d1.t2':'Kechki Rize','d1.t3':'Turk taomlari',
    'd2.h':'Bulutlar orasidagi<br><i>ko‘l.</i>','d2.p':'Uzungöl — go‘zal tog‘ ko‘li: sayr, choy, sovg‘alar. Trabzon yo‘lida — Karaca g‘ori va Torul Cam Teras shisha terasi. Kechqurun — Forum AVM da xarid.','d2.t1':'Uzungöl','d2.t2':'Karaca · Cam Teras','d2.t3':'Trabzon · Forum AVM',
    'd3.h':'Choy o‘sadigan<br><i>joyga.</i>','d3.p':'Ayder yaylovi choy plantatsiyalari, o‘rmonlar va tog‘ daryolari orqali. Yo‘lda: Zilkale qal’asi va Palovit sharsharasi. Ayder platosi — 1350 m. Ixtiyoriy — Xuser tog‘i quyosh botishida.','d3.t1':'Zilkale','d3.t2':'Palovit','d3.t3':'Ayder / 1350 m',
    'd4.h':'Bir kunni<br>o‘zingizga <i>qoldiring.</i>','d4.p':'Rizeda erkin kun: sohil, xarid, kafelar. Ixtiyoriy — qo‘shimcha ekskursiyalar: Duatepe manzaragohi va Ceceve Bahcesi choy plantatsiyalari (degustatsiya bilan).','d4.t1':'Sayr va xarid','d4.t2':'Duatepe (ixt.)','d4.t3':'Ceceve choy (ixt.)',
    'd5.h':'Bitta qirg‘oq.<br>Ikki <i>davlat.</i>','d5.p':'Rize → Batumi avtobusda (~3–4 soat) sohil bo‘ylab, chegara nazorati. Batumi View Luxury mehmonxonasiga joylashish va kechki Batumi: raqsga tushuvchi favvoralar, Yevropa maydoni, eski shahar. Kechki ovqat ixtiyoriy — gruzin taomlari yoki baliq bozori.','d5.t1':'Chegaradan o‘tish','d5.t2':'Batumi View Luxury','d5.t3':'Raqs favvoralari',
    'd6.h':'Sharshara.<br>Qal’a.<br><i>Tog‘lar.</i>','d6.p':'Batumidan tashqarida Ajariya: Tamara malika ko‘prigi, Maxuntseti sharsharasi va Gonio qal’asi. Ixtiyoriy — zipline. Kechqurun — Maxuntsetida gruzin oilasida kechki ovqat: halol taomlar, musiqa va raqs.','d6.t1':'Maxuntseti · Gonio','d6.t2':'Zipline (ixt.)','d6.t3':'Oilada · halol',
    'd7.h':'Nur socha oladigan<br><i>shahar.</i>','d7.p':'Batumida erkin kun: sohil, botanika bog‘i, eski shahar, Alifbo minorasi, xarid. Ixtiyoriy — delfinariy (qo‘shimcha to‘lov).','d7.t1':'Sohil · eski shahar','d7.t2':'Alifbo minorasi','d7.t3':'Delfinariy (ixt.)',
    'd8.h':'Dengizni<br>o‘zingiz bilan <i>olib keting.</i>','d8.p':'Ertalab erkin vaqt, aeroportga transfer. Batumi → Toshkent reysi, uchish 00:20 da. Uyga — fotoalbom, yangi ta’mlar va bosib o‘tilgan yo‘l hissi bilan.','d8.t1':'Erkin vaqt','d8.t2':'Aeroportga transfer','d8.t3':'Batumi → Toshkent 00:20',
    'price.tag':'NARX','price.h2':'Hammasi ichida —<br><i>syurprizlardan</i> tashqari.','price.from':'Tur narxi','price.cur':'$','price.per':'kishi uchun · 8 kun / 7 kecha','price.note':'Namuna — narxni script.js da ko‘rsating (CONFIG.price).','price.cta':'Joy band qilish <b>↗</b>',
    'incl.yes':'Ichida','incl.y1':'7 kecha: Rhisos Gold Rize + Batumi View Luxury','incl.y2':'Barcha transfer va Rize → Batumi ko‘chish','incl.y3':'Rus tilida gid','incl.y4':'Nonushtalar, ba’zi kechki ovqatlar','incl.y5':'Dastur bo‘yicha ekskursiyalar',
    'price.paidlabel':'Qo‘shimcha to‘lov, ixtiyoriy:','price.paidlist':'delfinariy · Gonioda zipline · alohida kechki ovqatlar · qo‘shimcha ekskursiyalar (Duatepe, Ceceve Bahcesi)','faq.q7':'Ekskursiyalar o‘zgarishi mumkinmi?','faq.a7':'Ha. Ekskursiya sana va vaqti ob-havo, reys o‘zgarishi yoki boshqa holatlarga ko‘ra o‘zgarishi mumkin — dastur saqlanadi, tartib joyida moslashtirilishi mumkin.',
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
    'faq.q6':'Qanday to‘lash va qaytarish?','faq.a6':'Bandlik — oldindan to‘lov bilan, qolgani chiqishdan oldin. Qaytarish shartnoma bo‘yicha: oldindan bekor qilinsa, to‘lovni haqiqiy xarajatlar (mehmonxona, chipta) chegirib qaytaramiz. Aniq shartlar shartnomada, to‘lovdan oldin yuboramiz.',
    'book.tag':'KARADENIZ / ARIZA','book.h2':'Sayohatingiz<br>shu yerda <i>boshlanadi.</i>','book.m1':'8 KUN','book.m2':'7 KECHA','book.m3':'TURKIYA × GRUZIYA',
    'form.name':'Ismingiz','form.phone':'Telefon +998 __ ___ __ __','form.date':'Chiqish sanasi (yuqoridan tanlang)','form.people':'Kishi','form.msg':'Izoh (ixtiyoriy)','form.submit':'Ariza yuborish <b>↗</b>','form.wa':'WhatsApp','form.tg':'Telegram','form.hint':'Ariza messenjerda tayyor xabarni ochadi — hech narsa yo‘qolmaydi.',
    'sticky.book':'Band qilish',
    'msg.greeting':'Assalomu alaykum! «Karadeniz» turi (Rize + Batumi) haqida bilmoqchiman.',
    'msg.lead':'«Karadeniz» turiga ariza'
  },
  en: {
    'nav.route':'Route','nav.price':'Price','nav.dates':'Dates','nav.reviews':'Reviews','nav.faq':'FAQ','nav.book':'Book now <b>↗</b>',
    'word.day':'DAY','stamp':'TÜRKİYE<br>×<br>GEORGIA','date.d1':'12 — 19 <b>May</b>','date.d2':'02 — 09 <b>June</b>','date.d3':'07 — 14 <b>July</b>','date.d4':'01 — 08 <b>Sept.</b>',
    'nav.about':'About','hero.from':'from','hero.audience':'departure from Tashkent · 8 days / 7 nights','hero.pricelink':'what’s included →','form.email':'Email','form.mail':'Send by email →','float.cta':'Price & booking <b>↗</b>',
    'hero.tag':'BLACK SEA ESCAPE / 2027','hero.h1':'Mysterious<br><i>Karadeniz</i>','hero.lead':'8 days across Rize, Uzungöl, Ayder and Batumi.','hero.scroll':'Scroll to begin <span>↓</span>',
    'stmt.tag':'WHERE THE MOUNTAINS MEET THE SEA','stmt.h2':'One coast.<br>Two <i>worlds.</i><br>Eight days.','stmt.text':'One route from Türkiye to Georgia: the mountains and tea highlands of Rize, Lake Uzungöl, free days and evening Batumi by the sea — thoughtful logistics and a single border crossing.',
    'route.tag':'ROUTE','route.h2':'One coast,<br>four points of <i>attraction.</i>','route.sub':'A Black Sea arc from Türkiye to Georgia — through mountains, tea highlands, lakes and an evening city by the sea.','route.p1':'Tea, highlands, peaks','route.p2':'Lake in the clouds','route.p3':'Highland 1350 m','route.p4':'Sea and lights',
    'days.tag':'08 DAYS / 07 NIGHTS','days.h2':'Your route,<br>day by <i>day.</i>','days.sub':'Each card is a separate chapter. Only the places worth lingering in.',
    'd1.h':'Fly in<br>to the sea.','d1.p':'Tashkent → Trabzon, arrival 17:45. Airport pickup, transfer and check-in at Rhisos Gold Hotel Rize. An evening walk around Rize and a first Turkish dinner (optional).','d1.t1':'Rhisos Gold Rize','d1.t2':'Evening Rize','d1.t3':'Turkish dinner',
    'd2.h':'A lake among<br>the <i>clouds.</i>','d2.p':'Uzungöl — a scenic mountain lake: a walk, tea, souvenirs. On the way to Trabzon — Karaca cave and the Torul Cam Teras glass terrace. Evening shopping at Forum AVM.','d2.t1':'Uzungöl','d2.t2':'Karaca · Cam Teras','d2.t3':'Trabzon · Forum AVM',
    'd3.h':'To where<br>the <i>tea</i> grows.','d3.p':'Ayder Yaylası through tea plantations, forests and mountain rivers. Along the way: Zilkale fortress and Palovit waterfall. Ayder plateau — 1350 m. Optional — Huser mountain at sunset.','d3.t1':'Zilkale','d3.t2':'Palovit','d3.t3':'Ayder / 1350 m',
    'd4.h':'A day<br>for <i>yourself.</i>','d4.p':'A free day in Rize: promenade, shopping, cafés. Optional extra tours: the Duatepe viewpoint and Ceceve Bahçesi tea plantations with a tasting.','d4.t1':'Walk & shopping','d4.t2':'Duatepe (opt.)','d4.t3':'Ceceve tea (opt.)',
    'd5.h':'One coast.<br>Two <i>countries.</i>','d5.p':'Rize → Batumi by bus (~3–4 h) along the coast, border control. Check-in at Batumi View Luxury and evening Batumi: dancing fountains, Europe Square, old town. Optional dinner — Georgian cuisine or the fish market.','d5.t1':'Border crossing','d5.t2':'Batumi View Luxury','d5.t3':'Dancing fountains',
    'd6.h':'Waterfall.<br>Fortress.<br><i>Mountains.</i>','d6.p':'Adjara beyond Batumi: Queen Tamar bridge, Makhuntseti waterfall and Gonio fortress. Optional — zipline. In the evening — dinner with a Georgian family in Makhuntseti: halal dishes, music and dancing.','d6.t1':'Makhuntseti · Gonio','d6.t2':'Zipline (opt.)','d6.t3':'Family dinner · halal',
    'd7.h':'A city that<br>knows how to <i>glow.</i>','d7.p':'A free day in Batumi: promenade, botanical garden, old town, Alphabet Tower, shopping. Optional — dolphinarium (extra fee).','d7.t1':'Promenade · old town','d7.t2':'Alphabet Tower','d7.t3':'Dolphinarium (opt.)',
    'd8.h':'Take the<br>sea <i>with you.</i>','d8.p':'Free time in the morning, transfer to the airport. Batumi → Tashkent flight, departure 00:20. Home — with a photo album, new tastes and the feeling of a path travelled.','d8.t1':'Free time','d8.t2':'Airport transfer','d8.t3':'Batumi → Tashkent 00:20',
    'price.tag':'PRICE','price.h2':'All included —<br>except the <i>surprises.</i>','price.from':'Tour price','price.cur':'$','price.per':'per person · 8 days / 7 nights','price.note':'Example — set your price in script.js (CONFIG.price).','price.cta':'Reserve a spot <b>↗</b>',
    'incl.yes':'Included','incl.y1':'7 nights: Rhisos Gold Rize + Batumi View Luxury','incl.y2':'All transfers and the Rize → Batumi drive','incl.y3':'Russian-speaking guide','incl.y4':'Breakfasts, some dinners','incl.y5':'Tours per program',
    'price.paidlabel':'Optional, extra fee:','price.paidlist':'dolphinarium · zipline at Gonio · separate dinners · optional tours (Duatepe, Ceceve Bahçesi)','faq.q7':'Can excursions change?','faq.a7':'Yes. Excursion dates and times may change due to weather, flight changes or other circumstances — the program stays, the order may be adjusted on the spot.',
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
    'faq.q6':'How to pay and refund?','faq.a6':'Booking by prepayment, the balance before departure. Refunds per contract: on early cancellation we return the prepayment minus costs already incurred (hotel bookings, tickets). Exact terms are in the contract, sent before payment.',
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
  document.querySelectorAll('[data-price]').forEach(el => el.textContent = CONFIG.price);
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
    const email = f.email ? f.email.value.trim() : '';
    if (!name || !phone) {
      (!name ? f.name : f.phone).focus();
      return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { f.email.focus(); return; }
    const L = I18N[LANG];
    const data = { name, phone, email, date: SELECTED_DATE, people: f.people.value || '', message: f.msg.value.trim(), lang: LANG, page: location.href };
    const lines = [
      L['msg.lead'] + ':',
      '👤 ' + name,
      '📞 ' + phone,
      email ? '✉️ ' + email : '',
      SELECTED_DATE ? '📅 ' + SELECTED_DATE : '',
      '👥 ' + (f.people.value || '—'),
      f.msg.value.trim() ? '💬 ' + f.msg.value.trim() : ''
    ].filter(Boolean);
    // серверный fallback: если задан webhook — фиксируем лид на сервере (не зависит от WhatsApp)
    if (CONFIG.webhook) {
      fetch(CONFIG.webhook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).catch(() => {});
    }
    // открываем готовое сообщение в WhatsApp; если не откроется — остаётся email-ссылка ниже
    window.open(waLink(lines.join('\n')), '_blank');
    const mail = document.querySelector('.form-fallback a');
    if (mail) mail.href = 'mailto:' + CONFIG.email + '?subject=' + encodeURIComponent(L['msg.lead']) + '&body=' + encodeURIComponent(lines.slice(1).join('\n'));
  });
}

/* ============================================================
   Шапка: подложка после скролла
   ============================================================ */
const header = document.querySelector('header');
const floatCta = document.querySelector('.float-cta');
const bookSection = document.getElementById('book');
addEventListener('scroll', () => {
  header.classList.toggle('scrolled', scrollY > 60);
  if (floatCta) {
    const pastHero = scrollY > innerHeight * 0.85;
    const nearBook = bookSection && bookSection.getBoundingClientRect().top < innerHeight * 0.9;
    floatCta.classList.toggle('show', pastHero && !nearBook);
  }
}, { passive: true });

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
