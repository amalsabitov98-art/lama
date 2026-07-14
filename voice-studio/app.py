"""Voice Studio — веб-интерфейс (Gradio).

Запуск:  python app.py
Откроется локальная страница с тремя вкладками:
  🎙️ Голоса            — библиотека AI-голосов (добавить / переименовать / удалить)
  🎬 Говорящий в кадре  — озвучка + липсинк (Mode.TALKING_HEAD)
  🔊 Закадровая озвучка — быстрый режим без липсинка (Mode.VOICEOVER)
"""

from __future__ import annotations

import traceback

import gradio as gr

from voice_studio import VoiceLibrary, Pipeline, Mode

# --- Инициализация ядра: один раз при старте -------------------------------

lib = VoiceLibrary("data/voices")
pipe = Pipeline(lib, output_dir="data/output")


# --- Вспомогательные функции ------------------------------------------------

def _voices_table() -> list[list[str]]:
    """Список голосов для таблицы: [имя, язык, заметка, id]."""
    return [[v.name, v.language, v.note, v.id] for v in lib.list()]


def _dropdown_update():
    """Обновление выпадающих списков голосов после изменений в библиотеке."""
    names = lib.names()
    return gr.update(choices=names, value=(names[0] if names else None))


def refresh_all():
    """Таблица + оба выпадающих списка (для вкладок озвучки)."""
    return _voices_table(), _dropdown_update(), _dropdown_update()


# --- Вкладка «Голоса» --------------------------------------------------------

def add_voice(name: str, sample_file, language: str, note: str):
    try:
        if not sample_file:
            raise ValueError("Загрузи аудио-сэмпл (5–30 сек чистой речи без музыки)")
        voice = lib.add(name, sample_file, language=(language or "ru").strip(), note=note or "")
        gr.Info(f"Голос «{voice.name}» добавлен 🎉")
    except Exception as exc:  # noqa: BLE001 — показываем пользователю, не роняем UI
        gr.Warning(f"Не получилось добавить голос: {exc}")
    return (*refresh_all(), "", None, "")


def rename_voice(old_name: str, new_name: str):
    try:
        if not old_name:
            raise ValueError("Выбери голос, который переименовать")
        voice = lib.get_by_name(old_name)
        lib.rename(voice.id, new_name)
        gr.Info(f"Готово: «{old_name}» → «{new_name.strip()}»")
    except Exception as exc:  # noqa: BLE001
        gr.Warning(f"Не получилось переименовать: {exc}")
    return (*refresh_all(), "")


def delete_voice(name: str):
    try:
        if not name:
            raise ValueError("Выбери голос, который удалить")
        voice = lib.get_by_name(name)
        lib.delete(voice.id)
        gr.Info(f"Голос «{name}» удалён")
    except Exception as exc:  # noqa: BLE001
        gr.Warning(f"Не получилось удалить: {exc}")
    return refresh_all()


# --- Вкладки озвучки ---------------------------------------------------------

def _run(mode: Mode, voice_name: str, video_file, text: str, progress: gr.Progress):
    """Общая логика обеих вкладок: проверка входов → pipe.run → результат."""
    if not voice_name:
        raise gr.Error("Сначала выбери голос (или добавь его во вкладке «Голоса»)")
    if not video_file:
        raise gr.Error("Загрузи видео, поверх которого класть озвучку")
    if not (text or "").strip():
        raise gr.Error("Напиши текст, который нужно озвучить")

    try:
        voice = lib.get_by_name(voice_name)
    except KeyError:
        raise gr.Error(
            f"Голос «{voice_name}» не найден — обнови список во вкладке «Голоса»"
        )

    progress(0.05, desc="Готовлюсь… (первый запуск может докачивать модель TTS)")
    progress(0.25, desc="Идёт озвучка текста выбранным голосом, подожди…")
    try:
        if mode is Mode.TALKING_HEAD:
            progress(0.5, desc="Озвучка + липсинк. На CPU это может занять несколько минут…")
        result = pipe.run(mode, voice, text, video_file)
    except gr.Error:
        raise
    except Exception as exc:  # noqa: BLE001 — любые ошибки ядра показываем аккуратно
        traceback.print_exc()
        raise gr.Error(f"Сборка не удалась: {exc}")

    progress(1.0, desc="Готово!")
    return result


