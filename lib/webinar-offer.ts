import type {Lang} from '@/lib/content';

// Copy for the offer page after the workshop: /ru/webinar/offer (after the 12 November session) and /webinar/offer (after 17 November).
// Reachable only by the link sent after the workshop: noindex, not in the sitemap or the menus. There is no Georgian session, so no Georgian page.
// Layout and Russian copy follow the design handoff «Workshop funnel — landing + offer page» (14 October 2026).
// Tariffs, deadlines and the server-side order check: lib/webinar-offer-order.mjs.
export const offerLangs:Lang[]=['ru','en'];
export const offerPath='/webinar/offer';

export type TariffKey='training'|'training_impl'|'training_dev';
export type MethodKey='card'|'tbc'|'ipay';
type Pair=[string,string];
export type OfferCopy={
 event:'ru'|'en';title:string;description:string;
 marquee:string[];
 head:{cta:string;home:string};
 hero:{badge:string;h1:string;h1Grad:string;sub:string;countLabel:string;countEnded:string;units:[string,string,string,string];seats:string;seatsSub:string};
 tariffs:{h:string;note:string;label:string;from:string;after:string;sticker:string;book:string;pay:string[];
  items:Record<TariffKey,{name:string;sub:string;features:string[];muted?:string;note?:Pair;buy:string}>};
 bonus:{k:string;h:string;until:string;ended:string};
 program:{h:string;note:string;items:[string,string,string,string][]};
 after:{h:string;items:Pair[]};
 faq:{h:string;items:Pair[]};
 final:{cta:string};
 sticky:{label:string;until:string;d:string;cta:string};
 checkout:{buy:string;book:string;amount:string;bonusPill:string;hold:(price:string)=>string;hours:string;name:string;email:string;emailPh:string;phone:string;methodLabel:string;
  methods:Record<MethodKey,Pair>;invalid:string;manual:string;consent:string;privacy:string;submitBuy:string;submitBook:string;sending:string;error:string;
  doneBuy:string;doneBook:string;doneText:(amount:string)=>string;curator:string;close:string};
 foot:{location:string;privacy:string};
};

