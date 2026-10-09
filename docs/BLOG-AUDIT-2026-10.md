# Разбор блогов на уникальность (9 октября 2026)

Правило владельца: темы и статьи блога уникальны на .com и на .ge (CLAUDE.md, правило 8). Уточнение владельца: статья может раскрывать коммерческую страницу, а внутри блога повторов и дублей быть не должно. Правки статей — только после согласования с владельцем, порядок — `docs/BLOG-EDITORIAL.md`.

## Что проверялось до сих пор

- `scripts/qa/blog-check.ts` ловит только дословные повторы предложений длиннее 40 знаков и обороты «не X, а Y» (до одного на статью). Пересказ того же другими словами, совпадение темы со страницами сайта и шаблонность он не видит.
- Вычитки русского и английского текста человеком или главредом не было. Грузинский текст статей от 9 октября носитель не вычитывал.

## 1. Статья раскрывает коммерческую страницу (допустимо)

Это нормально (решение владельца). Проверить по каждой паре: статья ссылается на страницу и не копирует её текст.

### praxenai.com

| Статья | Страница с тем же запросом |
|---|---|
| `ai-for-accounting-firms` — AI for accounting firms: what to automate first | `/industries/accounting` — AI for accounting firms: less data entry |
| `ai-for-recruitment-agencies` — AI for recruitment agencies: screening and scheduling | `/industries/recruitment` — AI for recruitment agencies: shortlist in minutes |
| `ai-for-law-firms` — AI for law firms: intake, documents and research | `/industries/law-firms` — AI for law firms: every enquiry captured and triaged |
| `ai-for-sales-teams` — AI for sales teams: replies, CRM and follow-ups | `/departments/sales` — AI for sales: every lead answered and logged |
| `ai-training-for-teams` — AI training for teams: programme, format and cost | `/training` — AI training for teams: hands-on half-day workshops |
| `ai-agents-for-business` — AI agents for business: examples and costs | `/services/ai-agents` — AI agents for business, with approvals and logs |
| `ai-chatbot-cost` — AI chatbot for business: how much does it cost? | `/services/ai-chatbot` (раздел «What does an AI chatbot do and what does it cost?») |
| `invoice-automation-ai` — Invoice automation with AI | `/services/ai-automation` — AI automation for invoices, documents and CRM; `/departments/finance` |

### praxenai.ge

| Статья | Страница с тем же запросом |
|---|---|
| `ai-for-hotels-adjara` | `/industries/hotels` — ИИ-консьерж и чат-бот для отелей |
| `ai-for-clinics-georgia` | `/industries/clinics` — ИИ для клиник: чат-бот для записи пациентов |
| `real-estate-leads-batumi` | `/industries/real-estate` — ИИ для агентств недвижимости: лиды |
| `wholesale-orders-1c` | `/industries/wholesale` — заказы из PDF и WhatsApp в счёт |
| `ai-for-logistics-georgia` | `/industries/logistics` — CMR, накладные и статусы грузов |
| `ai-for-retail-georgia` | `/industries/retail` — ИИ для интернет-магазина |
| `ai-for-restaurants-georgia` | `/industries/restaurants` — бронирование столиков в WhatsApp |
| `ai-for-tour-operators-georgia` | `/industries/tourism` — ИИ для турагентств |
| `ai-for-education-georgia` | `/industries/education` — ИИ для школ и курсов |
| `ai-for-manufacturing-georgia` | `/industries/manufacturing` — ассистент по регламентам и ТО |
| `ai-marketing-georgia` | `/departments/marketing` — контент на трёх языках и отчёты |
| `crm-ai-amocrm-bitrix24` | `/departments/sales` — чат-бот в WhatsApp и CRM (частично) |
| `ai-assistant-for-employees` | `/departments/hr` — ответы по регламентам (частично) |

Без пересечений на .ge: `georgian-language-ai`, `choose-ai-integrator-georgia`, `whatsapp-telegram-ai-chatbot` (с оговоркой ниже).

## 2. Повторы внутри блога (исправляем)

Пары статей с наибольшим числом предложений-пересказов (подсчёт скриптом, похожесть слов ≥ 45 %):

- **.com:** `ai-workflow-automation-examples` пересказывает статьи о бухгалтериях, юристах и продажах (по 5 предложений), бухгалтерии и юристы — друг друга (3), кадровые агентства и продажи (3), примеры автоматизации и ИИ-агенты (3). Раздел «What it costs» — одинаковый в 3 статьях.
- **.ge (ru):** отели ↔ рестораны (4), опт ↔ логистика (4), опт ↔ розница (4), отели ↔ недвижимость, опт, логистика (по 3), чат-бот ↔ розница (3), туроператоры ↔ образование (3). Раздел «Сколько стоит» — в 9 статьях.

Темы, которые пересекаются:

- .com, звонки: `ai-receptionist-cost-uk`, `ai-phone-answering-service`, `ai-voice-agents` и страница `/services/ai-receptionist` — четыре адреса про ответ на звонки с ИИ.
- .com, внедрение: `ai-implementation-cost`, `how-to-implement-ai`, `custom-ai-vs-off-the-shelf` и `/services/ai-consultancy` — запросы разные (цена, план, своё или готовое), но содержание частично совпадает.

## 3. Темы пересекаются между сайтами

| praxenai.com | praxenai.ge |
|---|---|
| `ai-chatbot-cost` (сколько стоит чат-бот) | `whatsapp-telegram-ai-chatbot` (что умеет и сколько стоит) |
| `ai-for-sales-teams` (ответы, CRM, напоминания) | `crm-ai-amocrm-bitrix24` |
| `ai-knowledge-base-for-support` (ответы из документов компании) | `ai-assistant-for-employees` (частично) |
| `how-to-implement-ai`, `custom-ai-vs-off-the-shelf` | `choose-ai-integrator-georgia` (частично) |

## 4. Повторы содержания и «ИИ-шность»

Подсчёт скриптом по 16 статьям .com и русским и английским версиям 16 статей .ge (грузинский не считался):

- 286 пар предложений из разных статей с одним смыслом и почти теми же словами: 50 на .com, 75 в русских и 161 в английских текстах .ge.
- Оговорка «токены ИИ оплачиваете провайдерам напрямую» — в 15 из 16 статей каждого блога; «данные остаются на ваших аккаунтах» — в 9–13; «цифры условные» — в 5–10; формула «при стоимости часа 12 ₾ это около … ₾ в месяц» — в 5 статьях .ge.
- Все статьи собраны по одному шаблону: короткий ответ → пример с расчётом → карточки цен → токены → бесплатный аудит. Это главный признак текста, написанного ИИ.
- Штампов (seamless, leverage, «ключевой», «инновационный», «важно отметить») — нет. Явных «не X, а Y» нет, осталось 3 мягких «instead of».

## Как исправить (на согласование)

1. Повторы внутри блога: у каждого тезиса одна статья-владелец, в остальных — ссылка; пересекающиеся темы из раздела 2 развести по разным вопросам читателя или объединить (308-редирект с убранной статьи). Темы между сайтами (раздел 3) развести.
2. Убрать из статей общие оговорки и одинаковый расчёт; у каждой статьи — своя структура под её вопрос.
3. Вычитка русского и английского текста главредом по правилам скилла; грузинский — команде владельца.
4. Дописать в `scripts/qa/blog-check.ts` проверки: совпадение главного запроса статьи с title страниц сайта и статей другого сайта, пересказ (похожие предложения), повтор общих оговорок.

Работу ведёт редакция (`docs/BLOG-EDITORIAL.md`): главред даёт список правок по каждой статье, владелец согласует, после этого правим и публикуем.
