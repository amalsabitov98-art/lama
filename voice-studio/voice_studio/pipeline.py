"""Оркестрация двух режимов поверх ядра (голоса → TTS → липсинк/сведение)."""

from __future__ import annotations

import time
from dataclasses import dataclass
from enum import Enum
from pathlib import Path

from .lipsync import Wav2LipBackend, LipSyncError, default_backend
from .mux import replace_audio
from .tts import TTSEngine
from .voices import Voice, VoiceLibrary


class Mode(str, Enum):
    TALKING_HEAD = "talking_head"  # человек в кадре + липсинк
    VOICEOVER = "voiceover"        # закадровый голос, липсинк не нужен


@dataclass
class Result:
    mode: Mode
    output_path: Path
    audio_path: Path
    lip_synced: bool
    warning: str = ""


class Pipeline:
    """Единая точка входа для UI: собери голос + видео + текст → готовый ролик."""

    def __init__(
        self,
        library: VoiceLibrary,
        tts: TTSEngine | None = None,
        lipsync: Wav2LipBackend | None = None,
        output_dir: str | Path = "data/output",
    ):
        self.library = library
        self.tts = tts or TTSEngine(library)
        self.lipsync = lipsync or default_backend()
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)

    def _stamp(self, prefix: str, suffix: str) -> Path:
        return self.output_dir / f"{prefix}_{int(time.time())}{suffix}"

    def run(
        self,
        mode: Mode,
        voice: Voice,
        text: str,
        video_path: str | Path,
        language: str | None = None,
    ) -> Result:
        """Озвучить и собрать ролик выбранным голосом.

        talking_head: пробуем липсинк; если бэкенд не готов — честно падаем на
        простое наложение звука и предупреждаем (голос всё равно один и тот же).
        voiceover: сразу наложение звука без липсинка.
        """
        mode = Mode(mode)
        video_path = Path(video_path)
        if not video_path.is_file():
            raise FileNotFoundError(f"Видео не найдено: {video_path}")

        # 1) Озвучка — одинаковая для обоих режимов, тембр держится голосом.
        audio_path = self._stamp("voice", ".wav")
        self.tts.synthesize(text, voice, audio_path, language=language)

        # 2) Сборка видео.
        if mode is Mode.VOICEOVER:
            out = self._stamp("voiceover", ".mp4")
            replace_audio(video_path, audio_path, out)
            return Result(mode, out, audio_path, lip_synced=False)

        # talking_head
        ok, reason = self.lipsync.available()
        if ok:
            out = self._stamp("talkinghead", ".mp4")
            try:
                self.lipsync.sync(video_path, audio_path, out)
                return Result(mode, out, audio_path, lip_synced=True)
            except LipSyncError as exc:
                reason = str(exc)  # падаем в запасной путь ниже

        out = self._stamp("talkinghead_nolips", ".mp4")
        replace_audio(video_path, audio_path, out)
        return Result(
            mode, out, audio_path, lip_synced=False,
            warning=(
                "Липсинк недоступен — наложил звук без подгонки губ. "
                f"Причина: {reason}"
            ),
        )
