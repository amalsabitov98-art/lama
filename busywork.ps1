# busywork.ps1 - имитатор бурной деятельности для Windows (PowerShell, без Python).
#
# Запуск (скопируй строку в терминал PowerShell и нажми Enter):
#   powershell -ExecutionPolicy Bypass -File C:\Users\User\Downloads\busywork.ps1
#
# Флаги:
#   -Slow   печатать медленнее (солиднее издалека)
#   -Fast   печатать быстрее
# Выход в любой момент - Ctrl+C.

param(
    [switch]$Slow,
    [switch]$Fast
)

$ErrorActionPreference = "Stop"
$e = [char]27  # ESC для ANSI-цветов

# --- множитель скорости ---
$SPEED = 1.0
if ($Slow) { $SPEED = 2.0 }
if ($Fast) { $SPEED = 0.4 }

# --- цвета ---
$R  = "$e[0m"; $DIM = "$e[2m"; $B = "$e[1m"
$GRAY="$e[90m"; $RED="$e[91m"; $GREEN="$e[92m"; $YEL="$e[93m"
$BLUE="$e[94m"; $MAG="$e[95m"; $CYAN="$e[96m"; $WHITE="$e[97m"
$COLORS = @($MAG,$CYAN,$YEL,$GREEN,$BLUE)
$CHECK = [char]0x2713   # галочка
$MID   = [char]0x00B7   # разделитель ·

# --- словари ---
$WORDS = @("turon","tour","logo","турист","пассажир","рейс","бронь","маршрут",
    "отель","трансфер","гид","виза","билет","ваучер","экскурсия","booking",
    "payment","invoice","operator","voucher","itinerary","passenger","route","resort")

$MODULES = @("turon.booking.core","turon.tour.catalog","turon.passenger.registry",
    "turon.payment.gateway","turon.logo.assets","turon.route.planner",
    "turon.hotel.inventory","turon.visa.pipeline","turon.transfer.dispatch",
    "turon.voucher.render","turon.notify.sms","turon.report.finance")

$TASKS = @("синхронизация каталога туров","пересчёт цен на рейсы",
    "валидация паспортов пассажиров","генерация ваучеров","индексация отелей",
    "обновление логотипов операторов","построение маршрутов",
    "выгрузка манифеста рейса","проверка виз туристов","начисление комиссии агентам")

$CONFIRMS = @("Применить миграцию к таблице bookings?",
    "Задеплоить turon.payment.gateway в production?",
    "Пересчитать все брони за текущий сезон?",
    "Отправить 1 248 уведомлений пассажирам?",
    "Перегенерировать ваучеры для рейса TRN-4471?",
    "Обновить логотипы всех тур-операторов?",
    "Синхронизировать каталог с внешним API туров?",
    "Очистить кэш маршрутов и переиндексировать?")

$CODE_BLOCKS = @(
@"
def rebuild_tour_index(operator: str) -> int:
    tours = catalog.fetch(operator=operator, active=True)
    idx = SearchIndex("turon-tours")
    for t in tours:
        idx.upsert(t.id, {"title": t.title, "route": t.route})
    idx.commit()
    return len(tours)
"@,
@"
class PassengerValidator:
    def validate(self, passenger):
        if not passenger.passport:
            raise BookingError("нет паспорта у пассажира")
        if passenger.visa_required and not passenger.visa:
            self.queue.enqueue_visa(passenger.id)
        return passenger.normalized()
"@,
@"
SELECT b.id, b.tour_id, p.full_name, r.departure_at
FROM bookings b
JOIN passengers p ON p.booking_id = b.id
JOIN routes r     ON r.id = b.route_id
WHERE b.status = 'confirmed'
  AND r.departure_at BETWEEN now() AND now() + interval '30 days';
"@,
@"
export async function issueVoucher(bookingId) {
  const booking = await api.get(`/bookings/${bookingId}`);
  const pdf = await renderVoucher({
    logo: booking.operator.logo,
    tour: booking.tour.title,
    passengers: booking.passengers,
  });
  return storage.put(`vouchers/${bookingId}.pdf`, pdf);
}
"@,
@"
func (s *TransferService) Dispatch(ctx context.Context, r Route) error {
    drivers := s.pool.Available(r.Airport)
    if len(drivers) == 0 {
        return fmt.Errorf("нет свободных трансферов на %s", r.Airport)
    }
    d := pickNearest(drivers, r.Pickup)
    return s.notify.Push(d.ID, "новый пассажир: "+r.PassengerName)
}
"@
)

