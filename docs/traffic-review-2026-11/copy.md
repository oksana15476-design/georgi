# Тексты praxenai.com и praxenai.ge: рекомендации копирайтера (10.11.2026)

Что смотрел: .com — `lib/intl.ts`, `lib/intl-seo.ts`, `lib/intl-blog.ts` (заголовки и description), тексты блоков в `components/intl/blocks.tsx`; .ge — `lib/site-copy.ts`, `lib/page-copy.ts`, `lib/page-profiles.ts`, `lib/content.ts`, `lib/ge-faq.ts`, `lib/section-meta.ts`, `lib/detail-meta.ts`, `lib/detail-answers.ts`, `lib/seo.ts`, `lib/chatbot-page.ts`, заголовки `lib/ge-blog.ts`, тексты в `components/site.tsx` и `components/praxen/*`. Сверял с профилями голоса (`docs/VOICE-PROFILE-COM.md`, `docs/VOICE-PROFILE-GE.md`), вопросами из выдачи (`docs/seo-data/serp-questions-2026-10-07.md`) и частотностями (`volumes-en-UK-2026-10-07.csv`, `search-volume-georgia-2026-10.csv`, `ge-cis-semantics-2026-11.md`, `_seeds-summary.csv`). Скиллы: copywriting, brand-voice, humanizer, cro, marketing-claims-review, seo-content, ux-copy.

Блог по указанию координатора не разбираю: статьи уже проверил главред. Ниже только коммерческие страницы, сниппеты, FAQ и CTA; ссылки «на статью» в FAQ — это ссылки, тексты статей не трогаются.

Ограничение: данных Search Console не было. Все правки title, description и H1 помечены «проверить по GSC перед заменой» (правило 2 CLAUDE.md). В репозитории ничего не менял.

Расчёт цен .com со скидкой запуска 30% (из `lib/intl.ts`): ресепшн £665 setup + £174/мес, обучение £595, пилот £2,030, своё решение от £4,550, ведение £245/мес. Цены .ge (`lib/pricing.ts`): 1 900 / 3 200 / 6 700 ₾, ведение от 550 ₾/мес.

---

## Общий вывод

Оба сайта уже написаны лучше среднего по рынку. Есть механизм и граница («Nothing is posted without finance signing off», «Проводит документ бухгалтер»), цены, сроки, метрики пилота, честная пометка «пример». Рост дадут не новые слоганы, а четыре вещи:

1. **Сниппеты.** На .com у 10 детальных страниц description собирается из подзаголовка («It replies…», «We map…», «CVs are screened…»). На .ge так у всех 20 страниц отраслей и отделов. В таком сниппете нет запроса, цены и следующего шага.
2. **FAQ на страницах, которые продают.** Услуги .com (chatbot, agents, consultancy, training, automation) имеют по 1–2 вопроса и ни одного про цену. Именно эти вопросы видны в выдаче и в нейросетях.
3. **Абзацы-ответы для нейросетей.** На .ge в `detail-answers.ts` есть цена, срок и метрика, это хорошо. На .com в `answer` цены нет, она стоит отдельно в боковой таблице, и нейросеть цитирует абзац без цифр.
4. **Остатки «ИИ-шности» и спорные утверждения.** На .ge около 8 мест «не X, а Y» и рублёных фраз-слоганов. На .com — абсолютные обещания («never»), обобщения без источника («Most callers…») и «from real projects», хотя реальных кейсов ещё нет.

---

# praxenai.com

## Топ-7 рекомендаций

