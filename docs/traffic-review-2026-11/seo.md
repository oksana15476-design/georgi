# SEO-рекомендации: praxenai.com и praxenai.ge (SEO-редактор, 10.11.2026)

Метод: обход всех 203 адресов из живых карт сайтов (147 .ge + 56 .com) curl'ом 10.11.2026 ~06:20 UTC; title, description, H1, canonical, hreflang, robots, JSON-LD, входящие внутренние ссылки (подсчёт по HTML), проверка доступа для ИИ-краулеров (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Bingbot, YandexBot, CCBot, Applebot), robots.txt, llms.txt. Спрос — только из файлов `docs/seo-data/` (источник указан у каждой цифры). Search Console и Вебмастера нет (конфиг `google-search` пуст) — показы не указываю. DataForSEO не вызывал. PageSpeed API в этот день был недоступен (дневная квота), поэтому скорость оцениваю по HTML и прошлому замеру в `docs/SITES-AUDIT.md`.

## Что в порядке (проверено)
- Все 203 адреса отвечают 200, canonical указывает на саму страницу, noindex нет, на каждой странице один H1, дублей title и description нет.
- http→https и www→без www — 301; слэш на конце — 308; старые `/en/...` — 308; 404 настоящие.
- hreflang на .ge: ru/en/ka/x-default и в HTML, и в карте сайта (588 xhtml:link); .com ссылается только на себя.
- ИИ-краулеры получают 200 и полный HTML (H1 на месте) на обоих сайтах. Сжатый HTML весит 16–24 КБ, JS главной .com — около 61 КБ.
- JSON-LD без ошибок разбора: ProfessionalService, WebSite, WebPage, BreadcrumbList, FAQPage, Service с Offer, BlogPosting с автором.

## Находки в формате аудита (`seo`)

### praxenai.com
**[HIGH] /llms.txt на .com отдаёт файл .ge**
- Location: https://praxenai.com/llms.txt (тот же md5 `04373290…`, что у praxenai.ge/llms.txt); `next.config.ts:84`, `public/llms.txt`, `public/llms-intl.txt`
- Issue: нейросети читают про .com: «based in Batumi, Georgia», цены в GEL, все ссылки ведут на praxenai.ge. Это нарушает правило «.com не упоминает Грузию, сайты друг на друга не ссылаются». Rewrite `/llms.txt → /llms-intl.txt` не срабатывает. Вероятная причина: Cloudflare отдаёт файлы из `public/` раньше, чем запускается Worker. Обратная утечка тоже есть: https://praxenai.ge/llms-intl.txt отвечает 200 и описывает .com с ценами в £.
- Fix: при сборке intl класть содержимое `llms-intl.txt` в `llms.txt` (или отдавать /llms.txt маршрутом или через `run_worker_first`); на .ge `/llms-intl.txt` должен отвечать 404. После выкладки сверить через curl. В `live-check.mjs` добавить проверку: в llms.txt .com нет «praxenai.ge», «Georgia», «GEL».

**[HIGH] Выпадающие меню не попадают в HTML, в футере нет отделов**
- Location: `components/intl/site.tsx` (шапка и футер). В шапке в HTML только `/`, `/blog`, `/cases`, `/training`
- Issue: на /departments/marketing, /operations, /hr, /procurement ссылаются всего 2 страницы сайта, на customer-support и sales — 3; на /services, /industries, /departments — 6–9. Отдел поддержки — владелец запроса «ai customer service» (UK 480, `volumes-en-UK-2026-10-07.csv`).
- Fix: выводить ссылки меню в HTML (видимость меню не меняется) или добавить в футер колонку «Departments» с хабами. Адреса не меняются.

**[HIGH] Статья и коммерческая страница с одной и той же главной фразой в title**
- Location: /industries/accounting ↔ /blog/ai-for-accounting-firms; recruitment ↔ ai-for-recruitment-agencies; law-firms ↔ ai-for-law-firms; /services/ai-agents ↔ ai-agents-for-business; /training ↔ ai-training-for-teams; /departments/sales ↔ ai-for-sales-teams; /services/ai-receptionist ↔ ai-receptionist-cost-uk; /solutions ↔ ai-implementation-cost
- Issue: правила это допускают («статья раскрывает страницу»), но для Google это два адреса под один запрос. Calendar .com (2 ноября): «статья и страница о бухгалтерии — 222 показа за 28 дней». Делят ли они один запрос, без Search Console не видно.
- Fix: выгрузить из Search Console «запрос → страницы». Если по одному запросу показы есть у обоих адресов, сдвинуть title статьи на информационный модификатор (how / what to automate first / checklist), а в первом абзаце статьи поставить ссылку на страницу. Пары без пересечения не трогать.