const ru:OfferCopy={
 event:'ru',
 title:'Спецпредложение для участников воркшопа — Praxen AI',
 description:'Обучение команды, внедрение и разработка ИИ-решений по ценам для участников воркшопа 12 ноября. Спеццены до 14 ноября, 19:45.',
 marquee:['Только для участников воркшопа','Спеццены до 14 ноября, 19:45','Места на ноябрь ограничены'],
 head:{cta:'Выбрать тариф',home:'Praxen AI — главная'},
 hero:{badge:'Для участников воркшопа',h1:'Одна связка —',h1Grad:'только начало',sub:'Научим команду работать с ИИ на ваших задачах — и, если нужно, внедрим готовые инструменты или разработаем решение под ваш процесс. Цены для участников — ниже, чем на сайте.',countLabel:'До конца спеццены',countEnded:'Спеццена закончилась',units:['дней','часов','минут','секунд'],seats:'Количество мест на ноябрь ограничено',seatsSub:'Купите сразу или забронируйте спеццену за 500 ₾'},
 tariffs:{h:'Три формата',note:'Обучение команды — в основе каждого тарифа. Дальше — внедрение готовых инструментов или своя разработка. Цену фиксируем до старта, решение работает на ваших аккаунтах.',label:'Тариф',from:'от',after:'После 14 ноября —',sticker:'Выбор участников',book:'Забронировать за 500 ₾',
  pay:['Безопасная оплата','Visa · Mastercard · Apple Pay · TBC · Bank of Georgia','Счёт для юрлица — по запросу','Токены ИИ и серверы — на вашем аккаунте, оплачиваете провайдерам напрямую'],
  items:{
   training:{name:'Обучение команды',sub:'Практика на задачах ваших сотрудников. ИИ становится рабочим навыком команды.',features:['4 практических занятия за 1–2 недели — онлайн или в вашем офисе','Программа под ваш отдел: документы, обращения, данные','Рабочие шаблоны и правила проверки результата','Инструкции и записи занятий остаются у вас','Ответы на вопросы команды — 30 дней'],muted:'Интеграции настраиваете вы',note:['Апгрейд в течение 30 дней.','Перейдёте на внедрение или разработку — стоимость обучения засчитаем.'],buy:'Купить обучение'},
   training_impl:{name:'Обучение + внедрение',sub:'Обучим команду и вместе запустим первую связку на реальных заявках.',features:['Всё из тарифа «Обучение команды»','Разбор ваших заявок и выбор первой связки','Настраиваем связку на ваших аккаунтах: мессенджер, CRM, уведомления','Пилот на реальных заявках — 2–4 недели','Поддержка и доработки — 60 дней'],buy:'Купить и начать'},
   training_dev:{name:'Обучение + разработка',sub:'Обучим команду и разработаем решение под ваш процесс — когда готовых инструментов не хватает.',features:['Всё из тарифа «Обучение команды»','Разбор процесса и расчёт эффекта — до оценки проекта','ИИ-ассистенты и агенты для заявок и документов','Внутренние интерфейсы, интеграции с CRM, 1С, ERP','Тест на примерах вашей работы, срок — от 4 недель','Месяц ведения после запуска'],note:['Базовый объём — 25 часов разработки.','Если задаче нужно больше, дополнительные часы согласуем после разбора — до старта работ.'],buy:'Купить'},
  }},
 bonus:{k:'Бонус за оплату в первые 24 часа',h:'Личная сессия с Евгением — 60 минут разбора вашего отдела продаж',until:'Бонус сгорит через',ended:'Бонус закончился'},
 program:{h:'Программа обучения',note:'Входит в каждый тариф. Каждое занятие — на реальных задачах вашей команды.',items:[['01','Карта задач','Где ИИ даст эффект в деньгах и часах, а где нужен человек. Выбираем задачи для старта.','Неделя 1'],['02','Шаблоны на ваших данных','Промпты и инструкции для ваших документов, обращений и контента — на GE, EN и RU.','Неделя 1'],['03','Ассистент и CRM','Собираем связку из воркшопа под ваш прайс и правила: заявка, ответ, карточка в CRM.','Неделя 2'],['04','Проверка и метрики','Правила проверки ответов, журнал действий и показатели, по которым видно результат.','Неделя 2']]},
 after:{h:'После оплаты',items:[['Чек на email','Сразу после оплаты — чек и подтверждение тарифа.'],['Куратор на связи','В течение рабочего дня свяжется, уточнит процесс и согласует критерии результата.'],['Старт','Обучение — в течение недели. Пилот внедрения — 2–4 недели. Разработка — от 4 недель, цену фиксируем после разбора.']]},
 faq:{h:'Вопросы',items:[['Чем эти цены отличаются от цен на сайте?','По ценам сайта обучение стоит от 1 900 ₾, внедрение — от 3 200 ₾, разработка — от 6 700 ₾. В пакетах с обучением для участников воркшопа — дешевле, до окончания таймера.'],['Что ещё придётся оплачивать?','Токены ИИ и серверы работают на вашем аккаунте — оплачиваете провайдерам напрямую. После включённого месяца ведение — от 550 ₾ в месяц, если захотите.'],['Можно начать с обучения, а потом перейти на старший тариф?','Да. В течение 30 дней после покупки обучения можно перейти на «Обучение + внедрение» или «Обучение + разработка» — уже оплаченную сумму засчитаем в стоимость.'],['Чем бронь отличается от покупки?','Бронь за 500 ₾ закрепляет за вами спеццену и место в графике на 14 дней — сумма засчитывается в стоимость. Покупка — сразу полная оплата и старт работ.'],['Что входит в базовый объём разработки?','25 часов разработки под ваш процесс. Сколько часов нужно именно вам, считаем на разборе — если больше базовых, доплату согласуем и фиксируем до старта работ.'],['Что с нашими данными?','Работаем через корпоративные Enterprise API — ваши данные не используются для обучения публичных моделей. При необходимости разворачиваем решение в вашем контуре.'],['Можно оплатить от компании?','Да. Напишите в WhatsApp — выставим счёт на юрлицо, спеццена сохранится, если запрос придёт до окончания таймера.']]},
 final:{cta:'Выбрать тариф'},
 sticky:{label:'Места ограничены',until:'До конца спеццены:',d:'д',cta:'Выбрать тариф'},
 checkout:{buy:'Покупка',book:'Бронирование',amount:'К оплате',bonusPill:'+ личная сессия с Евгением (бонус 24 часа)',hold:p=>'Бронь спеццены '+p+' на 14 дней. 500 ₾ засчитываются в стоимость.',hours:'Базовый объём — 25 часов разработки. Если нужно больше, дополнительные часы согласуем после разбора — до старта работ.',
  name:'Имя',email:'Email для чека',emailPh:'ваш email',phone:'Телефон / WhatsApp',methodLabel:'Способ оплаты',methods:{card:['Банковская карта','Visa · Mastercard · Apple Pay'],tbc:['TBC Pay','TBC Bank'],ipay:['iPay','Bank of Georgia']},
  invalid:'Проверьте email и телефон.',manual:'Ссылку на оплату выбранным способом пришлём на email и в WhatsApp в течение рабочего дня.',consent:'Нажимая кнопку, вы соглашаетесь на обработку данных.',privacy:'Политика конфиденциальности',
  submitBuy:'Оформить заказ',submitBook:'Забронировать за 500 ₾',sending:'Отправляем…',error:'Не получилось отправить. Попробуйте ещё раз или напишите нам в WhatsApp.',
  doneBuy:'Заказ принят!',doneBook:'Бронь принята!',doneText:a=>'Сумма к оплате — '+a+'. В течение рабочего дня пришлём ссылку на оплату, а куратор свяжется и согласует старт.',curator:'Написать куратору',close:'Закрыть'},
 foot:{location:'Батуми, Грузия',privacy:'Конфиденциальность'},
};

