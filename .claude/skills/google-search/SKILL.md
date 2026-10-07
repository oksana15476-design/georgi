---
name: google-search
description: |
  Google Search Console и Google Analytics 4 для praxenai.ge через сервисный аккаунт:
  поисковые запросы, страницы, страны и устройства из поиска Google, sitemap, проверка
  индексации URL; трафик, источники, страницы и события GA4.
  Triggers: search console, gsc, google поиск, индексация google, ga4, google analytics,
  гугл аналитика, ключевые события, источники трафика google.
---

# google-search

Скрипт без зависимостей: `node scripts/google.mjs <command>`. Настройка доступа — `config/README.md`.

## Перед работой

```bash
node scripts/google.mjs check
```
Покажет сервисный аккаунт и есть ли доступ к Search Console и GA4. Если доступа нет — `config/README.md`.

## Команды

| Команда | Что даёт |
|---|---|
| `gsc-queries` / `gsc-pages` / `gsc-countries` / `gsc-devices` | клики, показы, CTR, позиция |
| `gsc-sitemaps` | состояние sitemap |
| `gsc-submit-sitemap [--url URL]` | отправить sitemap (по умолчанию https://praxenai.ge/sitemap.xml) |
| `gsc-inspect --url URL` | проиндексирована ли страница, каноникал, дата обхода |
| `gsc-sites` | ресурсы, к которым есть доступ |
| `ga4-channels` / `ga4-sources` / `ga4-pages` / `ga4-countries` | сеансы, пользователи, ключевые события |
| `ga4-events` | события сайта (`generate_lead`, `whatsapp_click` …) |
| `ga4-daily` | динамика по дням |

Параметры: `--days N` (по умолчанию 28), `--limit N` (по умолчанию 25).

## Важно

- Данные Search Console приходят с задержкой 2–3 дня; диапазон заканчивается позавчера.
- Ключевые события GA4 и цели Метрики описаны в `docs/ANALYTICS-GOALS.md`.
- Переобход страниц в Google через API недоступен (Indexing API — только для вакансий и трансляций). Для Google — sitemap и `gsc-inspect`; для Яндекса и Bing — скиллы `yandex-webmaster`, `bing-webmaster` и IndexNow (`scripts/seo/indexnow.mjs`).
- Ключ сервисного аккаунта и `.env` не коммитятся (`.gitignore`).
