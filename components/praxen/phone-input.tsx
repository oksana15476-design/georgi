'use client';
import {useEffect,useId,useRef,useState,useSyncExternalStore} from 'react';
import {isIntl} from '@/lib/market';

// Phone with a country: a flag button opens the list of countries, the number is typed into that country's mask.
// The country is guessed from the visitor's time zone; a pasted "+998…" switches it. Reports the full number
// ("+7 701 123 45 67") and whether it is complete.
type L='ru'|'en'|'ka';
type Country={iso:string;code:string;mask:string;min?:number;ph:string;name:Record<L,string>};
const all:Country[]=[
 {iso:'GE',code:'995',mask:'XXX XXX XXX',ph:'555 123 456',name:{ru:'Грузия',en:'Georgia',ka:'საქართველო'}},
 {iso:'KZ',code:'7',mask:'XXX XXX XX XX',ph:'701 123 45 67',name:{ru:'Казахстан',en:'Kazakhstan',ka:'ყაზახეთი'}},
 {iso:'UZ',code:'998',mask:'XX XXX XX XX',ph:'90 123 45 67',name:{ru:'Узбекистан',en:'Uzbekistan',ka:'უზბეკეთი'}},
 {iso:'RU',code:'7',mask:'XXX XXX XX XX',ph:'912 345 67 89',name:{ru:'Россия',en:'Russia',ka:'რუსეთი'}},
 {iso:'KG',code:'996',mask:'XXX XXX XXX',ph:'700 123 456',name:{ru:'Кыргызстан',en:'Kyrgyzstan',ka:'ყირგიზეთი'}},
 {iso:'AM',code:'374',mask:'XX XXX XXX',ph:'91 234 567',name:{ru:'Армения',en:'Armenia',ka:'სომხეთი'}},
 {iso:'AZ',code:'994',mask:'XX XXX XX XX',ph:'50 123 45 67',name:{ru:'Азербайджан',en:'Azerbaijan',ka:'აზერბაიჯანი'}},
 {iso:'BY',code:'375',mask:'XX XXX XX XX',ph:'29 123 45 67',name:{ru:'Беларусь',en:'Belarus',ka:'ბელარუსი'}},
 {iso:'UA',code:'380',mask:'XX XXX XX XX',ph:'50 123 45 67',name:{ru:'Украина',en:'Ukraine',ka:'უკრაინა'}},
 {iso:'TR',code:'90',mask:'XXX XXX XX XX',ph:'532 123 45 67',name:{ru:'Турция',en:'Turkey',ka:'თურქეთი'}},
 {iso:'GB',code:'44',mask:'XXXX XXXXXX',min:9,ph:'7700 900123',name:{ru:'Великобритания',en:'United Kingdom',ka:'დიდი ბრიტანეთი'}},
 {iso:'IE',code:'353',mask:'XX XXX XXXX',min:7,ph:'85 123 4567',name:{ru:'Ирландия',en:'Ireland',ka:'ირლანდია'}},
 {iso:'US',code:'1',mask:'XXX XXX XXXX',ph:'201 555 0123',name:{ru:'США',en:'United States',ka:'აშშ'}},
];
const intlFirst=['GB','IE','US'];
// praxenai.com lists only its own markets (the .com and .ge sites do not mix); any other number goes under «Other country».
const countries=isIntl?all.filter(c=>intlFirst.includes(c.iso)):all;
const fallback=isIntl?'GB':'GE';
const t={other:{ru:'Другая страна',en:'Other country',ka:'სხვა ქვეყანა'},label:{ru:'Страна и код',en:'Country and code',ka:'ქვეყანა და კოდი'}};
const zones:Record<string,string>={'Asia/Tbilisi':'GE','Asia/Almaty':'KZ','Asia/Qostanay':'KZ','Asia/Aqtobe':'KZ','Asia/Aqtau':'KZ','Asia/Atyrau':'KZ','Asia/Oral':'KZ','Asia/Qyzylorda':'KZ',
 'Asia/Tashkent':'UZ','Asia/Samarkand':'UZ','Asia/Bishkek':'KG','Asia/Yerevan':'AM','Asia/Baku':'AZ','Europe/Minsk':'BY','Europe/Kiev':'UA','Europe/Kyiv':'UA','Europe/Istanbul':'TR',
 'Europe/Moscow':'RU','Europe/Kaliningrad':'RU','Europe/Samara':'RU','Europe/Volgograd':'RU','Asia/Yekaterinburg':'RU','Asia/Omsk':'RU','Asia/Novosibirsk':'RU','Asia/Krasnoyarsk':'RU','Asia/Irkutsk':'RU','Asia/Vladivostok':'RU',
 'Europe/London':'GB','Europe/Belfast':'GB','Europe/Dublin':'IE','America/New_York':'US','America/Chicago':'US','America/Denver':'US','America/Los_Angeles':'US','America/Phoenix':'US'};
