'use client';
import {useEffect,useRef,useState} from 'react';
import {getAttribution,track} from '@/components/analytics';
import {base,homeHref,pageHref} from '@/lib/base';
import {contacts} from '@/lib/contacts';
import type {Lang} from '@/lib/content';
import {absolute,pageUrl} from '@/lib/seo';
import {webinar as w,webinarCopy,webinarEvents,type WebinarCopy,type WebinarEvent} from '@/lib/webinar';
import {Icon} from './icon';
import {MotionRoot,Wordmark} from './ui';

type L='ru'|'en'|'ka';
const evTitle={ru:'Вебинар «ИИ в отделе продаж» — Praxen AI',en:'Webinar: AI for your sales team — Praxen AI'};
const googleCal=(ev:WebinarEvent,details:string)=>'https://calendar.google.com/calendar/render?action=TEMPLATE&text='+encodeURIComponent(evTitle[ev])+'&dates='+webinarEvents[ev].cal+'&details='+encodeURIComponent(details+' '+w.bot)+'&ctz=Asia/Tbilisi';
const icsFile=(ev:WebinarEvent,details:string)=>'data:text/calendar;charset=utf-8,'+encodeURIComponent(['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Praxen AI//Webinar//RU','BEGIN:VEVENT','UID:webinar-'+ev+'@praxenai.ge','DTSTAMP:20261013T000000Z','DTSTART:'+webinarEvents[ev].ics[0],'DTEND:'+webinarEvents[ev].ics[1],'SUMMARY:'+evTitle[ev],'DESCRIPTION:'+details+' '+w.bot,'END:VEVENT','END:VCALENDAR'].join('\r\n'));

function jsonLd(lang:L,c:WebinarCopy){
 const url=pageUrl(lang,w.path),org=absolute('/#organization');
 const events:WebinarEvent[]=lang==='ka'?['ru','en']:[c.event];
 return {'@context':'https://schema.org','@graph':[
  ...events.map(ev=>({'@type':'Event','@id':url+'#event-'+ev,name:evTitle[ev].replace(' — Praxen AI',''),description:c.description,startDate:webinarEvents[ev].start,endDate:webinarEvents[ev].end,
   eventStatus:'https://schema.org/EventScheduled',eventAttendanceMode:'https://schema.org/OnlineEventAttendanceMode',
   location:{'@type':'VirtualLocation',url},inLanguage:ev,isAccessibleForFree:true,image:absolute('/og/og-'+lang+'.png'),
   organizer:{'@id':org},performer:{'@id':absolute('/#founder')},
   offers:{'@type':'Offer',price:0,priceCurrency:'GEL',availability:'https://schema.org/InStock',url}})),
  {'@type':'FAQPage',mainEntity:c.faq.items.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))},
 ]};
}

async function sendLead(body:Record<string,unknown>){
 const r=await fetch(base+'/api/leads',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...body,page:location.pathname,source:getAttribution()})});
 if(!r.ok)throw new Error();
}

