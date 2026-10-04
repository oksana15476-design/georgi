'use client';
import {departments,industries,t} from '@/lib/content';
import {jobs} from '@/lib/jobs';
import {profiles} from '@/lib/page-profiles';
import {sectionLabel} from '@/lib/site-copy';
import {industryIcon} from './header';
import {Icon} from './icon';
import type {X} from './types';

const rd=(ms:number|string)=>({'--rd':ms+'ms'} as React.CSSProperties);

export function stairsData(x:X){
 const {c}=x;
 return [
  {level:c('Легко','Easy','მარტივი'),title:c('Обучение команды','Team training','გუნდის სწავლება'),time:c('от 1 недели','from 1 week','1 კვირიდან'),h:'46%',cls:'stair-1'},
  {level:c('Средне','Medium','საშუალო'),title:c('Внедрение инструментов','Tool implementation','ინსტრუმენტების დანერგვა'),time:c('2–4 недели','2–4 weeks','2–4 კვირა'),h:'72%',cls:'stair-2'},
  {level:c('Сложно','Advanced','რთული'),title:c('Разработка решения','Custom development','ინდივიდუალური შემუშავება'),time:c('от 4 недель','from 4 weeks','4 კვირიდან'),h:'100%',cls:'stair-3'}
 ];
}

