# assets/

Сюда положите фотографии сайта (пути совпадают с `src` в `index.html`):

| Файл | Сцена |
|------|-------|
| `batumi-skyline.jpg` | Hero — панорама Батуми (на неё работает Ken Burns) |
| `batumi-night.jpg` | День 01 — вечерний Батуми |
| `makhuntseti.jpg` | День 02 — водопад Махунцети |
| `ayder.jpg` | День 03 — высокогорье Айдер / чайные яйлы |
| `batumi-cable.jpg` | День 04 — Батуми у моря / канатка |
| `coastal-crossing.png` | День 05 — прибрежная дорога Ризе ↔ Батуми |
| `uzungol-lake.png` | День 06 — озеро Узунгёль |
| `batumi-fountains.jpg` | День 07 — ночной Батуми |
| `batumi-lighthouse.jpg` | День 08 — маяк на берегу |
| `batumi-day.jpg` | Финальный блок (manifest) |

Ken Burns подключён в `styles.css` (правило `.hero>img` + `@keyframes kenburns`)
и автоматически отключается при `prefers-reduced-motion`.
