'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import {getAttribution,track} from '@/components/analytics';
import {base,homeHref,langPath,pageHref} from '@/lib/base';
import {contacts} from '@/lib/contacts';
import type {Lang} from '@/lib/content';
import {offerCopy,offerPath,type OfferCopy,type TariffKey} from '@/lib/webinar-offer';
import {termsPath} from '@/lib/webinar-terms';
import {BONUS_END,DEPOSIT,OFFER_END,TARIFFS,bonusActive,offerActive,tariffPrice} from '@/lib/webinar-offer-order.mjs';
import {Icon} from './icon';
import {MotionRoot,Wordmark} from './ui';
import {Questions,WbLangs,pad,useCountdown,useSalesSwitch} from './webinar';

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

type Result={kind:'paid'|'fail'|'pending'|'manual';mode:'buy'|'book';amount:number};

// Result of a payment or an order: shown after the bank sends the buyer back (?payment=…) or after a manual order.
function ResultBox({c,r}:{c:OfferCopy;r:Result}){
 const k=c.checkout,ok=r.kind==='paid'||r.kind==='manual';
 const title={paid:r.mode==='book'?k.paidBook:k.paidBuy,manual:r.mode==='book'?k.manualBook:k.manualBuy,fail:k.failTitle,pending:k.pendingTitle}[r.kind];
 const text={paid:k.paidText,manual:k.manualText(gel(r.amount)),fail:k.failText,pending:k.pendingText}[r.kind];
 return <div role="status" className="form-done wb-done">
  <span className={'wb-done-ico'+(ok?'':' is-warn')}><Icon name={ok?'check':r.kind==='fail'?'x':'clock'} size={24}/></span>
  <h3>{title}</h3>
  <p>{text}</p>
  <a href={contacts.whatsapp} target="_blank" rel="noopener" className="btn wb-cta wb-wide">{k.curator}<Icon name="whatsapp" size={18}/></a>
  {r.kind==='fail'&&<a href="#tariffs" className="ulink">{k.retry}</a>}
 </div>;
}

function Modal({label,onClose,children,close}:{label:string;onClose:()=>void;children:React.ReactNode;close:string}){
 useEffect(()=>{
  const onKey=(e:KeyboardEvent)=>{if(e.key==='Escape')onClose()};
  document.addEventListener('keydown',onKey);document.body.style.overflow='hidden';
  const f=setTimeout(()=>document.querySelector<HTMLInputElement>('.wb-modal input[name=name]')?.focus(),60);
  return()=>{clearTimeout(f);document.removeEventListener('keydown',onKey);document.body.style.overflow=''};
 },[onClose]);
 return <div className="wb-modal-wrap" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}>
  <div role="dialog" aria-modal="true" aria-label={label} className="wb-modal wb-co fade-in">
   <button type="button" onClick={onClose} aria-label={close} className="wb-modal-x"><Icon name="x" size={18}/></button>
   {children}
  </div>
 </div>;
}

