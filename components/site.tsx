'use client';
import {useCallback,useEffect,useState} from 'react';
import {base} from '@/lib/base';
import {departments,industries,t,Lang} from '@/lib/content';
import {solutionChoices} from '@/lib/solution-choices';
import type {PageData} from '@/lib/page-data';
import {contacts} from '@/lib/contacts';
import {copyFn,sectionLabel,siteCopy} from '@/lib/site-copy';
import {Header} from '@/components/praxen/header';
import {Hero,Marquee,Results} from '@/components/praxen/home';
import {CaseExamples,DepartmentsGrid,Formats,IndustriesGrid,InnerHero,Process,SolutionExamples,Trust} from '@/components/praxen/inner';
import {DetailAnswer,DetailHero,Related,Scenarios,Tested} from '@/components/praxen/detail';
import {Contact,Faq} from '@/components/praxen/contact';
import {Icon} from '@/components/praxen/icon';
import {AuditReport,Calculator,Partners} from '@/components/praxen/growth';
import {Privacy} from '@/components/praxen/privacy';
import {Team} from '@/components/praxen/team';
import {Flag,MotionRoot,Wordmark,scrollToId} from '@/components/praxen/ui';
import type {X} from '@/components/praxen/types';
import {pageJsonLd} from '@/lib/seo';

type Props={lang?:Lang;section?:string;slug?:string;data?:PageData};

