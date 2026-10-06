'use client';
import {useEffect,useState} from 'react';
import {base} from '@/lib/base';
import {departments,industries,t} from '@/lib/content';
import {jobs} from '@/lib/jobs';
import {logo,pageLogos,LogoInfo} from '@/lib/logos';
import {sectionLabel} from '@/lib/site-copy';
import {Icon} from './icon';
import {BrandLogo,Mark,useReducedMotion} from './ui';
import type {X} from './types';
import {contentUpdated} from '@/lib/proof';

const rd=(ms:number)=>({'--rd':ms+'ms'} as React.CSSProperties);

// Last sentence (or the tail after a dash/comma) of a scenario is shown in bold as the key benefit.
const split=(body:string)=>{
 const parts=body.match(/[^.!?]+[.!?]+["»”]?(\s|$)/g);
 if(parts&&parts.length>1){const accent=parts.pop()!.trim();return {lead:parts.join('').trim(),accent}}
 const k=body.lastIndexOf(' — ');if(k>0)return {lead:body.slice(0,k)+' —',accent:body.slice(k+3)};
 const q=body.lastIndexOf(', ');if(q>body.length*.35)return {lead:body.slice(0,q+1),accent:body.slice(q+2)};
 return {lead:body,accent:''};
};
const scenarioIcons:Record<string,string[]>={sales:['moon-star','file-text','phone-call'],marketing:['pen-tool','megaphone','line-chart'],support:['book-open','message-square-text','git-branch'],operations:['scan-line','inbox','search'],hr:['shield-check','graduation-cap','route'],finance:['receipt','scale','camera'],procurement:['scale','search','truck'],leadership:['radar','trending-up','bar-chart-3'],retail:['shopping-bag','shopping-cart','package'],wholesale:['list-checks','file-spreadsheet','send'],hotels:['concierge-bell','calendar-check','languages'],tourism:['map','globe-2','compass'],'real-estate':['home','user-check','file-signature'],developers:['building-2','filter','languages'],restaurants:['utensils','cake','bike'],clinics:['calendar-clock','clipboard-list','heart-pulse'],logistics:['file-scan','truck','navigation'],manufacturing:['wrench','hard-hat','boxes'],services:['notebook','file-text','library'],education:['school','message-circle','check-square']};

type App=LogoInfo&{label:string;sub:string;bg:string;fg:string;line:string;canvas:string;bubble:string;tile:string;outBubble:string;outFg:string};

function getEntity(slug:string,data:X['data']){
 const industry=industries.find(i=>i.slug===slug),department=departments.find(i=>i.slug===slug);
 return {industry,department,ent:(industry||department)!,profile:data.profile!};
}

export function DetailHero({x,slug,page}:{x:X;slug:string;page:string}){
 const {c,s,lang,link}=x;const {ent,profile}=getEntity(slug,x.data);
 const ov=x.data.ov;
 return (
  <section data-screen-label="Detail hero" className="inner-hero">
   <div className="wrap inner-pad detail-grid">
    <div className="min0">
     <nav aria-label="Breadcrumb" className="crumbs wrapflex"><a href={base+'/'+lang}>{s.home}</a><span aria-hidden="true">/</span><a href={link(page)}>{sectionLabel(c,page)}</a><span aria-hidden="true">/</span><span aria-current="page">{t(ent.name,lang)}</span></nav>
     <h1 data-reveal="" className="deep-h1">{ov?ov.h1:t(x.data.headline!,lang)}</h1>
     <div data-reveal="" style={rd(120)}><p className="detail-intro">{ov?ov.sub:t(profile.scenarios[0].body,lang)}</p>
      <div className="detail-cta"><button type="button" onClick={()=>x.go(t(ent.name,lang))} className="btn btn-primary">{s.action}<Icon name="arrow-right" size={16}/></button><span>{s.detailNote}</span></div></div>
    </div>
    <div data-reveal="" style={rd(200)} className="min0"><Mock x={x} slug={slug}/></div>
   </div>
  </section>
 );
}

// Self-contained answer under the hero: the passage AI search quotes for "AI for <team> in Georgia".
export function DetailAnswer({x,slug}:{x:X;slug:string}){
 const {c,lang}=x;const qa=x.data.answer;
 if(!qa)return null;
 const [y,m,d]=contentUpdated.split('-');
 return (
  <section className="wrap sec detail-answer" aria-labelledby="answer-h">
   <div data-reveal="" className="mw820">
    <h2 id="answer-h" className="h2">{t(qa.q,lang)}</h2>
    <p className="answer-p">{t(qa.a,lang)}</p>
    <p className="answer-meta">{c('Обновлено','Updated','განახლდა')} <time dateTime={contentUpdated}>{d+'.'+m+'.'+y}</time></p>
   </div>
  </section>
 );
}

function AppHead({app}:{app:App}){
 return <div className="app-head" style={{background:app.bg,color:app.fg,borderBottomColor:app.line}}>
  <span className="app-tile" style={{background:app.tile}}><BrandLogo info={app} size={16} tile={28} variant="overlay"/></span>
  <span className="app-who"><b>{app.label}</b><small>{app.sub}</small></span>
  <span aria-hidden="true" className="app-dots"><i/><i/><i/></span>
 </div>;
}

function Mock({x,slug}:{x:X;slug:string}){
 const {c,s,lang}=x;const {profile}=getEntity(slug,x.data);
 const [stage,setStage]=useState<number|null>(null);const reduced=useReducedMotion();
 useEffect(()=>{if(reduced)return;const tm=setTimeout(()=>setStage(v=>v==null?1:v),3600);return()=>clearTimeout(tm)},[reduced]);
 const cur=stage??0;
 const kind=({sales:'crm','real-estate':'crm',developers:'crm',retail:'crm',services:'crm',support:'desk',hr:'chat',hotels:'chat',restaurants:'chat',clinics:'chat',education:'chat',tourism:'chat',leadership:'chat',marketing:'plan',procurement:'cmp',finance:'doc',operations:'doc',logistics:'doc',manufacturing:'doc',wholesale:'doc'} as Record<string,string>)[slug]||'doc';
 const ch=({hr:['hash','hr-help','Slack'],leadership:['send','Telegram · CEO','Telegram'],hotels:['message-circle',c('WhatsApp · гость','WhatsApp · guest','WhatsApp · სტუმარი'),'WhatsApp'],clinics:['message-circle',c('WhatsApp · пациент','WhatsApp · patient','WhatsApp · პაციენტი'),'WhatsApp'],restaurants:['instagram','Instagram Direct','Instagram'],education:['send',c('Telegram · абитуриент','Telegram · applicant','Telegram · აბიტურიენტი'),'Telegram'],tourism:['message-circle',c('WhatsApp · турист','WhatsApp · traveller','WhatsApp · ტურისტი'),'WhatsApp']} as Record<string,string[]>)[slug]||['hash','team','Slack'];
 const A=(name:string,solidTile:boolean,bg:string,fg:string,line:string,canvas:string,bubble:string,sub:string,extra?:Partial<App>):App=>({...logo(name),label:name,sub,bg,fg,line,canvas,bubble,tile:solidTile?'#ffffff':'transparent',outBubble:'#d9fdd3',outFg:'#121a2b',...extra});
 const apps:Record<string,()=>App>={
  wa:()=>A('WhatsApp',true,'#075e54','#ffffff','#075e54','#efeae2','#ffffff',c('Клиент · в сети','Customer · online','მომხმარებელი · ონლაინ')),
  tg:()=>A('Telegram',true,'#2aabee','#ffffff','#2aabee','#e6ebee','#ffffff',ch[1],{outBubble:'#effdde'}),
  ig:()=>A('Instagram',true,'#ffffff','#121a2b','#efefef','#fafafa','#efefef','Direct',{outBubble:'#3797f0',outFg:'#ffffff'}),
  gm:()=>A('Gmail',true,'#ffffff','#121a2b','#e9edf3','#f6f8fc','#ffffff',c('Входящие · 1 новое','Inbox · 1 new','შემოსული · 1 ახალი')),
  sl:()=>A('Slack',true,'#4a154b','#ffffff','#4a154b','#ffffff','#f8f8f8','# '+ch[1]),
  no:()=>A('Notion',true,'#ffffff','#121a2b','#e9edf3','#ffffff','#f7f6f3',c('Бриф кампании','Campaign brief','კამპანიის ბრიფი')),
  pdf:()=>A('PDF',false,'#323639','#ffffff','#323639','#e9edf3','#ffffff','scan_0347.pdf',{label:c('Просмотр скана','Scan viewer','სკანის ნახვა')}),
  amo:()=>A('amoCRM',false,'#26324a','#ffffff','#26324a','#f4f6f9','#ffffff',c('Воронка · Продажи','Pipeline · Sales','ძაბრი · გაყიდვები')),
  zd:()=>A('Zendesk',true,'#03363d','#ffffff','#03363d','#f8f9f9','#ffffff',c('Тикет #4821','Ticket #4821','ბილეთი #4821')),
  buf:()=>A('Buffer',true,'#ffffff','#121a2b','#e9edf3','#f5f7fa','#ffffff',c('Очередь публикаций','Publishing queue','პუბლიკაციების რიგი')),
  gs:()=>A('Google Sheets',true,'#ffffff','#121a2b','#e9edf3','#ffffff','#ffffff','quotes_comparison'),
  c1:()=>A('1C',false,'#fbed9e','#121a2b','#efe08a','#f7f7f2','#ffffff',c('Документ: черновик','Document: draft','დოკუმენტი: მონახაზი'),{label:({finance:c('1С:Бухгалтерия','1C:Accounting','1C:ბუღალტერია'),wholesale:c('1С:Управление торговлей','1C:Trade Management','1C:ვაჭრობის მართვა'),operations:c('1С:Документооборот','1C:Document Flow','1C:დოკუმენტბრუნვა'),logistics:c('1С:TMS Логистика','1C:TMS Logistics','1C:TMS ლოჯისტიკა')} as Record<string,string>)[slug]||'1C'}),
  sap:()=>A('SAP',true,'#354a5f','#ffffff','#354a5f','#f7f7f7','#ffffff',c('Документ закупки','Purchase document','შესყიდვის დოკუმენტი'),{label:'SAP S/4HANA'})
 };
 const chatApp=({hr:'sl',leadership:'tg',education:'tg',restaurants:'ig'} as Record<string,string>)[slug]||'wa';
 const inApp=apps[({crm:'wa',desk:'gm',chat:chatApp,plan:'no',cmp:'gm',doc:'pdf'} as Record<string,string>)[kind]]();
 const outApp=apps[({crm:'amo',desk:'zd',chat:chatApp,plan:'buf',cmp:'gs',doc:slug==='manufacturing'?'sap':'c1'} as Record<string,string>)[kind]]();
 const input=t(profile.input,lang);
 const rows=profile.rows.map(([k,v])=>({k:t(k,lang),v:t(v,lang)}));
 const files=kind==='cmp'?[['file-text',c('КП_поставщик_A.pdf','Quote_supplier_A.pdf','შეთავაზება_A.pdf'),'-1.5deg'],['file-spreadsheet','prices_B.xlsx','1deg'],['image',c('предложение_C (скан).jpg','offer_C (scan).jpg','შეთავაზება_C (სკანი).jpg'),'-.5deg']]:[['file-text','scan_0347.pdf','-1deg']];
 const pipe=[c('Новая','New','ახალი'),c('Квалиф.','Qualified','კვალიფ.'),c('КП','Proposal','შეთავ.'),c('Сделка','Won','გარიგება')];
 const posts=[['Instagram','instagram',c('Пн 10:00','Mon 10:00','ორშ 10:00'),c('Новая коллекция уже в шоуруме. Приходите примерить до пятницы.','The new collection is in the showroom. Come try it on before Friday.','ახალი კოლექცია უკვე შოურუმშია. მოდით პარასკევამდე.'),'#newcollection #tbilisi','linear-gradient(135deg,#dfe7ff,#efe9ff)'],['LinkedIn','linkedin',c('Вт 09:30','Tue 09:30','სამ 09:30'),c('Как сократить время подготовки КП: короткий разбор процесса.','How to cut proposal prep time: a short process breakdown.','როგორ შევამციროთ შეთავაზების მომზადების დრო.'),'#B2B #operations','linear-gradient(135deg,#e6edf6,#dfe7ff)'],['Telegram','send',c('Ср 18:00','Wed 18:00','ოთხ 18:00'),c('Дайджест недели: три новинки и скидка для подписчиков.','Weekly digest: three new arrivals and a subscriber discount.','კვირის დაიჯესტი: სამი სიახლე და ფასდაკლება.'),'GE · EN · RU','linear-gradient(135deg,#e3f1ff,#eaf0ff)']];
 const cmp:[string,string,string,string,boolean][]=[[c('Поставщик A','Supplier A','მომწოდებელი A'),'12 400 ₾',c('5 дней','5 days','5 დღე'),c('Предоплата 50%','50% prepay','50% წინასწარ'),false],[c('Поставщик B','Supplier B','მომწოდებელი B'),'11 900 ₾',c('7 дней','7 days','7 დღე'),c('Отсрочка 30 дн.','Net 30','30 დღე გადავადება'),true],[c('Поставщик C','Supplier C','მომწოდებელი C'),'12 150 ₾',c('3 дня','3 days','3 დღე'),c('Предоплата 100%','100% prepay','100% წინასწარ'),false]];
 const fade=(delay:number)=>({animationDelay:delay+'s'});
 return (
  <div className="mock">
   <div className="mock-bar">
    <span className="demo-brand"><Mark size={.5}/>Praxis Workspace</span>
    <div role="group" className="mock-tabs">
     {s.mockTabs.map((lb,i)=><button key={lb} type="button" onClick={()=>setStage(i)} aria-pressed={cur===i} className={cur===i?'is-on':''}>{lb}</button>)}
    </div>
   </div>
   <div aria-live="polite" className="mock-canvas" style={{background:(stage==null||stage===0?inApp:outApp).canvas}}>
    {cur===0?<div className="fade-in">
     <AppHead app={inApp}/>
     <div className="mock-in">
      {(kind==='cmp'||kind==='doc')&&<div className="mock-files">{files.map(([icon,name,rot])=><span key={name} style={{transform:'rotate('+rot+')'}}><Icon name={icon} size={13}/>{name}</span>)}</div>}
      <blockquote className="mock-quote" style={{background:inApp.bubble}}>{input}</blockquote>
      <span aria-hidden="true" className="mock-progress"><i style={{animation:stage==null&&!reduced?'px-progress 3.6s linear forwards':'none'}}/></span>
      <button type="button" onClick={()=>setStage(1)} className="ulink">{s.showResult}<Icon name="arrow-right" size={16}/></button>
     </div>
    </div>:<div className="fade-in">
     <AppHead app={outApp}/>
     <div className="mock-out">
      {kind==='crm'&&<>
       <div className="pipe">{pipe.map((l,i)=><span key={l} className={i===1?'is-on':i<1?'is-done':''}>{l}</span>)}</div>
       <div className="m-card">
        <div className="m-card-head">
         <span className="m-card-who"><span className="avatar-sq">WA</span><span className="min0"><b>{c('Новая сделка','New deal','ახალი გარიგება')+(rows[0]?' · '+rows[0].v:'')}</b><small>{c('Источник: WhatsApp · 2 мин назад','Source: WhatsApp · 2 min ago','წყარო: WhatsApp · 2 წთ წინ')}</small></span></span>
         <span className="pill pill-blue"><i/>{c('Квалифицирован','Qualified','კვალიფიცირებული')}</span>
        </div>
        <div className="crm-rows">{rows.map((r,i)=><div key={r.k} className={rows.length%2===1&&i===rows.length-1?'span-all':''}><small>{r.k}</small><span>{r.v}</span></div>)}</div>
        <div className="m-tags">{[c('Горячий лид','Hot lead','ცხელი ლიდი'),c('Назначен менеджер','Manager assigned','მენეჯერი დანიშნულია')].map(tg=><span key={tg} className="pill">{tg}</span>)}</div>
       </div>
      </>}
      {kind==='desk'&&<div className="m-card">
       <div className="desk-head"><b>#4821</b><span>{c('Вопрос клиента','Customer question','მომხმარებლის კითხვა')}</span><span className="desk-tags"><span className="pill pill-red">{c('Срочно','Urgent','სასწრაფო')}</span><span className="pill pill-blue">{c('Тег: доставка','Tag: delivery','ტეგი: მიწოდება')}</span></span></div>
       <div className="desk-body">
        <div className="desk-draft">
         <small className="desk-draft-title"><Icon name="pen-line" size={13}/>{c('Черновик ответа · по базе знаний','Draft reply · from knowledge base','პასუხის მონახაზი · ცოდნის ბაზიდან')}</small>
         <ul>{rows.map(r=><li key={r.k}><span>{r.k}:</span> {r.v}</li>)}</ul>
         <small className="desk-src"><Icon name="book-open" size={13}/>{c('Источник: регламент, раздел 3.2','Source: policy, section 3.2','წყარო: წესი, ნაწილი 3.2')}</small>
        </div>
        <div className="desk-actions"><span className="desk-send">{c('Отправить','Send','გაგზავნა')}</span><span className="desk-hand"><Icon name="user-round" size={13}/>{c('Передать оператору','Hand to agent','ოპერატორზე გადაცემა')}</span></div>
       </div>
      </div>}
      {kind==='chat'&&chatApp!=='sl'&&<div className="bubbles">
       <div className="bubble-in" style={{background:outApp.bubble}}>{input}<small>10:41</small></div>
       <div className="bubble-out" style={{background:outApp.outBubble,color:outApp.outFg}}><ul>{rows.map(r=><li key={r.k}><b>{r.k}:</b> {r.v}</li>)}</ul><small>10:41 <Icon name="check-check" size={13}/></small></div>
      </div>}
      {kind==='chat'&&chatApp==='sl'&&<div className="m-card">
       <div className="slack-head"><Icon name={ch[0]} size={14}/>{ch[1]}</div>
       <div className="slack-body">
        <div className="slack-msg"><span className="avatar-sq grey">{c('СТ','EM','EM')}</span><div className="min0"><b>{c('Сотрудник','Employee','თანამშრომელი')} <small>10:42</small></b><p>{input}</p></div></div>
        <div className="slack-msg"><span className="avatar-sq grad">P</span><div className="min0"><b className="slack-bot">Praxis <span className="badge">{c('ассистент','assistant','ასისტენტი')}</span> <small>10:42</small></b><ul>{rows.map(r=><li key={r.k}><Icon name="check" size={13}/><span><span className="muted">{r.k}:</span> {r.v}</span></li>)}</ul></div></div>
       </div>
      </div>}
      {kind==='plan'&&<div className="plan">
       {posts.map(([net,icon,time,text,tags,bg],i)=><div key={net} className="post" style={fade(i*.12)}>
        <span className="post-head"><span><Icon name={icon} size={14}/>{net}</span><span>{time}</span></span>
        <i aria-hidden="true" style={{background:bg}}/>
        <p>{text}</p>
        <span className="post-tags">{tags}</span>
       </div>)}
      </div>}
      {kind==='cmp'&&<table className="cmp">
       <thead><tr><th style={{width:'34%'}}>{s.cmpSupplier}</th><th>{s.cmpPrice}</th><th>{s.cmpLead}</th><th>{s.cmpTerms}</th></tr></thead>
       <tbody>{cmp.map(([name,price,lead,terms,best],i)=><tr key={name} className={best?'is-best':''} style={fade(i*.12)}><th scope="row">{name}{best&&<span className="pill pill-solid">{s.cmpBest}</span>}</th><td className="num">{price}</td><td>{lead}</td><td>{terms}</td></tr>)}</tbody>
      </table>}
      {kind==='doc'&&<div className="doc">
       <div aria-hidden="true" className="doc-paper"><i/><i/><i/><i/><i/><i/><i/></div>
       <ul>{rows.map((r,i)=>{const flag=rows.length>2&&i===rows.length-1;return <li key={r.k} style={fade(i*.1)}><span>{r.k}</span><span className="doc-v">{r.v}<span style={{color:flag?'#b54708':'#315bf5'}}><Icon name={flag?'alert-triangle':'check'} size={14}/></span></span></li>})}</ul>
      </div>}
      <span className="next-review"><i/>{s.nextReview}</span>
     </div>
    </div>}
   </div>
   <p className="demo-foot">{s.mockDisclaimer}</p>
  </div>
 );
}

export function Scenarios({x,slug}:{x:X;slug:string}){
 const {s,lang}=x;const {department,profile}=getEntity(slug,x.data);
 const ov=x.data.ov;
 const deptJobs=department&&jobs[slug];
 const items=deptJobs
  ?deptJobs.map(j=>({icon:j.i,title:t(j.t,lang),lead:t(j.d,lang),accent:''}))
  :(ov?ov.sc.map(([a,b])=>({title:a,body:b})):profile.scenarios.map(q=>({title:t(q.title,lang),body:t(q.body,lang)}))).map((q,i)=>({icon:(scenarioIcons[slug]||[])[i]||'layers',title:q.title,...split(q.body)}));
 return (
  <section id="scenarios" className="wrap sec">
   <div className="sec-head"><div data-reveal="" style={rd(80)}><h2 className="h2 mw820">{s.whereAI}</h2><p className="lead">{s.whereAIP}</p></div></div>
   <div className={deptJobs?'grid-c2':'grid-c3'} data-stagger="">
    {items.map(sc=><article key={sc.title} className="card sc-card">
     <span className="tile-icon tile-44 r12"><Icon name={sc.icon} size={22}/></span>
     <h3>{sc.title}</h3>
     <p>{sc.lead} {sc.accent&&<strong>{sc.accent}</strong>}</p>
     <button type="button" onClick={()=>x.go(sc.title)} className="ulink nowrap mt-auto">{s.exploreThis}<Icon name="arrow-right" size={16}/></button>
    </article>)}
   </div>
  </section>
 );
}

export function Tested({x,slug}:{x:X;slug:string}){
 const {s,lang}=x;const {ent,profile}=getEntity(slug,x.data);
 const ov=x.data.ov;
 return (
  <section className="band-white bordered">
   <div className="wrap sec split">
    <div data-reveal=""><h2 className="h2">{s.tested}</h2></div>
    <div>
     <p className="control-text">{ov?ov.ctl:t(profile.control,lang)}</p>
     <p className="guarantee"><Icon name="lock" size={17}/>{s.dataGuarantee}</p>
     <div className="grid-c2 mt28">
      <article className="trust-item"><h3>{s.sources}</h3><div className="logo-chips">{(pageLogos[slug]||[]).map(n=><span key={n} className="logo-chip"><BrandLogo info={logo(n)} size={16} tile={18}/>{n}</span>)}</div><p className="note">{s.sourcesNote}</p></article>
      <article className="trust-item"><h3>{s.measure}</h3><p className="metric">{t(ent.metric,lang)}</p><p className="note">{s.measureNote}</p></article>
     </div>
    </div>
   </div>
  </section>
 );
}

export function Related({x,slug}:{x:X;slug:string}){
 const {s,c,lang,link}=x;const {department}=getEntity(slug,x.data);
 const [idx,setIdx]=useState(0);
 if(!department)return null;
 const relevant=industries.filter(i=>i.departments.includes(slug));
 if(!relevant.length)return null;
 const rel=relevant[idx]||relevant[0];
 const map:Record<string,Record<string,number>>={retail:{sales:0,marketing:1,support:2,operations:2},wholesale:{sales:2,operations:0,procurement:1,finance:1},hotels:{support:0,sales:1,marketing:2},tourism:{sales:1,operations:0,support:2,marketing:1},'real-estate':{sales:0,marketing:1,operations:2,finance:2},developers:{sales:0,marketing:1,support:2},restaurants:{support:0,sales:1,operations:2,marketing:1},clinics:{support:0,operations:1,marketing:2},logistics:{operations:0,finance:0,support:1,hr:2,procurement:0},manufacturing:{operations:0,hr:1,procurement:2},services:{operations:0,leadership:0,sales:1,hr:2},education:{sales:0,marketing:0,support:1,hr:2,operations:2}};
 const special:Record<string,[string,string]>={'marketing/retail':[c('500 SEO-описаний для новой коллекции','500 SEO descriptions for a new collection','500 SEO აღწერა ახალი კოლექციისთვის'),c('ИИ пишет уникальные описания товаров в тоне вашего бренда на трёх языках. Редактор проверяет выборку и публикует.','AI writes unique product descriptions in your brand voice in three languages. An editor reviews a sample and publishes.','AI წერს უნიკალურ აღწერებს თქვენი ბრენდის ტონით სამ ენაზე. რედაქტორი ამოწმებს და აქვეყნებს.')],'procurement/manufacturing':[c('Сверка спецификаций с ГОСТ и ТУ','Checking specs against standards','სპეციფიკაციების შემოწმება სტანდარტებთან'),c('ИИ сравнивает характеристики из КП поставщиков с требованиями ГОСТ, ТУ и вашими спецификациями и подсвечивает отклонения. Решение принимает инженер.','AI compares supplier specs with standards and your requirements and flags deviations. An engineer makes the call.','AI ადარებს მომწოდებლის სპეციფიკაციებს სტანდარტებს და აჩვენებს გადახრებს. გადაწყვეტილებას ინჟინერი იღებს.')]};
 const k=map[rel.slug]?.[slug]??0;
 const sp=special[slug+'/'+rel.slug],relSc=x.data.related?.[rel.slug]?.[k];
 const sc=sp?{title:sp[0],body:sp[1]}:relSc?{title:relSc[0],body:relSc[1]}:{title:t(rel.promise,lang),body:t(rel.solution,lang)};
 return (
  <section className="wrap sec">
   <div className="sec-head"><div data-reveal="" style={rd(80)}><h2 className="h2 mw820">{s.oneRole}</h2></div></div>
   <div className="dept-layout">
    <div role="tablist" className="dept-tabs rel-tabs">
     {relevant.map((r,i)=><button key={r.slug} role="tab" aria-selected={rel===r} onClick={()=>setIdx(i)} className={'rel-tab'+(rel===r?' is-on':'')}>{t(r.name,lang)}</button>)}
    </div>
    <article key={rel.slug} role="tabpanel" className="panel fade-in">
     <span className="rel-label">{t(department.name,lang)+' × '+t(rel.name,lang)}</span>
     <h3 className="panel-h3">{sc.title}</h3>
     <p className="rel-body">{sc.body}</p>
     <a href={link('industries/'+rel.slug)} className="ulink mt24">{s.industryWorkflows}<Icon name="arrow-right" size={16}/></a>
    </article>
   </div>
  </section>
 );
}