function Checkout({c,lang,order,now,onClose}:{c:OfferCopy;lang:'ru'|'en'|'ka';order:Order;now:number;onClose:()=>void}){
 const k=c.checkout,t=order.tariff,name0=c.tariffs.items[t.key as TariffKey].name;
 const special=offerActive(now),price=tariffPrice(t,now),amount=order.mode==='book'?DEPOSIT:price;
 const from=t.from&&order.mode==='buy'&&c.tariffs.from?c.tariffs.from+' ':'';
 const [name,setName]=useState(''),[email,setEmail]=useState(''),[phone,setPhone]=useState(''),[accepted,setAccepted]=useState(false),[website,setWebsite]=useState('');
 const [status,setStatus]=useState<''|'invalid'|'accept'|'error'>(''),[sending,setSending]=useState(''),[result,setResult]=useState<Result|null>(null);
 const submit=async(e:React.FormEvent)=>{
  e.preventDefault();if(sending)return;
  if(!name.trim()||!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())||phone.replace(/\D/g,'').length<7){setStatus('invalid');track('form_error',{form:'offer',reason:'invalid'});return}
  if(!accepted){setStatus('accept');return}
  setSending(k.sending);setStatus('');
  try{
   const r=await fetch(base+'/api/checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({tariff:t.key,mode:order.mode,name,email,phone,website,lang,accepted:true,page:location.pathname,source:getAttribution()})});
   const data=await r.json().catch(()=>({})) as {ok?:boolean;amount?:number;payment?:string;url?:string};
   if(!r.ok||!data.ok)throw new Error();
   const value=data.amount||amount;
   if(data.payment==='redirect'&&data.url){track('add_payment_info',{tariff:t.key,mode:order.mode,value,currency:'GEL'});setSending(k.redirecting);location.assign(data.url);return}
   setResult({kind:'manual',mode:order.mode,amount:value});track('checkout_request',{tariff:t.key,mode:order.mode,value,currency:'GEL'});
  }catch{setStatus('error');track('form_error',{form:'offer',reason:'send_failed'})}
  setSending('');
 };
 return <Modal label={(order.mode==='book'?k.book:k.buy)+': '+name0} onClose={onClose} close={k.close}>
  {result?<ResultBox c={c} r={result}/>:
  <form onSubmit={submit} noValidate className="form wb-form">
   <div><p className="wb-co-k">{order.mode==='book'?k.book:k.buy}</p><h2 className="wb-form-h">{name0}</h2></div>
   <div className="wb-co-sum">
    <span>{k.amount}</span>
    <b>{gel(amount)}{order.mode==='buy'&&special&&<s>{from}{gel(t.old)}</s>}</b>
    {order.mode==='book'&&<small>{k.hold(from+gel(price))}</small>}
    {order.mode==='buy'&&t.from&&<small>{k.hours}</small>}
    {bonusActive(now)&&<em><Icon name="gift" size={15}/>{k.bonusPill}</em>}
   </div>
   <label className="field">{k.name}<input name="name" required maxLength={100} value={name} onChange={e=>{setName(e.target.value);setStatus('')}} autoComplete="name"/></label>
   <label className="field">{k.email}<input name="email" type="email" required maxLength={160} value={email} onChange={e=>{setEmail(e.target.value);setStatus('')}} placeholder={k.emailPh} autoComplete="email" aria-invalid={status==='invalid'}/></label>
   <label className="field">{k.phone}<input name="phone" type="tel" required maxLength={40} value={phone} onChange={e=>{setPhone(e.target.value);setStatus('')}} placeholder="+995 5XX XXX XXX" autoComplete="tel" aria-invalid={status==='invalid'}/></label>
   <div className="wb-co-pay"><Icon name="lock" size={16}/><span><b>{k.payLabel}</b>{k.payInfo}</span></div>
   <label className={'wb-co-accept'+(status==='accept'?' is-invalid':'')}><input type="checkbox" checked={accepted} onChange={e=>{setAccepted(e.target.checked);setStatus('')}}/><span>{k.accept[0]}<a href={base+langPath(lang)+termsPath} target="_blank" rel="noopener">{k.accept[1]}</a>{k.accept[2]}</span></label>
   <input name="website" tabIndex={-1} aria-hidden="true" autoComplete="off" value={website} onChange={e=>setWebsite(e.target.value)} className="hp"/>
   {status&&<p role="alert" className="form-status"><Icon name="alert-circle" size={16}/>{status==='invalid'?k.invalid:status==='accept'?k.notAccepted:k.error}</p>}
   <button type="submit" disabled={!!sending} className="btn wb-cta wb-wide wb-submit">{sending||(order.mode==='book'?k.submitBook:k.submitBuy(gel(amount)))}<Icon name="arrow-right" size={20}/></button>
   <small className="wb-note">{k.consent} <a href={pageHref(lang,'privacy')}>{k.privacy}</a></small>
  </form>}
 </Modal>;
}

function Timer({target,units,label,ended}:{target:string;units:string[];label:string;ended:string}){
 const v=useCountdown(target),over=v&&v.every(x=>x===0);
 return <div className="wb-otimer" role="timer" aria-label={over?ended:label}>
  <span className="wb-count-label">{over?ended:label}</span>
  <div className="wb-otimer-row">{units.map((u,i)=><div key={u}><b suppressHydrationWarning>{v?pad(v[i]):'--'}</b><span>{u}</span></div>)}</div>
 </div>;
}

