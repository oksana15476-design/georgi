# Цели аналитики

**Дата:** 2026-10-06. Код — `components/analytics.tsx`. Счётчики грузятся только после согласия на cookie.

| Действие на сайте | Событие GA4 | Цель Метрики (идентификатор) | Meta Pixel |
|---|---|---|---|
| Отправил форму | `generate_lead` | Заявка (`lead`) | Lead |
| Начал заполнять форму | `form_start` | Начало заполнения формы (`form_start`) | — |
| Нажал «Записаться на аудит» (открыл календарь) | `booking_click` | Запись на аудит (`contact_booking`) | Contact |
| Забронировал время в Cal.com | `booking_complete` + `generate_lead` (параметр `method: booking`) | Запись в Cal.com (`booking_done`) + Заявка (`lead`) | Lead |
| Нажал WhatsApp | `whatsapp_click` | WhatsApp (`contact_whatsapp`) | Contact |
| Нажал Telegram | `telegram_click` | Telegram (`contact_telegram`) | Contact |
| Нажал телефон | `phone_click` | Звонок (`contact_phone`) | Contact |
| Нажал «Бесплатный аудит» / основную кнопку | `cta_click` | Клик «Бесплатный аудит» (`cta`) | Contact |
| Двигал калькулятор | `calculator_use` | Калькулятор (`calculator`) | — |
| Начал квиз «Мини-аудит» | `quiz_start` | Квиз: начал (`quiz_start`) | — |
| Дошёл до результата квиза | `quiz_complete` | Квиз: получил результат (`quiz_complete`) | — |
| Оставил контакт в квизе | `generate_lead` (параметр `form: quiz`) | Заявка (`lead`) | Lead |
| Увидел / закрыл попап | `popup_view` / `popup_close` (параметр `type`: `exit` или `idle`) | — | — |

Клики внутри попапа считаются обычными целями (WhatsApp, запись, CTA); в параметре `section` — `Popup exit` или `Popup idle`.

**Попап** (`components/praxen/lead-popup.tsx`): один раз за сессию — на компьютере, когда курсор уходит за верх окна (не раньше 10 с на странице), на любом устройстве после 40 с бездействия. Не показывается тем, кто начал форму или уже нажал WhatsApp, Telegram, телефон или запись (клик «Бесплатный аудит» не мешает), поверх блока контактов, на странице конфиденциальности и 3 дня после закрытия. Проверить вид: `praxenai.ge/ru?popup=exit` или `?popup=idle` — показывается сразу, без условий.

Цель Метрики «Контакт» (условие «содержит `contact`») суммирует все `contact_*`: WhatsApp, Telegram, звонок, запись.

**Ключевые события GA4** (Администратор → Отображение данных → Ключевые события): `generate_lead` (форма, квиз и брони Cal.com), `whatsapp_click`, `telegram_click`, `phone_click`. `booking_click` (только открыл календарь), `cta_click`, `form_start`, `calculator_use` и `quiz_*` — не ключевые, это шаги воронки.

Календарь Cal.com открывается окном на сайте (`components/booking.tsx`), поэтому сама бронь засчитывается как заявка. Если скрипт Cal.com заблокирован или посетитель открыл ссылку с Ctrl/Cmd, откроется обычная страница cal.com — такие брони в аналитику не попадут.
