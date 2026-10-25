'use client';
import {useEffect,useSyncExternalStore} from 'react';
import {pageHref} from '@/lib/base';
import type {Lang} from '@/lib/content';
import {isIntl} from '@/lib/market';
import {tracking} from '@/lib/tracking';

// Analytics (GA4; Yandex Metrica on praxenai.ge only) loads straight away unless the visitor declined, on both sites
// (owner's decision, 24 October 2026). Until the visitor accepts cookies, GA4 runs with Google signals and ad
// personalisation off, and Meta Pixel and Google Ads do not load. Only the configured IDs load. UTM tags and the referrer are kept for the session so outreach sources reach
// both analytics and the lead message.
// yclid (Yandex Direct click id) lets the server report the lead to Metrica as an offline conversion (lib/metrika-offline.mjs);
// it goes first because the lead keeps only the first 300 characters of the attribution.
const utmKeys=['yclid','utm_source','utm_medium','utm_campaign','utm_content','utm_term'];
const storeKey='praxen_attribution',consentKey='praxen_consent',consentEvent='praxen:consent';
const anyTracking=!!(tracking.ga||tracking.ym||tracking.metaPixel||tracking.ads);
let adsOn=false;

type Fn=(...args:unknown[])=>void;
declare global{interface Window{dataLayer?:unknown[];gtag?:Fn;ym?:Fn&{a?:unknown[];l?:number};fbq?:Fn&{queue?:unknown[];loaded?:boolean;version?:string;callMethod?:Fn;push?:Fn}}}