| # | Что | Где (файл / ключ) | Почему | Эффект | Усилие |
|---|---|---|---|---|---|
| 1 | Добавить на страницы услуг по 3–4 реальных вопроса, первым — «сколько стоит», плюс сроки и «почему дорожает» | `lib/intl.ts` → `services[].faqs` для `ai-automation` (2 вопроса), `ai-consultancy`, `ai-chatbot`, `ai-agents`, `ai-training` (по 1 вопросу) | Это главные коммерческие страницы: «ai consultancy» 2 400/мес, «ai automation» 2 400, «ai receptionist» 1 300 (UK). В выдаче спрашивают «How much does it cost to implement AI?», «How much does AI cost in the UK?», «Why is AI expensive to implement?». FAQ уходит в разметку FAQPage, поэтому каждый вопрос — ещё одна возможность попасть в ответ нейросети. У страниц отраслей и отделов уже по 3 вопроса, у услуг меньше всех | Больше показов по запросам «cost / how much», цитаты в AI Overviews и ChatGPT, ответ на возражение по цене до формы | M |
| 2 | Свой description (`desc2`) для 10 страниц, где сейчас подставляется подзаголовок | `lib/intl.ts` → `desc2` у `ai-automation`, `ai-consultancy`, `ai-chatbot`, `ai-agents`, `ai-training`, `recruitment`, `law-firms`, `hospitality`, `estate-agents`, `clinics`. **Проверить по GSC перед заменой** | Сейчас сниппет начинается с «It replies…», «We map…», «An agent reads…», «CVs are screened…»: нет запроса, цены и срока. У страниц с `desc2` (receptionist, trades, все отделы) формула правильная | Рост CTR в выдаче. Цифра (цена или срок) в сниппете обычно кликается лучше общей фразы | S–M |
| 3 | Главная: H1 с запросом вместо трёх фраз-обрывков; в строке доказательств — полная цена ресепшна | `components/intl/blocks.tsx` → `Hero`, `h1/h1b`, `proof`. **H1 — проверить по GSC** | «Every call answered. Every enquiry logged. Without hiring more staff.» — три фрагмента подряд (humanizer: шаблонный ритм), слова «AI» в H1 нет, хотя title — «AI automation agency». В proof показано только «£174/mo», без £665 за запуск: читатель увидит вторую цифру позже и почувствует подвох | Яснее с первого экрана, H1 совпадает с запросом, меньше недоверия к цене | S |
| 4 | Дописать в каждый `answer` одно предложение с ценой запуска и сроком — своё на каждой странице, без общего шаблона | `lib/intl.ts` → `services/industries/departments[].answer` | Блок «Short answer» нужен, чтобы его цитировали нейросети. Цена есть только в боковой таблице, а цитируется абзац. На .ge такие абзацы уже с ценой и сроком | Цитаты с цифрами в ChatGPT, Perplexity, AI Overviews; ответ на «what does it cost» в самом абзаце | M |
| 5 | Убрать или подкрепить спорные утверждения | `blocks.tsx` → `Trust` и `Security` («Your data never trains public models»); `innerPages.security.h1`; FAQ ресепшна («Most callers care…»); FAQ маркетинга («Most teams change a few lines…»); `innerPages.blog.sub` («…from real projects»); `tested` ресепшна («50+ real scenarios»); `industries.accounting.stats` («10–20 h… (estimate)»); `innerPages.cases.h1` («honest numbers»); `innerPages.industries.h1` («businesses we know best»); FAQ HR про законность отбора резюме | marketing-claims-review: «never» — абсолютное обещание (опора — условия OpenAI и Anthropic, на них и надо сослаться, как на .ge); «Most…» — обобщение без данных; «from real projects» и «we know best» намекают на опыт и клиентов, которых сайт не показывает; «50+» и «10–20 h» — цифры, источник которых надо подтвердить. Ответ о законности по UK GDPR — юридический текст | Меньше риска для доверия и претензий, соблюдение правила «ничего не выдумывать» | S |
| 6 | Одно название бесплатного шага во всех кнопках и снижение риска рядом с ними | `site.tsx` (шапка «Book a free call»), `ctas` в `lib/intl.ts` («Get a free AI audit», «Audit my…» / «Audit our…»), `smallPerks` | Один и тот же шаг называется «free call», «free AI audit», «Audit my phone line». Профиль голоса требует «Book a free 30-minute audit». Сильное подтверждённое условие «Results check at 30 days… keep tuning for another month at no extra cost» есть только на странице для малого бизнеса | Понятнее, что получит человек; выше конверсия в заявку на ценах и в герое | S |
| 7 | Закрыть пробелы в цене и возражениях на страницах услуг и заменить шаблонную hero-статистику | `ai-consultancy` (непонятно, платный ли «1 week audit»); `ai-agents` (цены от £4,550 нет ни в абзаце, ни в FAQ); `stats` с «0 …» на 4 страницах, «< 10 sec» на 3, «24/7» на 6 | Человек не видит цену недельного аудита и агента, это главное возражение перед заявкой. Ноль вместо цифры и одинаковые «24/7» читаются как приём и повторяются между страницами | Меньше уточняющих вопросов, выше доверие к цифрам, страницы меньше похожи друг на друга | S (+ ответ владельца по цене аудита) |

## Заголовки и подзаголовки

