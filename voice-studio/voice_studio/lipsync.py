"""Липсинк для режима talking_head — подгоняем губы под сгенерированную речь.

Бэкенд по умолчанию — Wav2Lip (запускается как внешний скрипт inference.py).
Веса и репозиторий Wav2Lip ставятся отдельно (см. README) — они большие и
лицензионно отдельные, поэтому в проект не вшиты.

ВАЖНО про обычный комп: Wav2Lip на CPU работает, но медленно (примерно
несколько минут на каждые 10–15 сек видео). Для длинных роликов лучше резать
на куски или взять GPU. Поэтому режим voiceover (без липсинка) всегда доступен
как быстрый запасной путь.
"""

from __future__ import annotations

import shutil
import subprocess
import sys
from pathlib import Path


class LipSyncError(RuntimeError):
    pass


class Wav2LipBackend:
    """Обёртка над внешним Wav2Lip.

    `repo_dir` — папка с клоном https://github.com/Rudrabha/Wav2Lip
    `checkpoint` — путь к весам (например wav2lip_gan.pth)
    """

    def __init__(self, repo_dir: str | Path, checkpoint: str | Path):
        self.repo_dir = Path(repo_dir)
        self.checkpoint = Path(checkpoint)

    def available(self) -> tuple[bool, str]:
        """Проверка, что бэкенд готов к запуску. Возвращает (готов, причина)."""
        if not self.repo_dir.is_dir():
            return False, f"Нет папки Wav2Lip: {self.repo_dir}"
        if not (self.repo_dir / "inference.py").is_file():
            return False, f"В {self.repo_dir} нет inference.py"
        if not self.checkpoint.is_file():
            return False, f"Нет весов модели: {self.checkpoint}"
        return True, "ok"

    def sync(
        self,
        video_path: str | Path,
        audio_path: str | Path,
        out_path: str | Path,
    ) -> Path:
        ok, reason = self.available()
        if not ok:
            raise LipSyncError(reason)

        out_path = Path(out_path)
        out_path.parent.mkdir(parents=True, exist_ok=True)

        cmd = [
            sys.executable, "inference.py",
            "--checkpoint_path", str(self.checkpoint.resolve()),
            "--face", str(Path(video_path).resolve()),
            "--audio", str(Path(audio_path).resolve()),
            "--outfile", str(out_path.resolve()),
        ]
        proc = subprocess.run(
            cmd, cwd=str(self.repo_dir), capture_output=True, text=True
        )
        if proc.returncode != 0:
            raise LipSyncError(
                "Wav2Lip упал:\n" + (proc.stderr.strip() or proc.stdout.strip())
            )
        if not out_path.is_file():
            raise LipSyncError("Wav2Lip завершился, но файл не создан")
        return out_path


def default_backend(
    repo_dir: str | Path = "third_party/Wav2Lip",
    checkpoint: str | Path = "third_party/Wav2Lip/checkpoints/wav2lip_gan.pth",
) -> Wav2LipBackend:
    return Wav2LipBackend(repo_dir, checkpoint)
