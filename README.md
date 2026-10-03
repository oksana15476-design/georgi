# Praxis AI — ИИ для бизнеса в Грузии

Многоязычный сайт на русском, английском и грузинском. Главная страница, 12 отраслевых страниц, 8 страниц отделов, решения, обучение и примеры внедрения.

## Локальный запуск

Требуется Node.js >= 22.13.0 и npm.

```sh
npm ci
npm run dev
```

Откройте http://localhost:5173/ru (также доступны /en и /ka).

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
- lib/content.ts — основной контент RU / EN / KA.
- lib/page-profiles.ts — сценарии, FAQ и заголовки для 20 направлений.
- lib/contacts.ts — контактные ссылки.
- public/ — статические ресурсы.

## Заявки в Telegram

Прямая ссылка настроена на @zheniazikinzik. Для автоматической отправки формы нужно задать серверные переменные TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID. Названия указаны в .env.example; настоящих значений в репозитории нет.

API app/api/leads/route.ts читает переменные из Cloudflare Worker environment. На хостинге задайте их как секреты; для локального Worker можно использовать игнорируемый файл .dev.vars. До настройки API возвращает 503, а форма показывает ошибку без ложного подтверждения отправки.

## Публикация

Текущий сайт: https://praxis-ai-georgia.evgenijbudnikov44.chatgpt.site

Конфигурация .openai/hosting.json сохраняет связь с проектом Sites. Публикация через Sites выполняется отдельно от загрузки исходников в GitHub. GitHub Pages для серверной формы не подходит без отдельного серверного размещения.

Подробности исходного окружения: [docs/SITES-STARTER.md](docs/SITES-STARTER.md).
