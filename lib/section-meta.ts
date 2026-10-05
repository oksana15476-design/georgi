import type {Copy} from './content';

// Search titles and descriptions for the home page and section pages, per language [ru, en, ka].
export const sectionMeta:Record<string,{title:Copy;description:Copy}>={
 home:{
  title:['Praxis AI — внедрение ИИ для бизнеса в Грузии','Praxis AI — AI implementation for businesses in Georgia','Praxis AI — AI-ს დანერგვა ბიზნესისთვის საქართველოში'],
  description:['ИИ-ассистенты для WhatsApp и Telegram, автоматизация CRM и документов, обучение команд. Бесплатный аудит, цены от 1 900 ₾. Работаем на грузинском, английском и русском.','AI assistants for WhatsApp and Telegram, CRM and document automation, team training. Free audit, prices from 1,900 ₾. We work in Georgian, English and Russian.','AI ასისტენტები WhatsApp-ისა და Telegram-ისთვის, CRM-ისა და დოკუმენტების ავტომატიზაცია, გუნდის სწავლება. უფასო აუდიტი, ფასი 1 900 ₾-დან.'],
 },
 industries:{
  title:['ИИ для бизнеса по отраслям в Грузии — Praxis AI','AI for every industry in Georgia — Praxis AI','AI ინდუსტრიებისთვის საქართველოში — Praxis AI'],
  description:['Готовые сценарии ИИ для 12 отраслей: отели, клиники, рестораны, ритейл, логистика, производство. Выберите свою и узнайте, где ИИ окупится быстрее всего.','Ready AI workflows for 12 industries: hotels, clinics, restaurants, retail, logistics and manufacturing. Pick yours and see where AI pays off first.','მზა AI სცენარები 12 ინდუსტრიისთვის: სასტუმროები, კლინიკები, რესტორნები, რითეილი, ლოჯისტიკა, წარმოება.'],
 },
 departments:{
  title:['ИИ для отделов: продажи, поддержка, финансы — Praxis AI','AI for sales, support, finance and HR — Praxis AI','AI განყოფილებებისთვის: გაყიდვები, მხარდაჭერა — Praxis AI'],
  description:['ИИ-агенты для продаж, поддержки, бухгалтерии, HR, маркетинга и закупок: квалификация лидов, голосовые ассистенты, разбор документов. Начните с одного отдела.','AI agents for sales, support, accounting, HR, marketing and procurement: lead qualification, voice assistants and document processing. Start with one team.','AI აგენტები გაყიდვებისთვის, მხარდაჭერისთვის, ბუღალტერიისთვის, HR-ისთვის და მარკეტინგისთვის: ლიდების კვალიფიკაცია, ხმოვანი ასისტენტები, დოკუმენტები.'],
 },
 training:{
  title:['Обучение команды работе с ИИ в Грузии — Praxis AI','AI training for teams in Georgia — Praxis AI','გუნდის AI სწავლება საქართველოში — Praxis AI'],
  description:['Практические воркшопы по ИИ на задачах вашей команды: шаблоны, промпты и правила проверки результата. Онлайн или в офисе, от 1 недели, от 1 900 ₾.','Hands-on AI workshops built on your team’s real tasks: templates, prompts and review rules. Online or on-site, from 1 week, from 1,900 ₾.','პრაქტიკული AI ვორქშოპები თქვენი გუნდის ამოცანებზე: შაბლონები, პრომპტები და შემოწმების წესები. ონლაინ ან ოფისში, 1 900 ₾-დან.'],
 },
 solutions:{
  title:['Внедрение ИИ в бизнес: форматы, цены и сроки — Praxis AI','AI implementation: formats, prices and timelines — Praxis AI','AI-ს დანერგვა: ფორმატები, ფასები და ვადები — Praxis AI'],
  description:['Обучение от 1 900 ₾, внедрение готовых инструментов от 3 200 ₾, собственная разработка от 6 700 ₾. Калькулятор экономии и бесплатный аудит процессов.','Training from 1,900 ₾, tool implementation from 3,200 ₾, custom development from 6,700 ₾. A savings calculator and a free process audit.','სწავლება 1 900 ₾-დან, ინსტრუმენტების დანერგვა 3 200 ₾-დან, შემუშავება 6 700 ₾-დან. დანაზოგის კალკულატორი და უფასო აუდიტი.'],
 },
 cases:{
  title:['Примеры внедрения ИИ в бизнес — Praxis AI','AI implementation examples — Praxis AI','AI-ს დანერგვის მაგალითები — Praxis AI'],
  description:['Как ИИ работает в отелях, оптовой торговле и недвижимости: ситуация, решение и то, как измеряем результат. Сценарии для компаний в Грузии.','How AI works in hotels, wholesale and real estate: the situation, the solution and how we measure the result. Scenarios for companies in Georgia.','როგორ მუშაობს AI სასტუმროებში, საბითუმო ვაჭრობასა და უძრავ ქონებაში: სიტუაცია, გადაწყვეტა და შედეგის მეტრიკა.'],
 },
 partners:{
  title:['Партнёрская программа по внедрению ИИ — Praxis AI','AI implementation partner programme — Praxis AI','AI დანერგვის პარტნიორული პროგრამა — Praxis AI'],
  description:['Для интеграторов 1С и CRM, агентств, бухгалтерских фирм и консультантов в Грузии: приводите клиентов, мы внедряем ИИ, вы получаете вознаграждение.','For 1C and CRM integrators, agencies, accounting firms and consultants in Georgia: refer clients, we implement AI, you earn a reward.','1C და CRM ინტეგრატორებისთვის, სააგენტოებისთვის, საბუღალტრო ფირმებისა და კონსულტანტებისთვის საქართველოში: მოიყვანეთ კლიენტი და მიიღეთ ანაზღაურება.'],
 },
 privacy:{
  title:['Политика конфиденциальности — Praxis AI','Privacy policy — Praxis AI','კონფიდენციალურობის პოლიტიკა — Praxis AI'],
  description:['Какие данные собирает Praxis AI, зачем, кому передаёт и как долго хранит. Ваши права по закону Грузии о защите персональных данных.','What data Praxis AI collects, why, who receives it and how long we keep it. Your rights under the Georgian personal data protection law.','რა მონაცემებს აგროვებს Praxis AI, რისთვის, ვის გადასცემს და რამდენ ხანს ინახავს. თქვენი უფლებები საქართველოს კანონით.'],
 },
};
