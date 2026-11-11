'use client';
import {useEffect} from 'react';

// Publishes how much of the bottom of the screen the cookie banner takes (--cookie-h on <html>), so the
// phone sticky bar and the WhatsApp button can sit just above it. Consent itself stays in analytics.tsx.
export function CookieOffset(){
 useEffect(()=>{
  const root=document.documentElement;
  let ro:ResizeObserver|undefined,seen:HTMLElement|null=null;
  // offsetHeight and the CSS bottom ignore the banner's fade-in transform.
  const measure=()=>{const el=seen;root.style.setProperty('--cookie-h',el?Math.round(el.offsetHeight+(parseFloat(getComputedStyle(el).bottom)||0))+'px':'0px')};
  const watch=()=>{
   const el=document.querySelector<HTMLElement>('body>.cookie');
   if(el!==seen){ro?.disconnect();seen=el;if(el&&'ResizeObserver' in window){ro=new ResizeObserver(measure);ro.observe(el)}}
   measure();
  };
  watch();
  const mo=new MutationObserver(watch);mo.observe(document.body,{childList:true});
  window.addEventListener('resize',measure);
  return()=>{mo.disconnect();ro?.disconnect();window.removeEventListener('resize',measure);root.style.removeProperty('--cookie-h')};
 },[]);
 return null;
}
