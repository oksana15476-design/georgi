'use client';
import {useEffect} from 'react';

// GA4 loads only when NEXT_PUBLIC_GA_ID is set. UTM tags and the referrer are kept for the session
// so outreach sources reach both GA4 and the lead message in Telegram.
const gaId=process.env.NEXT_PUBLIC_GA_ID||'';
const utmKeys=['utm_source','utm_medium','utm_campaign','utm_content','utm_term'];
const storeKey='praxis_attribution';

type Gtag=(...args:unknown[])=>void;
declare global{interface Window{dataLayer?:unknown[];gtag?:Gtag}}

export function track(event:string,params:Record<string,string|number|undefined>={}){
 if(typeof window!=='undefined'&&window.gtag)window.gtag('event',event,params);
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

const label=(el:Element)=>(el.textContent||el.getAttribute('aria-label')||'').trim().replace(/\s+/g,' ').slice(0,80);

export function Analytics(){
 useEffect(()=>{
  rememberAttribution();
  if(gaId&&!window.gtag){
   window.dataLayer=window.dataLayer||[];
   // gtag.js expects the Arguments object itself in the data layer, not an array.
   // eslint-disable-next-line prefer-rest-params
   window.gtag=function(){window.dataLayer!.push(arguments)};
   window.gtag('js',new Date());
   window.gtag('config',gaId);
   const s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(gaId);document.head.appendChild(s);
  }
  // Clicks on calls to action, phone and Telegram links anywhere on the page.
  const onClick=(e:MouseEvent)=>{
   const el=(e.target as Element|null)?.closest('a,button');if(!el)return;
   const href=el.getAttribute('href')||'';
   const section=el.closest('[data-screen-label],header,footer,.sticky-cta')?.getAttribute('data-screen-label')||(el.closest('header')?'Header':el.closest('footer')?'Footer':el.closest('.sticky-cta')?'Sticky':'');
   if(href.startsWith('tel:'))track('phone_click',{section});
   else if(href.includes('t.me/'))track('telegram_click',{section});
   else if(href==='#contact'||el.classList.contains('btn-primary'))track('cta_click',{label:label(el),section});
  };
  document.addEventListener('click',onClick,{capture:true});
  return()=>document.removeEventListener('click',onClick,{capture:true});
 },[]);
 return null;
}
