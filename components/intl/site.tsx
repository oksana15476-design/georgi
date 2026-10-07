'use client';
import {useCallback,useEffect,useState} from 'react';
import {base,homeHref,pageHref} from '@/lib/base';
import {contacts} from '@/lib/contacts';
import {copyFn,siteCopy} from '@/lib/site-copy';
import {offers,gbp,promo,usageNote,type IntlPage} from '@/lib/intl';
import {pageJsonLd} from '@/lib/seo';
import {BookingEmbed} from '@/components/booking';
import {Contact,Faq} from '@/components/praxen/contact';
import {Icon} from '@/components/praxen/icon';
import {LeadPopup} from '@/components/praxen/lead-popup';
import {MotionRoot,Wordmark,scrollToId} from '@/components/praxen/ui';
import type {X} from '@/components/praxen/types';

const rd=(ms:number)=>({'--rd':ms+'ms'} as React.CSSProperties);
const offer=(k:string)=>offers.find(o=>o.key===k)!;
const rec=offer('receptionist');

// Price with the launch offer: the regular price struck through, then the offer price.
function Price({value,monthly,big}:{value:number;monthly?:boolean;big?:boolean}){
 return <span className={'ix-price'+(big?' ix-price-big':'')}><s>{gbp(value)}</s> <b>{gbp(promo(value))}</b>{monthly&&<small>/month</small>}</span>;
}
function BookButton({label='Book a free 30-minute call',ghost}:{label?:string;ghost?:boolean}){
 return <a href={contacts.booking} target="_blank" rel="noopener" className={'btn '+(ghost?'btn-ghost':'btn-primary')}><Icon name="calendar" size={17}/>{label}</a>;
}
function OfferBadge(){
 return <p className="ix-badge"><Icon name="sparkles" size={15}/>Launch offer: 30% off for our first UK clients</p>;
}

const faqHome:[string,string][]=[
 ['What does Praxen AI do?','Praxen AI sets up AI receptionists and AI automation for small and mid-sized businesses: a voice agent that answers calls and books appointments, chat and WhatsApp assistants, CRM and document automation, and team training. Every project starts with a free 30-minute call and a fixed-price pilot.'],
 ['How much does an AI receptionist cost?',`Setup from ${gbp(rec.setup!)} and from ${gbp(rec.price)} a month; with the launch offer, ${gbp(promo(rec.setup!))} and ${gbp(promo(rec.price))} a month. ${usageNote}`],
 ['Where are you based?','Our team is based in Georgia (UTC+4, three to four hours ahead of the UK) and works remotely with clients in the UK and Europe. Calls and support run during UK business hours.'],
 ['Is it GDPR compliant?','We design every solution for UK GDPR: data stays in your accounts, callers are told when calls are recorded, access is limited to what the workflow needs and you can delete data on request. We sign a data processing agreement before launch.'],
 ['Can we keep our phone number?','Yes. You forward calls from your existing number to the AI receptionist — always, after hours, or when the line is busy — so nothing changes for your customers.'],
 ['What if the AI cannot answer?','It takes a message, books a callback or transfers the call to a person, depending on the rules you set. You get a summary of every call by email or in your CRM.'],
];
const faqReceptionist:[string,string][]=[
 ['Does it sound like a robot?','Modern voice agents sound natural, handle interruptions and speak in a British-English voice. We tune the script and voice on your real calls before launch.'],
 ['What can it do on a call?','Answer questions about your services, prices, opening hours and location; book, move or cancel appointments; take messages; qualify new enquiries; and transfer urgent calls to your team.'],
 ['Which calendars and systems does it connect to?','Google Calendar, Microsoft Outlook and common booking tools, plus CRMs such as HubSpot and Pipedrive. Other systems are connected through their API or tools like Zapier and Make.'],
 ['How long does setup take?','About two weeks: one week to build and train the agent on your services, one week of testing on real calls with your team.'],
 ['What does it cost to run?',usageNote+' A typical three-minute call costs well under 50p.'],
 ['Is there a contract?','The setup is a one-off fee. The monthly plan runs month to month — cancel anytime.'],
];

const industries:[string,string,string][]=[
 ['calculator','Accounting firms','Client questions, document requests and appointment booking without tying up your team.'],
 ['users','Recruitment agencies','Candidate screening calls, interview scheduling and follow-ups at any hour.'],
 ['scale','Law firms','New-enquiry intake, conflict-check details and consultation booking.'],
 ['home','Estate agents','Viewing bookings, applicant qualification and landlord enquiries 24/7.'],
 ['stethoscope','Clinics and dental practices','Appointment booking, reminders and answers to routine questions.'],
 ['wrench','Trades and home services','Never miss a job enquiry while you are on site: quotes, callbacks and bookings.'],
];

