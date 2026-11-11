# Рекомендации главреда: блоги praxenai.com и praxenai.ge (10 ноября 2026)

Проверка по `docs/BLOG-EDITORIAL.md` (чек-лист главреда), скиллам praxen-blog, brand-voice, humanizer (номера признаков §), seo-content, geo-citability, geo-content, ai-seo, content-strategy, marketing-claims-review. В репозитории ничего не менял. `scripts/qa/blog-check.ts` не запускал (в этой сессии нет терминала), повторы считал поиском по `lib/intl-blog.ts` и `lib/ge-blog.ts`.

Файлы: статьи .com — `lib/intl-blog.ts`, статьи .ge — `lib/ge-blog.ts`, вёрстка статьи — `components/intl/blocks.tsx` (Article, relatedPosts), `components/praxen/blog.tsx` (GeArticle), блоки — `components/article-blocks.tsx`, разметка — `lib/intl-seo.ts`, `lib/seo.ts`, llms — `public/llms-intl.txt`, `public/llms.txt`.

---

## 0. Выполнение плана «1 статья в день»

### praxenai.com (календарь `docs/blog-com/CALENDAR-2026-11.md`, 02.11–01.12: 25 NEW + 5 UPDATE)

| Строка плана (02–10.11) | Факт в коде |
|---|---|
| 02.11 NEW whatsapp-business-api | опубликована 02.11 |
| 03.11 NEW ai-accounting-software | 03.11 |
| 04.11 NEW whatsapp-chatbot-for-business | 04.11 |
| 05.11 UPDATE invoice-automation-ai (AP automation) | «accounts payable» есть в ответе и первом абзаце; дата статьи не менялась (9 октября), сделан ли UPDATE целиком, по коду не подтвердить |
| 06.11 и 07.11 UPDATE ai-phone-answering-service | разделы «After-hours and 24/7 answering», «Setting up out-of-hours cover» и абзац про virtual receptionist есть; на странице по-прежнему «9 October 2026» |
| 08.11 NEW chatgpt-for-business | 09.11 (на день позже) |
| «чт 05.11» NEW n8n-vs-zapier-vs-make (в календаре опечатка в дате, строка стоит между 08.11 и 10.11) | 06.11 |
| 10.11 NEW copilot-training-for-staff | 09.11 (на день раньше) |

Итого за 9 дней: 6 новых адресов из 6 по плану и 2 UPDATE из 3 (третий не подтверждён). По месяцу сделано 8 строк из 30 (27 %), прошло 30 % срока, отставания нет. Ритм неровный: новых адресов не было 5, 7 и 8 ноября, а 9 ноября вышли сразу две статьи. Следующая по плану — 11.11 `gdpr-and-ai`.

### praxenai.ge (календарь `docs/blog-ge/CALENDAR-2026-11.md`, 10.11–09.12: 14 NEW, 12 UPDATE, 1 LANDING, 3 PROMO)

- В ноябре не вышло ни одной статьи. Все 16 статей датированы 8–9 октября, с 9 октября их не правили.
- Строка 10.11 (`/ru/blog/ai-tools-for-business`) в коде пока отсутствует: 0 из 1 на сегодня.
- Повторы из октябрьского аудита (`docs/BLOG-AUDIT-2026-10.md`) не исправлены. В календаре они стоят на 26.11–08.12.

---

## 1. praxenai.com: разбор статей

### copilot-training-for-staff (09.11): «принято»
Сильная статья: в ответе есть определение, первый шаг и цена; дальше таблица по приложениям, разбор проверки прав доступа и план на 4 недели. Мелочи:
1. Ссылка «Our article on AI training for teams covers the shared prompt library…» не кликабельна, потому что блоки статьи вообще не поддерживают ссылки в тексте (см. рекомендацию 2).
2. Фразы «Microsoft states…» и «Copilot Chat is free for work accounts» стоят без ссылки на источник и без даты проверки.
3. CTA внизу общий для всего блога («Want the numbers for your business? … hours saved») и не подходит к статье про обучение (см. пример 3).

### chatgpt-for-business (09.11): «на доработку»
1. **Правдивость (п. 4).** Сверить с прайсом OpenAI на дату публикации: типы мест «Standard» и «Premium» в Business, план Go, минимум 2 пользователя, фразу «never used for training». Факты о продукте конкурента пишем только когда уверены. Рядом поставить «checked on <дата>».
2. **Уникальность (п. 5).** В разделе «UK GDPR: decisions to make before personal data goes in» 6 пунктов. 11.11 выходит `gdpr-and-ai`, и этот тезис должен принадлежать ей. В день её выхода сократить раздел до одной фразы со ссылкой.
   - Было: заголовок раздела и 6 пунктов (controller, DPA, lawful basis, special category, client data, policy).
   - Стало: «UK GDPR applies to what staff type in, whichever plan you choose; our guide to GDPR and AI lists the checks to make before personal data goes in.» + ссылка.
