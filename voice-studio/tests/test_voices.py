"""Тесты библиотеки голосов — без тяжёлых ML-зависимостей."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from voice_studio.voices import VoiceLibrary  # noqa: E402


def _make_sample(tmp: Path, name: str = "s.wav") -> Path:
    p = tmp / name
    p.write_bytes(b"RIFF....WAVEfake")  # содержимое неважно для CRUD
    return p


def test_add_list_get(tmp_path):
    lib = VoiceLibrary(tmp_path / "voices")
    sample = _make_sample(tmp_path)
    v = lib.add("Basil", sample, language="ru", note="мой голос")

    assert v.name == "Basil"
    assert lib.names() == ["Basil"]
    assert lib.get(v.id).note == "мой голос"
    assert lib.get_by_name("Basil").id == v.id
    # сэмпл скопирован внутрь библиотеки
    assert v.resolve_sample(lib.root).is_file()


def test_persist_across_instances(tmp_path):
    root = tmp_path / "voices"
    lib = VoiceLibrary(root)
    lib.add("Anna", _make_sample(tmp_path))
    # новый объект читает тот же индекс с диска
    assert VoiceLibrary(root).names() == ["Anna"]


def test_duplicate_name_rejected(tmp_path):
    lib = VoiceLibrary(tmp_path / "voices")
    lib.add("Same", _make_sample(tmp_path, "a.wav"))
    try:
        lib.add("Same", _make_sample(tmp_path, "b.wav"))
    except ValueError:
        return
    raise AssertionError("Дубликат имени должен отклоняться")


def test_rename_and_delete(tmp_path):
    lib = VoiceLibrary(tmp_path / "voices")
    v = lib.add("Old", _make_sample(tmp_path))
    lib.rename(v.id, "New")
    assert lib.names() == ["New"]
    lib.delete(v.id)
    assert lib.names() == []
    assert not (lib.root / v.id).exists()


def test_bad_format_rejected(tmp_path):
    lib = VoiceLibrary(tmp_path / "voices")
    bad = tmp_path / "note.txt"
    bad.write_text("nope")
    try:
        lib.add("X", bad)
    except ValueError:
        return
    raise AssertionError("Недопустимый формат должен отклоняться")
