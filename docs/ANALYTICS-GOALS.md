# Цели аналитики

**Дата:** 2026-10-06. Код — `components/analytics.tsx`. Счётчики грузятся только после согласия на cookie.

| Действие на сайте | Событие GA4 | Цель Метрики (идентификатор) | Meta Pixel |
|---|---|---|---|
| Отправил форму | `generate_lead` | Заявка (`lead`) | Lead |
| Начал заполнять форму | `form_start` | Начало заполнения формы (`form_start`) | — |
| Нажал «Записаться на аудит» (Cal.com) | `booking_click` | Запись на аудит (`contact_booking`) | Contact |
| Нажал WhatsApp | `whatsapp_click` | WhatsApp (`contact_whatsapp`) | Contact |
| Нажал Telegram | `telegram_click` | Telegram (`contact_telegram`) | Contact |
| Нажал телефон | `phone_click` | Звонок (`contact_phone`) | Contact |
| Нажал «Бесплатный аудит» / основную кнопку | `cta_click` | Клик «Бесплатный аудит» (`cta`) | Contact |
| Двигал калькулятор | `calculator_use` | Калькулятор (`calculator`) | — |

Цель Метрики «Контакт» (условие «содержит `contact`») суммирует все `contact_*`: WhatsApp, Telegram, звонок, запись.

**Ключевые события GA4** (Администратор → Отображение данных → Ключевые события): `generate_lead`, `booking_click`, `whatsapp_click`, `telegram_click`, `phone_click`. `cta_click`, `form_start` и `calculator_use` — не ключевые, это шаги воронки.

Клик по записи — ещё не запись: сама бронь происходит на cal.com и в аналитику не попадает.