3. Ответ заканчивается той же ценовой формулой, что и 17 других ответов (см. «Повторы»).

### whatsapp-business-api (02.11): «принято» после сверки фактов
Прямой ответ, таблица «app vs API», шаги, правила тарификации: хороший кандидат на цитирование нейросетями. Нужно:
1. Даты и правила Meta в списке фактов ниже (15 января 2026, лимит с 250 на портфолио, coexistence). Дать ссылки на страницу тарифов Meta и на условия, указать «Meta’s rate card, checked <дата>».
2. Строку календаря 23.11 `whatsapp-business-pricing` заранее перевести в UPDATE этой статьи: раздел «How pricing works» и FAQ «Is the WhatsApp Business API free?» уже отвечают на тот же запрос.

### ai-receptionist-cost-uk (07.10): «на доработку»
Это главная статья под запрос о цене, по звонкам уже есть показы (в календаре: «24 7 ai receptionist», 36 показов, позиции 70–90). При этом она самая тонкая в блоге, около 450 слов.
1. **Claims (п. 4).** Было: «One in five is a cautious starting point for new enquiries.» Слово «cautious» (осторожная оценка) ничем не подкреплено. Стало: «As an example, assume one in five; use your own conversion rate if you track it.»
2. **humanizer §1.** Было: «It does not replace your team. It answers when they cannot and hands over anything that needs judgement.» Стало: «It answers when your team cannot and hands over anything that needs judgement.»
3. **Шаблон (п. 5).** «Your numbers will differ, which is why we start with a free 30-minute audit» повторяет оговорку об аудите, которая уже стоит в CTA под каждой статьёй. Убрать.
4. **Углубить своими данными** (UPDATE, title не трогаем). Таблица «месячная стоимость при 100 / 300 / 600 звонках» из `rcMonth` и `usage` с сайта, раздел «What’s in the setup fee», FAQ с формулировками из Search Console. Сейчас раздел «Monthly cost side by side» в `ai-phone-answering-service` отвечает на тот же вопрос лучше. Владелец запроса о цене — эта статья, поэтому в phone-answering оставить сравнение с живым сервисом и дать ссылку сюда.

### ai-for-recruitment-agencies (08.10): «на доработку»
1. **humanizer §1 и claims.** Было: «In most agencies the time does not go on finding candidates. It goes on reading applications that do not fit, chasing people to agree a time, and answering “any news?” messages.» (антитеза, «in most agencies» без источника). Стало: «Three jobs in an agency’s week follow rules you can write down: reading applications against the brief, agreeing interview times and answering “any news?” messages. AI can prepare all three for a consultant to check.»
2. **Закон (п. 4, владельцу).** Фразу «UK GDPR restricts decisions based solely on automated processing…» написали до того, как Data (Use and Access) Act 2025 изменил в UK правила об автоматизированных решениях (ст. 22 и новые 22A–22D). Нужно проверить дату вступления в силу и формулировку. Отсылку к рекомендациям ICO дать со ссылкой.
3. В таблице цен в колонке «Price» стоит «2–4 weeks, £…», поэтому на карточке крупно выходит срок вместе с ценой. Перенести срок в отдельную колонку «Timeline», как в других статьях.

### Ещё по октябрьской пачке .com (humanizer, правим с одного появления)
- `ai-for-law-firms`: «AI prepares, sorts and drafts. A solicitor reviews, decides and signs.» Это §6 (тройка по шаблону) плюс рефрен «люди решают, ИИ готовит» из чек-листа (п. 6). Удалить: ответ статьи уже говорит то же самое.
- `ai-implementation-cost`: «The most expensive AI projects are the ones that try to change everything at once.» Это §3 (фраза, звучащая глубокомысленно) и утверждение без источника. Стало: «Start with one workflow that has a clear metric: calls answered, invoices entered or replies sent within a minute.»
- `ai-knowledge-base-for-support`: «The practical consequence is simple.» Это §4 (подводка вместо мысли), удалить. Следующее предложение начать с «Answer quality depends mostly on the documents.»
- `ai-for-accounting-firms`: «AI will not do the accounting for you. It can take over the admin…» Это §1, разнесённая на два предложения антитеза. Стало: «AI can take over the admin that surrounds each deadline, so the extra rounds do not land on your accountants’ evenings.» Там же раздел «What it costs» называет цены дважды: абзацем и таблицей. Абзац убрать.