- **Главная:** см. п. 3. Подзаголовок хороший и конкретный.
- **Services** «Six jobs AI can take off your team.» — понятно, но нет запроса из title («AI services for business»). Вариант: «AI services for business: six jobs AI can take off your team.» (проверить по GSC).
- **Industries** «AI for the businesses we know best.» — намёк на опыт без доказательств. Вариант: «AI for accounting firms, law firms, recruiters, clinics and trades.» (проверить по GSC).
- **Cases** «Example scenarios, honest numbers.» — числа в примерах оценочные, слово «honest» спорит с подзаголовком. Вариант: «Example scenarios and the numbers we track.»
- **Security** «Your data, your rules.» — слоган без факта. Вариант: «How we handle your data under UK GDPR.» (проверить по GSC).
- **About** «Why we exist.» — штамп. Вариант: «What we do and how we measure it.»
- **Страницы услуг и отраслей:** формула «AI for X: результат» работает, менять не нужно.

## Призывы к действию

- Шапка «Book a free call», герой «Get a free AI audit», форма — «Audit my phone line», в конце статьи — «Book a free call». Предлагаю одно название: **«Book a free 30-minute audit»**, в шапке короче — «Free 30-min audit». На страницах оставить своё уточнение по смыслу, но в одном формате, сейчас «my» и «our» вперемешку: «Get a free phone-line audit», «Get a free invoice audit».
- После отправки формы: «We’ll reply within one working day with first ideas…» — хорошо, конкретно.
- `procurement`: «Automate quote comparison» на кнопке формы обещает действие, которого после отправки не будет. Вариант: «Get a free quote-comparison audit».

## Коммерческие страницы: цифры, сроки, примеры, возражения

Сильные стороны: на каждой детальной странице есть «What we test before launch», план пилота с ценой и сроком, логотипы инструментов с оговоркой «Names do not imply partnerships».

Пробелы:
- **ai-consultancy:** непонятно, платный ли «1 week audit and shortlist». Бесплатен только 30-минутный звонок, а «You keep the audit report» звучит так, будто аудит бесплатный. Возражение «сколько стоит консалтинг» остаётся без ответа. [NEED: владелец — цена недельного аудита]
- **ai-agents:** цена (от £4,550) видна только в карточке списка услуг, на странице её нет ни в FAQ, ни в абзаце.
- **Возражение «а если не сработает»:** ответ есть только для команд до 50 человек (`smallPerks`, проверка результата через 30 дней). На главной и на странице цен его нет. Можно вынести строку рядом с ценами: «Teams of up to 50: if the pilot misses the agreed metric at 30 days, we keep tuning it for another month at no extra cost.» Условие подтверждено владельцем 8 октября; точные границы перепроверить.
- **Шаблонные цифры в hero-статистике:** «0 actions without your rules», «0 decisions made without a consultant», «0 upgrades or discounts…», «0 clinical advice from AI» на четырёх страницах; «< 10 sec» на трёх; «24/7» на шести. Ноль в роли цифры читается как приём. Лучше дать измеримое: «4–8 wks typical build», «Every action logged with its source».

## Сниппеты (title / description)

- Title по формуле и длине в порядке. Description главной без цены. Вариант (проверить по GSC): «AI receptionists that answer every call 24/7, chatbots and automation for CRM and invoices. From £665 setup + £174/month with the launch offer. Free audit.» (~155 знаков).
- **Цены в выдаче расходятся.** У `/solutions` description: «AI receptionist from £950 + £249/month… Launch offer: 30% off». У `/services/ai-receptionist` — «From £665 setup + £174/month». В выдаче рядом окажутся две цены одного продукта. Предлагаю в обоих местах цены со скидкой и пометкой «launch offer».
- `industries` description: тире «— and what we check» — убрать (правило про тире в короткой копии).
- Новые `desc2` для 10 страниц — см. примеры «было → стало» ниже.

## FAQ и реальные вопросы

| Вопрос из выдачи / семантики | Где ответить | Сейчас |
|---|---|---|
| What do AI automation agencies do? (PAA для «ai automation agency», это title главной) | `homeFaq` | нет |
| How much does it cost to implement AI? / How much does AI cost in the UK? | `faqFor` → `solutions`, плюс ссылка на статью `ai-implementation-cost` | есть только «What does the launch offer include?» |
| Why is AI expensive to implement? | `solutions` | нет; можно ответить механизмом: интеграции, подготовка данных, оплата использования; цену фиксируем до старта |
| Is there an AI that can do accounting? / Can ChatGPT do my bookkeeping? | `industries.accounting.faqs` | нет |
| How can AI be used for small businesses? / What is the best AI for a small business? | `smallFaq` | нет |
| How much does an AI chatbot cost? | `services.ai-chatbot.faqs`, ссылка на статью `ai-chatbot-cost` | нет |
| How much do AI agents cost? | `services.ai-agents.faqs` | нет |
| How much does AI training cost? / How long is it? | `services.ai-training.faqs` | нет (есть только «Which tools do you cover?») |
| What is the 30% rule for AI? (встречается в 3 выдачах) | тема для блога, на коммерческие страницы не брать | — |

