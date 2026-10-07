'use client';
import {useEffect} from 'react';
import {contacts} from '@/lib/contacts';
import {track} from '@/components/analytics';

type CalFn=((...args:unknown[])=>void)&{q?:unknown[];ns?:Record<string,CalFn>;loaded?:boolean};
declare global{interface Window{Cal?:CalFn}}

const ns='audit',origin='https://app.cal.com',calHost='https://cal.com/';
let ready=false,failed=false,lastBooking=0;

// Cal.com's official embed bootstrap (queues calls until embed.js loads), plus a load-error hook.
function bootstrap(onError:()=>void){
 if(window.Cal)return;
 const push=(api:CalFn,args:unknown)=>{api.q!.push(args)};
 const cal:CalFn=function(...args:unknown[]){
  const c=window.Cal!;
  if(!c.loaded){
   c.ns={};c.q=c.q||[];
   const s=document.createElement('script');s.src=origin+'/embed/embed.js';s.async=true;s.onerror=onError;document.head.appendChild(s);
   c.loaded=true;
  }
  if(args[0]==='init'){
   const api:CalFn=function(...a:unknown[]){push(api,a)};api.q=[];
   const name=args[1];
   if(typeof name==='string'){c.ns![name]=c.ns![name]||api;push(c.ns![name],args);push(c,['initNamespace',name])}
   else push(c,args);
   return;
  }
  push(c,args);
 };
 cal.q=[];window.Cal=cal;
}

// A completed booking is a lead: it reaches GA4, Metrica, Meta Pixel and Google Ads like the form.
function booked(){
 if(Date.now()-lastBooking<5000)return;
 lastBooking=Date.now();
 track('booking_complete',{page:location.pathname});
 track('generate_lead',{method:'booking',form:'calcom',page:location.pathname});
}

function setup(href:string){
 bootstrap(()=>{failed=true;location.assign(href)});
 const Cal=window.Cal!;
 Cal('init',ns,{origin});
 const api=Cal.ns![ns];
 api('ui',{theme:'light',layout:'month_view',hideEventTypeDetails:false,cssVarsPerTheme:{light:{'cal-brand':'#315bf5'},dark:{'cal-brand':'#315bf5'}}});
 api('on',{action:'bookingSuccessfulV2',callback:booked});
 api('on',{action:'bookingSuccessful',callback:booked});
 ready=true;
}

// Booking links open Cal.com in a popup on the site, so the visitor stays here and the booking
// itself is tracked. Ctrl/Cmd-click, a non-Cal booking link or a blocked embed script fall back
// to the normal link.
export function BookingEmbed(){
 useEffect(()=>{
  const href=contacts.booking;
  if(!href.startsWith(calHost))return;
  const calLink=href.slice(calHost.length);
  const onClick=(e:MouseEvent)=>{
   if(failed||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
   const a=(e.target as Element|null)?.closest('a');
   if(!a||a.getAttribute('href')!==href)return;
   e.preventDefault();
   if(!ready)setup(href);
   window.Cal!.ns![ns]('modal',{calLink,config:{layout:'month_view',theme:'light'}});
  };
  document.addEventListener('click',onClick);
  return()=>document.removeEventListener('click',onClick);
 },[]);
 return null;
}
