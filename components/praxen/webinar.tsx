'use client';
import {useEffect,useRef,useState,useSyncExternalStore} from 'react';
import {getAttribution,track} from '@/components/analytics';
import {base,homeHref,langPath,pageHref} from '@/lib/base';
import {contacts} from '@/lib/contacts';
import type {Lang} from '@/lib/content';
import {absolute,pageUrl} from '@/lib/seo';
import {webinar as w,webinarCopy,webinarEvents,wbYourTime,wbZones,type WebinarCopy} from '@/lib/webinar';
import {offerPath} from '@/lib/webinar-offer';
import {Icon} from './icon';
import {PhoneInput} from './phone-input';
import {Flag,MotionRoot,Wordmark} from './ui';

type L='ru'|'en'|'ka';
const ev=webinarEvents.ru;

// Workshop time for the form: Tbilisi, plus the visitor's city (or «your time») when it differs.
// The server and the first render show Tbilisi only; the browser adds the visitor's zone after hydration.
const at=(tz:string,o:Intl.DateTimeFormatOptions)=>{try{return new Intl.DateTimeFormat('en-GB',{...o,timeZone:tz}).format(new Date(ev.start))}catch{return ''}};
const hm=(tz:string)=>at(tz,{hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
const dm=(tz:string)=>at(tz,{day:'2-digit',month:'2-digit'}).replace('/','.');
const noop=()=>()=>{};
const visitorZone=()=>{try{return Intl.DateTimeFormat().resolvedOptions().timeZone||'Asia/Tbilisi'}catch{return 'Asia/Tbilisi'}};
function useSlot(lang:L){
 const tz=useSyncExternalStore(noop,visitorZone,()=>'Asia/Tbilisi');
 const z=wbZones.find(x=>x.tz===tz||x.also?.includes(tz));
 const zone=z?z.tz:tz,time=hm(zone)||hm('Asia/Tbilisi');
 const tb=hm('Asia/Tbilisi')+' '+wbZones[0].by[lang];
 return {by:zone==='Asia/Tbilisi'?tb:tb+' ('+time+' '+(z||wbYourTime).by[lang]+(dm(zone)&&dm(zone)!==dm('Asia/Tbilisi')?', '+dm(zone):'')+')'};
}
// Caption under the hero box: the other cities; cities with the same time share a slot (Astana and Tashkent).
function zoneLine(lang:L){
 const out:[string,string][]=[];
 for(const z of wbZones.slice(1)){const t=hm(z.tz),same=out.find(([,x])=>x===t);if(same)same[0]+=', '+z.name[lang];else out.push([z.name[lang],t])}
 return out;
}
const evTitle={ru:'Воркшоп «ИИ в отделе продаж» — Praxen AI',en:'Workshop: AI for your sales team — Praxen AI',ka:'ვორქშოპი „AI გაყიდვების განყოფილებაში“ — Praxen AI'};
const googleCal=(lang:L,details:string)=>'https://calendar.google.com/calendar/render?action=TEMPLATE&text='+encodeURIComponent(evTitle[lang])+'&dates='+ev.cal+'&details='+encodeURIComponent(details+' '+w.bot)+'&ctz=Asia/Tbilisi';
const icsFile=(lang:L,details:string)=>'data:text/calendar;charset=utf-8,'+encodeURIComponent(['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Praxen AI//Workshop//RU','BEGIN:VEVENT','UID:workshop-20261112@praxenai.ge','DTSTAMP:20261013T000000Z','DTSTART:'+ev.ics[0],'DTEND:'+ev.ics[1],'SUMMARY:'+evTitle[lang],'DESCRIPTION:'+details+' '+w.bot,'END:VEVENT','END:VCALENDAR'].join('\r\n'));

function jsonLd(lang:L,c:WebinarCopy){
 const url=pageUrl(lang,w.path),org=absolute('/#organization');
 return {'@context':'https://schema.org','@graph':[
  {'@type':'Event','@id':url+'#event',name:evTitle[lang].replace(' — Praxen AI',''),description:c.description,startDate:ev.start,endDate:ev.end,
   eventStatus:'https://schema.org/EventScheduled',eventAttendanceMode:'https://schema.org/OnlineEventAttendanceMode',
   location:{'@type':'VirtualLocation',url},inLanguage:'ru',isAccessibleForFree:true,image:absolute('/og/og-'+lang+'.png'),
   organizer:{'@id':org},performer:{'@id':absolute('/#founder')},
   offers:{'@type':'Offer',price:0,priceCurrency:'GEL',availability:'https://schema.org/InStock',url}},
  {'@type':'FAQPage',mainEntity:c.faq.items.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))},
 ]};
}

