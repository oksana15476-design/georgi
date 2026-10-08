'use client';
// praxenai.com shell: header with mega-menus, page composition, footer, mobile sticky bar.
// Layout and blocks follow the Claude Design handoff v4; pages are server-rendered in GBP and the
// visitor can switch the pricing block to $ or € (one currency per page, remembered on this device).
import {useCallback,useEffect,useRef,useState,useSyncExternalStore} from 'react';
import {contacts} from '@/lib/contacts';
import {posts} from '@/lib/intl-blog';
import {ctaFor,departments,entityOf,faqFor,industries,services,servicePath,type Cur,type IntlRoute} from '@/lib/intl';
import {BookingEmbed} from '@/components/booking';
import {MotionRoot,Wordmark,scrollToId} from '@/components/praxen/ui';
import {LeadPopup} from '@/components/praxen/lead-popup';
import type {X} from '@/components/praxen/types';
import {copyFn,type SiteCopy} from '@/lib/site-copy';
import {Icon} from './icon';
import {AboutStory,Article,AuditReport,BlogList,BookLink,Calculator,Cards,CaseDetails,TrainingPrice,Contact,Doc,Faq,Partners,Hero,InnerHero,IntlCtx,PilotPlan,Marquee,OneSystem,Pricing,Process,Quiz,ReceptionistPrice,Results,Scenarios,Security,ShortAnswer,SmallPerks,SmallPricing,SmallScenarios,SmallStrip,SolutionExamples,Team,Tabs,Tested,Trust,link} from './blocks';

type Drop='services'|'industries'|'departments';
// Six items: training sits in the Services menu and departments in the Industries menu.
const nav:[string,string,Drop?][]=[['services','Services','services'],['industries','Industries','industries'],['solutions','Pricing'],['cases','Cases'],['blog','Blog'],['about','About']];
const megaItems=(d:Drop)=>(d==='services'?services:d==='industries'?industries:departments).map(x=>({name:x.name,desc:x.desc,icon:x.icon,href:d==='services'?servicePath(x.slug):d+'/'+x.slug}));
const megaTitle:Record<Drop,string>={services:'Start with the job you need done',industries:'Find your business',departments:'Start with your department'};
const curKey='praxen_cur',curEvent='praxen:cur';
// The chosen currency is a per-device convenience; the server always renders GBP.
const readCur=():Cur=>{try{const v=localStorage.getItem(curKey);return v==='usd'||v==='eur'?v:'gbp'}catch{return 'gbp'}};
const subscribeCur=(cb:()=>void)=>{window.addEventListener(curEvent,cb);window.addEventListener('storage',cb);return()=>{window.removeEventListener(curEvent,cb);window.removeEventListener('storage',cb)}};
const storeCur=(c:Cur)=>{try{localStorage.setItem(curKey,c)}catch{}window.dispatchEvent(new Event(curEvent))};

