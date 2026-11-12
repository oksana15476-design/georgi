# Политики конфиденциальности: дополнение «учёт источника заявки» — ЧЕРНОВИК

**Статус: на проверку юристу.** Составитель — агент `praxen-legal` (не юрист). Версия 3 от 12.11.2026 (финальные тексты для вставки по решениям владельца от 12.11). Версия 2.1 — 12.11.2026, версия 1 — 11.11.2026.
В файлы сайта ничего не внесено. Публиковать только после «да» владельца и проверки юристом (опубликованные политики без согласия владельца не меняем). Для .com — дополнительно после письменного заключения живого юриста по передаче в Россию (раздел 6.1).

Решения владельца от 12.11, учтённые в версии 3:
1. .com — заявки по-прежнему уходят в amoCRM (amocrm.ru, Россия). Выбран вариант «оставить amoCRM» (бывший вариант В). Передача в Россию описана в политике .com прямо. Это решение владельца вопреки рекомендации составителя (варианты А/Б), см. 6.1.
2. Передачу заявок в Google Ads / Meta (офлайн-конверсии) в политиках пока не упоминаем. Тексты убраны из вставки и лежат в приложении (раздел 4).
3. Плашка cookie .ge — без изменений. Плашка .com — добавляется фраза об учёте источника после «Accept».
4. Реквизиты .ge — без идентификационного кода: ИП, адрес, почта (как в условиях .com).
5. Копии заявок в Telegram и на почте удаляются через 3 года, как в amoCRM.
6. Реклама Директа на Россию не планируется (вопрос о 152-ФЗ закрыт, кроме одного остаточного пункта 6.4).

---

## 1. Коротко для владельца

- **.ge:** браузер запоминает, откуда человек пришёл (до 90 дней), пока он не нажмёт «Отклонить». С заявкой это приходит вам. В политике появляются реквизиты ИП, раздел об источнике заявки и прямое указание, что amoCRM и Яндекс — российские сервисы.
- **.com:** запоминание в браузере — только после «Accept». Без согласия с заявкой уходит только источник текущего захода (ничего не записывается в браузер). В политике прямо сказано, что CRM — amoCRM в России и что Великобритания не признаёт Россию страной с надёжной защитой данных.
- **Риск по .com остаётся.** По британским правилам для такой передачи нужен договор IDTA с amoCRM или узкое исключение. Договора, скорее всего, нет; исключение для постоянной передачи всех заявок слабое. Поэтому для .com подготовлены два варианта одного абзаца (В1 — если договор есть, В2 — если нет), и нужно заключение живого юриста до публикации.
- **До публикации разработчик должен исправить одну вещь в коде** (раздел 2, пункт 3): после «Отклонить» метки Meta (_fbc, _fbp) из старого согласия всё ещё уходят с заявкой. Иначе фраза политики «только с вашего согласия» будет неверной.

---

## 2. Сверка с кодом (components/analytics.tsx)

Проверено по коду 12.11.2026: `storeAllowed` (стр. 61), `rememberAttribution` (стр. 103–119), `setConsent` (стр. 134–139), `leadAttribution` (стр. 98–101), `forgetAttribution` (стр. 62–64).

1. **Допущение А1 (.ge) — подтверждено.** `storeAllowed` = выбор не «denied» (на .ge `isIntl` = false). Запись в `localStorage` (`praxen_source`) идёт сразу, при «не выбрано» и после «Принять». «Отклонить» → `setConsent('denied')` → `forgetAttribution()` удаляет запись; дальше `saveAttribution` и `loadStored` ничего не пишут и не читают. Оговорка: кнопка «Настройки cookie» на странице политики вызывает `setConsent('unset')`, и на .ge запись снова начинает вестись. В тексте это учтено словами «пока вы не измените выбор».
2. **Допущение Б1 (.com) — подтверждено с уточнением.** На .com `storeAllowed` = только «granted»: запись в браузер — только после «Accept». «Decline» и «Cookie settings» (сброс выбора) запись удаляют. **Уточнение:** источник текущего захода (метки UTM и номера кликов из адреса, домен предыдущего сайта, страница входа) всегда держится в памяти страницы (`memory`) и уходит с заявкой через `leadAttribution()` при любом выборе, в том числе на .com без согласия и на .ge после «Отклонить». В браузер он при этом не записывается. С заявкой уходит и сам выбор по cookie (поле `consent`). Тексты ниже это описывают.
3. **Расхождение, которое нужно исправить до публикации.** `leadAttribution()` читает cookie `_fbc` и `_fbp` без проверки согласия. Их ставит пиксель Meta, а он грузится только после «Принять». Но если человек сначала принял, а потом отклонил, эти cookie остаются в браузере (`forgetAttribution` их не удаляет) и продолжают уходить с заявкой. Политика говорит «только с вашего согласия». Решение для разработчика: читать `_fbc`/`_fbp` только при согласии «granted» (через спецификацию, как положено). Если не исправить — текст про _fbc/_fbp придётся переписать.
4. **Яндекс (.ge).** Номер клика Яндекса (yclid) из текущего захода сервер отправляет в Метрику (`lib/metrika-offline.mjs`) и после «Отклонить»: проверки согласия там нет. Действующая политика .ge не обещает, что «Отклонить» это останавливает, так что противоречия нет. Допустимость — вопрос юристу (6.2).
5. Мелочи без влияния на тексты: название кампании (utm_campaign) хранится ещё и в памяти вкладки (`sessionStorage`, до закрытия вкладки) для текста сообщения в WhatsApp, по тем же правилам согласия. Комментарий в `lib/lead-attribution.mjs` (стр. 3: «on praxenai.com only after the visitor accepts cookies») неточен: после «Accept» включается только запись в браузер, источник текущего захода уходит всегда.

