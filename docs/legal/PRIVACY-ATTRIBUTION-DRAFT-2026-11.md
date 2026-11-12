# Политики конфиденциальности: дополнение «учёт источника заявки» — ЧЕРНОВИК

**Статус: на проверку юристу.** Составитель — агент `praxen-legal` (не юрист). Версия 2.1 от 12.11.2026 (учтены ответы владельца, переданные координатором 12.11, включая срок хранения копий заявок). Версия 1 — 11.11.2026.
В файлы сайта ничего не внесено. Публиковать только после «да» владельца и проверки юристом (опубликованные политики без согласия владельца не меняем).

Где лежат тексты сейчас:
- praxenai.ge (ru/en/ka): `components/praxen/privacy.tsx`, дата `updated = '2026-10-24'`.
- praxenai.com: `components/intl/blocks.tsx`, функция `Doc`, раздел `privacy`; плашка cookie — `components/analytics.tsx`, `bannerCopy.en` (ветка `isIntl`). Строки о политике в `lib/intl-text.ts` относятся к общему компоненту .ge и на странице /privacy .com, судя по коду, не используются (проверить разработчику при внесении).

Ответы владельца, учтённые в версии 2:
1. amoCRM — российская версия (amocrm.ru).
2. Реквизиты ИП и почту в политике .ge указать можно.
3. Передавать заявки обратно в Google Ads и Meta (офлайн-конверсии, Conversions API) — планируется.
4. Фразу в плашке cookie .com об учёте источника после «Accept» — добавить можно.
5. Копии заявок в Telegram и на почте удаляются через 3 года, как в amoCRM (ответ владельца, версия 2.1).
Реклама Директа на Россию по текущему плану не планируется; владелец это явно не отметил, поэтому вопрос о 152-ФЗ оставлен как условный.

---

## 1. Коротко для владельца

**Что меняется на сайте.** Браузер посетителя до 90 дней помнит, откуда человек пришёл в первый и в последний раз: метки рекламы, номер рекламного клика, сайт, с которого перешёл (только адрес сайта, например google.com), и страницу входа. Пока заявки нет, это лежит у человека в браузере. С заявкой это приходит вам в Telegram, на почту и в amoCRM. Если человек нажал «Принять», добавляются ещё две метки Meta. Номер клика Яндекса уходит в Яндекс Метрику без контактов.

**Разница между сайтами.**
- **.com:** метки запоминаются только после «Accept» (британские правила о cookie требуют согласия). В политике основание — согласие. В плашку добавляем фразу, что после «Accept» запоминается, откуда человек пришёл.
- **.ge:** метки запоминаются сразу, основание — законный интерес, отказ — «Отклонить». Достаточно ли этого по грузинскому закону, проверит юрист.

**Новое в версии 2.**
- В политике .ge появляются реквизиты ИП и почта hello@praxenai.ge.
- В обеих политиках прямо сказано, что CRM — российский сервис amoCRM и данные заявок хранятся в России.
- Готов текст на будущее: когда начнём отправлять заявки обратно в Google Ads и Meta, это будет только по заявкам людей, нажавших «Принять». Текст включаем в политику в день запуска, не раньше.
- Готов текст плашки cookie .com.

### Предупреждение о риске для .com: amoCRM в России

**Суть.** Для клиентов из Великобритании передача их данных в страну, которую Великобритания не признала «безопасной» для данных, разрешена только с дополнительными мерами (UK GDPR, ст. 44–46). Россия в таком списке не значится (у Великобритании нет решения об адекватности для России). Нужен специальный договор (IDTA) и письменная оценка, что данные там защищены. В России закон даёт государству широкий доступ к данным на серверах, поэтому такую оценку честно пройти трудно. Кроме того, amoCRM вряд ли подпишет британский договор. Если британский клиент или регулятор (ICO) спросит, защищаться будет нечем. Штрафы по UK GDPR — до £17,5 млн или 4 % оборота; для маленькой компании реальнее предписание и репутационный удар, но риск настоящий.

**Если заявки .com уже сейчас уходят в amoCRM** (это зависит от настроек сайта .com, проверит разработчик), риск уже есть, и нынешняя политика .com его не раскрывает.

