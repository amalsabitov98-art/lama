"""Синтез речи выбранным голосом (XTTS-v2 от Coqui).

Работает и на CPU (медленнее), и на GPU. Модель тяжёлая, поэтому грузим лениво —
первый вызов синтеза скачает/инициализирует её, дальше она держится в памяти.

Один и тот же `Voice` даёт стабильный тембр: XTTS клонирует его из референс-
сэмпла при каждом синтезе.
"""

from __future__ import annotations

import os
from pathlib import Path

from .voices import Voice, VoiceLibrary

# XTTS при первом скачивании спрашивает согласие с лицензией через stdin ([y/n]).
# В неинтерактивной среде (Colab, сервер) это виснет навечно. Авто-соглашаемся.
os.environ.setdefault("COQUI_TOS_AGREED", "1")

# Модель по умолчанию. Многоязычная, умеет клон голоса из короткого сэмпла.
DEFAULT_MODEL = "tts_models/multilingual/multi-dataset/xtts_v2"


def _pick_device(prefer: str = "auto") -> str:
    """Выбираем cpu/cuda. На обычном компе без NVIDIA вернётся 'cpu'."""
    if prefer in ("cpu", "cuda"):
        return prefer
    try:
        import torch  # локальная зависимость, ставится вместе с TTS

        return "cuda" if torch.cuda.is_available() else "cpu"
    except Exception:
        return "cpu"


class TTSEngine:
    """Обёртка над Coqui XTTS с ленивой загрузкой модели."""

    def __init__(
        self,
        library: VoiceLibrary,
        model_name: str = DEFAULT_MODEL,
        device: str = "auto",
    ):
        self.library = library
        self.model_name = model_name
        self.device = _pick_device(device)
        self._tts = None  # ленивая инициализация

    @property
    def is_cpu(self) -> bool:
        return self.device == "cpu"

    def _ensure_model(self):
        if self._tts is not None:
            return self._tts
        try:
            from TTS.api import TTS  # тяжёлый импорт — только когда реально нужен
        except ImportError as exc:
            raise RuntimeError(
                "Не установлен пакет TTS (Coqui). Поставь зависимости: "
                "pip install -r requirements.txt"
            ) from exc
        self._tts = TTS(self.model_name).to(self.device)
        return self._tts

    def synthesize(
        self,
        text: str,
        voice: Voice,
        out_path: str | Path,
        language: str | None = None,
    ) -> Path:
        """Озвучить `text` голосом `voice`, сохранить WAV в `out_path`."""
        text = (text or "").strip()
        if not text:
            raise ValueError("Пустой текст — нечего озвучивать")

        sample = voice.resolve_sample(self.library.root)
        if not sample.is_file():
            raise FileNotFoundError(
                f"Референс-сэмпл голоса {voice.name!r} потерян: {sample}"
            )

        out_path = Path(out_path)
        out_path.parent.mkdir(parents=True, exist_ok=True)

        tts = self._ensure_model()
        tts.tts_to_file(
            text=text,
            speaker_wav=str(sample),
            language=language or voice.language,
            file_path=str(out_path),
        )
        return out_path
