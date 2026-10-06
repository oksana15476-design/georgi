'use client';
import {useEffect,useRef,useState} from 'react';
import {departments,industries,t} from '@/lib/content';
import {jobs} from '@/lib/jobs';
import {logo,marqueeLogos} from '@/lib/logos';
import {Icon} from './icon';
import {industryIcon} from './header';
import {deptCardIcon} from './inner';
import {BrandLogo,CountUp,Mark,useReducedMotion} from './ui';
import type {X} from './types';
import {casesVerified} from '@/lib/proof';
import {contacts} from '@/lib/contacts';

export function Hero({x}:{x:X}){
 const {s,c}=x;
 const proof=casesVerified?[['60%',c('ответов гостям автоматизировано · сеть отелей','of guest replies automated · hotel network','ავტომატიზებული პასუხები · სასტუმროები')],[c('40 ч','40 h','40 სთ'),c('экономии в месяц · оптовый дистрибьютор','saved monthly · wholesale distributor','დაზოგილი თვეში · დისტრიბუტორი')],[c('3 языка','3 languages','3 ენა'),c('GE · EN · RU в каждом решении','GE · EN · RU in every solution','GE · EN · RU ყველა გადაწყვეტილებაში')]]
  :[['24/7',c('ответы клиентам в WhatsApp, Instagram и Telegram','replies to customers on WhatsApp, Instagram and Telegram','პასუხები კლიენტებს WhatsApp‑ში, Instagram‑სა და Telegram‑ში')],[c('2⁠–⁠4 нед.','2⁠–⁠4 wks','2⁠–⁠4 კვ.'),c('пилот на ваших реальных данных','pilot on your real data','პილოტი თქვენს რეალურ მონაცემებზე')],[c('3 языка','3 languages','3 ენა'),c('GE · EN · RU в каждом решении','GE · EN · RU in every solution','GE · EN · RU ყველა გადაწყვეტილებაში')]];
 return (
  <section data-screen-label="Hero" className="wrap hero">
   <div aria-hidden="true" className="hero-glow"/>
   <div className="hero-grid">
    <div className="min0">
     <p data-reveal="" className="hero-eyebrow">{s.heroEyebrow}</p>
     <div className="hero-copy">
      <h1 data-reveal="" style={{'--rd':'60ms'} as React.CSSProperties} className="h1">{s.heroH1a} {s.heroH1b} <span className="accent-line">{s.heroH1c}</span></h1>
      <div data-reveal="" style={{'--rd':'180ms'} as React.CSSProperties} className="hero-lead">
       <p>{s.heroIntro}</p>
       <div className="btn-row">
        <a href={contacts.whatsapp+'?text='+encodeURIComponent(s.heroWhatsAppText)} target="_blank" rel="noopener" className="btn btn-primary"><Icon name="whatsapp" size={17}/>{s.heroWhatsApp}</a>
        <a href="#contact" onClick={x.toContact} className="btn btn-ghost">{s.action}<Icon name="arrow-right" size={16}/></a>
       </div>
      </div>
     </div>
     <div data-reveal="" style={{'--rd':'260ms'} as React.CSSProperties} className="proof-mini">
      {proof.map(([n,l])=><span key={n}><b>{n}</b>{l}</span>)}
     </div>
    </div>
    <div className="min0"><div data-reveal="" style={{'--rd':'120ms'} as React.CSSProperties}><HeroDemo x={x}/></div></div>
   </div>
  </section>
 );
}