В FAQ — короткий ответ и ссылка на статью-владельца. Тезис статьи не пересказывать (правило 8).

## Повторы и шаблонность

- `question` у всех отраслей и отделов: «What can AI do for X, and what does it cost?». Шаблон оправдан для нейросетей, оставить. Но тогда в `answer` должна быть стоимость (п. 4), иначе вопрос остаётся без ответа.
- «instead of» как противопоставление: «Your accountants review instead of retyping» (h1/sub/desc2 accounting), «Salespeople sell instead of typing notes», «a fast, personal reply instead of silence», «hands over rather than guessing». По отдельности допустимо, вместе это уже приём. Оставить одно-два.
- Нулевые и «24/7»-статистики — см. выше.

## «ИИ-шность» и утверждения: что поправить

| Где | Текст | Проблема | Правка |
|---|---|---|---|
| `Hero` (главная) | Every call answered. Every enquiry logged. Without hiring more staff. | три фрагмента, нет «AI» | см. пример 1 |
| `Trust`, `Security`, `innerPages.security.sub` | Your data never trains public models. | абсолют | «Under OpenAI and Anthropic enterprise terms, your data is not used to train their models.» |
| FAQ ai-receptionist | Most callers care that they get an answer… | обобщение без данных | см. пример 5 |
| FAQ marketing | Most teams change a few lines, not the whole text. | «not X» + обобщение | «We build a style guide from your best posts and emails, and your team edits every draft before it goes out.» |
| `innerPages.blog.sub` | …guides from real projects. | реальных кейсов нет | «Costs, checklists and step-by-step guides for putting AI to work in a business.» |
| `tested` ai-receptionist | We call it ourselves with 50+ real scenarios… | цифра, требует подтверждения | подтвердить у владельца или «We test it ourselves on the call types your business gets before launch.» |
| `industries.accounting.stats` | 10–20 h saved per accountant a month (estimate) | источник оценки | подтвердить расчёт или заменить на механизм: «Drafts in Xero for review» |
| FAQ HR | Under UK GDPR, a candidate must not be rejected by an automated decision alone. | юридическое утверждение; правила по статье 22 в UK недавно менялись | отдать на проверку юристу, сам не переписываю |
| FAQ law-firms «Is it compliant with SRA rules?» | ответ уходит от «да / нет» | вопрос юридический | оставить как есть, отметить для юриста |

---

# praxenai.ge

## Топ-7 рекомендаций

