'use client';
import {useCallback,useEffect,useState} from 'react';
import {base} from '@/lib/base';
import {departments,industries,t,Lang} from '@/lib/content';
import {profiles,solutionChoices} from '@/lib/page-profiles';
import {pageCopy} from '@/lib/page-copy';
import {contacts} from '@/lib/contacts';
import {copyFn,sectionLabel,siteCopy} from '@/lib/site-copy';
import {Header} from '@/components/praxis/header';
import {FindWorkflow,Hero,Marquee,Results} from '@/components/praxis/home';
import {CaseExamples,DepartmentsGrid,Formats,IndustriesGrid,InnerHero,Process,SolutionExamples,Trust} from '@/components/praxis/inner';
import {DetailHero,Related,Scenarios,Tested} from '@/components/praxis/detail';
import {Contact,Faq} from '@/components/praxis/contact';
import {Icon} from '@/components/praxis/icon';
import {Flag,MotionRoot,Wordmark,scrollToId} from '@/components/praxis/ui';
import type {X} from '@/components/praxis/types';

type Props={lang?:Lang;section?:string;slug?:string};

export default function Site({lang='en',section='home',slug}:Props){
 const c=copyFn(lang);
 const profile=slug?profiles[slug]:undefined;
 const ent=slug?(industries.find(i=>i.slug===slug)||departments.find(i=>i.slug===slug)):undefined;
 const isDetail=!!(profile&&ent),isHome=section==='home'&&!isDetail;
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
 const x:X={lang,c,s,link,go,toContact};

 const ov=slug?pageCopy[slug]?.[lang]:undefined;
 const costAnswer=c('Обучение команды — от 1 900 ₾ ($700), внедрение готовых инструментов — от 3 200 ₾ ($1 200), разработка решения — от 6 700 ₾ ($2 500). Аудит бесплатный, цену пилота фиксируем до старта работ.','Team training from 1,900 ₾ ($700), tool implementation from 3,200 ₾ ($1,200), custom development from 6,700 ₾ ($2,500). The audit is free, and we fix the pilot price before work begins.','გუნდის სწავლება — 1 900 ₾-დან ($700), ინსტრუმენტების დანერგვა — 3 200 ₾-დან ($1 200), ინდივიდუალური შემუშავება — 6 700 ₾-დან ($2 500). აუდიტი უფასოა, პილოტის ფასს სამუშაოს დაწყებამდე ვაფიქსირებთ.');
 const genFaq:[string,string][]=[[c('Сколько стоит внедрение?','How much does implementation cost?','რა ღირს დანერგვა?'),costAnswer],[c('Можно заказать только обучение?','Can we book training only?','შეიძლება მხოლოდ სწავლება?'),c('Да. Обучение — самостоятельная услуга. Программу строим вокруг задач вашей команды.','Yes. Training is a standalone service built around your team’s tasks.','დიახ. სწავლება დამოუკიდებელი მომსახურებაა თქვენი გუნდის ამოცანებზე.')],[c('Придётся менять наши системы?','Will we need to replace our systems?','სისტემების შეცვლა დაგვჭირდება?'),c('Сначала изучим текущие инструменты. Возможность интеграции зависит от их функций и доступов.','We assess your existing tools first. Integration depends on their capabilities and available access.','ჯერ ვსწავლობთ არსებულ ინსტრუმენტებს. ინტეგრაცია მათ შესაძლებლობებზეა დამოკიდებული.')],[c('Что, если ИИ ошибётся?','What if AI makes a mistake?','თუ AI შეცდება?'),c('Заранее определим точки проверки, протестируем типовые и сложные ситуации. Важные решения остаются за сотрудником.','We define review points and test routine and difficult scenarios. Important decisions remain with your people.','ვადგენთ შემოწმების წერტილებს. მნიშვნელოვანი გადაწყვეტილებები თანამშრომელთან რჩება.')],[c('На каких языках проходит работа?','Which languages can we work in?','რომელ ენებზე ვმუშაობთ?'),c('Проектируем решения для общения на грузинском, английском и русском. Качество ответов проверяем на ваших сценариях. Обучение команды проводим на русском и английском; грузинский формат согласуем отдельно.','We design solutions for Georgian, English and Russian and evaluate answers on your use cases. Team training is available in Russian and English; Georgian delivery is agreed separately.','კონსულტაცია და სწავლება ხელმისაწვდომია რუსულად და ინგლისურად. ქართულ ენაზე მუშაობა შეთანხმდება პროექტის მიხედვით.')]];
 const deptFaq:[string,string][]=[
  [c('С какого отдела лучше начать?','Which department should we start with?','რომელი განყოფილებით დავიწყოთ?'),c('С того, где много повторяющихся обращений или документов и есть понятная метрика: обычно это продажи, поддержка или бэк-офис. На аудите сравним варианты по эффекту и сложности.','Where there are many repetitive requests or documents and a clear metric — usually sales, support or the back office. The audit compares options by impact and effort.','იქ, სადაც ბევრი განმეორებადი მოთხოვნა ან დოკუმენტია და მკაფიო მეტრიკა — ჩვეულებრივ გაყიდვები, მხარდაჭერა ან ბექ-ოფისი.')],
  [c('Как масштабировать ИИ на другие отделы?','How do we scale AI to other departments?','როგორ გავავრცელოთ AI სხვა განყოფილებებზე?'),c('Первый пилот закладывает базу знаний, интеграции и правила доступа. Следующие отделы подключаются к ним, поэтому каждое новое внедрение быстрее и дешевле.','The first pilot sets up the knowledge base, integrations and access rules. Other teams plug into them, so each next rollout is faster and cheaper.','პირველი პილოტი ქმნის ცოდნის ბაზას, ინტეგრაციებსა და წვდომის წესებს. შემდეგი განყოფილებები მათ უერთდება.')],
  [c('Нужна ли отдельная система для каждого отдела?','Do we need a separate system per department?','საჭიროა ცალკე სისტემა თითოეული განყოფილებისთვის?'),c('Нет. Ассистенты работают на общей платформе с разграничением прав, а интерфейс для отдела — привычный: CRM, helpdesk или мессенджер.','No. Assistants share one platform with role-based access, while each team keeps its familiar interface — CRM, helpdesk or messenger.','არა. ასისტენტები მუშაობენ ერთ პლატფორმაზე როლური წვდომით, ინტერფეისი კი ნაცნობია — CRM, helpdesk ან მესენჯერი.')],
  [c('Сколько стоит внедрение?','How much does implementation cost?','რა ღირს დანერგვა?'),costAnswer],
  [c('Кто поддерживает решение после запуска?','Who supports the solution after launch?','ვინ უჭერს მხარს გაშვების შემდეგ?'),c('Передаём инструкции и обучаем ответственных. По желанию берём сопровождение: мониторинг качества и обновление базы знаний.','We hand over instructions and train owners. Optionally we provide ongoing support: quality monitoring and knowledge base updates.','გადავცემთ ინსტრუქციებს და ვასწავლით პასუხისმგებლებს. სურვილისამებრ — მხარდაჭერა და ცოდნის ბაზის განახლება.')]
 ];
 const faqItems:[string,string][]=isDetail?(ov?ov.faq:profile!.faq.map(([q,a])=>[t(q,lang),t(a,lang)] as [string,string])):section==='departments'?deptFaq:genFaq;
 const faqTitle=isDetail?c('Вопросы по делу.','Practical questions.','პრაქტიკული კითხვები.'):c('До первого разговора.','Before our first conversation.','პირველ საუბრამდე.');

 const defaultOptions=[c('Разбор входящих заявок','Incoming enquiries','შემოსული მოთხოვნები'),c('Ответы клиентам','Customer support','კლიენტების მხარდაჭერა'),c('КП и документы','Proposals & documents','შეთავაზებები და დოკუმენტები'),c('Обучение сотрудников','Team training','თანამშრომლების სწავლება')];
 const options=[...(isDetail
  ?(ov?ov.chips:[...profile!.scenarios.map(q=>t(q.title,lang)),...profile!.extra.map(v=>t(v,lang))])
  :section==='solutions'?solutionChoices.map(v=>t(v,lang))
  :section==='training'?[7,0,1,4].map(i=>departments[i]).filter(Boolean).map(d=>t(d.name,lang))
  :section==='departments'?[c('Продажи','Sales','გაყიდვები'),c('Поддержка','Support','მხარდაჭერა'),c('Бэк-офис','Back office','ბექ-ოფისი'),'HR',c('Маркетинг','Marketing','მარკეტინგი'),c('Финансы','Finance','ფინანსები'),c('Закупки','Procurement','შესყიდვები')]
  :defaultOptions),s.other];

 const footerCols=[
  {title:s.footerExplore,links:[...['solutions','training','cases'].map(k=>({href:link(k),label:sectionLabel(c,k),contact:false})),{href:'#contact',label:s.action,contact:true}]},
  {title:sectionLabel(c,'departments'),links:departments.slice(0,4).map(d=>({href:link('departments/'+d.slug),label:t(d.name,lang),contact:false}))},
  {title:sectionLabel(c,'industries'),links:[...industries.slice(0,4).map(i=>({href:link('industries/'+i.slug),label:t(i.name,lang),contact:false})),{href:link('industries'),label:s.allIndustries,contact:false}]}
 ];
 const langs:[Lang,string][]=[['en','EN'],['ka','GE'],['ru','RU']];

 return (
  <div className="site">
   <MotionRoot/>
   <a href="#main" onClick={e=>{e.preventDefault();document.getElementById('main')?.focus()}} className="skip">{s.skip}</a>
   <Header lang={lang} c={c} s={s} page={isDetail?'':section} rest={rest} toContact={toContact} menu={menu} setMenu={setMenu}/>
   <main id="main" tabIndex={-1}>
    {isHome&&<><Hero x={x}/><Marquee x={x}/><Results x={x} count/><FindWorkflow x={x}/></>}
    {!isHome&&!isDetail&&<InnerHero x={x} page={section}/>}
    {isDetail&&<DetailHero x={x} slug={slug!} page={section}/>}
    {section==='industries'&&!isDetail&&<IndustriesGrid x={x}/>}
    {section==='departments'&&!isDetail&&<DepartmentsGrid x={x}/>}
    {['home','solutions','training'].includes(section)&&!isDetail&&<Formats x={x} training={section==='training'}/>}
    {section==='solutions'&&<SolutionExamples x={x}/>}
    {section==='cases'&&<><CaseExamples x={x}/><Results x={x} count={false}/></>}
    {!isHome&&!isDetail&&<Process x={x}/>}
    {!isDetail&&<Trust x={x}/>}
    {isDetail&&<><Scenarios x={x} slug={slug!}/><Tested x={x} slug={slug!}/><Related x={x} slug={slug!}/></>}
    <Faq x={x} items={faqItems} title={faqTitle}/>
    <Contact x={x} options={options} context={context} setContext={setContext}/>
   </main>

   <footer className="footer">
    <div className="wrap footer-in">
     <div className="footer-grid">
      <div className="footer-brand">
       <a href={root} aria-label="Praxis AI" className="brand brand-dark"><Wordmark dark/></a>
       <p className="footer-tag">{s.footerTag}</p>
       <div><a href={'tel:'+contacts.phone} className="footer-phone"><Icon name="phone" size={16}/>{contacts.phoneLabel}</a></div>
       <a href="#contact" onClick={toContact} className="btn btn-white">{s.action}<Icon name="arrow-right" size={16}/></a>
      </div>
      {footerCols.map(col=><div key={col.title}>
       <h4>{col.title}</h4>
       {col.links.map(l=><a key={l.href} href={l.href} onClick={l.contact?toContact:undefined} className="footer-link">{l.label}</a>)}
      </div>)}
     </div>
     <div className="footer-bottom">
      <span>© 2026 Praxis AI · {s.location}</span><span>{s.footerServices}</span>
      <div className="footer-langs">{langs.map(([code,lb])=><a key={code} href={base+'/'+code+rest} lang={code} hrefLang={code} className={code===lang?'is-current':''}><Flag code={code}/>{lb}</a>)}</div>
     </div>
    </div>
   </footer>

   <div className={'sticky-cta'+(sticky?' is-shown':'')}>
    <a href="#contact" onClick={toContact} className="btn btn-primary">{s.action}</a>
    <a href={'tel:'+contacts.phone} aria-label={contacts.phoneLabel} className="sticky-icon"><Icon name="phone" size={19}/></a>
    <a href={contacts.telegram} target="_blank" rel="noopener" aria-label={s.telegram} className="sticky-icon"><Icon name="send" size={19}/></a>
   </div>
  </div>
 );
}