export function InnerHero({x,page}:{x:X;page:string}){
 const {c,s}=x;const label=sectionLabel(c,page);
 const title=({training:c('ИИ становится рабочим навыком вашей команды.','Make AI an everyday skill for your team.','აქციეთ AI თქვენი გუნდის ყოველდღიურ უნარად.'),industries:c('Ваш бизнес. Ваш сценарий внедрения.','Your business. Your AI use case.','თქვენი ბიზნესი. თქვენი AI სცენარი.'),departments:c('ИИ для задач каждого отдела.','AI for every department’s work.','AI ყველა განყოფილების ამოცანებისთვის.'),cases:c('Посмотрите, как может работать ИИ.','See how AI could work.','ნახეთ, როგორ შეიძლება იმუშაოს AI-მ.'),solutions:c('От обучения до собственного решения.','From learning to a custom solution.','სწავლებიდან ინდივიდუალურ გადაწყვეტილებამდე.')} as Record<string,string>)[page]||'';
 const intro=({
  industries:c('12 отраслей с готовыми сценариями: от отелей и клиник до логистики и производства. Выберите свою — покажем, где ИИ даст эффект быстрее всего.','12 industries with ready-made workflows — from hotels and clinics to logistics and manufacturing. Pick yours and see where AI pays off first.','12 ინდუსტრია მზა სცენარებით — სასტუმროებიდან და კლინიკებიდან ლოჯისტიკამდე. აირჩიეთ თქვენი და ნახეთ, სად მოიტანს AI შედეგს ყველაზე სწრაფად.'),
  departments:c('Продажи, поддержка, бухгалтерия, HR и ещё четыре отдела. Для каждого — востребованные задачи, которые ИИ закрывает уже сегодня.','Sales, support, finance, HR and four more teams — each with the tasks AI already handles well today.','გაყიდვები, მხარდაჭერა, ფინანსები, HR და კიდევ ოთხი განყოფილება — თითოეულისთვის ამოცანები, რომლებსაც AI დღესვე წყვეტს.'),
  training:c('Практические воркшопы на задачах вашей команды: сотрудники уходят с рабочими шаблонами и понятными правилами проверки результата.','Hands-on workshops built on your team’s real tasks. People leave with working templates and clear review rules.','პრაქტიკული ვორქშოპები თქვენი გუნდის რეალურ ამოცანებზე: თანამშრომლები სამუშაო შაბლონებითა და შემოწმების წესებით გადიან.'),
  cases:c('Три сценария из практики: ситуация, решение и то, как измеряем результат. Без обещаний — с понятными критериями.','Three real-world scenarios: the situation, the solution and how we measure the result — clear criteria, no hype.','სამი სცენარი პრაქტიკიდან: სიტუაცია, გადაწყვეტილება და შედეგის გაზომვა — მკაფიო კრიტერიუმებით.'),
  solutions:c('Обучение, настройка готовых сервисов или собственная разработка — начинаем с бесплатного аудита и выбираем нужную глубину.','Training, configured tools or a custom build — we start with a free audit and choose the right depth.','სწავლება, მზა სერვისები ან ინდივიდუალური შემუშავება — ვიწყებთ უფასო აუდიტით.')
 } as Record<string,string>)[page]||'';
 const facts=({
  industries:[['layers',c('3–5 сценариев на отрасль','3–5 workflows per industry','3–5 სცენარი ინდუსტრიაზე')],['plug',c('Интеграции с отраслевыми системами','Industry system integrations','დარგობრივი სისტემების ინტეგრაცია')],['languages',c('Диалоги на GE / EN / RU','Conversations in GE / EN / RU','დიალოგები GE / EN / RU')]],
  departments:[['users',c('8 отделов','8 departments','8 განყოფილება')],['bar-chart-3',c('Метрика результата для каждого','A success metric for each','შედეგის მეტრიკა თითოეულისთვის')],['shield-check',c('Человек проверяет важные решения','People review key decisions','მნიშვნელოვან გადაწყვეტილებებს ადამიანი ამოწმებს')]],
  training:[['calendar',c('От 1 недели','From 1 week','1 კვირიდან')],['file-text',c('Шаблоны и инструкции остаются у вас','Templates and guides stay with you','შაბლონები და ინსტრუქციები თქვენთან რჩება')],['globe-2',c('Онлайн или в офисе · RU / EN','Online or on-site · RU / EN','ონლაინ ან ოფისში · RU / EN')]],
  cases:[['clipboard-list',c('Ситуация → решение → метрика','Situation → solution → metric','სიტუაცია → გადაწყვეტა → მეტრიკა')],['shield-check',c('Контроль сотрудника на каждом шаге','Staff control at each step','თანამშრომლის კონტროლი')],['rocket',c('Старт с одного процесса','Start with one workflow','დაწყება ერთი პროცესით')]]
 } as Record<string,string[][]>)[page];
 return (
  <section data-screen-label="Inner hero" className="inner-hero">
   <div className="wrap inner-pad">
    <nav aria-label="Breadcrumb" className="crumbs"><a href={'/'+x.lang}>{s.home}</a><span aria-hidden="true">/</span><span aria-current="page">{label}</span></nav>
    <div className="inner-grid">
     <div className="min0 mw860">
      <h1 data-reveal="" className="inner-h1">{title}</h1>
      <div data-reveal="" style={rd(140)} className="inner-lead"><p>{intro}</p><button type="button" onClick={()=>x.go(label)} className="btn btn-primary mt24">{s.action}<Icon name="arrow-right" size={16}/></button></div>
     </div>
     {facts&&<ul data-reveal="" style={rd(220)} className="facts">
      {facts.map(([icon,text])=><li key={text}><span className="tile-icon"><Icon name={icon} size={19}/></span>{text}</li>)}
     </ul>}
     {page==='solutions'&&<div data-reveal="" style={rd(220)}><div aria-hidden="true" className="stairs">
      {stairsData(x).map(st=><div key={st.cls} className={'stair '+st.cls} style={{height:st.h}}>
       <span className="stair-level">{st.level}</span>
       <span className="min0"><strong>{st.title}</strong><small>{st.time}</small></span>
      </div>)}
     </div></div>}
    </div>
   </div>
  </section>
 );
}

export function IndustriesGrid({x}:{x:X}){
 const {lang,link,s}=x;
 return (
  <section className="wrap list-pad">
   <div className="grid-c3" data-stagger="">
    {industries.map(ind=><a key={ind.slug} href={link('industries/'+ind.slug)} className="card ind-card ind-card-list">
     <span className="ind-top"><span className="tile-icon tile-44"><Icon name={industryIcon[ind.slug]||'building'} size={21}/></span><Icon name="arrow-up-right" size={18}/></span>
     <h3>{t(ind.name,lang)}</h3>
     <p>{t(ind.promise,lang)}</p>
     <span className="ind-more">{s.useCases}</span>
    </a>)}
   </div>
  </section>
 );
}

