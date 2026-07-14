"""Распознавание речи из ролика (Whisper) — чтобы не печатать текст с нуля.

Достаём звук из видео (ffmpeg) и прогоняем через faster-whisper. Работает на CPU.
Пользователь получает готовый текст оригинала, правит его и уже этот текст
озвучивается выбранным голосом.
"""

from __future__ import annotations

import subprocess
import tempfile
from pathlib import Path

from .mux import _require

# tiny/base — быстро на CPU; small/medium — точнее, но медленнее.
DEFAULT_MODEL = "base"


def _extract_audio(video_path: Path, wav_path: Path) -> None:
    ffmpeg = _require("ffmpeg")
    proc = subprocess.run(
        [ffmpeg, "-y", "-i", str(video_path),
         "-vn", "-ac", "1", "-ar", "16000", str(wav_path)],
        capture_output=True, text=True,
    )
    if proc.returncode != 0:
        raise RuntimeError(f"Не смог извлечь звук из видео:\n{proc.stderr.strip()}")


class Transcriber:
    """Обёртка над faster-whisper с ленивой загрузкой модели."""

    def __init__(self, model_name: str = DEFAULT_MODEL, device: str = "cpu"):
        self.model_name = model_name
        self.device = device
        self._model = None

    def _ensure_model(self):
        if self._model is not None:
            return self._model
        try:
            from faster_whisper import WhisperModel
        except ImportError as exc:
            raise RuntimeError(
                "Не установлен faster-whisper. Поставь зависимости: "
                "pip install -r requirements.txt"
            ) from exc
        # int8 — компактно и быстро на CPU
        self._model = WhisperModel(self.model_name, device=self.device, compute_type="int8")
        return self._model

    def transcribe(self, video_path: str | Path, language: str | None = None) -> str:
        """Вернуть распознанный текст речи из видео (одной строкой/абзацем)."""
        video_path = Path(video_path)
        if not video_path.is_file():
            raise FileNotFoundError(f"Видео не найдено: {video_path}")

        model = self._ensure_model()
        with tempfile.TemporaryDirectory() as tmp:
            wav = Path(tmp) / "audio.wav"
            _extract_audio(video_path, wav)
            segments, _info = model.transcribe(str(wav), language=language)
            text = " ".join(seg.text.strip() for seg in segments)
        return text.strip()