function Done({c,lang,ev,contact}:{c:WebinarCopy;lang:L;ev:WebinarEvent;contact:string}){
 const f=c.form;
 const [q,setQ]=useState(''),[ind,setInd]=useState(''),[sent,setSent]=useState(false),[busy,setBusy]=useState(false),[copied,setCopied]=useState(false);
 const share=async()=>{
  const url=location.origin+location.pathname;
  try{if(navigator.share){await navigator.share({title:document.title,url});return}await navigator.clipboard.writeText(url);setCopied(true);setTimeout(()=>setCopied(false),2500)}catch{}
  track('share_click',{form:'webinar'});
 };
 const ask=async(e:React.FormEvent)=>{
  e.preventDefault();if(busy||(!q.trim()&&!ind))return;setBusy(true);
  try{await sendLead({contact,message:q.trim(),tasks:ind?[ind]:[],context:f.context[ev]+' · вопрос к эфиру',lang});setSent(true);track('webinar_question',{form:'webinar'})}catch{}
  finally{setBusy(false)}
 };
 const details=f.doneText;
 return (
  <div role="status" className="form-done wb-done fade-in">
   <span className="done-icon"><Icon name="check" size={22}/></span>
   <h3>{f.doneTitle}</h3>
   <p>{f.doneText}</p>
   <a href={w.bot} target="_blank" rel="noopener" className="btn wb-cta wb-wide">{f.bot}<Icon name="send" size={16}/></a>
   <div className="wb-done-links">
    <a href={base+w.checklist[ev]} target="_blank" rel="noopener" className="ulink"><Icon name="file-text" size={15}/>{f.pdf}</a>
    <a href={googleCal(ev,details)} target="_blank" rel="noopener" className="ulink"><Icon name="calendar" size={15}/>{f.calGoogle}</a>
    <a href={icsFile(ev,details)} download="praxen-webinar.ics" className="ulink"><Icon name="calendar-check" size={15}/>{f.calIcs}</a>
    <button type="button" onClick={share} className="ulink"><Icon name="share-2" size={15}/>{copied?f.copied:f.share}</button>
   </div>
   {sent?<p className="wb-q-done"><Icon name="check-circle-2" size={16}/>{f.qDone}</p>:
   <form onSubmit={ask} className="wb-q">
    <label className="field">{f.qTitle}<textarea rows={2} maxLength={600} value={q} onChange={e=>setQ(e.target.value)} placeholder={f.qPh}/></label>
    <div><span className="wb-legend">{f.industryLabel}</span><div className="chips">{f.industries.map(lb=><button key={lb} type="button" onClick={()=>setInd(v=>v===lb?'':lb)} aria-pressed={ind===lb} className={'chip'+(ind===lb?' is-on':'')}>{lb}</button>)}</div></div>
    <button type="submit" disabled={busy||(!q.trim()&&!ind)} className="btn btn-ghost">{f.qSend}<Icon name="arrow-right" size={16}/></button>
   </form>}
  </div>
 );
}