const deptCardIcon:Record<string,string>={sales:'trending-up',marketing:'megaphone',hr:'users',finance:'calculator',procurement:'truck',leadership:'briefcase',support:'headphones',operations:'settings-2'};

export function DepartmentsGrid({x}:{x:X}){
 const {lang,link,s,c}=x;
 const synergy=[['book-open',c('Одна база знаний','One knowledge base','ერთი ცოდნის ბაზა'),c('Поддержка и HR-бот отвечают по одним и тем же регламентам — без расхождений.','Support and the HR bot answer from the same policies — no contradictions.','მხარდაჭერა და HR ბოტი ერთი და იმავე წესებით პასუხობენ.')],['share-2',c('Общие данные','Shared data','საერთო მონაცემები'),c('Лид, его заказ и документы видны поддержке и бухгалтерии в нужном объёме.','A lead, its order and documents are visible to support and accounting as needed.','ლიდი, შეკვეთა და დოკუმენტები ხელმისაწვდომია საჭირო მოცულობით.')],['key',c('Один контур доступа','One access model','წვდომის ერთი მოდელი'),c('Права по ролям и единые правила безопасности для всех ассистентов.','Role-based permissions and one security policy for every assistant.','როლებზე დაფუძნებული უფლებები და ერთიანი უსაფრთხოება.')]];
 return (<>
  <section className="wrap list-pad">
   <div className="grid-c2" data-stagger="">
    {departments.map(d=><a key={d.slug} href={link('departments/'+d.slug)} className="card dept-card">
     <span className="dept-card-top"><span className="tile-icon tile-42"><Icon name={deptCardIcon[d.slug]||'layers'} size={20}/></span><span>{t(d.name,lang)}</span></span>
     <h3>{t(d.job,lang)}</h3>
     <ul>{(jobs[d.slug]?jobs[d.slug].map(j=>t(j.t,lang)):d.tasks.map(v=>t(v,lang))).map(task=><li key={task}><Icon name="check" size={16}/>{task}</li>)}</ul>
     <p className="dept-metric"><span>{s.howEvaluate}:</span> {t(d.metric,lang)}</p>
     <span className="ulink mt-auto">{s.exploreDept}<Icon name="arrow-right" size={16}/></span>
    </a>)}
   </div>
  </section>
  <section className="wrap sec-bottom">
   <div className="synergy">
    <div data-reveal=""><h2 className="h2 mt14">{s.synergyH2}</h2><p className="synergy-p">{s.synergyP}</p></div>
    <div className="synergy-grid" data-stagger="">
     {synergy.map(([, title,body])=><article key={title}><h3>{title}</h3><p>{body}</p></article>)}
    </div>
   </div>
  </section>
 </>);
}

