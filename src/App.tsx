import { useEffect, useState } from "react";

// Resolve asset paths against the deploy base (e.g. "/lama/" on GitHub Pages)
// so root-absolute references keep working under a subpath.
const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const RAW_IMAGES = {
  hero: "/images/slide-01.webp",
  category: "/images/slide-02.jpg",
  system: "/images/slide-03.webp",
  roles: "/images/slide-04.webp",
  ecosystem: "/images/slide-05.webp",
  evergreen: "/images/slide-06.webp",
  quiet: "/images/slide-07.webp",
  family: "/images/slide-08-uzbek.webp",
  territories: "/images/slide-09.webp",
  horizons: "/images/slide-10.webp",
  value: "/images/slide-13.webp",
  pilot: "/images/slide-12.webp",
  final: "/images/slide-11.webp",
};

const IMAGES = Object.fromEntries(
  Object.entries(RAW_IMAGES).map(([key, path]) => [key, `${BASE}${path}`]),
) as typeof RAW_IMAGES;

function SlideBackground({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <img className={`slide-background ${className}`} src={src} loading="lazy" alt={alt} />
  );
}

const chapters = [
  ["intent", "01", "Намерение"],
  ["journey", "02", "Путь"],
  ["legacy", "03", "Наследие"],
] as const;

const stages = [
  { title: "Намерение", products: ["Капитал намерения"], note: "Финансовое решение начинается не с продажи поездки, а с личной цели." },
  { title: "Подготовка", products: ["Путь длиною в год"], note: "Финансовая, физическая и духовная готовность задолго до вылета." },
  { title: "Путь", products: ["Тихий премиум", "Сначала родители"], note: "Безупречное исполнение, в котором бытовой шум не заслоняет главное." },
  { title: "Возвращение", products: ["Путь продолжается"], note: "Сохранить смысл пережитого и помочь ему стать частью повседневной жизни." },
  { title: "Наследие", products: ["Вечный паломник", "Семейный аманат", "Двойной след"], note: "Превратить личный путь в традицию, которая становится больше одного человека." },
];