**Варианты для .com (решение за вами):**
- **А. Не отправлять заявки .com в amoCRM** (рекомендую как первый шаг). Заявки .com приходят только на почту и в Telegram. Это делается быстро, в настройках сайта .com, без переделки. Минус: заявки .com не попадают в воронку CRM, их ведут вручную.
- **Б. Отдельная CRM для .com с серверами в Великобритании, ЕС или США** (например, Kommo — международная версия amoCRM, или HubSpot/Pipedrive). Где Kommo хранит данные и есть ли у неё договор обработки по британским правилам, нужно проверить до выбора. Плюс: та же логика воронки. Минус: вторая подписка и настройка.
- **В. Оставить amoCRM.ru для .com** с договором IDTA и оценкой рисков — только если юрист подтвердит, что это реально. Не рекомендую.

Для .ge передача в Россию тоже требует проверки юристом (грузинские правила о передаче за рубеж), но риск ниже: в политике это раскрываем прямо (тексты ниже), а допустимость оценит юрист (вопрос 5.5).

---

## 2. praxenai.ge — тексты (ru / en / ka)

Право: Закон Грузии «О защите персональных данных» № 3144 от 14.06.2023, в силе с 01.03.2024 (matsne.gov.ge, документ 5827307).
Опора по пунктам (номера сверить с официальным текстом на matsne; сверял по вторичным источникам):
- указать, кто обрабатывает данные, цель, основание, получателей, срок и права субъекта: гл. III, ст. 13–14 (право на информацию);
- законный интерес как основание: ст. 5(1), по вторичным источникам подпункт «и» / (i) («существенный законный интерес», если не перевешивают права субъекта);
- согласие как основание (для будущей передачи в Google Ads и Meta): ст. 5(1), согласие субъекта;
- передача за рубеж (Россия, amoCRM и Яндекс): положения закона о международной передаче — сверить статьи и перечень стран Службы защиты персональных данных;
- договор с обработчиком (amoCRM): положения закона об уполномоченном лице (обработчике) — сверить.

Стиль сохранён: короткие абзацы, без ссылок на статьи в публичном тексте. Формат — строки для `c('ru','en','ka')`. Грузинский — на вычитку носителю (команда владельца).

### 2.1. Блок «Кто обрабатывает данные» — заменить абзац 1 (реквизиты)

Данные: `legalEntity` из `lib/intl.ts` (Individual Entrepreneur Evgenii Budnikov, 9 Nizharadze Street, Apartment 124, Batumi, Georgia), почта и телефон .ge из `lib/contacts.ts` (hello@praxenai.ge, +995 557 125 497). Идентификационный код ИП в коде не найден — нужен от владельца (`[ИД-КОД]`). Написание имени на русском и грузинском сверить с выпиской из реестра.

- ru: Оператор данных — индивидуальный предприниматель Евгений Будников (Грузия), идентификационный код [ИД-КОД], адрес: Батуми, ул. Нижарадзе, 9, кв. 124. Praxen AI — его торговое название. По вопросам о данных пишите на hello@praxenai.ge, в Telegram или звоните: +995 557 125 497.
- en: The data controller is Individual Entrepreneur Evgenii Budnikov (Georgia), identification code [ID CODE], 9 Nizharadze Street, Apartment 124, Batumi. Praxen AI is his trading name. For any data question, email hello@praxenai.ge, message us on Telegram or call: +995 557 125 497.
- ka: მონაცემთა დამმუშავებელია ინდივიდუალური მეწარმე ევგენი ბუდნიკოვი (საქართველო), საიდენტიფიკაციო კოდი [ს/კ], მისამართი: ბათუმი, ნიჟარაძის ქ. 9, ბინა 124. Praxen AI მისი სავაჭრო სახელია. მონაცემებთან დაკავშირებით მოგვწერეთ hello@praxenai.ge-ზე, Telegram-ში ან დაგვირეკეთ: +995 557 125 497.

Технически: в коде телефон берётся из `contacts.phoneLabel`, почта — из `contacts.email`; жёстко прописывать не нужно.

### 2.2. Новый блок (после блока «Какие данные мы получаем»)

**Заголовок**
- ru: Как мы узнаём, откуда пришла заявка
- en: How we know where an enquiry came from
- ka: როგორ ვიგებთ, საიდან მოვიდა განაცხადი

