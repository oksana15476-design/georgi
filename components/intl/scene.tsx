'use client';
// Animated product scenes (Claude Design "Praxen Scene"): a looping illustration of one workflow.
// One step every 1.6 s, a two-step pause at the end, stopped off screen and on pause (WCAG 2.2.2);
// with reduced motion the final frame is shown and there is no pause button.
import {useEffect,useRef,useState} from 'react';
import {scenes,type SceneData,type SceneType} from '@/lib/intl';
import {useReducedMotion} from '@/components/praxen/ui';
import {Icon} from './icon';

const steps:Record<SceneType,number>={call:7,doc:4,score:4,chat:4,agent:5,playbook:6,crm:6,helpdesk:6,slack:4,compare:6,planner:5};
const S=(v:unknown)=>String(v??'');
const A=<T,>(v:unknown)=>(Array.isArray(v)?v:[]) as T[];
const ini=(v:string)=>v.split(' ').map(w=>w[0]).join('').slice(0,2);

export function Scene({type,data}:{type:SceneType;data?:SceneData}){
 const D={...scenes[type],...(data||{})} as Record<string,unknown>;
 const n=steps[type];
 const reduced=useReducedMotion();
 const [step,setStep]=useState(0),[paused,setPaused]=useState(false),[visible,setVisible]=useState(true);
 const ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const el=ref.current;if(!el||!('IntersectionObserver' in window))return;
  const io=new IntersectionObserver(es=>es.forEach(e=>setVisible(e.isIntersecting)),{threshold:.15});
  io.observe(el);return()=>io.disconnect();
 },[]);
 useEffect(()=>{
  if(reduced||paused||!visible)return;
  const t=setInterval(()=>setStep(s=>s>=n+2?0:s+1),1600);
  return()=>clearInterval(t);
 },[reduced,paused,visible,n]);
 const s=reduced?99:step,on=(k:number)=>s>=k;
 const v=(k:number)=>'sc-in'+(on(k)?' is-on':'');
 const done=s>=n;
 const bars:Record<SceneType,[string,string,string,string]>={
  call:['phone-call','AI receptionist','Your business line','#315bf5'],
  doc:['file-text','Document intake','Email & PDF → '+S(D.app||'spreadsheet'),'#315bf5'],
  score:['list-checks','AI audit','Ranking processes by payback','#315bf5'],
  chat:['message-circle',S(D.channel||'WhatsApp'),'Answers from your knowledge base','#25d366'],
  agent:['bot','AI agent',S(D.title||'Agent run'),'#315bf5'],
  playbook:['book-open','Team playbook','Prompts, templates and rules','#315bf5'],
  crm:['briefcase',S(D.app||'CRM'),'Deal created from a call',S(D.tile||'#ff7a59')],
  helpdesk:['headphones','Helpdesk','Inbox · support@','#315bf5'],
  slack:['hash',S(D.app||'Slack'),'HR assistant in #'+S(D.channel||'ask-hr'),'#4a154b'],
  compare:['scale','Supplier comparison','Quotes in any format → one table','#315bf5'],
  planner:['calendar-days','Content planner','This week · Instagram & LinkedIn','#315bf5'],
 };
 const [icon,app,sub,tile]=bars[type];
 return (
  <div ref={ref} className="sc" aria-label={'Illustration: '+app}>
   <div className="sc-bar">
    <span className="sc-tile" style={{background:tile}}><Icon name={icon} size={15}/></span>
    <span className="sc-app"><b>{app}</b><small>{sub}</small></span>
    <span className="sc-state"><i style={{background:done?'#1f9d55':'#315bf5'}}/>{done?'Done':'Live'}</span>
    {!reduced&&<button type="button" onClick={()=>setPaused(p=>!p)} aria-label={paused?'Play animation':'Pause animation'} className="sc-ctl"><Icon name={paused?'play':'pause'} size={13}/></button>}
   </div>
   <div className="sc-body" aria-live="off">
    {type==='call'&&<>
     <div className="sc-caller">
      <span className={'sc-ring'+(s===0&&!reduced?' is-ringing':'')}><Icon name="phone" size={17}/></span>
      <span className="sc-who"><b>{S(D.caller)}</b><small>{S(D.number)}</small></span>
      <span className="sc-timer">{s===0?'Ringing…':(t=>'0'+Math.floor(t/60)+':'+String(t%60).padStart(2,'0'))(Math.min(s,n)*9)}</span>
     </div>
     <div className="sc-lines">{A<[string,string]>(D.lines).map((l,i)=><div key={i} className={v(i+1)+' sc-line'+(l[0]==='c'?'':' is-ai')}><small>{l[0]==='c'?'Caller':'AI receptionist'}</small><span>{l[1]}</span></div>)}</div>
     <div className="sc-cards">
      <div className={v(5)+' sc-card sc-card-blue'}><span className="sc-label"><Icon name="calendar-check" size={13}/>Calendar</span><b>{S(D.slot)}</b><small>{S(D.slotWho)}</small></div>
      <div className={v(6)+' sc-card'}><span className="sc-label sc-label-grey"><Icon name="mail" size={13}/>Call summary sent</span><small>To {S(D.to)}</small><span>{S(D.summary)}</span></div>
     </div>
    </>}
    {type==='doc'&&<div className="sc-doc">
     <div className="sc-box">
      <div className="sc-box-head"><span className="sc-red"><Icon name="file-text" size={15}/></span><b>{S(D.file)}</b></div>
      <small className="sc-from">From {S(D.from)}</small>
      <dl className="sc-fields">{A<[string,string]>(D.fields).map(([k,val],i)=><div key={k} className={on(1)?'is-hl':''} style={{transitionDelay:i*140+'ms'}}><dt>{k}</dt><dd>{val}</dd></div>)}</dl>
     </div>
     <div className="sc-box">
      <div className="sc-box-head"><span className="sc-mini" style={{background:S(D.tile||'#0f9d58')}}>{ini(S(D.app||'GS'))}</span><b>{S(D.sheet)}</b></div>
      <div className="sc-row sc-row-head"><span>Name</span><span>Amount</span><span>Due</span></div>
      <div className="sc-row sc-row-old"><span>Previous entry</span><span>—</span><span>—</span></div>
      <div className={v(2)+' sc-row sc-row-new'}>{A<string>(D.row).map(c=><span key={c}>{c}</span>)}</div>
      <div className={v(3)+' sc-ok'}><Icon name="check-circle-2" size={15}/>{S(D.approve)}</div>
     </div>
    </div>}
    {type==='score'&&<>
     <div className="sc-cols"><span>Process</span><span>Hours saved · impact</span></div>
     <div className="sc-stack">{A<[string,number,string]>(D.items).map((it,i)=>{const pick=i<Number(D.pick||3)&&on(2);return <div key={it[0]} className={'sc-score'+(pick?' is-pick':'')}>
      <div><b>{it[0]}</b><span style={{opacity:on(1)?1:0}}>{it[2]}</span></div>
      <span className="sc-track"><i style={{width:on(1)?it[1]+'%':'0%',transitionDelay:i*120+'ms'}}/></span>
     </div>})}</div>
     <div className={v(3)+' sc-short'}><span className="sc-label"><Icon name="flag" size={13}/>Pilot shortlist</span><div>{A<[string]>(D.items).slice(0,Number(D.pick||3)).map(i=><span key={i[0]}>{i[0]}</span>)}</div></div>
    </>}
    {type==='chat'&&<div className="sc-wa">
     <div className="sc-wa-head"><Icon name="chevron-left" size={16}/><span className="sc-wa-av">{ini(S(D.who||'RD'))}</span><span className="sc-who"><b>{S(D.who)}</b><small>Business account</small></span></div>
     <div className="sc-wa-canvas">
      <div className={v(1)+' sc-wa-in'}>{S(D.q)}</div>
      {s===2&&<span className="sc-wa-typing"><i/><i/><i/></span>}
      <div className={v(3)+' sc-wa-out'}>{S(D.a)}<span><Icon name="link" size={11}/>Source: {S(D.src)}</span></div>
     </div>
     <div className="sc-wa-foot"><small>{on(4)?'Reception notified · full chat attached':'Replies only from approved sources'}</small><span className={'sc-hand'+(on(4)?' is-on':'')}><Icon name="user-round" size={13}/>{S(D.hand)}</span></div>
    </div>}
    {type==='agent'&&<>
     <ol className="sc-agent">{A<[string,string,string]>(D.steps).map((x,i,all)=>{const last=i===all.length-1,wait=last&&on(i+1);return <li key={x[1]} className={v(i+1)}>
      <span className="sc-agent-rail"><span className={'sc-agent-icon'+(wait?' is-wait':'')}><Icon name={x[0]} size={15}/></span>{!last&&<i/>}</span>
      <span className="sc-agent-text"><span><b>{x[1]}</b><em className={wait?'is-wait':''}>{wait?'Human check':'Done'}</em></span><small>{x[2]}</small></span>
     </li>})}</ol>
     <div className="sc-log">{A<string>(D.log).map((t,i)=><div key={t} style={{opacity:on(i+1)?1:.15}}>› {t}</div>)}</div>
    </>}
    {type==='playbook'&&<>
     <div className="sc-hours"><span>Hours saved per week</span><b>{Math.round(Number(D.hours||10)*Math.min(s,A(D.cards).length)/Math.max(A(D.cards).length,1))}</b></div>
     <div className="sc-play">{A<[string,string]>(D.cards).map((c,i)=><div key={c[0]} className={v(i+1)}><em className={'sc-type-'+c[1].toLowerCase()}>{c[1]}</em><b>{c[0]}</b></div>)}</div>
    </>}
    {type==='crm'&&<>
     <div className="sc-box">
      <div className="sc-deal"><small>Deal</small><b>{S(D.deal)}</b>
       <div className="sc-stages">{A<string>(D.stages).map((g,i)=>{const lit=on(1)?i<=Number(D.stage??1):i===0;return <span key={g} className={lit?'is-on':''}><i/>{g}</span>})}</div>
      </div>
      <div className="sc-crm-fields">{A<[string,string]>(D.fields).map(([k,val],i)=><div key={k}><small>{k}</small><span style={{opacity:on(i+1)?1:0}}>{val}</span></div>)}</div>
     </div>
     <div className={v(5)+' sc-note'}><Icon name="clipboard-list" size={15}/>{S(D.note)}</div>
    </>}
    {type==='helpdesk'&&<>
     <div className="sc-stack">{A<[string,string,string,string]>(D.tickets).map((t,i)=>{const u=t[3]==='urgent';return <div key={t[0]} className={v(i+1)+' sc-ticket'+(u&&on(4)?' is-urgent':'')}><small>{t[0]}</small><span>{t[1]}</span><em className={u?'is-red':''}>{t[2]}</em></div>})}</div>
     <div className={v(4)+' sc-urgent'}>
      <span className="sc-label sc-label-red"><Icon name="alert-triangle" size={13}/>Urgent · {S(D.open)}</span>
      <p>AI draft: “{S(D.draft)}”</p>
      <div><span className={'sc-hand is-on'+(on(4)&&!on(5)&&!reduced?' is-pulse':'')}><Icon name="user-round" size={13}/>{S(D.hand)}</span><small style={{opacity:on(5)?1:0}}>{S(D.who)}</small></div>
     </div>
    </>}
    {type==='slack'&&<div className="sc-slack">
     <div className="sc-slack-side"><b>Your team</b><span># general</span><span className="is-on"># {S(D.channel)}</span><span># sales</span></div>
     <div className="sc-slack-main">
      <b className="sc-slack-ch"># {S(D.channel)}</b>
      <div className={v(1)+' sc-slack-msg'}><span className="sc-slack-av">NS</span><span><b>{S(D.user)}</b><span>{S(D.q)}</span></span></div>
      <div className={v(2)+' sc-slack-msg'}><span className="sc-slack-av is-bot"><Icon name="bot" size={15}/></span><span><b>{S(D.bot)} <small>APP</small></b><span>{S(D.a)}</span><em><Icon name="book-open" size={11}/>{S(D.src)}</em></span></div>
      <div className={v(3)+' sc-slack-react'}><span><Icon name="thumbs-up" size={11}/>1</span><small>Answered in 4 sec</small></div>
     </div>
    </div>}
    {type==='compare'&&<>
     <div className="sc-srcs" style={{opacity:on(2)?.45:1}}>
      <span style={{transform:'rotate(-2deg)'}}><span className="sc-red"><Icon name="file-text" size={14}/></span>{S(D.pdf)}</span>
      <span style={{transform:'rotate(1.5deg)'}}><Icon name="mail" size={14}/>{S(D.email)}</span>
      <span className="sc-down" style={{opacity:on(1)?1:0}}><Icon name="arrow-down" size={16}/></span>
     </div>
     <div className="sc-box">
      <div className="sc-cmp sc-cmp-head">{A<string>(D.head).map(h=><span key={h}>{h}</span>)}</div>
      {A<string[]>(D.rows).map((r,i)=><div key={r[0]} className={v(i+2)+' sc-cmp'+(on(5)&&i===Number(D.best)?' is-best':'')}>{r.map(c=><span key={c}>{c}</span>)}</div>)}
     </div>
     <div className={v(5)+' sc-ok'}><Icon name="badge-check" size={15}/>{A<string[]>(D.rows)[Number(D.best)]?.[0]} · {S(D.bestLabel||'Best value')}</div>
    </>}
    {type==='planner'&&<>
     <div className="sc-days">{A<string>(D.days).map((d,i)=>{const posts=A<[number,string,string]>(D.posts);const pi=posts.findIndex(p=>p[0]===i),p=posts[pi];const sch=on(4);return <div key={d}>
      <small>{d}</small>
      <div className="sc-day">{p&&<div className={v(pi+1)+' sc-post'}>
       <span className={'sc-net sc-net-'+p[1].toLowerCase()}><Icon name={p[1].toLowerCase()} size={11}/>{p[1]}</span>
       <i/>
       <span>{p[2]}</span>
       <em className={sch?'is-on':''}>{sch?'Scheduled':'Draft'}</em>
      </div>}</div>
     </div>})}</div>
     <div className={v(4)+' sc-note'}><Icon name="calendar-check" size={15}/>{S(D.status)}</div>
    </>}
   </div>
   <div className="sc-foot">
    <span>Illustration, no real data</span>
    <span className="sc-dots">{Array.from({length:Math.min(n,6)},(_,i)=><i key={i} className={s>=i+1?'is-on':''}/>)}</span>
   </div>
  </div>
 );
}
