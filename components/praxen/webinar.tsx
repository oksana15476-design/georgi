'use client';
import {useEffect,useRef,useState} from 'react';
import {getAttribution,track} from '@/components/analytics';
import {base,homeHref,pageHref} from '@/lib/base';
import {contacts} from '@/lib/contacts';
import {absolute,pageUrl} from '@/lib/seo';
import {webinar as w} from '@/lib/webinar';
import {Icon} from './icon';
import {MotionRoot,Wordmark} from './ui';

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
   <div><h2 id={id+'-title'} className="wb-form-h">Регистрация на вебинар</h2><p className="wb-form-sub">12 ноября, 19:00 по Тбилиси · бесплатно</p></div>
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

const startMs=Date.parse(w.start);
// Days, hours, minutes and seconds to the start; null until mounted so server and client HTML match.
function useCountdown(){
 const [left,setLeft]=useState<number|null>(null);
 useEffect(()=>{const tick=()=>setLeft(Math.max(0,startMs-Date.now()));tick();const t=setInterval(tick,1000);return()=>clearInterval(t)},[]);
 if(left===null)return null;
 const s=Math.floor(left/1000);
 return [Math.floor(s/86400),Math.floor(s%86400/3600),Math.floor(s%3600/60),s%60];
}
const pad=(n:number)=>String(n).padStart(2,'0');
function Countdown({dark=false}:{dark?:boolean}){
 const v=useCountdown();
 const units=['дней','часов','минут','секунд'];
 return <div className={'wb-count'+(dark?' is-dark':'')} role="timer" aria-label="До начала эфира">
  <span className="wb-count-label">До эфира</span>
  <div className="wb-count-row">{units.map((u,i)=><div key={u} className="wb-count-cell"><b suppressHydrationWarning>{v?pad(v[i]):'--'}</b><span>{u}</span></div>)}</div>
 </div>;
}

function Modal({open,onClose}:{open:boolean;onClose:()=>void}){
 useEffect(()=>{
  if(!open)return;
  const onKey=(e:KeyboardEvent)=>{if(e.key==='Escape')onClose()};
  document.addEventListener('keydown',onKey);document.body.style.overflow='hidden';
  setTimeout(()=>document.querySelector<HTMLInputElement>('.wb-modal input[name=name]')?.focus(),60);
  return()=>{document.removeEventListener('keydown',onKey);document.body.style.overflow=''};
 },[open,onClose]);
 if(!open)return null;
 return <div className="wb-modal-wrap" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}>
  <div role="dialog" aria-modal="true" aria-label="Регистрация на вебинар" className="wb-modal fade-in">
   <button type="button" onClick={onClose} aria-label="Закрыть" className="wb-modal-x"><Icon name="x" size={18}/></button>
   <RegisterForm id="wb-modal"/>
  </div>
 </div>;
}