export function Formats({x,training}:{x:X;training:boolean}){
 const {c,s}=x;
 const titles=training?[c('Для руководителей','For leaders','ხელმძღვანელებისთვის'),c('Для отделов','For departments','განყოფილებებისთვის'),c('При внедрении','During implementation','დანერგვისას')]:[c('Обучение команды','Team training','გუნდის სწავლება'),c('Внедрение инструментов','Tool implementation','ინსტრუმენტების დანერგვა'),c('Разработка решения','Custom development','ინდივიდუალური შემუშავება')];
 const bodies=training?[c('Выбор задач для ИИ, оценка пользы и организация внедрения.','Choose AI opportunities, evaluate value and organise adoption.','AI ამოცანების შერჩევა, სარგებელი და დანერგვა.'),c('Практика на документах, обращениях, контенте и данных вашей команды.','Practice with your team’s documents, enquiries, content and data.','პრაქტიკა თქვენი გუნდის დოკუმენტებზე და მონაცემებზე.'),c('Освоение нового инструмента, рабочие инструкции и разбор сложных ситуаций.','Learn new tools, establish working instructions and review difficult cases.','ახალი ინსტრუმენტები, ინსტრუქციები და რთული შემთხვევები.')]:[c('Практика на задачах сотрудников, рабочие шаблоны и правила проверки результата.','Hands-on employee tasks, working templates and result review practices.','პრაქტიკა თანამშრომლების ამოცანებზე, შაბლონები და შემოწმება.'),c('Настройка сервисов и интеграций с CRM, документами и привычными рабочими системами.','Configure services and integrate CRM, documents and existing systems.','სერვისების და CRM-ის, დოკუმენტებისა და სისტემების ინტეგრაცია.'),c('Помощники, внутренние интерфейсы и логика под требования вашего бизнеса.','Assistants, internal interfaces and workflows tailored to your business.','ასისტენტები და ინტერფეისები თქვენი ბიზნესისთვის.')];
 const ctas=[c('Получить программу обучения','Get a training programme','მიიღეთ სასწავლო პროგრამა'),c('Подобрать инструменты','Find the right tools','შეარჩიეთ ინსტრუმენტები'),c('Запросить оценку проекта','Request a project estimate','მოითხოვეთ პროექტის შეფასება')];
 const ctx=[c('Обучение','Training','სწავლება'),c('Внедрение','Implementation','დანერგვა'),c('Разработка','Development','შემუშავება')];
 const stairs=stairsData(x);
 return (
  <section id="solutions" className="band-white">
   <div className="wrap sec">
    <div className="sec-head"><div data-reveal="" style={rd(80)}><h2 className="h2 mw820">{training?c('Учимся на вашей работе.','Learn through your own work.','ვსწავლობთ თქვენს ამოცანებზე.'):c('Нужная глубина внедрения.','The right level of implementation.','დანერგვის საჭირო დონე.')}</h2><p className="lead">{s.formatsP}</p></div></div>
    <div className="formats-grid">
     {titles.map((title,i)=><div key={title} data-reveal="" style={rd(i*100)}><article className="format">
      <h3>{title}</h3>
      <p>{bodies[i]}</p>
      <p className="format-time"><span>{s.timelineT}: <b>{stairs[i].time}</b></span></p>
      <button type="button" onClick={()=>x.go(ctx[i])} className="ulink mt-auto">{ctas[i]}<Icon name="arrow-right" size={16}/></button>
     </article></div>)}
    </div>
    <p className="formats-note">{s.timeline}</p>
   </div>
  </section>
 );
}

export function SolutionExamples({x}:{x:X}){
 const {c,lang,link,s}=x;
 const vis:Record<string,{kind:string;a?:string;b?:string;src?:string;stage?:string;rows?:string[][]}>={
  sales:{kind:'crm',a:c('Нужно 30 стульев в Батуми','Need 30 chairs in Batumi','30 სკამი ბათუმში'),rows:[[c('Товар','Item','პროდუქტი'),c('Стулья','Chairs','სკამები')],[c('Кол-во','Qty','რაოდ.'),'30'],[c('Город','City','ქალაქი'),c('Батуми','Batumi','ბათუმი')]],stage:c('Квалифицирован','Qualified','კვალიფიცირებული')},
  support:{kind:'chat',a:c('Где мой заказ #2291?','Where is order #2291?','სად არის შეკვეთა #2291?'),b:c('В пути, доставка завтра до 18:00.','In transit, arriving tomorrow by 6 pm.','გზაშია, ხვალ 18:00-მდე მოვა.'),src:c('Регламент доставки','Delivery policy','მიწოდების წესი')},
  operations:{kind:'doc',rows:[[c('Счёт','Invoice','ინვოისი'),'INV-0347'],[c('Сумма','Total','ჯამი'),'4 820 ₾'],[c('НДС','VAT','დღგ'),'18%']]}
 };
 return (
  <section className="wrap sec pt0">
   <div className="sec-head"><div data-reveal="" style={rd(80)}><h2 className="h2 mw820">{s.whatBuildH2}</h2></div></div>
   <div className="grid-c3w" data-stagger="">
    {['sales','support','operations'].filter(k=>profiles[k]).map(k=>{const v=vis[k],sc=profiles[k].scenarios[0];return <article key={k} className="card se-card">
     <div aria-hidden="true" className="se-visual">
      {v.kind==='chat'&&<><span className="se-in">{v.a}</span><span className="se-arrow"><Icon name="arrow-right" size={16}/></span><span className="se-out">{v.b}<small><Icon name="book-open" size={11}/>{v.src}</small></span></>}
      {v.kind==='crm'&&<><span className="se-in">{v.a}</span><span className="se-arrow"><Icon name="arrow-right" size={16}/></span><span className="se-rows">{v.rows!.map(([kk,vv])=><span key={kk}>{kk}<b>{vv}</b></span>)}<em>{v.stage}</em></span></>}
      {v.kind==='doc'&&<><span className="se-doc"><i/><i/><i/><i/><i/><i/></span><span className="se-arrow"><Icon name="arrow-right" size={16}/></span><span className="se-rows se-rows-doc">{v.rows!.map(([kk,vv])=><span key={kk}>{kk}<b>{vv}<Icon name="check" size={11}/></b></span>)}</span></>}
     </div>
     <span className="over">{t(departments.find(d=>d.slug===k)!.name,lang)}</span>
     <h3>{t(sc.title,lang)}</h3>
     <p>{t(sc.body,lang)}</p>
     <a href={link('departments/'+k)} className="ulink mt-auto">{s.exploreWorkflows}<Icon name="arrow-right" size={16}/></a>
    </article>})}
   </div>
  </section>
 );
}

