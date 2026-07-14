"""Библиотека голосов — хранение и переиспользование AI-голосов (пресетов).

Каждый голос = короткий референс-сэмпл (WAV) + метаданные. XTTS клонирует голос
из этого сэмпла на лету, поэтому «запоминание» голоса — это просто сохранение
референса и записи о нём. Так один тембр остаётся стабильным между роликами.
"""

from __future__ import annotations

import json
import shutil
import time
import uuid
from dataclasses import dataclass, asdict
from pathlib import Path

# Форматы, которые примем как референс-сэмпл голоса.
_ALLOWED_SUFFIXES = {".wav", ".mp3", ".m4a", ".flac", ".ogg"}


@dataclass
class Voice:
    """Один голос в библиотеке."""

    id: str
    name: str
    sample_path: str          # путь к референс-сэмплу (относительно корня библиотеки)
    language: str = "ru"
    note: str = ""
    created_at: float = 0.0

    def resolve_sample(self, root: Path) -> Path:
        return (root / self.sample_path).resolve()


class VoiceLibrary:
    """CRUD над коллекцией голосов на диске.

    Раскладка:
        <root>/index.json          — список голосов
        <root>/<voice_id>/sample.* — референс-сэмпл каждого голоса
    """

    def __init__(self, root: str | Path = "data/voices"):
        self.root = Path(root)
        self.root.mkdir(parents=True, exist_ok=True)
        self._index_path = self.root / "index.json"
        self._voices: dict[str, Voice] = {}
        self._load()

    # --- публичный API -------------------------------------------------

    def list(self) -> list[Voice]:
        """Все голоса, новые сверху."""
        return sorted(self._voices.values(), key=lambda v: v.created_at, reverse=True)

    def names(self) -> list[str]:
        """Имена для выпадающего списка в UI."""
        return [v.name for v in self.list()]

    def get(self, voice_id: str) -> Voice:
        if voice_id not in self._voices:
            raise KeyError(f"Голос с id={voice_id!r} не найден")
        return self._voices[voice_id]

    def get_by_name(self, name: str) -> Voice:
        for v in self._voices.values():
            if v.name == name:
                return v
        raise KeyError(f"Голос с именем {name!r} не найден")

    def add(
        self,
        name: str,
        sample_file: str | Path,
        language: str = "ru",
        note: str = "",
    ) -> Voice:
        """Добавить голос: копируем сэмпл в библиотеку и регистрируем.

        `sample_file` — путь к аудио с чистой речью (5–30 сек, без музыки/шума).
        """
        name = name.strip()
        if not name:
            raise ValueError("Имя голоса не может быть пустым")
        if any(v.name == name for v in self._voices.values()):
            raise ValueError(f"Голос с именем {name!r} уже есть — выбери другое имя")

        src = Path(sample_file)
        if not src.is_file():
            raise FileNotFoundError(f"Сэмпл не найден: {src}")
        if src.suffix.lower() not in _ALLOWED_SUFFIXES:
            allowed = ", ".join(sorted(_ALLOWED_SUFFIXES))
            raise ValueError(f"Формат {src.suffix!r} не поддержан. Разрешены: {allowed}")

        voice_id = uuid.uuid4().hex[:12]
        voice_dir = self.root / voice_id
        voice_dir.mkdir(parents=True, exist_ok=True)
        dst = voice_dir / f"sample{src.suffix.lower()}"
        shutil.copyfile(src, dst)

        voice = Voice(
            id=voice_id,
            name=name,
            sample_path=str(dst.relative_to(self.root)),
            language=language,
            note=note,
            created_at=time.time(),
        )
        self._voices[voice_id] = voice
        self._save()
        return voice

    def rename(self, voice_id: str, new_name: str) -> Voice:
        new_name = new_name.strip()
        if not new_name:
            raise ValueError("Имя не может быть пустым")
        if any(v.name == new_name and v.id != voice_id for v in self._voices.values()):
            raise ValueError(f"Имя {new_name!r} уже занято")
        voice = self.get(voice_id)
        voice.name = new_name
        self._save()
        return voice

    def delete(self, voice_id: str) -> None:
        voice = self.get(voice_id)
        shutil.rmtree(self.root / voice.id, ignore_errors=True)
        del self._voices[voice_id]
        self._save()

    # --- внутреннее ----------------------------------------------------

    def _load(self) -> None:
        if not self._index_path.is_file():
            return
        try:
            raw = json.loads(self._index_path.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError):
            # Битый индекс не должен ронять приложение — начинаем с пустой библиотеки.
            self._voices = {}
            return
        for item in raw.get("voices", []):
            try:
                voice = Voice(**item)
            except TypeError:
                continue  # пропускаем записи с несовместимыми полями
            self._voices[voice.id] = voice

    def _save(self) -> None:
        payload = {"voices": [asdict(v) for v in self.list()]}
        tmp = self._index_path.with_suffix(".json.tmp")
        tmp.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
        tmp.replace(self._index_path)  # атомарная запись
