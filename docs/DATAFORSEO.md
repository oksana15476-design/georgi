# DataForSEO для Praxen AI: что полезно и что уже проверено

**Дата:** 2026-10-05. Каждое направление проверено одним реальным запросом. Всего потрачено около $0.41 из тестового $1.
**Доступ:** логин и пароль в репозиторий не кладём. Скрипт `scripts/seo/dataforseo.mjs` берёт их из переменной `DATAFORSEO_AUTH` (base64 от `login:password`).

```sh
export DATAFORSEO_AUTH=...                                      # base64("login:password")
node scripts/seo/dataforseo.mjs volume docs/seo-data/keywords.txt  # частотности ядра, ~$0.09
node scripts/seo/dataforseo.mjs serp "чат-бот whatsapp" ru          # топ-20 Google в Грузии, $0.002–0.004
node scripts/seo/dataforseo.mjs llm "Какие компании в Грузии внедряют ИИ?"  # ответ ChatGPT с источниками, ~$0.015
node scripts/seo/dataforseo.mjs balance
```

---

## Что работает для Грузии и что мы из этого взяли

| API | Работает для Грузии | Цена запроса | Что дало |
|---|---|---|---|
| **Keywords Data → Google Ads: Search Volume** | да (RU, EN) | $0.09 за ≤1000 ключей | Частотности ядра: `docs/seo-data/search-volume-georgia-2026-10.csv` |
| **Keywords Data → Google Ads: Keywords for Keywords** | да | $0.09 за ≤20 семян | 4 445 идей, после фильтра 712: `docs/seo-data/keyword-ideas-georgia-2026-10.csv` |
| **Keywords Data → Google Trends** | да, в том числе KA | $0.011 | Сравнение грузинских запросов, для которых Google Ads объёмов не даёт |
| **SERP → Google Organic** | да (RU, EN, KA) | $0.002–0.004 | Кто стоит в топе, AI Overview, «Похожие вопросы» (PAA) |
| **SERP → Google Maps** | да | $0.002 | Конкуренты с Google Business Profile и отзывами |
| **Backlinks → Summary** | да | $0.024 | Ссылочный профиль конкурента |
| **AI Optimization → ChatGPT LLM Responses** | да (поиск из GE) | ~$0.015 | Кого ChatGPT называет и на какие источники ссылается |
| **SERP → Google Autocomplete** | да (KA, RU, EN) | $0.002 | Подсказки Google. Для KA это единственный источник реальных формулировок |
| **AI Optimization → Perplexity (sonar)** | да | ~$0.006 | Кого называет Perplexity и откуда берёт |
| **AI Optimization → Gemini (с поиском)** | да | ~$0.037 | Кого называет Gemini |
| Keywords Data → Google Ads: Keywords for Site | формально да | $0.09 | Для маленьких сайтов бесполезно: по ainow.ge один ключ |
| **OnPage → Instant Pages / Lighthouse** | да | $0.00015 | Проверка страниц. Сейчас наш адрес отдаёт **401**, сайт закрыт; аудит заработает после публикации на домене |
| DataForSEO Labs (ranked keywords, keyword difficulty, конкуренты) | **нет**: Грузия не поддерживается (`Invalid Field: location_code`) | — | — |

### Остальные функции и когда они пригодятся
| API | Зачем нам | Когда |
|---|---|---|
| SERP → Bing Organic | Bing питает Copilot и поиск ChatGPT, позиции там проверять дешевле, чем гадать | после индексации |
| SERP → YouTube | Кто в выдаче по «AI chatbot WhatsApp demo», если снимем видео-демо | при запуске YouTube |
| Business Data → Google My Business Info / Reviews | Отзывы и категории конкурентов в Картах, мониторинг собственных отзывов | после создания GBP |
| Content Analysis → Search / Summary / Sentiment | Упоминания «Praxen AI» в сети и их тон: метрика бренда для GEO | когда появятся публикации |
| OnPage → Crawl (task) | Полный технический краул всех 84 страниц, битые ссылки, дубли | после публикации на домене |
| Backlinks → Referring Domains / Domain Intersection | Где ссылаются на конкурентов, но не на нас: готовый список площадок | сразу (~$0.02–0.05) |
| AI Optimization → LLM Mentions | Частота упоминаний бренда в ответах ИИ | обычно отдельная подписка |
| AI Optimization → Claude LLM Responses | Ещё одна модель для ежемесячного замера | по желанию |
| Domain Analytics → Technologies / Whois | На чём сделаны сайты конкурентов | не нужно |
| Merchant, App Data, Amazon | — | не нужно |

---

## Выводы из проверок

### 1. Частотности (Google Ads, Грузия, последние 12 месяцев)
- Объёмы маленькие, рынок нишевый. Коммерческих запросов с частотой 10+ много, но почти все ровно по 10 в месяц: Google Ads округляет малые значения.
- **Самые частые коммерческие:** `WhatsApp bot` 70, `ии агенты` 40, `AI for business` 30, `AI workshop` 30, `AI automation agency` 20, `WhatsApp chatbot` 20, `телеграм бот` 20.
- **Высокочастотные, но информационные:** `AI chatbot` 1 300, `AI agent` 260, `чат бот` 210. В выдаче приложения, Reddit и справочные статьи. Это не наш трафик, но слова нужны в текстах.
- **Обучение:** `AI course` 70 (высокая конкуренция, CPC $3.5), `AI workshop` 30, `AI training` 20.
- **Самый дорогой клик:** `AI voice agent` — CPC $8.9, значит, рекламодатели на нём зарабатывают.
- **Грузинские запросы:** Google Ads объёмов не отдаёт. По Google Trends `ხელოვნური ინტელექტი` ищут примерно в 38 раз чаще, чем `AI chatbot` (≈1 300). `AI` латиницей популярнее грузинского написания. `ჩატბოტი`, `ავტომატიზაცია`, `AI კურსი` в Trends почти на нуле.

