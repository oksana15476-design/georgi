'use client';
// praxenai.com sections, built from the Claude Design handoff v4 on the praxenai.ge design system.
import {createContext,useContext,useRef,useState} from 'react';
import {getAttribution,track} from '@/components/analytics';
import {base,homeHref,pageHref} from '@/lib/base';
import {contacts} from '@/lib/contacts';
import {partnerSteps,partnerWho,smallLimit,smallPerks,smallScenarios,smallScene,curInfo,curs,departments,examples,fmt,industries,innerPages,intlUpdatedLabel,logoSets,defaultLogoSet,logos,micro,pains,price,promo,sectionName,services,servicePath,tariffs,usageNote,vatNote,offers,type Cur,type Entity,type IntlRoute,type ListPage} from '@/lib/intl';
import {posts,type Post} from '@/lib/intl-blog';
import {Icon} from './icon';
import {Scene} from './scene';

// Page context: currency (switched in the pricing block, one currency per page), the page CTA and links.
// go(topic) scrolls to the form with the topic shown above it and sent with the enquiry; waText pre-fills WhatsApp.
export type Ctx={route:IntlRoute;cur:Cur;setCur:(c:Cur)=>void;cta:string;painsKey:string;toContact:(e?:React.MouseEvent)=>void;go:(topic:string)=>void;context:string;setContext:(v:string)=>void;waText:string};
export const IntlCtx=createContext<Ctx>(null!);
export const useIx=()=>useContext(IntlCtx);
export const link=(p:string)=>p?pageHref('en',p):homeHref('en');
const rd=(ms:number)=>({'--rd':ms+'ms'} as React.CSSProperties);
type Pair=[string,string];

// The free call opens the Cal.com popup (components/booking.tsx intercepts this exact link).
export function BookLink({className,children}:{className?:string;children:React.ReactNode}){
 return <a href={contacts.booking} target="_blank" rel="noopener" className={className}>{children}</a>;
}
function Cta({label,className='btn btn-primary'}:{label?:string;className?:string}){
 const {cta,toContact}=useIx();
 return <a href="#contact" onClick={toContact} className={className}>{label||cta}<Icon name="arrow-right" size={16}/></a>;
}
// The launch offer is a plain line of text under the call to action, not a badge.
function Offer(){return <p className="ix-offer">Launch offer: 30% off all prices.</p>}
function Logo({name,size=22}:{name:string;size?:number}){
 const f=logos.find(l=>l[0]===name)?.[1];
 const [bad,setBad]=useState(!f);
 if(bad)return <span aria-hidden="true" className="logo-mono" style={{width:size,height:size,background:name==='Pipedrive'?'#1a1a1a':'#315bf5',color:'#fff'}}>{name.split(/\s+/).map(w=>w[0]).join('').slice(0,2)}</span>;
 // eslint-disable-next-line @next/next/no-img-element
 return <img src={base+'/logos/'+f} alt="" width={size} height={size} loading="lazy" decoding="async" onError={()=>setBad(true)} style={{display:'block',width:size,height:size,borderRadius:4}}/>;
}
// Card text with two sentences: the first (the key benefit) in bold, the rest plain.
const splitB=(t:string)=>{const i=t.search(/[.:] /);return i>8&&i<t.length-6?[t.slice(0,i+1),t.slice(i+1)]:['',t];};


// UK numbers: 07… becomes +44 7…, grouped as +44 7700 900 123; other countries keep their code.
export const formatContact=(v:string,method:string)=>{
 if(method==='email')return v.trim();
 let d=v.replace(/\D/g,'');
 if(d.startsWith('0'))d='44'+d.slice(1);
 if(d.startsWith('44')){const r=d.slice(2,12);return '+44'+(r?' '+r.slice(0,4):'')+(r.length>4?' '+r.slice(4,7):'')+(r.length>7?' '+r.slice(7,10):'')}
 return (v.trim().startsWith('+')||d.length>10?'+':'')+d.slice(0,15);
};
export const validContact=(v:string,method:string)=>{const d=v.replace(/\D/g,'');return method==='email'?/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v):d.length>=10&&d.length<=15};
async function sendLead(body:Record<string,unknown>){
 const r=await fetch(base+'/api/leads',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({lang:'en',page:location.pathname,source:getAttribution(),...body})});
 if(!r.ok)throw new Error();
}

// ---------- Home ----------
export function Hero({small}:{small?:boolean}){
 const {cur}=useIx();
 const h=small
  ?{eyebrow:'AI for small businesses',h1:'You run the business.',h1b:'AI takes the calls and the admin.',sub:'An AI receptionist, WhatsApp replies and paperwork on autopilot for teams of '+smallLimit+'. Starter terms: setup in three payments, no long contract and the first month of care free.',proof:[['3 payments','for the setup fee'],['No lock-in','cancel with 30 days’ notice'],['Free','first month of care']]}
  :{eyebrow:'Practical AI for business',h1:'Every call answered. Every enquiry logged.',h1b:'Without hiring more staff.',sub:'AI receptionists, chatbots and automations that answer, book and fill in your CRM, for a single office or a team across several sites.',proof:[['24/7','calls and messages answered'],['2 weeks','to a live AI receptionist'],[fmt(promo(price('rcMonth',cur)),cur)+'/mo','launch price, AI receptionist']]};
 return (
  <section data-screen-label="Hero" className="wrap hero">
   <div aria-hidden="true" className="hero-glow"/>
   <div className="hero-grid">
    <div className="min0">
     <p data-reveal="" className="hero-eyebrow">{h.eyebrow}</p>
     <h1 data-reveal="" style={rd(60)} className="h1 ix-hero-h1">{h.h1} <span className="ix-accent">{h.h1b}</span></h1>
     <div data-reveal="" style={rd(180)}>
      <p className="ix-hero-sub">{h.sub}</p>
      <div className="btn-row mt28"><Cta/><a href={small?'#pricing':link('solutions')} className="btn btn-ghost">See pricing</a></div>
      <Offer/>
     </div>
     <div data-reveal="" style={rd(260)} className="proof-mini">{h.proof.map(([n,l])=><span key={l}><b>{n}</b>{l}</span>)}</div>
    </div>
    <div className="min0"><div data-reveal="" style={rd(120)} className="ix-scene-box">{small?<Scene type="chat" data={smallScene}/>:<Scene type="call"/>}</div></div>
   </div>
  </section>
 );
}

export function Marquee(){
 const items=[...logos,...logos];
 return (
  <section aria-label="Integrations" className="marquee-band">
   <div className="wrap marquee-row">
    <p className="marquee-label">Works with your tools</p>
    <div className="marquee-mask"><div className="marquee-track">
     {items.map(([n],i)=><span key={i} aria-hidden={i>=logos.length?'true':undefined} className="marquee-item ix-marquee-item"><Logo name={n}/>{n}</span>)}
    </div></div>
   </div>
   <p className="wrap marquee-note">Potential solution components. We check fit and integration availability for your workflow. Names do not imply partnerships.</p>
  </section>
 );
}

export function Results(){
 return (
  <section data-screen-label="Results" className="band-soft">
   <div className="wrap sec">
    <div data-reveal="" className="sec-head"><div><h2 className="h2 mw820">What changes in a normal week.</h2><p className="lead lead-muted">Three typical scenarios with the numbers we track. Figures are estimates; we measure your real ones in the pilot. We publish client results only with their permission.</p></div></div>
    <div className="grid-c3w" data-stagger="">
     {examples.map(r=><a key={r.href} href={link(r.href)} className="card ix-card-lift ix-example">
      <span className="over">{r.over} · Example</span>
      <h3>{r.title}</h3>
      <p>{r.body}</p>
      <div className="ix-nums">{r.nums.map(([n,l])=><div key={l}><b>{n}</b><span>{l}</span></div>)}</div>
      <span className="ulink mt-auto">See the scenario<Icon name="arrow-right" size={16}/></span>
     </a>)}
    </div>
   </div>
  </section>
 );
}