---

## 2. praxenai.ge: разбор статей (ru; en — та же правка; ka — команде владельца)

### whatsapp-telegram-ai-chatbot: «на доработку»
1. **Повтор тезиса (п. 5).** Раздел «Как проверить подрядчика» (5 пунктов: только база знаний, передача человеку, ваши аккаунты, тест на грузинском, цена и метрика до старта) пересказывает чек-лист из `choose-ai-integrator-georgia` и тестовый набор из `georgian-language-ai`. Владелец тезиса — `choose-ai-integrator-georgia`. Здесь оставить одну фразу со ссылкой: «Вопросы подрядчику и красные флаги в КП — в статье о выборе ИИ-интегратора; как проверить ответы на грузинском — в статье о тестовом наборе».
2. **SEO.** Description около 117 знаков при норме 140–160. Менять только по данным Вебмастера и Search Console (правило 2), сначала посмотреть показы.
3. **GEO.** Тарифы Meta и бесплатность Telegram дать со ссылкой на источник и датой проверки. В 11.11 (UPDATE с разделом о WhatsApp Business API) добавить H2-вопрос с формулировкой из Вордстата: «Как подключить WhatsApp Business API и сколько платить Meta».

### crm-ai-amocrm-bitrix24: «на доработку»
1. **Повтор расчёта (п. 5).** Формула «При стоимости часа 12 ₾ это около 660 ₾ в месяц» кочует по 6 статьям (отели — 10 ₾, опт, логистика, туроператоры, CRM, ассистент — 12 ₾). См. пример 1 ниже.
2. **Общие оговорки (п. 5).** Абзац «Токены ИИ… на своём аккаунте. Сделки… остаются в вашей CRM… Модели провайдеров… не обучаются… Аудит бесплатный…» содержит четыре стандартные оговорки сразу. Оставить одну, про записи звонков у телефонии клиента: без неё читатель ошибётся. Остальное убрать, это есть на `/ru/solutions` и `/ru/security`.
3. Статья — владелец «резюме звонка в CRM». На неё должны ссылаться `speech-analytics` (16.11) и UPDATE от 24.11. Это уже стоит в календаре, при выпуске проверить.

### choose-ai-integrator-georgia: «на доработку», срочно
1. **Каннибализация (п. 7).** H2 «Как внедрить ИИ в бизнес: этапы и цены» тянет запрос главной `/ru`. Календарь ставит правку на 30.11, я бы перенёс её на ближайший свободный день: правка маленькая.
   - Было: «Как внедрить ИИ в бизнес: этапы и цены» + 6 шагов + таблица цен.
   - Стало: H2 «Как сравнить КП по цене пилота»; таблица «что входит в фиксированную цену пилота / что оплачивается отдельно / что спросить»; одна ссылка на `/ru` с анкором «внедрение ИИ в бизнес»; таблицу четырёх форматов убрать (она есть на `/ru/solutions`).
2. Эту статью сделать владельцем тезиса «как проверить подрядчика» и дать на неё входящие ссылки из `whatsapp-telegram-ai-chatbot` и `georgian-language-ai`.

### ai-for-hotels-adjara: «на доработку»
1. **Claims (п. 4).** Было: «К этому добавляются ночные брони, которые раньше уходили к конкурентам.» Утверждение без данных. Стало: «Ночные брони считаем отдельно: сколько сообщений пришло после ухода администратора за прошлый сезон и сколько из них стали бронями.»
2. Формула «При стоимости часа около 10 ₾ это 600 ₾ в месяц» (см. повторы). Для отеля своя метрика уже есть в плане по месяцам: время ответа и число броней из переписки.
3. **Свежесть.** Заголовок «до сезона 2027» и план «Октябрь–ноябрь: аудит» сейчас попадают в сезон спроса. Повод для UPDATE с видимой датой обновления. В календаре стоит 01.12, лучше раньше: в ноябре это ещё актуально.

### georgian-language-ai: «принято»
Самая уникальная статья .ge: таблица с примерами на грузинском, латиницей и смешанным текстом, критерии запуска. Её стоит продвигать для нейросетей: такие примеры нигде больше не встречаются.
- Мягкая антитеза, §1 (одна на статью допустима, но лучше 0). Было: «Поэтому мы не опираемся на общие обещания и проверяем выбранную модель на ваших сообщениях.» Стало: «Поэтому выбранную модель проверяем на ваших сообщениях.»
- Сделать её владельцем тезиса «тестовый набор из реальных сообщений», остальные статьи ссылаются на неё.

