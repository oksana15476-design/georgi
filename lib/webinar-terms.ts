import type {Lang} from '@/lib/content';

// Public offer (terms of sale) for the services sold on the workshop offer page: /ru/webinar/terms, /webinar/terms, /ka/webinar/terms.
// Built on the Civil Code of Georgia (art. 327–333, 342–348), the Law on Consumer Rights Protection (2022), the Law on Electronic
// Commerce (2023) and the Law on Personal Data Protection (2023); see the research notes in docs/HANDOFF.md.
// A Georgian lawyer should review the text (especially the Georgian version, which takes priority) before payments go live.
// While any seller detail is empty the page shows a draft notice.

/** Seller details (individual entrepreneur). Fill in from the owner's registration documents; never guess. */
export const seller={
 // From the owner's registration and the TBC bank certificate (14 October 2026). The official name is the Latin one.
 name:{ru:'ИП Евгений Будников (P/E Evgenii Budnikov)',en:'P/E Evgenii Budnikov',ka:'ი/მ ევგენი ბუდნიკოვი (P/E Evgenii Budnikov)'} as Record<'ru'|'en'|'ka',string>,
 idCode:'345868894',
 legalAddress:{ru:'9 Niyazaradi St., Batumi, Georgia',en:'9 Niyazaradi St., Batumi, Georgia',ka:'9 Niyazaradi St., Batumi, Georgia'} as Record<'ru'|'en'|'ka',string>,
 iban:'GE73TB7037345064300159',
 swift:'TBCBGE22',
 // Owner, 14 October 2026: small business status (1% turnover tax), not registered for VAT.
 vat:{ru:'Исполнитель не является плательщиком НДС.',en:'The Provider is not registered for VAT.',ka:'შემსრულებელი არ არის დღგ-ის გადამხდელი.'} as Record<'ru'|'en'|'ka',string>,
};
export const termsDraft=!seller.name.ru||!seller.idCode||!seller.legalAddress.ru||!seller.vat.ru;
export const termsLangs:Lang[]=['ru','en','ka'];
export const termsPath='/webinar/terms';
export const termsEdition='2026-10-14';

type Section={h:string;p:string[]};
export type TermsCopy={title:string;description:string;h1:string;edition:string;draft:string;missing:string;sections:Section[];formH:string;form:string[];reqH:string;req:[string,string][];back:string;foot:{location:string;privacy:string}};