// Participant code, remembered by the browser at registration and sent again with an order, so the CRM links the buyer
// to the registration even when the contacts differ (e.g. registered by Telegram, bought with a phone number).
// Links we send to a participant (bot, email, WhatsApp) carry it as ?c=…, so another phone or computer gets the same code.
export function participantCode(){
 try{
  const fromLink=new URLSearchParams(location.search).get('c')||'';
  if(/^W[A-Z0-9]{4,11}$/.test(fromLink))localStorage.setItem('praxen_wb_code',fromLink);
  let c=localStorage.getItem('praxen_wb_code');
  if(!c){const a=new Uint8Array(6);crypto.getRandomValues(a);c='W'+Array.from(a,x=>'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[x%32]).join('');localStorage.setItem('praxen_wb_code',c)}
  return c;
 }catch{return ''}
}

async function sendLead(body:Record<string,unknown>){
 const r=await fetch(base+'/api/leads',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...body,code:participantCode(),page:location.pathname,source:getAttribution()})});
 if(!r.ok)throw new Error();
}

function Done({c,lang,contact}:{c:WebinarCopy;lang:L;contact:string}){
 const f=c.form;
 const [q,setQ]=useState(''),[ind,setInd]=useState(''),[sent,setSent]=useState(false),[busy,setBusy]=useState(false),[copied,setCopied]=useState(false);
 const share=async()=>{
  const url=location.origin+location.pathname;
  try{if(navigator.share){await navigator.share({title:document.title,url});return}await navigator.clipboard.writeText(url);setCopied(true);setTimeout(()=>setCopied(false),2500)}catch{}
  track('share_click',{form:'webinar'});
 };
 const ask=async(e:React.FormEvent)=>{
  e.preventDefault();if(busy||(!q.trim()&&!ind))return;setBusy(true);
  try{await sendLead({contact,message:q.trim(),tasks:ind?[ind]:[],context:f.context+' · вопрос к воркшопу',lang});setSent(true);track('webinar_question',{form:'webinar'})}catch{}
  finally{setBusy(false)}
 };
 const slot=useSlot(lang),doneText=f.doneText.replace('{time}',slot.by),details=doneText;
 return (
  <div role="status" className="form-done wb-done fade-in">
   <span className="wb-done-ico"><Icon name="check" size={24}/></span>
   <h3>{f.doneTitle}</h3>
   <p>{doneText}</p>
   <a href={w.bot} target="_blank" rel="noopener" className="btn wb-cta wb-wide">{f.bot}<Icon name="send" size={18}/></a>
   <div className="wb-done-links">
    <a href={base+w.checklist[lang]} target="_blank" rel="noopener" className="ulink"><Icon name="file-text" size={15}/>{f.pdf}</a>
    <a href={googleCal(lang,details)} target="_blank" rel="noopener" className="ulink"><Icon name="calendar" size={15}/>{f.calGoogle}</a>
    <a href={icsFile(lang,details)} download="praxen-workshop.ics" className="ulink"><Icon name="calendar-check" size={15}/>{f.calIcs}</a>
    <button type="button" onClick={share} className="ulink"><Icon name="share-2" size={15}/>{copied?f.copied:f.share}</button>
   </div>
   {sent?<p className="wb-q-done"><Icon name="check-circle-2" size={16}/>{f.qDone}</p>:
   <form onSubmit={ask} className="wb-q">
    <label className="field">{f.qTitle}<textarea rows={2} maxLength={600} value={q} onChange={e=>setQ(e.target.value)} placeholder={f.qPh}/></label>
    <div><span className="wb-legend">{f.industryLabel}</span><div className="chips">{f.industries.map(lb=><button key={lb} type="button" onClick={()=>setInd(v=>v===lb?'':lb)} aria-pressed={ind===lb} className={'chip'+(ind===lb?' is-on':'')}>{lb}</button>)}</div></div>
    <button type="submit" disabled={busy||(!q.trim()&&!ind)} className="btn wb-ghost">{f.qSend}<Icon name="arrow-right" size={16}/></button>
   </form>}
  </div>
 );
}