const quizQ:[string,string[]][]=[['What does your company do?',['Accounting firm','Recruitment agency','Law firm','Hotel or restaurant','Clinic or dental practice','Trades or other services']],['Where do most enquiries arrive?',['Phone calls','Website chat or WhatsApp','Email and PDFs','Mostly internal work']],['How big is the team?',['1–5 people','6–20 people','21–100 people','100+ people']],['What would help most?',['Answer every enquiry','Stop retyping data','Train the team','Not sure yet']]];
export function Quiz(){
 const {cur}=useIx();
 const [qa,setQa]=useState<number[]>([]);
 const qn=qa.length,done=qn>=4;
 const pick=(i:number)=>{if(!qn)track('quiz_start');const next=[...qa,i];setQa(next);if(next.length===4)track('quiz_complete',{industry:quizQ[0][1][next[0]],channel:quizQ[1][1][next[1]]})};
 let res:{name:string;why:string;format:string;was:string;now:string;time:string}|null=null;
 if(done){
  const ch=qa[1],goal=qa[3];
  const [name,key,format,time,why]:[string,'training'|'rcMonth'|'pilot',string,string,string]=goal===2?['AI training','training','Team training','from 1 week','Your team gets a playbook of prompts and rules built on its own tasks.']
   :ch===0?['AI receptionist','rcMonth','AI receptionist','2 weeks','Most of your enquiries arrive by phone. An AI receptionist answers every call and books straight into your calendar.']
   :ch===1?['AI chatbot','pilot','Implementation pilot','2–4 weeks','Replies on your website and WhatsApp in seconds, from your own price list and FAQs.']
   :ch===2?['AI automation','pilot','Implementation pilot','2–4 weeks','Emails and PDFs are read and entered into your systems, ready for a person to approve.']
   :['AI consultancy','pilot','Implementation pilot','2–4 weeks','We start with a short audit and rank your processes by payback before building anything.'];
  const per=key==='rcMonth'?'/mo':'';
  res={name:name+' for your '+quizQ[0][1][qa[0]].toLowerCase().replace(' or other services',' business'),why,format,was:fmt(price(key,cur),cur)+per,now:fmt(promo(price(key,cur)),cur)+per,time};
 }
 const q=quizQ[Math.min(qn,3)];
 return (
  <section data-screen-label="Quiz" className="wrap sec ix-split">
   <div data-reveal=""><h2 className="h2">Where should you start with AI?</h2><p className="lead mw460">Answer 4 questions to see your first scenario, format and price. It takes a minute.</p>
    <ul className="quiz-gets">{['A scenario for your industry','Format and price from our tariffs','Instant result, contact only if you want'].map(b=><li key={b}><Icon name="check" size={16}/>{b}</li>)}</ul></div>
   <div className="ix-panel">
    {!done?<div key={qn} className="fade-in">
     <div className="ix-quiz-top"><small>Question {qn+1} of 4</small><span>{[0,1,2,3].map(i=><i key={i} className={i<=qn?'is-on':''}/>)}</span></div>
     <h3 className="ix-quiz-q">{q[0]}</h3>
     <div className="quiz-options">{q[1].map((o,i)=><button key={o} type="button" onClick={()=>pick(i)} className="quiz-option">{o}<Icon name="arrow-right" size={15}/></button>)}</div>
     {qn>0&&<button type="button" onClick={()=>setQa(qa.slice(0,-1))} className="ix-textbtn mt14">← Back</button>}
    </div>:<div className="fade-in">
     <small className="ix-kick">Your first scenario</small>
     <h3 className="ix-quiz-res">{res!.name}</h3>
     <p className="ix-p">{res!.why}</p>
     <div className="ix-res-row">
      <span>Format<b>{res!.format}</b></span>
      <span>Launch price<b><s>{res!.was}</s>{res!.now}</b></span>
      <span>Timeline<b>{res!.time}</b></span>
     </div>
     <QuizCapture summary={res!.name+'. '+quizQ.map(([q,o],i)=>q+' '+o[qa[i]]).join(' ')} onRestart={()=>setQa([])}/>
    </div>}
   </div>
  </section>
 );
}


// The quiz result asks for one contact, like the quiz on praxenai.ge; the answers go with the enquiry.
function QuizCapture({summary,onRestart}:{summary:string;onRestart:()=>void}){
 const {route}=useIx();
 const [method,setMethod]=useState<'whatsapp'|'email'>('whatsapp'),[contact,setContact]=useState(''),[website,setWebsite]=useState('');
 const [status,setStatus]=useState<''|'invalid'|'error'>(''),[sending,setSending]=useState(false),[done,setDone]=useState(false);
 const submit=async(e:React.FormEvent)=>{
  e.preventDefault();if(sending)return;
  if(!validContact(contact,method)){setStatus('invalid');track('form_error',{reason:'invalid_contact',form:'quiz'});return}
  setSending(true);setStatus('');
  try{await sendLead({contact:method+': '+contact,message:'Quiz: '+summary,context:'praxenai.com · quiz · '+(route.slug||route.page),website});setDone(true);track('generate_lead',{method,form:'quiz',page:location.pathname})}
  catch{setStatus('error');track('form_error',{reason:'send_failed',form:'quiz'})}
  finally{setSending(false)}
 };
 if(done)return <div role="status" className="quiz-done"><span className="done-icon"><Icon name="check" size={22}/></span><div><b>Thanks, we’ve got it.</b><p>We’ll reply within one working day with the plan and a price for your business.</p></div></div>;
 return (
  <form onSubmit={submit} noValidate className="quiz-form">
   <b>Get this plan with your numbers. Where should we send it?</b>
   <div role="radiogroup" aria-label="How should we reply?" className="methods">{([['whatsapp','WhatsApp'],['email','Email']] as const).map(([k,lb])=><button key={k} type="button" role="radio" aria-checked={method===k} onClick={()=>{setMethod(k);setContact('');setStatus('')}} className={method===k?'is-on':''}>{lb}</button>)}</div>
   <div className="quiz-row">
    <input name="contact" value={contact} onChange={e=>{setStatus('');setContact(formatContact(e.target.value,method))}} aria-label={method==='email'?'Your email':'Your WhatsApp number'} placeholder={method==='email'?'name@company.co.uk':'+44 7700 900 123'} inputMode={method==='email'?'email':'tel'} autoComplete={method==='email'?'email':'tel'} aria-invalid={status==='invalid'} className={status==='invalid'?'is-invalid':''}/>
    <button type="submit" disabled={sending} className="btn btn-primary">{sending?'Sending…':'Send'}<Icon name="arrow-right" size={16}/></button>
   </div>
   <input name="website" tabIndex={-1} aria-hidden="true" autoComplete="off" value={website} onChange={e=>setWebsite(e.target.value)} className="hp"/>
   {status&&<p role="alert" className="form-status"><Icon name="alert-circle" size={16}/>{status==='invalid'?(method==='email'?'Please check the email address.':'Please enter a full number, e.g. +44 7700 900 123.'):'Something went wrong. Please message us on WhatsApp.'}</p>}
   <div className="quiz-alt"><BookLink className="ulink">Or book a free call<Icon name="calendar-check" size={16}/></BookLink><button type="button" onClick={onRestart} className="ix-textbtn">Start again</button></div>
  </form>
 );
}