function HeroDemo({x}:{x:X}){
 const {s,c}=x;
 const [frame,setFrame]=useState<0|2>(0),[paused,setPaused]=useState(false),[typing,setTyping]=useState(true);
 const reduced=useReducedMotion();
 const typingT=useRef<ReturnType<typeof setTimeout>>(undefined);
 const state=useRef({paused,reduced,frame});
 useEffect(()=>{state.current={paused,reduced,frame}},[paused,reduced,frame]);
 useEffect(()=>{
  if(reduced)return;
  typingT.current=setTimeout(()=>setTyping(false),1100);
  const timer=setInterval(()=>{
   if(state.current.paused||state.current.reduced)return;
   const nf=state.current.frame===0?2:0;setFrame(nf);
   if(nf===0){setTyping(true);clearTimeout(typingT.current);typingT.current=setTimeout(()=>setTyping(false),1100)}
  },3200);
  return()=>{clearInterval(timer);clearTimeout(typingT.current)};
 },[reduced]);
 const playing=!paused&&!reduced;
 const select=(f:0|2)=>{setFrame(f);setPaused(true);setTyping(false)};
 // "See it in action" restarts the demo from the incoming message and briefly highlights it.
 const [flash,setFlash]=useState(0);
 useEffect(()=>{
  const replay=()=>{setFrame(0);setPaused(false);setFlash(n=>n+1);if(!reduced){setTyping(true);clearTimeout(typingT.current);typingT.current=setTimeout(()=>setTyping(false),1100)}};
  window.addEventListener('praxen:demo-replay',replay);return()=>window.removeEventListener('praxen:demo-replay',replay);
 },[reduced]);
 const showTyping=frame===0&&playing&&typing;
 const fill=(i:0|2)=>{const on=frame===i;return {transform:on?(playing?'none':'scaleX(1)'):(i<frame?'scaleX(1)':'scaleX(0)'),animation:on&&playing?'px-progress 2.8s linear both':'none'}};
 const crmRows=[[c('Товар','Item','პროდუქტი'),c('Стулья','Chairs','სკამები')],[c('Кол-во','Qty','რაოდ.'),'30'],[c('Город','City','ქალაქი'),c('Батуми','Batumi','ბათუმი')],[c('Срок','When','ვადა'),c('Завтра','Tomorrow','ხვალ')]];
 const steps:[0|2,string][]=[[0,s.demoRequest],[2,s.demoResult]];
 return (
  <div id="demo" key={'demo'+flash} className={'demo'+(flash?' is-flash':'')}>
   <div className="demo-bar">
    <span className="demo-brand"><Mark size={.5}/>Praxen Workspace</span>
    <span className="demo-title">{s.demoTitle}</span>
    <span className="spacer"/>
    <button type="button" onClick={()=>setPaused(p=>!p)} aria-label={paused?s.play:s.pause} className="icon-btn"><Icon name={paused?'play':'pause'} size={14}/></button>
   </div>
   <div aria-live="polite" className="demo-frames">
    <div className={'demo-frame'+(frame===0?' is-active':'')}>
     <button type="button" onClick={()=>select(0)} aria-pressed={frame===0} className="demo-step">
      <span className="demo-step-label"><span>{s.demoRequest}</span><span>WhatsApp</span></span>
      <span className="demo-step-track"><i key={frame+'-'+paused} style={fill(0)}/></span>
     </button>
     <div className="demo-body">
      <div className="wa">
       <div className="wa-head">
        <Icon name="chevron-left" size={16}/>
        <span className="wa-avatar">GS</span>
        <span className="wa-who"><b>Giorgi · Office Supply</b><small>{showTyping?s.typing:s.online}</small></span>
        <span className="wa-icons"><Icon name="video" size={16}/><Icon name="phone" size={15}/></span>
       </div>
       <div className="wa-canvas">
        <span className="wa-today">{s.today}</span>
        {showTyping
         ?<span key="typing" className="wa-typing"><i/><i/><i/></span>
         :<div key={'msg'+frame} className="wa-msg" style={{animation:frame===0&&!reduced?'px-bubble .45s cubic-bezier(.22,1,.36,1) both':'none'}}>{s.demoMsg}<small>10:41<span><Icon name="check-check" size={14}/></span></small></div>}
       </div>
      </div>
      <p className="demo-cap">{s.demoCap0}</p>
     </div>
    </div>
    <div className={'demo-frame'+(frame===2?' is-active':'')}>
     <button type="button" onClick={()=>select(2)} aria-pressed={frame===2} className="demo-step">
      <span className="demo-step-label"><span>{s.demoResult}</span><span>CRM</span></span>
      <span className="demo-step-track"><i key={frame+'-'+paused} style={fill(2)}/></span>
     </button>
     <div className="demo-body">
      <div key={'crm'+frame} className="crm-card" style={{animation:frame===2&&!reduced?'px-bubble .5s cubic-bezier(.22,1,.36,1) both':'none'}}>
       <div className="crm-head"><span className="amo-tile">amo</span><span className="crm-who"><b>amoCRM</b><small>{c('Новая сделка · из WhatsApp','New deal · from WhatsApp','ახალი გარიგება · WhatsApp‑დან')}</small></span><span className="crm-stage">{c('Квалифицирован','Qualified','კვალიფიცირებული')}</span></div>
       <div className="crm-grid">{crmRows.map(([k,v],i)=><div key={k}><small>{k}</small><span style={reduced?undefined:{animation:'px-fill .4s ease-out '+(.35+i*.18)+'s both'}}>{v}</span></div>)}</div>
       <div className="crm-next" style={reduced?undefined:{animation:'px-fade .4s ease-out 1.1s both'}}><Icon name="file-text" size={14}/>{c('Черновик КП готов к проверке менеджером','Draft proposal ready for manager review','შეთავაზების მონახაზი მზადაა')}</div>
      </div>
      <p className="demo-cap">{c('Менеджер получает готовую карточку вместо переписки.','Your manager gets a ready deal card instead of a chat thread.','მენეჯერი იღებს მზა ბარათს მიმოწერის ნაცვლად.')}</p>
     </div>
    </div>
   </div>
   <div className="demo-switch">
    {steps.map(([f,lb])=><button key={f} type="button" onClick={()=>select(f)} aria-pressed={frame===f} className={frame===f?'is-on':''}>{lb}</button>)}
   </div>
   <p className="demo-foot">{s.demoFoot}</p>
  </div>
 );
}

