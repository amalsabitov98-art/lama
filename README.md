# IMAN — Экосистема паломничества

Концептуальный одностраничный сайт: партнёрская продуктовая экосистема паломничества — «от намерения к наследию».

Собран как статический SPA на **Vite + React** и публикуется через **GitHub Pages**.

## Локальная разработка

```bash
npm install
npm run dev      # локальный сервер разработки
npm run build    # production-сборка в dist/
npm run preview  # предпросмотр собранной версии
```

## Деплой на GitHub Pages

Деплой автоматический через GitHub Actions (`.github/workflows/deploy-pages.yml`):

1. В настройках репозитория **Settings → Pages → Build and deployment → Source** выберите **GitHub Actions** (workflow пытается включить это автоматически).
2. При каждом push сборка публикуется на `https://<username>.github.io/lama/`.

Сайт обслуживается из подпапки `/lama/`, поэтому в `vite.config.ts` задан `base: "/lama/"`.
Для кастомного домена или другого имени репозитория переопределите базовый путь:

```bash
VITE_BASE=/ npm run build
```

## Структура

- `index.html` — точка входа
- `src/main.tsx` — монтирование React
- `src/App.tsx` — сама страница
- `src/globals.css` — стили (Tailwind v4 preflight + авторская тема)
- `public/` — изображения и статические ассеты
