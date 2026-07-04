#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
busywork.py — имитатор бурной деятельности для терминала.

Печатает псевдокод "как живой человек", мелькает тематическими словами
(turon, tour, турист, пассажир, рейс, бронь...), рисует фейковые
прогресс-бары и время от времени "останавливается", спрашивая
подтверждение следующего шага.

Запуск:
    python3 busywork.py                 # обычный режим, бесконечный цикл
    python3 busywork.py --fast          # печатать быстрее
    python3 busywork.py --slow          # печатать медленнее
    python3 busywork.py --no-confirm    # не ждать ввода, всё авто
    python3 busywork.py --once          # один проход и выход

Выход в любой момент — Ctrl+C.
"""

import argparse
import itertools
import os
import random
import sys
import time

# ------------------------------------------------------------------ #
#  ANSI-цвета
# ------------------------------------------------------------------ #
class C:
    reset = "\033[0m"
    dim = "\033[2m"
    bold = "\033[1m"
    gray = "\033[90m"
    red = "\033[91m"
    green = "\033[92m"
    yellow = "\033[93m"
    blue = "\033[94m"
    magenta = "\033[95m"
    cyan = "\033[96m"
    white = "\033[97m"


# ------------------------------------------------------------------ #
#  Тематические слова и статус-строки
# ------------------------------------------------------------------ #
WORDS = [
    "turon", "tour", "logo", "турист", "пассажир", "рейс", "бронь",
    "маршрут", "отель", "трансфер", "гид", "виза", "билет", "ваучер",
    "экскурсия", "booking", "payment", "invoice", "operator", "voucher",
    "itinerary", "checkout", "manifest", "passenger", "route", "resort",
]

MODULES = [
    "turon.booking.core", "turon.tour.catalog", "turon.passenger.registry",
    "turon.payment.gateway", "turon.logo.assets", "turon.route.planner",
    "turon.hotel.inventory", "turon.visa.pipeline", "turon.transfer.dispatch",
    "turon.voucher.render", "turon.notify.sms", "turon.report.finance",
]

TASKS = [
    "синхронизация каталога туров",
    "пересчёт цен на рейсы",
    "валидация паспортов пассажиров",
    "генерация ваучеров",
    "индексация отелей",
    "обновление логотипов операторов",
    "построение маршрутов",
    "выгрузка манифеста рейса",
    "проверка виз туристов",
    "начисление комиссии агентам",
]

CONFIRMS = [
    "Применить миграцию к таблице bookings?",
    "Задеплоить turon.payment.gateway в production?",
    "Пересчитать все брони за текущий сезон?",
    "Отправить 1 248 уведомлений пассажирам?",
    "Перегенерировать ваучеры для рейса TRN-4471?",
    "Обновить логотипы всех тур-операторов?",
    "Синхронизировать каталог с внешним API туров?",
    "Очистить кэш маршрутов и переиндексировать?",
]

# ------------------------------------------------------------------ #
#  Готовые блоки "кода" (тема — тур-платформа)
# ------------------------------------------------------------------ #
CODE_BLOCKS = [
    # Python
    ("py", """\
def rebuild_tour_index(operator: str) -> int:
    tours = catalog.fetch(operator=operator, active=True)
    idx = SearchIndex("turon-tours")
    for t in tours:
        idx.upsert(t.id, {
            "title": t.title,
            "route": t.route,
            "price": t.price_from,
            "hotel": t.hotel.name,
        })
    idx.commit()
    return len(tours)
"""),
    # Python
    ("py", """\
class PassengerValidator:
    def validate(self, passenger):
        if not passenger.passport:
            raise BookingError("нет паспорта у пассажира")
        if passenger.visa_required and not passenger.visa:
            self.queue.enqueue_visa(passenger.id)
        return passenger.normalized()
"""),
    # SQL
    ("sql", """\