export function CaseExamples({x}:{x:X}){
 const {lang,link,s}=x;
 return (
  <section id="examples" className="wrap sec">
   <div className="sec-head"><div data-reveal="" style={rd(80)}><h2 className="h2 mw820">{s.examplesH2}</h2><p className="lead">{s.examplesP}</p></div></div>
   <div className="grid-c3" data-stagger="">
    {[2,1,4].map(n=>industries[n]).filter(Boolean).map(ind=><article key={ind.slug} className="card ex-card">
     <span className="over">{s.illustrative}</span>
     <h3>{t(ind.name,lang)}</h3>
     <p>{t(ind.promise,lang)}</p>
     <dl>
      <dt>{s.situation}</dt><dd>{t(ind.problem,lang)}</dd>
      <dt>{s.solution}</dt><dd>{t(ind.solution,lang)}</dd>
      <dt>{s.measure}</dt><dd className="dd-strong">{t(ind.metric,lang)}</dd>
     </dl>
     <a href={link('industries/'+ind.slug)} className="ulink mt-auto">{s.exploreScenario}<Icon name="arrow-right" size={16}/></a>
    </article>)}
   </div>
  </section>
 );
}

export function Process({x}:{x:X}){
 const {c,s}=x;
 const steps=[[c('Разобраться','Understand','გაგება'),c('Обсуждаем процесс, участников и ограничения.','Discuss the workflow, people and constraints.','განვიხილავთ პროცესს, მონაწილეებსა და შეზღუდვებს.'),c('Итог: выбранная задача','Outcome: a selected task','შედეგი: შერჩეული ამოცანა')],[c('Спроектировать','Design','დაგეგმვა'),c('Определяем данные, проверки, объём и стоимость.','Agree data, review points, scope and cost.','ვათანხმებთ მონაცემებს, შემოწმებას, მოცულობასა და ფასს.'),c('Итог: план внедрения','Outcome: implementation plan','შედეგი: დანერგვის გეგმა')],[c('Проверить','Validate','შემოწმება'),c('Тестируем на примерах вашей работы и оцениваем качество.','Test with your work examples and evaluate quality.','ვცდით თქვენი სამუშაოს მაგალითებზე და ვაფასებთ ხარისხს.'),c('Итог: решение о запуске','Outcome: launch decision','შედეგი: გაშვების გადაწყვეტილება')],[c('Внедрить','Implement','დანერგვა'),c('Подключаем процесс, обучаем команду и передаём инструкции.','Connect the workflow, train your team and hand over instructions.','ვნერგავთ პროცესს, ვასწავლით გუნდს და გადავცემთ ინსტრუქციებს.'),c('Итог: рабочий инструмент','Outcome: a working tool','შედეგი: სამუშაო ინსტრუმენტი')]];
 return (
  <section className="wrap sec">
   <div className="sec-head"><div data-reveal="" style={rd(80)}><h2 className="h2 mw820">{s.processH2}</h2><p className="lead">{s.processP}</p></div></div>
   <div data-reveal="line" aria-hidden="true" className="process-line"/>
   <ol className="process">
    {steps.map(([title,body,outcome],i)=><li key={title}><div data-reveal="" style={rd(i*110)}>
     <span className="step-num">{'0'+(i+1)}</span>
     <h3>{title}</h3>
     <p>{body}</p>
     <p className="step-out"><Icon name="check" size={15}/>{outcome}</p>
    </div></li>)}
   </ol>
  </section>
 );
}