// ---------- Pricing ----------
export function CurSwitch(){
 const {cur,setCur}=useIx();
 return <div role="group" aria-label="Currency" className="ix-cur">{curs.map(k=><button key={k} type="button" onClick={()=>setCur(k)} aria-pressed={cur===k} className={cur===k?'is-on':''}>{curInfo[k].sym} {curInfo[k].label}</button>)}</div>;
}
export function Pricing(){
 const {cur,go}=useIx();
 const [open,setOpen]=useState<string[]>([]);
 const card=(t:typeof tariffs[number])=>{
  const on=open.includes(t.key),per=t.monthly?'/mo':'';
  return <article key={t.key} className={'tariff'+(t.popular?' is-popular':'')+(t.monthly?' tariff-monthly':'')+(on?' is-open':'')}>
   <h4>{t.name}</h4>
   <p className="tariff-price"><small className="from">from</small>{fmt(promo(price(t.key,cur)),cur)}{per&&<small>{per}</small>}</p>
   <p className="ix-was"><s>{fmt(price(t.key,cur),cur)}{per}</s> · launch price</p>
   <button type="button" onClick={()=>setOpen(o=>on?o.filter(k=>k!==t.key):[...o,t.key])} aria-expanded={on} className="tariff-more">What is included<Icon name="chevron-down" size={16}/></button>
   <p className="tariff-body"><b className="ix-inc">What is included</b>{t.body}</p>
   <p className="tariff-meta">{t.monthly?t.time:<>Timeline: <b>{t.time}</b></>}</p>
   <a href="#contact" onClick={e=>{e.preventDefault();go(t.name)}} className="ulink tariff-cta">{t.cta}<Icon name="arrow-right" size={16}/></a>
  </article>;
 };
 return (
  <section id="pricing" data-screen-label="Formats" className="wrap sec">
   <div className="ix-head">
    <div data-reveal=""><h2 className="h2">What does AI implementation cost?</h2><p className="lead">Pay once for the launch and, if you want, monthly for care. Tools and AI usage stay on your own accounts. All prices exclude VAT.</p></div>
    <CurSwitch/>
   </div>
   <div className="tariffs mt28">
    <div className="tariff-group tariff-group-once"><span className="tariff-step">1</span><div><h3>Launch: one-off</h3><p>We train your team, implement ready-made tools or build a custom solution. The price is fixed before we start.</p></div></div>
    <div className="tariff-group tariff-group-monthly"><span className="tariff-step">2</span><div><h3>After launch: monthly</h3><p>If you want us to look after the solution and keep improving it.</p></div></div>
    <span aria-hidden="true" className="tariff-plus"><Icon name="plus" size={18}/></span>
    {tariffs.map(card)}
   </div>
   <p className="tariff-example ix-rc-line"><Icon name="phone-call" size={16}/><span>AI receptionist: <b>{fmt(promo(price('rcSetup',cur)),cur)}</b> setup + <b>{fmt(promo(price('rcMonth',cur)),cur)}/mo</b> with the launch offer. Call minutes at cost, typically {curInfo[cur].usage} per minute. <a href={link('services/ai-receptionist')} className="ix-inline">See the AI receptionist</a></span></p>
   <p className="tariff-example"><Icon name="calculator" size={16}/><span>For example: implementation pilot <b>{fmt(promo(price('pilot',cur)),cur)}</b> once. Ongoing care: <b>{fmt(promo(price('care',cur)),cur)}/mo</b>. You pay AI usage directly to the providers. The audit is free.</span></p>
   <p className="ix-vat">{vatNote}</p>
  </section>
 );
}

export function Calculator(){
 const {cur,go}=useIx();
 const [c,setC]=useState({items:600,min:6,cost:18,share:60,lost:8,deal:400});
 const used=useRef(false);
 const sym=curInfo[cur].sym;
 const hours=Math.round(c.items*c.min/60*c.share/100),money=hours*c.cost,leads=Math.round(c.lost*c.deal*.2);
 const net=money+leads-promo(price('care',cur));
 const payback=net>0?Math.max(.1,promo(price('pilot',cur))/net):null;
 const inputs:[keyof typeof c,string,number,number,number,string][]=[['items','Calls, enquiries or documents per month',50,3000,50,c.items.toLocaleString('en-GB')],['min','Staff minutes per item',1,30,1,c.min+' min'],['cost','Cost of one staff hour',10,80,1,sym+c.cost],['share','Share handled by AI',20,80,5,c.share+'%'],['lost','Leads lost per month',0,50,1,String(c.lost)],['deal','Average deal value',50,5000,50,fmt(c.deal,cur)]];
 return (
  <section data-screen-label="Calculator" className="band-white bordered">
   <div className="wrap sec">
    <div data-reveal=""><h2 className="h2 mw820">How much could you save?</h2><p className="lead">Enter your numbers to see the hours AI could free up, the revenue from leads you lose today and how fast a pilot pays back.</p></div>
    <div className="ix-calc mt28">
     <div className="ix-calc-inputs">{inputs.map(([k,l,mn,mx,st,d])=><label key={k} className="calc-field"><span className="calc-label">{l}<b>{d}</b></span>
      <input type="range" min={mn} max={mx} step={st} value={c[k]} style={{'--p':((c[k]-mn)/(mx-mn))*100+'%'} as React.CSSProperties} onChange={e=>{if(!used.current){used.current=true;track('calculator_use')}setC({...c,[k]:+e.target.value})}}/></label>)}</div>
     <div className="ix-calc-res">
      <div className="ix-calc-grid">
       <div><small>Freed up per month</small><b>{hours} h</b></div>
       <div><small>Savings per month</small><b>{fmt(money,cur)}</b></div>
       <div className="ix-span"><small>Revenue from lost leads</small><b className="ix-mid">+{fmt(leads,cur)}</b><small>if one in five becomes a customer</small></div>
      </div>
      <p className="ix-payback">A pilot from <b>{fmt(promo(price('pilot',cur)),cur)}</b> pays back, even with care at {fmt(promo(price('care',cur)),cur)}/mo, in <b>{payback?'≈ '+payback.toFixed(1)+' months':'more volume needed first'}</b>.</p>
      <a href="#contact" onClick={e=>{e.preventDefault();go('Savings estimate: '+hours+' h and '+fmt(money,cur)+' a month')}} className="btn btn-primary ix-btn-48">Discuss my estimate<Icon name="arrow-right" size={16}/></a>
      <p className="ix-calc-note">An estimate based on your inputs. We measure the real effect in a pilot.</p>
     </div>
    </div>
   </div>
  </section>
 );
}

export function SolutionExamples(){
 return (
  <section data-screen-label="Solution examples" className="wrap sec">
   <h2 data-reveal="" className="h2">Solution examples.</h2>
   <div className="grid-c3w mt28" data-stagger="">{services.map(x=>{const [b,r]=splitB(x.desc+'. '+(x.answer||'').split('. ')[0]+'.');return <a key={x.slug} href={link(servicePath(x.slug))} className="card ix-card-lift ix-scard">
    <span className="tile-icon tile-44 r12"><Icon name={x.icon} size={22}/></span><h3>{x.name}</h3><p><strong>{b}</strong>{r}</p></a>})}</div>
  </section>
 );
}

export function Process(){
 const steps=[['Free audit','30 minutes on a call. We look at where hours go and name the first workflow.','A named workflow and an estimate'],['Pilot plan','Success metric, timeline and a fixed price, agreed before any work starts.','A one-page plan you can approve'],['Build and test','We connect your tools and test on real cases from your business.','Working pilot in 2–4 weeks'],['Launch and care','Team onboarding, then monthly reviews if you want us to look after it.','Results measured against the metric']];
 return (
  <section data-screen-label="Process" className="wrap sec">
   <div data-reveal=""><h2 className="h2 mw820">How we work.</h2><p className="lead">Four steps from the first call to a working result. You approve the plan and price before we build.</p></div>
   <ol className="ix-process mt28">{steps.map(([t,b,o],i)=><li key={t} data-reveal="" style={rd(i*90)}><span className="step-num">0{i+1}</span><h3>{t}</h3><p>{b}</p><p className="step-out"><Icon name="check" size={15}/>{o}</p></li>)}</ol>
  </section>
 );
}

export function Trust(){
 const log:[string,string,string,string,string,string][]=[['check','#e7f6ec','#146c2e','Reply approved','manager · quote #2141','10:42'],['user-round','#fff4e0','#a35b00','Handed to a person','refund outside rules','10:38'],['lock','#eaf0ff','#2146d3','Access restricted','role: trainee · payroll','10:31'],['link','#eaf0ff','#2146d3','Source cited','returns policy, §3','10:27']];
 const pts=[['Review where it matters','Agree which actions need a person and which can never run automatically.'],['Your data and rules','Sources, access and retention are defined before implementation.'],['UK GDPR and a DPA','We act as your processor under a data processing agreement.'],['Your team knows how','Instructions and training on real tasks from your business.']];
 return (
  <section data-screen-label="Trust" className="band-white bordered">
   <div className="wrap sec">
    <div className="trust">
     <div data-reveal=""><h2 className="h2 mw560">Control stays with your business.</h2>
      <p className="ix-lock ix-lock-lg"><Icon name="lock" size={18}/>We use enterprise APIs. Your data never trains public models.</p>
      <a href={link('security')} className="ulink mt24">How we handle data<Icon name="arrow-right" size={16}/></a></div>
     <div data-reveal="" style={rd(100)} aria-hidden="true" className="log">
      <div className="log-title"><Icon name="shield-check" size={15}/>Review log</div>
      <ul>{log.map(([ic,bg,fg,t,s,tm],i)=><li key={t} style={{animationDelay:i*120+'ms'}}><span className="log-icon" style={{background:bg,color:fg}}><Icon name={ic} size={13}/></span><span className="min0 grow"><b>{t}</b><span>{s}</span></span><small>{tm}</small></li>)}</ul>
     </div>
    </div>
    <div className="grid-c4 ix-mt40">{pts.map(([t,b],i)=><article key={t} data-reveal="" style={rd(i*80)} className="trust-item"><h3>{t}</h3><p>{b}</p></article>)}</div>
   </div>
  </section>
 );
}