function Hero({x,page}:{x:X;page:IntlPage}){
 const receptionist=page==='ai-receptionist';
 return (
  <section className="hero">
   <div aria-hidden="true" className="hero-glow"/>
   <div className="wrap">
    <div className="min0 ix-hero">
     <OfferBadge/>
     <h1 data-reveal="" className="h1">{receptionist?'An AI receptionist that answers every call, 24/7.':'AI receptionist and AI automation for UK small businesses.'}</h1>
     <div data-reveal="" style={rd(120)} className="hero-lead">
      <p>{receptionist
       ?'It answers questions, books appointments into your calendar, takes messages and sends you a summary of every call — so no customer reaches voicemail again.'
       :'Answer every call, book appointments and follow up on leads automatically. We set it up in 2–4 weeks at a fixed price — you keep the accounts and the data.'}</p>
      <div className="btn-row"><BookButton/><a href={receptionist?'#pricing':pageHref(x.lang,'pricing')} className="btn btn-ghost">See pricing<Icon name="arrow-right" size={16}/></a></div>
     </div>
     <div data-reveal="" style={rd(220)} className="proof-mini">
      <span><b>24/7</b>calls, chat and WhatsApp answered</span>
      <span><b>2–4 wks</b>from first call to launch</span>
      <span><b>{gbp(promo(rec.price))}</b>a month for an AI receptionist with the launch offer</span>
     </div>
    </div>
   </div>
  </section>
 );
}

function Services({x}:{x:X}){
 const items:[string,string,string,string][]=[
  ['phone-call','AI receptionist','Answers calls, books appointments, takes messages and qualifies leads around the clock.','ai-receptionist'],
  ['message-square','Chat and WhatsApp assistants','Answers customers on your website and WhatsApp from your own knowledge base and hands over to staff.','pricing'],
  ['workflow','Workflow automation','Updates your CRM, processes documents and invoices, and drafts replies — fewer manual hand-offs.','pricing'],
  ['graduation-cap','Team training','Practical sessions so your staff use AI safely and productively in their daily work.','pricing'],
 ];
 return (
  <section className="wrap sec">
   <div className="sec-head"><div data-reveal=""><h2 className="h2 mw820">What we set up.</h2><p className="lead">Start with one workflow that costs you time or customers today. Add the next once it pays back.</p></div></div>
   <div className="ix-grid ix-grid-4" data-stagger="">
    {items.map(([icon,t,d,href])=><a key={t} href={pageHref(x.lang,href)} className="ix-card">
     <span className="tile-icon"><Icon name={icon} size={19}/></span><b>{t}</b><span>{d}</span><span className="ix-more">Learn more<Icon name="arrow-right" size={15}/></span>
    </a>)}
   </div>
  </section>
 );
}

function Steps(){
 const steps:[string,string][]=[
  ['Free 30-minute call','We look at your calls, enquiries and workflows and pick the one with the clearest payback.'],
  ['Fixed-price pilot','We build and test it on your real data in 2–4 weeks. Price and success metric agreed upfront.'],
  ['Launch and handover','Your team gets onboarding and simple rules. The solution runs on your accounts.'],
  ['Optional ongoing care','We monitor, update and improve it monthly — or you run it yourselves.'],
 ];
 return (
  <section className="band-soft"><div className="wrap sec">
   <div className="sec-head"><div data-reveal=""><h2 className="h2 mw820">How it works.</h2></div></div>
   <ol className="ix-steps" data-stagger="">{steps.map(([t,d],i)=><li key={t}><span>{i+1}</span><b>{t}</b><p>{d}</p></li>)}</ol>
  </div></section>
 );
}

function Industries(){
 return (
  <section className="wrap sec">
   <div className="sec-head"><div data-reveal=""><h2 className="h2 mw820">Built for businesses that live on the phone.</h2><p className="lead">The same approach works in any service business; these are the ones we focus on.</p></div></div>
   <div className="ix-grid ix-grid-3" data-stagger="">
    {industries.map(([icon,t,d])=><div key={t} className="ix-card ix-card-flat"><span className="tile-icon"><Icon name={icon} size={19}/></span><b>{t}</b><span>{d}</span></div>)}
   </div>
  </section>
 );
}

