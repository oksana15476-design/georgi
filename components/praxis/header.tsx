'use client';
import {useEffect,useRef,useState} from 'react';
import {base} from '@/lib/base';
import {departments,industries,t,Lang} from '@/lib/content';
import {contacts} from '@/lib/contacts';
import {C,sectionLabel,SiteCopy} from '@/lib/site-copy';
import {Icon} from './icon';
import {Flag,Wordmark} from './ui';

export const deptIcon:Record<string,string>={sales:'shopping-cart',marketing:'megaphone',hr:'users',finance:'calculator',procurement:'truck',leadership:'briefcase',support:'message-square',operations:'workflow'};
export const industryIcon:Record<string,string>={retail:'shopping-bag',wholesale:'boxes',hotels:'bed-double',tourism:'map','real-estate':'home',developers:'building-2',restaurants:'utensils',clinics:'stethoscope',logistics:'truck',manufacturing:'factory',services:'briefcase',education:'graduation-cap'};

type Props={lang:Lang;c:C;s:SiteCopy;page:string;rest:string;toContact:(e?:React.MouseEvent)=>void;menu:boolean;setMenu:(v:boolean|((m:boolean)=>boolean))=>void};

export function Header({lang,c,s,page,rest,toContact,menu,setMenu}:Props){
 const [drop,setDrop]=useState('');const [scrolled,setScrolled]=useState(false);
 const leave=useRef<ReturnType<typeof setTimeout>>(undefined);
 // Long labels (Georgian especially) can outgrow the row before the 1240px breakpoint; switch to the burger then.
 const row=useRef<HTMLDivElement>(null),need=useRef(0);const [compact,setCompact]=useState(false);
 useEffect(()=>{
  const el=row.current;if(!el)return;
  const check=()=>{
   if(!el.classList.contains('is-compact')&&el.scrollWidth>el.clientWidth+1){need.current=el.scrollWidth;setCompact(true)}
   else if(el.classList.contains('is-compact')&&el.clientWidth>=need.current)setCompact(false);
  };
  const ro=new ResizeObserver(check);ro.observe(el);document.fonts?.ready.then(check);
  return()=>ro.disconnect();
 },[]);
 const root=base+'/'+lang,link=(x:string)=>root+'/'+x;
 useEffect(()=>{
  const onScroll=()=>setScrolled(window.scrollY>8);onScroll();
  const onKey=(e:KeyboardEvent)=>{if(e.key==='Escape'){setDrop('');setMenu(false)}};
  window.addEventListener('scroll',onScroll,{passive:true});document.addEventListener('keydown',onKey);
  return()=>{window.removeEventListener('scroll',onScroll);document.removeEventListener('keydown',onKey);clearTimeout(leave.current)};
 },[setMenu]);
 const hover=(k:string)=>{clearTimeout(leave.current);if(window.matchMedia('(hover: hover)').matches)setDrop(k)};
 const nav=['solutions','departments','industries','training','cases'];
 const dropList=drop==='industries'?industries:departments;
 const langs:[Lang,string][]=[['en','EN'],['ka','GE'],['ru','RU']];
 const action=s.actionHeader;
 return (
  <header className={'site-header'+(scrolled||menu?' is-scrolled':'')+(drop?' has-drop':'')} onMouseLeave={()=>{clearTimeout(leave.current);leave.current=setTimeout(()=>setDrop(''),160)}}>
   <div ref={row} className={'wrap header-row'+(compact?' is-compact':'')}>
    <a href={root} aria-label="Praxis AI" className="brand">
     <Wordmark/>
    </a>
    <nav aria-label={s.mainNav} className="desktop-nav">
     {nav.map(k=>{
      const isDrop=k==='industries'||k==='departments',active=page===k||drop===k;
      return <div key={k} className="nav-item" onMouseEnter={()=>hover(isDrop?k:'')}>
       {isDrop
        ?<button type="button" onClick={()=>setDrop(d=>d===k?'':k)} aria-expanded={drop===k} aria-haspopup="true" className={'nav-link'+(active?' is-active':'')+(drop===k?' is-open':'')}>{sectionLabel(c,k)}<span className="chev"><Icon name="chevron-down" size={15}/></span></button>
        :<a href={link(k)} aria-current={page===k?'page':undefined} className={'nav-link'+(active?' is-active':'')}>{sectionLabel(c,k)}</a>}
      </div>;
     })}
    </nav>
    <div className="header-actions">
     <a href={'tel:'+contacts.phone} aria-label={contacts.phoneLabel} className="header-phone"><Icon name="phone" size={17}/></a>
     <div role="group" aria-label={s.langLabel} className="langs">
      {langs.map(([code,lb])=><a key={code} href={base+'/'+code+rest} lang={code} hrefLang={code} aria-current={code===lang?'true':undefined} className={code===lang?'is-current':''}><Flag code={code}/>{lb}</a>)}
     </div>
     <a href="#contact" onClick={toContact} className="btn btn-primary btn-sm header-cta">{action}</a>
     <button type="button" onClick={()=>{setMenu(m=>!m);setDrop('')}} aria-expanded={menu} aria-label={menu?s.closeMenu:s.openMenu} className="burger"><Icon name={menu?'x':'menu'} size={22}/></button>
    </div>
   </div>

   {menu&&<nav aria-label={s.mainNav} className="mobile-menu">
    {nav.map(k=><a key={k} href={link(k)} className={page===k?'is-active':''}>{sectionLabel(c,k)}<Icon name="arrow-up-right" size={20}/></a>)}
    <a href={'tel:'+contacts.phone} className="mobile-phone"><Icon name="phone" size={18}/>{contacts.phoneLabel}</a>
    <a href={contacts.whatsapp} target="_blank" rel="noopener" className="mobile-phone"><Icon name="whatsapp" size={18}/>WhatsApp</a>
    <a href="#contact" onClick={toContact} className="btn btn-primary btn-block">{s.action}</a>
   </nav>}

   {drop&&<div className="mega">
    <div role="menu" className="mega-panel">
     <div className="mega-grid">
      {dropList.map(x=><a key={x.slug} role="menuitem" href={link(drop+'/'+x.slug)} className="mega-item">
       <span className="mega-icon"><Icon name={(drop==='industries'?industryIcon:deptIcon)[x.slug]||'layers'} size={17}/></span>
       <span className="mega-text"><b>{t(x.name,lang)}</b><span>{t('promise' in x?x.promise:x.job,lang)}</span></span>
      </a>)}
     </div>
     <div className="mega-foot">
      <span>{drop==='industries'?c('Найдите свой бизнес','Find your business','იპოვეთ თქვენი ბიზნესი'):c('Начните с задач отдела','Start with your department','დაიწყეთ განყოფილების ამოცანებით')}</span>
      <a href={link(drop)}>{s.viewAll}<Icon name="arrow-right" size={16}/></a>
     </div>
    </div>
   </div>}
  </header>
 );
}
