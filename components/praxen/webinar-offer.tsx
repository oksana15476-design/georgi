'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import {getAttribution,track} from '@/components/analytics';
import {base,homeHref,pageHref} from '@/lib/base';
import {contacts} from '@/lib/contacts';
import type {Lang} from '@/lib/content';
import {offerCopy,type MethodKey,type OfferCopy,type TariffKey} from '@/lib/webinar-offer';
import {DEPOSIT,OFFER_EVENTS,TARIFFS,bonusActive,offerActive,tariffPrice} from '@/lib/webinar-offer-order.mjs';
import {Icon} from './icon';
import {MotionRoot,Wordmark} from './ui';
import {Questions,pad,useCountdown} from './webinar';

type Tariff=typeof TARIFFS[number];
type Order={tariff:Tariff;mode:'buy'|'book'};
const group=(n:number)=>String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' ');
const gel=(n:number)=>group(n)+' ₾';

// The current time, updated every second after mount; null on the server so the HTML matches.
function useNow(){
 const [now,setNow]=useState<number|null>(null);
 useEffect(()=>{const tick=()=>setNow(Date.now());tick();const t=setInterval(tick,1000);return()=>clearInterval(t)},[]);
 return now;
}

function Checkout({c,lang,order,now,onClose}:{c:OfferCopy;lang:Lang;order:Order;now:number;onClose:()=>void}){
 const k=c.checkout,t=order.tariff,name0=c.tariffs.items[t.key as TariffKey].name;
 const special=offerActive(c.event,now),price=tariffPrice(t,c.event,now),amount=order.mode==='book'?DEPOSIT:price;
 const from=t.from&&order.mode==='buy'?c.tariffs.from+' ':'';
 const [name,setName]=useState(''),[email,setEmail]=useState(''),[phone,setPhone]=useState(''),[method,setMethod]=useState<MethodKey>('card'),[website,setWebsite]=useState('');
 const [status,setStatus]=useState<''|'invalid'|'error'>(''),[sending,setSending]=useState(false),[done,setDone]=useState(0);
 useEffect(()=>{
  const onKey=(e:KeyboardEvent)=>{if(e.key==='Escape')onClose()};
  document.addEventListener('keydown',onKey);document.body.style.overflow='hidden';
  const f=setTimeout(()=>document.querySelector<HTMLInputElement>('.wb-modal input[name=name]')?.focus(),60);
  return()=>{clearTimeout(f);document.removeEventListener('keydown',onKey);document.body.style.overflow=''};
 },[onClose]);
 const submit=async(e:React.FormEvent)=>{
  e.preventDefault();if(sending)return;
  if(!name.trim()||!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())||phone.replace(/\D/g,'').length<7){setStatus('invalid');track('form_error',{form:'offer',reason:'invalid'});return}
  setSending(true);setStatus('');
  try{
   const r=await fetch(base+'/api/checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({tariff:t.key,mode:order.mode,method,name,email,phone,website,event:c.event,lang,page:location.pathname,source:getAttribution()})});
   const data=await r.json().catch(()=>({})) as {ok?:boolean;amount?:number};
   if(!r.ok||!data.ok)throw new Error();
   setDone(data.amount||amount);track('checkout_request',{tariff:t.key,mode:order.mode,value:data.amount||amount,currency:'GEL'});
  }catch{setStatus('error');track('form_error',{form:'offer',reason:'send_failed'})}
  finally{setSending(false)}
 };
 return <div className="wb-modal-wrap" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}>
  <div role="dialog" aria-modal="true" aria-label={(order.mode==='book'?k.book:k.buy)+': '+name0} className="wb-modal wb-co fade-in">
   <button type="button" onClick={onClose} aria-label={k.close} className="wb-modal-x"><Icon name="x" size={18}/></button>
   {done?<div role="status" className="form-done wb-done">
    <span className="wb-done-ico"><Icon name="check" size={24}/></span>
    <h3>{order.mode==='book'?k.doneBook:k.doneBuy}</h3>
    <p>{k.doneText(gel(done))}</p>
    <a href={contacts.whatsapp} target="_blank" rel="noopener" className="btn wb-cta wb-wide">{k.curator}<Icon name="whatsapp" size={18}/></a>
   </div>:
   <form onSubmit={submit} noValidate className="form wb-form">
    <div><p className="wb-co-k">{order.mode==='book'?k.book:k.buy}</p><h2 className="wb-form-h">{name0}</h2></div>
    <div className="wb-co-sum">
     <span>{k.amount}</span>
     <b>{from}{gel(amount)}{order.mode==='buy'&&special&&<s>{from}{gel(t.old)}</s>}</b>
     {order.mode==='book'&&<small>{k.hold(from+gel(price))}</small>}
     {order.mode==='buy'&&t.from&&<small>{k.hours}</small>}
     {bonusActive(c.event,now)&&<em><Icon name="gift" size={15}/>{k.bonusPill}</em>}
    </div>
    <label className="field">{k.name}<input name="name" required maxLength={100} value={name} onChange={e=>{setName(e.target.value);setStatus('')}} autoComplete="name"/></label>
    <label className="field">{k.email}<input name="email" type="email" required maxLength={160} value={email} onChange={e=>{setEmail(e.target.value);setStatus('')}} placeholder={k.emailPh} autoComplete="email" aria-invalid={status==='invalid'}/></label>
    <label className="field">{k.phone}<input name="phone" type="tel" required maxLength={40} value={phone} onChange={e=>{setPhone(e.target.value);setStatus('')}} placeholder="+995 5XX XXX XXX" autoComplete="tel" aria-invalid={status==='invalid'}/></label>
    <div className="field"><span className="step-label">{k.methodLabel}</span>
     <div role="radiogroup" aria-label={k.methodLabel} className="wb-co-methods">{(Object.keys(k.methods) as MethodKey[]).map(m=><button key={m} type="button" role="radio" aria-checked={method===m} onClick={()=>setMethod(m)} className={method===m?'is-on':''}><b>{k.methods[m][0]}</b><small>{k.methods[m][1]}</small></button>)}</div>
    </div>
    <input name="website" tabIndex={-1} aria-hidden="true" autoComplete="off" value={website} onChange={e=>setWebsite(e.target.value)} className="hp"/>
    {status&&<p role="alert" className="form-status"><Icon name="alert-circle" size={16}/>{status==='invalid'?k.invalid:k.error}</p>}
    <button type="submit" disabled={sending} className="btn wb-cta wb-wide wb-submit">{sending?k.sending:order.mode==='book'?k.submitBook:k.submitBuy+' · '+from+gel(amount)}<Icon name="arrow-right" size={20}/></button>
    <small className="wb-note"><Icon name="lock" size={13}/> {k.manual} {k.consent} <a href={pageHref(lang,'privacy')}>{k.privacy}</a></small>
   </form>}
  </div>
 </div>;
}