SELECT b.id, b.tour_id, p.full_name, r.departure_at
FROM bookings b
JOIN passengers p ON p.booking_id = b.id
JOIN routes r     ON r.id = b.route_id
WHERE b.status = 'confirmed'
  AND r.departure_at BETWEEN now() AND now() + interval '30 days'
ORDER BY r.departure_at ASC;
"""),
    # JS/TS
    ("ts", """\
export async function issueVoucher(bookingId: string) {
  const booking = await api.get(`/bookings/${bookingId}`);
  const pdf = await renderVoucher({
    logo: booking.operator.logo,
    tour: booking.tour.title,
    passengers: booking.passengers,
    route: booking.route,
  });
  return storage.put(`vouchers/${bookingId}.pdf`, pdf);
}
"""),
    # Go
    ("go", """\
func (s *TransferService) Dispatch(ctx context.Context, r Route) error {
    drivers := s.pool.Available(r.Airport)
    if len(drivers) == 0 {
        return fmt.Errorf("нет свободных трансферов на %s", r.Airport)
    }
    d := pickNearest(drivers, r.Pickup)
    return s.notify.Push(d.ID, "новый пассажир: "+r.PassengerName)
}
"""),
    # YAML / config
    ("yaml", """\
service: turon-booking
replicas: 4
env:
  CATALOG_URL: https://api.turon.tours/v2
  PAYMENT_MODE: production
  MAX_PASSENGERS_PER_ROUTE: 52
healthcheck:
  path: /healthz
  interval: 10s