**[HIGH] Неверные даты свежести**
- Location: `app/sitemap.ts` (`lastModified: intlUpdated`), `lib/intl-seo.ts:35,43`, тип `Post` в `lib/intl-blog.ts`
- Issue: в карте сайта у всех 56 адресов lastmod 2026-10-08, хотя 6 статей вышли 2–9 ноября. WebPage.dateModified = 2026-10-08 стоит и на статьях, опубликованных 2 ноября (раньше datePublished). У ai-phone-answering-service (дополнена 6 и 9 ноября) dateModified остался 2026-10-09.
- Fix: добавить в Post поле `updated`; в sitemap ставить lastmod = updated или date статьи; WebPage и BlogPosting.dateModified брать оттуда же.

**[HIGH] Спрос в США в 10–40 раз выше британского, а страницы заточены под UK**
- Location: /services/ai-receptionist (title «AI receptionist UK…»), /blog/ai-voice-agents (статья «vs IVR»)
- Issue: «ai receptionist»: US 49 500, UK 1 300; «ai voice agent»: US 22 200, UK 390 (`volumes-en-US-AE-2026-10-07.csv`, `volumes-en-UK-2026-10-07.csv`). Коммерческой страницы под «AI voice agent» нет.
- Fix: сначала сравнить выдачу «ai receptionist» и «ai voice agent» (`seo-cluster`, 2 платных SERP-запроса — нужно согласие владельца). Если общих адресов меньше 7 из 10 — новая страница /services/ai-voice-agent. Если 7 и больше — раздел на странице ресепшна. На странице ресепшна добавить блок про США (USD уже есть в переключателе) без смены title.

**[MEDIUM] Карта запросов: у крупных фраз нет явной страницы-владельца**
- Location: `/`, /services/ai-consultancy, /industries/accounting
- Issue: «ai for business» UK 1 600 / US 8 100 — у фразы нет назначенной страницы; «ai consultant» UK 2 400 — в тексте страницы только «consultancy»; «ai for accountants» 1 600 (`uk-ideas-2026-11-02.csv`) — на странице только «accounting firms».
- Fix: закрепить владельцев в карте запросов и добавить варианты фраз в H2, FAQ и первый абзац. Title не трогать (по правилу 2).

