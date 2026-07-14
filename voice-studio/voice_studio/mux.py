"""Работа с медиа через ffmpeg: сведение аудио+видео, извлечение, длительности.

Тонкая обёртка над CLI ffmpeg/ffprobe — их надо иметь в системе (см. README).
"""

from __future__ import annotations

import json
import shutil
import subprocess
from pathlib import Path


def _require(tool: str) -> str:
    path = shutil.which(tool)
    if not path:
        raise RuntimeError(
            f"Не найден {tool}. Установи ffmpeg "
            "(macOS: brew install ffmpeg; Ubuntu: apt install ffmpeg)."
        )
    return path


def _run(cmd: list[str]) -> None:
    proc = subprocess.run(cmd, capture_output=True, text=True)
    if proc.returncode != 0:
        raise RuntimeError(
            f"Команда упала: {' '.join(cmd[:2])}...\n{proc.stderr.strip()}"
        )


def duration(media_path: str | Path) -> float:
    """Длительность аудио/видео в секундах."""
    ffprobe = _require("ffprobe")
    out = subprocess.run(
        [ffprobe, "-v", "quiet", "-print_format", "json",
         "-show_format", str(media_path)],
        capture_output=True, text=True,
    )
    if out.returncode != 0:
        raise RuntimeError(f"ffprobe не смог прочитать {media_path}")
    data = json.loads(out.stdout or "{}")
    return float(data.get("format", {}).get("duration", 0.0))


def replace_audio(
    video_path: str | Path,
    audio_path: str | Path,
    out_path: str | Path,
    shortest: bool = True,
) -> Path:
    """Заменить звук в видео на `audio_path` (для режима voiceover / без липсинка).

    `shortest=True` обрежет результат по более короткой из дорожек, чтобы не было
    хвоста тишины или чёрного кадра.
    """
    ffmpeg = _require("ffmpeg")
    out_path = Path(out_path)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    cmd = [
        ffmpeg, "-y",
        "-i", str(video_path),
        "-i", str(audio_path),
        "-map", "0:v:0", "-map", "1:a:0",
        "-c:v", "copy", "-c:a", "aac",
    ]
    if shortest:
        cmd.append("-shortest")
    cmd.append(str(out_path))
    _run(cmd)
    return out_path