# --- утилиты ---
function Zzz($sec) { Start-Sleep -Milliseconds ([int]($sec * 1000 * $SPEED)) }

function Rand($arr) { $arr[(Get-Random -Maximum $arr.Count)] }

function TypeOut($text, $color) {
    foreach ($ch in $text.ToCharArray()) {
        Write-Host "$color$ch$R" -NoNewline
        if ($ch -eq "`n") { Zzz (Get-Random -Minimum 0.02 -Maximum 0.09) }
        elseif (" ,.:;()".Contains($ch)) { Zzz (Get-Random -Minimum 0.008 -Maximum 0.03) }
        else { Zzz (Get-Random -Minimum 0.004 -Maximum 0.022) }
        if ((Get-Random -Maximum 100) -lt 2) { Zzz (Get-Random -Minimum 0.15 -Maximum 0.5) }
    }
}

function Line($text) { Write-Host $text }

function Status($text, $color) {
    $ts = Get-Date -Format "HH:mm:ss"
    Write-Host "$GRAY[$ts]$R $color$text$R"
}

function Spinner($text, $seconds) {
    $frames = "|/-\".ToCharArray()
    $end = (Get-Date).AddSeconds($seconds * $SPEED)
    $i = 0
    while ((Get-Date) -lt $end) {
        Write-Host "`r$YEL$($frames[$i % $frames.Count])$R $text" -NoNewline
        Start-Sleep -Milliseconds 80
        $i++
    }
    Write-Host "`r$GREEN$CHECK$R $text   "
}

function ProgressBar($text) {
    $steps = 24
    for ($i = 0; $i -le $steps; $i++) {
        $pct = [int]($i / $steps * 100)
        $bar = ("#" * $i) + ("." * ($steps - $i))
        Write-Host "`r  $BLUE$bar$R $pct%  $DIM$text$R" -NoNewline
        Zzz (Get-Random -Minimum 0.02 -Maximum 0.11)
    }
    Write-Host ""
}

function WordCloud {
    $n = Get-Random -Minimum 3 -Maximum 6
    $chosen = $WORDS | Get-Random -Count $n
    $parts = foreach ($w in $chosen) { "$(Rand $COLORS)$w$R" }
    Write-Host ("   " + ($parts -join " $DIM$MID$R "))
}

function ConfirmStep {
    $q = Rand $CONFIRMS
    Write-Host ""
    Write-Host "$YEL$($B)?$R $B$q$R"
    Write-Host "  $GRAY[y/n]$R " -NoNewline
    Zzz (Get-Random -Minimum 1.0 -Maximum 2.4)
    TypeOut "y`n" $GREEN
    Write-Host "  $GREEN$CHECK продолжаю...$R"
}

function OnePass {
    $module = Rand $MODULES
    $task = Rand $TASKS
    Status "открываю модуль $B$module$R  ($task)" $CYAN
    Zzz (Get-Random -Minimum 0.3 -Maximum 0.8)

    Write-Host "$GRAY-- редактирую $($module -replace '\.','/').py --$R"
    TypeOut ((Rand $CODE_BLOCKS) + "`n") $WHITE
    Write-Host ""

    WordCloud
    Zzz (Get-Random -Minimum 0.2 -Maximum 0.6)

    $actions = @(@("линтер","ruff check ."), @("тесты","pytest"),
        @("сборка","docker build -t turon/booking ."), @("миграция","alembic upgrade head"))
    $a = Rand $actions
    Spinner "$($a[0]): $DIM$($a[1])$R" 1.6

    if ((Get-Random -Maximum 100) -lt 70) { ProgressBar (Rand $TASKS) }

    if ((Get-Random -Maximum 100) -lt 25) {
        Status "WARN: $(Rand $WORDS) кэш устарел, обновляю" $YEL
        Zzz 0.4
    }

    if ((Get-Random -Maximum 100) -lt 45) { ConfirmStep }

    Status "готово: $task $CHECK" $GREEN
    Write-Host ""
}

# --- main ---
Write-Host ""
Write-Host "$B$MAG  Turon Tour . dev console$R  $DIM(Ctrl+C - выход)$R"
Write-Host "$GRAY  -----------------------------------------$R"
Write-Host ""

while ($true) {
    OnePass
    Zzz (Get-Random -Minimum 0.5 -Maximum 1.5)
}