| # | Что | Где (файл / ключ) | Почему | Эффект | Усилие |
|---|---|---|---|---|---|
| 1 | Свой description для 20 страниц отраслей и отделов: запрос, каналы, цена «от 3 200 ₾», шаг | `lib/seo.ts` → `detailDescription` берёт `pageCopy[slug][lang].sub`. Нужно поле description в `lib/detail-meta.ts` для ru/en/ka. **Проверить по GSC перед заменой** | Сейчас сниппет — это подзаголовок: «Корпоративный ассистент отвечает по внутренним правилам…» (HR, 95 знаков). В нём нет «ИИ для HR», цены и бесплатного аудита. Title при этом собран под запрос (`detail-meta.ts`), и сниппет с ним не связан | Рост CTR на 20 страницах сразу; на .com такие поля (`desc2`) уже есть | M |
| 2 | Убрать «не X, а Y» и рублёные фразы-слоганы из видимых текстов | `content.ts` → `industries[].promise` (services: «…с ясного брифа, а не цепочки уточнений»; hotels, retail — пары фрагментов); `page-copy.ts` → marketing.sc («звучат как ваша команда, а не как шаблон»), support.ctl («не придумывает, а передаёт»), retail.faq («ищет по каталогу, а не запоминает»), procurement.faq («Объём не принципиален — важно…»); `site-copy.ts` → processH2 «Сначала задача. Потом технология.», oneRole «Одна роль. Разные процессы.», whatBuildH2 «Решения, у которых есть задача.», footerTag; `inner.tsx` → H1 industries «Ваш бизнес. Ваш сценарий внедрения.» | Прямые запреты профиля голоса .ge и humanizer: «не X, а Y», интонация «лидера мнений», пустые слоганы | Тексты звучат как у человека; меньше риска, что текст сочтут сгенерированным | S |
| 3 | H1 разделов привести к запросу из title | `components/praxen/inner.tsx` → `InnerHero.title`: industries, solutions («От обучения до собственного решения.»), cases («Посмотрите, как может работать ИИ.»), departments. **Проверить по GSC** | Title «Стоимость внедрения ИИ в Грузии», а H1 о другом. Title «ИИ и чат-боты для бизнеса по отраслям», а H1 «Ваш бизнес. Ваш сценарий внедрения.» Поисковик и нейросеть сверяют title, H1 и текст | Точнее совпадение с запросами «стоимость внедрения ии», «чат-бот для бизнеса» | S |
| 4 | Сделать ответ «Сколько стоит…» своим для каждой страницы и убрать повторы | `components/site.tsx` → `detailCost` (один текст на 20 страницах) + последнее предложение в каждом `detail-answers.ts`; формулы «Проверяем до оценки» в FAQ `page-copy.ts`; «24/7» в шести H1 и title | Один и тот же абзац о цене стоит на 20 страницах и в разметке FAQPage. Правило «страницы не повторяют друг друга» (HANDOFF, п. 3). Плюс на одной странице цена звучит дважды: в абзаце-ответе и в FAQ | Уникальность страниц, сильнее ответ на «сколько стоит ИИ для отеля / клиники» | M |
| 5 | Исправить противоречия и спорные утверждения | `detail-answers.ts` → finance: «Данные остаются в вашем контуре» (а на сайте сказано, что работаем через API OpenAI и Anthropic); `site-copy.ts` → dataGuarantee и `company.tsx` → «поставка GPU-серверов»; `detail-answers.ts` — «сопровождение» в 9 ответах вместо утверждённого «дополнительное ведение»; `section-meta.ts` → cases title «Примеры внедрения ИИ…» (это типовые сценарии, не внедрения); `page-copy.ts` → support FAQ «конструктор… за 49 ₾ в месяц» (источник цены?); «работа по Закону Грузии…» | marketing-claims-review: противоречие внутри сайта, обещание услуги, которую надо подтвердить, неявное утверждение о реальных внедрениях, название тарифа расходится с `docs/TARIFFS.md` | Доверие, соответствие правилу «ничего не выдумывать»; меньше вопросов на созвоне | S |
| 6 | На странице обучения ответить на возражения: длительность, размер группы, что входит в 1 900 ₾ | `lib/ge-faq.ts` → `trainingHow` («Программу и длительность согласуем после короткого разговора»); `inner.tsx` → facts training | «обучение нейросетям сотрудников» — заметный кластер; люди спрашивают «как обучиться», «какие курсы». На .com формат конкретный (полдня, до 12 человек, разбор через 2 недели), на .ge — «согласуем». [NEED: владелец — формат обучения на .ge] | Меньше «уточнить» в заявках, выше конверсия страницы обучения | S (после ответа владельца) |
| 7 | Первый экран и форма: цена и формат аудита вместо повтора про языки | `components/praxen/home.tsx` → `proof` (третий пункт «3 языка», уже есть в heroIntro); `site-copy.ts` → `contactP`, `action`; для en — eyebrow/heroIntro. **H1 не трогать без GSC** | На первом экране нет ни одной цены, а «30 минут» про аудит видно только во всплывающем окне и у кнопки записи. «Покажем, как можно изменить процесс» — неконкретное обещание. В Грузии «AI chatbot» — 1 300 показов/мес в Google (en), а английская главная .ge (адрес без префикса) слово chatbot в первом экране не называет | Больше заявок с главной; английская главная ближе к главному запросу страны | S |

## Заголовки и подзаголовки

- **Главная:** «ИИ отвечает клиентам за секунды и сам заполняет CRM. Пилот за 2–4 недели с фиксированной ценой.» — сильный конкретный H1, менять не нужно. Возможное добавление (проверить по GSC): в eyebrow вместо «Практический ИИ для бизнеса в Грузии» поставить «Внедрение ИИ и чат-ботов для бизнеса в Грузии» — это запрос из title главной.
- **Отрасли:** сейчас «Ваш бизнес. Ваш сценарий внедрения.» → «ИИ и чат-боты по отраслям: готовые сценарии для 12 отраслей» (проверить по GSC).
- **Решения:** сейчас «От обучения до собственного решения.» → «Сколько стоит внедрение ИИ: обучение, внедрение, разработка» (проверить по GSC).
- **Примеры:** сейчас «Посмотрите, как может работать ИИ.» → «Примеры решений с ИИ: ситуация, решение и что измеряем».
- **Руководство:** H1 «ИИ на уровне бизнеса: где он окупится…» — «на уровне бизнеса» звучит размыто, а title уже «ИИ-стратегия для собственника». Вариант H1: «ИИ-стратегия для собственника: где ИИ окупится и как это проверить» (проверить по GSC).
- **Подписи карточек отраслей (`promise`):** повелительные слоганы из двух обрывков («Больше внимания гостям. Меньше повторяющихся вопросов.»). Лучше одной фразой о том, что делает ИИ: «Ответы гостям о заселении и трансфере — в WhatsApp, без администратора».