"""),
]

# ------------------------------------------------------------------ #
#  Утилиты вывода
# ------------------------------------------------------------------ #
SPEED = 1.0          # множитель задержек (меняется флагами)
CONFIRM = True       # ждать ли подтверждения


def _sleep(base):
    time.sleep(base * SPEED)


def type_out(text, color=C.white, cps_min=0.004, cps_max=0.022):
    """Печатает text посимвольно с человекоподобными паузами."""
    sys.stdout.write(color)
    for ch in text:
        sys.stdout.write(ch)
        sys.stdout.flush()
        if ch == "\n":
            _sleep(random.uniform(0.02, 0.09))
        elif ch in " ,.:;()":
            _sleep(random.uniform(cps_min, cps_max) * 1.6)
        else:
            _sleep(random.uniform(cps_min, cps_max))
        # изредка "задумываемся"
        if random.random() < 0.015:
            _sleep(random.uniform(0.15, 0.5))
    sys.stdout.write(C.reset)
    sys.stdout.flush()


def line(text="", color=C.reset):
    sys.stdout.write(color + text + C.reset + "\n")
    sys.stdout.flush()


def status(text, color=C.cyan):
    ts = time.strftime("%H:%M:%S")
    line(f"{C.gray}[{ts}]{C.reset} {color}{text}{C.reset}")


def spinner(text, seconds=1.6):
    frames = "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏"
    end = time.time() + seconds * SPEED
    i = 0
    while time.time() < end:
        sys.stdout.write(f"\r{C.yellow}{frames[i % len(frames)]}{C.reset} {text}")
        sys.stdout.flush()
        time.sleep(0.08)
        i += 1
    sys.stdout.write(f"\r{C.green}✓{C.reset} {text}   \n")
    sys.stdout.flush()


def progress(text, steps=24):
    for i in range(steps + 1):
        pct = int(i / steps * 100)
        bar = "█" * i + "░" * (steps - i)
        sys.stdout.write(f"\r  {C.blue}{bar}{C.reset} {pct:3d}%  {C.dim}{text}{C.reset}")
        sys.stdout.flush()
        _sleep(random.uniform(0.02, 0.11))
    sys.stdout.write("\n")
    sys.stdout.flush()


def word_cloud():
    """Строка из мелькающих тематических слов."""
    n = random.randint(3, 6)
    chosen = random.sample(WORDS, n)
    colors = [C.magenta, C.cyan, C.yellow, C.green, C.blue]
    parts = [f"{random.choice(colors)}{w}{C.reset}" for w in chosen]
    line("   " + f"{C.dim}·{C.reset} ".join(parts))


def confirm_step():
    q = random.choice(CONFIRMS)
    line("")
    line(f"{C.yellow}{C.bold}?{C.reset} {C.bold}{q}{C.reset}")
    if not CONFIRM:
        _sleep(0.6)
        line(f"  {C.green}→ авто-подтверждение (y){C.reset}")
        return
    try:
        sys.stdout.write(f"  {C.gray}[y/n]{C.reset} ")
        sys.stdout.flush()
        ans = input().strip().lower()
    except EOFError:
        ans = "y"
    if ans in ("n", "no", "н", "нет"):
        line(f"  {C.red}✗ отменено пользователем{C.reset}")
    else:
        line(f"  {C.green}✓ продолжаю...{C.reset}")


# ------------------------------------------------------------------ #
#  Один "рабочий" цикл
# ------------------------------------------------------------------ #
def one_pass():
    module = random.choice(MODULES)
    task = random.choice(TASKS)
    status(f"открываю модуль {C.bold}{module}{C.reset}{C.cyan}  ({task})", C.cyan)
    _sleep(random.uniform(0.3, 0.8))

    lang, code = random.choice(CODE_BLOCKS)
    fname = module.replace(".", "/") + {"py": ".py", "sql": ".sql", "ts": ".ts",
                                        "go": ".go", "yaml": ".yaml"}[lang]
    line(f"{C.gray}── редактирую {fname} ──{C.reset}")
    type_out(code, color=C.white)
    line("")

    word_cloud()
    _sleep(random.uniform(0.2, 0.6))

    # немного "работы"
    action = random.choice([
        ("линтер", "ruff check ."),
        ("тесты", f"pytest {module.split('.')[-1]}"),
        ("сборка", "docker build -t turon/booking ."),
        ("индексация", "reindex tours"),
        ("миграция", "alembic upgrade head"),
    ])
    spinner(f"{action[0]}: {C.dim}{action[1]}{C.reset}")

    if random.random() < 0.7:
        progress(random.choice(TASKS))

    # изредка — предупреждение для реалистичности
    if random.random() < 0.25:
        status(f"WARN: {random.choice(WORDS)} кэш устарел, обновляю", C.yellow)
        _sleep(0.4)

    # шаг с подтверждением
    if random.random() < 0.45:
        confirm_step()

    status(f"готово: {task} ✓", C.green)
    line("")


# ------------------------------------------------------------------ #
#  main
# ------------------------------------------------------------------ #
def main():
    global SPEED, CONFIRM
    p = argparse.ArgumentParser(description="Имитатор бурной деятельности.")
    p.add_argument("--fast", action="store_true", help="печатать быстрее")
    p.add_argument("--slow", action="store_true", help="печатать медленнее")
    p.add_argument("--no-confirm", action="store_true", help="не ждать ввода")
    p.add_argument("--once", action="store_true", help="один проход и выход")
    args = p.parse_args()

    if args.fast:
        SPEED = 0.4
    if args.slow:
        SPEED = 2.0
    if args.no_confirm:
        CONFIRM = False

    os.system("")  # включить ANSI в старых Windows-терминалах

    line("")
    line(f"{C.bold}{C.magenta}  Turon Tour · dev console{C.reset}  {C.dim}(Ctrl+C — выход){C.reset}")
    line(f"{C.gray}  ─────────────────────────────────────────{C.reset}")
    line("")

    try:
        if args.once:
            one_pass()
        else:
            for _ in itertools.count():
                one_pass()
                _sleep(random.uniform(0.5, 1.5))
    except KeyboardInterrupt:
        line("")
        line(f"{C.gray}  сессия завершена. до встречи!{C.reset}")
        sys.exit(0)


if __name__ == "__main__":
    main()