---

## 3. Финальные тексты для вставки

Общие правила вставки: в .ge строки идут в функцию `c('ru','en','ka')`; в английском тексте внутри строк — типографские кавычки “ ” и апостроф ’ (как в существующих текстах), чтобы не ломать одинарные кавычки JS. Грузинский — на вычитку носителю (команда владельца). Ссылок на статьи закона в публичном тексте .ge нет (стиль страницы); в .com статьи UK GDPR указаны, как в действующей политике.

### 3.1. praxenai.ge — `components/praxen/privacy.tsx` (массив `blocks`)

Право: Закон Грузии «О защите персональных данных» № 3144 от 14.06.2023, в силе с 01.03.2024 (matsne.gov.ge, документ 5827307). Информирование (кто, цель, основание, получатели, срок, права) — гл. III, ст. 13–14 (номера сверить по matsne); законный интерес — ст. 5(1) (подпункт сверить); передача за рубеж — глава закона о передаче данных в другое государство (статью сверить).

**(1) Блок «Кто обрабатывает данные», абзац 1** — заменить всю строку (стр. 15) на:

```
c('Оператор данных — индивидуальный предприниматель Евгений Будников, зарегистрированный в Грузии; Praxen AI — его торговое название. Адрес: Грузия, Батуми, ул. Нижарадзе, 9, кв. 124. По вопросам о данных пишите на ','The data controller is Individual Entrepreneur Evgenii Budnikov, registered in Georgia; Praxen AI is his trading name. Address: 9 Nizharadze Street, Apartment 124, Batumi, Georgia. For any data question, email ','მონაცემთა დამმუშავებელია საქართველოში რეგისტრირებული ინდივიდუალური მეწარმე ევგენი ბუდნიკოვი; Praxen AI მისი სავაჭრო სახელია. მისამართი: საქართველო, ბათუმი, ნიჟარაძის ქ. 9, ბინა 124. მონაცემებთან დაკავშირებით მოგვწერეთ ')+contacts.email+c(', в Telegram или звоните: ',', message us on Telegram or call: ','-ზე, Telegram-ში ან დაგვირეკეთ: ')+contacts.phoneLabel+'.',
```

Данные: `legalEntity` в `lib/intl.ts` (как в условиях .com), почта .ge — `contacts.email` (hello@praxenai.ge). Абзац 2 («Мы соблюдаем Закон Грузии…») — без изменений.

**(2) Блок «Какие данные мы получаем», абзац 1** — заменить строку (стр. 18) на:

```
c('Из формы заявки: контакт (WhatsApp, Telegram или телефон), выбранные варианты, текст задачи, страница, с которой отправлена заявка, и источник перехода (подробнее — в разделе «Как мы узнаём, откуда пришла заявка»).','From the enquiry form: your contact (WhatsApp, Telegram or phone), the options you chose, your message, the page you sent it from and the traffic source (see “How we know where an enquiry came from”).','განაცხადის ფორმიდან: კონტაქტი (WhatsApp, Telegram ან ტელეფონი), არჩეული ვარიანტები, ამოცანის ტექსტი, გვერდი, საიდანაც გაიგზავნა, და გადმოსვლის წყარო (დაწვრილებით — განყოფილებაში „როგორ ვიგებთ, საიდან მოვიდა განაცხადი“).'),
```

Абзац 2 — без изменений.

**(3) Новый блок** — вставить в массив `blocks` сразу после блока «Какие данные мы получаем» (перед блоком «Зачем»):

