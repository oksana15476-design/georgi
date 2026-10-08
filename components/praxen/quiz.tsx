'use client';
import {useRef,useState} from 'react';
import {base} from '@/lib/base';
import {contacts} from '@/lib/contacts';
import {prices} from '@/lib/pricing';
import {getAttribution,track} from '@/components/analytics';
import {Icon} from './icon';
import type {X} from './types';

const fmt=(n:number)=>String(n).replace(/\B(?=(\d{3})+(?!\d))/g,'\u00a0');

// "Mini audit in 2 minutes": four one-tap questions, an instant recommendation built from the
// answers and the current tariffs, then an optional contact that goes to /api/leads like the form.
export function Quiz({x}:{x:X}){
 const {c,s,lang}=x;
 const questions:[string,string[]][]=[
  [c('Чем занимается ваша компания?','What does your company do?','რას საქმიანობს თქვენი კომპანია?'),[c('Отель, туризм','Hotel, tourism','სასტუმრო, ტურიზმი'),c('Клиника','Clinic','კლინიკა'),c('Недвижимость, застройщик','Real estate, developer','უძრავი ქონება, დეველოპერი'),c('Торговля','Retail','ვაჭრობა'),c('Услуги, B2B','Services, B2B','მომსახურება, B2B'),c('Другое','Other','სხვა')]],
  [c('Что отнимает больше всего времени?','What takes up the most time?','რა გართმევთ ყველაზე მეტ დროს?'),[c('Ответы клиентам в мессенджерах','Replying to customers in messengers','მომხმარებლებთან მიმოწერა მესენჯერებში'),c('Заявки и CRM','Leads and CRM','მოთხოვნები და CRM'),c('Документы и отчёты','Documents and reports','დოკუმენტები და ანგარიშები'),c('Вопросы и обучение сотрудников','Staff questions and training','თანამშრომლების კითხვები და სწავლება')]],
  [c('Сколько обращений или заявок в месяц?','How many requests or leads a month?','რამდენი მოთხოვნაა თვეში?'),[c('До 300','Up to 300','300-მდე'),'300–1 000','1 000–3 000',c('Больше 3 000','Over 3,000','3 000-ზე მეტი')]],
  [c('Когда вы теряете клиентов?','When do you lose customers?','როდის კარგავთ მომხმარებლებს?'),[c('Ночью и в выходные','At night and at weekends','ღამით და შაბათ-კვირას'),c('Долго отвечаем днём','Slow replies during the day','დღისით გვიან ვპასუხობთ'),c('Заявки теряются между менеджерами','Leads get lost between managers','მოთხოვნები იკარგება მენეჯერებს შორის'),c('Не знаю, хочу разобраться','Not sure, want to find out','არ ვიცი, მინდა გავარკვიო')]],
 ];
 const scenarios:[string,string][]=[
  [c('ИИ-ассистент в WhatsApp, Telegram и на сайте','AI assistant on WhatsApp, Telegram and your website','AI ასისტენტი WhatsApp-ში, Telegram-სა და საიტზე'),c('Отвечает клиентам за секунды на трёх языках и передаёт менеджеру готовые заявки.','Replies in seconds in three languages and hands managers ready leads.','პასუხობს წამებში სამ ენაზე და მენეჯერს მზა მოთხოვნებს გადასცემს.')],
  [c('ИИ-агент для заявок и CRM','AI agent for leads and CRM','AI აგენტი მოთხოვნებისა და CRM-ისთვის'),c('Разбирает обращения, заполняет amoCRM или Bitrix24 и напоминает менеджерам о задачах.','Sorts enquiries, fills in amoCRM or Bitrix24 and reminds managers of tasks.','არჩევს მოთხოვნებს, ავსებს amoCRM-ს ან Bitrix24-ს და მენეჯერებს ამოცანებს ახსენებს.')],
  [c('ИИ для документов и отчётов','AI for documents and reports','AI დოკუმენტებისა და ანგარიშებისთვის'),c('Читает счета и договоры, переносит данные в учётную систему и готовит отчёты.','Reads invoices and contracts, moves the data into your systems and prepares reports.','კითხულობს ინვოისებსა და ხელშეკრულებებს, მონაცემებს სისტემაში გადააქვს და ამზადებს ანგარიშებს.')],
  [c('Обучение команды и внутренний ИИ-помощник','Team training and an internal AI helper','გუნდის სწავლება და შიდა AI დამხმარე'),c('Учим сотрудников работать с ИИ, помощник отвечает им по вашим регламентам.','We teach staff to use AI; the helper answers from your policies.','ვასწავლით თანამშრომლებს AI-ს, დამხმარე კი თქვენი რეგლამენტებით პასუხობს.')],
 ];
 const gains=[c('Отвечает круглосуточно — ночные заявки не теряются.','Replies 24/7, so night leads are not lost.','პასუხობს 24/7 — ღამის მოთხოვნები არ იკარგება.'),c('Клиент получает ответ за секунды.','Customers get an answer in seconds.','კლიენტი პასუხს წამებში იღებს.'),c('Каждая заявка — в CRM с ответственным.','Every lead goes to the CRM with an owner.','ყოველი მოთხოვნა — CRM-ში პასუხისმგებლით.'),c('На аудите найдём, где теряются заявки.','The audit will show where leads are lost.','აუდიტი გაჩვენებთ, სად იკარგება მოთხოვნები.')];

 const [step,setStep]=useState(0),[answers,setAnswers]=useState<number[]>([]);
 const [method,setMethod]=useState<'whatsapp'|'telegram'>('whatsapp'),[contact,setContact]=useState(''),[website,setWebsite]=useState('');
 const [status,setStatus]=useState<''|'invalid'|'error'>(''),[sending,setSending]=useState(false),[done,setDone]=useState(false);
 const head=useRef<HTMLDivElement>(null);
 const total=questions.length,finished=step>=total;

 const pick=(i:number)=>{
  if(step===0&&!answers.length)track('quiz_start');
  const next=[...answers.slice(0,step),i];setAnswers(next);
  if(step+1>=total)track('quiz_complete',{industry:questions[0][1][next[0]],task:questions[1][1][next[1]]});
  setStep(step+1);requestAnimationFrame(()=>head.current?.focus({preventScroll:true}));
 };
 const restart=()=>{setStep(0);setAnswers([]);setDone(false);setStatus('');setContact('')};

 const task=answers[1]??0,training=task===3,big=answers[2]===3;
 const plan=training
  ?c('Обучение команды — от ','Team training from ','გუნდის სწავლება — ')+fmt(prices.training.gel)+'\u00a0₾'+c(', от 1 недели.',', from 1 week.','-დან, 1 კვირიდან.')
  :c('Внедрение инструментов — от ','Tool implementation from ','ინსტრუმენტების დანერგვა — ')+fmt(prices.implementation.gel)+'\u00a0₾'+c(', пилот 2–4 недели.',', 2–4 week pilot.','-დან, პილოტი 2–4 კვირა.');
 const answerText=questions.map(([q,o],i)=>q+' '+(o[answers[i]]??'')).join('; ');
 const waText=c('Здравствуйте! Прошёл мини-аудит на сайте Praxen AI. ','Hello! I took the mini audit on the Praxen AI site. ','გამარჯობა! Praxen AI-ს საიტზე მინი-აუდიტი გავიარე. ')+questions.map(([,o],i)=>o[answers[i]]).join(', ')+c('. Хочу обсудить результат.','. I would like to discuss the result.','. მინდა შედეგის განხილვა.');

 const change=(v:string)=>{setStatus('');setContact(method==='telegram'?v.replace(/\s/g,''):v.replace(/[^\d+\s()-]/g,''))};
 const submit=async(e:React.FormEvent)=>{
  e.preventDefault();if(sending)return;
  const digits=contact.replace(/\D/g,'');
  const ok=method==='whatsapp'?digits.length>=7&&digits.length<=15:/^@?[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(contact)||/^\+[0-9]{7,15}$/.test(contact.replace(/[\s()-]/g,''));
  if(!ok){setStatus('invalid');track('form_error',{reason:'invalid_contact',form:'quiz'});return}
  setSending(true);setStatus('');
  try{
   const r=await fetch(base+'/api/leads',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({contact:method+': '+contact.trim(),message:c('Мини-аудит: ','Mini audit: ','მინი-აუდიტი: ')+answerText,context:c('Квиз: ','Quiz: ','ქვიზი: ')+scenarios[task][0],tasks:questions.map(([,o],i)=>o[answers[i]]),lang,page:location.pathname,source:getAttribution(),website})});
   if(!r.ok)throw new Error();
   setDone(true);track('generate_lead',{method,form:'quiz',page:location.pathname});
  }catch{setStatus('error');track('form_error',{reason:'send_failed',form:'quiz'})}
  finally{setSending(false)}
 };

 return (
  <section id="quiz" className="band-white quiz-band" data-screen-label="Quiz">
  <div className="wrap sec quiz-layout">
   <div data-reveal="" className="quiz-intro">
    <h2 className="h2">{c('С чего начать внедрение ИИ у вас?','Where should your company start with AI?','საიდან დაიწყოს თქვენმა კომპანიამ AI?')}</h2>
    <p className="lead">{c('Ответьте на 4 вопроса — покажем первый сценарий, формат и цену. Это займёт 2 минуты.','Answer 4 questions to see your first scenario, format and price. It takes 2 minutes.','უპასუხეთ 4 კითხვას — გაჩვენებთ პირველ სცენარს, ფორმატსა და ფასს. 2 წუთი.')}</p>
    <ul className="quiz-gets">
     <li><Icon name="target" size={18}/>{c('Сценарий под вашу сферу','A scenario for your industry','სცენარი თქვენი სფეროსთვის')}</li>
     <li><Icon name="wallet" size={18}/>{c('Формат и стоимость по тарифам','Format and price from our tariffs','ფორმატი და ფასი ტარიფებით')}</li>
     <li><Icon name="check" size={18}/>{c('Результат сразу, контакт — по желанию','Instant result, contact only if you want','შედეგი მაშინვე, კონტაქტი — სურვილისამებრ')}</li>
    </ul>
   </div>
   <div data-reveal="" className="quiz">
    {!finished?<div className="quiz-step" key={step}>
     <div className="quiz-progress" aria-hidden="true"><i style={{width:((step+1)/total*100)+'%'}}/></div>
     <div ref={head} tabIndex={-1} className="quiz-head"><small>{c('Вопрос ','Question ','კითხვა ')+(step+1)+c(' из ',' of ',' / ')+total}</small><h3>{questions[step][0]}</h3></div>
     <div role="group" aria-label={questions[step][0]} className="quiz-options">{questions[step][1].map((o,i)=><button key={o} type="button" onClick={()=>pick(i)} aria-pressed={answers[step]===i} className={'quiz-option'+(answers[step]===i?' is-on':'')}><span>{o}</span><Icon name="arrow-right" size={16}/></button>)}</div>
     {step>0&&<button type="button" onClick={()=>setStep(step-1)} className="ulink ulink-muted quiz-back"><Icon name="arrow-left" size={16}/>{c('Назад','Back','უკან')}</button>}
    </div>:
    <div className="quiz-result fade-in">
     <div ref={head} tabIndex={-1} className="quiz-head" aria-live="polite"><small>{c('Ваш первый сценарий','Your first scenario','თქვენი პირველი სცენარი')}</small><h3>{scenarios[task][0]}</h3></div>
     <p>{scenarios[task][1]}</p>
     <ul className="quiz-points">
      <li><Icon name="check" size={16}/>{gains[answers[3]??3]}</li>
      <li><Icon name="check" size={16}/>{plan}</li>
      {big&&!training&&<li><Icon name="check" size={16}/>{c('При таком объёме возможна разработка — от ','At this volume, custom development from ','ასეთ მოცულობაზე შესაძლოა შემუშავება — ')+fmt(prices.development.gel)+'\u00a0₾'+c('.','.','-დან.')}</li>}
     </ul>
     {done?<div role="status" className="quiz-done"><span className="done-icon"><Icon name="check" size={22}/></span><div><b>{s.successTitle}</b><p>{s.successBody}</p></div></div>:
     <form onSubmit={submit} noValidate className="quiz-form">
      <b>{c('Обсудим на бесплатном аудите. Куда написать?','Discuss it in a free audit. Where do we message you?','განვიხილოთ უფასო აუდიტზე. სად მოგწეროთ?')}</b>
      <div role="radiogroup" aria-label={s.howContact} className="methods">{([['whatsapp','WhatsApp'],['telegram','Telegram']] as const).map(([k,lb])=><button key={k} type="button" role="radio" aria-checked={method===k} onClick={()=>{setMethod(k);setContact('');setStatus('')}} className={method===k?'is-on':''}>{lb}</button>)}</div>
      <div className="quiz-row">
       <input name="contact" value={contact} onChange={e=>change(e.target.value)} aria-label={method==='telegram'?'Telegram':'WhatsApp'} placeholder={method==='telegram'?'@username / +995…':'+995 5XX XXX XXX'} inputMode={method==='whatsapp'?'tel':'text'} autoComplete={method==='whatsapp'?'tel':'off'} aria-invalid={status==='invalid'} className={status==='invalid'?'is-invalid':''}/>
       <button type="submit" disabled={sending} className="btn btn-primary">{sending?s.sending:c('Отправить','Send','გაგზავნა')}<Icon name="arrow-right" size={16}/></button>
      </div>
      <input name="website" tabIndex={-1} aria-hidden="true" autoComplete="off" value={website} onChange={e=>setWebsite(e.target.value)} className="hp"/>
      {status&&<p role="alert" className="form-status"><Icon name="alert-circle" size={16}/>{status==='invalid'?s.invalidText:s.errorText}</p>}
      <div className="quiz-alt"><a href={contacts.whatsapp+'?text='+encodeURIComponent(waText)} target="_blank" rel="noopener" className="ulink"><Icon name="whatsapp" size={16}/>{c('Или напишите в WhatsApp','Or message us on WhatsApp','ან მოგვწერეთ WhatsApp-ში')}</a><button type="button" onClick={restart} className="ulink ulink-muted">{c('Пройти заново','Start over','თავიდან')}</button></div>
     </form>}
    </div>}
   </div>
  </div>
  </section>
 );
}