export function Webinar(){
 const [sticky,setSticky]=useState(false),[modal,setModal]=useState(false);
 useEffect(()=>{
  const hero=document.getElementById('wb-hero');
  const onScroll=()=>{const r=hero?.getBoundingClientRect();setSticky(!!r&&r.bottom<80)};onScroll();
  window.addEventListener('scroll',onScroll,{passive:true});return()=>window.removeEventListener('scroll',onScroll);
 },[]);
 const openForm=(e?:React.MouseEvent)=>{e?.preventDefault();setModal(true);track('cta_click',{label:'webinar_register',page:location.pathname})};
 const cta=(label='Зарегистрироваться бесплатно')=><a href="#register" onClick={openForm} className="btn wb-cta">{label}<Icon name="arrow-right" size={18}/></a>;
 return (
  <div className="site wb">
   <MotionRoot/>
   <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonLd()).replace(/</g,'\\u003c')}}/>
   <header className="wb-head">
    <div className="wrap header-row">
     <a href={homeHref('ru')} className="brand brand-dark" aria-label="Praxen AI — главная"><Wordmark dark/></a>
     <div className="header-actions"><span className="wb-head-date">12 ноября · 19:00 по Тбилиси</span><a href="#register" onClick={openForm} className="btn btn-sm wb-head-cta">Участвовать</a></div>
    </div>
   </header>

   <main id="main" tabIndex={-1}>
    <section id="wb-hero" data-screen-label="Webinar hero" className="wb-hero">
     <div className="wb-glow" aria-hidden="true"/>
     <div className="wrap wb-hero-grid">
      <div className="min0">
       <p className="wb-badge"><span className="wb-dot" aria-hidden="true"/>{w.badge} · 12 ноября</p>
       <h1 className="wb-h1">{w.h1[0]} <span className="wb-grad">{w.h1[1]}</span></h1>
       <p className="wb-lead">{w.lead}</p>
       <Countdown dark/>
       <div className="wb-hero-cta">{cta()}<span className="wb-free"><Icon name="check-circle-2" size={18}/>Бесплатно · 45 минут · запись всем</span></div>
      </div>
      <div className="wb-speaker">
       <div className="wb-photo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={base+'/team/evgeny.jpg'} alt={w.host.name} width={400} height={400} decoding="async" fetchPriority="high"/>
        <div className="wb-photo-cap"><b>{w.host.name}</b><span>{w.host.role}, ведущий вебинара</span></div>
       </div>
       <div className="wb-float wb-float-1"><Icon name="message-circle" size={18}/>Ответ клиенту в 23:40</div>
       <div className="wb-float wb-float-2"><Icon name="table-2" size={18}/>Карточка в CRM готова</div>
      </div>
     </div>
    </section>

    <section aria-label="Детали вебинара" className="wrap wb-strip-wrap">
     <ul className="wb-strip">{w.strip.map(([icon,label,value])=><li key={label}><span className="wb-strip-icon"><Icon name={icon} size={20}/></span><div><small>{label}</small><b>{value}</b></div></li>)}</ul>
    </section>

    <section data-screen-label="Webinar for you" className="wrap sec">
     <div className="wb-split">
      <div data-reveal=""><p className="kicker">Для кого</p><h2 className="h2">Вебинар для вас, если…</h2><p className="lead">Для владельцев и руководителей продаж. Чаще всего это:</p><ul className="wb-tags">{w.industries.map(x=><li key={x}>{x}</li>)}</ul></div>
      <ul data-stagger="" className="wb-check">{w.forYou.map(x=><li key={x}><span className="wb-check-icon"><Icon name="check" size={18}/></span>{x}</li>)}</ul>
     </div>
    </section>

    <section data-screen-label="Webinar learn" className="wb-band">
     <div className="wrap sec">
      <div className="sec-head wb-center"><div data-reveal=""><p className="kicker">Что вы узнаете</p><h2 className="h2">За 45 минут разберём четыре вопроса.</h2></div></div>
      <ol data-stagger="" className="wb-learn">{w.learn.map(([title,body],i)=><li key={title}><span className="wb-num">{'0'+(i+1)}</span><h3>{title}</h3><p>{body}</p></li>)}</ol>
      <div className="wb-center wb-mt">{cta('Занять место на вебинаре')}</div>
     </div>
    </section>

    <section data-screen-label="Webinar demo" className="wb-dark">
     <div className="wb-glow wb-glow-2" aria-hidden="true"/>
     <div className="wrap sec wb-demo-grid">
      <div data-reveal=""><p className="kicker wb-kicker-light">Демонстрация</p><h2 className="h2 wb-light">Покажем на эфире, как это работает.</h2><p className="lead wb-light-2">Клиент пишет ночью, ассистент задаёт ваши вопросы, а утром менеджер открывает готовую карточку в CRM.</p><p className="wb-example">Пример сценария на нашем демо-стенде</p></div>
      <div data-reveal="" style={rd(120)} className="wb-mock">
       <div className="wb-chat">
        <div className="wb-chat-head"><span className="wb-chat-ava"><Icon name="whatsapp" size={16}/></span><div><b>WhatsApp</b><small>ассистент отвечает</small></div></div>
        <div className="wb-chat-body">{w.chat.map(([dir,text,time],i)=><div key={i} className={'wb-msg wb-msg-'+dir}>{text}<small>{time}</small></div>)}</div>
       </div>
       <div className="wb-crm">
        <div className="wb-crm-head"><Icon name="table-2" size={16}/>Новая сделка в CRM</div>
        <dl>{w.crm.map(([k,v])=><div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
       </div>
      </div>
     </div>
    </section>

    <section data-screen-label="Webinar agenda" className="wrap sec wb-split wb-split-top">
     <div data-reveal=""><p className="kicker">Программа</p><h2 className="h2">45 минут по шагам.</h2><p className="lead">Время в минутах от начала эфира. Вопросы можно задать в чате.</p></div>
     <ol data-reveal="" style={rd(100)} className="wb-agenda">{w.agenda.map(([min,title,body])=><li key={min}><span className="wb-min">{min}</span><div><h3>{title}</h3><p>{body}</p></div></li>)}</ol>
    </section>

    <section data-screen-label="Webinar host" className="wb-band">
     <div className="wrap sec">
      <article data-reveal="" className="wb-host">
       {/* eslint-disable-next-line @next/next/no-img-element */}
       <img src={base+'/team/evgeny.jpg'} alt={w.host.name} width={400} height={400} loading="lazy" decoding="async" className="wb-host-photo"/>
       <div className="wb-host-body">
        <p className="kicker">Ведущий</p>
        <h2 className="h2">{w.host.name}</h2>
        <p className="wb-host-role">{w.host.role}</p>
        <p className="wb-host-bio">{w.host.bio}</p>
        <ul className="wb-host-points">{w.host.points.map(([icon,label])=><li key={label}><span className="tile-icon"><Icon name={icon} size={18}/></span>{label}</li>)}</ul>
       </div>
      </article>
     </div>
    </section>

    <section id="register" data-screen-label="Webinar register" className="wb-reg">
     <div className="wb-glow wb-glow-3" aria-hidden="true"/>
     <div className="wrap sec wb-reg-grid">
      <div>
       <p className="wb-badge"><span className="wb-dot" aria-hidden="true"/>Регистрация открыта</p>
       <h2 className="wb-reg-h">Займите место на вебинаре 12 ноября</h2>
       <p className="wb-lead">Эфир в 19:00 по Тбилиси. Участие бесплатное.</p>
       <Countdown dark/>
       <ul className="wb-after">{w.afterReg.map(([icon,label])=><li key={label}><Icon name={icon} size={18}/>{label}</li>)}</ul>
      </div>
      <div className="form-box wb-form-box"><RegisterForm id="wb-bottom"/></div>
     </div>
    </section>

    <Questions/>
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

   <div className={'sticky-cta wb-sticky'+(sticky&&!modal?' is-shown':'')}>
    <a href="#register" onClick={openForm} className="btn wb-cta">Участвовать бесплатно · 12 ноября</a>
   </div>
   <Modal open={modal} onClose={()=>setModal(false)}/>
  </div>
 );
}

function Questions(){
 const [open,setOpen]=useState(0);
 return (
  <section data-screen-label="Webinar FAQ" className="wrap sec">
   <div className="sec-head wb-center"><div data-reveal=""><p className="kicker">Вопросы</p><h2 className="h2">Коротко о главном.</h2></div></div>
   <div className="faq-grid">{[0,1].map(col=><div key={col} className="faq-col">{w.faq.map(([q,a],i)=>{if(i%2!==col)return null;const on=open===i;return <div key={q} className={'faq-card'+(on?' is-open':'')} style={{order:i}}>
    <h3><button type="button" onClick={()=>setOpen(on?-1:i)} aria-expanded={on} aria-controls={'wb-faq-'+i}>{q}<span className="faq-ring"><Icon name="plus" size={15}/></span></button></h3>
    <p id={'wb-faq-'+i} className="faq-a" hidden={!on}>{a}</p>
   </div>})}</div>)}</div>
  </section>
 );
}