const ru=(s:typeof seller):TermsCopy=>({
 title:'Публичная оферта на оказание услуг — Praxen AI',
 description:'Условия заказа и оплаты обучения, внедрения и разработки ИИ-решений Praxen AI: цена, бронь, сроки, отказ и возврат денег.',
 h1:'Публичная оферта',
 edition:'Редакция от 14 октября 2026 года',
 draft:'Черновик: не все данные исполнителя заполнены, текст на проверке у юриста. До этого оплата на сайте не принимается.',
 missing:'заполнить',
 sections:[
  {h:'1. Общие положения',p:[
   '1.1. Этот документ — публичная оферта индивидуального предпринимателя, указанного в разделе 11 (далее — Исполнитель), заключить договор на оказание услуг на условиях ниже. Оферта адресована любому лицу (статья 329 Гражданского кодекса Грузии).',
   '1.2. Акцепт оферты — отметка о согласии с её условиями в форме заказа на сайте praxenai.ge и оплата заказа: полная или бронь. С момента оплаты договор считается заключённым в электронной форме и имеет ту же силу, что и договор на бумаге.',
   '1.3. Перед оплатой заказчик видит тариф, сумму и способы оплаты и может исправить введённые данные. После оплаты подтверждение заказа и чек приходят на email заказчика; текст оферты в редакции на дату заказа всегда доступен по этой ссылке, его можно сохранить или распечатать.',
   '1.4. Оферта составлена на грузинском, русском и английском языках. При расхождении текстов действует грузинская версия.',
   '1.5. Заказчик — физическое лицо или организация, принявшие оферту. Раздел 6 о праве на отказ применяется к заказчикам-потребителям, то есть к физическим лицам, которые заказывают услуги не для предпринимательской деятельности.',
  ]},
  {h:'2. Услуги',p:[
   '2.1. Исполнитель оказывает услуги по тарифам, описанным на странице предложения для участников воркшопа на дату заказа: «Обучение команды», «Обучение + внедрение», «Обучение + разработка». Состав каждого тарифа указан на этой странице и является частью договора.',
   '2.2. В течение рабочего дня после оплаты куратор Исполнителя связывается с заказчиком. Задачи, график и критерии результата стороны согласуют и фиксируют письмом на email заказчика.',
   '2.3. В тариф «Обучение + разработка» входит 25 часов разработки. Если после разбора задаче нужно больше, Исполнитель до начала работ присылает расчёт дополнительных часов. Работы сверх базового объёма начинаются только после письменного согласия заказчика и их оплаты.',
   '2.4. В цену не входят токены моделей ИИ, серверы и подписки на сторонние сервисы (CRM, мессенджеры и другие). Заказчик оплачивает их провайдерам напрямую, решения работают на аккаунтах заказчика.',
  ]},
  {h:'3. Цена и оплата',p:[
   '3.1. Цены указаны в грузинских лари и окончательны. '+(s.vat.ru||'[заполнить: статус по НДС]'),
   '3.2. Специальные цены для участников воркшопа действуют до 14 ноября 2026 года, 19:45 по Тбилиси. После этого действуют цены, указанные на странице как обычные.',
   '3.3. Оплата принимается банковской картой Visa или Mastercard, через Apple Pay или Google Pay на защищённой странице платёжного сервиса Flitt (группа TBC), а для организаций — также по счёту. Данные карты Исполнитель не получает и не хранит.',
   '3.4. Бронь. Платёж 500 ₾ закрепляет за заказчиком специальную цену выбранного тарифа и место в графике на 14 дней. Это аванс, а не задаток: он засчитывается в цену тарифа. Если за 14 дней остаток не оплачен, бронь снимается, и аванс возвращается заказчику по его запросу.',
   '3.5. Переход на старший тариф. В течение 30 дней после оплаты тарифа «Обучение команды» заказчик может перейти на тариф «Обучение + внедрение» или «Обучение + разработка». Уже оплаченная сумма засчитывается в цену нового тарифа.',
  ]},
  {h:'4. Порядок оказания услуг',p:[
   '4.1. Обучение начинается в течение 7 дней после оплаты, если стороны не договорились о другой дате. Занятия проходят онлайн или в офисе заказчика по согласованию.',
   '4.2. Пилот внедрения длится 2–4 недели, разработка — от 4 недель по согласованному плану.',
   '4.3. Заказчик даёт доступы к своим аккаунтам и материалы, нужные для работы. Если доступы или материалы задерживаются, сроки сдвигаются на время задержки.',
   '4.4. Результат внедрения и разработки Исполнитель передаёт с электронным актом. Если в течение 5 рабочих дней заказчик не прислал обоснованных замечаний, работы считаются принятыми. Обоснованные замечания Исполнитель устраняет в разумный срок.',
   '4.5. Настройки, код и материалы, созданные для заказчика, после полной оплаты передаются ему для использования без ограничения срока. Исполнитель может использовать свои общие методики и шаблоны, которые не содержат данных заказчика.',
  ]},
  {h:'5. Ответственность',p:[
   '5.1. Стороны отвечают за неисполнение договора по законодательству Грузии.',
   '5.2. Исполнитель не отвечает за сбои сторонних сервисов (мессенджеров, CRM, моделей ИИ), которые от него не зависят, и за решения, которые заказчик принимает на основе ответов ИИ. Ответы ассистента проверяет человек по правилам, согласованным при запуске.',
   '5.3. По договорам с организациями общая ответственность Исполнителя ограничена суммой, оплаченной по заказу.',
   '5.4. Ограничения этого раздела не применяются при умысле или грубой неосторожности и не уменьшают права потребителей по закону.',
  ]},
  {h:'6. Право на отказ для потребителей',p:[
   '6.1. Заказчик-потребитель может отказаться от договора в течение 14 дней с даты его заключения без объяснения причин. Для этого достаточно письма на email из раздела 11; можно использовать форму ниже.',
   '6.2. Принимая оферту, заказчик просит начать оказание услуг до окончания этого 14-дневного срока. Если заказчик отказывается после начала работ, Исполнитель возвращает оплату за вычетом стоимости уже оказанных услуг пропорционально их объёму.',
   '6.3. Если услуга полностью оказана с предварительного согласия заказчика, право на отказ прекращается.',
   '6.4. Деньги возвращаются не позднее 14 дней с получения заявления тем же способом, каким была оплата.',
  ]},
  {h:'7. Отмена и возврат для организаций',p:[
   '7.1. До начала работ организация может отменить заказ и получить оплату полностью.',
   '7.2. После начала работ оплата возвращается за вычетом стоимости уже оказанных услуг.',
   '7.3. Возврат на карту проходит через платёжный сервис в течение 14 дней; срок зачисления зависит от банка, выпустившего карту.',
  ]},
  {h:'8. Персональные данные',p:[
   '8.1. Исполнитель обрабатывает имя, email и телефон заказчика для исполнения договора, отправки чека и связи по заказу. Платёж обрабатывает Flitt; данные карты Исполнителю не передаются.',
   '8.2. Подробно — в политике конфиденциальности на сайте praxenai.ge.',
  ]},
  {h:'9. Претензии и споры',p:[
   '9.1. Претензии принимаются на email из раздела 11. Исполнитель отвечает в течение 10 рабочих дней.',
   '9.2. Споры стороны решают переговорами, а если договориться не удалось — в суде Грузии по законодательству Грузии. Потребитель может также обратиться в Агентство по конкуренции и защите прав потребителей Грузии (gcca.gov.ge).',
  ]},
  {h:'10. Изменение оферты',p:[
   '10.1. Исполнитель может изменить оферту, опубликовав новую редакцию на этой странице. Новая редакция применяется к заказам, сделанным после публикации; оплаченные заказы исполняются по редакции на дату их оплаты.',
  ]},
 ],
 formH:'Форма отказа от договора',
 form:['Кому: Исполнителю, указанному в разделе 11, на email из раздела 11.','Я, [имя и фамилия], отказываюсь от договора на оказание услуг по тарифу [название тарифа], заказ № [номер заказа из письма], дата заказа [дата].','Прошу вернуть оплату тем же способом, каким она была сделана.','Дата. Подпись — для бумажного заявления.'],
 reqH:'11. Реквизиты исполнителя',
 req:[['Индивидуальный предприниматель',s.name.ru],['Налоговый (идентификационный) номер',s.idCode],['Юридический адрес',s.legalAddress.ru],['Фактический адрес','Батуми, Грузия'],['Банк','АО «Тибиси Банк» (JSC TBC Bank), Тбилиси, Грузия'],['IBAN',s.iban],['SWIFT/BIC',s.swift],['Телефон','+995 557 125 497'],['Email','hello@praxenai.ge'],['Сайт','praxenai.ge']],
 back:'Вернуться к тарифам',
 foot:{location:'Батуми, Грузия',privacy:'Конфиденциальность'},
});

