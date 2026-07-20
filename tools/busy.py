#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
busy.py — имитатор «бурной деятельности» для проекта Turon Tour (Батуми ⇄ Ризе).

Запусти в терминале и оставь работать: скрипт бесконечно печатает правдоподобный
поток логов, будто агент прямо сейчас строит сайт — пишет файлы, гоняет тесты,
собирает бандл, коммитит. Строки перемешиваются и параметризуются случайно,
поэтому картинка не повторяется много минут.

Запуск:
    python3 tools/busy.py               # обычный режим
    python3 tools/busy.py --fast        # быстрее
    python3 tools/busy.py --slow        # спокойнее
    python3 tools/busy.py --no-color    # без цветов
Остановить: Ctrl+C
"""

import sys
import time
import random
import datetime
import itertools

# ----------------------------------------------------------------------------
# Настройки скорости
# ----------------------------------------------------------------------------
SPEED = 1.0
if "--fast" in sys.argv:
    SPEED = 0.45
if "--slow" in sys.argv:
    SPEED = 1.8
USE_COLOR = "--no-color" not in sys.argv and sys.stdout.isatty()


# ----------------------------------------------------------------------------
# Цвета
# ----------------------------------------------------------------------------
class C:
    RESET = "\033[0m"
    DIM = "\033[2m"
    BOLD = "\033[1m"
    GRAY = "\033[90m"
    RED = "\033[91m"
    GREEN = "\033[92m"
    YELLOW = "\033[93m"
    BLUE = "\033[94m"
    MAGENTA = "\033[95m"
    CYAN = "\033[96m"
    WHITE = "\033[97m"


def c(text, color):
    if not USE_COLOR:
        return text
    return f"{color}{text}{C.RESET}"


def ts():
    return datetime.datetime.now().strftime("%H:%M:%S")


def out(line):
    sys.stdout.write(line + "\n")
    sys.stdout.flush()


def nap(a, b):
    time.sleep(random.uniform(a, b) * SPEED)


# ----------------------------------------------------------------------------
# Словари контента — всё вокруг реального проекта Turon Tour
# ----------------------------------------------------------------------------
FILES = [
    "index.html", "css/theme.css", "css/base.css", "css/home.css",
    "css/sections.css", "css/pages.css", "js/main.js", "js/quote.js",
    "js/tours.js", "js/booking.js", "data/tours.json", "pages/faq.html",
    "pages/gallery.html", "pages/about.html", "assets/img/favicon.svg",
]

COMPONENTS = [
    "hero", "quote-calculator", "tours-grid", "route-timeline", "features",
    "reviews", "booking-form", "contact-cards", "site-footer", "nav-menu",
    "gallery-svg", "faq-accordion",
]

TOURS = [
    "Прямой трансфер Батуми → Ризе", "Чайные холмы Ризе",
    "Долина Фыртына и водопады", "Батуми ⇄ Ризе туда-обратно",
    "Шопинг-тур в Ризе", "Семейный день у моря",
]

CITIES = ["Батуми", "Сарпи", "Хопа", "Ардешен", "Ризе", "Чамлыхемшин"]

TASKS = [
    "адаптив карточек туров под мобильные",
    "пересчёт сезонного коэффициента в калькуляторе",
    "валидацию телефона в форме бронирования",
    "тёмную тему для секции маршрута",
    "SVG-иллюстрацию чайных плантаций",
    "плавное появление секций при скролле",
    "ленивую загрузку данных туров из JSON",
    "мета-теги Open Graph для превью в мессенджерах",
    "скидку для групп от 8 человек",
    "интеграцию кнопки WhatsApp с готовым сообщением",
]

THINKING = [
    "Проверяю контраст текста на бирюзовом фоне — WCAG AA…",
    "Считаю, помещается ли таймлайн в 760px без переносов…",
    "Прикидываю сетку туров: auto-fill minmax(320px, 1fr)…",
    "Сверяю тарифы в data/tours.json с прайсом менеджера…",
    "Ищу, где ломается вёрстка формы на 360px…",
    "Оцениваю вес favicon.svg — норм, инлайнить не буду…",
    "Думаю над порядком остановок: Сарпи раньше Хопы…",
    "Проверяю, не конфликтуют ли .section и .cta по паддингам…",
]

GIT_MSGS = [
    "fix(booking): корректная валидация турецких номеров",
    "style(hero): выровнять статистику на мобильных",
    "feat(tours): добавить бейдж «Выгодно» для round-trip",
    "refactor(css): вынести токены отступов в 8px-шкалу",
    "perf(gallery): упростить path водопада в SVG",
    "fix(quote): не давать отрицательное число пассажиров",
    "chore(seo): добавить description для страницы FAQ",
    "feat(route): подсветка активной остановки при наведении",
]

NPM_PKGS = [
    "postcss@8.4.35", "autoprefixer@10.4.18", "esbuild@0.20.2",
    "html-minifier-terser@7.2.0", "lightningcss@1.24.0", "sharp@0.33.3",
]


# ----------------------------------------------------------------------------
# Мелкие визуальные помощники
# ----------------------------------------------------------------------------
def progress_bar(label, width=28, steps=None):
    steps = steps or random.randint(12, 26)
    for i in range(steps + 1):
        pct = int(i / steps * 100)
        filled = int(i / steps * width)
        bar = "█" * filled + "░" * (width - filled)
        sys.stdout.write(f"\r  {c(label, C.CYAN)} [{c(bar, C.GREEN)}] {pct:3d}%")
        sys.stdout.flush()
        time.sleep(random.uniform(0.02, 0.10) * SPEED)
    sys.stdout.write("\n")
    sys.stdout.flush()


def spinner(label, seconds=None):
    seconds = seconds or random.uniform(1.2, 3.0)
    frames = itertools.cycle("⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏")
    end = time.time() + seconds * SPEED
    while time.time() < end:
        sys.stdout.write(f"\r  {c(next(frames), C.YELLOW)} {label}")
        sys.stdout.flush()
        time.sleep(0.08)
    sys.stdout.write(f"\r  {c('✓', C.GREEN)} {label}\n")
    sys.stdout.flush()


def tag(label, color):
    return c(f" {label} ", color)


# ----------------------------------------------------------------------------
# «Сцены» — независимые кусочки активности
# ----------------------------------------------------------------------------
def scene_edit():
    f = random.choice(FILES)
    task = random.choice(TASKS)
    out(f"{c(ts(), C.GRAY)} {tag('EDIT', C.BLUE)} правлю {c(f, C.WHITE)} — {task}")
    nap(0.3, 0.8)
    added = random.randint(3, 48)
    removed = random.randint(0, 20)
    out(f"           {c('+' + str(added), C.GREEN)} / {c('-' + str(removed), C.RED)} строк, "
        f"{c('записано ✓', C.GREEN)}")
    nap(0.4, 1.1)


def scene_think():
    out(f"{c(ts(), C.GRAY)} {tag('THINK', C.MAGENTA)} {random.choice(THINKING)}")
    spinner("рассуждаю", random.uniform(1.0, 2.4))
    nap(0.2, 0.6)


def scene_test():
    total = random.randint(18, 64)
    out(f"{c(ts(), C.GRAY)} {tag('TEST', C.YELLOW)} запускаю проверки вёрстки и скриптов…")
    progress_bar("vitest", steps=random.randint(14, 22))
    failed = 0 if random.random() > 0.15 else random.randint(1, 2)
    passed = total - failed
    if failed:
        comp = random.choice(COMPONENTS)
        out(f"  {c('✗ ' + str(failed) + ' упало', C.RED)} · {c(comp, C.WHITE)}: "
            f"expected padding 24px, got 16px")
        nap(0.5, 1.0)
        out(f"  {c('↻ авто-фикс', C.YELLOW)}: подгоняю var(--space-5) в {c(random.choice(FILES), C.WHITE)}")
        nap(0.6, 1.2)
        out(f"  {c('✓ повтор:', C.GREEN)} все {total} проверок зелёные")
    else:
        out(f"  {c('✓ ' + str(passed) + ' passed', C.GREEN)}, 0 failed  "
            f"{c(f'({random.uniform(0.6, 2.4):.2f}s)', C.GRAY)}")
    nap(0.4, 1.0)


def scene_build():
    out(f"{c(ts(), C.GRAY)} {tag('BUILD', C.CYAN)} собираю продакшн-бандл esbuild…")
    progress_bar("bundle", steps=random.randint(16, 26))
    kb = random.uniform(28, 74)
    gz = kb * random.uniform(0.28, 0.36)
    out(f"  dist/app.js  {c(f'{kb:.1f}kb', C.WHITE)}  →  gzip {c(f'{gz:.1f}kb', C.GREEN)}")
    nap(0.3, 0.9)


def scene_git():
    msg = random.choice(GIT_MSGS)
    sha = "".join(random.choice("0123456789abcdef") for _ in range(7))
    files_n = random.randint(1, 4)
    out(f"{c(ts(), C.GRAY)} {tag('GIT', C.GREEN)} commit {c(sha, C.YELLOW)} — {msg}")
    out(f"           {files_n} file(s) changed, "
        f"{c('+' + str(random.randint(4, 90)), C.GREEN)} "
        f"{c('-' + str(random.randint(0, 30)), C.RED)}")
    nap(0.5, 1.2)
    if random.random() > 0.6:
        spinner("git push origin claude/dobroye-utro-i0yob0", random.uniform(1.0, 2.2))


def scene_fetch():
    tour = random.choice(TOURS)
    ms = random.randint(40, 260)
    out(f"{c(ts(), C.GRAY)} {tag('DATA', C.BLUE)} валидирую data/tours.json — «{c(tour, C.WHITE)}» "
        f"{c(f'{ms}ms', C.GRAY)} {c('ok', C.GREEN)}")
    nap(0.3, 0.7)


def scene_lighthouse():
    out(f"{c(ts(), C.GRAY)} {tag('AUDIT', C.MAGENTA)} прогоняю Lighthouse по главной…")
    spinner("emulating mobile · Moto G Power", random.uniform(1.4, 2.6))
    perf = random.randint(88, 100)
    a11y = random.randint(92, 100)
    seo = random.randint(90, 100)
    out(f"  Perf {c(str(perf), C.GREEN)}  ·  A11y {c(str(a11y), C.GREEN)}  ·  "
        f"SEO {c(str(seo), C.GREEN)}  ·  Best Practices {c(str(random.randint(90,100)), C.GREEN)}")
    nap(0.4, 1.0)


def scene_npm():
    pkg = random.choice(NPM_PKGS)
    out(f"{c(ts(), C.GRAY)} {tag('DEPS', C.YELLOW)} npm i {c(pkg, C.WHITE)}")
    spinner(f"resolving {pkg}", random.uniform(0.8, 2.0))
    out(f"  added 1 package, audited {random.randint(120, 480)} packages "
        f"{c('· 0 vulnerabilities', C.GREEN)}")
    nap(0.3, 0.8)


def scene_serve():
    port = random.choice([5173, 8080, 3000, 4321])
    out(f"{c(ts(), C.GRAY)} {tag('DEV', C.CYAN)} dev-сервер слушает "
        f"{c(f'http://localhost:{port}/', C.WHITE)} · HMR активен")
    nap(0.5, 1.1)
    out(f"           hot-reload: {c(random.choice(FILES), C.WHITE)} обновлён без перезагрузки")
    nap(0.3, 0.7)


def scene_route():
    a, b = random.sample(CITIES, 2)
    km = random.randint(20, 180)
    out(f"{c(ts(), C.GRAY)} {tag('MAP', C.BLUE)} пересчитываю сегмент маршрута "
        f"{c(a, C.WHITE)} → {c(b, C.WHITE)} ~{km} км")
    nap(0.3, 0.9)


# ----------------------------------------------------------------------------
# Плейлист сцен со взвешенной случайностью
# ----------------------------------------------------------------------------
SCENES = [
    (scene_edit, 26),
    (scene_think, 16),
    (scene_test, 12),
    (scene_git, 10),
    (scene_build, 8),
    (scene_fetch, 8),
    (scene_lighthouse, 5),
    (scene_serve, 5),
    (scene_route, 6),
    (scene_npm, 4),
]


def weighted_pick(prev):
    pool = [s for s in SCENES if s[0] is not prev]  # не повторять сцену подряд
    scenes, weights = zip(*pool)
    return random.choices(scenes, weights=weights, k=1)[0]


def banner():
    line = "═" * 62
    out(c(line, C.CYAN))
    out(c("  Turon Tour · dev pipeline", C.BOLD + C.WHITE) +
        c("  —  Батуми ⇄ Ризе", C.CYAN))
    out(c(f"  branch: claude/dobroye-utro-i0yob0   node v20.11.1   {ts()}", C.GRAY))
    out(c(line, C.CYAN))
    out("")


def main():
    banner()
    spinner("подтягиваю рабочее дерево, читаю CLAUDE.md", 1.6)
    out("")
    prev = None
    try:
        while True:
            scene = weighted_pick(prev)
            scene()
            prev = scene
            # изредка — пустая строка-пауза, как будто «думает»
            if random.random() > 0.75:
                nap(0.6, 1.6)
                out("")
    except KeyboardInterrupt:
        out("")
        out(c("  ⏹  остановлено. рабочее дерево чистое, изменения сохранены.", C.GRAY))
        out("")


if __name__ == "__main__":
    main()
