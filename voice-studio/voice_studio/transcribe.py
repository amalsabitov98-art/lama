"""Распознавание речи из ролика (Whisper) — чтобы не печатать текст с нуля.

Достаём звук из видео (ffmpeg) и прогоняем через openai-whisper. Whisper работает
поверх torch — той же библиотеки, что и синтез голоса (XTTS), поэтому на Colab GPU
он стабилен (в отличие от faster-whisper/CTranslate2, который конфликтует с cuDNN
и роняет процесс).

Пользователь получает текст оригинала, правит его — и уже этот текст озвучивается
выбранным голосом.
"""

from __future__ import annotations

import subprocess
import tempfile
from pathlib import Path

from .mux import _require

# tiny/base — быстро; small/medium — точнее, но медленнее.
DEFAULT_MODEL = "base"


def _pick_device(prefer: str = "auto") -> str:
    """cuda, если есть GPU (Colab T4), иначе cpu."""
    if prefer in ("cpu", "cuda"):
        return prefer
    try:
        import torch

        return "cuda" if torch.cuda.is_available() else "cpu"
    except Exception:
        return "cpu"


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
    """Обёртка над openai-whisper с ленивой загрузкой модели."""

    def __init__(self, model_name: str = DEFAULT_MODEL, device: str = "auto"):
        self.model_name = model_name
        self.device = _pick_device(device)
        self._model = None

    def _ensure_model(self):
        if self._model is not None:
            return self._model
        try:
            import whisper
        except ImportError as exc:
            raise RuntimeError(
                "Не установлен openai-whisper. Поставь зависимости: "
                "pip install -r requirements.txt"
            ) from exc
        self._model = whisper.load_model(self.model_name, device=self.device)
        return self._model

    def transcribe(self, video_path: str | Path, language: str | None = None) -> str:
        """Вернуть распознанный текст речи из видео."""
        video_path = Path(video_path)
        if not video_path.is_file():
            raise FileNotFoundError(f"Видео не найдено: {video_path}")

        model = self._ensure_model()
        with tempfile.TemporaryDirectory() as tmp:
            wav = Path(tmp) / "audio.wav"
            _extract_audio(video_path, wav)
            # fp16 только на GPU; на CPU — fp32, иначе whisper предупреждает
            result = model.transcribe(
                str(wav), language=language, fp16=(self.device == "cuda")
            )
        return (result.get("text") or "").strip()
