---
name: bing-webmaster
description: |
  Bing Webmaster Tools для praxenai.ge через API-ключ: отправка страниц на индексацию,
  квота, поисковые запросы и страницы из Bing, статистика обхода, ошибки обхода, sitemap.
  Triggers: bing, бинг, bing webmaster, индексация bing, запросы bing, copilot.
---

# bing-webmaster

Скрипт без зависимостей: `node scripts/bing.mjs <command>`. Настройка ключа — `config/README.md`.

## Перед работой

```bash
node scripts/bing.mjs check
```
Покажет, подтверждён ли сайт и сколько URL можно отправить сегодня.

## Команды

| Команда | Что даёт |
|---|---|
| `submit-sitemap-urls` | отправить все URL из sitemap в пределах дневной квоты |
| `submit-url --url URL` | отправить одну страницу |
| `quota` | дневная и месячная квота отправки |
| `queries` / `pages` | клики, показы и средняя позиция по запросам и страницам (суммы за период Bing) |
| `crawl` | обход по дням: просканировано, в индексе, ошибки, закрыто robots.txt |
| `crawl-issues` | страницы с ошибками обхода |
| `sitemaps` / `add-sitemap [--url URL]` | состояние sitemap / добавить sitemap |
| `sites` | сайты в аккаунте |

Параметр: `--limit N` (по умолчанию 25).

## Важно

- Bing также питает Copilot и ChatGPT Search — индексация в Bing важна для ответов ИИ.
- Для быстрой отправки во все поисковики, поддерживающие IndexNow (Bing, Яндекс и др.), есть `scripts/seo/indexnow.mjs` в корне проекта.
- `config/.env` не коммитится (`.gitignore`).