**Абзац 1 — что запоминаем и где**
- ru: Когда вы заходите на сайт по ссылке или рекламе, браузер запоминает на вашем устройстве первый и последний такой заход: метки UTM, номер рекламного клика (gclid, fbclid, yclid, msclkid), домен сайта, с которого вы пришли, и страницу входа. Запись хранится в памяти браузера (localStorage) до 90 дней. С предыдущего сайта сохраняется только домен (например, google.com), без адреса страницы.
- en: When you come to the site from a link or an ad, your browser remembers the first and the last such visit on your device: UTM tags, the ad click number (gclid, fbclid, yclid, msclkid), the domain of the site you came from and the page you landed on. The record is kept in your browser's storage (localStorage) for up to 90 days. From the previous site we keep only the domain (for example, google.com), not the page address.
- ka: როცა საიტზე ბმულით ან რეკლამიდან შემოდიხართ, ბრაუზერი თქვენს მოწყობილობაზე იმახსოვრებს პირველ და ბოლო ასეთ ვიზიტს: UTM ნიშნებს, სარეკლამო დაწკაპუნების ნომერს (gclid, fbclid, yclid, msclkid), იმ საიტის დომენს, საიდანაც მოხვედით, და შესვლის გვერდს. ჩანაწერი ბრაუზერის მეხსიერებაში (localStorage) ინახება 90 დღემდე. წინა საიტიდან ვინახავთ მხოლოდ დომენს (მაგალითად, google.com), გვერდის მისამართის გარეშე.

**Абзац 2 — когда и кому уходит**
- ru: Пока вы не отправили заявку, эти данные остаются в вашем браузере и никуда не передаются. Вместе с заявкой они приходят нам в Telegram, на почту и в amoCRM. Если вы дали согласие на рекламные cookie, к заявке добавляются также cookie Meta _fbc и _fbp: по ним видно, что заявка пришла с рекламы в Facebook или Instagram.
- en: Until you send an enquiry, this data stays in your browser and goes nowhere. With an enquiry, it reaches us via Telegram, email and amoCRM. If you accepted advertising cookies, the enquiry also carries Meta's _fbc and _fbp cookies, which show that it came from a Facebook or Instagram ad.
- ka: სანამ განაცხადს არ გაგზავნით, ეს მონაცემები თქვენს ბრაუზერში რჩება და არსად გადაიცემა. განაცხადთან ერთად ისინი გვეგზავნება Telegram-ში, ელფოსტაზე და amoCRM-ში. თუ სარეკლამო cookie-ებზე თანხმობა მოგვეცით, განაცხადს ემატება Meta-ს cookie-ები _fbc და _fbp: მათით ჩანს, რომ განაცხადი Facebook-ის ან Instagram-ის რეკლამიდან მოვიდა.

**Абзац 3 — зачем и основание**
- ru: Зачем: понимать, какие каналы и объявления приводят заявки, и не тратить бюджет на те, что не работают. Основание — наш законный интерес. В записи нет ваших контактов, а с вами она связывается, только когда вы сами отправляете заявку.
- en: Why: to see which channels and ads bring enquiries and stop spending on those that do not. The basis is our legitimate interest. The record holds none of your contact details, and it is linked to you only when you send an enquiry yourself.
- ka: რისთვის: რომ გავიგოთ, რომელი არხები და რეკლამები მოაქვს განაცხადებს, და ბიუჯეტი არ დავხარჯოთ იმაზე, რაც არ მუშაობს. საფუძველია ჩვენი კანონიერი ინტერესი. ჩანაწერში თქვენი კონტაქტები არ არის, თქვენთან კი ის მხოლოდ მაშინ კავშირდება, როცა განაცხადს თავად გაგზავნით.

**Абзац 4 — как отказаться**
- ru: Отказаться можно в любой момент: нажмите «Отклонить» в плашке cookie или в настройках ниже — запись удалится из браузера и больше не будет вестись. Источник уже отправленной заявки удалим по вашему запросу вместе с заявкой.
- en: You can opt out at any time: press "Decline" in the cookie banner or in the settings below, and the record is deleted from your browser and no longer kept. If you ask, we will delete the source of an enquiry you have already sent, together with the enquiry.
- ka: უარის თქმა ნებისმიერ დროს შეგიძლიათ: დააჭირეთ „უარი“ cookie-ის ფანჯარაში ან ქვემოთ პარამეტრებში — ჩანაწერი ბრაუზერიდან წაიშლება და აღარ შეინახება. უკვე გაგზავნილი განაცხადის წყაროს თქვენი მოთხოვნით განაცხადთან ერთად წავშლით.

> Допущение А1: «Отклонить» на .ge не только удаляет запись, но и останавливает новые. Если разработка делает иначе (только удаляет), убрать «и больше не будет вестись / and no longer kept / და აღარ შეინახება».

### 2.3. Правки в существующих блоках .ge

**«Какие данные мы получаем», абзац 1** — заменить хвост «и источник перехода (например, метки UTM).»:
- ru: …и источник перехода (подробнее — в разделе «Как мы узнаём, откуда пришла заявка»).
- en: …and the traffic source (see "How we know where an enquiry came from").
- ka: …და გადმოსვლის წყარო (დაწვრილებით — განყოფილებაში „როგორ ვიგებთ, საიდან მოვიდა განაცხადი“).