function PricingCards({x,full}:{x:X;full?:boolean}){
 const list=full?offers:[offer('receptionist'),offer('implementation'),offer('training')];
 return (
  <section id="pricing" className={full?'wrap sec':'band-soft'}><div className={full?'':'wrap sec'}>
   {!full&&<div className="sec-head"><div data-reveal=""><h2 className="h2 mw820">Clear prices in GBP.</h2><p className="lead">Fixed before we start. The launch offer takes 30% off for our first UK clients.</p></div></div>}
   <div className={'ix-grid '+(full?'ix-grid-3':'ix-grid-3')} data-stagger="">
    {list.map(o=><article key={o.key} className={'ix-plan'+(o.key==='receptionist'?' is-featured':'')}>
     {o.key==='receptionist'&&<span className="popular ix-plan-badge">Most popular</span>}
     <h3>{o.name}</h3>
     {o.setup?<p className="ix-plan-price"><small>Setup from</small> <Price value={o.setup}/><br/><small>then from</small> <Price value={o.price} monthly/></p>
      :<p className="ix-plan-price"><small>From</small> <Price value={o.price} monthly={o.monthly}/>{o.unit&&<small className="ix-unit">{o.unit}</small>}</p>}
     <p className="ix-plan-body">{o.body}</p>
     {full&&<ul className="ix-list">{o.includes.map(i=><li key={i}><Icon name="check" size={15}/>{i}</li>)}</ul>}
     <p className="ix-plan-time"><Icon name="clock" size={15}/>{o.time}</p>
     <button type="button" onClick={()=>x.go(o.name)} className="ulink ix-plan-cta">Get a quote<Icon name="arrow-right" size={16}/></button>
    </article>)}
   </div>
   <p className="ix-note"><Icon name="info" size={15}/>{usageNote} Prices exclude any applicable taxes.</p>
   {!full&&<p className="ix-note"><a href={pageHref(x.lang,'pricing')} className="ulink">All prices and what’s included<Icon name="arrow-right" size={15}/></a></p>}
  </div></section>
 );
}

function ReceptionistDetail(){
 const does:[string,string,string][]=[
  ['phone-incoming','Answers every call','Day, night and weekends — or only after hours and when the line is busy.'],
  ['calendar-check','Books appointments','Checks availability and books, moves or cancels appointments in your calendar.'],
  ['filter','Qualifies new enquiries','Asks your questions, captures contact details and flags hot leads.'],
  ['mail','Sends call summaries','A short summary of every call by email or straight into your CRM.'],
  ['phone-forwarded','Transfers urgent calls','Rules you set decide when a call goes to a person.'],
  ['message-square','Follows up by text','Optional SMS or WhatsApp confirmations and reminders.'],
 ];
 return (
  <section className="wrap sec">
   <div className="sec-head"><div data-reveal=""><h2 className="h2 mw820">What your AI receptionist does.</h2><p className="lead">Trained on your services, prices and FAQs. You stay in control of what it says and when it hands over.</p></div></div>
   <div className="ix-grid ix-grid-3" data-stagger="">
    {does.map(([icon,t,d])=><div key={t} className="ix-card ix-card-flat"><span className="tile-icon"><Icon name={icon} size={19}/></span><b>{t}</b><span>{d}</span></div>)}
   </div>
  </section>
 );
}

function Founder(){
 return (
  <section className="wrap sec">
   <div className="sec-head"><div data-reveal=""><h2 className="h2 mw820">Who builds it.</h2><p className="lead">You work with the person responsible for the result — not a call centre.</p></div></div>
   <article data-reveal="" className="founder">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={base+'/team/evgeny.jpg'} alt="Evgeny Budnikov" width={400} height={400} loading="lazy" decoding="async" className="founder-photo"/>
    <div className="founder-body">
     <span className="over">Founder, Praxen AI</span>
     <h3>Evgeny Budnikov</h3>
     <p className="founder-bio">Makes sure AI pays for itself: maps your workflows, estimates the effect in hours and pounds, and leads the project from the first call to launch.</p>
     <div className="founder-foot">
      <a href={'mailto:'+contacts.email} className="ulink"><Icon name="mail" size={15}/>{contacts.email}</a>
      <a href={contacts.whatsapp} target="_blank" rel="noopener" className="ulink"><Icon name="whatsapp" size={15}/>WhatsApp</a>
     </div>
    </div>
   </article>
  </section>
 );
}