```
[c('Как мы узнаём, откуда пришла заявка','How we know where an enquiry came from','როგორ ვიგებთ, საიდან მოვიდა განაცხადი'),[
 c('Когда вы заходите на сайт, браузер запоминает на вашем устройстве ваш первый заход и последний заход по ссылке или рекламе: метки UTM, номер рекламного клика (gclid, fbclid, yclid, msclkid), домен сайта, с которого вы пришли, и страницу входа. Запись хранится в памяти браузера (localStorage) до 90 дней. С предыдущего сайта сохраняется только домен (например, google.com), без адреса страницы.','When you visit the site, your browser remembers on your device your first visit and your last visit from a link or an ad: UTM tags, the ad click number (gclid, fbclid, yclid, msclkid), the domain of the site you came from and the page you landed on. The record is kept in your browser’s storage (localStorage) for up to 90 days. From the previous site we keep only the domain (for example, google.com), not the page address.','როცა საიტზე შემოდიხართ, ბრაუზერი თქვენს მოწყობილობაზე იმახსოვრებს თქვენს პირველ ვიზიტს და ბოლო ვიზიტს ბმულით ან რეკლამიდან: UTM ნიშნებს, სარეკლამო დაწკაპუნების ნომერს (gclid, fbclid, yclid, msclkid), იმ საიტის დომენს, საიდანაც მოხვედით, და შესვლის გვერდს. ჩანაწერი ბრაუზერის მეხსიერებაში (localStorage) ინახება 90 დღემდე. წინა საიტიდან ვინახავთ მხოლოდ დომენს (მაგალითად, google.com), გვერდის მისამართის გარეშე.'),
 c('Пока вы не отправили заявку, запись остаётся в вашем браузере и никуда не передаётся. Вместе с заявкой она приходит нам в Telegram, на почту и в amoCRM, как и ваш выбор в плашке cookie. Если вы дали согласие на рекламные cookie, к заявке добавляются также cookie Meta _fbc и _fbp: по ним видно, что заявка пришла с рекламы в Facebook или Instagram.','Until you send an enquiry, the record stays in your browser and goes nowhere. With an enquiry, it reaches us via Telegram, email and amoCRM, together with your cookie choice. If you accepted advertising cookies, the enquiry also carries Meta’s _fbc and _fbp cookies, which show that it came from a Facebook or Instagram ad.','სანამ განაცხადს არ გაგზავნით, ჩანაწერი თქვენს ბრაუზერში რჩება და არსად გადაიცემა. განაცხადთან ერთად ის გვეგზავნება Telegram-ში, ელფოსტაზე და amoCRM-ში, cookie-ის ფანჯარაში თქვენს არჩევანთან ერთად. თუ სარეკლამო cookie-ებზე თანხმობა მოგვეცით, განაცხადს ემატება Meta-ს cookie-ები _fbc და _fbp: მათით ჩანს, რომ განაცხადი Facebook-ის ან Instagram-ის რეკლამიდან მოვიდა.'),
 c('Зачем: понимать, какие каналы и объявления приводят заявки, и не тратить бюджет на те, что не работают. Основание — наш законный интерес. В записи нет ваших контактов, а с вами она связывается, только когда вы сами отправляете заявку.','Why: to see which channels and ads bring enquiries and stop spending on those that do not. The basis is our legitimate interest. The record holds none of your contact details, and it is linked to you only when you send an enquiry yourself.','რისთვის: რომ გავიგოთ, რომელი არხები და რეკლამები მოაქვს განაცხადებს, და ბიუჯეტი არ დავხარჯოთ იმაზე, რაც არ მუშაობს. საფუძველია ჩვენი კანონიერი ინტერესი. ჩანაწერში თქვენი კონტაქტები არ არის, თქვენთან კი ის მხოლოდ მაშინ კავშირდება, როცა განაცხადს თავად გაგზავნით.'),
 c('Отказаться можно в любой момент: нажмите «Отклонить» в плашке cookie или «Настройки cookie» ниже, а затем «Отклонить». Запись удалится из браузера, и новые сохраняться не будут, пока вы не измените выбор. Заявка, отправленная после этого, придёт только с источником текущего захода (метки из адреса страницы и домен предыдущего сайта), без записи в браузер. Источник уже отправленной заявки удалим по вашему запросу.','You can opt out at any time: press “Decline” in the cookie banner, or “Cookie settings” below and then “Decline”. The record is deleted from your browser, and no new one is kept unless you change your choice. An enquiry sent after that carries only the source of the current visit (the tags in the page address and the domain of the previous site), without anything being saved in your browser. If you ask, we will delete the source of an enquiry you have already sent.','უარის თქმა ნებისმიერ დროს შეგიძლიათ: დააჭირეთ „უარი“ cookie-ის ფანჯარაში ან ქვემოთ „cookie-ის პარამეტრებს“, შემდეგ კი „უარი“. ჩანაწერი ბრაუზერიდან წაიშლება და ახალი აღარ შეინახება, სანამ არჩევანს არ შეცვლით. ამის შემდეგ გაგზავნილ განაცხადს მხოლოდ მიმდინარე ვიზიტის წყარო ახლავს (გვერდის მისამართის ნიშნები და წინა საიტის დომენი), ბრაუზერში ჩაწერის გარეშე. უკვე გაგზავნილი განაცხადის წყაროს თქვენი მოთხოვნით წავშლით.')]],
```

