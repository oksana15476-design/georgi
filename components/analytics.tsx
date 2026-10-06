'use client';
import {useEffect,useSyncExternalStore} from 'react';
import {base} from '@/lib/base';
import type {Lang} from '@/lib/content';
import {tracking} from '@/lib/tracking';

// GA4, Meta Pixel and Google Ads load only after the visitor accepts cookies, and only for the IDs
// that are configured. UTM tags and the referrer are kept for the session so outreach sources reach
// both analytics and the lead message.
const utmKeys=['utm_source','utm_medium','utm_campaign','utm_content','utm_term'];
const storeKey='praxis_attribution',consentKey='praxis_consent',consentEvent='praxis:consent';
const anyTracking=!!(tracking.ga||tracking.metaPixel||tracking.ads);

type Fn=(...args:unknown[])=>void;
declare global{interface Window{dataLayer?:unknown[];gtag?:Fn;fbq?:Fn&{queue?:unknown[];loaded?:boolean;version?:string;callMethod?:Fn;push?:Fn}}}

export function track(event:string,params:Record<string,string|number|undefined>={}){
 if(typeof window==='undefined')return;
 window.gtag?.('event',event,params);
 if(event==='generate_lead'){
  window.fbq?.('track','Lead');
  if(tracking.ads&&tracking.adsLeadLabel)window.gtag?.('event','conversion',{send_to:tracking.ads+'/'+tracking.adsLeadLabel});
 }else if(event==='cta_click'||event==='phone_click'||event==='telegram_click'||event==='whatsapp_click')window.fbq?.('track','Contact');
}

// "utm_source=linkedin; utm_campaign=hotels-oct; ref=google.com" or '' when the visit is direct.
export function getAttribution(){
 try{return sessionStorage.getItem(storeKey)||''}catch{return ''}
}

function rememberAttribution(){
 try{
  if(sessionStorage.getItem(storeKey))return;
  const q=new URLSearchParams(location.search);
  const parts=utmKeys.filter(k=>q.get(k)).map(k=>k+'='+q.get(k)!.slice(0,80));
  const ref=document.referrer&&new URL(document.referrer).host!==location.host?new URL(document.referrer).host:'';
  if(ref)parts.push('ref='+ref);
  if(parts.length)sessionStorage.setItem(storeKey,parts.join('; '));
 }catch{}
}

type Consent='granted'|'denied'|'unset'|'server';
const readConsent=():Consent=>{try{const v=localStorage.getItem(consentKey);return v==='granted'||v==='denied'?v:'unset'}catch{return 'unset'}};
export function setConsent(v:'granted'|'denied'|'unset'){
 try{if(v==='unset')localStorage.removeItem(consentKey);else localStorage.setItem(consentKey,v)}catch{}
 window.dispatchEvent(new Event(consentEvent));
}
const subscribe=(cb:()=>void)=>{window.addEventListener(consentEvent,cb);window.addEventListener('storage',cb);return()=>{window.removeEventListener(consentEvent,cb);window.removeEventListener('storage',cb)}};
const useConsent=()=>useSyncExternalStore(subscribe,readConsent,():Consent=>'server');

function loadScript(src:string){const s=document.createElement('script');s.async=true;s.src=src;document.head.appendChild(s)}

function loadTrackers(){
 if((tracking.ga||tracking.ads)&&!window.gtag){
  window.dataLayer=window.dataLayer||[];
  // gtag.js expects the Arguments object itself in the data layer, not an array.
  // eslint-disable-next-line prefer-rest-params
  window.gtag=function(){window.dataLayer!.push(arguments)};
  window.gtag('js',new Date());
  if(tracking.ga)window.gtag('config',tracking.ga);
  if(tracking.ads)window.gtag('config',tracking.ads);
  loadScript('https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(tracking.ga||tracking.ads));
 }
 if(tracking.metaPixel&&!window.fbq){
  // Standard Meta Pixel bootstrap: queue calls until fbevents.js loads.
  const q:unknown[]=[];
  const fbq=Object.assign((...args:unknown[])=>{if(fbq.callMethod)fbq.callMethod(...args);else q.push(args)},{queue:q,loaded:true,version:'2.0'}) as NonNullable<Window['fbq']>;
  fbq.push=fbq;window.fbq=fbq;
  loadScript('https://connect.facebook.net/en_US/fbevents.js');
  fbq('init',tracking.metaPixel);fbq('track','PageView');
 }
}

const label=(el:Element)=>(el.textContent||el.getAttribute('aria-label')||'').trim().replace(/\s+/g,' ').slice(0,80);

const bannerCopy={
 ru:['Мы используем cookie для аналитики и рекламы, чтобы понимать, какие страницы полезны. Без вашего согласия они не загружаются.','Подробнее','Принять','Отклонить'],
 en:['We use cookies for analytics and advertising to learn which pages are useful. Nothing loads without your consent.','Learn more','Accept','Decline'],
 ka:['ანალიტიკისა და რეკლამისთვის ვიყენებთ cookie-ებს, რომ გავიგოთ, რომელი გვერდებია სასარგებლო. თქვენი თანხმობის გარეშე ისინი არ იტვირთება.','დეტალურად','თანხმობა','უარი'],
};

export function Analytics({lang}:{lang:Lang}){
 const consent=useConsent();
 useEffect(()=>{rememberAttribution()},[]);
 useEffect(()=>{if(consent==='granted')loadTrackers()},[consent]);
 useEffect(()=>{
  // Clicks on calls to action, phone, Telegram and WhatsApp links anywhere on the page.
  const onClick=(e:MouseEvent)=>{
   const el=(e.target as Element|null)?.closest('a,button');if(!el)return;
   const href=el.getAttribute('href')||'';
   const section=el.closest('[data-screen-label]')?.getAttribute('data-screen-label')||(el.closest('header')?'Header':el.closest('footer')?'Footer':el.closest('.sticky-cta')?'Sticky':'');
   if(href.startsWith('tel:'))track('phone_click',{section});
   else if(href.includes('t.me/'))track('telegram_click',{section});
   else if(href.includes('wa.me/'))track('whatsapp_click',{section});
   else if(href==='#contact'||el.classList.contains('btn-primary'))track('cta_click',{label:label(el),section});
  };
  document.addEventListener('click',onClick,{capture:true});
  return()=>document.removeEventListener('click',onClick,{capture:true});
 },[]);
 if(!anyTracking||consent!=='unset')return null;
 const [text,more,yes,no]=bannerCopy[lang];
 return (
  <div role="dialog" aria-live="polite" aria-label="Cookie" className="cookie">
   <p>{text} <a href={base+'/'+lang+'/privacy'}>{more}</a></p>
   <div className="cookie-btns"><button type="button" onClick={()=>setConsent('denied')} className="cookie-no">{no}</button><button type="button" onClick={()=>setConsent('granted')} className="cookie-yes">{yes}</button></div>
  </div>
 );
}