const en=(s:typeof seller):TermsCopy=>({
 title:'Public offer for services — Praxen AI',
 description:'Terms for ordering and paying for Praxen AI training, implementation and AI development: price, booking, timing, withdrawal and refunds.',
 h1:'Public offer',
 edition:'Version of 14 October 2026',
 draft:'Draft: some of the provider’s details are still missing and the text is with a lawyer for review. Online payment is not accepted until then.',
 missing:'to fill in',
 sections:[
  {h:'1. General provisions',p:[
   '1.1. This document is a public offer by the individual entrepreneur named in section 11 (the Provider) to conclude a services contract on the terms below. The offer is addressed to anyone (Article 329 of the Civil Code of Georgia).',
   '1.2. The offer is accepted by ticking the consent box in the order form on praxenai.ge and paying for the order, in full or as a booking. From the moment of payment the contract is concluded electronically and has the same force as a paper contract.',
   '1.3. Before paying, the client sees the plan, the amount and the payment methods and can correct the details entered. After payment, the order confirmation and receipt are sent to the client’s email; the version of this offer valid on the order date is always available at this link and can be saved or printed.',
   '1.4. The offer is made in Georgian, Russian and English. If the texts differ, the Georgian version prevails.',
   '1.5. The Client is the individual or organisation that accepts the offer. Section 6 on the right of withdrawal applies to consumer clients, meaning individuals who order the services outside their business.',
  ]},
  {h:'2. Services',p:[
   '2.1. The Provider delivers the services under the plans described on the offer page for workshop participants on the order date: Team training, Training + implementation, Training + development. The scope of each plan shown on that page forms part of the contract.',
   '2.2. Within one working day of payment, the Provider’s curator contacts the Client. The parties agree the tasks, schedule and result criteria and confirm them by email to the Client.',
   '2.3. Training + development includes 25 hours of development. If the review shows the task needs more, the Provider sends an estimate for the extra hours before work starts. Work beyond the base scope starts only after the Client’s written consent and payment.',
   '2.4. The price does not include AI model tokens, servers or subscriptions to third-party services (CRM, messengers and others). The Client pays the providers directly, and the solutions run on the Client’s accounts.',
  ]},
  {h:'3. Price and payment',p:[
   '3.1. Prices are in Georgian lari and are final. '+(s.vat.en||'[to fill in: VAT status]'),
   '3.2. Special prices for workshop participants apply until 14 November 2026, 19:45 Tbilisi time. After that the prices shown on the page as regular apply.',
   '3.3. Payment is accepted by Visa or Mastercard bank card, Apple Pay or Google Pay on the secure page of the Flitt payment service (TBC Group), and for organisations also by invoice. The Provider does not receive or store card details.',
   '3.4. Booking. A 500 ₾ payment holds the special price of the chosen plan and a slot in the schedule for 14 days. It is an advance payment, not a deposit forfeited on cancellation: it counts towards the plan price. If the balance is not paid within 14 days, the booking lapses and the advance is refunded to the Client on request.',
   '3.5. Upgrade. Within 30 days of paying for Team training, the Client can move to Training + implementation or Training + development. The amount already paid counts towards the new plan.',
  ]},
  {h:'4. Delivery',p:[
   '4.1. Training starts within 7 days of payment unless the parties agree another date. Sessions are online or at the Client’s office, as agreed.',
   '4.2. An implementation pilot takes 2–4 weeks; development takes from 4 weeks under the agreed plan.',
   '4.3. The Client provides access to its accounts and the materials needed for the work. If access or materials are delayed, deadlines move by the length of the delay.',
   '4.4. The Provider hands over implementation and development results with an electronic acceptance note. If the Client sends no reasoned comments within 5 working days, the work is deemed accepted. The Provider fixes reasoned comments within a reasonable time.',
   '4.5. Settings, code and materials created for the Client pass to the Client for use without time limit once paid in full. The Provider may reuse its general methods and templates that contain no Client data.',
  ]},
  {h:'5. Liability',p:[
   '5.1. The parties are liable for non-performance under Georgian law.',
   '5.2. The Provider is not liable for failures of third-party services (messengers, CRM, AI models) outside its control, or for decisions the Client takes based on AI answers. Assistant replies are checked by a person under the rules agreed at launch.',
   '5.3. Under contracts with organisations, the Provider’s total liability is limited to the amount paid for the order.',
   '5.4. The limits in this section do not apply to intent or gross negligence and do not reduce consumers’ statutory rights.',
  ]},
  {h:'6. Right of withdrawal for consumers',p:[
   '6.1. A consumer client may withdraw from the contract within 14 days of its conclusion without giving a reason, by writing to the email in section 11; the form below may be used.',
   '6.2. By accepting the offer, the Client asks for the services to start before the 14-day period ends. If the Client withdraws after work has started, the Provider refunds the payment minus the value of the services already provided, in proportion to their scope.',
   '6.3. Once a service has been fully provided with the Client’s prior consent, the right of withdrawal ends.',
   '6.4. Refunds are made within 14 days of receiving the notice, by the same method as the payment.',
  ]},
  {h:'7. Cancellation and refunds for organisations',p:[
   '7.1. Before work starts, an organisation may cancel the order and receive a full refund.',
   '7.2. After work starts, the payment is refunded minus the value of the services already provided.',
   '7.3. Card refunds go through the payment service within 14 days; the time to reach the card depends on the issuing bank.',
  ]},
  {h:'8. Personal data',p:[
   '8.1. The Provider processes the Client’s name, email and phone to perform the contract, send the receipt and keep in touch about the order. Payments are processed by Flitt; card details are not passed to the Provider.',
   '8.2. Details are in the privacy policy on praxenai.ge.',
  ]},
  {h:'9. Complaints and disputes',p:[
   '9.1. Complaints are accepted at the email in section 11. The Provider replies within 10 working days.',
   '9.2. The parties settle disputes by negotiation and, failing that, in the courts of Georgia under Georgian law. A consumer may also contact the Georgian Competition and Consumer Agency (gcca.gov.ge).',
  ]},
  {h:'10. Changes to the offer',p:[
   '10.1. The Provider may change the offer by publishing a new version on this page. A new version applies to orders placed after publication; paid orders are performed under the version valid on their payment date.',
  ]},
 ],
 formH:'Withdrawal form',
 form:['To: the Provider named in section 11, at the email in section 11.','I, [full name], withdraw from the services contract for the [plan name] plan, order no. [order number from the email], ordered on [date].','Please refund the payment by the same method as it was made.','Date. Signature, for a paper notice.'],
 reqH:'11. Provider details',
 req:[['Individual entrepreneur',s.name.en],['Tax ID',s.idCode],['Legal address',s.legalAddress.en],['Actual address','Batumi, Georgia'],['Bank','JSC TBC Bank, Tbilisi, Georgia'],['IBAN',s.iban],['SWIFT/BIC',s.swift],['Phone','+995 557 125 497'],['Email','hello@praxenai.ge'],['Website','praxenai.ge']],
 back:'Back to the plans',
 foot:{location:'Batumi, Georgia',privacy:'Privacy'},
});