**«Кому передаются данные», абзац 1** — заменить первое предложение («Заявки доставляются нам через Telegram, электронную почту и CRM-систему amoCRM.») на:
- ru: Заявки вместе с их источником доставляются нам через Telegram и электронную почту и хранятся в CRM-системе amoCRM. amoCRM — российский сервис (ООО «amoCRM»), данные в нём хранятся на серверах в России.
- en: Enquiries, together with their source, reach us via Telegram and email and are stored in the amoCRM system. amoCRM is a Russian service (amoCRM LLC), and the data in it is stored on servers in Russia.
- ka: განაცხადები მათ წყაროსთან ერთად გვეგზავნება Telegram-ითა და ელფოსტით და ინახება amoCRM სისტემაში. amoCRM რუსული სერვისია (შპს „amoCRM“), მასში მონაცემები რუსეთში მდებარე სერვერებზე ინახება.

Остальное в абзаце 1 (Cal.com, хостинг) — без изменений. Абзац 2 (про Яндекс) уже верен, но его стоит дополнить (Яндекс — тоже Россия):
- ru, добавить в конец фразы про Яндекс: …без ваших контактов; эти данные обрабатываются на серверах Яндекса в России.
- en: …never your contact details; this data is processed on Yandex servers in Russia.
- ka: …თქვენი კონტაქტების გარეშე; ეს მონაცემები Yandex-ის სერვერებზე რუსეთში მუშავდება.

> Сверить: точное наименование оператора amoCRM (в версии 2 — «ООО «amoCRM»», как передал координатор) — по договору или оферте amoCRM; место хранения у Яндекса Метрики — по документам Яндекса.

**«Сколько храним»** — заменить абзац 1 и добавить абзац 2 (срок 3 года — для всех копий заявки: amoCRM, Telegram, почта; подтверждено владельцем):
- ru, абзац 1: Данные заявки вместе с её источником — до 3 лет после последнего контакта или до вашего запроса на удаление. Это касается всех копий заявки: в amoCRM, в Telegram и на почте.
- en, абзац 1: Enquiry data, including its source, is kept for up to 3 years after our last contact, or until you ask us to delete it. This applies to every copy of the enquiry: in amoCRM, in Telegram and in our email.
- ka, абзац 1: განაცხადის მონაცემები მის წყაროსთან ერთად ინახება ბოლო კონტაქტიდან 3 წლამდე ან წაშლის მოთხოვნამდე. ეს ეხება განაცხადის ყველა ასლს: amoCRM-ში, Telegram-სა და ელფოსტაში.
- ru, абзац 2: Источник перехода хранится в вашем браузере до 90 дней.
- en, абзац 2: The traffic source stays in your browser for up to 90 days.
- ka, абзац 2: გადმოსვლის წყარო თქვენს ბრაუზერში ინახება 90 დღემდე.

**Дата** — `updated` поменять на дату публикации.

**Плашка cookie .ge (по желанию владельца).** Вариант (ru): «Мы используем Яндекс Метрику и Google Analytics, чтобы понимать, какие страницы полезны, и запоминаем, по какой ссылке вы пришли. Рекламные cookie загружаются только с вашего согласия.» en/ka — по образцу, грузинский на вычитку.

### 2.4. На будущее: передача в Google Ads и Meta (включить в день запуска, не раньше)

Условие (решение по проекту): отправляем только заявки посетителей, нажавших «Принять». Основание — согласие (ст. 5(1), согласие субъекта). Текст — новый абзац в блоке «Как мы узнаём, откуда пришла заявка», после абзаца 2. Фраза в блоке «Кому передаются» «Рекламные сервисы (Meta, Google Ads) получают данные только после вашего согласия» остаётся верной, её не меняем.