function RegisterForm({c,lang,id}:{c:WebinarCopy;lang:L;id:string}){
 const f=c.form;
 const [name,setName]=useState(''),[method,setMethod]=useState<0|1|2>(0),[contact,setContact]=useState(''),[website,setWebsite]=useState(''),[ev,setEv]=useState<WebinarEvent>(c.event);
 const [status,setStatus]=useState<''|'invalid'|'error'>(''),[sending,setSending]=useState(false),[done,setDone]=useState('');
 const started=useRef(false);
 const keys=['telegram','whatsapp','phone'] as const;
 const start=()=>{if(!started.current){started.current=true;track('form_start',{form:'webinar',page:location.pathname})}};
 const change=(value:string)=>{
  start();setStatus('');
  if(method===0){setContact(value.replace(/\s/g,''));return}
  const d=value.replace(/\D/g,'').slice(0,15);
  if(d.startsWith('995')){const r=d.slice(3);setContact('+995'+(r?' '+r.slice(0,3):'')+(r.length>3?' '+r.slice(3,6):'')+(r.length>6?' '+r.slice(6,9):''))}
  else setContact((value.startsWith('+')?'+':'')+d);
 };
 const submit=async(e:React.FormEvent)=>{
  e.preventDefault();if(sending)return;
  const plain=contact.replace(/\D/g,'');
  const bad=method===0?!/^@?[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(contact)&&!/^\+[0-9]{7,15}$/.test(contact.replace(/[\s()-]/g,'')):plain.length<7||plain.length>15;
  if(bad){setStatus('invalid');track('form_error',{form:'webinar',reason:'invalid_contact'});return}
  setSending(true);setStatus('');
  const full=keys[method]+': '+contact;
  try{
   await sendLead({name,contact:full,context:f.context[ev],lang,website});
   setDone(full);track('generate_lead',{form:'webinar',method:keys[method],event:ev,page:location.pathname});
  }catch{setStatus('error');track('form_error',{form:'webinar',reason:'send_failed'})}
  finally{setSending(false)}
 };
 if(done)return <Done c={c} lang={lang} ev={ev} contact={done}/>;
 const invalid=status==='invalid';
 return (
  <form onSubmit={submit} noValidate data-lpignore="true" className="form" aria-labelledby={id+'-title'}>
   <div><h2 id={id+'-title'} className="wb-form-h">{f.title}</h2><p className="wb-form-sub">{f.sub}</p></div>
   {f.events&&<div className="field"><span className="step-label">{f.eventLabel}</span><div role="radiogroup" aria-label={f.eventLabel} className="methods wb-events">{(['ru','en'] as WebinarEvent[]).map(k=><button key={k} type="button" role="radio" aria-checked={ev===k} onClick={()=>{start();setEv(k)}} className={ev===k?'is-on':''}>{f.events![k]}</button>)}</div></div>}
   <label className="field">{f.name}<input name="name" required maxLength={100} value={name} onChange={e=>{start();setName(e.target.value)}} autoComplete="given-name"/></label>
   <div className="field">
    <span className="step-label">{f.where}</span>
    <div role="radiogroup" aria-label={f.where} className="methods">{f.methods.map((lb,k)=><button key={lb} type="button" role="radio" aria-checked={method===k} onClick={()=>{setMethod(k as 0|1|2);setContact('');setStatus('')}} className={method===k?'is-on':''}>{lb}</button>)}</div>
    <input name="contact" required aria-label={f.methods[method]} value={contact} onChange={e=>change(e.target.value)} placeholder={method===0?f.tgPh:f.phonePh} inputMode={method===0?'text':'tel'} autoComplete={method===0?'off':'tel'} aria-invalid={invalid} aria-describedby={status?id+'-status':undefined} className={'wb-contact'+(invalid?' is-invalid':'')}/>
   </div>
   <input name="website" tabIndex={-1} aria-hidden="true" autoComplete="off" value={website} onChange={e=>setWebsite(e.target.value)} className="hp"/>
   {status&&<p id={id+'-status'} role="alert" className="form-status"><Icon name="alert-circle" size={16}/>{invalid?f.invalid:f.error}</p>}
   <button type="submit" disabled={sending} className="btn wb-cta wb-wide">{sending?f.sending:f.submit}<Icon name="arrow-right" size={16}/></button>
   <small className="wb-note">{f.consent} <a href={pageHref(lang,'privacy')}>{f.privacy}</a></small>
  </form>
 );
}

// Days, hours, minutes and seconds to the start; null until mounted so server and client HTML match.
function useCountdown(ev:WebinarEvent){
 const [left,setLeft]=useState<number|null>(null);
 useEffect(()=>{const t0=Date.parse(webinarEvents[ev].start);const tick=()=>setLeft(Math.max(0,t0-Date.now()));tick();const t=setInterval(tick,1000);return()=>clearInterval(t)},[ev]);
 if(left===null)return null;
 const s=Math.floor(left/1000);
 return [Math.floor(s/86400),Math.floor(s%86400/3600),Math.floor(s%3600/60),s%60];
}
const pad=(n:number)=>String(n).padStart(2,'0');
function Countdown({c}:{c:WebinarCopy}){
 const v=useCountdown(c.event);
 return <div className="wb-count" role="timer" aria-label={c.hero.countLabel}>
  <span className="wb-count-label">{c.hero.countLabel}</span>
  <div className="wb-count-row">{c.hero.units.map((u,i)=><div key={u} className="wb-count-cell"><b key={v?v[i]:'x'} suppressHydrationWarning>{v?pad(v[i]):'--'}</b><span>{u}</span></div>)}</div>
 </div>;
}

function Modal({c,lang,open,onClose}:{c:WebinarCopy;lang:L;open:boolean;onClose:()=>void}){
 useEffect(()=>{
  if(!open)return;
  const onKey=(e:KeyboardEvent)=>{if(e.key==='Escape')onClose()};
  document.addEventListener('keydown',onKey);document.body.style.overflow='hidden';
  setTimeout(()=>document.querySelector<HTMLInputElement>('.wb-modal input[name=name]')?.focus(),60);
  return()=>{document.removeEventListener('keydown',onKey);document.body.style.overflow=''};
 },[open,onClose]);
 if(!open)return null;
 return <div className="wb-modal-wrap" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}>
  <div role="dialog" aria-modal="true" aria-label={c.form.title} className="wb-modal fade-in">
   <button type="button" onClick={onClose} aria-label={c.close} className="wb-modal-x"><Icon name="x" size={18}/></button>
   <RegisterForm c={c} lang={lang} id="wb-modal"/>
  </div>
 </div>;
}