### 2. Выдача (SERP)
- `ჩატბოტი`: livecaller.ge, veziri.ge, kwiga, talkai.ge, ainow.ge (12-е место), chatty.ge, chatflow.ge. На грузинском конкуренты в основном местные, и их немного.
- `AI automation agency Tbilisi`: ainow.ge на 2-м месте, есть **local pack** (карта с компаниями), есть подборка softaims.com «8 Best AI Development Companies in Georgia».
- `WhatsApp bot`: только глобальные SaaS и инструкции, местных компаний нет. На общий запрос с ними не пробиться. Нам нужен длинный хвост: «WhatsApp-чат-бот для бизнеса в Грузии / Тбилиси».
- `внедрение ии в бизнес` (RU): в топе только российские сайты. «Похожие вопросы»: *«Сколько стоит внедрить ИИ в бизнес?»*, *«Как внедрить ИИ-агента в бизнес?»*. Оба добавлены в FAQ.
- По всем запросам Google показывает **AI Overview**, поэтому самодостаточные абзацы-ответы и FAQ важнее позиций.

### 3. Google Maps: «AI agency» в Грузии
Топ-20 — маркетинговые агентства, в основном из Азербайджана и Турции, с 0–35 отзывами. **Ниша в Картах почти пустая.** Google Business Profile с 5–10 отзывами быстро выводит в local pack по запросам «AI agency / automation Tbilisi».

### 4. Ссылки конкурента
ainow.ge: 80 ссылающихся доменов (52 основных), сайт виден с февраля 2026 года, spam score 5. Это ориентир: 50+ доменов за полгода.

### 5. Что отвечает ChatGPT (gpt-5-mini с веб-поиском, страна GE)
На «Какие компании в Грузии занимаются внедрением ИИ и чат-ботов?» называет: **AI NOW (ainow.ge)**, BotLab, Bonteco, Chatty, aichatbot.ge, ISsoft. Ссылается на **Clutch** («Top Chatbot Companies in Georgia») и **The Manifest**. Praxen AI не упоминается. Это точка отсчёта.

### 6. Подсказки Google (Autocomplete)
- KA: «ჩატბოტის შექმნა», «ჩატბოტის დაყენება», «**ქართული ჩატბოტი**», «ai ჩატბოტი», «ხელოვნური ინტელექტი **ქართულად**», «ხელოვნური ინტელექტის გამოყენება», «ხელოვნური ინტელექტი საქართველოში». Грузины ищут бота, который говорит по-грузински. Это добавлено в грузинские title главной и поддержки.
- RU «чат бот»: подсказки про госуслуги и банки (Аэрофлот, МВД, ГАИ), коммерческих нет.

### 7. Perplexity и Gemini
- **Perplexity** называет Gegidze, Mzia, Optio, Fresh Lime Soft, WeGotCode и другие. Источники — каталоги **TechBehemoths (раздел Tbilisi)**, **Sortlist**, **DesignRush**, **F6S**, inven.ai, а также страницы услуг конкурентов.
- **Gemini** называет MaxinAI, Fresh Lime Soft, RCG Solutions, Anronix, XISLABS.
- Ни одна модель не называет Praxen AI. Даже ainow.ge есть только у ChatGPT. У каждой модели свои источники, поэтому присутствие в каталогах важнее одного сайта.

---

## Что делать с этим дальше

**Сделано в коде (на существующих страницах, без новых):**
- Title и description главной, отделов, обучения, решений и поддержки переписаны под подтверждённые запросы: чат-бот, ИИ-агенты, WhatsApp / Telegram-бот, AI training / workshop, «ქართული ჩატბოტი».
- H1 разделов «Отделы» и «Обучение», вводный абзац hero, ответ «Что такое Praxen AI?».
- FAQ: «Как внедрить ИИ-агента в бизнес?» (вопрос про цену WhatsApp-бота убран по решению владельца 2026-10-06) (из «Похожих вопросов» Google), WhatsApp Business API на продажах, сравнение с конструкторами на поддержке.
- Разметка Service и llms.txt: чат-бот для WhatsApp и Telegram от 3 200 ₾.

Полный план «как забрать выдачу»: `docs/SEO-ACTION-PLAN.md`.

**Без кода (по приоритету):**
1. **Google Business Profile** в Тбилиси, категория «Software company» / «Business management consultant». Ниша в Картах пустая.
2. **Профили в каталогах:** Clutch и The Manifest (их цитирует ChatGPT), TechBehemoths, Sortlist, DesignRush, F6S (их цитирует Perplexity). Попросить 2–3 отзыва от первых клиентов.
3. Попасть в подборки вроде softaims «Best AI Development Companies in Georgia».
4. Опубликовать сайт на домене и прогнать страницы через OnPage API (instant pages, около $0.0002 за страницу).
5. **Раз в месяц:** `llm` с тремя вопросами (RU/EN/KA) и `volume` по ядру. Сравнивать, появился ли Praxen в ответах ChatGPT.
6. Баланс: ежемесячный замер (частотности + 3 вопроса ChatGPT + 5 выдач) стоит около $0.15–0.2.