def run_talking_head(voice_name: str, video_file, text: str,
                     progress: gr.Progress = gr.Progress()):
    result = _run(Mode.TALKING_HEAD, voice_name, video_file, text, progress)
    if result.lip_synced:
        status = "✅ Готово! Голос наложен, губы подогнаны под речь (липсинк сработал)."
    else:
        status = (
            "⚠️ Липсинк не сработал, но ролик всё равно собран: твой голос наложен "
            "поверх видео, просто губы в кадре двигаются как в оригинале. "
            "Чаще всего это значит, что Wav2Lip не установлен (см. install.sh и README).\n\n"
            f"Подробности: {result.warning or 'нет'}"
        )
        gr.Warning("Липсинк не сработал — собрал ролик без подгонки губ.")
    return str(result.output_path), status


def run_voiceover(voice_name: str, video_file, text: str,
                  progress: gr.Progress = gr.Progress()):
    result = _run(Mode.VOICEOVER, voice_name, video_file, text, progress)
    status = "✅ Готово! Закадровый голос наложен поверх видео."
    if result.warning:
        status += f"\n\n⚠️ {result.warning}"
    return str(result.output_path), status


# --- Интерфейс ---------------------------------------------------------------

HEADER = """
# 🎛️ Voice Studio

Озвучивай свои ролики **одним и тем же AI-голосом** — тембр сохраняется между видео.

**Порядок действий:**
1. Во вкладке **«🎙️ Голоса»** добавь голос: аудио-сэмпл (5–30 сек чистой речи) + имя.
2. Выбери режим: **«🎬 Говорящий в кадре»** (с липсинком) или **«🔊 Закадровая озвучка»** (быстро, без липсинка).
3. Загрузи видео и напиши текст.
4. Жми **«Собрать»** и дождись результата — превью появится прямо здесь.
"""

FOOTER = (
    "<small>⚖️ Используй Voice Studio только для <b>своего</b> контента и голосов, "
    "на которые у тебя есть право или явное согласие владельца. Клонировать чужой "
    "голос без разрешения — нельзя.</small>"
)