const slots=(m:string)=>m.split('X').length-1;
const fill=(d:string,m:string)=>{let o='',i=0;for(const ch of m){if(i>=d.length)break;if(ch==='X')o+=d[i++];else o+=ch}return o.trim()};
const find=(iso:string)=>countries.find(c=>c.iso===iso);
const byCode=[...countries].sort((a,b)=>b.code.length-a.code.length);
const guess=()=>{try{const z=zones[Intl.DateTimeFormat().resolvedOptions().timeZone];return z&&find(z)?z:fallback}catch{return fallback}};
const noop=()=>()=>{};

const r=(x:number,y:number,w:number,h:number,f:string)=><rect x={x} y={y} width={w} height={h} fill={f}/>;
function PhoneFlag({iso}:{iso:string}){
 const f:Record<string,React.ReactNode>={
  GE:<>{r(0,0,30,20,'#fff')}<path d="M13 0h4v20h-4zM0 8h30v4H0z" fill="#e8112d"/><path d="M6 3h1.4v1.4h1.4v1.4H7.4v1.4H6V5.8H4.6V4.4H6zM22.6 3H24v1.4h1.4v1.4H24v1.4h-1.4V5.8h-1.4V4.4h1.4zM6 13.4h1.4v1.4h1.4v1.4H7.4v1.4H6v-1.4H4.6v-1.4H6zM22.6 13.4H24v1.4h1.4v1.4H24v1.4h-1.4v-1.4h-1.4v-1.4h1.4z" fill="#e8112d"/></>,
  KZ:<>{r(0,0,30,20,'#00afca')}{r(2,1.5,1.4,17,'#fec50c')}<circle cx="16" cy="8.5" r="3.6" fill="#fec50c"/><path d="M10 13.5q6 2.5 12 0" stroke="#fec50c" strokeWidth="1.3" fill="none"/></>,
  UZ:<>{r(0,0,30,6.4,'#0099b5')}{r(0,6.4,30,0.6,'#ce1126')}{r(0,7,30,6,'#fff')}{r(0,13,30,0.6,'#ce1126')}{r(0,13.6,30,6.4,'#1eb53a')}<circle cx="5" cy="3.2" r="2.2" fill="#fff"/><circle cx="5.9" cy="3.2" r="2" fill="#0099b5"/></>,
  RU:<>{r(0,0,30,6.7,'#fff')}{r(0,6.7,30,6.6,'#0039a6')}{r(0,13.3,30,6.7,'#d52b1e')}</>,
  KG:<>{r(0,0,30,20,'#e8112d')}<circle cx="15" cy="10" r="5" fill="#ffef00"/><circle cx="15" cy="10" r="3" fill="#e8112d"/><circle cx="15" cy="10" r="2.3" fill="#ffef00"/></>,
  AM:<>{r(0,0,30,6.7,'#d90012')}{r(0,6.7,30,6.6,'#0033a0')}{r(0,13.3,30,6.7,'#f2a800')}</>,
  AZ:<>{r(0,0,30,6.7,'#0092bc')}{r(0,6.7,30,6.6,'#e4002b')}{r(0,13.3,30,6.7,'#00af66')}<circle cx="14" cy="10" r="2.6" fill="#fff"/><circle cx="14.7" cy="10" r="2.1" fill="#e4002b"/><circle cx="17.4" cy="10" r=".9" fill="#fff"/></>,
  BY:<>{r(0,0,30,13.3,'#c8313e')}{r(0,13.3,30,6.7,'#4aa657')}{r(0,0,4,20,'#fff')}<path d="M2 1l1.2 2L2 5 .8 3zM2 7l1.2 2L2 11 .8 9zM2 13l1.2 2L2 17 .8 15z" fill="#c8313e"/></>,
  UA:<>{r(0,0,30,10,'#0057b7')}{r(0,10,30,10,'#ffd700')}</>,
  TR:<>{r(0,0,30,20,'#e30a17')}<circle cx="11" cy="10" r="5" fill="#fff"/><circle cx="12.3" cy="10" r="4" fill="#e30a17"/><path d="M15.6 10l3.6-1.2-2.2 3.1V8.1l2.2 3.1z" fill="#fff"/></>,
  GB:<>{r(0,0,30,20,'#012169')}<path d="M0 0l30 20M30 0L0 20" stroke="#fff" strokeWidth="4"/><path d="M0 0l30 20M30 0L0 20" stroke="#c8102e" strokeWidth="1.4"/><path d="M15 0v20M0 10h30" stroke="#fff" strokeWidth="6"/><path d="M15 0v20M0 10h30" stroke="#c8102e" strokeWidth="3.4"/></>,
  IE:<>{r(0,0,10,20,'#169b62')}{r(10,0,10,20,'#fff')}{r(20,0,10,20,'#ff883e')}</>,
  US:<>{r(0,0,30,20,'#fff')}{[0,2,4,6,8,10,12].map(i=><rect key={i} y={i*20/13} width="30" height={20/13} fill="#b22234"/>)}{r(0,0,12,10.8,'#3c3b6e')}</>,
 };
 if(!f[iso])return <svg className="phone-flag is-globe" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M1.5 10h17M10 1.5c2.6 2.3 3.8 5.1 3.8 8.5s-1.2 6.2-3.8 8.5c-2.6-2.3-3.8-5.1-3.8-8.5s1.2-6.2 3.8-8.5z" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg>;
 return <svg className="phone-flag" viewBox="0 0 30 20" preserveAspectRatio="xMidYMid slice" aria-hidden="true">{f[iso]}</svg>;
}

