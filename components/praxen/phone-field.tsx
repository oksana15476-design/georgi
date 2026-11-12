'use client';
import {useEffect,useRef,useState,useSyncExternalStore,type ComponentType} from 'react';
import {isIntl} from '@/lib/market';
import type {PhoneInput as Full} from './phone-input';

// The phone field of every form. The full field (country list, masks, flags: components/praxen/phone-input.tsx) is a
// separate download that starts when the form is about a screen away, or at once when the visitor touches the field.
// Until then this light copy shows the same markup the full field renders before it picks a country (the default
// country of the site), so nothing moves when the full field takes over; a number typed meanwhile is carried over.
type Props=Parameters<typeof Full>[0];
let loaded:ComponentType<Props>|null=null,pending:Promise<unknown>|null=null;
const listeners=new Set<()=>void>();
export function loadPhone(){
 pending||=import('./phone-input').then(m=>{loaded=m.PhoneInput;listeners.forEach(l=>l())},()=>{pending=null});
 return pending;
}
const subscribe=(cb:()=>void)=>{listeners.add(cb);return()=>{listeners.delete(cb)}};

// The site's default country, as PhoneInput shows it before it guesses one from the time zone.
const home=isIntl
 ?{code:'44',ph:'7700 900123',name:{ru:'Великобритания',en:'United Kingdom',ka:'დიდი ბრიტანეთი'}}
 :{code:'995',ph:'555 123 456',name:{ru:'Грузия',en:'Georgia',ka:'საქართველო'}};
const ccLabel={ru:'Страна и код',en:'Country and code',ka:'ქვეყანა და კოდი'};
// The same drawings as PhoneFlag in phone-input.tsx (GB and GE only).
const r=(x:number,y:number,w:number,h:number,f:string)=><rect x={x} y={y} width={w} height={h} fill={f}/>;
const homeFlag=isIntl
 ?<>{r(0,0,30,20,'#012169')}<path d="M0 0l30 20M30 0L0 20" stroke="#fff" strokeWidth="4"/><path d="M0 0l30 20M30 0L0 20" stroke="#c8102e" strokeWidth="1.4"/><path d="M15 0v20M0 10h30" stroke="#fff" strokeWidth="6"/><path d="M15 0v20M0 10h30" stroke="#c8102e" strokeWidth="3.4"/></>
 :<>{r(0,0,30,20,'#fff')}<path d="M13 0h4v20h-4zM0 8h30v4H0z" fill="#e8112d"/><path d="M6 3h1.4v1.4h1.4v1.4H7.4v1.4H6V5.8H4.6V4.4H6zM22.6 3H24v1.4h1.4v1.4H24v1.4h-1.4V5.8h-1.4V4.4h1.4zM6 13.4h1.4v1.4h1.4v1.4H7.4v1.4H6v-1.4H4.6v-1.4H6zM22.6 13.4H24v1.4h1.4v1.4H24v1.4h-1.4v-1.4h-1.4v-1.4h1.4z" fill="#e8112d"/></>;

// The light copy reports the number itself, so a form still works if the full field's file never arrives (a broken
// connection): the default country's code plus the digits, or the number as typed when it starts with «+».
const report=(raw:string,onChange:Props['onChange'])=>{
 let d=raw.replace(/\D/g,'');const plus=raw.trim().startsWith('+');
 if(!plus&&d.startsWith('0'))d=d.slice(1);
 onChange(d?(plus?'+'+d:'+'+home.code+' '+d):'',d.length>=7&&d.length<=15);
};

function Shell({lang,invalid,className,label,describedBy,onChange,onStart}:Props&{onStart:(s:{value:string;focus:''|'input'|'list'})=>void}){
 const box=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const el=box.current;if(!el)return;
  if(!('IntersectionObserver' in window)){loadPhone();return}
  const io=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting)){io.disconnect();loadPhone()}},{rootMargin:'900px 0px'});
  io.observe(el);return()=>io.disconnect();
 },[]);
 return <div ref={box} className={'phone'+(invalid?' is-invalid':'')+(className?' '+className:'')}>
  <button type="button" className="phone-cc" aria-haspopup="listbox" aria-expanded={false} aria-label={ccLabel[lang]+': '+home.name[lang]+' +'+home.code}
   onPointerDown={()=>loadPhone()} onFocus={()=>loadPhone()} onClick={()=>{onStart({value:'',focus:'list'});loadPhone()}}>
   <svg className="phone-flag" viewBox="0 0 30 20" preserveAspectRatio="xMidYMid slice" aria-hidden="true">{homeFlag}</svg><span>{'+'+home.code}</span><svg className="phone-chev" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 4.5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
  </button>
  <input name="phone" type="tel" inputMode="tel" autoComplete="tel" required defaultValue="" placeholder={home.ph} aria-label={label} aria-invalid={invalid} aria-describedby={describedBy} className={invalid?'is-invalid':''}
   onPointerDown={()=>loadPhone()} onFocus={e=>{onStart({value:e.currentTarget.value,focus:'input'});loadPhone()}} onBlur={e=>onStart({value:e.currentTarget.value,focus:''})}
   onInput={e=>{const el=e.currentTarget;onStart({value:el.value,focus:document.activeElement===el?'input':''});report(el.value,onChange);loadPhone()}}/>
 </div>;
}

function Loaded(props:Props){const Field=loaded!;return <Field {...props}/>}

export function PhoneInput(props:Props){
 // false while hydrating (the server always renders the light copy), true once the full field's file has arrived.
 const ready=useSyncExternalStore(subscribe,()=>!!loaded,()=>false);
 const [start,setStart]=useState<{value:string;focus:''|'input'|'list'}>({value:'',focus:''});
 return ready?<Loaded {...props} start={start}/>:<Shell {...props} onStart={setStart}/>;
}