## Призывы к действию

- Сейчас: шапка «Бесплатный аудит», герой «Обсудить в WhatsApp» + «Бесплатный аудит процесса», кнопка формы «Получить расчёт проекта», кнопка записи «Записаться на аудит», отделы — «Аудит отдела продаж», «Стратегический аудит». Логика понятная. Не хватает одного: что такое аудит. Предлагаю под кнопкой в герое и в форме одну строку: «30 минут онлайн. Итог — процесс для пилота, оценка в часах и лари, цена пилота». Факты из блока «Что даёт бесплатный аудит».
- `contactP`: см. пример 11.
- `faqTitle` для детальных страниц «Вопросы по делу.» — пустой оборот. Вариант: «Частые вопросы о {отрасль}».

## Коммерческие страницы: цифры, сроки, примеры, возражения

Сильные стороны: в `detail-answers.ts` у каждой страницы цена, срок пилота и метрика; честный ответ «если вам хватит конструктора, скажем об этом на аудите»; блок «Пилот по шагам» из данных страницы; калькулятор и пример аудита с пометкой «данные условные».

Пробелы:
- **Возражение «а если не окупится»** закрыто только у руководства («Если проект не окупается, скажем об этом прямо»). Эту фразу или «если ИИ не подходит, говорим сразу» (из «О нас») стоит поставить рядом с ценами на `/solutions`.
- **Сравнение с дешёвой альтернативой** («конструктор за 49 ₾») есть только в поддержке. Ему место на странице `/chatbot`, где человек выбирает подрядчика. Цифру 49 ₾ сначала подтвердить (`docs/PRICE-CHECK-GEORGIA.md`?).
- **Грузинский язык** — главное отличие для рынка, но на `/chatbot` нет вопроса «Насколько хорошо бот отвечает на грузинском?». Короткий ответ и ссылка на статью «ИИ на грузинском: как проверить ответы бота до запуска».
- **`page-profiles.ts`:** сценарии, `control` и FAQ здесь почти не показываются, потому что их заменяет `page-copy.ts` (на всех 20 страницах есть override). Видны только `input/rows` в демо. Править их в первую очередь не нужно; там тоже есть «а не» (finance.control, marketing).

## Сниппеты

- Главная ru: title и description хорошие (запрос, география, цена «от 3 200 ₾»).
- `industries` description: «узнайте, где ИИ окупится быстрее всего» — обещание без механизма. Вариант (проверить по GSC): «Сценарии ИИ для 12 отраслей: отели, клиники, рестораны, магазины, логистика. Чат-боты в WhatsApp и Telegram на трёх языках, внедрение от 3 200 ₾.» (~150 знаков).
- `cases` title «Примеры внедрения ИИ в бизнес в Грузии» читается как реальные внедрения. Вариант (проверить по GSC): «Примеры решений с ИИ для бизнеса в Грузии: сценарии и метрики».
- Детальные страницы — п. 1 и примеры ниже.

## FAQ и реальные вопросы (семантика .ge)

| Вопрос / кластер | Частотность | Где ответить | Сейчас |
|---|---|---|---|
| «ии агент» — что это, чем отличается от чат-бота | GE 99, KZ 792 (Вордстат); «AI agent» en 260 (Google, GE) | `/departments` (title «ИИ-агенты для отделов»): короткий ответ и ссылка на будущую статью `what-is-ai-agent` | нет; в FAQ отделов про агентов ничего |
| «чат бот» / «AI chatbot» | GE 297 / en 1 300 | `/chatbot` — вопрос о грузинском языке | нет |
| «Можно ли в WhatsApp сделать бота?», «WhatsApp Business и обычный» | KZ PAA | `/departments/sales` | есть («Нужен ли WhatsApp Business API?») — хорошо |
| «Как ИИ может заменить бухгалтера?» | KZ PAA | `/departments/finance` | есть («Заменит ли ИИ бухгалтера?») — хорошо |
| «Как обучиться работе с нейросетями?», «курсы» | KZ PAA | `/training`: длительность, группа, итог | ответ расплывчатый — п. 6 |
| «внедрение ии» — с чего начать | GE 10, KZ 158 | главная (`agentFaq` про агента) | есть, близко по смыслу |

## Повторы и шаблонность