- ru: Если вы нажали «Принять» и отправили заявку, мы сообщаем Google Ads и Meta, что по их рекламному клику пришла заявка: номер клика (gclid или _fbc/_fbp), вид события и время. Так реклама показывается тем, кому она полезнее. Без вашего согласия такие данные не передаются. Отозвать согласие можно в настройках cookie; уже переданные данные Google и Meta хранят по своим правилам.
- en: If you clicked "Accept" and sent an enquiry, we tell Google Ads and Meta that an enquiry came from their ad click: the click number (gclid or _fbc/_fbp), the type of event and the time. This helps show ads to people who will find them useful. Without your consent no such data is sent. You can withdraw consent in the cookie settings; data already sent is kept by Google and Meta under their own rules.
- ka: თუ დააჭირეთ „თანხმობას“ და განაცხადი გაგზავნეთ, Google Ads-სა და Meta-ს ვატყობინებთ, რომ მათი სარეკლამო დაწკაპუნებიდან განაცხადი მოვიდა: დაწკაპუნების ნომერს (gclid ან _fbc/_fbp), მოვლენის სახეს და დროს. ასე რეკლამა იმათ ეჩვენება, ვისთვისაც უფრო სასარგებლოა. თქვენი თანხმობის გარეშე ასეთი მონაცემები არ გადაიცემა. თანხმობის გაუქმება cookie-ის პარამეტრებში შეგიძლიათ; უკვე გადაცემულ მონაცემებს Google და Meta საკუთარი წესებით ინახავენ.

> Если будем передавать и контакты (телефон, email) в зашифрованном виде (хэш) — Google «расширенные конверсии», Meta Conversions API — добавить: ru «…а также ваш телефон или email в зашифрованном виде (хэш), чтобы сервис сопоставил заявку с рекламным кликом»; en «…and your phone number or email in hashed form, so the service can match the enquiry to the ad click»; ka «…ასევე თქვენი ტელეფონი ან ელფოსტა დაშიფრული სახით (ჰეში), რომ სერვისმა განაცხადი სარეკლამო დაწკაპუნებას დაუკავშიროს». Это вопрос юристу (5.7).

---

## 3. praxenai.com — тексты (British English)

Право: UK GDPR и Data Protection Act 2018; PECR 2003 (SI 2003/2426), reg. 6; изменения из Data (Use and Access) Act 2025, s. 112 и Sch. 12 (новое приложение A1 к PECR), по данным legislation.gov.uk в силе с 05.02.2026 (SI 2026/82).
Опора по пунктам:
- информирование: UK GDPR Art. 13(1)(c)–(f), 13(2)(a), (c) — цель и основание, получатели, передача за рубеж, срок, право отозвать согласие;
- согласие: UK GDPR Art. 4(11), 6(1)(a), 7(3); PECR reg. 6(1)–(2) («clear and comprehensive information»);
- передача за пределы UK: UK GDPR Art. 44–46 (страна без adequacy regulations — нужны appropriate safeguards, например IDTA/Addendum, с оценкой рисков передачи). Для России adequacy regulations нет.

Грузия в тексте не упоминается.

### 3.1. Новый раздел (сразу после «What data we collect»)

**Where your enquiry came from**

1. If you click "Accept" in the cookie banner, your browser keeps a small record of the first and the last visit that came from a link or an ad: UTM tags, ad click IDs (such as gclid from Google Ads, fbclid from Meta and msclkid from Microsoft Ads), the domain of the site you came from and the page you landed on. It is kept in your browser's local storage for up to 90 days. From the previous site we keep only the domain (for example, google.com), never the full address.

2. With your consent we also read the _fbc and _fbp cookies that the Meta Pixel sets, so we can tell whether an enquiry came from a Facebook or Instagram ad.

3. The record stays in your browser and is not sent anywhere until you send an enquiry. It then reaches us with your enquiry, through the services listed in "Who receives it". We do not send it to Google, Meta or any other ad platform.

4. We use it to learn which channels and campaigns bring enquiries, so we spend our marketing budget where it works.

5. You can withdraw consent at any time: click "Decline" in the banner or change your choice in the cookie settings below. The record is deleted from your browser straight away and no new one is made. If you have already sent an enquiry, email us and we will delete its source details.

> Допущение Б1: без «Accept» браузер ничего об источнике не хранит, заявка уходит без источника (кроме страницы, с которой отправлена).
> Допущение Б2: на .com yclid в Яндекс не уходит (секрета `YM_OFFLINE_TOKEN` на воркере .com нет — проверить разработчику). Яндекс в тексте .com не упоминается.
> Фраза «We do not send it to Google, Meta…» верна до запуска офлайн-конверсий; в день запуска её заменяет текст из 3.4.

### 3.2. Правки в существующих разделах .com

**«What data we collect», абзац 1** — заменить на:
> From the enquiry form: your contact details (email, phone or WhatsApp), the options you choose, your message and the page you sent it from. If you accepted cookies, also where your visits came from (see "Where your enquiry came from").

**«Why and on what basis»** — добавить пункт после строки про Google Analytics:
> To learn which channels bring enquiries (the record described in "Where your enquiry came from"): your consent (Art. 6(1)(a) and regulation 6 of the Privacy and Electronic Communications Regulations), which you can withdraw at any time in the cookie settings.