export function track(event:string,params:Record<string,string|number|undefined>={}){
 if(typeof window==='undefined')return;
 if(readConsent()==='denied')return;
 window.gtag?.('event',event,params);
 // Visitors who started the form or reached out are not shown the lead popup again.
 if(event==='generate_lead'||event==='form_start'||event.startsWith('quiz_')||(event.endsWith('_click')&&event!=='cta_click'))try{sessionStorage.setItem('praxen_engaged','1')}catch{}
 // Metrica JavaScript-event goals (funnels in docs/ANALYTICS-GOALS.md). Workshop steps get their own ids, so the services
 // funnel (form_start → lead → booking_done) counts only service enquiries; "contact" matches every contact_* id.
 const ws=params.form==='webinar'||params.label==='webinar_register';
 const goal=event==='generate_lead'?(ws?'workshop_lead':'lead'):event==='form_start'?(ws?'workshop_form':'form_start'):event==='calculator_use'?'calculator':event==='quiz_start'||event==='quiz_complete'?event:event==='booking_complete'?'booking_done':event==='begin_checkout'?'checkout_start':event==='purchase'?'purchase':event==='cta_click'?(ws?'workshop_cta':'cta'):event.endsWith('_click')?'contact_'+event.slice(0,-6):'';
 // order_price makes Metrica count the payment as revenue (widget «Выручка после воркшопа»).
 if(tracking.ym&&goal)window.ym?.(Number(tracking.ym),'reachGoal',goal,event==='purchase'?{...params,order_price:params.value}:params);
 // A service enquiry also reaches its own goal: «Обучение команды · заявка» (lead_training) and so on.
 if(tracking.ym&&goal==='lead'&&params.service)window.ym?.(Number(tracking.ym),'reachGoal','lead_'+params.service,params);
 if(event==='generate_lead'){
  window.fbq?.('track','Lead');
  if(adsOn&&tracking.ads&&tracking.adsLeadLabel)window.gtag?.('event','conversion',{send_to:tracking.ads+'/'+tracking.adsLeadLabel});
 }else if(event==='begin_checkout')window.fbq?.('track','InitiateCheckout',{value:params.value,currency:params.currency});
 else if(event==='purchase')window.fbq?.('track','Purchase',{value:params.value,currency:params.currency});
 else if(event==='cta_click'||event==='phone_click'||event==='telegram_click'||event==='whatsapp_click'||event==='booking_click'||event==='email_click')window.fbq?.('track','Contact');
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

// ads=false: analytics only (GA4, Metrica); ads=true: also Google Ads and Meta Pixel.
function loadTrackers(ads:boolean){
 const withAds=ads&&!!tracking.ads&&!adsOn;
 if((tracking.ga||withAds)&&!window.gtag){
  window.dataLayer=window.dataLayer||[];
  // gtag.js expects the Arguments object itself in the data layer, not an array.
  // eslint-disable-next-line prefer-rest-params
  window.gtag=function(){window.dataLayer!.push(arguments)};
  window.gtag('js',new Date());
  if(tracking.ga)window.gtag('config',tracking.ga,ads?{}:{allow_google_signals:false,allow_ad_personalization_signals:false});
  loadScript('https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(tracking.ga||tracking.ads));
 }
 if(ads&&!adsOn&&tracking.ga)window.gtag!('set',{allow_google_signals:true,allow_ad_personalization_signals:true});
 if(withAds)window.gtag!('config',tracking.ads);
 if(ads)adsOn=true;
 if(tracking.ym&&!window.ym){
  // Standard Metrica bootstrap: queue calls until tag.js loads.
  // eslint-disable-next-line prefer-rest-params
  const ym=Object.assign(function(){(ym.a=ym.a||[]).push(arguments)},{l:Date.now()}) as NonNullable<Window['ym']>;
  window.ym=ym;
  loadScript('https://mc.yandex.ru/metrika/tag.js');
  ym(Number(tracking.ym),'init',{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});
 }
 if(ads&&tracking.metaPixel&&!window.fbq){
  // Standard Meta Pixel bootstrap: queue calls until fbevents.js loads.
  const q:unknown[]=[];
  const fbq=Object.assign((...args:unknown[])=>{if(fbq.callMethod)fbq.callMethod(...args);else q.push(args)},{queue:q,loaded:true,version:'2.0'}) as NonNullable<Window['fbq']>;
  fbq.push=fbq;window.fbq=fbq;
  loadScript('https://connect.facebook.net/en_US/fbevents.js');
  fbq('init',tracking.metaPixel);fbq('track','PageView');
 }
}

const label=(el:Element)=>(el.textContent||el.getAttribute('aria-label')||'').trim().replace(/\s+/g,' ').slice(0,80);

// Analytics already runs; the banner asks about advertising cookies and lets the visitor turn everything off.
const bannerCopy={
 ru:['Мы используем Яндекс Метрику и Google Analytics, чтобы понимать, какие страницы полезны. Рекламные cookie загружаются только с вашего согласия.','Подробнее','Принять','Отклонить'],
 en:isIntl?['We use Google Analytics to learn which pages are useful. Advertising cookies load only with your consent.','Learn more','Accept','Decline']
  :['We use Yandex Metrica and Google Analytics to learn which pages are useful. Advertising cookies load only with your consent.','Learn more','Accept','Decline'],
 ka:['ვიყენებთ Yandex Metrica-სა და Google Analytics-ს, რომ გავიგოთ, რომელი გვერდებია სასარგებლო. სარეკლამო cookie-ები მხოლოდ თქვენი თანხმობით იტვირთება.','დეტალურად','თანხმობა','უარი'],
};

export function Analytics({lang}:{lang:Lang}){
 const consent=useConsent();
 useEffect(()=>{rememberAttribution()},[]);
 useEffect(()=>{
  // Declined after analytics had started: GA4 stops at once (track() also stops sending events); the next page load starts nothing.
  if(tracking.ga)(window as unknown as Record<string,boolean>)['ga-disable-'+tracking.ga]=consent==='denied';
  if(consent==='granted')loadTrackers(true);
  else if(consent==='unset')loadTrackers(false);
 },[consent]);
 useEffect(()=>{
  // Clicks on calls to action, phone, Telegram, WhatsApp and booking links anywhere on the page.
  const onClick=(e:MouseEvent)=>{
   const el=(e.target as Element|null)?.closest('a,button');if(!el)return;
   const href=el.getAttribute('href')||'';
   const section=el.closest('[data-screen-label]')?.getAttribute('data-screen-label')||(el.closest('header')?'Header':el.closest('footer')?'Footer':el.closest('.sticky-cta')?'Sticky':'');
   if(href.startsWith('tel:'))track('phone_click',{section});
   else if(href.includes('t.me/'))track('telegram_click',{section});
   else if(href.includes('wa.me/'))track('whatsapp_click',{section});
   else if(href.includes('cal.com/'))track('booking_click',{section});
   else if(href.startsWith('mailto:'))track('email_click',{section});
   else if(href==='#contact'||el.classList.contains('btn-primary'))track('cta_click',{label:label(el),section});
  };
  document.addEventListener('click',onClick,{capture:true});
  return()=>document.removeEventListener('click',onClick,{capture:true});
 },[]);
 if(!anyTracking||consent!=='unset')return null;
 const [text,more,yes,no]=bannerCopy[lang];
 return (
  <div role="dialog" aria-live="polite" aria-label="Cookie" className="cookie">
   <p>{text} <a href={pageHref(lang,'privacy')}>{more}</a></p>
   <div className="cookie-btns"><button type="button" onClick={()=>setConsent('denied')} className="cookie-no">{no}</button><button type="button" onClick={()=>setConsent('granted')} className="cookie-yes">{yes}</button></div>
  </div>
 );
}