// Demo mock-up: the chat types itself out and the CRM card fills in once the block scrolls into view.
// Everything is visible in the server HTML and for visitors who turn motion off.
function DemoMock({c}:{c:WebinarCopy}){
 const chat=c.demo.chat,crm=c.demo.crm,total=chat.length+crm.length;
 const [step,setStep]=useState(total),ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const el=ref.current;
  if(!el||!('IntersectionObserver' in window)||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  let t:ReturnType<typeof setTimeout>|undefined;
  const run=(n:number)=>{setStep(n);if(n<total)t=setTimeout(()=>run(n+1),n<chat.length?1100:380)};
  if(el.getBoundingClientRect().top<innerHeight)return;
  setStep(0);
  const io=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting)){io.disconnect();t=setTimeout(()=>run(1),400)}},{threshold:.35});
  io.observe(el);return()=>{io.disconnect();if(t)clearTimeout(t)};
 },[total,chat.length]);
 const typing=step<chat.length&&chat[step]?.[0]==='out';
 return <div ref={ref} className="wb-mock">
  <div className="wb-chat">
   <div className="wb-chat-head"><span className="wb-chat-ava"><Icon name="whatsapp" size={16}/></span><div><b>WhatsApp</b><small>{typing?c.demo.typing:c.demo.online}</small></div></div>
   <div className="wb-chat-body">
    {chat.map(([dir,text,time],i)=><div key={i} className={'wb-msg wb-msg-'+dir+(i<step?' is-on':'')}>{text}<small>{time}</small></div>)}
    <div className={'wb-typing'+(typing&&step>0?' is-on':'')} aria-hidden="true"><i/><i/><i/></div>
   </div>
  </div>
  <div className={'wb-crm'+(step>chat.length?' is-on':'')}>
   <div className="wb-crm-head"><Icon name="table-2" size={16}/>{c.demo.crmHead}</div>
   <dl>{crm.map(([k,val],i)=><div key={k} className={chat.length+i<step?'is-on':''}><dt>{k}</dt><dd>{val}</dd></div>)}</dl>
  </div>
 </div>;
}

function Questions({c}:{c:WebinarCopy}){
 const [open,setOpen]=useState(0);
 return (
  <section data-screen-label="Webinar FAQ" className="wrap sec">
   <div className="sec-head wb-center"><div data-reveal=""><p className="kicker">{c.faq.k}</p><h2 className="h2">{c.faq.h}</h2></div></div>
   <div className="faq-grid">{[0,1].map(col=><div key={col} className="faq-col">{c.faq.items.map(([q,a],i)=>{if(i%2!==col)return null;const on=open===i;return <div key={q} className={'faq-card'+(on?' is-open':'')} style={{order:i}}>
    <h3><button type="button" onClick={()=>setOpen(on?-1:i)} aria-expanded={on} aria-controls={'wb-faq-'+i}>{q}<span className="faq-ring"><Icon name="plus" size={15}/></span></button></h3>
    <p id={'wb-faq-'+i} className="faq-a" hidden={!on}>{a}</p>
   </div>})}</div>)}</div>
  </section>
 );
}

