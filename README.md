# Praxen AI — ИИ для бизнеса в Грузии

Многоязычный сайт: основные языки — английский (по умолчанию) и грузинский, дополнительно русский. Главная страница, 12 отраслевых страниц, 8 страниц отделов, решения, обучение и примеры внедрения.

## Локальный запуск

Требуется Node.js >= 22.13.0 и npm.

```sh
npm ci
npm run dev
```

Откройте http://localhost:5173/ — корень перенаправляет на /en (также доступны /ka и /ru).

## Проверка и сборка

```sh
npx tsc --noEmit
npm run build
npm run start
```

Проект использует React, TypeScript, Vinext/Vite и Cloudflare Workers. Команда start запускает локальный просмотр собранного Worker; адрес выводится в терминале.

## Структура

- app/ — маршруты, стили, sitemap, robots и API формы заявки.
- components/site.tsx — каркас страниц и порядок блоков.
- components/praxen/ — разделы сайта: шапка, главная, списки, страницы отделов и отраслей, тарифы, калькулятор, команда, партнёры, политика, форма.
- components/analytics.tsx — согласие на cookie, GA4, пиксель Meta, конверсии Google Ads, UTM-метки.
- lib/content.ts, lib/page-profiles.ts, lib/page-copy.ts, lib/jobs.ts — тексты на трёх языках ([ru, en, ka]).
- lib/pricing.ts — цены в лари и долларах.
- lib/contacts.ts — телефон, Telegram, WhatsApp, ссылка на запись.
- lib/lead-delivery.mjs — проверка и доставка заявок (общая для Docker и Cloudflare).
- lib/seo.ts — адрес сайта, canonical, hreflang, Open Graph, разметка Organization.
- server/index.mjs — сервер для Docker-образа.
- public/ — логотипы, фото, картинки для превью ссылок.

## Заявки: Telegram, почта и amoCRM

API `app/api/leads/route.ts` отправляет каждую заявку во все настроенные каналы параллельно. Заявка считается принятой, если дошла хотя бы в один. В сообщении есть источник перехода (UTM-метки и сайт, с которого пришёл посетитель).

Секреты задаются в Cloudflare Worker (для локального запуска — в игнорируемом `.dev.vars`). Названия переменных — в `.env.example`:

- Telegram: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`.
- Почта через [Resend](https://resend.com): `RESEND_API_KEY`, `LEAD_EMAIL_TO` (можно несколько адресов через запятую), `LEAD_EMAIL_FROM` (адрес на подтверждённом домене).
- amoCRM: `AMO_DOMAIN` (например, `company.amocrm.ru`), `AMO_TOKEN` (долгосрочный токен интеграции), при желании `AMO_PIPELINE_ID`. Создаётся сделка с контактом, полный текст заявки — в примечании.

Если не настроен ни один канал, API возвращает 503, и форма показывает ошибку с кнопками WhatsApp, Telegram и телефона. На GitHub Pages сервера нет, поэтому форма там не отправляет заявки.

## Аналитика, реклама и запись на аудит

Публичные настройки встраиваются при сборке и необязательны:

- `NEXT_PUBLIC_GA_ID` — Google Analytics 4 (`G-…`).
- `NEXT_PUBLIC_META_PIXEL_ID` — пиксель Meta.
- `NEXT_PUBLIC_ADS_ID` и `NEXT_PUBLIC_ADS_LEAD_LABEL` — конверсия Google Ads (`AW-…` и метка действия «заявка»).
- `NEXT_PUBLIC_BOOKING_URL` — ссылка Cal.com или Calendly; с ней появляется кнопка записи на аудит.
- `NEXT_PUBLIC_SITE_URL` — адрес сайта для canonical, hreflang, Open Graph и sitemap.

Счётчики загружаются только после согласия посетителя в cookie-баннере; баннер показывается, когда задан хотя бы один ID. События: `cta_click`, `phone_click`, `telegram_click`, `whatsapp_click`, `form_start`, `form_error`, `generate_lead` (в Meta — `Lead`, в Google Ads — конверсия), `calculator_use`, `currency_switch`.

Политика конфиденциальности — страница `/{язык}/privacy` (`components/praxen/privacy.tsx`). Перед запуском рекламы добавьте реквизиты юрлица и согласуйте текст с юристом.

## Развёртывание в Docker (Timeweb App Platform)

`Dockerfile` собирает все страницы в статический HTML и кладёт их в лёгкий образ с Node-сервером `server/index.mjs`. Сервер раздаёт страницы (gzip, кэш статики на год, заголовки безопасности) и принимает заявки на `POST /api/leads`: до 5 заявок с одного IP за 10 минут, проверка Origin, ловушка для ботов. Проверка работоспособности — `GET /healthz`.

Шаги в панели Timeweb Cloud:

1. **App Platform → Создать → Docker → Dockerfile.** Подключите GitHub-репозиторий и ветку (лучше `main` после слияния).
2. **Регион:** Нидерланды или Польша. Ближе к Грузии и без ограничений для Google, Meta и почтовых сервисов.
3. **Переменные окружения.**
   - Обязательно: `NEXT_PUBLIC_SITE_URL=https://ваш-домен`, иначе canonical-ссылки и sitemap будут указывать на старый адрес.
   - По желанию: `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_ADS_ID`, `NEXT_PUBLIC_ADS_LEAD_LABEL`, `NEXT_PUBLIC_BOOKING_URL`. Эти значения встраиваются в страницы при сборке: после изменения нужен новый деплой.
   - Надёжнее всего вписать публичные значения (домен, ID счётчиков, ссылку записи) в `deploy/public.env.sh` и закоммитить: тогда сборка не зависит от того, передаёт ли хостинг переменные на этапе сборки. Непустая переменная из панели всё равно важнее файла. Секреты в этот файл не кладутся.
   - Секреты для заявок: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `RESEND_API_KEY`, `LEAD_EMAIL_TO`, `LEAD_EMAIL_FROM`, `AMO_DOMAIN`, `AMO_TOKEN`, `AMO_PIPELINE_ID`. Читаются при работе сервера и в образ не попадают.
4. **Порт:** 3000 (указан в `EXPOSE`).
   - Защита формы: не больше 5 заявок с одного адреса за 10 минут и 30 в минуту на весь сайт. Адрес клиента берётся из `X-Forwarded-For` с учётом числа прокси перед приложением: `TRUSTED_PROXY_HOPS` (по умолчанию 1). Если после деплоя заявки с разных устройств начинают упираться в лимит, значит, прокси два: поставьте `TRUSTED_PROXY_HOPS=2`.
5. **Домен:** привяжите домен к приложению и включите бесплатный SSL. Корень `/` перенаправляет на `/en`.
6. **Автодеплой** при пуше в ветку включается в настройках приложения.

Каждый PR и пуш в `main` проверяет GitHub Actions (`.github/workflows/build-check.yml`): typecheck, lint, сборка Docker-образа и smoke-тест страниц, `/healthz` и API заявок. Если проверка красная, деплой лучше не запускать.

Проверка образа локально:

```sh
docker compose -f compose.local.yml up --build   # затем http://localhost:3000
```

Без Docker: `NEXT_PUBLIC_SITE_URL=https://ваш-домен npm run build:static && npm run serve:static`.

## Публикация

Основной способ — Docker (см. выше). Копию для GitHub Pages можно собрать командой `npm run build:pages`; её workflow запускается только вручную, публикация на Pages закрыта.

Конфигурация `.openai/hosting.json` осталась от исходного шаблона Sites и для деплоя не нужна.

Подробности исходного окружения: [docs/SITES-STARTER.md](docs/SITES-STARTER.md).
