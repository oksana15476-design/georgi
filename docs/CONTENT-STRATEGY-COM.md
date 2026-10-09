# Соцсети praxenai.com (UK, США, ЕС)

**Дата:** 9 октября 2026. Для .ge — `docs/CONTENT-STRATEGY.md`. Сайты — разные компании для своих рынков: профили, тексты и ссылки не смешиваем, Грузию в постах .com не упоминаем.

## Каналы

| # | Канал | Зачем | Как часто |
|---|---|---|---|
| 1 | **Страница компании в LinkedIn** (сайт — praxenai.com) | Главная B2B-соцсеть для британских владельцев и руководителей; LinkedIn цитируют ChatGPT, Perplexity и Gemini | 2 поста в неделю (вт, чт) |
| 2 | **Личный LinkedIn основателя** на английском | Посты от человека получают больше охвата, чем от страницы; репост постов страницы с личным комментарием | 2 раза в неделю |
| 3 | Каталоги агентств с сайтом praxenai.com: Clutch, Sortlist, GoodFirms, DesignRush | Подборки «AI agencies», которые цитируют нейросети | один раз, потом обновлять |

Facebook и Instagram для .com не заводим: британский B2B-клиент ищет подрядчика в LinkedIn и в поиске.

## Шаг 1. Страница компании в LinkedIn (20 минут)

1. linkedin.com → «Для бизнеса» → «Создать страницу компании» → «Компания».
2. Название: **Praxen AI**. Адрес страницы: `linkedin.com/company/praxenai` (если занят — `praxen-ai`).
3. Сайт: **https://praxenai.com**. Отрасль: *IT Services and IT Consulting*. Размер: *2–10*. Тип: *Privately held* (или *Self-employed*).
4. Логотип: `brand/praxen-avatar-dark-1080.png`. Слоган (tagline): **AI receptionists, chatbots and automation for businesses**.
5. После создания: обложка `brand/linkedin-cover-com-1128x191.png`; местоположение можно не указывать.
6. Раздел About (скопировать):
   > Praxen AI sets up AI receptionists, website and WhatsApp chatbots, automation for CRM, documents and invoices, AI agents and team training for businesses in the UK, US and EU. Every project starts with a free 30-minute audit and a pilot on one workflow at a fixed price. Solutions run on the client’s own accounts, and people approve what matters. Prices are on praxenai.com.
7. Кнопка: *Visit website* → https://praxenai.com/?utm_source=linkedin&utm_medium=social&utm_campaign=profile
8. В личном профиле основателя: место работы — Praxen AI (Founder), заголовок на английском.
9. Прислать ссылку на страницу — добавлю её в разметку .com (`lib/profiles.ts`).

## Шаг 2. Публикации

Тексты и картинки: `content/social/com-2026-10.json`, готовые файлы — `content/social/out/com-2026-10/<пост>/en-*.jpg`, подписи с UTM для LinkedIn — `captions.md` рядом. В LinkedIn картинки поста загружаются одним постом (несколько изображений); подпись — из `captions.md`.

| Дата | Пост | Ведёт на |
|---|---|---|
| вт 13.10 | 01 Кто мы и как работаем | главная |
| чт 15.10 | 02 Сколько стоит пропущенный звонок | статья о цене ИИ-ресепшна |
| вт 20.10 | 03 Бухгалтерии: Making Tax Digital | статья для бухгалтерских фирм |
| чт 22.10 | 04 Голосовой агент против меню «нажмите 1» | статья о голосовых агентах |
| вт 27.10 | 05 Кадровые агентства | статья для кадровых агентств |
| чт 29.10 | 06 План внедрения на 90 дней | статья «как внедрить ИИ» |
| вт 03.11 | 07 База знаний для поддержки | статья о базе знаний |
| чт 05.11 | 08 Предложение запуска −30% | цены |

Даты сдвигаются на день реального старта страницы: пришлите дату — пересоберу подписи.

## Правила

- Британский английский; «for businesses», а не «for small businesses».
- Сценарии — с пометкой «Example scenario», расчёты — «Example calculation». Кейсов и отзывов не выдумываем.
- Цены — как на сайте (`lib/intl.ts`), с пометкой, что без НДС.
- Новые пачки — по скиллу `.claude/skills/social-content`, с полями `"site":"praxenai.com"` и `"contacts":"hello@praxenai.com · praxenai.com"` в JSON, рендер: `UTM_SOURCE=linkedin node scripts/social/render.mjs content/social/<пачка>.json`.

## Еженедельная рутина (≈1 час)

1. Вторник и четверг: опубликовать пост на странице и сделать репост в личном профиле с 1–2 своими предложениями.
2. Ответить на комментарии в течение дня; вопросы о цене — на запись на аудит.
3. Пятница: переходы и заявки по `utm_source=linkedin` в GA4 (ресурс praxenai.com).
