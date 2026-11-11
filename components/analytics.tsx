'use client';
import {useEffect,useSyncExternalStore} from 'react';
import {pageHref} from '@/lib/base';
import type {Lang} from '@/lib/content';
import {isIntl} from '@/lib/market';
import {tracking} from '@/lib/tracking';
import {CLICK_KEYS,TTL_DAYS,type Attribution,type Touch} from '@/lib/lead-attribution.mjs';
import {waHref} from '@/lib/whatsapp';

// Analytics (GA4; Yandex Metrica on praxenai.ge only) loads straight away unless the visitor declined, on both sites
// (owner's decision, 24 October 2026). Until the visitor accepts cookies, GA4 runs with Google signals and ad
// personalisation off, and Meta Pixel and Google Ads do not load. Only the configured IDs load.
// Lead source: the first and the last visit with a source (UTM tags, ad click ids gclid/fbclid/yclid/msclkid, referrer,
// landing page) are kept for 90 days in this site's own storage and sent only with an enquiry to /api/leads
// (lib/lead-attribution.mjs), whatever the cookie choice: they are needed to handle the enquiry and go to no third party.
// yclid (Yandex Direct click id) lets the server report the lead to Metrica as an offline conversion (lib/metrika-offline.mjs);
// it goes first in the short source line because the lead keeps only its first 300 characters.
const utmKeys=['utm_source','utm_medium','utm_campaign','utm_content','utm_term'] as const;
const sourceKeys=['yclid',...utmKeys] as const;
const storeKey='praxen_source',campaignKey='praxen_campaign',consentKey='praxen_consent',consentEvent='praxen:consent';
const ttl=TTL_DAYS*864e5;
// Payment pages send the buyer back to the site; that return is not a new source.
const ownReturn=/(^|\.)flitt\.com$/;
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
 // Meta Pixel: a workshop sign-up is CompleteRegistration, Lead is a service enquiry only (forms, quiz, Cal.com booking),
 // and Contact is a click on WhatsApp, Telegram, phone or email, not on a call-to-action button.
 if(event==='generate_lead'){
  window.fbq?.('track',params.form==='webinar'?'CompleteRegistration':'Lead');
  if(adsOn&&tracking.ads&&tracking.adsLeadLabel)window.gtag?.('event','conversion',{send_to:tracking.ads+'/'+tracking.adsLeadLabel});
 }else if(event==='begin_checkout')window.fbq?.('track','InitiateCheckout',{value:params.value,currency:params.currency});
 else if(event==='purchase')window.fbq?.('track','Purchase',{value:params.value,currency:params.currency});
 else if(event==='phone_click'||event==='telegram_click'||event==='whatsapp_click'||event==='email_click')window.fbq?.('track','Contact');
}

type Stored={first?:Touch,last?:Touch};
// Kept in memory too, for browsers that block storage (the enquiry still gets this visit's source).
let memory:Stored={};
const fresh=(t:Touch|undefined)=>t&&typeof t.at==='number'&&Date.now()-t.at<ttl?t:undefined;
function readStored():Stored{
 try{const s=JSON.parse(localStorage.getItem(storeKey)||'{}') as Stored;return {first:fresh(s.first),last:fresh(s.last)}}catch{return {first:fresh(memory.first),last:fresh(memory.last)}}
}

// The last visit with a source as a short line, "yclid=123; utm_source=linkedin; utm_campaign=hotels-oct; ref=google.com",
// or '' when the visit is direct. Read by the server for Metrica (yclid) and the workshop deal fields (UTM).
export function getAttribution(){
 const t=readStored().last;
 if(!t)return '';
 const parts:string[]=sourceKeys.filter(k=>t[k]).map(k=>k+'='+t[k]!.slice(0,80));
 if(t.ref)parts.push('ref='+t.ref);
 return parts.join('; ');
}

const cookie=(name:string)=>{try{return document.cookie.split('; ').find(c=>c.startsWith(name+'='))?.slice(name.length+1)||''}catch{return ''}};
// Sent with every enquiry next to source: both visits, plus Meta's own _fbc/_fbp cookies when the pixel set them (after consent).
export function leadAttribution():Attribution{
 const s=readStored(),fbc=cookie('_fbc'),fbp=cookie('_fbp');
 return {...s,...(fbc?{fbc}:{}),...(fbp?{fbp}:{})};
}

