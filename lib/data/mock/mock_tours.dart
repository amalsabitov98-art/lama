import 'package:turon_tour/domain/entities/localized.dart';

/// Shorthand for a trilingual string.
LocalizedText _t(String uz, String ru, String en) =>
    LocalizedText(uz: uz, ru: ru, en: en);

/// Shorthand for a trilingual list of strings.
LocalizedList _l(List<String> uz, List<String> ru, List<String> en) =>
    LocalizedList(uz: uz, ru: ru, en: en);

String _img(String seed) => 'https://picsum.photos/seed/$seed/900/600';

/// A group departure for a mock tour.
class MockDeparture {
  const MockDeparture({
    required this.daysFromNow,
    required this.totalSeats,
    required this.seatsLeft,
    required this.status,
    required this.pricePerPerson,
  });

  final int daysFromNow;
  final int totalSeats;
  final int seatsLeft;
  final String status; // recruiting / confirmed / closed
  final double pricePerPerson;
}

/// A review for a mock tour.
class MockReview {
  const MockReview({
    required this.author,
    required this.rating,
    required this.text,
    required this.daysAgo,
  });

  final String author;
  final double rating;
  final String text;
  final int daysAgo;
}

/// Full mock definition of one tour, with its departures and reviews.
class MockTour {
  const MockTour({
    required this.title,
    required this.shortDescription,
    required this.fullDescription,
    required this.aiSummary,
    required this.images,
    required this.highlights,
    required this.included,
    required this.excluded,
    required this.meetingLat,
    required this.meetingLng,
    required this.meetingAddress,
    required this.meetingPhoto,
    required this.retailPrice,
    required this.netPrice,
    required this.rating,
    required this.reviewsCount,
    required this.durationDays,
    required this.category,
    required this.region,
    required this.departures,
    required this.reviews,
  });

  final LocalizedText title;
  final LocalizedText shortDescription;
  final LocalizedText fullDescription;
  final LocalizedText aiSummary;
  final List<String> images;
  final LocalizedList highlights;
  final LocalizedList included;
  final LocalizedList excluded;
  final double meetingLat;
  final double meetingLng;
  final LocalizedText meetingAddress;
  final String meetingPhoto;
  final double retailPrice;
  final double netPrice;
  final double rating;
  final int reviewsCount;
  final int durationDays;
  final String category; // cultural / nature / adventure / city
  final String region;
  final List<MockDeparture> departures;
  final List<MockReview> reviews;
}

/// One installment in a mock booking's payment plan.
class MockInstallment {
  const MockInstallment({
    required this.amount,
    required this.dueInDays,
    required this.status,
  });

  final double amount;
  final int dueInDays; // negative = in the past
  final String status; // paid / pending / overdue
}

/// A pre-made booking for the mock tourist account.
class MockBooking {
  const MockBooking({
    required this.reference,
    required this.tourIndex,
    required this.departureIndex,
    required this.pax,
    required this.status,
    required this.createdDaysAgo,
    required this.voucherStatus,
    required this.installments,
  });

  final String reference;
  final int tourIndex;
  final int departureIndex;
  final int pax;
  final String status; // pending / confirmed / completed / cancelled
  final int createdDaysAgo;
  final String voucherStatus; // active / used
  final List<MockInstallment> installments;
}

