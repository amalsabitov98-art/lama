// Уважаем системную настройку «уменьшить движение»
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Универсальный «выезд снизу» с задержкой (stagger)
function riseIn(el, delay = 0) {
  el.animate(
    [{ opacity: 0, transform: 'translateY(30px)' }, { opacity: 1, transform: 'translateY(0)' }],
    { duration: 850, delay, fill: 'both', easing: 'cubic-bezier(.16,.84,.28,1)' }
  );
}

// Прогоняет прямых потомков контейнера каскадом
function staggerChildren(container, step = 90, base = 0) {
  [...container.children].forEach((el, i) => riseIn(el, base + i * step));
}

if (reduce) {
  // Без анимаций — просто показываем всё как есть
} else {
  // 1) Hero: заголовок и подписи каскадом при загрузке
  const hero = document.querySelector('.hero-copy');
  if (hero) staggerChildren(hero, 120);

  // 2) Секции текста и карточки дней — выезжают при появлении в кадре
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const t = entry.target;
      if (t.classList.contains('day')) {
        staggerChildren(t.querySelector('.day-info'), 110);
      } else {
        staggerChildren(t, 90);
      }
      io.unobserve(t);
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.statement, .days-intro, .day, .manifest > div:last-child')
    .forEach((el) => io.observe(el));
}

// 3) Бесшовный cross-fade между фото дней (общий фиксированный фон)
const bg = document.querySelector('.day-bg');
if (bg) {
  const layers = [...bg.querySelectorAll('.layer')];
  const days = [...document.querySelectorAll('.day')];
  let ticking = false;

  function paint() {
    ticking = false;
    const vh = window.innerHeight;
    const viewCenter = window.scrollY + vh / 2;
    days.forEach((day, i) => {
      const rect = day.getBoundingClientRect();
      const center = rect.top + window.scrollY + rect.height / 2;
      const dist = Math.abs(center - viewCenter) / vh;      // 0 — по центру, 1 — экран прочь
      const vis = Math.max(0, 1 - dist);                    // «сколько видно» этого дня
      const layer = layers[i];
      if (!layer) return;
      layer.style.opacity = vis.toFixed(3);
      if (!reduce) layer.style.transform = 'scale(' + (1.03 + 0.03 * vis).toFixed(3) + ')';
    });
  }
  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(paint); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', paint);
  paint();
}
