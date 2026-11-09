// praxenai.ge: commercial page «Чат-бот для бизнеса» (/ru/chatbot, /chatbot, /ka/chatbot).
// Owns the queries «чат-бот для бизнеса», «разработка / создание / заказать чат-бот», «ии чат-бот для бизнеса».
// «Что умеет / сколько стоит» stays with the article whatsapp-telegram-ai-chatbot (linked, not retold);
// «внедрение ИИ в бизнес» stays with the home page. Facts and prices only from the .ge site (lib/pricing.ts, docs/TARIFFS.md).
// Georgian text goes to the owner's team for proofreading.
import type {Copy} from '@/lib/content';
import {money,prices} from '@/lib/pricing';

export type ChatbotPrice={name:Copy;what:Copy;time:Copy;price:'implementation'|'development'|'support';from:boolean;monthly?:boolean};

const im=money(prices.implementation,'gel');

export const chatbotPage:{
 title:Copy;
 description:Copy;
 h1:Copy;lead:Copy;
 channels:{h:Copy;items:{name:Copy;text:Copy}[]};
 abilities:{h:Copy;items:Copy[]};
 handover:{h:Copy;text:Copy};
 steps:{h:Copy;items:{h:Copy;t:Copy}[]};
 pricing:{h:Copy;note:Copy;rows:ChatbotPrice[]};
 faq:[Copy,Copy][];
 links:{href:string;label:Copy}[];
 cta:{h:Copy;text:Copy;button:Copy};
}={
 title:[
  'Чат-бот для бизнеса: разработка под WhatsApp и Telegram',
  'AI chatbot for business: WhatsApp, Telegram and website',
  'ჩატბოტი ბიზნესისთვის: შექმნა WhatsApp‑ისა და Telegram‑ისთვის',
 ],
 description:[
  'Чат-бот для бизнеса с ИИ: отвечает в WhatsApp, Telegram, Instagram и на сайте по вашему прайсу, пишет заявки в CRM. Пилот 2–4 недели, от '+im+'.',
  'AI chatbot for business: replies on WhatsApp, Telegram, Instagram and your website from your price list, logs enquiries in your CRM. Pilot from '+im+'.',
  'AI ჩატბოტი ბიზნესისთვის: პასუხობს WhatsApp‑ში, Telegram‑ში, Instagram‑სა და საიტზე თქვენი ფასებით, მოთხოვნებს CRM‑ში წერს. პილოტი 2–4 კვირა, '+im+'‑დან.',
 ],
 h1:[
  'Чат-бот для бизнеса: отвечает по вашему прайсу и записывает заявки в CRM',
  'Chatbot for business: replies from your price list and logs enquiries in your CRM',
  'ჩატბოტი ბიზნესისთვის: პასუხობს თქვენი ფასებით და მოთხოვნებს CRM‑ში წერს',
 ],
 lead:[
  'Разрабатываем чат-ботов с ИИ для WhatsApp, Telegram, Instagram и сайта. Бот отвечает клиентам на грузинском, русском и английском по ценам и правилам, которые вы утвердили.',
  'We build AI chatbots for WhatsApp, Telegram, Instagram and your website. The bot replies to customers in Georgian, Russian and English, using the prices and rules you have approved.',
  'ვქმნით AI ჩატბოტებს WhatsApp‑ის, Telegram‑ის, Instagram‑ისა და საიტისთვის. ბოტი კლიენტებს ქართულად, რუსულად და ინგლისურად პასუხობს, იმ ფასებითა და წესებით, რომლებიც თქვენ დაამტკიცეთ.',
 ],
 channels:{
  h:['Где работает бот','Where the bot works','სად მუშაობს ბოტი'],
  items:[
   {name:['WhatsApp','WhatsApp','WhatsApp'],text:[
    'Бот работает на номере компании, текущем или новом, через официальный WhatsApp Business API от Meta. Отвечает текстом, кнопками и списками.',
    'The bot runs on your company number, current or new, through Meta’s official WhatsApp Business API. It replies with text, buttons and lists.',
    'ბოტი მუშაობს კომპანიის ნომერზე, არსებულზე ან ახალზე, Meta‑ს ოფიციალური WhatsApp Business API‑ით. პასუხობს ტექსტით, ღილაკებითა და სიებით.',
   ]},
   {name:['Telegram','Telegram','Telegram'],text:[
    'Отдельный бот компании. Клиент открывает его по ссылке, бот отвечает текстом, кнопками и меню.',
    'A separate bot for your company. Customers open it from a link, and it replies with text, buttons and menus.',
    'კომპანიის ცალკე ბოტი. კლიენტი მას ბმულით ხსნის, ბოტი კი ტექსტით, ღილაკებითა და მენიუთი პასუხობს.',
   ]},
   {name:['Instagram','Instagram','Instagram'],text:[
    'Бот отвечает в Direct и в Messenger вашей страницы Facebook. Оба канала подключаются через API Meta.',
    'The bot replies in Instagram Direct and in Messenger on your Facebook page. Both connect through Meta’s API.',
    'ბოტი პასუხობს Instagram‑ის Direct‑ში და თქვენი Facebook გვერდის Messenger‑ში. ორივე არხი Meta‑ს API‑ით უერთდება.',
   ]},
   {name:['Сайт','Website','საიტი'],text:[
    'Окно чата на вашем сайте. Бот берёт ответы из той же базы, что и в мессенджерах, поэтому цены везде одинаковые.',
    'A chat window on your site. The bot uses the same knowledge base as on WhatsApp and Telegram, so prices match everywhere.',
    'ჩატის ფანჯარა თქვენს საიტზე. ბოტი პასუხებს იმავე ბაზიდან იღებს, რაც მესენჯერებში, ამიტომ ფასები ყველგან ერთნაირია.',
   ]},
  ],
 },
 abilities:{
  h:['Что делает бот','What the bot does','რას აკეთებს ბოტი'],
  items:[
   ['Отвечает на вопросы о ценах, наличии, сроках и условиях по прайсу и ответам, которые вы проверили. Чего в них нет, бот не придумывает.',
    'Answers questions about prices, stock, timing and terms from the price list and answers you have checked. It does not make up what is not there.',
    'პასუხობს კითხვებს ფასებზე, მარაგზე, ვადებსა და პირობებზე იმ ფასებითა და პასუხებით, რომლებიც თქვენ შეამოწმეთ. რაც მათში არ არის, ბოტი არ იგონებს.'],
   ['Задаёт клиенту ваши вопросы и собирает заявку: что нужно, объём, сроки, бюджет, телефон или имя пользователя в Telegram.',
    'Asks the customer your questions and collects an enquiry: what is needed, quantity, timing, budget, and a phone number or Telegram username.',
    'აგროვებს მოთხოვნას თქვენი კითხვებით: რა სჭირდება კლიენტს, რა მოცულობით, როდის და რა ბიუჯეტით. იწერს ტელეფონს ან Telegram‑ის სახელს.'],
   ['Предлагает свободное время и записывает клиента в подключённый календарь.',
    'Offers free slots and books the customer into the connected calendar.',
    'სთავაზობს თავისუფალ დროს და კლიენტს დაკავშირებულ კალენდარში ჩაწერს.'],
   ['Создаёт сделку в amoCRM или Битрикс24 и сохраняет в карточке переписку и ответы клиента.',
    'Creates a deal in amoCRM or Bitrix24 and saves the conversation and the customer’s answers on the card.',
    'ქმნის გარიგებას amoCRM‑ში ან Bitrix24‑ში და ბარათში ინახავს მიმოწერასა და კლიენტის პასუხებს.'],
   ['Расшифровывает голосовые сообщения и отвечает на них текстом. Расшифровку на трёх языках проверяем на ваших записях до запуска.',
    'Transcribes voice messages and replies in text. We test transcription in all three languages on your own recordings before launch.',
    'შიფრავს ხმოვან შეტყობინებებს და ტექსტით პასუხობს.'],
   ['Передаёт диалог сотруднику, если клиент просит человека, недоволен или спрашивает то, чего нет в базе.',
    'Hands the chat to a member of staff when the customer asks for a person, is unhappy, or asks something the knowledge base does not cover.',
    'იძახებს თანამშრომელს, თუ კლიენტი ადამიანს ითხოვს, უკმაყოფილოა ან ისეთ რამეს კითხულობს, რაც ბაზაში არ არის.'],
  ],
 },
 handover:{
  h:['Что остаётся за людьми','What stays with your people','რა რჩება ადამიანებს'],
  text:[
   'Скидку, итоговую цену, договор и возврат денег согласует ваш сотрудник. С недовольным клиентом тоже говорит человек. Когда бот передаёт диалог, сотрудник видит всю переписку и продолжает с того места, где бот остановился. Переписки бота сохраняются в журнале. По нему видно, где бот ответил неточно и какой ответ поправить в базе.',
   'Discounts, the final price, contracts and refunds are agreed by your staff, and a person talks to unhappy customers. When the bot hands over, your colleague sees the whole chat and picks up where the bot stopped. Every bot conversation is kept in a log, so you can see where an answer was off and correct it in the knowledge base.',
   'ფასდაკლებას, გარიგების ფასს, ხელშეკრულებას, თანხის დაბრუნებასა და უკმაყოფილო კლიენტთან საუბარს ადამიანი წყვეტს. როცა ბოტი საუბარს გადასცემს, თანამშრომელი მთელ მიმოწერას ხედავს და იქიდან აგრძელებს, სადაც ბოტი გაჩერდა. ბოტის ყველა საუბარი თქვენს ანგარიშზე ინახება: შეგიძლიათ გადაიკითხოთ და პასუხი ბაზაში შეასწოროთ.',
  ],
 },
 steps:{
  h:['Как проходит создание чат-бота','How we build your chatbot','როგორ იქმნება ჩატბოტი'],
  items:[
   {h:['Аудит: 30 минут, бесплатно','Audit: 30 minutes, free','აუდიტი: 30 წუთი, უფასოდ'],t:[
    'Разбираем, о чём и в каких каналах вам пишут клиенты и с каких вопросов боту начать. Договариваемся, по какому показателю оценим пилот: например, по времени ответа или числу заявок из переписки.',
    'We go through what customers ask, in which channels, and which questions the bot should take first. We agree the measure for the pilot, such as reply time or the number of enquiries from chats.',
    'ვნახულობთ, რას და რომელ არხებში გწერენ კლიენტები. ვირჩევთ ბოტის პირველ სცენარს და პილოტის მეტრიკას, მაგალითად პასუხის დროს ან ჩატებიდან მოსული მოთხოვნების რაოდენობას.',
   ]},
   {h:['Предложение','Proposal','შეთავაზება'],t:[
    'До начала работ присылаем письменно сценарий, канал, сроки и цену пилота.',
    'Before work starts, we send the scenario, channel, timeline and pilot price in writing.',
    'სცენარი, არხი, ვადები და პილოტის ფასი წერილობით, სამუშაოს დაწყებამდე.',
   ]},
   {h:['Пилот: 2–4 недели','Pilot: 2–4 weeks','პილოტი: 2–4 კვირა'],t:[
    'Собираем прайс и ответы, подключаем один канал и CRM. Сначала проверяем бота на ваших прошлых вопросах, затем он отвечает реальным клиентам, а ваш сотрудник читает ответы и отмечает ошибки.',
    'We collect prices and answers and connect one channel and your CRM. First we test the bot on your past questions, then it replies to real customers while a member of your team reads its replies and marks mistakes.',
    'ვაგროვებთ ფასებსა და პასუხებს, ვაკავშირებთ ერთ არხს და CRM‑ს. ბოტი რეალურ კლიენტებს პასუხობს, თქვენი თანამშრომელი კი მის პასუხებს კითხულობს და შეცდომებს ნიშნავს.',
   ]},
   {h:['Запуск','Launch','გაშვება'],t:[
    'Если пилот достиг цели, о которой договорились на аудите, подключаем остальные каналы и сценарии. Доступы, настройки и инструкции передаём вам.',
    'If the pilot hits its target, we add the other channels and scenarios. We hand over access, settings and instructions.',
    'თუ პილოტმა მეტრიკას მიაღწია, ვამატებთ დანარჩენ არხებსა და სცენარებს. წვდომებს, პარამეტრებსა და ინსტრუქციებს თქვენ გადმოგცემთ.',
   ]},
  ],
 },
 pricing:{
  h:['Цена и сроки разработки','Prices and timelines','ფასები და ვადები'],
  note:[
   'Токены ИИ, серверы и платные сообщения WhatsApp в эти цены не входят: компания оплачивает их провайдерам напрямую.',
   'AI tokens, servers and paid WhatsApp messages are not included: your company pays the providers for them directly.',
   'ფასები ჩვენს სამუშაოს მოიცავს: ერთჯერადად გაშვებისთვის და ყოველთვიურად მომსახურებისთვის. AI ტოკენებს, სერვერებსა და ფასიან WhatsApp შეტყობინებებს პირდაპირ პროვაიდერებს უხდით, კომპანიის ანგარიშებზე.',
  ],
  rows:[
   {name:['Внедрение инструментов','Tool implementation','ინსტრუმენტების დანერგვა'],
    what:['Бот с вашими ответами и прайсом в одном канале, заявки в amoCRM или Битрикс24','A bot with your answers and price list on one channel, enquiries logged in amoCRM or Bitrix24','ბოტი თქვენი პასუხებითა და ფასებით ერთ არხზე, მოთხოვნები amoCRM‑ში ან Bitrix24‑ში'],
    time:['пилот 2–4 недели','2–4 week pilot','პილოტი 2–4 კვირა'],price:'implementation',from:true},
   {name:['Разработка решения','Custom development','ინდივიდუალური შემუშავება'],
    what:['Своя логика: расчёт стоимости по вашим правилам, связь с 1С, системой бронирования или программой записи, свой интерфейс','Your own logic: pricing by your rules, links to 1C, a booking system or appointment software, a custom interface','საკუთარი ლოგიკა: ფასის გამოთვლა თქვენი წესებით, კავშირი 1C‑სთან, დაჯავშნის ან ჩაწერის სისტემასთან, საკუთარი ინტერფეისი'],
    time:['от 4 недель','from 4 weeks','4 კვირიდან'],price:'development',from:true},
   {name:['Дополнительное ведение','Ongoing maintenance','დამატებითი მომსახურება'],
    what:['По желанию: обновление прайса и ответов, разбор переписок с ошибками, новые сценарии','Optional: price and answer updates, reviews of chats with mistakes, new scenarios','ფასებისა და პასუხების განახლება, შეცდომების გარჩევა, ახალი სცენარები'],
    time:['после запуска','after launch','გაშვების შემდეგ'],price:'support',from:true,monthly:true},
  ],
 },
 faq:[
  [['Можно начать с одного канала и добавить остальные позже?','Can we start with one channel and add others later?','შეიძლება ერთი არხით დავიწყოთ და დანარჩენი მოგვიანებით დავამატოთ?'],
   ['Да, так и начинаем: пилот идёт в канале, где больше всего обращений. Новые каналы подключаются к той же базе ответов, собирать её заново не нужно.',
    'Yes, that is how we start: the pilot runs in the channel with the most messages. New channels connect to the same knowledge base, so it does not need to be rebuilt.',
    'დიახ, ასე ვიწყებთ: პილოტი იმ არხში მიდის, სადაც ყველაზე მეტი მიმართვაა. ახალი არხები იმავე ცოდნის ბაზას უერთდება, მისი თავიდან აწყობა საჭირო არ არის.']],
  [['У нас уже есть бот на кнопках. Его можно доработать?','We already have a button bot. Can you improve it?','უკვე გვაქვს ღილაკებიანი ბოტი. შეიძლება მისი გაუმჯობესება?'],
   ['На аудите смотрим, на какой платформе он работает и можно ли подключить к нему ИИ и CRM. Если нельзя, переносим меню и готовые ответы в новый бот, и они становятся частью базы знаний.',
    'At the audit we check which platform it runs on and whether AI and your CRM can be connected to it. If they cannot, we move the menus and existing answers into a new bot, where they become part of the knowledge base.',
    'აუდიტზე ვნახავთ, რა პლატფორმაზეა გაკეთებული. თუ პლატფორმას API აქვს, ბოტს AI პასუხებსა და CRM‑ს ვუერთებთ. თუ არა, მენიუსა და პასუხებს ახალ ბოტში გადავიტანთ.']],
  [['Сможем ли мы сами менять цены и ответы?','Can we change prices and answers ourselves?','შეგვიძლია ფასები და პასუხები თავად შევცვალოთ?'],
   ['Да. Прайс и ответы лежат в базе знаний, к которой у вашей команды есть доступ. При запуске показываем вашему сотруднику, как её обновлять. Если удобнее, обновления берём на себя в рамках ведения.',
    'Yes. Prices and answers sit in a knowledge base your team can access. At launch we show a member of your staff how to update it. If you prefer, we handle updates as part of maintenance.',
    'დიახ. ფასები და პასუხები ცოდნის ბაზაშია, თქვენს ანგარიშზე, და თქვენს თანამშრომელს მასზე წვდომა აქვს. ბაზაში ფასს შეცვლით და ბოტი ახალი ფასით უპასუხებს. როგორ კეთდება ეს, გაშვებისას გაჩვენებთ.']],
  [['Кому принадлежит бот после запуска?','Who owns the bot after launch?','ვის ეკუთვნის ბოტი გაშვების შემდეგ?'],
   ['Вашей компании. Бот, база ответов, номер WhatsApp и история переписок оформлены на ваши аккаунты. Когда проект передан, наш доступ закрывается.',
    'Your company. The bot, the knowledge base, the WhatsApp number and the chat history are on your accounts. Once the project is handed over, our access ends.',
    'თქვენს კომპანიას. ბოტი, ცოდნის ბაზა, WhatsApp ნომერი და მიმოწერის ისტორია თქვენს ანგარიშებზეა. პროექტის გადაცემის შემდეგ ჩვენი წვდომა იხურება.']],
  [['Что нужно от нас, чтобы заказать чат-бот?','What do you need from us to order a chatbot?','რა გვჭირდება ჩატბოტის შესაკვეთად?'],
   ['Прайс, ответы на частые вопросы, доступ к каналу и к CRM, если она есть. Ещё нужен сотрудник, который знает ваши цены: на пилоте он проверяет ответы бота.',
    'Your price list, answers to common questions, and access to the channel and to your CRM if you have one. You also need one person who knows your prices: during the pilot they check the bot’s replies.',
    'ფასები, ხშირ კითხვებზე პასუხები და წვდომა არხსა და CRM‑ზე. ასევე ერთი თანამშრომელი, რომელმაც თქვენი ფასები იცის: პილოტის დროს ის ბოტის პასუხებს ამოწმებს.']],
 ],
 links:[
  {href:'/blog/whatsapp-telegram-ai-chatbot',label:['Что умеет чат-бот с ИИ и сколько стоит','What an AI chatbot does and what it costs','რა შეუძლია AI ჩატბოტს და რა ღირს']},
  {href:'/departments/sales',label:['ИИ для отдела продаж','AI for sales','AI გაყიდვებისთვის']},
  {href:'/departments/support',label:['ИИ для клиентского сервиса','AI for customer support','AI კლიენტების მხარდაჭერისთვის']},
  {href:'/solutions',label:['Все форматы и цены','All formats and prices','ყველა ფორმატი და ფასი']},
 ],
 cta:{
  h:['Бесплатный аудит за 30 минут','Free 30-minute audit','უფასო აუდიტი 30 წუთში'],
  text:[
   'Покажите на звонке несколько типичных переписок с клиентами. Подскажем, с какого канала и сценария начать пилот.',
   'Show us a few typical customer chats on the call. We will suggest which channel and scenario to start the pilot with.',
   'გვითხარით, სად და რაზე გწერენ კლიენტები. შევარჩევთ პილოტის სცენარსა და არხს, ვადებსა და ფასს კი შეთავაზებაში გამოგიგზავნით.',
  ],
  button:['Записаться на бесплатный аудит','Book a free audit','ჩაეწერეთ უფასო აუდიტზე'],
 },
};
