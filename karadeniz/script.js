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
