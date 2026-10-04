'use client';
import {useState} from 'react';
import {contacts} from '@/lib/contacts';
import {Icon} from './icon';
import type {X} from './types';

const rd=(ms:number)=>({'--rd':ms+'ms'} as React.CSSProperties);

export function Faq({x,items,title}:{x:X;items:[string,string][];title:string}){
 const {s}=x;
 const [open,setOpen]=useState(0);
 const card=(q:string,a:string,i:number)=>{
  const on=open===i;
  return <div key={q} className={'faq-card'+(on?' is-open':'')} style={{order:i}}>
   <h3><button type="button" onClick={()=>setOpen(on?-1:i)} aria-expanded={on} aria-controls={'faq-'+i}>{q}<span className="faq-ring"><Icon name="plus" size={15}/></span></button></h3>
   {on&&<p id={'faq-'+i} className="faq-a">{a}</p>}
  </div>;
 };
 return (
  <section data-screen-label="FAQ" className="wrap sec">
   <div className="faq-head">
    <div data-reveal=""><p className="kicker">FAQ</p><h2 className="h2">{title}</h2></div>
    <p data-reveal="" style={rd(100)} className="faq-sub">{s.faqSub}</p>
   </div>
   <div className="faq-grid">
    <div className="faq-col">{items.map(([q,a],i)=>i%2===0&&card(q,a,i))}</div>
    <div className="faq-col">{items.map(([q,a],i)=>i%2===1&&card(q,a,i))}</div>
   </div>
   <div data-reveal="" style={rd(80)} className="faq-ask">
    <div><h3>{s.faqAskTitle}</h3><p>{s.faqAskBody}</p></div>
    <div className="faq-ask-btns">
     <a href={contacts.telegram} target="_blank" rel="noopener" className="ask-dark"><Icon name="send" size={15}/>Telegram</a>
     <a href={'tel:'+contacts.phone} className="ask-light tnum"><Icon name="phone" size={15}/>{contacts.phoneLabel}</a>
     <a href="#contact" onClick={x.toContact} className="ask-light">{s.faqAskForm}</a>
    </div>
   </div>
  </section>
 );
}

