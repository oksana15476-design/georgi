# API-ключ Bing Webmaster

1. bing.com/webmasters → войти тем же аккаунтом, где добавлен praxenai.ge.
2. Справа вверху **шестерёнка «Настройки»** → **«API access»** → **«API Key»** → «Generate». Скопировать ключ.
3. `config/.env` (по образцу `.env.example`):
   ```
   BING_API_KEY=ваш_ключ
   BING_SITE=https://praxenai.ge/
   ```
   Или передать ключ Claude — он сохранит файл.
4. Проверка: `node scripts/bing.mjs check`.