function Privacy(){
 const blocks:[string,string[]][]=[
  ['Who we are',[`Praxen AI is an AI implementation company based in Georgia. For any question about your data, email ${contacts.email}.`]],
  ['What data we collect',['From the enquiry form: your contact details (email, phone or WhatsApp), the options you choose, your message, the page you sent it from and the traffic source (such as UTM tags).','When you book a call: your name, email and the time you choose, handled by Cal.com.','With your consent only: anonymous usage data — pages viewed, device and clicks — through Google Analytics and the Meta Pixel.']],
  ['Why and on what basis',['To reply to your enquiry and prepare a proposal — steps taken at your request before a contract (UK GDPR Art. 6(1)(b)).','To understand which pages and channels are useful — your consent (Art. 6(1)(a)), which you can withdraw at any time in the cookie settings.']],
  ['Who receives it',['Enquiries reach us by email and Telegram and may be stored in our CRM. Call bookings are handled by Cal.com. Analytics providers (Google, Meta) receive data only after your consent. We never sell personal data.','Our team and some providers are outside the UK. Where data leaves the UK, we rely on the safeguards the UK GDPR provides, such as the International Data Transfer Agreement or adequacy regulations.']],
  ['How long we keep it',['Enquiry data is kept for up to 3 years after our last contact, or until you ask us to delete it.']],
  ['Your rights',[`You can ask for a copy of your data, correct or delete it, object to or restrict its use, and withdraw consent. Email ${contacts.email}; we reply within one month. You can also complain to the Information Commissioner’s Office (ico.org.uk).`]],
 ];
 return (
  <section className="wrap sec ix-privacy">
   <h1 className="h2">Privacy policy</h1>
   <p className="lead">Last updated: 7 October 2026.</p>
   {blocks.map(([h,ps])=><section key={h}><h2>{h}</h2>{ps.map(p=><p key={p}>{p}</p>)}</section>)}
  </section>
 );
}