- `detailCost` — одинаковый абзац на 20 страницах (п. 4). Предложение: оставить одну цену, но описать, что входит именно здесь. Например, для отелей: «бот в WhatsApp с подключением к PMS и передачей жалоб администратору — внедрение от 3 200 ₾…».
- Окончания `detail-answers.ts` одинаковые: «Внедрение… от 3 200 ₾, дополнительное ведение — от 550 ₾ в месяц. Пилот… 2–4 недели. Результат измеряем по…». Для нейросетей это допустимо, но формулировку стоит варьировать, и пусть в каждом ответе будет одна деталь страницы (что именно входит в пилот).
- В FAQ `page-copy.ts` шесть раз «Проверяем до оценки / перед оценкой / доступы до оценки». Оставить в одном-двух местах, в остальных называть, что проверяем: «API, права и обязательные поля».
- «24/7» в H1 и title e-commerce, отелей, недвижимости, застройщиков, клиник, школ. Не ошибка, но шаблон. В части H1 заменить на конкретное действие.
- **Английская версия .ge:** тире-противопоставления и «хвосты» — «Size isn’t the issue — source data quality is.», «When information is missing it doesn’t guess — it hands over…», «…next steps and follow-up dates — no manual CRM entry». По профилю голоса en — простой английский без этих приёмов.

## Спорные утверждения .ge (на решение владельца)

- «Данные остаются в вашем контуре» (`detail-answers.ts`, finance) — противоречит работе через API OpenAI и Anthropic. Предлагаю: «По условиям корпоративных API OpenAI и Anthropic данные не используются для обучения публичных моделей. Если документы не должны покидать компанию, решение разворачиваем на ваших серверах.»
- «…включая поставку GPU-серверов» (`site-copy.ts` dataGuarantee, `company.tsx`, description `/security`) — подтвердить, что услуга реально есть. В `docs/TARIFFS.md` сказано: «Своей платформы… у нас нет».
- «Работаем по Закону Грузии о защите персональных данных» — юридическое утверждение, на проверку юристу. Сам не переписываю.
- «Конструктор чат-ботов за 49 ₾ в месяц» — источник цены.
- Название «сопровождение» в 9 ответах `detail-answers.ts` (en — «support») расходится с утверждённым «дополнительное ведение» / «ongoing maintenance».

---

# Лучшие примеры «было → стало»

## praxenai.com (английский)

1. **Home H1** (`blocks.tsx` → `Hero`; проверить по GSC)
   - Было: «Every call answered. Every enquiry logged. Without hiring more staff.»
   - Стало: «AI receptionists and chatbots that answer every call and log every enquiry.»
   - Почему: в H1 появляются запросы из title, вместо трёх обрывков одна фраза.

2. **Home proof row** (`blocks.tsx` → `Hero.proof`)
   - Было: «£174/mo · launch price, AI receptionist»
   - Стало: «£665 + £174/mo · AI receptionist, launch price»
   - Почему: полная цена сразу, без «сюрприза» с оплатой запуска.

3. **AI chatbot, description** (`lib/intl.ts` → `ai-chatbot.desc2`, новое поле; проверить по GSC)
   - Было (подставляется sub): «It replies on your website and WhatsApp in seconds, using your price list, policies and FAQs. Each answer cites its source, and a person takes over when needed.»
   - Стало: «An AI chatbot for your website and WhatsApp: answers from your price list and policies, cites the source, hands over to staff. Pilot from £2,030.» (~145 знаков)

4. **AI automation, description** (`ai-automation.desc2`; проверить по GSC)
   - Было: «Enquiries, PDFs, invoices and emails are read, checked and entered into your CRM, accounting software or spreadsheets. People approve, the system types.»
   - Стало: «AI automation for invoices, PDFs and enquiries: data read, checked and entered into Xero, HubSpot or your sheets. Pilot in 2–4 weeks from £2,030.» (~145 знаков)

5. **AI receptionist FAQ «Will callers know it’s AI?»**
   - Было: «Yes. It introduces itself as your virtual assistant. Most callers care that they get an answer and a booking straight away.»
   - Стало: «Yes. It introduces itself as your virtual assistant at the start of every call. If a caller asks for a person, it transfers the call or takes a message marked urgent.»
   - Почему: обобщение без данных заменено механизмом, который уже описан на странице.

6. **AI chatbot, новый FAQ**
   - Было: вопроса нет.
   - Стало: «How much does an AI chatbot cost? — With the launch offer, a pilot on one workflow, such as website chat or WhatsApp replies, is £2,030 at a fixed price. Optional care is £245 a month. AI usage and WhatsApp message fees are paid on your own accounts at cost. All prices exclude VAT. A full breakdown is in our guide to AI chatbot costs.»