**«Who receives it», первое предложение** — текст зависит от решения владельца по amoCRM (раздел 1):

- Вариант А (заявки .com в amoCRM не уходят) — рекомендуемый:
  > Enquiries, together with their source where you consented, reach us by email (sent through Resend) and through our Telegram notification bot.
- Вариант Б (другая CRM, например Kommo) — после проверки, где она хранит данные:
  > Enquiries, together with their source where you consented, reach us by email (sent through Resend) and through our Telegram notification bot, and are stored in our CRM ([название], data stored in [страна/регион]).
- Вариант В (amoCRM.ru остаётся — только если юрист подтвердит законность передачи):
  > Enquiries, together with their source where you consented, reach us by email (sent through Resend) and through our Telegram notification bot, and are stored in our CRM, amoCRM, provided by amoCRM LLC in Russia, where the data is stored. The UK has not found Russia's data protection adequate, so we rely on [the International Data Transfer Agreement] for this transfer.

Второй абзац раздела (передача за пределы UK, IDTA) — без изменений.

**«How long we keep it»** — заменить на (срок 3 года — для всех копий заявки, подтверждено владельцем):
> Enquiry data, including its source, is kept for up to 3 years after our last contact, or until you ask us to delete it. This applies to every copy of the enquiry, including the ones in our email and Telegram notifications and in our CRM. The source record in your browser is kept for up to 90 days, or until you click "Decline".

Если выбран вариант А (заявки .com в CRM не уходят), слова «and in our CRM» убрать.

### 3.3. Плашка cookie .com (разрешено владельцем)

`components/analytics.tsx`, `bannerCopy.en` при `isIntl`, первый элемент. Сейчас:
> We use Google Analytics to learn which pages are useful. Advertising cookies load only with your consent.

Предлагается:
> We use Google Analytics to learn which pages are useful. If you click Accept, we also load advertising cookies and remember which link or ad brought you here, so we can see where enquiries come from.

Кнопки «Accept» / «Decline» и ссылка «Learn more» — без изменений. Основа: PECR reg. 6(2) (ясная и полная информация до согласия), UK GDPR Art. 4(11) (информированное согласие). После запуска офлайн-конверсий (3.4) добавить: «…and tell Google and Meta when an enquiry came from their ad».

### 3.4. На будущее: передача в Google Ads и Meta (включить в день запуска, не раньше)

Только по заявкам с «Accept». Основание — согласие (UK GDPR Art. 6(1)(a)); Google и Meta получают данные как самостоятельные контролёры или обработчики — по их условиям (сверить юристу, 5.7).