### ai-assistant-for-employees (дополнительно)
Расчёт «Если час работы стоит 12 ₾, выходит около 1 300 ₾ в месяц» — та же формула. Для UPDATE 21.11 (раздел RAG) своя метрика: доля вопросов, на которые ассистент ответил со ссылкой на документ, и список пробелов в базе за неделю. Оба показателя уже описаны в разделе «Как поддерживать знания».

---

## 3. Повторы внутри блогов: кто владелец, кто ссылается

### praxenai.com
| Тезис или фраза | Где сейчас | Владелец | Остальным |
|---|---|---|---|
| Ценовая формула в конце «Short answer» («With Praxen… pilot… 2–4 weeks… (… with the launch offer), excluding VAT») | 18 из 22 ответов | `ai-implementation-cost` и статьи о цене (`ai-chatbot-cost`, `ai-receptionist-cost-uk`) | в ответе дать факт по теме статьи, цену один раз в последнем разделе (пример 2) |
| Финальный раздел с ценовыми карточками («What it costs», «Building it with Praxen», «Getting it built…», «Cost, timeline and data» и т. п.) | 13+ статей, одинаковый каркас концовки | страница `/solutions` | раздел с ценой оставить там, где читатель пришёл за ценой; в остальных одна строка цены в тексте и CTA по интенту |
| «Prices exclude VAT» / «excluding VAT» / «at cost on your own accounts» / «enterprise APIs that do not train…» | 39 вхождений | `/solutions` (НДС, оплата провайдерам), `/security` (данные) | одна фраза только там, где без неё читатель ошибётся |
| Расчёт окупаемости «часы × ставка» | `ai-implementation-cost`, `ai-for-accounting-firms`, `ai-workflow-automation-examples`, `ai-chatbot-cost`, `invoice-automation-ai`, `ai-receptionist-cost-uk` | `ai-roi` (27.11), до её выхода — `ai-implementation-cost` | свой показатель статьи; ссылка на ROI |
| «Смена банковских реквизитов → проверка человеком как риск мошенничества» | `ai-for-accounting-firms`, `ai-workflow-automation-examples`, `invoice-automation-ai` | `invoice-automation-ai` | одна фраза со ссылкой |
| «Тест на прошлых реальных вопросах, проходной балл» | `ai-knowledge-base-for-support`, `ai-chatbot-cost`, `ai-workflow-automation-examples`, `whatsapp-chatbot-for-business` | `ai-knowledge-base-for-support` | ссылка |
| UK GDPR перед вводом личных данных | `chatgpt-for-business` (6 пунктов), скоро `gdpr-and-ai` | `gdpr-and-ai` (11.11) | в chatgpt-for-business одна фраза со ссылкой |
| Звонки: «сколько стоит ИИ-ответ» | `ai-receptionist-cost-uk`, раздел «Monthly cost side by side» в `ai-phone-answering-service`, `/services/ai-receptionist` | `ai-receptionist-cost-uk` | в phone-answering только сравнение с живым сервисом |

### praxenai.ge
| Тезис или фраза | Где | Владелец | Остальным |
|---|---|---|---|
| «При стоимости часа 10/12 ₾ это около … ₾ в месяц» | отели, опт, логистика, туроператоры, CRM, ассистент (6) | калькулятор `/ru/solutions` | своя метрика процесса без денег (пример 1) |
| H2 «Сколько стоит» с одними и теми же 4 строками (im/dev/tr/sup) | 11 статей | `/ru/solutions` | цена одной строкой; таблица только где интент «цена» (`whatsapp-telegram-ai-chatbot`) |
| «Токены… провайдерам напрямую, на вашем аккаунте», «Аудит бесплатный, цену пилота фиксируем до старта» | почти все 16 | `/ru/solutions`, FAQ | убрать |
| Как проверить подрядчика | `whatsapp-telegram-ai-chatbot`, `choose-ai-integrator-georgia` | `choose-ai-integrator-georgia` | ссылка |
| Тестовый набор из реальных сообщений | `georgian-language-ai`, шаг «Тест» в `whatsapp-telegram-ai-chatbot`, FAQ других | `georgian-language-ai` | ссылка |
| Пары из аудита: отели ↔ рестораны, опт ↔ логистика, опт ↔ розница, туроператоры ↔ образование | см. аудит | по календарю 26.11–08.12 | без изменений |

