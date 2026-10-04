# Praxis AI — ИИ для бизнеса в Грузии

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

- app/ — маршруты, стили и API формы заявки.
- components/site.tsx — общая структура сайта и главная.
- components/deep-page.tsx — отраслевые страницы, сценарии и демо.
- components/conversion.tsx — форма, кейсы, контакты и интерактивные блоки.
- lib/content.ts — основной контент; тексты хранятся как [ru, en, ka].
- lib/seo.ts — адрес сайта для canonical/hreflang, язык по умолчанию, заголовок и описание сайта.
- lib/page-profiles.ts — сценарии, FAQ и заголовки для 20 направлений.
- lib/contacts.ts — контактные ссылки.
- public/ — статические ресурсы.

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

Политика конфиденциальности — страница `/{язык}/privacy` (`components/praxis/privacy.tsx`). Перед запуском рекламы добавьте реквизиты юрлица и согласуйте текст с юристом.

## Публикация

Текущий сайт: https://praxis-ai-georgia.evgenijbudnikov44.chatgpt.site

Конфигурация .openai/hosting.json сохраняет связь с проектом Sites. Публикация через Sites выполняется отдельно от загрузки исходников в GitHub. GitHub Pages для серверной формы не подходит без отдельного серверного размещения.

Подробности исходного окружения: [docs/SITES-STARTER.md](docs/SITES-STARTER.md).
