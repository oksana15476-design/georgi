# Карта praxenai.com по данным спроса

**Дата:** 2026-10-07. **Данные:** DataForSEO → Google Ads, среднее в месяц за 12 месяцев: `docs/seo-data/volumes-en-UK-2026-10-07.csv`, `volumes-en-US-AE-2026-10-07.csv`. Английские страницы работают и на UK, и на США, поэтому указаны оба рынка. Близкие варианты («ai consultancy / consultant / consulting») Google считает одной цифрой — она учтена один раз. CPC — цена клика в рекламе в США, показатель того, сколько бизнес готов платить за клиента.

Правило: страница появляется, только если под неё есть спрос. Страницы без поискового спроса (About, Security, Pricing, Terms) нужны для доверия и конверсии, а не для трафика.

## Услуги (Solutions)

| Приоритет | Страница | Запросы | UK | США | CPC США |
|---|---|---|---|---|---|
| 1 | `/ai-receptionist` — ИИ-ресепшн и голосовой агент | ai receptionist, ai voice agent, ai phone answering service | 1 760 | 74 100 | $34–54 |
| 2 | `/ai-automation` — автоматизация процессов (+ документы и счета) | ai automation, workflow automation, business process automation, document / invoice automation | 3 530 | 14 810 | $23–72 |
| 3 | `/ai-consultancy` — консалтинг и внедрение | ai consultancy / consulting, ai implementation, ai integration services | 3 080 | 9 820 | $21–52 |
| 4 | `/ai-chatbot` — чат-боты для сайта и WhatsApp, база знаний | ai chatbot for business, whatsapp bot / chatbot, website chatbot, chatbot development, rag chatbot, ai knowledge base | 1 150 | 8 520 | $10–61 |
| 5 | `/ai-agents` — ИИ-агенты | ai agents for business, ai agent development | 200 | 4 190 | $31–88 |
| 6 | `/ai-training` — обучение команды | ai workshop, chatgpt training, ai training for employees / businesses, corporate ai training | 420 | 2 370 | $6–63 |

## Отрасли (Industries)

| Страница | Запрос | UK | США | CPC США | Решение |
|---|---|---|---|---|---|
| `/industries/accounting` | ai for accounting | 1 600 | 6 600 | $36 | делаем |
| `/industries/recruitment` | ai for recruitment | 1 000 | 4 400 | $74 | делаем |
| `/industries/law-firms` | ai for law firms | 480 | 1 600 | $61 | делаем |
| `/industries/hospitality` | ai for hotels | 90 | 590 | $21 | делаем (меньше, но есть спрос) |
| — | ai for estate agents | 50 | 10 | — | **отложено**: малый спрос; в США говорят «real estate» — не проверяли |
| — | ai for dental practices | 10 | 10 | $46 | **отложено**: спроса нет |
| — | мастера и сервисы на выезде (trades) | — | — | — | **отложено**: не проверяли |

## По задачам (Use cases)

| Страница | Запросы | UK | США | CPC США | Решение |
|---|---|---|---|---|---|
| `/use-cases/customer-service` | ai customer service, ai customer support | 590 | 5 280 | $189–212 | делаем — самый дорогой клик в исследовании |
| `/use-cases/sales` | ai for sales, hubspot ai | 640 | 2 900 | $10–34 | делаем |
| `/ai-for-small-business` | ai for small business | 210 | 2 900 | $26 | делаем — наша целевая аудитория |
| — | операции, финансы, HR | — | — | — | **не делаем**: отдельного спроса нет; финансы закрывает страница бухгалтеров, HR — рекрутинга |

## Главная и сервисные страницы

| Страница | Запросы | UK | США |
|---|---|---|---|
| `/` | ai agency, ai for business, ai automation agency | 12 220 | 62 000 |
| `/pricing` | цены (вопросы из выдачи: «How much does it cost to implement AI?», «How much does an AI receptionist cost?») | — | — |
| `/about`, `/security`, `/privacy`, `/terms` | доверие, UK GDPR | — | — |
| `/industries`, `/solutions` | обзорные страницы для навигации | — | — |
| `/blog` | информационные запросы — `docs/CONTENT-PLAN.md` | — | — |

**Итого:** 6 услуг + 4 отрасли + 3 задачи + главная + 7 служебных = 21 страница и блог.

## Пробелы в данных

Не проверяли: «ai for real estate» (США), «ai for dental office», запросы мастеров (plumber, electrician…), e-commerce, Канада и Австралия. Баланс DataForSEO исчерпан ($0.06); проверка — ≈$0.09 за страну, после пополнения на $5–10.