export function AuditReport(){
 const {cur}=useIx();
 const rows:[string,number,number,string][]=[['Phone bookings and enquiries',64,12,'High'],['Reminders and no-shows',20,4,'Medium'],['Patient questions on WhatsApp',18,5,'Medium'],['Review replies',6,2,'Low']];
 const gets:[string,string,string][]=[['map','Process map','Where time goes, with hours per month.'],['bar-chart-3','Impact estimate','Hours and money AI could free in each process.'],['receipt','Pilot plan and price','One process, a success metric, timeline and a fixed price.']];
 return (
  <section data-screen-label="Audit report" className="wrap sec audit">
   <div data-reveal=""><h2 className="h2">What the free audit gives you.</h2><p className="lead mw460">A working document: what to automate, what it saves and what the pilot costs.</p>
    <ul className="audit-gets">{gets.map(([ic,t,d])=><li key={t}><span className="tile-icon"><Icon name={ic} size={18}/></span><span><b>{t}</b><span>{d}</span></span></li>)}</ul>
    <div className="btn-row mt28"><Cta/></div></div>
   <div data-reveal="" style={rd(100)} className="report">
    <div className="report-head"><span>Process audit</span><small>Sample · dental practice, 3 chairs</small></div>
    <table><thead><tr><th>Process</th><th>Now, h/mo</th><th>With AI</th><th>Saved/mo</th><th>Priority</th></tr></thead>
     <tbody>{rows.map(([n,now,ai,p])=><tr key={n}><th>{n}</th><td data-label="Now, h/mo">{now}</td><td data-label="With AI">{ai}</td><td data-label="Saved/mo" className="num">{fmt((now-ai)*18,cur)}</td><td data-label="Priority"><span className={'prio '+(p==='High'?'prio-hi':p==='Medium'?'prio-mid':'prio-lo')}>{p}</span></td></tr>)}</tbody></table>
    <p className="report-foot"><Icon name="flag" size={15}/><span><b>Recommended pilot:</b> AI receptionist · 2 weeks · {fmt(promo(price('rcSetup',cur)),cur)} + {fmt(promo(price('rcMonth',cur)),cur)}/mo</span></p>
    <p className="report-note">Illustrative figures.</p>
   </div>
  </section>
 );
}

export function Team(){
 const pts=[['Revenue first, technology second','We work out where AI pays off in money and hours, then pick the tool.'],['One accountable lead','One person works with you from audit to launch and owns the result.'],['Direct line','You write to Evgeny directly by email or WhatsApp.']];
 return (
  <section data-screen-label="Team" className="band-soft">
   <div className="wrap sec">
    <div data-reveal=""><h2 className="h2">Who builds it.</h2><p className="lead mw560">One person works with you from the first call to launch and owns the result.</p></div>
    <div className="ix-team mt28">
     <figure data-reveal="" className="ix-team-photo">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={base+'/team/evgeny.jpg'} alt="Evgeny Budnikov" width={360} height={360} loading="lazy"/>
      <figcaption><small>Founder, Praxen AI</small><b>Evgeny Budnikov</b></figcaption>
     </figure>
     <div>
      <p className="ix-team-bio">Makes sure AI brings measurable results: maps your processes, estimates the impact and leads implementation from audit to launch.</p>
      <ul className="ix-team-pts">{pts.map(([t,d])=><li key={t}><b>{t}</b><span>{d}</span></li>)}</ul>
      <div className="btn-row mt28">
       <a href={contacts.whatsapp} target="_blank" rel="noopener" className="ix-dark-btn"><Icon name="whatsapp" size={16}/>WhatsApp</a>
       <a href={'mailto:'+contacts.email} className="ix-line-btn"><Icon name="mail" size={15}/>Email Evgeny</a>
      </div>
     </div>
    </div>
   </div>
  </section>
 );
}

// ---------- Inner pages ----------
export function InnerHero({entity}:{entity?:Entity}){
 const {route,cur}=useIx();
 const sec=route.page;
 const crumbs:Pair[]=entity&&route.page!=='training'?[[sectionName[sec],sec],[entity.name,route.page+'/'+entity.slug]]:[[sectionName[sec],sec]];
 const I=entity?null:innerPages[sec];
 const stats=entity?entity.stats.map(([n,l],i)=>entity.slug==='ai-receptionist'&&i===2?[fmt(promo(price('rcMonth',cur)),cur)+'/mo','launch price, minutes at cost']:[n,l]):[];
 return (
  <section data-screen-label="Inner hero" className="ix-inner">
   <div aria-hidden="true" className="ix-inner-glow"/>
   <div className="wrap inner-pad">
    <nav aria-label="Breadcrumb" className="crumbs wrapflex"><a href={link('')}>Home</a>{crumbs.map(([l,h],i)=><span key={h} className="ix-crumb"><span aria-hidden="true">/</span><a href={link(h)} aria-current={i===crumbs.length-1?'page':undefined}>{l}</a></span>)}</nav>
    <div className={'ix-inner-grid'+(entity?' is-detail':I?.facts?' has-facts':'')}>
     <div className="min0">
      <p data-reveal="" className="hero-eyebrow">{entity?entity.name:I?.eyebrow}</p>
      <h1 data-reveal="" style={rd(60)} className="h1 mt14">{entity?entity.h1:I?.h1}</h1>
      <div data-reveal="" style={rd(160)}>
       <p className="ix-hero-sub ix-inner-sub">{entity?entity.sub:I?.sub}</p>
       {!(sec==='privacy'||sec==='terms')&&<div className="ix-cta-row"><Cta/>{I?.showCur&&<span className="ix-small">All prices exclude VAT · shown in {curInfo[cur].label}</span>}</div>}
       {(entity?.pricing||I?.badge)&&<Offer/>}
      </div>
      {entity&&<div data-reveal="" style={rd(240)} className="ix-stats">{stats.map(([n,l])=><span key={l}><b>{n}</b>{l}</span>)}</div>}
     </div>
     {entity&&<div className="min0"><div data-reveal="" style={rd(120)} className="ix-scene-box"><Scene type={entity.scene} data={entity.sceneData}/></div></div>}
     {I?.facts&&<dl data-reveal="" style={rd(120)} className="ix-facts">{I.facts.map(([ic,t,d])=><div key={t}><span className="tile-icon"><Icon name={ic} size={19}/></span><span><dt>{t}</dt><dd>{d}</dd></span></div>)}</dl>}
    </div>
   </div>
  </section>
 );
}

export function Cards({page}:{page:ListPage}){
 const {cur}=useIx();
 const meta=(slug:string)=>({'ai-receptionist':fmt(promo(price('rcMonth',cur)),cur)+'/mo + setup','ai-training':fmt(promo(price('training',cur)),cur),'ai-agents':'from '+fmt(promo(price('custom',cur)),cur)} as Record<string,string>)[slug]||'pilot '+fmt(promo(price('pilot',cur)),cur);
 const cards=page==='cases'
  ?examples.map(x=>({href:x.href,icon:'flag',name:'Example · '+x.title,b:x.over+'. ',r:x.body,meta:x.nums.map(n=>n[0]+' '+n[1]).join(' · ')}))
  :(page==='services'?services:page==='industries'?industries:departments).map(x=>{const [b,r]=splitB(x.sub);return {href:page==='services'?servicePath(x.slug):page+'/'+x.slug,icon:x.icon,name:x.name,b,r,meta:page==='services'?'Launch price: '+meta(x.slug):''}});
 return (
  <section data-screen-label="Cards" className="wrap sec">
   <div className="ix-cards" data-stagger="">{cards.map(c=><a key={c.href+c.name} href={link(c.href)} className="card ix-card-lift ix-lcard">
    <span className="ix-lcard-top"><span className="tile-icon tile-44 r12"><Icon name={c.icon} size={22}/></span><Icon name="arrow-up-right" size={18}/></span>
    <h3>{c.name}</h3><p><strong>{c.b}</strong>{c.r}</p>{c.meta&&<span className="ix-lcard-meta">{c.meta}</span>}
   </a>)}</div>
  </section>
 );
}

