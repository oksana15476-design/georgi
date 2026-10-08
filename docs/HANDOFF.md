# Передача проекта Praxen AI (praxenai.ge и praxenai.com)

Обновлено: 8 октября 2026. Этот файл — точка входа для новой сессии Claude. Прочитай его целиком перед работой.

## Что это

Один репозиторий `oksana15476-design/georgi`, два сайта:

| | praxenai.ge | praxenai.com |
|---|---|---|
| Рынок | Грузия | Великобритания, США, ЕС (бизнес любого размера) |
| Языки | ka, ru, en (`/ka`, `/ru`, `/en`) | только английский, без префикса языка |
| Цены | ₾ и $ (`lib/pricing.ts`) | £ / $ / € с переключателем (`lib/intl.ts`), скидка запуска 30% |
| Worker в Cloudflare | `georgi` | `praxen-intl` (сборка с `NEXT_PUBLIC_MARKET=intl`) |
| Индексация | открыта | закрыта (noindex), пока не задан `NEXT_PUBLIC_INTL_LIVE=1` |

Каждый пуш в `main` автоматически выкатывается Cloudflare Workers Builds на оба Worker. Рабочая ветка последней сессии `claude/confident-darwin-i8snsf` (до неё `claude/relaxed-hypatia-goz0ki`); пушим в рабочую ветку и в `main`. Работать в одной сессии: две сессии в одном коде конфликтуют (так было с шапкой .com 8 октября).
`git push -u origin claude/relaxed-hypatia-goz0ki && git push origin claude/relaxed-hypatia-goz0ki:main`

## Стек и устройство

- vinext (Next.js App Router на Cloudflare Workers). `npm run build` — Worker; `npm run build:static` — статический `out/` (для .com: `NEXT_PUBLIC_MARKET=intl npm run build:static`, страницы в `out/en/...`).
- Переключатель рынка: `lib/market.ts` (`isIntl`, `indexable`).
- **.com** — отдельное дерево `components/intl/*` (`site.tsx` — шапка, футер, состав страниц; `blocks.tsx` — все блоки; `scene.tsx` — анимированные сцены; `route.tsx`). Данные и тексты — `lib/intl.ts`, блог — `lib/intl-blog.ts`, SEO и JSON-LD — `lib/intl-seo.ts`. CSS .com в `app/globals.css` под `.ix` / `ix-` / `sc-`, чтобы не задевать .ge.
- **.ge** — `components/site.tsx` + `components/praxen/*`, тексты в `lib/site-copy.ts`, `lib/page-copy.ts`, `lib/page-profiles.ts`, `lib/content.ts`; мета — `lib/section-meta.ts`, `lib/seo.ts`. Оформление разделов статей на обоих сайтах — `components/article-blocks.tsx` (по образцу блога Saldo): таблица с ценами показывается карточками цен со сроком, таблица «Когда / Что делаем» — шкалой, списки в разделах «Как…», «С чего начать», «План» — нумерованными шагами, остальные списки — с акцентными точками и жирной вводной до «:» или «.», таблицы из 3+ колонок на телефоне — карточками. Данные статей остаются простыми (h, p, list, table). Блог .ge: `lib/ge-blog.ts` + `components/praxen/blog.tsx` (статьи на ru и en; грузинский список ссылается на них до вычитки носителем).
- Роутинг: `app/[lang]/[[...section]]/page.tsx`, детальные страницы `app/[lang]/industries/[slug]`, `departments/[slug]`. Для .com — rewrites и 308 в `next.config.ts`.
- Заявки: форма → `/api/leads` (`app/api/leads/route.ts`) → Telegram / Resend / amoCRM (`lib/lead-delivery.mjs`). Секреты задаются в Cloudflare на каждом Worker отдельно. При ошибке API отвечает `{"error":"delivery","channels":["telegram 400: ..."]}`.
- Аналитика: `lib/tracking.ts` — GA4 `G-JPD37TCM27` (.ge, ресурс 557602365) и `G-8JMZ08G5Y3` (.com, отдельный ресурс 558070926), Meta Pixel, Метрика только на .ge. События и ключевые события — `docs/ANALYTICS-GOALS.md`.

## Правила владельца (обязательно)

1. Ничего не ломать и не менять логику без нужды. После каждой правки проверять рендер.
2. **Каждый изменённый блок открыть в браузере на 1440 и 390 и посмотреть скриншот до пуша.** (Был случай: блок на главной .com сломался, потому что его не открыли.)
3. Страницы не повторяют друг друга: у каждой свои тексты, вопросы, сцены. Статьи .ge и .com — на разные темы.
4. Тексты без «ИИ-шности»: без «не X, а Y», без пустых усилителей, коротко и по делу (подход Главреда). .com — британский английский.
5. Ничего не выдумывать: никаких рейтингов, отзывов, «50+ клиентов», «live demo». Примеры помечаются как примеры.
6. На .com не упоминать Грузию в продающих текстах (только в юридических, когда появятся реквизиты). .com — «для бизнеса», а не «для малого бизнеса».
7. Никогда не коммитить токены и ключи. Не отправлять тестовые заявки без согласия владельца (они приходят ему в Telegram).
8. Не трогать другие проекты и аккаунты владельца.
9. Отвечать владельцу по-русски, коротко, без жаргона.

