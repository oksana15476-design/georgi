# Доступ к Search Console и GA4

Два способа. **Основной — вход вашим аккаунтом Google (OAuth):** доступ к Search Console и GA4 у аккаунта уже есть, ничего выдавать не нужно. Сервисный аккаунт — запасной: в новых проектах Google часто запрещает ключи (политика `iam.disableServiceAccountKeyCreation`).

## Способ 1. OAuth (вход вашим аккаунтом)

1. console.cloud.google.com → проект (например, «My First Project»). **APIs & Services → Library** → включить **Google Search Console API** и **Google Analytics Data API**.
2. **APIs & Services → OAuth consent screen** (Google Auth Platform) → «Get started»: название `Praxen reports`, email поддержки — ваш; Audience: **Internal**, если доступно, иначе **External**; контактный email → Create.
3. Если выбрали External: **Audience → Publish app → Confirm** (статус «In production»). Иначе токен перестаёт работать через 7 дней. Проверку Google проходить не нужно — при входе будет предупреждение «Приложение не проверено» → «Дополнительно» → «Перейти».
4. **Clients → Create client** → тип **Desktop app** → Create → **Download JSON**. Сохранить как `config/oauth-client.json` (или передать содержимое Claude).
5. `node scripts/google.mjs auth-url` → открыть ссылку, войти аккаунтом с доступом к Search Console и GA4, разрешить. Браузер перейдёт на `http://localhost/?code=…` и покажет ошибку — это нормально: скопировать адрес целиком.
6. `node scripts/google.mjs auth-exchange --code 'скопированный адрес'` → строку `GOOGLE_REFRESH_TOKEN=…` добавить в `config/.env`.

## Способ 2. Сервисный аккаунт

1. **IAM & Admin → Service Accounts → Create** → **Keys → Add key → JSON** → сохранить как `config/service-account.json`.
2. Search Console → «Настройки» → «Пользователи и разрешения» → добавить email сервисного аккаунта («Полный доступ»). GA4 → «Администратор» → «Управление доступом к ресурсу» → тот же email, роль «Читатель».

## config/.env

```
GSC_SITE=sc-domain:praxenai.ge      # или https://praxenai.ge/ для ресурса с префиксом URL
GA4_PROPERTY=123456789              # GA4 → Администратор → Сведения о ресурсе, только цифры
GOOGLE_REFRESH_TOKEN=...            # для способа 1
```

Проверка: `node scripts/google.mjs check`.