// ---------- Small business page (/ai-for-small-business) ----------
export function SmallPerks(){
 return (
  <section data-screen-label="Starter terms" className="band-soft">
   <div className="wrap sec">
    <div data-reveal=""><p className="kicker">Small business starter</p><h2 className="h2 mw820">Starter terms for teams of {smallLimit}.</h2><p className="lead mw560">On top of the launch offer, for the first workflow or AI receptionist you launch with us.</p></div>
    <div className="grid-c3w mt28" data-stagger="">{smallPerks.map(([ic,t,d])=><article key={t} className="card ix-scard"><span className="tile-icon tile-44 r12"><Icon name={ic} size={22}/></span><h3>{t}</h3><p>{d}</p></article>)}</div>
   </div>
  </section>
 );
}

export function SmallScenarios(){
 const {go}=useIx();
 return (
  <section data-screen-label="Scenarios" className="wrap sec">
   <h2 data-reveal="" className="h2 mw820">Where a small team gets hours back.</h2>
   <div className="grid-c3w mt28" data-stagger="">{smallScenarios.map(([ic,t,d])=><a key={t} href="#contact" onClick={e=>{e.preventDefault();go('Small business: '+t)}} className="card ix-card-lift ix-scard">
    <span className="tile-icon tile-44 r12"><Icon name={ic} size={22}/></span><h3>{t}</h3><p>{d}</p>
    <span className="ulink mt-auto">Discuss this<Icon name="arrow-right" size={16}/></span></a>)}</div>
  </section>
 );
}

export function SmallPricing(){
 const {cur,go}=useIx();
 const third=(k:'rcSetup'|'pilot')=>fmt(Math.ceil(promo(price(k,cur))/3),cur);
 const cards:{name:string;once:string;unit:string;split:string;monthly?:string;body:string;meta:string}[]=[
  {name:'AI receptionist',once:fmt(promo(price('rcSetup',cur)),cur),unit:' setup',split:'or 3 × '+third('rcSetup'),monthly:fmt(promo(price('rcMonth',cur)),cur),body:'Answers every call 24/7, books into your calendar and texts you a summary. '+usageNote(cur),meta:'Live in about 2 weeks · month to month'},
  {name:'One-workflow pilot',once:fmt(promo(price('pilot',cur)),cur),unit:' once',split:'or 3 × '+third('pilot'),body:'Quotes, invoices, enquiries or bookings: one workflow automated and tested on your real data.',meta:'2–4 weeks · fixed price agreed upfront'},
 ];
 return (
  <section id="pricing" data-screen-label="Pricing" className="wrap sec">
   <div className="ix-head">
    <div data-reveal=""><h2 className="h2">What it costs a small business.</h2><p className="lead">Launch prices with 30% off. Starter terms let you spread the setup over three months. All prices exclude VAT.</p></div>
    <CurSwitch/>
   </div>
   <div className="ix-small-grid mt28" data-stagger="">{cards.map(c=><article key={c.name} className="card ix-small-card">
    <h3>{c.name}</h3>
    <p className="tariff-price">{c.once}<small>{c.unit}</small></p>
    <p className="ix-was">{c.split} · no extra cost</p>
    {c.monthly&&<p className="ix-small-month">then <b>{c.monthly}/mo</b>, cancel with 30 days’ notice</p>}
    <p>{c.body}</p>
    <p className="tariff-meta">{c.meta}</p>
    <a href="#contact" onClick={e=>{e.preventDefault();go('Small business: '+c.name)}} className="btn btn-primary mt-auto">Get a free AI audit<Icon name="arrow-right" size={16}/></a>
   </article>)}</div>
   <p className="ix-vat">{vatNote}</p>
  </section>
 );
}

// Home: a short pointer to the small business page and its starter terms.
export function SmallStrip(){
 return (
  <section data-screen-label="Small business" className="wrap sec pb0">
   <a href={link('ai-for-small-business')} data-reveal="" className="card ix-card-lift ix-strip">
    <span className="tile-icon tile-44 r12"><Icon name="users" size={22}/></span>
    <span><b>A team of {smallLimit}?</b> Starter terms: setup in three payments, no long contract and the first month of care free.</span>
    <span className="ulink">See small business terms<Icon name="arrow-right" size={16}/></span>
   </a>
  </section>
 );
}

export function OneSystem(){
 const left:[string,string][]=[['headphones','Support assistant'],['users','HR bot'],['trending-up','Sales assistant'],['landmark','Finance automation']];
 return (
  <section data-screen-label="One system" className="band-white bordered">
   <div className="wrap sec ix-split ix-center">
    <div data-reveal=""><p className="kicker">One system</p><h2 className="h2">Each next department connects faster.</h2><p className="lead">Your support assistant and your HR bot answer from <strong>one shared knowledge base</strong>. Access rules, logs and integrations are set up once, so the second department is connected in days.</p></div>
    <div data-reveal="" style={rd(100)} className="ix-sys">
     <div>{left.map(([ic,n])=><span key={n}><Icon name={ic} size={16}/>{n}</span>)}</div>
     <span className="ix-sys-arrow"><Icon name="arrow-right-left" size={20}/></span>
     <div className="ix-sys-kb"><Icon name="database" size={22}/><b>Knowledge base</b><span>Policies, prices, FAQs and documents · one set of access rules · one log</span></div>
    </div>
   </div>
  </section>
 );
}

export function TrainingPrice(){
 const {cur,cta,go}=useIx();
 const tr=offers.find(o=>o.key==='training')!;
 return (
  <section data-screen-label="Price" className="wrap sec pb0">
   <div data-reveal="" className="ix-rc ix-split">
    <div>
     <h2 className="ix-h3">Team training price</h2>
     <p className="ix-offer ix-offer-top">Launch offer: 30% off.</p>
     <div className="ix-rc-prices"><div><small>Half-day session, up to 12 people</small><div><s>{fmt(price('training',cur),cur)}</s><b>{fmt(promo(price('training',cur)),cur)}</b></div></div></div>
     <p className="ix-rc-note">Larger teams run as several sessions. Travel for on-site sessions is charged at cost. All prices exclude VAT.</p>
     <div className="btn-row"><a href="#contact" onClick={e=>{e.preventDefault();go('Team training')}} className="btn btn-primary">{cta}<Icon name="arrow-right" size={16}/></a><CurSwitch/></div>
    </div>
    <ul className="ix-checks">{tr.includes.map(t=><li key={t}><Icon name="check" size={17}/>{t}</li>)}<li className="is-muted"><Icon name="clock" size={17}/>From 1 week to the session date</li></ul>
   </div>
  </section>
 );
}

export function CaseDetails(){
 return (
  <section data-screen-label="Cases" className="wrap sec">
   <div className="grid-c3w" data-stagger="">{examples.map(x=><article key={x.href} className="card ex-card">
    <span className="over">{x.over} · Example</span>
    <h3>{x.title}</h3>
    <p>{x.body}</p>
    <dl>
     <dt>Situation</dt><dd>{x.situation}</dd>
     <dt>Solution</dt><dd>{x.solution}</dd>
     <dt>How we measure it</dt><dd className="dd-strong">{x.measure}</dd>
    </dl>
    <div className="ix-nums">{x.nums.map(([n,l])=><div key={l}><b>{n}</b><span>{l}</span></div>)}</div>
    <a href={link(x.href)} className="ulink mt-auto">See the industry page<Icon name="arrow-right" size={16}/></a>
   </article>)}</div>
  </section>
 );
}

export function ReceptionistPrice(){
 const {cur,cta,go}=useIx();
 const rc=offers.find(o=>o.key==='receptionist')!;
 return (
  <section data-screen-label="Price" className="wrap sec pb0">
   <div data-reveal="" className="ix-rc ix-split">
    <div>
     <h2 className="ix-h3">AI receptionist pricing</h2>
     <p className="ix-offer ix-offer-top">Launch offer: 30% off setup and the monthly fee.</p>
     <div className="ix-rc-prices">
      <div><small>Monthly</small><div><s>{fmt(price('rcMonth',cur),cur)}</s><b>{fmt(promo(price('rcMonth',cur)),cur)}</b><span>/mo</span></div></div>
      <div><small>One-off setup</small><div><s>{fmt(price('rcSetup',cur),cur)}</s><b>{fmt(promo(price('rcSetup',cur)),cur)}</b></div></div>
     </div>
     <p className="ix-rc-note">{usageNote(cur)} All prices exclude VAT.</p>
     <div className="btn-row"><a href="#contact" onClick={e=>{e.preventDefault();go('AI receptionist')}} className="btn btn-primary">{cta}<Icon name="arrow-right" size={16}/></a><CurSwitch/></div>
    </div>
    <ul className="ix-checks">{rc.includes.map(t=><li key={t}><Icon name="check" size={17}/>{t}</li>)}<li className="is-muted"><Icon name="clock" size={17}/>Live in 2 weeks · billed monthly</li></ul>
   </div>
  </section>
 );
}