export function Trust({x}:{x:X}){
 const {c,s}=x;
 const log=[['check','#eaf0ff','#2146d3',c('Ответ одобрен','Reply approved','პასუხი დამტკიცდა'),c('менеджер · КП №214','manager · proposal #214','მენეჯერი · #214'),'10:42'],['user-round','#fff4e5','#b54708',c('Передано человеку','Handed to a person','გადაეცა ადამიანს'),c('скидка вне правил','discount outside rules','წესებს გარეთ ფასდაკლება'),'10:38'],['lock','#f0f4fa','#3c4658',c('Доступ ограничен','Access restricted','წვდომა შეზღუდულია'),c('роль: стажёр · зарплаты','role: trainee · payroll','როლი: სტაჟიორი'),'10:31'],['book-open','#eaf0ff','#2146d3',c('Источник указан','Source cited','წყარო მითითებულია'),c('регламент возвратов, п. 3','returns policy, §3','დაბრუნების წესი, §3'),'10:27']];
 const items=[[c('Проверки в нужных точках','Review where it matters','შემოწმება საჭირო მომენტში'),c('Согласуем, где нужен человек и какие действия нельзя выполнять автоматически.','Agree where people must review and which actions cannot run automatically.','ვათანხმებთ, სად არის საჭირო ადამიანი.')],[c('Ваши данные и правила','Your data and rules','თქვენი მონაცემები და წესები'),c('Определим источники, доступы и требования к работе с информацией до внедрения.','Define sources, access and data handling requirements before implementation.','დანერგვამდე ვადგენთ წყაროებსა და წვდომას.')],[c('Команда умеет пользоваться','Your team knows how','გუნდმა იცის გამოყენება'),c('Передаём инструкции и обучаем сотрудников на их реальных задачах.','Provide instructions and train staff on real tasks.','ვაძლევთ ინსტრუქციებს და ვასწავლით რეალურ ამოცანებზე.')],[c('Данные не обучают публичные модели','Your data never trains public models','მონაცემები არ ასწავლის საჯარო მოდელებს'),c('Enterprise API или размещение в вашем контуре — с поставкой GPU-серверов при необходимости.','Enterprise APIs or deployment in your infrastructure — with GPU server supply if needed.','Enterprise API ან განთავსება თქვენს ინფრასტრუქტურაში — საჭიროებისას GPU სერვერებით.')]];
 return (
  <section className="band-white bordered">
   <div className="wrap sec trust">
    <div data-reveal="" className="trust-head"><h2 className="h2 mw560">{s.trustH2}</h2>
     <div aria-hidden="true" className="log">
      <div className="log-title"><Icon name="shield-check" size={15}/>{s.logTitle}</div>
      <ul>{log.map(([icon,bg,fg,title,sub,time],i)=><li key={title} style={{animationDelay:(0.1+i*0.12)+'s'}}><span className="log-icon" style={{background:bg,color:fg}}><Icon name={icon} size={13}/></span><span className="min0 grow"><b>{title}</b><span>{sub}</span></span><small>{time}</small></li>)}</ul>
     </div>
    </div>
    <div className="grid-c4">
     {items.map(([title,body],i)=><div key={title} data-reveal="" style={rd(i*100)}><article className="trust-item"><h3>{title}</h3><p>{body}</p></article></div>)}
    </div>
   </div>
  </section>
 );
}