Условие точности абзаца 2: исправление из раздела 2, пункт 3 (_fbc/_fbp только при согласии).

**(4) Блок «Кому передаются данные»** — заменить оба абзаца (стр. 24–25) на:

```
c('Заявки вместе с их источником доставляются нам через Telegram и электронную почту и хранятся в CRM-системе amoCRM. amoCRM — российский сервис, данные в нём хранятся на серверах в России. Запись на звонок (имя, email, выбранное время) обрабатывает сервис Cal.com. Сайт размещён у хостинг-провайдера.','Enquiries, together with their source, reach us via Telegram and email and are stored in the amoCRM system. amoCRM is a Russian service, and the data in it is stored on servers in Russia. Call bookings (name, email, chosen time) are handled by Cal.com. The site runs on a hosting provider.','განაცხადები მათ წყაროსთან ერთად გვეგზავნება Telegram-ითა და ელფოსტით და ინახება amoCRM სისტემაში. amoCRM რუსული სერვისია, მასში მონაცემები რუსეთში მდებარე სერვერებზე ინახება. ზარის ჯავშანს (სახელი, ელფოსტა, არჩეული დრო) ამუშავებს სერვისი Cal.com. საიტი განთავსებულია ჰოსტინგ-პროვაიდერთან.'),
c('Google и Яндекс получают обезличенные данные о посещении для аналитики. Если вы пришли по рекламе Яндекса и оставили заявку, Яндекс получает только факт заявки и номер рекламного клика, без ваших контактов. Яндекс — российская компания, эти данные обрабатываются на её серверах, в том числе в России. Рекламные сервисы (Meta, Google Ads) получают данные только после вашего согласия. Мы не продаём данные третьим лицам.','Google and Yandex receive anonymous usage data for analytics. If you came from a Yandex ad and sent an enquiry, Yandex receives only the fact of the enquiry and the ad click number, never your contact details. Yandex is a Russian company, and this data is processed on its servers, including in Russia. Ad services (Meta, Google Ads) receive data only after your consent. We never sell data to third parties.','Google და Yandex ანალიტიკისთვის ვიზიტის ანონიმურ მონაცემებს იღებენ. თუ Yandex-ის რეკლამიდან მოხვედით და განაცხადი დატოვეთ, Yandex იღებს მხოლოდ განაცხადის ფაქტს და სარეკლამო დაწკაპუნების ნომერს, თქვენი კონტაქტების გარეშე. Yandex რუსული კომპანიაა და ეს მონაცემები მის სერვერებზე, მათ შორის რუსეთში, მუშავდება. სარეკლამო სერვისები (Meta, Google Ads) მონაცემებს მხოლოდ თქვენი თანხმობის შემდეგ იღებენ. მონაცემებს მესამე პირებს არ ვყიდით.')
```

Изменено против действующего текста: первое предложение абзаца 1, новое второе предложение абзаца 1, новое третье предложение абзаца 2. Остальное — дословно как сейчас. Сверить: место хранения у amoCRM.ru — по оферте amoCRM; у Яндекса — по документам Яндекса (допущение: «в том числе в России»).

**(5) Блок «Сколько храним»** — заменить единственный абзац (стр. 27) на два:

```
c('Данные заявки вместе с её источником — до 3 лет после последнего контакта или до вашего запроса на удаление. Это касается всех копий заявки: в amoCRM, в Telegram и на почте.','Enquiry data, including its source, is kept for up to 3 years after our last contact, or until you ask us to delete it. This applies to every copy of the enquiry: in amoCRM, in Telegram and in our email.','განაცხადის მონაცემები მის წყაროსთან ერთად ინახება ბოლო კონტაქტიდან 3 წლამდე ან წაშლის მოთხოვნამდე. ეს ეხება განაცხადის ყველა ასლს: amoCRM-ში, Telegram-სა და ელფოსტაში.'),
c('Запись об источнике хранится в вашем браузере до 90 дней или до нажатия «Отклонить».','The source record stays in your browser for up to 90 days, or until you press “Decline”.','წყაროს ჩანაწერი თქვენს ბრაუზერში ინახება 90 დღემდე ან „უარზე“ დაჭერამდე.')
```