export function Scenarios({entity,group}:{entity:Entity;group:string}){
 const {go}=useIx();
 const title=entity.slug==='ai-training'?'What the session covers.':entity.slug==='ai-consultancy'?'What you get.':group==='services'?'What it handles.':group==='industries'?'Where AI helps '+entity.name.toLowerCase()+'.':'Where AI helps your '+entity.name.toLowerCase()+' team.';
 return (
  <section data-screen-label="Scenarios" className="wrap sec">
   <h2 data-reveal="" className="h2 mw820">{title}</h2>
   <div className="grid-c3w mt28" data-stagger="">{entity.scenarios.map(([ic,t,d])=>{const [b,r]=splitB(d);return <a key={t} href="#contact" onClick={e=>{e.preventDefault();go(entity.name+': '+t)}} className="card ix-card-lift ix-scard">
    <span className="tile-icon tile-44 r12"><Icon name={ic} size={22}/></span><h3>{t}</h3><p><strong>{b}</strong>{r}</p>
    <span className="ulink mt-auto">Discuss this scenario<Icon name="arrow-right" size={16}/></span></a>})}</div>
  </section>
 );
}

export function Tabs({entity,group}:{entity:Entity;group:string}){
 const isInd=group==='industries';
 const src=isInd?services:industries;
 const [ti,setTi]=useState(0);
 const T=src[ti];
 const m=isInd?T.desc.toLowerCase():(micro[T.slug]?.[entity.slug]||micro[T.slug]?.default||'');
 const title=isInd?'Services that fit '+entity.name.toLowerCase()+'.':group==='departments'?'Same team, different industries.':'How it works in your industry.';
 return (
  <section data-screen-label="Tabs" className="band-white bordered">
   <div className="wrap sec">
    <h2 data-reveal="" className="h2 mw820">{title}</h2>
    <div className="dept-layout mt28">
     <div role="tablist" className="dept-tabs rel-tabs ix-tabs">{src.map((x,i)=><button key={x.slug} type="button" role="tab" aria-selected={i===ti} onClick={()=>setTi(i)} className={'rel-tab'+(i===ti?' is-on':'')}><Icon name={x.icon} size={17}/>{x.name}</button>)}</div>
     <article key={ti} className="panel fade-in" role="tabpanel">
      <span className="ix-kick">{isInd?'Service':'Industry'}</span>
      <h3 className="ix-tab-h3">{T.name} <span>→ {m}</span></h3>
      <a href={link(isInd?servicePath(T.slug):'industries/'+T.slug)} className="ulink mt24">{isInd?'About '+T.name:'AI for '+T.name.toLowerCase()}<Icon name="arrow-right" size={16}/></a>
     </article>
    </div>
   </div>
  </section>
 );
}

export function Tested({entity}:{entity:Entity}){
 const items=entity.tested||['We test on your real cases before launch.','Clear rules on what the AI may and may not do.','Every action is logged and reviewable.'];
 return (
  <section data-screen-label="Tested" className="wrap sec ix-split">
   <h2 data-reveal="" className="h2">What we test before launch.</h2>
   <div>
    <ol className="ix-tested">{items.map((t,i)=><li key={t}><span>0{i+1}</span>{t}</li>)}</ol>
    {entity.measure&&<div className="ix-measure"><b>What we measure</b><p>{entity.measure}</p><small>We compare with how the work runs today, including the time people spend checking.</small></div>}
    <div className="ix-logos">{(logoSets[entity.slug]||defaultLogoSet).map(n=><span key={n}><Logo name={n} size={16}/>{n}</span>)}</div>
   </div>
  </section>
 );
}

export function ShortAnswer({entity,group}:{entity:Entity;group:string}){
 const {cur}=useIx();
 const set=(logoSets[entity.slug]||['HubSpot','Microsoft 365','Google Workspace']).slice(0,3).join(', ');
 const q=entity.question||'What does AI do for '+entity.name.toLowerCase()+' and what does it cost?';
 const lead=entity.answer||entity.name+' teams use AI to answer routine questions, move data between systems and prepare drafts for review.';
 const rc=entity.slug==='ai-receptionist'?' Setup is '+fmt(promo(price('rcSetup',cur)),cur)+' and the monthly fee '+fmt(promo(price('rcMonth',cur)),cur)+' with the launch offer ('+fmt(price('rcSetup',cur),cur)+' and '+fmt(price('rcMonth',cur),cur)+' standard), plus call minutes at cost, typically '+curInfo[cur].usage+' a minute.':'';
 const tail=entity.slug==='ai-receptionist'?' It connects to '+set+' and other tools you already use. Every project starts with a free 30-minute audit.'
  :' A pilot on one workflow takes 2–4 weeks and costs '+fmt(promo(price('pilot',cur)),cur)+' with the launch offer ('+fmt(price('pilot',cur),cur)+' standard); team training is '+fmt(promo(price('training',cur)),cur)+' and optional care '+fmt(promo(price('care',cur)),cur)+' a month. It connects to '+set+' and other tools you already use. Every project starts with a free 30-minute audit.';
 void group;
 return <AnswerBox q={q} a={lead+rc+tail} updated/>;
}
export function AnswerBox({q,a,updated}:{q:string;a:string;updated?:boolean}){
 return (
  <section data-screen-label="Short answer" className="wrap">
   <div data-reveal="" className="ix-answer">
    <div><p className="ix-answer-kick">Short answer</p><h2>{q}</h2>{updated&&<small>Updated {intlUpdatedLabel}</small>}</div>
    <p>{a}</p>
   </div>
  </section>
 );
}

// ---------- About, security, legal ----------
export function AboutStory(){
 return (
  <section data-screen-label="About story" className="wrap sec ix-split">
   <h2 data-reveal="" className="h2">Why we exist.</h2>
   <div className="ix-story">
    <p>Most companies need the phone answered, the CRM filled in and the paperwork done, without hiring more people.</p>
    <p>The problems are the same in every business: missed calls, data typed twice and slow replies. We build AI assistants and automations for exactly those, and we measure the result.</p>
    <div className="grid-c2 mt14">
     <div className="ix-mini"><Icon name="clock" size={20}/><b>Working hours</b><p>We work remotely and schedule calls in UK working hours. Email and WhatsApp replies come the same working day.</p></div>
     <div className="ix-mini"><Icon name="briefcase" size={20}/><b>Business customers</b><p>We work with businesses only. Contracts, DPA and invoices in English.</p></div>
    </div>
   </div>
  </section>
 );
}

export function Security(){
 const items:[string,string,string][]=[['lock','Enterprise APIs','We use enterprise APIs. Your data never trains public models.'],['map-pin','Data location','UK or EU hosting wherever the provider allows. Locations are listed in your DPA.'],['key-round','Access','Role-based access, least privilege by default, and access removed at handover.'],['scroll-text','Logs','Every AI action is logged with its source, so you can see what happened and why.'],['file-signature','UK GDPR and DPA','We act as your processor under a data processing agreement signed before work starts.'],['trash-2','Retention','Call recordings and transcripts are kept only as long as you decide, then deleted.']];
 const subs:[string,string,string][]=[['Language models','OpenAI or Anthropic (enterprise API)','US / EU'],['Telephony','Chosen per project','UK / EU'],['Hosting','Cloud provider, EU region','EU'],['Email','Transactional email provider','EU']];
 return (
  <section data-screen-label="Security" className="wrap sec">
   <div className="grid-c3w" data-stagger="">{items.map(([ic,t,d])=><article key={t} className="card ix-scard"><span className="tile-icon tile-44 r12"><Icon name={ic} size={22}/></span><h3>{t}</h3><p>{d}</p></article>)}</div>
   <h2 className="ix-h3 ix-mtsec">Subprocessors</h2>
   <p className="ix-src">Typical list. The final list for your project is in your DPA. Sources: <a href="https://openai.com/enterprise-privacy/" target="_blank" rel="noopener">OpenAI enterprise privacy</a> · <a href="https://www.anthropic.com/legal/commercial-terms" target="_blank" rel="noopener">Anthropic commercial terms</a> · <a href="https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/" target="_blank" rel="noopener">ICO UK GDPR guidance</a></p>
   <div role="table" className="ix-table"><div role="row" className="is-head"><span role="columnheader">Purpose</span><span role="columnheader">Provider</span><span role="columnheader">Location</span></div>{subs.map(([a,b,c])=><div role="row" key={a}><b role="cell">{a}</b><span role="cell">{b}</span><span role="cell">{c}</span></div>)}</div>
  </section>
 );
}