### Между сайтами (правило 3 и 8)
- **26.11 .com `how-to-choose-an-ai-consultancy` («12 questions to ask before you sign») повторяет тему .ge `choose-ai-integrator-georgia` («вопросы, КП и красные флаги»).** Темы между сайтами должны различаться. Предлагаю заменить строку темой из резерва .com (например, `salesforce einstein for small business`, 390, или `n8n workflow examples` / `n8n templates`, 50 + 590) либо развести интенты: на .com только «AI consultancy vs implementation partner», без чек-листа вопросов и красных флагов.

---

## 4. Блог в целом: что мешает трафику и заявкам

1. **Сильные страницы не ссылаются на статьи.** На .com ни одна страница услуг, отделов и отраслей не ссылается на статьи блога (`lib/intl.ts`, `lib/intl-guides.ts`, компоненты; поиск `blog/` ничего не нашёл). На .ge на статью ссылается только `/chatbot` (одна ссылка). В `BLOG-EDITORIAL.md` записано: «минимум одна входящая с более сильной страницы, страниц без входящих — ноль». Сейчас входящие ссылки у статей есть только из списка блога и блока «Related pages» соседних статей.
2. **В тексте статей нельзя поставить ссылку.** `components/article-blocks.tsx` выводит абзацы обычным текстом. Отсюда некликабельные «our API guide covers…» и «Our article on AI training for teams…», и нет ссылок на источники фактов (OpenAI, Meta, Microsoft, HMRC, ICO). Это бьёт по E-E-A-T, по цитируемости нейросетями и по правилу «2–3 ссылки в тексте».
3. **«Related pages» подбираются по порядку в массиве, а не по теме** (`relatedPosts` в `components/intl/blocks.tsx`, `related` в `components/praxen/blog.tsx`). Например, у отелей выходят чат-бот и клиники, у copilot — n8n и WhatsApp.
4. **Свежесть и разметка.** У постов `dateModified = date`. Обновлённая 6–7.11 `ai-phone-answering-service` показывает «9 October 2026». В той же разметке WebPage.dateModified берётся из общей даты сайта (`intlUpdated = 2026-10-08` в `lib/intl.ts`, `contentUpdated = 2026-10-05` в `lib/proof.ts`), и у ноябрьских постов она раньше datePublished. Сигнал противоречивый.
5. **Автор.** Фото, имя и «Founder» показаны, но имя не ведёт на `/about`, а `founderProfiles` пуст (`lib/profiles.ts`), поэтому у Person нет sameAs. Биографию не выдумываем: в `components/praxen/team.tsx` записано решение основателя её не публиковать.
6. **CTA один на весь блог** и не совпадает с интентом: в статьях про обучение он предлагает «hours saved», в статьях без расчёта на .ge — «Хотите такой расчёт?». Brand-voice требует один конкретный призыв.
7. **llms.txt для .ge без блога и без `/chatbot`** (`public/llms.txt`, файл ведётся вручную). В `public/llms-intl.txt` все 22 статьи .com есть.
8. **Документы устарели и противоречат правилу 7.** В шапке календаря .com написано «каждую статью владелец вычитывает на русском». В `.claude/skills/praxen-blog/SKILL.md` — «nothing is written or published without the owner's approval», «16 articles», «Topics: docs/CONTENT-PLAN.md». Это конфигурация, сам не правлю, предлагаю координатору.
9. **Календарь .ge:** строка 28.11 LANDING «`/ru/chatbot` (новая страница)» устарела, страница уже есть (`lib/chatbot-page.ts`, `geSections` в `app/[lang]/[[...section]]/page.tsx`) и держит запросы «чат-бот для бизнеса / разработка / заказать». Строка 19.11 `website-chatbot` («консультант, который отвечает по вашему прайсу») почти повторяет H1 `/chatbot` («отвечает по вашему прайсу и записывает заявки в CRM»), это риск каннибализации.
10. **Хорошее, что сохранить.** Карточка «Short answer» с определением в первой фразе есть в каждой статье. Таблицы, шаги и FAQ (FAQPage в разметке) на месте. Штампов вроде «seamless» и «ключевой» нет. Ноябрьские статьи .com заметно сильнее октябрьских: свои примеры, мало оговорок.

---

## 5. ТОП-7 рекомендаций: praxenai.com