Заменить пункт 3 раздела «Where your enquiry came from» на:
> The record stays in your browser and is not sent anywhere until you send an enquiry. It then reaches us with your enquiry, through the services listed in "Who receives it". If you clicked "Accept", we also tell Google Ads and Meta that an enquiry came from their ad click: the click ID (gclid, or Meta's _fbc and _fbp), the type of event and the time. This helps us measure our ads and show them to people who will find them useful. Without your consent no such data is sent. You can withdraw consent in the cookie settings; data already sent is kept by Google and Meta under their own terms.

И в «Who receives it» после фразы «Meta receives data only after your consent» добавить:
> With your consent, Google Ads and Meta are also told when an enquiry came from their ad, as described in "Where your enquiry came from". Google and Meta may process this data in the United States.

> При передаче зашифрованных контактов (хэш email/телефона; Google enhanced conversions for leads, Meta Conversions API) добавить: «…and, in hashed form, the email address or phone number you gave us, so they can match the enquiry to the click.» Вопрос юристу 5.7.

---

## 4. Что нужно от владельца

**Решить:**
1. **CRM для .com** — вариант А (не отправлять заявки .com в amoCRM), Б (отдельная CRM, например Kommo) или В (оставить amoCRM.ru, только после заключения юриста). Рекомендую А сейчас, Б — когда пойдёт поток заявок из Великобритании.
2. **Плашка .ge** — добавлять ли фразу «запоминаем, по какой ссылке вы пришли» (по желанию).
3. **Офлайн-конверсии:** будем ли передавать в Google и Meta контакты в зашифрованном виде или только номер клика. От этого зависит текст 2.4 и 3.4.

Закрыто: копии заявок в Telegram и на почте удаляются через 3 года, как в amoCRM (ответ владельца); тексты 2.3 и 3.2 это прямо указывают.

**Дать данные:**
4. Идентификационный код ИП (для реквизитов на .ge) и написание имени по выписке из реестра — на русском и грузинском.
5. Точное наименование компании amoCRM из договора или счёта (в черновике — ООО «amoCRM»).

Проверит разработчик (вам решать не нужно): уходят ли сейчас заявки .com в amoCRM (если да — риск уже есть); поведение «Отклонить» на .ge (А1); что .com без согласия ничего не хранит (Б1); нет ли выгрузки yclid с .com (Б2).

---

## 5. Вопросы юристу (человеку)

**5.1. PECR и исключения из Data (Use and Access) Act 2025 (.com).**
По legislation.gov.uk s. 112 и Sch. 12 DUAA (приложение A1 к PECR) в силе с 05.02.2026 (SI 2026/82; название постановления сверить).
- Подпадает ли хранение в localStorage первого/последнего источника (UTM, click ID, домен-реферер, страница входа) на 90 дней под исключение «статистические цели» — или это маркетинговое измерение рекламы вне исключений? Рабочее допущение: вне исключений, поэтому на .com — согласие.
- «Strictly necessary» — допущение: не подходит, до отправки заявки пользователь услугу не запрашивает.
- Если метки текущего визита берутся из адреса страницы и уходят с заявкой без записи на устройство — это вне reg. 6 PECR; достаточно ли Art. 6(1)(f) UK GDPR?
- При отзыве согласия после заявки: удалять ли поля источника в CRM (Art. 7(3), 17(1)(b)) или хранение можно основать на Art. 6(1)(f)? В черновике — удаляем по запросу.
- Финальное руководство ICO по новым исключениям (источники упоминают 29.04.2026) — что оно говорит об атрибуции рекламы.

**5.2. Достаточно ли законного интереса для .ge.**
Закон Грузии № 3144, ст. 5(1) (сверить подпункт и слова «существенный интерес»).
- Достаточно ли его для записи в браузер до выбора в плашке (сейчас .ge пишет сразу, «Отклонить» удаляет)?
- Есть ли в грузинском праве аналог правил ePrivacy/PECR о записи на устройство (например, в Законе «Об электронных коммуникациях» или разъяснениях Службы защиты персональных данных)? Допущение: нет.
- Нужна ли письменная оценка баланса интересов (для .com есть по холодным письмам — `docs/LIA-OUTBOUND-UK.md`; для .ge нет).
- Посетители .ge из Казахстана, Узбекистана, Армении, Азербайджана (реклама Meta и Директа): учитывать ли их законы (Закон РК № 94-V «О персональных данных и их защите»; Закон РУз № ЗРУ-547 с требованием локализации)?

**5.3. 152-ФЗ (условный вопрос).** По текущему плану реклама Директа на Россию не планируется; владелец явно не подтвердил. Если появится:
- распространяется ли 152-ФЗ на иностранного ИП с русскоязычным сайтом и рекламой в РФ;
- если да — локализация (ст. 18 ч. 5; ужесточение с 01.07.2025 — по моим данным 23-ФЗ от 28.02.2025, сверить), согласие отдельным документом (с 01.09.2025 — по моим данным 156-ФЗ от 24.06.2025, сверить), уведомление Роскомнадзора (ст. 22), трансграничная передача (ст. 12); считаются ли yclid / UTM / cookie персональными данными.
- Отдельно, уже сейчас: amoCRM.ru и Яндекс обрабатывают данные заявок в России по поручению иностранного оператора — возникают ли из этого обязанности у ИП по 152-ФЗ (ст. 6 ч. 3–4, поручение обработки)? Допущение: нет, но проверить.

**5.4. GA4 до согласия на .com — риск по PECR.**
По решению владельца от 24.10.2026 GA4 грузится до выбора в плашке (Google signals и рекламная персонализация выключены до «Accept»; «Decline» останавливает GA4).
- Подпадают ли `_ga`, `_ga_*` под исключение «статистические цели» Sch. A1 PECR, если Google — сторонний сервис, для части обработки возможно самостоятельный контролёр, а данные уходят в США?
- Выполнены ли условия: ясная информация (плашка, политика) и простой бесплатный способ возразить («Decline», настройки)?
- Политика .com называет данные GA «anonymous usage data»; по UK GDPR client ID — скорее псевдонимные персональные данные. Сменить формулировку? То же — «обезличенные» на .ge.
- Размер риска: штрафы по PECR после DUAA подняты до уровня UK GDPR (до £17,5 млн или 4 % оборота — по вторичным источникам, сверить).

**5.5. Передача в Россию (amoCRM.ru, Яндекс) — подтверждено владельцем, что amoCRM российский.**
- **.com:** возможно ли законно передавать данные британских клиентов в amoCRM.ru (UK GDPR Art. 44–46): реально ли IDTA/Addendum с amoCRM и оценка рисков передачи при российском законодательстве о доступе государства к данным? Есть ли санкционные ограничения (UK sanctions regime в отношении России) на использование российского облачного сервиса? Нужно ли уведомить ICO или клиентов о прошлых передачах, если заявки .com уже уходили в amoCRM?
- **.ge:** допустима ли по Закону № 3144 передача данных заявок в Россию (amoCRM) и номеров кликов в Яндекс Метрику: входит ли Россия в перечень стран с надлежащим уровнем защиты Службы защиты персональных данных; нужны ли договорные гарантии или разрешение Службы? Достаточно ли раскрытия в политике (текст 2.3)?
- Договор обработки с amoCRM: подходит ли стандартная оферта amoCRM как договор с обработчиком по Закону № 3144 и UK GDPR Art. 28?
- Resend (США): достаточно ли UK Extension to the EU–US Data Privacy Framework (если Resend сертифицирован) или нужен IDTA? Telegram: роль (контролёр/обработчик), место хранения сообщений бота.

**5.6. Представитель в UK (.com).** Контролёр .com — ИП вне UK, сайт ориентирован на UK. Нужен ли представитель по UK GDPR Art. 27, или подходит исключение Art. 27(2)(a) для эпизодической обработки?

**5.7. Будущая передача в Google Ads и Meta (офлайн-конверсии, Conversions API).**
- Достаточно ли согласия из плашки cookie («Accept» — про рекламные cookie) как согласия на серверную передачу данных заявки в Google и Meta, или нужно отдельное согласие в форме заявки? Для .com: UK GDPR Art. 6(1)(a), 7; для .ge: Закон № 3144, ст. 5(1).
- Роли сторон: Google и Meta — самостоятельные контролёры или обработчики (условия Google Ads Data Processing Terms / Customer Match, Meta Business Tools Terms); нужен ли совместный контроль (joint controllership)?
- Передача зашифрованных email/телефона (хэш): остаются ли это персональными данными (по UK GDPR — да, псевдонимизация), что обязательно сказать в политике и плашке.
- Передача в США: на чём основана (UK Extension to DPF для Google и Meta, если сертифицированы).

---

## 6. Источники

- PECR 2003, reg. 6 и приложение A1 (в ред. DUAA 2025): [legislation.gov.uk — DUAA 2025, Schedule 12](https://www.legislation.gov.uk/ukpga/2025/18/schedule/12), [Schedule 12 as enacted](https://www.legislation.gov.uk/ukpga/2025/18/schedule/12/enacted).
- Сводка изменений DUAA от ICO: [ico.org.uk — DUAA summary of the changes](https://ico.org.uk/about-the-ico/what-we-do/legislation-we-cover/data-use-and-access-act-2025/the-data-use-and-access-act-2025-duaa-summary-of-the-changes/schedules/).
- Вторичные обзоры о дате вступления в силу (05.02.2026) и исключениях (неофициальные, сверить): [bratby.law](https://bratby.law/data-use-and-access-act-2025-commencement/), [policypros.co.uk](https://www.policypros.co.uk/cookie-consent-changes-duaa-guide/), [kukie.io](https://kukie.io/blog/uk-data-use-and-access-act).
- Закон Грузии «О защите персональных данных» № 3144 от 14.06.2023: [matsne.gov.ge, документ 5827307](https://matsne.gov.ge/en/document/view/5827307); обзоры: [Law Over Borders — Georgia](https://www.globallegalpost.com/lawoverborders/data-protection-law-guide-1072382791/georgia-273882423), [KPMG Georgia — Personal Data Guide](https://assets.kpmg.com/content/dam/kpmg/ge/pdf/2023/12/Personal-Data-Guide-ENG.pdf).
- UK GDPR Art. 44–46 (передача за рубеж), Art. 27 (представитель) — текст UK GDPR на legislation.gov.uk; отсутствие adequacy regulations для России — сверить по актуальному перечню UK adequacy regulations на gov.uk / ico.org.uk.
- Код (что делает сайт): `lib/lead-attribution.mjs`, `components/analytics.tsx`, `lib/lead-delivery.mjs`, `lib/metrika-offline.mjs`; реквизиты — `lib/intl.ts` (`legalEntity`), `lib/contacts.ts`; решение 24.10 о GA4 — `docs/HANDOFF.md`.

Грузинские тексты (раздел 2) — на вычитку носителю (команда владельца).