export function Partners(){
 return (<>
  <section data-screen-label="Who it is for" className="wrap sec">
   <h2 data-reveal="" className="h2 mw820">Who it is for.</h2>
   <div className="grid-c4 mt28" data-stagger="">{partnerWho.map(([ic,t,d])=><article key={t} className="card partner-card"><span className="tile-icon"><Icon name={ic} size={20}/></span><h3>{t}</h3><p>{d}</p></article>)}</div>
  </section>
  <section data-screen-label="How it works" className="band-white bordered">
   <div className="wrap sec">
    <h2 data-reveal="" className="h2 mw820">How it works.</h2>
    <ol className="ix-process ix-process-3 mt28">{partnerSteps.map((t,i)=><li key={t} data-reveal="" style={rd(i*110)}><span className="step-num">0{i+1}</span><p className="partner-step">{t}</p></li>)}</ol>
   </div>
  </section>
 </>);
}

export function Doc({page}:{page:'privacy'|'terms'}){
 const docs:Record<string,[string,string[]][]>={
  privacy:[['Who we are',['Praxen AI is an AI implementation company. For any question about your data, email '+contacts.email+'.']],
   ['What data we collect',['From the enquiry form: your contact details (email, phone or WhatsApp), the options you choose, your message, the page you sent it from and the traffic source (such as UTM tags).','When you book a call: your name, email and the time you choose, handled by Cal.com.','With your consent only: anonymous usage data (pages viewed, device and clicks) through Google Analytics and the Meta Pixel.']],
   ['Why and on what basis',['To reply to your enquiry and prepare a proposal: steps taken at your request before a contract (UK GDPR Art. 6(1)(b)).','To understand which pages and channels are useful: your consent (Art. 6(1)(a)), which you can withdraw at any time in the cookie settings.']],
   ['Who receives it',['Enquiries reach us by email and messenger and may be stored in our CRM. Call bookings are handled by Cal.com. Analytics providers (Google, Meta) receive data only after your consent. We never sell personal data.','Our team and some providers are outside the UK. Where data leaves the UK, we rely on the safeguards the UK GDPR provides, such as the International Data Transfer Agreement or adequacy regulations.']],
   ['How long we keep it',['Enquiry data is kept for up to 3 years after our last contact, or until you ask us to delete it.']],
   ['Your rights',['You can ask for a copy of your data, correct or delete it, object to or restrict its use, and withdraw consent. Email '+contacts.email+'; we reply within one month. You can also complain to the Information Commissioner’s Office (ico.org.uk).']]],
  terms:[['Who these terms apply to',['These terms apply when a business buys services from Praxen AI: audits, pilots, implementations, AI receptionists, care plans and training. We work with businesses only, not consumers.','A signed proposal or pilot plan takes priority over these terms where the two differ.']],
   ['Proposals and scope',['Every project starts with a written proposal or pilot plan that sets out the scope, deliverables, timeline, price and the metric we will measure. Work outside that scope is quoted separately and starts only after you approve it.']],
   ['Prices and payment',['All prices exclude VAT. UK and EU business customers account for VAT under the reverse charge.','One-off fees are invoiced when work starts, unless the proposal says otherwise, for example setup in three monthly payments under our small business starter terms. Monthly fees are invoiced monthly in advance. Invoices are payable within 14 days.','If an invoice is more than 14 days overdue, we may pause the service after giving you 7 days’ written notice.']],
   ['Third-party costs',['AI models, telephony and software subscriptions run on your own accounts and are billed to you by the providers at cost. We estimate these costs before launch, and you can see every charge in the provider’s dashboard.']],
   ['Your part',['You give us timely access to the systems and information the project needs, and you tell us about rules that apply in your business. You review and approve each workflow before it goes live.','Where an AI receptionist or assistant talks to your customers, you are responsible for telling them that calls may be recorded and that they are speaking to an AI assistant. We provide the wording.']],
   ['AI outputs',['AI can make mistakes. We design every workflow with rules, review points and a handover to a person, and we test it on your real cases before launch. Decisions made on the basis of AI outputs, and messages your business sends, remain your responsibility.','We do not give legal, financial, tax or medical advice.']],
   ['Monthly plans and cancellation',['Monthly plans, including the AI receptionist and care plans, run month to month unless your proposal sets a minimum term. Either side can cancel with 30 days’ written notice; an email is enough.','One-off fees cover work already done and are not refundable. When a plan ends, we hand over the configuration, prompts and documentation and remove our access to your systems.']],
   ['Ownership',['Your data and everything the AI produces from it belong to you. Once paid for, the configuration we build for you is yours to use and change.','We keep ownership of our general tools, templates and know-how, and you may use them as part of the solution we deliver.']],
   ['Confidentiality',['Each side keeps the other’s confidential information private and uses it only for the project. This continues after the contract ends.']],
   ['Data protection',['When we handle personal data for you, we act as your processor under UK GDPR and EU GDPR. We sign a data processing agreement before we touch any personal data. How we handle data from this website is described in our privacy policy.']],
   ['Liability',['Nothing in these terms limits liability for death or personal injury caused by negligence, for fraud, or for anything else that cannot be limited by law.','Otherwise, our total liability under a contract is limited to the fees you paid us in the 12 months before the claim. Neither side is liable for indirect losses or loss of profit, revenue or data. We are not liable for outages or changes of third-party providers outside our control, but we will help you work around them.']],
   ['Ending a contract for breach',['Either side may end a contract with written notice if the other seriously breaches it and does not put it right within 30 days of being asked to.']],
   ['Law and changes',['These terms and any contract under them are governed by the law of England and Wales, and the courts of England and Wales have jurisdiction.','We may update these terms. Changes apply to new proposals; signed contracts keep the terms that applied when they were signed.']],
   ['Contact',['Questions about these terms: '+contacts.email+'.']]],
 };
 return <section data-screen-label="Document" className="wrap sec"><div className="ix-doc">{docs[page].map(([h,ps])=><div key={h}><h2>{h}</h2>{ps.map(p=><p key={p}>{p}</p>)}</div>)}</div></section>;
}

// ---------- FAQ and contact ----------
export function Faq({items,title}:{items:Pair[];title:string}){
 const [open,setOpen]=useState(0);
 const card=(q:string,a:string,i:number)=>{const on=open===i;return <div key={q} className={'faq-card'+(on?' is-open':'')} style={{order:i}}>
  <h3><button type="button" onClick={()=>setOpen(on?-1:i)} aria-expanded={on} aria-controls={'faq-'+i}>{q}<span className="faq-ring"><Icon name="plus" size={15}/></span></button></h3>
  {/* Every answer stays in the HTML for search engines and AI assistants; closed ones are hidden. */}
  <p id={'faq-'+i} className="faq-a" hidden={!on}>{a}</p>
 </div>};
 const half=Math.ceil(items.length/2);
 return (
  <section data-screen-label="FAQ" className="wrap sec">
   <div className="faq-head">
    <div data-reveal=""><p className="kicker">FAQ</p><h2 className="h2">{title}</h2></div>
    <p data-reveal="" style={rd(100)} className="faq-sub">Short answers on cost, timing, integrations and security. More detail in a free audit.</p>
   </div>
   <div className="faq-grid">
    <div className="faq-col">{items.slice(0,half).map(([q,a],i)=>card(q,a,i))}</div>
    <div className="faq-col">{items.slice(half).map(([q,a],i)=>card(q,a,i+half))}</div>
   </div>
  </section>
 );
}

