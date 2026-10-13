'use client';
import {useEffect,useRef,useState} from 'react';
import {getAttribution,track} from '@/components/analytics';
import {base,homeHref,pageHref} from '@/lib/base';
import {contacts} from '@/lib/contacts';
import {absolute,pageUrl} from '@/lib/seo';
import {webinar as w} from '@/lib/webinar';
import {Icon} from './icon';
import {MotionRoot,Wordmark,scrollToId} from './ui';

const rd=(ms:number)=>({'--rd':ms+'ms'} as React.CSSProperties);
const calendarUrl='https://calendar.google.com/calendar/render?action=TEMPLATE&text='+encodeURIComponent('Вебинар «ИИ в отделе продаж» — Praxen AI')+'&dates='+w.calStart+'/'+w.calEnd+'&details='+encodeURIComponent('Ссылку на эфир пришлём в Telegram: '+w.bot)+'&ctz=Asia/Tbilisi';

function jsonLd(){
 const url=pageUrl('ru',w.path),org=absolute('/#organization');
 return {'@context':'https://schema.org','@graph':[
  {'@type':'Event','@id':url+'#event',name:'ИИ в отделе продаж',description:w.description,startDate:w.start,endDate:w.end,
   eventStatus:'https://schema.org/EventScheduled',eventAttendanceMode:'https://schema.org/OnlineEventAttendanceMode',
   location:{'@type':'VirtualLocation',url},inLanguage:'ru',isAccessibleForFree:true,image:absolute('/og/og-ru.png'),
   organizer:{'@id':org},performer:{'@id':absolute('/#founder')},
   offers:{'@type':'Offer',price:0,priceCurrency:'GEL',availability:'https://schema.org/InStock',url}},
  {'@type':'FAQPage',mainEntity:w.faq.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))},
 ]};
}