export default function Site({lang='en',section='home',slug,data={}}:Props){
 const c=copyFn(lang);
 const profile=data.profile;
 const ent=slug?(industries.find(i=>i.slug===slug)||departments.find(i=>i.slug===slug)):undefined;
 const isDetail=!!(profile&&ent),isHome=section==='home'&&!isDetail,isPrivacy=section==='privacy',isPartners=section==='partners',isList=!isHome&&!isDetail&&!isPrivacy&&!isPartners;
 const s=siteCopy(c,isDetail?slug:undefined);
 const root=base+'/'+lang,link=(p:string)=>root+'/'+p;
 const rest=(section==='home'?'':'/'+section)+(slug?'/'+slug:'');
 const [context,setContext]=useState(ent?t(ent.name,lang):'');
 const [menu,setMenu]=useState(false),[sticky,setSticky]=useState(false);
 useEffect(()=>{
  const onScroll=()=>setSticky(window.scrollY>480);onScroll();
  window.addEventListener('scroll',onScroll,{passive:true});return()=>window.removeEventListener('scroll',onScroll);
 },[]);
 const toContact=useCallback((e?:React.MouseEvent)=>{e?.preventDefault();setMenu(false);setTimeout(()=>scrollToId('contact'),20)},[]);
 const go=(value:string)=>{setContext(value);setMenu(false);setTimeout(()=>scrollToId('contact'),30)};
 const x:X={lang,c,s,link,go,toContact,data};

 const ov=data.ov;
 const costAnswer=c('Обучение команды — от 1 900 ₾ ($700), внедрение готовых инструментов под ваш процесс — от 3 200 ₾ ($1 200), разработка решения — от 6 700 ₾ ($2 500), сопровождение по желанию — от 550 ₾ ($200) в месяц. Решение работает на ваших аккаунтах: токены ИИ и серверы оплачиваются провайдерам напрямую. Аудит бесплатный, цену пилота фиксируем до старта работ.','Team training from 1,900 ₾ ($700), tool implementation for your process from 3,200 ₾ ($1,200), custom development from 6,700 ₾ ($2,500), optional support from 550 ₾ ($200) a month. The solution runs on your accounts: AI tokens and servers are paid directly to the providers. The audit is free, and we fix the pilot price before work begins.','გუნდის სწავლება — 1 900 ₾‑დან ($700), ინსტრუმენტების დანერგვა თქვენს პროცესზე — 3 200 ₾‑დან ($1 200), ინდივიდუალური შემუშავება — 6 700 ₾‑დან ($2 500), მხარდაჭერა სურვილისამებრ — 550 ₾‑დან ($200) თვეში. გადაწყვეტა თქვენს ანგარიშებზე მუშაობს: AI ტოკენები და სერვერები პირდაპირ პროვაიდერებს გადაეხდებათ. აუდიტი უფასოა, პილოტის ფასს სამუშაოს დაწყებამდე ვაფიქსირებთ.');
 const aboutFaq:[string,string]=[c('Что такое Praxen AI?','What is Praxen AI?','რა არის Praxen AI?'),c('Praxen AI — компания по внедрению искусственного интеллекта в бизнес в Грузии. Мы делаем ИИ-ассистентов и чат-ботов для WhatsApp, Telegram и сайта, внедряем ИИ-агентов, которые заполняют CRM и обрабатывают документы, и обучаем сотрудников работе с нейросетями. Работаем с компаниями в Тбилиси и по всей Грузии, очно и удалённо, на грузинском, английском и русском. Начинаем с бесплатного аудита. Обучение команды — от 1 900 ₾, внедрение под процесс — от 3 200 ₾, пилот на одном процессе — от 2 недель.','Praxen AI is an AI implementation company in Georgia. We build AI assistants and chatbots for WhatsApp, Telegram and websites, deploy AI agents that update your CRM and process documents, and train teams to use AI. We work with companies in Tbilisi and across Georgia, on site and remotely, in Georgian, English and Russian. Every project starts with a free audit. Team training starts at 1,900 ₾, implementation for your process at 3,200 ₾, and a pilot on one workflow takes from 2 weeks.','Praxen AI არის ხელოვნური ინტელექტის ბიზნესში დანერგვის კომპანია საქართველოში. ვქმნით AI ასისტენტებსა და ჩატბოტებს WhatsApp‑ისთვის, Telegram‑ისთვის და საიტისთვის, ვნერგავთ AI აგენტებს, რომლებიც ავსებენ CRM‑ს და ამუშავებენ დოკუმენტებს, და ვასწავლით თანამშრომლებს AI‑ით მუშაობას. ვმუშაობთ კომპანიებთან თბილისსა და მთელ საქართველოში, ადგილზე და დისტანციურად, ქართულ, ინგლისურ და რუსულ ენებზე. ვიწყებთ უფასო აუდიტით. გუნდის სწავლება — 1 900 ₾‑დან, დანერგვა თქვენს პროცესზე — 3 200 ₾‑დან, პილოტი ერთ პროცესზე — 2 კვირიდან.')];
 // A question people ask in Google ("People also ask"), see SEMANTIC-CORE.md.
 const agentFaq:[string,string]=[c('Как внедрить ИИ-агента в бизнес?','How do we bring an AI agent into the business?','როგორ დავნერგოთ AI აგენტი ბიზნესში?'),c('Начинаем с одного процесса, где много повторяющейся работы и есть понятная метрика: заявки, ответы клиентам или документы. На бесплатном аудите выбираем процесс и точки проверки. Затем 2–4 недели агент работает на ваших реальных данных: сначала предлагает действия сотруднику, потом выполняет их сам. Если пилот достиг метрики, подключаем следующие процессы.','We start with one workflow that has a lot of repetitive work and a clear metric: enquiries, customer replies or documents. The free audit picks the workflow and the review points. Then the agent works on your real data for 2–4 weeks, first suggesting actions to staff, then carrying them out itself. If the pilot hits its metric, we connect the next workflows.','ვიწყებთ ერთი პროცესით, სადაც ბევრი განმეორებადი სამუშაოა და მკაფიო მეტრიკა: მოთხოვნები, კლიენტებთან მიმოწერა ან დოკუმენტები. უფასო აუდიტზე ვირჩევთ პროცესს და შემოწმების წერტილებს. შემდეგ 2–4 კვირა აგენტი თქვენს რეალურ მონაცემებზე მუშაობს: ჯერ თანამშრომელს სთავაზობს მოქმედებებს, შემდეგ თავად ასრულებს. თუ პილოტმა მეტრიკას მიაღწია, შემდეგ პროცესებს ვაკავშირებთ.')];
 const genFaq:[string,string][]=[aboutFaq,[c('Сколько стоит внедрение?','How much does implementation cost?','რა ღირს დანერგვა?'),costAnswer],agentFaq,[c('Можно заказать только обучение?','Can we book training only?','შეიძლება მხოლოდ სწავლება?'),c('Да. Обучение — самостоятельная услуга. Программу строим вокруг задач вашей команды.','Yes. Training is a standalone service built around your team’s tasks.','დიახ. სწავლება დამოუკიდებელი მომსახურებაა თქვენი გუნდის ამოცანებზე.')],[c('Придётся менять наши системы?','Will we need to replace our systems?','სისტემების შეცვლა დაგვჭირდება?'),c('Сначала изучим текущие инструменты. Возможность интеграции зависит от их функций и доступов.','We assess your existing tools first. Integration depends on their capabilities and available access.','ჯერ ვსწავლობთ არსებულ ინსტრუმენტებს. ინტეგრაცია მათ შესაძლებლობებზეა დამოკიდებული.')],[c('Что, если ИИ ошибётся?','What if AI makes a mistake?','თუ AI შეცდება?'),c('Заранее определим точки проверки, протестируем типовые и сложные ситуации. Важные решения остаются за сотрудником.','We define review points and test routine and difficult scenarios. Important decisions remain with your people.','ვადგენთ შემოწმების წერტილებს. მნიშვნელოვანი გადაწყვეტილებები თანამშრომელთან რჩება.')],[c('На каких языках проходит работа?','Which languages can we work in?','რომელ ენებზე ვმუშაობთ?'),c('Проектируем решения для общения на грузинском, английском и русском. Качество ответов проверяем на ваших сценариях. Обучение команды проводим на русском и английском; грузинский формат согласуем отдельно.','We design solutions for Georgian, English and Russian and evaluate answers on your use cases. Team training is available in Russian and English; Georgian delivery is agreed separately.','კონსულტაცია და სწავლება ხელმისაწვდომია რუსულად და ინგლისურად. ქართულ ენაზე მუშაობა შეთანხმდება პროექტის მიხედვით.')]];
 const deptFaq:[string,string][]=[
  [c('С какого отдела лучше начать?','Which department should we start with?','რომელი განყოფილებით დავიწყოთ?'),c('С того, где много повторяющихся обращений или документов и есть понятная метрика: обычно это продажи, поддержка или бэк-офис. На аудите сравним варианты по эффекту и сложности.','Where there are many repetitive requests or documents and a clear metric — usually sales, support or the back office. The audit compares options by impact and effort.','იქ, სადაც ბევრი განმეორებადი მოთხოვნა ან დოკუმენტია და მკაფიო მეტრიკა — ჩვეულებრივ გაყიდვები, მხარდაჭერა ან ბექ‑ოფისი.')],
  [c('Как масштабировать ИИ на другие отделы?','How do we scale AI to other departments?','როგორ გავავრცელოთ AI სხვა განყოფილებებზე?'),c('Первый пилот закладывает базу знаний, интеграции и правила доступа. Следующие отделы подключаются к ним, поэтому каждое новое внедрение быстрее и дешевле.','The first pilot sets up the knowledge base, integrations and access rules. Other teams plug into them, so each next rollout is faster and cheaper.','პირველი პილოტი ქმნის ცოდნის ბაზას, ინტეგრაციებსა და წვდომის წესებს. შემდეგი განყოფილებები მათ უერთდება.')],
  [c('Нужна ли отдельная система для каждого отдела?','Do we need a separate system per department?','საჭიროა ცალკე სისტემა თითოეული განყოფილებისთვის?'),c('Нет. Ассистенты работают на общей платформе с разграничением прав, а интерфейс для отдела — привычный: CRM, helpdesk или мессенджер.','No. Assistants share one platform with role-based access, while each team keeps its familiar interface — CRM, helpdesk or messenger.','არა. ასისტენტები მუშაობენ ერთ პლატფორმაზე როლური წვდომით, ინტერფეისი კი ნაცნობია — CRM, helpdesk ან მესენჯერი.')],
  [c('Сколько стоит внедрение?','How much does implementation cost?','რა ღირს დანერგვა?'),costAnswer],
  [c('Кто поддерживает решение после запуска?','Who supports the solution after launch?','ვინ უჭერს მხარს გაშვების შემდეგ?'),c('Решение работает на ваших аккаунтах и серверах: токены ИИ и инфраструктуру вы оплачиваете провайдерам напрямую. Мы передаём доступы, код и инструкции и обучаем ответственных. Сопровождение — по желанию, от 550 ₾ в месяц: обновляем базу знаний, проверяем ответы, исправляем ошибки и дорабатываем сценарии.','The solution runs on your accounts and servers: you pay AI tokens and infrastructure directly to the providers. We hand over access, code and instructions and train the owners. Support is optional, from 550 ₾ a month: we update the knowledge base, review answers, fix errors and improve workflows.','გადაწყვეტა თქვენს ანგარიშებსა და სერვერებზე მუშაობს: AI ტოკენებსა და ინფრასტრუქტურას პირდაპირ პროვაიდერებს უხდით. გადავცემთ წვდომებს, კოდს და ინსტრუქციებს და ვასწავლით პასუხისმგებლებს. მხარდაჭერა — სურვილისამებრ, 550 ₾‑დან თვეში: ვაახლებთ ცოდნის ბაზას, ვამოწმებთ პასუხებს, ვასწორებთ შეცდომებს და ვხვეწთ სცენარებს.')]
 ];
 const partnerFaq:[string,string][]=[[c('Сколько я получу?','How much will I earn?','რამდენს მივიღებ?'),c('Процент с оплаченного проекта и сопровождения. Размер зависит от вашей роли в сделке — от рекомендации до совместных продаж — и фиксируется в договоре.','A share of each paid project and support plan. The rate depends on your role, from a referral to joint selling, and is fixed in a contract.','პროცენტი გადახდილი პროექტიდან და მხარდაჭერიდან. ოდენობა დამოკიდებულია თქვენს როლზე და ხელშეკრულებით ფიქსირდება.')],[c('Нужно ли разбираться в ИИ?','Do I need to know AI?','AI‑ში უნდა ვერკვეოდე?'),c('Нет. Достаточно знать задачи клиента. Аудит, расчёт и внедрение берём на себя, а вам даём демо и материалы.','No. Knowing the client’s needs is enough. We handle the audit, estimate and delivery and give you demos and materials.','არა. საკმარისია კლიენტის ამოცანების ცოდნა. აუდიტს, გათვლასა და დანერგვას ჩვენ ვაკეთებთ.')],[c('Можно работать под нашим брендом?','Can you deliver under our brand?','შეიძლება ჩვენი ბრენდით?'),c('Да, для агентств и интеграторов делаем внедрения под вашим брендом. Условия обсуждаем отдельно.','Yes, for agencies and integrators we deliver under your brand. Terms are agreed separately.','დიახ, სააგენტოებისა და ინტეგრატორებისთვის ვმუშაობთ თქვენი ბრენდით.')],[c('Когда выплачивается вознаграждение?','When am I paid?','როდის ხდება ანაზღაურება?'),c('После оплаты клиентом каждого этапа — пилота, внедрения или месяца сопровождения.','After the client pays for each stage — pilot, implementation or a month of support.','კლიენტის მიერ თითოეული ეტაპის გადახდის შემდეგ.')]];
 const detailHead=slug==='leadership'?c('ИИ-стратегия','an AI strategy','AI სტრატეგია'):isDetail?(ov?.h1.split(':')[0].trim()||t(ent!.name,lang)):'';
 const detailCost:[string,string]=[c('Сколько стоит '+detailHead+'?','How much does '+detailHead+' cost?','რა ღირს '+detailHead+'?'),c('Внедрение готовых инструментов — от 3 200 ₾ ($1 200): пилот на одном процессе за 2–4 недели на ваших реальных данных. Если нужна разработка под ваши системы — от 6 700 ₾ ($2 500), сопровождение — от 550 ₾ в месяц. Аудит бесплатный, цену пилота фиксируем до старта.','Implementing ready tools starts at 3,200 ₾ ($1,200): a pilot on one workflow in 2–4 weeks on your real data. Custom development for your systems starts at 6,700 ₾ ($2,500), support from 550 ₾ a month. The audit is free and the pilot price is fixed before work begins.','მზა ინსტრუმენტების დანერგვა — 3 200 ₾‑დან ($1 200): პილოტი ერთ პროცესზე 2–4 კვირაში თქვენს რეალურ მონაცემებზე. თქვენს სისტემებზე მორგებული შემუშავება — 6 700 ₾‑დან ($2 500), მხარდაჭერა — 550 ₾‑დან თვეში. აუდიტი უფასოა, პილოტის ფასს სამუშაოს დაწყებამდე ვაფიქსირებთ.')];
 const faqItems:[string,string][]=isPartners?partnerFaq:isDetail?[...(ov?ov.faq:profile!.faq.map(([q,a])=>[t(q,lang),t(a,lang)] as [string,string])),detailCost]:section==='departments'?[aboutFaq,agentFaq,...deptFaq]:genFaq;
 const faqTitle=isPartners?c('Вопросы партнёров.','Partner questions.','პარტნიორების კითხვები.'):isDetail?c('Вопросы по делу.','Practical questions.','პრაქტიკული კითხვები.'):c('До первого разговора.','Before our first conversation.','პირველ საუბრამდე.');

 const sectionName=isPartners?c('Партнёрам','Partners','პარტნიორებს'):isPrivacy?c('Политика конфиденциальности','Privacy policy','კონფიდენციალურობის პოლიტიკა'):sectionLabel(c,section);
 const jsonLd=pageJsonLd({lang,faq:isPrivacy?[]:faqItems,
  crumbs:[[s.home,''],...(isHome?[]:[[sectionName,'/'+section] as [string,string]]),...(isDetail?[[t(ent!.name,lang),rest] as [string,string]]:[])],
  service:isDetail?{name:ov?.h1.split(':')[0].trim()||t(ent!.name,lang),description:data.answer?t(data.answer.a,lang):ov?.sub||'',path:rest}:undefined,path:rest});
 const defaultOptions=[c('Продажи','Sales','გაყიდვები'),c('Поддержка','Support','მხარდაჭერა'),c('Документы и бэк-офис','Documents & back office','დოკუმენტები და ბექ‑ოფისი'),c('Маркетинг','Marketing','მარკეტინგი'),'HR',c('Обучение команды','Team training','გუნდის სწავლება')];
 const options=[...(isDetail
  ?(ov?ov.chips:[...profile!.scenarios.map(q=>t(q.title,lang)),...profile!.extra.map(v=>t(v,lang))])
  :section==='solutions'?solutionChoices.map(v=>t(v,lang))
  :section==='training'?[7,0,1,4].map(i=>departments[i]).filter(Boolean).map(d=>t(d.name,lang))
  :isPartners?[c('Интегратор 1С / CRM','1C / CRM integrator','1C / CRM ინტეგრატორი'),c('Агентство','Agency','სააგენტო'),c('Бухгалтерия или юристы','Accounting or legal','ბუღალტერია ან იურისტები'),c('Консультант','Consultant','კონსულტანტი')]
  :section==='departments'?[c('Продажи','Sales','გაყიდვები'),c('Поддержка','Support','მხარდაჭერა'),c('Бэк-офис','Back office','ბექ‑ოფისი'),'HR',c('Маркетинг','Marketing','მარკეტინგი'),c('Финансы','Finance','ფინანსები'),c('Закупки','Procurement','შესყიდვები')]
  :defaultOptions),s.other];

 const footerCols=[
  {title:s.footerExplore,links:[...['solutions','training','cases'].map(k=>({href:link(k),label:sectionLabel(c,k),contact:false})),{href:link('partners'),label:c('Партнёрам','Partners','პარტნიორებს'),contact:false},{href:'#contact',label:s.action,contact:true}]},
  {title:sectionLabel(c,'departments'),links:departments.slice(0,4).map(d=>({href:link('departments/'+d.slug),label:t(d.name,lang),contact:false}))},
  {title:sectionLabel(c,'industries'),links:[...industries.slice(0,4).map(i=>({href:link('industries/'+i.slug),label:t(i.name,lang),contact:false})),{href:link('industries'),label:s.allIndustries,contact:false}]}
 ];
 const langs:[Lang,string][]=[['en','EN'],['ka','GE'],['ru','RU']];

 return (
  <div className="site">
   <MotionRoot/>
   <a href="#main" onClick={e=>{e.preventDefault();document.getElementById('main')?.focus()}} className="skip">{s.skip}</a>
   <Header lang={lang} c={c} s={s} page={isDetail?'':section} rest={rest} toContact={toContact} menu={menu} setMenu={setMenu}/>
   <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonLd).replace(/</g,'\\u003c')}}/>
   <main id="main" tabIndex={-1}>
    {isHome&&<><Hero x={x}/><Marquee x={x}/><Results x={x} count/></>}
    {isPrivacy&&<Privacy x={x}/>}
    {isPartners&&<Partners x={x}/>}
    {isList&&<InnerHero x={x} page={section}/>}
    {isDetail&&<DetailHero x={x} slug={slug!} page={section}/>}
    {section==='industries'&&!isDetail&&<IndustriesGrid x={x}/>}
    {section==='departments'&&!isDetail&&<DepartmentsGrid x={x}/>}
    {['home','solutions','training'].includes(section)&&!isDetail&&<Formats x={x} training={section==='training'}/>}
    {['home','solutions'].includes(section)&&!isDetail&&<Calculator x={x}/>}
    {section==='solutions'&&<SolutionExamples x={x}/>}
    {section==='cases'&&<><CaseExamples x={x}/><Results x={x} count={false}/></>}
    {isList&&<Process x={x}/>}
    {(isHome||isList)&&<Trust x={x}/>}
    {section==='solutions'&&!isDetail&&<AuditReport x={x}/>}
    {(['home','solutions'].includes(section)&&!isDetail||isPartners)&&<Team x={x}/>}
    {isDetail&&<><Scenarios x={x} slug={slug!}/><Tested x={x} slug={slug!}/><Related x={x} slug={slug!}/><DetailAnswer x={x} slug={slug!}/></>}
    {!isPrivacy&&<><Faq x={x} items={faqItems} title={faqTitle} ask={!isHome}/>
    <Contact x={x} options={options} context={context} setContext={setContext}/></>}
   </main>

   <footer className="footer">
    <div className="wrap footer-in">
     <div className="footer-grid">
      <div className="footer-brand">
       <a href={root} className="brand brand-dark"><Wordmark dark/></a>
       <p className="footer-tag">{s.footerTag}</p>
       <p className="footer-about">{s.footerAbout}</p>
       <div className="footer-contacts"><a href={'tel:'+contacts.phone} className="footer-phone"><Icon name="phone" size={16}/>{contacts.phoneLabel}</a><a href={contacts.whatsapp} target="_blank" rel="noopener" className="footer-phone"><Icon name="whatsapp" size={16}/>WhatsApp</a></div>
       <a href="#contact" onClick={toContact} className="btn btn-white">{s.action}<Icon name="arrow-right" size={16}/></a>
      </div>
      {footerCols.map(col=><div key={col.title}>
       <h2 className="footer-h">{col.title}</h2>
       {col.links.map(l=><a key={l.href} href={l.href} onClick={l.contact?toContact:undefined} className="footer-link">{l.label}</a>)}
      </div>)}
     </div>
     <div className="footer-bottom">
      <span>© 2026 Praxen AI · {s.location} · <a href={link('privacy')} className="footer-privacy">{c('Конфиденциальность','Privacy','კონფიდენციალურობა')}</a></span><span>{s.footerServices}</span>
      <div className="footer-langs">{langs.map(([code,lb])=><a key={code} href={base+'/'+code+rest} lang={code} hrefLang={code} className={code===lang?'is-current':''}><Flag code={code}/>{lb}</a>)}</div>
     </div>
    </div>
   </footer>

   <div className={'sticky-cta'+(sticky?' is-shown':'')}>
    <a href="#contact" onClick={toContact} className="btn btn-primary">{c('Бесплатный аудит','Free audit','უფასო აუდიტი')}</a>
    <a href={contacts.whatsapp+'?text='+encodeURIComponent(s.heroWhatsAppText)} target="_blank" rel="noopener" aria-label="WhatsApp" className="sticky-icon sticky-wa"><Icon name="whatsapp" size={20}/></a>
    <a href={'tel:'+contacts.phone} aria-label={contacts.phoneLabel} className="sticky-icon"><Icon name="phone" size={19}/></a>
    <a href={contacts.telegram} target="_blank" rel="noopener" aria-label={s.telegram} className="sticky-icon"><Icon name="send" size={19}/></a>
   </div>
  </div>
 );
}
