# Доступ к Search Console и GA4

1. **Проект Google Cloud.** console.cloud.google.com → вверху выбор проекта → «Создать проект» → название `praxen-analytics`.
2. **Включить API.** «APIs & Services» → «Library» → найти и включить **Google Search Console API** и **Google Analytics Data API**.
3. **Сервисный аккаунт.** «IAM & Admin» → «Service Accounts» → «Create service account» → имя `praxen-reports` → «Done» (роли не нужны).
4. **Ключ.** Открыть аккаунт → «Keys» → «Add key» → «Create new key» → JSON. Скачается файл. Положить его сюда как `config/service-account.json` (или передать содержимое Claude — он сохранит файл).
5. **Search Console.** search.google.com/search-console → ресурс praxenai.ge → «Настройки» → «Пользователи и разрешения» → «Добавить пользователя» → email сервисного аккаунта (`...@...iam.gserviceaccount.com`) → разрешение «Полный доступ» (нужен для отправки sitemap; для отчётов достаточно «Ограниченный»).
6. **GA4.** analytics.google.com → «Администратор» → «Управление доступом к ресурсу» → «+» → тот же email → роль «Читатель». Там же в «Сведения о ресурсе» скопировать **идентификатор ресурса** (только цифры, не G-…).
7. **config/.env** (по образцу `.env.example`):
   ```
   GSC_SITE=sc-domain:praxenai.ge
   GA4_PROPERTY=123456789
   ```
   Если ресурс в Search Console добавлен как «Ресурс с префиксом в URL», укажите `GSC_SITE=https://praxenai.ge/`.
8. Проверка: `node scripts/google.mjs check`.