function Timer({target,units,label,ended}:{target:string;units:string[];label:string;ended:string}){
 const v=useCountdown(target),over=v&&v.every(x=>x===0);
 return <div className="wb-otimer" role="timer" aria-label={over?ended:label}>
  <span className="wb-count-label">{over?ended:label}</span>
  <div className="wb-otimer-row">{units.map((u,i)=><div key={u}><b suppressHydrationWarning>{v?pad(v[i]):'--'}</b><span>{u}</span></div>)}</div>
 </div>;
}

export function WebinarOffer({lang='ru'}:{lang?:Lang}){
 const L=(lang==='en'?'en':'ru') as 'ru'|'en',c=offerCopy[L],ev=OFFER_EVENTS[c.event];
 const now=useNow(),left=useCountdown(ev.offerEnd),bonusLeft=useCountdown(ev.bonusEnd);
 const special=now===null||offerActive(c.event,now),bonus=now===null||bonusActive(c.event,now);
 const [order,setOrder]=useState<Order|null>(null),[sticky,setSticky]=useState(false);
 const hero=useRef<HTMLElement>(null);
 useEffect(()=>{
  if(!hero.current)return;
  const io=new IntersectionObserver(([e])=>setSticky(!e.isIntersecting),{rootMargin:'-80px 0px 0px 0px'});
  io.observe(hero.current);return()=>io.disconnect();
 },[]);
 const open=(tariff:Tariff,mode:'buy'|'book')=>{setOrder({tariff,mode});const value=mode==='book'?DEPOSIT:tariffPrice(tariff,c.event,now??0);track('begin_checkout',{tariff:tariff.key,mode,value,currency:'GEL'})};
 const close=useCallback(()=>setOrder(null),[]);
 const toTariffs=()=>track('cta_click',{label:'offer_tariffs',page:location.pathname});
 const home=homeHref(L);
 const line=c.marquee.join(' ● ')+' ●';
 const dhms=left?left[0]+' '+c.sticky.d+' '+pad(left[1])+':'+pad(left[2])+':'+pad(left[3]):'--';
 return (
  <div className="site wb wb-offer">
   <MotionRoot/>
   <div className="wb-marquee" aria-hidden="true"><div className="wb-marquee-track">{[0,1,2,3].map(i=><span key={i}>{line}</span>)}</div></div>
   <header className="wb-c wb-head">
    <a href={home} className="brand" aria-label={c.head.home}><Wordmark/></a>
    <a href="#tariffs" onClick={toTariffs} className="wb-head-cta">{c.head.cta}</a>
   </header>

   <main id="main" tabIndex={-1}>
    <section ref={hero} data-screen-label="01 Hero" className="wb-c wb-hero">
     <p className="wb-badge"><span className="wb-dot" aria-hidden="true"/>{c.hero.badge}</p>
     <h1 className="wb-h1">{c.hero.h1} <span className="wb-grad">{c.hero.h1Grad}</span></h1>
     <div className="wb-hero-row">
      <p className="wb-lead">{c.hero.sub}</p>
      <Timer target={ev.offerEnd} units={c.hero.units} label={c.hero.countLabel} ended={c.hero.countEnded}/>
     </div>
     <p className="wb-seats"><b><span className="wb-dot" aria-hidden="true"/>{c.hero.seats}</b><span>{c.hero.seatsSub}</span></p>
    </section>

    <section id="tariffs" data-screen-label="02 Tariffs" className="wb-sec wb-dark">
     <div className="wb-c">
      <div data-reveal="" className="wb-sec-head"><h2 className="wb-h2">{c.tariffs.h}</h2><p className="wb-sec-note wb-on-dark">{c.tariffs.note}</p></div>
      <div className="wb-tariffs">{TARIFFS.map((t,i)=>{const x=c.tariffs.items[t.key as TariffKey],from=t.from?c.tariffs.from+' ':'';return <article key={t.key} className={'wb-tariff'+(t.featured?' is-featured':'')}>
       {t.featured&&<span className="wb-tariff-sticker">{c.tariffs.sticker}</span>}
       <p className="wb-tariff-k">{c.tariffs.label} {i+1}</p>
       <h3>{x.name}</h3>
       <p className="wb-tariff-sub">{x.sub}</p>
       <div className="wb-tariff-price">
        <b suppressHydrationWarning>{from}{gel(special?t.price:t.old)}</b>
        {special&&<s>{from}{gel(t.old)}</s>}
        {special&&<small>{c.tariffs.after} {from}{gel(t.old)}</small>}
       </div>
       <ul>{x.features.map(f=><li key={f}><Icon name="circle-check" size={20}/>{f}</li>)}{x.muted&&<li className="is-muted"><Icon name="circle-x" size={20}/>{x.muted}</li>}</ul>
       {x.note&&<p className="wb-tariff-note"><Icon name="arrow-right" size={18}/><span><b>{x.note[0]}</b> {x.note[1]}</span></p>}
       <div className="wb-tariff-act">
        <button type="button" onClick={()=>open(t,'buy')} className={'btn '+(t.featured?'wb-cta':'wb-outline')}>{x.buy}<Icon name="arrow-right" size={18}/></button>
        <button type="button" onClick={()=>open(t,'book')} className="wb-book"><Icon name="calendar-check" size={16}/>{c.tariffs.book}</button>
       </div>
      </article>})}</div>
      <p className="wb-pay">{c.tariffs.pay.map((p,i)=><span key={p}>{i===0&&<Icon name="lock" size={16}/>}{p}</span>)}</p>
     </div>
    </section>

    {bonus&&<section data-screen-label="03 Bonus" className="wb-bonus">
     <div className="wb-c wb-bonus-in">
      <span className="wb-bonus-ico"><Icon name="gift" size={36}/></span>
      <div><p className="wb-kicker">{c.bonus.k}</p><p className="wb-bonus-h">{c.bonus.h}</p></div>
      <div className="wb-bonus-t"><span>{c.bonus.until}</span><b suppressHydrationWarning>{bonusLeft?pad(bonusLeft[0]*24+bonusLeft[1])+':'+pad(bonusLeft[2])+':'+pad(bonusLeft[3]):'--:--:--'}</b></div>
     </div>
    </section>}

    <section data-screen-label="04 Program" className="wb-sec">
     <div className="wb-c">
      <div data-reveal="" className="wb-sec-head"><h2 className="wb-h2">{c.program.h}</h2><p className="wb-sec-note">{c.program.note}</p></div>
      <ol className="wb-blocks">{c.program.items.map(([n,t,body,tag],i)=><li key={n} data-reveal="">
       <span className="wb-block-n">{n}</span>
       <div><h3>{t}</h3><p>{body}</p></div>
       <span className={'wb-tag'+(i===c.program.items.length-1?' is-y':'')}>{tag}</span>
      </li>)}</ol>
     </div>
    </section>

    <section data-screen-label="05 After payment" className="wb-sec wb-host">
     <div className="wb-c">
      <h2 data-reveal="" className="wb-h2">{c.after.h}</h2>
      <ol data-stagger="" className="wb-after-pay">{c.after.items.map(([t,d],i)=><li key={t}><span className="wb-block-n">{i+1}</span><h3>{t}</h3><p>{d}</p></li>)}</ol>
     </div>
    </section>

    <Questions h={c.faq.h} items={c.faq.items} label="06 FAQ"/>

    <section data-screen-label="07 Final" className="wb-final">
     <div className="wb-c" data-reveal="">
      <p className="wb-kicker">{special?c.hero.countLabel:c.hero.countEnded}</p>
      {special&&<p className="wb-final-h" suppressHydrationWarning>{dhms}</p>}
      <a href="#tariffs" onClick={toTariffs} className="btn wb-final-cta">{c.final.cta}<Icon name="arrow-right" size={20}/></a>
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

   <div className={'wb-bar'+(sticky&&!order?' is-shown':'')} aria-hidden={!(sticky&&!order)}>
    <div className="wb-c wb-bar-in">
     <span className="wb-bar-label"><span className="wb-dot" aria-hidden="true"/>{c.sticky.label}</span>
     {special&&<span className="wb-bar-time">{c.sticky.until} <b suppressHydrationWarning>{dhms}</b></span>}
     <a href="#tariffs" onClick={toTariffs} tabIndex={sticky&&!order?0:-1} className="wb-bar-cta">{c.sticky.cta}</a>
    </div>
   </div>
   {order&&now!==null&&<Checkout c={c} lang={L} order={order} now={now} onClose={close}/>}
  </div>
 );
}
