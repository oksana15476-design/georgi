'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import {contacts} from '@/lib/contacts';
import {track} from '@/components/analytics';
import {Icon} from './icon';
import type {X} from './types';

type Kind='exit'|'idle';
const shownKey='praxen_popup',closedKey='praxen_popup_closed',engagedKey='praxen_engaged';
const minOnPage=10000,idleAfter=40000,pauseDays=3;

const get=(store:'local'|'session',k:string)=>{try{return (store==='local'?localStorage:sessionStorage).getItem(k)}catch{return null}};
const set=(store:'local'|'session',k:string,v:string)=>{try{(store==='local'?localStorage:sessionStorage).setItem(k,v)}catch{}};

// One offer per session: on desktop when the cursor leaves through the top of the window,
// anywhere after 40 s without scrolling, typing or touching. Never for visitors who already
// started the form or clicked WhatsApp, Telegram, phone or booking, never over the contact section, and paused for
// three days after it is closed.
export function LeadPopup({x,menu}:{x:X;menu:boolean}){
 const {c,s}=x;
 const [kind,setKind]=useState<Kind|null>(null);
 const box=useRef<HTMLDivElement>(null),back=useRef<Element|null>(null),menuOpen=useRef(menu),shown=useRef<Kind|null>(null);
 useEffect(()=>{menuOpen.current=menu},[menu]);
 const hide=useCallback(()=>{setKind(null);(back.current as HTMLElement|null)?.focus?.()},[]);
 const close=useCallback(()=>{set('local',closedKey,String(Date.now()));track('popup_close',{type:shown.current||''});hide()},[hide]);

 useEffect(()=>{
  const start=Date.now();
  const allowed=()=>{
   if(get('session',shownKey)||get('session',engagedKey)||menuOpen.current||document.hidden)return false;
   if(Date.now()-start<minOnPage)return false;
   const closed=Number(get('local',closedKey)||0);if(closed&&Date.now()-closed<pauseDays*864e5)return false;
   const form=document.getElementById('contact')?.getBoundingClientRect();
   if(form&&form.top<window.innerHeight&&form.bottom>0)return false;
   return !document.querySelector('[role="dialog"][aria-modal="true"]');
  };
  // ?popup=exit or ?popup=idle shows the popup at once, to check how it looks.
  const forced=new URLSearchParams(location.search).get('popup');
  const open=(k:Kind,force=false)=>{if(!force&&!allowed())return;set('session',shownKey,k);shown.current=k;back.current=document.activeElement;setKind(k);track('popup_view',{type:k})};
  // Fast cursor moves report the last position inside the page, so anything near the top edge counts.
  const onOut=(e:MouseEvent)=>{if(!e.relatedTarget&&e.clientY<40)open('exit')};
  if(forced==='exit'||forced==='idle'){const t=setTimeout(()=>open(forced,true),300);return()=>clearTimeout(t)}
  let timer=setTimeout(()=>open('idle'),idleAfter);
  const onActive=()=>{clearTimeout(timer);timer=setTimeout(()=>open('idle'),idleAfter)};
  const events=['scroll','mousemove','pointerdown','keydown','touchstart','wheel'] as const;
  const fine=window.matchMedia('(pointer:fine)').matches;
  if(fine)document.addEventListener('mouseout',onOut);
  events.forEach(ev=>window.addEventListener(ev,onActive,{passive:true}));
  return()=>{clearTimeout(timer);document.removeEventListener('mouseout',onOut);events.forEach(ev=>window.removeEventListener(ev,onActive))};
 },[]);

 useEffect(()=>{
  if(!kind)return;
  box.current?.focus();
  const onKey=(e:KeyboardEvent)=>{
   if(e.key==='Escape')close();
   if(e.key==='Tab'&&box.current){
    const items=[...box.current.querySelectorAll<HTMLElement>('a,button')];
    const first=items[0],last=items[items.length-1];
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
   }
  };
  document.addEventListener('keydown',onKey);return()=>document.removeEventListener('keydown',onKey);
 },[kind,close]);

 if(!kind)return null;
 const exit=kind==='exit';
 const title=exit?c('Уже уходите?','Leaving already?','უკვე მიდიხართ?'):c('Остались вопросы?','Any questions?','გაქვთ კითხვები?');
 const text=exit
  ?c('За 30 минут бесплатного аудита покажем, какие 2–3 процесса в вашей компании можно передать ИИ и сколько это сэкономит.','In a free 30-minute audit we will show which 2–3 processes in your company AI can take over and what that saves.','30-წუთიან უფასო აუდიტზე გაჩვენებთ, რომელი 2–3 პროცესი შეიძლება გადაეცეს AI-ს თქვენს კომპანიაში და რამდენს დაზოგავს ეს.')
  :c('Напишите в WhatsApp: подскажем, с чего начать внедрение ИИ в вашей компании, и ответим на вопросы о цене и сроках.','Message us on WhatsApp: we will suggest where to start with AI in your company and answer questions about price and timing.','მოგვწერეთ WhatsApp-ში: გეტყვით, საიდან დაიწყოთ AI-ს დანერგვა თქვენს კომპანიაში, და ვუპასუხებთ კითხვებს ფასსა და ვადებზე.');
 return (
  <div className="popup-layer" onMouseDown={e=>{if(e.target===e.currentTarget)close()}}>
   <div ref={box} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="popup-title" className="popup" data-screen-label={'Popup '+kind}>
    <button type="button" onClick={close} aria-label={c('Закрыть','Close','დახურვა')} className="popup-close"><Icon name="x" size={20}/></button>
    <span className="tile-icon"><Icon name={exit?'calendar':'whatsapp'} size={20}/></span>
    <h2 id="popup-title">{title}</h2>
    <p>{text}</p>
    <div className="popup-actions">
     <a href={contacts.whatsapp+'?text='+encodeURIComponent(s.heroWhatsAppText)} target="_blank" rel="noopener" onClick={hide} className="btn btn-primary"><Icon name="whatsapp" size={17}/>{c('Написать в WhatsApp','Message on WhatsApp','მოგვწერეთ WhatsApp-ში')}</a>
     {contacts.booking&&<a href={contacts.booking} target="_blank" rel="noopener" onClick={hide} className="btn btn-ghost"><Icon name="calendar" size={17}/>{c('Выбрать время для звонка','Pick a time for a call','აირჩიეთ ზარის დრო')}</a>}
    </div>
    <a href="#contact" onClick={e=>{hide();x.toContact(e)}} className="popup-link">{c('Или оставьте заявку на сайте','Or leave a request on the site','ან დატოვეთ მოთხოვნა საიტზე')}</a>
   </div>
  </div>
 );
}