/// The seeded tour catalogue — real Uzbek destinations, prices in UZS.
const List<MockTour> kMockTours = [
  // 0 — Samarkand
  MockTour(
    title: _t('Samarqand: Registon va Ipak yoʻli',
        'Самарканд: Регистан и Шёлковый путь', 'Samarkand: Registan & Silk Road'),
    shortDescription: _t(
        'Registon, Bibixonim va Shohizinda boʻylab sayohat.',
        'Регистан, Биби-Ханым и Шахи-Зинда за одну поездку.',
        'Registan, Bibi-Khanym and Shah-i-Zinda in one trip.'),
    fullDescription: _t(
        'Ikki kunlik sayohatda Samarqandning eng mashhur yodgorliklarini koʻrasiz, Registon maydonida bezakli madrasalarni tomosha qilasiz va mahalliy bozorni aylanib chiqasiz.',
        'За два дня вы увидите главные памятники Самарканда, полюбуетесь медресе на площади Регистан и прогуляетесь по местному базару.',
        'Over two days you will see Samarkand\'s greatest monuments, admire the madrasahs of Registan Square and wander the local bazaar.'),
    aiSummary: _t(
        'Sayohatchilar gid bilimini va Registon manzarasini alohida taʼkidlashadi.',
        'Путешественники особенно отмечают знания гида и виды Регистана.',
        'Travellers especially praise the guide\'s knowledge and the Registan views.'),
    images: [_img('samarkand-registan'), _img('samarkand-shahizinda'), _img('samarkand-bazaar')],
    highlights: _l(
        ['Registon maydoni', 'Bibixonim masjidi', 'Shohizinda nekropoli'],
        ['Площадь Регистан', 'Мечеть Биби-Ханым', 'Некрополь Шахи-Зинда'],
        ['Registan Square', 'Bibi-Khanym Mosque', 'Shah-i-Zinda necropolis']),
    included: _l(
        ['Gid xizmati', 'Transport', 'Kirish chiptalari', 'Tushlik'],
        ['Услуги гида', 'Транспорт', 'Входные билеты', 'Обед'],
        ['Guide', 'Transport', 'Entrance tickets', 'Lunch']),
    excluded: _l(
        ['Aviabilet', 'Shaxsiy xarajatlar'],
        ['Авиабилеты', 'Личные расходы'],
        ['Flights', 'Personal expenses']),
    meetingLat: 39.6547,
    meetingLng: 66.9758,
    meetingAddress: _t('Registon maydoni, Samarqand', 'Площадь Регистан, Самарканд', 'Registan Square, Samarkand'),
    meetingPhoto: 'https://picsum.photos/seed/samarkand-meet/600/400',
    retailPrice: 1450000,
    netPrice: 1250000,
    rating: 4.8,
    reviewsCount: 214,
    durationDays: 2,
    category: 'cultural',
    region: 'Samarqand',
    departures: [
      MockDeparture(daysFromNow: 10, totalSeats: 16, seatsLeft: 4, status: 'recruiting', pricePerPerson: 1450000),
      MockDeparture(daysFromNow: 24, totalSeats: 16, seatsLeft: 11, status: 'recruiting', pricePerPerson: 1450000),
      MockDeparture(daysFromNow: 38, totalSeats: 20, seatsLeft: 20, status: 'confirmed', pricePerPerson: 1390000),
    ],
    reviews: [
      MockReview(author: 'Kamola', rating: 5, text: 'Ajoyib tashkil etilgan, gid juda bilimdon edi!', daysAgo: 12),
      MockReview(author: 'Sergey', rating: 4.5, text: 'Очень красиво, но обед можно было бы получше.', daysAgo: 30),
    ],
  ),

  // 1 — Bukhara
  MockTour(
    title: _t('Buxoro: Qadimiy shahar', 'Бухара: Древний город', 'Bukhara: The Ancient City'),
    shortDescription: _t('Lyabi-Hovuz, Ark qalʼasi va savdo gumbazlari.',
        'Ляби-Хауз, крепость Арк и торговые купола.', 'Lyabi-Hauz, the Ark fortress and trading domes.'),
    fullDescription: _t(
        'Buxoroning tarixiy markazi UNESCO roʻyxatiga kiritilgan. Ark qalʼasi, Poi-Kalon majmuasi va qadimiy savdo gumbazlarini kashf etasiz.',
        'Исторический центр Бухары внесён в список ЮНЕСКО. Вы откроете крепость Арк, комплекс Пои-Калян и старинные торговые купола.',
        'Bukhara\'s historic centre is a UNESCO site. Discover the Ark fortress, the Poi-Kalyan complex and the old trading domes.'),
    aiSummary: _t('Sayohatchilar shaharning yaxlit tarixiy muhitini yoqtirishadi.',
        'Гостям нравится цельная историческая атмосфера города.',
        'Guests love the city\'s wonderfully intact historic atmosphere.'),
    images: [_img('bukhara-ark'), _img('bukhara-kalon'), _img('bukhara-lyabi')],
    highlights: _l(
        ['Ark qalʼasi', 'Poi-Kalon minorasi', 'Lyabi-Hovuz'],
        ['Крепость Арк', 'Минарет Пои-Калян', 'Ляби-Хауз'],
        ['Ark fortress', 'Poi-Kalyan minaret', 'Lyabi-Hauz']),
    included: _l(['Gid', 'Transport', 'Kirish chiptalari'], ['Гид', 'Транспорт', 'Входные билеты'], ['Guide', 'Transport', 'Entrance tickets']),
    excluded: _l(['Ovqatlanish', 'Aviabilet'], ['Питание', 'Авиабилеты'], ['Meals', 'Flights']),
    meetingLat: 39.7756,
    meetingLng: 64.4286,
    meetingAddress: _t('Lyabi-Hovuz, Buxoro', 'Ляби-Хауз, Бухара', 'Lyabi-Hauz, Bukhara'),
    meetingPhoto: 'https://picsum.photos/seed/bukhara-meet/600/400',
    retailPrice: 1650000,
    netPrice: 1420000,
    rating: 4.7,
    reviewsCount: 168,
    durationDays: 2,
    category: 'cultural',
    region: 'Buxoro',
    departures: [
      MockDeparture(daysFromNow: 14, totalSeats: 16, seatsLeft: 7, status: 'recruiting', pricePerPerson: 1650000),
      MockDeparture(daysFromNow: 28, totalSeats: 16, seatsLeft: 2, status: 'recruiting', pricePerPerson: 1650000),
    ],
    reviews: [
      MockReview(author: 'Dilfuza', rating: 5, text: 'Buxoro sehrli! Har bir gumbaz oʻz tarixiga ega.', daysAgo: 8),
      MockReview(author: 'Anna', rating: 4.5, text: 'Прекрасный город, рекомендую гида.', daysAgo: 20),
    ],
  ),

  // 2 — Khiva
  MockTour(
    title: _t('Xiva: Ichan-Qalʼa', 'Хива: Ичан-Кала', 'Khiva: Itchan Kala'),
    shortDescription: _t('Devor ichidagi ochiq osmon ostidagi muzey.',
        'Музей под открытым небом за крепостной стеной.', 'An open-air museum within the ancient walls.'),
    fullDescription: _t(
        'Ichan-Qalʼa — Xivaning ichki qalʼasi, toʻliq saqlanib qolgan. Minoralar, madrasalar va saroylar orasida yuring.',
        'Ичан-Кала — внутренняя крепость Хивы, сохранившаяся целиком. Прогуляйтесь среди минаретов, медресе и дворцов.',
        'Itchan Kala is Khiva\'s inner fortress, preserved in full. Stroll among minarets, madrasahs and palaces.'),
    aiSummary: _t('Kun botishidagi manzaralar eng koʻp maqtaladi.',
        'Больше всего хвалят виды на закате.', 'The sunset views get the most praise.'),
    images: [_img('khiva-kalta'), _img('khiva-minaret'), _img('khiva-walls')],
    highlights: _l(['Kalta-minor', 'Juma masjidi', 'Toshhovli saroyi'],
        ['Кальта-Минор', 'Пятничная мечеть', 'Дворец Таш-Хаули'],
        ['Kalta Minor', 'Juma Mosque', 'Tash-Hauli Palace']),
    included: _l(['Gid', 'Transport', 'Kirish chiptalari', 'Nonushta'], ['Гид', 'Транспорт', 'Входные билеты', 'Завтрак'], ['Guide', 'Transport', 'Entrance tickets', 'Breakfast']),
    excluded: _l(['Aviabilet', 'Kechki ovqat'], ['Авиабилеты', 'Ужин'], ['Flights', 'Dinner']),
    meetingLat: 41.3783,
    meetingLng: 60.3639,
    meetingAddress: _t('Ichan-Qalʼa gʻarbiy darvozasi, Xiva', 'Западные ворота Ичан-Калы, Хива', 'Itchan Kala west gate, Khiva'),
    meetingPhoto: 'https://picsum.photos/seed/khiva-meet/600/400',
    retailPrice: 1980000,
    netPrice: 1700000,
    rating: 4.9,
    reviewsCount: 142,
    durationDays: 3,
    category: 'cultural',
    region: 'Xorazm',
    departures: [
      MockDeparture(daysFromNow: 21, totalSeats: 14, seatsLeft: 5, status: 'recruiting', pricePerPerson: 1980000),
      MockDeparture(daysFromNow: 45, totalSeats: 14, seatsLeft: 14, status: 'confirmed', pricePerPerson: 1920000),
    ],
    reviews: [
      MockReview(author: 'Jasur', rating: 5, text: 'Xiva — vaqt mashinasi kabi. Zoʻr sayohat!', daysAgo: 5),
      MockReview(author: 'Marta', rating: 5, text: 'Unforgettable sunset from the walls.', daysAgo: 33),
    ],
  ),

  // 3 — Nurata & Aydarkul
  MockTour(
    title: _t('Nurota va Aydarkoʻl: Yurta lagerida tun',
        'Нурата и Айдаркуль: Ночь в юрточном лагере', 'Nurata & Aydarkul: Night in a Yurt Camp'),
    shortDescription: _t('Choʻl, koʻl va koʻchmanchilar hayoti.',
        'Пустыня, озеро и жизнь кочевников.', 'Desert, lake and nomad life.'),
    fullDescription: _t(
        'Nurota togʻlari etagida yurta lagerida tunab, Aydarkoʻlda choʻmilib, tuya sayohati va gulxan atrofidagi qoʻshiqlardan bahramand boʻlasiz.',
        'Ночёвка в юрточном лагере у подножия Нуратинских гор, купание в Айдаркуле, катание на верблюдах и песни у костра.',
        'Spend a night in a yurt camp at the foot of the Nurata mountains, swim in Aydarkul, ride camels and enjoy songs by the fire.'),
    aiSummary: _t('Sokinlik va yulduzli osmon eng koʻp esda qoladi.',
        'Больше всего запоминаются тишина и звёздное небо.', 'The silence and the starry sky are what people remember most.'),
    images: [_img('nurata-yurt'), _img('aydarkul-lake'), _img('nurata-camel')],
    highlights: _l(['Aydarkoʻlda choʻmilish', 'Tuya sayohati', 'Gulxan va musiqa'],
        ['Купание в Айдаркуле', 'Прогулка на верблюдах', 'Костёр и музыка'],
        ['Swim in Aydarkul', 'Camel ride', 'Campfire and music']),
    included: _l(['Yurtada tunash', 'Ovqatlanish', 'Transport', 'Gid'], ['Ночёвка в юрте', 'Питание', 'Транспорт', 'Гид'], ['Yurt stay', 'Meals', 'Transport', 'Guide']),
    excluded: _l(['Ichimliklar', 'Aviabilet'], ['Напитки', 'Авиабилеты'], ['Drinks', 'Flights']),
    meetingLat: 40.5619,
    meetingLng: 65.6889,
    meetingAddress: _t('Nurota markazi', 'Центр Нураты', 'Nurata town centre'),
    meetingPhoto: 'https://picsum.photos/seed/nurata-meet/600/400',
    retailPrice: 1250000,
    netPrice: 1050000,
    rating: 4.6,
    reviewsCount: 97,
    durationDays: 2,
    category: 'nature',
    region: 'Navoiy',
    departures: [
      MockDeparture(daysFromNow: 9, totalSeats: 20, seatsLeft: 8, status: 'recruiting', pricePerPerson: 1250000),
      MockDeparture(daysFromNow: 30, totalSeats: 20, seatsLeft: 15, status: 'recruiting', pricePerPerson: 1250000),
    ],
    reviews: [
      MockReview(author: 'Nigora', rating: 5, text: 'Yulduzlar shu qadar yaqin edi! Ajoyib tajriba.', daysAgo: 15),
      MockReview(author: 'Tom', rating: 4, text: 'Great experience, bring warm clothes for the night.', daysAgo: 40),
    ],
  ),

  // 4 — Chimgan
  MockTour(
    title: _t('Chimyon togʻlarida trekking', 'Треккинг в горах Чимгана', 'Chimgan Mountains Trek'),
    shortDescription: _t('Toshkentdan bir kunlik togʻ sayohati.',
        'Однодневный горный поход из Ташкента.', 'A one-day mountain hike from Tashkent.'),
    fullDescription: _t(
        'Katta Chimyon yon bagʻirlari boʻylab piyoda yurish, arqonli yoʻldan foydalanish va togʻ manzaralaridan bahramand boʻlish.',
        'Пеший маршрут по склонам Большого Чимгана, подъём на канатной дороге и панорамы гор.',
        'Hike the slopes of Greater Chimgan, ride the chairlift and take in sweeping mountain panoramas.'),
    aiSummary: _t('Faol dam olishni yoqtiradiganlar uchun ideal.',
        'Идеально для любителей активного отдыха.', 'Ideal for active-holiday lovers.'),
    images: [_img('chimgan-peak'), _img('chimgan-trail'), _img('chimgan-lift')],
    highlights: _l(['Arqonli yoʻl', 'Togʻ maʼnzaralari', 'Piknik'],
        ['Канатная дорога', 'Горные виды', 'Пикник'],
        ['Chairlift', 'Mountain views', 'Picnic']),
    included: _l(['Transport', 'Gid', 'Piknik'], ['Транспорт', 'Гид', 'Пикник'], ['Transport', 'Guide', 'Picnic']),
    excluded: _l(['Arqonli yoʻl chiptasi', 'Shaxsiy jihozlar'], ['Билет на канатку', 'Личное снаряжение'], ['Chairlift ticket', 'Personal gear']),
    meetingLat: 41.5606,
    meetingLng: 70.0286,
    meetingAddress: _t('Chimyon dovoni avtoturargohi', 'Парковка на перевале Чимган', 'Chimgan pass car park'),
    meetingPhoto: 'https://picsum.photos/seed/chimgan-meet/600/400',
    retailPrice: 650000,
    netPrice: 520000,
    rating: 4.5,
    reviewsCount: 203,
    durationDays: 1,
    category: 'adventure',
    region: 'Toshkent viloyati',
    departures: [
      MockDeparture(daysFromNow: 6, totalSeats: 24, seatsLeft: 3, status: 'recruiting', pricePerPerson: 650000),
      MockDeparture(daysFromNow: 13, totalSeats: 24, seatsLeft: 16, status: 'recruiting', pricePerPerson: 650000),
      MockDeparture(daysFromNow: 20, totalSeats: 24, seatsLeft: 24, status: 'recruiting', pricePerPerson: 650000),
    ],
    reviews: [
      MockReview(author: 'Bekzod', rating: 5, text: 'Toza havo va zoʻr manzaralar. Yana boraman!', daysAgo: 3),
      MockReview(author: 'Olga', rating: 4, text: 'Хороший маршрут, но крутовато местами.', daysAgo: 18),
    ],
  ),

  // 5 — Tashkent
  MockTour(
    title: _t('Toshkent shahar sayohati', 'Обзорный тур по Ташкенту', 'Tashkent City Tour'),
    shortDescription: _t('Metro, bozor va zamonaviy poytaxt.',
        'Метро, базар и современная столица.', 'Metro, bazaar and the modern capital.'),
    fullDescription: _t(
        'Toshkentning bezakli metro bekatlari, Chorsu bozori, eski shahar va zamonaviy markazini bir kunda koʻring.',
        'За один день увидите украшенные станции метро, базар Чорсу, старый город и современный центр Ташкента.',
        'See Tashkent\'s decorated metro stations, Chorsu bazaar, the old town and the modern centre in a single day.'),
    aiSummary: _t('Metro bekatlari kutilmagan darajada yoqadi.',
        'Станции метро нравятся гостям неожиданно сильно.', 'Visitors are surprised by how much they love the metro stations.'),
    images: [_img('tashkent-metro'), _img('tashkent-chorsu'), _img('tashkent-center')],
    highlights: _l(['Metro bekatlari', 'Chorsu bozori', 'Hazrati Imom majmuasi'],
        ['Станции метро', 'Базар Чорсу', 'Комплекс Хазрати Имам'],
        ['Metro stations', 'Chorsu bazaar', 'Hazrati Imam complex']),
    included: _l(['Gid', 'Transport', 'Metro chiptalari'], ['Гид', 'Транспорт', 'Билеты на метро'], ['Guide', 'Transport', 'Metro tickets']),
    excluded: _l(['Ovqatlanish', 'Suvenirlar'], ['Питание', 'Сувениры'], ['Meals', 'Souvenirs']),
    meetingLat: 41.3264,
    meetingLng: 69.2286,
    meetingAddress: _t('Mustaqillik maydoni, Toshkent', 'Площадь Мустакиллик, Ташкент', 'Independence Square, Tashkent'),
    meetingPhoto: 'https://picsum.photos/seed/tashkent-meet/600/400',
    retailPrice: 480000,
    netPrice: 380000,
    rating: 4.4,
    reviewsCount: 176,
    durationDays: 1,
    category: 'city',
    region: 'Toshkent',
    departures: [
      MockDeparture(daysFromNow: 4, totalSeats: 18, seatsLeft: 9, status: 'recruiting', pricePerPerson: 480000),
      MockDeparture(daysFromNow: 11, totalSeats: 18, seatsLeft: 18, status: 'recruiting', pricePerPerson: 480000),
    ],
    reviews: [
      MockReview(author: 'Aziza', rating: 4.5, text: 'Yaxshi kirish sayohati, gid samimiy edi.', daysAgo: 9),
      MockReview(author: 'David', rating: 4, text: 'Good intro to the city, metro is a must.', daysAgo: 25),
    ],
  ),

  // 6 — Aral Sea
  MockTour(
    title: _t('Orol dengizi ekspeditsiyasi', 'Экспедиция на Аральское море', 'Aral Sea Expedition'),
    shortDescription: _t('Moʻynoq kemalar qabristoni va choʻl.',
        'Кладбище кораблей в Муйнаке и пустыня.', 'The Moynaq ship graveyard and the desert.'),
    fullDescription: _t(
        'Moʻynoqdagi kemalar qabristoni, Ustyurt platosi va yoʻqolgan dengiz oʻrnidagi choʻl boʻylab uch kunlik ekspeditsiya.',
        'Трёхдневная экспедиция: кладбище кораблей в Муйнаке, плато Устюрт и пустыня на месте исчезнувшего моря.',
        'A three-day expedition: the Moynaq ship graveyard, the Ustyurt plateau and the desert where the sea once was.'),
    aiSummary: _t('Kuchli va oʻylantiruvchi tajriba deb taʼriflashadi.',
        'Описывают как сильное и заставляющее задуматься путешествие.', 'Described as a powerful, thought-provoking journey.'),
    images: [_img('aral-ships'), _img('aral-ustyurt'), _img('aral-desert')],
    highlights: _l(['Kemalar qabristoni', 'Ustyurt platosi', 'Choʻlda tunash'],
        ['Кладбище кораблей', 'Плато Устюрт', 'Ночёвка в пустыне'],
        ['Ship graveyard', 'Ustyurt plateau', 'Desert overnight']),
    included: _l(['4x4 transport', 'Lager', 'Ovqatlanish', 'Gid'], ['Транспорт 4x4', 'Лагерь', 'Питание', 'Гид'], ['4x4 transport', 'Camp', 'Meals', 'Guide']),
    excluded: _l(['Aviabilet', 'Sugʻurta'], ['Авиабилеты', 'Страховка'], ['Flights', 'Insurance']),
    meetingLat: 43.7686,
    meetingLng: 59.0217,
    meetingAddress: _t('Moʻynoq shahri', 'Город Муйнак', 'Moynaq town'),
    meetingPhoto: 'https://picsum.photos/seed/aral-meet/600/400',
    retailPrice: 3200000,
    netPrice: 2750000,
    rating: 4.7,
    reviewsCount: 61,
    durationDays: 3,
    category: 'adventure',
    region: 'Qoraqalpogʻiston',
    departures: [
      MockDeparture(daysFromNow: 26, totalSeats: 12, seatsLeft: 6, status: 'recruiting', pricePerPerson: 3200000),
      MockDeparture(daysFromNow: 54, totalSeats: 12, seatsLeft: 12, status: 'confirmed', pricePerPerson: 3100000),
    ],
    reviews: [
      MockReview(author: 'Rustam', rating: 5, text: 'Hayotimdagi eng gʻayrioddiy sayohat.', daysAgo: 22),
      MockReview(author: 'Lena', rating: 4.5, text: 'Суровая красота, впечатляет.', daysAgo: 50),
    ],
  ),

  // 7 — Fergana
  MockTour(
    title: _t('Fargʻona vodiysi: Hunarmandchilik yoʻli',
        'Ферганская долина: Путь ремёсел', 'Fergana Valley: Craft Trail'),
    shortDescription: _t('Ipak, sopol va pichoq ustalari.',
        'Мастера шёлка, керамики и ножей.', 'Masters of silk, ceramics and knives.'),
    fullDescription: _t(
        'Margʻilon ipak fabrikasi, Rishton sopol ustaxonalari va Chust pichoqchilarini ziyorat qiling.',
        'Посетите шёлковую фабрику Маргилана, гончарные мастерские Риштана и мастеров ножей Чуста.',
        'Visit the Margilan silk factory, the Rishtan pottery workshops and the Chust knife makers.'),
    aiSummary: _t('Ustalar bilan jonli muloqot alohida qadrlanadi.',
        'Особенно ценят живое общение с мастерами.', 'The hands-on time with the craftspeople is especially valued.'),
    images: [_img('fergana-silk'), _img('rishton-ceramic'), _img('chust-knife')],
    highlights: _l(['Margʻilon ipagi', 'Rishton sopoli', 'Chust pichogʻi'],
        ['Маргиланский шёлк', 'Риштанская керамика', 'Чустский нож'],
        ['Margilan silk', 'Rishtan ceramics', 'Chust knife']),
    included: _l(['Gid', 'Transport', 'Ustaxona tashrifi', 'Tushlik'], ['Гид', 'Транспорт', 'Визит в мастерские', 'Обед'], ['Guide', 'Transport', 'Workshop visits', 'Lunch']),
    excluded: _l(['Aviabilet', 'Xaridlar'], ['Авиабилеты', 'Покупки'], ['Flights', 'Purchases']),
    meetingLat: 40.4711,
    meetingLng: 71.7242,
    meetingAddress: _t('Margʻilon markazi', 'Центр Маргилана', 'Margilan centre'),
    meetingPhoto: 'https://picsum.photos/seed/fergana-meet/600/400',
    retailPrice: 1350000,
    netPrice: 1150000,
    rating: 4.6,
    reviewsCount: 88,
    durationDays: 2,
    category: 'cultural',
    region: 'Fargʻona',
    departures: [
      MockDeparture(daysFromNow: 17, totalSeats: 16, seatsLeft: 10, status: 'recruiting', pricePerPerson: 1350000),
      MockDeparture(daysFromNow: 40, totalSeats: 16, seatsLeft: 16, status: 'recruiting', pricePerPerson: 1350000),
    ],
    reviews: [
      MockReview(author: 'Malika', rating: 5, text: 'Hunarmandlar bilan uchrashuv juda qiziq edi.', daysAgo: 11),
      MockReview(author: 'Pavel', rating: 4.5, text: 'Отличная поездка для любителей ремёсел.', daysAgo: 28),
    ],
  ),

  // 8 — Shakhrisabz
  MockTour(
    title: _t('Shahrisabz: Amir Temur vatani', 'Шахрисабз: Родина Амира Темура', 'Shakhrisabz: Timur\'s Homeland'),
    shortDescription: _t('Oq-Saroy xarobalari va tarixiy maqbaralar.',
        'Руины Ак-Сарая и исторические мавзолеи.', 'The Ak-Saray ruins and historic mausoleums.'),
    fullDescription: _t(
        'Amir Temurning tugʻilgan shahri Shahrisabzda ulkan Oq-Saroy darvozasi va tarixiy majmualarni koʻring.',
        'В Шахрисабзе, городе рождения Амира Темура, вас ждут гигантские ворота Ак-Сарая и исторические комплексы.',
        'In Shakhrisabz, Timur\'s birthplace, see the giant Ak-Saray gate and the historic complexes.'),
    aiSummary: _t('Kam sayyoh va sokin muhit yoqadi.',
        'Нравится немноголюдность и спокойная атмосфера.', 'The calm, uncrowded atmosphere is a highlight.'),
    images: [_img('shakhrisabz-aksaray'), _img('shakhrisabz-dorut'), _img('shakhrisabz-square')],
    highlights: _l(['Oq-Saroy darvozasi', 'Dorut-Tilovat', 'Kok-Gumbaz masjidi'],
        ['Ворота Ак-Сарай', 'Дорут-Тилловат', 'Мечеть Кок-Гумбаз'],
        ['Ak-Saray gate', 'Dorut-Tilovat', 'Kok-Gumbaz mosque']),
    included: _l(['Gid', 'Transport', 'Kirish chiptalari'], ['Гид', 'Транспорт', 'Входные билеты'], ['Guide', 'Transport', 'Entrance tickets']),
    excluded: _l(['Ovqatlanish', 'Aviabilet'], ['Питание', 'Авиабилеты'], ['Meals', 'Flights']),
    meetingLat: 39.0561,
    meetingLng: 66.8319,
    meetingAddress: _t('Oq-Saroy maydoni, Shahrisabz', 'Площадь Ак-Сарай, Шахрисабз', 'Ak-Saray square, Shakhrisabz'),
    meetingPhoto: 'https://picsum.photos/seed/shakhrisabz-meet/600/400',
    retailPrice: 720000,
    netPrice: 600000,
    rating: 4.5,
    reviewsCount: 54,
    durationDays: 1,
    category: 'cultural',
    region: 'Qashqadaryo',
    departures: [
      MockDeparture(daysFromNow: 8, totalSeats: 18, seatsLeft: 12, status: 'recruiting', pricePerPerson: 720000),
      MockDeparture(daysFromNow: 22, totalSeats: 18, seatsLeft: 18, status: 'recruiting', pricePerPerson: 720000),
    ],
    reviews: [
      MockReview(author: 'Sher', rating: 5, text: 'Tarixni his qildim, ajoyib joy.', daysAgo: 14),
      MockReview(author: 'Irina', rating: 4, text: 'Тихо и атмосферно, понравилось.', daysAgo: 35),
    ],
  ),

  // 9 — Sentyab
  MockTour(
    title: _t('Sentyob qishlogʻi: Togʻ hayoti', 'Село Сентяб: Жизнь в горах', 'Sentyab Village: Mountain Life'),
    shortDescription: _t('Nurota togʻlaridagi eko-qishloq.',
        'Эко-деревня в Нуратинских горах.', 'An eco-village in the Nurata mountains.'),
    fullDescription: _t(
        'Sentyob togʻ qishlogʻida mahalliy oilada mehmon boʻling, buloqlar boʻylab yuring va togʻ taomlaridan tatib koʻring.',
        'Погостите в местной семье в горном селе Сентяб, прогуляйтесь вдоль родников и попробуйте горную кухню.',
        'Stay with a local family in the mountain village of Sentyab, walk along the springs and taste mountain cuisine.'),
    aiSummary: _t('Mehmondoʻstlik va tabiat uygʻunligi maqtaladi.',
        'Хвалят гостеприимство и единение с природой.', 'Praised for the hospitality and closeness to nature.'),
    images: [_img('sentyab-village'), _img('sentyab-spring'), _img('sentyab-hike')],
    highlights: _l(['Mahalliy oilada mehmon', 'Buloqlar yoʻli', 'Togʻ taomlari'],
        ['Проживание в семье', 'Тропа к родникам', 'Горная кухня'],
        ['Homestay', 'Spring trail', 'Mountain cuisine']),
    included: _l(['Uy-joy', 'Ovqatlanish', 'Gid', 'Transport'], ['Проживание', 'Питание', 'Гид', 'Транспорт'], ['Homestay', 'Meals', 'Guide', 'Transport']),
    excluded: _l(['Aviabilet', 'Shaxsiy xarajatlar'], ['Авиабилеты', 'Личные расходы'], ['Flights', 'Personal expenses']),
    meetingLat: 40.6008,
    meetingLng: 66.5350,
    meetingAddress: _t('Sentyob qishlogʻi kirishi', 'Въезд в село Сентяб', 'Sentyab village entrance'),
    meetingPhoto: 'https://picsum.photos/seed/sentyab-meet/600/400',
    retailPrice: 1150000,
    netPrice: 950000,
    rating: 4.8,
    reviewsCount: 47,
    durationDays: 2,
    category: 'nature',
    region: 'Navoiy',
    departures: [
      MockDeparture(daysFromNow: 12, totalSeats: 12, seatsLeft: 5, status: 'recruiting', pricePerPerson: 1150000),
      MockDeparture(daysFromNow: 33, totalSeats: 12, seatsLeft: 12, status: 'recruiting', pricePerPerson: 1150000),
    ],
    reviews: [
      MockReview(author: 'Gulnora', rating: 5, text: 'Oilaviy iliqlikni his qildik, rahmat!', daysAgo: 7),
      MockReview(author: 'Jan', rating: 4.5, text: 'Authentic and peaceful, loved the homestay.', daysAgo: 29),
    ],
  ),

  // 10 — Charvak
  MockTour(
    title: _t('Chorvoq koʻli: Dam olish kuni', 'Озеро Чарвак: День отдыха', 'Charvak Lake Getaway'),
    shortDescription: _t('Feruza suvli koʻl va togʻ havosi.',
        'Бирюзовое озеро и горный воздух.', 'A turquoise lake and mountain air.'),
    fullDescription: _t(
        'Chorvoq suv omboriga bir kunlik sayohat: choʻmilish, qayiqda sayr va togʻ manzaralari.',
        'Однодневная поездка к Чарвакскому водохранилищу: купание, катание на лодке и горные виды.',
        'A day trip to the Charvak reservoir: swimming, a boat ride and mountain views.'),
    aiSummary: _t('Issiq kunlar uchun eng yaxshi tanlov deyishadi.',
        'Называют лучшим выбором для жарких дней.', 'Called the best pick for hot days.'),
    images: [_img('charvak-lake'), _img('charvak-boat'), _img('charvak-beach')],
    highlights: _l(['Choʻmilish', 'Qayiqda sayr', 'Togʻ manzaralari'],
        ['Купание', 'Прогулка на лодке', 'Горные виды'],
        ['Swimming', 'Boat ride', 'Mountain views']),
    included: _l(['Transport', 'Qayiq', 'Tushlik'], ['Транспорт', 'Лодка', 'Обед'], ['Transport', 'Boat', 'Lunch']),
    excluded: _l(['Shaxsiy xarajatlar'], ['Личные расходы'], ['Personal expenses']),
    meetingLat: 41.6197,
    meetingLng: 69.9836,
    meetingAddress: _t('Chorvoq koʻli plyaji', 'Пляж Чарвакского озера', 'Charvak lake beach'),
    meetingPhoto: 'https://picsum.photos/seed/charvak-meet/600/400',
    retailPrice: 550000,
    netPrice: 440000,
    rating: 4.3,
    reviewsCount: 129,
    durationDays: 1,
    category: 'nature',
    region: 'Toshkent viloyati',
    departures: [
      MockDeparture(daysFromNow: 5, totalSeats: 22, seatsLeft: 2, status: 'recruiting', pricePerPerson: 550000),
      MockDeparture(daysFromNow: 12, totalSeats: 22, seatsLeft: 14, status: 'recruiting', pricePerPerson: 550000),
    ],
    reviews: [
      MockReview(author: 'Doniyor', rating: 4.5, text: 'Suv toza, dam ajoyib oʻtdi.', daysAgo: 6),
      MockReview(author: 'Katya', rating: 4, text: 'Хорошо, но многолюдно в выходные.', daysAgo: 19),
    ],
  ),

  // 11 — Termez
  MockTour(
    title: _t('Termiz: Buddaviylik merosi', 'Термез: Буддийское наследие', 'Termez: Buddhist Heritage'),
    shortDescription: _t('Qadimiy stupalar va chegara shahri.',
        'Древние ступы и приграничный город.', 'Ancient stupas and a border city.'),
    fullDescription: _t(
        'Termizda Buddaviylik yodgorliklari — Fayoztepa va Qoratepa — hamda oʻziga xos chegara madaniyatini kashf eting.',
        'В Термезе откройте буддийские памятники — Фаязтепа и Каратепа — и особую приграничную культуру.',
        'In Termez discover the Buddhist monuments — Fayaz Tepa and Kara Tepa — and a unique border culture.'),
    aiSummary: _t('Kam maʼlum, ammo tarixga boy yoʻnalish sifatida maqtaladi.',
        'Хвалят как малоизвестное, но богатое историей направление.', 'Praised as a little-known but history-rich destination.'),
    images: [_img('termez-stupa'), _img('termez-fayaz'), _img('termez-museum')],
    highlights: _l(['Fayoztepa', 'Qoratepa', 'Arxeologiya muzeyi'],
        ['Фаязтепа', 'Каратепа', 'Археологический музей'],
        ['Fayaz Tepa', 'Kara Tepa', 'Archaeology museum']),
    included: _l(['Gid', 'Transport', 'Kirish chiptalari', 'Nonushta'], ['Гид', 'Транспорт', 'Входные билеты', 'Завтрак'], ['Guide', 'Transport', 'Entrance tickets', 'Breakfast']),
    excluded: _l(['Aviabilet', 'Kechki ovqat'], ['Авиабилеты', 'Ужин'], ['Flights', 'Dinner']),
    meetingLat: 37.2242,
    meetingLng: 67.2783,
    meetingAddress: _t('Termiz arxeologiya muzeyi', 'Археологический музей Термеза', 'Termez archaeology museum'),
    meetingPhoto: 'https://picsum.photos/seed/termez-meet/600/400',
    retailPrice: 2100000,
    netPrice: 1800000,
    rating: 4.4,
    reviewsCount: 33,
    durationDays: 2,
    category: 'cultural',
    region: 'Surxondaryo',
    departures: [
      MockDeparture(daysFromNow: 19, totalSeats: 14, seatsLeft: 9, status: 'recruiting', pricePerPerson: 2100000),
      MockDeparture(daysFromNow: 47, totalSeats: 14, seatsLeft: 14, status: 'confirmed', pricePerPerson: 2050000),
    ],
    reviews: [
      MockReview(author: 'Sardor', rating: 4.5, text: 'Kutilmagan darajada qiziqarli tarix.', daysAgo: 16),
      MockReview(author: 'Emma', rating: 4, text: 'Off the beaten path, very interesting.', daysAgo: 44),
    ],
  ),
];