**(6) Дата:** `const updated='2026-10-24'` (стр. 9) — заменить на дату публикации.

Блоки «Зачем», «Ваши права», «Cookie», вводный абзац и плашка cookie .ge — без изменений.

### 3.2. praxenai.com — `components/intl/blocks.tsx`, функция `Doc`, объект `docs.privacy`

Право: UK GDPR и Data Protection Act 2018; PECR 2003 (SI 2003/2426) reg. 6 в ред. Data (Use and Access) Act 2025, s. 112 и Sch. 12 (по legislation.gov.uk в силе с 05.02.2026). Информирование — UK GDPR Art. 13(1)(c)–(f), 13(2)(a), (c); согласие — Art. 4(11), 6(1)(a), 7(3), PECR reg. 6(2); законный интерес — Art. 6(1)(f); передача в Россию — Art. 44–46, 49 (adequacy regulations для России нет). Грузия в добавленных текстах не упоминается.

**(1) Раздел `'What data we collect'`, абзац 1** (стр. 744, первая строка массива) — заменить на:

```
'From the enquiry form: your contact details (email, phone or WhatsApp), the options you choose, your message and the page you sent it from. Also the source of your visit and your cookie choice (see “Where your enquiry came from”).',
```

Остальные абзацы раздела — без изменений.

**(2) Новый раздел** — вставить в массив `privacy` сразу после раздела `'What data we collect'` (перед `'Business contacts we email first (B2B outreach)'`):

```
['Where your enquiry came from',['When you send an enquiry, it carries the source of your current visit: UTM tags and ad click IDs from the page address (such as gclid from Google Ads, fbclid from Meta and msclkid from Microsoft Ads), the domain of the site you came from and the page you landed on. From the previous site we take only the domain (for example, google.com), never the full address. Without your consent, this is held only in the page’s memory while you browse and is not saved on your device.',
 'If you click “Accept” in the cookie banner, your browser also keeps a record of your first visit and of your last visit from a link or an ad, with the same details, in its local storage for up to 90 days. This lets us see where an enquiry came from even if you send it on a later visit.',
 'With your consent we also read the _fbc and _fbp cookies that the Meta Pixel sets, which show whether an enquiry came from a Facebook or Instagram ad.',
 'None of this contains your contact details, and it is not sent anywhere until you send an enquiry. It then reaches us with your enquiry, together with your cookie choice, through the services listed in “Who receives it”.',
 'We use it to learn which channels and campaigns bring enquiries, so we spend our marketing budget where it works.',
 'You can withdraw consent at any time: click “Cookie settings” below and choose “Decline”. The record is deleted from your browser straight away and no new one is made. If you have already sent an enquiry, email '+contacts.email+' and we will delete its source details.']],
```

Условие точности абзаца 3: исправление из раздела 2, пункт 3.

**(3) Раздел `'Why and on what basis'`** — вставить новую строку сразу после строки про Google Analytics (вторая строка массива):

```
'To learn which channels bring enquiries (see “Where your enquiry came from”): for the record kept in your browser after you click “Accept”, your consent (Art. 6(1)(a) and regulation 6 of the Privacy and Electronic Communications Regulations), which you can withdraw at any time in the cookie settings; for the source of your current visit sent with your enquiry, our legitimate interests (Art. 6(1)(f)) in knowing which of our marketing works.',
```

**(4) Раздел `'Who receives it'`** — заменить весь массив абзацев (стр. 747) на три абзаца:

```
['Who receives it',['Enquiries, together with their source, reach us by email (sent through Resend) and through our Telegram notification bot, and are stored in our CRM. Call bookings are handled by Cal.com. Our emails, including outreach, are sent and stored through our email providers (Google and Resend). Google receives anonymous usage data for analytics; Meta receives data only after your consent. We never sell personal data.',
 'Our CRM is amoCRM, provided by a company in Russia. Enquiry data stored in it (your contact details, your message and the source of the enquiry) is kept on its servers in Russia, and we use it to manage and follow up enquiries. The UK has not made adequacy regulations for Russia: UK law does not treat Russia as protecting personal data to the UK standard, and Russian authorities may have wider powers to access data than UK authorities. [МЕХАНИЗМ: вставить В1 или В2]',
 'Our team and some other providers are also outside the UK. Apart from the CRM described above, where data leaves the UK we rely on the safeguards the UK GDPR provides, such as the International Data Transfer Agreement or adequacy regulations.']],
```

Вместо `[МЕХАНИЗМ…]` — ровно одна из двух фраз (выбор по факту, раздел 5, пункт 2):