function rememberAttribution(){
 try{
  const q=new URLSearchParams(location.search);
  const t:Touch={};
  for(const k of [...utmKeys,...CLICK_KEYS]){const v=q.get(k);if(v)t[k]=v.slice(0,k==='gclid'||k==='fbclid'?250:100)}
  const host=document.referrer?new URL(document.referrer).host:'';
  if(host&&host!==location.host&&!ownReturn.test(host))t.ref=host;
  const hasSource=Object.keys(t).length>0;
  t.landing=location.pathname.slice(0,200);t.at=Date.now();
  // The first visit stays for 90 days; the last is replaced by each visit that has a source (a direct visit keeps it).
  const s=readStored();
  memory={first:s.first||t,last:hasSource?t:s.last||t};
  localStorage.setItem(storeKey,JSON.stringify(memory));
  try{localStorage.removeItem('praxen_attribution');sessionStorage.removeItem('praxen_attribution')}catch{}
  if(t.utm_campaign)sessionStorage.setItem(campaignKey,t.utm_campaign.slice(0,60));
 }catch{}
}

// The ad campaign of this visit for the WhatsApp text: from the address, or from the page the visitor landed on in this tab.
const campaign=()=>{try{return new URLSearchParams(location.search).get('utm_campaign')||sessionStorage.getItem(campaignKey)||''}catch{return ''}};
// Completes a WhatsApp link with the text and the page code just before it opens (lib/whatsapp.ts). React may set a new
// address later (the calculator text changes); the original is kept so the code is never added twice.
function prepareWhatsApp(a:HTMLAnchorElement,lang:Lang){
 const cur=a.getAttribute('href')||'';
 const orig=cur===a.dataset.waOut&&a.dataset.waHref?a.dataset.waHref:cur;
 const out=waHref(orig,lang,location.pathname,campaign());
 a.dataset.waHref=orig;a.dataset.waOut=out;a.setAttribute('href',out);
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
   if(href.includes('wa.me/'))prepareWhatsApp(el as HTMLAnchorElement,lang);
   const section=el.closest('[data-screen-label]')?.getAttribute('data-screen-label')||(el.closest('header')?'Header':el.closest('footer')?'Footer':el.closest('.sticky-cta')?'Sticky':'');
   if(href.startsWith('tel:'))track('phone_click',{section});
   else if(href.includes('t.me/'))track('telegram_click',{section});
   else if(href.includes('wa.me/'))track('whatsapp_click',{section});
   else if(href.includes('cal.com/'))track('booking_click',{section});
   else if(href.startsWith('mailto:'))track('email_click',{section});
   else if(href==='#contact'||el.classList.contains('btn-primary'))track('cta_click',{label:label(el),section});
  };
  // Middle click, right click («open in new tab», «copy link»): the link is completed too, without an analytics event.
  const onOther=(e:MouseEvent)=>{const a=(e.target as Element|null)?.closest('a[href*="wa.me/"]');if(a)prepareWhatsApp(a as HTMLAnchorElement,lang)};
  document.addEventListener('click',onClick,{capture:true});
  document.addEventListener('auxclick',onOther,{capture:true});
  document.addEventListener('contextmenu',onOther,{capture:true});
  return()=>{document.removeEventListener('click',onClick,{capture:true});document.removeEventListener('auxclick',onOther,{capture:true});document.removeEventListener('contextmenu',onOther,{capture:true})};
 },[lang]);
 if(!anyTracking||consent!=='unset')return null;
 const [text,more,yes,no]=bannerCopy[lang];
 return (
  <div role="dialog" aria-live="polite" aria-label="Cookie" className="cookie">
   <p>{text} <a href={pageHref(lang,'privacy')}>{more}</a></p>
   <div className="cookie-btns"><button type="button" onClick={()=>setConsent('denied')} className="cookie-no">{no}</button><button type="button" onClick={()=>setConsent('granted')} className="cookie-yes">{yes}</button></div>
  </div>
 );
}
