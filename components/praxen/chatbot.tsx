'use client';
// praxenai.ge commercial page «Чат-бот для бизнеса» (/ru/chatbot, /chatbot, /ka/chatbot; owner, 9 November 2026).
// Copy lives in lib/chatbot-page.ts; the layout reuses the inner-page blocks (hero, formats, process) and their CSS.
import {homeHref,pageHref} from '@/lib/base';
import {t} from '@/lib/content';
import {chatbotPage as p} from '@/lib/chatbot-page';
import {money,prices} from '@/lib/pricing';
import {Icon} from '@/components/praxen/icon';
import type {X} from '@/components/praxen/types';

const rd=(ms:number)=>({transitionDelay:ms+'ms'});

export const chatbotLabel=(x:X)=>x.c('Чат-бот для бизнеса','Chatbot for business','ჩატბოტი ბიზნესისთვის');

export function ChatbotPage({x}:{x:X}){
 const {c,s,lang}=x;const tr=(v:[string,string,string])=>t(v,lang);
 const label=chatbotLabel(x);
 const from=c('от ','from ','');
 const perMonth=c(' в месяц',' a month',' თვეში');
 return (<>
  <section data-screen-label="Chatbot hero" className="inner-hero">
   <div className="wrap inner-pad">
    <nav aria-label="Breadcrumb" className="crumbs"><a href={homeHref(lang)}>{s.home}</a><span aria-hidden="true">/</span><span aria-current="page">{label}</span></nav>
    <div className="inner-grid">
     <div className="min0 mw860">
      <h1 data-reveal="" className="inner-h1">{tr(p.h1)}</h1>
      <div data-reveal="" style={rd(140)} className="inner-lead"><p>{tr(p.lead)}</p><button type="button" onClick={()=>x.go(label)} className="btn btn-primary mt24">{tr(p.cta.button)}<Icon name="arrow-right" size={16}/></button></div>
     </div>
     <ul data-reveal="" style={rd(220)} className="facts">
      {p.channels.items.map(ch=><li key={ch.name[1]}><Icon name="message-circle" size={18}/><span>{tr(ch.name)}</span></li>)}
     </ul>
    </div>
   </div>
  </section>

  <section className="band-white">
   <div className="wrap sec">
    <div className="sec-head"><div data-reveal="" style={rd(80)}><h2 className="h2 mw820">{tr(p.channels.h)}</h2></div></div>
    <div className="formats-grid">
     {p.channels.items.map((ch,i)=><div key={ch.name[1]} data-reveal="" style={rd(i*90)}><article className="format">
      <h3>{tr(ch.name)}</h3>
      <p>{tr(ch.text)}</p>
     </article></div>)}
    </div>
   </div>
  </section>

  <section className="wrap sec">
   <div className="sec-head"><div data-reveal="" style={rd(80)}><h2 className="h2 mw820">{tr(p.abilities.h)}</h2></div></div>
   <ul className="cb-list">
    {p.abilities.items.map((a,i)=><li key={i} data-reveal="" style={rd(i*70)}><Icon name="check" size={18}/><span>{tr(a)}</span></li>)}
   </ul>
   <div data-reveal="" className="cb-note">
    <h3>{tr(p.handover.h)}</h3>
    <p>{tr(p.handover.text)}</p>
   </div>
  </section>

  <section data-screen-label="Chatbot steps" className="wrap sec">
   <div className="sec-head"><div data-reveal="" style={rd(80)}><h2 className="h2 mw820">{tr(p.steps.h)}</h2></div></div>
   <div data-reveal="line" aria-hidden="true" className="process-line"/>
   <ol className="process">
    {p.steps.items.map((st,i)=><li key={i}><div data-reveal="" style={rd(i*110)}>
     <span className="step-num">{'0'+(i+1)}</span>
     <h3>{tr(st.h)}</h3>
     <p>{tr(st.t)}</p>
    </div></li>)}
   </ol>
  </section>

  <section id="pricing" className="band-white">
   <div className="wrap sec">
    <div className="sec-head"><div data-reveal="" style={rd(80)}><h2 className="h2 mw820">{tr(p.pricing.h)}</h2></div></div>
    <div className="formats-grid">
     {p.pricing.rows.map((r,i)=><div key={r.price} data-reveal="" style={rd(i*100)}><article className="format">
      <h3>{tr(r.name)}</h3>
      <p className="cb-price">{lang==='ka'
       ?money(prices[r.price],'gel')+' ('+money(prices[r.price],'usd')+')'+(r.from?'-დან':'')+(r.monthly?perMonth:'')
       :(r.from?from:'')+money(prices[r.price],'gel')+' ('+money(prices[r.price],'usd')+')'+(r.monthly?perMonth:'')}</p>
      <p>{tr(r.what)}</p>
      <p className="format-time"><span>{s.timelineT}: <b>{tr(r.time)}</b></span></p>
      <button type="button" onClick={()=>x.go(label+': '+tr(r.name))} className="ulink mt-auto">{s.action}<Icon name="arrow-right" size={16}/></button>
     </article></div>)}
    </div>
    <p className="formats-note">{tr(p.pricing.note)}</p>
   </div>
  </section>

  <section className="wrap sec">
   <div className="sec-head"><div data-reveal="" style={rd(80)}><h2 className="h2 mw820">{c('Читайте также','Read next','ასევე წაიკითხეთ')}</h2></div></div>
   <ul className="cb-links">
    {p.links.map(l=><li key={l.href}><a href={pageHref(lang,l.href.replace(/^\//,''))} className="ulink">{tr(l.label)}<Icon name="arrow-right" size={16}/></a></li>)}
   </ul>
  </section>
 </>);
}