/// Pre-made bookings for the mock tourist (Aziza Karimova).
///
/// [tourIndex] / [departureIndex] point into [kMockTours] and its departures.
const List<MockBooking> kMockTouristBookings = [
  // Confirmed upcoming trip to Samarkand, part-paid.
  MockBooking(
    reference: 'TT-4F9A2C',
    tourIndex: 0,
    departureIndex: 0,
    pax: 2,
    status: 'confirmed',
    createdDaysAgo: 12,
    voucherStatus: 'active',
    installments: [
      MockInstallment(amount: 1450000, dueInDays: -12, status: 'paid'),
      MockInstallment(amount: 1450000, dueInDays: 3, status: 'pending'),
    ],
  ),
  // Pending Nurata trip with an overdue installment.
  MockBooking(
    reference: 'TT-7B1E88',
    tourIndex: 3,
    departureIndex: 0,
    pax: 1,
    status: 'pending',
    createdDaysAgo: 5,
    voucherStatus: 'active',
    installments: [
      MockInstallment(amount: 525000, dueInDays: -2, status: 'overdue'),
      MockInstallment(amount: 525000, dueInDays: 7, status: 'pending'),
    ],
  ),
  // Completed past trip to Tashkent, fully paid, voucher used.
  MockBooking(
    reference: 'TT-2D5510',
    tourIndex: 5,
    departureIndex: 0,
    pax: 3,
    status: 'completed',
    createdDaysAgo: 40,
    voucherStatus: 'used',
    installments: [
      MockInstallment(amount: 1440000, dueInDays: -40, status: 'paid'),
    ],
  ),
];

/// Tour indexes the mock tourist has saved to their wishlist.
const List<int> kMockWishlistTourIndexes = [2, 6];
