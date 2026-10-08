import type {Copy} from './content';

// Search titles and descriptions for the home page and section pages, per language [ru, en, ka].
export const sectionMeta:Record<string,{title:Copy;description:Copy}>={
 home:{
  title:['Внедрение ИИ в бизнес в Грузии: чат-боты и ИИ-агенты — Praxen AI','AI for business in Georgia: chatbots and AI agents — Praxen AI','AI ბიზნესისთვის: ჩატბოტები და AI აგენტები — Praxen AI'],
  description:['Чат-боты для WhatsApp и Telegram, ИИ-агенты для CRM и документов, обучение сотрудников. Батуми, Тбилиси и вся Грузия, бесплатный аудит, внедрение от 3 200 ₾.','AI automation agency in Batumi and Tbilisi: WhatsApp and Telegram chatbots, AI agents for CRM and documents, team training. Free audit, implementation from 3,200 ₾.','ხელოვნური ინტელექტის დანერგვა საქართველოში: ქართულად მოსაუბრე AI ჩატბოტები WhatsApp-ისა და Telegram-ისთვის, AI აგენტები CRM-ისთვის, გუნდის სწავლება. უფასო აუდიტი, დანერგვა 3 200 ₾-დან.'],
 },
 industries:{
  title:['ИИ и чат-боты для бизнеса по отраслям в Грузии — Praxen AI','AI and chatbots for every industry in Georgia — Praxen AI','AI და ჩატბოტები ინდუსტრიებისთვის საქართველოში — Praxen AI'],
  description:['Готовые сценарии ИИ для 12 отраслей: отели, клиники, рестораны, ритейл, логистика, производство. Выберите свою и узнайте, где ИИ окупится быстрее всего.','Ready AI workflows for 12 industries: hotels, clinics, restaurants, retail, logistics and manufacturing. Pick yours and see where AI pays off first.','მზა AI სცენარები 12 ინდუსტრიისთვის: სასტუმროები, კლინიკები, რესტორნები, რითეილი, ლოჯისტიკა, წარმოება.'],
 },
 departments:{
  title:['ИИ-агенты для отделов: продажи, поддержка, финансы, HR — Praxen AI','AI agents for business: sales, support, finance and HR — Praxen AI','AI აგენტები განყოფილებებისთვის: გაყიდვები, მხარდაჭერა — Praxen AI'],
  description:['ИИ-агенты для продаж, поддержки, бухгалтерии, HR, маркетинга и закупок: квалификация лидов, чат-боты в мессенджерах, разбор документов. Начните с одного отдела.','AI agents for sales, support, accounting, HR, marketing and procurement: lead qualification, messenger chatbots and document processing. Start with one team.','AI აგენტები გაყიდვებისთვის, მხარდაჭერისთვის, ბუღალტერიისთვის, HR-ისთვის და მარკეტინგისთვის: ლიდების კვალიფიკაცია, ჩატბოტები მესენჯერებში, დოკუმენტები.'],
 },
 training:{
  title:['Обучение ИИ и нейросетям для сотрудников в Грузии — Praxen AI','AI training and workshops for teams in Georgia — Praxen AI','AI ტრენინგი და ვორქშოპები გუნდებისთვის საქართველოში — Praxen AI'],
  description:['Практические воркшопы по ИИ на задачах вашей команды: шаблоны, промпты и правила проверки результата. Онлайн или в офисе, от 1 недели, от 1 900 ₾.','Hands-on AI workshops and a practical AI course built on your team’s real tasks: templates, prompts and review rules. Online or on-site in Batumi and Tbilisi, from 1,900 ₾.','ხელოვნური ინტელექტის პრაქტიკული ტრენინგი და AI ვორქშოპები თქვენი გუნდის ამოცანებზე: შაბლონები, პრომპტები და შემოწმების წესები. ონლაინ ან ოფისში, 1 900 ₾-დან.'],
 },
 solutions:{
  title:['Стоимость внедрения ИИ в Грузии: форматы и цены — Praxen AI','AI implementation cost in Georgia: formats and prices — Praxen AI','AI-ს დანერგვის ფასი საქართველოში: ფორმატები და ფასები — Praxen AI'],
  description:['Обучение от 1 900 ₾, внедрение под процесс от 3 200 ₾, разработка от 6 700 ₾, дополнительное ведение от 550 ₾ в месяц. Калькулятор экономии и бесплатный аудит.','Training from 1,900 ₾, implementation from 3,200 ₾, custom development from 6,700 ₾, ongoing maintenance from 550 ₾ a month. A savings calculator and a free audit.','სწავლება 1 900 ₾-დან, დანერგვა 3 200 ₾-დან, შემუშავება 6 700 ₾-დან, დამატებითი მომსახურება 550 ₾-დან თვეში. დანაზოგის კალკულატორი და უფასო აუდიტი.'],
 },
 cases:{
  title:['Примеры внедрения ИИ в бизнес в Грузии — Praxen AI','AI implementation examples for businesses in Georgia — Praxen AI','AI-ს დანერგვის მაგალითები ბიზნესში — Praxen AI'],
  description:['Как ИИ работает в отелях, оптовой торговле и недвижимости: ситуация, решение и то, как измеряем результат. Сценарии для компаний в Грузии.','How AI works in hotels, wholesale and real estate: the situation, the solution and how we measure the result. Scenarios for companies in Georgia.','როგორ მუშაობს AI სასტუმროებში, საბითუმო ვაჭრობასა და უძრავ ქონებაში: სიტუაცია, გადაწყვეტა და შედეგის მეტრიკა.'],
 },
 blog:{
  title:['Блог Praxen AI: ИИ для бизнеса в Грузии — цены и примеры','Praxen AI blog: AI for business in Georgia — prices and examples','Praxen AI ბლოგი: AI ბიზნესისთვის საქართველოში'],
  description:['Статьи о внедрении ИИ в Грузии: чат-боты для WhatsApp и Telegram, ИИ для отелей и клиник, заявки на недвижимость в Батуми, цены в лари.','Articles on AI for companies in Georgia: WhatsApp and Telegram chatbots, AI for hotels and clinics, property enquiries in Batumi, prices in lari.','სტატიები AI-ს დანერგვაზე საქართველოში: ჩატბოტები WhatsApp-ისა და Telegram-ისთვის, AI სასტუმროებისა და კლინიკებისთვის, უძრავი ქონება ბათუმში, ფასები ლარში.'],
 },
 about:{
  title:['О компании Praxen AI: внедрение ИИ в Грузии — Praxen AI','About Praxen AI: AI implementation in Georgia — Praxen AI','Praxen AI-ის შესახებ: AI-ს დანერგვა საქართველოში — Praxen AI'],
  description:['Команда из Батуми: внедряем ИИ-ассистентов, ИИ-агентов и автоматизацию для компаний по всей Грузии на грузинском, английском и русском. Один ответственный от аудита до запуска.','A Batumi-based team building AI assistants, AI agents and automation for companies across Georgia in Georgian, English and Russian. One accountable lead from audit to launch.','გუნდი ბათუმიდან: ვნერგავთ AI ასისტენტებს, AI აგენტებს და ავტომატიზაციას კომპანიებისთვის მთელ საქართველოში, ქართულ, ინგლისურ და რუსულ ენებზე.'],
 },
 security:{
  title:['Безопасность данных при внедрении ИИ — Praxen AI','Data security in AI implementation — Praxen AI','მონაცემთა უსაფრთხოება AI-ს დანერგვისას — Praxen AI'],
  description:['Enterprise API без обучения на ваших данных, развёртывание в вашем контуре, доступы по ролям, журнал действий ИИ и работа по Закону Грузии о защите персональных данных.','Enterprise APIs that do not train on your data, deployment in your own environment, role-based access, a log of AI actions and work under the Georgian personal data law.','Enterprise API თქვენს მონაცემებზე სწავლების გარეშე, თქვენს გარემოში განთავსება, როლებზე დაფუძნებული წვდომა, AI-ს მოქმედებების ჟურნალი და მუშაობა პერსონალურ მონაცემთა დაცვის კანონით.'],
 },
 partners:{
  title:['Партнёрская программа по внедрению ИИ — Praxen AI','AI implementation partner programme — Praxen AI','AI დანერგვის პარტნიორული პროგრამა — Praxen AI'],
  description:['Для интеграторов 1С и CRM, агентств, бухгалтерских фирм и консультантов в Грузии: приводите клиентов, мы внедряем ИИ, вы получаете вознаграждение.','For 1C and CRM integrators, agencies, accounting firms and consultants in Georgia: refer clients, we implement AI, you earn a reward.','1C და CRM ინტეგრატორებისთვის, სააგენტოებისთვის, საბუღალტრო ფირმებისა და კონსულტანტებისთვის საქართველოში: მოიყვანეთ კლიენტი და მიიღეთ ანაზღაურება.'],
 },
 privacy:{
  title:['Политика конфиденциальности — Praxen AI','Privacy policy — Praxen AI','კონფიდენციალურობის პოლიტიკა — Praxen AI'],
  description:['Какие данные собирает Praxen AI, зачем, кому передаёт и как долго хранит. Ваши права по закону Грузии о защите персональных данных.','What data Praxen AI collects, why, who receives it and how long we keep it. Your rights under the Georgian personal data protection law.','რა მონაცემებს აგროვებს Praxen AI, რისთვის, ვის გადასცემს და რამდენ ხანს ინახავს. თქვენი უფლებები საქართველოს კანონით.'],
 },
};