| # | Что | Где | Почему | Эффект | Усилие |
|---|---|---|---|---|---|
| 1 | Блок «Guides» на страницах услуг, отделов и отраслей: 2–4 статьи-владельца темы (например, `/services/ai-chatbot` → whatsapp-business-api, whatsapp-chatbot-for-business, ai-chatbot-cost, ai-knowledge-base-for-support) | `components/intl/blocks.tsx` (рядом с `EntityGuide`), карта slug → статьи в `lib/intl-guides.ts` или новом файле | сейчас ни одной ссылки со страниц услуг на статьи; это прямое требование `BLOG-EDITORIAL.md` | быстрее индексация и рост позиций статей; путь «страница ↔ статья ↔ заявка» в обе стороны | M |
| 2 | Ссылки в тексте статей: простой синтаксис `[анкор](path)` в абзацах и списках, внешние ссылки на источники (OpenAI, Meta, Microsoft, HMRC, ICO) с `rel` по правилам сайта; потом оживить существующие отсылки («our API guide», «our article on AI training…», «our 90-day implementation plan») | `components/article-blocks.tsx` (общий для двух сайтов), `lib/intl-blog.ts` | 2–3 ссылки в тексте обязательны, источники повышают доверие и шанс цитирования нейросетями | вес внутренним страницам, E-E-A-T, GEO | M |
| 3 | Свежесть и автор: поле `updated` у поста, видимая строка «Updated 7 November 2026», `dateModified` из него; WebPage.dateModified у постов брать из поста, а не из `intlUpdated`; имя автора — ссылка на `/about`; владельцу предложить добавить профиль основателя (LinkedIn) в `founderProfiles`; у фактов о вендорах — «checked on <дата>» | `lib/intl-blog.ts` (тип Post), `lib/intl-seo.ts`, `components/intl/blocks.tsx`, `lib/profiles.ts` (решение владельца) | обновление 6–7.11 не видно ни людям, ни поиску; разметка противоречит сама себе | сигнал свежести для Google и нейросетей, доверие к фактам о тарифах | S |
| 4 | Разбить шаблон концовки и ответа: цена в «Short answer» только у статей о цене и обучении; у остальных — факт по теме (пример 2); финальный ценовой раздел оставить там, где спрашивают цену; убрать 39 повторов НДС, оплаты провайдерам и обучения моделей | 16+ статей в `lib/intl-blog.ts`, начиная с октябрьских | одинаковый каркас — главный признак «ИИ-шности» по аудиту и п. 5–6 чек-листа; ответы-шаблоны хуже цитируются | ответы цитируются как самостоятельные определения; текст перестаёт выглядеть сгенерированным | M (по 2–3 статьи в дни UPDATE) |
| 5 | CTA по интенту: поле `cta` у поста (заголовок, текст, кнопка, цель): обучение → «Book the half-day session», WhatsApp → пилот чат-бота, цена → калькулятор на `/solutions`; общий CTA оставить запасным | `lib/intl-blog.ts`, `Article` в `components/intl/blocks.tsx` | сейчас один CTA про «hours saved» на всех; brand-voice: один конкретный призыв | выше конверсия из статьи в заявку | S–M |
| 6 | Почистить календарь до выпуска: 11.11 `gdpr-and-ai` забирает тезис GDPR у `chatgpt-for-business`; 23.11 `whatsapp-business-pricing` → UPDATE `whatsapp-business-api`; 26.11 `how-to-choose-an-ai-consultancy` заменить (повтор темы .ge); 25.11 `ai-use-cases-by-department` развести с `ai-workflow-automation-examples` (хаб со ссылками на отделы, без пересказа 10 примеров); исправить дату строки n8n и шапку про согласование | `docs/blog-com/CALENDAR-2026-11.md` | один интент — один URL; темы между сайтами разные | нет каннибализации, бюджет дней уходит на новые запросы | S |
| 7 | UPDATE статей с показами: `ai-receptionist-cost-uk` (таблица стоимости при 100/300/600 звонках из `rcMonth` и `usage`, правка claims, §1, FAQ из Search Console; title не трогаем) и правки humanizer в октябрьской пачке (law-firms §6, implementation-cost §3, knowledge-base §4, accounting-firms §1, recruitment §1 и закон) | `lib/intl-blog.ts` | у этих страниц уже есть показы на позициях 70–90; поднять на первую-вторую страницу проще, чем растить новые | рост кликов по запросам о цене звонков и бухгалтерии | M |

## 6. ТОП-7 рекомендаций: praxenai.ge