- **В1 — только если договор IDTA (или UK Addendum к SCC) с amoCRM действительно подписан** (Art. 46(2)(d), 46(3); Art. 13(1)(f) — указать, как получить копию):
  ```
  We transfer this data under the International Data Transfer Agreement approved under the UK GDPR, which we have signed with the provider after assessing the risks of the transfer. You can ask us for a copy at '+contacts.email+'.
  ```
- **В2 — если договора нет (вероятный случай; только после заключения юриста, см. 6.1)** (Art. 49(1)(b); Art. 13(1)(f)):
  ```
  We have no UK transfer agreement with this provider. We send your enquiry to it because this is how we handle the enquiries you ask us to answer (UK GDPR Art. 49(1)(b)). If you do not want your details stored in Russia, do not use the form: email us at '+contacts.email+' instead, and we will handle your enquiry without our CRM.
  ```

Допущения: amoCRM.ru хранит данные в России (по сведениям координатора и требованиям 152-ФЗ о локализации; сверить по оферте amoCRM). Последнее предложение В2 — обещание владельца вести письма без amoCRM (подтвердить, раздел 5). Если договора нет и юрист не подтвердит В2, честного основания для публикации нет — см. 6.1.

**(5) Раздел `'How long we keep it'`** — заменить единственный абзац (стр. 748) на:

```
'Enquiry data, including its source, is kept for up to 3 years after our last contact, or until you ask us to delete it. This applies to every copy of the enquiry: in our CRM, our email and our Telegram notifications. The source record in your browser (kept only if you clicked “Accept”) stays for up to 90 days, or until you withdraw consent.'
```

**(6) Дата:** `privacyUpdatedLabel='21 October 2026'` в `lib/intl.ts` (стр. 32; выводится в подзаголовке страницы /privacy) — заменить на дату публикации.

Разделы `'Who we are'`, `'Business contacts we email first'`, `'Your rights'`, блок «Cookies» — без изменений.

### 3.3. Плашка cookie praxenai.com — `components/analytics.tsx`, `bannerCopy.en`, ветка `isIntl` (стр. 185), первый элемент массива

Сейчас:
```
'We use Google Analytics to learn which pages are useful. Advertising cookies load only with your consent.'
```
Заменить на:
```
'We use Google Analytics to learn which pages are useful. If you click Accept, we also load advertising cookies and remember which link or ad brought you here, so we can see where enquiries come from.'
```

Кнопки «Accept» / «Decline», ссылка «Learn more», ветка не-`isIntl` (английская плашка .ge) и плашки ru/ka — без изменений. Основа: PECR reg. 6(2) (ясная и полная информация до согласия), UK GDPR Art. 4(11).

---

## 4. Приложение «на будущее»: передача заявок в Google Ads и Meta

**Не вставлять** (решение владельца 12.11: в политиках пока не упоминаем). Включить только в день запуска офлайн-конверсий и после ответа юриста на 6.5. Условие проекта: отправляем только заявки посетителей, нажавших «Принять»; основание — согласие (.ge: Закон № 3144, ст. 5(1); .com: UK GDPR Art. 6(1)(a)).

**.ge** — новый абзац в блоке «Как мы узнаём, откуда пришла заявка» после абзаца 2:
- ru: Если вы нажали «Принять» и отправили заявку, мы сообщаем Google Ads и Meta, что по их рекламному клику пришла заявка: номер клика (gclid или _fbc/_fbp), вид события и время. Так реклама показывается тем, кому она полезнее. Без вашего согласия такие данные не передаются. Отозвать согласие можно в настройках cookie; уже переданные данные Google и Meta хранят по своим правилам.
- en: If you clicked “Accept” and sent an enquiry, we tell Google Ads and Meta that an enquiry came from their ad click: the click number (gclid or _fbc/_fbp), the type of event and the time. This helps show ads to people who will find them useful. Without your consent no such data is sent. You can withdraw consent in the cookie settings; data already sent is kept by Google and Meta under their own rules.
- ka: თუ დააჭირეთ „თანხმობას“ და განაცხადი გაგზავნეთ, Google Ads-სა და Meta-ს ვატყობინებთ, რომ მათი სარეკლამო დაწკაპუნებიდან განაცხადი მოვიდა: დაწკაპუნების ნომერს (gclid ან _fbc/_fbp), მოვლენის სახეს და დროს. ასე რეკლამა იმათ ეჩვენება, ვისთვისაც უფრო სასარგებლოა. თქვენი თანხმობის გარეშე ასეთი მონაცემები არ გადაიცემა. თანხმობის გაუქმება cookie-ის პარამეტრებში შეგიძლიათ; უკვე გადაცემულ მონაცემებს Google და Meta საკუთარი წესებით ინახავენ.