export function Marquee({x}:{x:X}){
 const items=[...marqueeLogos,...marqueeLogos];
 return (
  <section aria-label={x.s.stackEyebrow} className="marquee-band">
   <div className="wrap marquee-row">
    <p className="marquee-label">{x.s.stackEyebrow}</p>
    <div className="marquee-mask">
     <div className="marquee-track">
      {items.map((n,i)=><span key={i} aria-hidden={i>=marqueeLogos.length?'true':undefined} className="marquee-item"><BrandLogo info={logo(n)} size={22} tile={22}/>{n}</span>)}
     </div>
    </div>
   </div>
   <p className="wrap marquee-note">{x.s.stackP}</p>
  </section>
 );
}

type Num={n:string;l:string};
export function resultsData(x:X){
 const {c,link}=x;
 return [
  {over:c('ГОСТИНИЧНЫЙ БИЗНЕС · АДЖАРИЯ','HOSPITALITY · ADJARA','სასტუმროები · აჭარა'),title:c('Сеть из четырёх отелей','A network of four hotels','ოთხი სასტუმროს ქსელი'),body:c('Автоматизация ответов гостям в WhatsApp. Типовые вопросы обрабатывает помощник.','Automated guest replies in WhatsApp, with an assistant handling routine questions.','სტუმრების პასუხების ავტომატიზაცია WhatsApp‑ში. ტიპურ კითხვებს ასისტენტი ამუშავებს.'),nums:[{n:'60%',l:c('ответов автоматизировано','of replies automated','პასუხების ავტომატიზაცია')},{n:'15 '+c('мин','min','წთ')+' → 10 '+c('сек','sec','წმ'),l:c('время ответа','response time','პასუხის დრო')}] as Num[],href:link('industries/hotels'),link:c('Решения для отелей','Solutions for hotels','გადაწყვეტილებები სასტუმროებისთვის'),
   quote:c('«Типовые вопросы гостей больше не копятся в чатах. Администраторы занимаются гостями, а не перепиской».','“Routine guest questions no longer pile up in chats. Our front desk focuses on guests, not messaging.”','„სტუმრების ტიპური კითხვები ჩატებში აღარ გროვდება. ადმინისტრატორები სტუმრებით არიან დაკავებულნი და არა მიმოწერით.“'),who:c('Операционный директор','Operations Director','ოპერაციული დირექტორი'),org:c('Сеть из четырёх отелей, Аджария','Four-hotel network, Adjara','ოთხი სასტუმროს ქსელი, აჭარა'),initials:'OD'},
  {over:c('ОПТОВАЯ ТОРГОВЛЯ','WHOLESALE','საბითუმო ვაჭრობა'),title:c('Оптовый дистрибьютор','Wholesale distributor','საბითუმო დისტრიბუტორი'),body:c('Извлечение заявок из PDF и передача данных в CRM. Менеджеру больше не нужно переносить каждую позицию вручную.','Extracting enquiries from PDFs into CRM removes manual entry of individual items.','PDF მოთხოვნების ამოღება და CRM‑ში გადატანა ამცირებს ხელით შეყვანას.'),nums:[{n:c('40 часов','40 hours','40 საათი'),l:c('работы менеджера в месяц сэкономлено','of sales staff time saved per month','მენეჯერის დაზოგილი დრო თვეში')},{n:'PDF → CRM',l:c('единый процесс обработки','one processing workflow','დამუშავების ერთიანი პროცესი')}] as Num[],href:link('industries/wholesale'),link:c('Решения для оптовой торговли','Solutions for wholesale','გადაწყვეტილებები საბითუმო ვაჭრობისთვის'),
   quote:c('«Заявки из PDF попадают в CRM уже разобранными. Менеджеры продают, а не перебивают позиции вручную».','“PDF orders land in the CRM already parsed. Our team sells instead of retyping line items.”','„PDF შეკვეთები CRM‑ში უკვე დამუშავებული ხვდება. მენეჯერები ყიდიან და არა ხელით აკრეფენ პოზიციებს.“'),who:c('Руководитель отдела продаж','Head of Sales','გაყიდვების ხელმძღვანელი'),org:c('Оптовый дистрибьютор','Wholesale distributor','საბითუმო დისტრიბუტორი'),initials:'HS'}
 ];
}