7. **Trust / Security**
   - Было: «We use enterprise APIs. Your data never trains public models.»
   - Стало: «We use the OpenAI and Anthropic enterprise APIs. Under their terms, your data is not used to train their models.»

8. **Cases H1** (`innerPages.cases.h1`; проверить по GSC)
   - Было: «Example scenarios, honest numbers.»
   - Стало: «Example scenarios and the numbers we track.»
   - Почему: числа оценочные, слово «honest» спорит с подзаголовком.

## praxenai.ge (русский)

1. **Карточка отрасли «Профессиональные услуги»** (`content.ts` → `services.promise`)
   - Было: «Начинайте проект с ясного брифа, а не цепочки уточнений.»
   - Стало: «Из первого письма клиента — бриф, список вопросов и черновик КП.»

2. **Поддержка, блок контроля** (`page-copy.ts` → `support.ru.ctl`)
   - Было: «ИИ отвечает только по вашим документам. Если информации нет, он не придумывает, а передаёт диалог оператору — клиенту не нужно повторять вопрос.»
   - Стало: «ИИ отвечает только по вашим документам. Если ответа в базе нет, диалог уходит оператору вместе с историей, и клиент не повторяет вопрос.»

3. **Маркетинг, сценарий** (`page-copy.ts` → `marketing.ru.sc[0]`)
   - Было: «Загружаем брендбук, редполитику и лучшие материалы. Черновики звучат как ваша команда, а не как шаблон.»
   - Стало: «Загружаем брендбук, редполитику и лучшие материалы. Черновики пишутся по ним, редактор правит и утверждает.»

4. **Главная, раздел о процессе** (`site-copy.ts` → `processH2`)
   - Было: «Сначала задача. Потом технология.»
   - Стало: «Как мы работаем: от аудита до пилота за 2–4 недели.»

5. **H1 страницы отраслей** (`inner.tsx`; проверить по GSC)
   - Было: «Ваш бизнес. Ваш сценарий внедрения.»
   - Стало: «ИИ и чат-боты по отраслям: готовые сценарии для 12 отраслей»

6. **H1 страницы цен** (`inner.tsx`; проверить по GSC)
   - Было: «От обучения до собственного решения.»
   - Стало: «Сколько стоит внедрение ИИ: обучение, внедрение, разработка»

7. **Description страницы отдела продаж** (новое поле в `detail-meta.ts`; проверить по GSC)
   - Было (подставляется sub): «Помощник отвечает на заявки в WhatsApp, Telegram и на сайте за секунды, квалифицирует лида по вашим вопросам и готовит КП по каталогу. Сделку ведёт менеджер.»
   - Стало: «ИИ для отдела продаж: ответ на заявку в WhatsApp, Telegram и на сайте за секунды, сделка в amoCRM или Битрикс24. Пилот 2–4 недели, от 3 200 ₾.» (~142 знака)

8. **Первый экран, строка доказательств** (`home.tsx` → `proof[2]`)
   - Было: «3 языка · KA · EN · RU в каждом решении» (повтор heroIntro)
   - Стало: «от 3 200 ₾ · цену пилота фиксируем до старта»

9. **Форма** (`site-copy.ts` → `contactP`)
   - Было: «Выберите, что отнимает больше всего времени. Покажем, как можно изменить процесс с помощью ИИ.»
   - Стало: «Отметьте, что отнимает больше всего времени. В течение рабочего дня ответим, что можно передать ИИ и сколько будет стоить пилот.»
   - Почему: срок ответа уже обещан на сайте («ответим в течение рабочего дня»), цена пилота — суть аудита.

10. **Бухгалтерия, абзац-ответ** (`detail-answers.ts` → finance)
   - Было: «Данные остаются в вашем контуре и не используются для обучения публичных моделей.»
   - Стало: «По условиям корпоративных API OpenAI и Anthropic данные не используются для обучения публичных моделей. Если документы не должны покидать компанию, решение разворачиваем на ваших серверах.»

---

# Нужно от владельца

1. .com: платный ли недельный аудит в AI consultancy и сколько он стоит.
2. .com: подтверждение «50+ real scenarios» в тестировании ресепшна и основа оценки «10–20 h per accountant».
3. .ge: формат обучения (длительность, размер группы, что входит в 1 900 ₾).
4. .ge: есть ли услуга «поставка GPU-серверов»; источник цены «конструктор за 49 ₾».
5. Юристу: FAQ .com о законности отбора резюме по UK GDPR и вопрос о SRA; строка .ge «работаем по Закону Грузии о защите персональных данных». Юридические тексты не переписываю.
6. Доступ к Search Console (обоих сайтов), чтобы решить по H1, title и description и по пересечению блога с коммерческими страницами.
