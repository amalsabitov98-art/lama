"""Voice Studio — веб-интерфейс (Gradio), один экран.

Флоу:
  1. Выбрать голос (или добавить новый — свёрнуто в аккордеоне).
  2. Загрузить ролик → распознать речь автоматически.
  3. Поправить распознанный текст.
  4. Собрать: озвучка выбранным голосом + липсинк (губы под новую речь).

Запуск локально:  python app.py
На Hugging Face Spaces запускается автоматически (см. README.md).
"""

from __future__ import annotations

import os
import traceback

import gradio as gr

from voice_studio import VoiceLibrary, Pipeline, Mode

# --- Ядро: инициализируем один раз при старте -------------------------------
lib = VoiceLibrary("data/voices")
pipe = Pipeline(lib, output_dir="data/output")


# --- Голоса -----------------------------------------------------------------

def _voice_choices():
    names = lib.names()
    return gr.update(choices=names, value=(names[0] if names else None))


def add_voice(name, sample_file, language, note):
    """Добавить голос в библиотеку и обновить выпадающий список."""
    try:
        if not sample_file:
            raise ValueError("Загрузи аудио-сэмпл (5–30 сек чистой речи без музыки)")
        voice = lib.add(name, sample_file, language=(language or "ru").strip(), note=note or "")
        gr.Info(f"Голос «{voice.name}» сохранён 🎉")
    except Exception as exc:  # noqa: BLE001 — показываем пользователю, не роняем UI
        gr.Warning(f"Не получилось добавить голос: {exc}")
    return _voice_choices(), "", None, ""


# --- Шаг 2: распознавание речи из ролика ------------------------------------

def transcribe_video(video_file, progress: gr.Progress = gr.Progress()):
    """Достать текст речи из загруженного ролика, чтобы не печатать с нуля."""
    if not video_file:
        raise gr.Error("Сначала загрузи ролик")
    progress(0.1, desc="Достаю звук и распознаю речь… (первый запуск качает модель)")
    try:
        text = pipe.transcribe(video_file)
    except Exception as exc:  # noqa: BLE001
        traceback.print_exc()
        raise gr.Error(f"Не смог распознать речь: {exc}")
    progress(1.0, desc="Готово")
    if not text:
        gr.Warning("Речь не распознана — впиши текст вручную.")
    else:
        gr.Info("Текст распознан — проверь и поправь при желании.")
    return text


# --- Шаг 4: сборка (озвучка + липсинк) --------------------------------------

def build(voice_name, video_file, text, progress: gr.Progress = gr.Progress()):
    """Озвучить текст выбранным голосом и подогнать губы под речь."""
    if not voice_name:
        raise gr.Error("Выбери голос (шаг 1). Нет голосов — добавь во «➕ Добавить голос».")
    if not video_file:
        raise gr.Error("Загрузи ролик (шаг 2)")
    if not (text or "").strip():
        raise gr.Error("Текст пустой (шаг 3)")

    try:
        voice = lib.get_by_name(voice_name)
    except KeyError:
        raise gr.Error(f"Голос «{voice_name}» не найден — обнови список")

    progress(0.1, desc="Готовлюсь… (первый запуск докачивает модель голоса)")
    progress(0.4, desc="Озвучиваю текст выбранным голосом…")
    progress(0.6, desc="Липсинк: подгоняю губы под речь. На CPU это дольше — подожди…")
    try:
        result = pipe.run(Mode.TALKING_HEAD, voice, text, video_file)
    except gr.Error:
        raise
    except Exception as exc:  # noqa: BLE001
        traceback.print_exc()
        raise gr.Error(f"Сборка не удалась: {exc}")
    progress(1.0, desc="Готово!")

    if result.lip_synced:
        status = "✅ **Готово!** Ролик озвучен твоим голосом, губы синхронизированы с речью."
    else:
        status = (
            "⚠️ **Голос наложен, но липсинк не выполнен.** "
            "Скорее всего не установлен Wav2Lip (веса модели). Ролик собран с новым "
            "голосом, но губы двигаются как в оригинале.\n\n"
            f"Подробности: {result.warning or 'нет'}"
        )
        gr.Warning("Липсинк не выполнен — собрал ролик без подгонки губ (нужен Wav2Lip).")
    return str(result.output_path), status


# --- Интерфейс --------------------------------------------------------------

HEADER = """
# 🎙️ Voice Studio

Озвучивай ролики **одним и тем же голосом** — тембр держится на всех видео.
Загрузи ролик → распознаем речь → поправишь текст → озвучим твоим голосом с **липсинком**.
"""

FOOTER = (
    "<small>⚖️ Только для <b>своего</b> контента и голосов, на которые есть право "
    "или согласие владельца. Клонировать чужой голос без разрешения — нельзя.</small>"
)

with gr.Blocks(title="Voice Studio", theme=gr.themes.Soft()) as demo:
    gr.Markdown(HEADER)

    names = lib.names()
    value = names[0] if names else None

    # Шаг 1 — голос
    gr.Markdown("### 1 · 🎙️ Выбери голос")
    voice = gr.Dropdown(choices=names, value=value, label="Голос")
    with gr.Accordion("➕ Добавить новый голос", open=(not names)):
        gr.Markdown("Референс: **5–30 сек чистой речи** без музыки и шума (wav/mp3/m4a/flac/ogg).")
        nv_name = gr.Textbox(label="Имя голоса", placeholder="Например: Мой основной")
        nv_sample = gr.Audio(label="Аудио-сэмпл", type="filepath")
        with gr.Row():
            nv_lang = gr.Textbox(label="Язык", value="ru", scale=1)
            nv_note = gr.Textbox(label="Заметка", placeholder="спокойный тон, для обзоров", scale=2)
        nv_add = gr.Button("Сохранить голос", variant="secondary")

    # Шаг 2 — видео + распознавание
    gr.Markdown("### 2 · 🎬 Закинь ролик")
    video = gr.Video(label="Видео с говорящим")
    transcribe_btn = gr.Button("📝 Распознать речь из ролика")

    # Шаг 3 — текст
    gr.Markdown("### 3 · ✏️ Проверь текст (это озвучит твой голос)")
    text = gr.Textbox(label="Текст для озвучки", lines=6,
                      placeholder="Загрузи ролик и нажми «Распознать речь» — текст подтянется сюда…")

    # Шаг 4 — сборка
    gr.Markdown("### 4 · 👄 Озвучь и синхронизируй губы")
    build_btn = gr.Button("🎬 Собрать ролик", variant="primary", size="lg")
    out_video = gr.Video(label="Результат")
    out_status = gr.Markdown()

    gr.Markdown(FOOTER)

    # --- события ---
    nv_add.click(add_voice, inputs=[nv_name, nv_sample, nv_lang, nv_note],
                 outputs=[voice, nv_name, nv_sample, nv_note])
    transcribe_btn.click(transcribe_video, inputs=video, outputs=text)
    build_btn.click(build, inputs=[voice, video, text], outputs=[out_video, out_status])


if __name__ == "__main__":
    # В облаке (Google Colab) нужна публичная ссылка: задай VOICE_STUDIO_SHARE=1.
    share = os.getenv("VOICE_STUDIO_SHARE", "0").lower() in ("1", "true", "yes")
    demo.queue().launch(share=share)