// Shared by the home page (numbers count up) and the cases page (static numbers).
export function Results({x,count}:{x:X;count:boolean}){
 const {s}=x;
 return (
  <section data-screen-label="Results" className="band-soft">
   <div className="wrap sec">
    <div className="sec-head"><div data-reveal="" style={{'--rd':'80ms'} as React.CSSProperties}><h2 className="h2 mw820">{s.resultsH2}</h2><p className="lead lead-muted">{s.resultsP}</p></div></div>
    <div className="results-grid" data-stagger="">
     {resultsData(x).map(r=><article key={r.href} className="card result-card">
      <span className="over">{r.over}</span>
      {!casesVerified&&<span className="pill result-example">{x.c('Пример сценария','Example scenario','სცენარის მაგალითი')}</span>}
      <h3 className="result-h3">{r.title}</h3>
      <p className="result-body">{r.body}</p>
      {casesVerified&&<figure className="quote"><span className="quote-mark"><Icon name="quote" size={20}/></span><div><blockquote>{r.quote}</blockquote><figcaption><span className="avatar">{r.initials}</span><span><b>{r.who}</b>{r.org}</span></figcaption></div></figure>}
      <div className="result-nums">
       {r.nums.map(nm=>{const mt=count?/^(\d+)(%|\s\D+)$/.exec(nm.n):null;return <div key={nm.l}>
        {mt?<div className="num-big"><CountUp to={+mt[1]} suffix={mt[2]}/></div>:<div className="num-s">{nm.n}</div>}
        <p>{nm.l}</p>
       </div>})}
      </div>
      <a href={r.href} className="ulink mt-auto">{r.link}<Icon name="arrow-right" size={16}/></a>
     </article>)}
    </div>
   </div>
  </section>
 );
}