export function Contact(){
 const {cta,painsKey,route,context,setContext}=useIx();
 const opts=pains[painsKey]||pains.default;
 const [chosen,setChosen]=useState<string[]>([]),[method,setMethod]=useState<'whatsapp'|'email'|'phone'>('whatsapp'),[contact,setContact]=useState(''),[message,setMessage]=useState(''),[showMsg,setShowMsg]=useState(false),[website,setWebsite]=useState('');
 const [status,setStatus]=useState<''|'invalid'|'error'>(''),[sending,setSending]=useState(false),[done,setDone]=useState(false);
 const started=useRef(false);
 const start=()=>{if(!started.current){started.current=true;track('form_start',{page:location.pathname})}};
 const change=(v:string)=>{start();setStatus('');setContact(formatContact(v,method))};
 const submit=async(e:React.FormEvent)=>{
  e.preventDefault();if(sending)return;
  if(!validContact(contact,method)){setStatus('invalid');track('form_error',{reason:'invalid_contact'});return}
  setSending(true);setStatus('');
  try{await sendLead({contact:method+': '+contact,message,tasks:chosen,context:'praxenai.com · '+(route.slug||route.page)+(context?' · '+context:''),website});setDone(true);track('generate_lead',{method,options:chosen.length,page:location.pathname})}
  catch{setStatus('error');track('form_error',{reason:'send_failed'})}
  finally{setSending(false)}
 };
 const label=method==='email'?'Your email':method==='phone'?'Your phone number':'Your WhatsApp number';
 return (
  <section id="contact" data-screen-label="Contact" className="contact-band">
   <div className="wrap sec contact-grid">
    <div>
     <div data-reveal=""><h2 className="h2">Take routine work off your team’s hands.</h2><p className="lead mw460">Tick what takes the most time. We’ll reply with how AI could help and what a pilot would cost.</p></div>
     <BookLink className="booking ix-booking"><span className="tile-icon ix-tile-solid"><Icon name="calendar-plus" size={20}/></span><span><b>Book a free 30-minute call</b><small>Pick a slot in UK time.</small></span><Icon name="arrow-right" size={18}/></BookLink>
     <div className="contact-links">
      <a href={contacts.whatsapp} target="_blank" rel="noopener"><Icon name="whatsapp" size={16}/>WhatsApp</a>
      <a href={'mailto:'+contacts.email}><Icon name="mail" size={16}/>{contacts.email}</a>
     </div>
    </div>
    <div className="form-box">
     {done?<div role="status" className="form-done fade-in">
      <span className="done-icon"><Icon name="check" size={22}/></span>
      <h3>Thanks, we’ve got it.</h3>
      <p>We’ll reply within one working day with first ideas and a time for a call.</p>
      {chosen.length>0&&<p className="done-summary">Focus: {chosen.join(', ')}</p>}
      <div className="btn-row"><BookLink className="btn btn-primary">Pick a call time<Icon name="calendar-check" size={16}/></BookLink><button type="button" onClick={()=>{setDone(false);setContact('');setChosen([]);setMessage('')}} className="ulink ulink-muted">Send another enquiry</button></div>
     </div>:
     <form onSubmit={submit} noValidate className="form">
      <fieldset>
       <legend>What takes the most time?</legend>
       <div className="ix-pains">{opts.map(o=>{const on=chosen.includes(o);return <button key={o} type="button" role="checkbox" aria-checked={on} onClick={()=>{start();setChosen(v=>on?v.filter(x=>x!==o):[...v,o])}} className={'ix-pain'+(on?' is-on':'')}><span><Icon name="check" size={13} strokeWidth={3}/></span>{o}</button>})}</div>
      </fieldset>
      {context&&<div className="context-chip"><span><span className="muted">About:</span> <b>{context}</b></span><button type="button" onClick={()=>setContext('')} aria-label="Remove topic"><Icon name="x" size={15}/></button></div>}
      <div className="field">
       <span className="ix-label">How should we reply?</span>
       <div role="radiogroup" aria-label="How should we reply?" className="methods">{([['whatsapp','WhatsApp'],['email','Email'],['phone','Phone']] as const).map(([k,lb])=><button key={k} type="button" role="radio" aria-checked={method===k} onClick={()=>{setMethod(k);setContact('');setStatus('')}} className={method===k?'is-on':''}>{lb}</button>)}</div>
      </div>
      <label className="field">{label}<input name="contact" value={contact} onChange={e=>change(e.target.value)} placeholder={method==='email'?'name@company.co.uk':'+44 7700 900 123'} inputMode={method==='email'?'email':'tel'} autoComplete={method==='email'?'email':'tel'} aria-invalid={status==='invalid'} aria-describedby={status?'form-status':undefined} className={status==='invalid'?'is-invalid':''}/></label>
      {showMsg?<label className="field fade-in">Message (optional)<textarea name="message" rows={3} maxLength={2000} value={message} onChange={e=>setMessage(e.target.value)}/></label>
       :<button type="button" onClick={()=>setShowMsg(true)} className="ix-textbtn ix-accent-text"><Icon name="plus" size={14}/>Add a message (optional)</button>}
      <input name="website" tabIndex={-1} aria-hidden="true" autoComplete="off" value={website} onChange={e=>setWebsite(e.target.value)} className="hp"/>
      {status&&<p id="form-status" role="alert" className="form-status"><Icon name="alert-circle" size={16}/>{status==='invalid'?(method==='email'?'Please check the email address.':'Please enter a full number, e.g. +44 7700 900 123.'):'Something went wrong. Please write to '+contacts.email+' or message us on WhatsApp.'}</p>}
      <div className="submit-row">
       <button type="submit" disabled={sending} className="btn btn-primary submit-btn">{sending?'Sending…':cta}<Icon name="arrow-right" size={16}/></button>
       <small>Your contact is used only to reply to this enquiry. See our <a href={link('privacy')} className="ix-inline">privacy policy</a>.</small>
      </div>
     </form>}
    </div>
   </div>
  </section>
 );
}

// ---------- Blog ----------
export function BlogList(){
 return (
  <section data-screen-label="Blog list" className="wrap sec">
   <div className="ix-cards" data-stagger="">{posts.map(p=><a key={p.slug} href={link('blog/'+p.slug)} className="card ix-card-lift ix-post">
    <span className="ix-post-cat">{p.cat}</span>
    <h2>{p.title}</h2>
    <p>{p.excerpt}</p>
    <small>{p.dateLabel} · {p.minutes} min read</small>
   </a>)}</div>
  </section>
 );
}

const anchor=(h:string)=>h.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export function Article({post}:{post:Post}){
 return (
  <article data-screen-label="Article" className="ix-article">
   <header className="ix-inner"><div aria-hidden="true" className="ix-inner-glow"/>
    <div className="wrap inner-pad">
     <nav aria-label="Breadcrumb" className="crumbs wrapflex"><a href={link('')}>Home</a><span className="ix-crumb"><span aria-hidden="true">/</span><a href={link('blog')}>Blog</a></span><span className="ix-crumb"><span aria-hidden="true">/</span><span aria-current="page">{post.cat}</span></span></nav>
     <div className="ix-article-head">
      <p className="hero-eyebrow">{post.cat}</p>
      <h1 className="h1 mt14">{post.title}</h1>
      <p className="ix-hero-sub">{post.description}</p>
      <div className="ix-author">
       {/* eslint-disable-next-line @next/next/no-img-element */}
       <img src={base+'/team/evgeny.jpg'} alt="" width={40} height={40}/>
       <span><b>Evgeny Budnikov</b>Founder, Praxen AI · {post.dateLabel} · {post.minutes} min read</span>
      </div>
     </div>
    </div>
   </header>
   <div className="wrap sec ix-article-grid">
    <nav aria-label="Contents" className="ix-toc"><small>Contents</small>{post.blocks.map(b=><a key={b.h} href={'#'+anchor(b.h)}>{b.h}</a>)}</nav>
    <div className="ix-article-body">
     <div className="ix-answer-box"><b>Short answer</b><p>{post.answer}</p></div>
     {post.blocks.map(b=><section key={b.h} id={anchor(b.h)}>
      <h2>{b.h}</h2>
      {b.p?.map(t=><p key={t}>{t}</p>)}
      {b.list&&<ul>{b.list.map(t=><li key={t}>{t}</li>)}</ul>}
      {b.table&&<div className="ix-article-table"><table><thead><tr>{b.table[0].map(c=><th key={c}>{c}</th>)}</tr></thead><tbody>{b.table.slice(1).map(r=><tr key={r[0]}>{r.map((c,i)=>i?<td key={i}>{c}</td>:<th key={i}>{c}</th>)}</tr>)}</tbody></table></div>}
     </section>)}
     <aside className="ix-article-cta"><b>Want the numbers for your business?</b><p>A free 30-minute audit gives you the hours saved and a fixed pilot price.</p><BookLink className="btn btn-primary">Book a free call<Icon name="arrow-right" size={16}/></BookLink></aside>
     <div className="ix-article-links"><b>Related pages</b>{post.links.map(([h,l])=><a key={h} href={link(h)} className="ulink">{l}<Icon name="arrow-right" size={16}/></a>)}</div>
    </div>
   </div>
  </article>
 );
}