export function WebinarOffer({lang='ru'}:{lang?:Lang}){
 const L=(lang==='en'||lang==='ka'?lang:'ru') as 'ru'|'en'|'ka',c=offerCopy[L];
 const now=useNow(),left=useCountdown(OFFER_END),bonusLeft=useCountdown(BONUS_END);
 const special=now===null||offerActive(now),bonus=now===null||bonusActive(now);
 const [order,setOrder]=useState<Order|null>(null),[sticky,setSticky]=useState(false),[back,setBack]=useState<Result|null>(null);
 // Until the owner opens sales, the offer page sends visitors back to the workshop landing. Buyers returning from the bank stay,
 // and ?preview=1 in the address lets the team look at the page before the workshop (only while it stays in the address).
 const keep=useRef(false);
 useSalesSwitch(state=>{
  if(state!=='closed'||keep.current)return;
  try{sessionStorage.removeItem('praxen_offer_preview')}catch{}
  const q=new URLSearchParams(location.search);if(q.has('preview')||q.has('payment')){keep.current=true;return}
  location.replace(base+langPath(L)+'/webinar'+location.search);
 });
 // The bank sends the buyer back here with ?payment=success|fail|pending; the team learns about the payment from the bank's notice.
 useEffect(()=>{
  const q=new URLSearchParams(location.search),p=q.get('payment');if(!p)return;
  keep.current=true;
  const mode=q.get('mode')==='book'?'book':'buy',amount=Number(q.get('amount'))||0;
  const kind=p==='success'?'paid':p==='fail'?'fail':'pending';
  history.replaceState(null,'',location.pathname);
  const t=setTimeout(()=>setBack({kind,mode,amount}),0);
  if(kind==='paid')track('purchase',{tariff:q.get('tariff')||'',mode,value:amount,currency:'GEL',transaction_id:q.get('order')||''});
  return()=>clearTimeout(t);
 },[]);
 const hero=useRef<HTMLElement>(null);
 useEffect(()=>{
  if(!hero.current)return;
  const io=new IntersectionObserver(([e])=>setSticky(!e.isIntersecting),{rootMargin:'-80px 0px 0px 0px'});
  io.observe(hero.current);return()=>io.disconnect();
 },[]);
 const open=(tariff:Tariff,mode:'buy'|'book')=>{setOrder({tariff,mode});const value=mode==='book'?DEPOSIT:tariffPrice(tariff,now??0);track('begin_checkout',{tariff:tariff.key,mode,value,currency:'GEL'})};
 const close=useCallback(()=>setOrder(null),[]),closeBack=useCallback(()=>setBack(null),[]);
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
    <div className="wb-head-r"><WbLangs lang={L} path={offerPath}/><a href="#tariffs" onClick={toTariffs} className="wb-head-cta">{c.head.cta}</a></div>
   </header>

   <main id="main" tabIndex={-1}>
    <section ref={hero} data-screen-label="01 Hero" className="wb-c wb-hero">
     <p className="wb-badge"><span className="wb-dot" aria-hidden="true"/>{c.hero.badge}</p>
     <h1 className="wb-h1">{c.hero.h1} <span className="wb-grad">{c.hero.h1Grad}</span></h1>
     <div className="wb-hero-row">
      <p className="wb-lead">{c.hero.sub}</p>
      <Timer target={OFFER_END} units={c.hero.units} label={c.hero.countLabel} ended={c.hero.countEnded}/>
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
     <div className="footer-bottom wb-foot-legal"><span>© 2026 Praxen AI · {c.foot.location} · <a href={base+langPath(L)+termsPath} className="footer-privacy">{c.foot.offer}</a> · <a href={pageHref(L,'privacy')} className="footer-privacy">{c.foot.privacy}</a></span></div>
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
   {back&&!order&&<Modal label={c.checkout.amount} onClose={closeBack} close={c.checkout.close}><ResultBox c={c} r={back}/></Modal>}
  </div>
 );
}
