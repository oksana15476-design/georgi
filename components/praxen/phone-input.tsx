'use client';
import {useState} from 'react';

// Phone with a country code: the code is picked from a list (guessed from the visitor's time zone),
// the number is typed into a mask. Reports the full number ("+7 701 123 45 67") and whether it is complete.
type L='ru'|'en'|'ka';
type Country={iso:string;code:string;mask:string;ph:string;name:Record<L,string>};
const countries:Country[]=[
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
];
const other={ru:'Другая страна',en:'Other country',ka:'სხვა ქვეყანა'};
const label={ru:'Код страны',en:'Country code',ka:'ქვეყნის კოდი'};
const zones:Record<string,string>={'Asia/Tbilisi':'GE','Asia/Almaty':'KZ','Asia/Qostanay':'KZ','Asia/Aqtobe':'KZ','Asia/Aqtau':'KZ','Asia/Atyrau':'KZ','Asia/Oral':'KZ','Asia/Qyzylorda':'KZ',
 'Asia/Tashkent':'UZ','Asia/Samarkand':'UZ','Asia/Bishkek':'KG','Asia/Yerevan':'AM','Asia/Baku':'AZ','Europe/Minsk':'BY','Europe/Kiev':'UA','Europe/Kyiv':'UA','Europe/Istanbul':'TR',
 'Europe/Moscow':'RU','Europe/Kaliningrad':'RU','Europe/Samara':'RU','Europe/Volgograd':'RU','Asia/Yekaterinburg':'RU','Asia/Omsk':'RU','Asia/Novosibirsk':'RU','Asia/Krasnoyarsk':'RU','Asia/Irkutsk':'RU','Asia/Vladivostok':'RU'};
const slots=(m:string)=>m.split('X').length-1;
const fill=(d:string,m:string)=>{let o='',i=0;for(const ch of m){if(i>=d.length)break;if(ch==='X')o+=d[i++];else o+=ch}return o.trim()};
const find=(iso:string)=>countries.find(c=>c.iso===iso);
// Rendered only after a click (form method or checkout), so reading the time zone here does not affect hydration.
const guess=()=>{try{return zones[Intl.DateTimeFormat().resolvedOptions().timeZone]||'GE'}catch{return 'GE'}};

export function PhoneInput({lang,invalid,onChange,className,id}:{lang:L;invalid?:boolean;onChange:(full:string,valid:boolean)=>void;className?:string;id?:string}){
 const [iso,setIso]=useState(guess),[local,setLocal]=useState('');
 const c=find(iso);
 const emit=(next:string,d:string)=>{
  const cc=find(next);
  onChange(cc?(d?'+'+cc.code+' '+fill(d,cc.mask):''):(d?'+'+d:''),cc?d.length===slots(cc.mask):d.length>=7&&d.length<=15);
 };
 const type=(raw:string)=>{
  let d=raw.replace(/\D/g,''),next=iso;
  if(raw.trim().startsWith('+')){
   const hit=[...countries].sort((a,b)=>b.code.length-a.code.length).find(x=>d.startsWith(x.code));
   if(hit){next=hit.code==='7'?(c?.code==='7'?iso:/^7[67]/.test(d)?'KZ':'RU'):hit.iso;d=d.slice(hit.code.length)}else next='';
  }else if(c){
   if(d.length>slots(c.mask)&&d.startsWith(c.code))d=d.slice(c.code.length);
   else if(c.code==='7'&&d.length===11&&d.startsWith('8'))d=d.slice(1);
  }
  const cc=find(next);d=d.slice(0,cc?slots(cc.mask):15);
  setIso(next);setLocal(d);emit(next,d);
 };
 const pick=(next:string)=>{const cc=find(next),d=cc?local.slice(0,slots(cc.mask)):local;setIso(next);setLocal(d);emit(next,d)};
 return <div className={'phone'+(className?' '+className:'')}>
  <span className={'phone-cc'+(invalid?' is-invalid':'')}>
   <span aria-hidden="true">{c?c.iso+' +'+c.code:'+'}</span>
   <select aria-label={label[lang]} value={iso} onChange={e=>pick(e.target.value)}>
    {countries.map(x=><option key={x.iso} value={x.iso}>{x.name[lang]} +{x.code}</option>)}
    <option value="">{other[lang]}</option>
   </select>
  </span>
  <input id={id} name="phone" type="tel" inputMode="tel" autoComplete="tel-national" required value={c?fill(local,c.mask):(local?'+'+local:'')} onChange={e=>type(e.target.value)} placeholder={c?c.ph:'+…'} aria-invalid={invalid} className={invalid?'is-invalid':''}/>
 </div>;
}
