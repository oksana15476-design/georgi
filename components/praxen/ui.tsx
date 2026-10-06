'use client';
import {useEffect,useId,useRef,useState,useSyncExternalStore} from 'react';
import type {LogoInfo} from '@/lib/logos';

export const reducedMotion=()=>typeof window!=='undefined'&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const motionQuery=()=>window.matchMedia('(prefers-reduced-motion: reduce)');
export const useReducedMotion=()=>useSyncExternalStore(cb=>{const q=motionQuery();q.addEventListener('change',cb);return()=>q.removeEventListener('change',cb)},()=>motionQuery().matches,()=>false);

export function scrollToId(id:string){
 const el=document.getElementById(id);if(!el)return;
 const top=el.getBoundingClientRect().top+window.scrollY-(window.innerWidth<=600?68:76);
 window.scrollTo({top,behavior:reducedMotion()?'auto':'smooth'});
}

export function Mark({size=1,dark=false}:{size?:number;dark?:boolean}){
 return <svg width={22*size} height={24*size} viewBox="0 0 22 24" aria-hidden="true" style={{display:'block'}}><rect x="0" y="0" width="8" height="24" fill={dark?'#ffffff':'#121a2b'}/><rect x="10" y="0" width="12" height="12" fill={dark?'#7b95ff':'#315bf5'}/></svg>;
}

export function Wordmark({dark=false}:{dark?:boolean}){
 return <><Mark dark={dark}/><span className="wordmark">praxen<span>ai</span></span></>;
}

export function Flag({code}:{code:'en'|'ka'|'ru'}){
 const id=useId().replace(/:/g,'');
 if(code==='ru')return <svg className="flag" viewBox="0 0 9 6" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="9" height="6" fill="#fff"/><rect y="2" width="9" height="2" fill="#0039a6"/><rect y="4" width="9" height="2" fill="#d52b1e"/></svg>;
 if(code==='ka')return <svg className="flag" viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="300" height="200" fill="#fff"/><path d="M130 0h40v200h-40zM0 80h300v40H0z" fill="#e8112d"/><path d="M58 22h14v14h14v14H72v14H58V50H44V36h14zM228 22h14v14h14v14h-14v14h-14V50h-14V36h14zM58 136h14v14h14v14H72v14H58v-14H44v-14h14zM228 136h14v14h14v14h-14v14h-14v-14h-14v-14h14z" fill="#e8112d"/></svg>;
 return <svg className="flag" viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><clipPath id={id}><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath><rect width="60" height="30" fill="#012169"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/><path d="M0,0 L60,30 M60,0 L0,30" clipPath={'url(#'+id+')'} stroke="#C8102E" strokeWidth="4"/><path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/><path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/></svg>;
}

// Vendor logo: tries each source in turn, then falls back to a coloured initials tile.
export function BrandLogo({info,size,tile,variant='inline'}:{info:LogoInfo;size:number;tile:number;variant?:'inline'|'overlay'}){
 const [idx,setIdx]=useState(0);
 const ref=useRef<HTMLImageElement>(null);
 const src=info.srcs[idx];
 useEffect(()=>{const im=ref.current;if(im&&im.complete&&im.naturalWidth===0&&src)setIdx(i=>i+1)},[src]);
 if(!src)return <span aria-hidden="true" className={'logo-mono '+variant} style={{width:tile,height:tile,background:info.mono,color:info.monoFg}}>{info.ini}</span>;
 // eslint-disable-next-line @next/next/no-img-element
 return <img key={src} ref={ref} src={src} alt="" width={size} height={size} loading="lazy" decoding="async" referrerPolicy="no-referrer" onError={()=>setIdx(i=>i+1)} style={{display:'block',width:size,height:size}}/>;
}

export function CountUp({to,suffix}:{to:number;suffix:string}){
 const ref=useRef<HTMLSpanElement>(null);const [v,setV]=useState(to);
 useEffect(()=>{
  const el=ref.current;if(!el||reducedMotion()||!('IntersectionObserver' in window))return;
  let raf=0;setV(0);
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;io.disconnect();const t0=performance.now();const f=(t:number)=>{const k=Math.min(1,(t-t0)/1400);setV(to*(1-Math.pow(1-k,3)));if(k<1)raf=requestAnimationFrame(f)};raf=requestAnimationFrame(f)}),{threshold:.4});
  io.observe(el);return()=>{io.disconnect();cancelAnimationFrame(raf)};
 },[to]);
 return <span ref={ref}>{Math.round(v)+suffix}</span>;
}

// Scroll reveal for [data-reveal] blocks, the process line ([data-reveal="line"]) and staggered grids ([data-stagger]).
// Hidden states only apply under html.js (set before paint) and without reduced motion, so content never stays hidden.
export function MotionRoot(){
 useEffect(()=>{
  const root=document.documentElement;
  if(reducedMotion()||!('IntersectionObserver' in window)){root.classList.add('motion-off');return}
  const inView=(el:Element)=>{const r=el.getBoundingClientRect();return r.top<innerHeight*.95&&r.bottom>0};
  const show=(el:Element)=>{
   if(el.hasAttribute('data-stagger'))Array.from(el.children).forEach((k,i)=>(k as HTMLElement).style.setProperty('--sd',i*70+'ms'));
   el.classList.add('in');io.unobserve(el);
  };
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)show(e.target)}),{threshold:.06});
  const seen=new WeakSet<Element>();
  const scan=()=>document.querySelectorAll('[data-reveal]:not(.in),[data-stagger]:not(.in)').forEach(el=>{if(seen.has(el))return;seen.add(el);if(inView(el))requestAnimationFrame(()=>show(el));else io.observe(el)});
  scan();
  const mo=new MutationObserver(scan);mo.observe(document.body,{childList:true,subtree:true});
  const fb=setTimeout(()=>document.querySelectorAll('[data-reveal]:not(.in),[data-stagger]:not(.in)').forEach(el=>{if(inView(el))show(el)}),1600);
  return()=>{io.disconnect();mo.disconnect();clearTimeout(fb)};
 },[]);
 return null;
}