function Header({route,open,setOpen}:{route:IntlRoute;open:boolean;setOpen:(v:boolean)=>void}){
 const [drop,setDrop]=useState<Drop|''>(''),[acc,setAcc]=useState<Drop|''>(''),[scrolled,setScrolled]=useState(false);
 const leave=useRef<ReturnType<typeof setTimeout>>(undefined);
 useEffect(()=>{const on=()=>setScrolled(window.scrollY>8);on();window.addEventListener('scroll',on,{passive:true});return()=>window.removeEventListener('scroll',on)},[]);
 useEffect(()=>{const k=(e:KeyboardEvent)=>{if(e.key==='Escape'){setDrop('');setOpen(false)}};document.addEventListener('keydown',k);return()=>document.removeEventListener('keydown',k)},[setOpen]);
 const act=route.page==='training'?'services':route.page==='departments'?'industries':route.page;
 const hover=(d:Drop|'')=>{clearTimeout(leave.current);if(window.matchMedia('(hover: hover)').matches)setDrop(d)};
 return (
  <header className={'site-header'+(scrolled||open?' is-scrolled':'')+(drop?' has-drop':'')} onMouseLeave={()=>{clearTimeout(leave.current);leave.current=setTimeout(()=>setDrop(''),160)}}>
   <div className="wrap header-row ix-header-row">
    <a href={link('')} aria-label="Praxen AI" className="brand"><Wordmark/></a>
    <nav aria-label="Main" className="desktop-nav ix-nav">
     {nav.map(([k,label,d])=><div key={k} className="nav-item" onMouseEnter={()=>hover(d||'')}>
      {d?<button type="button" onClick={()=>setDrop(drop===d?'':d)} aria-expanded={drop===d} aria-haspopup="true" className={'nav-link'+(drop===d?' is-open':'')+(act===k?' is-active':'')}>{label}<span className="chev"><Icon name="chevron-down" size={14}/></span></button>
       :<a href={link(k)} aria-current={act===k?'page':undefined} className={'nav-link'+(act===k?' is-active':'')}>{label}</a>}
     </div>)}
    </nav>
    <div className="header-actions">
     <BookLink className="btn btn-primary btn-sm header-cta">Book a free call</BookLink>
     <button type="button" onClick={()=>{setOpen(!open);setDrop('')}} aria-expanded={open} aria-label={open?'Close menu':'Open menu'} className="burger"><Icon name={open?'x':'menu'} size={22}/></button>
    </div>
   </div>
   {open&&<nav aria-label="Main" className="mobile-menu ix-mobile">
    {nav.map(([k,label,d])=><div key={k} className="ix-acc">
     {d?<><button type="button" onClick={()=>setAcc(acc===d?'':d)} aria-expanded={acc===d} className="ix-acc-btn">{label}<span className={'chev'+(acc===d?' is-up':'')}><Icon name="chevron-down" size={20}/></span></button>
      {acc===d&&<div className="ix-acc-items fade-in">{megaItems(d).map(m=><a key={m.href} href={link(m.href)}><span className="ix-acc-icon"><Icon name={m.icon} size={16}/></span>{m.name}</a>)}{d==='industries'&&<a href={link('departments')} className="ix-acc-all">By department<Icon name="arrow-right" size={15}/></a>}<a href={link(d)} className="ix-acc-all">View all<Icon name="arrow-right" size={15}/></a></div>}</>
      :<a href={link(k)} className="ix-acc-btn">{label}<Icon name="arrow-up-right" size={20}/></a>}
    </div>)}
    <a href={contacts.whatsapp} target="_blank" rel="noopener" className="mobile-phone"><Icon name="whatsapp" size={18}/>WhatsApp</a>
    <a href={'mailto:'+contacts.email} className="mobile-phone ix-mobile-mail"><Icon name="mail" size={18}/>{contacts.email}</a>
    <BookLink className="btn btn-primary btn-block">Book a free call</BookLink>
   </nav>}
   {drop&&<div className="mega"><div role="menu" className="mega-panel">
    <div className="mega-grid">{megaItems(drop).map(m=><a key={m.href} role="menuitem" href={link(m.href)} className="mega-item"><span className="mega-icon"><Icon name={m.icon} size={17}/></span><span className="mega-text"><b>{m.name}</b><span>{m.desc}</span></span></a>)}</div>
    <div className="mega-foot"><span>{megaTitle[drop]}</span><span className="ix-mega-links">{drop==='industries'&&<a href={link('departments')}>By department<Icon name="arrow-right" size={16}/></a>}<a href={link(drop)}>View all<Icon name="arrow-right" size={16}/></a></span></div>
   </div></div>}
  </header>
 );
}

function Footer(){
 const cols:[string,[string,string][]][]=[
  ['Services',services.map(x=>[x.name,servicePath(x.slug)])],
  ['Industries',industries.map(x=>[x.name,'industries/'+x.slug])],
  ['Company',[['Pricing','solutions'],['Small businesses','ai-for-small-business'],['Cases','cases'],['About','about'],['Blog','blog'],['Partners','partners']]],
 ];
 return (
  <footer className="footer">
   <div className="wrap footer-in">
    <div className="footer-grid">
     <div>
      <a href={link('')} aria-label="Praxen AI" className="brand brand-dark"><Wordmark dark/></a>
      <p className="footer-tag">Practical AI for real work.</p>
      <div className="ix-foot-contacts"><a href={contacts.whatsapp} target="_blank" rel="noopener">WhatsApp</a><a href={'mailto:'+contacts.email}>{contacts.email}</a></div>
      <BookLink className="btn btn-white">Book a free call<Icon name="arrow-right" size={16}/></BookLink>
     </div>
     {cols.map(([t,ls])=><div key={t}><h4 className="footer-h">{t}</h4>{ls.map(([l,h])=><a key={h} href={link(h)} className="footer-link">{l}</a>)}</div>)}
    </div>
    <div className="footer-bottom"><span>© 2026 Praxen AI · All prices exclude VAT</span><span className="ix-foot-legal"><a href={link('privacy')}>Privacy</a><a href={link('terms')}>Terms</a><a href={link('security')}>Security</a></span></div>
   </div>
  </footer>
 );
}