const en:OfferCopy={
 event:'en',
 title:'Special offer for workshop participants — Praxen AI',
 description:'Team training, implementation and custom AI development at prices for participants of the 17 November workshop. Special prices until 19 November, 19:45.',
 marquee:['For workshop participants only','Special prices until 19 November, 19:45','Limited places in November'],
 head:{cta:'Choose a plan',home:'Praxen AI — home'},
 hero:{badge:'For workshop participants',h1:'One set-up is',h1Grad:'just the start',sub:'We train your team to use AI on your own tasks and, if you need it, set up ready-made tools or build a solution for your process. Participants pay less than the prices on our site.',countLabel:'Special prices end in',countEnded:'Special prices have ended',units:['days','hours','min','sec'],seats:'Places in November are limited',seatsSub:'Buy now or hold the special price for 500 ₾'},
 tariffs:{h:'Three plans',note:'Team training is the base of every plan. On top of it: implementing ready-made tools or building your own. The price is fixed before work starts, and everything runs on your accounts.',label:'Plan',from:'from',after:'After 19 November:',sticker:'Participants’ choice',book:'Hold for 500 ₾',
  pay:['Secure payment','Visa · Mastercard · Apple Pay · TBC · Bank of Georgia','Invoice for a company on request','AI tokens and servers run on your account; you pay the providers directly'],
  items:{
   training:{name:'Team training',sub:'Practice on your staff’s real tasks. AI becomes a working skill of the team.',features:['4 hands-on sessions over 1–2 weeks, online or at your office','A programme for your team: documents, requests, data','Working templates and rules for checking results','Guides and session recordings stay with you','Answers to the team’s questions for 30 days'],muted:'You set up integrations yourself',note:['Upgrade within 30 days.','Move to implementation or development and we credit the training fee.'],buy:'Buy training'},
   training_impl:{name:'Training + implementation',sub:'We train your team and launch the first set-up together on real enquiries.',features:['Everything in Team training','Review of your enquiries and choice of the first set-up','We set it up on your accounts: messenger, CRM, notifications','Pilot on real enquiries: 2–4 weeks','Support and adjustments for 60 days'],buy:'Buy and start'},
   training_dev:{name:'Training + development',sub:'We train your team and build a solution for your process when ready-made tools are not enough.',features:['Everything in Team training','Process review and impact estimate before the project quote','AI assistants and agents for enquiries and documents','Internal interfaces, integrations with CRM, 1C, ERP','Testing on samples of your work; from 4 weeks','One month of support after launch'],note:['Base scope: 25 hours of development.','If the task needs more, we agree the extra hours after the review, before work starts.'],buy:'Buy'},
  }},
 bonus:{k:'Bonus for paying within 24 hours',h:'A one-to-one session with Evgeny: 60 minutes on your sales team',until:'Bonus ends in',ended:'The bonus has ended'},
 program:{h:'Training programme',note:'Included in every plan. Each session works on your team’s real tasks.',items:[['01','Task map','Where AI pays off in money and hours, and where a person is needed. We pick the tasks to start with.','Week 1'],['02','Templates on your data','Prompts and guides for your documents, requests and content in Georgian, English and Russian.','Week 1'],['03','Assistant and CRM','We rebuild the workshop set-up for your price list and rules: enquiry, reply, CRM record.','Week 2'],['04','Checks and metrics','Rules for checking replies, an action log and the numbers that show the result.','Week 2']]},
 after:{h:'After payment',items:[['Receipt by email','Right after payment: the receipt and plan confirmation.'],['A curator gets in touch','Within one working day, to clarify the process and agree how results are measured.'],['Start','Training within a week. Implementation pilot: 2–4 weeks. Development: from 4 weeks, price fixed after the review.']]},
 faq:{h:'Questions',items:[['How do these prices compare with the site?','On our site training starts at 1,900 ₾, implementation at 3,200 ₾ and development at 6,700 ₾. Bundles with training cost less for workshop participants until the timer runs out.'],['What else will I pay for?','AI tokens and servers run on your account, and you pay the providers directly. After the included month, ongoing support starts at 550 ₾ a month if you want it.'],['Can I start with training and upgrade later?','Yes. Within 30 days of buying training you can move to Training + implementation or Training + development, and we credit what you have paid.'],['What is the difference between holding and buying?','A 500 ₾ hold keeps the special price and your slot in the schedule for 14 days, and counts towards the price. Buying means full payment and an immediate start.'],['What does the base development scope include?','25 hours of development for your process. We work out how many hours you need at the review; if it is more, we agree and fix the extra before work starts.'],['What happens to our data?','We use enterprise APIs, so your data is not used to train public models. If needed, we deploy the solution inside your own infrastructure.'],['Can a company pay?','Yes. Message us on WhatsApp and we will issue an invoice to your company; the special price holds if you ask before the timer runs out.']]},
 final:{cta:'Choose a plan'},
 sticky:{label:'Limited places',until:'Special prices end in:',d:'d',cta:'Choose a plan'},
 checkout:{buy:'Purchase',book:'Hold',amount:'To pay',bonusPill:'+ one-to-one session with Evgeny (24-hour bonus)',hold:p=>'Holds the special price of '+p+' for 14 days. The 500 ₾ counts towards the price.',hours:'Base scope: 25 hours of development. If more is needed, we agree the extra hours after the review, before work starts.',
  name:'Name',email:'Email for the receipt',emailPh:'your email',phone:'Phone / WhatsApp',methodLabel:'Payment method',methods:{card:['Bank card','Visa · Mastercard · Apple Pay'],tbc:['TBC Pay','TBC Bank'],ipay:['iPay','Bank of Georgia']},
  invalid:'Please check the email and phone.',manual:'We will send a payment link for the chosen method by email and WhatsApp within one working day.',consent:'By clicking the button you agree to the processing of your data.',privacy:'Privacy policy',
  submitBuy:'Place the order',submitBook:'Hold for 500 ₾',sending:'Sending…',error:'Something went wrong. Please try again or message us on WhatsApp.',
  doneBuy:'Order received!',doneBook:'Hold received!',doneText:a=>'Amount to pay: '+a+'. Within one working day we will send the payment link, and a curator will contact you to agree the start.',curator:'Message the curator',close:'Close'},
 foot:{location:'Batumi, Georgia',privacy:'Privacy'},
};

export const offerCopy:Record<'ru'|'en',OfferCopy>={ru,en};