**.com** — новый абзац в разделе «Where your enquiry came from» после абзаца 4:
> If you clicked “Accept”, we also tell Google Ads and Meta that an enquiry came from their ad click: the click ID (gclid, or Meta’s _fbc and _fbp), the type of event and the time. This helps us measure our ads and show them to people who will find them useful. Without your consent no such data is sent. You can withdraw consent in the cookie settings; data already sent is kept by Google and Meta under their own terms.

И в «Who receives it», абзац 1, после «Meta receives data only after your consent.»:
> With your consent, Google Ads and Meta are also told when an enquiry came from their ad, as described in “Where your enquiry came from”. Google and Meta may process this data in the United States.

Плашка .com — в конец фразы добавить: «…and tell Google and Meta when an enquiry came from their ad».

Если будут передаваться контакты в зашифрованном виде (хэш email/телефона: Google enhanced conversions for leads, Meta Conversions API): .ge ru «…а также ваш телефон или email в зашифрованном виде (хэш), чтобы сервис сопоставил заявку с рекламным кликом»; en «…and your phone number or email in hashed form, so the service can match the enquiry to the ad click»; ka «…ასევე თქვენი ტელეფონი ან ელფოსტა დაშიფრული სახით (ჰეში), რომ სერვისმა განაცხადი სარეკლამო დაწკაპუნებას დაუკავშიროს»; .com «…and, in hashed form, the email address or phone number you gave us, so they can match the enquiry to the click.»

---

## 5. Что нужно от владельца

1. **Написание имени** по выписке из реестра ИП — на русском («Евгений Будников») и грузинском («ევგენი ბუდნიკოვი»); в черновике — по `legalEntity` из `lib/intl.ts`.
2. **Подписан ли с amoCRM договор IDTA** (британский договор о передаче данных)? Если да — в политику .com идёт В1 и нужна копия договора; если нет (скорее всего) — В2 и только после заключения юриста.
3. **Для В2:** подтвердить, что заявки, присланные на hello@praxenai.com письмом, вы ведёте без amoCRM. Если нет — последнее предложение В2 убрать (юрист скажет, чем заменить).
4. **«Да» на публикацию** после проверки юристом; дата публикации — для полей `updated` (.ge) и `privacyUpdatedLabel` (.com).

Проверит разработчик (вам решать не нужно): исправление _fbc/_fbp (раздел 2, п. 3) — до публикации; что заявки .com действительно уходят в amoCRM (секреты `AMO_*` на воркере .com); что на .com не настроена выгрузка yclid в Метрику (`YM_OFFLINE_TOKEN`; Яндекс в тексте .com не упоминается).

---

## 6. Вопросы юристу (человеку)

**6.1. Главное: amoCRM.ru для .com — решение владельца вопреки рекомендации.** Владелец 12.11 решил оставить отправку заявок .com в amoCRM (Россия). Составитель рекомендовал не отправлять заявки .com в amoCRM (вариант А) или взять CRM с серверами в UK/ЕС/США (вариант Б). **Нужно письменное заключение живого юриста до публикации текста 3.2 и до продолжения передачи.**
- Основание передачи (UK GDPR Art. 44–46): реален ли IDTA или UK Addendum с amoCRM и оценка рисков передачи (transfer risk assessment) при российском законодательстве о доступе государства к данным?
- Если договора нет: подходит ли Art. 49(1)(b) (необходимость для преддоговорных мер по запросу субъекта) для постоянной передачи всех заявок в CRM? По руководству ICO об international transfers и EDPB Guidelines 2/2018 исключения ст. 49 — для разовых, не регулярных передач; допущение составителя: не подходит. Альтернатива — явное согласие по Art. 49(1)(a) отдельной галочкой в форме с предупреждением о рисках (потребует изменения формы).
- Санкции: есть ли ограничения по режиму UK в отношении России (Russia (Sanctions) (EU Exit) Regulations 2019) на использование российского облачного сервиса и оплату подписки, с учётом того, что контролёр — ИП вне UK?
- Прошлые передачи: если заявки .com уже уходили в amoCRM без раскрытия, нужно ли что-то делать (уведомление ICO или лиц, удаление)?
- Договор обработки (Art. 28): подходит ли оферта amoCRM?
- Представитель в UK (Art. 27): нужен ли, или применимо исключение Art. 27(2)(a)?

