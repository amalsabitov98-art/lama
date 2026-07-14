#!/usr/bin/env bash
# Voice Studio — установка.
#
# Использование:
#   ./install.sh                 — обычная установка (про Wav2Lip спросит)
#   ./install.sh --with-wav2lip  — сразу поставить и Wav2Lip
#   ./install.sh --no-wav2lip    — без Wav2Lip (ничего не спрашивает)

set -e

cd "$(dirname "$0")"

WAV2LIP_MODE="ask"
for arg in "$@"; do
  case "$arg" in
    --with-wav2lip) WAV2LIP_MODE="yes" ;;
    --no-wav2lip)   WAV2LIP_MODE="no" ;;
    *) echo "Неизвестный флаг: $arg (доступны --with-wav2lip / --no-wav2lip)"; exit 1 ;;
  esac
done

echo "🎛️  Voice Studio — установка"
echo "─────────────────────────────"

# --- 1. Python ---------------------------------------------------------------
PYTHON="${PYTHON:-python3}"
if ! command -v "$PYTHON" >/dev/null 2>&1; then
  echo "❌ Не найден python3. Установи Python 3.9+ и запусти скрипт снова."
  exit 1
fi
echo "✅ Python: $($PYTHON --version)"

# --- 2. venv + зависимости ---------------------------------------------------
if [ ! -d ".venv" ]; then
  echo "📦 Создаю виртуальное окружение .venv…"
  "$PYTHON" -m venv .venv
else
  echo "📦 Виртуальное окружение .venv уже есть — использую его."
fi

echo "📦 Ставлю зависимости из requirements.txt (может занять несколько минут)…"
.venv/bin/pip install --upgrade pip >/dev/null
.venv/bin/pip install -r requirements.txt
echo "✅ Python-зависимости установлены."

# --- 3. ffmpeg ---------------------------------------------------------------
if command -v ffmpeg >/dev/null 2>&1; then
  echo "✅ ffmpeg найден: $(ffmpeg -version 2>/dev/null | head -n 1)"
else
  echo ""
  echo "⚠️  ffmpeg НЕ найден — без него не собрать видео!"
  echo "   Поставь его системно и вернись:"
  echo "     macOS:   brew install ffmpeg"
  echo "     Ubuntu:  sudo apt install ffmpeg"
  echo ""
fi

# --- 4. Wav2Lip (опционально) --------------------------------------------------
if [ "$WAV2LIP_MODE" = "ask" ]; then
  echo ""
  echo "🎬 Wav2Lip — опциональный липсинк для режима «Говорящий в кадре»."
  echo "   На компе без видеокарты NVIDIA он работает, но МЕДЛЕННО."
  echo "   Режим «Закадровая озвучка» работает и без него."
  read -r -p "   Установить Wav2Lip? [y/N] " answer || answer=""
  case "$answer" in
    [yYдД]*) WAV2LIP_MODE="yes" ;;
    *)       WAV2LIP_MODE="no" ;;
  esac
fi

if [ "$WAV2LIP_MODE" = "yes" ]; then
  if [ -d "third_party/Wav2Lip" ]; then
    echo "✅ Wav2Lip уже лежит в third_party/Wav2Lip — пропускаю клонирование."
  elif ! command -v git >/dev/null 2>&1; then
    echo "⚠️  Не найден git — не могу склонировать Wav2Lip. Поставь git и повтори."
  else
    echo "⬇️  Клонирую Wav2Lip в third_party/Wav2Lip…"
    mkdir -p third_party
    if git clone --depth 1 https://github.com/Rudrabha/Wav2Lip third_party/Wav2Lip; then
      echo "✅ Wav2Lip склонирован."
    else
      echo "⚠️  Не получилось склонировать Wav2Lip (нет сети?). Можно повторить позже:"
      echo "     git clone https://github.com/Rudrabha/Wav2Lip third_party/Wav2Lip"
    fi
  fi
  mkdir -p third_party/Wav2Lip/checkpoints
  if [ -f "third_party/Wav2Lip/checkpoints/wav2lip_gan.pth" ]; then
    echo "✅ Веса wav2lip_gan.pth уже на месте."
  else
    echo ""
    echo "📌 Остался один шаг вручную: скачай веса wav2lip_gan.pth"
    echo "   (ссылки — в README репозитория Wav2Lip) и положи файл сюда:"
    echo "     third_party/Wav2Lip/checkpoints/wav2lip_gan.pth"
  fi
else
  echo "⏭️  Wav2Lip пропущен. Липсинк можно доустановить позже: ./install.sh --with-wav2lip"
fi

# --- Готово --------------------------------------------------------------------
echo ""
echo "🎉 Готово! Запуск:"
echo "   source .venv/bin/activate"
echo "   python app.py"