export function Contact({x,options,context,setContext}:{x:X;options:string[];context:string;setContext:(v:string)=>void}){
 const {s,lang}=x;
 const [chosen,setChosen]=useState<number[]>([]),[method,setMethod]=useState<'telegram'|'phone'>('telegram'),[contact,setContactValue]=useState(''),[message,setMessage]=useState(''),[website,setWebsite]=useState('');
 const [status,setStatus]=useState<''|'invalid'|'error'>(''),[sending,setSending]=useState(false),[done,setDone]=useState(false);
 const change=(value:string)=>{
  setStatus('');
  if(method==='telegram'){setContactValue(value.replace(/\s/g,''));return}
  const d=value.replace(/\D/g,'').slice(0,15);
  if(d.startsWith('995')){const r=d.slice(3);setContactValue('+995'+(r?' '+r.slice(0,3):'')+(r.length>3?' '+r.slice(3,6):'')+(r.length>6?' '+r.slice(6,9):''))}
  else setContactValue((value.startsWith('+')?'+':'')+d);
 };
 const submit=async(e:React.FormEvent)=>{
  e.preventDefault();if(sending)return;
  const plain=contact.replace(/\D/g,'');
  if(method==='phone'&&(plain.length<7||plain.length>15)){setStatus('invalid');return}
  if(method==='telegram'&&!/^@?[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(contact)&&!/^\+[0-9]{7,15}$/.test(contact.replace(/[\s()-]/g,''))){setStatus('invalid');return}
  setSending(true);setStatus('');
  try{
   const r=await fetch('/api/leads',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message,contact:method+': '+contact,context,lang,tasks:chosen.map(i=>options[i]),page:location.pathname,website})});
   if(!r.ok)throw new Error();
   setDone(true);
  }catch{setStatus('error')}
  finally{setSending(false)}
 };
 const invalid=status==='invalid',statusText=status==='invalid'?s.invalidText:status==='error'?s.errorText:'';
 const methods:[typeof method,string][]=[['telegram','Telegram'],['phone',s.phoneMethod]];
 return (
  <section id="contact" data-screen-label="Contact" className="contact-band">
   <div className="wrap sec contact-grid">
    <div>
     <div data-reveal=""><h2 className="h2">{s.contactH2}</h2><p className="lead mw460">{s.contactP}</p></div>
     <ol className="contact-steps">{s.contactSteps.map((st,i)=><li key={st}><span>{i+1}</span>{st}</li>)}</ol>
     <div className="contact-links">
      <a href={'tel:'+contacts.phone}><Icon name="phone" size={16}/>{contacts.phoneLabel}</a>
      <a href={contacts.telegram} target="_blank" rel="noopener"><Icon name="send" size={16}/>{s.telegram}</a>
      <span><Icon name="map-pin" size={16}/>{s.location}</span>
     </div>
    </div>
    <div className="form-box">
     {done?<div role="status" className="form-done fade-in">
      <span className="done-icon"><Icon name="check" size={22}/></span>
      <h3>{s.successTitle}</h3>
      <p>{s.successBody}</p>
      <p className="done-summary">{(method==='telegram'?'Telegram: ':s.phoneMethod+': ')+contact}</p>
      <div className="done-links">
       <a href={contacts.telegram} target="_blank" rel="noopener" className="ulink">{s.telegram}<Icon name="arrow-right" size={16}/></a>
       <button type="button" onClick={()=>{setDone(false);setStatus('');setChosen([]);setMessage('');setContactValue('')}} className="ulink ulink-muted">{s.sendAnother}</button>
      </div>
     </div>:
     <form onSubmit={submit} noValidate data-lpignore="true" className="form">
      <fieldset>
       <legend>{s.whatTakes}</legend>
       <div className="chips">{options.map((lb,i)=>{const on=chosen.includes(i);return <button key={lb} type="button" onClick={()=>setChosen(v=>v.includes(i)?v.filter(n=>n!==i):[...v,i])} aria-pressed={on} className={'chip'+(on?' is-on':'')}>{lb}</button>})}</div>
      </fieldset>
      {chosen.includes(options.length-1)&&<label className="field fade-in">{s.tellTask}<textarea name="message" rows={3} maxLength={2000} value={message} onChange={e=>setMessage(e.target.value)}/></label>}
      {context&&<div className="context-chip"><span><span className="muted">{s.contextLabel}</span> <b>{context}</b></span><button type="button" onClick={()=>setContext('')} aria-label={s.removeContext}><Icon name="x" size={15}/></button></div>}
      <div className="field">
       <span>{s.howContact}</span>
       <div role="radiogroup" aria-label={s.howContact} className="methods">{methods.map(([k,lb])=><button key={k} type="button" role="radio" aria-checked={method===k} onClick={()=>{setMethod(k);setContactValue('');setStatus('')}} className={method===k?'is-on':''}>{lb}</button>)}</div>
      </div>
      <label className="field">{method==='telegram'?'Telegram':s.phoneLabel}<input name="contact" required value={contact} onChange={e=>change(e.target.value)} placeholder={method==='telegram'?'@username / +995…':'+995 5XX XXX XXX'} inputMode={method==='phone'?'tel':'text'} autoComplete={method==='phone'?'tel':'off'} aria-invalid={invalid} aria-describedby={statusText?'form-status':undefined} className={invalid?'is-invalid':''}/></label>
      <input name="website" tabIndex={-1} aria-hidden="true" autoComplete="off" value={website} onChange={e=>setWebsite(e.target.value)} className="hp"/>
      {statusText&&<p id="form-status" role="alert" className="form-status"><Icon name="alert-circle" size={16}/>{statusText}</p>}
      <div className="submit-row">
       <button type="submit" disabled={sending} className="btn btn-primary submit-btn">{sending?s.sending:s.submit}<Icon name="arrow-right" size={16}/></button>
       <small>{s.formNote}</small>
      </div>
     </form>}
    </div>
   </div>
  </section>
 );
}
