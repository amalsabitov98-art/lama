# Сторонние компоненты

Опциональный режим «AI-текстура» использует модель **LaMa** (Resolution-robust
Large Mask Inpainting with Fourier Convolutions, WACV 2022, авторы Suvorov и др.,
исходный проект https://github.com/advimman/lama, лицензия Apache License 2.0).

Приложение при первом запуске AI-режима скачивает одну из двух ONNX-версий
модели и хранит её локально в `%LOCALAPPDATA%\WatermarkCleaner\models`. Ни один
из файлов не включён в архив приложения.

## Основная модель (fp32 big-LaMa)

- источник: https://huggingface.co/Carve/LaMa-ONNX
- файл: `lama_fp32.onnx` (~208 МБ)
- SHA-256: `1faef5301d78db7dda502fe59966957ec4b79dd64e16f03ed96913c7a4eb68d6`
- лицензия: Apache License 2.0 (ONNX-порт полной big-LaMa от Carve Photos)

## Запасная модель (квантованная, OpenCV Zoo)

Используется автоматически, если основную модель не удалось скачать.

- источник: https://huggingface.co/opencv/inpainting_lama
- файл: `inpainting_lama_2025jan.onnx` (~92,6 МБ)
- SHA-256: `7df918ac3921d3daf0aae1d219776cf0dc4e4935f035af81841b40adcf74fdf2`
- лицензия: Apache License 2.0