export function FindWorkflow({x}:{x:X}){
 const {s,c,lang,link}=x;
 const [audience,setAudience]=useState<'departments'|'industries'>('departments'),[dept,setDept]=useState(0);
 const tabs=useRef<(HTMLButtonElement|null)[]>([]);
 const d=departments[dept];
 const onKey=(e:React.KeyboardEvent)=>{
  const n=departments.length;let k=-1;
  if(e.key==='ArrowDown'||e.key==='ArrowRight')k=(dept+1)%n;else if(e.key==='ArrowUp'||e.key==='ArrowLeft')k=(dept-1+n)%n;else if(e.key==='Home')k=0;else if(e.key==='End')k=n-1;
  if(k<0)return;e.preventDefault();setDept(k);tabs.current[k]?.focus();
 };
 const homeIndustries=[0,2,4,1,7,8].map(n=>industries[n]).filter(Boolean);
 const labels:[typeof audience,string][]=[['departments',c('Для отделов','For departments','განყოფილებებისთვის')],['industries',c('Отрасли','Industries','ინდუსტრიები')]];
 return (
  <section className="wrap sec">
   <div className="sec-head">
    <div data-reveal="" style={{'--rd':'80ms'} as React.CSSProperties} className="switch-head">
     <h2 className="h2">{s.findWorkflow}</h2>
     <div role="group" className="seg">
      <i aria-hidden="true" style={{transform:audience==='industries'?'translateX(100%)':'translateX(0)'}}/>
      {labels.map(([a,lb])=><button key={a} type="button" onClick={()=>setAudience(a)} aria-pressed={audience===a} className={audience===a?'is-on':''}>{lb}</button>)}
     </div>
    </div>
   </div>
   {audience==='departments'?
    <div id="departments" className="dept-layout">
     <div role="tablist" aria-label={c('Для отделов','For departments','განყოფილებებისთვის')} aria-orientation="vertical" className="dept-tabs" onKeyDown={onKey}>
      {departments.map((dp,i)=><button key={dp.slug} ref={el=>{tabs.current[i]=el}} role="tab" id={'dept-'+i} aria-selected={dept===i} aria-controls="dept-panel" tabIndex={dept===i?0:-1} onClick={()=>setDept(i)} className={'dept-tab'+(dept===i?' is-on':'')}><i aria-hidden="true"/><span className="dept-tab-icon"><Icon name={deptCardIcon[dp.slug]||'layers'} size={17}/></span>{t(dp.name,lang)}</button>)}
     </div>
     <div id="dept-panel" role="tabpanel" aria-labelledby={'dept-'+dept} className="panel">
      <div key={dept} className="fade-in">
       <div className="panel-head">
        <h3 className="panel-h3">{t(d.job,lang)}</h3>
        <a href={link('departments/'+d.slug)} className="ulink nowrap">{s.exploreDept}<Icon name="arrow-right" size={16}/></a>
       </div>
       <div className="jobs-grid">
        {(jobs[d.slug]||[]).map(j=><div key={j.t[1]} className="job">
         <span className="tile-icon"><Icon name={j.i} size={20}/></span>
         <span className="min0"><b>{t(j.t,lang)}</b><span>{t(j.d,lang)}</span></span>
        </div>)}
       </div>
      </div>
     </div>
    </div>
   :<>
    <div className="grid-c3" data-stagger="">
     {homeIndustries.map(ind=><a key={ind.slug} href={link('industries/'+ind.slug)} className="card ind-card">
      <span className="ind-top"><span className="tile-icon"><Icon name={industryIcon[ind.slug]||'building'} size={20}/></span><Icon name="arrow-up-right" size={18}/></span>
      <h3>{t(ind.name,lang)}</h3>
      <p>{t(ind.promise,lang)}</p>
     </a>)}
    </div>
    <a href={link('industries')} className="ulink mt28">{s.all12}<Icon name="arrow-right" size={16}/></a>
   </>}
  </section>
 );
}