export default function IntlSite({page}:{page:IntlPage}){
 const lang='en';
 const c=copyFn(lang);
 const base0=siteCopy(c);
 const s={...base0,
  contactH2:'Tell us where you lose time or customers.',
  contactP:'Pick what you need and how we should reach you. We reply within one UK business day with next steps and an estimate.',
  location:'Remote · UK business hours',
  whatTakes:'What do you need?',
  invalidText:'Please check your contact: a valid email, or a phone number with the country code.',
  faqSub:'Short answers on price, setup, data protection and how we work. Anything else — ask on the free call.',
  heroWhatsAppText:'Hello! I would like to discuss an AI receptionist / AI automation for my business.',
 };
 const [context,setContext]=useState(''),[menu,setMenu]=useState(false),[sticky,setSticky]=useState(false);
 useEffect(()=>{const on=()=>setSticky(window.scrollY>480);on();window.addEventListener('scroll',on,{passive:true});return()=>window.removeEventListener('scroll',on)},[]);
 const toContact=useCallback((e?:React.MouseEvent)=>{e?.preventDefault();setMenu(false);setTimeout(()=>scrollToId('contact'),20)},[]);
 const go=(v:string)=>{setContext(v);setMenu(false);setTimeout(()=>scrollToId('contact'),30)};
 const x:X={lang,c,s,link:p=>pageHref(lang,p),go,toContact,data:{}};
 const nav:[string,string][]=[['ai-receptionist','AI receptionist'],['pricing','Pricing']];
 const options=['AI receptionist','Chat / WhatsApp assistant','Workflow automation','Team training',s.other];
 const faq=page==='ai-receptionist'?faqReceptionist:faqHome;
 const path=page==='home'?'':'/'+page;
 const names:Record<IntlPage,string>={home:'Home','ai-receptionist':'AI receptionist',pricing:'Pricing',privacy:'Privacy policy'};
 const jsonLd=pageJsonLd({lang,path,faq:page==='privacy'?[]:faq,crumbs:[['Home',''],...(page==='home'?[]:[[names[page],path] as [string,string]])],
  service:page==='ai-receptionist'?{name:'AI receptionist',description:'AI voice agent that answers calls 24/7, books appointments, takes messages and sends call summaries.',path}:undefined});

 return (
  <div className="site">
   <MotionRoot/>
   <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonLd).replace(/</g,'\\u003c')}}/>
   <header className="site-header">
    <div className="wrap header-row">
     <a href={homeHref(lang)} className="brand"><Wordmark/></a>
     <nav aria-label="Main" className="desktop-nav">{nav.map(([k,l])=><div key={k} className="nav-item"><a href={pageHref(lang,k)} aria-current={page===k?'page':undefined} className={'nav-link'+(page===k?' is-active':'')}>{l}</a></div>)}</nav>
     <div className="header-actions">
      <a href={'mailto:'+contacts.email} aria-label={contacts.email} className="header-phone"><Icon name="mail" size={17}/></a>
      <a href={contacts.booking} target="_blank" rel="noopener" className="btn btn-primary btn-sm header-cta">Book a free call</a>
      <button type="button" onClick={()=>setMenu(m=>!m)} aria-expanded={menu} aria-label={menu?'Close menu':'Open menu'} className="burger"><Icon name={menu?'x':'menu'} size={22}/></button>
     </div>
    </div>
    {menu&&<nav aria-label="Main" className="mobile-menu">
     {nav.map(([k,l])=><a key={k} href={pageHref(lang,k)} className={page===k?'is-active':''}>{l}<Icon name="arrow-up-right" size={20}/></a>)}
     <a href={'mailto:'+contacts.email} className="mobile-phone"><Icon name="mail" size={18}/>{contacts.email}</a>
     <a href={contacts.whatsapp} target="_blank" rel="noopener" className="mobile-phone"><Icon name="whatsapp" size={18}/>WhatsApp</a>
     <a href="#contact" onClick={toContact} className="btn btn-primary btn-block">Get a quote</a>
    </nav>}
   </header>

   <main id="main" tabIndex={-1}>
    {page==='privacy'?<Privacy/>:<>
     {page==='pricing'
      ?<section className="hero ix-hero-short"><div className="wrap"><OfferBadge/><h1 className="h1">Pricing.</h1><div className="hero-lead"><p>Fixed prices in GBP, agreed before we start. The solution runs on your accounts, so you only pay providers for what you use.</p></div></div></section>
      :<Hero x={x} page={page}/>}
     {page==='home'&&<><Services x={x}/><Steps/><Industries/><PricingCards x={x}/><Founder/></>}
     {page==='ai-receptionist'&&<><ReceptionistDetail/><Steps/><PricingCards x={x} full={false}/><Industries/></>}
     {page==='pricing'&&<><PricingCards x={x} full/><Steps/></>}
     <Faq x={x} items={faq} title={page==='ai-receptionist'?'AI receptionist questions.':'Before our first call.'}/>
     <Contact x={x} options={options} context={context} setContext={setContext}/>
    </>}
   </main>

   <footer className="footer">
    <div className="wrap footer-in">
     <div className="footer-grid">
      <div className="footer-brand">
       <a href={homeHref(lang)} className="brand brand-dark"><Wordmark dark/></a>
       <p className="footer-tag">Practical AI for real work.</p>
       <p className="footer-about">AI receptionists and AI automation for small and mid-sized businesses in the UK and Europe.</p>
       <div className="footer-contacts"><a href={'mailto:'+contacts.email} className="footer-phone"><Icon name="mail" size={16}/>{contacts.email}</a><a href={contacts.whatsapp} target="_blank" rel="noopener" className="footer-phone"><Icon name="whatsapp" size={16}/>WhatsApp</a></div>
       <a href={contacts.booking} target="_blank" rel="noopener" className="btn btn-white">Book a free call<Icon name="arrow-right" size={16}/></a>
      </div>
      <div><h2 className="footer-h">Services</h2>
       <a href={pageHref(lang,'ai-receptionist')} className="footer-link">AI receptionist</a>
       <a href={pageHref(lang,'pricing')} className="footer-link">Pricing</a>
       <a href="#contact" onClick={toContact} className="footer-link">Get a quote</a>
      </div>
     </div>
     <div className="footer-bottom">
      <span>© 2026 Praxen AI · <a href={pageHref(lang,'privacy')} className="footer-privacy">Privacy</a></span><span>AI receptionist · automation · training</span>
     </div>
    </div>
   </footer>

   <div className={'sticky-cta'+(sticky?' is-shown':'')}>
    <a href={contacts.booking} target="_blank" rel="noopener" className="btn btn-primary">Book a free call</a>
    <a href={contacts.whatsapp+'?text='+encodeURIComponent(s.heroWhatsAppText)} target="_blank" rel="noopener" aria-label="WhatsApp" className="sticky-icon sticky-wa"><Icon name="whatsapp" size={20}/></a>
    <a href={'mailto:'+contacts.email} aria-label={contacts.email} className="sticky-icon"><Icon name="mail" size={19}/></a>
   </div>
   <a href={contacts.whatsapp+'?text='+encodeURIComponent(s.heroWhatsAppText)} target="_blank" rel="noopener" aria-label="Message on WhatsApp" className={'wa-float'+(sticky?' is-shown':'')}><Icon name="whatsapp" size={26}/><span>Message on WhatsApp</span></a>
   {page!=='privacy'&&<LeadPopup x={x} menu={menu}/>}
   <BookingEmbed/>
  </div>
 );
}