function Page({route}:{route:IntlRoute}){
 const e=entityOf(route);
 const {page}=route;
 const group=page==='training'?'services':page;
 if(page==='home')return <><Hero/><Marquee/><Results/><Quiz/><Pricing/><SmallStrip/><Trust/><AuditReport/><Team/></>;
 if(page==='ai-for-small-business')return <><Hero small/><SmallPerks/><SmallScenarios/><SmallPricing/></>;
 if(e)return <><InnerHero entity={e}/>{e.pricing&&<ReceptionistPrice/>}{e.slug==='ai-training'&&<TrainingPrice/>}<Scenarios entity={e} group={group}/>{e.slug==='ai-consultancy'&&<AuditReport variant="consultancy"/>}{e.slug!=='ai-training'&&<Tabs entity={e} group={group}/>}<Tested entity={e}/><PilotPlan entity={e} group={group}/><ShortAnswer entity={e}/></>;
 if(page==='cases')return <><InnerHero/><CaseDetails/></>;
 if(page==='services'||page==='industries'||page==='departments')return <><InnerHero/><Cards page={page}/>{page==='departments'&&<OneSystem/>}</>;
 if(page==='solutions')return <><InnerHero/><Pricing/><Calculator/><SolutionExamples/></>;
 if(page==='about')return <><InnerHero/><AboutStory/><Team variant="about"/><Process/></>;
 if(page==='security')return <><InnerHero/><Security/></>;
 if(page==='blog'){const post=posts.find(p=>p.slug===route.slug);return post?<Article post={post}/>:<><InnerHero/><BlogList/></>}
 if(page==='partners')return <><InnerHero/><Partners/></>;
 if(page==='privacy'||page==='terms')return <><InnerHero/><Doc page={page}/></>;
 return null;
}

export default function IntlSite({route}:{route:IntlRoute}){
 const stored=useSyncExternalStore(subscribeCur,readCur,()=>'gbp' as Cur);
 // Without storage (private mode) the switch still works for this page view.
 const [local,setLocal]=useState<Cur|null>(null);
 const cur=local||stored;
 const setCur=useCallback((c:Cur)=>{setLocal(c);storeCur(c)},[]);
 const [menu,setMenu]=useState(false),[sticky,setSticky]=useState(false);
 useEffect(()=>{const on=()=>setSticky(window.scrollY>480);on();window.addEventListener('scroll',on,{passive:true});return()=>window.removeEventListener('scroll',on)},[]);
 const toContact=useCallback((e?:React.MouseEvent)=>{e?.preventDefault();setMenu(false);setTimeout(()=>scrollToId('contact'),20)},[]);
 const e=entityOf(route);
 const [context,setContext]=useState('');
 const go=(topic:string)=>{setContext(topic);setMenu(false);setTimeout(()=>scrollToId('contact'),30)};
 // WhatsApp opens with a message that already names the page the visitor came from.
 const waText='Hello! I’m on your '+(e?e.name:route.page==='home'?'home':route.page.replace(/-/g,' '))+' page and would like to talk about AI for my business.';
 const wa=contacts.whatsapp+'?text='+encodeURIComponent(waText);
 // The exit and idle popup of praxenai.ge, with the same rules (once a session, never after contact).
 const popupX={lang:'en',c:copyFn('en'),s:{heroWhatsAppText:waText} as SiteCopy,link,go,toContact,data:{}} as X;
 const key=e?.slug||route.page;
 const cta=ctaFor(key);
 const docPage=route.page==='privacy'||route.page==='terms'||(route.page==='blog'&&!route.slug);
 const post=route.page==='blog'?posts.find(p=>p.slug===route.slug):undefined;
 const faq=post?{items:post.faq,title:'Questions on this topic.'}:faqFor(route,e,cur);
 return (
  <IntlCtx.Provider value={{route,cur,setCur,cta,painsKey:key,toContact,go,context,setContext,waText}}>
   <div className="site ix">
    <a href="#main" className="skip">Skip to content</a>
    <Header route={route} open={menu} setOpen={setMenu}/>
    <main id="main" tabIndex={-1}>
     <Page route={route}/>
     {!docPage&&<Faq items={faq.items} title={faq.title}/>}
     <Contact/>
    </main>
    <Footer/>
    <div className={'sticky-cta'+(sticky&&!menu?' is-shown':'')}>
     <a href="#contact" onClick={toContact} className="btn btn-primary">{cta}</a>
     <a href={wa} target="_blank" rel="noopener" aria-label="WhatsApp" className="sticky-icon sticky-wa"><Icon name="whatsapp" size={20}/></a>
     <a href={'mailto:'+contacts.email} aria-label={contacts.email} className="sticky-icon"><Icon name="mail" size={19}/></a>
    </div>
    <a href={wa} target="_blank" rel="noopener" aria-label="Message us on WhatsApp" className={'wa-float'+(sticky&&!menu?' is-shown':'')}><Icon name="whatsapp" size={26}/><span>Message us on WhatsApp</span></a>
    <LeadPopup x={popupX} menu={menu}/>
    <MotionRoot/>
    <BookingEmbed/>
   </div>
  </IntlCtx.Provider>
 );
}