const ka=(s:typeof seller):TermsCopy=>({
 title:'საჯარო ოფერტა მომსახურების გაწევაზე — Praxen AI',
 description:'Praxen AI-ის სწავლების, დანერგვისა და AI გადაწყვეტების შემუშავების შეკვეთისა და გადახდის პირობები: ფასი, ჯავშანი, ვადები, უარი და თანხის დაბრუნება.',
 h1:'საჯარო ოფერტა',
 edition:'რედაქცია 2026 წლის 14 ოქტომბრით',
 draft:'პროექტი: შემსრულებლის ყველა მონაცემი ჯერ არ არის შევსებული, ტექსტი იურისტთან შემოწმებაზეა. მანამდე საიტზე გადახდა არ მიიღება.',
 missing:'შესავსები',
 sections:[
  {h:'1. ზოგადი დებულებები',p:[
   '1.1. ეს დოკუმენტი არის მე-11 ნაწილში მითითებული ინდივიდუალური მეწარმის (შემდგომში — შემსრულებელი) საჯარო ოფერტა, დადოს მომსახურების ხელშეკრულება ქვემოთ მოცემული პირობებით. ოფერტა მიმართულია ნებისმიერი პირისადმი (საქართველოს სამოქალაქო კოდექსის 329-ე მუხლი).',
   '1.2. ოფერტის აქცეპტი არის საიტზე praxenai.ge შეკვეთის ფორმაში პირობებზე თანხმობის მონიშვნა და შეკვეთის გადახდა — სრულად ან ჯავშნის სახით. გადახდის მომენტიდან ხელშეკრულება დადებულად ითვლება ელექტრონული ფორმით და აქვს ქაღალდის ხელშეკრულების ტოლფასი ძალა.',
   '1.3. გადახდამდე დამკვეთი ხედავს ტარიფს, თანხას და გადახდის საშუალებებს და შეუძლია შეყვანილი მონაცემების შესწორება. გადახდის შემდეგ შეკვეთის დადასტურება და ქვითარი იგზავნება დამკვეთის email-ზე; ოფერტის ტექსტი შეკვეთის დღის რედაქციით ყოველთვის ხელმისაწვდომია ამ ბმულზე, მისი შენახვა ან ამობეჭდვა შეიძლება.',
   '1.4. ოფერტა შედგენილია ქართულ, რუსულ და ინგლისურ ენებზე. ტექსტებს შორის შეუსაბამობისას მოქმედებს ქართული ვერსია.',
   '1.5. დამკვეთი არის ფიზიკური პირი ან ორგანიზაცია, რომელმაც მიიღო ოფერტა. მე-6 ნაწილი უარის უფლების შესახებ ვრცელდება დამკვეთ-მომხმარებლებზე, ანუ ფიზიკურ პირებზე, რომლებიც მომსახურებას უკვეთავენ არა სამეწარმეო საქმიანობისთვის.',
  ]},
  {h:'2. მომსახურება',p:[
   '2.1. შემსრულებელი გასწევს მომსახურებას ვორქშოპის მონაწილეთა შეთავაზების გვერდზე შეკვეთის დღისთვის აღწერილი ტარიფებით: „გუნდის სწავლება“, „სწავლება + დანერგვა“, „სწავლება + შემუშავება“. თითოეული ტარიფის შემადგენლობა მითითებულია ამ გვერდზე და ხელშეკრულების ნაწილია.',
   '2.2. გადახდიდან ერთი სამუშაო დღის განმავლობაში შემსრულებლის კურატორი უკავშირდება დამკვეთს. ამოცანებს, გრაფიკსა და შედეგის კრიტერიუმებს მხარეები ათანხმებენ და აფიქსირებენ წერილით დამკვეთის email-ზე.',
   '2.3. ტარიფში „სწავლება + შემუშავება“ შედის 25 საათი შემუშავება. თუ ანალიზის შემდეგ ამოცანას მეტი სჭირდება, შემსრულებელი სამუშაოს დაწყებამდე უგზავნის დამატებითი საათების გაანგარიშებას. საბაზო მოცულობაზე მეტი სამუშაო იწყება მხოლოდ დამკვეთის წერილობითი თანხმობისა და გადახდის შემდეგ.',
   '2.4. ფასში არ შედის AI მოდელების ტოკენები, სერვერები და მესამე მხარის სერვისების გამოწერები (CRM, მესენჯერები და სხვა). დამკვეთი მათ პირდაპირ უხდის პროვაიდერებს, გადაწყვეტები დამკვეთის ანგარიშებზე მუშაობს.',
  ]},
  {h:'3. ფასი და გადახდა',p:[
   '3.1. ფასები მითითებულია ქართულ ლარში და საბოლოოა. '+(s.vat.ka||'[შესავსები: დღგ-ის სტატუსი]'),
   '3.2. ვორქშოპის მონაწილეთა სპეციალური ფასები მოქმედებს 2026 წლის 14 ნოემბრის 19:45-მდე (თბილისის დროით). ამის შემდეგ მოქმედებს გვერდზე ჩვეულებრივად მითითებული ფასები.',
   '3.3. გადახდა მიიღება Visa ან Mastercard საბანკო ბარათით, Apple Pay-ით ან Google Pay-ით გადახდის სერვის Flitt-ის (TBC ჯგუფი) დაცულ გვერდზე, ორგანიზაციებისთვის — ასევე ინვოისით. ბარათის მონაცემებს შემსრულებელი არ იღებს და არ ინახავს.',
   '3.4. ჯავშანი. 500 ₾-იანი გადახდა 14 დღით უნარჩუნებს დამკვეთს არჩეული ტარიფის სპეციალურ ფასს და ადგილს გრაფიკში. ეს არის ავანსი და არა ბე: ის ჩაითვლება ტარიფის ფასში. თუ 14 დღეში დარჩენილი თანხა არ არის გადახდილი, ჯავშანი უქმდება, ავანსი კი დამკვეთს მისი მოთხოვნით უბრუნდება.',
   '3.5. უფრო მაღალ ტარიფზე გადასვლა. „გუნდის სწავლების“ გადახდიდან 30 დღის განმავლობაში დამკვეთს შეუძლია გადავიდეს ტარიფზე „სწავლება + დანერგვა“ ან „სწავლება + შემუშავება“. უკვე გადახდილი თანხა ჩაითვლება ახალი ტარიფის ფასში.',
  ]},
  {h:'4. მომსახურების გაწევის წესი',p:[
   '4.1. სწავლება იწყება გადახდიდან 7 დღის განმავლობაში, თუ მხარეები სხვა თარიღზე არ შეთანხმდნენ. შეხვედრები ტარდება ონლაინ ან დამკვეთის ოფისში შეთანხმებით.',
   '4.2. დანერგვის პილოტი გრძელდება 2–4 კვირა, შემუშავება — 4 კვირიდან შეთანხმებული გეგმით.',
   '4.3. დამკვეთი აძლევს წვდომას თავის ანგარიშებზე და სამუშაოსთვის საჭირო მასალებს. წვდომის ან მასალების დაგვიანებისას ვადები გადაიწევს დაგვიანების დროით.',
   '4.4. დანერგვისა და შემუშავების შედეგს შემსრულებელი გადასცემს ელექტრონული აქტით. თუ 5 სამუშაო დღის განმავლობაში დამკვეთმა დასაბუთებული შენიშვნები არ გამოგზავნა, სამუშაო მიღებულად ითვლება. დასაბუთებულ შენიშვნებს შემსრულებელი გონივრულ ვადაში აღმოფხვრის.',
   '4.5. დამკვეთისთვის შექმნილი პარამეტრები, კოდი და მასალები სრული გადახდის შემდეგ გადაეცემა მას ვადის შეზღუდვის გარეშე გამოსაყენებლად. შემსრულებელს შეუძლია გამოიყენოს თავისი ზოგადი მეთოდიკები და შაბლონები, რომლებიც დამკვეთის მონაცემებს არ შეიცავს.',
  ]},
  {h:'5. პასუხისმგებლობა',p:[
   '5.1. მხარეები ხელშეკრულების შეუსრულებლობისთვის პასუხს აგებენ საქართველოს კანონმდებლობით.',
   '5.2. შემსრულებელი არ აგებს პასუხს მესამე მხარის სერვისების (მესენჯერები, CRM, AI მოდელები) გაუმართაობაზე, რომლებიც მასზე არ არის დამოკიდებული, და გადაწყვეტილებებზე, რომლებსაც დამკვეთი AI-ის პასუხების საფუძველზე იღებს. ასისტენტის პასუხებს ადამიანი ამოწმებს გაშვებისას შეთანხმებული წესებით.',
   '5.3. ორგანიზაციებთან ხელშეკრულებებში შემსრულებლის საერთო პასუხისმგებლობა შეზღუდულია შეკვეთისთვის გადახდილი თანხით.',
   '5.4. ამ ნაწილის შეზღუდვები არ ვრცელდება განზრახვასა და უხეშ გაუფრთხილებლობაზე და არ ამცირებს მომხმარებლის კანონით მინიჭებულ უფლებებს.',
  ]},
  {h:'6. მომხმარებლის უარის უფლება',p:[
   '6.1. დამკვეთ-მომხმარებელს შეუძლია ხელშეკრულებაზე უარი თქვას მისი დადებიდან 14 დღის განმავლობაში მიზეზის მითითების გარეშე — საკმარისია წერილი მე-11 ნაწილში მითითებულ email-ზე; შეიძლება ქვემოთ მოცემული ფორმის გამოყენება.',
   '6.2. ოფერტის მიღებით დამკვეთი ითხოვს მომსახურების დაწყებას 14-დღიანი ვადის გასვლამდე. თუ დამკვეთი უარს ამბობს სამუშაოს დაწყების შემდეგ, შემსრულებელი აბრუნებს გადახდილ თანხას უკვე გაწეული მომსახურების ღირებულების გამოკლებით, მისი მოცულობის პროპორციულად.',
   '6.3. თუ მომსახურება სრულად არის გაწეული დამკვეთის წინასწარი თანხმობით, უარის უფლება წყდება.',
   '6.4. თანხა ბრუნდება განცხადების მიღებიდან არაუგვიანეს 14 დღისა, იმავე საშუალებით, რითაც მოხდა გადახდა.',
  ]},
  {h:'7. გაუქმება და თანხის დაბრუნება ორგანიზაციებისთვის',p:[
   '7.1. სამუშაოს დაწყებამდე ორგანიზაციას შეუძლია შეკვეთის გაუქმება და გადახდილი თანხის სრულად დაბრუნება.',
   '7.2. სამუშაოს დაწყების შემდეგ თანხა ბრუნდება უკვე გაწეული მომსახურების ღირებულების გამოკლებით.',
   '7.3. ბარათზე თანხის დაბრუნება ხდება გადახდის სერვისის მეშვეობით 14 დღის განმავლობაში; ჩარიცხვის ვადა დამოკიდებულია ბარათის გამცემ ბანკზე.',
  ]},
  {h:'8. პერსონალური მონაცემები',p:[
   '8.1. შემსრულებელი ამუშავებს დამკვეთის სახელს, email-სა და ტელეფონს ხელშეკრულების შესასრულებლად, ქვითრის გასაგზავნად და შეკვეთასთან დაკავშირებით კომუნიკაციისთვის. გადახდას ამუშავებს Flitt; ბარათის მონაცემები შემსრულებელს არ გადაეცემა.',
   '8.2. დეტალურად — კონფიდენციალურობის პოლიტიკაში საიტზე praxenai.ge.',
  ]},
  {h:'9. პრეტენზიები და დავები',p:[
   '9.1. პრეტენზიები მიიღება მე-11 ნაწილში მითითებულ email-ზე. შემსრულებელი პასუხობს 10 სამუშაო დღის განმავლობაში.',
   '9.2. დავებს მხარეები წყვეტენ მოლაპარაკებით, შეთანხმების მიუღწევლობისას — საქართველოს სასამართლოში საქართველოს კანონმდებლობით. მომხმარებელს ასევე შეუძლია მიმართოს საქართველოს კონკურენციისა და მომხმარებელთა სააგენტოს (gcca.gov.ge).',
  ]},
  {h:'10. ოფერტის შეცვლა',p:[
   '10.1. შემსრულებელს შეუძლია ოფერტის შეცვლა ამ გვერდზე ახალი რედაქციის გამოქვეყნებით. ახალი რედაქცია ვრცელდება გამოქვეყნების შემდეგ გაკეთებულ შეკვეთებზე; გადახდილი შეკვეთები სრულდება მათი გადახდის დღის რედაქციით.',
  ]},
 ],
 formH:'ხელშეკრულებაზე უარის ფორმა',
 form:['ვის: მე-11 ნაწილში მითითებულ შემსრულებელს, მე-11 ნაწილში მითითებულ email-ზე.','მე, [სახელი და გვარი], უარს ვამბობ მომსახურების ხელშეკრულებაზე ტარიფით [ტარიფის დასახელება], შეკვეთა № [შეკვეთის ნომერი წერილიდან], შეკვეთის თარიღი [თარიღი].','გთხოვთ, თანხა დამიბრუნოთ იმავე საშუალებით, რითაც გადავიხადე.','თარიღი. ხელმოწერა — ქაღალდის განცხადებისთვის.'],
 reqH:'11. შემსრულებლის რეკვიზიტები',
 req:[['ინდივიდუალური მეწარმე',s.name.ka],['საიდენტიფიკაციო ნომერი',s.idCode],['იურიდიული მისამართი',s.legalAddress.ka],['ფაქტობრივი მისამართი','ბათუმი, საქართველო'],['ბანკი','სს „თიბისი ბანკი“ (JSC TBC Bank), თბილისი, საქართველო'],['IBAN',s.iban],['SWIFT/BIC',s.swift],['ტელეფონი','+995 557 125 497'],['Email','hello@praxenai.ge'],['საიტი','praxenai.ge']],
 back:'ტარიფებზე დაბრუნება',
 foot:{location:'ბათუმი, საქართველო',privacy:'კონფიდენციალურობა'},
});

export const termsCopy:Record<'ru'|'en'|'ka',TermsCopy>={ru:ru(seller),en:en(seller),ka:ka(seller)};