## Как проверять

Скрипты в `scripts/qa/` (Playwright: `/opt/node-tools/node_modules/playwright/index.mjs`, Chromium уже установлен):

- `node scripts/qa/serve.mjs <папка out> <порт> intl|ge` — статический сервер с живым роутингом. Не используй порт 4190: fetch его блокирует.
- `BASE=http://localhost:<порт> node scripts/qa/shot.mjs <папка> /путь@1440 /путь@390` — скриншоты страницы по частям.
- `node scripts/qa/el.mjs <папка> http://localhost:<порт> /путь@1440 "Метка блока"` — скриншот одного блока по `data-screen-label`.
- `node scripts/qa/audit.mjs intl|ge http://localhost:<порт> <папка out> <папка отчёта>` — все страницы из sitemap: H1, title, description, JSON-LD, ошибки, выход за экран, битые ссылки.
- `node scripts/qa/text.mjs http://localhost:<порт> <папка out> <файл.json>` — тексты всех страниц (для проверки уникальности и вычитки).
- Перед пушем: `npx tsc --noEmit -p .` и `npx eslint components lib app`.
- Статьи блогов: правила — скилл `.claude/skills/praxen-blog/SKILL.md` (темы, структура, как блоки превращаются в UI, стиль без «ИИ-шности», SEO), проверка — `npx tsx scripts/qa/blog-check.ts` (длина title и description, ссылки, языки, антитезы, дословные повторы между статьями).

## Что сделано (кратко)

- Оба сайта: аудит всех страниц, 0 битых ссылок, свои 404, JSON-LD, sitemap, llms.txt, robots.
- .com: дизайн по handoff v4; услуги, 7 отраслей, 8 отделов с уникальными текстами и сценами; план пилота на каждой детальной странице; карточка «Short answer»; страница для малого бизнеса со стартовыми условиями; цены, кейсы-примеры, о нас, безопасность, партнёры, полные условия (Terms), блог из 10 статей (см. `docs/CONTENT-PLAN.md`); шапка как на .ge: Solutions▾ (6 услуг по спросу DataForSEO + Pricing и All services), Departments▾, Industries▾, Training, Cases, Blog; About в футере; меню видно до 900 px. На странице Cases нет пометок «Example» (решение владельца), оговорка «типичные сценарии» осталась в подзаголовке и FAQ.
- .ge: страницы «О нас» и «Безопасность», вкладки отделов на страницах отраслей, блог из 10 статей на ru/en/ka (грузинский вычитан командой владельца), блог в шапке. Повторы блоков убраны: у каждой страницы свой FAQ (`lib/ge-faq.ts`), на страницах отраслей и отделов — «Пилот по шагам» из данных страницы (`PilotSteps` в `components/praxen/detail.tsx`) вместо общих Process и Trust; Process только на «О нас», Trust только на главной, Team на главной и «О нас». Title главной и «Решений» укорочены; у длинных заголовков статей суффикс « — Praxen AI» не добавляется.
- Форма .com работает (Telegram, chat ID владельца в секретах `praxen-intl`). Формат заявки называет сайт и полную ссылку.
- GA4 .com: ключевые события `generate_lead`, `whatsapp_click`, `email_click`; .ge: `generate_lead`, `whatsapp_click`, `telegram_click`, `phone_click`; хранение 14 месяцев.

## Что осталось

**Делать самостоятельно**
1. Блоги: по 2 статьи в неделю сверх 10, темы — `docs/CONTENT-PLAN.md`, без повторов между сайтами; обновлять статьи с показами без кликов.
2. `lib/intl-text.ts` не удалять: он используется (`copyFn` в `lib/site-copy.ts` для текстов всплывающего окна на .com).
3. Длинные description у части страниц .ge (170–198 знаков) — укоротить до 160 при следующей правке этих страниц.

**Нужны решения или действия владельца (спросить)**
1. Реквизиты компании (можно грузинское ИП/ООО) — вписать в политику и условия .com; применимое право в условиях сейчас England and Wales.
2. Подтвердить стартовые условия для малого бизнеса на .com (рассрочка, помесячно, бесплатный месяц ведения и т. д., `smallPerks` в `lib/intl.ts`).
3. Пересылка почты `hello@praxenai.com` — сделано 8 октября (Cloudflare Email Routing, MX и SPF на месте).
4. Британский номер WhatsApp/телефона для .com. Цены в $ и € владелец утвердил «как принято» (по курсу с округлением, $ ≈ +25 %, € ≈ +15 % к фунту).
5. Выключить Bot Fight Mode / JS Detections в зоне praxenai.ge (портит скорость главной).
6. Вычитка грузинских текстов носителем — сделано (8 октября); новые грузинские тексты отдавать на вычитку так же.
7. Запуск .com: `NEXT_PUBLIC_INTL_LIVE=1` в Worker `praxen-intl` → карта сайта в Google Search Console и Bing → IndexNow.
8. Реальные кейсы и отзывы — когда появятся.

## Доступы в песочнице

- Google Search Console и GA4 (Admin API с правом изменения): `.claude/skills/google-search/config/` (в .gitignore, в новой сессии его не будет — владелец может заново выдать доступ по OAuth-ссылке из навыка `google-search`).
- DataForSEO: `.env.dataforseo` (в .gitignore).