| # | Что | Где | Почему | Эффект | Усилие |
|---|---|---|---|---|---|
| 1 | Запустить ежедневный выпуск: опубликовать 10.11 `ai-tools-for-business` (бриф готов), дальше по календарю; правку H2 «Как внедрить ИИ в бизнес» в `choose-ai-integrator-georgia` перенести с 30.11 на ближайший день | `lib/ge-blog.ts`, `docs/blog-ge/CALENDAR-2026-11.md` | в ноябре 0 статей; H2 тянет запрос главной `/ru` | органика начинает расти; главная перестаёт делить запрос со статьёй | M |
| 2 | Исправить календарь: 28.11 LANDING `/ru/chatbot` устарел (страница есть, `lib/chatbot-page.ts`), заменить на PROMO `/chatbot` (входящие ссылки из новых статей) или тему из резерва; 19.11 `website-chatbot` переформулировать под установку виджета и сбор контакта или сделать разделом `/chatbot` после проверки выдачи; 12.11 и 15.11 (агент и ИИ-сотрудник) проверить выдачу, как уже записано | `docs/blog-ge/CALENDAR-2026-11.md` | строка про новую страницу, которая уже существует, и пересечение с H1 `/chatbot` | день не теряется, нет каннибализации коммерческой страницы | S |
| 3 | Входящие ссылки и llms.txt: блок «Статьи по теме» на страницах отраслей и отделов (ru/en/ka, по 1–3 статьи-владельца: `/ru/industries/hotels` → `ai-for-hotels-adjara` и т. д.); в `public/llms.txt` добавить раздел «Blog» и страницу `/chatbot` | компонент страниц отраслей и отделов .ge, `public/llms.txt` | сейчас на статьи ссылается только `/chatbot` (одна статья); нейросети не видят блог в llms.txt | индексация, вес статьям, цитирование | M |
| 4 | Убрать шаблон: формулу «при стоимости часа 10/12 ₾» из 6 статей заменить своей метрикой процесса (пример 1); H2 «Сколько стоит» с одинаковой таблицей оставить только там, где интент — цена; общие оговорки (токены, аккаунты, аудит) убрать | `lib/ge-blog.ts`: отели, опт, логистика, туроператоры, CRM, ассистент, затем остальные | замечание аудита от 9 октября не исправлено; это п. 5–6 чек-листа | тексты перестают выглядеть одинаковыми; у каждой статьи свой факт для цитирования | M |
| 5 | Свежесть и E-E-A-T: поле `updated` и видимая строка «Обновлено …»; `dateModified` статьи; WebPage.dateModified не раньше даты статьи (сейчас `contentUpdated = 2026-10-05` < 08.10); имя автора — ссылка на `/ru/about`; у фактов Meta, Telegram, Битрикс24 и amoCRM — «проверено <дата>» и ссылка на источник (нужна поддержка ссылок, см. п. 2 .com) | тип `GePost` в `lib/ge-blog.ts`, `lib/seo.ts`, `components/praxen/blog.tsx` | все 16 статей выглядят как октябрьские; UPDATE в календаре без даты не дадут сигнала | Яндекс и Google видят обновления; нейросети предпочитают датированные источники | S |
| 6 | Структура под запросы Вордстата и нейросети: в UPDATE-строках 1–2 H2 сделать вопросами в формулировке спроса («Как подключить WhatsApp Business API и сколько платить Meta», «Что уже есть в Битрикс24 и amoCRM из ИИ»); первая фраза каждого раздела — самостоятельный ответ с фактом (по geo-citability) | UPDATE 11.11, 21.11, 24.11, 26.11, 27.11 | сейчас H2 в основном описательные, вопросов мало; вопросы не во всех разделах, чтобы не получить новый шаблон | сниппеты и ответы нейросетей | S в рамках UPDATE |
| 7 | CTA и «Читайте также» по теме: поле `cta` у статьи (бот → `/chatbot`, CRM → `/ru/departments/sales`, обучение → `/ru/training`, выбор подрядчика → аудит); «Читайте также» по категории или явному списку, а не по порядку в массиве | `components/praxen/blog.tsx`, `lib/ge-blog.ts` | «Хотите такой расчёт?» в статьях без расчёта; соседние статьи случайные; решение 9 ноября: CTA на услуги, отделы и аудит | выше переходы на коммерческие страницы и заявки | S–M |

---

## 7. Примеры «было → стало»

**Пример 1. .ge, `crm-ai-amocrm-bitrix24`, раздел «Сколько стоит ИИ в CRM» (повтор расчёта, п. 5)**
- Было: «Если поля заполняет ИИ, а проверка занимает 10 минут, команда получает назад около 2,5 часа в день, или примерно 55 часов за 22 рабочих дня. При стоимости часа 12 ₾ это около 660 ₾ в месяц. Отдельно считаем сделки, по которым раньше забывали перезвонить.»
- Стало: «Если поля заполняет ИИ, а проверка занимает 10 минут, команда получает назад около 2,5 часа в день. В пилоте считаем две вещи: долю полей, которые менеджер принял без правки, и число сделок без задачи на следующий шаг. Перевести часы в лари поможет калькулятор на странице цен.» (Обе метрики уже есть в шагах запуска статьи, новых фактов нет.)