const territories = [
  { n: "01", name: "Капитал намерения", line: "Не занимать ради паломничества. Вырастить его из собственного намерения.", copy: "Регулярное формирование капитала для тех, кто хочет подготовить поездку без долга и финансовой тревоги.", shape: "accumulate" },
  { n: "02", name: "Путь длиною в год", line: "К святыне нельзя подготовиться только покупкой билета.", copy: "Финансовая, информационная, физическая и организационная подготовка начинается задолго до вылета.", shape: "calendar" },
  { n: "03", name: "После возвращения", line: "Ценность пути — в том, кем человек вернулся.", copy: "Сопровождение после поездки, личный дневник, закрытое сообщество и сохранение смысла в повседневной жизни.", shape: "return" },
  { n: "04", name: "Двойной след", line: "Одно паломничество может открыть путь ещё одному человеку.", copy: "Деликатная и прозрачная механика, позволяющая клиенту помочь совершить паломничество другому человеку.", shape: "split" },
  { n: "05", name: "Семейный аманат", line: "Один капитал. Паломничество поколений.", copy: "Доход от семейного капитала помогает разным членам семьи совершать путь и сохраняет историю поколений.", shape: "tree" },
];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [chapter, setChapter] = useState(0);
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main > section"));
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let animatedElements: HTMLElement[] = [];
    let animationFrame = 0;

    const updateScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
      setScrolled(window.scrollY > window.innerHeight * 0.18);
      const markers = Array.from(document.querySelectorAll<HTMLElement>("[data-chapter]"));
      let current = 0;
      markers.forEach((marker, index) => {
        if (marker.offsetTop <= window.scrollY + window.innerHeight * 0.45) current = index;
      });
      setChapter(current);

      const viewportHeight = window.innerHeight;
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top < viewportHeight * 1.08 && rect.bottom > -viewportHeight * .08) {
          section.classList.add("is-visible");
        }
        if (!prefersReducedMotion) {
          const distance = (rect.top + rect.height / 2 - viewportHeight / 2) / (rect.height + viewportHeight);
          const shift = Math.max(-28, Math.min(28, distance * 54));
          section.style.setProperty("--media-y", `${shift.toFixed(2)}px`);
        }
      });

      animatedElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (rect.top < viewportHeight * 1.06 && rect.bottom > -viewportHeight * .06) {
          element.classList.add("in-view");
        }
      });
    };

    const onScroll = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(() => {
        updateScroll();
        animationFrame = 0;
      });
    };

    updateScroll();
    requestAnimationFrame(updateScroll);
    window.addEventListener("scroll", onScroll, { passive: true });

    const revealObserver = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("in-view");
      }),
      { threshold: 0.12 },
    );

    const staggerGroups = [
      ".package-words", ".roles-grid", ".three-steps", ".quiet-promises",
      ".territory-list", ".horizon-stack", ".value-columns", ".pilot-steps",
    ];

    staggerGroups.forEach((selector) => {
      document.querySelectorAll(selector).forEach((group) => {
        Array.from(group.children).forEach((item, index) => {
          const element = item as HTMLElement;
          if (!element.classList.contains("reveal")) element.classList.add("stagger-reveal");
          element.style.setProperty("--reveal-delay", `${Math.min(index * 90, 360)}ms`);
        });
      });
    });

    animatedElements = Array.from(document.querySelectorAll<HTMLElement>(".reveal, .stagger-reveal"));
    animatedElements.forEach((el) => revealObserver.observe(el));
    updateScroll();

    const sectionObserver = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      }),
      { rootMargin: "10% 0px -10%", threshold: 0.08 },
    );
    sections.forEach((section) => sectionObserver.observe(section));

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      revealObserver.disconnect();
      sectionObserver.disconnect();
    };
  }, []);

  return (
    <main>
      <div className="grain" aria-hidden="true" />
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="К началу презентации">IMAN <i /> EXPERIENCE</a>
        <div className="chapter-indicator" aria-label={`Текущая глава: ${chapters[chapter][2]}`}>
          <span>{chapters[chapter][1]}</span> {chapters[chapter][2]}
        </div>
      </header>

      <aside className="journey-rail" aria-hidden="true">
        <span className="journey-line" style={{ height: `${progress * 100}%` }} />
        <span className="journey-dot" style={{ top: `calc(${progress * 100}% - 3px)` }} />
      </aside>

      <section id="top" data-chapter="intent" className={`hero ${scrolled ? "is-scrolled" : ""}`}>
        <img className="hero-image" src={IMAGES.hero} fetchPriority="high" alt="Каменная колоннада в предрассветном свете, ведущая к светлому проходу" />
        <div className="hero-shade" />
        <div className="chapter-word chapter-word-hero" aria-hidden="true">Намерение</div>
        <div className="hero-content page-shell">
          <p className="eyebrow">Концепция партнёрской экосистемы</p>
          <h1>Паломничество начинается<br />с <em>намерения</em>.</h1>
          <p className="hero-continuation">И не заканчивается<br />возвращением.</p>
          <p className="hero-deck">Как соединить капитал, заботу и семейное наследие<br className="desktop-only" /> в новой системе паломничества.</p>
        </div>
        <a className="scroll-cue" href="#category"><span>Пройти путь</span><b>↓</b></a>
      </section>

      <section id="category" className="category dark-section">
        <SlideBackground src={IMAGES.category} alt="Отец и сын в ихраме во время паломничества" className="portrait-focus" />
        <div className="slide-shade" />
        <div className="page-shell">
          <p className="section-number">01 / Намерение</p>
          <div className="category-intro reveal">
            <h2>Сегодня паломничество продают как поездку.</h2>
          </div>
          <div className="category-body reveal">
            <div className="package-words" aria-label="Состав типового туристического пакета">
              <span>Перелёт</span><span>Отель</span><span>Трансфер</span><span>Сопровождение</span><strong>Пакет</strong>
            </div>
            <h3>Но человек едет не за логистикой.</h3>
            <p>Он отправляется в путь с намерением, страхами, надеждой, ответственностью перед семьёй и желанием вернуться другим. Почти ни один продукт не сопровождает весь этот путь.</p>
          </div>
        </div>
      </section>

      <section className="new-category dark-section">
        <SlideBackground src={IMAGES.system} alt="Исламская архитектура с геометрическим орнаментом" className="architecture-focus" />
        <div className="slide-shade" />
        <div className="page-shell statement-wrap reveal">
          <p className="section-kicker">Новая категория</p>
          <h2>Не ещё один тур.<br />Не финансовый продукт<br />с поездкой в подарок.</h2>
          <div className="system-name">Система паломничества</div>
          <p className="statement-copy">Экосистема, в которой капитал помогает человеку <span>подготовиться</span>, <span>совершить</span> путь, <span>сохранить</span> его смысл и <span>передать</span> традицию семье.</p>
        </div>
      </section>

      <section className="roles cream-section">
        <SlideBackground src={IMAGES.roles} alt="Руки с тасбихом в молитве" className="hands-focus" />
        <div className="slide-shade" />
        <div className="page-shell reveal">
          <p className="section-kicker dark">Архитектура партнёрства</p>
          <div className="roles-grid">
            <article><span className="role-index">01</span><h2>IMAN</h2><p>Капитал</p><p>Финансовая инфраструктура</p><p>Доверие инвесторов</p><p>Цифровая платформа</p></article>
            <div className="role-join" aria-hidden="true"><i /></div>
            <article><span className="role-index">02</span><h2>Мы</h2><p>Архитектура продуктов</p><p>Паломнический опыт</p><p>Премиальное исполнение</p><p>Стандарты заботы</p></article>
          </div>
          <p className="coauthors">Не финансист и подрядчик. <em>Соавторы новой категории.</em></p>
          <blockquote>IMAN управляет капиталом.<br />Мы придаём ему направление.</blockquote>
        </div>
      </section>

      <section id="ecosystem" data-chapter="journey" className="ecosystem forest-section">
        <SlideBackground src={IMAGES.ecosystem} alt="Мечеть, открывающаяся за ритмом колонн" className="courtyard-focus" />
        <div className="slide-shade" />
        <div className="chapter-word" aria-hidden="true">Путь</div>
        <div className="page-shell">
          <p className="section-number">02 / Путь</p>
          <h2 className="display-title reveal">Один путь.<br />Несколько способов<br />его начать.</h2>
          <div className="ecosystem-layout reveal">
            <div className="stage-focus" aria-live="polite">
              <span>0{activeStage + 1}</span>
              <h3>{stages[activeStage].title}</h3>
              <p>{stages[activeStage].note}</p>
              <div className="stage-products">{stages[activeStage].products.map((product) => <b key={product}>{product}</b>)}</div>
            </div>
            <div className="stage-list" role="list" aria-label="Этапы экосистемы">
              {stages.map((stage, index) => (
                <button key={stage.title} className={activeStage === index ? "active" : ""} onClick={() => setActiveStage(index)} onFocus={() => setActiveStage(index)} onMouseEnter={() => setActiveStage(index)}>
                  <span>0{index + 1}</span><strong>{stage.title}</strong><i>↗</i>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="evergreen dark-section">
        <SlideBackground src={IMAGES.evergreen} alt="Тасбих в руках старшего поколения" className="hands-focus" />
        <div className="slide-shade" />
        <div className="cycle-art" aria-hidden="true"><i /><i /><i /><i /><span /></div>
        <div className="page-shell evergreen-content reveal">
          <p className="section-kicker">Финансовый флагман</p>
          <h2>Капитал остаётся.<br />Путь повторяется.</h2>
          <div className="flagship-name">Вечный паломник</div>
          <p className="lead">Клиент формирует капитал в IMAN. Доход от него направляется на премиальное паломничество, а основной капитал сохраняется и продолжает работать. Со временем он может стать не только личным активом, но и семейной традицией.</p>
          <ol className="three-steps">
            <li><span>01</span><strong>Создать капитал</strong></li>
            <li><span>02</span><strong>Направить доход на путь</strong></li>
            <li><span>03</span><strong>Передать традицию дальше</strong></li>
          </ol>
          <div className="formula">
            <span>Капитал сохраняется.</span>
            <strong>Его доход ежегодно оплачивает паломничество.</strong>
          </div>
          <p className="honesty">Финансовая модель, резерв на периоды сниженной доходности и шариатская конструкция разрабатываются совместно с IMAN и профильными экспертами.</p>
        </div>
      </section>

      <section className="quiet-premium photo-story">
        <img src={IMAGES.quiet} loading="lazy" alt="Ритм древних каменных арок в мягком утреннем свете" />
        <div className="photo-wash" />
        <div className="page-shell photo-copy reveal">
          <p className="section-kicker">Операционный флагман</p>
          <h2>Настоящая роскошь —<br />когда ничто мирское<br />не отвлекает от главного.</h2>
          <div className="concept-label">Тихий премиум</div>
          <p className="lead">Не демонстративная роскошь, а отсутствие тревоги, ожидания и бытового шума.</p>
          <div className="quiet-promises"><span>Нечего проверять.</span><span>Некуда торопиться.</span><span>Никому не приходится звонить.</span><span>О важном уже позаботились.</span></div>
          <p className="quiet-detail">Личный координатор, приватность, продуманный ритм, медицинская готовность и решение вопросов до того, как клиент о них попросит.</p>
        </div>
      </section>

      <section className="parents cream-section">
        <SlideBackground src={IMAGES.family} alt="Узбекский сын провожает пожилых родителей в паломничество" className="family-focus" />
        <div className="slide-shade" />
        <div className="page-shell parents-layout">
          <div className="parents-copy reveal">
            <p className="section-kicker dark">Эмоциональный флагман</p>
            <h2>Первый большой доход —<br />не на очередную вещь.</h2>
            <h3>На дорогу родителей<br />к святыне.</h3>
            <div className="concept-label dark">Сначала родители</div>
            <p>Клиент направляет результат своего капитала на паломничество родителей. IMAN помогает сформировать финансовую основу, а наша команда берёт семью под полное сопровождение — от подготовки и здоровья до возвращения домой.</p>
            <blockquote>Ваш успех становится<br />их дорогой.</blockquote>
          </div>
        </div>
      </section>

      <section id="legacy" data-chapter="legacy" className="territories cream-section">
        <SlideBackground src={IMAGES.territories} alt="Узорные окна мечети и ритм света" className="pattern-focus" />
        <div className="slide-shade" />
        <div className="chapter-word chapter-word-legacy" aria-hidden="true">Наследие</div>
        <div className="page-shell">
          <p className="section-number dark">03 / Наследие</p>
          <h2 className="display-title dark reveal">Не один продукт.<br />Целая территория.</h2>
          <div className="territory-list">
            {territories.map((item) => (
              <article className="territory reveal" key={item.name}>
                <span className="territory-number">{item.n}</span>
                <div><h3>{item.name}</h3><blockquote>«{item.line}»</blockquote><p>{item.copy}</p></div>
                <div className={`line-metaphor ${item.shape}`} aria-hidden="true"><i /><i /><i /><i /></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="horizons light-section">
        <SlideBackground src={IMAGES.horizons} alt="Светлая исламская колоннада под открытым небом" className="architecture-focus" />
        <div className="slide-shade" />
        <div className="page-shell">
          <p className="section-kicker dark">Реалистичный запуск</p>
          <h2 className="display-title dark reveal">Не набор красивых идей.<br />Последовательная<br />продуктовая система.</h2>
          <div className="horizon-stack">
            <article className="horizon h1 reveal"><span>Ближний горизонт</span><h3>Можно пилотировать сейчас</h3><p>«Тихий премиум» · «Сначала родители» · сопровождение до и после поездки</p><small>Определить стандарт сервиса и провести закрытый пилот.</small></article>
            <article className="horizon h2 reveal"><span>Средний горизонт</span><h3>Создаём совместно</h3><p>«Капитал намерения» · «Путь длиною в год»</p><small>Интегрировать финансовую цель, цифровой путь и операционное сопровождение.</small></article>
            <article className="horizon h3 reveal"><span>Дальний горизонт</span><h3>Требует финансовой и шариатской проработки</h3><p>«Вечный паломник» · «Семейный аманат» · «Двойной след»</p><small>Проверить структуру дохода, резерв, наследование и допустимость механизмов.</small></article>
          </div>
        </div>
      </section>

      <section className="value forest-section">
        <SlideBackground src={IMAGES.value} alt="Свет в молитвенном зале мечети" className="prayer-hall-focus" />
        <div className="slide-shade" />
        <div className="page-shell">
          <p className="section-kicker">Ценность экосистемы</p>
          <h2 className="display-title reveal">Ценность, которая<br />не заканчивается<br />одной поездкой.</h2>
          <div className="value-columns">
            <article className="reveal"><span>01</span><h3>Для клиента</h3><ul><li>Путь без финансовой тревоги</li><li>Забота о родителях и семье</li><li>Премиум без показной роскоши</li><li>Сохранение смысла после возвращения</li><li>Семейная традиция</li></ul></article>
            <article className="reveal"><span>02</span><h3>Для IMAN</h3><ul><li>Длительные отношения с капиталом</li><li>Регулярные финансовые привычки</li><li>Удержание премиальных инвесторов</li><li>Семейное расширение клиентской базы</li><li>Продуктовая дифференциация</li></ul></article>
            <article className="reveal"><span>03</span><h3>Для нашей команды</h3><ul><li>Роль продуктового партнёра</li><li>Методология паломнического опыта</li><li>Стандарт премиального исполнения</li><li>Ответственность за весь путь клиента</li><li>Долгосрочная модель</li></ul></article>
          </div>
        </div>
      </section>

      <section id="pilot" className="pilot dark-section">
        <SlideBackground src={IMAGES.pilot} alt="Открытый Коран и тасбих" className="quran-focus" />
        <div className="slide-shade" />
        <div className="page-shell">
          <p className="section-kicker">Предлагаемый первый шаг</p>
          <h2 className="display-title reveal">Начать не с большого запуска.<br />Начать с правильно<br />пройденного пути.</h2>
          <ol className="pilot-steps">
            <li className="reveal"><span>01</span><p>Совместная продуктовая сессия IMAN и нашей команды</p></li>
            <li className="reveal"><span>02</span><p>Интервью с небольшой группой премиальных клиентов и инвесторов</p></li>
            <li className="reveal"><span>03</span><p>Проверка финансовых и шариатских механизмов</p></li>
            <li className="reveal"><span>04</span><p>Создание стандарта «Тихого премиума» и прототипа первого продукта</p></li>
            <li className="reveal"><span>05</span><p>Закрытый пилот и оценка клиентского опыта, интереса и повторного участия</p></li>
          </ol>
          <blockquote className="pilot-mantra">Один маршрут.<br />Одна группа.<br />Один стандарт.<br /><em>Одна проверенная модель.</em></blockquote>
        </div>
      </section>

      <section className="finale">
        <img src={IMAGES.final} loading="lazy" alt="Светлый вид на мечеть Пророка в Медине под открытым небом" />
        <div className="final-wash" />
        <div className="page-shell finale-content reveal">
          <p className="section-kicker dark">Предлагаем создать не ещё один туристический продукт</p>
          <h2>Создадим путь,<br />который продолжает работать.</h2>
          <p>IMAN управляет капиталом.<br />Мы придаём ему направление.</p>
          <small>Концепция партнёрской экосистемы паломничества</small>
        </div>
      </section>

      <footer className="sources">
        <div className="page-shell"><span>IMAN × EXPERIENCE · концептуальный прототип</span><span>Фотографии: <a href="https://unsplash.com/license">Unsplash</a> · <a href="https://www.pexels.com/license/">Pexels</a></span></div>
      </footer>
    </main>
  );
}