with gr.Blocks(title="Voice Studio") as demo:
    gr.Markdown(HEADER)

    initial_names = lib.names()
    initial_value = initial_names[0] if initial_names else None

    with gr.Tabs():
        # ------------------------------------------------ 🎙️ Голоса
        with gr.Tab("🎙️ Голоса"):
            gr.Markdown(
                "Библиотека твоих голосов. Один голос = короткий референс-сэмпл: "
                "**5–30 секунд чистой речи** без музыки и фонового шума "
                "(wav / mp3 / m4a / flac / ogg)."
            )
            with gr.Row():
                with gr.Column():
                    gr.Markdown("### ➕ Добавить голос")
                    new_name = gr.Textbox(label="Имя голоса", placeholder="Например: Мой основной")
                    new_sample = gr.Audio(label="Аудио-сэмпл (5–30 сек чистой речи)",
                                          type="filepath")
                    new_lang = gr.Textbox(label="Язык (код)", value="ru",
                                          placeholder="ru, en, de…")
                    new_note = gr.Textbox(label="Заметка (необязательно)",
                                          placeholder="Например: спокойный тон, для обзоров")
                    add_btn = gr.Button("Добавить голос", variant="primary")
                with gr.Column():
                    gr.Markdown("### 📚 Мои голоса")
                    voices_df = gr.Dataframe(
                        headers=["Имя", "Язык", "Заметка", "ID"],
                        value=_voices_table(),
                        interactive=False,
                        label="Библиотека",
                    )
                    manage_pick = gr.Dropdown(choices=initial_names, value=initial_value,
                                              label="Голос для действия")
                    with gr.Row():
                        rename_to = gr.Textbox(label="Новое имя", scale=2)
                        rename_btn = gr.Button("Переименовать", scale=1)
                    delete_btn = gr.Button("🗑️ Удалить выбранный голос", variant="stop")
                    refresh_btn = gr.Button("↻ Обновить список")

        # ------------------------------------------------ 🎬 Говорящий в кадре
        with gr.Tab("🎬 Говорящий в кадре"):
            gr.Markdown(
                "Режим для видео, где **человек говорит в кадре**: озвучиваем текст твоим "
                "голосом и подгоняем движение губ (Wav2Lip).\n\n"
                "⏳ **Внимание:** на обычном компе без видеокарты NVIDIA липсинк идёт "
                "медленно — несколько минут на каждые 10–15 секунд видео. Если долго — "
                "это нормально, не закрывай страницу. Нужно быстро? Возьми вкладку "
                "«🔊 Закадровая озвучка»."
            )
            with gr.Row():
                with gr.Column():
                    th_voice = gr.Dropdown(choices=initial_names, value=initial_value,
                                           label="Голос")
                    th_video = gr.Video(label="Видео с говорящим человеком")
                    th_text = gr.Textbox(label="Текст для озвучки", lines=6,
                                         placeholder="Что должен сказать герой ролика…")
                    th_btn = gr.Button("🎬 Собрать", variant="primary")
                with gr.Column():
                    th_out = gr.Video(label="Результат")
                    th_status = gr.Markdown()

        # ------------------------------------------------ 🔊 Закадровая озвучка
        with gr.Tab("🔊 Закадровая озвучка"):
            gr.Markdown(
                "Режим для **закадрового голоса** поверх нарезки, б-ролла или футажей "
                "(например, видео из Veo 3). Без липсинка, поэтому работает **быстро** "
                "даже на CPU."
            )
            with gr.Row():
                with gr.Column():
                    vo_voice = gr.Dropdown(choices=initial_names, value=initial_value,
                                           label="Голос")
                    vo_video = gr.Video(label="Видео (нарезка / б-ролл)")
                    vo_text = gr.Textbox(label="Текст для озвучки", lines=6,
                                         placeholder="Текст закадрового голоса…")
                    vo_btn = gr.Button("🔊 Собрать", variant="primary")
                with gr.Column():
                    vo_out = gr.Video(label="Результат")
                    vo_status = gr.Markdown()

    gr.Markdown(FOOTER)

    # --- Связка событий: любые изменения библиотеки обновляют все списки ----
    lists_out = [voices_df, th_voice, vo_voice]

    add_btn.click(
        add_voice,
        inputs=[new_name, new_sample, new_lang, new_note],
        outputs=lists_out + [new_name, new_sample, new_note],
    ).then(lambda: _dropdown_update(), outputs=manage_pick)

    rename_btn.click(
        rename_voice,
        inputs=[manage_pick, rename_to],
        outputs=lists_out + [rename_to],
    ).then(lambda: _dropdown_update(), outputs=manage_pick)

    delete_btn.click(
        delete_voice,
        inputs=manage_pick,
        outputs=lists_out,
    ).then(lambda: _dropdown_update(), outputs=manage_pick)

    refresh_btn.click(refresh_all, outputs=lists_out).then(
        lambda: _dropdown_update(), outputs=manage_pick
    )

    th_btn.click(run_talking_head, inputs=[th_voice, th_video, th_text],
                 outputs=[th_out, th_status])
    vo_btn.click(run_voiceover, inputs=[vo_voice, vo_video, vo_text],
                 outputs=[vo_out, vo_status])


if __name__ == "__main__":
    demo.launch()