**Пример 2. .com, `whatsapp-chatbot-for-business`, «Short answer» (шаблонная концовка ответа, §7 и п. 6 чек-листа)**
- Было: «…A menu bot offers buttons to tap, while an AI assistant reads free text and answers from information you have approved. Praxen builds and tests a WhatsApp assistant in a 2–4 week pilot priced at '+pilot+', or '+pilotP+' while the launch offer runs, excluding VAT.»
- Стало: «…A menu bot offers buttons to tap, while an AI assistant reads free text and answers from information you have approved. Either kind needs the WhatsApp Business API: the free WhatsApp Business app has no connection a bot can use.» (Факт взят из раздела «What every build needs», цена остаётся в разделе «Building it with Praxen».)

**Пример 3. .com, `copilot-training-for-staff`, CTA под статьёй (не совпадает с интентом, brand-voice CTA Rules)**
- Было: «Want the numbers for your business? A free 30-minute audit gives you the hours saved and a fixed pilot price. [Book a free call]»
- Стало: «Training a team on Copilot? Book the half-day session for after your permissions check: up to 12 people, '+trainingP+' with the launch offer. [Book the training]» (Цена из переменной сайта `trainingP`; кнопка ведёт туда же, куда сейчас ведёт BookLink.)

Дополнительно (.ge, `choose-ai-integrator-georgia`): «Как внедрить ИИ в бизнес: этапы и цены» → «Как сравнить КП по цене пилота» + ссылка на `/ru` с анкором «внедрение ИИ в бизнес».

---

## 8. Факты для сверки с владельцем (законы, даты, цифры)

**.com**
1. ChatGPT Business: места «Standard» и «Premium», план Go, минимум 2 пользователя, «never used for training» (`chatgpt-for-business`). Сверить с прайсом и страницей о данных OpenAI на дату публикации.
2. Meta: с 15 января 2026 условия запрещают ИИ-ассистентов общего назначения; лимит на отправку шаблонов начинается с 250 и считается на всё бизнес-портфолио; coexistence с меньшей пропускной способностью; utility-шаблоны внутри 24-часового окна бесплатны; поштучная оплата с 1 июля 2025 (`whatsapp-business-api`).
3. Intuit: «AI agents announced for UK QuickBooks in November 2025»; агент Sage для MTD for Income Tax; функции Xero JAX, отмеченные «coming» (`ai-accounting-software`).
4. UK GDPR и автоматизированные решения после Data (Use and Access) Act 2025: дата вступления в силу и формулировка (`ai-for-recruitment-agencies`). Это юридический текст, решает владелец.
5. MTD for Income Tax: старт 6 апреля 2026 при доходе свыше £50 000, с апреля 2027 порог £30 000 (`ai-for-accounting-firms`). Проверить, не нужно ли добавить следующий шаг порога.
6. Copilot Chat бесплатен для рабочих учётных записей; формулировка Microsoft о «enterprise data protection» (`copilot-training-for-staff`).
7. n8n Community Edition бесплатна для внутреннего использования по Sustainable Use License (`n8n-vs-zapier-vs-make`).
8. «One in five is a cautious starting point» (`ai-receptionist-cost-uk`): есть ли источник? Если нет, пометить как пример.

**.ge**
9. Фраза в шапке блога «Пишем о том, что видим на проектах» / «We write about what we see on projects» (`components/praxen/blog.tsx`). Есть ли реальные проекты? На `/cases` в llms.txt написано «Scenarios». По marketing-claims-review нужно подтверждение или переформулировка.
10. Грузинский подзаголовок списка блога говорит, что статьи «пока на русском и английском», а грузинские версии есть у всех 16 статей. Это грузинский текст, правку передать команде владельца.
11. «Цену пилота мы называем до старта и не меняем по ходу работы» (`ai-assistant-for-employees`): подтвердить, что это правило компании.
12. Стратегический вопрос: основной спрос в Вордстате идёт из Казахстана, а цены и предложение на .ge — для Грузии (лари, Батуми и Тбилиси). Работаете ли вы с клиентами из Казахстана и СНГ? Если нет, статьи под KZ-запросы дадут трафик без заявок, и в календаре стоит поднять приоритет запросов с частотностью по Грузии и из Google.
13. Встроенный ИИ Битрикс24 и amoCRM (доступность по тарифу и региону в Грузии) и условия Telegram Business (Premium, лимиты): по официальной справке на дату UPDATE 24.11 и статьи 23.11.