function RegisterForm({id}:{id:string}){
 const [name,setName]=useState(''),[method,setMethod]=useState<'telegram'|'whatsapp'|'phone'>('telegram'),[contact,setContact]=useState(''),[industry,setIndustry]=useState(''),[website,setWebsite]=useState('');
 const [status,setStatus]=useState<''|'invalid'|'error'>(''),[sending,setSending]=useState(false),[done,setDone]=useState(false);
 const started=useRef(false);
 const start=()=>{if(!started.current){started.current=true;track('form_start',{form:'webinar',page:location.pathname})}};
 const change=(value:string)=>{
  start();setStatus('');
  if(method==='telegram'){setContact(value.replace(/\s/g,''));return}
  const d=value.replace(/\D/g,'').slice(0,15);
  if(d.startsWith('995')){const r=d.slice(3);setContact('+995'+(r?' '+r.slice(0,3):'')+(r.length>3?' '+r.slice(3,6):'')+(r.length>6?' '+r.slice(6,9):''))}
  else setContact((value.startsWith('+')?'+':'')+d);
 };
 const submit=async(e:React.FormEvent)=>{
  e.preventDefault();if(sending)return;
  const plain=contact.replace(/\D/g,'');
  const bad=method==='telegram'?!/^@?[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(contact)&&!/^\+[0-9]{7,15}$/.test(contact.replace(/[\s()-]/g,'')):plain.length<7||plain.length>15;
  if(bad){setStatus('invalid');track('form_error',{form:'webinar',reason:'invalid_contact'});return}
  setSending(true);setStatus('');
  try{
   const r=await fetch(base+'/api/leads',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,contact:method+': '+contact,context:'Вебинар 12 ноября'+(industry?' · '+industry:''),tasks:industry?[industry]:[],lang:'ru',page:location.pathname,source:getAttribution(),website})});
   if(!r.ok)throw new Error();
   setDone(true);track('generate_lead',{form:'webinar',method,page:location.pathname});
  }catch{setStatus('error');track('form_error',{form:'webinar',reason:'send_failed'})}
  finally{setSending(false)}
 };
 const invalid=status==='invalid';
 const methods:[typeof method,string][]=[['telegram','Telegram'],['whatsapp','WhatsApp'],['phone','Телефон']];
 if(done)return (
  <div role="status" className="form-done wb-done fade-in">
   <span className="done-icon"><Icon name="check" size={22}/></span>
   <h3>Вы зарегистрированы</h3>
   <p>Ссылку на эфир и напоминания пришлём в Telegram. Откройте бота, чтобы их получить.</p>
   <a href={w.bot} target="_blank" rel="noopener" className="btn btn-primary wb-wide">Получить ссылку в Telegram<Icon name="send" size={16}/></a>
   <a href={calendarUrl} target="_blank" rel="noopener" className="ulink">Добавить в календарь<Icon name="calendar" size={16}/></a>
  </div>
 );
 return (
  <form onSubmit={submit} noValidate data-lpignore="true" className="form" aria-labelledby={id+'-title'}>
   <div><h2 id={id+'-title'} className="wb-form-h">Регистрация</h2><p className="wb-form-sub">12 ноября, 19:00 по Тбилиси · бесплатно</p></div>
   <label className="field">Имя<input name="name" required maxLength={100} value={name} onChange={e=>{start();setName(e.target.value)}} autoComplete="given-name"/></label>
   <div className="field">
    <span className="step-label">Куда прислать ссылку</span>
    <div role="radiogroup" aria-label="Куда прислать ссылку" className="methods">{methods.map(([k,lb])=><button key={k} type="button" role="radio" aria-checked={method===k} onClick={()=>{setMethod(k);setContact('');setStatus('')}} className={method===k?'is-on':''}>{lb}</button>)}</div>
   </div>
   <label className="field">{method==='telegram'?'Telegram':method==='whatsapp'?'WhatsApp':'Телефон'}<input name="contact" required value={contact} onChange={e=>change(e.target.value)} placeholder={method==='telegram'?'@username или +995…':'+995 5XX XXX XXX'} inputMode={method==='telegram'?'text':'tel'} autoComplete={method==='telegram'?'off':'tel'} aria-invalid={invalid} aria-describedby={status?id+'-status':undefined} className={invalid?'is-invalid':''}/></label>
   <fieldset>
    <legend className="wb-legend">Ваша отрасль <span className="muted">— по желанию</span></legend>
    <div className="chips">{w.formIndustries.map(lb=><button key={lb} type="button" onClick={()=>{start();setIndustry(v=>v===lb?'':lb)}} aria-pressed={industry===lb} className={'chip'+(industry===lb?' is-on':'')}>{lb}</button>)}</div>
   </fieldset>
   <input name="website" tabIndex={-1} aria-hidden="true" autoComplete="off" value={website} onChange={e=>setWebsite(e.target.value)} className="hp"/>
   {status&&<p id={id+'-status'} role="alert" className="form-status"><Icon name="alert-circle" size={16}/>{invalid?'Проверьте контакт: номер телефона или @username в Telegram.':'Не получилось отправить. Попробуйте ещё раз или напишите нам в WhatsApp.'}</p>}
   <button type="submit" disabled={sending} className="btn btn-primary wb-wide">{sending?'Отправляем…':'Зарегистрироваться'}<Icon name="arrow-right" size={16}/></button>
   <small className="wb-note">Нажимая кнопку, вы соглашаетесь на обработку данных и сообщения о вебинаре. <a href={pageHref('ru','privacy')}>Политика конфиденциальности</a></small>
  </form>
 );
}