function RegisterForm({c,lang,id}:{c:WebinarCopy;lang:L;id:string}){
 const f=c.form,slot=useSlot(lang);
 const [name,setName]=useState(''),[method,setMethod]=useState<0|1|2>(0),[contact,setContact]=useState(''),[phoneOk,setPhoneOk]=useState(false),[website,setWebsite]=useState('');
 const [status,setStatus]=useState<''|'invalid'|'error'>(''),[sending,setSending]=useState(false),[done,setDone]=useState('');
 const started=useRef(false);
 const keys=['telegram','whatsapp','phone'] as const;
 const start=()=>{if(!started.current){started.current=true;track('form_start',{form:'webinar',page:location.pathname})}};
 const change=(value:string)=>{start();setStatus('');setContact(value.replace(/\s/g,''))};
 const changePhone=(full:string,ok:boolean)=>{start();setStatus('');setContact(full);setPhoneOk(ok)};
 const submit=async(e:React.FormEvent)=>{
  e.preventDefault();if(sending)return;
  const bad=method===0?!/^@?[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(contact)&&!/^\+[0-9]{7,15}$/.test(contact.replace(/[\s()-]/g,'')):!phoneOk;
  if(bad){setStatus('invalid');track('form_error',{form:'webinar',reason:'invalid_contact'});return}
  setSending(true);setStatus('');
  const full=keys[method]+': '+contact;
  try{
   await sendLead({name,contact:full,context:f.context,lang,website});
   setDone(full);track('generate_lead',{form:'webinar',method:keys[method],event:'2026-11-12',page:location.pathname});
  }catch{setStatus('error');track('form_error',{form:'webinar',reason:'send_failed'})}
  finally{setSending(false)}
 };
 if(done)return <Done c={c} lang={lang} contact={done}/>;
 const invalid=status==='invalid';
 return (
  <form onSubmit={submit} noValidate data-lpignore="true" className="form wb-form" aria-labelledby={id+'-title'}>
   <div><h2 id={id+'-title'} className="wb-form-h">{f.title}</h2><p className="wb-form-sub">{f.sub.replace('{time}',slot.by)}</p></div>
   <label className="field">{f.name}<input name="name" required maxLength={100} value={name} onChange={e=>{start();setName(e.target.value)}} autoComplete="given-name"/></label>
   <div className="field">
    <span className="step-label">{f.where}</span>
    <div role="radiogroup" aria-label={f.where} className="methods">{f.methods.map((lb,k)=><button key={lb} type="button" role="radio" aria-checked={method===k} onClick={()=>{setMethod(k as 0|1|2);setContact('');setPhoneOk(false);setStatus('')}} className={method===k?'is-on':''}>{lb}</button>)}</div>
    {method===0?<input name="contact" required aria-label={f.methods[method]} value={contact} onChange={e=>change(e.target.value)} placeholder={f.tgPh} autoComplete="off" aria-invalid={invalid} aria-describedby={status?id+'-status':undefined} className={'wb-contact'+(invalid?' is-invalid':'')}/>
    :<PhoneInput key={method} lang={lang} invalid={invalid} onChange={changePhone} label={f.methods[method]} describedBy={status?id+'-status':undefined} className="wb-contact-phone"/>}
   </div>
   <input name="website" tabIndex={-1} aria-hidden="true" autoComplete="off" value={website} onChange={e=>setWebsite(e.target.value)} className="hp"/>
   {status&&<p id={id+'-status'} role="alert" className="form-status"><Icon name="alert-circle" size={16}/>{invalid?f.invalid:f.error}</p>}
   <button type="submit" disabled={sending} className="btn wb-cta wb-wide wb-submit">{sending?f.sending:f.submit}<Icon name="arrow-right" size={20}/></button>
   <small className="wb-note">{f.consent} <a href={pageHref(lang,'privacy')}>{f.privacy}</a></small>
  </form>
 );
}

// Days, hours, minutes and seconds to the start; null until mounted so server and client HTML match.
export function useCountdown(target:string){
 const [left,setLeft]=useState<number|null>(null);
 useEffect(()=>{const t0=Date.parse(target);const tick=()=>setLeft(Math.max(0,t0-Date.now()));tick();const t=setInterval(tick,1000);return()=>clearInterval(t)},[target]);
 if(left===null)return null;
 const s=Math.floor(left/1000);
 return [Math.floor(s/86400),Math.floor(s%86400/3600),Math.floor(s%3600/60),s%60];
}
export const pad=(n:number)=>String(n).padStart(2,'0');
function Countdown({c}:{c:WebinarCopy}){
 const v=useCountdown(webinarEvents[c.event].start);
 return <div className="wb-count" role="timer" aria-label={c.reg.countLabel}>
  <span className="wb-count-label">{c.reg.countLabel}</span>
  <div className="wb-count-row">{c.reg.units.map((u,i)=><div key={u} className="wb-count-cell"><b suppressHydrationWarning>{v?pad(v[i]):'--'}</b><span>{u}</span></div>)}</div>
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

// Live demo: the chat types itself out, the CRM card appears and fills in, then it plays again.
// The server HTML shows the finished state, and visitors who turn motion off keep it.
function DemoMock({c}:{c:WebinarCopy}){
 const chat=c.demo.chat,crm=c.demo.crm,total=chat.length+crm.length;
 const [step,setStep]=useState(total);
 useEffect(()=>{
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  let t:ReturnType<typeof setTimeout>|undefined;
  const run=(n:number)=>{setStep(n);t=setTimeout(()=>n<total?run(n+1):run(0),n<chat.length?1200:n<total?380:4500)};
  t=setTimeout(()=>run(0),300);
  return()=>{if(t)clearTimeout(t)};
 },[total,chat.length]);
 const typing=step<chat.length&&chat[step]?.[0]==='out';
 return <div className="wb-mock" aria-hidden="true">
  <div className="wb-chat">
   <div className="wb-chat-head"><span className="wb-chat-ava"><Icon name="whatsapp" size={16}/></span><div><b>WhatsApp</b><small>{typing?c.demo.typing:c.demo.online}</small></div></div>
   <div className="wb-chat-body">
    {chat.map(([dir,text,time],i)=><div key={i} className={'wb-msg wb-msg-'+dir+(i<step?' is-on':'')}>{text}<small>{time}</small></div>)}
    <div className={'wb-typing'+(typing&&step>0?' is-on':'')}><i/><i/><i/></div>
   </div>
  </div>
  <div className={'wb-crm'+(step>chat.length?' is-on':'')}>
   <div className="wb-crm-head"><Icon name="table-2" size={16}/>{c.demo.crmHead}<span className="wb-crm-wait">{step>=total?'✓':'…'}</span></div>
   <dl>{crm.map(([k,val],i)=><div key={k} className={chat.length+i<step?'is-on':''}><dt>{k}</dt><dd>{val}</dd></div>)}</dl>
  </div>
 </div>;
}

// Language switch in the workshop and offer headers: the same page in English, Georgian and Russian.
const langLabel={ru:'Язык страницы',en:'Page language',ka:'გვერდის ენა'};
export function WbLangs({lang,path}:{lang:L;path:string}){
 return <div role="group" aria-label={langLabel[lang]} className="langs wb-langs">
  {([['en','EN'],['ka','KA'],['ru','RU']] as [L,string][]).map(([code,lb])=><a key={code} href={base+langPath(code)+path} lang={code} hrefLang={code} aria-current={code===lang?'true':undefined} className={code===lang?'is-current':''}><Flag code={code}/>{lb}</a>)}
 </div>;
}

export function Questions({h,items,label='08 FAQ'}:{h:string;items:[string,string][];label?:string}){
 const [open,setOpen]=useState(0);
 return (
  <section data-screen-label={label} className="wb-sec">
   <div className="wb-c">
    <h2 data-reveal="" className="wb-h2">{h}</h2>
    <div className="wb-faq">{items.map(([q,a],i)=>{const on=open===i;return <div key={q} className={'wb-faq-item'+(on?' is-open':'')}>
     <h3><button type="button" onClick={()=>setOpen(on?-1:i)} aria-expanded={on} aria-controls={'wb-faq-'+i}>{q}<span className="wb-faq-ring"><Icon name="plus" size={18}/></span></button></h3>
     <p id={'wb-faq-'+i} hidden={!on}>{a}</p>
    </div>})}</div>
   </div>
  </section>
 );
}

function StickyBar({c,shown,onCta}:{c:WebinarCopy;shown:boolean;onCta:(e:React.MouseEvent)=>void}){
 const v=useCountdown(webinarEvents[c.event].start);
 return <div className={'wb-bar'+(shown?' is-shown':'')} aria-hidden={!shown}>
  <div className="wb-c wb-bar-in">
   <span className="wb-bar-label"><span className="wb-dot" aria-hidden="true"/>{c.sticky.label}</span>
   <span className="wb-bar-time">{c.sticky.until} <b suppressHydrationWarning>{v?v[0]+c.sticky.d+' '+pad(v[1])+':'+pad(v[2])+':'+pad(v[3]):'--'}</b></span>
   <a href="#register" onClick={onCta} tabIndex={shown?0:-1} className="wb-bar-cta">{c.sticky.cta}</a>
  </div>
 </div>;
}

// Polls the «open sales» switch (/api/sales, lib/sales-switch.mjs) every 15 seconds and when the tab becomes visible again.
// Without the API (static build, Telegram not configured) the state stays «unknown» and nothing happens.
export function useSalesSwitch(onState:(state:'open'|'closed'|'unknown')=>void){
 const cb=useRef(onState);
 useEffect(()=>{cb.current=onState});
 useEffect(()=>{
  let stop=false;
  const check=()=>fetch(base+'/api/sales',{cache:'no-store'}).then(r=>(r.ok?r.json():{state:'unknown'}) as Promise<{state?:string}>).then(d=>{if(!stop&&(d.state==='open'||d.state==='closed'))cb.current(d.state)}).catch(()=>{});
  check();const t=setInterval(check,15000);
  const vis=()=>{if(document.visibilityState==='visible')check()};
  document.addEventListener('visibilitychange',vis);
  return()=>{stop=true;clearInterval(t);document.removeEventListener('visibilitychange',vis)};
 },[]);
}

export function Webinar({lang='ru'}:{lang?:Lang}){
 const L=(lang in webinarCopy?lang:'ru') as L,c=webinarCopy[L];
 const [sticky,setSticky]=useState(false),[modal,setModal]=useState(false);
 // When the owner opens sales during the workshop, everyone on the landing goes to the offer page (UTM tags kept).
 useSalesSwitch(state=>{if(state==='open')location.replace(base+langPath(L)+offerPath+location.search)});
 useEffect(()=>{
  const hero=document.getElementById('wb-hero');if(!hero)return;
  const io=new IntersectionObserver(([e])=>setSticky(!e.isIntersecting),{rootMargin:'-80px 0px 0px 0px'});
  io.observe(hero);return()=>io.disconnect();
 },[]);
 const openForm=(e?:React.MouseEvent)=>{e?.preventDefault();setModal(true);track('cta_click',{label:'webinar_register',page:location.pathname})};
 const home=homeHref(L);
 const line=c.marquee.join(' ● ')+' ●';
 return (
  <div className="site wb">
   <MotionRoot/>
   <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonLd(L,c)).replace(/</g,'\\u003c')}}/>
   <div className="wb-marquee" aria-hidden="true"><div className="wb-marquee-track">{[0,1,2,3].map(i=><span key={i}>{line}</span>)}</div></div>
   <header className="wb-c wb-head">
    <a href={home} className="brand" aria-label={c.head.home}><Wordmark/></a>
    <div className="wb-head-r"><WbLangs lang={L} path={w.path}/><a href="#register" onClick={openForm} className="wb-head-cta">{c.head.cta}</a></div>
   </header>

   <main id="main" tabIndex={-1}>
    <section id="wb-hero" data-screen-label="01 Hero" className="wb-c wb-hero">
     <div className="wb-hero-top"><p className="wb-badge"><span className="wb-dot" aria-hidden="true"/>{c.hero.badge}</p>{c.hero.host&&<span className="wb-hero-host">{c.hero.host}</span>}</div>
     <h1 className="wb-h1">{c.hero.h1} <span className="wb-grad">{c.hero.h1Grad}</span></h1>
     <div className="wb-hero-row">
      <p className="wb-lead">{c.hero.sub}</p>
      <div className="wb-when">
       <dl className="wb-info">{c.hero.info.map(([k,val])=><div key={k}><dt>{k}</dt><dd>{val}</dd></div>)}</dl>
       <p className="wb-zones"><Icon name="clock" size={14}/>{zoneLine(L).map(([city,t])=><span key={city}>{city} <b>{t}</b></span>)}</p>
      </div>
     </div>
     <div className="wb-hero-cta">
      <a href="#register" onClick={openForm} className="btn wb-cta wb-cta-xl">{c.hero.cta}<Icon name="arrow-right" size={20}/></a>
      <p className="wb-gift-line"><span className="wb-gift-ico"><Icon name="gift" size={20}/></span>{c.hero.gift}</p>
     </div>
    </section>

    <section data-screen-label="02 Manifest" className="wb-sec wb-dark">
     <div className="wb-c">
      <p data-reveal="" className="wb-manifest">{c.manifest.a}<span className="wb-y">{c.manifest.hl1}</span>{c.manifest.b}<span className="wb-r">{c.manifest.hl2}</span>{c.manifest.c}</p>
      <ul data-stagger="" className="wb-pains">{c.manifest.pains.map((x,i)=><li key={x}><span>{c.manifest.painLabel} {pad(i+1)}</span>{x}</li>)}</ul>
     </div>
    </section>

    <section data-screen-label="03 Blocks" className="wb-sec">
     <div className="wb-c">
      <div data-reveal="" className="wb-sec-head"><h2 className="wb-h2">{c.blocks.h}</h2><p className="wb-sec-note">{c.blocks.note}</p></div>
      <ol className="wb-blocks">{c.blocks.items.map(([n,t,body,tag],i)=><li key={n} data-reveal="">
       <span className="wb-block-n">{n}</span>
       <div><h3>{t}</h3><p>{body}</p></div>
       <span className={'wb-tag'+(i===c.blocks.items.length-1?' is-y':'')}>{tag}</span>
      </li>)}</ol>
     </div>
    </section>

    <section data-screen-label="04 Demo" className="wb-sec wb-demo">
     <div className="wb-c wb-demo-in">
      <div className="wb-demo-text" data-reveal="">
       <span className="wb-sticker">{c.demo.sticker}</span>
       <h2 className="wb-h2 wb-h2-demo">{c.demo.h}</h2>
       <p className="wb-demo-lead">{c.demo.sub}</p>
       <ul className="wb-trust">{c.trust.map(([icon,label])=><li key={label}><Icon name={icon} size={15}/>{label}</li>)}</ul>
      </div>
      <div className="wb-demo-mock"><DemoMock c={c}/></div>
     </div>
    </section>

    <section data-screen-label="05 For whom" className="wb-sec">
     <div className="wb-c">
      <h2 data-reveal="" className="wb-h2">{c.fit.h}</h2>
      <ul data-stagger="" className="wb-fit">{c.fit.items.map(x=><li key={x}><Icon name="circle-check" size={32}/>{x}</li>)}</ul>
      <p data-reveal="" className="wb-nofit"><b>{c.fit.noLabel}</b> {c.fit.no}</p>
     </div>
    </section>

    <section data-screen-label="06 Host" className="wb-sec wb-host">
     <div className="wb-c wb-host-in">
      <div data-reveal="">
       <p className="wb-kicker">{c.host.k}</p>
       <h2 className="wb-host-name">{c.host.name}</h2>
       <p className="wb-host-role">{c.host.role}</p>
       <p className="wb-host-bio">{c.host.bio}</p>
      </div>
      <div data-reveal="">
       <p className="wb-quote">{c.host.quote[0]}<span>{c.host.quote[1]}</span></p>
       <ul className="wb-principles">{c.host.principles.map(([icon,t,d])=><li key={t}><Icon name={icon} size={20}/><span><b>{t}</b> {d}</span></li>)}</ul>
      </div>
     </div>
    </section>

    <section id="register" data-screen-label="07 Register" className="wb-sec wb-dark wb-reg">
     <div className="wb-c">
      <h2 data-reveal="" className="wb-h2">{c.reg.h} <span className="wb-y">{c.reg.hGift}</span></h2>
      <div className="wb-reg-in">
       <div>
        <ul data-stagger="" className="wb-gifts">{c.reg.gifts.map(([t,d],i)=><li key={t} className={i===0?'is-y':''}><span className="wb-gift-n">{c.reg.giftLabel} {i+1}</span><div><b>{t}</b><small>{d}</small></div></li>)}</ul>
        <Countdown c={c}/>
       </div>
       <div className="wb-form-box"><RegisterForm c={c} lang={L} id="wb-bottom"/></div>
      </div>
     </div>
    </section>

    <Questions h={c.faq.h} items={c.faq.items}/>

    <section data-screen-label="09 Final" className="wb-final">
     <div className="wb-c" data-reveal="">
      <p className="wb-kicker">{c.final.k}</p>
      <p className="wb-final-h">{c.final.h}</p>
      <a href="#register" onClick={openForm} className="btn wb-final-cta">{c.final.cta}<Icon name="arrow-right" size={20}/></a>
     </div>
    </section>
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

   <StickyBar c={c} shown={sticky&&!modal} onCta={openForm}/>
   <Modal c={c} lang={L} open={modal} onClose={()=>setModal(false)}/>
  </div>
 );
}