**[MEDIUM] В статьях нет ссылок на первоисточники**
- Location: все 22 статьи /blog/* — внешних ссылок 0 (кроме своих WhatsApp и cal.com)
- Issue: цены Meta, правила ICO, тарифы Microsoft и ChatGPT приведены без ссылки на источник. Нейросети и AI Overviews охотнее цитируют страницы с проверяемыми источниками.
- Fix: 2–3 ссылки на официальные страницы с датой проверки в каждой статье — при плановых правках (UPDATE) и во всех новых статьях.

**[MEDIUM] Скрипт защиты Cloudflare и шрифты**
- Location: зоны Cloudflare; `<link rel=stylesheet fonts.googleapis.com…>` в layout
- Issue: `/cdn-cgi/challenge-platform` теперь подмешивается и в .com (раньше только .ge, `SITES-AUDIT.md`: главная .ge 70–77 в Lighthouse из-за него). Google Fonts грузятся блокирующим CSS с 5 начертаниями Manrope.
- Fix: владельцу выключить JS Detections / Bot Fight Mode в обеих зонах; шрифты хранить на своём домене и оставить 2–3 начертания.

**[MEDIUM] Имя основателя в разметке пишется по-разному**
- Location: `lib/intl-seo.ts` (Person «Evgeny Budnikov», legalName «Evgenii Budnikov»)
- Fix: в описании компании указать оба написания (`alternateName`) и выбрать одно для профилей в каталогах.

**[MEDIUM] Программные страницы**
- Матрицу «отрасль × услуга» не строить. Под неё нет замеров спроса, кроме «ai receptionist for dentists» UK 40 (резерв календаря) и «ai for dental practices» 10, а комбинации дублировали бы 7 страниц отраслей. Если владелец разрешит один платный замер длинного хвоста по США («ai receptionist for {dental office, law firm, hvac, plumbers, real estate}»), страниц должно быть не больше 5–6: объём от 50 в месяц, выдача отличается от /industries/* (меньше 7 из 10 общих адресов), у каждой свои сценарии звонков и интеграции. «hubspot ai», «xero ai», «salesforce einstein» — запросы брендовые и информационные, их место в блоге.

**[MEDIUM] Рынок ЕС**
- `eu-volumes-2026-10.csv`: DE «ki telefonassistent» 1 900, «ki agentur» 1 000; NL — самый высокий коммерческий спрос на жителя (295 на 1 млн), там покупают и на английском. Это решение владельца (языки и рынки). Без перевода сайта можно усилить NL и Ирландию упоминанием EU/EUR на /solutions и в FAQ.

### praxenai.ge
**[HIGH] llms.txt устарел, и на домене лежит файл .com**
- Location: https://praxenai.ge/llms.txt, https://praxenai.ge/llms-intl.txt; `scripts/pages-postbuild.mjs:91`
- Issue: `public/llms.txt` обновляется только при статической сборке .ge, а Worker её не запускает. Поэтому в файле нет /chatbot (с 9.11), /about, /security и ссылок на ru/ka (то, что в нём нет блога, уже отметили другие агенты). Плюс /llms-intl.txt описывает .com на домене .ge.
- Fix: генерировать llms.txt при обычной сборке; /llms-intl.txt на .ge — 404.

**[HIGH] Каннибализация «чат-бот для бизнеса»**
- Location: /ru/chatbot (с 9.11: «Чат-бот для бизнеса: разработка под WhatsApp и Telegram») ↔ /ru/blog/whatsapp-telegram-ai-chatbot («Чат-бот с ИИ для WhatsApp и Telegram: что умеет и сколько стоит»). Ещё «чат-бот» есть в title /ru, /ru/industries, /ru/departments/sales и /support.
- Issue: на новую коммерческую страницу ссылаются всего 4 страницы, из них в основном тексте — одна (статья). В шапке и футере её нет, с главной, /ru/solutions и /ru/departments/support ссылок нет. Статья старше страницы и забирает «сколько стоит / разработка».
- Fix: «чат-бот для бизнеса / разработка / цена» закрепить за /ru/chatbot. Статья остаётся про «что умеет и как работает»: цены в ней заменить ссылкой на /ru/chatbot, title статьи менять только по данным Search Console или Вебмастера. Ссылки на /chatbot поставить в футер, на главную, /solutions, отделы support и sales, отрасли hotels, clinics, restaurants, retail — на всех трёх языках.

**[HIGH] Меню не попадает в HTML, в футере половина разделов**
- Location: `components/site.tsx` / `components/praxen/*`. В футере 4 из 8 отделов и 4 из 12 отраслей.
- Issue: на /ru/departments/finance ссылаются 4 страницы, на hr, procurement, leadership — по 5, на 8 отраслей — 5–6, на хаб /ru/departments — 11. При этом в футер на всех страницах вставлена ссылка на /ru/webinar/terms (noindex, nofollow).
- Fix: выводить ссылки меню в HTML или перечислить в футере все отделы и отрасли; ссылку на terms убрать из футера на обычных страницах.

**[HIGH] 13 статей зеркалят страницы отраслей и отделов**
- Location: перечень в `docs/BLOG-AUDIT-2026-10.md` §1 (например, /ru/blog/ai-for-clinics-georgia ↔ /ru/industries/clinics, ai-for-logistics-georgia ↔ /industries/logistics)
- Fix: как на .com — разводить по данным Вебмастера и Search Console «запрос → страницы». Страница отрасли держит «ИИ для X»; статья — грузинский сценарий (сезон, язык, местная система учёта) и ссылка на страницу в первом экране.

**[HIGH] Локальное SEO: Батуми и Тбилиси**
- Location: `lib/profiles.ts` (ge: только Facebook и Instagram), `lib/seo.ts` (PostalAddress)
- Issue: ссылки на Google Business Profile или Карты нет в sameAs, значит, карточку ещё не создали или не связали с сайтом. В адресе только город (Batumi, Adjara, GE): нет улицы, индекса, geo и часов работы. В areaServed указана одна страна. «AI agency Tbilisi» по плану цели — local pack (`SEO-ACTION-PLAN.md`).
- Fix (владелец): Google Business Profile как компания с зоной обслуживания — база в Батуми, зоны Тбилиси, Аджария, Грузия; домашний адрес (квартира) скрыть. Затем Bing Places импортом и Яндекс Бизнес. После этого в коде: ссылку на карту — в sameAs и `hasMap`; areaServed: City Batumi, City Tbilisi; часы — как в карточке. Офис в Тбилиси не выдумывать и городских страниц не делать.

**[HIGH] Даты свежести**
- Location: `lib/proof.ts:7` (`contentUpdated='2026-10-05'`), `app/sitemap.ts`
- Issue: dateModified 2026-10-05 стоит на всех 144 WebPage, в том числе на /chatbot, созданной 9.11. В карте сайта у 99 из 147 адресов нет lastmod.
- Fix: дата у каждой страницы своя (статья — date или updated, новая страница — дата создания); lastmod в карту сайта для всех адресов.

**[MEDIUM] Программные страницы «отрасль × город» не нужны**
- Вордстат 09.11.2026 (`ge-cis-semantics-2026-11.md`, вывод 2): «чат бот / ии / автоматизация + грузия|тбилиси|батуми» — 0 во всех пяти странах. Google 07.10 (`search-volume-georgia-2026-10.csv`): «чат бот тбилиси», «ии для бизнеса тбилиси» — пусто. Такие страницы были бы дорвеями без спроса. Вместо них — один блок «Тбилиси и Батуми» на /about и главной: где работаем, выезд, NAP. Новых адресов не нужно.

**[MEDIUM] Казахстан — основной спрос в Вордстате**
- Сумма показов по фразам «top» за месяц: Казахстан 62 823, Грузия 2 410 (`ge-cis-semantics-2026-11.md`). Директ KZ уже ведёт на .ge (`docs/DIRECT-KZ.md`). Домен .ge Яндекс относит к Грузии, поэтому по коммерческим гео-зависимым запросам в Казахстане сайт будет слабым; информационные статьи от региона почти не зависят.
- Fix (решение владельца): если Казахстан — рынок, проверить региональность в Вебмастере, добавить «работаем с Казахстаном» на /ru/solutions и в FAQ, в статьях давать примеры из Казахстана (Kaspi — уже в календаре, ai-for-marketplaces).

**[MEDIUM] Грузинская версия и английский спрос**
- По ka данных о спросе нет: Вордстат грузинский не покрывает, Google Ads вернул пустые строки. Страницы на ka короче: /ka/industries — 401 слово против 468 на ru. Реальный спрос в Грузии по Google — английский: «AI chatbot» 1 300, «AI agent» 260, «WhatsApp bot» 70, «AI course» 70 (`search-volume-georgia-2026-10.csv`). Под эти фразы работают английские страницы без префикса /chatbot, /departments и /training.
- Fix: вернуть доступ к Search Console (OAuth `google-search`, делает владелец) и смотреть показы по языкам. Без этих данных правила запрещают менять title, description и H1.

**[MEDIUM] Цитируемость и мелочи**
- В 16 статьях нет ни одной внешней ссылки на первоисточник — исправлять так же, как на .com.
- Скрипт `challenge-platform` всё ещё подмешивается (пункт 5 «Что осталось» в HANDOFF).
- Google Fonts: 10 начертаний (Manrope ×5 + Noto Sans Georgian ×5) грузятся блокирующим CSS.
- Description длиннее 160 знаков на 13 страницах (/ka 184, /about 174, /ru/about 176, /ka/security 181, /departments/sales 180). Title длиннее 65 знаков — на 37 страницах, в основном из-за « — Praxen AI». Править только по данным Search Console.
- У /webinar разметка Event: после 12.12 её нужно убрать или обновить, иначе она устареет.

## Топ-10 по каждому сайту — см. итог, отправленный координатору (тот же текст ниже)