export function Webinar(){
 const [sticky,setSticky]=useState(false);
 useEffect(()=>{
  const form=document.getElementById('register');
  const onScroll=()=>{const r=form?.getBoundingClientRect();setSticky(!!r&&r.bottom<0)};onScroll();
  window.addEventListener('scroll',onScroll,{passive:true});return()=>window.removeEventListener('scroll',onScroll);
 },[]);
 const toForm=(e?:React.MouseEvent)=>{e?.preventDefault();scrollToId('register');setTimeout(()=>document.querySelector<HTMLInputElement>('#register input[name=name]')?.focus({preventScroll:true}),500)};
 return (
  <div className="site wb">
   <MotionRoot/>
   <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonLd()).replace(/</g,'\\u003c')}}/>
   <header className="site-header is-scrolled">
    <div className="wrap header-row">
     <a href={homeHref('ru')} className="brand" aria-label="Praxen AI — главная"><Wordmark/></a>
     <div className="header-actions"><a href="#register" onClick={toForm} className="btn btn-primary btn-sm wb-head-cta">Зарегистрироваться</a></div>
    </div>
   </header>

   <main id="main" tabIndex={-1}>
    <section data-screen-label="Webinar hero" className="inner-hero wb-hero">
     <div className="wrap inner-pad wb-hero-grid">
      <div className="min0">
       <p data-reveal="" className="wb-over"><span className="wb-dot" aria-hidden="true"/>{w.over}</p>
       <h1 data-reveal="" style={rd(80)} className="inner-h1 wb-h1">{w.h1}</h1>
       <p data-reveal="" style={rd(140)} className="wb-lead">{w.lead}</p>
       <ul data-reveal="" style={rd(200)} className="wb-facts">{w.facts.map(([icon,label])=><li key={label}><span className="tile-icon"><Icon name={icon} size={18}/></span>{label}</li>)}</ul>
      </div>
      <div id="register" className="form-box wb-form-box"><RegisterForm id="wb-top"/></div>
     </div>
    </section>

    <section data-screen-label="Webinar audience" className="wrap sec">
     <div className="wb-split">
      <div data-reveal=""><p className="kicker">Кому полезно</p><h2 className="h2">Владельцам и руководителям продаж.</h2><p className="lead">Если заявки приходят в WhatsApp, Telegram и на сайт, а отвечать на них успевают не всегда.</p></div>
      <ul data-reveal="" style={rd(100)} className="wb-ind">{w.industries.map(([icon,label])=><li key={label}><span className="tile-icon"><Icon name={icon} size={18}/></span>{label}</li>)}</ul>
     </div>
    </section>

    <section data-screen-label="Webinar learn" className="wb-band">
     <div className="wrap sec">
      <div className="sec-head"><div data-reveal=""><p className="kicker">Что вы узнаете</p><h2 className="h2 mw820">Четыре вопроса, которые разберём на эфире.</h2></div></div>
      <ol data-stagger="" className="wb-learn">{w.learn.map(([title,body],i)=><li key={title}><span className="step-num">{'0'+(i+1)}</span><h3>{title}</h3><p>{body}</p></li>)}</ol>
     </div>
    </section>

    <section data-screen-label="Webinar demo" className="wrap sec">
     <div className="sec-head"><div data-reveal=""><p className="kicker">Демонстрация</p><h2 className="h2 mw820">Что покажем: от сообщения клиента до карточки в CRM.</h2><p className="lead">Пример сценария на нашем демо-стенде. Данные клиентов не показываем.</p></div></div>
     <ol data-stagger="" className="wb-demo">{w.demo.map(([icon,title,body],i)=><li key={title}>
      <span className="wb-demo-icon"><Icon name={icon} size={22}/></span>
      <span className="step-num">{'Шаг '+(i+1)}</span>
      <h3>{title}</h3><p>{body}</p>
     </li>)}</ol>
    </section>

    <section data-screen-label="Webinar agenda" className="wb-band">
     <div className="wrap sec wb-split wb-split-top">
      <div data-reveal=""><p className="kicker">Программа</p><h2 className="h2">45 минут по шагам.</h2><p className="lead">Время в минутах от начала эфира.</p></div>
      <ol data-reveal="" style={rd(100)} className="wb-agenda">{w.agenda.map(([min,title,body])=><li key={min}><span className="wb-min">{min}</span><div><h3>{title}</h3><p>{body}</p></div></li>)}</ol>
     </div>
    </section>

    <section data-screen-label="Webinar host" className="wrap sec">
     <div className="sec-head"><div data-reveal=""><p className="kicker">Ведущий</p><h2 className="h2">Кто проводит эфир.</h2></div></div>
     <article data-reveal="" style={rd(100)} className="founder wb-host">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={base+'/team/evgeny.jpg'} alt={w.host.name} width={400} height={400} loading="lazy" decoding="async" className="founder-photo"/>
      <div className="founder-body">
       <span className="over">{w.host.role}</span>
       <h3>{w.host.name}</h3>
       <p className="founder-bio">{w.host.bio}</p>
       <ul className="wb-host-points">{w.host.points.map(([icon,label])=><li key={label}><span className="tile-icon"><Icon name={icon} size={18}/></span>{label}</li>)}</ul>
       <div className="founder-foot"><a href={homeHref('ru')} className="ulink">О Praxen AI<Icon name="arrow-right" size={15}/></a></div>
      </div>
     </article>
    </section>

    <Questions/>

    <section data-screen-label="Webinar final" className="wrap sec wb-final-wrap">
     <div data-reveal="" className="wb-final">
      <div><p className="wb-final-over">12 ноября · 19:00 по Тбилиси · онлайн</p><h2 className="wb-final-h">45 минут о том, как заявки перестают теряться.</h2></div>
      <a href="#register" onClick={toForm} className="btn btn-white wb-final-btn">Зарегистрироваться<Icon name="arrow-right" size={16}/></a>
     </div>
    </section>
   </main>

   <footer className="footer">
    <div className="wrap footer-in wb-foot">
     <div className="footer-bottom">
      <a href={homeHref('ru')} className="brand brand-dark"><Wordmark dark/></a>
      <div className="footer-contacts"><a href={'tel:'+contacts.phone} className="footer-phone"><Icon name="phone" size={16}/>{contacts.phoneLabel}</a><a href={contacts.whatsapp} target="_blank" rel="noopener" className="footer-phone"><Icon name="whatsapp" size={16}/>WhatsApp</a><a href={'mailto:'+contacts.email} className="footer-phone"><Icon name="mail" size={16}/>{contacts.email}</a></div>
     </div>
     <div className="footer-bottom wb-foot-legal"><span>© 2026 Praxen AI · Батуми, Грузия · <a href={pageHref('ru','privacy')} className="footer-privacy">Конфиденциальность</a></span></div>
    </div>
   </footer>

   <div className={'sticky-cta'+(sticky?' is-shown':'')}>
    <a href="#register" onClick={toForm} className="btn btn-primary">Зарегистрироваться · 12 ноября</a>
   </div>
  </div>
 );
}

function Questions(){
 const [open,setOpen]=useState(0);
 return (
  <section data-screen-label="Webinar FAQ" className="wb-band">
   <div className="wrap sec">
    <div className="sec-head"><div data-reveal=""><p className="kicker">Вопросы</p><h2 className="h2">Коротко о главном.</h2></div></div>
    <div className="faq-grid">{[0,1].map(col=><div key={col} className="faq-col">{w.faq.map(([q,a],i)=>{if(i%2!==col)return null;const on=open===i;return <div key={q} className={'faq-card'+(on?' is-open':'')} style={{order:i}}>
     <h3><button type="button" onClick={()=>setOpen(on?-1:i)} aria-expanded={on} aria-controls={'wb-faq-'+i}>{q}<span className="faq-ring"><Icon name="plus" size={15}/></span></button></h3>
     <p id={'wb-faq-'+i} className="faq-a" hidden={!on}>{a}</p>
    </div>})}</div>)}</div>
   </div>
  </section>
 );
}