export function PhoneInput({lang,invalid,onChange,className,label,describedBy}:{lang:L;invalid?:boolean;onChange:(full:string,valid:boolean)=>void;className?:string;label?:string;describedBy?:string}){
 const auto=useSyncExternalStore(noop,guess,()=>fallback);
 const [picked,setPicked]=useState<string|null>(null),[local,setLocal]=useState(''),[open,setOpen]=useState(false),[active,setActive]=useState(0);
 const iso=picked??auto,c=find(iso);
 const uid=useId().replace(/:/g,''),box=useRef<HTMLDivElement>(null),list=useRef<HTMLUListElement>(null),input=useRef<HTMLInputElement>(null),btn=useRef<HTMLButtonElement>(null);
 const opts=[...countries.map(x=>x.iso),''];
 const emit=(next:string,d:string)=>{
  const cc=find(next);
  onChange(cc?(d?'+'+cc.code+' '+fill(d,cc.mask):''):(d?'+'+d:''),cc?d.length>=(cc.min??slots(cc.mask))&&d.length<=slots(cc.mask):d.length>=7&&d.length<=15);
 };
 const type=(raw:string)=>{
  let d=raw.replace(/\D/g,''),next=iso;
  if(raw.trim().startsWith('+')){
   const hit=byCode.find(x=>d.startsWith(x.code));
   if(hit){next=hit.code==='7'?(c?.code==='7'?iso:/^7[67]/.test(d)?'KZ':'RU'):hit.iso;d=d.slice(hit.code.length)}else next='';
  }else if(c){
   if(d.length>slots(c.mask)&&d.startsWith(c.code))d=d.slice(c.code.length);
   else if(c.code==='7'&&d.length===11&&d.startsWith('8'))d=d.slice(1);
   if(d.startsWith('0'))d=d.slice(1);
  }
  const cc=find(next);d=d.slice(0,cc?slots(cc.mask):15);
  if(next!==iso)setPicked(next);
  setLocal(d);emit(next,d);
 };
 const choose=(next:string)=>{const cc=find(next),d=cc?local.slice(0,slots(cc.mask)):local;setPicked(next);setLocal(d);emit(next,d);setOpen(false);input.current?.focus()};
 const show=()=>{setActive(Math.max(0,opts.indexOf(iso)));setOpen(true)};
 useEffect(()=>{
  if(!open)return;
  list.current?.focus();
  const out=(e:PointerEvent)=>{if(!box.current?.contains(e.target as Node))setOpen(false)};
  document.addEventListener('pointerdown',out);return()=>document.removeEventListener('pointerdown',out);
 },[open]);
 useEffect(()=>{if(open)list.current?.querySelector('.is-active')?.scrollIntoView({block:'nearest'})},[open,active]);
 const keys=(e:React.KeyboardEvent)=>{
  if(e.key==='ArrowDown'){e.preventDefault();setActive(a=>Math.min(opts.length-1,a+1))}
  else if(e.key==='ArrowUp'){e.preventDefault();setActive(a=>Math.max(0,a-1))}
  else if(e.key==='Home'){e.preventDefault();setActive(0)}
  else if(e.key==='End'){e.preventDefault();setActive(opts.length-1)}
  else if(e.key==='Enter'||e.key===' '){e.preventDefault();choose(opts[active])}
  else if(e.key==='Tab')setOpen(false)
  else if(/^\p{L}$/u.test(e.key)){const k=e.key.toLowerCase(),i=countries.findIndex(x=>x.name[lang].toLowerCase().startsWith(k));if(i>=0)setActive(i)}
 };
 // Escape closes only the list, not a dialog the field sits in.
 const esc=(e:React.KeyboardEvent)=>{if(open&&e.key==='Escape'){e.preventDefault();e.stopPropagation();e.nativeEvent.stopImmediatePropagation();setOpen(false);btn.current?.focus()}};
 return <div ref={box} onKeyDown={esc} className={'phone'+(invalid?' is-invalid':'')+(className?' '+className:'')}>
  <button ref={btn} type="button" className="phone-cc" aria-haspopup="listbox" aria-expanded={open} aria-controls={uid+'-list'} aria-label={t.label[lang]+': '+(c?c.name[lang]+' +'+c.code:t.other[lang])}
   onClick={()=>open?setOpen(false):show()} onKeyDown={e=>{if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();show()}}}>
   <PhoneFlag iso={iso}/><span>{c?'+'+c.code:'+'}</span><svg className="phone-chev" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 4.5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
  </button>
  {open&&<ul ref={list} id={uid+'-list'} role="listbox" tabIndex={-1} aria-label={t.label[lang]} aria-activedescendant={uid+'-o'+active} onKeyDown={keys} className="phone-list">
   {opts.map((o,i)=>{const x=find(o);return <li key={o||'other'} id={uid+'-o'+i} role="option" aria-selected={o===iso} onPointerEnter={()=>setActive(i)} onClick={()=>choose(o)} className={i===active?'is-active':''}>
    <PhoneFlag iso={o}/><span>{x?x.name[lang]:t.other[lang]}</span>{x&&<small>+{x.code}</small>}
   </li>})}
  </ul>}
  <input ref={input} name="phone" type="tel" inputMode="tel" autoComplete="tel" required value={c?fill(local,c.mask):(local?'+'+local:'')} onChange={e=>type(e.target.value)}
   placeholder={c?c.ph:'+…'} aria-label={label} aria-invalid={invalid} aria-describedby={describedBy} className={invalid?'is-invalid':''}/>
 </div>;
}