export function Webinar({lang='ru'}:{lang?:Lang}){
 const L=(lang in webinarCopy?lang:'ru') as L,c=webinarCopy[L];
 const [sticky,setSticky]=useState(false),[modal,setModal]=useState(false),bar=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const hero=document.getElementById('wb-hero');
  const onScroll=()=>{
   const r=hero?.getBoundingClientRect();setSticky(!!r&&r.bottom<80);
   const max=document.documentElement.scrollHeight-innerHeight;bar.current?.style.setProperty('--p',String(max>0?Math.min(1,scrollY/max):0));
  };onScroll();
  window.addEventListener('scroll',onScroll,{passive:true});return()=>window.removeEventListener('scroll',onScroll);
 },[]);
 const openForm=(e?:React.MouseEvent)=>{e?.preventDefault();setModal(true);track('cta_click',{label:'webinar_register',page:location.pathname})};
 const cta=(label:string)=><a href="#register" onClick={openForm} className="btn wb-cta">{label}<Icon name="arrow-right" size={18}/></a>;
 const home=homeHref(L);
 return (
  <div className="site wb">
   <MotionRoot/>
   <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonLd(L,c)).replace(/</g,'\\u003c')}}/>
   <div ref={bar} className="wb-progress" aria-hidden="true"/>
   <header className="wb-head">
    <div className="wrap header-row">
     <a href={home} className="brand brand-dark" aria-label={c.head.home}><Wordmark dark/></a>
     <div className="header-actions"><span className="wb-head-date">{c.head.date}</span><a href="#register" onClick={openForm} className="btn btn-sm wb-head-cta">{c.head.cta}</a></div>
    </div>
   </header>

   <main id="main" tabIndex={-1}>
    <section id="wb-hero" data-screen-label="Webinar hero" className="wb-hero">
     <div className="wb-glow" aria-hidden="true"/>
     <div className="wb-orbs" aria-hidden="true"><i/><i/><i/></div>
     <div className="wrap wb-hero-grid">
      <div className="min0 wb-intro">
       <p className="wb-badge"><span className="wb-dot" aria-hidden="true"/>{c.hero.badge}</p>
       <h1 className="wb-h1">{c.hero.h1} <span className="wb-grad">{c.hero.h1Grad}</span></h1>
       <p className="wb-lead">{c.hero.sub}</p>
       <Countdown c={c}/>
       <div className="wb-hero-cta">{cta(c.hero.cta)}<span className="wb-free"><Icon name="check-circle-2" size={18}/>{c.hero.free}</span></div>
      </div>
      <div className="wb-speaker">
       <div className="wb-ring"><div className="wb-photo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={base+w.photo} alt={c.host.name} width={400} height={400} decoding="async" fetchPriority="high"/>
        <div className="wb-photo-cap"><b>{c.host.name}</b><span>{c.hero.cap}</span></div>
       </div></div>
       <div className="wb-float wb-float-1"><Icon name="message-circle" size={18}/>{c.hero.floats[0]}</div>
       <div className="wb-float wb-float-2"><Icon name="table-2" size={18}/>{c.hero.floats[1]}</div>
      </div>
     </div>
    </section>

    <section aria-label={c.form.title} className="wrap wb-strip-wrap">
     <ul className="wb-strip">{c.strip.map(([icon,label,value])=><li key={label}><span className="wb-strip-icon"><Icon name={icon} size={20}/></span><div><small>{label}</small><b>{value}</b></div></li>)}</ul>
    </section>

    <section data-screen-label="Webinar gift" className="wrap sec wb-gift-wrap">
     <div className="wb-gift">
      <div data-reveal="">
       <p className="kicker">{c.gift.k}</p>
       <h2 className="h2">{c.gift.h}</h2>
       <p className="lead">{c.gift.sub}</p>
       <div className="wb-gift-cta">{cta(c.gift.cta)}</div>
      </div>
      <div data-reveal="" className="wb-doc" aria-hidden="true">
       <div className="wb-doc-badge">PDF · 10</div>
       <div className="wb-doc-head"><Wordmark/></div>
       <b className="wb-doc-title">{c.gift.h}</b>
       <ul>{c.gift.preview.map((q,i)=><li key={q}><span className="wb-doc-box"><Icon name="check" size={12}/></span><span><i>{String(i+1).padStart(2,'0')}</i>{q}</span></li>)}<li className="wb-doc-more">{c.gift.more}</li></ul>
      </div>
     </div>
    </section>

    <section data-screen-label="Webinar pain" className="wrap sec">
     <div className="wb-split">
      <div data-reveal=""><p className="kicker">{c.pain.k}</p><h2 className="h2">{c.pain.h}</h2><p className="lead">{c.who.h}</p><ul className="wb-tags">{c.who.items.map(x=><li key={x}>{x}</li>)}</ul></div>
      <ul data-stagger="" className="wb-check wb-pain">{c.pain.items.map(x=><li key={x}><span className="wb-check-icon"><Icon name="alert-circle" size={18}/></span>{x}</li>)}</ul>
     </div>
    </section>

    <section data-screen-label="Webinar agenda" className="wb-band">
     <div className="wrap sec wb-split wb-split-top">
      <div data-reveal=""><p className="kicker">{c.agenda.k}</p><h2 className="h2">{c.agenda.h}</h2><p className="lead">{c.agenda.sub}</p></div>
      <ol data-stagger="" className="wb-agenda">{c.agenda.items.map(([min,title,body])=><li key={min}><span className="wb-min">{min}</span><div><h3>{title}</h3><p>{body}</p></div></li>)}</ol>
     </div>
    </section>

    <section data-screen-label="Webinar demo" className="wb-dark">
     <div className="wb-glow wb-glow-2" aria-hidden="true"/>
     <div className="wrap sec wb-demo-grid">
      <div data-reveal=""><p className="kicker wb-kicker-light">{c.demo.k}</p><h2 className="h2 wb-light">{c.demo.h}</h2><p className="lead wb-light-2">{c.demo.sub}</p><p className="wb-example">{c.demo.example}</p><div className="wb-demo-cta">{cta(c.demo.cta)}</div></div>
      <DemoMock c={c}/>
     </div>
    </section>

    <section data-screen-label="Webinar host" className="wb-band">
     <div className="wrap sec">
      <article data-reveal="" className="wb-host">
       {/* Live-broadcast mock-up instead of a second copy of the hero photo. */}
       <div className="wb-live" aria-hidden="true">
        <div className="wb-live-top"><span className="wb-live-dot"/>LIVE<span className="wb-live-tg"><Icon name="send" size={14}/>Telegram</span></div>
        <div className="wb-live-screen"><span className="wb-live-play"><Icon name="play" size={26}/></span><b>{c.host.name}</b><small>{c.head.date}</small></div>
        <div className="wb-live-bar"><span>{c.strip[2][2]}</span><span>45:00</span></div>
       </div>
       <div className="wb-host-body">
        <p className="kicker">{c.host.k}</p>
        <h2 className="h2">{c.host.name}</h2>
        <p className="wb-host-role">{c.host.role}</p>
        <p className="wb-host-bio">{c.host.bio}</p>
        <ul className="wb-host-points">{c.host.points.map(([icon,label])=><li key={label}><span className="tile-icon"><Icon name={icon} size={18}/></span>{label}</li>)}</ul>
        <a href={home} className="ulink mt24">{c.host.more}<Icon name="arrow-right" size={15}/></a>
       </div>
      </article>
     </div>
    </section>

    <section data-screen-label="Webinar prices" className="wrap sec">
     <div className="sec-head wb-center"><div data-reveal=""><p className="kicker">{c.prices.k}</p><h2 className="h2">{c.prices.h}</h2></div></div>
     <ul data-stagger="" className="wb-prices">{c.prices.items.map(([icon,t,price,d],i)=><li key={t} className={i===1?'is-main':''}><span className="wb-strip-icon"><Icon name={icon} size={20}/></span><small>{t}</small><b>{price}</b><span>{d}</span></li>)}</ul>
     <p className="wb-note wb-center wb-prices-foot">{c.prices.foot}</p>
    </section>

    <section id="register" data-screen-label="Webinar register" className="wb-reg">
     <div className="wb-glow wb-glow-3" aria-hidden="true"/>
     <div className="wrap sec wb-reg-grid">
      <div>
       <p className="wb-badge"><span className="wb-dot" aria-hidden="true"/>{c.reg.badge}</p>
       <h2 className="wb-reg-h">{c.reg.h}</h2>
       <p className="wb-lead">{c.reg.sub}</p>
       <Countdown c={c}/>
       <ul className="wb-after">{c.how.map(([icon,label])=><li key={label}><Icon name={icon} size={18}/>{label}</li>)}</ul>
      </div>
      <div className="form-box wb-form-box"><RegisterForm c={c} lang={L} id="wb-bottom"/></div>
     </div>
    </section>

    <Questions c={c}/>
   </main>

   <footer className="footer">
    <div className="wrap footer-in wb-foot">
     <div className="footer-bottom">
      <a href={home} className="brand brand-dark"><Wordmark dark/></a>
      <div className="footer-contacts"><a href={'tel:'+contacts.phone} className="footer-phone"><Icon name="phone" size={16}/>{contacts.phoneLabel}</a><a href={contacts.whatsapp} target="_blank" rel="noopener" className="footer-phone"><Icon name="whatsapp" size={16}/>WhatsApp</a><a href={'mailto:'+contacts.email} className="footer-phone"><Icon name="mail" size={16}/>{contacts.email}</a></div>
     </div>
     <div className="footer-bottom wb-foot-legal"><span>© 2026 Praxen AI · {c.foot.location} · <a href={pageHref(L,'privacy')} className="footer-privacy">{c.foot.privacy}</a></span></div>
    </div>
   </footer>

   <div className={'sticky-cta wb-sticky'+(sticky&&!modal?' is-shown':'')}>
    <a href="#register" onClick={openForm} className="btn wb-cta">{c.sticky}</a>
   </div>
   <Modal c={c} lang={L} open={modal} onClose={()=>setModal(false)}/>
  </div>
 );
}