**6.2. .ge: законный интерес и Россия.** Закон Грузии № 3144.
- Достаточно ли законного интереса (ст. 5(1), подпункт сверить) для записи в браузер до выбора в плашке (сейчас пишет сразу, «Отклонить» удаляет)? Есть ли в грузинском праве аналог правил PECR/ePrivacy о записи на устройство? Допущение: нет. Нужна ли письменная оценка баланса интересов?
- Источник текущего захода и yclid в Яндекс Метрику уходят с заявкой и после «Отклонить» (раздел 2, пп. 2 и 4). Допустимо ли это на законном интересе?
- Передача в Россию (amoCRM, Яндекс): входит ли Россия в перечень стран с надлежащим уровнем защиты Службы защиты персональных данных; нужны ли договорные гарантии или разрешение Службы; достаточно ли раскрытия в тексте 3.1 (4)?
- Посетители .ge из Казахстана, Узбекистана, Армении, Азербайджана: учитывать ли их законы (Закон РК № 94-V; Закон РУз № ЗРУ-547 с локализацией)?

**6.3. PECR после DUAA 2025 (.com).** Sch. 12 DUAA (приложение A1 к PECR), в силе с 05.02.2026 (по legislation.gov.uk; название постановления о вступлении в силу сверить).
- Подпадает ли запись источника на 90 дней под исключение «статистические цели»? Допущение: нет, поэтому — согласие.
- Источник текущего захода без записи на устройство уходит с заявкой — верно ли, что это вне reg. 6 PECR и достаточно Art. 6(1)(f)?
- При отзыве согласия после заявки: удалять ли поля источника в CRM (Art. 7(3), 17(1)(b)) или можно хранить на Art. 6(1)(f)? В тексте — удаляем по запросу.
- GA4 до согласия (решение владельца 24.10.2026): подпадают ли `_ga` под исключение «статистические цели»; корректна ли формулировка «anonymous usage data» (client ID — скорее псевдонимные данные; то же «обезличенные» на .ge).

**6.4. 152-ФЗ (остаточный пункт).** Директ на Россию не планируется (решение владельца 12.11), основной вопрос снят. Остаётся: возникают ли у иностранного ИП обязанности по 152-ФЗ из того, что amoCRM.ru и Яндекс обрабатывают данные заявок в России по его поручению (ст. 6 ч. 3–4)? Допущение: нет.

**6.5. Будущая передача в Google Ads и Meta (приложение, раздел 4).** Достаточно ли согласия из плашки cookie для серверной передачи данных заявки или нужно отдельное согласие в форме; роли Google и Meta (контролёры, обработчики, совместный контроль); хэш email/телефона как персональные данные; основание передачи в США (UK Extension to DPF).

**6.6. Прочие получатели.** Resend (США): достаточно ли UK Extension to DPF (если сертифицирован) или нужен IDTA. Telegram: роль и место хранения сообщений бота.

---

## 7. Источники

- PECR 2003, reg. 6 и приложение A1 (в ред. DUAA 2025): [legislation.gov.uk — DUAA 2025, Schedule 12](https://www.legislation.gov.uk/ukpga/2025/18/schedule/12).
- Сводка изменений DUAA от ICO: [ico.org.uk — DUAA summary of the changes](https://ico.org.uk/about-the-ico/what-we-do/legislation-we-cover/data-use-and-access-act-2025/the-data-use-and-access-act-2025-duaa-summary-of-the-changes/schedules/).
- Вторичные обзоры о дате вступления в силу (05.02.2026; неофициальные, сверить): [bratby.law](https://bratby.law/data-use-and-access-act-2025-commencement/), [policypros.co.uk](https://www.policypros.co.uk/cookie-consent-changes-duaa-guide/).
- UK GDPR Art. 13, 27, 44–46, 49 — текст на legislation.gov.uk; руководство ICO по international transfers (ico.org.uk); EDPB Guidelines 2/2018 on derogations of Article 49 (edpb.europa.eu). Отсутствие adequacy regulations для России — сверить по актуальному перечню на gov.uk / ico.org.uk.
- Закон Грузии «О защите персональных данных» № 3144 от 14.06.2023: [matsne.gov.ge, документ 5827307](https://matsne.gov.ge/en/document/view/5827307); обзоры: [Law Over Borders — Georgia](https://www.globallegalpost.com/lawoverborders/data-protection-law-guide-1072382791/georgia-273882423), [KPMG Georgia — Personal Data Guide](https://assets.kpmg.com/content/dam/kpmg/ge/pdf/2023/12/Personal-Data-Guide-ENG.pdf).
- Код: `components/analytics.tsx` (`storeAllowed`, `rememberAttribution`, `setConsent`, `leadAttribution`, `bannerCopy`), `lib/lead-attribution.mjs`, `lib/lead-delivery.mjs`, `lib/metrika-offline.mjs`, `components/praxen/privacy.tsx`, `components/intl/blocks.tsx` (`Doc`), `lib/intl.ts` (`legalEntity`, `privacyUpdatedLabel`), `lib/contacts.ts`.

Грузинские тексты — на вычитку носителю (команда владельца).
